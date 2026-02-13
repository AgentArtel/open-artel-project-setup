## IDEA-002: Commit message header routing

- **Category**: Automation
- **Origin**: TASK-002
- **Status**: complete
- **Feasibility**: Ready
- **Roadmap Phase**: Phase 1 (Foundation)
- **Implemented**: Phase 1 + Phase 5 (2026-02-10)

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

### Structured Commit Reports (from Cursor F4+F5)

Cursor's analysis identified two sub-features that belong here:

**Report format in commits** — every agent commit includes structured sections, not just a description:
- `## Work Summary` — what was done
- `## Files Changed` — with brief rationale per file
- `## Tests` — pass/fail status
- `## Issues Found` — anything unexpected
- `## Next Steps` — what should happen next

**Fix logs** — when a reviewer sends feedback and the coder fixes issues, the fix commit includes:
- `## Fixes Applied` — referencing the review feedback
- `## Next Step` — explicit routing: "Ready for re-review" or "Ready for merge"

**Validation**: `pre-commit` hook can check that required sections exist in routed commits.

**Design decision**: The `[TO:]` header Cursor uses (`[AGENT:source][TO:dest][TYPE:action]`) and our `[AGENT:] [ACTION:] [TASK:]` format serve the same purpose. Unified format recommendation:

```
[AGENT:<source>][TO:<target>][ACTION:<action>][TASK:<task-id>] <description>

## Work Summary
...
## Files Changed
...
## Next Step
...
```

The `[TO:]` field from Cursor's design adds explicit destination routing — valuable addition to our original format.

### Cross-reference: Cursor Features

- Cursor F2 (commit routing protocol) — direct match
- Cursor F4 (agent response reports in commits) — folded in above
- Cursor F5 (fix logs and next-steps) — folded in above

### Implementation Summary

**Files created**: `.ai/templates/commit-message.md` (reference guide), `.agents/skills/git-routing/SKILL.md` (routing format), `scripts/post-commit` (hook that parses headers), `setups/multi-agent-starter/scripts/post-commit.template`

### Dev Log

| Date | Stage | Action | By |
|------|-------|--------|----|
| 2026-02-10 | capture | Extracted from TASK-002 brainstorm | Claude Code |
| 2026-02-10 | research | Header format, routing table, parsing regex designed | Claude Code |
| 2026-02-10 | complete | Implemented in template + skill + hook | Cursor + Human |
| 2026-02-11 | enriched | Added Cursor's F4/F5 detail (structured reports, fix logs) | Claude Code |

### Related Ideas

- IDEA-001 (branch workflow uses this routing)
- IDEA-003 (automated workflow relies on routing)
- IDEA-010 (Print Mode could generate these headers)
- IDEA-021 (auto-triggered review parses these headers)
