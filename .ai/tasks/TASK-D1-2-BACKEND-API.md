## TASK-D1-2-BACKEND-API: Node.js Backend API

- **Status**: PENDING
- **Assigned**: cursor
- **Priority**: P1-Critical
- **Type**: Create
- **Depends on**: none (can parallel with D1.1)
- **Blocks**: TASK-D1-5 (Kimi Chat requires backend)

### Context

The dashboard needs a backend to proxy API calls securely (API keys should never be exposed to frontend) and provide WebSocket for real-time updates.

### Objective

Create a Node.js backend with Express, WebSocket server, GitHub API client, and Kimi API proxy.

### Specifications

**Tech Stack**:
- Node.js 18+ + Express 4
- WebSocket: Socket.io or ws library
- GitHub API: Octokit/rest
- Environment: dotenv for configuration

**Project Structure**:
```
backend/
├── src/
│   ├── server.ts              # Express + WebSocket server entry
│   ├── config/
│   │   └── index.ts           # Environment configuration
│   ├── routes/
│   │   ├── projects.ts        # Project-related endpoints
│   │   ├── tasks.ts           # Task-related endpoints
│   │   ├── agents.ts          # Agent status endpoints
│   │   └── commits.ts         # Commit history endpoints
│   ├── services/
│   │   ├── github.ts          # GitHub API client
│   │   ├── gitReader.ts       # Local git file reader
│   │   └── kimiProxy.ts       # Kimi API proxy service
│   ├── websocket/
│   │   ├── server.ts          # WebSocket server setup
│   │   ├── handlers/
│   │   │   ├── taskHandler.ts
│   │   │   ├── chatHandler.ts
│   │   │   └── commitHandler.ts
│   │   └── events.ts          # Event definitions
│   ├── parsers/
│   │   ├── statusParser.ts    # Parse .ai/status.md
│   │   ├── taskParser.ts      # Parse .ai/tasks/*.md
│   │   ├── reviewParser.ts    # Parse .ai/reviews/*.md
│   │   └── commitParser.ts    # Parse commit messages
│   ├── types/
│   │   ├── project.ts
│   │   ├── task.ts
│   │   └── agent.ts
│   └── utils/
│       └── logger.ts
├── package.json
├── tsconfig.json
└── .env.example
```

**REST Endpoints**:
- `GET /api/health` — Health check
- `GET /api/projects` — List configured projects
- `GET /api/projects/:owner/:repo` — Project details
- `GET /api/projects/:owner/:repo/status` — Parse .ai/status.md
- `GET /api/projects/:owner/:repo/tasks` — List tasks from .ai/tasks/
- `GET /api/projects/:owner/:repo/tasks/:taskId` — Task details
- `GET /api/projects/:owner/:repo/tasks/:taskId/lifecycle` — Task lifecycle data
- `GET /api/projects/:owner/:repo/agents` — Agent status
- `GET /api/projects/:owner/:repo/commits` — Commit history
- `GET /api/projects/:owner/:repo/commits/:sha` — Commit details

**WebSocket Events**:
- `connection` — Client connects
- `task:subscribe` — Subscribe to task updates
- `task:update` — Task status changed (broadcast)
- `commit:subscribe` — Subscribe to commit updates
- `commit:new` — New commit detected (broadcast)
- `review:new` — New review created (broadcast)
- `chat:message` — Kimi chat message (streaming)
- `chat:stream` — Streaming response chunk

### Acceptance Criteria

- [ ] Node.js project initialized with TypeScript
- [ ] Express server running on port 3001 (or configurable)
- [ ] All REST endpoints implemented with proper error handling
- [ ] WebSocket server integrated with Express
- [ ] GitHub API client configured with token auth
- [ ] Kimi API proxy service created (routes to Moonshot API)
- [ ] File parsers for .ai/status.md, .ai/tasks/*.md, .ai/reviews/*.md
- [ ] Environment configuration with .env.example
- [ ] CORS configured for frontend origin
- [ ] Basic logging middleware
- [ ] README with setup and run instructions
- [ ] Server starts without errors (`npm run dev`)

### Do NOT

- Hardcode API keys (use environment variables)
- Skip error handling on API calls
- Implement frontend features (backend only)
- Skip WebSocket implementation (critical for real-time features)

### Handoff Notes

This backend is required for the Kimi Chat feature (D1.5) and enables real-time updates. Ensure WebSocket is working correctly.
