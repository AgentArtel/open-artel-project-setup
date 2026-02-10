#!/usr/bin/env bash
# =============================================================================
# Open Artel — Git Hooks Test Script
# =============================================================================
#
# Comprehensive test suite for Git hooks and Kimi Code CLI integration.
# Tests installation, commit parsing, action routing, and full workflow cycle.
#
# Usage:
#   ./scripts/test-git-hooks.sh           # Run all tests
#   ./scripts/test-git-hooks.sh --verbose # Show detailed output
#   ./scripts/test-git-hooks.sh --quick  # Skip live Kimi API calls
#
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Load .env file if it exists
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Test configuration
VERBOSE="${VERBOSE:-false}"
QUICK="${QUICK:-false}"
TEST_DIR=".ai/test-hooks-tmp"
HOOK_LOG=".git/hooks/post-commit.log"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_SKIPPED=0

# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------

log_info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
log_success() { echo -e "${GREEN}[PASS]${NC} $*"; TESTS_PASSED=$((TESTS_PASSED + 1)); }
log_fail()    { echo -e "${RED}[FAIL]${NC} $*"; TESTS_FAILED=$((TESTS_FAILED + 1)); }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_skip()    { echo -e "${CYAN}[SKIP]${NC} $*"; TESTS_SKIPPED=$((TESTS_SKIPPED + 1)); }
log_test()    { echo -e "\n${CYAN}━━━ Test: $* ━━━${NC}"; }

run_test() {
    local test_name="$1"
    shift
    log_test "$test_name"
    if [ "$VERBOSE" = "true" ]; then
        "$@" && log_success "$test_name" || log_fail "$test_name"
    else
        "$@" >/dev/null 2>&1 && log_success "$test_name" || log_fail "$test_name"
    fi
}

# ---------------------------------------------------------------------------
# Test Functions
# ---------------------------------------------------------------------------

test_env_file() {
    log_info "Checking .env file..."
    if [ -f .env ]; then
        if grep -q "KIMI_API_KEY" .env; then
            log_success ".env file exists with KIMI_API_KEY"
            if [ "$VERBOSE" = "true" ]; then
                log_info "API key found (value hidden for security)"
            fi
            return 0
        else
            log_fail ".env file exists but KIMI_API_KEY not found"
            return 1
        fi
    else
        log_fail ".env file not found"
        return 1
    fi
}

test_gitignore_env() {
    log_info "Checking .gitignore excludes .env..."
    if grep -q "^\.env$" .gitignore 2>/dev/null; then
        log_success ".env is in .gitignore"
        return 0
    else
        log_warn ".env is NOT in .gitignore (security risk)"
        return 1
    fi
}

test_kimi_cli_installed() {
    log_info "Checking Kimi Code CLI installation..."
    if command -v kimi &>/dev/null; then
        local version
        version="$(kimi --version 2>/dev/null || echo 'unknown')"
        log_success "Kimi Code CLI installed: $version"
        return 0
    else
        log_fail "Kimi Code CLI not found (install with: pipx install kimi-cli)"
        return 1
    fi
}

test_kimi_api_key() {
    log_info "Testing Kimi API key authentication..."
    
    if [ -z "${KIMI_API_KEY:-}" ]; then
        log_fail "KIMI_API_KEY environment variable not set"
        return 1
    fi

    if [ "$QUICK" = "true" ]; then
        log_skip "Kimi API test (--quick mode)"
        return 0
    fi

    # Test with a simple print mode call
    local test_output
    test_output=$(export KIMI_API_KEY="$KIMI_API_KEY" && \
        kimi --print -p "Say 'test successful' if you can read this." 2>&1 || true)

    if echo "$test_output" | grep -qi "test successful\|successful"; then
        log_success "Kimi API key works — API responded"
        return 0
    elif echo "$test_output" | grep -qi "LLM not set\|not configured\|authentication"; then
        log_fail "Kimi API key not configured — need to run 'kimi' then '/login'"
        if [ "$VERBOSE" = "true" ]; then
            log_info "Output: $test_output"
        fi
        return 1
    else
        log_warn "Kimi API test inconclusive"
        if [ "$VERBOSE" = "true" ]; then
            log_info "Output: $test_output"
        fi
        return 1
    fi
}

test_hook_installed() {
    log_info "Checking post-commit hook installation..."
    if [ -f .git/hooks/post-commit ]; then
        if [ -x .git/hooks/post-commit ]; then
            log_success "post-commit hook installed and executable"
            return 0
        else
            log_fail "post-commit hook exists but not executable"
            return 1
        fi
    else
        log_warn "post-commit hook not installed (run: ./scripts/install-git-hooks.sh)"
        return 1
    fi
}

test_hook_syntax() {
    log_info "Checking hook syntax..."
    if bash -n .git/hooks/post-commit 2>/dev/null; then
        log_success "Hook syntax is valid"
        return 0
    else
        log_fail "Hook syntax error"
        return 1
    fi
}

test_commit_parsing() {
    log_info "Testing commit message parsing..."

    # Create a test commit message
    local test_msg="[AGENT:cursor] [ACTION:submit] [TASK:TEST-001] Test commit"
    
    # Extract using the same logic as the hook
    local agent action task
    agent="$(echo "$test_msg" | sed -n 's/.*\[AGENT:\([a-zA-Z0-9_]*\)\].*/\1/p' | head -1)"
    action="$(echo "$test_msg" | sed -n 's/.*\[ACTION:\([a-zA-Z0-9_]*\)\].*/\1/p' | head -1)"
    task="$(echo "$test_msg" | sed -n 's/.*\[TASK:\([a-zA-Z0-9_-]*\)\].*/\1/p' | head -1)"

    if [ "$agent" = "cursor" ] && [ "$action" = "submit" ] && [ "$task" = "TEST-001" ]; then
        log_success "Commit parsing works: AGENT=$agent, ACTION=$action, TASK=$task"
        return 0
    else
        log_fail "Commit parsing failed: AGENT=$agent, ACTION=$action, TASK=$task"
        return 1
    fi
}

test_action_routing() {
    log_info "Testing action routing (dry-run mode)..."

    # Create test directory
    mkdir -p "$TEST_DIR"
    
    # Test submit action
    export OPEN_ARTEL_DRY_RUN=true
    echo "# Test submit" > "$TEST_DIR/test-submit.md"
    git add "$TEST_DIR/test-submit.md" >/dev/null 2>&1 || true
    
    git commit -m "[AGENT:cursor] [ACTION:submit] [TASK:TEST-SUBMIT] Test submit action" >/dev/null 2>&1 || true
    
    # Check log for submit action
    if grep -q "ACTION: submit" "$HOOK_LOG" 2>/dev/null; then
        log_success "submit action routed correctly"
    else
        log_fail "submit action not routed"
    fi

    # Test approve action
    echo "# Test approve" >> "$TEST_DIR/test-submit.md"
    git add "$TEST_DIR/test-submit.md" >/dev/null 2>&1 || true
    git commit -m "[AGENT:kimi] [ACTION:approve] [TASK:TEST-SUBMIT] Test approve action" >/dev/null 2>&1 || true
    
    if grep -q "ACTION: approve" "$HOOK_LOG" 2>/dev/null; then
        log_success "approve action routed correctly"
    else
        log_fail "approve action not routed"
    fi

    # Test report action
    echo "# Test report" >> "$TEST_DIR/test-submit.md"
    git add "$TEST_DIR/test-submit.md" >/dev/null 2>&1 || true
    git commit -m "[AGENT:kimi] [ACTION:report] [TASK:TEST-REPORT] Test report action" >/dev/null 2>&1 || true
    
    if grep -q "ACTION: report" "$HOOK_LOG" 2>/dev/null; then
        log_success "report action routed correctly"
    else
        log_fail "report action not routed"
    fi

    # Test skip action (update)
    echo "# Test skip" >> "$TEST_DIR/test-submit.md"
    git add "$TEST_DIR/test-submit.md" >/dev/null 2>&1 || true
    git commit -m "[AGENT:claude] [ACTION:update] [TASK:TEST-UPDATE] Test update action" >/dev/null 2>&1 || true
    
    if grep -q "ACTION: update" "$HOOK_LOG" 2>/dev/null; then
        log_success "update action logged (correctly skipped automation)"
    else
        log_fail "update action not logged"
    fi

    unset OPEN_ARTEL_DRY_RUN
}

test_live_kimi_integration() {
    log_info "Testing live Kimi integration (requires API key)..."

    if [ "$QUICK" = "true" ]; then
        log_skip "Live Kimi integration test (--quick mode)"
        return 0
    fi

    if [ -z "${KIMI_API_KEY:-}" ]; then
        log_skip "Live Kimi test (KIMI_API_KEY not set)"
        return 0
    fi

    # Create a test commit with submit action
    mkdir -p "$TEST_DIR"
    echo "# Live test" > "$TEST_DIR/test-live.md"
    git add "$TEST_DIR/test-live.md" >/dev/null 2>&1 || true
    
    # Commit with submit action (this will trigger the hook)
    git commit -m "[AGENT:cursor] [ACTION:submit] [TASK:TEST-LIVE] Live Kimi integration test" >/dev/null 2>&1 || true

    # Wait a moment for async hook to run
    sleep 2

    # Check if Kimi was invoked (look for non-dry-run log entries)
    if grep -q "Running: Review" "$HOOK_LOG" 2>/dev/null; then
        # Check if it was a real call (not dry-run)
        if ! grep -q "DRY RUN" "$HOOK_LOG" | tail -1; then
            log_success "Live Kimi integration — hook invoked Kimi (check log for results)"
        else
            log_warn "Hook invoked but in dry-run mode"
        fi
    else
        log_fail "Hook did not invoke Kimi"
    fi
}

test_install_script() {
    log_info "Testing installation script..."

    if [ -f scripts/install-git-hooks.sh ]; then
        if bash -n scripts/install-git-hooks.sh 2>/dev/null; then
            log_success "install-git-hooks.sh syntax valid"
            
            # Test --status command
            if ./scripts/install-git-hooks.sh --status >/dev/null 2>&1; then
                log_success "install-git-hooks.sh --status works"
            else
                log_fail "install-git-hooks.sh --status failed"
            fi
        else
            log_fail "install-git-hooks.sh syntax error"
            return 1
        fi
    else
        log_fail "install-git-hooks.sh not found"
        return 1
    fi
}

test_starter_kit_files() {
    log_info "Testing starter kit files..."

    local all_ok=true

    if [ -f setups/multi-agent-starter/scripts/post-commit.template ]; then
        if bash -n setups/multi-agent-starter/scripts/post-commit.template 2>/dev/null; then
            log_success "post-commit.template syntax valid"
        else
            log_fail "post-commit.template syntax error"
            all_ok=false
        fi
    else
        log_fail "post-commit.template not found"
        all_ok=false
    fi

    if [ -f setups/multi-agent-starter/scripts/install-git-hooks.sh ]; then
        if bash -n setups/multi-agent-starter/scripts/install-git-hooks.sh 2>/dev/null; then
            log_success "starter install-git-hooks.sh syntax valid"
        else
            log_fail "starter install-git-hooks.sh syntax error"
            all_ok=false
        fi
    else
        log_fail "starter install-git-hooks.sh not found"
        all_ok=false
    fi

    if [ "$all_ok" = "true" ]; then
        return 0
    else
        return 1
    fi
}

# ---------------------------------------------------------------------------
# Main test runner
# ---------------------------------------------------------------------------

main() {
    echo ""
    echo "========================================="
    echo "  Open Artel — Git Hooks Test Suite"
    echo "========================================="
    echo ""
    if [ "$QUICK" = "true" ]; then
        echo "  Mode: Quick (skipping live API tests)"
    else
        echo "  Mode: Full"
    fi
    echo "  Verbose: ${VERBOSE:-false}"
    echo ""

    # Clean up previous test files
    if [ -d "$TEST_DIR" ]; then
        rm -rf "$TEST_DIR"
    fi
    mkdir -p "$TEST_DIR"

    # Run tests
    run_test "Environment file" test_env_file
    run_test "Gitignore .env" test_gitignore_env
    run_test "Kimi CLI installed" test_kimi_cli_installed
    run_test "Kimi API key" test_kimi_api_key
    run_test "Hook installed" test_hook_installed
    run_test "Hook syntax" test_hook_syntax
    run_test "Commit parsing" test_commit_parsing
    run_test "Action routing" test_action_routing
    run_test "Live Kimi integration" test_live_kimi_integration
    run_test "Install script" test_install_script
    run_test "Starter kit files" test_starter_kit_files

    # Summary
    echo ""
    echo "========================================="
    echo "  Test Summary"
    echo "========================================="
    echo ""
    echo "  Passed:  $TESTS_PASSED"
    echo "  Failed:  $TESTS_FAILED"
    echo "  Skipped: $TESTS_SKIPPED"
    echo ""

    # Clean up temp test directory
    if [ -d "$TEST_DIR" ]; then
        rm -rf "$TEST_DIR"
    fi

    if [ $TESTS_FAILED -eq 0 ]; then
        log_success "All tests passed!"
        echo ""
        log_info "Next steps:"
        log_info "  1. Authenticate Kimi CLI: kimi then /login"
        log_info "  2. Make a test commit with routing headers"
        log_info "  3. Check .git/hooks/post-commit.log for automation results"
        echo ""
        return 0
    else
        log_fail "Some tests failed. Check output above for details."
        echo ""
        return 1
    fi
}

# Parse arguments
case "${1:-}" in
    --verbose|-v)
        VERBOSE=true
        shift
        ;;
    --quick|-q)
        QUICK=true
        shift
        ;;
    --help|-h)
        echo "Usage: $0 [--verbose|--quick|--help]"
        echo ""
        echo "  --verbose, -v   Show detailed test output"
        echo "  --quick, -q     Skip live API tests"
        echo "  --help, -h       Show this help"
        exit 0
        ;;
esac

# Run main
main "$@"

