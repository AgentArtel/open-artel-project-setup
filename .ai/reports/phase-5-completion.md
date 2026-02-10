# Phase 5: Moonshot API Integration — Completion Report

**Date**: 2026-02-10
**Status**: COMPLETE
**Tests**: 25/25 (25 passed, 0 skipped, 0 failed)

## Summary

Phase 5 adds direct Moonshot REST API integration to the Open Artel workflow. This is the first phase to call `https://api.moonshot.ai/v1` endpoints directly (all previous phases used the Kimi CLI exclusively).

## What Was Implemented

### New Files (7)

| File | Purpose |
|------|---------|
| `scripts/setup-project-api-key.sh` | Manage project-specific API keys (create, validate, remove, status) |
| `scripts/moonshot-api-client.py` | Python stdlib-only Files API client (upload, list, get, delete, content) |
| `scripts/upload-project-files.py` | Batch upload/sync project files to Moonshot (--initial, --sync, --list, --clean) |
| `.ai/metrics/uploaded-files.json` | Tracks file path to Moonshot file ID mapping |
| `docs/moonshot-api-integration.md` | User-facing documentation (7 sections) |
| `scripts/test-phase-5.sh` | 25-test suite |
| `.ai/reports/phase-5-completion.md` | This file |

### Modified Files (6)

| File | Change |
|------|--------|
| `.gitignore` | Added `.env.project` (deduplicated existing entries) |
| `scripts/post-commit` | Added `.env.project` loading before `.env` |
| `scripts/generate-evaluation.sh` | Added `.env.project` loading, `--stream` flag |
| `scripts/kimi-session-manager.sh` | Added `.env.project` and `.env` loading |
| `scripts/kimi-context-monitor.sh` | Added `.env.project` and `.env` loading |
| `.ai/status.md` | Marked Phase 5 DONE |

## Key Design Decision

**Python stdlib only** — The API client uses `urllib.request` and `json` (no `pip install openai` or `pip install requests`). This matches the `wire-daemon.py` precedent and keeps the project zero-dependency.

## API Key Priority

All scripts now resolve API keys in this order:
1. `.env.project` (project-specific, highest priority)
2. `.env` (global fallback)
3. `KIMI_API_KEY` environment variable (lowest priority)

## Test Results

### First Run (4 failed, 2 skipped)

The initial run had 4 failures and 2 skips because the API client used the wrong base URL (`api.moonshot.cn` instead of `api.moonshot.ai`). The Kimi CLI key is valid for `api.moonshot.ai` (global endpoint), not `api.moonshot.cn` (China regional endpoint).

### After Fix (25/25 pass)

```
STRUCTURAL TESTS (10): 10 PASS
LIVE API TESTS (6):    6 PASS (upload, list, get, delete all verified)
EDGE TESTS (6):        6 PASS
INTEGRATION TESTS (3): 3 PASS (Phase 1-4 regression tests all pass)
─────────────────────
TOTAL: 25 PASS, 0 FAIL, 0 SKIP
```

## Critical Bug Found and Fixed

### Wrong API Endpoint: `api.moonshot.cn` vs `api.moonshot.ai`

**Root cause**: The TASK-002 research document listed the China regional endpoint (`api.moonshot.cn`), but the actual API key from Kimi CLI device auth authenticates against the global endpoint (`api.moonshot.ai`).

**How discovered**: Live API tests L.1-L.3 returned HTTP 401 (Invalid Authentication). Investigation of `~/.kimi/config.toml` revealed Kimi CLI uses `base_url = "https://api.moonshot.ai/v1"`.

**Fix**: Changed `BASE_URL` in 3 files from `api.moonshot.cn` to `api.moonshot.ai`.

**Lesson for future phases**: Always verify endpoint URLs against the actual Kimi CLI configuration (`~/.kimi/config.toml`), not just documentation. The Kimi CLI is the source of truth for API configuration.

## Block Removal Criteria

- [x] All 10 structural tests pass
- [x] All 6 live API tests pass (real Moonshot API calls: upload, list, get, delete)
- [x] All 6 edge tests pass
- [x] All 3 integration tests pass (no regressions)
- [x] Success metrics met (6/6)
- [x] Documentation complete
- [x] At least 1 file uploaded to Moonshot (verified in L.2)

## Lessons Learned

| Lesson | Detail |
|--------|--------|
| **Verify endpoints against CLI config** | `~/.kimi/config.toml` is the source of truth. Research docs may list regional endpoints that don't match the actual key. |
| **`.ai` vs `.cn` matters** | Moonshot has two API domains: `api.moonshot.ai` (global, used by Kimi CLI) and `api.moonshot.cn` (China regional, requires separate key). |
| **stdlib is sufficient** | `urllib.request` handles multipart uploads, JSON APIs, and error handling without external packages. |
| **Live tests catch real bugs** | The endpoint bug was invisible to structural tests — only real API calls exposed it. |
| **Test → fix → retest cycle works** | First run identified the issue, fix was targeted (3 files, 1 constant), retest confirmed 25/25. |

## Cumulative Test Count

| Phase | Tests | Status |
|-------|-------|--------|
| Phase 1: Tool Expansion | 16 | PASS |
| Phase 2: Session Management | 10 | PASS |
| Phase 3: Dynamic Subagent Patterns | 27 | PASS |
| Phase 4: Context Optimization | 21 | PASS |
| Phase 5: Moonshot API Integration | 25 | PASS |
| **Total** | **99** | **ALL PASS** |
