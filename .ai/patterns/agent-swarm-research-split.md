# Agent Swarm Pattern: Research Split

## When to Use

Use this pattern when:

- A research task covers multiple independent topics
- Each topic can be investigated in isolation
- You need comprehensive coverage in limited time
- Results can be combined into a single research report

## Pattern Overview

The overseer decomposes a large research task into independent sub-topics, creates a researcher subagent for each, dispatches all simultaneously, then aggregates findings into a single report.

## Usage Example

```python
# The overseer receives a research task covering multiple APIs
research_topics = [
    ("moonshot-files-api", "Research Moonshot Files API: upload, list, delete, content retrieval"),
    ("moonshot-cached-tokens", "Research Moonshot cached tokens: pricing, how to maximize cache hits"),
    ("kimi-wire-protocol", "Research Kimi Wire Mode protocol: events, requests, error handling"),
]

# Step 1: Create a researcher subagent for each topic
for topic_id, description in research_topics:
    CreateSubagent(
        name=f"researcher-{topic_id}",
        system_prompt="""You are a Research Specialist subagent.

Your Mission: Investigate a specific topic thoroughly and produce a structured report.

Research Process:
1. Use SearchWeb to find current documentation and best practices
2. Use FetchURL to read specific documentation pages
3. Use ReadFile to check existing project files for context
4. Use Think to synthesize findings
5. Write a structured report to the specified output path

Output Format:
- Topic Summary (2-3 sentences)
- Key Findings (numbered list)
- API/Feature Details (endpoints, parameters, examples)
- Recommendations for Our Project
- References (URLs consulted)

Rules:
- Cite sources for all claims
- Distinguish between verified facts and assumptions
- Flag any conflicting information found across sources
- Keep the report under 200 lines"""
    )

# Step 2: Dispatch all research tasks in parallel
for topic_id, description in research_topics:
    Task(
        subagent_name=f"researcher-{topic_id}",
        prompt=f"""Research: {description}

Context: We are building a multi-agent coordination system using Kimi Code CLI.
Project root: /Users/satorisan/Desktop/github/open-artel-project-setup

Deliverable: Write findings to .ai/reports/research-{topic_id}.md"""
    )

# Step 3: Overseer reads all research reports and produces a combined summary
```

## Expected Output

Each researcher writes to `.ai/reports/research-<topic>.md`:

```markdown
# Research: Moonshot Files API

## Summary
The Moonshot Files API allows uploading files for persistent context...

## Key Findings
1. Files are uploaded via multipart/form-data to /v1/files
2. Maximum file size is 100MB
3. Supported purposes: "assistants", "file-extract"
...

## Recommendations
- Upload AGENTS.md and task briefs for persistent context
- Use file-extract purpose for large codebases
...
```

## Aggregation

After all researchers complete, the overseer:

1. Reads all `.ai/reports/research-*.md` files
2. Identifies overlapping findings and contradictions
3. Synthesizes a combined research report
4. Writes to `.ai/reports/research-combined-<date>.md`
5. Updates `.ai/status.md` with research completion

## Tool Call Budget

- Per researcher: ~10-15 tool calls (SearchWeb x2, FetchURL x2, ReadFile x2, Think x2, WriteFile x1)
- 3 parallel researchers: ~30-45 tool calls
- 5 parallel researchers: ~50-75 tool calls
- Budget ceiling: 1,500 tool calls per session

## Best Practices

- Decompose into truly independent topics (no overlap)
- Give each researcher specific search terms and URLs to start with
- Limit scope per researcher (1 topic, not 3)
- Use the predefined `researcher` subagent for single-topic research
- Use this swarm pattern only when researching 3+ independent topics
- Always specify output file paths in the Task prompt
- Review for contradictions across researcher reports before accepting
