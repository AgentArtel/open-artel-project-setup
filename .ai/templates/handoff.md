# Session Handoff

Use this template when pausing work mid-task or at end-of-session when context is getting long. The goal: the next agent (or your future self in a fresh context) can pick up exactly where you left off.

## Template

```markdown
# Handoff — [YYYY-MM-DD] — [Agent Name]

## Position

- **Active task**: [TASK-XXX or description]
- **Phase**: [What step of the pipeline: brainstorm / plan / execute / verify]
- **Branch**: [Current git branch]
- **Last commit**: [Short hash + message]

## Completed This Session

- [What was done, with file paths]
- [What was verified and how]

## In Progress (Not Done)

- [What was started but not finished]
- [Current state — where exactly did you stop?]
- [Any half-applied changes or uncommitted work]

## Remaining Work

- [ ] [Next step — be specific]
- [ ] [Step after that]
- [ ] [Verification needed]

## Decisions Made

- [Decision]: [Why, and what alternatives were rejected]

## Blockers

- [What's blocking and who can unblock it]

## Context the Next Agent Needs

- [Key files to read first]
- [Non-obvious gotchas or traps]
- [Anything that "almost went wrong" — save them the pain]

## Resume Instructions

1. Read `.ai/board.md` and `.ai/lessons.md` (standard session start)
2. Read this handoff file
3. [Specific first action to take]
```

## When to Create

- Stopping mid-task (context window getting long)
- Ending a session with work in progress
- Handing off between agents (Claude Code → Cursor, etc.)
- Before running `/compact` or similar context-clearing operations

## Where to Save

Save as `.ai/handoffs/YYYY-MM-DD-agent-description.md` (e.g., `.ai/handoffs/2026-02-25-claude-auth-refactor.md`).

Also update `.ai/board.md` with a note pointing to the handoff file.
