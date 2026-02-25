# Setups — Starter Kits for New Projects

This folder contains setup kits you can copy into a new project to bootstrap multi-agent workflows, task coordination, and Cursor rules.

## How to use

1. **Choose a setup** from the list below.
2. **Copy the files** into your new project root.
3. Run `BOOTSTRAP_PLAYBOOK.md` in Claude Code to customize for your codebase.

Already have an Open Artel project? Use the migration script instead:

```bash
./scripts/migrate-to-v2.sh          # Dry run — see what would change
./scripts/migrate-to-v2.sh --apply  # Create missing files
```

---

## Available setups

### `multi-agent-starter/`

**Use when:** You want a three-agent workflow (Claude Code + Cursor + Lovable) in a Lovable or similar React project.

**What it includes:**
- `AGENTS.md`, `CLAUDE.md` — coordination, roles, pipeline
- `.cursor/rules/` — project context, boundaries, task protocol, workforce protocol
- `.ai/` — board, tasks, templates, status, lessons, workflow principles, Lovable knowledge, Cursor workforce guide

**Quick start:**

```bash
cp multi-agent-starter/{AGENTS.md,CLAUDE.md,BOOTSTRAP_PLAYBOOK.md} your-project/
cp -r multi-agent-starter/{.cursor,.ai} your-project/
```

Then open in Claude Code and run the prompt from `BOOTSTRAP_PLAYBOOK.md`.

Full instructions: `multi-agent-starter/README.md`

---

## Adding new setup types

Add a new subfolder under `setups/` (e.g. `setups/my-starter/`) with:

- A **README.md** that explains when to use it and how to copy it into a new project.
- All files/folders that should be copied into the target project.

Update this README with a short entry under **Available setups**.
