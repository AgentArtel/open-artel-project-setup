---
name: boundary-enforcement
description: File ownership enforcement rules. References .ai/boundaries.md for the canonical ownership map.
---

## Canonical Source

The complete file ownership map lives in `.ai/boundaries.md`. Always read that file for the current ownership assignments.

This skill defines **how to enforce** those boundaries — not what they are.

## Enforcement Rules

### Before Starting Work

1. Read the task brief — `.ai/tasks/TASK-XXX.md` lists files in scope
2. Check `.ai/boundaries.md` for the ownership map
3. When in doubt, ask via `.ai/chats/`

### Before Committing

1. Run `git diff --stat` to see all modified files
2. Verify every modified file is in your domain
3. Revert unauthorized changes: `git checkout -- <file>`
4. Document exceptions in the commit body if you must touch another agent's file

## Violation Severity

| Severity | Violation | Consequence |
|----------|-----------|-------------|
| **High** | Modifying another agent's core files | REJECT — must revert |
| **Medium** | Modifying shared config without approval | CHANGES REQUESTED |
| **Low** | Minor adjacent touch (e.g., import fix) | Note in review — approve if justified |

## Acceptable Exceptions

1. **Import statements** — adding an import for a new export
2. **Type definitions** — updating shared types
3. **Emergency fixes** — critical bugs requiring cross-boundary work

All exceptions must be documented in the commit message and flagged in review.
