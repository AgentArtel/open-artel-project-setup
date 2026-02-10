## IDEA-012: Work delegation system

- **Category**: Agent Architecture
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Agents can take on work for the human and pass tasks between each other. For example, Claude Code receives a request, breaks it into tasks, and delegates to Cursor for implementation or Lovable for UI work.

### Why It Matters

Enables true multi-agent collaboration where agents work together to complete complex tasks. The human can describe high-level goals and agents figure out the division of labor.

### Open Questions

- How do agents decide what to delegate? (based on boundaries? agent capabilities?)
- What's the delegation format? (Task tool? communication folders?)
- How do we track delegation chains? (who delegated what to whom?)
- What happens if a delegated task fails?

### Related Ideas

- IDEA-007 (subagents enable delegation)
- IDEA-004 (communication folders for delegation)
- IDEA-013 (evaluation tracks delegation success)

