# Workflow Principles

The operating discipline that every agent follows. These aren't guidelines — they're how we work.

## Core Principles

Three non-negotiable values that override everything else.

### Simplicity First

Choose the simplest solution that works. Don't add abstractions, indirection, or configurability unless the problem demands it. Three similar lines of code beat a premature helper function. One well-placed comment beats a documentation file.

### No Laziness

Find root causes. Don't paper over problems with workarounds, retries, or suppressed errors. If something fails, understand *why* before fixing it. If a pattern keeps breaking, fix the pattern — not each instance.

### Minimal Impact

Touch as few files as possible. Every file changed is a file that can conflict, regress, or confuse. Scope changes tightly. If a bug is in one function, fix that function — don't refactor the module.

---

## Workflow Orchestration

Six disciplines for how agents execute work.

### 1. Plan Mode Default

Enter plan mode for any non-trivial task before writing a single line.

- Write a concrete plan with checkable items *before* implementing
- If things go sideways mid-task, **stop and re-plan** — don't push through a broken approach
- Use plan mode for verification steps too (what to test, what to check)
- The plan is the spec. If you can't write a clear plan, you don't understand the task yet

### 2. Subagent Strategy

Use subagents liberally. Don't do everything yourself.

- Offload research, exploration, and information gathering to subagents
- One task per subagent — keep responsibilities clear
- Throw more compute at complex problems rather than struggling in a single thread
- Let subagents fail fast and report back rather than blocking the main workflow

### 3. Self-Improvement Loop

The system gets smarter after every mistake.

- After any correction or unexpected outcome, update `.ai/lessons.md`
- Write rules to prevent the *category* of mistake, not just the instance
- Ruthlessly iterate on conventions — if a process keeps causing friction, change it
- Review `.ai/lessons.md` at the start of every session to avoid repeating history

### 4. Verification Before Done

Never mark a task complete without proving it works.

- Diff behavior before vs. after — confirm the change does what it claims
- Ask: **"Would a staff engineer approve this?"** If not, it's not done
- Run tests, check logs, verify in browser (whatever applies)
- If you can't verify it, add a verification step to the task and do that first

### 5. Demand Elegance (Balanced)

Quality matters, but don't gold-plate.

- **Pause** before implementing non-trivial changes — think through the approach
- Implement the elegant solution, not the quick hack
- **Skip** this for simple, obvious fixes — don't overthink a typo correction
- Challenge your own first instinct. The second idea is often better

### 6. Autonomous Bug Fixing

Bugs don't need a task brief.

- If you see a bug while working on something else, **just fix it**
- Point at logs, errors, and failing tests for self-diagnosis
- Zero context-switching cost — the agent who finds it fixes it
- Fix failing CI immediately — don't leave the build broken for the next agent

### 7. Systematic Debugging

When debugging, use scientific method — not guesswork.

- **Treat your own code as foreign** — read it as if someone else wrote it. You remember intent, not what you actually implemented
- **Generate hypotheses before investigating** — write down 3+ possible causes before diving into code. Avoid anchoring on the first explanation
- **Seek disconfirming evidence** — don't just look for proof your hypothesis is right. Ask: "What would prove me wrong?"
- **Admit when your mental model is wrong** — the code's behavior is truth; your understanding is a guess
- **Check what you changed first** — if you modified 100 lines and something breaks, those are prime suspects

### 8. Context Window Awareness

Context windows degrade. Plan for it.

- **Watch for quality drops** — if Claude starts giving shorter answers, repeating itself, or losing track of earlier decisions, context is getting full
- **Create handoff files early** — don't wait until you're forced to stop. Use `.ai/templates/handoff.md` when context is getting long
- **Keep orchestration lean** — offload heavy work to subagents. They get fresh 200k context windows
- **Commit often** — git is your persistent memory. Don't accumulate uncommitted work across a long session

---

## Task Management Protocol

Six steps that every task follows, from inception to lessons learned.

### Step 1: Plan First

Write your plan to the task file (or `.ai/tasks/todo.md` for ad-hoc work) with checkable items. The plan includes:
- What you're going to change and why
- Which files are in scope
- What "done" looks like
- What you'll check to verify it works

### Step 2: Verify Plan

Check in with the human (or orchestrator) before starting implementation. This catches misunderstandings early when they're cheap to fix. For trivial tasks, a brief summary is enough.

### Step 3: Track Progress

Mark items complete as you go — not in a batch at the end. This gives visibility into where things stand and makes it obvious when a task stalls.

### Step 4: Explain Changes

Provide a high-level summary at each significant step. Not a line-by-line diff, but enough that someone reviewing can understand the *intent* of each change without reading every file.

### Step 5: Document Results

Add a results/review section to the task file when done:
- What was actually changed (may differ from the plan)
- Any decisions made during implementation
- Anything that surprised you or almost went wrong

### Step 6: Capture Lessons

After any correction, mistake, or unexpected difficulty:
- Add an entry to `.ai/lessons.md`
- Include: what happened, why, and the rule to prevent it
- This is how the system improves over time

---

## How These Apply to Each Agent

| Principle | Claude Code | Cursor | Lovable | Kimi |
|-----------|-------------|--------|---------|------|
| Plan Mode Default | Plans every task decomposition | Plans implementation approach | Plans UI changes | Plans sprint assignments |
| Subagent Strategy | Uses subagents for research | N/A (single-thread) | N/A | Dispatches reviewer/researcher |
| Self-Improvement Loop | Updates lessons.md | Reports issues to orchestrator | Reports issues to orchestrator | Aggregates lessons across agents |
| Verification Before Done | Reviews agent submissions | Runs tests, checks build | Verifies visual output | Validates acceptance criteria |
| Demand Elegance | Reviews for code quality | Writes clean implementations | Creates polished UI | Reviews for process quality |
| Autonomous Bug Fixing | Fixes config/schema bugs | Fixes logic bugs | Fixes UI bugs | Flags cross-agent bugs |

---

## Quick Reference

When starting a task:
1. Read `.ai/lessons.md` — don't repeat past mistakes
2. Write a plan with checkable items
3. Get plan verified (non-trivial tasks)
4. Implement, tracking progress as you go
5. Verify it works before marking done
6. Document results and capture lessons
