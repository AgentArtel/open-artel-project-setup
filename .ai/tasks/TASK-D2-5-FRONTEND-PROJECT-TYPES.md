## TASK-D2-5: Frontend Project Type Awareness — Multi-Source Dashboard UI

- **Status**: PENDING
- **Assigned**: cursor
- **Priority**: P1-High
- **Type**: Modify
- **Depends on**: TASK-D2-1 (data source abstraction), at least one of TASK-D2-2/D2-3/D2-4
- **Blocks**: none

### Context

After the backend supports multiple data source types (TASK-D2-1), the frontend needs to:
1. Let users choose the source type when adding a project
2. Display source-specific UI per project type
3. Show a unified overview across all project types

The external frontend lives in `dashboard-frontend-external/app/` and uses React + TypeScript + Zustand + Tailwind + shadcn/ui.

### Objective

Update the dashboard frontend so it is aware of project source types and renders appropriate UI per type, while keeping existing GitHub project views working identically.

### Specifications

**1. Update TypeScript types** (`src/types/` or inline):

Mirror the backend's `ProjectSource` and `ProjectSourceConfig` types in the frontend.

**2. Update "Add Project" flow** (`src/pages/Dashboard.tsx`):

Currently supports GitHub URL paste, repo picker, and manual entry — all GitHub-only. Add a source type selector:

- **GitHub** (default): existing flow unchanged
- **OpenClaw**: asks for Gateway URL (`ws://host:18789`), tests connection
- **NHA**: asks for NHA API endpoint, optional API key
- **Game**: asks for game server URL, tests health endpoint
- **Local Git**: asks for filesystem path (for future use)

Each source type shows only the relevant config fields.

**3. Update project cards** (`src/pages/Dashboard.tsx`):

Show a visual indicator of source type on each project card:
- GitHub: GitHub icon
- OpenClaw: a "claw" or agent icon
- NHA: shield or multi-agent icon
- Game: game controller icon
- Local: folder icon

Use Lucide icons (already installed).

**4. Source-specific detail views:**

When viewing a project, the sidebar navigation adapts:

| Source | Nav items |
|--------|-----------|
| `github` | Tasks, Agents, Commits, Files, Reviews, Reports (existing) |
| `openclaw` | Agents, Skills, Sessions, Chat, Tasks*, Commits* (* if also GitHub-linked) |
| `nha` | Agents (42), Sessions, Feed, Run Task |
| `game` | Agents (NPCs), World, Quests, Health |

Reuse existing page components where they apply. Create new page shells for source-specific views (they can start as "Coming soon" placeholders that show the data shape).

**5. Update project store** (`src/stores/projectStore.ts`):

- Include `source` and `sourceConfig` in project CRUD
- Pass source info when creating projects via API

**6. Unified dashboard overview:**

On the main Dashboard page, add a summary row above the project list:
- Total projects by type (e.g., "3 GitHub, 1 OpenClaw, 1 NHA")
- Total active agents across all projects
- Overall health status

This can be a simple summary bar — not a complex analytics dashboard.

**7. Update Settings page:**

Add a "Connected Systems" or "Integrations" section that shows:
- GitHub: token status
- OpenClaw: any connected Gateways and their health
- NHA: connection status
- Kimi: API key status (existing)

### Acceptance Criteria

- [ ] "Add Project" supports selecting a source type
- [ ] Project cards show source type indicator
- [ ] Sidebar navigation adapts per source type
- [ ] OpenClaw project shows Agents/Skills/Sessions/Chat nav (content can be placeholder)
- [ ] NHA project shows Agents/Sessions/Feed/Run nav (content can be placeholder)
- [ ] Game project shows Agents/World/Quests/Health nav (content can be placeholder)
- [ ] GitHub projects work identically to before
- [ ] Dashboard summary shows project counts by type
- [ ] TypeScript compiles, ESLint passes
- [ ] Existing pages (tasks, commits, files, etc.) still work for GitHub projects

### Do NOT

- Do NOT rewrite existing page components — extend or wrap them
- Do NOT remove mock data support — it's still useful for demo/offline
- Do NOT add new npm dependencies beyond what's already installed (Lucide, shadcn/ui, Zustand all present)
- Do NOT implement full OpenClaw/NHA/Game detail pages (those evolve as backend tasks complete)
- Do NOT modify backend code (that's TASK-D2-1 through D2-4)

### Handoff Notes

[Updated by cursor when status changes]
