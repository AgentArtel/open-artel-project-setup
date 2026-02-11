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

### Communication Protocols (from Cursor F10, F11, F12)

Cursor's analysis broke communication into three distinct protocols within the folder system:

**Agents give reports (F10)** — structured report templates per role:
- *Coder*: implementation report (what was built, decisions made, trade-offs)
- *Reviewer*: review report (issues found, approved files, risk assessment)
- *Overseer*: sprint report (progress, blockers, cost tracking)

**Agents receive instructions (F11)** — dynamic instructions, not just static task files:
- Include context the sending agent gathered
- Constraints discovered during previous work
- Specific focus areas based on sender's analysis
- Example: reviewer feedback includes line references, priority ranking, and suggested approach

**Agents submit work for review (F12)** — formalized review packages:
- Diff summary (files changed, insertions, deletions)
- Test results
- Task requirements (copied from assignment)
- Self-assessment from the coder agent
- Package written to channel folder, reviewer reads the package not just raw diff

### Cursor's Channel Naming Convention

Cursor proposed sender-receiver pair directories instead of our type-based folders:

```
.ai/channels/
├── overseer-to-coder/
├── coder-to-reviewer/
├── reviewer-to-coder/
├── reviewer-to-overseer/
└── any-to-human/
```

vs. our design:

```
.ai/
├── chats/         (all agent conversations)
├── reports/       (status reports)
├── instructions/  (task assignments)
└── reviews/       (code reviews)
```

**Reconciliation**: Both have merit. Cursor's pair-based model is clearer about routing. Our type-based model is clearer about content purpose. Hybrid recommendation:

```
.ai/channels/
├── instructions/       # Task assignments (overseer → agent)
├── submissions/        # Work for review (agent → reviewer)
├── reviews/            # Review feedback (reviewer → agent)
├── reports/            # Status updates (any → overseer/human)
└── escalations/        # Human decisions needed (any → human)
```

### Cross-reference: Cursor Features

- Cursor F9 (chat folders) — direct match
- Cursor F10 (agent reports) — folded in above
- Cursor F11 (agent instructions) — folded in above
- Cursor F12 (review submission) — folded in above

### Related Ideas

- IDEA-003 (workflow cycle uses these folders)
- IDEA-012 (work delegation happens via these channels)
- IDEA-021 (auto-review reads from submissions channel)
