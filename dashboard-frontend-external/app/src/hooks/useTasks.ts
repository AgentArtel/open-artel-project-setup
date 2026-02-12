// ============================================================================
// useTasks Hook - Task Data Management with WebSocket Integration
// ============================================================================

import { useEffect, useCallback } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import type { Task, TaskStatus } from '@/types';

interface UseTasksOptions {
  owner?: string;
  repo?: string;
  subscribe?: boolean;
}

interface UseTasksReturn {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchTask: (taskId: string) => Promise<void>;
  setCurrentTask: (task: Task | null) => void;
  filterByStatus: (status: TaskStatus) => Task[];
  filterByPriority: (priority: string) => Task[];
  filterByAssigned: (assigned: string) => Task[];
  clearError: () => void;
}

/**
 * Hook to manage task data for a project
 */
export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const { owner, repo, subscribe = true } = options;
  const store = useTaskStore();

  // Fetch tasks when owner/repo changes
  useEffect(() => {
    if (owner && repo) {
      store.fetchTasks(owner, repo);
      
      // Subscribe to WebSocket updates
      if (subscribe) {
        store.subscribeToProject(owner, repo);
      }

      return () => {
        if (subscribe) {
          store.unsubscribeFromProject();
        }
      };
    }
  }, [owner, repo, subscribe]);

  const fetchTasks = useCallback(async () => {
    if (owner && repo) {
      await store.fetchTasks(owner, repo);
    }
  }, [owner, repo, store]);

  const fetchTask = useCallback(
    async (taskId: string) => {
      if (owner && repo) {
        await store.fetchTask(owner, repo, taskId);
      }
    },
    [owner, repo, store]
  );

  // Filter functions
  const filterByStatus = useCallback(
    (status: TaskStatus) => {
      return store.tasks.filter((t: Task) => t.status === status);
    },
    [store.tasks]
  );

  const filterByPriority = useCallback(
    (priority: string) => {
      return store.tasks.filter((t: Task) => t.priority === priority);
    },
    [store.tasks]
  );

  const filterByAssigned = useCallback(
    (assigned: string) => {
      return store.tasks.filter(
        (t: Task) => t.assigned?.toLowerCase() === assigned.toLowerCase()
      );
    },
    [store.tasks]
  );

  return {
    tasks: store.tasks,
    currentTask: store.currentTask,
    isLoading: store.isLoading,
    error: store.error,
    fetchTasks,
    fetchTask,
    setCurrentTask: store.setCurrentTask,
    filterByStatus,
    filterByPriority,
    filterByAssigned,
    clearError: store.clearError,
  };
}

interface UseTaskDetailOptions {
  owner?: string;
  repo?: string;
  taskId?: string;
}

interface UseTaskDetailReturn {
  task: Task | null;
  lifecycleEvents: import('@/types').TaskLifecycleEvent[];
  isLoading: boolean;
  error: string | null;
  fetchTask: () => Promise<void>;
  fetchLifecycle: () => Promise<void>;
}

/**
 * Hook to manage a single task with lifecycle events
 */
export function useTaskDetail(options: UseTaskDetailOptions = {}): UseTaskDetailReturn {
  const { owner, repo, taskId } = options;
  const store = useTaskStore();

  // Fetch task when taskId changes
  useEffect(() => {
    if (owner && repo && taskId) {
      store.fetchTask(owner, repo, taskId);
    }
  }, [owner, repo, taskId]);

  const fetchTask = useCallback(async () => {
    if (owner && repo && taskId) {
      await store.fetchTask(owner, repo, taskId);
    }
  }, [owner, repo, taskId, store]);

  const fetchLifecycle = useCallback(async () => {
    if (owner && repo && taskId) {
      await store.fetchLifecycle(owner, repo, taskId);
    }
  }, [owner, repo, taskId, store]);

  return {
    task: store.currentTask,
    lifecycleEvents: store.lifecycleEvents,
    isLoading: store.isLoading,
    error: store.error,
    fetchTask,
    fetchLifecycle,
  };
}
