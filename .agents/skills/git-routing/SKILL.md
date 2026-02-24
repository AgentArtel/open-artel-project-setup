---
name: git-routing
description: Commit message routing quick reference. Full spec in .ai/templates/commit-message.md.
---

## Canonical Source

The complete routing specification lives in `.ai/templates/commit-message.md`. This skill is a quick reference.

## Format

```
[AGENT:agent] [ACTION:action] [TASK:task-id] Short description

Optional body with details.
```

All three header fields are required. Short description under 72 characters.

## Quick Reference

| AGENT | ACTION | What Happens |
|-------|--------|-------------|
| `cursor` | `submit` | Kimi/Claude reviews Cursor's work |
| `lovable` | `submit` | Kimi/Claude reviews Lovable's work |
| `claude` | `submit` | Kimi reviews Claude's work |
| `kimi` | `approve` | Merge to `pre-mortal`, assign next task |
| `kimi` | `reject` | Agent addresses feedback, re-submits |
| `kimi` | `delegate` | Target agent picks up assignment |
| `kimi` | `merge` | Branch merged to `pre-mortal` |
| any | `update` | Status tracking only |
| any | `report` | Human PM reviews |

## Branch Rules

- Agents commit to: `<agent>/<task-id>-<description>`
- Submit commits on the agent's branch
- Approve/merge commits on `pre-mortal`
