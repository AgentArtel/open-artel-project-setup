# Coordination Board

The single source of truth for what's happening right now. Every agent reads this at session start and updates it when their status changes.

**Last updated**: 2026-02-24 by Claude Code

---

## Active Work

| Agent | Task | Status | Branch | Notes |
|-------|------|--------|--------|-------|
| Claude Code | System consolidation | IN_PROGRESS | claude/review-improve-repo-bZXLH | Reducing redundancy, creating board, redesigning task system |
| Cursor | — | IDLE | — | No active assignment |
| Lovable | — | IDLE | — | No active assignment |
| Kimi | — | IDLE | — | No active assignment |
| Human | Reviewing direction | ACTIVE | — | Set priorities: task system, coordination, cleanup |

## Blocked

| Task | Blocked By | Owner | Since |
|------|-----------|-------|-------|
| — | — | — | — |

## Ready for Pickup

Tasks that are unblocked and unassigned. Agents: claim one by updating this board.

| Task | Priority | Type | Suitable For | Brief |
|------|----------|------|-------------|-------|
| — | — | — | — | — |

## Recently Completed

| Task | Agent | Date | Notes |
|------|-------|------|-------|
| Workflow Discipline Integration | Claude Code | 2026-02-24 | workflow-principles.md, lessons.md, skill updates |
| Phase 5: Git Automation | Claude Code | 2026-02-10 | post-commit hook, install script |
| Phase 4: Kimi Overseer Agent | Claude Code | 2026-02-10 | YAML configs, prompts, subagents |

## Decisions Pending Human Input

| Question | Context | Raised By | Date |
|----------|---------|-----------|------|
| — | — | — | — |

---

## How to Use This Board

**Every session start**: Read this board. Know who's doing what before you start work.

**When you start a task**: Update Active Work with your row. Set Status to IN_PROGRESS.

**When you finish**: Move your task to Recently Completed. Set your row to IDLE or pick up a Ready for Pickup task.

**When you're blocked**: Add an entry to Blocked. Set your Active Work status to BLOCKED.

**When you need human input**: Add to Decisions Pending.

**Commit this file** whenever you update it: `[AGENT:x] [ACTION:update] [TASK:BOARD] Updated coordination board`
