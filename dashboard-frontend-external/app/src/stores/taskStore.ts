// ============================================================================
// Task Store - Zustand State Management with WebSocket Integration
// ============================================================================

import { create } from 'zustand';
import type { Task, TaskLifecycleEvent, TaskStatus } from '@/types';
import { tasksApi } from '@/lib/api';
import { subscribeToEvent, joinProject, leaveProject } from '@/lib/websocket';

interface TaskState {
  // State
  tasks: Task[];
  currentTask: Task | null;
  lifecycleEvents: TaskLifecycleEvent[];
  isLoading: boolean;
  error: string | null;
  subscribedProject: string | null; // "owner/repo"
  
  // Actions
  fetchTasks: (owner: string, repo: string) => Promise<void>;
  fetchTask: (owner: string, repo: string, taskId: string) => Promise<void>;
  fetchLifecycle: (owner: string, repo: string, taskId: string) => Promise<void>;
  setCurrentTask: (task: Task | null) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  subscribeToProject: (owner: string, repo: string) => void;
  unsubscribeFromProject: () => void;
  clearError: () => void;
}

// Store unsubscribe functions
let taskUpdateUnsubscribe: (() => void) | null = null;
let lifecycleUnsubscribe: (() => void) | null = null;

export const useTaskStore = create<TaskState>(
  (set, get) => ({
    // Initial state
    tasks: [],
    currentTask: null,
    lifecycleEvents: [],
    isLoading: false,
    error: null,
    subscribedProject: null,

    // Fetch all tasks for a project
    fetchTasks: async (owner: string, repo: string) => {
      set({ isLoading: true, error: null });
      try {
        const tasks = await tasksApi.list(owner, repo);
        set({ tasks, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch tasks',
          isLoading: false 
        });
      }
    },

    // Fetch single task
    fetchTask: async (owner: string, repo: string, taskId: string) => {
      set({ isLoading: true, error: null });
      try {
        const task = await tasksApi.get(owner, repo, taskId);
        set({ currentTask: task, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch task',
          isLoading: false 
        });
      }
    },

    // Fetch task lifecycle events
    fetchLifecycle: async (owner: string, repo: string, taskId: string) => {
      set({ isLoading: true, error: null });
      try {
        const events = await tasksApi.getLifecycle(owner, repo, taskId);
        set({ lifecycleEvents: events, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch lifecycle',
          isLoading: false 
        });
      }
    },

    // Set current task
    setCurrentTask: (task: Task | null) => {
      set({ currentTask: task, lifecycleEvents: [] });
    },

    // Update task status (from WebSocket)
    updateTaskStatus: (taskId: string, status: TaskStatus) => {
      set((state: TaskState) => ({
        tasks: state.tasks.map((t: Task) => 
          t.id === taskId ? { ...t, status } : t
        ),
        currentTask: state.currentTask?.id === taskId
          ? { ...state.currentTask, status }
          : state.currentTask,
      }));
    },

    // Subscribe to project WebSocket events
    subscribeToProject: (owner: string, repo: string) => {
      const projectKey = `${owner}/${repo}`;
      
      // Unsubscribe from previous project if different
      if (get().subscribedProject && get().subscribedProject !== projectKey) {
        get().unsubscribeFromProject();
      }

      // Already subscribed to this project
      if (get().subscribedProject === projectKey) {
        return;
      }

      // Join project room
      joinProject(owner, repo);

      // Subscribe to task updates
      taskUpdateUnsubscribe = subscribeToEvent<{ 
        taskId: string; 
        status: string; 
        data: unknown 
      }>('task:update', (data) => {
        set((state: TaskState) => ({
          tasks: state.tasks.map((t: Task) => 
            t.id === data.taskId 
              ? { ...t, status: data.status as TaskStatus } 
              : t
          ),
          currentTask: state.currentTask?.id === data.taskId
            ? { ...state.currentTask, status: data.status as TaskStatus }
            : state.currentTask,
        }));
      });

      // Subscribe to lifecycle events
      lifecycleUnsubscribe = subscribeToEvent<{
        taskId: string;
        events: TaskLifecycleEvent[];
      }>('task:lifecycle', (data) => {
        if (get().currentTask?.id === data.taskId) {
          set({ lifecycleEvents: data.events });
        }
      });

      set({ subscribedProject: projectKey });
    },

    // Unsubscribe from project WebSocket events
    unsubscribeFromProject: () => {
      const { subscribedProject } = get();
      if (subscribedProject) {
        const [owner, repo] = subscribedProject.split('/');
        leaveProject(owner, repo);
      }

      if (taskUpdateUnsubscribe) {
        taskUpdateUnsubscribe();
        taskUpdateUnsubscribe = null;
      }

      if (lifecycleUnsubscribe) {
        lifecycleUnsubscribe();
        lifecycleUnsubscribe = null;
      }

      set({ subscribedProject: null });
    },

    // Clear error
    clearError: () => {
      set({ error: null });
    },
  })
);
