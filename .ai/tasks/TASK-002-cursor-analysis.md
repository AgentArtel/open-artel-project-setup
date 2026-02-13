# Cursor's Architecture Analysis — Reference Document

Received from Cursor during TASK-002 research phase. Contains a full architecture document and 30-feature extraction with implementation tracker.

This document is preserved as a reference. Its contents have been merged into the unified idea system (IDEA-001 through IDEA-025) via the cross-reference mapping below.

## Cross-Reference: Cursor Features → Unified Ideas

| Cursor Feature | Cursor # | Mapped To | Disposition |
|---------------|----------|-----------|-------------|
| Branch-per-agent Git workflow | F1 | IDEA-001 | Direct match |
| Commit-message routing protocol | F2 | IDEA-002 | Direct match |
| Auto-triggered review on commit | F3 | **IDEA-021** (new) | New idea created |
| Agent response reports in commits | F4 | IDEA-002 | Folded in (structured reports section) |
| Fix logs and next-steps in commits | F5 | IDEA-002 | Folded in (fix logs section) |
| Sprint-based task pipeline | F6 | **IDEA-019** (new) | New idea created |
| `.ai/` folder as multi-agent OS | F7 | **IDEA-020** (new) | New idea created |
| Kimi Code as persistent overseer | F8 | IDEA-005 | Direct match |
| Agent-to-agent chat folders | F9 | IDEA-004 | Direct match |
| Agents give reports | F10 | IDEA-004 | Folded in (communication protocols) |
| Agents receive instructions | F11 | IDEA-004 | Folded in (communication protocols) |
| Agents submit work for review | F12 | IDEA-004 | Folded in (communication protocols) |
| Claude Code CLI integration | F13 | **IDEA-022** (new) | Combined with F14-16 |
| Kimi Code CLI integration | F14 | **IDEA-022** (new) | Combined with F13, F15-16 |
| Cursor IDE integration | F15 | **IDEA-022** (new) | Combined with F13-14, F16 |
| Lovable integration | F16 | **IDEA-022** (new) | Combined with F13-15 |
| Agents opening terminal sessions | F17 | IDEA-006 | Direct match |
| Kimi Code API inside Claude Code | F18 | **IDEA-023** (new) | New idea created |
| Conversational Git operations | F19 | IDEA-016 | Direct match |
| Human task offloading | F20 | IDEA-012 | Folded in (delegation boundaries) |
| Project configuration evaluation | F21 | IDEA-013 | Folded in (config eval track) |
| Agent performance evaluation | F22 | IDEA-013 | Folded in (agent performance track) |
| Project templates | F23 | IDEA-014 | Direct match |
| Monorepo tier | F24 | IDEA-015 | Direct match |
| Auto-trigger passing between agents | F25 | IDEA-003 | Direct match |
| Self-improving system | F26 | **IDEA-025** (new) | New idea created |
| K2/K2.5 agentic features | F27 | **IDEA-024** (new) | New idea created |
| Kimi subagent architecture | F28 | IDEA-007 | Direct match |
| Flow Skills for pipelines | F29 | IDEA-009 | Direct match |
| Wire protocol for programmatic control | F30 | IDEA-011 | Direct match |

## Summary

- **30 Cursor features** mapped to **25 unified ideas**
- **14 direct matches** — Cursor feature maps 1:1 to an existing idea
- **7 new ideas created** (IDEA-019 through IDEA-025)
- **9 features folded** into existing ideas as enrichment (F4, F5, F10, F11, F12, F13-16, F20, F21, F22)

## Cursor's Implementation Timeline vs Our Roadmap

| Cursor Tier | Cursor Timeline | Our Phase | Our Ideas |
|-------------|-----------------|-----------|-----------|
| Tier 1 (Foundation) | Week 1 | Phase 1 | 001, 002, 004, 016, 020 |
| Tier 2 (Single Pipeline) | Week 2 | Phase 2-3 | 008, 005, 021, 009, 019 |
| Tier 3 (Multi-Agent) | Week 3 | Phase 3-4 | 022, 003, 019 |
| Tier 4 (Automation) | Week 4 | Phase 4-5 | 007, 009, 012, 006 |
| Tier 5 (Metrics) | Week 5+ | Phase 5-6 | 013, 014, 024, 011 |
| Tier 6 (Advanced) | Future | Phase 7-8 | 015, 023, 025, 022 |

## Original Document

Cursor's full architecture document and 30-feature breakdown were provided inline during conversation. Key sections:

1. **Architecture Document** — 4-layer system (`.ai/` folder, branch-per-agent, commit routing, overseer agent)
2. **Feature Index** — 30 features across 7 categories with complexity and dependency ratings
3. **Detailed Feature Breakdown** — implementation paths, research findings, and integration specifics
4. **Implementation Order** — 6-tier weekly rollout plan
5. **Key Technical Decisions** — rationale for Git-based communication, Kimi overseer, branch model
6. **Research Sources Index** — 12 sources mapped to relevant features
