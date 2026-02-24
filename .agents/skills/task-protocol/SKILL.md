---
name: task-protocol
description: Task brief lifecycle, naming, and decomposition rules. Template at .ai/templates/task.md.
---

## Template

The task brief template lives at `.ai/templates/task.md`. Always use it as the starting point.

Key fields: Status, Assigned, Priority, Type, Depends on, Blocks, Context, Objective, Scope, Plan, Acceptance Criteria.

Optional sections (add as needed): Research Findings, Implementation Phases, File Changes, Results, Lessons.

## Task Lifecycle

```
PENDING → IN_PROGRESS → REVIEW → DONE
    ↓                      ↓
  BLOCKED              BLOCKED
    ↓                      ↓
(unblocked)         (feedback addressed)
    ↓                      ↓
IN_PROGRESS            REVIEW → DONE
```

| From | To | Trigger |
|------|----|---------|
| PENDING | IN_PROGRESS | Agent begins work, updates `.ai/board.md` |
| IN_PROGRESS | REVIEW | Agent commits `[ACTION:submit]` |
| IN_PROGRESS | BLOCKED | Unexpected blocker discovered |
| REVIEW | DONE | Reviewer commits `[ACTION:approve]` |
| REVIEW | IN_PROGRESS | Reviewer commits `[ACTION:reject]` |
| BLOCKED | IN_PROGRESS | Blocker resolved, agent resumes |

## Naming Convention

| Pattern | Example |
|---------|---------|
| `TASK-XXX` (numeric) | `TASK-001`, `TASK-002` |
| `TASK-DESCRIPTIVE-NAME` | `TASK-GATEWAY-CLIENT` |
| `TASK-<PHASE>-<NUMBER>` | `TASK-P4-01` |
| `TASK-<AGENT>-<NUMBER>` | `TASK-LOVABLE-001` |

File: `TASK-XXX.md` in `.ai/tasks/`.

## Acceptance Criteria Rules

1. Every criterion must be independently testable
2. "Build passes" is always included (for projects with a build step)
3. Boundary compliance is always checked
4. Commit format compliance
5. No regressions
6. Use `- [ ]` checkbox format

## Decomposition Guidelines

1. **One task per agent** — avoid multi-agent tasks
2. **Clear boundaries** — specify which files are in scope
3. **Testable outcomes** — measurable acceptance criteria
4. **Dependency chains** — document what blocks what
5. **One session scope** — completable in a single work session
6. **Context included** — agent can work independently
