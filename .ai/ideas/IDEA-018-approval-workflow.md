## IDEA-018: Approval workflow integration

- **Category**: Automation
- **Origin**: TASK-002
- **Status**: raw

### The Idea

Integrate Kimi Code's approval system with the Git commit review process. Agents request approval for file writes, shell commands, and other operations, and approvals are tracked in Git commits.

### Why It Matters

Provides safety and auditability. All agent actions require approval, and the approval history is version-controlled alongside the code changes.

### Open Questions

- How do approvals map to Git commits? (one approval per commit? batch approvals?)
- Who approves? (human? other agents? automated rules?)
- What operations require approval? (file writes? Git operations? API calls?)
- How do we handle approval timeouts? (auto-reject? escalate?)

### Related Ideas

- IDEA-003 (workflow cycle includes approvals)
- IDEA-011 (Wire Mode handles approval requests)
- IDEA-016 (Git operations need approval)

