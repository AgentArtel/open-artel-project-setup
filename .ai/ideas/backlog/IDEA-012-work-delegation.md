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

### Human Task Offloading (from Cursor F20)

Cursor identified explicit delegation boundaries that complement our delegation map:

**Always agent** (no human needed):
- Formatting, linting, test writing
- Boilerplate code generation
- Documentation updates from code changes
- Dependency version updates (non-breaking)

**Agent with human review**:
- Feature implementation
- Architecture decisions
- Dependency updates (breaking)
- API design changes

**Always human**:
- Business decisions and priority setting
- UX design sign-off
- Deployment approval
- Security-critical changes
- Budget and cost decisions

**Escalation mechanism**: The `[TO:human]` routing type creates a PR or notification for human attention. Human approves/rejects via PR review or by committing to the channel.

This maps well to our `.ai/boundaries.md` pattern — "Proceed Freely" vs "Needs Approval" columns can be generated from these delegation tiers.

### Cross-reference: Cursor Features

- Cursor F20 (human task offloading) — folded in above

### Related Ideas

- IDEA-007 (subagents), IDEA-004 (folders), IDEA-013 (evaluation)
- IDEA-018 (approval workflow implements the escalation mechanism)
- IDEA-019 (sprint pipeline defines when delegation happens)
