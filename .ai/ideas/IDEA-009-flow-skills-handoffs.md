## IDEA-009: Flow Skills for agent handoff workflows

- **Category**: Automation
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Define multi-step agent handoff workflows as Flow Skills (Mermaid/D2 diagrams). Flow Skills can be invoked via `/flow:` commands to automatically execute the commit → review → merge → next agent sequence.

### Why It Matters

Makes complex workflows executable and reusable. Flow Skills encode the workflow logic visually, making it easy to understand and modify.

### Open Questions

- What's the exact flow diagram? (commit → review → merge → next agent?)
- How do Flow Skills integrate with Git hooks/triggers?
- Can flows have conditional branches? (if review fails, then...)
- How do we handle errors in flow execution?

### Related Ideas

- IDEA-001 (branch workflow is the structure)
- IDEA-003 (automated cycle uses flows)
- IDEA-008 (Flow Skills are a type of Agent Skill)

