## IDEA-002: Commit message header routing

- **Category**: Automation
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Use commit message headers to automatically route work between agents. The header format (e.g., `[AGENT: cursor] [ACTION: review] [TASK: TASK-003]`) determines where the commit goes and what action is triggered.

### Why It Matters

Makes Git commits the coordination mechanism. No manual file updates or separate coordination layer needed — the commit message itself carries the routing instructions.

### Open Questions

- What's the exact header format? (e.g., `[AGENT:name] [ACTION:action] [TASK:id]`)
- How do we parse and route reliably? (Git hooks? GitHub Actions?)
- What actions are valid? (review, merge, delegate, block, etc.)
- How do we handle malformed headers or missing routing info?

### Related Ideas

- IDEA-001 (branch workflow uses this routing)
- IDEA-003 (automated workflow relies on routing)
- IDEA-010 (Print Mode could generate these headers)

