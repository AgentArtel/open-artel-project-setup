# Open Artel Project Setup

Repository for **saved project configurations** and **reusable setup kits** you can drag-and-drop into new projects.

## Layout

```
.
├── past-configurations/   # Saved .ai (and related) configs per project — for record-keeping and git history
│   └── Even-Openclaw/     # Example: full .ai folder from the ClawLens / Even-Openclaw project
├── setups/                # Setup kits to copy into new projects (multi-agent, task protocol, etc.)
│   ├── README.md          # How to use the setups (drag & drop)
│   └── multi-agent-starter/
└── README.md              # This file
```

### `past-configurations/`

One folder per project, named after the project. Each folder holds a **snapshot** of that project’s coordination config (e.g. the full `.ai` directory) so you can:

- Keep a record of what was used
- Track changes over time with git
- Compare or reuse patterns across projects

**This repo only tracks the contents of these folders** — not the rest of the original project.

### `setups/`

Reusable **setup types** you copy into a new project to bootstrap:

- Multi-agent workflow (Claude + Cursor + Lovable)
- Task protocol and Cursor rules
- Status boards and task templates

See **`setups/README.md`** for how to use each setup (copy which files where, and what to do next).

## Using a setup in a new project

1. Clone or download this repo (or just the `setups/` folder).
2. Open `setups/README.md` and pick a setup.
3. Copy the chosen setup’s files into your new project root as described there.
4. Follow that setup’s README for customization (e.g. run the bootstrap playbook for multi-agent).

## Saving a configuration

To add a new project’s config under `past-configurations/`:

1. Create a folder: `past-configurations/<ProjectName>/`.
2. Copy the project’s `.ai` (and any other coordination files you want to track) into that folder.
3. Commit and push.

Use a consistent naming convention (e.g. repo or product name) so past configs are easy to find.
