# Open Artel Project Setup

A coordination and workflow system for multi-agent AI development. This repo contains starter kits, templates, and reference configurations that agent teams use across projects.

## Tech Stack

- **Content**: Pure Markdown (`.md`, `.mdc`) — zero runtime dependencies
- **Tooling**: Git, GitHub, Claude Code CLI
- **Validation**: Manual review (no build, no linter, no tests — content is prose)

## Project Structure

```
.
├── AGENTS.md                    # This file — project identity and roles
├── CLAUDE.md                    # Claude Code instructions
├── README.md                    # Public-facing repo docs
├── .ai/                         # Coordination layer
│   ├── board.md                 # Coordination board — who's doing what RIGHT NOW
│   ├── status.md               # Sprint status and backlog
│   ├── boundaries.md           # File ownership and decision authority
│   ├── workflow-principles.md  # Operating discipline
│   ├── lessons.md              # Lessons learned (read at session start)
│   ├── ideas.md                # Feature ideas index
│   ├── ideas/                  # Individual idea files (pipeline stages)
│   ├── tasks/                  # Task briefs
│   ├── chats/                  # Agent-to-agent conversation logs
│   ├── reports/                # Status and completion reports
│   ├── instructions/           # Task assignments and directives
│   ├── reviews/                # Code review feedback
│   └── templates/              # Templates for all coordination file types
├── setups/                      # Distributable starter kits
│   └── multi-agent-starter/     # Three-agent workflow kit
├── docs/                        # Documentation
│   └── plans/                   # Brainstorm designs and implementation plans
├── hooks/                       # Session hooks
│   └── session-start            # Auto-loads board, tasks, lessons at session start
├── scripts/                     # Git hooks and automation scripts
│   ├── migrate-to-v2.sh         # Upgrade existing projects to v2 coordination
│   └── install-git-hooks.sh     # Optional Kimi Code automation
├── .agents/                     # Kimi Overseer agent + skills
│   ├── kimi-overseer.yaml       # Overseer agent definition
│   ├── prompts/overseer.md      # Overseer system prompt
│   └── skills/                  # Auto-discovered skill definitions
└── past-configurations/         # Snapshots from real projects
    └── Even-Openclaw/           # ClawLens project reference
```

## Team

### Claude Code — System Architect & Builder

**Owns**: `setups/`, `.ai/`, `AGENTS.md`, `CLAUDE.md`, `README.md`

**Does**: Evolve starter kits, maintain coordination layer, track development, propose improvements.

**Does NOT**: Make strategic decisions alone (new setup types, major format changes), modify `past-configurations/` without approval.

### Human — Product Owner & Decision-Maker

**Does**: Set direction, approve structural changes, provide feedback from real projects, final sign-off.

## Content Conventions

- Markdown: ATX headings (`#`), no trailing whitespace, blank line before headings
- Templates use `[BRACKETED]` or `[REPLACE: description]` for placeholders
- Task IDs: `TASK-XXX` (numeric) or `TASK-DESCRIPTIVE-NAME` (named)
- Cursor rules: numbered prefix `NN-name.mdc` with YAML frontmatter
- Past configurations: `past-configurations/ProjectName/`

## Git Workflow

```
main                            # Production-stable, human-reviewed
└── pre-mortal                  # Staging gate — all work lands here first
    ├── claude/<task-id>        # Claude Code development branches
    ├── cursor/<task-id>        # Cursor implementation branches
    ├── lovable/<task-id>       # Lovable UI branches
    └── kimi/overseer           # Kimi Code oversight (optional)
```

- Agent branches from `pre-mortal`, merge back via review
- Human reviews `pre-mortal` before merge to `main`
- Commit messages: `[AGENT:x] [ACTION:y] [TASK:z]` — see `.ai/templates/commit-message.md`
- No force-pushes to `main` or `pre-mortal`

## Git Automation (Optional)

Git hooks route commits to Kimi Code CLI for automated review and merge:

```bash
./scripts/install-git-hooks.sh           # Install hooks
./scripts/install-git-hooks.sh --status  # Check status
./scripts/install-git-hooks.sh --remove  # Remove hooks
```

Requires Kimi Code CLI (`pipx install kimi-cli`). See `scripts/post-commit` for details.

## Where Things Live

| What you need | Where to find it |
|---------------|-----------------|
| Who's doing what right now | `.ai/board.md` |
| Sprint status and backlog | `.ai/status.md` |
| File ownership rules | `.ai/boundaries.md` |
| How agents work | `.ai/workflow-principles.md` |
| Past mistakes to avoid | `.ai/lessons.md` |
| Task briefs | `.ai/tasks/` |
| Task/review/report templates | `.ai/templates/` |
| Commit message format | `.ai/templates/commit-message.md` |
| Feature ideas pipeline | `.ai/ideas.md` + `.ai/ideas/` |
| Brainstorm designs & plans | `docs/plans/` |
| Agent skills (pipeline) | `.agents/skills/` |
| Session context script | `hooks/session-start` |
| Session handoff template | `.ai/templates/handoff.md` |
| Migration script | `scripts/migrate-to-v2.sh` |
