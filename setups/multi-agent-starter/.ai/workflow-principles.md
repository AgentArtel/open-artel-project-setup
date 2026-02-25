# Workflow Principles

The operating discipline that every agent follows. These aren't guidelines — they're how we work.

## Core Principles

| Principle | Rule |
|-----------|------|
| **Simplicity First** | Choose the simplest solution that works. Don't add abstractions until the problem demands it. |
| **No Laziness** | Find root causes. Don't paper over problems with workarounds or suppressed errors. |
| **Minimal Impact** | Touch as few files as possible. Scope changes tightly. |

## Development Pipeline

For non-trivial work, follow this pipeline:

```
brainstorm → write plan → execute → verify → finish
```

1. **Brainstorm** — Explore requirements, propose 2-3 approaches, get human approval
2. **Write plan** — Create bite-sized tasks with agent assignments and verification steps
3. **Execute** — Work through tasks in batches of 3, review checkpoint after each batch
4. **Verify** — No completion claims without fresh evidence
5. **Finish** — Update board, commit, push

For trivial work (typo fixes, small updates), skip to execute.

## Workflow Discipline

### 1. Plan Mode Default
Enter plan mode for any non-trivial task. Write a concrete plan with checkable items before implementing. If things go sideways, stop and re-plan.

### 2. Subagent Strategy
Use subagents liberally for research and exploration. One task per subagent. Throw more compute at complex problems.

### 3. Self-Improvement Loop
After any correction or surprise, update `.ai/lessons.md`. Write rules to prevent the category of mistake. Review lessons at session start.

### 4. Verification Before Done
Never mark complete without proving it works. Run the actual command, read the actual output. "Should work" is not evidence.

### 5. Demand Elegance (Balanced)
Pause before non-trivial changes. Implement the elegant solution. Skip for simple fixes. Challenge your first instinct.

### 6. Autonomous Bug Fixing
If you see a bug while working, just fix it. No task brief needed. Fix failing CI immediately.

### 7. Systematic Debugging
Treat your own code as foreign — read it as if someone else wrote it. Generate 3+ hypotheses before investigating any. Seek disconfirming evidence ("What would prove me wrong?"). Check what you changed first.

### 8. Context Window Awareness
Watch for quality drops (shorter answers, repetition, lost track of decisions). Create handoff files (`.ai/templates/handoff.md`) when context gets long. Keep orchestration lean — offload to subagents. Commit often — git is persistent memory.

## Task Execution Protocol

```
1. Plan First       → Write plan with checkable items
2. Verify Plan      → Check in before starting (non-trivial tasks)
3. Track Progress   → Mark items complete as you go
4. Explain Changes  → High-level summary at each step
5. Document Results → Record what actually changed in the task file
6. Capture Lessons  → Update .ai/lessons.md after any correction
```

## Session Start Checklist

1. Read `.ai/board.md` — who's doing what, what's blocked
2. Read `.ai/lessons.md` — absorb past mistakes
3. Check `.ai/tasks/` — pick up active assignments
4. Update `.ai/board.md` with your current activity
