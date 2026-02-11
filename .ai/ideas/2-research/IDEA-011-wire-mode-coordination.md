## IDEA-011: Wire Mode custom coordination layer

- **Category**: Automation
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Experimental
- **Roadmap Phase**: Phase 7 (Advanced Automation)

### The Idea

Custom coordination layer using Kimi Code's Wire Mode (JSON-RPC 2.0 over stdin/stdout). Persistent daemon bridging Git events and agent actions.

### Why It Matters

Full programmatic control. Persistent context. Real-time bidirectional communication.

### Research Findings

**Architecture** (TASK-002-research.md, Section 8):

Coordination daemon ↔ Kimi CLI (`--wire`) via JSON-RPC 2.0. Daemon watches Git, parses commits, routes messages. Kimi handles AI reasoning, file ops, subagents.

**Wire Protocol v1.3**: `initialize` (handshake), `prompt` (send input), `cancel` (stop turn). Agent sends `event` (progress) and `request` (approval needed).

**Key events**: TurnBegin, TurnEnd, ContentPart, ToolCall, ToolResult, ApprovalRequest, SubagentEvent.

**Kimi Agent (Rust)**: Lightweight Wire-only binary — single static build, no Python, faster startup.

**Print vs Wire**: Print is simpler (one-shot, stateless) — use for Phase 1-5. Wire is powerful (persistent, stateful) — use for Phase 7+.

### Answers to Open Questions

- **Architecture**: Separate daemon (Python/Node.js) communicating with `kimi --wire`.
- **Event handling**: Sequential event loop reading JSON-RPC from stdout.
- **Relevant events**: TurnEnd, ToolCall, ApprovalRequest.
- **Errors**: JSON-RPC error codes. Daemon handles retries/escalation.

### Related Ideas

- IDEA-006 (Option C), IDEA-010 (simpler alternative), IDEA-018 (approval workflows)
