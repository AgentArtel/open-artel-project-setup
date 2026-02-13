## TASK-D2-3: NHA / Legion X Integration — NotHumanAllowed Agent Platform

- **Status**: PENDING
- **Assigned**: cursor
- **Priority**: P2-Medium
- **Type**: Create
- **Depends on**: TASK-D2-1 (data source abstraction)
- **Blocks**: TASK-D2-5 (frontend project types — partial)

### Context

[NotHumanAllowed](https://github.com/adoslabsproject-gif/nothumanallowed) is a multi-agent orchestration platform with 42 specialized AI agents, a 9-layer Geth Consensus pipeline, and ONNX neural routing. It exposes a REST API at `https://nothumanallowed.com/api/v1`.

The dashboard should be able to monitor NHA sessions, view agent performance, and submit tasks to Legion X — making it a unified hub for all agent systems, not just Open Artel dev agents.

**NHA API surface (key endpoints):**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/geth/sessions` | Yes | Create Geth Consensus session |
| GET | `/geth/sessions/:id` | Yes | Session status + results |
| POST | `/geth/sessions/:id/resume` | Yes | Resume interrupted session |
| POST | `/legion/run` | Yes | Submit orchestration task |
| GET | `/legion/agents` | No | List all 42 agents |
| GET | `/feed` | No | Agent activity feed |
| POST | `/agents/register` | No | Register new agent |
| GET | `/nexus/shards` | No | Knowledge registry |
| GET | `/geth/providers` | No | Available LLM providers |

Auth: Ed25519 cryptographic signatures (no passwords, no bearer tokens).

### Objective

Create an `NHADataSource` that connects to the NHA REST API and implements the `ProjectDataSource` interface, plus NHA-specific endpoints for Legion X sessions and Geth consensus.

### Specifications

**1. Create `NHADataSource`** (`src/services/nha-datasource.ts`):

Implements `ProjectDataSource` by calling NHA REST API at `project.sourceConfig.nhaEndpoint`.

**Mapping from NHA → Dashboard concepts:**

| Dashboard concept | NHA API | Notes |
|-------------------|---------|-------|
| `getAgents()` | `GET /legion/agents` | Map NHA's 42 agents to dashboard `Agent` type (name, status, category) |
| `listTasks()` | `GET /geth/sessions` | Map Geth sessions to a task-like view (session = task) |
| `listCommits()` | No equivalent | Return empty |
| `getFileContent()` | No equivalent | Return empty |
| `listReviews()` | Session results could map to reviews | Optional: Geth consensus results as "reviews" |
| `listReports()` | `GET /geth/sessions/:id` | Full session detail as a report |

**2. Add NHA-specific endpoints:**

- `GET /api/projects/:projectId/nha/agents` — Full 42-agent roster with categories
- `GET /api/projects/:projectId/nha/agents/:name` — Agent card + performance
- `GET /api/projects/:projectId/nha/sessions` — Geth Consensus sessions list
- `GET /api/projects/:projectId/nha/sessions/:id` — Session detail (proposals, synthesis, quality score)
- `POST /api/projects/:projectId/nha/sessions/:id/resume` — Resume interrupted session
- `POST /api/projects/:projectId/nha/run` — Submit task to Legion X
- `GET /api/projects/:projectId/nha/providers` — Available LLM providers
- `GET /api/projects/:projectId/nha/feed` — Agent activity feed

**3. Auth handling:**

- NHA uses Ed25519 signatures. The dashboard needs to store and use the user's NHA private key (or a signing proxy).
- For MVP: accept a `nhaApiKey` or `nhaPrivateKeyPath` in `sourceConfig` and use it for authenticated requests.
- **Security note**: Private keys should not be stored in `projects.json` in plain text long-term. For MVP, this is acceptable for local dev. Document the security caveat.

**4. Register in DataSourceRegistry:**

```typescript
registry.register('nha', new NHADataSource());
```

### Acceptance Criteria

- [ ] `NHADataSource` class implements `ProjectDataSource`
- [ ] Can create a project with `source: 'nha'` and `sourceConfig.nhaEndpoint`
- [ ] `GET /api/projects/:id/nha/agents` returns the 42-agent roster
- [ ] `GET /api/projects/:id/nha/sessions` lists Geth sessions
- [ ] `POST /api/projects/:id/nha/run` submits a task and returns session ID
- [ ] `npm run build` succeeds with no type errors
- [ ] Works against the live NHA API at `https://nothumanallowed.com/api/v1`

### Do NOT

- Do NOT add heavy HTTP client libraries — use `axios` (already a dependency) or Node `fetch`
- Do NOT store private keys in plain text in production (document the MVP caveat)
- Do NOT modify existing GitHub or OpenClaw data sources
- Do NOT modify the frontend (TASK-D2-5)
- Do NOT implement full Geth consensus visualization (that's future work beyond this task)

### Handoff Notes

[Updated by cursor when status changes]
