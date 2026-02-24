# Workflow Principles

The operating discipline that every agent follows. These aren't guidelines — they're how we work.

## Core Principles

| Principle | Rule |
|-----------|------|
| **Simplicity First** | Choose the simplest solution that works. Don't add abstractions until the problem demands it. |
| **No Laziness** | Find root causes. Don't paper over problems with workarounds or suppressed errors. |
| **Minimal Impact** | Touch as few files as possible. Scope changes tightly. |

## Workflow Orchestration

### 1. Plan Mode Default
Enter plan mode for any non-trivial task. Write a concrete plan with checkable items before implementing. If things go sideways, stop and re-plan.

### 2. Subagent Strategy
Use subagents liberally for research and exploration. One task per subagent. Throw more compute at complex problems.

### 3. Self-Improvement Loop
After any correction or surprise, update `.ai/lessons.md`. Write rules to prevent the category of mistake. Review lessons at session start.

### 4. Verification Before Done
Never mark complete without proving it works. Diff behavior before vs. after. Ask: "Would a staff engineer approve this?"

### 5. Demand Elegance (Balanced)
Pause before non-trivial changes. Implement the elegant solution. Skip for simple fixes. Challenge your first instinct.

### 6. Autonomous Bug Fixing
If you see a bug while working, just fix it. No task brief needed. Fix failing CI immediately.

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

1. Read `.ai/lessons.md` — absorb past mistakes
2. Read `.ai/status.md` — understand current priorities
3. Check `.ai/tasks/` — pick up active assignments
