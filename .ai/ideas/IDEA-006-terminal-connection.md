## IDEA-006: Terminal connection to Kimi Code

- **Category**: Kimi Integration
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Agents can open a terminal that connects to the Kimi Code agent who oversees and tracks the project. This gives agents direct access to the overseer for queries, commands, and coordination.

### Why It Matters

Enables real-time interaction between agents and the Kimi Code overseer. Agents can ask questions, get context, and coordinate work without leaving their development environment.

### Open Questions

- What's the exact mechanism? (SSH? API? Wire Mode?)
- How do we authenticate/authorize agent connections?
- Can multiple agents connect simultaneously?
- What commands/queries are available?

### Related Ideas

- IDEA-005 (connects to the overseer)
- IDEA-011 (Wire Mode could provide the connection)

