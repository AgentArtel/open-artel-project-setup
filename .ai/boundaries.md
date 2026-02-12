# Decision Authority

What Claude Code can do unilaterally vs. what requires human approval.

## Claude Code — Proceed Freely

These actions stay within scope. Do them, commit, report.

- **Template refinement**: Fix typos, improve clarity, tighten wording in any template
- **Format consistency**: Align templates to match established conventions
- **Task management**: Create, update, and close tasks in `.ai/tasks/`
- **Idea management**: Create, update, and organize feature ideas in `.ai/ideas/` and `.ai/ideas.md`
- **Communication**: Write to `.ai/chats/`, `.ai/reports/`, `.ai/instructions/`, `.ai/reviews/`
- **Status updates**: Keep `.ai/status.md` current
- **Documentation**: Update README.md, AGENTS.md, CLAUDE.md for accuracy
- **Memory management**: Update persistent memory files for cross-session continuity
- **Analysis**: Review past-configurations and propose improvements
- **Bug fixes**: Fix broken references, dead links, inconsistencies across templates

## Needs Human Approval

These change the system's shape or strategy. Propose, explain reasoning, wait for sign-off.

- **New setup types**: Adding a new directory under `setups/` (e.g., `two-agent-starter/`)
- **Format overhauls**: Changing the task brief format, boundary format, or status board format
- **New past-configurations**: Adding a new project snapshot to `past-configurations/`
- **Deleting content**: Removing any setup, template, or past-configuration
- **Protocol changes**: Modifying the workforce protocol, delegation rules, or review checklists
- **Structural changes**: Reorganizing the repo layout, renaming directories
- **Scope expansion**: Adding non-markdown content (scripts, tools, automation)

## Shared Decisions

These benefit from discussion but aren't blocked on approval.

- **Cursor rule changes**: Modifying `.mdc` file content or adding new rule files
- **Template additions**: Adding new files within an existing setup (e.g., a new template)
- **Convention changes**: Updating naming conventions, commit message formats
- **Agent Skills**: Creating or modifying skills in `.agents/skills/`

## Communication Folder Ownership

| Folder | Who Writes | Who Reads | Purpose |
|--------|-----------|-----------|---------|
| `.ai/tasks/` | Claude Code | All agents | Task specifications (what to build) |
| `.ai/instructions/` | Kimi, Claude Code | Target agent | Directives and assignments |
| `.ai/reviews/` | Kimi, Claude Code | Submitting agent + Human | Code review feedback and decisions |
| `.ai/reports/` | All agents, primarily Kimi | Human + all agents | Status reports, sprint summaries |
| `.ai/chats/` | Post-commit hook (auto) + all agents | All agents | Inter-agent communication logs (auto-populated on submit, approve, reject, delegate) |
| `.ai/ideas/` | Claude Code | All agents + Human | Feature ideas backlog |
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

## Agent Chat Workspaces

Agent chats should organize their work in dedicated workspaces to keep all related files together and trackable.

### Structure

- **Location**: `.ai/agent-chats/<chat-name>/`
- **Naming**: Use descriptive names like `manager-a-<task>`, `manager-b-<task>`, `<agent>-<purpose>`
- **Purpose**: Keep all work from a specific agent chat organized in one place

### Workspace Contents

Each workspace contains:
- `instructions/` - Instructions created by this chat
- `reports/` - Reports created by this chat
- `chats/` - Chat logs for this coordination
- `README.md` - Workspace documentation (purpose, status, key files)

### When to Create a Workspace

Create a workspace when:
- Starting a new agent chat that will create multiple files
- Coordinating a complex task that spans multiple phases
- Managing parallel work streams (e.g., Manager Chat A and B)
- Need to track all work from a specific agent chat in one place

### Example

```
.ai/agent-chats/manager-a-frontend-coordinator/
├── instructions/
│   ├── EXTERNAL-KIMI-MESSAGE-phase1.md
│   └── external-kimi-frontend-coordinator-phase1.md
├── reports/
│   ├── frontend-coordinator-coordination-2026-02-10.md
│   └── frontend-coordinator-track-a.md
├── chats/
└── README.md
```

### Integration with Existing Structure

- Workspaces are **in addition to** existing `.ai/` folders
- Direct agent assignments (Kimi → Cursor) still go in `.ai/instructions/`
- General project reports still go in `.ai/reports/`
- Workspaces are for **agent chat-specific** work organization

See `.ai/templates/agent-chat-workspace.md` for the full template and guidelines.
