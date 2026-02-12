# Backend API Analysis Report

**Date**: 2026-02-10  
**Analyzed By**: Frontend Project Manager  
**Backend Location**: `dashboard-backend/`

## Overview

The Open Artel Dashboard Backend is a Node.js/Express server with WebSocket support (Socket.io) that provides:
- REST API endpoints for projects, tasks, agents, commits, files, and Kimi chat
- WebSocket server for real-time updates
- GitHub API integration via Octokit
- Kimi API proxy for chat functionality

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express 4.18.2
- **WebSocket**: Socket.io 4.7.2
- **GitHub API**: @octokit/rest 20.0.2
- **HTTP Client**: axios 1.6.2
- **Markdown**: marked 11.1.1
- **Language**: TypeScript 5.9.3

## Server Configuration

- **Default Port**: 3001
- **Default CORS Origin**: http://localhost:5173 (Vite default)
- **Health Check**: `GET /health`

## API Endpoints

### Projects (`/api/projects`)

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| GET | `/api/projects` | List all monitored projects | - | `ApiResponse<Project[]>` |
| GET | `/api/projects/:owner/:repo` | Get project details | - | `ApiResponse<Project>` |
| POST | `/api/projects` | Add new project | `{ owner, repo, url?, isLocal?, localPath?, settings? }` | `ApiResponse<Project>` |
| DELETE | `/api/projects/:owner/:repo` | Remove project | - | `ApiResponse<void>` |

### Tasks (`/api/projects/:owner/:repo/tasks`)

| Method | Path | Description | Query Params | Response |
|--------|------|-------------|--------------|----------|
| GET | `/api/projects/:owner/:repo/tasks` | List all tasks | - | `ApiResponse<Task[]>` |
| GET | `/api/projects/:owner/:repo/tasks/:taskId` | Get task details | - | `ApiResponse<Task>` |
| GET | `/api/projects/:owner/:repo/tasks/:taskId/lifecycle` | Get task lifecycle events | - | `ApiResponse<TaskLifecycleEvent[]>` |

### Agents (`/api/projects/:owner/:repo/agents`)

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/api/projects/:owner/:repo/agents` | List agent status | `ApiResponse<Agent[]>` |

### Commits (`/api/projects/:owner/:repo/commits`)

| Method | Path | Description | Query Params | Response |
|--------|------|-------------|--------------|----------|
| GET | `/api/projects/:owner/:repo/commits` | Commit history | `branch?`, `limit?` (default: 50) | `ApiResponse<Commit[]>` |
| GET | `/api/projects/:owner/:repo/commits/:sha` | Single commit details | - | `ApiResponse<Commit>` |

### Files (`/api/projects/:owner/:repo/files`)

| Method | Path | Description | Query Params | Response |
|--------|------|-------------|--------------|----------|
| GET | `/api/projects/:owner/:repo/files/*` | Read file content | `ref?` (git ref) | `ApiResponse<{ path: string; content: string }>` |

### Kimi Chat (`/api/kimi`)

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| POST | `/api/kimi/chat` | Send chat message to Kimi | `{ message: string; context?: { project?: string; task?: string } }` | `ApiResponse<{ response: string }>` |

## TypeScript Types & Interfaces

### Project

```typescript
interface Project {
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

interface ProjectSettings {
  refreshInterval: number;
  defaultView: string;
  notifications: boolean;
}
```

### Task

```typescript
interface Task {
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

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'BLOCKED';

interface TaskLifecycleEvent {
  id: string;
  taskId: string;
  type: 'created' | 'assigned' | 'started' | 'submitted' | 'reviewed' | 'approved' | 'merged' | 'done';
  timestamp: string;
  agent?: string;
  data?: Record<string, unknown>;
}
```

### Commit

```typescript
interface Commit {
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

interface ParsedCommit {
  raw: string;
  agent?: string;
  action?: string;
  task?: string;
  description: string;
  isRoutingHeader: boolean;
}
```

### Agent

```typescript
interface Agent {
  name: string;
  status: 'idle' | 'working' | 'blocked';
  currentTask?: string;
  sessionId?: string;
  contextSize?: number;
}
```

### API Response

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### WebSocket Messages

```typescript
interface JoinProjectMessage {
  owner: string;
  repo: string;
}

interface KimiChatMessage {
  message: string;
  context?: {
    project?: string;
    task?: string;
  };
}
```

## WebSocket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join:project` | `JoinProjectMessage` | Subscribe to project updates |
| `leave:project` | `JoinProjectMessage` | Unsubscribe from project |
| `kimi:chat` | `KimiChatMessage` | Send chat message to Kimi |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `joined:project` | `{ owner, repo, room }` | Confirmation of joining project room |
| `task:update` | `{ taskId: string; status: string; data: unknown }` | Task status changed |
| `commit:new` | `{ sha: string; message: string; author: string }` | New commit detected |
| `task:lifecycle` | `{ taskId: string; events: unknown[] }` | Task lifecycle event |
| `agent:status` | `{ agent: string; status: string; task?: string }` | Agent status update |
| `kimi:stream` | `{ chunk: string; done: boolean }` | Streaming Kimi response |

## Environment Variables

### Required

- `GITHUB_TOKEN` - GitHub Personal Access Token (scopes: `repo`, `read:org`)
- `KIMI_API_KEY` - Moonshot/Kimi API key

### Optional (with defaults)

- `PORT` - Server port (default: 3001)
- `CORS_ORIGIN` - Frontend origin (default: http://localhost:5173)
- `NODE_ENV` - Environment (default: development)
- `LOG_LEVEL` - Logging level (default: info)
- `KIMI_BASE_URL` - Kimi API base URL (default: https://api.moonshot.cn/v1)

## Error Handling

All endpoints return `ApiResponse<T>` format:
- `success: true` with `data` on success
- `success: false` with `error` on failure
- HTTP status codes: 200 (success), 201 (created), 400 (bad request), 404 (not found), 409 (conflict), 500 (server error), 503 (service unavailable)

## CORS Configuration

- CORS enabled for frontend origin (default: http://localhost:5173)
- Credentials: true
- Methods: GET, POST
- WebSocket CORS: same origin configuration

## Notes

1. **In-memory storage**: Projects are stored in-memory (should be replaced with database in production)
2. **GitHub integration**: All GitHub operations require valid `GITHUB_TOKEN`
3. **Kimi chat**: Currently non-streaming (TODO: implement streaming)
4. **Task lifecycle**: Placeholder implementation (can be enhanced with Git history parsing)
5. **File paths**: File endpoint uses wildcard `/*` to capture full path after `/files/`
