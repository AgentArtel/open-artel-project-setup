## TASK-CONCEPT-1-DASHBOARD: Open Artel Dashboard — Central Hub

- **Status**: PENDING
- **Assigned**: kimi
- **Priority**: P1-High
- **Type**: Create
- **Depends on**: none
- **Blocks**: none

### Context

We have a complete Open Artel multi-agent setup with:
- Full Kimi integration (7 phases + F1)
- Agent skills, session management, context optimization
- GitHub Actions workflows
- Commit-based communication
- Pattern library and lessons learned

We need a **standalone dashboard application** (separate Lovable project) to visualize and interact with Open Artel projects.

### Objective

Create a standalone Lovable dashboard project that provides:
1. **Project monitoring**: View all Open Artel projects, their status, tasks, agents
2. **Task pipeline visualization**: Kanban board of tasks with real-time updates
3. **Task lifecycle visualizer**: Streaming timeline showing task progression through commits, reviews, approvals
4. **Kimi chat interface**: Real-time WebSocket chat with Kimi overseer
5. **Agent status**: View active agents, their tasks, session health
6. **Roadmap view**: Sprint timeline, dependencies, progress
7. **Git history**: Commit timeline with routing headers parsed
8. **Project workforce**: View agent skills, configurations, metrics

### Specifications

**Tech Stack**:
- Frontend: React 18 + TypeScript 5 + Vite 5 + Tailwind 3 + shadcn/ui
- State: React Query (server state) + Zustand (client state)
- Real-time: WebSocket (Socket.io or native WebSocket)
- Backend (optional): Node.js + Express + WebSocket server
- Data Access: GitHub API, Git file reading, Moonshot API (via proxy)
- Visualization: Recharts or D3.js for task lifecycle diagrams

**Architecture**:
- Standalone project (separate repo or subdirectory)
- Hybrid data access: GitHub API for remote projects, direct file reading for local
- WebSocket for real-time updates (task status, commits, reviews)
- Kimi API proxy in backend (API keys never exposed to frontend)

**Core Features** (from plan):
1. Project Dashboard (list + detail views)
2. Task Pipeline (Kanban board)
3. Task Lifecycle Visualizer (streaming timeline)
4. Kimi Chat Interface (WebSocket streaming)
5. Agent Status View
6. Roadmap View
7. Git History & Development Log
8. Project Workforce View

**Data Sources**:
- GitHub API (repos, commits, branches, files)
- `.ai/status.md` (parsed markdown tables)
- `.ai/tasks/*.md` (task briefs)
- `.ai/reviews/*.md` (review feedback)
- `.ai/reports/*.md` (sprint summaries)
- `.ai/sessions/active/` (Kimi sessions)
- `.ai/metrics/` (context optimization data)
- `.agents/skills/` (agent capabilities)
- Git commit history (with routing header parsing)

**Implementation Approach**:
- Use Agent Swarm pattern for parallel development (frontend + backend teams)
- Break into sub-tasks for each major feature
- Test each component as it's built
- Deploy incrementally (MVP first, then enhancements)

### Acceptance Criteria

- [ ] Lovable project created with React + TypeScript + Vite + Tailwind + shadcn/ui
- [ ] All dependencies installed (React Query, Zustand, Socket.io-client, Recharts)
- [ ] Project structure matches plan (components/, pages/, hooks/, services/, stores/, types/)
- [ ] Backend API created (optional but recommended) with Express + WebSocket server
- [ ] GitHub API integration working (list repos, read commits, parse .ai/ files)
- [ ] Project Dashboard view displays project list and detail
- [ ] Task Pipeline view shows Kanban board with tasks from `.ai/status.md`
- [ ] Task Lifecycle Visualizer displays complete task history with streaming updates
- [ ] Kimi Chat Interface works with WebSocket streaming responses
- [ ] Agent Status view shows active agents and their current tasks
- [ ] Roadmap view displays sprint timeline and dependencies
- [ ] Git History view shows commit timeline with routing headers parsed
- [ ] Project Workforce view displays agent skills, configurations, metrics
- [ ] Real-time updates work (new commits trigger visualization updates)
- [ ] All views are responsive and performant
- [ ] Documentation complete (setup guide + usage guide)
- [ ] Project can be deployed (build passes, no type errors)

### Do NOT

- Modify existing Open Artel setup files (this is a NEW standalone project)
- Hardcode API keys in frontend (use backend proxy)
- Skip testing (each feature must be tested as built)
- Create monolithic components (use modular, reusable components)

### Handoff Notes

[To be updated by Kimi during task execution]

**Special Instructions for Kimi**:
- Use Agent Swarm pattern to parallelize development (create subagents for frontend, backend, testing)
- Break this large task into smaller sub-tasks using the task decomposition pattern
- Coordinate with Cursor for implementation work
- Test incrementally as features are built
- Document decisions and patterns as you go

