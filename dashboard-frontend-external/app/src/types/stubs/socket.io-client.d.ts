// Stub type definitions for socket.io-client
declare module 'socket.io-client' {
  export interface Socket {
    id?: string;
    connected: boolean;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback?: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
    join(room: string): void;
    leave(room: string): void;
    close(): void;
    disconnect(): void;
    removeAllListeners(event?: string): void;
  }
  
  export interface ManagerOptions {
    transports?: string[];
    reconnection?: boolean;
  }
  
  export function io(url: string, options?: ManagerOptions): Socket;
  export default io;
}
