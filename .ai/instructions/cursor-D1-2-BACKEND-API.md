## Instruction: D1-2 Backend API & WebSocket Server

**Agent**: Cursor  
**Task**: TASK-D1-2-BACKEND-API  
**Priority**: P0-Critical  
**Type**: Create

### Objective
Build the Node.js/Express backend API with WebSocket support for real-time updates, GitHub API client, and Kimi API proxy.

### Task Reference
Full specifications: `.ai/tasks/dashboard-subtasks/TASK-D1-2-BACKEND-API.md`

### Step-by-Step Instructions

1. **Initialize Backend Project**
   ```bash
   mkdir backend
   cd backend
   npm init -y
   npm install express cors dotenv
   npm install socket.io
   npm install @octokit/rest axios
   npm install -D @types/express @types/cors @types/node nodemon typescript
   ```

2. **Set Up TypeScript**
   ```bash
   npx tsc --init
   ```
   - Configure `tsconfig.json` for Node.js
   - Set `outDir` to `./dist`
   - Enable strict mode

3. **Create Project Structure**
   ```
   backend/
   ├── src/
   │   ├── index.ts           # Entry point
   │   ├── server.ts          # Express + WebSocket setup
   │   ├── config/
   │   │   └── index.ts       # Environment config
   │   ├── routes/
   │   │   ├── tasks.ts       # Task endpoints
   │   │   ├── projects.ts    # Project endpoints
   │   │   ├── github.ts      # GitHub proxy endpoints
   │   │   └── kimi.ts        # Kimi API proxy
   │   ├── services/
   │   │   ├── github.ts      # GitHub API client
   │   │   ├── kimi.ts        # Kimi API client
   │   │   └── websocket.ts   # WebSocket handlers
   │   ├── types/
   │   │   └── index.ts       # TypeScript types
   │   └── utils/
   │       └── logger.ts      # Logging utility
   ├── .env.example
   └── package.json
   ```

4. **Implement Core Server** (`src/server.ts`)
   - Express app with CORS
   - Socket.io integration
   - Error handling middleware
   - Health check endpoint

5. **Create API Endpoints**

   **Tasks API** (`/api/tasks`):
   - `GET /api/tasks` - List all tasks
   - `GET /api/tasks/:id` - Get task details
   - `GET /api/tasks/:id/lifecycle` - Get task lifecycle events
   
   **Projects API** (`/api/projects`):
   - `GET /api/projects` - List configured projects
   - `POST /api/projects` - Add new project
   - `DELETE /api/projects/:id` - Remove project
   
   **GitHub Proxy** (`/api/github`):
   - `GET /api/github/repos` - List repos
   - `GET /api/github/repos/:owner/:repo/commits` - Get commits
   - `GET /api/github/repos/:owner/:repo/contents/:path` - Get file content

6. **Implement WebSocket Server**
   - Connection handling
   - Room management (per project)
   - Event types: `task:update`, `commit:new`, `review:new`, `chat:message`
   - Broadcasting to connected clients

7. **Create Kimi API Proxy**
   - Endpoint: `/api/kimi/chat`
   - Streaming response support
   - Secure API key handling (server-side only)
   - Request/response logging

8. **Configure Environment**
   ```
   PORT=3001
   GITHUB_TOKEN=
   KIMI_API_KEY=
   KIMI_API_URL=https://api.moonshot.cn/v1
   CORS_ORIGIN=http://localhost:5173
   ```

### Acceptance Criteria (Must Verify)

- [ ] Express server starts and responds to health check
- [ ] All REST endpoints functional
- [ ] WebSocket server accepts connections
- [ ] WebSocket events broadcast correctly
- [ ] Kimi API proxy works with streaming
- [ ] GitHub API client configured
- [ ] TypeScript compiles without errors
- [ ] Environment variables loaded correctly
- [ ] Error handling in place

### Do NOT

- Expose API keys in responses or logs
- Skip input validation on endpoints
- Forget CORS configuration
- Skip error handling for external API calls

### Commit Format

When submitting work:
```
[AGENT:cursor] [ACTION:submit] [TASK:D1-2] Backend API complete
```

### Handoff Notes

After completion:
1. Share `.env.example` with required variables
2. Coordinate with D1-3 (GitHub Integration) on API client usage
3. Frontend team will connect to your WebSocket endpoints
