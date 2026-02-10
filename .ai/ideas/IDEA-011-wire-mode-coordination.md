## IDEA-011: Wire Mode custom coordination layer

- **Category**: Automation
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Build a custom coordination layer using Kimi Code's Wire Mode (JSON-RPC 2.0 protocol). This layer bridges Git events and agent actions, handling real-time events (TurnBegin, ToolCall, etc.) and routing them appropriately.

### Why It Matters

Provides full programmatic control over agent coordination. Wire Mode enables custom UIs, application integration, and sophisticated event-driven workflows.

### Open Questions

- What's the architecture? (separate service? integrated into Git hooks?)
- How do we handle Wire Mode events? (event loop? message queue?)
- What events are relevant? (TurnBegin, ToolCall, ApprovalRequest?)
- How do we handle errors and retries?

### Related Ideas

- IDEA-006 (terminal connection could use Wire Mode)
- IDEA-010 (alternative to Print Mode)
- IDEA-018 (approval workflows use Wire requests)

