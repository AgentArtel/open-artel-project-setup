## IDEA-007: Kimi Code subagent architecture

- **Category**: Agent Architecture
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Feasible
- **Roadmap Phase**: Phase 4 (Kimi Overseer Agent)

### The Idea

Model Claude Code, Cursor, and Lovable as Kimi Code subagents launched via the Task tool with isolated contexts and specialized prompts.

### Why It Matters

Leverages Kimi Code's built-in subagent system for the three-agent model. Isolated context, parallel work, results returned to overseer.

### Research Findings

**Architecture** (TASK-002-research.md, Section 6):

Overseer dispatches subagents via `Task(subagent_name="reviewer", prompt="...")`. Subagents defined in YAML with `extend` for inheritance.

**Reviewer subagent** example:
```yaml
version: 1
agent:
  extend: .agents/kimi-overseer.yaml
  system_prompt_args:
    ROLE_ADDITIONAL: |
      You are a code reviewer. Read task brief, check git diff,
      verify acceptance criteria, check boundary compliance.
      Report APPROVED or REJECTED with findings.
  exclude_tools:
    - "kimi_cli.tools.multiagent:Task"       # No nested delegation
    - "kimi_cli.tools.multiagent:CreateSubagent"
```

**Delegation pattern**: Overseer → Task(decompose) → Claude Code subagent → Overseer writes instructions → Agent works → Overseer → Task(review) → Reviewer subagent → Approval/rejection.

**Dynamic subagents**: `CreateSubagent` for one-off specialized tasks (e.g., debugging regressions). K2.5 supports up to 100 sub-agents, 1,500 tool calls.

### Answers to Open Questions

- **YAML definitions**: Standard format with `extend`, `system_prompt_path`, `exclude_tools`.
- **System prompts**: Role-specific Markdown with `${KIMI_WORK_DIR}` and `${KIMI_AGENTS_MD}` variables.
- **File access**: Same tools as overseer (ReadFile, WriteFile, Glob, Grep). Same working directory.
- **Nested delegation**: Disabled — subagents have `Task` tool excluded to prevent infinite chains.

### Related Ideas

- IDEA-005 (overseer launches subagents), IDEA-012 (delegation uses subagents), IDEA-008 (skills define behavior)
