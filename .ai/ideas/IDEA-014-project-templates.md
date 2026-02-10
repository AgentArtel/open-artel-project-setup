## IDEA-014: Project templates for specific types

- **Category**: Templates
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Ready
- **Roadmap Phase**: Phase 8 (Mono-repo and Templates)

### The Idea

Pre-configured templates for specific stacks — React+Supabase, Flutter, TypeScript API — with boundaries and conventions baked in.

### Why It Matters

Less setup time. Best practices pre-populated. Agent boundaries pre-mapped for common stacks.

### Research Findings

**Template hierarchy** (TASK-002-research.md, Section 10):

```
setups/
├── multi-agent-starter/     # Generic (existing)
├── two-agent-starter/       # Claude + Cursor only
├── mono-repo-coordinator/   # Multi-project
└── templates/
    ├── react-supabase/      # React + Supabase + Vite
    ├── flutter-native/      # Flutter mobile
    ├── typescript-api/       # Node.js/TS backend
    └── full-stack/          # Combined
```

Each includes: Pre-populated AGENTS.md, pre-mapped boundaries.md, stack-specific cursor rules, appropriate task templates.

**Difference from starter kits**: More specific, fewer `[REPLACE]` placeholders, pre-configured boundaries based on stack conventions.

### Answers to Open Questions

- **Types**: React+Supabase (priority — matches Even-Openclaw), Flutter, TypeScript API.
- **Difference from kits**: More specific, fewer placeholders, pre-configured.
- **Location**: `setups/templates/` alongside `setups/multi-agent-starter/`.
- **Versioning**: Git — same repo.

### Related Ideas

- IDEA-013 (evaluation criteria), IDEA-015 (mono-repo templates)
