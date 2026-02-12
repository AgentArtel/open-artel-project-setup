# Open Artel Dashboard Frontend

A complete, production-ready frontend for the Open Artel Dashboard that integrates with the backend API to display project data, provide real-time updates via WebSocket, and includes a Kimi chat interface.

## Features

### Project Management
- **Dashboard**: List all monitored projects with add/remove functionality
- **Project Detail**: View project information with tabbed navigation

### Task Management
- **Task List**: Kanban-style board with status columns (Pending, In Progress, Review, Done, Blocked)
- **Task Filters**: Filter by status, priority, and assigned agent
- **Task Detail**: Full task view with objective, specifications, acceptance criteria, and lifecycle events

### Agent Status
- **Agent Dashboard**: Real-time view of all agents (claude, cursor, lovable, kimi)
- **Status Indicators**: Visual indicators for idle/working/blocked states
- **Current Task**: Shows what each agent is working on

### Commit History
- **Commit List**: View commit history with parsed routing headers
- **Routing Headers**: Visual badges for [AGENT:x], [ACTION:y], [TASK:z]
- **Filters**: Filter commits by agent and action

### File Browser
- **File Tree**: Browse repository files and directories
- **File Viewer**: Display file content with line numbers
- **Breadcrumb Navigation**: Easy navigation through directory structure

### Kimi Chat Interface
- **Floating Chat**: Accessible from any page
- **Context Awareness**: Chat with project/task context
- **Streaming Responses**: Real-time message streaming via WebSocket

### Real-time Updates
- **WebSocket Integration**: Live updates for tasks, commits, and agent status
- **Connection Status**: Visual indicator with reconnection logic
- **Toast Notifications**: New commit alerts and important events

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 3.x
- **UI Components**: shadcn/ui (40+ pre-installed components)
- **State Management**: Zustand
- **Routing**: React Router v6
- **WebSocket**: Socket.io-client 4.7.2
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **Theme**: Dark/Light mode support

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components (Header, Sidebar, MainLayout)
│   ├── tasks/           # Task-specific components
│   ├── agents/          # Agent status components
│   ├── commits/         # Commit list components
│   └── chat/            # Kimi chat components
├── hooks/               # Custom React hooks
│   ├── useApi.ts
│   ├── useWebSocket.ts
│   ├── useProject.ts
│   └── useTasks.ts
├── lib/                 # Utilities and configurations
│   ├── api.ts           # API client
│   ├── websocket.ts     # WebSocket client
│   ├── utils.ts         # Helper functions
│   └── constants.ts     # App constants
├── pages/               # Route-level page components
│   ├── Dashboard.tsx
│   ├── ProjectDetail.tsx
│   ├── TaskList.tsx
│   ├── TaskDetail.tsx
│   ├── AgentStatus.tsx
│   ├── CommitHistory.tsx
│   └── FileBrowser.tsx
├── stores/              # Zustand state stores
│   ├── projectStore.ts
│   ├── taskStore.ts
│   ├── agentStore.ts
│   └── chatStore.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── App.tsx              # Root component with routing
```

## Installation

### Prerequisites
- Node.js 20+
- Backend server running on `http://localhost:3001`

### Install Dependencies

```bash
cd /mnt/okcomputer/output/app
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Backend Integration

This frontend is designed to work with the Open Artel Dashboard Backend:

- **API Base URL**: `http://localhost:3001`
- **WebSocket URL**: `ws://localhost:3001`
- **CORS**: Configured for `http://localhost:5173`

### API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/projects` | GET, POST | List/add projects |
| `/api/projects/:owner/:repo` | GET, DELETE | Get/remove project |
| `/api/projects/:owner/:repo/tasks` | GET | List tasks |
| `/api/projects/:owner/:repo/tasks/:taskId` | GET | Task details |
| `/api/projects/:owner/:repo/agents` | GET | Agent status |
| `/api/projects/:owner/:repo/commits` | GET | Commit history |
| `/api/projects/:owner/:repo/files/*` | GET | File content |
| `/api/kimi/chat` | POST | Kimi chat |

### WebSocket Events

**Client → Server:**
- `join:project` - Subscribe to project updates
- `leave:project` - Unsubscribe from project
- `kimi:chat` - Send chat message

**Server → Client:**
- `task:update` - Task status changed
- `commit:new` - New commit detected
- `task:lifecycle` - Task lifecycle event
- `agent:status` - Agent status update
- `kimi:stream` - Streaming Kimi response

## Key Features Implemented

### Type Safety
- Full TypeScript support with strict mode
- Type definitions mirror backend types exactly
- API response types with `ApiResponse<T>` wrapper

### Error Handling
- Global error boundary (to be implemented)
- API error handling with user-friendly messages
- Network error detection and retry logic

### Loading States
- Skeleton loaders for all async operations
- Loading indicators for buttons and actions
- Smooth transitions between states

### WebSocket Reconnection
- Exponential backoff reconnection strategy
- Connection state indicators
- Automatic re-subscription after reconnection

### Responsive Design
- Mobile-friendly sidebar (collapsible)
- Responsive grid layouts
- Touch-friendly interactions

### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Color contrast compliance

## Known Issues / TODO

1. **npm install required**: The following packages need to be installed:
   - `react-router-dom`
   - `socket.io-client`
   - `zustand`

2. **Backend dependency**: Requires the Open Artel Dashboard Backend to be running

3. **GitHub Token**: Backend requires `GITHUB_TOKEN` for GitHub API access

4. **Kimi API Key**: Backend requires `KIMI_API_KEY` for chat functionality

## Development Notes

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/layout/Sidebar.tsx`

### Adding New API Endpoints

1. Add type definition in `src/types/index.ts`
2. Add API function in `src/lib/api.ts`
3. Create hook in `src/hooks/` (if needed)
4. Use in components

### State Management

- Use Zustand stores for global state
- Stores are organized by domain (project, task, agent, chat)
- WebSocket updates are handled in stores

### Styling Guidelines

- Use Tailwind CSS utility classes
- Use `cn()` helper for conditional classes
- Follow shadcn/ui design patterns
- Support dark/light mode

## License

MIT
