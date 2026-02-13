## IDEA-009: Flow Skills for agent handoff workflows

- **Category**: Automation
- **Origin**: TASK-002
- **Status**: complete
- **Feasibility**: Ready
- **Roadmap Phase**: Phase 3 (Flow Skills)
- **Implemented**: Phase 3 (2026-02-10)

### The Idea

Multi-step agent handoff workflows as Flow Skills with Mermaid diagrams. Invoked via `/flow:` to auto-execute the commit → review → merge sequence.

### Why It Matters

Makes complex workflows executable, visual, and reusable.

### Research Findings

**Two flows designed** (TASK-002-research.md, Section 7):

**Sprint Execution** (`/flow:sprint-execution`): Read goals → Decompose tasks → Review briefs → Assign → Wait for submit → Review work → Approve/reject → Merge → Next task → Sprint complete.

**Code Review** (`/flow:code-review`): Read brief → Read diff → Check boundaries → Check criteria → Check regressions → APPROVE or REJECT.

**Format**: `type: flow` in YAML frontmatter + Mermaid code block. Must have `BEGIN` and `END` nodes. Decision nodes use `<choice>` tags.

**Invocation**: `/flow:sprint-execution` (executes), `/skill:sprint-execution` (loads as context).

Both flows include conditional branches (reject → revise → re-review loops) and explicit failure paths.

### Answers to Open Questions

- **Flow diagrams**: Two complete flows with decision branches designed.
- **Git hook integration**: Hooks trigger `/flow:code-review` on submit commits.
- **Conditional branches**: Yes — decision nodes with labeled paths.
- **Error handling**: Loops (reject → fix → re-submit) and failure exits.

### Implementation Summary

**3 flow skills created**: `sprint-execution` (goals->tasks->review->merge->report), `code-review` (brief->diff->boundaries->criteria->verdict), `task-handoff` (submit->review->approve/reject->next). All use `type: flow` with Mermaid flowcharts.

### Dev Log

| Date | Stage | Action | By |
|------|-------|--------|----|
| 2026-02-10 | capture | Extracted from TASK-002 brainstorm | Claude Code |
| 2026-02-10 | research | 2 flows designed (sprint-execution, code-review) | Claude Code |
| 2026-02-10 | complete | 3 flow skills created (added task-handoff) | Cursor + Human |

### Related Ideas

- IDEA-001 (branch structure), IDEA-003 (automated cycle), IDEA-008 (Flow Skills are Agent Skills)
