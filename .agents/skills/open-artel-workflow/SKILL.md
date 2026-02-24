---
name: open-artel-workflow
description: Multi-agent development workflow overview. Defines the 7-step development cycle and key principles.
---

## Agent Roles

Defined in `AGENTS.md`. Four agents collaborate:

- **Claude Code** — Orchestrator (architecture, tasks, docs, config)
- **Cursor** — Implementation Specialist (business logic, APIs, hooks)
- **Lovable** — UI/UX Specialist (design system, layouts, styling)
- **Kimi Code** — Project Overseer (review, merge, sprint tracking)

For file ownership details, see `.ai/boundaries.md`.

## Development Cycle

The standard workflow follows 7 steps:

1. **Human defines sprint goals** → `.ai/instructions/`
2. **Claude Code decomposes into tasks** → `.ai/tasks/`
3. **Tasks get assigned** → `.ai/instructions/<agent>-<task>.md`
4. **Agents work on dedicated branches** → `<agent>/<task-id>`
5. **Submit triggers review** → `[AGENT:x] [ACTION:submit] [TASK:z]`
6. **Approved work merges** → `pre-mortal`
7. **Human reviews, merges to main** → production

## Coordination

All inter-agent communication happens through `.ai/` folders. See `.ai/board.md` for current state and `.ai/boundaries.md` for folder ownership.

## Key Principles

- **Convention over automation** — works with just markdown and Git
- **Persistent and auditable** — all communication lives in Git history
- **Agent isolation** — each agent works on their own branch, in their own domain
- **Human authority** — Human PM has final sign-off on all production merges

## Reference

- Commit routing: `.ai/templates/commit-message.md` or `git-routing` skill
- Task format: `.ai/templates/task.md` or `task-protocol` skill
- Workflow discipline: `.ai/workflow-principles.md`
- File ownership: `.ai/boundaries.md`
