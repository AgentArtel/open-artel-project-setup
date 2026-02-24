# Decision Authority & File Ownership

## Claude Code — Proceed Freely

These actions stay within scope. Do them, commit, report.

- **Template refinement**: Fix typos, improve clarity, tighten wording
- **Format consistency**: Align templates to match established conventions
- **Task management**: Create, update, and close tasks in `.ai/tasks/`
- **Idea management**: Create, update, organize ideas in `.ai/ideas/`
- **Communication**: Write to `.ai/chats/`, `.ai/reports/`, `.ai/instructions/`, `.ai/reviews/`
- **Board and status updates**: Keep `.ai/board.md` and `.ai/status.md` current
- **Documentation**: Update README.md, AGENTS.md, CLAUDE.md for accuracy
- **Analysis**: Review past-configurations and propose improvements
- **Bug fixes**: Fix broken references, dead links, inconsistencies

## Needs Human Approval

These change the system's shape or strategy. Propose, explain, wait.

- **New setup types**: Adding a new directory under `setups/`
- **Format overhauls**: Changing task brief format, boundary format, status board format
- **New past-configurations**: Adding a new project snapshot
- **Deleting content**: Removing any setup, template, or past-configuration
- **Protocol changes**: Modifying workforce protocol, delegation rules, review checklists
- **Structural changes**: Reorganizing the repo layout, renaming directories

## Shared Decisions

Discuss but not blocked on approval.

- **Cursor rule changes**: Modifying `.mdc` files
- **Template additions**: Adding new files within an existing setup
- **Convention changes**: Naming conventions, commit formats
- **Agent Skills**: Creating or modifying skills in `.agents/skills/`

## File Ownership (for downstream projects using the starter kit)

| Domain | Owner | Examples |
|--------|-------|---------|
| **Business logic** | Cursor | Hooks, services, API clients, utilities |
| **Visual components** | Lovable | Design system (`ui/`), layouts, styling, CSS |
| **Config and docs** | Claude Code | AGENTS.md, package.json, tsconfig, .ai/ |
| **Oversight** | Kimi Code | Reviews, instructions, status updates |

### Typical Ownership Map

```
src/
├── components/
│   ├── ui/              → Lovable
│   └── [features]/      → Cursor
├── pages/               → Cursor
├── hooks/               → Cursor
├── services/            → Cursor
├── lib/                 → Cursor
├── types/               → Claude Code
├── App.tsx              → Claude Code
├── main.tsx             → Claude Code
├── index.css            → Lovable
└── App.css              → Lovable

.ai/                     → Claude Code
docs/                    → Claude Code
package.json             → Claude Code
tsconfig*.json           → Claude Code
vite.config.ts           → Claude Code
tailwind.config.ts       → Claude Code
```

## Communication Folder Ownership

| Folder | Who Writes | Who Reads | Purpose |
|--------|-----------|-----------|---------|
| `.ai/board.md` | All agents | All agents | Real-time coordination state |
| `.ai/tasks/` | Claude Code | All agents | Task specifications |
| `.ai/instructions/` | Kimi, Claude Code | Target agent | Directives and assignments |
| `.ai/reviews/` | Kimi, Claude Code | Submitting agent + Human | Code review feedback |
| `.ai/reports/` | All agents | Human + all agents | Status reports |
| `.ai/chats/` | All agents | All agents | Conversation logs |
| `.ai/ideas/` | Claude Code | All agents + Human | Feature ideas |
| `.ai/templates/` | Claude Code | All agents | Templates for all file types |

### File Naming Conventions

| Folder | Pattern | Example |
|--------|---------|---------|
| `tasks/` | `TASK-XXX.md` | `TASK-P4-01.md` |
| `instructions/` | `<target-agent>-<task>.md` | `cursor-TASK-P4-01.md` |
| `reviews/` | `<task-id>-review.md` | `TASK-P4-01-review.md` |
| `reports/` | `<type>-<identifier>.md` | `sprint-3-summary.md` |
| `chats/` | `<agent1>-<agent2>-<context>.md` | `kimi-cursor-TASK-P4-01.md` |
| `ideas/` | `IDEA-XXX-<description>.md` | `IDEA-001-git-branch-workflow.md` |
