# Core — Minimal Setup

The smallest useful setup. Copy these 8 files and you have a working three-agent workflow with task coordination.

## What You Get

- **Three-agent roles** defined (Claude Code, Cursor, Lovable)
- **Task protocol** — structured task briefs for handoffs between agents
- **Sprint board** — track what's in progress
- **Bootstrap process** — Claude Code analyzes your codebase and fills in placeholders

## Core Files

```
project-root/
├── AGENTS.md                           # Source of truth — customize [REPLACE] placeholders
├── CLAUDE.md                           # Orchestrator config — use as-is
├── BOOTSTRAP_PLAYBOOK.md               # Step-by-step setup guide
├── README.md                           # Reference
├── .cursor/
│   └── rules/
│       ├── 00-project-context.mdc      # Cursor role awareness — customize
│       └── 06-task-protocol.mdc        # Task handoff format — use as-is
└── .ai/
    ├── status.md                       # Sprint board — starts empty
    └── templates/
        └── task.md                     # Task brief template
```

## How to Copy (Minimal)

```bash
# From the starter kit directory:
cd setups/multi-agent-starter

# Copy core files to your project
cp AGENTS.md CLAUDE.md BOOTSTRAP_PLAYBOOK.md README.md /path/to/your/project/

# Copy Cursor rules (only the two core ones)
mkdir -p /path/to/your/project/.cursor/rules
cp .cursor/rules/00-project-context.mdc /path/to/your/project/.cursor/rules/
cp .cursor/rules/06-task-protocol.mdc /path/to/your/project/.cursor/rules/

# Copy coordination layer (minimal)
mkdir -p /path/to/your/project/.ai/templates
mkdir -p /path/to/your/project/.ai/tasks
cp .ai/status.md /path/to/your/project/.ai/
cp .ai/templates/task.md /path/to/your/project/.ai/templates/
```

## After Copying

1. Open your project in Claude Code
2. Tell it to follow `BOOTSTRAP_PLAYBOOK.md`
3. Claude Code will analyze your codebase, fill placeholders, and create `.ai/boundaries.md`
4. Open in Cursor — it will pick up the two rules automatically
5. Start creating tasks in `.ai/tasks/` using the template

## Adding Features

Once the core is working, add feature modules one at a time. See [feature-modules.md](feature-modules.md) for the full list.

**Common next steps:**
- **Module 1 (Cursor Workforce)** — If you want Cursor's manager/task chat system (3 files)
- **Module 2 (Lovable Integration)** — If you use Lovable for UI (1 file)
- **Module 3 (Templates)** — If you want structured templates for reviews, reports, etc. (7 files)
- **Module 4 (Kimi Overseer)** — If you want automated oversight and review (16 files)

## What's NOT in Core

Everything else is a feature module:
- No Kimi integration (`.agents/`)
- No scripts (`scripts/`)
- No docs (`docs/` — except this setup README)
- No GitHub Actions (`.github/`)
- No patterns library (`.ai/patterns/`)
- No metrics tracking (`.ai/metrics/`)
- No session management (`.ai/sessions/`)
- No Cursor workforce protocol (manager/task chats)
- No Lovable knowledge base

These are all available as feature modules when you need them.
