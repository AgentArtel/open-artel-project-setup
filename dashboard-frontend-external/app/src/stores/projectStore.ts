// ============================================================================
// Project Store - Zustand State Management
// ============================================================================

import { create } from 'zustand';
import type { Project, CreateProjectData } from '@/types';
import { projectsApi } from '@/lib/api';
import { mockProjects, isBackendConfigured } from '@/lib/mockData';
import { useSettingsStore } from '@/stores/settingsStore';

interface ProjectState {
  // State
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  usingMockData: boolean;
  
  // Actions
  fetchProjects: () => Promise<void>;
  fetchProject: (owner: string, repo: string) => Promise<void>;
  createProject: (data: CreateProjectData) => Promise<Project>;
  deleteProject: (owner: string, repo: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>(
  (set) => ({
    // Initial state
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null,
    usingMockData: false,

    // Fetch all projects
    fetchProjects: async () => {
      const apiBaseUrl = useSettingsStore.getState().apiBaseUrl;
      if (!isBackendConfigured(apiBaseUrl)) {
        set({ projects: mockProjects, isLoading: false, error: null, usingMockData: true });
        return;
      }

      set({ isLoading: true, error: null });
      try {
        const projects = await projectsApi.list();
        set({ projects, isLoading: false, usingMockData: false });
      } catch {
        console.debug('[ProjectStore] API failed, falling back to mock data');
        set({ 
          projects: mockProjects,
          isLoading: false,
          error: null,
          usingMockData: true,
        });
      }
    },

    // Fetch single project
    fetchProject: async (owner: string, repo: string) => {
      const apiBaseUrl = useSettingsStore.getState().apiBaseUrl;
      if (!isBackendConfigured(apiBaseUrl)) {
        const mock = mockProjects.find(p => p.owner === owner && p.repo === repo);
        set({ currentProject: mock || null, isLoading: false, usingMockData: true });
        return;
      }

      set({ isLoading: true, error: null });
      try {
        const project = await projectsApi.get(owner, repo);
        set({ currentProject: project, isLoading: false, usingMockData: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch project',
          isLoading: false 
        });
      }
    },

    // Create new project
    createProject: async (data: CreateProjectData) => {
      set({ isLoading: true, error: null });
      try {
        const project = await projectsApi.create(data);
        set((state: ProjectState) => ({ 
          projects: [...state.projects, project],
          isLoading: false 
        }));
        return project;
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to create project',
          isLoading: false 
        });
        throw error;
      }
    },

    // Delete project
    deleteProject: async (owner: string, repo: string) => {
      set({ isLoading: true, error: null });
      try {
        await projectsApi.delete(owner, repo);
        set((state: ProjectState) => ({ 
          projects: state.projects.filter(p => p.fullName !== `${owner}/${repo}`),
          currentProject: state.currentProject?.fullName === `${owner}/${repo}` 
            ? null 
            : state.currentProject,
          isLoading: false 
        }));
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to delete project',
          isLoading: false 
        });
        throw error;
      }
    },

    // Set current project
    setCurrentProject: (project: Project | null) => {
      set({ currentProject: project });
    },

    // Clear error
    clearError: () => {
      set({ error: null });
    },
  })
);
