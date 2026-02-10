## Instruction: D1-1 Project Setup

**Agent**: Lovable  
**Task**: TASK-D1-1-PROJECT-SETUP  
**Priority**: P0-Critical  
**Type**: Create

### Objective
Set up the Open Artel Dashboard frontend project using React 18, TypeScript 5, Vite 5, Tailwind CSS 3, and shadcn/ui. This is the foundation for all subsequent dashboard work.

### Task Reference
Full specifications: `.ai/tasks/dashboard-subtasks/TASK-D1-1-PROJECT-SETUP.md`

### Step-by-Step Instructions

1. **Create Lovable Project**
   - Go to https://lovable.dev
   - Create new project named "Open Artel Dashboard"
   - Select React + TypeScript + Vite template
   - Enable Tailwind CSS

2. **Install Dependencies**
   ```bash
   npm install @tanstack/react-query zustand socket.io-client recharts framer-motion date-fns
   npm install -D @types/node
   ```

3. **Install shadcn/ui Components**
   ```bash
   npx shadcn add button card dialog input select tabs badge avatar separator scroll-area
   npx shadcn add dropdown-menu navigation-menu tooltip sheet
   ```

4. **Set Up Project Structure**
   ```
   src/
   ├── components/
   │   ├── ui/              # shadcn components
   │   ├── layout/          # Layout components
   │   ├── tasks/           # Task-related components
   │   ├── chat/            # Chat components
   │   └── lifecycle/       # Lifecycle visualizer
   ├── pages/
   │   ├── Dashboard.tsx
   │   ├── Tasks.tsx
   │   ├── Chat.tsx
   │   ├── Settings.tsx
   │   └── TaskDetail.tsx
   ├── hooks/
   │   ├── useTasks.ts
   │   ├── useWebSocket.ts
   │   ├── useGitHub.ts
   │   └── useConfig.ts
   ├── services/
   │   ├── api.ts
   │   ├── github.ts
   │   └── websocket.ts
   ├── stores/
   │   ├── taskStore.ts
   │   ├── projectStore.ts
   │   ├── chatStore.ts
   │   └── configStore.ts
   ├── types/
   │   └── index.ts
   └── lib/
       └── utils.ts
   ```

5. **Configure Environment**
   - Create `.env.example` with:
     ```
     VITE_BACKEND_URL=http://localhost:3001
     VITE_GITHUB_CLIENT_ID=
     ```
   - Ensure `.env` is in `.gitignore`

6. **Create Base Types** (`src/types/index.ts`)
   - Define Task, Project, Commit, Review, ChatMessage types
   - Reference task brief for full type definitions

7. **Set Up Routing**
   - Install `react-router-dom`
   - Configure routes for Dashboard, Tasks, Chat, Settings, TaskDetail

8. **Create Layout Components**
   - Sidebar navigation
   - Header with project selector
   - Main content area

### Acceptance Criteria (Must Verify)

- [ ] Lovable project created and accessible
- [ ] All dependencies installed without errors
- [ ] shadcn/ui components working
- [ ] Project structure matches specification
- [ ] TypeScript compilation successful
- [ ] Dev server starts without errors
- [ ] Basic routing functional
- [ ] Environment variables configured

### Do NOT

- Skip TypeScript strict mode
- Add unnecessary dependencies
- Modify the file structure without reason
- Skip the shadcn/ui setup

### Commit Format

When submitting work:
```
[AGENT:lovable] [ACTION:submit] [TASK:D1-1] Project setup complete
```

### Handoff Notes

After completion:
1. Share Lovable project link
2. Ensure all team members can access
3. Backend team (Cursor) will need the project structure for API integration
