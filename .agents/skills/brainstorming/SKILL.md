---
name: brainstorming
description: Structured exploration of requirements before any implementation. Produces a validated design that feeds into writing-plans.
---

## When to Use

Before any non-trivial work. If you're about to write code, decompose tasks, or change the system — brainstorm first.

**Gate**: Do NOT invoke any implementation skill, write any code, or create task briefs until you have presented a design and the human has approved it.

## Process

### Step 1: Explore Context

Read the relevant files to understand what exists. For this repo: check `.ai/board.md`, `.ai/status.md`, relevant tasks in `.ai/tasks/`, and any related templates or skills.

### Step 2: Ask Clarifying Questions

One question at a time. Prefer multiple choice over open-ended when possible.

Understand:
- What problem are we solving?
- What constraints exist?
- What does success look like?
- Which agents will be involved?

### Step 3: Propose 2-3 Approaches

For each approach:
- Describe the approach in 2-3 sentences
- List trade-offs (what you gain vs. what you lose)
- Recommend one with reasoning

### Step 4: Present Design

Share the design in sections. Get approval after each section before moving on. The design should cover:
- What changes and why
- Which files are affected
- Which agents handle which parts
- How it integrates with existing patterns

### Step 5: Save Design

Save the validated design to `docs/plans/YYYY-MM-DD-<topic>-design.md` and commit.

### Step 6: Transition to Planning

Invoke the `writing-plans` skill to create an implementation plan from the approved design.

## Key Principles

- **YAGNI** — Remove unnecessary features from all designs
- **One question per message** — Don't overwhelm with multiple questions
- **Always explore alternatives** — At least 2-3 approaches before committing
- **Incremental validation** — Approval after each section
- **Multi-agent awareness** — Consider which agents own which parts of the design
