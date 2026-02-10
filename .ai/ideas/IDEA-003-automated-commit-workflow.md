## IDEA-003: Automated commit workflow cycle

- **Category**: Automation
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Complete automated cycle: commit → triggers review commit → project updates → commit message for report and assigned task → agent does work → pushes to branch for review → commits back with response report and log of fixes applied → next steps → push to next branch → repeat until task sprint completed.

### Why It Matters

Eliminates manual handoffs. Each commit triggers the next step automatically, creating a self-sustaining workflow where agents know exactly what to do next from the commit history.

### Open Questions

- What triggers the "review commit"? (Git hook? GitHub Action? Kimi Code monitoring?)
- How do we handle errors or blocked states in the cycle?
- What's the format for "response report and log of fixes"?
- How do we know when a sprint is "completed" vs. needs more work?

### Related Ideas

- IDEA-001 (branch workflow is the structure)
- IDEA-002 (routing enables the automation)
- IDEA-005 (Kimi Code overseer could orchestrate this)

