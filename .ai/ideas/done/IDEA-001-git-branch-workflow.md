## IDEA-001: Git branch handoff workflow

- **Category**: Git Workflow
- **Origin**: TASK-002
- **Status**: complete
- **Feasibility**: Ready
- **Roadmap Phase**: Phase 1 (Foundation)
- **Implemented**: Phase 1 (2026-02-10)

### The Idea

Each agent/subagent operates on dedicated branches with commit-triggered handoffs. Agents work on their branch, push, and trigger the next agent in the sequence to pick up the work.

### Why It Matters

Enables true multi-agent collaboration where work flows systematically between agents without manual coordination.

### Research Findings

**Branch hierarchy** (TASK-002-research.md, Section 1):

| Branch | Purpose | Owner | Merges Into |
|--------|---------|-------|-------------|
| `main` | Production-stable | Human PM | — |
| `pre-mortal` | Staging gate | Kimi + Human | `main` |
| `claude/<task-id>` | Claude Code work | Claude Code | `pre-mortal` |
| `cursor/<task-id>` | Cursor work | Cursor | `pre-mortal` |
| `lovable/<task-id>` | Lovable work | Lovable | `pre-mortal` |
| `kimi/overseer` | Overseer tracking | Kimi Code | `pre-mortal` |

**Naming**: `<agent>/<task-id>-<short-description>`

**Handoff sequence**: Agent pushes → Git hook triggers Kimi review → Kimi approves/rejects → approved work merges to `pre-mortal` → human reviews `pre-mortal` → merges to `main`.

### Answers to Open Questions

- **Sequence**: Not linear. Kimi routes based on task dependencies (Claude decomposes → Cursor implements → Lovable styles → Kimi reviews all).
- **Blocked work**: Agent marks BLOCKED in commit. Kimi re-routes to Claude Code for re-decomposition.
- **Staging branch**: Yes — `pre-mortal` serves this role.
- **Merge conflicts**: Agents on separate branches. Kimi auto-resolves; escalates non-trivial conflicts to Claude Code.

### Implementation Summary

**Files created/modified**: `AGENTS.md` (branch hierarchy, naming, handoff sequence), `.agents/skills/git-routing/SKILL.md`, `.agents/skills/open-artel-workflow/SKILL.md`, `setups/multi-agent-starter/AGENTS.md`

### Dev Log

| Date | Stage | Action | By |
|------|-------|--------|----|
| 2026-02-10 | capture | Extracted from TASK-002 brainstorm | Claude Code |
| 2026-02-10 | research | Feasibility assessed, branch hierarchy designed | Claude Code |
| 2026-02-10 | complete | Implemented in AGENTS.md + skills | Cursor + Human |

### Related Ideas

- IDEA-002 (commit message routing enables the handoffs)
- IDEA-003 (automated workflow cycle)
- IDEA-016 (conversational Git operations)
