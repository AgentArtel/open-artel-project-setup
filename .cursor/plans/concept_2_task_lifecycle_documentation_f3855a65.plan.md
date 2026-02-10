---
name: "Concept 2: Task Lifecycle Documentation"
overview: Comprehensive documentation explaining the complete task lifecycle, how tasks flow through communication channels, commit-based routing, and GitHub Actions integration with detailed examples and visual diagrams.
todos:
  - id: d2-main
    content: Create docs/task-lifecycle-complete.md with all 8 stages detailed
    status: pending
  - id: d2-routing
    content: Create docs/task-lifecycle-routing.md with complete routing documentation
    status: pending
  - id: d2-example
    content: Create docs/task-lifecycle-example.md with complete walkthrough example
    status: pending
  - id: d2-advanced
    content: Create docs/task-lifecycle-advanced.md with advanced scenarios
    status: pending
  - id: d2-diagrams
    content: Create visual diagrams (Mermaid) for all major flows
    status: pending
  - id: d2-troubleshooting
    content: Create docs/task-lifecycle-troubleshooting.md with common issues and solutions
    status: pending
  - id: d2-reference
    content: Create docs/task-lifecycle-reference.md with reference tables
    status: pending
  - id: d2-integration
    content: Update existing docs to reference task lifecycle documentation
    status: pending
---

# Concept 2: Task Lifecycle Documentation

## Overview

A comprehensive document that explains the complete lifecycle of a task in an Open Artel project, from creation to completion. Documents how tasks flow through communication channels (commits, files, GitHub Actions), how routing works, and provides detailed examples with real commit messages and file paths.

## Document Structure

### 1. Executive Summary

- What is the task lifecycle?
- Why commit-based communication?
- How does automation work?

### 2. Task Lifecycle Stages

- Stage 1: Task Creation
- Stage 2: Task Assignment
- Stage 3: Agent Work
- Stage 4: Submission
- Stage 5: Review
- Stage 6: Approval/Rejection
- Stage 7: Merge
- Stage 8: Completion & Handoff

### 3. Communication Channels

- Commit messages (primary)
- `.ai/` files (persistent state)
- GitHub Actions (automation)
- Kimi sessions (context)

### 4. Routing & Automation

- Commit message parsing
- Post-commit hook routing
- GitHub Actions triggers
- Kimi Print Mode integration

### 5. Complete Example Walkthrough

- Real task from start to finish
- All commits with full messages
- All file changes
- All automation triggers

### 6. Advanced Scenarios

- Task rejection and re-submission
- Parallel tasks
- Task dependencies
- Sprint lifecycle

### 7. Troubleshooting

- What if automation doesn't trigger?
- What if routing headers are wrong?
- What if GitHub Actions fail?

## Implementation Tasks

### Task D2.1: Create main documentation file

**File**: `docs/task-lifecycle-complete.md`**Sections**:

1. **Introduction**

- Purpose of the document
- Overview of Open Artel task system
- Key concepts (commit-based communication, automation, routing)

2. **Task Lifecycle Overview**

- High-level diagram (Mermaid flowchart)
- 8 stages explained
- Key decision points

3. **Stage 1: Task Creation**

- Who creates tasks (Human PM, Claude Code)
- Where tasks are created (`.ai/tasks/TASK-XXX.md`)
- Task brief format
- Example task file

4. **Stage 2: Task Assignment**

- How tasks are assigned (Kimi or Claude Code)
- Assignment file (`.ai/instructions/<agent>-TASK-XXX.md`)
- Commit: `[AGENT:kimi] [ACTION:delegate] [TASK:XXX]`
- Agent notification (how agent discovers assignment)

5. **Stage 3: Agent Work**

- Agent creates branch: `<agent>/TASK-XXX-description`
- Agent implements work
- Agent commits progress (optional `[ACTION:update]`)
- Agent verifies work (build, tests, boundary check)

6. **Stage 4: Submission**

- Agent commits: `[AGENT:<agent>] [ACTION:submit] [TASK:XXX] Description`
- Agent pushes branch
- Post-commit hook detects `[ACTION:submit]`
- Hook triggers Kimi review (local) OR GitHub Actions triggers (remote)

7. **Stage 5: Review**

- **Local (post-commit hook)**:
    - Hook calls `kimi --agent-file .agents/kimi-overseer.yaml --print -p "Review..."`
    - Kimi reads task brief, checks diff, verifies criteria
    - Kimi writes review to `.ai/reviews/TASK-XXX-review.md`
- **Remote (GitHub Actions)**:
    - Workflow triggers on push to agent branch
    - Parses commit message
    - Calls Kimi Print Mode
    - Commits review file back to branch
- Review verdict: APPROVED, CHANGES_REQUESTED, or REJECTED

8. **Stage 6: Approval/Rejection**

- **If APPROVED**:
    - Reviewer commits: `[AGENT:kimi] [ACTION:approve] [TASK:XXX]`
    - Post-commit hook triggers merge automation
- **If REJECTED**:
    - Reviewer commits: `[AGENT:kimi] [ACTION:reject] [TASK:XXX]`
    - Agent reads feedback from `.ai/reviews/TASK-XXX-review.md`
    - Agent fixes issues, re-submits (back to Stage 4)

9. **Stage 7: Merge**

- Post-commit hook (on `[ACTION:approve]`) triggers merge
- Hook merges agent branch to `pre-mortal`
- Hook commits: `[AGENT:kimi] [ACTION:merge] [TASK:XXX]`
- Context optimization runs (auto-compact if needed)

10. **Stage 8: Completion & Handoff**

    - Status updated in `.ai/status.md` (task → DONE)
    - Dependencies checked (unblock dependent tasks)
    - Next task assigned (if any)
    - Sprint completion detected (if all tasks done)

### Task D2.2: Create detailed routing documentation

**File**: `docs/task-lifecycle-routing.md`**Content**:

1. **Commit Message Format**

- Exact format: `[AGENT:x] [ACTION:y] [TASK:z] Description`
- Valid AGENT values
- Valid ACTION values
- Valid TASK values
- Examples of each

2. **Routing Table**

- Complete table of commit patterns → automation triggers
- What happens for each ACTION
- Who can use each ACTION
- Branch rules (where commits are made)

3. **Post-Commit Hook Routing**

- How hook parses commit messages
- Regex patterns used
- How hook determines what to do
- Async vs sync execution
- Error handling

4. **GitHub Actions Routing**

- Which workflows trigger on which events
- How workflows parse commit messages
- How workflows call Kimi
- How workflows commit results back

5. **Routing Examples**

- Submit → Review
- Approve → Merge
- Reject → Re-submit
- Delegate → Assignment
- Evaluate → Sprint report

### Task D2.3: Create complete example walkthrough

**File**: `docs/task-lifecycle-example.md`**Content**: A complete, real example showing:

1. **Task**: TASK-P4-01 (hypothetical but realistic)

- Task brief (full content)
- Acceptance criteria
- Dependencies

2. **Timeline**: Step-by-step with timestamps
3. **Stage 1: Creation**

- File: `.ai/tasks/TASK-P4-01.md`
- Who created it
- Full file content

4. **Stage 2: Assignment**

- File: `.ai/instructions/cursor-TASK-P4-01.md`
- Commit: `[AGENT:kimi] [ACTION:delegate] [TASK:TASK-P4-01]`
- Full commit message
- How Cursor discovers assignment

5. **Stage 3: Work**

- Branch created: `cursor/TASK-P4-01-gateway-client`
- Commits made (with full messages)
- Files changed
- Progress updates (if any)

6. **Stage 4: Submission**

- Commit: `[AGENT:cursor] [ACTION:submit] [TASK:TASK-P4-01]`
- Full commit message
- Files changed in commit
- Push to remote

7. **Stage 5: Review (Local)**

- Post-commit hook detects submit
- Hook calls Kimi
- Kimi prompt (full content)
- Review file created: `.ai/reviews/TASK-P4-01-review.md`
- Full review content

8. **Stage 5: Review (GitHub Actions)**

- Workflow triggers on push
- Workflow steps (with outputs)
- Kimi call in workflow
- Review file committed back

9. **Stage 6: Approval**

- Commit: `[AGENT:kimi] [ACTION:approve] [TASK:TASK-P4-01]`
- Full commit message

10. **Stage 7: Merge**

    - Post-commit hook triggers merge
    - Merge command executed
    - Merge commit: `[AGENT:kimi] [ACTION:merge] [TASK:TASK-P4-01]`
    - Branch merged to `pre-mortal`

11. **Stage 8: Completion**

    - `.ai/status.md` updated
    - Task marked DONE
    - Dependent tasks unblocked
    - Next task assigned

12. **Git Log**: Complete git log showing all commits in order
13. **File Changes**: Summary of all files created/modified

### Task D2.4: Create advanced scenarios documentation

**File**: `docs/task-lifecycle-advanced.md`**Scenarios**:

1. **Rejection Loop**

- Task submitted → Rejected → Fixed → Re-submitted → Approved
- Multiple review cycles
- How feedback accumulates
- When to escalate

2. **Parallel Tasks**

- Multiple agents working simultaneously
- No dependencies between tasks
- Both submit → Both reviewed → Both merged
- How routing handles parallel work

3. **Task Dependencies**

- Task B depends on Task A
- Task A completes → Task B unblocked
- Automatic assignment of Task B
- Dependency graph visualization

4. **Sprint Lifecycle**

- Sprint start: `[ACTION:delegate] [TASK:SPRINT-3]`
- Session auto-created
- Tasks assigned throughout sprint
- Sprint completion detection
- Session auto-archived
- Evaluation triggered

5. **Context Optimization**

- How context monitoring works
- When auto-compact triggers
- How compaction affects task context
- Session management during tasks

6. **Dynamic Subagents**

- When overseer creates specialized subagent
- How subagent is used in review
- Subagent patterns (debugger, performance, etc.)

### Task D2.5: Create visual diagrams

**Files**: Multiple Mermaid diagrams embedded in documentation**Diagrams**:

1. **Task Lifecycle Flowchart**

- Complete flow from creation to completion
- Decision points (approved/rejected)
- Loops (re-submission)
- Parallel paths

2. **Communication Channels Diagram**

- Shows all channels (commits, files, GitHub Actions, Kimi)
- How they interact
- Data flow

3. **Routing Decision Tree**

- Commit message → Parser → Action → Automation
- All possible paths
- Error paths

4. **GitHub Actions Workflow Diagram**

- When each workflow triggers
- What each workflow does
- How workflows interact with commits

5. **Task Dependency Graph**

- Example with multiple tasks
- Dependencies shown
- Execution order

6. **Sprint Lifecycle Diagram**

- Sprint start → Tasks → Sprint end
- Session management
- Evaluation trigger

### Task D2.6: Create troubleshooting guide

**File**: `docs/task-lifecycle-troubleshooting.md`**Sections**:

1. **Automation Not Triggering**

- Check post-commit hook installed
- Check hook is executable
- Check commit message format
- Check logs (`.git/hooks/post-commit.log`)
- Check Kimi CLI installed and authenticated

2. **GitHub Actions Not Running**

- Check workflow file exists
- Check workflow triggers (branch patterns)
- Check GitHub Secrets (KIMI_API_KEY)
- Check workflow logs
- Check commit message format

3. **Routing Headers Not Parsed**

- Verify exact format: `[AGENT:x] [ACTION:y] [TASK:z]`
- Check for typos
- Check for extra spaces
- Check case sensitivity

4. **Review Not Created**

- Check Kimi API key
- Check agent file exists
- Check task file exists
- Check Kimi output logs
- Check file permissions

5. **Merge Not Happening**

- Check approve commit format
- Check branch exists
- Check merge permissions
- Check for merge conflicts

6. **Status Not Updated**

- Check `.ai/status.md` format
- Check file permissions
- Check merge automation ran
- Check status update logic

### Task D2.7: Create reference tables

**File**: `docs/task-lifecycle-reference.md`**Tables**:

1. **ACTION Reference Table**

- All valid ACTION values
- What each does
- Who uses it
- When to use it
- Example commit message

2. **File Reference Table**

- All `.ai/` files involved
- What each file contains
- Who writes it
- Who reads it
- When it's created/updated

3. **Commit Pattern Reference**

- All commit patterns
- What triggers
- Branch rules
- Examples

4. **GitHub Actions Reference**

- All workflows
- When they trigger
- What they do
- Required secrets
- Output files

5. **Kimi Session Reference**

- Session lifecycle
- When sessions are created
- When sessions are archived
- How sessions are used

### Task D2.8: Create integration with existing docs

**Update existing documentation to reference task lifecycle docs**:

1. **Update `AGENTS.md`**:

- Add reference to task lifecycle documentation
- Link from "Git Workflow" section

2. **Update `docs/kimi-sessions.md`**:

- Add section on task lifecycle integration
- Link to task lifecycle docs

3. **Update `docs/claude-kimi-coordination.md`**:

- Add section on task lifecycle
- Link to task lifecycle docs

4. **Update `.agents/skills/task-handoff/SKILL.md`**:

- Add reference to detailed documentation
- Link to task lifecycle docs

5. **Update `.agents/skills/git-routing/SKILL.md`**:

- Add reference to detailed routing documentation
- Link to task lifecycle routing docs

## Success Metrics

- [ ] Complete task lifecycle documented (all 8 stages)
- [ ] Routing fully explained (commit parsing, hook routing, GitHub Actions)
- [ ] Complete example walkthrough provided (real task from start to finish)
- [ ] Advanced scenarios documented (rejection, parallel, dependencies, sprint)
- [ ] Visual diagrams created (6+ Mermaid diagrams)
- [ ] Troubleshooting guide complete
- [ ] Reference tables complete
- [ ] Integration with existing docs complete
- [ ] All examples use real commit messages and file paths

## Design Decisions

1. **Multiple files**: Break into logical sections for easier navigation
2. **Real examples**: Use realistic but hypothetical examples (not actual project data)