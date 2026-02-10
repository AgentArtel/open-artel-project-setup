## TASK-D1-2: Backend API — Node.js + Express + WebSocket

- **Status**: PENDING
- **Assigned**: cursor
- **Priority**: P1-Critical
- **Type**: Create
- **Depends on**: none
- **Blocks**: TASK-D1-3, TASK-D1-4, TASK-D1-5

### Context

This is the backend foundation for the Open Artel Dashboard. The backend provides API endpoints and WebSocket connections for real-time updates and Kimi chat proxy.

### Objective

Create a Node.js backend with Express + WebSocket server. Implement API endpoints for projects, tasks, agents, and commits. Set up WebSocket events for real-time updates.

### Specifications

**Tech Stack**:
- Node.js 18+
- Express.js
- Socket.io (WebSocket server)
- TypeScript
- Octokit (GitHub API client)
- dotenv for environment variables
- cors for cross-origin requests

**Project Structure**:
```
backend/
├── src/
│   ├── config/
│   │   └── index.ts
│   ├── routes/
│   │   ├── projects.ts
│   │   ├── tasks.ts
│   │   ├── agents.ts
│   │   └── commits.ts
│   ├── services/
│   │   ├── github.ts
│   │   ├── gitReader.ts
│   │   └── kimiProxy.ts
│   ├── websocket/
│   │   ├── index.ts
│   │   ├── events.ts
│   │   └── handlers.ts
│   ├── types/
│   │   ├── project.ts
│   │   ├── task.ts
│   │   └── websocket.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── .env.example
```

**API Endpoints**:

```typescript
// Projects
GET    /api/projects              // List all monitored projects
GET    /api/projects/:owner/:repo  // Get project details

// Tasks
GET    /api/projects/:owner/:repo/tasks              // List all tasks
GET    /api/projects/:owner/:repo/tasks/:taskId      // Get task details
GET    /api/projects/:owner/:repo/tasks/:taskId/lifecycle  // Get task lifecycle

// Agents
GET    /api/projects/:owner/:repo/agents             // List agent status

// Commits
GET    /api/projects/:owner/:repo/commits            // Commit history
GET    /api/projects/:owner/:repo/commits/:sha       // Single commit details

// Files (for reading .ai/ files)
GET    /api/projects/:owner/:repo/files/:path*       // Read file content
```

**WebSocket Events**:

```typescript
// Client -> Server
join:project    { owner, repo }     // Subscribe to project updates
leave:project   { owner, repo }     // Unsubscribe
kimi:chat       { message, context } // Send chat message to Kimi

// Server -> Client
task:update     { taskId, status, data }     // Task status changed
commit:new      { sha, message, author }     // New commit
task:lifecycle  { taskId, events }           // Lifecycle event
kimi:stream     { chunk, done }              // Streaming response chunk
agent:status    { agent, status, task }      // Agent status update
```

**Environment Variables**:
```env
PORT=3001
GITHUB_TOKEN=ghp_xxx
KIMI_API_KEY=sk-xxx
KIMI_BASE_URL=https://api.moonshot.cn/v1
CORS_ORIGIN=http://localhost:5173
```

### Acceptance Criteria

- [ ] Node.js + Express + TypeScript project set up
- [ ] All API endpoints implemented and returning correct data
- [ ] Socket.io WebSocket server configured
- [ ] GitHub API client (Octokit) integrated with auth
- [ ] All WebSocket events implemented and tested
- [ ] CORS configured for frontend connection
- [ ] Environment variables documented in .env.example
- [ ] TypeScript types defined for all API responses
- [ ] Error handling middleware implemented
- [ ] Server starts without errors and responds to requests

### Do NOT

- Hardcode API keys or secrets
- Skip error handling
- Skip TypeScript types
- Leave endpoints unimplemented

### Handoff Notes

When complete, commit with: `[AGENT:cursor] [ACTION:submit] [TASK:D1-2] Backend API complete`

Next tasks waiting: D1-3 (GitHub Integration), D1-4 (Task Lifecycle), D1-5 (Kimi Chat)
