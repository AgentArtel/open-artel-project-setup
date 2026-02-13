## IDEA-015: Mono-repo coordination

- **Category**: Mono-repo
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Needs Research
- **Roadmap Phase**: Phase 8 (Mono-repo)

### The Idea

Higher-tier coordination for mono-repos with multiple connected sub-projects.

### Why It Matters

Scales to complex projects like ClawLens (dashboard + plugin + mobile app).

### Research Findings

**Structure** (TASK-002-research.md, Section 10):

```
mono-repo-root/
├── .ai/                    # Top-level (cross-project)
│   ├── status.md
│   ├── tasks/
│   └── projects/           # Per-project status
├── .agents/kimi-overseer.yaml
├── frontend-dashboard/     # Sub-project with own .ai/
├── backend-plugin/
└── mobile-app/
```

**Cross-project tasks**: Top-level TASK files with sub-task references across projects. Dependency tracking (e.g., API contract must land in plugin before dashboard can consume it).

**Kimi at root level**: Reads all `.ai/status.md` files. Routes cross-project tasks. Detects conflicts. Maintains top-level view.

### Answers to Open Questions

- **Relationship**: Root `.ai/` for cross-project, per-project `.ai/` for local work.
- **Dependencies**: Top-level task briefs with explicit sub-task references.
- **Structure**: Root oversees, projects execute.
- **Agent awareness**: Root-level Kimi overseer has visibility into all sub-projects.

### Related Ideas

- IDEA-001 (mono-repo branches), IDEA-013 (cross-project eval), IDEA-014 (templates)
