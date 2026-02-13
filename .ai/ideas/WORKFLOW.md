# Idea Pipeline Workflow

Ideas progress through 3 folders: **backlog** → **active** → **done**.

## Pipeline

```
.ai/ideas/
├── backlog/     Ideas being researched or waiting for approval
├── active/      Currently being built — linked to agent branch + task brief
├── done/        Implemented, tested, merged — historical record
└── ideas.md     Master index (all ideas, all stages, at a glance)
```

## Stage Details

### backlog/

**What lives here**: Raw ideas, researched ideas, and approved-but-not-started ideas. Everything that isn't actively being built and isn't finished.

**Who works here**: Anyone captures ideas. Claude Code researches feasibility. Human approves for implementation.

**Exit criteria → active/**: Human approves. A task brief exists at `.ai/tasks/TASK-XXX.md`. An agent picks it up.

**On transition to active/**:
1. Update the idea file with `Status: active`
2. Create a task brief if one doesn't exist
3. Write a handoff doc at `.ai/instructions/<agent>-TASK-XXX.md`
4. Add dev log entry
5. Move the file to `active/`

### active/

**What lives here**: Ideas currently being built. Linked to an agent branch and task.

**Who works here**: The assigned agent (Cursor, Claude Code, Lovable). Overseer monitors.

**Exit criteria → done/**: Implementation complete, tests passing, review approved.

**On transition to done/**:
1. Update the idea file with `Status: complete` and completion date
2. Add implementation summary (files created/modified)
3. Update task brief to `Status: DONE`
4. Add dev log entry
5. Move the file to `done/`

### done/

**What lives here**: Finished ideas. Historical record. Referenced when planning related work.

## Dev Log Format

Every idea file has a `### Dev Log` section at the bottom:

```markdown
### Dev Log

| Date | Stage | Action | By |
|------|-------|--------|----|
| 2026-02-10 | backlog | Idea captured from brainstorm | Claude Code |
| 2026-02-10 | backlog | Feasibility researched | Claude Code |
| 2026-02-11 | active | Human approved, branch created | Cursor |
| 2026-02-11 | done | Merged, 6 files created | Cursor |
```

## Handoff Document Format

Written when an idea moves from backlog → active. Lives at `.ai/instructions/<agent>-TASK-XXX.md`.

```markdown
# Handoff: IDEA-XXX → TASK-XXX

## For: [Agent Name]
## Branch: [agent]/[task-id]

## What to Build
[Clear description from the researched idea]

## Design Decisions (Already Made)
[Key decisions from research — don't re-decide these]

## Files to Create/Modify
[Specific file paths and what goes in each]

## Acceptance Criteria
[From the task brief — what "done" looks like]

## Constraints
[Boundaries, what NOT to touch, dependencies]
```

## Quick Reference

| From | To | Who Triggers | What Happens |
|------|----|-------------|-------------|
| backlog | active | Human approves, agent picks up | Task brief + handoff doc created |
| active | done | Review approved + merged | Implementation summary added, task DONE |
