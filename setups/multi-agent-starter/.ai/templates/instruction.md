# Instruction: [Target Agent] — [Task or Context]

> **Naming convention**: `<target-agent>-<task-or-context>.md`
> Examples: `cursor-TASK-P4-01.md`, `lovable-TASK-LOVABLE-001.md`, `claude-decompose-sprint-3.md`

- **From**: [Assigning agent — typically Kimi or Claude Code]
- **To**: [Target agent]
- **Date**: [YYYY-MM-DD]
- **Priority**: [P0-Critical | P1-High | P2-Medium | P3-Low]
- **Task**: [TASK-XXX or sprint context]

---

## Assignment

[Clear description of what the target agent should do]

## Context

- **Branch**: `[agent]/[task-id]-[description]`
- **Depends on**: [TASK-XXX or none]
- **Blocked by**: [anything that must complete first]

## Files in Scope

- `[path/to/file]` — [what to do with it]
- `[path/to/file]` — [what to do with it]

## Acceptance Criteria

- [ ] [Testable criterion]
- [ ] [Testable criterion]
- [ ] Build passes
- [ ] Files stay within agent's domain

## Constraints

- [Boundary rules, display limits, security rules]
- [What NOT to do]

## When Done

1. Commit with message: `[AGENT:agent] [ACTION:submit] [TASK:TASK-XXX] Description`
2. Push to your branch
3. Create completion report in `.ai/reports/`
4. Update task status in `.ai/tasks/`

---

<!-- Usage notes:
- Written by Kimi (overseer) or Claude Code (orchestrator)
- Read by the target agent before starting work
- One instruction per task assignment
- Reference the full task brief in .ai/tasks/ for detailed specs
-->

