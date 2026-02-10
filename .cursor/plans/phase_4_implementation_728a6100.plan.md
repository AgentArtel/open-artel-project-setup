---
name: Phase 4 Implementation
overview: "Implement Phase 4 Context Optimization: a context monitoring script with 5 commands, metrics storage, workflow integration into post-commit/session-manager/evaluation, documentation, and 21 tests."
todos:
  - id: p4-metrics-dir
    content: Create .ai/metrics/ directory with thresholds.json and context-history.json
    status: completed
  - id: p4-monitor
    content: "Create scripts/kimi-context-monitor.sh (5 commands: check, auto-compact, report, history, thresholds)"
    status: completed
    dependencies:
      - p4-metrics-dir
  - id: p4-integration
    content: Integrate into post-commit, kimi-session-manager.sh, and generate-evaluation.sh
    status: completed
    dependencies:
      - p4-monitor
  - id: p4-docs
    content: Create docs/kimi-context-optimization.md
    status: completed
    dependencies:
      - p4-monitor
  - id: p4-tests
    content: "Create scripts/test-phase-4.sh (21 tests: 8 structural + 4 live + 6 edge + 3 integration)"
    status: completed
    dependencies:
      - p4-integration
      - p4-docs
  - id: p4-run-tests
    content: Run all 21 tests, verify pass
    status: completed
    dependencies:
      - p4-tests
  - id: p4-gate
    content: Update status.md, create phase-4-completion.md
    status: completed
    dependencies:
      - p4-run-tests
---

# Phase 4: Context Optimization — Implementation Plan

## Critical Discovery: Real Token Counts Available

The existing plan assumed "no direct token count API" and proposed using file sizes as a proxy. However, research into `~/.kimi/sessions/<hash>/<uuid>/context.jsonl` reveals that **`_usage` entries with actual `token_count` values are stored on disk**. Example from the largest session (67KB file):

```javascript
{"role": "_usage", "token_count": 24804}
```

This means Phase 4 can use **real token counts** as the primary metric alongside file size and session age. The `max_context_size` from `~/.kimi/config.toml` is `262144` (256K tokens), giving us a hard ceiling to measure against.**Updated threshold strategy**:

- Primary: `token_count` from `_usage` entries in `context.jsonl` (real, not estimated)
- Secondary: `context.jsonl` file size in bytes (correlates with tokens)
- Tertiary: Session age in hours, file operations count

---

## Files to Create

| File | Purpose ||------|---------|| [`.ai/metrics/.gitkeep`](.ai/metrics/.gitkeep) | Track directory in Git || [`.ai/metrics/thresholds.json`](.ai/metrics/thresholds.json) | Configurable thresholds (token count + file size + age) || [`.ai/metrics/context-history.json`](.ai/metrics/context-history.json) | Append-only measurement log || [`scripts/kimi-context-monitor.sh`](scripts/kimi-context-monitor.sh) | Main monitor script (5 commands) || [`docs/kimi-context-optimization.md`](docs/kimi-context-optimization.md) | User-facing documentation || [`scripts/test-phase-4.sh`](scripts/test-phase-4.sh) | 21-test suite || [`.ai/reports/phase-4-completion.md`](.ai/reports/phase-4-completion.md) | Completion report |

## Files to Modify

| File | Change ||------|--------|| [`scripts/post-commit`](scripts/post-commit) | Add background `check` after `submit`, `auto-compact` after `approve`/`merge` || [`scripts/kimi-session-manager.sh`](scripts/kimi-session-manager.sh) | Enhance `archive --compact` to check thresholds first; add `initial_context_size_bytes` to `create`; add health status to `current` || [`scripts/generate-evaluation.sh`](scripts/generate-evaluation.sh) | Add "Context Health" line to `generate_metrics_summary()` and context metrics to Kimi prompt || [`.ai/status.md`](.ai/status.md) | Mark Phase 4 DONE |---

## Implementation Tasks

### Task 4.1: Create `.ai/metrics/` directory and files

Create directory with `.gitkeep`, `thresholds.json`, and empty `context-history.json`:**`thresholds.json`** — updated to include token-based thresholds:

```json
{
  "warn_token_count": 50000,
  "compact_token_count": 100000,
  "max_token_count": 200000,
  "warn_context_size_bytes": 50000,
  "compact_context_size_bytes": 100000,
  "max_context_size_bytes": 200000,
  "warn_session_age_hours": 4,
  "compact_session_age_hours": 8,
  "warn_file_operations": 50,
  "compact_file_operations": 100
}
```

**`context-history.json`** — initialized as `[]` (empty JSON array).

### Task 4.2: Create `scripts/kimi-context-monitor.sh`

5 commands as specified in the plan. Key implementation details:

- **`check`**: Resolves session via `kimi-session-manager.sh current`, reads `context.jsonl` from `~/.kimi/sessions/<workspace-hash>/<session-id>/`, extracts latest `token_count` from `_usage` entries, calculates file size and session age, compares against thresholds, appends measurement to history.
- **Workspace hash**: Derived from `kimi.json` or computed via `echo -n "<project-path>" | md5`
- **Session UUID resolution**: The `kimi_session_id` in `.ai/sessions/active/*.json` is the session name passed to `--session`, but Kimi stores sessions as UUIDs. We'll use file size of `context.jsonl` files and match by `last_session_id` from `kimi.json`, or scan all session dirs for the most recently modified one.
- **JSON fallback chain**: jq -> python3 -> raw shell (same as Phase 2)
- **No `sed`** for text processing (Phase 1 lesson)

### Task 4.3: Integrate into existing workflow

**`post-commit`** (lines ~153 and ~248):

- After `submit` case: add background `kimi-context-monitor.sh check` call
- After `approve`/`merge` in sprint completion: add background `kimi-context-monitor.sh auto-compact` call

**`kimi-session-manager.sh`**:

- `create`: Add `initial_context_size_bytes` field to session metadata JSON
- `archive --compact`: Call `kimi-context-monitor.sh check` first; only compact if CRITICAL
- `current`: Show context health status (call `check` and display)

**`generate-evaluation.sh`**:

- `generate_metrics_summary()`: Add "Context Health" row showing latest token count and status
- `generate_kimi_report()`: Include context metrics in the Kimi prompt

### Task 4.4: Create documentation

`docs/kimi-context-optimization.md` with 7 sections as specified in the plan (context basics, monitoring, auto-compact, manual compaction, best practices, threshold tuning, troubleshooting).

### Task 4.5: Create test suite

**21 tests** (8 structural + 4 live API + 6 edge + 3 integration):**Structural (8)**: Directory exists, thresholds valid JSON, monitor executable, monitor has help, history file valid, post-commit has context check, session manager enhanced, docs exist.**Live API (4)**: Context check runs with real session, check reads real token count, history is appended after check, auto-compact respects thresholds.**Edge (6)**: No active session, corrupt thresholds, corrupt history, concurrent checks, very old session, missing jq fallback.**Integration (3)**: Phase 1 tests pass, Phase 2 tests pass, Phase 3 tests pass.

### Task 4.6: Gate

Update `.ai/status.md`, create `.ai/reports/phase-4-completion.md`, verify all block removal criteria.---

## Key Design Decisions