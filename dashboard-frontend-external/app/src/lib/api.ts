// ============================================================================
// API Client - HTTP Request Utilities
// ============================================================================

import type { 
  ApiResponse, 
  Project, 
  Task, 
  TaskLifecycleEvent, 
  Agent, 
  Commit, 
  FileContent,
  CreateProjectData,
  ProjectSettings
} from '@/types';
import { useSettingsStore } from '@/stores/settingsStore';

// Default base URL (fallback)
const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Get current API base URL from settings
const getApiBaseUrl = (): string => {
  try {
    const settings = useSettingsStore.getState();
    return settings?.apiBaseUrl || DEFAULT_API_BASE_URL;
  } catch {
    return DEFAULT_API_BASE_URL;
  }
};

// Custom error class for API errors
export class ApiError extends Error {
  statusCode?: number;
  response?: ApiResponse<unknown>;
  
  constructor(
    message: string,
    statusCode?: number,
    response?: ApiResponse<unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

// Generic API request function with error handling
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${getApiBaseUrl()}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    // Parse response body
    let data: ApiResponse<T>;
    try {
      data = await response.json();
    } catch {
      throw new ApiError('Invalid JSON response', response.status);
    }

    // Handle HTTP errors
    if (!response.ok) {
      throw new ApiError(
        data.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data
      );
    }

    // Handle API-level errors (success: false)
    if (!data.success) {
      throw new ApiError(data.error || 'API request failed', response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network error: Unable to connect to backend server');
    }
    
    throw new ApiError(error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================================================
// Projects API
// ============================================================================
export const projectsApi = {
  /**
   * List all monitored projects
   */
  list: async (): Promise<Project[]> => {
    const response = await apiRequest<Project[]>('/api/projects');
    return response.data || [];
  },

  /**
   * Get project details by owner/repo
   */
  get: async (owner: string, repo: string): Promise<Project> => {
    const response = await apiRequest<Project>(`/api/projects/${owner}/${repo}`);
    if (!response.data) {
      throw new ApiError('Project not found', 404);
    }
    return response.data;
  },

  /**
   * Add a new project
   */
  create: async (data: CreateProjectData): Promise<Project> => {
    const response = await apiRequest<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.data) {
      throw new ApiError('Failed to create project');
    }
    return response.data;
  },

  /**
   * Update project settings
   */
  updateSettings: async (
    owner: string, 
    repo: string, 
    settings: Partial<ProjectSettings>
  ): Promise<Project> => {
    const response = await apiRequest<Project>(`/api/projects/${owner}/${repo}`, {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    });
    if (!response.data) {
      throw new ApiError('Failed to update project settings');
    }
    return response.data;
  },

  /**
   * Remove a project
   */
  delete: async (owner: string, repo: string): Promise<void> => {
    await apiRequest<void>(`/api/projects/${owner}/${repo}`, {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// Repos API (GitHub repositories for Add Project)
// ============================================================================
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  html_url: string;
  description: string | null;
}

export const reposApi = {
  /**
   * List repositories (authenticated user's repos, or pass ?org= for org repos)
   */
  list: async (org?: string): Promise<GitHubRepo[]> => {
    const query = org ? `?org=${encodeURIComponent(org)}` : '';
    const response = await apiRequest<GitHubRepo[]>(`/api/repos${query}`);
    return response.data || [];
  },
};

// ============================================================================
// Tasks API
// ============================================================================
export const tasksApi = {
  /**
   * List all tasks for a project
   */
  list: async (owner: string, repo: string): Promise<Task[]> => {
    const response = await apiRequest<Task[]>(`/api/projects/${owner}/${repo}/tasks`);
    return response.data || [];
  },

  /**
   * Get task details
   */
  get: async (owner: string, repo: string, taskId: string): Promise<Task> => {
    const response = await apiRequest<Task>(`/api/projects/${owner}/${repo}/tasks/${taskId}`);
    if (!response.data) {
      throw new ApiError('Task not found', 404);
    }
    return response.data;
  },

  /**
   * Get task lifecycle events
   */
  getLifecycle: async (
    owner: string, 
    repo: string, 
    taskId: string
  ): Promise<TaskLifecycleEvent[]> => {
    const response = await apiRequest<TaskLifecycleEvent[]>(
      `/api/projects/${owner}/${repo}/tasks/${taskId}/lifecycle`
    );
    return response.data || [];
  },
};

// ============================================================================
// Agents API
// ============================================================================
export const agentsApi = {
  /**
   * List agent status for a project
   */
  list: async (owner: string, repo: string): Promise<Agent[]> => {
    const response = await apiRequest<Agent[]>(`/api/projects/${owner}/${repo}/agents`);
    return response.data || [];
  },
};

// ============================================================================
// Commits API
// ============================================================================
export const commitsApi = {
  /**
   * Get commit history
   */
  list: async (
    owner: string, 
    repo: string, 
    options?: { branch?: string; limit?: number }
  ): Promise<Commit[]> => {
    const params = new URLSearchParams();
    if (options?.branch) params.append('branch', options.branch);
    if (options?.limit) params.append('limit', options.limit.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiRequest<Commit[]>(
      `/api/projects/${owner}/${repo}/commits${query}`
    );
    return response.data || [];
  },

  /**
   * Get single commit details
   */
  get: async (owner: string, repo: string, sha: string): Promise<Commit> => {
    const response = await apiRequest<Commit>(
      `/api/projects/${owner}/${repo}/commits/${sha}`
    );
    if (!response.data) {
      throw new ApiError('Commit not found', 404);
    }
    return response.data;
  },
};

// ============================================================================
// Files API
// ============================================================================
export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size: number;
  sha: string;
  url: string;
}

export const filesApi = {
  /**
   * Get file content from repository
   */
  get: async (
    owner: string, 
    repo: string, 
    path: string, 
    ref?: string
  ): Promise<FileContent> => {
    const params = new URLSearchParams();
    if (ref) params.append('ref', ref);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiRequest<FileContent>(
      `/api/projects/${owner}/${repo}/files/${path}${query}`
    );
    if (!response.data) {
      throw new ApiError('File not found', 404);
    }
    return response.data;
  },

  /**
   * List directory contents
   * Note: This endpoint may not be implemented in backend, 
   * falls back to empty array if not available
   */
  listDirectory: async (
    owner: string,
    repo: string,
    path: string
  ): Promise<FileItem[]> => {
    try {
      // Try to fetch directory listing
      // Backend may return directory listing for paths ending in /
      const response = await apiRequest<FileItem[]>(
        `/api/projects/${owner}/${repo}/files/${path}${path ? '/' : ''}`
      );
      return response.data || [];
    } catch {
      // If endpoint doesn't exist, return empty array
      // In production, this would be implemented in backend
      return [];
    }
  },
};

// ============================================================================
// Kimi Chat API
// ============================================================================
export const kimiApi = {
  /**
   * Send chat message to Kimi
   */
  chat: async (
    message: string, 
    context?: { project?: string; task?: string }
  ): Promise<string> => {
    const response = await apiRequest<{ response: string }>('/api/kimi/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
    
    if (!response.data) {
      throw new ApiError('Failed to get response from Kimi');
    }
    
    return response.data.response;
  },
};

// ============================================================================
// Health Check
// ============================================================================
export const healthApi = {
  /**
   * Check backend health
   */
  check: async (): Promise<{ status: string; timestamp: string; uptime: number }> => {
    const response = await fetch(`${getApiBaseUrl()}/health`);
    if (!response.ok) {
      throw new ApiError('Backend is not responding');
    }
    return response.json();
  },
};
