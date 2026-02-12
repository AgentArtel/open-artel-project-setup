# Open Artel Dashboard Backend

Backend API server for the Open Artel Dashboard project.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

**Option 1: Interactive Setup (Recommended)**
```bash
npm run setup
```
This will guide you through setting up all configuration values.

**Option 2: Manual Setup**
```bash
cp .env.example .env
# Then edit .env and add your API keys
```

**Required Environment Variables:**

- `GITHUB_TOKEN` - GitHub Personal Access Token (required for GitHub API access)
  - Create at: https://github.com/settings/tokens
  - Required scopes: `repo` (for private repos), `read:org` (for org repos)
  
- `KIMI_API_KEY` - Moonshot/Kimi API key (required for Kimi chat proxy)
  - Get from: https://platform.moonshot.cn/
  - Required for `/api/kimi/chat` endpoint

**Optional Environment Variables (have defaults):**

- `PORT` - Server port (default: 3001)
- `CORS_ORIGIN` - Frontend origin (default: http://localhost:5173)
- `NODE_ENV` - Environment (default: development)
- `LOG_LEVEL` - Logging level (default: info)
- `KIMI_BASE_URL` - Kimi API base URL (default: https://api.moonshot.cn/v1)

**Verify Configuration:**
```bash
npm run env:check
```
This will check that all required variables are set correctly.

### 3. Build

```bash
npm run build
```

### 4. Run

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## API Endpoints

### Projects
- `GET /api/projects` - List all monitored projects
- `GET /api/projects/:owner/:repo` - Get project details
- `POST /api/projects` - Add new project
- `DELETE /api/projects/:owner/:repo` - Remove project

### Repos (GitHub)
- `GET /api/repos` - List GitHub repositories for the authenticated user (uses GITHUB_TOKEN). Optional query: `?org=NAME` for organization repos. Used by the Dashboard "Load my repos from GitHub" flow when adding a project.

### Tasks
- `GET /api/projects/:owner/:repo/tasks` - List all tasks
- `GET /api/projects/:owner/:repo/tasks/:taskId` - Get task details
- `GET /api/projects/:owner/:repo/tasks/:taskId/lifecycle` - Get task lifecycle

### Agents
- `GET /api/projects/:owner/:repo/agents` - List agent status

### Commits
- `GET /api/projects/:owner/:repo/commits` - Commit history
- `GET /api/projects/:owner/:repo/commits/:sha` - Single commit details

### Files
- `GET /api/projects/:owner/:repo/files/:path*` - Read file content

### Kimi Chat
- `POST /api/kimi/chat` - Send chat message to Kimi (requires KIMI_API_KEY)

## WebSocket Events

### Client → Server
- `join:project` - Subscribe to project updates
- `leave:project` - Unsubscribe from project
- `kimi:chat` - Send chat message to Kimi

### Server → Client
- `task:update` - Task status changed
- `commit:new` - New commit detected
- `task:lifecycle` - Task lifecycle event
- `kimi:stream` - Streaming Kimi response
- `agent:status` - Agent status update

## Development

The backend uses TypeScript and compiles to `dist/`. Source files are in `src/`.

**Type checking:**
```bash
npm run type-check
```

**Watch mode:**
```bash
npm run dev
```

## Notes

- **Linking a repo to a project:** There is no separate "link repo" step. Adding a project (Dashboard → Add Project) with a GitHub owner and repo name is how you link that repository. Use "Load my repos from GitHub" to pick from repos accessible with your `GITHUB_TOKEN`.
- **Tasks:** The backend reads from the repo’s `.ai/tasks/` directory. If the repo doesn’t use the Open Artel structure, the tasks list is empty (no error).
- **Agents:** The backend reads `.ai/status.md` for agent status. If missing, it returns a default agent list.
- **Commits:** If the repo doesn’t exist or the token doesn’t have access, the API returns an empty list instead of an error.
- GitHub API integration requires a valid `GITHUB_TOKEN`
- Kimi chat requires a valid `KIMI_API_KEY` in `.env`; otherwise the agent chat returns "Kimi API key not configured"
- All endpoints return JSON with `{ success: boolean, data?: T, error?: string }` format
- WebSocket server runs on the same port as HTTP server

