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

### Agent Performance Evaluation (from Cursor F22)

Cursor identified agent-specific performance metrics as a distinct track within evaluation:

**Per-agent metrics**:
| Agent | Metric | What It Measures |
|-------|--------|------------------|
| Coder | Review pass rate | % commits approved on first review |
| Coder | Avg fix iterations | How many review cycles before approval |
| Coder | Test coverage delta | New code coverage vs existing baseline |
| Reviewer | False positive rate | Issues flagged that weren't real problems |
| Reviewer | Miss rate | Bugs that got through review |
| Reviewer | Thoroughness | % of changed files with review comments |
| Overseer | Sprint accuracy | Actual vs estimated task count |
| Overseer | Blocker detection speed | Time from BLOCKED to resolution |

**Cross-agent correlation**: Track whether reviewer feedback quality correlates with coder improvement over time.

### Configuration Evaluation (from Cursor F21)

Distinct from runtime metrics — evaluates whether the *configuration itself* is good:

- **A/B testing**: Try different agent prompts or models for the same task type
- **Cost tracking**: Tokens used per agent per sprint, cost per task completion
- **Compare across sprints**: Did a configuration change improve outcomes?
- **Template effectiveness**: Which project templates produce better metrics?

### Cross-reference: Cursor Features

- Cursor F21 (configuration evaluation) — folded in above
- Cursor F22 (agent performance evaluation) — folded in above

### Related Ideas

- IDEA-014 (templates include evaluation), IDEA-015 (cross-project evaluation)
- IDEA-025 (self-improving system uses these metrics to auto-tune)
