# Frontend Developer Agent — Complete Development Prompt

## Your Mission

Build a complete, production-ready frontend for the Open Artel Dashboard that integrates seamlessly with the existing backend API. The frontend should display all project data, provide real-time updates via WebSocket, and include a Kimi chat interface.

---

## 📁 Backend Files Reference

**IMPORTANT**: Before starting development, read the **Backend Files Reference** document:
- **File**: `.ai/agent-chats/frontend-pm/instructions/backend-files-reference.md`

This document lists all critical backend source files you should keep on hand, including:
- Type definitions (MUST HAVE)
- Route files for each API endpoint (MUST HAVE)
- WebSocket handlers (MUST HAVE)
- Configuration files
- Recommended file organization for your frontend project

**Quick Critical Files**:
- `dashboard-backend/src/types/index.ts` - All TypeScript types
- `dashboard-backend/src/routes/*.ts` - All API endpoints
- `dashboard-backend/src/websocket/handlers.ts` - WebSocket events
- `dashboard-backend/src/config/index.ts` - Environment variables

---

## Project Context

### Backend Location
The backend is located at `dashboard-backend/` (same directory level as this repo). It's a Node.js/Express server with WebSocket support running on port 3001 by default.

### Backend Base URL
- **Development**: `http://localhost:3001`
- **API Prefix**: `/api`
- **WebSocket**: `ws://localhost:3001` (Socket.io)

---

## Complete Backend API Documentation

### API Response Format

All endpoints return this format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### 1. Projects API (`/api/projects`)

#### GET `/api/projects`
List all monitored projects.

**Response**: `ApiResponse<Project[]>`

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

#### GET `/api/projects/:owner/:repo`
Get project details.

**Path Parameters**:
- `owner`: GitHub owner/org name
- `repo`: Repository name

**Response**: `ApiResponse<Project>`

#### POST `/api/projects`
Add new project.

**Request Body**:
```typescript
{
  owner: string;        // Required
  repo: string;         // Required
  url?: string;
  isLocal?: boolean;
  localPath?: string;
  settings?: ProjectSettings;
}
```

**Response**: `ApiResponse<Project>` (201 Created)

#### DELETE `/api/projects/:owner/:repo`
Remove project.

**Path Parameters**:
- `owner`: GitHub owner/org name
- `repo`: Repository name

**Response**: `ApiResponse<void>`

### 2. Tasks API (`/api/projects/:owner/:repo/tasks`)

#### GET `/api/projects/:owner/:repo/tasks`
List all tasks for a project.

**Path Parameters**:
- `owner`: GitHub owner/org name
- `repo`: Repository name

**Response**: `ApiResponse<Task[]>`

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
```

#### GET `/api/projects/:owner/:repo/tasks/:taskId`
Get task details.

**Path Parameters**:
- `owner`: GitHub owner/org name
- `repo`: Repository name
- `taskId`: Task ID (filename without .md)

**Response**: `ApiResponse<Task>`

#### GET `/api/projects/:owner/:repo/tasks/:taskId/lifecycle`
Get task lifecycle events.

**Path Parameters**:
- `owner`: GitHub owner/org name
- `repo`: Repository name
- `taskId`: Task ID

**Response**: `ApiResponse<TaskLifecycleEvent[]>`

```typescript
interface TaskLifecycleEvent {
  id: string;
  taskId: string;
  type: 'created' | 'assigned' | 'started' | 'submitted' | 'reviewed' | 'approved' | 'merged' | 'done';
  timestamp: string;
  agent?: string;
  data?: Record<string, unknown>;
}
```

### 3. Agents API (`/api/projects/:owner/:repo/agents`)

#### GET `/api/projects/:owner/:repo/agents`
List agent status for a project.

**Path Parameters**:
- `owner`: GitHub owner/org name
- `repo`: Repository name

**Response**: `ApiResponse<Agent[]>`

```typescript
interface Agent {
  name: string;
  status: 'idle' | 'working' | 'blocked';
  currentTask?: string;
  sessionId?: string;
  contextSize?: number;
}
```

### 4. Commits API (`/api/projects/:owner/:repo/commits`)

#### GET `/api/projects/:owner/:repo/commits`
Get commit history.

**Path Parameters**:
- `owner`: GitHub owner/org name
- `repo`: Repository name

**Query Parameters**:
- `branch?`: Git branch name (optional)
- `limit?`: Number of commits to return (default: 50)

**Response**: `ApiResponse<Commit[]>`

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

#### GET `/api/projects/:owner/:repo/commits/:sha`
Get single commit details.

**Path Parameters**:
- `owner`: GitHub owner/org name
- `repo`: Repository name
- `sha`: Commit SHA

**Response**: `ApiResponse<Commit>`

### 5. Files API (`/api/projects/:owner/:repo/files`)

#### GET `/api/projects/:owner/:repo/files/*`
Read file content from repository.

**Path Parameters**:
- `owner`: GitHub owner/org name
- `repo`: Repository name
- `*`: File path (wildcard, e.g., `.ai/status.md`)

**Query Parameters**:
- `ref?`: Git reference (branch/tag/commit SHA)

**Response**: `ApiResponse<{ path: string; content: string }>`

**Example**: `GET /api/projects/owner/repo/files/.ai/status.md?ref=main`

### 6. Kimi Chat API (`/api/kimi`)

#### POST `/api/kimi/chat`
Send chat message to Kimi API.

**Request Body**:
```typescript
{
  message: string;  // Required
  context?: {
    project?: string;
    task?: string;
  };
}
```

**Response**: `ApiResponse<{ response: string }>`

**Note**: Requires `KIMI_API_KEY` to be configured on backend. Returns 503 if not configured.

---

## WebSocket Events (Socket.io)

### Connection

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket'],
});
```

### Client → Server Events

#### `join:project`
Subscribe to project updates.

**Payload**:
```typescript
{
  owner: string;
  repo: string;
}
```

**Response Event**: `joined:project`

#### `leave:project`
Unsubscribe from project.

**Payload**:
```typescript
{
  owner: string;
  repo: string;
}
```

#### `kimi:chat`
Send chat message to Kimi (via WebSocket).

**Payload**:
```typescript
{
  message: string;
  context?: {
    project?: string;
    task?: string;
  };
}
```

**Response Event**: `kimi:stream`

### Server → Client Events

#### `joined:project`
Confirmation of joining project room.

**Payload**:
```typescript
{
  owner: string;
  repo: string;
  room: string; // "project:owner/repo"
}
```

#### `task:update`
Task status changed.

**Payload**:
```typescript
{
  taskId: string;
  status: string;
  data: unknown;
}
```

#### `commit:new`
New commit detected.

**Payload**:
```typescript
{
  sha: string;
  message: string;
  author: string;
}
```

#### `task:lifecycle`
Task lifecycle event.

**Payload**:
```typescript
{
  taskId: string;
  events: unknown[];
}
```

#### `agent:status`
Agent status update.

**Payload**:
```typescript
{
  agent: string;
  status: string;
  task?: string;
}
```

#### `kimi:stream`
Streaming Kimi response.

**Payload**:
```typescript
{
  chunk: string;
  done: boolean;
}
```

---

## Required UI Components & Pages

Based on the API structure, you need to build:

### 1. Project Management
- **Project List Page**: Display all monitored projects
- **Add Project Form**: Add new project (owner, repo, settings)
- **Project Detail Page**: Show project info, settings, actions
- **Project Settings**: Edit refresh interval, default view, notifications

### 2. Task Management
- **Task List View**: Show all tasks for a project (filterable by status, priority, assigned)
- **Task Detail View**: Full task information (objective, specs, acceptance criteria, lifecycle)
- **Task Lifecycle Timeline**: Visual timeline of task events
- **Task Filters**: Filter by status, priority, assigned agent, type

### 3. Agent Status
- **Agent Dashboard**: Show all agents and their current status
- **Agent Activity**: Show what each agent is working on
- **Agent Status Indicators**: Visual indicators for idle/working/blocked

### 4. Commit History
- **Commit List**: Show commit history with parsed routing headers
- **Commit Detail**: Show commit details, files changed, parsed info
- **Commit Filters**: Filter by agent, action, task, branch

### 5. File Browser
- **File Tree**: Browse repository files
- **File Viewer**: Display file content (markdown, code, etc.)
- **File History**: Show file changes across commits

### 6. Kimi Chat Interface
- **Chat Window**: Send messages to Kimi
- **Chat History**: Display conversation history
- **Context Selection**: Select project/task context for chat
- **Streaming Display**: Show streaming responses (when implemented)

### 7. Real-time Updates
- **Live Status Indicators**: Show real-time task/agent/commit updates
- **Notifications**: Toast notifications for important events
- **Auto-refresh**: Optionally auto-refresh data based on project settings

---

## Design Requirements

### UI/UX Guidelines

1. **Modern & Clean**: Use a modern design system (e.g., Tailwind CSS, Material UI, or similar)
2. **Responsive**: Must work on desktop, tablet, and mobile
3. **Accessible**: Follow WCAG 2.1 AA standards
4. **Dark Mode**: Support dark/light theme toggle
5. **Loading States**: Show loading indicators for async operations
6. **Error Handling**: Display user-friendly error messages
7. **Empty States**: Show helpful empty states when no data

### Color Coding

- **Task Status**:
  - PENDING: Gray/Yellow
  - IN_PROGRESS: Blue
  - REVIEW: Orange
  - DONE: Green
  - BLOCKED: Red

- **Agent Status**:
  - idle: Gray
  - working: Blue
  - blocked: Red

- **Priority**:
  - P0/P1: Red
  - P2: Orange
  - P3: Yellow/Default

### Layout Structure

```
┌─────────────────────────────────────────┐
│ Header (Logo, Navigation, User)          │
├─────────────────────────────────────────┤
│ Sidebar (Projects, Navigation)          │
├─────────────────────────────────────────┤
│ Main Content Area                        │
│  ┌───────────────────────────────────┐ │
│  │ Page Content                       │ │
│  │                                    │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Integration Instructions

### 1. Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

### 2. API Client Setup

Create an API client utility:

```typescript
// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  return response.json();
}
```

### 3. WebSocket Setup

```typescript
// src/lib/websocket.ts
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

export function createSocket(): Socket {
  return io(WS_URL, {
    transports: ['websocket'],
  });
}
```

### 4. CORS Configuration

The backend is configured to accept requests from `http://localhost:5173` (Vite default). If using a different port, update backend `CORS_ORIGIN` environment variable.

### 5. Error Handling

Handle API errors gracefully:

```typescript
try {
  const response = await apiRequest<Project[]>('/api/projects');
  if (response.success) {
    // Use response.data
  } else {
    // Show error: response.error
  }
} catch (error) {
  // Handle network errors
}
```

---

## Technical Stack Recommendations

### Framework Options

1. **React + Vite** (Recommended)
   - Fast development
   - Great TypeScript support
   - Large ecosystem

2. **Vue 3 + Vite**
   - Simple and intuitive
   - Good TypeScript support

3. **SvelteKit**
   - Modern and lightweight
   - Great performance

### Required Libraries

- **HTTP Client**: Native `fetch` or `axios`
- **WebSocket**: `socket.io-client`
- **Routing**: React Router / Vue Router / SvelteKit routing
- **State Management**: Zustand / Pinia / Svelte stores (optional, for complex state)
- **UI Components**: Tailwind CSS + Headless UI / Material UI / Shadcn/ui
- **Icons**: Lucide React / Heroicons / Material Icons
- **Date Formatting**: date-fns or dayjs
- **Markdown Rendering**: react-markdown / marked (for task specs, file content)

### TypeScript

- Use TypeScript for type safety
- Create type definitions matching backend types (copy from backend `types/index.ts`)
- Use strict mode

---

## Development Checklist

### Phase 1: Setup & Foundation
- [ ] Initialize frontend project (Vite + React/Vue/Svelte)
- [ ] Set up TypeScript with strict mode
- [ ] Configure environment variables
- [ ] Create API client utility
- [ ] Set up WebSocket client
- [ ] Create type definitions (copy from backend)
- [ ] Set up routing
- [ ] Set up UI component library

### Phase 2: Core Features
- [ ] Project list page
- [ ] Add project form
- [ ] Project detail page
- [ ] Task list page
- [ ] Task detail page
- [ ] Agent status page
- [ ] Commit history page
- [ ] File browser

### Phase 3: Advanced Features
- [ ] WebSocket integration (real-time updates)
- [ ] Kimi chat interface
- [ ] Task lifecycle timeline
- [ ] Commit parsing & visualization
- [ ] File viewer with syntax highlighting

### Phase 4: Polish
- [ ] Loading states
- [ ] Error handling
- [ ] Empty states
- [ ] Responsive design
- [ ] Dark mode
- [ ] Accessibility improvements
- [ ] Performance optimization

---

## Example API Usage

### Fetch Projects

```typescript
const response = await apiRequest<Project[]>('/api/projects');
if (response.success && response.data) {
  const projects = response.data;
  // Display projects
}
```

### Add Project

```typescript
const response = await apiRequest<Project>('/api/projects', {
  method: 'POST',
  body: JSON.stringify({
    owner: 'myorg',
    repo: 'myrepo',
    settings: {
      refreshInterval: 30,
      defaultView: 'dashboard',
      notifications: true,
    },
  }),
});
```

### Fetch Tasks

```typescript
const response = await apiRequest<Task[]>(
  `/api/projects/${owner}/${repo}/tasks`
);
```

### WebSocket Example

```typescript
import { createSocket } from '@/lib/websocket';

const socket = createSocket();

socket.on('connect', () => {
  console.log('Connected to WebSocket');
  
  // Join project room
  socket.emit('join:project', { owner: 'myorg', repo: 'myrepo' });
});

socket.on('joined:project', (data) => {
  console.log('Joined project room:', data.room);
});

socket.on('task:update', (data) => {
  console.log('Task updated:', data);
  // Update UI
});

socket.on('kimi:stream', (data) => {
  console.log('Kimi response chunk:', data.chunk);
  // Append to chat display
  if (data.done) {
    console.log('Stream complete');
  }
});
```

---

## Testing Requirements

- Unit tests for utility functions
- Integration tests for API calls
- Component tests for UI components
- E2E tests for critical user flows (optional)

---

## Deployment Considerations

- Build for production: `npm run build`
- Static files can be served from any static host
- Update `CORS_ORIGIN` in backend to match frontend URL
- Update `VITE_API_BASE_URL` and `VITE_WS_URL` for production

---

## Additional Notes

1. **Backend Health Check**: Use `GET /health` to verify backend is running
2. **Error Codes**: Handle 400, 404, 409, 500, 503 appropriately
3. **Rate Limiting**: Backend doesn't implement rate limiting yet, but be mindful of API calls
4. **WebSocket Reconnection**: Implement automatic reconnection logic
5. **Offline Support**: Consider showing cached data when offline (optional)
6. **Pagination**: Commits endpoint supports `limit` query param, implement pagination UI

---

## Success Criteria

Your frontend is complete when:

1. ✅ All API endpoints are integrated and working
2. ✅ WebSocket real-time updates are functional
3. ✅ All required pages and components are built
4. ✅ UI is responsive and accessible
5. ✅ Error handling is comprehensive
6. ✅ TypeScript types match backend exactly
7. ✅ Code is clean, well-organized, and documented
8. ✅ Application is production-ready

---

**Good luck building the frontend!** 🚀

