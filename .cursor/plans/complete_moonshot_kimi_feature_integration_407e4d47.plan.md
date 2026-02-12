---
name: Complete Moonshot/Kimi Feature Integration
overview: Comprehensive 6-phase plan to leverage all available Moonshot/Kimi features with mandatory testing gates, success metrics, and edge testing requirements before proceeding to next phase.
todos:
  - id: phase1-tools
    content: "Phase 1: Add SearchWeb, FetchURL, SendDMail tools to kimi-overseer.yaml and update documentation"
    status: completed
  - id: phase1-tests
    content: "Phase 1: Create and run mandatory tests (14 structural + 4 live API + 7 edge = 25 tests)"
    status: completed
    dependencies:
      - phase1-tools
  - id: phase1-gate
    content: "Phase 1: Verify all success metrics, pass all tests, unlock Phase 2"
    status: completed
    dependencies:
      - phase1-tests
  - id: phase2-sessions
    content: "Phase 2: Create kimi-session-manager.sh with list/create/resume/archive/delete/current commands"
    status: completed
    dependencies:
      - phase1-gate
  - id: phase2-tests
    content: "Phase 2: Create and run mandatory tests (5 mandatory + 5 edge = 10 tests)"
    status: completed
    dependencies:
      - phase2-sessions
  - id: phase2-gate
    content: "Phase 2: Verify all success metrics (4/4), pass all tests (10/10), unlock Phase 3"
    status: completed
    dependencies:
      - phase2-tests
  - id: phase3-subagents
    content: "Phase 3: Create 4 Markdown subagent templates, 4 pattern docs, helper script, update overseer prompt"
    status: completed
    dependencies:
      - phase2-gate
  - id: phase3-tests
    content: "Phase 3: Create and run tests (10 structural + 6 live API + 8 edge + 3 integration = 27 tests)"
    status: completed
    dependencies:
      - phase3-subagents
  - id: phase3-gate
    content: "Phase 3: Verify all success metrics (5/5), pass all 27 tests, unlock Phase 4"
    status: completed
    dependencies:
      - phase3-tests
  - id: phase4-context
    content: "Phase 4: Create context monitor, auto-compact triggers, metrics tracking, optimization guide"
    status: completed
    dependencies:
      - phase3-gate
  - id: phase4-tests
    content: "Phase 4: Create and run tests (8 structural + 4 live API + 6 edge + 3 integration = 21 tests)"
    status: completed
    dependencies:
      - phase4-context
  - id: phase4-gate
    content: "Phase 4: Verify all success metrics (5/5), pass all 21 tests, unlock Phase 5"
    status: completed
    dependencies:
      - phase4-tests
  - id: phase5-api
    content: "Phase 5: Implement Moonshot Files API, project API keys, cached tokens, streaming"
    status: completed
    dependencies:
      - phase4-gate
  - id: phase5-tests
    content: "Phase 5: Create and run mandatory tests (6 tests) and edge tests (6 tests)"
    status: completed
    dependencies:
      - phase5-api
  - id: phase5-gate
    content: "Phase 5: Verify all success metrics, pass all tests, unlock Phase 6"
    status: completed
    dependencies:
      - phase5-tests
  - id: phase6-advanced
    content: "Phase 6: Enable Agent Swarm, ACP mode, Wire enhancements, multi-modal"
    status: completed
    dependencies:
      - phase5-gate
  - id: phase6-tests
    content: "Phase 6: Create and run mandatory tests (4 tests) and edge tests (4 tests)"
    status: completed
    dependencies:
      - phase6-advanced
  - id: phase6-gate
    content: "Phase 6: Verify all success metrics, pass all tests, final integration"
    status: completed
    dependencies:
      - phase6-tests
  - id: final-integration
    content: Run comprehensive test suite, documentation review, performance benchmarks
    status: completed
    dependencies:
      - phase6-gate
---

# Complete Moonshot/Kimi Feature Integration Plan

## Overview

This plan implements all available Moonshot/Kimi features across 6 phases. Each phase has mandatory testing gates that must pass before proceeding. Phases are blocked until all success metrics are met and edge tests pass.

## Phase Gates

Each phase requires:

1. **Success Metrics**: All must be met
2. **Mandatory Tests**: All must pass
3. **Edge Tests**: All must pass
4. **Documentation**: Updated and reviewed
5. **Integration Tests**: Verify no regressions

Only after all gates pass can the next phase begin.---

## Phase 1: Tool Expansion & Enhancement

### Objectives

- Add missing tools to Kimi Overseer
- Enable Moonshot built-in tools
- Document tool usage patterns

### Implementation Tasks

1. **Update `kimi-overseer.yaml`**:

- Add `SearchWeb` tool
- Add `FetchURL` tool
- Add `SendDMail` tool
- Document Moonshot built-in tools (`$web_search`, `$code_runner`)

2. **Update `overseer.md` prompt**:

- Document when to use each tool
- Add examples for `SearchWeb`, `FetchURL`, `SendDMail`
- Document Moonshot API tool usage

3. **Create tool usage examples**:

- `.ai/examples/tool-usage-searchweb.md`
- `.ai/examples/tool-usage-fetchurl.md`
- `.ai/examples/tool-usage-senddmail.md`

### Block Removal Criteria

- [x] All 4 mandatory tests pass
- [x] All 4 edge tests pass
- [x] Success metrics met (4/4)
- [x] Documentation updated
- [x] No regressions in existing tests

**Gate**: Phase 1 Complete → Phase 2 Unlocked---

## Phase 1: Completion Report & Lessons Learned

**Status**: ✅ **COMPLETE** (2026-02-10)**Final Test Results**: 25/25 tests passed (14 structural + 4 live API + 7 edge)**Gate Status**: **UNLOCKED** — Phase 2 can begin

### Actual Implementation Summary

**Files Modified:**

- `.agents/kimi-overseer.yaml` — Added 3 tools with correct module paths, organized with category comments
- `.agents/reviewer-sub.yaml` — Removed circular `extend`, made standalone with own tools list
- `.agents/researcher-sub.yaml` — Removed circular `extend`, made standalone with own tools list
- `.agents/prompts/overseer.md` — Added "Available Tools" section with usage examples
- `scripts/test-phase-1.sh` — Rewrote with structural, live API, and edge test categories

**Files Created:**

- `.ai/examples/tool-usage-searchweb.md`
- `.ai/examples/tool-usage-fetchurl.md`
- `.ai/examples/tool-usage-senddmail.md`
- `.ai/reports/phase-1-completion.md`

### Critical Bugs Found & Fixed

#### Bug 1: Wrong SendDMail Module Path

- **Problem**: Used `kimi_cli.tools.multiagent:SendDMail` — this module doesn't exist
- **Actual Module**: `kimi_cli.tools.dmail:SendDMail`
- **Impact**: Kimi CLI rejected entire agent file with "Invalid tools" error
- **Discovery Method**: Python introspection of actual Kimi CLI package

#### Bug 2: Circular Extend Recursion

- **Problem**: `reviewer-sub.yaml` and `researcher-sub.yaml` used `extend: ./kimi-overseer.yaml`, but `kimi-overseer.yaml` references them as subagents → infinite recursion
- **Impact**: Kimi CLI crashed with `RecursionError: maximum recursion depth exceeded`
- **Discovery Method**: Real API call test (L.4) revealed the crash

#### Bug 3: Tests Were Not Making Real API Calls

- **Problem**: Original tests only used `grep` to check file contents, never called Kimi API
- **Impact**: False confidence — all tests "passed" but agent file was actually broken
- **Fix**: Rewrote test suite with 3 categories: Structural (14), Live API (4), Edge (7)

### Lessons Learned for Future Phases

1. **Always Validate Tool Module Paths Against Actual Python Imports**
2. **Always Test with Real API Calls, Not Just File Checks**
3. **Watch for Circular Dependencies in Configuration Files**
4. **macOS `sed` Behaves Differently Than GNU `sed`** — use `awk` instead
5. **`timeout` Command Not Available on macOS** — use alternatives
6. **Test Categories Should Be Explicit** — Structural, Live API, Edge, Integration

---

## Phase 2: Session Management

### Objectives

- Implement session lifecycle management
- Enable named sessions per sprint
- Auto-compact and archive sessions

### Implementation Tasks

1. **Create `scripts/kimi-session-manager.sh`**:

- `list` - List all sessions
- `create <name>` - Create named session
- `resume <name>` - Resume named session
- `archive <name>` - Archive session with compaction
- `delete <name>` - Delete session
- `current` - Show current session

2. **Create session storage**:

- `.ai/sessions/` directory
- `.ai/sessions/active/` - Active session metadata
- `.ai/sessions/archived/` - Archived session metadata

3. **Integrate into sprint workflow**:

- Auto-create session on sprint start
- Auto-archive on sprint completion
- Update `.ai/status.md` with session info

4. **Create session documentation**:

- `docs/kimi-sessions.md` - Session management guide

### Block Removal Criteria

- [x] All 5 mandatory tests pass
- [x] All 5 edge tests pass
- [x] Success metrics met (4/4)
- [x] Documentation complete
- [x] No regressions

**Gate**: Phase 2 Complete → Phase 3 Unlocked---

## Phase 2: Completion Report & Lessons Learned

**Status**: ✅ **COMPLETE** (2026-02-10)**Final Test Results**: 10/10 tests passed (5 mandatory + 5 edge)**Gate Status**: **UNLOCKED** — Phase 3 can begin

### Actual Implementation Summary

**Files Created:**

- `scripts/kimi-session-manager.sh` — 6 commands: create, list, resume, archive, delete, current
- `.ai/sessions/active/.gitkeep` — Active session metadata storage
- `.ai/sessions/archived/.gitkeep` — Archived session metadata storage
- `scripts/test-phase-2.sh` — 10-test suite (5 mandatory + 5 edge)
- `docs/kimi-sessions.md` — Session management guide (259 lines)
- `.ai/reports/phase-2-completion.md` — Completion report

**Files Modified:**

- `scripts/post-commit` — Added `check_sprint_start()` (auto-create session on `[ACTION:delegate]` with `SPRINT-*` task) and session archival in `check_sprint_completion()`
- `scripts/generate-evaluation.sh` — Added session name to metrics summary and Kimi report prompt
- `.ai/status.md` — Added "Session Management" and "Current Session" to Health; marked Phase 2 DONE

### Test Results Breakdown

| Category | Tests | What They Actually Do ||----------|-------|----------------------|| **Mandatory** | 5 | Session create (JSON metadata + list), resume (kimi_session_id validation), archive (move + archived_at field), list (multiple sessions + --all flag), sprint integration (post-commit hooks + evaluation + status.md) || **Edge** | 5 | Concurrent sessions (3 simultaneous creates), invalid names (nonexistent resume + sanitization), corruption (corrupt JSON handled), large context (5KB+ archived), deletion (active deleted + no orphans) |**Regression Tests**: Phase 1 (25/25), agent-file integration (20/20), edge cases (17/17)

### Key Design Decisions

1. **JSON metadata over plain text** — Enables programmatic access via jq/python3 with raw shell fallback
2. **Session name = Kimi session ID** — Simple 1:1 mapping, no separate ID tracking needed
3. **Idempotent create** — Creating an existing session updates it rather than failing
4. **Name sanitization** — Prevents filesystem issues from special characters
5. **Graceful degradation** — Works without jq (falls back to python3, then raw shell), works without Kimi CLI (for metadata-only operations)

### Lessons Learned for Future Phases

1. **JSON Parsing Needs Fallback Chains**: Built 3-tier fallback (jq → python3 → raw shell). Applies to Phase 4 metrics JSON, Phase 5 API responses.
2. **Session Metadata Is Cheap, Context Is Expensive**: Lightweight JSON metadata per session is trivial; Kimi's in-memory context is the bottleneck. Applies to Phase 4 context monitoring.
3. **Sprint Integration Requires Careful Hook Ordering**: Auto-create/archive hooks must not interfere with each other or block commit flow. Applies to Phase 4 auto-compact triggers.

### Success Metrics — Actual Results

| Metric | Target | Actual | Status ||--------|--------|--------|--------|| Session manager script | All commands work | 6 commands tested and working | ✅ PASS || Session storage | Directory structure exists | `.ai/sessions/active/` and `archived/` created | ✅ PASS || Sprint integration | Auto-create/archive works | post-commit hooks wired, evaluation integrated | ✅ PASS || Documentation | Guide created | `docs/kimi-sessions.md` (259 lines) | ✅ PASS |---

## Phase 3: Dynamic Subagent Patterns

> **Detailed plan**: See `phase_3_dynamic_subagent_patterns_dd8050e4.plan.md`

### Key Discovery

**CreateSubagent is a runtime tool call, not a YAML file.** It takes two parameters: `name` (string) and `system_prompt` (string). Templates are therefore **Markdown files** containing system prompts, not YAML agent definitions.**Critical distinction**:

- **Predefined subagents** (reviewer, researcher) = YAML files in `subagents:` section
- **Dynamic subagents** (CreateSubagent) = Runtime-created from Markdown templates, session-scoped

### Objectives

- Create 4 reusable Markdown system prompt templates for dynamic subagents
- Document CreateSubagent usage patterns with concrete examples
- Create helper script to generate Kimi prompts from templates
- Enhance overseer prompt with template references and naming conventions

### Implementation Tasks

1. **Create `.agents/subagents/` directory with 4 Markdown templates**:

- `debugger-template.md` — Debugging specialist (isolate regressions, trace bugs, root cause analysis)
- `performance-analyzer-template.md` — Performance analysis (bottlenecks, metrics, optimizations)
- `documentation-writer-template.md` — Documentation generation (clear docs from code analysis)
- `test-generator-template.md` — Test generation (test cases from code analysis and requirements)

2. **Create `.ai/patterns/` directory with 4 pattern documentation files**:

- `create-subagent-debugger.md` — When and how to use debugger template
- `create-subagent-performance.md` — When and how to use performance template
- `create-subagent-docs.md` — When and how to use documentation template
- `create-subagent-test-generator.md` — When and how to use test generator template

3. **Update `.agents/prompts/overseer.md`**:

- Expand "When to Create Dynamic Subagents" section (currently lines 199-211)
- Add "Available Subagent Templates" subsection
- Document two-step workflow: `CreateSubagent(name, system_prompt)` → `Task(subagent_name, prompt)`
- Add naming conventions and reference `.ai/patterns/`

4. **Create `scripts/create-specialized-subagent.sh`**:

- Takes template name and optional task ID
- Reads template, generates Kimi prompt with CreateSubagent + Task calls
- Uses `python3` for text processing (no `sed` — Phase 1 lesson)
- Includes `--help`, `--list`, color output

### Success Metrics

| Metric | Target | Measurement ||--------|--------|-------------|| Templates created | 4 Markdown template files | Structural tests S.1-S.3 || Patterns documented | 4 pattern files | Structural tests S.4-S.5 || Prompt updated | CreateSubagent section enhanced | Structural test S.8 || Helper script | Script works with all templates | Structural tests S.6-S.7, Live API test L.2 || No regressions | Phase 1 + Phase 2 tests pass | Integration tests I.1-I.3 |

### Test Suite: 27 Tests (4 Categories)

**Structural (10)**: Directory existence, template existence, Markdown structure validation, pattern file existence, helper script executable + help text, overseer prompt mentions templates, no circular extend in `.agents/subagents/`, template content validation ("You are a" + "Your Mission")**Live API (6)**: CreateSubagent tool available, create debugger subagent (real call), dispatch created subagent via Task, create performance subagent, multiple subagents in same session, subagent output saved to file**Edge (8)**: Invalid template name rejected, empty system_prompt, duplicate subagent name, Task with non-existent subagent, missing template file, very long system_prompt (5000+ chars), special characters in name, concurrent CreateSubagent calls**Integration (3)**: Phase 1 tests still pass (`--mandatory-only`), Phase 2 tests still pass (`--mandatory`), existing predefined subagents still work

### Block Removal Criteria

- [x] All 10 structural tests pass
- [x] All 6 live API tests pass (generating real Moonshot console usage)
- [x] All 8 edge tests pass
- [x] All 3 integration tests pass (no regressions)
- [x] Success metrics met (5/5)
- [x] Documentation complete
- [x] No circular dependencies detected

**Gate**: Phase 3 Complete → Phase 4 Unlocked---

## Phase 3: Completion Report & Lessons Learned

**Status**: ✅ **COMPLETE** (2026-02-10)

**Final Test Results**: 27/27 tests passed (10 structural + 6 live API + 8 edge + 3 integration)

**Gate Status**: **UNLOCKED** — Phase 4 can begin

### Actual Implementation Summary

**Files Created:**

- `.agents/subagents/debugger-template.md` — Debugging specialist system prompt
- `.agents/subagents/performance-analyzer-template.md` — Performance analysis system prompt
- `.agents/subagents/documentation-writer-template.md` — Documentation generation system prompt
- `.agents/subagents/test-generator-template.md` — Test generation system prompt
- `.ai/patterns/create-subagent-debugger.md` — Debugger usage pattern
- `.ai/patterns/create-subagent-docs.md` — Documentation writer usage pattern
- `.ai/patterns/create-subagent-performance.md` — Performance analyzer usage pattern
- `.ai/patterns/create-subagent-test-generator.md` — Test generator usage pattern
- `scripts/create-specialized-subagent.sh` — Helper script for subagent creation
- `scripts/test-phase-3.sh` — 27-test suite
- `.ai/reports/phase-3-completion.md` — Completion report

**Key Discovery**: CreateSubagent is a runtime tool call (name + system_prompt), not a YAML file. Templates are Markdown files containing system prompts.---

## Phase 4: Context Optimization

> **Detailed plan**: This section contains the complete implementation plan.

### Key Dependencies from Previous Phases

- **Phase 2**: Session manager already has `--compact` flag on archive command. Phase 4 extends this with automatic triggers and monitoring.
- **Phase 3**: Dynamic subagents are session-scoped and consume context. Phase 4 ensures context stays healthy during subagent-heavy sessions.
- **Phase 2 Lesson**: "Session Metadata Is Cheap, Context Is Expensive" — Phase 4 directly addresses the expensive part.

### Objectives

- Create a context monitoring script that tracks session context usage
- Implement auto-compact triggers based on configurable thresholds
- Track context metrics over time for optimization insights
- Integrate context awareness into the existing session and sprint workflow
- Document context optimization best practices

### Architecture

```javascript
┌─────────────────────────────────────────────────────────┐
│  scripts/kimi-context-monitor.sh                        │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  check   │  │  auto-compact│  │  report          │  │
│  │  -------  │  │  ----------- │  │  ------          │  │
│  │  Reads    │  │  Checks      │  │  Generates       │  │
│  │  session  │  │  threshold   │  │  context metrics │  │
│  │  metadata │  │  triggers    │  │  summary         │  │
│  │  + Kimi   │  │  /compact    │  │                  │  │
│  │  API size │  │  if needed   │  │                  │  │
│  └──────────┘  └──────────────┘  └──────────────────┘  │
│         │              │                   │            │
│         ▼              ▼                   ▼            │
│  .ai/metrics/context-history.json                       │
└─────────────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
  kimi-session-manager.sh    post-commit hook
  (archive --auto-compact)   (context check after submit)
```



### Implementation Tasks

#### Task 4.1: Create `.ai/metrics/` directory and initial structure

**Directory**: `.ai/metrics/` (does not exist yet)**Files**:

- `.ai/metrics/.gitkeep` — Ensure directory is tracked
- `.ai/metrics/context-history.json` — Append-only log of context measurements
- `.ai/metrics/thresholds.json` — Configurable thresholds for auto-compact

**`thresholds.json` format**:

```json
{
  "warn_tokens": 128000,
  "compact_tokens": 192000,
  "max_tokens": 256000,
  "warn_session_age_hours": 4,
  "compact_session_age_hours": 8,
  "max_tool_calls_before_compact": 150
}
```

**Design note**: Token counts are estimates based on session metadata and file sizes. Kimi CLI doesn't expose exact token counts, so we use proxy metrics:

- Session file count and sizes (from `.ai/sessions/active/`)
- Number of tool calls in session (from Kimi output parsing)
- Session age (elapsed time since creation)
- Number of files read/written in session

#### Task 4.2: Create `scripts/kimi-context-monitor.sh`

**Purpose**: Monitor and manage Kimi session context health.**Commands**:

```bash
./scripts/kimi-context-monitor.sh check [session-name]   # Check context health of a session
./scripts/kimi-context-monitor.sh auto-compact            # Compact if thresholds exceeded
./scripts/kimi-context-monitor.sh report                  # Generate context metrics report
./scripts/kimi-context-monitor.sh history                 # Show context measurement history
./scripts/kimi-context-monitor.sh thresholds              # Show/edit thresholds
```

**`check` command behavior**:

1. Read active session metadata from `.ai/sessions/active/`
2. Calculate proxy metrics:

- Session age (hours since `created_at`)
- Estimated context size (sum of files touched × average tokens/file)
- Number of `.ai/` files modified since session start

3. Compare against thresholds from `.ai/metrics/thresholds.json`
4. Output: `HEALTHY`, `WARNING`, or `CRITICAL` with details
5. Append measurement to `.ai/metrics/context-history.json`

**`auto-compact` command behavior**:

1. Run `check` for current active session
2. If status is `CRITICAL` (above compact threshold):

- Call `kimi-session-manager.sh archive <name> --compact`
- Create a new session with the same name
- Log the compaction event

3. If status is `WARNING`:

- Log warning but don't compact

4. If status is `HEALTHY`:

- No action

**`report` command behavior**:

1. Read `.ai/metrics/context-history.json`
2. Calculate trends: average session length, compact frequency, context growth rate
3. Output human-readable summary to stdout
4. Optionally write to `.ai/reports/context-metrics-<date>.md`

**Design decisions** (applying Phase 1 + Phase 2 lessons):

- Use jq/python3/raw-shell fallback chain for JSON (Phase 2 lesson)
- No `sed` for text manipulation (Phase 1 lesson)
- Non-blocking — never prevents commits or workflow (Phase 2 lesson)
- Threshold config is a JSON file, not hardcoded values
- All measurements are append-only to `context-history.json` for trend analysis

#### Task 4.3: Integrate context monitoring into existing workflow

**Modifications to `scripts/post-commit`**:

- After `submit` actions: Run `kimi-context-monitor.sh check` in background
- After `approve`/`merge` actions: Run `kimi-context-monitor.sh auto-compact` in background
- Non-blocking — context check runs asynchronously, never delays commit

**Modifications to `scripts/kimi-session-manager.sh`**:

- `archive` command: Add `--auto-compact` flag that checks thresholds before compacting (smarter than always compacting)
- `create` command: Record initial context baseline in session metadata
- `current` command: Include context health status in output

**Modifications to `scripts/generate-evaluation.sh`**:

- Include context metrics in sprint evaluation reports
- Add "Context Health" section showing average context size, compact frequency, and trends

#### Task 4.4: Create `docs/kimi-context-optimization.md`

**Contents**:

1. What is context and why it matters (256K token limit, performance degradation)
2. How to monitor context (`kimi-context-monitor.sh check`)
3. Auto-compact: how it works, when it triggers
4. Manual compaction: when to use `/compact` directly
5. Best practices:

- Use subagents for isolated tasks (context doesn't leak back)
- Save key findings to `.ai/` files (survive compaction)
- Use `--session` to isolate different workstreams
- Archive sessions between sprints

6. Threshold tuning guide
7. Troubleshooting: context too large, compact failures, metric corruption

#### Task 4.5: Create `scripts/test-phase-4.sh`

### Success Metrics

| Metric | Target | Measurement ||--------|--------|-------------|| Context monitor script | All 5 commands work | Structural tests S.1-S.4, Live API tests L.1-L.2 || Metrics tracking | History file populated | Structural test S.5, Live API test L.3 || Auto-compact | Triggers on threshold | Live API test L.4 || Workflow integration | post-commit + session manager updated | Structural tests S.6-S.8 || Documentation | Guide created | Structural test S.8 |

### Test Suite: 21 Tests (4 Categories)

#### Structural Tests (8 tests)

| ID | Test | What It Verifies ||----|------|-----------------|| S.1 | Metrics directory exists | `.ai/metrics/` exists with `.gitkeep` || S.2 | Thresholds file valid JSON | `.ai/metrics/thresholds.json` parses correctly || S.3 | Context monitor is executable | `test -x scripts/kimi-context-monitor.sh` || S.4 | Context monitor has help text | `./scripts/kimi-context-monitor.sh --help` exits 0 || S.5 | Context history file initialized | `.ai/metrics/context-history.json` exists and is valid JSON || S.6 | Post-commit has context check | `grep -q "kimi-context-monitor" scripts/post-commit` || S.7 | Session manager has auto-compact | `grep -q "auto-compact" scripts/kimi-session-manager.sh` || S.8 | Documentation exists | `test -f docs/kimi-context-optimization.md` |

#### Live API Tests (4 tests)

| ID | Test | What It Verifies ||----|------|-----------------|| L.1 | Context check runs without error | `./scripts/kimi-context-monitor.sh check` exits 0 with a session || L.2 | Context check outputs health status | Output contains `HEALTHY`, `WARNING`, or `CRITICAL` || L.3 | Context history is appended | After check, `context-history.json` has new entry || L.4 | Auto-compact respects thresholds | Set low threshold, verify compact triggers; set high threshold, verify no compact |

#### Edge Tests (6 tests)

| ID | Test | What It Verifies ||----|------|-----------------|| E.1 | No active session | `check` with no active session exits gracefully || E.2 | Corrupt thresholds file | Corrupt JSON, verify fallback to defaults || E.3 | Corrupt history file | Corrupt JSON, verify recovery (recreate) || E.4 | Concurrent checks | Run 3 checks simultaneously, verify no file corruption || E.5 | Very old session | Session with `created_at` 30 days ago, verify WARNING/CRITICAL || E.6 | Missing dependencies | Run without jq, verify fallback chain works |

#### Integration Tests (3 tests)

| ID | Test | What It Verifies ||----|------|-----------------|| I.1 | Phase 1 tests still pass | `./scripts/test-phase-1.sh --mandatory-only` || I.2 | Phase 2 tests still pass | `./scripts/test-phase-2.sh --mandatory` || I.3 | Phase 3 tests still pass | `./scripts/test-phase-3.sh --structural` (if Phase 3 complete) |**Total: 21 tests** (8 structural + 4 live API + 6 edge + 3 integration)

### Files to Create

| File | Purpose ||------|---------|| `.ai/metrics/.gitkeep` | Directory marker || `.ai/metrics/thresholds.json` | Configurable context thresholds || `.ai/metrics/context-history.json` | Append-only measurement log || `scripts/kimi-context-monitor.sh` | Context monitoring and auto-compact || `scripts/test-phase-4.sh` | 21-test suite || `docs/kimi-context-optimization.md` | Context optimization guide || `.ai/reports/phase-4-completion.md` | Completion report |

### Files to Modify

| File | Change ||------|--------|| `scripts/post-commit` | Add background context check after submit/approve/merge || `scripts/kimi-session-manager.sh` | Add `--auto-compact` flag, context baseline on create, health in current || `scripts/generate-evaluation.sh` | Add context metrics to evaluation reports || `.ai/status.md` | Mark Phase 4 DONE |

### Block Removal Criteria

- [x] All 8 structural tests pass
- [x] All 4 live API tests pass
- [x] All 6 edge tests pass
- [x] All 3 integration tests pass (no regressions)
- [x] Success metrics met (5/5)
- [x] Documentation complete (`docs/kimi-context-optimization.md`)
- [x] Context history file populated with at least 1 measurement

### Phase 1-3 Lessons Applied

| Lesson | How Applied in Phase 4 ||--------|----------------------|| JSON parsing needs fallback chains (Phase 2) | Context monitor uses jq → python3 → raw shell for all JSON operations || Session metadata is cheap, context is expensive (Phase 2) | Phase 4 directly addresses the expensive part — monitoring and managing context || Sprint integration requires careful hook ordering (Phase 2) | Context checks run in background, never block commits || Live API tests are non-negotiable (Phase 1) | 4 live tests verify real context checking and auto-compact behavior || No `sed` for text processing (Phase 1) | Uses `awk` and `python3` for all text manipulation || Error swallowing is dangerous (Phase 1) | All tests check explicit exit codes, no `\|\| true` || Test categories must be explicit (Phase 1) | 4 categories: Structural, Live API, Edge, Integration |

### Key Design Decisions

1. **Proxy metrics, not exact token counts**: Kimi CLI doesn't expose token counts directly. We estimate based on session age, file operations, and metadata size. This is sufficient for triggering compaction.
2. **Append-only history**: Context measurements are never overwritten, enabling trend analysis across sprints.
3. **Configurable thresholds**: Thresholds are in a JSON file, not hardcoded. Different projects can tune them.
4. **Non-blocking integration**: Context checks never block the Git workflow. They run in the background after relevant actions.
5. **Builds on Phase 2**: The session manager's `--compact` flag already works. Phase 4 adds intelligence about *when* to compact.

**Gate**: Phase 4 Complete → Phase 5 Unlocked---

## Phase 4: Completion Report & Lessons Learned

**Status**: ✅ **COMPLETE** (2026-02-10)

**Final Test Results**: 21/21 tests passed (8 structural + 4 live API + 6 edge + 3 integration)

**Gate Status**: **UNLOCKED** — Phase 5 can begin

### Actual Implementation Summary

**Files Created:**

- `scripts/kimi-context-monitor.sh` — 5 commands: check, auto-compact, report, history, thresholds
- `.ai/metrics/thresholds.json` — Configurable context thresholds
- `.ai/metrics/context-history.json` — Append-only measurement log
- `docs/kimi-context-optimization.md` — Context optimization guide
- `scripts/test-phase-4.sh` — 21-test suite
- `.ai/reports/phase-4-completion.md` — Completion report

**Key Design Decision**: Proxy metrics (session age, file sizes, tool calls) instead of exact token counts. Kimi CLI's `context.jsonl` files contain `_usage` entries with actual `token_count` values for precise monitoring.---

## Phase 5: Moonshot API Integration

### Objectives

- Implement Files API for persistent context
- Optimize for cached tokens
- Enable streaming for long operations
- Project-specific API keys

### Implementation Tasks

1. **Project-specific API keys** (from previous plan):

- `scripts/setup-project-api-key.sh`
- `.env.project` support
- Update all scripts to check `.env.project` first

2. **Moonshot Files API client**:

- `scripts/moonshot-api-client.py`
- Upload, list, delete, get_file functions
- Project file management

3. **File upload script**:

- `scripts/upload-project-files.py`
- Initial upload on project setup
- Incremental sync on changes

4. **Cached tokens optimization**:

- Reuse sessions for similar operations
- Track token usage
- Optimize for 75% savings

5. **Streaming API integration**:

- Use streaming for evaluation reports
- Use streaming for long operations

### Block Removal Criteria

- [x] All 6 mandatory tests pass
- [x] All 6 edge tests pass
- [x] Success metrics met (5/5)
- [x] Documentation complete
- [x] No regressions

**Gate**: Phase 5 Complete → Phase 6 Unlocked---

## Phase 5: Completion Report & Lessons Learned

**Status**: ✅ **COMPLETE** (2026-02-10)

**Final Test Results**: 25/25 tests passed (25 passed, 0 skipped, 0 failed)

**Gate Status**: **UNLOCKED** — Phase 6 can begin

### Actual Implementation Summary

**Files Created:**

- `scripts/moonshot-api-client.py` — Moonshot Files API client (stdlib only: urllib, json, pathlib)
- `scripts/upload-project-files.py` — Initial upload + incremental sync with change detection
- `scripts/setup-project-api-key.sh` — Interactive API key setup with .env.project support
- `docs/moonshot-api-integration.md` — Comprehensive API integration guide
- `scripts/test-phase-5.sh` — 25-test suite
- `.ai/reports/phase-5-completion.md` — Completion report

**Key Decision**: Used Python stdlib only (urllib.request, json, pathlib) — no external dependencies. OpenAI-compatible API spec with Moonshot endpoint.---

## Phase 6: Advanced Features

### Objectives

- Enable Agent Swarm (K2.5)
- Explore ACP mode for IDE integration
- Enhanced Wire Mode features
- Multi-modal capabilities

### Implementation Tasks

1. **Agent Swarm setup**:

- Configure for K2.5 model
- Test parallel subagent execution
- Document swarm patterns

2. **ACP mode exploration**:

- Test IDE integration
- Document setup for Zed/JetBrains
- Create integration guide

3. **Wire Mode enhancements**:

- Add more event handlers
- Improve error recovery
- Add monitoring

4. **Multi-modal features**:

- Test vision capabilities (K2.5)
- Document use cases

### Block Removal Criteria

- [x] All 4 mandatory tests pass
- [x] All 4 edge tests pass
- [x] Success metrics met (4/4)
- [x] Documentation complete
- [x] No regressions

**Gate**: Phase 6 Complete → All Features Integrated---

## Phase 6: Completion Report & Lessons Learned

**Status**: ✅ **COMPLETE** (2026-02-10)

**Final Test Results**: 23/23 tests passed (23 passed, 0 skipped, 0 failed)

**Gate Status**: **UNLOCKED** — Final integration complete

### Actual Implementation Summary

**Files Created:**

- `scripts/wire-daemon.py` — JSON-RPC 2.0 daemon with git event watching
- `scripts/start-acp-server.sh` — ACP mode server for IDE integration
- `docs/kimi-agent-swarm.md` — K2.5 Agent Swarm documentation
- `docs/kimi-multimodal.md` — Multi-modal capabilities guide
- `.ai/patterns/agent-swarm-parallel-review.md` — Parallel review swarm pattern
- `.ai/patterns/agent-swarm-research-split.md` — Research split swarm pattern
- `.ai/patterns/multimodal-ui-review.md` — Multi-modal UI review pattern
- `scripts/test-phase-6.sh` — 23-test suite
- `.ai/reports/phase-6-completion.md` — Completion report

---

## Phase 7: Integration & Setup — Completion Report

**Status**: ✅ **COMPLETE** (2026-02-10)

**Final Test Results**: 30/30 tests passed (30 passed, 0 skipped, 0 failed)

### Actual Implementation Summary

**Files Created:**

- `scripts/install-wire-daemon.sh` — Wire daemon installation as system service
- `scripts/setup-kimi-project.sh` — One-command Kimi project setup
- `scripts/verify-kimi-setup.sh` — Kimi health check
- `scripts/quick-kimi-check.sh` — Fast pre-work check
- `scripts/test-phase-7.sh` — 30-test suite
- `.github/workflows/` — 3 CI/CD workflows (agent-review, pre-mortal-merge, sprint-evaluation)
- `.ai/reports/phase-7-completion.md` — Completion report

---

## Overall Success Criteria

### Final Integration Test

Run comprehensive test suite covering all phases:

```bash
./scripts/test-all-phases.sh
```



### Documentation Review

- [x] All phase documentation complete
- [x] Usage guides created
- [x] Examples provided
- [x] Troubleshooting guides

### Performance Benchmarks

- [x] Context size optimized
- [x] Token costs reduced (cached tokens)
- [x] Response times acceptable
- [x] No memory leaks

### Production Readiness

- [x] All tests passing
- [x] Error handling robust
- [x] Logging comprehensive
- [x] Monitoring in place

---

## Test Infrastructure

### Test Scripts Created

1. `scripts/test-phase-1.sh` - Phase 1 tests ✅ (25 tests)
2. `scripts/test-phase-2.sh` - Phase 2 tests ✅ (10 tests)
3. `scripts/test-phase-3.sh` - Phase 3 tests ✅ (27 tests)
4. `scripts/test-phase-4.sh` - Phase 4 tests ✅ (21 tests)
5. `scripts/test-phase-5.sh` - Phase 5 tests ✅ (25 tests)
6. `scripts/test-phase-6.sh` - Phase 6 tests ✅ (23 tests)
7. `scripts/test-phase-7.sh` - Phase 7 tests ✅ (30 tests)
8. `scripts/test-agent-file-integration.sh` - Agent file integration ✅ (20 tests)
9. `scripts/test-edge-cases.sh` - Edge case suite ✅ (17 tests)
10. `scripts/test-wire-daemon.sh` - Wire daemon tests ✅
11. `scripts/test-git-hooks.sh` - Git hooks tests ✅

### Continuous Testing

- Run phase tests on every commit
- Run edge tests before phase completion
- Run integration tests before phase unlock

---

## Risk Mitigation

### Phase Rollback

If a phase fails:

1. Document failure
2. Fix issues
3. Re-run all tests
4. Re-verify success metrics

### Dependency Management

- Phases must complete in order
- No skipping phases
- Each phase builds on previous

---

## Lessons Learned (Cumulative)

### From Phase 1: Tool Expansion

1. **Never Trust Module Paths Without Verification** — Use Python introspection
2. **Live API Tests Are Non-Negotiable** — Structural tests alone are insufficient
3. **Watch for Circular Dependencies** — Parent → child → extend parent = crash
4. **Cross-Platform Compatibility Matters** — macOS `sed` ≠ GNU `sed`; use `awk`
5. **Test Categories Must Be Explicit** — Structural, Live API, Edge, Integration
6. **Error Swallowing Is Dangerous** — `|| true` hides real failures

### From Phase 2: Session Management

7. **JSON Parsing Needs Fallback Chains** — jq → python3 → raw shell
8. **Session Metadata Is Cheap, Context Is Expensive** — Track the expensive part
9. **Sprint Integration Requires Careful Hook Ordering** — Non-blocking is essential

### Test Template for Future Phases

Every phase should follow this structure:

```bash
#!/usr/bin/env bash
# Phase X Test Suite

# Structural Tests (verify config files)
run_structural_tests() {
    # YAML/JSON syntax
    # Module path validation (Python imports)
    # No circular dependencies
    # File structure
}

# Live API Tests (verify actual functionality)
run_live_tests() {
    # Real API calls
    # End-to-end functionality
    # Response validation
    # Usage generation
}

# Edge Tests (verify failure handling)
run_edge_tests() {
    # Invalid input
    # Missing dependencies
    # Concurrent operations
    # Error recovery
}

# Integration Tests (verify no regressions)
run_integration_tests() {
    # Existing workflows
    # Backward compatibility
    # Cross-component
}
```



### Red Flags to Watch For

- ✅ Tests that only use `grep` without API calls
- ✅ Tests that use `timeout` without checking availability
- ✅ Tests that use `sed` for line insertion (use `awk` instead)
- ✅ Configuration files with `extend` that might create circles
- ✅ Module paths that aren't verified with Python imports
- ✅ Error handling that uses `|| true` without explicit checks

### Success Criteria Checklist (Per Phase)

Before marking a phase complete, verify:

- [x] All structural tests pass (config files valid)
- [x] All live API tests pass (real calls work)
- [x] All edge tests pass (failure handling works)

---

## 🎉 Plan Status: ALL PHASES COMPLETE

**Total Implementation**: 7 phases + upstream sync workflow + cleanup

**Total Tests**: 198+ tests across 11 test scripts

**Total Files Created/Modified**: 150+ files

**Date Completed**: 2026-02-10| Phase | Tests | Status |

|-------|-------|--------|

| Phase 1: Tool Expansion | 25/25 | ✅ COMPLETE |

| Phase 2: Session Management | 10/10 | ✅ COMPLETE |

| Phase 3: Dynamic Subagents | 27/27 | ✅ COMPLETE |

| Phase 4: Context Optimization | 21/21 | ✅ COMPLETE |

| Phase 5: Moonshot API | 25/25 | ✅ COMPLETE |

| Phase 6: Advanced Features | 23/23 | ✅ COMPLETE |

| Phase 7: Integration & Setup | 30/30 | ✅ COMPLETE |

| Agent File Integration | 20/20 | ✅ COMPLETE |

| Edge Cases | 17/17 | ✅ COMPLETE |

| Upstream Sync Workflow | verified | ✅ COMPLETE |

| Cleanup & Chat Auto-population | verified | ✅ COMPLETE |---

## Additional Infrastructure: Upstream Sync Workflow

**Status**: ✅ **COMPLETE** (2026-02-10)

### Overview

Implemented a pull-based update mechanism that allows projects using the starter kit to pull new features and improvements from the main `open-artel-project-setup` repository without losing their customizations.

### Problem Solved

Previously, the starter kit was a one-time copy. When new features were added (like chat auto-population, new scripts, updated templates), projects had no way to pull those updates. This created a maintenance burden and meant projects missed out on improvements.

### Solution: `scripts/sync-upstream.sh`

A smart sync script that:

1. **Clones/pulls the upstream repo** to a local cache (`.git/open-artel-upstream`)
2. **Categorizes files into three types**:

- **Generic** (auto-updated): `scripts/`, `docs/`, `.ai/templates/`, `.ai/patterns/`, `.agents/skills/`, `.agents/subagents/`, `.agents/prompts/`, `.github/workflows/`, `BOOTSTRAP_PLAYBOOK.md`
- **Customized** (skipped, diff-only): `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/`, `.agents/kimi-overseer.yaml`, `.agents/reviewer-sub.yaml`, `.agents/researcher-sub.yaml`
- **Never-touch** (project data): `.ai/tasks/`, `.ai/reviews/`, `.ai/reports/`, `.ai/chats/`, `.ai/instructions/`, `.ai/ideas/`, `.ai/sessions/`, `.ai/metrics/`, `.ai/status.md`, `.ai/boundaries.md`

3. **Provides three modes**:

- `--dry-run`: Show what would change (no writes)
- `--diff`: Show side-by-side diff of customized files vs upstream templates
- `--force`: Overwrite everything including customized (with 3-second safety delay)

4. **Configurable**: Override upstream URL via `OPEN_ARTEL_UPSTREAM` env var

### Implementation Details

**Files Created**:

- `scripts/sync-upstream.sh` — Main sync script (459 lines)
- `.cursor/rules/00-project-context.mdc` — Always-on project context (customized for this project)
- `.cursor/rules/05-agent-boundaries.mdc` — File ownership boundaries
- `.cursor/rules/06-task-protocol.mdc` — Task file format
- `.cursor/rules/07-kimi-integration.mdc` — Commit-based routing
- `.cursor/rules/07-workforce-protocol.mdc` — Manager + Task Chat workflow
- `setups/multi-agent-starter/scripts/sync-upstream.sh` — Mirrored to starter kit

**Files Modified**:

- `setups/multi-agent-starter/README.md` — Added "Updating from Upstream" section
- `setups/multi-agent-starter/BOOTSTRAP_PLAYBOOK.md` — Added "Pulling Upstream Updates" section

### Usage

```bash
# Check for updates (safe — no changes)
./scripts/sync-upstream.sh --dry-run

# Pull the latest generic files
./scripts/sync-upstream.sh

# See what changed in customized files
./scripts/sync-upstream.sh --diff

# Review and commit
git diff
git add -A && git commit -m '[AGENT:claude] [ACTION:update] [TASK:SYNC] Sync upstream starter kit'
```



### Benefits

1. **Projects stay current**: Can pull new features, bug fixes, and improvements
2. **Customizations preserved**: Project-specific files (AGENTS.md, .cursor/rules/, task data) are never overwritten
3. **Transparent**: Shows exactly what changed with `--diff` mode
4. **Safe**: `--dry-run` lets you preview changes before applying
5. **Self-contained**: Every new project gets the sync script from day one

### Verification

- ✅ Script syntax validated (`bash -n`)
- ✅ Help text works (`--help`)
- ✅ All 5 Cursor rules customized (no `[REPLACE]` placeholders)
- ✅ Starter kit documentation updated
- ✅ Script mirrored to starter kit
- ✅ Phase 1 tests still pass (no regressions)

### Design Decisions

1. **Git-based, not submodules/subtrees**: Avoids complexity of nested repos and merge conflicts
2. **Three file categories**: Clear separation between generic templates and project-specific data
3. **Caching**: Upstream clone cached in `.git/` for fast subsequent syncs
4. **Non-destructive by default**: Only updates generic files unless `--force` is used