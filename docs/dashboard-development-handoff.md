# Open Artel Dashboard: Development Team Handoff

> **Purpose:** Onboard new developers joining the Open Artel Dashboard project. This is the single document to read first for alignment, context, setup, and next steps.
>
> **Audience:** Developers, Lovable agents, and anyone contributing to the dashboard.
>
> **Last updated:** 2026-02-11

---

## Table of Contents

1. [What Is the Dashboard](#1-what-is-the-dashboard)
2. [Where Everything Lives](#2-where-everything-lives)
3. [Development History](#3-development-history)
4. [Tech Stack](#4-tech-stack)
5. [Setup and Running](#5-setup-and-running)
6. [Architecture Overview](#6-architecture-overview)
7. [Known Issues and Roadmap](#7-known-issues-and-roadmap)
8. [Key Documents](#8-key-documents)
9. [Conventions](#9-conventions)

---

## 1. What Is the Dashboard

The **Open Artel Dashboard** is a standalone web application for visualizing and interacting with multi-agent AI development projects that use the Open Artel coordination system.

**Core capabilities:**

- **Project management** -- list, add, configure monitored GitHub projects
- **Task pipeline** -- view tasks from `.ai/tasks/` with status filters and lifecycle timelines
- **Agent status** -- see which agents (Claude, Cursor, Lovable, Kimi) are active and what they're working on
- **Commit history** -- browse commits with parsed routing headers (`[AGENT:x] [ACTION:y] [TASK:z]`)
- **File browser** -- navigate repository files and view content
- **Kimi chat** -- real-time chat with the Kimi overseer via WebSocket streaming
- **Settings** -- connection URLs, API keys, project defaults, appearance (dark/light mode)

---

## 2. Where Everything Lives

There are **two repos** involved:

| Repo | URL | Contains | Who works here |
|------|-----|----------|----------------|
| **open-artel-dashboard** | https://github.com/AgentArtel/open-artel-dashboard | Frontend app (the main development workspace) | Dev team, Lovable |
| **open-artel-project-setup** | https://github.com/AgentArtel/open-artel-project-setup | Backend API (`dashboard-backend/`), internal frontend reference (`dashboard-frontend/`), coordination layer (`.ai/`), docs, scripts | Backend devs, system architects |

**How they connect:**

```
open-artel-dashboard (Frontend)         open-artel-project-setup (Backend)
+-------------------------------+       +-------------------------------+
|  React + Vite + TypeScript    |       |  dashboard-backend/           |
|  Radix UI + Zustand           |       |  Node + Express + TypeScript  |
|  socket.io-client             |       |  Socket.io server             |
|                               |       |                               |
|  VITE_API_BASE_URL ------REST---------> /api/projects                 |
|                      ------REST---------> /api/tasks, /commits, etc.  |
|                      ------REST---------> /api/kimi/chat              |
|  VITE_WS_URL ---------WebSocket-------> Real-time events              |
+-------------------------------+       +-------------------------------+
                                                     |
                                                     | uses
                                                     v
                                              GitHub API + Kimi API
```

**Key takeaway:** Clone **open-artel-dashboard** to work on the frontend. Clone **open-artel-project-setup** to run or modify the backend.

---

## 3. Development History

### 3.1 Concept 1 Dashboard

The dashboard was conceived as a standalone app ("Concept 1") to visualize Open Artel projects. It was decomposed into seven subtasks:

| ID | Subtask | Status |
|----|---------|--------|
| D1-1 | Project setup (scaffolding, deps) | Done |
| D1-2 | Backend API (Express, routes, WebSocket) | Done |
| D1-3 | GitHub API integration | Done |
| D1-4 | Task lifecycle visualizer | Pending |
| D1-5 | Kimi chat interface | Pending |
| D1-6 | Configuration/settings | Pending |
| D1-7 | Documentation | In progress |

### 3.2 Two parallel frontend tracks

Two independent frontend implementations were built and compared:

**Internal frontend** (`dashboard-frontend/` in project-setup):
- Built by the Cursor agent following a phased plan (Phases 1.1 and 1.2 completed; later phases pending).
- **Audit score: 7.5/10 (B+).**
- Strengths: clean architecture, full TypeScript, all 7 UI sections present.
- Gaps: no Settings UI, no health check, empty hooks directory, no Zustand, no pagination.
- Served as a useful reference and first draft.

**External frontend** (`open-artel-dashboard` repo):
- Built by an external agent (Kimi K2.5), then reviewed and improved over two iterations.
- **Audit score: 9/10 (A-).**
- Strengths: Zustand state management, Radix UI (50+ shadcn components), custom hooks, Settings UI with 4 tabs, WebSocket reconnection, health check integration.
- Remaining gaps: API keys not sent to backend headers (P0), pagination (P1), some console.logs (P2).
- **This is the primary frontend and the one the team will develop going forward.**

### 3.3 Why two frontends?

The parallel-build approach was deliberate: compare an internal agent's output against an external agent's output, audit both, and use the stronger one as the production codebase. The external frontend won on architecture, features, and UX. The internal frontend remains in project-setup as a reference.

### 3.4 Backend

The backend (`dashboard-backend/` in project-setup) is a Node/Express/TypeScript server that:
- Provides REST endpoints for projects, tasks, agents, commits, files, repos, reviews, and reports.
- Proxies Kimi chat via `/api/kimi/chat` (so API keys stay server-side).
- Serves WebSocket events for real-time updates (task changes, new commits, agent status, Kimi streaming).
- Integrates with the GitHub API using a Personal Access Token.

---

## 4. Tech Stack

### Frontend (open-artel-dashboard)

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3 |
| UI components | Radix UI / shadcn/ui (40+ components) |
| State management | Zustand (stores: project, task, agent, chat, settings) |
| Routing | React Router v6 |
| WebSocket | socket.io-client 4.7 |
| Icons | Lucide React |
| Date formatting | date-fns |
| Theme | Dark/light mode |

### Backend (open-artel-project-setup/dashboard-backend)

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| WebSocket | Socket.io |
| External APIs | GitHub REST API, Moonshot/Kimi API |
| Data | In-memory project store + GitHub API reads |

---

## 5. Setup and Running

### 5.1 Backend (required first)

```bash
# Clone the project-setup repo (if you don't already have it)
git clone https://github.com/AgentArtel/open-artel-project-setup.git
cd open-artel-project-setup/dashboard-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and set:
#   GITHUB_TOKEN=ghp_your_token   (required -- create at github.com/settings/tokens, scopes: repo, read:org)
#   KIMI_API_KEY=sk_your_key      (required for Kimi chat -- get from platform.moonshot.cn)
#   PORT=3001                     (default)
#   CORS_ORIGIN=http://localhost:5173

# Verify config
npm run env:check

# Start development server
npm run dev
```

The backend will be running at `http://localhost:3001`.

### 5.2 Frontend

```bash
# Clone the dashboard repo
git clone https://github.com/AgentArtel/open-artel-dashboard.git
cd open-artel-dashboard

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# .env should contain:
#   VITE_API_BASE_URL=http://localhost:3001
#   VITE_WS_URL=ws://localhost:3001

# Start development server
npm run dev
```

The frontend will be running at `http://localhost:5173`. Make sure the backend is running first.

### 5.3 What you should see

- **Dashboard page** listing any projects you've added.
- **Add Project** button to monitor a GitHub repo.
- **Sidebar** navigation to Tasks, Agents, Commits, Files, Kimi Chat, Settings.
- **WebSocket indicator** in the header showing connection status.
- **Settings page** for API keys, connection URLs, appearance.

If tasks, commits, or agents are empty, that's normal -- the data comes from the GitHub repo's `.ai/` directory and commit history once a project is added.

---

## 6. Architecture Overview

### Frontend structure (open-artel-dashboard)

```
src/
├── components/
│   ├── ui/              # Radix/shadcn design system (40+ components)
│   ├── layout/          # Header, Sidebar, MainLayout, WebSocketStatus
│   ├── chat/            # KimiChat
│   └── projects/        # ProjectSettingsDialog
├── hooks/               # useApi, useWebSocket, useProject, useTasks, use-mobile
├── lib/                 # api.ts, websocket.ts, utils.ts, constants.ts
├── pages/               # Dashboard, TaskList, TaskDetail, AgentStatus,
│                        #   CommitHistory, FileBrowser, SettingsPage, etc.
├── stores/              # Zustand: projectStore, taskStore, agentStore,
│                        #   chatStore, settingsStore
├── types/               # TypeScript types (mirrors backend types exactly)
└── App.tsx              # Root component with routing
```

### Backend structure (dashboard-backend)

```
src/
├── config/              # Environment and config
├── routes/              # Express route handlers
│   ├── projects.ts      # CRUD for monitored projects
│   ├── tasks.ts         # Task listing and details
│   ├── agents.ts        # Agent status from .ai/status.md
│   ├── commits.ts       # Commit history from GitHub API
│   ├── files.ts         # File content from GitHub API
│   ├── repos.ts         # List GitHub repos for the authenticated user
│   ├── kimi.ts          # Kimi chat proxy
│   ├── reviews.ts       # Review file listing
│   └── reports.ts       # Report file listing
├── services/
│   └── github.ts        # GitHub API client
├── store/
│   └── projects.ts      # In-memory project store
├── types/
│   └── index.ts         # Shared TypeScript types
└── websocket/
    ├── index.ts          # Socket.io server setup
    └── handlers.ts       # WebSocket event handlers
```

### API endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects` | GET, POST | List / add projects |
| `/api/projects/:owner/:repo` | GET, PUT, DELETE | Get / update / remove project |
| `/api/projects/:owner/:repo/tasks` | GET | List tasks (reads `.ai/tasks/`) |
| `/api/projects/:owner/:repo/tasks/:taskId` | GET | Task details |
| `/api/projects/:owner/:repo/tasks/:taskId/lifecycle` | GET | Task lifecycle events |
| `/api/projects/:owner/:repo/agents` | GET | Agent status (reads `.ai/status.md`) |
| `/api/projects/:owner/:repo/commits` | GET | Commit history (GitHub API) |
| `/api/projects/:owner/:repo/commits/:sha` | GET | Single commit details |
| `/api/projects/:owner/:repo/files/*` | GET | File content (GitHub API) |
| `/api/repos` | GET | List user's GitHub repos |
| `/api/kimi/chat` | POST | Proxy to Kimi/Moonshot API |
| `/api/health` | GET | Health check |

All endpoints return `{ success: boolean, data?: T, error?: string }`.

### WebSocket events

| Direction | Event | Payload |
|-----------|-------|---------|
| Client -> Server | `join:project` | `{ owner, repo }` |
| Client -> Server | `leave:project` | `{ owner, repo }` |
| Client -> Server | `kimi:chat` | `{ message, context? }` |
| Server -> Client | `task:update` | Task object |
| Server -> Client | `commit:new` | Commit object |
| Server -> Client | `task:lifecycle` | Lifecycle event |
| Server -> Client | `agent:status` | Agent status update |
| Server -> Client | `kimi:stream` | Streaming chat chunk |

---

## 7. Known Issues and Roadmap

### Priority 0 (Critical -- fix first)

| Issue | Details |
|-------|---------|
| **API keys not sent to backend** | The frontend Settings UI collects API keys but they are not included in request headers to the backend. The backend needs `GITHUB_TOKEN` and `KIMI_API_KEY` from its own `.env`, but the frontend should also be able to pass user-configured keys via headers for multi-user scenarios. |

### Priority 1 (High)

| Issue | Details |
|-------|---------|
| **No pagination** | Task lists, commit history, and file listings load everything at once. Add cursor-based or offset pagination for large datasets. |
| **Backend persistence** | Project store is in-memory; restarting the backend loses added projects. Consider adding file-based or database persistence (Supabase is a natural fit if Lovable manages the project). |

### Priority 2 (Medium)

| Issue | Details |
|-------|---------|
| **Console.logs remain** | Some debugging console.log statements are still in the external frontend codebase. Remove or replace with proper logging. |
| **Task lifecycle visualizer** | D1-4 (streaming timeline showing task progression through commits, reviews, approvals) is designed but not yet implemented. |
| **Kimi chat** | D1-5 (full chat interface with context-aware prompts) needs completion -- basic streaming works but context injection and history need polish. |

### Possible future directions

- **Supabase integration:** If Lovable manages the dashboard repo, it may introduce Supabase for authentication, database, and real-time subscriptions, potentially replacing or supplementing the Express backend.
- **Deploy:** Connect the dashboard repo to Lovable for hosting and automatic deploys.
- **Roadmap view:** Sprint timeline with dependencies (D1-4 extension).
- **Project workforce view:** Agent skills, configurations, metrics visualization.

---

## 8. Key Documents

### In the dashboard repo (open-artel-dashboard)

| Document | What it covers |
|----------|---------------|
| `README.md` | App features, structure, installation, API reference |
| `HANDOFF.md` | Quick-start handoff for new developers |
| `docs/CONSOLIDATED-REVIEW.md` | First audit of the external frontend |
| `docs/REVIEW-V002.md` | Second-round review after improvements |
| `COMPREHENSIVE_REVIEW.md` | Detailed post-update review (9/10 assessment) |
| `.env.example` | Frontend environment variables template |

### In project-setup (open-artel-project-setup)

| Document | What it covers |
|----------|---------------|
| `docs/dashboard-development-handoff.md` | This document (full handoff) |
| `docs/dashboard-lovable-separate-repo.md` | How the dashboard was separated into its own repo |
| `dashboard-backend/README.md` | Backend setup, API endpoints, WebSocket events |
| `dashboard-backend/.env.example` | Backend environment variables template |
| `dashboard-frontend/AUDIT-REPORT.md` | Internal frontend audit (7.5/10) |
| `dashboard-frontend-external/app/COMPREHENSIVE_REVIEW.md` | External frontend audit (9/10) |
| `.ai/agent-chats/frontend-pm-internal/reports/COMPLETE-FRONTEND-PLAN.md` | 6-phase frontend development plan |
| `.ai/tasks/TASK-CONCEPT-1-DASHBOARD.md` | Original Concept 1 task brief |
| `.ai/tasks/dashboard-subtasks/` | D1-1 through D1-7 subtask briefs |

---

## 9. Conventions

### Commit messages (project-setup)

The project-setup repo uses structured commit messages for multi-agent coordination:

```
[AGENT:cursor] [ACTION:submit] [TASK:D1-2] Backend API complete
```

Format: `[AGENT:agent] [ACTION:action] [TASK:task-id] Short description`

Valid agents: `claude`, `cursor`, `lovable`, `kimi`.  
Valid actions: `submit`, `approve`, `reject`, `update`, `report`, `delegate`, `merge`.

See `.ai/templates/commit-message.md` for the full specification.

### Commit messages (dashboard repo)

The dashboard repo does not require routing headers. Use clear, conventional commit messages (e.g. `fix: send API keys in request headers`, `feat: add pagination to task list`).

### Code style

- TypeScript strict mode; avoid `any`, use `unknown` and narrow.
- Functional components, named exports, PascalCase for components.
- Tailwind utility classes; use `cn()` for conditional merging.
- Zustand stores organized by domain.
- API responses typed with `ApiResponse<T>`.

### Getting help

- Open an issue on the relevant repo.
- Check `.ai/reviews/` in project-setup for past review feedback.
- Check `.ai/tasks/` for task context and acceptance criteria.

---

**Welcome to the team. Start by cloning both repos, running the backend and frontend, and adding your first project to the dashboard.**
