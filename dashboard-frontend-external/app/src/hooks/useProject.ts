// ============================================================================
// useProject Hook - Project Data Management
// ============================================================================

import { useEffect, useCallback } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import type { CreateProjectData } from '@/types';

interface UseProjectReturn {
  projects: import('@/types').Project[];
  currentProject: import('@/types').Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProject: (owner: string, repo: string) => Promise<void>;
  createProject: (data: CreateProjectData) => Promise<void>;
  deleteProject: (owner: string, repo: string) => Promise<void>;
  setCurrentProject: (project: import('@/types').Project | null) => void;
  clearError: () => void;
}

/**
 * Hook to manage project data
 */
export function useProject(): UseProjectReturn {
  const store = useProjectStore();

  // Fetch projects on mount
  useEffect(() => {
    if (store.projects.length === 0) {
      store.fetchProjects();
    }
  }, []);

  const createProject = useCallback(
    async (data: CreateProjectData) => {
      await store.createProject(data);
    },
    [store]
  );

  const deleteProject = useCallback(
    async (owner: string, repo: string) => {
      await store.deleteProject(owner, repo);
    },
    [store]
  );

  return {
    projects: store.projects,
    currentProject: store.currentProject,
    isLoading: store.isLoading,
    error: store.error,
    fetchProjects: store.fetchProjects,
    fetchProject: store.fetchProject,
    createProject,
    deleteProject,
    setCurrentProject: store.setCurrentProject,
    clearError: store.clearError,
  };
}
