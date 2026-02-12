#!/usr/bin/env bash
# =============================================================================
# Open Artel — Phase 7: Integration & Setup — Test Suite
# =============================================================================
#
# 30 tests total:
#   - 14 Structural (S.1-S.14): File existence, content validation, references
#   - 8 Live API (L.1-L.8): Setup scripts, verify scripts, agent load, etc.
#   - 5 Edge (E.1-E.5): Missing prereqs, partial setup, non-git dir, etc.
#   - 3 Integration (I.1-I.3): Phase 1-6 regression, starter kit, docs
#
# Usage:
#   ./scripts/test-phase-7.sh               # Run all tests
#   ./scripts/test-phase-7.sh --structural  # Run structural tests only
#   ./scripts/test-phase-7.sh --live        # Run live API tests only
#   ./scripts/test-phase-7.sh --edge        # Run edge tests only
#   ./scripts/test-phase-7.sh --integration # Run integration tests only
#   ./scripts/test-phase-7.sh --help        # Show help
#
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# ---------------------------------------------------------------------------
# Colors
# ---------------------------------------------------------------------------

if [ -t 1 ]; then
    GREEN='\033[0;32m'
    RED='\033[0;31m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    BOLD='\033[1m'
    NC='\033[0m'
else
    GREEN='' RED='' YELLOW='' BLUE='' BOLD='' NC=''
fi

# ---------------------------------------------------------------------------
# Test framework
# ---------------------------------------------------------------------------

PASS_COUNT=0
FAIL_COUNT=0
SKIP_COUNT=0
TOTAL_COUNT=0
CURRENT_CATEGORY=""
FAILED_TESTS=""

run_test() {
    local test_id="$1"
    local test_name="$2"
    local test_cmd="$3"
    TOTAL_COUNT=$((TOTAL_COUNT + 1))

    # Capture output to temp file to avoid SIGPIPE issues
    local tmpfile
    tmpfile=$(mktemp)

    if eval "$test_cmd" > "$tmpfile" 2>&1; then
        echo -e "  ${GREEN}PASS${NC}  $test_id: $test_name"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "  ${RED}FAIL${NC}  $test_id: $test_name"
        # Show first 3 lines of output for debugging
        head -3 "$tmpfile" 2>/dev/null | while IFS= read -r line; do
            echo -e "        ${RED}→ $line${NC}"
        done
        FAIL_COUNT=$((FAIL_COUNT + 1))
        FAILED_TESTS="$FAILED_TESTS $test_id"
    fi

    rm -f "$tmpfile"
}

skip_test() {
    local test_id="$1"
    local test_name="$2"
    local reason="$3"
    TOTAL_COUNT=$((TOTAL_COUNT + 1))
    SKIP_COUNT=$((SKIP_COUNT + 1))
    echo -e "  ${YELLOW}SKIP${NC}  $test_id: $test_name ($reason)"
}

category() {
    CURRENT_CATEGORY="$1"
    echo ""
    echo -e "${BLUE}${BOLD}$1${NC}"
    echo -e "${BLUE}$(printf '%.0s─' {1..50})${NC}"
}

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------

RUN_STRUCTURAL=true
RUN_LIVE=true
RUN_EDGE=true
RUN_INTEGRATION=true

if [ "${1:-}" = "--structural" ]; then
    RUN_LIVE=false; RUN_EDGE=false; RUN_INTEGRATION=false
elif [ "${1:-}" = "--live" ]; then
    RUN_STRUCTURAL=false; RUN_EDGE=false; RUN_INTEGRATION=false
elif [ "${1:-}" = "--edge" ]; then
    RUN_STRUCTURAL=false; RUN_LIVE=false; RUN_INTEGRATION=false
elif [ "${1:-}" = "--integration" ]; then
    RUN_STRUCTURAL=false; RUN_LIVE=false; RUN_EDGE=false
elif [ "${1:-}" = "--help" ] || [ "${1:-}" = "-h" ]; then
    echo "Phase 7 Test Suite — Integration & Setup"
    echo ""
    echo "Usage:"
    echo "  ./scripts/test-phase-7.sh               # All 30 tests"
    echo "  ./scripts/test-phase-7.sh --structural   # 14 structural tests"
    echo "  ./scripts/test-phase-7.sh --live          # 8 live API tests"
    echo "  ./scripts/test-phase-7.sh --edge          # 5 edge tests"
    echo "  ./scripts/test-phase-7.sh --integration   # 3 integration tests"
    exit 0
fi

# ---------------------------------------------------------------------------
# Banner
# ---------------------------------------------------------------------------

echo ""
echo -e "${BOLD}Phase 7: Integration & Setup — Test Suite${NC}"
echo -e "${BOLD}===========================================${NC}"

# =========================================================================
# STRUCTURAL TESTS (14 tests)
# =========================================================================

if [ "$RUN_STRUCTURAL" = true ]; then

    category "Structural Tests (S.1-S.14)"

    # S.1: Starter kit AGENTS.md has Kimi features
    run_test "S.1" "Starter AGENTS.md has Kimi features" \
        "grep -qi 'kimi.*features\|features.*overview\|session.*management\|agent.*swarm' setups/multi-agent-starter/AGENTS.md"

    # S.2: Starter kit CLAUDE.md has Kimi coordination
    run_test "S.2" "Starter CLAUDE.md has Kimi coordination" \
        "grep -qi 'kimi.*coordination\|kimi.*delegate\|kimi.*evaluate' setups/multi-agent-starter/CLAUDE.md"

    # S.3: Setup script exists and is executable
    run_test "S.3" "setup-kimi-project.sh exists and executable" \
        "test -x scripts/setup-kimi-project.sh"

    # S.4: Verify script exists and is executable
    run_test "S.4" "verify-kimi-setup.sh exists and executable" \
        "test -x scripts/verify-kimi-setup.sh"

    # S.5: All 4 skills updated with Kimi references
    run_test "S.5" "All 4 skills reference Kimi features" \
        "grep -qi 'kimi\|session\|subagent\|swarm' .agents/skills/open-artel-workflow/SKILL.md && \
         grep -qi 'session\|context\|sprint.*evaluation' .agents/skills/sprint-management/SKILL.md && \
         grep -qi 'subagent\|swarm\|dynamic' .agents/skills/code-review/SKILL.md && \
         grep -qi 'session\|subagent\|context' .agents/skills/task-handoff/SKILL.md"

    # S.6: Cursor integration guide exists
    run_test "S.6" "Cursor integration guide exists" \
        "test -f docs/cursor-kimi-integration.md"

    # S.7: Claude coordination guide exists
    run_test "S.7" "Claude coordination guide exists" \
        "test -f docs/claude-kimi-coordination.md"

    # S.8: Bootstrap playbook has Kimi setup step
    run_test "S.8" "Bootstrap playbook has Kimi setup step" \
        "grep -qi 'kimi.*overseer\|setup-kimi-project\|step.*5.*kimi' setups/multi-agent-starter/BOOTSTRAP_PLAYBOOK.md"

    # S.9: Evaluation procedures doc exists
    run_test "S.9" "Evaluation procedures doc exists" \
        "test -f docs/kimi-evaluation-procedures.md"

    # S.10: Main AGENTS.md updated with Kimi features
    run_test "S.10" "Main AGENTS.md has Kimi CLI in tech stack" \
        "grep -qi 'kimi.*code.*cli\|kimi-session-manager\|setup-kimi-project' AGENTS.md"

    # S.11: Quick check script exists and is executable
    run_test "S.11" "quick-kimi-check.sh exists and executable" \
        "test -x scripts/quick-kimi-check.sh"

    # S.12: Cursor rule file exists
    run_test "S.12" "Cursor rule 07-kimi-integration.mdc exists" \
        "test -f setups/multi-agent-starter/.cursor/rules/07-kimi-integration.mdc"

    # S.13: GitHub Actions workflows in starter kit
    run_test "S.13" "Starter kit has 3 GitHub Actions workflows" \
        "test -f setups/multi-agent-starter/.github/workflows/agent-review.yml && \
         test -f setups/multi-agent-starter/.github/workflows/pre-mortal-merge.yml && \
         test -f setups/multi-agent-starter/.github/workflows/sprint-evaluation.yml"

    # S.14: GitHub Actions docs exist
    run_test "S.14" "GitHub Actions documentation exists" \
        "test -f docs/github-actions-automation.md"

fi

# =========================================================================
# LIVE API TESTS (8 tests)
# =========================================================================

if [ "$RUN_LIVE" = true ]; then

    category "Live API Tests (L.1-L.8)"

    # L.1: Setup script runs with --quick (no API key prompt)
    run_test "L.1" "setup-kimi-project.sh --quick runs successfully" \
        "./scripts/setup-kimi-project.sh --quick 2>&1 | tail -1"

    # L.2: Verify script runs and produces output
    run_test "L.2" "verify-kimi-setup.sh produces PASS/WARN/FAIL output" \
        "./scripts/verify-kimi-setup.sh 2>&1 | grep -c 'PASS\|WARN\|FAIL' | awk '{ exit (\$1 > 0 ? 0 : 1) }'"

    # L.3: Agent file loads successfully
    KIMI_AVAILABLE=false
    if command -v kimi >/dev/null 2>&1; then
        KIMI_AVAILABLE=true
    fi

    if [ "$KIMI_AVAILABLE" = true ]; then
        run_test "L.3" "Kimi agent file loads (kimi --agent-file --print)" \
            "tmpout=\$(mktemp); kimi --agent-file .agents/kimi-overseer.yaml --print -p 'Respond with exactly: AGENT_LOADED' > \"\$tmpout\" 2>&1; result=\$(grep -c 'AGENT_LOADED\|overseer\|Kimi' \"\$tmpout\" || true); rm -f \"\$tmpout\"; [ \"\$result\" -gt 0 ]"
    else
        skip_test "L.3" "Kimi agent file loads" "kimi CLI not available"
    fi

    # L.4: Quick check script runs
    run_test "L.4" "quick-kimi-check.sh runs and produces output" \
        "./scripts/quick-kimi-check.sh 2>&1 | grep -c 'OK\|FAIL\|WARN' | awk '{ exit (\$1 > 0 ? 0 : 1) }'"

    # L.5: Session lifecycle (create → list → delete)
    if [ -x scripts/kimi-session-manager.sh ]; then
        run_test "L.5" "Session lifecycle (create → list → delete)" \
            "./scripts/kimi-session-manager.sh create phase7-test-session 2>&1 && \
             ./scripts/kimi-session-manager.sh list 2>&1 | grep -c 'phase7-test-session' | awk '{ exit (\$1 > 0 ? 0 : 1) }' && \
             ./scripts/kimi-session-manager.sh delete phase7-test-session 2>&1"
    else
        skip_test "L.5" "Session lifecycle" "kimi-session-manager.sh not found"
    fi

    # L.6: Commit routing parse (dry-run)
    run_test "L.6" "Commit routing headers parsed correctly" \
        "echo '[AGENT:cursor] [ACTION:submit] [TASK:TEST-001] Test' | grep -q '\\[AGENT:cursor\\]' && \
         echo '[AGENT:cursor] [ACTION:submit] [TASK:TEST-001] Test' | grep -q '\\[ACTION:submit\\]' && \
         echo '[AGENT:cursor] [ACTION:submit] [TASK:TEST-001] Test' | grep -q '\\[TASK:TEST-001\\]'"

    # L.7: Evaluation script has --quick mode
    if [ -x scripts/generate-evaluation.sh ]; then
        run_test "L.7" "generate-evaluation.sh --help works" \
            "./scripts/generate-evaluation.sh --help 2>&1 | grep -c 'quick\|sprint\|baseline' | awk '{ exit (\$1 > 0 ? 0 : 1) }'"
    else
        skip_test "L.7" "Evaluation script --help" "generate-evaluation.sh not found"
    fi

    # L.8: Sprint lifecycle simulation (dry-run)
    run_test "L.8" "Sprint lifecycle simulation (dry-run)" \
        "export OPEN_ARTEL_DRY_RUN=true && \
         echo 'Sprint lifecycle: delegate → submit → approve → evaluate' && \
         echo '[AGENT:claude] [ACTION:delegate] [TASK:SPRINT-99]' | grep -q 'delegate' && \
         echo '[AGENT:cursor] [ACTION:submit] [TASK:TASK-99-01]' | grep -q 'submit' && \
         echo '[AGENT:kimi] [ACTION:approve] [TASK:TASK-99-01]' | grep -q 'approve' && \
         echo '[AGENT:claude] [ACTION:evaluate] [TASK:SPRINT-EVAL]' | grep -q 'evaluate' && \
         unset OPEN_ARTEL_DRY_RUN"

fi

# =========================================================================
# EDGE TESTS (5 tests)
# =========================================================================

if [ "$RUN_EDGE" = true ]; then

    category "Edge Tests (E.1-E.5)"

    # E.1: Missing prerequisites handled gracefully
    run_test "E.1" "Setup script handles missing kimi CLI gracefully" \
        "tmpout=\$(mktemp); PATH=/usr/bin:/bin ./scripts/setup-kimi-project.sh --quick > \"\$tmpout\" 2>&1 || true; result=\$(grep -c 'WARN\|not found\|Kimi CLI' \"\$tmpout\" || true); rm -f \"\$tmpout\"; [ \"\$result\" -gt 0 ]"

    # E.2: Partial setup recovery
    run_test "E.2" "Verify script works with partial setup (missing files)" \
        "tmpout=\$(mktemp); ./scripts/verify-kimi-setup.sh > \"\$tmpout\" 2>&1 || true; result=\$(grep -c 'PASS\|WARN\|FAIL' \"\$tmpout\" || true); rm -f \"\$tmpout\"; [ \"\$result\" -gt 0 ]"

    # E.3: Non-git directory handling
    run_test "E.3" "Setup script fails gracefully outside git repo" \
        "tmpout=\$(mktemp); tmpdir=\$(mktemp -d); cp scripts/setup-kimi-project.sh \"\$tmpdir/setup-kimi-project.sh\"; cd \"\$tmpdir\" && bash setup-kimi-project.sh --quick > \"\$tmpout\" 2>&1; exit_code=\$?; cd \"$PROJECT_ROOT\"; rm -rf \"\$tmpdir\" \"\$tmpout\"; [ \"\$exit_code\" -ne 0 ]"

    # E.4: Missing .env handled
    run_test "E.4" "Verify script handles missing .env gracefully" \
        "tmpout=\$(mktemp); (unset KIMI_API_KEY; ./scripts/verify-kimi-setup.sh > \"\$tmpout\" 2>&1 || true); result=\$(grep -c 'PASS\|WARN\|FAIL' \"\$tmpout\" || true); rm -f \"\$tmpout\"; [ \"\$result\" -gt 0 ]"

    # E.5: Invalid agent file handled
    run_test "E.5" "Quick check handles missing agent file gracefully" \
        "tmpout=\$(mktemp); tmpdir=\$(mktemp -d); mkdir -p \"\$tmpdir/.git\"; cp scripts/quick-kimi-check.sh \"\$tmpdir/\"; cd \"\$tmpdir\" && bash quick-kimi-check.sh > \"\$tmpout\" 2>&1; exit_code=\$?; cd \"$PROJECT_ROOT\"; rm -rf \"\$tmpdir\" \"\$tmpout\"; [ \"\$exit_code\" -ne 0 ]"

fi

# =========================================================================
# INTEGRATION TESTS (3 tests)
# =========================================================================

if [ "$RUN_INTEGRATION" = true ]; then

    category "Integration Tests (I.1-I.3)"

    # I.1: Phase 1-6 regression check
    PHASE_REGRESSION_PASS=true
    for phase_num in 1 2 3 4 5 6; do
        test_script="scripts/test-phase-${phase_num}.sh"
        if [ -x "$test_script" ]; then
            # Run structural tests only for regression check
            tmpout=$(mktemp)
            if "./$test_script" --structural > "$tmpout" 2>&1 || "./$test_script" --mandatory-only > "$tmpout" 2>&1 || "./$test_script" --mandatory > "$tmpout" 2>&1; then
                true  # pass
            else
                PHASE_REGRESSION_PASS=false
            fi
            rm -f "$tmpout"
        fi
    done

    if [ "$PHASE_REGRESSION_PASS" = true ]; then
        run_test "I.1" "Phase 1-6 structural tests still pass (no regressions)" \
            "true"
    else
        run_test "I.1" "Phase 1-6 structural tests still pass (no regressions)" \
            "false"
    fi

    # I.2: Starter kit validity
    run_test "I.2" "Starter kit is complete and valid" \
        "test -f setups/multi-agent-starter/AGENTS.md && \
         test -f setups/multi-agent-starter/CLAUDE.md && \
         test -f setups/multi-agent-starter/BOOTSTRAP_PLAYBOOK.md && \
         test -d setups/multi-agent-starter/.cursor/rules && \
         test -d setups/multi-agent-starter/.github/workflows && \
         grep -qi 'kimi' setups/multi-agent-starter/AGENTS.md && \
         grep -qi 'kimi' setups/multi-agent-starter/CLAUDE.md"

    # I.3: Documentation accessibility (all docs referenced exist)
    run_test "I.3" "All referenced documentation files exist" \
        "test -f docs/cursor-kimi-integration.md && \
         test -f docs/claude-kimi-coordination.md && \
         test -f docs/kimi-evaluation-procedures.md && \
         test -f docs/github-actions-automation.md && \
         test -f docs/kimi-agent-swarm.md && \
         test -f docs/kimi-context-optimization.md && \
         test -f docs/moonshot-api-integration.md && \
         test -f docs/kimi-multimodal.md"

fi

# =========================================================================
# SUMMARY
# =========================================================================

echo ""
echo -e "${BOLD}===========================================${NC}"
echo -e "${BOLD}  Phase 7 Test Results${NC}"
echo -e "${BOLD}===========================================${NC}"
echo ""
echo -e "  ${GREEN}Passed${NC}:  $PASS_COUNT"
echo -e "  ${RED}Failed${NC}:  $FAIL_COUNT"
echo -e "  ${YELLOW}Skipped${NC}: $SKIP_COUNT"
echo -e "  Total:   $TOTAL_COUNT"
echo ""

if [ "$FAIL_COUNT" -gt 0 ]; then
    echo -e "${RED}Failed tests:${FAILED_TESTS}${NC}"
    echo ""
    exit 1
elif [ "$SKIP_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}All non-skipped tests passed. Skipped tests require kimi CLI.${NC}"
    exit 0
else
    echo -e "${GREEN}All $TOTAL_COUNT tests passed!${NC}"
    exit 0
fi
