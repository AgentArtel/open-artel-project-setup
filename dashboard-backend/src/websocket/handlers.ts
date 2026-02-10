import { Server, Socket } from 'socket.io';
import { JoinProjectMessage, KimiChatMessage } from '../types';

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
  
  // Task update (server -> client)
  socket.on('task:update', (data: { taskId: string; status: string; data: unknown }) => {
    // Broadcast to all clients in the project room
    // TODO: Determine project from taskId
    io.emit('task:update', data);
  });
  
  // Commit new (server -> client)
  socket.on('commit:new', (data: { sha: string; message: string; author: string }) => {
    // Broadcast to all clients
    io.emit('commit:new', data);
  });
  
  // Task lifecycle event (server -> client)
  socket.on('task:lifecycle', (data: { taskId: string; events: unknown[] }) => {
    // Broadcast to all clients in the project room
    io.emit('task:lifecycle', data);
  });
  
  // Agent status update (server -> client)
  socket.on('agent:status', (data: { agent: string; status: string; task?: string }) => {
    // Broadcast to all clients
    io.emit('agent:status', data);
  });
  
  // Kimi chat (client -> server -> Kimi API -> client)
  socket.on('kimi:chat', async (data: KimiChatMessage) => {
    // TODO: Implement Kimi API proxy with streaming
    // For now, just echo back
    socket.emit('kimi:stream', {
      chunk: `Echo: ${data.message}`,
      done: true,
    });
  });
}

