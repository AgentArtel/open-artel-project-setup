# Open Artel Project Setup

A configuration and workflow distribution system for multi-agent AI development. This repo contains the starter kits, templates, and reference configurations that agent teams use across projects.

## Tech Stack

- **Content**: Pure Markdown (`.md`, `.mdc`) — zero runtime dependencies
- **Tooling**: Git, GitHub, Claude Code CLI
- **Validation**: Manual review (no build, no linter, no tests — content is prose)

## Project Structure

```
.
├── AGENTS.md                    # This file — project identity and roles
├── CLAUDE.md                    # Orchestrator instructions
├── README.md                    # Public-facing repo docs
├── .ai/                         # Coordination layer (for THIS repo's development)
│   ├── status.md                # Current sprint / development status
│   ├── boundaries.md            # Decision authority map
│   ├── ideas.md                 # Feature ideas index
│   ├── ideas/                   # Individual idea files
│   ├── tasks/                   # Active task briefs
│   ├── chats/                   # Agent-to-agent conversation logs
│   ├── reports/                 # Status and completion reports
│   ├── instructions/            # Task assignments and directives
│   ├── reviews/                 # Code review feedback
│   └── templates/
│       ├── task.md              # Task brief template
│       ├── idea.md              # Idea template
│       ├── chat.md              # Chat log template
│       ├── report.md            # Report template
│       ├── instruction.md       # Instruction template
│       ├── review.md            # Review template
│       └── commit-message.md    # Commit routing format guide
├── setups/                      # Distributable starter kits
│   ├── README.md                # How to use setups
│   └── multi-agent-starter/     # Three-agent workflow kit
│       ├── README.md
│       ├── AGENTS.md            # Template (has [REPLACE] placeholders)
│       ├── CLAUDE.md            # Template
│       ├── BOOTSTRAP_PLAYBOOK.md
│       ├── .ai/                 # Template coordination directory
│       └── .cursor/rules/       # Template Cursor governance rules
├── .agents/                     # Agent Skills & Kimi Overseer (Kimi Code / Claude Code / Codex)
│   ├── kimi-overseer.yaml       # Kimi Overseer agent definition
│   ├── reviewer-sub.yaml        # Reviewer subagent definition
│   ├── researcher-sub.yaml      # Researcher subagent definition
│   ├── prompts/
│   │   └── overseer.md          # Overseer system prompt
│   └── skills/                  # Auto-discovered skill definitions
│       ├── open-artel-workflow/ # Multi-agent workflow conventions
│       ├── task-protocol/       # Task brief format and lifecycle
│       ├── git-routing/         # Commit message routing rules
│       ├── review-checklist/    # Code review standards
│       ├── boundary-enforcement/# File ownership rules
│       ├── sprint-management/   # Sprint planning and tracking
│       ├── sprint-execution/    # Flow: automated sprint workflow
│       ├── code-review/         # Flow: automated review process
│       └── task-handoff/        # Flow: agent-to-agent handoff
└── past-configurations/         # Snapshots from real projects
    └── Even-Openclaw/           # ClawLens project (30+ tasks, 4 phases)
```

## Team

Two roles develop this system. The Human is the decision-maker and product owner.

### Claude Code — System Architect & Builder

**Role**: Design, build, and maintain the multi-agent coordination system.

**Owns**:
- All files in `setups/` — starter kit templates, playbooks, rules, coordination configs
- All files in `.ai/` — this repo's own coordination layer
- `AGENTS.md`, `CLAUDE.md` — this repo's configuration
- `README.md` — public documentation

**Does**:
- Evolves starter kit templates (task format, boundaries, workforce protocol, cursor rules)
- Adds and curates `past-configurations/` snapshots
- Drafts new setups for different workflow patterns
- Maintains architectural consistency across all templates
- Proposes improvements based on patterns observed in past configurations
- Tracks development via `.ai/status.md` and `.ai/tasks/`

**Does NOT**:
- Make strategic decisions without human alignment (new setup types, major format changes)
- Delete or restructure `past-configurations/` entries without approval
- Change the fundamental agent model (three-agent split) without discussion

### Human — Product Owner & Decision-Maker

**Role**: Set direction, approve changes, provide real-world feedback from projects using the system.

**Does**:
- Defines priorities and roadmap direction
- Approves structural changes (new setup types, format overhauls)
- Provides feedback from projects that used these templates
- Adds new `past-configurations/` snapshots from active projects
- Final sign-off on anything that ships

## Content Conventions

- Markdown files: ATX headings (`#`), no trailing whitespace, blank line before headings
- Templates use `[BRACKETED]` or `[REPLACE: description]` for placeholders
- Task IDs: `TASK-XXX` (numeric) or `TASK-DESCRIPTIVE-NAME` (named)
- Cursor rules: numbered prefix `NN-name.mdc` with YAML frontmatter
- Past configurations: named by project `past-configurations/ProjectName/`
- Keep templates under documented line limits (AGENTS.md < 300 lines, CLAUDE.md < 60 lines)

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
- Commit messages use routing format: `[AGENT:x] [ACTION:y] [TASK:z]`
- No force-pushes to `main` or `pre-mortal`

## Coordination

Development of this system is tracked in `.ai/`:
- `.ai/status.md` — Current priorities and sprint status
- `.ai/boundaries.md` — Decision authority and folder ownership
- `.ai/ideas.md` and `.ai/ideas/` — Feature ideas backlog (raw ideas that may graduate to tasks)
- `.ai/tasks/` — Active task briefs
- `.ai/instructions/` — Task assignments and directives
- `.ai/reviews/` — Code review feedback
- `.ai/reports/` — Status and completion reports
- `.ai/chats/` — Agent-to-agent conversation logs
- `.ai/templates/` — Templates for all coordination file types
