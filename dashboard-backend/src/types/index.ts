// Project types
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

// Task types
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

export interface TaskLifecycleEvent {
  id: string;
  taskId: string;
  type: 'created' | 'assigned' | 'started' | 'submitted' | 'reviewed' | 'approved' | 'merged' | 'done';
  timestamp: string;
  agent?: string;
  data?: Record<string, unknown>;
}

// Commit types
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

// Agent types
export interface Agent {
  name: string;
  status: 'idle' | 'working' | 'blocked';
  currentTask?: string;
  sessionId?: string;
  contextSize?: number;
}

// WebSocket types
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

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

