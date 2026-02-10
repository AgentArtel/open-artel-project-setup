## IDEA-002: Commit message header routing

- **Category**: Automation
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Ready
- **Roadmap Phase**: Phase 1 (Foundation)

### The Idea

Use commit message headers to automatically route work between agents. The header format determines where the commit goes and what action is triggered.

### Why It Matters

Makes Git commits the coordination mechanism — the commit message itself carries routing instructions.

### Research Findings

**Header format** (TASK-002-research.md, Section 2):

```
[AGENT:<agent>] [ACTION:<action>] [TASK:<task-id>] <description>
```

**Routing table**:
| Action | What Happens |
|--------|-------------|
| `submit` | Routes to Kimi overseer for review |
| `review` | Kimi posts review results back to agent |
| `approve` | Triggers merge to `pre-mortal` |
| `reject` | Agent must address feedback and re-submit |
| `report` | Status report logged to `.ai/reports/` |
| `update` | Updates `.ai/status.md` |
| `merge` | Triggers merge workflow |

**Parsing regex**: `\[AGENT:(\w+)\] \[ACTION:(\w+)\] \[TASK:([\w-]+)\] (.+)`

Commits without matching headers are treated as regular commits — no routing triggered.

### Answers to Open Questions

- **Format**: `[AGENT:name] [ACTION:action] [TASK:id] description` — square brackets, colon-separated.
- **Parsing**: Git post-commit hook or GitHub Action with regex.
- **Valid actions**: submit, review, approve, reject, report, update, merge.
- **Malformed headers**: Ignored — treated as regular commits.

### Related Ideas

- IDEA-001 (branch workflow uses this routing)
- IDEA-003 (automated workflow relies on routing)
- IDEA-010 (Print Mode could generate these headers)
