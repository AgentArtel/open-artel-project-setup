## IDEA-007: Kimi Code subagent architecture

- **Category**: Agent Architecture
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Model Claude Code, Cursor, and Lovable as Kimi Code subagents. The main Kimi Code overseer can launch these as subagents via the Task tool, with isolated contexts and specialized system prompts.

### Why It Matters

Leverages Kimi Code's built-in subagent system to coordinate the three-agent model. Each agent gets isolated context, can work in parallel, and returns results to the main overseer.

### Open Questions

- How do we define the subagent YAML files for each agent?
- What system prompts do we use for Claude Code, Cursor, Lovable?
- How do subagents access project files? (working directory? file tools?)
- Can subagents launch other subagents? (nested delegation?)

### Related Ideas

- IDEA-005 (overseer launches subagents)
- IDEA-012 (work delegation uses subagents)
- IDEA-008 (Agent Skills define subagent behavior)

