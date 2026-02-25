# Coordination Board

The single source of truth for what's happening right now. Every agent reads this at session start and updates it when their status changes.

**Last updated**: [DATE] by [AGENT]

---

## Active Work

| Agent | Task | Status | Branch | Notes |
|-------|------|--------|--------|-------|
| Claude Code | — | IDLE | — | — |
| Cursor | — | IDLE | — | No active assignment |
| Lovable | — | IDLE | — | No active assignment |

## Blocked

| Task | Blocked By | Owner | Since |
|------|-----------|-------|-------|
| — | — | — | — |

## Ready for Pickup

| Task | Priority | Type | Suitable For | Brief |
|------|----------|------|-------------|-------|
| — | — | — | — | — |

## Recently Completed

| Task | Agent | Date | Notes |
|------|-------|------|-------|

## Decisions Pending Human Input

| Question | Context | Raised By | Date |
|----------|---------|-----------|------|

---

## How to Use This Board

**Every session start**: Read this board. Know who's doing what before you start work.

**When you start a task**: Update Active Work with your row. Set Status to IN_PROGRESS.

**When you finish**: Move your task to Recently Completed. Set your row to IDLE.

**When you're blocked**: Add an entry to Blocked. Set your Active Work status to BLOCKED.

**When you need human input**: Add to Decisions Pending.

**Commit this file** whenever you update it: `[AGENT:x] [ACTION:update] [TASK:BOARD] Updated coordination board`
