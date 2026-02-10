## IDEA-003: Automated commit workflow cycle

- **Category**: Automation
- **Origin**: TASK-002
- **Status**: researched
- **Feasibility**: Feasible
- **Roadmap Phase**: Phase 5 (Git Automation)

### The Idea

Complete automated cycle: commit → review trigger → project updates → agent does work → pushes → review → response report → next branch → repeat until sprint completed.

### Why It Matters

Eliminates manual handoffs. Each commit triggers the next step automatically.

### Research Findings

**13-step cycle specified** (TASK-002-research.md, Section 3):

1. Human defines sprint goals → `.ai/instructions/`
2. Kimi assigns decomposition to Claude Code
3. Claude creates task briefs → `.ai/tasks/` + submit commit
4. Kimi reviews briefs → approve/reject commit
5. Kimi routes first task to assigned agent → instruction file
6. Agent implements on their branch → submit commit
7. Kimi reviews submission → review commit
8. Kimi merges approved work → `pre-mortal`
9. Kimi updates `.ai/status.md`
10. Kimi routes next task (respecting dependencies)
11. Repeat steps 6-10
12. Kimi reports sprint complete → `.ai/reports/`
13. Human reviews `pre-mortal` → merges to `main`

**Error handling**: Review rejection → feedback + re-submit. BLOCKED → re-route to Claude. Merge conflict → auto-resolve or escalate. Build break → identify + create fix task. Agent timeout → status check, then escalate to Human.

### Answers to Open Questions

- **Review trigger**: Git post-commit hook invokes `kimi --print -p "Review..."`
- **Error handling**: Each error case has a defined recovery path (see above).
- **Report format**: Structured commit body (Files changed, Decisions, Issues, Tests).
- **Sprint completion**: All tasks DONE in `.ai/status.md`; Kimi generates summary report.

### Related Ideas

- IDEA-001 (branch workflow), IDEA-002 (routing), IDEA-005 (Kimi orchestrates), IDEA-010 (Print Mode executes)
