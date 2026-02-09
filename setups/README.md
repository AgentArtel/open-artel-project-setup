# Setups — Drag & Drop into New Projects

This folder contains **setup kits** you can copy into a new project to bootstrap multi-agent workflows, task coordination, and Cursor rules.

## How to use

1. **Choose a setup** from the list below.
2. **Copy the setup folder** (or its contents) into your **new project root**.
3. Follow that setup’s own README for customization and next steps.

---

## Available setups

### `multi-agent-starter/`

**Use when:** You want a three-agent workflow (Claude Code + Cursor + Lovable) in a Lovable or similar React project.

**What it includes:**
- `AGENTS.md`, `CLAUDE.md` — coordination and roles
- `.cursor/rules/` — project context, boundaries, task protocol, workforce protocol
- `.ai/` — tasks folder, templates, status board, Lovable knowledge snippet, Cursor workforce guide

**Quick start:** From your new project root:

```bash
cp multi-agent-starter/AGENTS.md .
cp multi-agent-starter/CLAUDE.md .
cp multi-agent-starter/BOOTSTRAP_PLAYBOOK.md .
cp -r multi-agent-starter/.cursor .
cp -r multi-agent-starter/.ai .
```

Then open the project in Claude Code and run through `BOOTSTRAP_PLAYBOOK.md` to customize placeholders and generate `.ai/boundaries.md`.

Full instructions are inside `multi-agent-starter/README.md`.

---

## Adding new setup types

Add a new subfolder under `setups/` (e.g. `setups/my-starter/`) with:

- A **README.md** that explains when to use it and how to copy it into a new project.
- All files/folders that should be copied into the target project.

Update this README with a short entry under **Available setups**.
