# Multi-Agent Starter Kit

Drop this into any Lovable project to set up a three-agent development workflow
(Claude Code + Cursor + Lovable).

## What's Inside

```
multi-agent-starter/
├── README.md                    ← You're here. Setup instructions.
├── AGENTS.md                    ← Copy to project root. Universal source of truth.
├── CLAUDE.md                    ← Copy to project root. Orchestrator config.
├── BOOTSTRAP_PLAYBOOK.md        ← The full step-by-step process.
├── .cursor/
│   └── rules/
│       ├── 00-project-context.mdc    ← alwaysApply: Cursor's role + multi-agent awareness
│       ├── 05-agent-boundaries.mdc   ← agent-requested: file ownership map
│       ├── 06-task-protocol.mdc      ← agent-requested: task handoff format
│       └── 07-workforce-protocol.mdc ← agent-requested: manager/task chat system
├── .ai/
│   ├── board.md                      ← Real-time coordination board
│   ├── tasks/.gitkeep                ← Empty dir for task assignment files
│   ├── templates/
│   │   └── task.md                   ← Task brief template (v2)
│   ├── status.md                     ← Sprint backlog and completed work
│   ├── lessons.md                    ← Lessons learned tracker
│   ├── workflow-principles.md        ← Operating discipline and pipeline
│   ├── lovable-knowledge.md          ← Copy-paste into Lovable Settings → Knowledge
│   └── CURSOR_WORKFORCE.md           ← Open in Cursor to set up manager + task chats
└── (you create these after analysis)
     ├── .ai/boundaries.md            ← Claude Code generates this from your codebase
     ├── .cursor/rules/01-*.mdc       ← Project-specific coding standards
     ├── .cursor/rules/02-*.mdc       ← Project-specific UI standards
     └── .cursor/rules/03-*.mdc       ← Project-specific backend standards
```

## Quick Start (5 minutes)

### 1. Copy files into your project

```bash
# From your project root:
cp multi-agent-starter/AGENTS.md .
cp multi-agent-starter/CLAUDE.md .
cp multi-agent-starter/BOOTSTRAP_PLAYBOOK.md .
cp -r multi-agent-starter/.cursor .
cp -r multi-agent-starter/.ai .
```

### 2. Have Claude Code customize everything

Open the project in Claude Code and paste the prompt from `BOOTSTRAP_PLAYBOOK.md`.
Claude Code will:
- Analyze your codebase
- Fill in the [REPLACE] placeholders in AGENTS.md and Cursor rules
- Create .ai/boundaries.md (file-to-agent ownership map)
- Add project-specific Cursor rules (coding standards, backend standards)
- Clean up dead code and unused dependencies
- Commit to a review branch

### 3. Test in Cursor

Open the project in Cursor. Open `.ai/CURSOR_WORKFORCE.md` and follow the steps
to create your Manager Chat. Test that it understands the project and can
produce task briefs.

### 4. Configure Lovable

Copy `.ai/lovable-knowledge.md` contents into Lovable → Project Settings → Knowledge.

### 5. Start building

You now have:
- **Claude Code** as your architect and reviewer
- **Cursor** as your implementation workforce (manager + task chats)
- **Lovable** as your UI specialist
- **`.ai/board.md`** as the real-time coordination board
- **`.ai/tasks/`** as the shared task layer between all three

## How Agents Use It

Every agent follows the same session protocol:

1. **Session start**: Read `board.md` and `lessons.md`, check `tasks/` for assignments, update `board.md`
2. **Work**: Follow the pipeline — brainstorm → plan → execute → verify → finish
3. **Session end**: Update `board.md`, update `status.md`, commit

The board is the single source of truth for real-time state. Agents update it when they start, finish, or get blocked.

## What needs customizing

Files with `[REPLACE]` placeholders that Claude Code fills in:

| File | What to customize |
|------|-------------------|
| `AGENTS.md` | Tech stack, project structure, file ownership lists |
| `.cursor/rules/00-project-context.mdc` | App identity, architecture constraints |
| `.cursor/rules/05-agent-boundaries.mdc` | Specific files per agent domain |
| `.ai/lovable-knowledge.md` | Project name, DO NOT MODIFY file lists |
| `.ai/CURSOR_WORKFORCE.md` | Project name in manager prompt |

Files that work as-is (no customization needed):

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Orchestrator role, pipeline, session protocols |
| `.cursor/rules/06-task-protocol.mdc` | Task handoff format |
| `.cursor/rules/07-workforce-protocol.mdc` | Chat roles and formats |
| `.ai/templates/task.md` | Task brief template (v2 with scope, handoff, lessons) |
| `.ai/board.md` | Coordination board (start with all agents IDLE) |
| `.ai/status.md` | Sprint board (start empty) |
| `.ai/lessons.md` | Lessons tracker (start empty) |
| `.ai/workflow-principles.md` | Operating discipline and pipeline |
