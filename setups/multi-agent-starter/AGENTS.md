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

Three AI agents share this repo. The Human PM is Accountable for all decisions.

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
