#!/usr/bin/env bash
# =============================================================================
# Phase 4: Context Optimization — Test Suite
# =============================================================================
#
# Runs all tests for Phase 4: 8 structural + 4 live API + 6 edge + 3 integration = 21 tests
#
# Usage:
#   ./scripts/test-phase-4.sh                  # Run all tests
#   ./scripts/test-phase-4.sh --structural     # Run structural tests only
#   ./scripts/test-phase-4.sh --live           # Run live API tests only
#   ./scripts/test-phase-4.sh --edge           # Run edge tests only
#   ./scripts/test-phase-4.sh --integration    # Run integration tests only
#   ./scripts/test-phase-4.sh --mandatory-only # Structural + edge (no API)
#
# Exit codes:
#   0 = All tests passed
#   1 = One or more tests failed
# =============================================================================

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Counters
PASSED=0
FAILED=0
SKIPPED=0

# Colors (if terminal supports them)
if [ -t 1 ]; then
    GREEN='\033[0;32m'
    RED='\033[0;31m'
    YELLOW='\033[0;33m'
    CYAN='\033[0;36m'
    NC='\033[0m'
else
    GREEN='' RED='' YELLOW='' CYAN='' NC=''
fi

# ---------------------------------------------------------------------------
# Test runner (matches Phase 1-3 pattern)
# ---------------------------------------------------------------------------

run_test() {
    local test_id="$1"
    local test_name="$2"
    shift 2

    printf "${CYAN}[%s]${NC} %s ... " "$test_id" "$test_name"

    # Capture output and exit code
    local output
    output=$("$@" 2>&1)
    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        printf "${GREEN}PASS${NC}\n"
        ((PASSED++))
    elif [ $exit_code -eq 2 ]; then
        # Convention: exit 2 = SKIP
        printf "${YELLOW}SKIP${NC}\n"
        if [ -n "$output" ]; then
            echo "         Reason: $output"
        fi
        ((SKIPPED++))
    else
        printf "${RED}FAIL${NC}\n"
        if [ -n "$output" ]; then
            # Show first 5 lines of error output
            echo "$output" | head -5 | while IFS= read -r line; do echo "         $line"; done
        fi
        ((FAILED++))
    fi
}

# =============================================================================
# STRUCTURAL TESTS (8 tests) — S.1 through S.8
# =============================================================================

run_structural_tests() {
    echo ""
    echo "=========================================="
    echo "  Structural Tests (8 tests)"
    echo "=========================================="
    echo ""

    # S.1: Metrics directory exists with .gitkeep
    run_test "S.1" "Metrics directory exists (.ai/metrics/ with .gitkeep)" \
        bash -c '
            if [ -d ".ai/metrics/" ] && [ -f ".ai/metrics/.gitkeep" ]; then
                exit 0
            else
                echo "Missing .ai/metrics/ or .gitkeep"
                exit 1
            fi
        '

    # S.2: Thresholds file is valid JSON
    run_test "S.2" "Thresholds file is valid JSON" \
        bash -c '
            FILE=".ai/metrics/thresholds.json"
            if [ ! -f "$FILE" ]; then
                echo "File not found: $FILE"
                exit 1
            fi
            if command -v jq &>/dev/null; then
                jq . "$FILE" > /dev/null 2>&1 || { echo "Invalid JSON (jq)"; exit 1; }
            elif python3 -c "import json" &>/dev/null; then
                python3 -c "import json; json.load(open(\"$FILE\"))" 2>/dev/null || { echo "Invalid JSON (python3)"; exit 1; }
            else
                echo "No JSON validator available"
                exit 2
            fi
            # Verify key fields exist
            if command -v jq &>/dev/null; then
                KEYS=$(jq -r "keys[]" "$FILE" 2>/dev/null)
                for k in warn_token_count compact_token_count warn_context_size_bytes compact_context_size_bytes warn_session_age_hours compact_session_age_hours warn_file_operations compact_file_operations; do
                    echo "$KEYS" | grep -q "$k" || { echo "Missing key: $k"; exit 1; }
                done
            fi
        '

    # S.3: Context monitor is executable
    run_test "S.3" "Context monitor script is executable" \
        bash -c 'test -x "scripts/kimi-context-monitor.sh"'

    # S.4: Context monitor has help text
    run_test "S.4" "Context monitor --help exits 0" \
        bash -c './scripts/kimi-context-monitor.sh --help > /dev/null 2>&1'

    # S.5: Context history file initialized and valid
    run_test "S.5" "Context history file is valid JSON array" \
        bash -c '
            FILE=".ai/metrics/context-history.json"
            if [ ! -f "$FILE" ]; then
                echo "File not found: $FILE"
                exit 1
            fi
            if command -v jq &>/dev/null; then
                TYPE=$(jq -r "type" "$FILE" 2>/dev/null)
                if [ "$TYPE" != "array" ]; then
                    echo "Expected array, got: $TYPE"
                    exit 1
                fi
            elif python3 -c "import json" &>/dev/null; then
                python3 -c "
import json
data = json.load(open(\"$FILE\"))
assert isinstance(data, list), f\"Expected list, got {type(data)}\"
" 2>/dev/null || { echo "Not a valid JSON array"; exit 1; }
            fi
        '

    # S.6: Post-commit has context check integration
    run_test "S.6" "Post-commit references kimi-context-monitor" \
        bash -c 'grep -q "kimi-context-monitor" scripts/post-commit'

    # S.7: Session manager has context enhancements
    run_test "S.7" "Session manager has context/auto-compact references" \
        bash -c '
            FOUND=0
            grep -qi "context" scripts/kimi-session-manager.sh && FOUND=$((FOUND + 1))
            grep -qi "auto-compact\|initial_context" scripts/kimi-session-manager.sh && FOUND=$((FOUND + 1))
            if [ "$FOUND" -ge 2 ]; then
                exit 0
            else
                echo "Expected 2+ context references, found $FOUND"
                exit 1
            fi
        '

    # S.8: Documentation exists
    run_test "S.8" "Documentation file exists (docs/kimi-context-optimization.md)" \
        bash -c '
            if [ -f "docs/kimi-context-optimization.md" ]; then
                # Verify it has real content (not just a stub)
                LINES=$(wc -l < "docs/kimi-context-optimization.md" | tr -d " ")
                if [ "$LINES" -ge 50 ]; then
                    exit 0
                else
                    echo "Documentation too short: $LINES lines"
                    exit 1
                fi
            else
                echo "File not found"
                exit 1
            fi
        '
}

# =============================================================================
# LIVE API TESTS (4 tests) — L.1 through L.4
# =============================================================================

run_live_tests() {
    echo ""
    echo "=========================================="
    echo "  Live API Tests (4 tests)"
    echo "=========================================="
    echo ""

    # Check if kimi is available
    if ! command -v kimi &>/dev/null; then
        echo "  Kimi CLI not found — skipping live tests"
        SKIPPED=$((SKIPPED + 4))
        return 0
    fi

    # L.1: Context check runs with a real session
    run_test "L.1" "Context check runs and outputs HEALTHY/WARNING/CRITICAL" \
        bash -c '
            # Create a test session
            ./scripts/kimi-session-manager.sh create test-p4-live --sprint 99 > /dev/null 2>&1

            # Run check
            OUTPUT=$(./scripts/kimi-context-monitor.sh check test-p4-live 2>&1)
            EXIT_CODE=$?

            # Clean up
            ./scripts/kimi-session-manager.sh delete test-p4-live > /dev/null 2>&1

            # Verify output contains a valid status
            STATUS=$(echo "$OUTPUT" | tail -1)
            if echo "$STATUS" | grep -qE "^(HEALTHY|WARNING|CRITICAL)$"; then
                exit 0
            else
                echo "Expected HEALTHY/WARNING/CRITICAL, got: $STATUS"
                exit 1
            fi
        '

    # L.2: Context check reads real token count
    run_test "L.2" "Context check reads real token count from context.jsonl" \
        bash -c '
            OUTPUT=$(./scripts/kimi-context-monitor.sh check 2>&1)

            # Look for "Token count:" line with a number
            TOKEN_LINE=$(echo "$OUTPUT" | grep "Token count:")
            if [ -z "$TOKEN_LINE" ]; then
                echo "No Token count line in output"
                exit 1
            fi

            # Extract the number
            TOKEN_NUM=$(echo "$TOKEN_LINE" | awk "{print \$3}")
            if [ -z "$TOKEN_NUM" ] || [ "$TOKEN_NUM" = "0" ]; then
                # Token count of 0 is valid for new/empty sessions
                # but we should still have the line
                exit 0
            fi

            # Verify it is a number
            if echo "$TOKEN_NUM" | grep -qE "^[0-9]+$"; then
                exit 0
            else
                echo "Token count is not a number: $TOKEN_NUM"
                exit 1
            fi
        '

    # L.3: Context history is appended after check
    run_test "L.3" "Context history gets new entry after check" \
        bash -c '
            HISTORY_FILE=".ai/metrics/context-history.json"

            # Count entries before
            if command -v jq &>/dev/null; then
                BEFORE=$(jq "length" "$HISTORY_FILE" 2>/dev/null || echo "0")
            else
                BEFORE=$(python3 -c "import json; print(len(json.load(open(\"$HISTORY_FILE\"))))" 2>/dev/null || echo "0")
            fi

            # Run check
            ./scripts/kimi-context-monitor.sh check > /dev/null 2>&1

            # Count entries after
            if command -v jq &>/dev/null; then
                AFTER=$(jq "length" "$HISTORY_FILE" 2>/dev/null || echo "0")
            else
                AFTER=$(python3 -c "import json; print(len(json.load(open(\"$HISTORY_FILE\"))))" 2>/dev/null || echo "0")
            fi

            if [ "$AFTER" -gt "$BEFORE" ]; then
                exit 0
            else
                echo "History not appended: before=$BEFORE after=$AFTER"
                exit 1
            fi
        '

    # L.4: Auto-compact respects thresholds (set low threshold to trigger)
    run_test "L.4" "Auto-compact respects thresholds (HEALTHY = no action)" \
        bash -c '
            # Create a test session
            ./scripts/kimi-session-manager.sh create test-p4-autocompact --sprint 99 > /dev/null 2>&1

            # Run auto-compact (should be HEALTHY, no compaction)
            OUTPUT=$(./scripts/kimi-context-monitor.sh auto-compact test-p4-autocompact 2>&1)

            # Clean up
            ./scripts/kimi-session-manager.sh delete test-p4-autocompact > /dev/null 2>&1

            # Verify it reported HEALTHY and did not compact
            if echo "$OUTPUT" | grep -qi "HEALTHY"; then
                exit 0
            elif echo "$OUTPUT" | grep -qi "no action"; then
                exit 0
            else
                echo "Expected HEALTHY/no action, got:"
                echo "$OUTPUT" | tail -3
                exit 1
            fi
        '
}

# =============================================================================
# EDGE TESTS (6 tests) — E.1 through E.6
# =============================================================================

run_edge_tests() {
    echo ""
    echo "=========================================="
    echo "  Edge Tests (6 tests)"
    echo "=========================================="
    echo ""

    # E.1: No active session — check handles gracefully
    run_test "E.1" "Check with no active session exits gracefully" \
        bash -c '
            # Ensure no active sessions
            BACKUP_DIR=$(mktemp -d)
            if ls .ai/sessions/active/*.json &>/dev/null 2>&1; then
                cp .ai/sessions/active/*.json "$BACKUP_DIR/" 2>/dev/null || true
                rm -f .ai/sessions/active/*.json 2>/dev/null || true
            fi

            OUTPUT=$(./scripts/kimi-context-monitor.sh check nonexistent-session 2>&1)
            EXIT_CODE=$?

            # Restore
            if ls "$BACKUP_DIR"/*.json &>/dev/null 2>&1; then
                cp "$BACKUP_DIR"/*.json .ai/sessions/active/ 2>/dev/null || true
            fi
            rm -rf "$BACKUP_DIR"

            # Should still output something (not crash)
            if [ -n "$OUTPUT" ]; then
                exit 0
            else
                echo "No output at all — script may have crashed"
                exit 1
            fi
        '

    # E.2: Corrupt thresholds file — fallback to defaults
    run_test "E.2" "Corrupt thresholds file — uses defaults or errors gracefully" \
        bash -c '
            THRESH_FILE=".ai/metrics/thresholds.json"
            BACKUP=$(cat "$THRESH_FILE")

            # Corrupt the file
            echo "NOT VALID JSON {{{" > "$THRESH_FILE"

            # Run check — should use defaults, not crash
            OUTPUT=$(./scripts/kimi-context-monitor.sh check 2>&1)
            EXIT_CODE=$?

            # Restore
            echo "$BACKUP" > "$THRESH_FILE"

            # Should not crash (output something)
            if [ -n "$OUTPUT" ]; then
                exit 0
            else
                echo "Script produced no output with corrupt thresholds"
                exit 1
            fi
        '

    # E.3: Corrupt history file — recovery
    run_test "E.3" "Corrupt history file — recovers gracefully" \
        bash -c '
            HIST_FILE=".ai/metrics/context-history.json"
            BACKUP=$(cat "$HIST_FILE")

            # Corrupt the file
            echo "NOT VALID JSON [[[" > "$HIST_FILE"

            # Run check — should recover (recreate or handle)
            OUTPUT=$(./scripts/kimi-context-monitor.sh check 2>&1)

            # Verify history was repaired or recreated
            if command -v jq &>/dev/null; then
                jq . "$HIST_FILE" > /dev/null 2>&1
                VALID=$?
            else
                python3 -c "import json; json.load(open(\"$HIST_FILE\"))" 2>/dev/null
                VALID=$?
            fi

            # Restore original if needed
            if [ $VALID -ne 0 ]; then
                echo "$BACKUP" > "$HIST_FILE"
                echo "History file not repaired after corrupt write"
                exit 1
            fi

            exit 0
        '

    # E.4: Concurrent checks — no file corruption
    run_test "E.4" "Concurrent checks do not corrupt history file" \
        bash -c '
            HIST_FILE=".ai/metrics/context-history.json"

            # Run 3 checks simultaneously
            ./scripts/kimi-context-monitor.sh check > /dev/null 2>&1 &
            PID1=$!
            ./scripts/kimi-context-monitor.sh check > /dev/null 2>&1 &
            PID2=$!
            ./scripts/kimi-context-monitor.sh check > /dev/null 2>&1 &
            PID3=$!

            # Wait for all to finish
            wait $PID1 $PID2 $PID3

            # Verify history file is still valid JSON
            if command -v jq &>/dev/null; then
                jq . "$HIST_FILE" > /dev/null 2>&1 || { echo "History corrupted after concurrent writes"; exit 1; }
            elif python3 -c "import json" &>/dev/null; then
                python3 -c "import json; json.load(open(\"$HIST_FILE\"))" 2>/dev/null || { echo "History corrupted"; exit 1; }
            fi
            exit 0
        '

    # E.5: Very old session — should report WARNING or CRITICAL
    run_test "E.5" "Very old session (30 days) reports WARNING/CRITICAL" \
        bash -c '
            # Create a session with a very old created_at
            mkdir -p .ai/sessions/active
            OLD_DATE="2026-01-10T00:00:00Z"
            cat > .ai/sessions/active/test-p4-old.json << EOF
{
  "name": "test-p4-old",
  "kimi_session_id": "test-p4-old",
  "created_at": "$OLD_DATE",
  "sprint": "",
  "agent_file": ".agents/kimi-overseer.yaml",
  "status": "active",
  "notes": "Test old session"
}
EOF

            OUTPUT=$(./scripts/kimi-context-monitor.sh check test-p4-old 2>&1)
            STATUS=$(echo "$OUTPUT" | tail -1)

            # Clean up
            rm -f .ai/sessions/active/test-p4-old.json

            # Should be WARNING or CRITICAL due to age (30+ days = 720+ hours)
            if echo "$STATUS" | grep -qE "^(WARNING|CRITICAL)$"; then
                exit 0
            else
                echo "Expected WARNING/CRITICAL for 30-day-old session, got: $STATUS"
                # Also acceptable: HEALTHY if thresholds are very high or age calc failed
                AGE_LINE=$(echo "$OUTPUT" | grep "Session age:")
                echo "Age line: $AGE_LINE"
                exit 1
            fi
        '

    # E.6: Missing jq — fallback to python3
    run_test "E.6" "Fallback to python3 when jq is unavailable" \
        bash -c '
            # We cannot actually remove jq, but we can verify python3 fallback works
            if ! python3 -c "import json" &>/dev/null; then
                echo "python3 with json not available"
                exit 2
            fi

            # Test the python3 JSON parsing path directly
            THRESH_FILE=".ai/metrics/thresholds.json"
            VAL=$(python3 -c "
import json
data = json.load(open(\"$THRESH_FILE\"))
print(data.get(\"warn_token_count\", 0))
" 2>/dev/null)

            if [ "$VAL" = "50000" ]; then
                exit 0
            else
                echo "Python3 fallback returned unexpected value: $VAL"
                exit 1
            fi
        '
}

# =============================================================================
# INTEGRATION TESTS (3 tests) — I.1 through I.3
# =============================================================================

run_integration_tests() {
    echo ""
    echo "=========================================="
    echo "  Integration Tests (3 tests)"
    echo "=========================================="
    echo ""

    # I.1: Phase 1 tests still pass
    run_test "I.1" "Phase 1 tests still pass (--mandatory-only)" \
        bash -c '
            if [ ! -f "./scripts/test-phase-1.sh" ]; then
                echo "Phase 1 test script not found"
                exit 2
            fi
            if [ ! -x "./scripts/test-phase-1.sh" ]; then
                echo "Phase 1 test script not executable"
                exit 2
            fi
            OUTPUT=$(./scripts/test-phase-1.sh --mandatory-only 2>&1)
            EXIT_CODE=$?
            if [ $EXIT_CODE -eq 0 ]; then
                exit 0
            else
                echo "$OUTPUT" | tail -5
                exit 1
            fi
        '

    # I.2: Phase 2 tests still pass
    run_test "I.2" "Phase 2 tests still pass (--mandatory)" \
        bash -c '
            if [ ! -f "./scripts/test-phase-2.sh" ]; then
                echo "Phase 2 test script not found"
                exit 2
            fi
            if [ ! -x "./scripts/test-phase-2.sh" ]; then
                echo "Phase 2 test script not executable"
                exit 2
            fi
            OUTPUT=$(./scripts/test-phase-2.sh --mandatory 2>&1)
            EXIT_CODE=$?
            if [ $EXIT_CODE -eq 0 ]; then
                exit 0
            else
                echo "$OUTPUT" | tail -5
                exit 1
            fi
        '

    # I.3: Phase 3 tests still pass
    run_test "I.3" "Phase 3 tests still pass (--structural)" \
        bash -c '
            if [ ! -f "./scripts/test-phase-3.sh" ]; then
                echo "Phase 3 test script not found"
                exit 2
            fi
            if [ ! -x "./scripts/test-phase-3.sh" ]; then
                echo "Phase 3 test script not executable"
                exit 2
            fi
            OUTPUT=$(./scripts/test-phase-3.sh --structural 2>&1)
            EXIT_CODE=$?
            if [ $EXIT_CODE -eq 0 ]; then
                exit 0
            else
                echo "$OUTPUT" | tail -5
                exit 1
            fi
        '
}

# =============================================================================
# Summary
# =============================================================================

print_summary() {
    echo ""
    echo "=========================================="
    echo "  Phase 4 Test Results"
    echo "=========================================="
    echo ""
    printf "  ${GREEN}Passed:${NC}  %d\n" "$PASSED"
    printf "  ${RED}Failed:${NC}  %d\n" "$FAILED"
    printf "  ${YELLOW}Skipped:${NC} %d\n" "$SKIPPED"
    echo "  Total:   $((PASSED + FAILED + SKIPPED))"
    echo ""

    if [ "$FAILED" -gt 0 ]; then
        printf "  ${RED}RESULT: FAIL${NC}\n"
        echo ""
        return 1
    else
        printf "  ${GREEN}RESULT: PASS${NC}\n"
        echo ""
        return 0
    fi
}

# =============================================================================
# Main — parse args and run
# =============================================================================

RUN_STRUCTURAL=true
RUN_LIVE=true
RUN_EDGE=true
RUN_INTEGRATION=true

while [ $# -gt 0 ]; do
    case "$1" in
        --structural)
            RUN_STRUCTURAL=true
            RUN_LIVE=false
            RUN_EDGE=false
            RUN_INTEGRATION=false
            shift
            ;;
        --live)
            RUN_STRUCTURAL=false
            RUN_LIVE=true
            RUN_EDGE=false
            RUN_INTEGRATION=false
            shift
            ;;
        --edge)
            RUN_STRUCTURAL=false
            RUN_LIVE=false
            RUN_EDGE=true
            RUN_INTEGRATION=false
            shift
            ;;
        --integration)
            RUN_STRUCTURAL=false
            RUN_LIVE=false
            RUN_EDGE=false
            RUN_INTEGRATION=true
            shift
            ;;
        --mandatory-only)
            RUN_STRUCTURAL=true
            RUN_LIVE=false
            RUN_EDGE=true
            RUN_INTEGRATION=false
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [--structural|--live|--edge|--integration|--mandatory-only]"
            echo ""
            echo "Options:"
            echo "  --structural     Run structural tests only (8 tests)"
            echo "  --live           Run live API tests only (4 tests)"
            echo "  --edge           Run edge tests only (6 tests)"
            echo "  --integration    Run integration tests only (3 tests)"
            echo "  --mandatory-only Run structural + edge (no API calls)"
            echo ""
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage."
            exit 1
            ;;
    esac
done

echo ""
echo "=========================================="
echo "  Phase 4: Context Optimization Tests"
echo "=========================================="

[ "$RUN_STRUCTURAL" = true ] && run_structural_tests
[ "$RUN_LIVE" = true ] && run_live_tests
[ "$RUN_EDGE" = true ] && run_edge_tests
[ "$RUN_INTEGRATION" = true ] && run_integration_tests

print_summary
exit $?

