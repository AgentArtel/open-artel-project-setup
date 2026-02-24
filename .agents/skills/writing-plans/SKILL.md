---
name: writing-plans
description: Creates implementation plans with bite-sized tasks assigned to specific agents. Feeds into executing-plans.
---

## When to Use

After a design has been brainstormed and approved. The input is a validated design; the output is a plan with concrete, assignable tasks.

## Plan Structure

Save plans to `docs/plans/YYYY-MM-DD-<feature-name>.md` with this structure:

```markdown
# Plan: [Feature Name]

**Goal**: [One sentence]
**Agents involved**: [Claude Code, Cursor, Lovable — as needed]
**Estimated tasks**: [Count]

## Architecture

[Brief description of the approach — what changes and how it fits together]

## Tasks

### Task 1: [Short name]
- **Agent**: [Who does this]
- **Files**: [Exact file paths]
- **Steps**:
  1. [Concrete step — 2-5 minutes of work]
  2. [Next step]
  3. [Verification step — how to prove it works]
- **Depends on**: [Task N or none]

### Task 2: [Short name]
...
```

## Rules for Good Tasks

1. **Bite-sized** — Each task is 2-5 minutes of focused work, max one session
2. **One agent per task** — Never require two agents to collaborate on one task
3. **Exact file paths** — No vague "update the relevant files"
4. **Verification included** — Every task ends with a step that proves it works
5. **Dependencies explicit** — If Task 3 needs Task 1 done first, say so
6. **Agent assignment by domain** — Logic → Cursor, UI → Lovable, Config/docs → Claude Code (check `.ai/boundaries.md`)
7. **Context self-contained** — Agent can execute the task without reading the full plan

## Task Sizing

If a task takes more than one session, break it down further:
- **Too big**: "Implement the authentication system"
- **Right size**: "Add login form validation to src/components/LoginForm.tsx"
- **Right size**: "Create useAuth hook with login/logout/session state"

## Execution Handoff

After the plan is written and approved, offer two execution options:

1. **Subagent-driven** — Stay in this session, dispatch subagents per task (see `executing-plans` skill)
2. **Task briefs** — Write individual task briefs to `.ai/tasks/` for agents to pick up asynchronously

For multi-agent work, option 2 is usually the right choice. Write each task as a brief using `.ai/templates/task.md`.
