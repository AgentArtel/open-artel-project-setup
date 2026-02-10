# CreateSubagent Pattern: Test Generator

## When to Use

Use this pattern when:

- A new script or feature needs test coverage
- Existing tests need to be expanded with edge cases
- You need to generate regression tests after a bug fix
- A phase completion requires a comprehensive test suite
- You want to verify a component works before integrating it

## Template Location

`.agents/subagents/test-generator-template.md`

## Two-Step Workflow

### Step 1: Create the subagent

```python
CreateSubagent(
    name="test-gen-TASK-101",
    system_prompt="""<contents of .agents/subagents/test-generator-template.md>"""
)
```

### Step 2: Dispatch the task

```python
Task(
    subagent_name="test-gen-TASK-101",
    prompt="""Generate tests for the context monitoring script.

    Component:
    - scripts/kimi-context-monitor.sh
    - Commands: check, auto-compact, report, history, thresholds

    Existing test patterns to follow:
    - scripts/test-phase-1.sh (run_test() pattern, 4 categories)
    - scripts/test-phase-2.sh (session manager tests)

    Test categories needed:
    1. Structural (8 tests): File existence, JSON validity, script executable
    2. Live API (4 tests): Real context checks, auto-compact triggers
    3. Edge (6 tests): No session, corrupt files, concurrent operations
    4. Integration (3 tests): Phase 1-3 regression tests

    Requirements:
    - Follow the run_test() pattern from test-phase-1.sh
    - Support --mandatory-only, --edge-only, --live-only flags
    - All tests clean up after themselves
    - No || true to swallow errors

    Deliverable:
    - Complete test script
    - Save to: scripts/test-phase-4.sh"""
)
```

## Naming Convention

- `test-gen-TASK-101` — test generation for a specific task
- `test-gen-phase-4` — generating a phase test suite
- `test-gen-regression-auth` — regression tests for a specific bug

## Best Practices

- Point the subagent to existing test files for pattern reference
- Specify the test categories (structural, live API, edge, integration)
- Include the component's commands/features to test
- Ask for both positive and negative tests
- Require cleanup of test artifacts
- Subagents are session-scoped — no manual cleanup needed

## Helper Script

```bash
./scripts/create-specialized-subagent.sh test-generator TASK-101
```

