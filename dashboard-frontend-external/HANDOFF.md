# Dashboard Development Handoff

Welcome to the Open Artel Dashboard. This document gets you up to speed quickly.

For the full handoff with development history, architecture, and all references, see the [complete handoff document](https://github.com/AgentArtel/open-artel-project-setup/blob/main/docs/dashboard-development-handoff.md) in the project-setup repo.

---

## What Is This

A web dashboard for managing and visualizing multi-agent AI development projects that use the Open Artel coordination system. Features include project management, task pipelines, agent status, commit history with parsed routing headers, a file browser, Kimi chat, and real-time WebSocket updates.

## Two Repos

| Repo | What | Clone for |
|------|------|-----------|
| **open-artel-dashboard** (this repo) | Frontend app (React + Vite + TypeScript) | UI development |
| [open-artel-project-setup](https://github.com/AgentArtel/open-artel-project-setup) | Backend API (`dashboard-backend/`), docs, coordination | Running the backend |

The frontend talks to the backend via REST and WebSocket. Both must be running for full functionality.

## Quick Start

### 1. Start the backend

```bash
git clone https://github.com/AgentArtel/open-artel-project-setup.git
cd open-artel-project-setup/dashboard-backend
npm install
cp .env.example .env
# Edit .env: set GITHUB_TOKEN and KIMI_API_KEY
npm run dev
# Backend runs at http://localhost:3001
```

**Required env vars:**
- `GITHUB_TOKEN` -- GitHub Personal Access Token (scopes: `repo`, `read:org`). Create at https://github.com/settings/tokens
- `KIMI_API_KEY` -- Moonshot/Kimi API key from https://platform.moonshot.cn

### 2. Start the frontend

```bash
# In this repo (open-artel-dashboard)
npm install
cp .env.example .env
# .env should contain:
#   VITE_API_BASE_URL=http://localhost:3001
#   VITE_WS_URL=ws://localhost:3001
npm run dev
# Frontend runs at http://localhost:5173
```

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Radix UI (shadcn), Zustand, React Router, socket.io-client, Lucide icons
- **Backend:** Node.js, Express, TypeScript, Socket.io, GitHub API, Kimi API proxy

## Project Structure

```
src/
├── components/ui/       # 40+ Radix/shadcn design system components
├── components/layout/   # Header, Sidebar, MainLayout
├── components/chat/     # KimiChat
├── hooks/               # useApi, useWebSocket, useProject, useTasks
├── lib/                 # API client, WebSocket client, utilities
├── pages/               # Dashboard, TaskList, AgentStatus, CommitHistory, etc.
├── stores/              # Zustand stores (project, task, agent, chat, settings)
├── types/               # TypeScript types (mirrors backend exactly)
└── App.tsx              # Root with routing
```

## Known Issues (fix these first)

| Priority | Issue | Details |
|----------|-------|---------|
| P0 | API keys not sent to backend | Settings UI collects keys but doesn't include them in request headers |
| P1 | No pagination | Large lists load everything at once |
| P2 | Console.logs remain | Some debug logging left in codebase |

## Key Documents

- `README.md` -- Full feature list, installation, API reference
- `COMPREHENSIVE_REVIEW.md` -- Detailed audit (9/10 rating)
- `docs/CONSOLIDATED-REVIEW.md` -- First-round review
- `docs/REVIEW-V002.md` -- Second-round improvements
- `.env.example` -- Environment template

For backend docs, see `dashboard-backend/README.md` in the project-setup repo.

## Development Notes

- TypeScript strict mode; avoid `any`.
- Tailwind utility classes; `cn()` for conditional class merging.
- Zustand stores organized by domain (project, task, agent, chat, settings).
- API responses typed with `ApiResponse<T>`.
- All API endpoints return `{ success, data?, error? }`.
- WebSocket events: `task:update`, `commit:new`, `agent:status`, `kimi:stream`.

---

**Start by running both repos, adding a project, and exploring the dashboard.**
