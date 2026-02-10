## IDEA-012: Work delegation system

- **Category**: Agent Architecture
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Feasible
- **Roadmap Phase**: Phase 4-5

### The Idea

Agents take on work for the human and pass tasks between each other. Kimi overseer replaces human relay.

### Why It Matters

Human describes high-level goals; agents handle division of labor. PM bottleneck eliminated.

### Research Findings

**Delegation map** (TASK-002-research.md, Section 9):

| Human Currently Does | Kimi Takes Over |
|---------------------|-----------------|
| Copy task brief → Cursor | Write `.ai/instructions/cursor-TASK-XXX.md` |
| Copy report → review | Parse submit commit, run review |
| Review code changes | Automated review against criteria |
| Update status.md | Auto-update on merge |
| Decide task order | Follow dependency graph |
| Relay blockers | Detect BLOCKED, re-route |

**Human still does**: Set sprint goals, final review of `pre-mortal`, resolve product decisions, override Kimi when needed, approve structural changes.

**Cursor Workforce evolution**: Kimi replaces Manager Chat role. Task Chats remain. Human goes from "relay every message" to "review final output."

### Answers to Open Questions

- **Delegation basis**: `.ai/boundaries.md` (file ownership) + task type (logic→Cursor, UI→Lovable, arch→Claude).
- **Format**: `.ai/instructions/` for assignments, commit messages for routing, `.ai/reviews/` for feedback.
- **Tracking**: `.ai/status.md` + `.ai/chats/` logs.
- **Failed delegation**: Mark BLOCKED, create resolution task, escalate to Human.

### Related Ideas

- IDEA-007 (subagents), IDEA-004 (folders), IDEA-013 (evaluation)
