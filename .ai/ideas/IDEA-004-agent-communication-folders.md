## IDEA-004: Agent communication folders

- **Category**: Communication
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Create literal folders for agent-to-agent communication: `.ai/chats/`, `.ai/reports/`, `.ai/instructions/`, `.ai/reviews/`. Agents write markdown files here to talk to each other, give reports, receive instructions, and submit things for review.

### Why It Matters

Structured communication channels that are version-controlled and browsable. Agents can see the full conversation history and context without relying on external chat systems.

### Open Questions

- What's the file naming convention? (timestamp-based? agent-pair based?)
- How do we prevent conflicts when multiple agents write simultaneously?
- Should these be markdown files or structured JSON/YAML?
- How do we archive old conversations?

### Related Ideas

- IDEA-003 (workflow cycle uses these folders)
- IDEA-012 (work delegation happens via these channels)

