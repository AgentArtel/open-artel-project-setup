## TASK-D2-2: OpenClaw Gateway Integration — Even-Openclaw Agent Communication

- **Status**: PENDING
- **Assigned**: cursor
- **Priority**: P1-High
- **Type**: Create
- **Depends on**: TASK-D2-1 (data source abstraction)
- **Blocks**: TASK-D2-5 (frontend project types — partial)

### Context

Even-Openclaw exposes an **OpenClaw Gateway** at WebSocket port 18789 with a JSON-RPC API for agent management. This is the highest-value integration for the dashboard because the API already exists and provides:

- **Agent CRUD**: `agents.list`, `agents.create`, `agents.update`, `agents.delete`
- **Agent files**: `agents.files.get`, `agents.files.set` (SKILL.md, SOUL.md)
- **Chat**: `chat.send` (streaming word-by-word), `chat.history`
- **Skills**: `skills.status`, `skills.install`, `skills.update`
- **Sessions**: `sessions.list`
- **Config**: `config.get`, `config.patch`
- **Models**: `models.list`

Auth uses scopes: `operator.read`, `operator.write`, `operator.admin`.

### Objective

Create an `OpenClawDataSource` that connects to an OpenClaw Gateway instance via WebSocket and implements the `ProjectDataSource` interface, mapping Gateway concepts to dashboard concepts.

### Specifications

**1. Create `OpenClawDataSource`** (`src/services/openclaw-datasource.ts`):

Implements `ProjectDataSource` by connecting to the Gateway WebSocket at `project.sourceConfig.gatewayUrl`.

**Mapping from Gateway → Dashboard concepts:**

| Dashboard concept | OpenClaw Gateway method | Notes |
|-------------------|------------------------|-------|
| `listTasks()` | No direct equivalent | Return empty or parse from `.ai/tasks/` if the Gateway repo is also on GitHub (hybrid) |
| `getAgents()` | `agents.list` | Map OpenClaw agent objects to dashboard `Agent` type |
| `listCommits()` | No direct equivalent | Return empty or hybrid with GitHub |
| `getFileContent()` | `agents.files.get` | Only for agent files (SKILL.md, SOUL.md) |
| `listReviews()` | No direct equivalent | Return empty |
| `listReports()` | No direct equivalent | Return empty |

**2. Add OpenClaw-specific endpoints** (these go beyond the generic interface):

- `GET /api/projects/:projectId/openclaw/agents` — Full agent list from Gateway
- `GET /api/projects/:projectId/openclaw/agents/:name` — Single agent detail (with SKILL.md, SOUL.md content)
- `POST /api/projects/:projectId/openclaw/agents` — Create agent via Gateway
- `PUT /api/projects/:projectId/openclaw/agents/:name` — Update agent
- `DELETE /api/projects/:projectId/openclaw/agents/:name` — Delete agent
- `GET /api/projects/:projectId/openclaw/skills` — Skills status
- `POST /api/projects/:projectId/openclaw/skills/:name/install` — Install skill
- `GET /api/projects/:projectId/openclaw/sessions` — Session list
- `GET /api/projects/:projectId/openclaw/models` — Available models

**3. OpenClaw chat via WebSocket**:

Add a new Socket.io event handler:
- Client sends `openclaw:chat` with `{ projectId, message, sessionKey?, agentName? }`
- Server connects to Gateway, calls `chat.send`, streams chunks back via `openclaw:stream` events
- Reuse the existing streaming pattern from Kimi chat

**4. Connection management**:

- Maintain a connection pool (one WebSocket per Gateway URL)
- Reconnect on disconnect with backoff
- Health check: try `config.get` on connect, report status

**5. Register in DataSourceRegistry**:

```typescript
registry.register('openclaw', new OpenClawDataSource());
```

### Acceptance Criteria

- [ ] `OpenClawDataSource` class implements `ProjectDataSource`
- [ ] Can create a project with `source: 'openclaw'` and `sourceConfig.gatewayUrl`
- [ ] `GET /api/projects/:id/openclaw/agents` returns agent list from a running Gateway
- [ ] `openclaw:chat` WebSocket event streams responses from Gateway
- [ ] Connection pool reuses connections to the same Gateway URL
- [ ] Health check reports Gateway availability
- [ ] `npm run build` succeeds with no type errors
- [ ] Works with Even-Openclaw's Gateway at `ws://localhost:18789` in local dev

### Do NOT

- Do NOT add heavy WebSocket client libraries — use `ws` (already a transitive dep of socket.io) or lightweight JSON-RPC client
- Do NOT modify existing GitHub data source or routes
- Do NOT implement NHA or game integrations (separate tasks)
- Do NOT modify the frontend (TASK-D2-5)
- Do NOT hardcode Gateway URLs — they come from `project.sourceConfig.gatewayUrl`

### Handoff Notes

[Updated by cursor when status changes]
