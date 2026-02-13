import { Server, Socket } from 'socket.io';
import { JoinProjectMessage, KimiChatMessage } from '../types';
import { config } from '../config';
import axios from 'axios';

export function setupWebSocketHandlers(socket: Socket, io: Server): void {
  // Join project room
  socket.on('join:project', (data: JoinProjectMessage) => {
    const { owner, repo } = data;
    const room = `project:${owner}/${repo}`;
    socket.join(room);
    console.log(`📥 Client ${socket.id} joined room: ${room}`);
    
    socket.emit('joined:project', {
      owner,
      repo,
      room,
    });
  });
  
  // Leave project room
  socket.on('leave:project', (data: JoinProjectMessage) => {
    const { owner, repo } = data;
    const room = `project:${owner}/${repo}`;
    socket.leave(room);
    console.log(`📤 Client ${socket.id} left room: ${room}`);
  });
  
  const projectRoom = (data: { owner?: string; repo?: string }): string | null => {
    if (data.owner && data.repo) return `project:${data.owner}/${data.repo}`;
    return null;
  };
  const broadcast = (event: string, data: unknown) => {
    const room = projectRoom(data as { owner?: string; repo?: string });
    if (room) io.to(room).emit(event, data);
    else io.emit(event, data);
  };

  // Task update (server -> client), scoped to project room when owner/repo in payload
  socket.on(
    'task:update',
    (data: { owner?: string; repo?: string; taskId: string; status: string; data: unknown }) => {
      broadcast('task:update', data);
    }
  );

  // Commit new (server -> client)
  socket.on(
    'commit:new',
    (data: { owner?: string; repo?: string; sha: string; message: string; author: string }) => {
      broadcast('commit:new', data);
    }
  );

  // Task lifecycle event (server -> client)
  socket.on(
    'task:lifecycle',
    (data: { owner?: string; repo?: string; taskId: string; events: unknown[] }) => {
      broadcast('task:lifecycle', data);
    }
  );

  // Agent status update (server -> client)
  socket.on(
    'agent:status',
    (data: { owner?: string; repo?: string; agent: string; status: string; task?: string }) => {
      broadcast('agent:status', data);
    }
  );
  
  // Kimi chat (client -> server -> Kimi API -> client) with streaming
  socket.on('kimi:chat', async (data: KimiChatMessage) => {
    if (!config.kimi.apiKey) {
      socket.emit('kimi:stream', {
        chunk: '',
        done: true,
      });
      socket.emit('kimi:error', { error: 'Kimi API key not configured' });
      return;
    }

    const systemContent =
      'You are a helpful assistant for the Open Artel Dashboard project.';
    const contextParts: string[] = [];
    if (data.context?.project) contextParts.push(`Project: ${data.context.project}`);
    if (data.context?.task) contextParts.push(`Task: ${data.context.task}`);
    const contextBlock =
      contextParts.length > 0
        ? `\n\nCurrent context:\n${contextParts.join('\n')}`
        : '';

    try {
      const response = await axios({
        method: 'POST',
        url: `${config.kimi.baseUrl}/chat/completions`,
        data: {
          model: 'moonshot-v1-8k',
          messages: [
            { role: 'system', content: systemContent + contextBlock },
            { role: 'user', content: data.message },
          ],
          stream: true,
        },
        headers: {
          Authorization: `Bearer ${config.kimi.apiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'stream',
      });

      let buffer = '';
      let streamDone = false;
      const emitDone = () => {
        if (streamDone) return;
        streamDone = true;
        socket.emit('kimi:stream', { chunk: '', done: true });
      };

      response.data.on('data', (chunk: Buffer) => {
        if (streamDone) return;
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const payload = trimmed.slice(6);
            if (payload === '[DONE]') {
              emitDone();
              return;
            }
            try {
              const parsed = JSON.parse(payload);
              const content = parsed?.choices?.[0]?.delta?.content;
              if (typeof content === 'string' && content) {
                socket.emit('kimi:stream', { chunk: content, done: false });
              }
            } catch {
              // ignore parse errors for non-content lines
            }
          }
        }
      });
      response.data.on('end', () => {
        if (streamDone) return;
        if (buffer.trim()) {
          const trimmed = buffer.trim();
          if (trimmed.startsWith('data: ') && trimmed.slice(6) !== '[DONE]') {
            try {
              const parsed = JSON.parse(trimmed.slice(6));
              const content = parsed?.choices?.[0]?.delta?.content;
              if (typeof content === 'string' && content) {
                socket.emit('kimi:stream', { chunk: content, done: false });
              }
            } catch {
              // ignore
            }
          }
        }
        emitDone();
      });
      response.data.on('error', (err: Error) => {
        console.error('Kimi stream error:', err);
        emitDone();
        socket.emit('kimi:error', { error: 'Stream error' });
      });
    } catch (error) {
      console.error('Kimi API error:', error);
      socket.emit('kimi:stream', { chunk: '', done: true });
      socket.emit('kimi:error', {
        error:
          error && typeof error === 'object' && 'response' in error
            ? (error as { response?: { data?: unknown } }).response?.data
              ? String((error as { response: { data: unknown } }).response.data)
              : 'Failed to communicate with Kimi API'
            : 'Failed to communicate with Kimi API',
      });
    }
  });
}

