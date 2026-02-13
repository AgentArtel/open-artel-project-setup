# Development Status

Last updated: 2026-02-13

## Current Focus

Phases 1-7 built by Cursor (152 tests passing). Dashboard prototype on `cursor/concept-1-dashboard-test` (backend + external frontend, ecosystem hub vision, D2 task briefs). **Comprehensive review completed** — 5 governance decisions applied (see Review Decisions below). TASK-003 (upstream feedback + session lifecycle) still needs implementation.

## Active Sprint

| ID | Title | Status | Notes |
|----|-------|--------|-------|
| TASK-CONCEPT-1-DASHBOARD | Open Artel Dashboard — Central Hub | IN_PROGRESS | Standalone Lovable dashboard project — backend complete (D1-2, D1-3), frontend pending (D1-1) |
| TASK-D1-1 | Project Setup — Lovable Frontend Foundation | PENDING | Assigned to: lovable | Instruction: `.ai/instructions/lovable-D1-1-PROJECT-SETUP.md` | **BLOCKING: D1-4, D1-5, D1-6** |
| TASK-D1-2 | Backend API — Node.js + Express + WebSocket | DONE | Assigned to: cursor | ✅ Complete: Express server, WebSocket, all endpoints, README, .env.example |
| TASK-D1-3 | GitHub API Integration | DONE | Assigned to: cursor | ✅ Complete: GitHubService, parsers, all endpoints connected to real data |
| TASK-D1-4 | Task Lifecycle Visualizer | PENDING | Assigned to: cursor | Depends on: D1-1, D1-3 ✅ | Ready to start after D1-1 |
| TASK-D1-5 | Kimi Chat Interface | PENDING | Assigned to: lovable | Depends on: D1-1, D1-2 ✅ | Ready to start after D1-1 |
| TASK-D1-6 | Project Configuration & Auth | PENDING | Assigned to: cursor | Depends on: D1-1 | Ready to start after D1-1 |
| TASK-D1-7 | Documentation | PENDING | Assigned to: cursor | Depends on: All D1-* tasks | Will start after all features complete |
| TASK-001 | Bootstrap self-coordination system | DONE | AGENTS.md, CLAUDE.md, .ai/ layer |
| TASK-002 | Multi-agent Git workflow + Kimi Code integration research | DONE | 12-section design document, 25 ideas |
| TASK-003 | Upstream Feedback + Version Tracking + Session Lifecycle | PLANNING | 9-part plan written, 0/18 files built |
| — | Phase 1: Foundation | DONE | Communication folders, commit routing, Git workflow |
| — | Phase 2: Agent Skills | DONE | 6 SKILL.md files in .agents/skills/ |
| — | Phase 3: Flow Skills | DONE | 3 Flow Skills (sprint-execution, code-review, task-handoff) |
| — | Phase 4: Kimi Overseer Agent | DONE | kimi-overseer.yaml, reviewer/sub/researcher subagents, overseer.md |
| — | Phase 5: Git Automation | DONE | post-commit hook, install script, starter kit template, Print Mode integration |
| — | Phase 6: Evaluation | DONE | Evaluation template, metrics script, sprint evaluation CI workflow |
| — | Phase 7: Wire Mode | DONE | Wire daemon (JSON-RPC 2.0), daemon installer, test script, CI/CD workflows |
| — | Moonshot Phases 1–7 | DONE | Tool expansion, session mgr, subagents, context optimization, API client, advanced features, integration — 152 tests pass |
| — | F1: Learn from Past Configurations | DONE | Lesson extraction, structure comparison, patterns |
| — | CONCEPT-1-DASHBOARD | IN PROGRESS | Backend + external frontend, WebSocket/mockData fixes, ecosystem hub (D2 briefs) |

### Dashboard Phase 2 — Unified Ecosystem Hub

The dashboard is 1 of 5 projects in a unified system. See `.ai/ideas/IDEA-020-unified-ecosystem-hub.md` for the full vision and data flow map.

| ID | Title | Status | Assigned | Notes |
|----|-------|--------|----------|-------|
| TASK-D2-1 | Backend Data Source Abstraction | PENDING | cursor | Decouple from GitHub-only; add `source` discriminator. **Blocks all D2-* tasks.** |
| TASK-D2-2 | OpenClaw Gateway Integration | PENDING | cursor | Connect to Even-Openclaw's Gateway API (WS :18789). Depends on D2-1. |
| TASK-D2-3 | NHA / Legion X Integration | PENDING | cursor | Connect to NotHumanAllowed REST API. Depends on D2-1. |
| TASK-D2-4 | Game Agent Integration (Open-RPG) | PENDING | cursor | Define API contract + stubs. Depends on D2-1. Low priority (needs Open-RPG API). |
| TASK-D2-5 | Frontend Project Type Awareness | PENDING | cursor | UI adapts per source type. Depends on D2-1 + at least one of D2-2/3/4. |

## Review Decisions (Resolved 2026-02-13)

All 5 governance questions resolved by Human PM:

| # | Decision | Action Taken |
|---|----------|-------------|
| 1 | Cursor boundary violations accepted | Logged in boundaries.md. Revisit ownership later. |
| 2 | Scripts are part of the repo | CLAUDE.md updated — no longer claims "pure markdown." |
| 3 | Kimi rejection waved through | Logged in boundaries.md. Work accepted. |
| 4 | Idea pipeline: 3 folders (backlog/active/done) | Simplified from 5 folders. WORKFLOW.md + ideas.md updated. |
| 5 | Single source of truth in starter kit | Policy documented in boundaries.md. Root copies synced from setups/. |

See `.ai/reviews/cursor-comprehensive-review-2026-02-13.md` for full analysis.

## Backlog

| ID | Title | Priority | Notes |
|----|-------|----------|-------|
| TASK-003 | Upstream Feedback + Version Tracking + Session Lifecycle | P1 | Plan complete, awaiting build |
| — | Dashboard completion (D1-4 through D1-7) | P1 | On cursor/concept-1-dashboard-test |
| — | Fix dashboard API key transmission | P0 | Settings UI collects but doesn't send keys |
| — | Phase 8: Templates & Mono-repo | P3 | From TASK-002 roadmap |
| — | Audit starter kit against Even-Openclaw lessons | P2 | Compare template vs real usage |
| — | Expand README with contributor guide | P3 | How others can add past-configs or propose setup changes |
| — | Evaluate need for two-agent starter variant | P3 | Some projects may not use Lovable |

## Recently Completed

| ID | Title | Date | Notes |
|----|-------|------|-------|
| — | Comprehensive review of Cursor's work | 2026-02-13 | Claude Code reviewed all 3 branches; 5 governance decisions applied |
| — | Ecosystem hub vision + D2 task briefs | 2026-02-12 | IDEA-020, TASK-D2-1–D2-5, WebSocket/mockData fixes |
| — | F1: Learn from Past Configurations | 2026-02-11 | Lesson extraction + comparison scripts |
| — | Moonshot Phases 1–7 + Integration | 2026-02-10–11 | 152 tests pass; starter kit, session mgr, subagents, API client, Wire, evaluation |
| — | TASK-002 idea enrichment + 3-folder pipeline | 2026-02-10 | 25 ideas; backlog/active/done |
| — | Phases 1–2, TASK-001/002 | 2026-02-10 | Foundation complete |

## Health

- **Technical**: 152 tests passing across 7 phases. Dashboard backend + external frontend on `cursor/concept-1-dashboard-test`.
- **Governance**: All 5 review decisions resolved (see Review Decisions). Logged in boundaries.md.
- **Starter kit**: Expanded (16 scripts, 12 docs, 3 workflows). Markdown + stdlib scripts.
- **Ideas**: 3-folder pipeline (backlog/active/done). 26 ideas including unified ecosystem hub (Dashboard Phase 2).
- **Dashboard**: Backend + external frontend; WebSocket + real data working. D2 task briefs for multi-source hub. P0: API keys not sent from Settings.
- **TASK-003**: 0% implemented. Plan ready, 18 files to create.
- **Branches**: main, pre-mortal, cursor/concept-1-dashboard-test (this branch).
