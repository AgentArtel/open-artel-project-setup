## IDEA-022: Agent tool integrations (Claude Code, Kimi CLI, Cursor, Lovable)

- **Category**: Agent System
- **Origin**: Cursor analysis (Features 13-16)
- **Status**: researched
- **Feasibility**: Ready
- **Roadmap Phase**: Phase 2-3

### The Idea

Document and configure how each specific AI tool plugs into the multi-agent system. Each tool has different capabilities, invocation methods, and integration patterns.

### Why It Matters

The system is tool-agnostic in principle (anything that reads files and runs Git can participate), but each tool needs specific configuration to work well. This idea captures those specifics.

### Tool Integration Matrix

| Tool | Role | Invocation | Git Native | Non-interactive Mode | Current Readiness |
|------|------|-----------|------------|---------------------|-------------------|
| **Claude Code** | Coder / Architect | `claude --print -p "..."` | Yes | `--print`, `--output-format stream-json` | Ready |
| **Kimi Code** | Overseer / Coordinator | `kimi --print -p "..."` | Via Shell tool | `--print`, `--wire` | Ready |
| **Cursor** | Interactive Development | Human opens on agent branch | Via terminal | N/A (always interactive) | Ready |
| **Lovable** | UI/Frontend | Export/download to branch | No | No CLI/API yet | Manual only |

### Claude Code Integration (Cursor F13)

```bash
# Automated pipeline invocation
claude --print -p "Read the task at .ai/channels/instructions/current-task.md. Implement it on the current branch. When done, commit with the routing header format in .ai/config.yaml."

# Interactive (developer works conversationally)
claude  # reads CLAUDE.md which references .ai/
```

- Native Git support: branching, committing, PR creation
- `--print` mode with `--output-format stream-json` for programmatic integration
- Reads `.ai/agents/coder/AGENT.md` as context

### Kimi Code Integration (Cursor F14)

```bash
# Automated (overseer triggered by hook)
kimi --print -p "$(cat .ai/hooks/review-payload.json)" --agent-file .ai/agents/overseer/agent.yaml

# Interactive (planning session)
kimi --continue  # resumes previous overseer session
```

- Session persistence via `--continue` and `/sessions`
- Skill discovery from `.ai/agents/` via `--skills-dir`
- `@` path completion for natural file references
- Shell tool for Git commands, test runners, build tools

### Cursor Integration (Cursor F15)

- Cursor reads `.ai/agents/coder/AGENT.md` as context (add to Cursor project rules)
- Human works interactively, commits with routing headers when done
- No special integration — Cursor just follows the commit protocol
- `.cursor/rules/` files can reference `.ai/` conventions

### Lovable Integration (Cursor F16)

- Lovable generates UI code → human exports to agent branch
- Commit with routing headers for review
- Mostly manual — Lovable lacks CLI/API for automation
- Future: if Lovable adds API access, create a channel adapter

### Two Integration Patterns (from Cursor analysis)

**Pattern A — Kimi wraps Claude Code** (tight coupling):
Kimi's `Shell` tool invokes Claude Code for specific tasks via subagent dispatch. Overseer directly controls coder.

**Pattern B — Independent agents, Git as bus** (loose coupling):
Each tool runs independently. Git hooks are the only coordination. No tool calls another directly.

**Recommendation: Pattern B for MVP.** Simpler, more resilient (no tool depends on another being available), easier to debug (all communication visible in Git history). Pattern A as an optimization for Phase 4+.

### Open Questions

- Should each tool get its own AGENT.md, or share a common one with tool-specific addons?
- How to handle tool unavailability (Kimi down, Claude rate-limited)?
- Version pinning: should .ai/config.yaml specify model versions per agent?

### Cross-reference: Cursor Features

- Cursor F13 (Claude Code CLI integration) — folded in above
- Cursor F14 (Kimi Code CLI integration) — folded in above
- Cursor F15 (Cursor IDE integration) — folded in above
- Cursor F16 (Lovable integration) — folded in above

### Related Ideas

- IDEA-005 (Kimi overseer specifics), IDEA-008 (Agent Skills)
- IDEA-020 (.ai/ folder stores agent definitions)
- IDEA-023 (cross-agent API bridge for tighter integration)
