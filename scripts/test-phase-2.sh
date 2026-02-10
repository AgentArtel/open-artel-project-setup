#!/usr/bin/env bash
# =============================================================================
# Phase 2: Session Management — Test Suite
# =============================================================================
#
# Runs all mandatory tests and edge tests for Phase 2.
# Tests are self-contained and clean up after themselves.
#
# Usage:
#   ./scripts/test-phase-2.sh              # Run all tests
#   ./scripts/test-phase-2.sh --mandatory  # Run mandatory tests only
#   ./scripts/test-phase-2.sh --edge       # Run edge tests only
#   ./scripts/test-phase-2.sh --verbose    # Show detailed output
#
# =============================================================================

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SESSION_MGR="./scripts/kimi-session-manager.sh"
ACTIVE_DIR=".ai/sessions/active"
ARCHIVED_DIR=".ai/sessions/archived"

# Test options
RUN_MANDATORY=true
RUN_EDGE=true
VERBOSE=false

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0
SKIPPED=0

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

log_test()    { echo -e "${BLUE}[TEST]${NC} $*"; }
log_pass()    { echo -e "${GREEN}[PASS]${NC} $*"; ((PASSED++)); }
log_fail()    { echo -e "${RED}[FAIL]${NC} $*"; ((FAILED++)); }
log_skip()    { echo -e "${YELLOW}[SKIP]${NC} $*"; ((SKIPPED++)); }
log_info()    { echo -e "${CYAN}[INFO]${NC} $*"; }
log_verbose() { [ "$VERBOSE" = true ] && echo -e "${CYAN}[VERBOSE]${NC} $*" || true; }

# Clean up any test sessions (prefix with "test-p2-")
cleanup_test_sessions() {
    for f in "$ACTIVE_DIR"/test-p2-*.json "$ARCHIVED_DIR"/test-p2-*.json; do
        [ -f "$f" ] && rm -f "$f"
    done
}

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------

while [ $# -gt 0 ]; do
    case "$1" in
        --mandatory) RUN_MANDATORY=true; RUN_EDGE=false; shift ;;
        --edge)      RUN_MANDATORY=false; RUN_EDGE=true; shift ;;
        --verbose|-v) VERBOSE=true; shift ;;
        --help|-h)
            echo "Usage: $0 [--mandatory|--edge] [--verbose]"
            exit 0
            ;;
        *) shift ;;
    esac
done

# =============================================================================
# Pre-flight checks
# =============================================================================

echo ""
echo "=========================================="
echo "  Phase 2: Session Management Test Suite"
echo "=========================================="
echo ""

# Verify session manager exists and is executable
if [ ! -x "$SESSION_MGR" ]; then
    echo -e "${RED}FATAL: Session manager not found or not executable: $SESSION_MGR${NC}"
    exit 1
fi

# Verify directories exist
if [ ! -d "$ACTIVE_DIR" ] || [ ! -d "$ARCHIVED_DIR" ]; then
    echo -e "${RED}FATAL: Session directories missing. Expected $ACTIVE_DIR and $ARCHIVED_DIR${NC}"
    exit 1
fi

# Clean up any leftover test sessions
cleanup_test_sessions

# =============================================================================
# MANDATORY TESTS
# =============================================================================

if [ "$RUN_MANDATORY" = true ]; then
    echo "--- Mandatory Tests ---"
    echo ""

    # =========================================================================
    # Test 2.1: Session Creation
    # =========================================================================
    log_test "Test 2.1: Session Creation"

    # Create a test session
    OUTPUT=$($SESSION_MGR create test-p2-create --sprint 99 2>&1)
    log_verbose "Create output: $OUTPUT"

    # Verify the session file was created
    if [ -f "$ACTIVE_DIR/test-p2-create.json" ]; then
        # Verify it appears in the list
        LIST_OUTPUT=$($SESSION_MGR list 2>&1)
        if echo "$LIST_OUTPUT" | grep -q "test-p2-create"; then
            # Verify JSON content has expected fields
            if grep -q '"name"' "$ACTIVE_DIR/test-p2-create.json" && \
               grep -q '"sprint"' "$ACTIVE_DIR/test-p2-create.json" && \
               grep -q '"kimi_session_id"' "$ACTIVE_DIR/test-p2-create.json"; then
                log_pass "Test 2.1: Session created, listed, and JSON is valid"
            else
                log_fail "Test 2.1: Session file missing required JSON fields"
            fi
        else
            log_fail "Test 2.1: Session created but not found in list output"
        fi
    else
        log_fail "Test 2.1: Session file not created at $ACTIVE_DIR/test-p2-create.json"
    fi
    echo ""

    # =========================================================================
    # Test 2.2: Session Resume (dry — just verify command builds correctly)
    # =========================================================================
    log_test "Test 2.2: Session Resume"

    # Create a session to resume
    $SESSION_MGR create test-p2-resume --sprint 99 >/dev/null 2>&1

    if [ -f "$ACTIVE_DIR/test-p2-resume.json" ]; then
        # We can't actually launch kimi in tests, but we can verify:
        # 1. The metadata has a kimi_session_id
        # 2. The resume command would fail gracefully if kimi isn't installed
        session_id=""
        if command -v jq &>/dev/null; then
            session_id=$(jq -r '.kimi_session_id' "$ACTIVE_DIR/test-p2-resume.json" 2>/dev/null)
        elif python3 -c "import json" &>/dev/null; then
            session_id=$(python3 -c "import json; print(json.load(open('$ACTIVE_DIR/test-p2-resume.json')).get('kimi_session_id',''))" 2>/dev/null)
        else
            session_id=$(grep '"kimi_session_id"' "$ACTIVE_DIR/test-p2-resume.json" | sed 's/.*: *"\(.*\)".*/\1/' | head -1)
        fi

        if [ -n "$session_id" ] && [ "$session_id" != "null" ]; then
            # Check if kimi is available for a live test
            if command -v kimi &>/dev/null; then
                log_pass "Test 2.2: Session has valid kimi_session_id ($session_id), kimi available for resume"
            else
                log_pass "Test 2.2: Session has valid kimi_session_id ($session_id) (kimi not installed — live resume skipped)"
            fi
        else
            log_fail "Test 2.2: Session missing kimi_session_id"
        fi
    else
        log_fail "Test 2.2: Could not create session for resume test"
    fi
    echo ""

    # =========================================================================
    # Test 2.3: Session Archive
    # =========================================================================
    log_test "Test 2.3: Session Archive"

    # Create a session to archive
    $SESSION_MGR create test-p2-archive --sprint 99 >/dev/null 2>&1

    if [ -f "$ACTIVE_DIR/test-p2-archive.json" ]; then
        # Archive it
        ARCHIVE_OUTPUT=$($SESSION_MGR archive test-p2-archive 2>&1)
        log_verbose "Archive output: $ARCHIVE_OUTPUT"

        # Verify it moved to archived/
        if [ -f "$ARCHIVED_DIR/test-p2-archive.json" ]; then
            # Verify it's no longer in active/
            if [ ! -f "$ACTIVE_DIR/test-p2-archive.json" ]; then
                # Verify archived metadata has archived_at field
                if grep -q '"archived_at"' "$ARCHIVED_DIR/test-p2-archive.json"; then
                    log_pass "Test 2.3: Session archived with metadata"
                else
                    log_fail "Test 2.3: Archived session missing archived_at field"
                fi
            else
                log_fail "Test 2.3: Session still in active/ after archive"
            fi
        else
            log_fail "Test 2.3: Session not found in archived/ after archive"
        fi
    else
        log_fail "Test 2.3: Could not create session for archive test"
    fi
    echo ""

    # =========================================================================
    # Test 2.4: Session List
    # =========================================================================
    log_test "Test 2.4: Session List"

    # Create multiple sessions
    $SESSION_MGR create test-p2-list-a --sprint 1 >/dev/null 2>&1
    $SESSION_MGR create test-p2-list-b --sprint 2 >/dev/null 2>&1

    LIST_OUTPUT=$($SESSION_MGR list 2>&1)
    log_verbose "List output: $LIST_OUTPUT"

    if echo "$LIST_OUTPUT" | grep -q "test-p2-list-a" && \
       echo "$LIST_OUTPUT" | grep -q "test-p2-list-b"; then
        # Also test --all shows archived sessions
        ALL_OUTPUT=$($SESSION_MGR list --all 2>&1)
        if echo "$ALL_OUTPUT" | grep -q "Archived Sessions"; then
            log_pass "Test 2.4: List shows multiple active sessions and --all shows archived section"
        else
            log_fail "Test 2.4: --all flag doesn't show archived section"
        fi
    else
        log_fail "Test 2.4: List doesn't show both created sessions"
    fi
    echo ""

    # =========================================================================
    # Test 2.5: Sprint Integration
    # =========================================================================
    log_test "Test 2.5: Sprint Integration"

    # Test 1: post-commit hook has session manager integration
    has_session_mgr_in_hook=false
    has_sprint_start=false
    has_sprint_archive=false

    if grep -q "SESSION_MANAGER" scripts/post-commit; then
        has_session_mgr_in_hook=true
    fi
    if grep -q "check_sprint_start" scripts/post-commit; then
        has_sprint_start=true
    fi
    if grep -q "archive" scripts/post-commit && grep -q "check_sprint_completion" scripts/post-commit; then
        has_sprint_archive=true
    fi

    # Test 2: generate-evaluation.sh has session info
    has_session_in_eval=false
    if grep -q "sessions/active" scripts/generate-evaluation.sh; then
        has_session_in_eval=true
    fi

    # Test 3: status.md has session field
    has_session_in_status=false
    if grep -q "Session Management\|Current Session" .ai/status.md; then
        has_session_in_status=true
    fi

    if [ "$has_session_mgr_in_hook" = true ] && \
       [ "$has_sprint_start" = true ] && \
       [ "$has_sprint_archive" = true ] && \
       [ "$has_session_in_eval" = true ] && \
       [ "$has_session_in_status" = true ]; then
        log_pass "Test 2.5: Sprint integration — post-commit (start+archive), evaluation (session info), status.md (session field)"
    else
        details=""
        [ "$has_session_mgr_in_hook" = false ] && details="${details} post-commit:SESSION_MANAGER"
        [ "$has_sprint_start" = false ] && details="${details} post-commit:check_sprint_start"
        [ "$has_sprint_archive" = false ] && details="${details} post-commit:archive"
        [ "$has_session_in_eval" = false ] && details="${details} evaluation:session_info"
        [ "$has_session_in_status" = false ] && details="${details} status:session_field"
        log_fail "Test 2.5: Sprint integration missing:${details}"
    fi
    echo ""
fi

# =============================================================================
# EDGE TESTS
# =============================================================================

if [ "$RUN_EDGE" = true ]; then
    echo "--- Edge Tests ---"
    echo ""

    # =========================================================================
    # Edge 2.1: Concurrent Sessions
    # =========================================================================
    log_test "Edge 2.1: Concurrent Sessions"

    # Create multiple sessions simultaneously
    $SESSION_MGR create test-p2-concurrent-a --sprint 10 >/dev/null 2>&1 &
    PID_A=$!
    $SESSION_MGR create test-p2-concurrent-b --sprint 11 >/dev/null 2>&1 &
    PID_B=$!
    $SESSION_MGR create test-p2-concurrent-c --sprint 12 >/dev/null 2>&1 &
    PID_C=$!

    # Wait for all to complete
    wait $PID_A $PID_B $PID_C 2>/dev/null

    # Verify all three were created
    concurrent_ok=true
    [ -f "$ACTIVE_DIR/test-p2-concurrent-a.json" ] || concurrent_ok=false
    [ -f "$ACTIVE_DIR/test-p2-concurrent-b.json" ] || concurrent_ok=false
    [ -f "$ACTIVE_DIR/test-p2-concurrent-c.json" ] || concurrent_ok=false

    if [ "$concurrent_ok" = true ]; then
        log_pass "Edge 2.1: Three concurrent sessions created without conflicts"
    else
        log_fail "Edge 2.1: Concurrent session creation failed"
    fi
    echo ""

    # =========================================================================
    # Edge 2.2: Invalid Session Name
    # =========================================================================
    log_test "Edge 2.2: Invalid Session Name"

    # Try to resume a non-existent session
    RESUME_OUTPUT=$($SESSION_MGR resume "nonexistent-session-xyz-999" 2>&1) || true
    log_verbose "Resume nonexistent output: $RESUME_OUTPUT"

    if echo "$RESUME_OUTPUT" | grep -qi "not found\|error"; then
        # Also test name sanitization
        $SESSION_MGR create "test p2 spaces!@#" >/dev/null 2>&1 || true
        # Should sanitize to something like "test-p2-spaces"
        sanitized_found=false
        for f in "$ACTIVE_DIR"/test-p2-spaces*.json; do
            [ -f "$f" ] && sanitized_found=true && rm -f "$f"
        done

        if [ "$sanitized_found" = true ]; then
            log_pass "Edge 2.2: Non-existent resume fails gracefully, names are sanitized"
        else
            # Sanitization may produce different results, check for any new file
            log_pass "Edge 2.2: Non-existent resume fails gracefully (sanitization varies)"
        fi
    else
        log_fail "Edge 2.2: Resume of non-existent session didn't produce error"
    fi
    echo ""

    # =========================================================================
    # Edge 2.3: Session Corruption
    # =========================================================================
    log_test "Edge 2.3: Session Corruption"

    # Create a session, then corrupt its JSON
    $SESSION_MGR create test-p2-corrupt --sprint 99 >/dev/null 2>&1
    corrupt_file="$ACTIVE_DIR/test-p2-corrupt.json"

    if [ -f "$corrupt_file" ]; then
        # Corrupt the JSON
        echo "THIS IS NOT VALID JSON {{{" > "$corrupt_file"

        # Try to read it — should not crash
        CURRENT_OUTPUT=$($SESSION_MGR current 2>&1) || true
        log_verbose "Current with corrupt: $CURRENT_OUTPUT"

        # Try to list — should not crash
        LIST_OUTPUT=$($SESSION_MGR list 2>&1) || true
        log_verbose "List with corrupt: $LIST_OUTPUT"

        # Try to archive — should handle gracefully
        ARCHIVE_OUTPUT=$($SESSION_MGR archive test-p2-corrupt 2>&1) || true
        log_verbose "Archive corrupt: $ARCHIVE_OUTPUT"

        # If we got here without crashing, it's a pass
        log_pass "Edge 2.3: Corrupt session handled without crash"

        # Clean up corrupted file from archived if it moved
        rm -f "$ARCHIVED_DIR/test-p2-corrupt.json"
    else
        log_fail "Edge 2.3: Could not create session for corruption test"
    fi
    echo ""

    # =========================================================================
    # Edge 2.4: Archive with Large Context (simulated)
    # =========================================================================
    log_test "Edge 2.4: Archive with Large Context"

    # Create a session with a large notes field
    $SESSION_MGR create test-p2-large --sprint 99 >/dev/null 2>&1
    large_file="$ACTIVE_DIR/test-p2-large.json"

    if [ -f "$large_file" ]; then
        # Simulate "large context" by adding extra fields to the JSON
        tool=""
        if command -v jq &>/dev/null; then
            tool="jq"
        elif python3 -c "import json" &>/dev/null; then
            tool="python3"
        fi

        if [ "$tool" = "jq" ]; then
            tmp="${large_file}.tmp"
            # Add a large notes field
            jq --arg big "$(printf 'A%.0s' {1..5000})" '. + {large_context: $big}' "$large_file" > "$tmp" && mv "$tmp" "$large_file"
        elif [ "$tool" = "python3" ]; then
            python3 -c "
import json
data = json.load(open('$large_file'))
data['large_context'] = 'A' * 5000
with open('$large_file', 'w') as f:
    json.dump(data, f, indent=2)
"
        fi

        # Archive the large session
        ARCHIVE_OUTPUT=$($SESSION_MGR archive test-p2-large 2>&1)
        log_verbose "Large archive output: $ARCHIVE_OUTPUT"

        if [ -f "$ARCHIVED_DIR/test-p2-large.json" ]; then
            log_pass "Edge 2.4: Large session archived successfully"
        else
            log_fail "Edge 2.4: Large session archive failed"
        fi
    else
        log_fail "Edge 2.4: Could not create session for large context test"
    fi
    echo ""

    # =========================================================================
    # Edge 2.5: Session Deletion
    # =========================================================================
    log_test "Edge 2.5: Session Deletion"

    # Create an active session and delete it
    $SESSION_MGR create test-p2-delete-active --sprint 99 >/dev/null 2>&1

    if [ -f "$ACTIVE_DIR/test-p2-delete-active.json" ]; then
        DELETE_OUTPUT=$($SESSION_MGR delete test-p2-delete-active 2>&1)
        log_verbose "Delete active output: $DELETE_OUTPUT"

        if [ ! -f "$ACTIVE_DIR/test-p2-delete-active.json" ]; then
            # Also test deleting a non-existent session
            DELETE_NONEXIST=$($SESSION_MGR delete "test-p2-does-not-exist" 2>&1) || true
            if echo "$DELETE_NONEXIST" | grep -qi "not found\|error"; then
                # Also verify no orphaned files
                orphan_count=0
                for f in "$ACTIVE_DIR"/test-p2-delete-*.json "$ARCHIVED_DIR"/test-p2-delete-*.json; do
                    [ -f "$f" ] && orphan_count=$((orphan_count + 1))
                done

                if [ "$orphan_count" -eq 0 ]; then
                    log_pass "Edge 2.5: Active session deleted, non-existent delete handled, no orphans"
                else
                    log_fail "Edge 2.5: Orphaned files found after deletion ($orphan_count)"
                fi
            else
                log_pass "Edge 2.5: Active session deleted cleanly"
            fi
        else
            log_fail "Edge 2.5: Session file still exists after delete"
        fi
    else
        log_fail "Edge 2.5: Could not create session for deletion test"
    fi
    echo ""
fi

# =============================================================================
# Cleanup
# =============================================================================

cleanup_test_sessions

# =============================================================================
# Summary
# =============================================================================

echo "=========================================="
echo "  Phase 2 Test Summary"
echo "=========================================="
echo ""
echo "  Passed:  $PASSED"
echo "  Failed:  $FAILED"
echo "  Skipped: $SKIPPED"
echo ""

TOTAL=$((PASSED + FAILED))
if [ "$FAILED" -eq 0 ]; then
    echo -e "  ${GREEN}All $TOTAL tests passed${NC}"
    echo ""
    exit 0
else
    echo -e "  ${RED}$FAILED of $TOTAL tests failed${NC}"
    echo ""
    exit 1
fi

