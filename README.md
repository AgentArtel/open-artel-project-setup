# Open Artel Project Setup

A coordination and workflow system for multi-agent AI development. Provides starter kits, templates, and reference configurations that agent teams use to build products together.

## What This Is

This repo doesn't build products — it builds the **system** that agent teams follow to build products. It defines:

- How agents coordinate (board, tasks, boundaries)
- How work flows through the pipeline (brainstorm → plan → execute → verify)
- What each agent owns and doesn't own (file boundaries)
- How to avoid repeating mistakes (lessons learned)

## For Humans

### Starting a new project

1. Copy the starter kit into your project:

```bash
cp -r setups/multi-agent-starter/{AGENTS.md,CLAUDE.md,BOOTSTRAP_PLAYBOOK.md,.cursor,.ai} your-project/
```

2. Open in Claude Code and run the prompt from `BOOTSTRAP_PLAYBOOK.md` — it analyzes your codebase and fills in all the placeholders.

3. Set up Cursor and Lovable per the playbook.

Full instructions: `setups/multi-agent-starter/README.md`

### Migrating an existing project

If you already have an Open Artel project and want the latest coordination features (board, pipeline, session protocols):

```bash
# See what would change (dry run)
./scripts/migrate-to-v2.sh

# Apply changes
./scripts/migrate-to-v2.sh --apply
```

The migration script adds missing files (board.md, lessons.md, workflow-principles.md, session hook) without overwriting anything that already exists. Use `--force` to also update the task template.

### Ongoing

- Review `.ai/board.md` to see who's doing what
- Review `.ai/status.md` for sprint backlog
- Check `.ai/lessons.md` for patterns to watch out for
- Approve structural changes agents propose in board.md's "Decisions Pending" section

## For Agents

### Session start — every time

1. Read `.ai/board.md` — who's doing what, what's blocked
2. Read `.ai/lessons.md` — don't repeat past mistakes
3. Check `.ai/tasks/` for active assignments
4. Update `.ai/board.md` with your current activity

### Pipeline — for non-trivial work

```
brainstorm → write plan → execute → verify → finish
```

Skip brainstorm and plan for trivial fixes (typos, small updates).

### Key files

| What you need | Where to find it |
|---------------|-----------------|
| Who's doing what right now | `.ai/board.md` |
| Sprint backlog | `.ai/status.md` |
| Your file boundaries | `.ai/boundaries.md` |
| Operating discipline | `.ai/workflow-principles.md` |
| Past mistakes to avoid | `.ai/lessons.md` |
| Task briefs | `.ai/tasks/` |
| Task template | `.ai/templates/task.md` |

### Session end

1. Update `.ai/board.md` — set your status
2. Update `.ai/status.md` if task statuses changed
3. Commit any uncommitted work

## Repo Layout

```
.
├── setups/                      # Starter kits to copy into new projects
│   └── multi-agent-starter/     # Three-agent workflow (Claude + Cursor + Lovable)
├── past-configurations/         # Snapshots from real projects (historical record)
│   └── Even-Openclaw/           # ClawLens project reference
├── scripts/                     # Automation
│   ├── migrate-to-v2.sh         # Upgrade existing projects to v2 coordination
│   └── install-git-hooks.sh     # Optional Kimi Code automation
├── hooks/                       # Session hooks
│   └── session-start            # Auto-loads board, tasks, lessons
├── .ai/                         # This repo's own coordination layer
├── .agents/                     # Kimi Overseer agent + skill definitions
└── docs/plans/                  # Brainstorm designs and implementation plans
```

## Saving a configuration

To snapshot a project's coordination config for reference:

1. Create `past-configurations/<ProjectName>/`
2. Copy the project's `.ai/` and coordination files into it
3. Commit and push

These are historical records — don't modify them after saving without explicit approval.

## Tech stack

Pure Markdown. Zero runtime dependencies. Content is prose, validated by human review.
