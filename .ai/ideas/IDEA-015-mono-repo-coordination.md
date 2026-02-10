## IDEA-015: Mono-repo coordination

- **Category**: Mono-repo
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Higher-tier coordination for managing multiple connected projects within a mono-repo. The coordination system oversees multiple connected projects, handles cross-project dependencies, and coordinates agents across projects.

### Why It Matters

Enables scaling the multi-agent system to complex projects with multiple sub-projects. Each sub-project can have its own `.ai/` coordination layer while the mono-repo level provides oversight.

### Open Questions

- What's the relationship between project-level `.ai/` and mono-repo coordination?
- How do we handle cross-project dependencies? (agent boundaries? task routing?)
- What's the coordination structure? (separate `.ai/` at root? shared coordination?)
- How do agents know which project they're working on?

### Related Ideas

- IDEA-001 (branch workflow needs mono-repo awareness)
- IDEA-013 (cross-project evaluation)
- IDEA-014 (mono-repo templates)

