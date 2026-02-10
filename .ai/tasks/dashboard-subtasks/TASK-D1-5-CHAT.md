## TASK-CONCEPT-1-DASHBOARD-D1-5-CHAT: Kimi Chat Interface

- **Status**: PENDING
- **Assigned**: (to be assigned)
- **Priority**: P1-High
- **Type**: Create
- **Depends on**: TASK-CONCEPT-1-DASHBOARD-D1-1-SETUP, TASK-CONCEPT-1-DASHBOARD-D1-2-BACKEND
- **Blocks**: none

### Context

Part of the Open Artel Dashboard project. This task implements the real-time chat interface for communicating with the Kimi overseer.

### Objective

Build a WebSocket-based chat interface that allows users to:
1. Send messages to Kimi overseer
2. Receive streaming responses in real-time
3. View conversation history
4. Include project/task context in conversations

### Specifications

**Frontend Components**:
- `Chat.tsx` - Main chat page
- `components/chat/ChatPanel.tsx` - Reusable chat panel
- `components/chat/MessageList.tsx` - Message display with streaming
- `components/chat/MessageInput.tsx` - Input with send button
- `components/chat/StreamingText.tsx` - Streaming text animation

**Hooks**:
- `hooks/useKimiChat.ts` - Kimi chat hook with WebSocket
- `hooks/useWebSocket.ts` - Generic WebSocket hook

**Services**:
- `services/kimi.ts` - Kimi API service
- `services/websocket.ts` - WebSocket client

**Stores**:
- `stores/chatStore.ts` - Chat state management

**Backend** (if using backend):
- WebSocket endpoint `/ws/kimi` for chat
- Kimi API proxy with streaming support
- Message history storage

**Features**:
- WebSocket connection for real-time streaming
- Chat history (persisted in backend or localStorage)
- Project context awareness (which project is being viewed)
- Task context (can reference current task)
- Streaming responses (see Kimi's response as generated)
- Error handling and reconnection
- Typing indicators

**Tech Stack**:
- React 18 + TypeScript 5
- Socket.io-client or native WebSocket
- Zustand for state

### Acceptance Criteria

- [ ] Chat interface UI built with shadcn/ui components
- [ ] WebSocket connection established to backend
- [ ] Messages send and receive correctly
- [ ] Streaming responses display word-by-word
- [ ] Chat history persists across sessions
- [ ] Project context included in prompts
- [ ] Task context available when viewing specific task
- [ ] Error handling for connection failures
- [ ] Responsive design works on mobile
- [ ] TypeScript types defined for all chat entities

### Do NOT

- Hardcode API keys in frontend
- Skip error handling for WebSocket failures
- Store sensitive data in localStorage without encryption

### Handoff Notes

- Requires backend WebSocket server (D1-2) to be functional
- Kimi API key should be stored securely in backend only
- Consider rate limiting for API calls
