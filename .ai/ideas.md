# Feature Ideas

Ideas progress through a 5-stage pipeline. See [WORKFLOW.md](ideas/WORKFLOW.md) for the full lifecycle.

## Pipeline Overview

```
1-capture/ → 2-research/ → 3-approved/ → 4-in-progress/ → 5-complete/
   (0)          (14)           (3)            (0)              (8)
```

| Stage | Count | What's Here |
|-------|-------|-------------|
| [1-capture](ideas/1-capture/) | 0 | Raw ideas waiting to be fleshed out |
| [2-research](ideas/2-research/) | 14 | Being investigated — feasibility, design, dependencies |
| [3-approved](ideas/3-approved/) | 3 | Ready to build — waiting for task brief + assignment |
| [4-in-progress](ideas/4-in-progress/) | 0 | Actively being built on an agent branch |
| [5-complete](ideas/5-complete/) | 8 | Implemented, tested, merged |

**25 total ideas** — merged from Claude's research (18) + Cursor's architecture analysis (7 new).

### Cross-Reference

Cursor's 30-feature breakdown mapped to these 25 ideas. See [TASK-002-cursor-analysis.md](tasks/TASK-002-cursor-analysis.md) for the full mapping.

## By Roadmap Phase

| Phase | Theme | Complete | Approved | Research |
|-------|-------|----------|----------|----------|
| 1 | Foundation | 001, 002, 004, 020 | 016 | — |
| 2 | Agent Skills + Sprint | 008 | — | 019, 022 |
| 3 | Flow Skills + Auto-review | 009 | — | 021 |
| 4 | Kimi Overseer | 005 | 017 | 007, 012, 024 |
| 5 | Print Mode Automation | 010 | — | 003, 018, 023 |
| 6 | Evaluation | — | — | 013 |
| 7 | Wire Mode | — | — | 006, 011, 018 |
| 8 | Templates + Mono-repo | — | 014 | 015, 025 |

## 5-complete/ (8 ideas)

| ID | Idea | Phase | Implemented | Detail |
|----|------|-------|-------------|--------|
| IDEA-001 | Git branch handoff workflow | 1 | 2026-02-10 | [detail](ideas/5-complete/IDEA-001-git-branch-workflow.md) |
| IDEA-002 | Commit message header routing | 1 | 2026-02-10 | [detail](ideas/5-complete/IDEA-002-commit-message-routing.md) |
| IDEA-004 | Agent communication folders | 1 | 2026-02-10 | [detail](ideas/5-complete/IDEA-004-agent-communication-folders.md) |
| IDEA-005 | Kimi Code persistent overseer | 4 | 2026-02-10 | [detail](ideas/5-complete/IDEA-005-kimi-code-overseer.md) |
| IDEA-008 | Agent Skills conventions | 2 | 2026-02-10 | [detail](ideas/5-complete/IDEA-008-agent-skills-conventions.md) |
| IDEA-009 | Flow Skills for handoffs | 3 | 2026-02-10 | [detail](ideas/5-complete/IDEA-009-flow-skills-handoffs.md) |
| IDEA-010 | Print Mode Git hooks | 5 | 2026-02-10 | [detail](ideas/5-complete/IDEA-010-print-mode-git-hooks.md) |
| IDEA-020 | `.ai/` folder standard | 1 | 2026-02-10 | [detail](ideas/5-complete/IDEA-020-ai-folder-standard.md) |

## 3-approved/ (3 ideas — ready to build)

| ID | Idea | Phase | Feasibility | Detail |
|----|------|-------|-------------|--------|
| IDEA-014 | Project templates for specific types | 8 | Ready | [detail](ideas/3-approved/IDEA-014-project-templates.md) |
| IDEA-016 | Conversational Git operations | 1 | Ready | [detail](ideas/3-approved/IDEA-016-conversational-git.md) |
| IDEA-017 | Context compression for histories | 4 | Ready | [detail](ideas/3-approved/IDEA-017-context-compression.md) |

## 2-research/ (14 ideas — need more design work)

| ID | Idea | Phase | Feasibility | Detail |
|----|------|-------|-------------|--------|
| IDEA-003 | Automated commit workflow cycle | 5 | Feasible | [detail](ideas/2-research/IDEA-003-automated-commit-workflow.md) |
| IDEA-006 | Terminal connection to Kimi Code | 4-7 | Mixed | [detail](ideas/2-research/IDEA-006-terminal-connection.md) |
| IDEA-007 | Kimi Code subagent architecture | 4 | Feasible | [detail](ideas/2-research/IDEA-007-subagent-architecture.md) |
| IDEA-011 | Wire Mode coordination layer | 7 | Experimental | [detail](ideas/2-research/IDEA-011-wire-mode-coordination.md) |
| IDEA-012 | Work delegation system | 4-5 | Feasible | [detail](ideas/2-research/IDEA-012-work-delegation.md) |
| IDEA-013 | Project evaluation and metrics | 6 | Feasible | [detail](ideas/2-research/IDEA-013-project-evaluation.md) |
| IDEA-015 | Mono-repo coordination | 8 | Needs Research | [detail](ideas/2-research/IDEA-015-mono-repo-coordination.md) |
| IDEA-018 | Approval workflow integration | 5-7 | Feasible | [detail](ideas/2-research/IDEA-018-approval-workflow.md) |
| IDEA-019 | Sprint-based task pipeline | 2 | Feasible | [detail](ideas/2-research/IDEA-019-sprint-task-pipeline.md) |
| IDEA-021 | Auto-triggered review pipeline | 3 | Feasible | [detail](ideas/2-research/IDEA-021-auto-triggered-review.md) |
| IDEA-022 | Agent tool integrations | 2-3 | Feasible | [detail](ideas/2-research/IDEA-022-agent-tool-integrations.md) |
| IDEA-023 | Cross-agent API bridge | 5 | Feasible | [detail](ideas/2-research/IDEA-023-cross-agent-api-bridge.md) |
| IDEA-024 | K2/K2.5 model exploitation | 4 | Feasible | [detail](ideas/2-research/IDEA-024-k2-k25-exploitation.md) |
| IDEA-025 | Self-improving system | 8 | Experimental | [detail](ideas/2-research/IDEA-025-self-improving-system.md) |
