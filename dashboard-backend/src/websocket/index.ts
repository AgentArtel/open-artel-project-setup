import { Server } from 'socket.io';
import { setupWebSocketHandlers } from './handlers';

export function setupWebSocket(io: Server): void {
  console.log('📡 WebSocket server initialized');
  
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);
    
    setupWebSocketHandlers(socket, io);
    
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
}

