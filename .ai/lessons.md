# Lessons Learned

A living document. Every mistake, correction, or unexpected difficulty gets an entry here. Review this at the start of every session.

## How to Use

1. **When to add**: After any correction, failed approach, unexpected behavior, or process friction
2. **Format**: Date, what happened, why, and the rule to prevent it
3. **Review**: Read this file at session start — don't repeat history
4. **Evolve**: If a lesson keeps coming up, it should become a convention in `.ai/workflow-principles.md`

---

## Entries

*Most recent first.*

### 2026-02-24 — Redundancy creates drift and confusion

**What happened**: Audit found the same concepts (agent roles, commit routing, file ownership, workflow discipline) defined in 3-5 places each. Skills restated what `.ai/` files already said. Overseer prompt repeated what AGENTS.md defined. Every update required editing 5 files or accepting that some would become stale.

**Why**: Initial build-out focused on completeness per-file rather than single source of truth. Skills were written as standalone documents instead of referencing canonical sources. Each new file copied content "for convenience" instead of pointing to it.

**Rule**: Define each concept exactly once. Everything else says "See [canonical file]." When you're tempted to copy content into a new file, write a reference instead. If you find yourself updating the same concept in multiple places, that's a signal to consolidate.

**Category**: scope

### 2026-02-24 — Task template didn't match real usage

**What happened**: TASK-003 grew to 742 lines with sections not in the template (Research Findings, Implementation Phases, File Changes Summary). The template was too rigid for complex tasks and too sparse for research tasks.

**Why**: Template was designed theoretically, not based on what agents actually needed. No feedback loop from real task usage back to the template.

**Rule**: When a template doesn't fit real work, update the template — don't just work around it. Make templates flexible: required sections at the top, optional sections that agents add as needed. Review real task files periodically to check if the template still matches.

**Category**: planning
