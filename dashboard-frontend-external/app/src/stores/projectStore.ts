// ============================================================================
// Project Store - Zustand State Management
// ============================================================================

import { create } from 'zustand';
import type { Project, CreateProjectData } from '@/types';
import { projectsApi } from '@/lib/api';

interface ProjectState {
  // State
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  
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

    // Fetch all projects
    fetchProjects: async () => {
      set({ isLoading: true, error: null });
      try {
        const projects = await projectsApi.list();
        set({ projects, isLoading: false });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch projects',
          isLoading: false 
        });
      }
    },

    // Fetch single project
    fetchProject: async (owner: string, repo: string) => {
      set({ isLoading: true, error: null });
      try {
        const project = await projectsApi.get(owner, repo);
        set({ currentProject: project, isLoading: false });
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
