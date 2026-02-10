# Multi-Agent Starter Kit

Drop this into any project to set up a multi-agent development workflow
(Claude Code + Cursor + Lovable + optional Kimi Overseer).

## Quick Start

### 1. Copy the starter kit into your project

```bash
# From the open-artel-project-setup repo:
cd setups/multi-agent-starter

# Copy everything into your project root
cp AGENTS.md CLAUDE.md BOOTSTRAP_PLAYBOOK.md /path/to/your/project/
cp -r .cursor /path/to/your/project/
cp -r .ai /path/to/your/project/
cp -r .agents /path/to/your/project/
cp -r scripts /path/to/your/project/
cp -r docs /path/to/your/project/
cp -r .github /path/to/your/project/
```

Or use the one-liner:

```bash
# From your project root:
STARTER=/path/to/open-artel-project-setup/setups/multi-agent-starter
cp "$STARTER"/AGENTS.md "$STARTER"/CLAUDE.md "$STARTER"/BOOTSTRAP_PLAYBOOK.md .
cp -r "$STARTER"/.cursor "$STARTER"/.ai "$STARTER"/.agents "$STARTER"/scripts "$STARTER"/docs "$STARTER"/.github .
```

### 2. Run the bootstrap

Open the project in Claude Code and paste the prompt from `BOOTSTRAP_PLAYBOOK.md`.
Claude Code will:
- Analyze your codebase and fill in `[REPLACE]` placeholders
- Create `.ai/boundaries.md` (file-to-agent ownership map)
- Add project-specific Cursor rules
- Update `.agents/` YAML files with your project name

### 3. (Optional) Set up Kimi Overseer

```bash
# Install Kimi CLI
pipx install kimi-cli
kimi    # then /login

# One-command setup
./scripts/setup-kimi-project.sh

# Verify
./scripts/verify-kimi-setup.sh
```

### 4. Set up Cursor

Open the project in Cursor. Open `.ai/CURSOR_WORKFORCE.md` and follow the
steps to create your Manager Chat.

### 5. Configure Lovable

Copy `.ai/lovable-knowledge.md` contents into Lovable → Project Settings → Knowledge.

### 6. Start building

You now have:
- **Claude Code** as your architect and reviewer
- **Cursor** as your implementation workforce (manager + task chats)
- **Lovable** as your UI specialist
- **Kimi Overseer** (optional) as your automated coordinator
- **`.ai/`** as the shared coordination layer between all agents

---

## What's Inside

```
multi-agent-starter/
├── README.md                           ← You're here
├── AGENTS.md                           ← Copy to project root (has [REPLACE] placeholders)
├── CLAUDE.md                           ← Copy to project root (orchestrator config)
├── BOOTSTRAP_PLAYBOOK.md               ← Step-by-step setup process
│
├── .cursor/rules/                      ← Cursor IDE governance rules
│   ├── 00-project-context.mdc          ← alwaysApply: multi-agent awareness
│   ├── 05-agent-boundaries.mdc         ← file ownership map
│   ├── 06-task-protocol.mdc            ← task handoff format
│   ├── 07-kimi-integration.mdc         ← Kimi commit-based workflow
│   └── 07-workforce-protocol.mdc       ← manager/task chat system
│
├── .ai/                                ← Coordination layer
│   ├── status.md                       ← Sprint status board
│   ├── lovable-knowledge.md            ← Lovable Knowledge panel content
│   ├── CURSOR_WORKFORCE.md             ← Cursor workforce setup guide
│   ├── tasks/.gitkeep                  ← Task assignment files
│   ├── instructions/.gitkeep           ← Agent task assignments
│   ├── reviews/.gitkeep                ← Code review feedback
│   ├── reports/.gitkeep                ← Status and completion reports
│   ├── chats/.gitkeep                  ← Agent-to-agent conversation logs
│   ├── templates/                      ← Templates for all coordination files
│   │   ├── task.md                     ← Task brief template
│   │   ├── review.md                   ← Code review template
│   │   ├── instruction.md              ← Task assignment template
│   │   ├── report.md                   ← Status report template
│   │   ├── commit-message.md           ← Commit routing format guide
│   │   ├── chat.md                     ← Conversation log template
│   │   ├── idea.md                     ← Feature idea template
│   │   └── evaluation-report.md        ← Sprint evaluation template
│   ├── patterns/                       ← Reusable workflow patterns
│   │   ├── create-subagent-*.md        ← Dynamic subagent patterns (4 files)
│   │   ├── agent-swarm-*.md            ← Parallel dispatch patterns (2 files)
│   │   └── multimodal-ui-review.md     ← Vision-based UI review pattern
│   ├── metrics/                        ← Context and performance tracking
│   │   ├── thresholds.json             ← Auto-compact thresholds
│   │   ├── context-history.json        ← Context measurement history
│   │   └── uploaded-files.json         ← Moonshot Files API tracking
│   └── sessions/                       ← Kimi session management
│       ├── active/.gitkeep
│       └── archived/.gitkeep
│
├── .agents/                            ← Kimi agent definitions
│   ├── kimi-overseer.yaml              ← Main overseer agent (has [REPLACE] placeholder)
│   ├── reviewer-sub.yaml               ← Code review subagent (has [REPLACE] placeholder)
│   ├── researcher-sub.yaml             ← Research subagent (has [REPLACE] placeholder)
│   ├── prompts/
│   │   └── overseer.md                 ← Overseer system prompt (generic)
│   ├── skills/                         ← Auto-discovered skill definitions
│   │   ├── open-artel-workflow/        ← Multi-agent workflow conventions
│   │   ├── task-protocol/              ← Task brief format and lifecycle
│   │   ├── git-routing/                ← Commit message routing rules
│   │   ├── review-checklist/           ← Code review standards
│   │   ├── boundary-enforcement/       ← File ownership rules
│   │   ├── sprint-management/          ← Sprint planning and tracking
│   │   ├── sprint-execution/           ← Automated sprint workflow
│   │   ├── code-review/                ← Automated review process
│   │   └── task-handoff/               ← Agent-to-agent handoff
│   └── subagents/                      ← Dynamic subagent templates
│       ├── debugger-template.md
│       ├── performance-analyzer-template.md
│       ├── documentation-writer-template.md
│       └── test-generator-template.md
│
├── scripts/                            ← Automation scripts
│   ├── setup-kimi-project.sh           ← One-command Kimi setup
│   ├── verify-kimi-setup.sh            ← Health check / diagnostics
│   ├── quick-kimi-check.sh             ← Fast pre-work check (< 5s)
│   ├── install-git-hooks.sh            ← Git hook installation
│   ├── post-commit                     ← Git post-commit hook (source)
│   ├── post-commit.template            ← Customizable hook template
│   ├── generate-evaluation.sh          ← Sprint evaluation reports
│   ├── kimi-session-manager.sh         ← Session lifecycle management
│   ├── kimi-context-monitor.sh         ← Context health monitoring
│   ├── create-specialized-subagent.sh  ← Dynamic subagent helper
│   ├── setup-project-api-key.sh        ← Moonshot API key management
│   ├── moonshot-api-client.py          ← Moonshot Files API client
│   ├── upload-project-files.py         ← File upload/sync to Moonshot
│   ├── start-acp-server.sh             ← ACP/Web server management
│   ├── install-wire-daemon.sh          ← Wire Mode daemon installer
│   └── wire-daemon.py                  ← Wire Mode daemon (advanced)
│
├── docs/                               ← Integration and feature guides
│   ├── cursor-kimi-integration.md      ← Cursor ↔ Kimi workflow
│   ├── claude-kimi-coordination.md     ← Claude ↔ Kimi coordination
│   ├── kimi-sessions.md                ← Session management guide
│   ├── kimi-context-optimization.md    ← Context monitoring guide
│   ├── kimi-agent-swarm.md             ← Agent Swarm patterns
│   ├── kimi-multimodal.md              ← Vision + text capabilities
│   ├── kimi-acp-integration.md         ← ACP/Web/Term modes
│   ├── kimi-wire-enhancements.md       ← Wire Mode daemon features
│   ├── kimi-evaluation-procedures.md   ← Evaluation and testing
│   ├── moonshot-api-integration.md     ← Moonshot Files API guide
│   ├── github-actions-automation.md    ← CI/CD workflow guide
│   └── wire-daemon.md                  ← Wire Mode daemon guide
│
└── .github/workflows/                  ← GitHub Actions CI/CD
    ├── agent-review.yml                ← Auto-review on agent push
    ├── pre-mortal-merge.yml            ← Pre-mortal validation
    └── sprint-evaluation.yml           ← Sprint evaluation reports
```

## What Needs Customizing

Files with `[REPLACE]` placeholders that Claude Code fills in during bootstrap:

| File | What to customize |
|------|-------------------|
| `AGENTS.md` | Tech stack, project structure, file ownership lists |
| `.cursor/rules/00-project-context.mdc` | App identity, architecture constraints |
| `.cursor/rules/05-agent-boundaries.mdc` | Specific files per agent domain |
| `.agents/kimi-overseer.yaml` | `PROJECT_NAME` in `system_prompt_args` |
| `.agents/reviewer-sub.yaml` | `PROJECT_NAME` in `system_prompt_args` |
| `.agents/researcher-sub.yaml` | `PROJECT_NAME` in `system_prompt_args` |
| `.ai/lovable-knowledge.md` | Project name, DO NOT MODIFY file lists |
| `.ai/CURSOR_WORKFORCE.md` | Project name in manager prompt |

Files that work as-is (no customization needed):

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Orchestrator role (generic) |
| `.cursor/rules/06-task-protocol.mdc` | Task handoff format (generic) |
| `.cursor/rules/07-kimi-integration.mdc` | Kimi integration (generic) |
| `.cursor/rules/07-workforce-protocol.mdc` | Chat roles and formats (generic) |
| `.agents/prompts/overseer.md` | Overseer system prompt (uses variables) |
| `.agents/skills/` | All skill definitions (generic) |
| `.agents/subagents/` | All subagent templates (generic) |
| `.ai/templates/` | All coordination templates (generic) |
| `.ai/patterns/` | All workflow patterns (generic) |
| `scripts/` | All scripts (generic, use git root for paths) |
| `docs/` | All documentation guides (generic) |
| `.github/workflows/` | CI/CD workflows (generic) |

## Feature Overview

The starter kit includes these capabilities:

| Feature | Required? | Setup |
|---------|-----------|-------|
| Three-agent workflow | Yes | Copy files, run bootstrap |
| Task coordination (`.ai/`) | Yes | Included in copy |
| Cursor rules | Yes | Included in copy |
| Kimi Overseer | Optional | `./scripts/setup-kimi-project.sh` |
| Git hooks (auto-review) | Optional | `./scripts/install-git-hooks.sh` |
| Session management | Optional | Requires Kimi CLI |
| Context monitoring | Optional | Requires Kimi CLI |
| Dynamic subagents | Optional | Requires Kimi CLI |
| Moonshot Files API | Optional | Requires API key |
| GitHub Actions CI/CD | Optional | Add `KIMI_API_KEY` to GitHub Secrets |
| Wire Mode daemon | Optional | `./scripts/install-wire-daemon.sh` |
| Sprint evaluation | Optional | `./scripts/generate-evaluation.sh` |

## Updating from Upstream

The starter kit evolves as new features are added to the Open Artel system. To pull updates into your project:

```bash
# See what would change (safe — no files modified)
./scripts/sync-upstream.sh --dry-run

# Pull the latest generic files (scripts, docs, templates, patterns, skills)
./scripts/sync-upstream.sh

# See what changed in customized files (AGENTS.md, .cursor/rules/, etc.)
./scripts/sync-upstream.sh --diff

# Review and commit
git diff
git add -A && git commit -m '[AGENT:claude] [ACTION:update] [TASK:SYNC] Sync upstream starter kit'
```

**What gets updated automatically**: `scripts/`, `docs/`, `.ai/templates/`, `.ai/patterns/`, `.agents/skills/`, `.agents/subagents/`, `.agents/prompts/`, `.github/workflows/`, `BOOTSTRAP_PLAYBOOK.md`

**What is never touched**: `.ai/tasks/`, `.ai/reviews/`, `.ai/reports/`, `.ai/chats/`, `.ai/instructions/`, `.ai/ideas/`, `.ai/sessions/`, `.ai/metrics/`, `.ai/status.md`, `.ai/boundaries.md`

**What is skipped (use `--diff` to compare)**: `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.agents/kimi-overseer.yaml`, `.agents/reviewer-sub.yaml`, `.agents/researcher-sub.yaml`

To override the upstream repo URL, set `OPEN_ARTEL_UPSTREAM` in `.env` or `.env.project`.

## Detailed Setup Guide

See `BOOTSTRAP_PLAYBOOK.md` for the complete step-by-step process including:
- Phase 1: Codebase analysis
- Phase 2: Configuration file generation
- Phase 3: Cleanup
- Step 4: Cursor workforce setup
- Step 5: Kimi Overseer setup (optional)
- Step 6: Lovable configuration
- Step 7: First real task cycle
