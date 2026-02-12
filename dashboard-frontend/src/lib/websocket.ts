import { io, Socket } from 'socket.io-client';
import type { JoinProjectMessage, KimiChatMessage } from '@/types';

/**
 * WebSocket URL from environment variable or default
 */
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

/**
 * Create a WebSocket connection
 */
export function createSocket(): Socket {
  return io(WS_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });
}

/**
 * Join a project room
 */
export function joinProject(socket: Socket, owner: string, repo: string): void {
  const message: JoinProjectMessage = { owner, repo };
  socket.emit('join:project', message);
}

/**
 * Leave a project room
 */
export function leaveProject(socket: Socket, owner: string, repo: string): void {
  const message: JoinProjectMessage = { owner, repo };
  socket.emit('leave:project', message);
}

/**
 * Send a chat message to Kimi via WebSocket
 */
export function sendKimiChat(socket: Socket, message: string, context?: { project?: string; task?: string }): void {
  const chatMessage: KimiChatMessage = { message, context };
  socket.emit('kimi:chat', chatMessage);
}

