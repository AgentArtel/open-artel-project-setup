# CreateSubagent Pattern: Documentation Writer

## When to Use

Use this pattern when:

- A new script or feature needs documentation
- Existing docs are outdated after a refactor
- You need a comprehensive guide for a workflow
- API documentation needs to be generated from code
- A README needs to be created or updated

## Template Location

`.agents/subagents/documentation-writer-template.md`

## Two-Step Workflow

### Step 1: Create the subagent

```python
CreateSubagent(
    name="doc-writer-TASK-789",
    system_prompt="""<contents of .agents/subagents/documentation-writer-template.md>"""
)
```

### Step 2: Dispatch the task

```python
Task(
    subagent_name="doc-writer-TASK-789",
    prompt="""Write documentation for the Kimi session manager.

    Component:
    - scripts/kimi-session-manager.sh
    - 6 commands: create, list, resume, archive, delete, current

    Audience:
    - Developers setting up and using the multi-agent workflow

    Existing docs to reference:
    - docs/kimi-sessions.md (current version, may need updates)
    - docs/wire-daemon.md (example of good documentation style)

    Requirements:
    - Follow the project's documentation conventions (Markdown, ATX headings)
    - Include runnable examples for every command
    - Add a troubleshooting section
    - Match the style of existing docs

    Deliverable:
    - Complete documentation file
    - Save to: docs/kimi-sessions.md"""
)
```

## Naming Convention

- `doc-writer-TASK-789` — documentation for a specific task
- `doc-writer-sessions` — documenting a specific component
- `doc-writer-sprint-5` — sprint documentation roundup

## Best Practices

- Point the subagent to existing documentation for style reference
- Specify the audience (developers, operators, end users)
- Include the list of files/components to document
- Ask for runnable examples — they catch inaccuracies
- Subagents are session-scoped — no manual cleanup needed

## Helper Script

```bash
./scripts/create-specialized-subagent.sh docs TASK-789
```

