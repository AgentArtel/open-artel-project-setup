## IDEA-013: Project evaluation and metrics

- **Category**: Evaluation
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Feasible
- **Roadmap Phase**: Phase 6 (Project Evaluation)

### The Idea

Metrics system to assess configuration performance from the agent level.

### Why It Matters

Continuous improvement — measure what works, refine the system.

### Research Findings

**8 metrics defined** (TASK-002-research.md, Section 10):

| Metric | Measures | Source |
|--------|----------|--------|
| Task completion rate | % tasks DONE | `.ai/status.md` |
| Review rejection rate | % rejected first try | `.ai/reviews/` |
| Boundary violations | Out-of-domain file touches | Review reports |
| Sprint velocity | Tasks per sprint | Sprint markers |
| Handoff latency | Submit → merge time | Git timestamps |
| Regression rate | % merges with regressions | Post-merge fixes |
| Escalation rate | % escalated to Human | BLOCKED + escalations |
| Template coverage | % briefs matching format | Parse against template |

**Report template**: Project name, period, agents, metrics table (value vs target), what worked, what didn't, recommendations.

**Automated collection**: `kimi --print -p "Generate eval report from .ai/ files..."`

**Baseline**: Even-Openclaw (30+ tasks, 4 phases) as comparison reference.

### Answers to Open Questions

- **Metrics**: 8 quantitative metrics, all collectible from `.ai/` files.
- **Collection**: Kimi Print Mode parses and calculates. Automated in sprint completion flow.
- **Format**: Per-sprint reports in `.ai/reports/eval-sprint-N.md`.
- **Comparison**: Historical against past-configurations. Same metrics across projects.

### Related Ideas

- IDEA-014 (templates include evaluation), IDEA-015 (cross-project evaluation)
