## IDEA-016: Conversational Git operations

- **Category**: Git Workflow
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Ready
- **Roadmap Phase**: Phase 1 (Foundation)

### The Idea

Make Git operations conversational — agents describe intent, CLI handles commands.

### Why It Matters

Reduces friction. Agents focus on what, not how.

### Research Findings

**Already built into both CLIs**:

- **Claude Code**: Native Git integration. Branch, stage, commit, push, PR — all via natural language. This is how we already work in this repo.
- **Kimi Code CLI**: Shell tool for Git, plus shell mode (Ctrl-X) for direct commands. Agent mode handles natural language Git requests.

**Both support**: Conversational branching, committing, merging, status queries, diff analysis.

**What we add on top**: Commit message routing format (IDEA-002) and branch naming convention (IDEA-001) standardize how agents use these capabilities.

### Answers to Open Questions

- **Which ops**: All — commit, branch, merge, push, pull, status, diff, log. Both CLIs support natively.
- **How**: Built-in tools. Claude Code: first-class Git. Kimi Code: Shell tool.
- **Safety**: Both have approval workflows. Preview before execution.
- **Integration**: No extra tooling — it's already how both CLIs work. We add conventions.

### Related Ideas

- IDEA-001 (branch workflow), IDEA-002 (commit format), IDEA-018 (approval for Git ops)
