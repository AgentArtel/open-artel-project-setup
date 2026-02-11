# Idea Pipeline Workflow

Ideas progress through numbered folders that mirror the lifecycle from concept to completion. Each transition generates specific artifacts and hands off to the right agent.

## Pipeline Stages

```
.ai/ideas/
├── 1-capture/       Raw ideas — what is it, why does it matter
├── 2-research/      Investigation — feasibility, design, open questions answered
├── 3-approved/      Ready to build — task brief + handoff doc written
├── 4-in-progress/   Actively being built — linked to agent branch
├── 5-complete/      Done — implemented, tested, verified
└── ideas.md         Master index (all ideas, all stages, at a glance)
```

## Stage Details

### 1-capture/

**What lives here**: Raw ideas. Could be a sentence, a paragraph, a brainstorm dump.

**Required fields**: ID, title, category, origin (who/what sparked it).

**Who works here**: Anyone. Human drops ideas, agents capture patterns they notice.

**Exit criteria**: The idea is clear enough to investigate. Someone can explain what it is and why it matters in 2-3 sentences.

**Transition → 2-research**: Move the file. No artifacts generated yet — this is just about clarity.

### 2-research/

**What lives here**: Ideas being investigated. Feasibility assessed, design sketched, open questions answered.

**Required fields**: Everything from capture + research findings, feasibility rating, open questions (answered), related ideas.

**Who works here**: Claude Code (system architect) or Kimi researcher subagent.

**Exit criteria**:
- Feasibility rated (Ready / Feasible / Experimental / Needs More Research)
- Open questions answered with evidence
- Dependencies on other ideas identified
- Rough design sketched

**Transition → 3-approved**: Human approves. On approval, generate:
1. Update the idea file with `Status: approved`
2. Write a **task brief** at `.ai/tasks/TASK-XXX.md` using the task template
3. Write a **handoff doc** at `.ai/instructions/<agent>-TASK-XXX.md` for the implementing agent
4. Add entry to the **dev log** section in the idea file
5. Move the file to `3-approved/`

### 3-approved/

**What lives here**: Ideas approved for implementation. Task brief exists, handoff is written, waiting for assignment.

**Required fields**: Everything from research + task ID, assigned agent, handoff reference.

**Who works here**: Kimi overseer assigns from this queue. Human can prioritize.

**Exit criteria**: An agent picks it up and starts a branch.

**Transition → 4-in-progress**: Agent creates branch and starts work. Update:
1. Idea file: `Status: in-progress`, add branch name and start date to dev log
2. Task brief: `Status: IN_PROGRESS`
3. Move the file to `4-in-progress/`

### 4-in-progress/

**What lives here**: Ideas actively being built. Linked to an agent branch and task.

**Required fields**: Everything from approved + branch name, implementing agent, start date.

**Who works here**: The assigned agent (Cursor, Claude Code, Lovable). Overseer monitors.

**Exit criteria**: Implementation complete, tests passing, submitted for review.

**Transition → 5-complete**: After review approval:
1. Idea file: `Status: complete`, add completion date and implementation notes to dev log
2. Task brief: `Status: DONE`
3. Dev log entry: what was built, where it lives, any deviations from plan
4. Move the file to `5-complete/`

### 5-complete/

**What lives here**: Finished ideas. Implemented, tested, merged. Historical record.

**Required fields**: Everything + completion date, implementation summary, files created/modified.

**Who works here**: Nobody actively. This is the archive. Referenced when planning related ideas.

## Dev Log Format

Every idea file has a `### Dev Log` section at the bottom that records the journey:

```markdown
### Dev Log

| Date | Stage | Action | By |
|------|-------|--------|----|
| 2026-02-10 | capture | Idea captured from TASK-002 brainstorm | Claude Code |
| 2026-02-10 | research | Feasibility assessed, design sketched | Claude Code |
| 2026-02-10 | approved | Human approved, task brief TASK-XXX created | Human PM |
| 2026-02-11 | in-progress | Branch cursor/TASK-XXX created | Cursor |
| 2026-02-11 | complete | Merged to pre-mortal, 6 SKILL.md files created | Cursor |
```

## Handoff Document Format

Written when an idea transitions from research → approved. Lives at `.ai/instructions/<agent>-TASK-XXX.md`.

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

## References
- Idea: .ai/ideas/3-approved/IDEA-XXX-name.md
- Task: .ai/tasks/TASK-XXX.md
- Related: [links to related ideas or docs]
```

## Quick Reference

| From | To | Who Triggers | Artifacts Generated |
|------|----|-------------|-------------------|
| 1-capture | 2-research | Claude Code / Kimi | — (just move) |
| 2-research | 3-approved | Human approves | Task brief, handoff doc, dev log entry |
| 3-approved | 4-in-progress | Kimi assigns / agent picks up | Dev log entry (branch, start date) |
| 4-in-progress | 5-complete | Review approved + merged | Dev log entry (completion notes), task status DONE |
