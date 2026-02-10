## IDEA-016: Conversational Git operations

- **Category**: Git Workflow
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Make Git operations more accessible and agent-friendly by integrating Git with Claude Code CLI. Agents can describe what they want to do in natural language, and Claude Code handles the Git commands.

### Why It Matters

Reduces friction for agents working with Git. Instead of remembering exact Git commands, agents can describe their intent and let Claude Code figure out the right operations.

### Open Questions

- What Git operations should be conversational? (commit? merge? branch creation?)
- How does Claude Code CLI handle Git? (built-in? wrapper script?)
- How do we ensure safety? (preview before execution? approval workflows?)
- What's the integration pattern? (Claude Code extension? separate tool?)

### Related Ideas

- IDEA-001 (branch workflow uses Git operations)
- IDEA-002 (commit messages are part of Git)
- IDEA-018 (approval workflows for Git operations)

