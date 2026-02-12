// ============================================================================
// WebSocket Client - Socket.io with Exponential Backoff Reconnection
// ============================================================================

import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { 
  KimiChatMessage, 
  KimiStreamResponse,
  WebSocketConnectionState 
} from '@/types';
import { useSettingsStore } from '@/stores/settingsStore';

// Default values (fallback)
const DEFAULT_WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
const WS_RECONNECT_INTERVAL = 3000;
const WS_MAX_RECONNECT_INTERVAL = 30000;
const WS_RECONNECT_MULTIPLIER = 1.5;

// Get current WebSocket URL from settings
const getWsUrl = (): string => {
  try {
    const settings = useSettingsStore.getState();
    return settings?.wsUrl || DEFAULT_WS_URL;
  } catch {
    return DEFAULT_WS_URL;
  }
};

// Get WebSocket settings from store
const getWsSettings = () => {
  try {
    const settings = useSettingsStore.getState();
    return {
      reconnectInterval: settings?.wsReconnectInterval || WS_RECONNECT_INTERVAL,
      maxReconnectInterval: settings?.wsMaxReconnectInterval || WS_MAX_RECONNECT_INTERVAL,
    };
  } catch {
    return {
      reconnectInterval: WS_RECONNECT_INTERVAL,
      maxReconnectInterval: WS_MAX_RECONNECT_INTERVAL,
    };
  }
};

// Connection state
let socket: Socket | null = null;
let reconnectAttempts = 0;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let currentReconnectInterval = WS_RECONNECT_INTERVAL;

// Callbacks for connection state changes
const connectionListeners: Set<(state: WebSocketConnectionState) => void> = new Set();

// Event handlers registry
const eventHandlers: Map<string, Set<(data: unknown) => void>> = new Map();

/**
 * Notify all connection listeners of state change
 */
function notifyConnectionState(state: WebSocketConnectionState): void {
  connectionListeners.forEach(listener => listener(state));
}

/**
 * Get current connection state
 */
export function getConnectionState(): WebSocketConnectionState {
  return {
    connected: socket?.connected ?? false,
    reconnecting: reconnectTimer !== null,
    error: null,
  };
}

/**
 * Subscribe to connection state changes
 */
export function subscribeToConnectionState(
  callback: (state: WebSocketConnectionState) => void
): () => void {
  connectionListeners.add(callback);
  // Immediately notify with current state
  callback(getConnectionState());
  
  return () => {
    connectionListeners.delete(callback);
  };
}

/**
 * Calculate next reconnect interval with exponential backoff
 */
function getNextReconnectInterval(): number {
  const { maxReconnectInterval } = getWsSettings();
  const next = Math.min(
    currentReconnectInterval * WS_RECONNECT_MULTIPLIER,
    maxReconnectInterval
  );
  currentReconnectInterval = next;
  return next;
}

/**
 * Reset reconnect interval after successful connection
 */
function resetReconnectInterval(): void {
  const { reconnectInterval } = getWsSettings();
  reconnectAttempts = 0;
  currentReconnectInterval = reconnectInterval;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

/**
 * Schedule reconnection attempt
 */
function scheduleReconnect(): void {
  if (reconnectTimer) return; // Already scheduled
  
  reconnectAttempts++;
  const delay = getNextReconnectInterval();
  
  notifyConnectionState({
    connected: false,
    reconnecting: true,
    error: `Reconnecting in ${Math.round(delay / 1000)}s... (attempt ${reconnectAttempts})`,
  });
  
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    initializeSocket();
  }, delay);
}

/**
 * Initialize Socket.io connection
 */
export function initializeSocket(): Socket {
  if (socket?.connected) {
    return socket;
  }

  // Clean up existing socket
  if (socket) {
    socket.removeAllListeners();
    socket.close();
  }

  socket = io(getWsUrl(), {
    transports: ['websocket'],
    reconnection: false, // We handle reconnection manually for better control
  });

  // Connection established
  socket.on('connect', () => {
    console.log('✅ WebSocket connected:', socket?.id);
    resetReconnectInterval();
    notifyConnectionState({ connected: true, reconnecting: false, error: null });
    
    // Re-register all event handlers
    eventHandlers.forEach((handlers, event) => {
      handlers.forEach(handler => {
        socket?.on(event, handler);
      });
    });
  });

  // Connection lost
  socket.on('disconnect', (reason: string) => {
    console.log('❌ WebSocket disconnected:', reason);
    notifyConnectionState({ 
      connected: false, 
      reconnecting: false, 
      error: `Disconnected: ${reason}` 
    });
    
    // Auto-reconnect unless manually disconnected
    if (reason !== 'io client disconnect') {
      scheduleReconnect();
    }
  });

  // Connection error
  socket.on('connect_error', (error: Error) => {
    console.error('WebSocket connection error:', error.message);
    notifyConnectionState({ 
      connected: false, 
      reconnecting: false, 
      error: `Connection error: ${error.message}` 
    });
    scheduleReconnect();
  });

  return socket;
}

/**
 * Get the socket instance (initializes if needed)
 */
export function getSocket(): Socket {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
}

/**
 * Close socket connection
 */
export function closeSocket(): void {
  resetReconnectInterval();
  if (socket) {
    socket.close();
    socket = null;
  }
}

/**
 * Subscribe to a WebSocket event
 */
export function subscribeToEvent<T>(
  event: string, 
  callback: (data: T) => void
): () => void {
  // Add to handlers registry
  if (!eventHandlers.has(event)) {
    eventHandlers.set(event, new Set());
  }
  eventHandlers.get(event)!.add(callback as (data: unknown) => void);
  
  // Register with socket if connected
  const sock = getSocket();
  sock.on(event, callback as (data: unknown) => void);
  
  // Return unsubscribe function
  return () => {
    eventHandlers.get(event)?.delete(callback as (data: unknown) => void);
    sock.off(event, callback as (data: unknown) => void);
  };
}

// ============================================================================
// Project Room Management
// ============================================================================

/**
 * Join a project room for real-time updates
 */
export function joinProject(owner: string, repo: string): void {
  const sock = getSocket();
  if (sock.connected) {
    sock.emit('join:project', { owner, repo });
  } else {
    // Queue join until connected
    const unsubscribe = subscribeToConnectionState((state) => {
      if (state.connected) {
        sock.emit('join:project', { owner, repo });
        unsubscribe();
      }
    });
  }
}

/**
 * Leave a project room
 */
export function leaveProject(owner: string, repo: string): void {
  const sock = getSocket();
  if (sock.connected) {
    sock.emit('leave:project', { owner, repo });
  }
}

// ============================================================================
// Event-Specific Subscriptions
// ============================================================================

/**
 * Subscribe to task updates
 */
export function onTaskUpdate(
  callback: (data: { taskId: string; status: string; data: unknown }) => void
): () => void {
  return subscribeToEvent('task:update', callback);
}

/**
 * Subscribe to new commits
 */
export function onCommitNew(
  callback: (data: { sha: string; message: string; author: string }) => void
): () => void {
  return subscribeToEvent('commit:new', callback);
}

/**
 * Subscribe to task lifecycle events
 */
export function onTaskLifecycle(
  callback: (data: { taskId: string; events: unknown[] }) => void
): () => void {
  return subscribeToEvent('task:lifecycle', callback);
}

/**
 * Subscribe to agent status updates
 */
export function onAgentStatus(
  callback: (data: { agent: string; status: string; task?: string }) => void
): () => void {
  return subscribeToEvent('agent:status', callback);
}

/**
 * Subscribe to Kimi streaming responses
 */
export function onKimiStream(
  callback: (data: KimiStreamResponse) => void
): () => void {
  return subscribeToEvent('kimi:stream', callback);
}

/**
 * Subscribe to room join confirmation
 */
export function onJoinedProject(
  callback: (data: { owner: string; repo: string; room: string }) => void
): () => void {
  return subscribeToEvent('joined:project', callback);
}

// ============================================================================
// Kimi Chat via WebSocket
// ============================================================================

/**
 * Send chat message to Kimi via WebSocket (streaming)
 */
export function sendKimiChat(message: KimiChatMessage): void {
  const sock = getSocket();
  sock.emit('kimi:chat', message);
}
