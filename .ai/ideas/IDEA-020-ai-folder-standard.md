## IDEA-020: `.ai/` folder as multi-agent operating system

- **Category**: Infrastructure
- **Origin**: Cursor analysis (Feature 7)
- **Status**: researched
- **Feasibility**: Ready
- **Roadmap Phase**: Phase 1 (Foundation)

### The Idea

A standardized `.ai/` directory structure at the project root that serves as the operating system for multi-agent collaboration. Any AI tool can read and write to it. This is the foundational infrastructure everything else builds on.

### Why It Matters

Without a shared, well-defined file structure, every other idea is ad-hoc. The `.ai/` folder is the contract between agents — tool-agnostic, Git-tracked, human-readable.

### Design (from Cursor analysis)

**Full structure**:
```
.ai/
├── config.yaml              # Master config: agents, routing rules, model settings
├── agents/                  # Agent definitions (prompts, skills, state)
│   ├── overseer/
│   │   ├── AGENT.md         # System prompt
│   │   ├── SKILL.md         # Kimi-compatible skill definition
│   │   └── state.json       # Persistent state
│   ├── coder/
│   │   ├── AGENT.md
│   │   └── SKILL.md
│   └── reviewer/
│       ├── AGENT.md
│       └── SKILL.md
├── channels/                # Agent-to-agent communication (see IDEA-004)
│   ├── instructions/
│   ├── submissions/
│   ├── reviews/
│   ├── reports/
│   └── escalations/
├── sprints/                 # Sprint definitions (see IDEA-019)
│   ├── current.yaml
│   └── archive/
├── templates/               # Project-type templates
├── hooks/                   # Git hook scripts (see IDEA-010)
│   ├── post-commit
│   ├── pre-merge
│   └── route-commit.sh
├── reports/                 # Generated metrics and summaries (see IDEA-013)
└── logs/                    # Execution logs per agent
```

**Tool compatibility**:
- Kimi Code looks for skills in `.agents/skills/`, `.kimi/skills/`, `.claude/skills/`, `.codex/skills/`
- Use `--skills-dir .ai/agents/` to point Kimi at the unified directory
- Our SKILL.md format (YAML frontmatter + Markdown instructions) is directly Kimi-compatible
- Claude Code reads from CLAUDE.md and .claude/ — symlink or reference .ai/ in CLAUDE.md

**Key design decision**: The `.ai/` name is tool-agnostic. Config includes path mappings so each tool knows where to find its files:
```yaml
# .ai/config.yaml
paths:
  kimi_skills: .ai/agents/
  claude_md: CLAUDE.md  # references .ai/ internally
  cursor_rules: .cursor/rules/
```

### How It Differs from Existing Ideas

This repo already uses `.ai/` for its own coordination. This idea is about standardizing that pattern as part of the distributable starter kit — making it the canonical structure for *any* project using the system.

### Existing Precedent

Our `setups/multi-agent-starter/` already has a `.ai/` directory. This idea formalizes and extends it with:
- Agent definition files (AGENT.md, SKILL.md, state.json)
- config.yaml as the master configuration
- hooks/ directory for Git automation
- Clearer separation of channels vs reports

### Open Questions

- config.yaml schema: what's required vs optional?
- Should `state.json` be Git-tracked (auditable) or .gitignored (ephemeral)?
- How does this interact with `.cursor/rules/` — redundancy or complementary?

### Cross-reference: Cursor Features

- Cursor F7 (.ai/ folder as multi-agent OS) — primary source

### Related Ideas

- IDEA-004 (channels/ lives inside .ai/)
- IDEA-008 (Agent Skills follow SKILL.md format)
- IDEA-019 (sprints/ lives inside .ai/)
- IDEA-014 (project templates include .ai/ structure)
