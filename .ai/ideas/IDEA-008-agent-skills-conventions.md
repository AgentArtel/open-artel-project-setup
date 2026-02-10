## IDEA-008: Agent Skills for Open Artel conventions

- **Category**: Kimi Integration
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Create Agent Skills (SKILL.md files) that codify Open Artel conventions: task format, boundaries, Git workflow, code standards. These skills get loaded into Kimi Code agents so they automatically follow project conventions.

### Why It Matters

Ensures consistency across all agents without manual prompting. Skills are reusable across projects and can be version-controlled alongside the codebase.

### Open Questions

- What conventions should be codified? (task format, boundaries, Git workflow, code style?)
- Where do skills live? (project-level `.agents/skills/`? user-level?)
- How do we version skills? (Git? separate repo?)
- Can skills reference other skills? (composition)

### Related Ideas

- IDEA-007 (subagents use these skills)
- IDEA-009 (Flow Skills for workflows)

