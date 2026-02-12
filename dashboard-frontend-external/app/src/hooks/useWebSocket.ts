// ============================================================================
// useWebSocket Hook - WebSocket Connection State Management
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import type { WebSocketConnectionState } from '@/types';
import { 
  initializeSocket, 
  closeSocket, 
  subscribeToConnectionState,
  joinProject,
  leaveProject 
} from '@/lib/websocket';

interface UseWebSocketReturn {
  connected: boolean;
  reconnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
}

/**
 * Hook to manage WebSocket connection state
 */
export function useWebSocket(): UseWebSocketReturn {
  const [state, setState] = useState<WebSocketConnectionState>({
    connected: false,
    reconnecting: false,
    error: null,
  });

  useEffect(() => {
    // Subscribe to connection state changes
    const unsubscribe = subscribeToConnectionState((newState) => {
      setState(newState);
    });

    // Initialize socket on mount
    initializeSocket();

    return () => {
      unsubscribe();
    };
  }, []);

  const connect = useCallback(() => {
    initializeSocket();
  }, []);

  const disconnect = useCallback(() => {
    closeSocket();
    setState({ connected: false, reconnecting: false, error: null });
  }, []);

  return {
    connected: state.connected,
    reconnecting: state.reconnecting,
    error: state.error,
    connect,
    disconnect,
  };
}

interface UseProjectWebSocketReturn extends UseWebSocketReturn {
  joinProject: (owner: string, repo: string) => void;
  leaveProject: (owner: string, repo: string) => void;
}

/**
 * Hook to manage WebSocket connection with project room support
 */
export function useProjectWebSocket(): UseProjectWebSocketReturn {
  const base = useWebSocket();

  const handleJoinProject = useCallback((owner: string, repo: string) => {
    joinProject(owner, repo);
  }, []);

  const handleLeaveProject = useCallback((owner: string, repo: string) => {
    leaveProject(owner, repo);
  }, []);

  return {
    ...base,
    joinProject: handleJoinProject,
    leaveProject: handleLeaveProject,
  };
}
