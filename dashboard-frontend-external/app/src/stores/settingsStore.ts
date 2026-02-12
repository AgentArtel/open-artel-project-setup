// ============================================================================
// Settings Store - Application Configuration with Persistence
// ============================================================================

import { create } from 'zustand';

export interface SettingsState {
  // Connection Settings
  apiBaseUrl: string;
  wsUrl: string;
  
  // API Keys (stored masked)
  githubToken: string;
  kimiApiKey: string;
  
  // Appearance
  theme: 'light' | 'dark' | 'system';
  uiStyle: 'classic' | 'clawlens';
  
  // Project Defaults
  defaultRefreshInterval: number;
  defaultView: 'dashboard' | 'tasks' | 'agents' | 'commits' | 'files';
  notifications: boolean;
  
  // WebSocket Settings
  wsReconnectInterval: number;
  wsMaxReconnectInterval: number;
  
  // Health Status
  backendHealth: {
    status: 'healthy' | 'unhealthy' | 'unknown';
    timestamp?: string;
    uptime?: number;
    lastChecked?: Date;
  };
  
  // Actions
  updateSettings: (updates: Partial<SettingsState>) => void;
  updateApiBaseUrl: (url: string) => void;
  updateWsUrl: (url: string) => void;
  updateGithubToken: (token: string) => void;
  updateKimiApiKey: (key: string) => void;
  updateTheme: (theme: 'light' | 'dark' | 'system') => void;
  updateUiStyle: (style: 'classic' | 'clawlens') => void;
  updateBackendHealth: (health: SettingsState['backendHealth']) => void;
  resetToDefaults: () => void;
  
  // Getters for masked values
  getMaskedGithubToken: () => string;
  getMaskedKimiApiKey: () => string;
  hasGithubToken: () => boolean;
  hasKimiApiKey: () => boolean;
}

// Default settings
const defaultSettings = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
  githubToken: '',
  kimiApiKey: '',
  theme: 'system' as const,
  uiStyle: 'classic' as const,
  defaultRefreshInterval: 30,
  defaultView: 'tasks' as const,
  notifications: true,
  wsReconnectInterval: 3000,
  wsMaxReconnectInterval: 30000,
  backendHealth: {
    status: 'unknown' as const,
  },
};

// Load settings from localStorage
const loadSettings = (): Partial<SettingsState> => {
  try {
    const stored = localStorage.getItem('open-artel-settings');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.warn('Failed to load settings from localStorage');
  }
  return {};
};

// Save settings to localStorage
const saveSettings = (settings: Partial<SettingsState>) => {
  try {
    localStorage.setItem('open-artel-settings', JSON.stringify(settings));
  } catch {
    console.warn('Failed to save settings to localStorage');
  }
};

export const useSettingsStore = create<SettingsState>(
  (set, get) => ({
    // Merge defaults with stored settings
    ...defaultSettings,
    ...loadSettings(),

    // Update multiple settings at once
    updateSettings: (updates) => {
      set((state) => {
        const newState = { ...state, ...updates };
        saveSettings({
          apiBaseUrl: newState.apiBaseUrl,
          wsUrl: newState.wsUrl,
          githubToken: newState.githubToken,
          kimiApiKey: newState.kimiApiKey,
          theme: newState.theme,
          uiStyle: newState.uiStyle,
          defaultRefreshInterval: newState.defaultRefreshInterval,
          defaultView: newState.defaultView,
          notifications: newState.notifications,
          wsReconnectInterval: newState.wsReconnectInterval,
          wsMaxReconnectInterval: newState.wsMaxReconnectInterval,
        });
        return newState;
      });
    },

    // Update individual settings
    updateApiBaseUrl: (url) => {
      get().updateSettings({ apiBaseUrl: url });
    },

    updateWsUrl: (url) => {
      get().updateSettings({ wsUrl: url });
    },

    updateGithubToken: (token) => {
      get().updateSettings({ githubToken: token });
    },

    updateKimiApiKey: (key) => {
      get().updateSettings({ kimiApiKey: key });
    },

    updateTheme: (theme) => {
      get().updateSettings({ theme });
    },

    updateUiStyle: (style) => {
      get().updateSettings({ uiStyle: style });
    },

    updateBackendHealth: (health) => {
      set((state) => ({
        backendHealth: {
          ...state.backendHealth,
          ...health,
          lastChecked: new Date(),
        },
      }));
    },

    // Reset to defaults
    resetToDefaults: () => {
      set(defaultSettings);
      saveSettings(defaultSettings);
    },

    // Getters for masked values
    getMaskedGithubToken: () => {
      const token = get().githubToken;
      if (!token) return '';
      if (token.length <= 8) return '••••••••';
      return `${token.slice(0, 4)}••••••••${token.slice(-4)}`;
    },

    getMaskedKimiApiKey: () => {
      const key = get().kimiApiKey;
      if (!key) return '';
      if (key.length <= 8) return '••••••••';
      return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
    },

    hasGithubToken: () => !!get().githubToken,
    hasKimiApiKey: () => !!get().kimiApiKey,
  })
);

// Subscribe to settings changes and save to localStorage
useSettingsStore.subscribe((state) => {
  saveSettings({
    apiBaseUrl: state.apiBaseUrl,
    wsUrl: state.wsUrl,
    githubToken: state.githubToken,
    kimiApiKey: state.kimiApiKey,
    theme: state.theme,
    uiStyle: state.uiStyle,
    defaultRefreshInterval: state.defaultRefreshInterval,
    defaultView: state.defaultView,
    notifications: state.notifications,
    wsReconnectInterval: state.wsReconnectInterval,
    wsMaxReconnectInterval: state.wsMaxReconnectInterval,
  });
});
