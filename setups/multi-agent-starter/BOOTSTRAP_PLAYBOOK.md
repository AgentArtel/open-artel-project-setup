# Multi-Agent Bootstrap Playbook

## When to Use

You just created a project in Lovable, connected it to GitHub, and cloned the
repo locally. Now you want to set up the three-agent development workflow
(Claude Code + Cursor + Lovable) before any serious development begins.

## Prerequisites

- A GitHub repo with your code already pushed to `main`
- Claude Code CLI installed and working
- Cursor IDE installed
- The repo cloned locally
- **The starter kit already copied into the project** (see `README.md` for copy instructions)

## Step 1: Open the repo in Claude Code and paste this prompt

---

**PASTE THE FOLLOWING INTO CLAUDE CODE:**

```
I need you to set up a multi-agent development workflow for this project.
Three AI agents will share this repo:

1. **Claude Code (you)** — Orchestrator: architecture, task decomposition,
   code review, DB schema, cross-cutting refactors, root configs
2. **Cursor** — Implementation: business logic, state management, hooks,
   API integration, backend functions, complex components
3. **Lovable** — UI/UX: design system (src/components/ui/), layouts,
   navigation, styling, simple display components

Please do the following:

### Phase 1: Analyze the codebase

1. Read package.json, the project structure, and key config files
2. Identify the tech stack (framework, backend, styling, state management)
3. Map every directory and major file to the correct agent based on what
   the code actually does (not just where it lives):
   - Pure visual/markup/styling → Lovable
   - Business logic, state, API calls, complex forms → Cursor
   - Config, routing, schema, docs, coordination → Claude Code
4. Identify any dead code, unused dependencies, or clutter

### Phase 2: Customize the starter kit files

The starter kit has already been copied into the project. Customize these files
based on your Phase 1 analysis (look for `[REPLACE]` placeholders):

1. **AGENTS.md** (project root) — Fill in all `[REPLACE]` placeholders:
   - Tech stack, commands, project structure
   - Agent roles with explicit file ownership lists
   - Code conventions, git workflow
   - Keep under 300 lines

2. **CLAUDE.md** (project root) — Customize if needed:
   - Already has `See @AGENTS.md` import
   - Update delegation rules for your project
   - Keep under 60 lines

3. **.cursor/rules/** — Customize existing rules:
   - `00-project-context.mdc` — Fill in app identity, architecture constraints
   - `05-agent-boundaries.mdc` — Fill in specific files per agent domain
   - Add project-specific rules as needed:
     - `01-coding-standards.mdc` — globs for src/**/*.{ts,tsx}
     - `02-ui-standards.mdc` — globs for src/components/**
     - `03-backend-standards.mdc` — globs for backend files
     - `99-verification.mdc` — pre-commit checklist
   - Each .mdc file MUST have YAML frontmatter with description, globs, alwaysApply

4. **.ai/** — Create project-specific files:
   - `boundaries.md` — complete file-to-agent ownership map (generate from analysis)
   - Update `lovable-knowledge.md` with project-specific DO NOT MODIFY file lists
   - Update `CURSOR_WORKFORCE.md` with project name
   - The rest of `.ai/` (templates, patterns, metrics, sessions) works as-is

5. **.agents/** — Update project name:
   - `kimi-overseer.yaml` — change `PROJECT_NAME` from `[REPLACE: Your Project Name]`
   - `reviewer-sub.yaml` — change `PROJECT_NAME` from `[REPLACE: Your Project Name]`
   - `researcher-sub.yaml` — change `PROJECT_NAME` from `[REPLACE: Your Project Name]`
   - Everything else (prompts, skills, subagent templates) works as-is

### Phase 3: Clean up

1. Remove any dead code, unused components, or files not imported anywhere
2. Remove unused npm dependencies
3. Fix easy lint errors (prefer-const, no-unused-expressions, etc.)
4. Run npm audit fix for security patches
5. Verify build passes after all changes

### Rules for customization:

- Domain boundaries must be FUNCTIONAL (based on what code does), not
  STRUCTURAL (based on directory name). A component with 500 lines of
  state management belongs to Cursor even if it lives in src/components/
- AGENTS.md should reference docs/ guides rather than duplicating content
- Cursor rules use proper .mdc format with YAML frontmatter
- The Lovable Knowledge text must explicitly list DO NOT MODIFY files
- Every file in the repo should map to exactly one agent in boundaries.md
- Auto-generated files (Supabase types, client.ts, config.toml, .env)
  should be marked as DO NOT EDIT for all agents
- Do NOT modify files in `.ai/templates/`, `.ai/patterns/`, `.agents/skills/`,
  `.agents/subagents/`, `scripts/`, or `docs/` — these work as-is

After creating everything, commit to a feature branch (claude/setup-multi-agent)
and push. Do NOT merge to main yet — I want to review first.
```

---

## Step 2: Review Claude Code's output

Check:
- [ ] AGENTS.md accurately reflects your project's tech stack and structure
- [ ] File boundaries make sense (logic-heavy components assigned to Cursor)
- [ ] .cursor/rules/ files have valid YAML frontmatter
- [ ] .ai/boundaries.md maps every major file
- [ ] Build still passes

## Step 3: Set up the Cursor Workforce

1. Open the project in Cursor on the feature branch
2. Open `.ai/CURSOR_WORKFORCE.md` — this is your onboarding guide
3. Follow Step 1 to create your first **Manager Chat**
4. Test it works:
   - Ask the Manager: "What is your role?" — should describe planning/delegation
   - Ask it to plan a small task — should produce a scoped task brief
   - Open a Task Chat with the brief — should implement and report back

The workforce system creates focused chats:
- **Manager Chat** (Chat mode) — plans, delegates, reviews. Never writes code.
- **Task Chats** (Agent mode) — one per task, implements, reports, gets closed.
- **You** — relay briefs down, results up. Your quality gate.

See `.ai/CURSOR_WORKFORCE.md` for the full guide with prompt templates.

## Step 4: Configure Lovable

1. Open the project in Lovable
2. Go to Project Settings → Knowledge
3. Paste the contents of `.ai/lovable-knowledge.md` (below the `---` line)
4. Test: ask Lovable to modify a hook — should warn about Cursor's domain

## Step 5: Set up Kimi Overseer (Optional)

If you want automated code reviews, sprint management, and agent coordination:

### 5a. Install Kimi Code CLI

```bash
pipx install kimi-cli    # or: pip install kimi-cli
kimi                      # then run /login inside the CLI
```

### 5b. Run the setup script

```bash
./scripts/setup-kimi-project.sh
```

This will:
- Create `.agents/` and `.ai/` directory structures
- Install git hooks for commit-based routing
- Configure API key (optional, can skip with `--quick`)
- Verify the setup

### 5c. Verify the setup

```bash
./scripts/verify-kimi-setup.sh
```

### 5d. Test the overseer

```bash
# Start the overseer
kimi --agent-file .agents/kimi-overseer.yaml

# Ask: "What is your role?"
# Should describe project oversight, reviews, sprint management

# Create a test session
./scripts/kimi-session-manager.sh create test-session

# Run a quick check
./scripts/quick-kimi-check.sh
```

### 5e. Clean up test session

```bash
./scripts/kimi-session-manager.sh delete test-session
```

Skip this step if you don't need Kimi automation — the three-agent workflow works without it.

## Step 6: Merge and start working

```bash
# Review the PR, then merge
git checkout main
git merge claude/setup-multi-agent
git push
```

Lovable will auto-sync with main and pick up the AGENTS.md.
If Kimi is configured (Step 5), git hooks will start routing commits automatically.

## Step 7: First real task cycle

1. Tell Claude Code what you want to build
2. Claude Code creates task files in `.ai/tasks/`
3. Open your Cursor Manager Chat, describe the feature
4. Manager breaks it into task briefs
5. Run each brief in a separate Task Chat
6. Report results back to Manager for review
7. For UI-only tasks, relay to Lovable instead
8. Claude Code reviews the final PR
9. Human PM approves and merges

## Ongoing Maintenance

- After each sprint, update `.ai/status.md`
- When adding new files/directories, update `.ai/boundaries.md`
- When the tech stack changes, update `AGENTS.md`
- Run `./scripts/quick-kimi-check.sh` before each work session (if using Kimi)
- Run `./scripts/kimi-context-monitor.sh check` to monitor context health
- Archive completed sprint sessions: `./scripts/kimi-session-manager.sh archive <name>`

## Pulling Upstream Updates

The Open Artel starter kit is actively developed. Periodically sync to get new features, bug fixes, and improved scripts:

```bash
# Check for updates (dry run — no changes made)
./scripts/sync-upstream.sh --dry-run

# Apply updates (generic files only — your customizations are preserved)
./scripts/sync-upstream.sh

# Compare your customized files against the latest upstream templates
./scripts/sync-upstream.sh --diff
```

Generic files (scripts, docs, templates, patterns, skills, workflows) are updated automatically. Your project-specific files (AGENTS.md, .cursor/rules/, task data, reviews, etc.) are never overwritten. See `README.md` for the full list of file categories.
