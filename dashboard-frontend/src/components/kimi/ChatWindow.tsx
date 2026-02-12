import { useState, useEffect } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { sendKimiChat } from '@/lib/websocket';
import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';
import { StreamingDisplay } from './StreamingDisplay';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Card } from '../common/Card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  availableProjects?: Array<{ owner: string; repo: string; name: string }>;
  availableTasks?: Array<{ id: string; title: string }>;
}

export function ChatWindow({ availableProjects = [], availableTasks = [] }: ChatWindowProps) {
  const { socket } = useWebSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStreaming, setCurrentStreaming] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleStream = (data: { chunk: string; done: boolean }) => {
      if (data.done) {
        // Finalize the streaming message
        if (currentStreaming) {
          setMessages(prev => [
            ...prev,
            {
              id: `msg-${Date.now()}`,
              role: 'assistant',
              content: currentStreaming,
              timestamp: new Date(),
            },
          ]);
          setCurrentStreaming('');
          setIsStreaming(false);
          setIsLoading(false);
        }
      } else {
        // Append chunk to streaming content
        setCurrentStreaming(prev => prev + data.chunk);
        setIsStreaming(true);
      }
    };

    socket.on('kimi:stream', handleStream);

    return () => {
      socket.off('kimi:stream', handleStream);
    };
  }, [socket, currentStreaming]);

  const handleSend = (message: string, context?: { project?: string; task?: string }) => {
    if (!socket) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Send to Kimi via WebSocket
    sendKimiChat(socket, message, context);
  };

  return (
    <Card className="flex flex-col h-[400px] sm:h-[500px] lg:h-[600px]">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Kimi Chat</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatHistory messages={messages} />
          {isStreaming && currentStreaming && (
            <div className="px-4 pb-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <StreamingDisplay content={currentStreaming} isStreaming={isStreaming} />
              </div>
            </div>
          )}
          {isLoading && !isStreaming && (
            <div className="flex justify-center items-center p-4">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading || isStreaming}
          availableProjects={availableProjects}
          availableTasks={availableTasks}
        />
      </div>
    </Card>
  );
}

