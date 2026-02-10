## TASK-001: Bootstrap self-coordination system

- **Status**: DONE
- **Priority**: P1-High
- **Type**: Create
- **Depends on**: none
- **Blocks**: all future tasks

### Context

This repo distributes coordination systems for other projects but didn't have one for its own development. Without it, there's no structured way to track work, define authority, or maintain continuity across sessions.

### Objective

Establish AGENTS.md, CLAUDE.md, and a `.ai/` coordination layer tailored for the two-party workflow (Claude Code + Human) that develops this system.

### Scope

- Create `AGENTS.md` — project identity, roles, conventions
- Create `CLAUDE.md` — orchestrator instructions for system development
- Create `.ai/boundaries.md` — decision authority map
- Create `.ai/status.md` — development status board
- Create `.ai/templates/task.md` — task brief format for system work
- Create `.ai/tasks/TASK-001.md` — this task

### Acceptance Criteria

- [ ] AGENTS.md reflects the two-party model (not three-agent product model)
- [ ] CLAUDE.md is specific to system development, not product development
- [ ] Boundaries distinguish unilateral actions from approval-required actions
- [ ] Status board reflects real current state
- [ ] Task template is adapted for system work (no agent assignment field)
- [ ] All files follow established markdown conventions
- [ ] Committed and pushed to feature branch

### Notes

This is intentionally lighter than the three-agent setup. No Cursor rules needed (no Cursor agent). No Lovable knowledge panel. No build system to validate against. The coordination layer should be proportional to the actual complexity.
