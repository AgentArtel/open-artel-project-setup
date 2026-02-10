# AGENTS.md — Multi-Agent Starter Template
#
# Copy this file to your project root as AGENTS.md.
# Replace all [BRACKETED] placeholders with your project specifics.
# Delete this header comment block when done.

# [Project Name]

[One-line description of what this project does.]

## Tech Stack

- **Frontend**: [e.g., React 18 + TypeScript 5 + Vite 5 + Tailwind 3 + shadcn/ui]
- **Backend**: [e.g., Supabase (PostgreSQL, Edge Functions, Auth, Realtime)]
- **AI**: [e.g., Vercel AI SDK, OpenAI, etc. — or remove if not applicable]
- **State**: [e.g., React Query for server state, React hooks for local state]
- **Routing**: [e.g., React Router 6 — no SSR]

## Commands

```bash
[npm/pnpm/bun] install     # install dependencies
[npm/pnpm/bun] run dev     # dev server
[npm/pnpm/bun] run build   # production build
[npm/pnpm/bun] run lint    # linter
[npm/pnpm/bun] run test    # tests (if applicable)
npx tsc --noEmit            # type check
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # [Design system primitives — Lovable's domain]
│   └── [features]/   # [Feature-specific components]
├── pages/            # [Route pages]
├── hooks/            # [Custom React hooks]
├── services/         # [API integration layer]
├── lib/              # [Shared utilities]
├── types/            # [TypeScript type definitions]
└── App.tsx           # [Main router]
[backend]/            # [Backend directory if applicable]
.ai/                  # Multi-agent coordination
docs/                 # Documentation
```

## Agent Team

Four AI agents share this repo. The Human PM is Accountable for all decisions.

### Claude Code — Orchestrator

**Role**: Architecture, task decomposition, code review, coordination.

**Owns**:
- `AGENTS.md`, `CLAUDE.md`, `.ai/` — coordination files
- `docs/` — documentation
- Root configs: `package.json`, `vite.config.ts`, `tsconfig*.json`, `tailwind.config.ts`
- `App.tsx`, `main.tsx` — routing and app entry
- [Database schema/migrations if applicable]
- [Auto-generated type files]

**Does**: Breaks requirements into tasks, writes specs to `.ai/tasks/`,
reviews completed work, handles cross-cutting refactors.

**Does NOT**: Write production UI components or implement business logic.

### Cursor — Implementation Specialist

**Role**: Business logic, state management, API integration, complex features.

**Owns**:
- [Backend functions/API routes]
- `src/hooks/` — custom hooks (except UI-only hooks)
- `src/services/` — API integration layer
- `src/lib/` — business logic utilities
- [Logic-heavy components — list them explicitly]
- [Logic-heavy pages — list them explicitly]

**Does**: Implements business logic, API integration, complex forms,
data fetching, realtime subscriptions, bug fixes.

**Does NOT**: Modify design system (`src/components/ui/`), change routing
without orchestrator approval, modify auto-generated files.

### Lovable — UI/UX Specialist

**Role**: Visual components, design system, layouts, styling.

**Owns**:
- `src/components/ui/` — design system primitives
- [Layout components]
- [Navigation components]
- [Simple display-only components]
- [UI-only hooks like use-mobile, use-toast]
- `index.css`, `App.css` — global styles

**Does**: Creates design system components, builds layouts, implements
responsive design, adds loading/empty/error states.

**Does NOT**: Modify backend, add complex state management, modify hooks
with business logic, touch config files.

## Code Conventions

- [List your project's conventions here]
- Functional components, named exports, no classes
- TypeScript strict — avoid `any`, use `unknown` and narrow
- [Import conventions, path aliases]
- [Styling conventions]
- [State management conventions]

## Git Workflow

### Branch Hierarchy

```
main                                    # Production-stable, human-reviewed
└── pre-mortal                          # Staging gate — all agent work lands here first
    ├── claude/<task-id>-<description>  # Claude Code task work
    ├── cursor/<task-id>-<description>  # Cursor implementation work
    ├── lovable/<task-id>-<description> # Lovable UI work
    └── kimi/overseer                   # Kimi Code project oversight (optional)
```

| Branch | Purpose | Owner | Merges Into |
|--------|---------|-------|-------------|
| `main` | Production-stable, human-reviewed | Human PM | — |
| `pre-mortal` | Staging gate. All agent work lands here before `main` | Overseer + Human | `main` |
| `claude/<task-id>` | Claude Code task work | Claude Code | `pre-mortal` via review |
| `cursor/<task-id>` | Cursor implementation work | Cursor | `pre-mortal` via review |
| `lovable/<task-id>` | Lovable UI work | Lovable | `pre-mortal` via review |
| `kimi/overseer` | Persistent overseer branch (optional) | Kimi Code | `pre-mortal` |

### Branch Naming Convention

```
<agent>/<task-id>-<short-description>
```

Examples:
- `claude/TASK-003-phase1-foundation`
- `cursor/TASK-P4-01-gateway-client`
- `lovable/TASK-LOVABLE-001-run-migrations`

### Handoff Sequence

1. Agent creates branch from `pre-mortal`
2. Agent works on their branch, commits with routing headers
3. Agent pushes and commits `[ACTION:submit]` when done
4. Reviewer (Kimi or Claude Code) reviews the work
5. If approved: merge to `pre-mortal`, assign next task
6. If rejected: agent addresses feedback, re-submits
7. When sprint is complete: Human reviews `pre-mortal`, merges to `main`

### Commit Message Routing

Commit messages carry routing instructions for agent handoffs:

```
[AGENT:agent] [ACTION:action] [TASK:task-id] Short description
```

| AGENT | ACTION | Meaning |
|-------|--------|---------|
| `claude`, `cursor`, `lovable`, `kimi` | `submit` | Work ready for review |
| | `approve` | Work approved, merge to `pre-mortal` |
| | `reject` | Work needs changes |
| | `update` | Progress update (not a submission) |
| | `report` | Sprint or status report |
| | `delegate` | Assigning work to another agent |
| | `merge` | Merging approved work |

See `.ai/templates/commit-message.md` for the full routing specification and examples.

## Agent Communication

Agents communicate via structured folders in `.ai/`:

| Folder | Purpose | Who Writes | Who Reads |
|--------|---------|-----------|-----------|
| `.ai/tasks/` | Task specifications | Claude Code | All agents |
| `.ai/instructions/` | Task assignments and directives | Kimi, Claude Code | Target agent |
| `.ai/reviews/` | Code review feedback | Kimi, Claude Code | Submitting agent + Human |
| `.ai/reports/` | Status and completion reports | All agents | Human + all agents |
| `.ai/chats/` | Agent-to-agent conversation logs | All agents | All agents |

Templates for each folder are in `.ai/templates/`.

## Agent Skills

This project uses Agent Skills to codify conventions for AI agents (compatible with Kimi Code CLI, Claude Code, and Codex).

### Skills Directory

```
.agents/skills/
├── open-artel-workflow/    # Agent roles, workflow steps, communication
├── task-protocol/          # Task brief format, lifecycle, acceptance criteria
├── git-routing/            # Commit message routing rules
├── review-checklist/       # Code review standards
├── boundary-enforcement/   # File ownership rules
└── sprint-management/      # Sprint planning and tracking
```

### Flow Skills (Automated Workflows)

```
.agents/skills/
├── sprint-execution/       # /flow:sprint-execution — full sprint automation
├── code-review/            # /flow:code-review — automated review process
└── task-handoff/           # /flow:task-handoff — agent-to-agent handoff
```

### Usage

- **Auto-loaded**: Kimi Code CLI discovers skills from `.agents/skills/` at startup
- **Explicit load**: `/skill:open-artel-workflow` — loads skill into context
- **Execute flow**: `/flow:sprint-execution` — runs the automated workflow
- **Version-controlled**: Skills live in the repo and evolve with the project

## Kimi Overseer (Optional)

The Kimi Overseer is a persistent AI agent that coordinates the team, reviews work, and manages sprints. It runs via Kimi Code CLI and uses the conventions defined in Agent Skills.

### Quick Setup

```bash
# One-command setup (installs hooks, creates directories, verifies)
./scripts/setup-kimi-project.sh

# Or verify an existing setup
./scripts/verify-kimi-setup.sh

# Fast pre-work check (< 5 seconds)
./scripts/quick-kimi-check.sh
```

### Prerequisites

```bash
# Install Kimi Code CLI
pipx install kimi-cli    # or: pip install kimi-cli

# Authenticate
kimi                      # then run /login inside the CLI
```

### Agent Files

```
.agents/
├── kimi-overseer.yaml     # Main overseer agent definition
├── reviewer-sub.yaml      # Code review subagent
├── researcher-sub.yaml    # Research and analysis subagent
└── prompts/
    └── overseer.md        # Overseer system prompt
```

### Launch and Resume

```bash
# Start a new overseer session
kimi --agent-file .agents/kimi-overseer.yaml

# Resume the most recent session (persistent oversight)
kimi --agent-file .agents/kimi-overseer.yaml --continue

# Resume a specific session
kimi --agent-file .agents/kimi-overseer.yaml --session <session-id>
```

### What the Overseer Does

1. Reads sprint goals from Human PM
2. Dispatches Claude Code to decompose goals into task briefs
3. Assigns tasks to agents via `.ai/instructions/`
4. Reviews submitted work using the `reviewer` subagent
5. Merges approved work to `pre-mortal`
6. Updates `.ai/status.md` after each action
7. Generates sprint summary reports in `.ai/reports/`

### Subagent Dispatch

The overseer uses two built-in subagents:

- **reviewer**: Checks submissions against acceptance criteria, boundary compliance, and commit format
- **researcher**: Explores codebases, APIs, and documentation for technical feasibility

Dynamic subagents can be created at runtime via `CreateSubagent` for one-off specialized tasks.

### Context Management

- Run `/compact` between sprints to summarize and reduce token usage
- Key decisions are preserved in `.ai/reports/` and `.ai/reviews/` (always in Git)
- Sessions auto-save — use `--continue` to pick up where you left off

### Configuration

Edit `.agents/kimi-overseer.yaml` to customize:
- `PROJECT_NAME`: Set your project name in `system_prompt_args`
- `tools`: Add or remove tools as needed
- `subagents`: Add custom subagents for your workflow

### Features Overview

The Kimi integration includes these capabilities:

- **Session Management**: Named sessions linked to sprints (`docs/kimi-sessions.md`)
- **Dynamic Subagents**: Runtime-created specialist agents (`docs/kimi-agent-swarm.md`)
- **Context Monitoring**: Auto-compact when context grows large (`docs/kimi-context-optimization.md`)
- **Moonshot Files API**: Upload project files for persistent context (`docs/moonshot-api-integration.md`)
- **Agent Swarm**: Parallel subagent dispatch with K2.5 (`docs/kimi-agent-swarm.md`)
- **Multi-modal**: Vision + text analysis with K2.5 (`docs/kimi-multimodal.md`)

### Kimi Integration

Agents communicate with Kimi primarily through **commit-based routing**:

- **Claude Code**: Delegates tasks via `[ACTION:delegate]`, triggers evaluations via `[ACTION:evaluate]`
- **Cursor**: Submits work via `[ACTION:submit]`, receives reviews in `.ai/reviews/`
- **Lovable**: Submits UI work via `[ACTION:submit]`, receives reviews in `.ai/reviews/`

See `docs/cursor-kimi-integration.md` and `docs/claude-kimi-coordination.md` for agent-specific guides.

## Git Automation (Optional)

Git hooks automate the agent workflow by routing commits to Kimi Code CLI Print Mode. When an agent commits with routing headers, the post-commit hook parses the action and triggers the appropriate automation.

### Setup

```bash
./scripts/install-git-hooks.sh           # Install hooks
./scripts/install-git-hooks.sh --status  # Check status
./scripts/install-git-hooks.sh --remove  # Remove hooks
```

### What Gets Automated

| ACTION | Automation |
|--------|-----------|
| `submit` | Triggers automated review (writes to `.ai/reviews/`) + chat log |
| `approve` | Merges to `pre-mortal`, updates `.ai/status.md`, context auto-compact + chat log |
| `reject` | Logs chat entry (review feedback in `.ai/reviews/`) |
| `report` | Appends summary to `.ai/reports/sprint-current.md` |
| `evaluate` | Generates sprint evaluation report with 8 metrics |
| `delegate` | Chat log + auto-creates Kimi session (SPRINT tasks) |
| `update`, `merge` | Logged only |

### Configuration

- **Async mode**: ON by default (commits return immediately)
- **Dry-run**: `export OPEN_ARTEL_DRY_RUN=true` to test without calling Kimi
- **Logs**: `.git/hooks/post-commit.log`
- **Disable**: `mv .git/hooks/post-commit .git/hooks/post-commit.disabled`

### Customization

The hook template is at `scripts/post-commit.template`. Look for `[REPLACE]` comments to customize:
- Review prompts for your project's specific acceptance criteria
- Merge behavior and branch naming conventions
- Report format and destination

### Troubleshooting

- **Hook not running**: Check `ls -la .git/hooks/post-commit` — must be executable
- **"kimi command not found"**: Install with `pipx install kimi-cli`
- **"LLM not set"**: Run `kimi` then `/login` to authenticate
- **Check logs**: `cat .git/hooks/post-commit.log`

## GitHub Actions (Optional)

Three CI/CD workflows automate agent coordination when code is pushed to GitHub.

| Workflow | Trigger | What It Does |
|----------|---------|-------------|
| Agent Review | Push to `claude/**`, `cursor/**`, `lovable/**` | Reviews `[ACTION:submit]` commits via Kimi Print Mode |
| Pre-Mortal Merge | Push to `pre-mortal` | Validates commit format, coordination files, script syntax |
| Sprint Evaluation | Manual or `[ACTION:evaluate]` on `pre-mortal` | Generates evaluation report with 8 metrics |

Setup: Add `KIMI_API_KEY` to GitHub repo Settings > Secrets > Actions.

## Sprint Evaluation (Optional)

Collects 8 metrics (task completion, review rejections, boundary violations, velocity, handoff latency, regressions, escalations, template coverage) and generates reports:

```bash
./scripts/generate-evaluation.sh                # Full evaluation with Kimi report
./scripts/generate-evaluation.sh --quick        # Metrics only, no Kimi call
```

## Task Coordination

All agents check `.ai/tasks/` for assignments.
See `.ai/templates/task.md` for the task brief format.
See `.ai/boundaries.md` for file-to-agent ownership.
See `.ai/status.md` for current sprint status.
See `.ai/templates/commit-message.md` for commit routing format.

## Do

- Run build before committing
- Read existing code before modifying
- Follow patterns in surrounding files
- Handle errors on all async operations

## Don't

- Add dependencies without documenting why
- Modify auto-generated files
- Hard-code colors or magic numbers
- Skip error handling
- Commit secrets or API keys
