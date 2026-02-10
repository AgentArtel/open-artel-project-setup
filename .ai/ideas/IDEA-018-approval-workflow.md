## IDEA-018: Approval workflow integration

- **Category**: Automation
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Feasible
- **Roadmap Phase**: Phase 5-7

### The Idea

Integrate Kimi Code's approval system with Git commit review. Track approvals in Git.

### Why It Matters

Safety and auditability. All actions require approval; history is version-controlled.

### Research Findings

**Kimi approval system** (from CLI docs):
- Approval required for: Shell commands, file writes/edits, MCP tool calls
- Options: Allow (once), Allow for session, Reject
- YOLO mode (`--yolo`): Auto-approve all (for trusted environments)
- Print Mode: Implicit YOLO

**Wire Mode approval** (JSON-RPC):
```json
{"method":"request","params":{"type":"ApprovalRequest",
  "payload":{"action":"run shell command","description":"git merge..."}}}
// Response: {"result":{"response":"approve"}}
```

**Graduated approval levels**:
| Operation | Approval |
|-----------|----------|
| File read | Auto |
| File write/edit | Per-session (Wire) / Auto (Print) |
| Git commit | Auto (own branch) |
| Merge to pre-mortal | Kimi review required |
| Merge to main | Human required |
| Branch deletion / Force push | Human required |

**Integration**: Print Mode (Phase 5) — review at task level, tracked in `.ai/reviews/`. Wire Mode (Phase 7) — per-operation approvals, auto-approve routine, escalate risky.

### Answers to Open Questions

- **Mapping**: Task-level in `.ai/reviews/`. Operation-level via Kimi's built-in system.
- **Who approves**: Kimi for routine. Human for merges to main and destructive ops.
- **What requires approval**: See graduated table. Risk-based.
- **Timeouts**: Print has none (auto). Wire daemon can set timeouts and escalate.

### Related Ideas

- IDEA-003 (workflow approvals), IDEA-011 (Wire Mode), IDEA-016 (Git ops approval)
