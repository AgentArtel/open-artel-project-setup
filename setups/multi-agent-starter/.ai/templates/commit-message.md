# Commit Message Routing Format

Commit messages carry routing instructions for the multi-agent workflow. The header format enables automated handoffs between agents.

## Format

```
[AGENT:agent] [ACTION:action] [TASK:task-id] Short description

Optional body with details.
```

## Valid Values

### AGENT (who is committing)

| Value | Agent |
|-------|-------|
| `claude` | Claude Code — Orchestrator |
| `cursor` | Cursor — Implementation Specialist |
| `lovable` | Lovable — UI/UX Specialist |
| `kimi` | Kimi Code — Project Overseer |

### ACTION (what happened)

| Value | Meaning | Triggers |
|-------|---------|----------|
| `submit` | Work completed, ready for review | Reviewer picks up for review |
| `review` | Review in progress | — |
| `approve` | Work approved | Merge to `pre-mortal`, next task assigned |
| `reject` | Work needs changes | Agent addresses feedback, re-submits |
| `update` | Progress update (not a submission) | Status tracking only |
| `report` | Sprint or status report | Human PM review |
| `delegate` | Assigning work to another agent | Target agent picks up task |
| `merge` | Merging approved work | Branch merged to target |

### TASK (which task)

Use the task ID from `.ai/tasks/`:
- `TASK-001`, `TASK-P4-01`, `TASK-LOVABLE-001`, etc.
- For sprint-level work: `SPRINT-3`, `SPRINT-4`, etc.
- For non-task work: `INFRA`, `DOCS`, `CLEANUP`, etc.

## Routing Table

| Commit Pattern | What Happens Next |
|----------------|-------------------|
| `[AGENT:cursor] [ACTION:submit] [TASK:X]` | Kimi/Claude reviews cursor's work |
| `[AGENT:lovable] [ACTION:submit] [TASK:X]` | Kimi/Claude reviews lovable's work |
| `[AGENT:claude] [ACTION:submit] [TASK:X]` | Kimi reviews claude's work |
| `[AGENT:kimi] [ACTION:approve] [TASK:X]` | Work merged to `pre-mortal`, next task assigned |
| `[AGENT:kimi] [ACTION:reject] [TASK:X]` | Agent addresses feedback, re-submits |
| `[AGENT:kimi] [ACTION:delegate] [TASK:X]` | Target agent picks up assignment |
| `[AGENT:kimi] [ACTION:report] [SPRINT:X]` | Human PM reviews sprint summary |
| `[AGENT:kimi] [ACTION:merge] [TASK:X]` | Branch merged to `pre-mortal` |

## Examples

### Agent submitting work
```
[AGENT:cursor] [ACTION:submit] [TASK:TASK-P4-01] Implement gateway API client hook

Added WebSocket JSON-RPC client with reconnection logic.
Files: src/hooks/use-gateway-api.ts, src/services/openclaw-client.ts
```

### Reviewer approving work
```
[AGENT:kimi] [ACTION:approve] [TASK:TASK-P4-01] Gateway API client approved

All acceptance criteria met. Merging to pre-mortal.
Unblocks: TASK-P4-02, TASK-P4-03
```

### Reviewer requesting changes
```
[AGENT:kimi] [ACTION:reject] [TASK:TASK-P4-01] Error handling needs improvement

Missing timeout handling on WebSocket reconnection.
See .ai/reviews/TASK-P4-01-review.md for details.
```

### Progress update
```
[AGENT:claude] [ACTION:update] [TASK:TASK-002] Enrich ideas with research findings

Updated 18 idea files with feasibility ratings and roadmap phases.
```

### Sprint report
```
[AGENT:kimi] [ACTION:report] [SPRINT:3] Sprint 3 complete — 8 tasks done

See .ai/reports/sprint-3-summary.md for full details.
```

### Delegating work
```
[AGENT:kimi] [ACTION:delegate] [TASK:TASK-P4-02] Assign agent CRUD sync to Cursor

See .ai/instructions/cursor-TASK-P4-02.md for assignment details.
```

---

<!-- Usage notes:
- Always include all three header fields: AGENT, ACTION, TASK
- Keep the short description under 72 characters
- Body is optional but recommended for submit and reject actions
- The routing table shows what SHOULD happen next — automation is optional
- Manual routing works fine: agents read commit messages and act accordingly
-->

