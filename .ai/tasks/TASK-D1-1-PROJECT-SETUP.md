## TASK-D1-1-PROJECT-SETUP: Dashboard Project Setup

- **Status**: PENDING
- **Assigned**: cursor
- **Priority**: P1-Critical
- **Type**: Create
- **Depends on**: none
- **Blocks**: TASK-D1-3, TASK-D1-4, TASK-D1-5, TASK-D1-6

### Context

This is the foundational task for the Open Artel Dashboard project. We need to create a standalone Lovable project with the complete React + TypeScript + Vite + Tailwind + shadcn/ui stack.

### Objective

Create the Lovable dashboard project with all core dependencies and project structure.

### Specifications

**Tech Stack**:
- React 18 + TypeScript 5 + Vite 5 + Tailwind 3 + shadcn/ui
- React Query (server state)
- Zustand (client state)
- Socket.io-client (WebSocket client)
- Recharts (visualization)
- React Router (routing)

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
└── types/
    ├── project.ts
    ├── task.ts
    └── agent.ts
```

**Required shadcn/ui Components**:
- Button, Card, Badge, Avatar, Tabs, Dialog, Dropdown Menu
- Table, Input, Textarea, Select, Skeleton, ScrollArea
- Additional: Data Table, Command (for search)

### Acceptance Criteria

- [ ] Lovable project created with Vite + React + TypeScript template
- [ ] Tailwind CSS configured with custom theme colors
- [ ] shadcn/ui initialized and all required components installed
- [ ] All dependencies installed: @tanstack/react-query, zustand, socket.io-client, recharts, react-router-dom
- [ ] Project structure created with all folders and placeholder files
- [ ] Type definitions created (Project, Task, Agent types)
- [ ] Basic routing setup with React Router
- [ ] Zustand stores created (projectStore, taskStore, chatStore skeletons)
- [ ] React Query client configured
- [ ] README with setup instructions
- [ ] Build passes with no type errors (`npm run build`)

### Do NOT

- Skip any required dependencies
- Use different tech stack than specified
- Create the backend in this task (that's D1.2)
- Implement feature logic (just skeletons/placeholders)

### Handoff Notes

This is a blocking task for the frontend components. Ensure the project builds successfully before marking DONE.
