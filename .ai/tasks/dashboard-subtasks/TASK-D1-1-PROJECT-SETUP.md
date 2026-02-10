## TASK-D1-1: Project Setup — Lovable Frontend Foundation

- **Status**: PENDING
- **Assigned**: lovable
- **Priority**: P1-Critical
- **Type**: Create
- **Depends on**: none
- **Blocks**: TASK-D1-4, TASK-D1-5, TASK-D1-6

### Context

This is the first sub-task of TASK-CONCEPT-1-DASHBOARD. We need to create a standalone Lovable dashboard project with the full frontend foundation before building individual features.

### Objective

Create a new Lovable project with React 18 + TypeScript 5 + Vite 5 + Tailwind 3 + shadcn/ui. Set up the complete project structure, install all dependencies, and establish routing and base components.

### Specifications

**Tech Stack**:
- React 18 + TypeScript 5 + Vite 5
- Tailwind CSS 3
- shadcn/ui component library
- React Query (TanStack Query) for server state
- Zustand for client state
- React Router v6 for routing
- Socket.io-client for WebSocket
- Recharts for data visualization

**Project Structure**:
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── dashboard/       # Dashboard components
│   ├── tasks/           # Task-related components
│   ├── agents/          # Agent status components
│   ├── chat/            # Kimi chat components
│   └── visualization/   # Task lifecycle visualizer
├── pages/
│   ├── Dashboard.tsx
│   ├── ProjectDetail.tsx
│   ├── TaskPipeline.tsx
│   ├── TaskLifecycle.tsx
│   ├── Agents.tsx
│   ├── Roadmap.tsx
│   └── Chat.tsx
├── hooks/
│   ├── useGitHub.ts
│   ├── useKimiChat.ts
│   ├── useTaskStream.ts
│   └── useWebSocket.ts
├── services/
│   ├── github.ts
│   ├── kimi.ts
│   └── websocket.ts
├── stores/
│   ├── projectStore.ts
│   ├── taskStore.ts
│   └── chatStore.ts
├── types/
│   ├── project.ts
│   ├── task.ts
│   ├── agent.ts
│   └── chat.ts
└── lib/
    └── utils.ts
```

**Dependencies to Install**:
```bash
# Core
npm install react-router-dom @tanstack/react-query zustand

# WebSocket
npm install socket.io-client

# Visualization
npm install recharts

# Utilities
npm install date-fns lucide-react clsx tailwind-merge
```

**shadcn/ui Components Needed**:
- button
- card
- dialog
- dropdown-menu
- input
- select
- separator
- sheet
- skeleton
- table
- tabs
- textarea
- toast
- tooltip
- badge
- avatar

### Acceptance Criteria

- [ ] Lovable project created with React + TypeScript + Vite + Tailwind + shadcn/ui
- [ ] All dependencies installed (React Query, Zustand, Socket.io-client, Recharts)
- [ ] shadcn/ui initialized and base components installed
- [ ] Project structure matches specification exactly
- [ ] React Router configured with all page routes
- [ ] TypeScript types defined for Project, Task, Agent, and Chat
- [ ] Zustand stores created for project, task, and chat state
- [ ] Base layout component with navigation sidebar
- [ ] Development server runs without errors (`npm run dev`)
- [ ] Build passes without errors (`npm run build`)

### Do NOT

- Skip TypeScript strict mode
- Skip any dependencies (they'll be needed by downstream tasks)
- Create placeholder components with no structure

### Handoff Notes

When complete, commit with: `[AGENT:lovable] [ACTION:submit] [TASK:D1-1] Project setup complete`

Next tasks waiting: D1-4 (Task Lifecycle Visualizer), D1-5 (Kimi Chat UI), D1-6 (Configuration UI)
