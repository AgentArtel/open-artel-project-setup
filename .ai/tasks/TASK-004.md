# TASK-004: Feature Manifest + Core Definition

- **Status**: IN_PROGRESS
- **Assigned**: Claude Code
- **Priority**: P2
- **Type**: Create
- **Origin**: Cursor handoff (modular starter proposal, 2026-02-16)

## Context

The starter kit has grown from ~15 files to 90+ files across Phases 1-7. New users see one big copy with no way to understand what's essential vs. optional, or how to start minimal and add features incrementally.

## Deliverables

1. **`setups/multi-agent-starter/docs/feature-modules.md`** — Feature manifest listing every optional feature with files, dependencies, enable/disable instructions
2. **`setups/multi-agent-starter/docs/CORE.md`** — Minimal core definition (~8 files) with copy instructions
3. **README.md edit** — Add "Feature Modules" subsection linking to the two docs

## Acceptance Criteria

- [ ] Every file in the starter kit is accounted for (either in core or in a feature module)
- [ ] Feature modules show dependency chain (e.g., Kimi Overseer is prereq for Git hooks)
- [ ] Core definition produces a working minimal setup when copied alone
- [ ] README links to both docs
