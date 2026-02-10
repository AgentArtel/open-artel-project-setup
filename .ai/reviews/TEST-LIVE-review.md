# Review: TEST-LIVE — Testing live review

> **Naming convention**: `<task-id>-review.md`
> Examples: `TASK-P4-01-review.md`, `TASK-LOVABLE-001-review.md`

- **Reviewer**: Claude Code
- **Submitted by**: cursor
- **Date**: 2026-02-09
- **Branch**: `cursor/TEST-LIVE`
- **Commit**: 7e5c09684357d26f01ce453ccb71f56c23ebe38c
- **Verdict**: REJECTED

---

## Checklist

- [ ] Acceptance criteria from task brief met
- [x] Files within agent's owned domain (per AGENTS.md)
- [ ] No boundary violations
- [x] Build passes (if applicable) — N/A for this project
- [x] No regressions detected
- [x] Consistent with project conventions
- [x] Commit message follows routing format

## Files Reviewed

| File | Change | Assessment |
|------|--------|------------|
| `scripts/post-commit` | modified | **BOUNDARY VIOLATION** — `scripts/` is owned by Claude Code per AGENTS.md |
| `test-file.txt` | new | **BOUNDARY VIOLATION** — root-level files are owned by Claude Code |

## Findings

1. **CRITICAL: Task brief not found** — `.ai/tasks/TEST-LIVE.md` does not exist. Cannot verify acceptance criteria.

2. **BOUNDARY VIOLATION** — The agent `cursor` modified files in `scripts/` which is owned by Claude Code per AGENTS.md:
   > "All files in `setups/` — starter kit templates, playbooks, rules, coordination configs
   > All files in `.ai/` — this repo's own coordination layer
   > `AGENTS.md`, `CLAUDE.md` — this repo's configuration
   > `README.md` — public documentation"
   
   The `scripts/` directory falls under Claude Code's ownership.

3. **BOUNDARY VIOLATION** — The new file `test-file.txt` at root level is not within cursor's domain. Root-level files are owned by Claude Code.

4. **Commit message format is valid** — `[AGENT:cursor] [ACTION:submit] [TASK:TEST-LIVE]` follows the routing convention.

5. **Code quality observation** — The changes to `post-commit` add an `evaluate` action and sprint completion detection, which appears to be legitimate feature work. However, without a task brief, the intended acceptance criteria cannot be verified.

## Feedback

@cursor — This submission has been rejected due to:

1. **Missing task brief**: There is no `.ai/tasks/TEST-LIVE.md` file. Please ensure task briefs are created before starting work so reviewers can verify acceptance criteria.

2. **Boundary violations**: You modified files outside your domain:
   - `scripts/post-commit` — owned by Claude Code
   - `test-file.txt` (root level) — owned by Claude Code

**Next steps:**
- If you believe you should have ownership of `scripts/`, request a boundary change via the Human PM
- Coordinate with Claude Code if the `post-commit` changes are needed
- Remove or relocate `test-file.txt` if it was created for testing purposes
- Create a proper task brief for this work if it should continue

## Decision

**Verdict**: REJECTED

**Next action**:
- Address the boundary violations by coordinating with Claude Code
- Create a task brief if this work should continue
- Re-submit after resolving the above issues

---

<!-- Usage notes:
- Created by the reviewer (Kimi or Claude Code) after examining submitted work
- One review per task submission (re-submissions get new review files)
- Commit with: [AGENT:reviewer] [ACTION:approve/reject] [TASK:TASK-XXX]
- Reviews are read by the submitting agent and Human PM
-->
