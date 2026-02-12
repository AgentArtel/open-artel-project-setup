# CreateSubagent Pattern: Performance Analyzer

## When to Use

Use this pattern when:

- A script or workflow is running slower than expected
- Token usage is higher than anticipated
- You need to optimize a specific component before a release
- Shell scripts have complex pipes that might be inefficient
- Context is growing too fast in Kimi sessions

## Template Location

`.agents/subagents/performance-analyzer-template.md`

## Two-Step Workflow

### Step 1: Create the subagent

```python
CreateSubagent(
    name="perf-analyzer-TASK-456",
    system_prompt="""<contents of .agents/subagents/performance-analyzer-template.md>"""
)
```

### Step 2: Dispatch the task

```python
Task(
    subagent_name="perf-analyzer-TASK-456",
    prompt="""Analyze the performance of the evaluation script.

    Context:
    - scripts/generate-evaluation.sh takes 45+ seconds to run
    - It collects 8 metrics from various sources
    - Some metrics involve complex grep/awk pipes
    - The script calls Kimi Print Mode at the end

    Focus areas:
    - Shell pipe efficiency (grep | awk | head chains)
    - File I/O patterns (reading the same file multiple times)
    - Kimi API call optimization

    Deliverable:
    - Performance report with measurements
    - Prioritized optimization recommendations
    - Save report to: .ai/reports/perf-evaluation-script.md"""
)
```

## Naming Convention

- `perf-analyzer-TASK-456` — performance analysis for a specific task
- `perf-script-evaluation` — analyzing a specific script
- `perf-sprint-5-review` — sprint-level performance review

## Best Practices

- Provide baseline measurements if available (e.g., "currently takes 45 seconds")
- Specify the focus areas to avoid boiling the ocean
- Include the scale context (e.g., "runs on every commit" vs. "runs once per sprint")
- Ask for prioritized recommendations (impact-to-effort ratio)
- Subagents are session-scoped — no manual cleanup needed

## Helper Script

```bash
./scripts/create-specialized-subagent.sh performance TASK-456
```
