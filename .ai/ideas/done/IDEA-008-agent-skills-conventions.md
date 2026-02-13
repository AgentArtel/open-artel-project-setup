## IDEA-008: Agent Skills for Open Artel conventions

- **Category**: Kimi Integration
- **Origin**: TASK-002
- **Status**: complete
- **Feasibility**: Ready
- **Roadmap Phase**: Phase 2 (Agent Skills)
- **Implemented**: Phase 2 (2026-02-10)

### The Idea

SKILL.md files that codify Open Artel conventions — task format, boundaries, Git workflow. Auto-loaded by Kimi Code agents.

### Why It Matters

Consistency without manual prompting. Reusable across projects. Version-controlled.

### Research Findings

**Six skills designed** (TASK-002-research.md, Section 7):

```
.agents/skills/
├── open-artel-workflow/    # Agent roles, workflow steps, communication
├── task-protocol/          # Task brief format, lifecycle, acceptance criteria
├── git-routing/            # Commit message routing rules
├── review-checklist/       # Code review standards
├── boundary-enforcement/   # File ownership rules
└── sprint-management/      # Sprint planning and tracking
```

**Format**: YAML frontmatter (`name`, `description`) + Markdown content. Keep under 500 lines; use subdirectories for detail.

**Discovery**: Auto-discovered from `.agents/skills/` (project-level) and `~/.config/agents/skills/` (user-level). Cross-tool compatible (Kimi CLI, Claude Code, Codex).

**Loading**: On-demand (AI reads when relevant) or explicit (`/skill:<name>`).

### Answers to Open Questions

- **What to codify**: Task format, boundaries, Git workflow, review checklist, sprint protocol. One skill per concern.
- **Location**: `.agents/skills/` at project level.
- **Versioning**: Git — skills live in the repo.
- **Composition**: Relative paths to reference other files. Subdirectories for detailed content.

### Implementation Summary

**9 skills created** (6 standard + 3 flow): `open-artel-workflow`, `task-protocol`, `git-routing`, `review-checklist`, `boundary-enforcement`, `sprint-management`, `sprint-execution` (flow), `code-review` (flow), `task-handoff` (flow). All in `.agents/skills/`.

### Dev Log

| Date | Stage | Action | By |
|------|-------|--------|----|
| 2026-02-10 | capture | Extracted from TASK-002 brainstorm | Claude Code |
| 2026-02-10 | research | 6 skills designed with format spec | Claude Code |
| 2026-02-10 | complete | 9 SKILL.md files created | Cursor + Human |

### Related Ideas

- IDEA-007 (subagents use skills), IDEA-009 (Flow Skills for workflows)
