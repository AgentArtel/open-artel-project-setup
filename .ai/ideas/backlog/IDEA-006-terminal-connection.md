## IDEA-006: Terminal connection to Kimi Code

- **Category**: Kimi Integration
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Feasible (A/B), Experimental (C)
- **Roadmap Phase**: Phase 4-7

### The Idea

Agents open a terminal connection to the Kimi Code overseer for real-time queries, commands, and coordination.

### Why It Matters

Enables real-time agent-to-overseer interaction without leaving the development environment.

### Research Findings

**Three options designed** (TASK-002-research.md, Section 9):

**Option A — Git Communication (Simplest, Phase 1)**:
No live connection. Agents commit with `[ACTION:submit]`. Git hooks invoke Kimi Print Mode. Agents read responses from `.ai/reviews/`.
- Pro: Works with any agent. No extra setup.
- Con: Async only. Latency per handoff.

**Option B — Kimi CLI Direct (Phase 4)**:
Agents invoke `kimi --print -p "question..."` directly.
- Pro: Immediate responses.
- Con: No persistent context (new session each call).

**Option C — Wire Daemon (Phase 7)**:
Persistent Kimi process in Wire Mode (`kimi --wire`). JSON-RPC 2.0 bidirectional protocol. Agents connect via coordination daemon.
- Pro: Persistent context. Full project history. Real-time.
- Con: Requires daemon infrastructure.

### Answers to Open Questions

- **Mechanism**: Three options at increasing complexity.
- **Authentication**: API key or `/login` device auth. Wire Mode uses running process credentials.
- **Simultaneous agents**: All options support it (Git naturally, CLI via independent processes, Wire via daemon).
- **Available commands**: All Kimi tools — Shell, ReadFile, WriteFile, Grep, Glob, Task, Think, SearchWeb, FetchURL.

### Related Ideas

- IDEA-005 (connects to the overseer)
- IDEA-011 (Wire Mode provides Option C)
