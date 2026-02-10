# Open Artel Project Setup

Multi-agent AI development workflow — starter kits, templates, and reference configurations for teams using Claude Code, Cursor, Lovable, and Kimi Code.

## Set Up a New Project (For Agents)

Tell your agent:

> Clone `open-artel-project-setup` and follow the instructions in `setups/multi-agent-starter/README.md` to set up this project with the `.ai` coordination layer.

Or do it manually:

```bash
# 1. Clone this repo
git clone https://github.com/your-org/open-artel-project-setup.git

# 2. Copy the starter kit into your project
cd open-artel-project-setup/setups/multi-agent-starter
cp AGENTS.md CLAUDE.md BOOTSTRAP_PLAYBOOK.md /path/to/your/project/
cp -r .cursor .ai .agents scripts docs .github /path/to/your/project/

# 3. Open your project in Claude Code and run BOOTSTRAP_PLAYBOOK.md
# Claude Code will analyze your codebase, fill in placeholders, and configure everything

# 4. (Optional) Set up Kimi Overseer
cd /path/to/your/project
./scripts/setup-kimi-project.sh
```

Full instructions: **[`setups/multi-agent-starter/README.md`](setups/multi-agent-starter/README.md)**

## What You Get

After setup, your project will have:

| Component | What It Does |
|-----------|-------------|
| `AGENTS.md` | Universal source of truth — tech stack, agent roles, file ownership, git workflow |
| `CLAUDE.md` | Claude Code orchestrator configuration |
| `.cursor/rules/` | 5 governance rules for Cursor IDE (boundaries, tasks, workforce, Kimi) |
| `.ai/` | Full coordination layer — tasks, reviews, instructions, reports, templates, patterns |
| `.agents/` | Kimi agent definitions, skills, subagent templates, system prompts |
| `scripts/` | 16 automation scripts (git hooks, session management, evaluation, API client) |
| `docs/` | 12 integration guides (Kimi, Moonshot, GitHub Actions, Wire Mode) |
| `.github/workflows/` | 3 CI/CD workflows (auto-review, pre-mortal validation, evaluation) |

## Layout

```
.
├── setups/                      # Starter kits to copy into new projects
│   ├── README.md                # How to use the setups
│   └── multi-agent-starter/     # Full multi-agent workflow kit ← START HERE
│       ├── README.md            # Complete setup instructions
│       ├── AGENTS.md            # Template (has [REPLACE] placeholders)
│       ├── CLAUDE.md            # Orchestrator config
│       ├── BOOTSTRAP_PLAYBOOK.md # Step-by-step bootstrap process
│       ├── .cursor/rules/       # Cursor governance rules
│       ├── .ai/                 # Coordination layer (tasks, templates, patterns, metrics)
│       ├── .agents/             # Kimi agent files, skills, subagent templates
│       ├── scripts/             # 16 automation scripts
│       ├── docs/                # 12 integration guides
│       └── .github/workflows/   # 3 CI/CD workflows
├── past-configurations/         # Snapshots from real projects (saved .ai configs for record-keeping)
│   └── Even-Openclaw/           # ClawLens project (root .ai only; subproject .ai live in main repo)
│       └── README.md            # Handoff context and snapshot scope
├── .ai/                         # This repo's own coordination layer
├── .agents/                     # This repo's own agent definitions
├── scripts/                     # This repo's scripts (includes test suites)
├── docs/                        # This repo's documentation
├── AGENTS.md                    # This repo's agent configuration
├── CLAUDE.md                    # This repo's orchestrator config
└── README.md                    # This file
```

### `setups/multi-agent-starter/`

**The complete starter kit.** Copy it into any project to get:

- **Three-agent workflow**: Claude Code (orchestrator) + Cursor (implementation) + Lovable (UI/UX)
- **Kimi Overseer** (optional): Automated reviews, sprint management, agent coordination
- **Task protocol**: Structured task briefs, handoffs, reviews
- **Git automation**: Commit-based routing, automated reviews, branch management
- **Session management**: Named Kimi sessions linked to sprints
- **Context monitoring**: Auto-compact when context grows large
- **Dynamic subagents**: Runtime-created specialist agents for debugging, testing, docs
- **Moonshot Files API**: Upload project files for persistent AI context
- **GitHub Actions**: CI/CD for automated reviews and evaluation

### `past-configurations/`

Snapshots of `.ai/` directories from real projects. Use for:
- Reference when setting up similar projects
- Comparing patterns across projects
- Tracking how configurations evolve

## Saving a Configuration

To save a project's config for reference:

**Note**: This repo only tracks the contents of these folders — not the rest of the original project. For **Even-Openclaw**, this folder contains only the **root** `.ai`; plugin and dashboard `.ai` folders remain in the main repo (see `past-configurations/Even-Openclaw/README.md` for handoff context).

```bash
mkdir -p past-configurations/YourProjectName
cp -r /path/to/project/.ai past-configurations/YourProjectName/
# Optionally include .agents/, docs/, scripts/
```

## Adding New Setup Types

Create a new folder under `setups/` with a README explaining when to use it and how to copy it. Update `setups/README.md` with an entry.
