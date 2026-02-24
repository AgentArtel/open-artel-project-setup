---
name: workflow-discipline
description: Core operating principles and task execution discipline for all agents. Covers planning, verification, lessons learned, bug fixing, and quality standards.
---

## Core Principles

Three non-negotiable values. These override convenience, speed, and habit.

| Principle | Rule |
|-----------|------|
| **Simplicity First** | Choose the simplest solution that works. Don't add abstractions until the problem demands it. |
| **No Laziness** | Find root causes. Don't paper over problems with workarounds or suppressed errors. |
| **Minimal Impact** | Touch as few files as possible. Scope changes tightly. |

## Workflow Orchestration

Six disciplines every agent follows during execution.

### 1. Plan Mode Default

Enter plan mode for any non-trivial task before writing a line.

- Write a concrete plan with checkable items before implementing
- If things go sideways, **stop and re-plan** — don't push through a broken approach
- Plan verification steps too (what to test, what to check)
- If you can't write a clear plan, you don't understand the task yet

### 2. Subagent Strategy

Use subagents liberally for research and exploration.

- One task per subagent — keep responsibilities clear
- Throw more compute at complex problems rather than struggling single-threaded
- Let subagents fail fast and report back

### 3. Self-Improvement Loop

The system gets smarter after every mistake.

- After any correction or surprise, add an entry to `.ai/lessons.md`
- Write rules to prevent the *category* of mistake, not just the instance
- Review `.ai/lessons.md` at session start

### 4. Verification Before Done

Never mark a task complete without proving it works.

- Diff behavior before vs. after
- Ask: **"Would a staff engineer approve this?"**
- Run tests, check logs, verify output
- If you can't verify it, that's a task in itself

### 5. Demand Elegance (Balanced)

- Pause before implementing non-trivial changes — think through the approach
- Implement the elegant solution, not the quick hack
- Skip for simple, obvious fixes — don't overthink a typo
- Challenge your first instinct. The second idea is often better

### 6. Autonomous Bug Fixing

- If you see a bug while working, **just fix it** — no task brief needed
- Point at logs, errors, and tests for self-diagnosis
- Zero context-switching cost
- Fix failing CI immediately

## Task Execution Protocol

Every task follows these six steps:

```
1. Plan First       → Write plan with checkable items
2. Verify Plan      → Check in before starting (non-trivial tasks)
3. Track Progress   → Mark items complete as you go
4. Explain Changes  → High-level summary at each step
5. Document Results → Record what actually changed in the task file
6. Capture Lessons  → Update .ai/lessons.md after any correction
```

## Session Start Checklist

At the beginning of every working session:

1. Read `.ai/lessons.md` — absorb past mistakes
2. Read `.ai/status.md` — understand current priorities
3. Check `.ai/tasks/` — pick up active assignments
4. Check `.ai/workflow-principles.md` if unfamiliar with the protocol

## Quality Gate

Before marking any task DONE, check:

- [ ] The change does what it claims (verified, not assumed)
- [ ] Acceptance criteria from the task brief are met
- [ ] No regressions in existing functionality
- [ ] Changes stay within your agent's domain
- [ ] A staff engineer would approve this
- [ ] Results and lessons sections filled in the task file
