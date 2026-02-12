# Backend Files Reference — Essential for Frontend Development

This document lists the backend files you should keep on hand while developing the frontend. These files contain the source of truth for API contracts, types, and data structures.

## Critical Files (Must Have)

### 1. Type Definitions
**File**: `dashboard-backend/src/types/index.ts`

**Why Essential**: 
- Contains ALL TypeScript interfaces and types used by the API
- Frontend TypeScript types must match these exactly
- Single source of truth for data structures

**What You'll Reference**:
- `Project`, `ProjectSettings`
- `Task`, `TaskStatus`, `TaskLifecycleEvent`
- `Commit`, `ParsedCommit`
- `Agent`
- `ApiResponse<T>`
- `JoinProjectMessage`, `KimiChatMessage`

**Usage**: Copy these types directly into your frontend codebase or import them if using a monorepo.

---

### 2. Configuration
**File**: `dashboard-backend/src/config/index.ts`

**Why Essential**:
- Shows all environment variables and their defaults
- Documents CORS origin configuration
- Shows API key requirements

**What You'll Reference**:
- Default port: `3001`
- Default CORS origin: `http://localhost:5173`
- Environment variable names: `PORT`, `CORS_ORIGIN`, `GITHUB_TOKEN`, `KIMI_API_KEY`
- API base URLs

**Usage**: Ensure your frontend `.env` matches these defaults, or update backend config if using different ports.

---

### 3. Route Files (API Endpoints)

#### Projects Routes
**File**: `dashboard-backend/src/routes/projects.ts`

**Why Essential**:
- Exact API endpoint paths and methods
- Request body structure for POST requests
- Response format and status codes
- Error handling patterns

**What You'll Reference**:
- `GET /api/projects` - List projects
- `GET /api/projects/:owner/:repo` - Get project
- `POST /api/projects` - Add project (request body structure)
- `DELETE /api/projects/:owner/:repo` - Remove project

---

#### Tasks Routes
**File**: `dashboard-backend/src/routes/tasks.ts`

**Why Essential**:
- Task API endpoints and path parameters
- How tasks are fetched from GitHub
- Task data transformation logic

**What You'll Reference**:
- `GET /api/projects/:owner/:repo/tasks` - List tasks
- `GET /api/projects/:owner/:repo/tasks/:taskId` - Get task
- `GET /api/projects/:owner/:repo/tasks/:taskId/lifecycle` - Get lifecycle

---

#### Agents Routes
**File**: `dashboard-backend/src/routes/agents.ts`

**Why Essential**:
- Agent status endpoint
- How agent status is derived from status.md
- Default agent list structure

**What You'll Reference**:
- `GET /api/projects/:owner/:repo/agents` - List agents
- Default agents: `['claude', 'cursor', 'lovable', 'kimi']`
- Agent status mapping logic

---

#### Commits Routes
**File**: `dashboard-backend/src/routes/commits.ts`

**Why Essential**:
- Commit history endpoint
- Query parameters (`branch`, `limit`)
- Commit data structure

**What You'll Reference**:
- `GET /api/projects/:owner/:repo/commits` - List commits
- `GET /api/projects/:owner/:repo/commits/:sha` - Get commit
- Query params: `branch?`, `limit?` (default: 50)

---

#### Files Routes
**File**: `dashboard-backend/src/routes/files.ts`

**Why Essential**:
- File reading endpoint structure
- Wildcard path parameter handling
- Query parameter for git ref

**What You'll Reference**:
- `GET /api/projects/:owner/:repo/files/*` - Read file
- Query param: `ref?` (git reference)
- Path parameter: `*` (wildcard for file path)

---

#### Kimi Routes
**File**: `dashboard-backend/src/routes/kimi.ts`

**Why Essential**:
- Kimi chat API endpoint
- Request/response structure
- Error handling (503 if API key not configured)

**What You'll Reference**:
- `POST /api/kimi/chat` - Send chat message
- Request body: `{ message: string; context?: {...} }`
- Response: `{ response: string }`
- Model: `moonshot-v1-8k`

---

### 4. WebSocket Handlers
**File**: `dashboard-backend/src/websocket/handlers.ts`

**Why Essential**:
- All WebSocket event names and payloads
- Client → Server events structure
- Server → Client events structure
- Room naming convention

**What You'll Reference**:
- Client events: `join:project`, `leave:project`, `kimi:chat`
- Server events: `joined:project`, `task:update`, `commit:new`, `task:lifecycle`, `agent:status`, `kimi:stream`
- Room format: `project:owner/repo`
- Event payload structures

---

### 5. WebSocket Setup
**File**: `dashboard-backend/src/websocket/index.ts`

**Why Essential**:
- WebSocket server initialization
- Connection handling
- Socket.io configuration

**What You'll Reference**:
- Connection event handling
- Disconnect handling
- Socket.io setup pattern

---

## Important Files (Good to Have)

### 6. Main Server Entry
**File**: `dashboard-backend/src/index.ts`

**Why Useful**:
- Server startup configuration
- CORS setup
- Health check endpoint
- Error handling middleware
- Port configuration

**What You'll Reference**:
- Health check: `GET /health`
- CORS configuration details
- Server port

---

### 7. Route Index
**File**: `dashboard-backend/src/routes/index.ts`

**Why Useful**:
- Overview of all route groups
- Route mounting structure
- API path prefixes

**What You'll Reference**:
- All route groups at a glance
- Route organization

---

### 8. GitHub Service
**File**: `dashboard-backend/src/services/github.ts`

**Why Useful**:
- Understanding how data is fetched from GitHub
- Data parsing logic (status.md, task briefs, commits)
- Error handling patterns
- How task briefs are structured

**What You'll Reference**:
- Task brief parsing logic
- Status.md parsing logic
- Commit message parsing (routing headers)
- File content fetching

**Note**: This is especially useful if you need to understand the data format or debug data issues.

---

## Optional Files (Nice to Have)

### 9. Package.json
**File**: `dashboard-backend/package.json`

**Why Useful**:
- Dependencies list
- Scripts available
- Node.js version requirements

**What You'll Reference**:
- Backend dependencies (for compatibility checks)
- Available npm scripts

---

### 10. README
**File**: `dashboard-backend/README.md`

**Why Useful**:
- Setup instructions
- Environment variable documentation
- API endpoint overview
- WebSocket event overview

**What You'll Reference**:
- Quick API reference
- Setup instructions
- Environment variable requirements

---

## Recommended File Organization for Frontend

Create a `backend-reference/` folder in your frontend project and copy these files:

```
frontend/
├── backend-reference/
│   ├── types/
│   │   └── index.ts          # Copy from backend
│   ├── routes/
│   │   ├── projects.ts
│   │   ├── tasks.ts
│   │   ├── agents.ts
│   │   ├── commits.ts
│   │   ├── files.ts
│   │   └── kimi.ts
│   ├── websocket/
│   │   ├── index.ts
│   │   └── handlers.ts
│   ├── config/
│   │   └── index.ts
│   └── services/
│       └── github.ts         # For understanding data parsing
└── src/
    └── ...
```

Or use a monorepo structure to share types directly.

---

## Quick Reference Checklist

When developing each feature, check these files:

### For Project Management
- ✅ `routes/projects.ts` - API endpoints
- ✅ `types/index.ts` - Project types

### For Task Management
- ✅ `routes/tasks.ts` - API endpoints
- ✅ `types/index.ts` - Task types
- ✅ `services/github.ts` - Task parsing logic

### For Agent Status
- ✅ `routes/agents.ts` - API endpoint
- ✅ `types/index.ts` - Agent types
- ✅ `services/github.ts` - Status parsing

### For Commits
- ✅ `routes/commits.ts` - API endpoints
- ✅ `types/index.ts` - Commit types
- ✅ `services/github.ts` - Commit parsing

### For Files
- ✅ `routes/files.ts` - API endpoint
- ✅ `services/github.ts` - File fetching

### For Kimi Chat
- ✅ `routes/kimi.ts` - API endpoint
- ✅ `websocket/handlers.ts` - WebSocket events
- ✅ `types/index.ts` - Chat message types

### For WebSocket
- ✅ `websocket/handlers.ts` - All events
- ✅ `websocket/index.ts` - Connection setup
- ✅ `types/index.ts` - Message types

---

## Pro Tips

1. **Keep types in sync**: If backend types change, update frontend types immediately
2. **Check route files first**: When implementing a new feature, start with the route file to understand the exact API contract
3. **Reference GitHub service**: If data looks wrong, check how it's parsed in `github.ts`
4. **WebSocket events**: Keep `handlers.ts` open when implementing real-time features
5. **Config file**: Check defaults when debugging CORS or connection issues

---

## File Paths (Relative to Project Root)

All files are in `dashboard-backend/src/`:

```
dashboard-backend/
└── src/
    ├── types/index.ts              ⭐ CRITICAL
    ├── config/index.ts            ⭐ CRITICAL
    ├── routes/
    │   ├── index.ts               📋 Good to have
    │   ├── projects.ts            ⭐ CRITICAL
    │   ├── tasks.ts               ⭐ CRITICAL
    │   ├── agents.ts              ⭐ CRITICAL
    │   ├── commits.ts             ⭐ CRITICAL
    │   ├── files.ts               ⭐ CRITICAL
    │   └── kimi.ts                ⭐ CRITICAL
    ├── websocket/
    │   ├── index.ts               ⭐ CRITICAL
    │   └── handlers.ts            ⭐ CRITICAL
    ├── services/
    │   └── github.ts              📋 Important
    └── index.ts                   📋 Good to have
```

**Legend**:
- ⭐ CRITICAL - Must have on hand
- 📋 Important/Good to have - Reference when needed

---

**Keep these files open in your editor or easily accessible while developing!**
