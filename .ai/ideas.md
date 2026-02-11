# Feature Ideas

Quick-capture backlog. Ideas graduate to `.ai/tasks/` when ready for work.

## Summary

- **25 unified ideas** — merged from Claude's 18 researched ideas + Cursor's 30-feature analysis
- **All researched** — enriched with findings from TASK-002-research.md and Cursor's architecture document
- **8 ideas implemented** in Phases 1–5 (marked as such below)
- **8-phase roadmap** from foundation (Phase 1) through mono-repo support (Phase 8)

### Cross-Reference

Cursor's 30-feature breakdown has been mapped to these 25 unified ideas. See [TASK-002-cursor-analysis.md](tasks/TASK-002-cursor-analysis.md) for the full mapping table.

### By Phase

| Phase | Ideas | Theme | Status |
|-------|-------|-------|--------|
| 1 | 001, 002, 004, 016, 020 | Foundation — branch workflow, commit routing, communication, .ai/ standard | Implemented |
| 2 | 008, 019 | Agent Skills + Sprint Pipeline | Partially Implemented |
| 3 | 009, 021 | Flow Skills + Auto-triggered Review | Partially Implemented |
| 4 | 005, 007, 012, 017, 024 | Kimi Overseer — oversight, subagents, delegation, compression, K2 | Partially Implemented |
| 5 | 003, 010, 018, 023 | Print Mode Automation — commit cycle, hooks, approvals, API bridge | Partially Implemented |
| 6 | 013 | Evaluation — project metrics and quality tracking | Next Up |
| 7 | 006, 011, 018 | Wire Mode — terminal connection, JSON-RPC coordination | Backlog |
| 8 | 014, 015, 025 | Templates, Mono-repo, Self-improving System | Backlog |

### By Feasibility

| Rating | Ideas |
|--------|-------|
| Ready | 001, 002, 004, 008, 009, 014, 016, 017, 020 |
| Feasible | 003, 005, 007, 010, 012, 013, 018, 019, 021, 022, 023, 024 |
| Experimental | 011, 025 |
| Needs Research | 006 (partial), 015 |

### Implementation Status

| Status | Ideas |
|--------|-------|
| Implemented | 001, 002, 004, 005, 008, 009, 010, 020 |
| Researched (not yet built) | 003, 006, 007, 011, 012, 013, 014, 015, 016, 017, 018, 019, 021, 022, 023, 024, 025 |

## Full Index

| ID | Idea | Category | Status | Feasibility | Phase | Detail |
|----|------|----------|--------|-------------|-------|--------|
| IDEA-001 | Git branch handoff workflow | Git Workflow | Implemented | Ready | 1 | [detail](ideas/IDEA-001-git-branch-workflow.md) |
| IDEA-002 | Commit message header routing | Automation | Implemented | Ready | 1 | [detail](ideas/IDEA-002-commit-message-routing.md) |
| IDEA-003 | Automated commit workflow cycle | Automation | Researched | Feasible | 5 | [detail](ideas/IDEA-003-automated-commit-workflow.md) |
| IDEA-004 | Agent communication folders | Communication | Implemented | Ready | 1 | [detail](ideas/IDEA-004-agent-communication-folders.md) |
| IDEA-005 | Kimi Code persistent project overseer | Kimi Integration | Implemented | Feasible | 4 | [detail](ideas/IDEA-005-kimi-code-overseer.md) |
| IDEA-006 | Terminal connection to Kimi Code | Kimi Integration | Researched | Mixed | 4-7 | [detail](ideas/IDEA-006-terminal-connection.md) |
| IDEA-007 | Kimi Code subagent architecture | Agent Architecture | Researched | Feasible | 4 | [detail](ideas/IDEA-007-subagent-architecture.md) |
| IDEA-008 | Agent Skills for Open Artel conventions | Kimi Integration | Implemented | Ready | 2 | [detail](ideas/IDEA-008-agent-skills-conventions.md) |
| IDEA-009 | Flow Skills for agent handoff workflows | Automation | Implemented | Ready | 3 | [detail](ideas/IDEA-009-flow-skills-handoffs.md) |
| IDEA-010 | Print Mode for Git hooks automation | Automation | Implemented | Feasible | 5 | [detail](ideas/IDEA-010-print-mode-git-hooks.md) |
| IDEA-011 | Wire Mode custom coordination layer | Automation | Researched | Experimental | 7 | [detail](ideas/IDEA-011-wire-mode-coordination.md) |
| IDEA-012 | Work delegation system | Agent Architecture | Researched | Feasible | 4-5 | [detail](ideas/IDEA-012-work-delegation.md) |
| IDEA-013 | Project evaluation and metrics | Evaluation | Researched | Feasible | 6 | [detail](ideas/IDEA-013-project-evaluation.md) |
| IDEA-014 | Project templates for specific types | Templates | Researched | Ready | 8 | [detail](ideas/IDEA-014-project-templates.md) |
| IDEA-015 | Mono-repo coordination | Mono-repo | Researched | Needs Research | 8 | [detail](ideas/IDEA-015-mono-repo-coordination.md) |
| IDEA-016 | Conversational Git operations | Git Workflow | Researched | Ready | 1 | [detail](ideas/IDEA-016-conversational-git.md) |
| IDEA-017 | Context compression for histories | Kimi Integration | Researched | Ready | 4 | [detail](ideas/IDEA-017-context-compression.md) |
| IDEA-018 | Approval workflow integration | Automation | Researched | Feasible | 5-7 | [detail](ideas/IDEA-018-approval-workflow.md) |
| IDEA-019 | Sprint-based task pipeline | Project Management | Researched | Feasible | 2 | [detail](ideas/IDEA-019-sprint-task-pipeline.md) |
| IDEA-020 | `.ai/` folder as multi-agent OS | Infrastructure | Implemented | Ready | 1 | [detail](ideas/IDEA-020-ai-folder-standard.md) |
| IDEA-021 | Auto-triggered review pipeline | Automation | Researched | Feasible | 3 | [detail](ideas/IDEA-021-auto-triggered-review.md) |
| IDEA-022 | Agent tool integrations | Agent System | Researched | Feasible | 2-3 | [detail](ideas/IDEA-022-agent-tool-integrations.md) |
| IDEA-023 | Cross-agent API bridge | Agent System | Researched | Feasible | 5 | [detail](ideas/IDEA-023-cross-agent-api-bridge.md) |
| IDEA-024 | K2/K2.5 model exploitation | Agent System | Researched | Feasible | 4 | [detail](ideas/IDEA-024-k2-k25-exploitation.md) |
| IDEA-025 | Self-improving system | Meta | Researched | Experimental | 8 | [detail](ideas/IDEA-025-self-improving-system.md) |
