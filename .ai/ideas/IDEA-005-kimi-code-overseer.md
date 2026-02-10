## IDEA-005: Kimi Code persistent project overseer

- **Category**: Kimi Integration
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Feasible
- **Roadmap Phase**: Phase 4 (Kimi Overseer Agent)

### The Idea

Kimi Code runs as a persistent development assistant that tracks the project for its entire lifetime, coordinating agents and keeping things aligned.

### Why It Matters

Provides continuity and oversight across agent sessions. Remembers project history, understands context, coordinates agents at different times.

### Research Findings

**Architecture** (TASK-002-research.md, Section 6):

Custom Kimi agent in YAML (`kimi-overseer.yaml`) with tools: Shell, ReadFile, WriteFile, Glob, Grep, SetTodoList, Think, Task (subagents), CreateSubagent.

**Subagents**: `reviewer` (checks submissions against criteria) and `researcher` (explores codebases). Dynamic subagents via `CreateSubagent` for one-off tasks.

**Session persistence**: `--continue` resumes most recent session. `--session <id>` for specific sessions. Auto-save to disk. 30-day inactivity timeout on device auth.

**Monitoring**: Git commits via Shell, `.ai/status.md`, `.ai/tasks/`, agent branch activity.

**Coordination**: Writes to `.ai/instructions/`, `.ai/reviews/`, `.ai/reports/`. Updates `.ai/status.md`. Dispatches subagents via Task tool.

**Cost**: K2 at $0.60/1M input, $2.50/1M output. Cached tokens $0.15/1M (75% savings). A sprint review cycle: ~$0.05-0.50. 5-hour budget handles 300-1,200 API calls.

**K2.5 Agent Swarm**: Up to 100 sub-agents, 1,500 tool calls per session.

### Answers to Open Questions

- **Session alive**: `--continue` to resume. Sessions auto-save. 30-day timeout requires re-`/login`.
- **Monitors**: Git commits, `.ai/` files, branch activity via Shell/ReadFile/Glob/Grep.
- **Coordinates**: Via `.ai/` folders (instructions, reviews, reports). Everything flows through Git + markdown.
- **Cost**: Very affordable. Full sprint oversight for cents to dollars.

### Related Ideas

- IDEA-006 (terminal connection), IDEA-007 (subagent architecture), IDEA-017 (context compression)
