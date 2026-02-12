// ============================================================================
// Agent Store - Zustand State Management with WebSocket Integration
// ============================================================================

import { create } from 'zustand';
import type { Agent, AgentStatus } from '@/types';
import { agentsApi } from '@/lib/api';
import { subscribeToEvent } from '@/lib/websocket';
import { mockAgents, isBackendConfigured } from '@/lib/mockData';
import { useSettingsStore } from '@/stores/settingsStore';

interface AgentState {
  // State
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  usingMockData: boolean;
  
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
    usingMockData: false,

    // Fetch agents for a project
    fetchAgents: async (owner: string, repo: string) => {
      const apiBaseUrl = useSettingsStore.getState().apiBaseUrl;
      if (!isBackendConfigured(apiBaseUrl)) {
        set({ agents: mockAgents, isLoading: false, error: null, usingMockData: true });
        return;
      }

      set({ isLoading: true, error: null });
      try {
        const agents = await agentsApi.list(owner, repo);
        set({ agents, isLoading: false, usingMockData: false });
      } catch (error) {
        console.debug('[AgentStore] API failed, falling back to mock data');
        set({ 
          agents: mockAgents,
          isLoading: false,
          error: null,
          usingMockData: true,
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
