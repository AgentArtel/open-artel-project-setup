// ============================================================================
// useApi Hook - API Request with Loading and Error States
// ============================================================================

import { useState, useCallback } from 'react';
import { ApiError } from '@/lib/api';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiReturn<T, P extends unknown[]> extends UseApiState<T> {
  execute: (...params: P) => Promise<T | null>;
  reset: () => void;
}

/**
 * Generic hook for API requests with loading and error states
 */
export function useApi<T, P extends unknown[] = unknown[]>(
  apiFunction: (...params: P) => Promise<T>
): UseApiReturn<T, P> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const data = await apiFunction(...params);
        setState({ data, isLoading: false, error: null });
        return data;
      } catch (error) {
        const errorMessage = 
          error instanceof ApiError 
            ? error.message 
            : error instanceof Error 
              ? error.message 
              : 'An unknown error occurred';
        
        setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for API requests that don't need parameters
 */
export function useApiSimple<T>(
  apiFunction: () => Promise<T>
): UseApiReturn<T, []> {
  return useApi<T, []>(apiFunction);
}
