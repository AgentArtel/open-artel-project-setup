## IDEA-004: Agent communication folders

- **Category**: Communication
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Ready
- **Roadmap Phase**: Phase 1 (Foundation)

### The Idea

Literal folders for agent-to-agent communication: `.ai/chats/`, `.ai/reports/`, `.ai/instructions/`, `.ai/reviews/`.

### Why It Matters

Structured, version-controlled communication channels. Full conversation history in Git.

### Research Findings

**Structure designed** (TASK-002-research.md, Section 4):

| Folder | Writers | Readers | Purpose |
|--------|---------|---------|---------|
| `chats/` | All agents | All agents | Conversation logs |
| `reports/` | All (primarily Kimi) | Human + all | Status reports, sprint summaries |
| `instructions/` | Kimi, Claude Code | Target agent | Task assignments |
| `reviews/` | Kimi | Submitting agent + Human | Code review feedback |

**Naming**:
- `chats/kimi-cursor-TASK-P4-01.md`
- `reports/sprint-3-summary.md`
- `instructions/cursor-TASK-P4-01.md`
- `reviews/TASK-P4-01-review.md`

**Chat format**: Timestamped entries with `## YYYY-MM-DD HH:MM — Agent → Agent` headers.

**Review format**: Reviewer, verdict (APPROVED/REJECTED), checklist, findings, decision.

**Integration**: Maps directly to the Cursor Workforce pattern (Manager Chat → `chats/`, Task reports → `reports/`, Assignments → `instructions/`).

### Answers to Open Questions

- **Naming**: Agent-pair-based with context suffix (timestamps inside files, not in filenames).
- **Simultaneous writes**: Agents on separate branches — no file conflicts.
- **Format**: Markdown (consistent with zero-dependency philosophy).
- **Archiving**: Old content stays in Git history. Active folders stay lean.

### Related Ideas

- IDEA-003 (workflow cycle uses these folders)
- IDEA-012 (work delegation happens via these channels)
