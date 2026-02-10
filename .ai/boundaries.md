# Decision Authority

What Claude Code can do unilaterally vs. what requires human approval.

## Claude Code — Proceed Freely

These actions stay within scope. Do them, commit, report.

- **Template refinement**: Fix typos, improve clarity, tighten wording in any template
- **Format consistency**: Align templates to match established conventions
- **Task management**: Create, update, and close tasks in `.ai/tasks/`
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
