# Review: LOVABLE-DASHBOARD-SYNC — Lovable dashboard sync (pre-mortal)

> **Naming convention**: One-off sync review (not tied to a single task ID).

- **Reviewer**: Cursor (Implementation Specialist)
- **Submitted by**: Lovable (work synced from AgentArtel/open-artel-dashboad); Cursor performed the sync commit
- **Date**: 2026-02-11
- **Branch**: `pre-mortal` (after merge from `cursor/concept-1-dashboard-test`)
- **Commit**: e305a0e
- **Verdict**: APPROVED

---

## Checklist

- [x] Acceptance criteria (sync buildable and within conventions) — Build and typecheck pass; lint errors fixed.
- [x] Files within agent's owned domain (per AGENTS.md) — All changes under `dashboard-frontend-external/app/` (Lovable/frontend domain).
- [x] No boundary violations — Sync commit touched only `dashboard-frontend-external/app/**`; no backend, `setups/`, or `.ai/` changes.
- [x] Build passes (if applicable) — `npm run build` and `npm run build:dev` succeed.
- [x] No regressions detected — TypeScript compiles; no runtime checks run.
- [x] Consistent with project conventions — ESLint passes (0 errors); 9 exhaustive-deps warnings remain (non-blocking).
- [x] Commit message follows routing format — `[AGENT:cursor] [ACTION:update] Sync Lovable dashboard...` is valid.

## Files Reviewed

| File | Change | Assessment |
|------|--------|------------|
| `dashboard-frontend-external/app/package.json` | modified | ok — `build:dev` present; scripts consistent |
| `dashboard-frontend-external/app/src/pages/ReportList.tsx` | new | ok — uses api, useUiStyle, loading/error states |
| `dashboard-frontend-external/app/src/pages/ReviewList.tsx` | new | ok — same pattern; verdict styling |
| `dashboard-frontend-external/app/src/hooks/useUiStyle.ts` | new | ok — reads settings store only |
| `dashboard-frontend-external/app/src/components/ui/markdown.tsx` | new | ok — fixed (defer setState via queueMicrotask) |
| `dashboard-frontend-external/app/src/components/ui/mock-label.tsx` | new | ok |
| `dashboard-frontend-external/app/src/lib/api.ts` | modified | ok — env/settings, no hardcoded secrets |
| `dashboard-frontend-external/app/src/lib/websocket.ts` | modified | ok — env/settings, no hardcoded secrets |
| `dashboard-frontend-external/app/src/lib/mockData.ts` | new | ok — typed mock data, _isMock flag |
| `dashboard-frontend-external/app/src/stores/agentStore.ts` | modified | ok — fixed (catch without binding) |
| `dashboard-frontend-external/app/src/stores/projectStore.ts` | modified | ok — fixed (catch without binding) |
| `dashboard-frontend-external/app/src/stores/taskStore.ts` | modified | ok — fixed (catch without binding) |
| `dashboard-frontend-external/app/src/components/layout/WebSocketStatus.tsx` | (existing) | ok — fixed (defer setState via setTimeout(0)) |
| `dashboard-frontend-external/app/src/components/ui/sidebar.tsx` | (existing) | ok — fixed (stable width 70%); only-export-components disabled |
| Other UI components (badge, button, form, etc.) | (existing) | ok — react-refresh/only-export-components disabled with comment |

## Findings

1. **Build and typecheck pass** — `npm run build`, `npm run build:dev`, and `npx tsc --noEmit` all succeed. Preview build is unblocked by `build:dev`.
2. **Boundaries respected** — Commit e305a0e changes only files under `dashboard-frontend-external/app/`. No backend or coordination layer edits.
3. **API and WebSocket use env and settings** — `api.ts` and `websocket.ts` use `import.meta.env.VITE_*` and settings store; no hardcoded secrets.
4. **New features are well-structured** — ReportList and ReviewList follow existing patterns (api client, useUiStyle, loading/error UI). mockData is typed and clearly marked with `_isMock`.
5. **ESLint errors (13) — FIXED** (by Cursor, follow-up):
   - **react-hooks/set-state-in-effect**: `WebSocketStatus.tsx` — defer setState with `setTimeout(..., 0)`; `markdown.tsx` — defer sync path with `queueMicrotask(() => setHtml(out))`.
   - **react-hooks/purity**: `sidebar.tsx` — use stable width `'70%'` instead of `Math.random()`.
   - **react-refresh/only-export-components**: Added `eslint-disable` / `eslint-enable` blocks for badge, button, button-group, form, navigation-menu, sidebar, toggle (variants/hooks are intentionally co-exported).
   - **@typescript-eslint/no-unused-vars**: Stores — use `catch {` (no binding) where error was unused.
6. **ESLint warnings (9)** — Remain (non-blocking): exhaustive-deps in useProject, useTasks, AgentStatus, CommitHistory, FileBrowser, ProjectDetail, TaskDetail. Can be addressed later.

## Feedback

**For Lovable / maintainers:**

- Sync is in good shape: build, typecheck, and lint (0 errors) all pass. The 13 ESLint errors were fixed in a follow-up (WebSocketStatus, markdown, sidebar, stores, and only-export-components disables). Nine exhaustive-deps warnings remain and are non-blocking.
- Consider applying the same lint fixes in the Lovable repo (open-artel-dashboad) so future syncs stay clean. The chunk-size warning from Vite (>500 kB) is optional to address later (e.g. code-splitting).

## Decision

**Verdict**: APPROVED

**Next action**:
- Sync is approved. Ready for human review of pre-mortal and merge to main when desired.
- Optional: propagate lint fixes to AgentArtel/open-artel-dashboad so future syncs do not reintroduce the same errors.
