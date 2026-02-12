# CreateSubagent Pattern: Debugger

## When to Use

Use this pattern when:

- A regression appears after a recent change
- A bug is reported but root cause is unclear
- Unexpected behavior in production or tests
- A test is failing and the reason is not obvious
- You need isolated debugging without polluting the main session context

## Template Location

`.agents/subagents/debugger-template.md`

## Two-Step Workflow

### Step 1: Create the subagent

```python
CreateSubagent(
    name="bug-hunter-TASK-123",
    system_prompt="""<contents of .agents/subagents/debugger-template.md>"""
)
```

### Step 2: Dispatch the task

```python
Task(
    subagent_name="bug-hunter-TASK-123",
    prompt="""Investigate the regression in user authentication.

    Symptoms:
    - Users report login failures after commit abc123
    - Error appears in production logs: 'Invalid token'
    - Started happening after the session management refactor

    Relevant files:
    - scripts/post-commit (recently modified)
    - scripts/kimi-session-manager.sh (new file)

    Deliverable:
    - Root cause analysis
    - Recommended fix
    - Save report to: .ai/reports/bug-auth-regression.md"""
)
```

## Naming Convention

Use descriptive names that include the task ID:

- `bug-hunter-TASK-123` — debugging for a specific task
- `regression-hunter-sprint-5` — debugging a sprint regression
- `test-failure-debugger` — debugging test failures

## Best Practices

- Include specific symptoms and error messages in the Task prompt
- List relevant files to narrow the search scope
- Always specify where to save the output report
- Include recent Git history context (e.g., "started after commit abc123")
- Subagents are session-scoped — no manual cleanup needed

## Helper Script

Generate the Kimi prompt automatically:

```bash
./scripts/create-specialized-subagent.sh debugger TASK-123
```

This reads the template and outputs a ready-to-use Kimi prompt.
