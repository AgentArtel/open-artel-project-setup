## IDEA-005: Kimi Code persistent project overseer

- **Category**: Kimi Integration
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Kimi Code runs as a persistent development assistant that tracks the project for its entire lifetime. It monitors Git commits, coordinates agent work, and keeps things aligned when agents come in to work on the project.

### Why It Matters

Provides continuity and oversight across agent sessions. The overseer remembers project history, understands context, and can coordinate multiple agents working at different times.

### Open Questions

- How do we keep the Kimi Code session alive? (persistent process? session resuming?)
- What does the overseer monitor? (Git commits? file changes? task status?)
- How does it coordinate? (via API calls? via the communication folders?)
- What's the cost/performance impact of a long-running session?

### Related Ideas

- IDEA-006 (terminal connection mechanism)
- IDEA-007 (subagent architecture)
- IDEA-017 (context compression for long histories)

