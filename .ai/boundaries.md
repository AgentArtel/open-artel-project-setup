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
- **Scope expansion**: Adding external dependencies or fundamentally new content types

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

## Governance Notes

Exceptions and decisions made by the Human PM, logged for future reference.

| Date | Decision | Context |
|------|----------|---------|
| 2026-02-13 | Cursor's boundary violations on Phases 3-7 accepted | Cursor modified `.ai/`, `setups/`, root configs during Kimi/Moonshot build. Accepted since code works — revisit ownership rules later. |
| 2026-02-13 | Kimi Phase 5 rejection waved through | Kimi Overseer rejected Phase 5 (missing brief, boundary violations). Human accepted the work regardless. |
| 2026-02-13 | Scripts are part of the repo | Repo is no longer "pure markdown." Bash + Python stdlib scripts accepted. No external dependencies (pip/npm). |
| 2026-02-13 | Dashboard is temporary | `pre-mortal` branch dashboard exists for testing Kimi/GitHub integrations. Will be removed when done. |
| 2026-02-13 | Single source of truth for files | Files exist once in `setups/multi-agent-starter/`. Root-level copies are synced from there. No manual duplication. |

## Source of Truth Policy

Files that appear in both the root and `setups/multi-agent-starter/` must have **one authoritative location**:

| File Type | Source of Truth | Synced To |
|-----------|----------------|-----------|
| Scripts (`scripts/`) | `setups/multi-agent-starter/scripts/` | Root `scripts/` |
| Agent configs (`.agents/`) | `setups/multi-agent-starter/.agents/` | Root `.agents/` |
| Docs (`docs/`) | `setups/multi-agent-starter/docs/` | Root `docs/` |
| Templates (`.ai/templates/`) | `setups/multi-agent-starter/.ai/templates/` | Root `.ai/templates/` |
| Cursor rules (`.cursor/rules/`) | `setups/multi-agent-starter/.cursor/rules/` | Root `.cursor/rules/` |
| GitHub workflows (`.github/`) | `setups/multi-agent-starter/.github/` | Root `.github/` |

**Why starter kit is the source**: The starter kit is what gets distributed to projects. It must be complete and correct. Root-level files are just this repo using its own system.

**How to sync**: A `scripts/sync-from-starter.sh` script should copy from `setups/` to root. Run after any starter kit change.

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
