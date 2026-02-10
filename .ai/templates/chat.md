# Chat: [Agent A] ↔ [Agent B] — [Context]

> **Naming convention**: `<agent1>-<agent2>-<context>.md`
> Examples: `kimi-cursor-TASK-P4-01.md`, `claude-cursor-sprint-3.md`

---

## [DATE TIME] — [Sender] → [Receiver]

**Topic**: [Brief description of what this message is about]

[Message content — assignment, question, status update, etc.]

**References**:
- [Link to relevant task, file, or previous chat]

---

## [DATE TIME] — [Receiver] → [Sender]

**Status**: [Response status — acknowledged, completed, blocked, etc.]

[Response content — answers, results, issues, etc.]

**References**:
- [Link to relevant commit, file, or task]

---

<!-- Usage notes:
- Auto-populated by the post-commit hook on submit, approve, reject, and delegate actions
- Agents can also append entries manually for ad-hoc coordination
- One file per conversation thread (task-scoped or sprint-scoped)
- Entries are appended chronologically
- Use ISO date format: YYYY-MM-DD HH:MM
- Keep messages concise — link to tasks/files for details
- Archive completed conversations by moving to .ai/chats/archive/
-->

