# Agent Swarm Pattern: Parallel Task Review

## When to Use

Use this pattern when:

- Multiple tasks have been submitted for review (e.g., sprint end)
- Tasks are independent (different features, different files)
- You need fast turnaround on reviews
- Each task has its own task brief in `.ai/tasks/`

## Pattern Overview

The overseer creates one reviewer subagent per task and dispatches all reviews simultaneously. Each reviewer works in isolation, reads its assigned task brief, checks the diff, and writes a review file.

## Usage Example

```python
# The overseer identifies 3 tasks ready for review
tasks_to_review = ["TASK-101", "TASK-102", "TASK-103"]

# Step 1: Create a reviewer subagent for each task
for task_id in tasks_to_review:
    CreateSubagent(
        name=f"reviewer-{task_id}",
        system_prompt="""You are a Code Reviewer subagent.

Your Mission: Review a code submission against its task brief.

Review Process:
1. Read the task brief from the specified path
2. Run `git diff HEAD~1` to see what changed
3. Check each acceptance criterion — mark as MET or UNMET
4. Check file boundary compliance against .ai/boundaries.md
5. Check commit message format: [AGENT:x] [ACTION:y] [TASK:z]

Output Format:
Write your review to the specified output path using this structure:
- Verdict: APPROVED / CHANGES_REQUESTED / REJECTED
- Criteria checklist (each marked MET or UNMET)
- Boundary compliance (PASS or VIOLATION with details)
- Commit format (PASS or FAIL)
- Summary and recommendations"""
    )

# Step 2: Dispatch all reviews in parallel
for task_id in tasks_to_review:
    Task(
        subagent_name=f"reviewer-{task_id}",
        prompt=f"""Review the submission for {task_id}.

Task brief: .ai/tasks/{task_id}.md
Branch: cursor/{task_id}

Check all acceptance criteria, boundary compliance, and commit format.
Write your review to: .ai/reviews/{task_id}-review.md"""
    )

# Step 3: After all complete, the overseer reads all review files
# and produces a sprint review summary
```

## Expected Output

Each reviewer writes to `.ai/reviews/TASK-XXX-review.md`:

```markdown
# Review: TASK-101

**Verdict**: APPROVED

## Criteria Checklist
- [x] Feature X implemented
- [x] Tests added
- [x] Documentation updated

## Boundary Compliance: PASS
## Commit Format: PASS

## Summary
Implementation meets all acceptance criteria...
```

## Aggregation

After all reviews complete, the overseer reads all review files and:

1. Counts verdicts (approved, changes requested, rejected)
2. Identifies any blocking issues
3. Writes a sprint review summary to `.ai/reports/sprint-review-summary.md`
4. Merges approved tasks to `pre-mortal`

## Tool Call Budget

- Per reviewer: ~15-20 tool calls (ReadFile x3, Grep x2, Think x2, WriteFile x1, Shell x2)
- 3 parallel reviewers: ~45-60 tool calls
- 10 parallel reviewers: ~150-200 tool calls
- Budget ceiling: 1,500 tool calls per session

## Best Practices

- Use the predefined `reviewer` subagent for single reviews
- Use this swarm pattern only when reviewing 3+ tasks simultaneously
- Always specify output file paths in the Task prompt
- Archive the session after a large swarm review

