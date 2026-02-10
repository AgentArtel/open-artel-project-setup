# Setups — Copy Into New Projects

This folder contains **setup kits** you can copy into a new project to bootstrap multi-agent AI development workflows.

## How to Use

1. **Choose a setup** from the list below.
2. **Copy the setup folder contents** into your **new project root**.
3. Follow that setup's own README for customization and next steps.

---

## Available Setups

### `multi-agent-starter/`

**Use when:** You want a multi-agent workflow (Claude Code + Cursor + Lovable + optional Kimi Overseer) in any project.

**What it includes:**
- `AGENTS.md`, `CLAUDE.md`, `BOOTSTRAP_PLAYBOOK.md` — coordination and roles
- `.cursor/rules/` — 5 governance rules for Cursor IDE
- `.ai/` — full coordination layer (tasks, templates, patterns, metrics, sessions)
- `.agents/` — Kimi agent definitions, skills, subagent templates
- `scripts/` — 16 automation scripts (git hooks, session management, evaluation, API)
- `docs/` — 12 integration guides
- `.github/workflows/` — 3 CI/CD workflows

**Quick start:** From your new project root:

```bash
STARTER=/path/to/open-artel-project-setup/setups/multi-agent-starter
cp "$STARTER"/AGENTS.md "$STARTER"/CLAUDE.md "$STARTER"/BOOTSTRAP_PLAYBOOK.md .
cp -r "$STARTER"/.cursor "$STARTER"/.ai "$STARTER"/.agents "$STARTER"/scripts "$STARTER"/docs "$STARTER"/.github .
```

Then open the project in Claude Code and run through `BOOTSTRAP_PLAYBOOK.md` to customize placeholders, generate `.ai/boundaries.md`, and configure agent files.

Full instructions: **`multi-agent-starter/README.md`**

---

## Adding New Setup Types

Add a new subfolder under `setups/` (e.g. `setups/solo-agent/`) with:

- A **README.md** that explains when to use it and how to copy it into a new project.
- All files/folders that should be copied into the target project.

Update this README with a short entry under **Available Setups**.
