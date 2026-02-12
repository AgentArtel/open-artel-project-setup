// ============================================================================
// Agent Store - Zustand State Management with WebSocket Integration
// ============================================================================

import { create } from 'zustand';
import type { Agent, AgentStatus } from '@/types';
import { agentsApi } from '@/lib/api';
import { subscribeToEvent } from '@/lib/websocket';

interface AgentState {
  // State
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAgents: (owner: string, repo: string) => Promise<void>;
  updateAgentStatus: (agentName: string, status: AgentStatus, task?: string) => void;
  subscribeToUpdates: () => void;
  clearError: () => void;
}

export const useAgentStore = create<AgentState>(
  (set) => ({
    // Initial state
    agents: [],
    isLoading: false,
    error: null,

    // Fetch agents for a project
    fetchAgents: async (owner: string, repo: string) => {
      set({ isLoading: true, error: null });
      try {
        const agents = await agentsApi.list(owner, repo);
        set({ agents, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch agents',
          isLoading: false 
        });
      }
    },

    // Update agent status (from WebSocket)
    updateAgentStatus: (agentName: string, status: AgentStatus, task?: string) => {
      set((state: AgentState) => ({
        agents: state.agents.map((a: Agent) => 
          a.name.toLowerCase() === agentName.toLowerCase()
            ? { ...a, status, currentTask: task }
            : a
        ),
      }));
    },

    // Subscribe to agent status WebSocket events
    subscribeToUpdates: () => {
      subscribeToEvent<{ 
        agent: string; 
        status: string; 
        task?: string 
      }>('agent:status', (data) => {
        set((state: AgentState) => ({
          agents: state.agents.map((a: Agent) => 
            a.name.toLowerCase() === data.agent.toLowerCase()
              ? { 
                  ...a, 
                  status: data.status as AgentStatus, 
                  currentTask: data.task 
                }
              : a
          ),
        }));
      });
    },

    // Clear error
    clearError: () => {
      set({ error: null });
    },
  })
);
