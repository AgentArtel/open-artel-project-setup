## IDEA-025: Self-improving system

- **Category**: Meta
- **Origin**: Cursor analysis (Feature 26)
- **Status**: researched
- **Feasibility**: Experimental
- **Roadmap Phase**: Phase 8 (Templates & Mono-repo)

### The Idea

The system uses its own performance data to improve — adjusting prompts, model choices, and pipeline configuration based on what works. The overseer periodically reviews metrics and proposes optimizations.

### Why It Matters

Manual tuning of agent prompts, review criteria, and pipeline config doesn't scale. A system that learns from its own metrics can continuously improve without human intervention on every tweak.

### Design (from Cursor analysis)

**Improvement loop**:
1. Overseer periodically reviews `.ai/reports/` metrics (triggered by sprint completion)
2. Identifies patterns: "Reviewer flags too many style issues → add linting step before review"
3. Generates specific recommendations as proposals in `.ai/channels/escalations/`
4. With human approval, modifies agent prompts or pipeline configuration
5. Tracks before/after metrics to validate changes worked
6. Rolls back if metrics worsen

**Example improvements the system could propose**:
- "Coder's review pass rate dropped 20% this sprint → suggest adding a self-review step before submission"
- "Average fix iterations increased from 1.2 to 2.8 → reviewer criteria may be too strict, suggest relaxing style checks"
- "Task estimation accuracy is 45% → suggest breaking tasks smaller (max 2-hour chunks)"
- "K2 costs spiked 3x this sprint → suggest switching routine reviews from K2-Thinking to K2-Standard"

**Safety rails**:
- All config changes require human approval (never auto-modify prompts)
- Before/after comparison is mandatory
- Rollback trigger: any metric drops >15% after a change
- Maximum one config change per sprint (isolate variables)

### Prerequisites

This idea sits at the top of the dependency chain — it requires almost everything else:
- IDEA-013 (metrics to analyze)
- IDEA-019 (sprint structure to measure)
- IDEA-005 (overseer to perform analysis)
- IDEA-018 (approval workflow for config changes)

### Open Questions

- How much autonomy? Suggest-only, or auto-apply with rollback?
- What's the minimum data needed before recommendations are reliable? (N sprints?)
- How to prevent overfitting to recent sprints?
- Who validates that the system's self-assessment is accurate?

### Cross-reference: Cursor Features

- Cursor F26 (self-improving system) — primary source

### Related Ideas

- IDEA-013 (provides the metrics), IDEA-019 (provides sprint structure)
- IDEA-005 (overseer performs analysis), IDEA-018 (approval for changes)
- IDEA-024 (K2 cost optimization is one thing it would tune)
