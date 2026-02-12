# Agent Chat Workspace Template

When creating a new agent chat workspace, follow this structure:

## Folder Creation

1. **Create workspace folder**: `.ai/agent-chats/<chat-name>/`
   - Naming convention: `<role>-<task>` or `<agent>-<purpose>`
   - Examples: `manager-a-frontend-coordinator`, `manager-b-frontend-coordinator`, `cursor-dashboard-setup`

2. **Create subfolders**:
   ```
   .ai/agent-chats/<chat-name>/
   ├── instructions/    # Instructions created by this chat
   ├── reports/          # Reports created by this chat
   ├── chats/            # Chat logs for this coordination
   └── README.md         # Workspace documentation
   ```

## README.md Template

```markdown
# <Chat Name> — <Purpose>

**Role**: [Role description]
**Task**: [Task ID or description]
**Status**: [In Progress | Pending | Complete]
**Created**: [Date]

## Purpose

[Brief description of what this chat coordinates]

## Workflow

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Workspace Structure

- `instructions/` - [What goes here]
- `reports/` - [What goes here]
- `chats/` - [What goes here]
- `README.md` - This file

## Key Files

### Instructions
- [List key instruction files]

### Reports
- [List key report files]

## Status

- [ ] [Status item 1]
- [ ] [Status item 2]

## Notes

[Any important notes about this workspace]
```

## Naming Conventions

- **Workspace folder**: `kebab-case` (e.g., `manager-a-frontend-coordinator`)
- **Files in workspace**: Follow existing conventions for each folder type
- **README.md**: Always include in workspace root

## When to Create a Workspace

Create a workspace when:
- Starting a new agent chat that will create multiple files
- Coordinating a complex task that spans multiple phases
- Managing parallel work streams (like Manager Chat A and B)
- Need to track all work from a specific agent chat in one place

## Integration with Existing Structure

- Workspaces are **in addition to** existing `.ai/` folders
- Direct agent assignments (Kimi → Cursor) still go in `.ai/instructions/`
- General project reports still go in `.ai/reports/`
- Workspaces are for **agent chat-specific** work organization
