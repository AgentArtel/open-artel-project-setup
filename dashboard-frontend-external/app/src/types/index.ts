// ============================================================================
// Type Definitions - Mirroring Backend Types
// Keep in sync with dashboard-backend/src/types/index.ts
// ============================================================================

// ----------------------------------------------------------------------------
// Project Types
// ----------------------------------------------------------------------------
export interface Project {
  id: string;
  name: string;
  fullName: string; // owner/repo
  owner: string;
  repo: string;
  url: string;
  isLocal: boolean;
  localPath?: string;
  settings: ProjectSettings;
}

export interface ProjectSettings {
  refreshInterval: number;
  defaultView: string;
  notifications: boolean;
}

export interface CreateProjectData {
  owner: string;
  repo: string;
  url?: string;
  isLocal?: boolean;
  localPath?: string;
  settings?: Partial<ProjectSettings>;
}

// ----------------------------------------------------------------------------
// Task Types
// ----------------------------------------------------------------------------
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assigned?: string;
  priority: string;
  type: string;
  dependsOn: string[];
  blocks: string[];
  objective: string;
  specifications: string;
  acceptanceCriteria: string[];
  doNot: string[];
  handoffNotes?: string;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'BLOCKED';

export const TaskStatusColors: Record<TaskStatus, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  REVIEW: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  DONE: 'bg-green-500/10 text-green-500 border-green-500/20',
  BLOCKED: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export const TaskStatusLabels: Record<TaskStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  DONE: 'Done',
  BLOCKED: 'Blocked',
};

export interface TaskLifecycleEvent {
  id: string;
  taskId: string;
  type: 'created' | 'assigned' | 'started' | 'submitted' | 'reviewed' | 'approved' | 'merged' | 'done';
  timestamp: string;
  agent?: string;
  data?: Record<string, unknown>;
}

// ----------------------------------------------------------------------------
// Agent Types
// ----------------------------------------------------------------------------
export type AgentStatus = 'idle' | 'working' | 'blocked';

export interface Agent {
  name: string;
  status: AgentStatus;
  currentTask?: string;
  sessionId?: string;
  contextSize?: number;
}

export const AgentStatusColors: Record<AgentStatus, string> = {
  idle: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  working: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  blocked: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export const AgentStatusLabels: Record<AgentStatus, string> = {
  idle: 'Idle',
  working: 'Working',
  blocked: 'Blocked',
};

export const DefaultAgents = ['claude', 'cursor', 'lovable', 'kimi'];

// ----------------------------------------------------------------------------
// Commit Types
// ----------------------------------------------------------------------------
export interface Commit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  url: string;
  files?: string[];
  parsed?: ParsedCommit;
}

export interface ParsedCommit {
  raw: string;
  agent?: string;
  action?: string;
  task?: string;
  description: string;
  isRoutingHeader: boolean;
}

// ----------------------------------------------------------------------------
// WebSocket Types
// ----------------------------------------------------------------------------
export interface WebSocketMessage {
  type: string;
  data: unknown;
}

export interface JoinProjectMessage {
  owner: string;
  repo: string;
}

export interface KimiChatMessage {
  message: string;
  context?: {
    project?: string;
    task?: string;
  };
}

export interface KimiStreamResponse {
  chunk: string;
  done: boolean;
}

// ----------------------------------------------------------------------------
// API Response Types
// ----------------------------------------------------------------------------
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ----------------------------------------------------------------------------
// Frontend-Specific Types
// ----------------------------------------------------------------------------
export interface FilterState {
  status?: TaskStatus[];
  priority?: string[];
  assigned?: string[];
  type?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface WebSocketConnectionState {
  connected: boolean;
  reconnecting: boolean;
  error: string | null;
}

export interface FileContent {
  path: string;
  content: string;
}

export interface PriorityColors {
  [key: string]: string;
}

export const PriorityColors: Record<string, string> = {
  P0: 'bg-red-500/10 text-red-500 border-red-500/20',
  P1: 'bg-red-500/10 text-red-500 border-red-500/20',
  P2: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  P3: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  P4: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};
