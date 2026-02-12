// ============================================================================
// Chat Store - Zustand State Management for Kimi Chat
// ============================================================================

import { create } from 'zustand';
import type { ChatMessage } from '@/types';
import { kimiApi } from '@/lib/api';
import { sendKimiChat, subscribeToEvent } from '@/lib/websocket';
import { generateId } from '@/lib/utils';

interface ChatContext {
  project?: string;
  task?: string;
}

interface ChatState {
  // State
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  streamContent: string;
  error: string | null;
  context: ChatContext;
  
  // Actions
  sendMessage: (content: string) => Promise<void>;
  sendMessageStream: (content: string) => void;
  setContext: (context: ChatContext) => void;
  clearMessages: () => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>(
  (set, get) => ({
    // Initial state
    messages: [],
    isLoading: false,
    isStreaming: false,
    streamContent: '',
    error: null,
    context: {},

    // Send message via REST API (non-streaming)
    sendMessage: async (content: string) => {
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      set((state: ChatState) => ({
        messages: [...state.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
        const response = await kimiApi.chat(content, get().context);
        
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };

        set((state: ChatState) => ({
          messages: [...state.messages, assistantMessage],
          isLoading: false,
        }));
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to send message',
          isLoading: false 
        });
      }
    },

    // Send message via WebSocket (streaming)
    sendMessageStream: (content: string) => {
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      set((state: ChatState) => ({
        messages: [...state.messages, userMessage],
        isStreaming: true,
        streamContent: '',
        error: null,
      }));

      // Subscribe to streaming responses
      const unsubscribe = subscribeToEvent<{ chunk: string; done: boolean }>(
        'kimi:stream',
        (data) => {
          if (data.done) {
            // Stream complete, add assistant message
            set((state: ChatState) => {
              const assistantMessage: ChatMessage = {
                id: generateId(),
                role: 'assistant',
                content: state.streamContent,
                timestamp: new Date(),
              };
              return {
                messages: [...state.messages, assistantMessage],
                isStreaming: false,
                streamContent: '',
              };
            });
            unsubscribe();
          } else {
            // Append chunk to stream content
            set((state: ChatState) => ({
              streamContent: state.streamContent + data.chunk,
            }));
          }
        }
      );

      // Send message via WebSocket
      sendKimiChat({
        message: content,
        context: get().context,
      });
    },

    // Set chat context
    setContext: (context: ChatContext) => {
      set({ context });
    },

    // Clear all messages
    clearMessages: () => {
      set({ messages: [], streamContent: '' });
    },

    // Clear error
    clearError: () => {
      set({ error: null });
    },
  })
);
