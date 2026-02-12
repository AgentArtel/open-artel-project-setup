// ============================================================================
// Application Constants
// ============================================================================

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

// Default Values
export const DEFAULT_REFRESH_INTERVAL = 30;
export const DEFAULT_PROJECT_VIEW = 'dashboard';
export const DEFAULT_COMMIT_LIMIT = 50;

// WebSocket Configuration
export const WS_RECONNECT_INTERVAL = 3000; // Initial reconnect interval (ms)
export const WS_MAX_RECONNECT_INTERVAL = 30000; // Max reconnect interval (ms)
export const WS_RECONNECT_MULTIPLIER = 1.5; // Exponential backoff multiplier

// UI Constants
export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_COLLAPSED = '4rem';

// Priority Options
export const PRIORITY_OPTIONS = ['P0', 'P1', 'P2', 'P3', 'P4'];

// Task Type Options
export const TASK_TYPE_OPTIONS = [
  'feature',
  'bugfix',
  'refactor',
  'docs',
  'test',
  'chore',
];

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'open-artel-theme',
  SIDEBAR_COLLAPSED: 'open-artel-sidebar-collapsed',
  LAST_PROJECT: 'open-artel-last-project',
};
