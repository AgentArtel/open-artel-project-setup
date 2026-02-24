---
name: executing-plans
description: Executes implementation plans through batched tasks with review checkpoints. Works for both single-agent and multi-agent execution.
---

## When to Use

After a plan has been written (via `writing-plans` skill) and approved.

## Single-Agent Execution (subagent-driven)

When you're executing tasks yourself or dispatching subagents within one session:

### Step 1: Load and Review Plan

Read the plan document. Raise concerns before starting. Create a todo list from the tasks.

### Step 2: Execute in Batches of 3

For each batch:
1. Mark task as IN_PROGRESS
2. Follow the task steps exactly
3. Run verification steps — do not skip
4. Mark task as DONE
5. After 3 tasks, stop and report

### Step 3: Report After Each Batch

Present:
- What was completed
- Verification results (actual output, not "should work")
- Any deviations from the plan
- Ready for feedback before continuing

### Step 4: Continue or Adjust

Apply feedback, execute next batch. If the plan needs changes, update the plan document first.

### Step 5: Finish

When all tasks are done, update `.ai/board.md` (move to Recently Completed), update `.ai/status.md`, and commit.

## Multi-Agent Execution (task briefs)

When work is distributed across Claude Code, Cursor, and Lovable:

### Step 1: Write Task Briefs

For each task in the plan, write a brief to `.ai/tasks/TASK-XXX.md` using the template. Include:
- Assigned agent
- Full context (don't assume the agent has read the plan)
- Exact file paths and acceptance criteria
- Dependencies on other tasks

### Step 2: Update the Board

Update `.ai/board.md`:
- Add tasks to "Ready for Pickup" (if no dependencies)
- Note which tasks are blocked and by what

### Step 3: Agents Execute

Each agent:
1. Reads `.ai/board.md` at session start
2. Claims a task from "Ready for Pickup"
3. Updates board: moves to "Active Work" with their name
4. Works on their branch
5. Fills in Results and Handoff Notes in the task file
6. Commits with `[AGENT:x] [ACTION:submit] [TASK:XXX]`

### Step 4: Review Checkpoints

After each task submission:
1. Review against acceptance criteria
2. Check boundary compliance
3. If approved: merge, update board, unblock dependent tasks
4. If rejected: write feedback to `.ai/reviews/`, agent revises

### Step 5: Completion

When all tasks are done:
1. Update `.ai/board.md` — all tasks in "Recently Completed"
2. Update `.ai/status.md`
3. Generate a summary for human review

## Safety Rules

- **Stop on blockers** — Don't guess, don't force through. Flag it.
- **Never skip verification** — See `verification-before-completion` skill
- **Batch size 3** — Report after every 3 tasks, even if everything is going smoothly
- **Plan changes go in the plan** — Don't just deviate; update the document first
