## TASK-D2-1: Backend Data Source Abstraction — Multi-Source Project Support

- **Status**: PENDING
- **Assigned**: cursor
- **Priority**: P1-High
- **Type**: Refactor
- **Depends on**: TASK-D1-2 (backend API — DONE), TASK-D1-3 (GitHub integration — DONE)
- **Blocks**: TASK-D2-2, TASK-D2-3, TASK-D2-4, TASK-D2-5

### Context

The dashboard backend (`dashboard-backend/`) is currently **100% GitHub-coupled**. Every route imports `githubService` directly. The `Project` type already has `isLocal: boolean` and `localPath?: string` fields that are stored but never read by any service code.

The dashboard is evolving into a **multi-project AI agent hub** (see IDEA-020) that needs to connect to:
- GitHub repos (existing — `.ai/` data via GitHub API)
- OpenClaw Gateway (WebSocket JSON-RPC at port 18789)
- NHA/Legion X (REST API at nothumanallowed.com)
- Game servers (Open-RPG — future)
- Local git repos (filesystem)

This task introduces the abstraction layer that makes all of that possible without rewriting existing functionality.

### Objective

Refactor the backend to support multiple data source types per project, while keeping existing GitHub functionality working identically. After this task, a project has a `source` type that determines which data source implementation is used.

### Specifications

**1. Add `source` discriminator to Project type** (`src/types/index.ts`):

```typescript
export type ProjectSource = 'github' | 'local-git' | 'openclaw' | 'nha' | 'game';

export interface ProjectSourceConfig {
  githubToken?: string;       // per-project override
  localPath?: string;         // for local-git
  gatewayUrl?: string;        // OpenClaw: ws://host:18789
  nhaEndpoint?: string;       // NHA: https://nothumanallowed.com/api/v1
  gameServerUrl?: string;     // Open-RPG game server
}

export interface Project {
  // ... existing fields
  source: ProjectSource;       // NEW — defaults to 'github'
  sourceConfig?: ProjectSourceConfig;  // NEW
}
```

**2. Create `ProjectDataSource` interface** (`src/services/datasource.ts`):

```typescript
export interface ProjectDataSource {
  listTasks(project: Project): Promise<TaskBrief[]>;
  getTask(project: Project, taskId: string): Promise<TaskBrief | null>;
  getTaskLifecycle(project: Project, taskId: string): Promise<TaskLifecycleEvent[]>;
  listCommits(project: Project, branch?: string, limit?: number): Promise<Commit[]>;
  getCommit(project: Project, sha: string): Promise<Commit | null>;
  getAgents(project: Project): Promise<Agent[]>;
  getFileContent(project: Project, path: string, ref?: string): Promise<string>;
  listDirectory(project: Project, path: string): Promise<FileItem[]>;
  listReviews(project: Project): Promise<Review[]>;
  listReports(project: Project): Promise<Report[]>;
  getStatusMd?(project: Project): Promise<StatusData | null>;
}
```

**3. Wrap existing `GitHubService` as `GitHubDataSource`** implementing the interface. This is a thin wrapper — the existing methods stay, the wrapper delegates to them.

**4. Create `DataSourceRegistry`** (`src/services/datasource-registry.ts`):

```typescript
export class DataSourceRegistry {
  private sources: Map<ProjectSource, ProjectDataSource>;
  register(type: ProjectSource, source: ProjectDataSource): void;
  resolve(project: Project): ProjectDataSource;
}
```

**5. Update all data routes** to resolve data source from project instead of importing `githubService` directly:

- `src/routes/tasks.ts` — look up project, resolve source, call `source.listTasks(project)`
- `src/routes/commits.ts` — same pattern
- `src/routes/agents.ts` — same pattern
- `src/routes/files.ts` — same pattern
- `src/routes/reviews.ts` — same pattern
- `src/routes/reports.ts` — same pattern

**6. Change URL scheme** from `/api/projects/:owner/:repo/*` to `/api/projects/:projectId/*`:

- `projectId` = URL-safe slug (for GitHub projects, use `owner--repo` or keep `owner/repo` with encoding)
- Routes look up the project from the store by ID
- Keep backward compat: if `projectId` contains `/`, treat as `owner/repo` for existing GitHub projects

**7. Update project creation** (`src/routes/projects.ts`):

- `POST /api/projects` accepts `source` field (defaults to `'github'`)
- `sourceConfig` stored alongside project
- Existing projects without `source` field default to `'github'` on load

**8. Default agents per source type**:

- `github`: `['claude', 'cursor', 'lovable', 'kimi']` (current behavior)
- `openclaw`: fetched dynamically from Gateway API
- `nha`: fetched from NHA API
- `game`: fetched from game server

For this task, only `github` has an implementation. Other sources return a "not implemented" placeholder until their specific tasks are done.

### Acceptance Criteria

- [ ] `Project` type has `source` and `sourceConfig` fields
- [ ] `ProjectDataSource` interface exists with all methods
- [ ] `GitHubDataSource` wraps existing `GitHubService` and implements the interface
- [ ] `DataSourceRegistry` registers and resolves data sources by type
- [ ] All 6 data routes (tasks, commits, agents, files, reviews, reports) use the registry instead of importing `githubService` directly
- [ ] Projects without a `source` field default to `'github'` (backward compat)
- [ ] `POST /api/projects` accepts `source` and `sourceConfig`
- [ ] Existing tests and health check still pass
- [ ] `npm run build` succeeds with no type errors
- [ ] Creating a project with `source: 'openclaw'` stores correctly (data fetches return "not implemented yet" until TASK-D2-2)

### Do NOT

- Do NOT remove or rename `GitHubService` — wrap it, don't replace it
- Do NOT implement OpenClaw, NHA, or game data sources (those are separate tasks)
- Do NOT change the frontend (that's TASK-D2-5)
- Do NOT add new npm dependencies (this is pure refactoring)
- Do NOT modify `.ai/` coordination files (except updating this task's status)
- Do NOT break existing GitHub project functionality — this must be invisible to current users

### Handoff Notes

[Updated by cursor when status changes]
