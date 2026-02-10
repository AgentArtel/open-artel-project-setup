## IDEA-001: Git branch handoff workflow

- **Category**: Git Workflow
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Each agent/subagent operates on dedicated branches with commit-triggered handoffs in a specific sequence: agent → agent branch → agent branch. Agents work on their branch, push, and trigger the next agent in the sequence to pick up the work.

### Why It Matters

Enables true multi-agent collaboration where work flows systematically between agents without manual coordination. Each agent has a clear handoff point and the next agent knows exactly when to start.

### Open Questions

- What is the exact sequence? (e.g., claude → cursor → lovable → kimi → claude?)
- How do we handle blocked work or agents that need to skip a step?
- Should there be a staging branch (like `pre-mortal`) before `main`?
- How do we prevent merge conflicts when multiple agents work in parallel?

### Related Ideas

- IDEA-002 (commit message routing enables the handoffs)
- IDEA-003 (automated workflow cycle)
- IDEA-016 (conversational Git operations)

