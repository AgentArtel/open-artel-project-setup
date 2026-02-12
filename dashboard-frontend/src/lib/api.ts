import type { ApiResponse } from '@/types';

/**
 * Base URL for API requests
 * Uses environment variable or defaults to localhost:3001
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * API request options
 */
interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Make an API request with type-safe response handling
 * 
 * @param endpoint - API endpoint (e.g., '/api/projects')
 * @param options - Request options (method, body, params, etc.)
 * @returns Promise with typed ApiResponse
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options;

  // Build URL with query parameters
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Set default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Parse JSON response
    const data: ApiResponse<T> = await response.json();

    // If the response indicates failure, return it as-is
    // The caller can check data.success to handle errors
    return data;
  } catch (error) {
    // Network errors or JSON parsing errors
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean>) =>
    apiRequest<T>(endpoint, { method: 'GET', params }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: unknown, params?: Record<string, string | number | boolean>) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      params,
    }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, params?: Record<string, string | number | boolean>) =>
    apiRequest<T>(endpoint, { method: 'DELETE', params }),
};

