# Review: [TASK-XXX] — [Task Title]

> **Naming convention**: `<task-id>-review.md`
> Examples: `TASK-P4-01-review.md`, `TASK-LOVABLE-001-review.md`

- **Reviewer**: [Reviewing agent — typically Kimi or Claude Code]
- **Submitted by**: [Agent that did the work]
- **Date**: [YYYY-MM-DD]
- **Branch**: `[agent]/[task-id]-[description]`
- **Commit**: [commit hash]
- **Verdict**: [APPROVED | CHANGES REQUESTED | REJECTED]

---

## Checklist

- [ ] Acceptance criteria from task brief met
- [ ] Files within agent's owned domain (per AGENTS.md)
- [ ] No boundary violations
- [ ] Build passes (if applicable)
- [ ] No regressions detected
- [ ] Consistent with project conventions
- [ ] Commit message follows routing format

## Files Reviewed

| File | Change | Assessment |
|------|--------|------------|
| `[path]` | [new/modified/deleted] | [ok / issue found] |

## Findings

1. [Finding — positive or negative]
2. [Finding — positive or negative]

## Feedback

[Specific feedback for the submitting agent — what to fix, what was good, etc.]

## Decision

**Verdict**: [APPROVED / CHANGES REQUESTED / REJECTED]

**Next action**:
- [If APPROVED: Merge to `pre-mortal`. Unblocks TASK-XXX.]
- [If CHANGES REQUESTED: Agent addresses feedback and re-submits.]
- [If REJECTED: Reason and alternative approach.]

---

<!-- Usage notes:
- Created by the reviewer (Kimi or Claude Code) after examining submitted work
- One review per task submission (re-submissions get new review files)
- Commit with: [AGENT:reviewer] [ACTION:approve/reject] [TASK:TASK-XXX]
- Reviews are read by the submitting agent and Human PM
-->

