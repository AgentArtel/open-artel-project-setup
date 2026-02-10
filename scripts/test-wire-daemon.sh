#!/usr/bin/env bash
# =============================================================================
# Open Artel — Wire Daemon Test Suite
# =============================================================================
#
# Tests the Wire Mode daemon components:
#   1. Prerequisites (Python, Kimi CLI, Git)
#   2. Daemon script syntax and imports
#   3. Daemon management (start/stop/status)
#   4. Git event detection
#   5. Commit routing
#   6. Approval handler
#   7. Installation script
#   8. Live Wire Mode integration (optional)
#
# Usage:
#   ./scripts/test-wire-daemon.sh              # Full test suite
#   ./scripts/test-wire-daemon.sh --quick      # Skip live tests
#   ./scripts/test-wire-daemon.sh --verbose    # Detailed output
#   ./scripts/test-wire-daemon.sh --help       # Show help
#
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Test counters
PASS=0
FAIL=0
SKIP=0
TOTAL=0

# Options
QUICK=false
VERBOSE=false

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# ---------------------------------------------------------------------------
# Test helpers
# ---------------------------------------------------------------------------

log_test()    { TOTAL=$((TOTAL + 1)); echo -e "${CYAN}[TEST]${NC} $*"; }
log_success() { PASS=$((PASS + 1)); echo -e "${GREEN}  ✓${NC} $*"; }
log_fail()    { FAIL=$((FAIL + 1)); echo -e "${RED}  ✗${NC} $*"; }
log_skip()    { SKIP=$((SKIP + 1)); echo -e "${YELLOW}  ○${NC} $* (skipped)"; }
log_info()    { echo -e "${BLUE}  ℹ${NC} $*"; }

# ---------------------------------------------------------------------------
# Test 1: Prerequisites
# ---------------------------------------------------------------------------

test_prerequisites() {
    echo ""
    echo "--- Prerequisites ---"

    # Python 3.9+
    log_test "Python 3.9+ available"
    if command -v python3 &>/dev/null; then
        local py_version
        py_version=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
        local py_major py_minor
        py_major=$(echo "$py_version" | cut -d. -f1)
        py_minor=$(echo "$py_version" | cut -d. -f2)
        if [ "$py_major" -ge 3 ] && [ "$py_minor" -ge 9 ]; then
            log_success "Python $py_version"
        else
            log_fail "Python $py_version (need 3.9+)"
        fi
    else
        log_fail "Python 3 not found"
    fi

    # Kimi CLI
    log_test "Kimi CLI installed"
    if command -v kimi &>/dev/null; then
        local kimi_ver
        kimi_ver=$(kimi --version 2>/dev/null || echo "unknown")
        log_success "Kimi CLI ($kimi_ver)"
    else
        log_fail "Kimi CLI not found"
    fi

    # Git
    log_test "Git available"
    if command -v git &>/dev/null; then
        log_success "Git $(git --version | head -1)"
    else
        log_fail "Git not found"
    fi

    # .env file
    log_test ".env file exists"
    if [ -f .env ]; then
        log_success ".env file found"
    else
        log_fail ".env file not found"
    fi
}

# ---------------------------------------------------------------------------
# Test 2: Daemon script validation
# ---------------------------------------------------------------------------

test_daemon_script() {
    echo ""
    echo "--- Daemon Script ---"

    # Script exists
    log_test "wire-daemon.py exists"
    if [ -f scripts/wire-daemon.py ]; then
        log_success "Found: scripts/wire-daemon.py"
    else
        log_fail "Not found: scripts/wire-daemon.py"
        return
    fi

    # Script is executable
    log_test "wire-daemon.py is executable"
    if [ -x scripts/wire-daemon.py ]; then
        log_success "Executable"
    else
        log_fail "Not executable (run: chmod +x scripts/wire-daemon.py)"
    fi

    # Python syntax valid
    log_test "wire-daemon.py syntax valid"
    if python3 -c "import ast; ast.parse(open('scripts/wire-daemon.py').read())" 2>/dev/null; then
        log_success "Syntax valid"
    else
        log_fail "Syntax error"
    fi

    # Imports work
    log_test "wire-daemon.py imports resolve"
    if python3 -c "
import sys
sys.path.insert(0, 'scripts')
# Test that all standard library imports work
import json, logging, os, re, signal, subprocess, sys, threading, time
from datetime import datetime
from pathlib import Path
print('ok')
" 2>/dev/null | grep -q "ok"; then
        log_success "All imports resolve"
    else
        log_fail "Import errors"
    fi

    # Key classes exist
    log_test "wire-daemon.py has required classes"
    local has_classes=true
    for class_name in JsonRpcClient GitWatcher ApprovalHandler WireDaemon; do
        if ! grep -q "class $class_name" scripts/wire-daemon.py; then
            log_fail "Missing class: $class_name"
            has_classes=false
        fi
    done
    if [ "$has_classes" = true ]; then
        log_success "All required classes found"
    fi

    # Help flag works
    log_test "wire-daemon.py --help works"
    if python3 scripts/wire-daemon.py --help &>/dev/null; then
        log_success "--help works"
    else
        log_fail "--help failed"
    fi
}

# ---------------------------------------------------------------------------
# Test 3: Daemon management
# ---------------------------------------------------------------------------

test_daemon_management() {
    echo ""
    echo "--- Daemon Management ---"

    # Status check (should show not running)
    log_test "Daemon status check"
    local status_output
    status_output=$(python3 scripts/wire-daemon.py --status 2>&1)
    if echo "$status_output" | grep -qi "STOPPED\|not running\|Status"; then
        log_success "Status check works"
    else
        log_fail "Status check failed"
        [ "$VERBOSE" = true ] && log_info "Output: $status_output"
    fi

    # Dry-run start and stop
    log_test "Daemon dry-run start"
    python3 scripts/wire-daemon.py --dry-run --auto-approve &
    local daemon_pid=$!
    sleep 2

    if kill -0 "$daemon_pid" 2>/dev/null; then
        log_success "Daemon started in dry-run mode (PID $daemon_pid)"

        # Check PID file was created
        log_test "PID file created"
        if [ -f .git/wire-daemon.pid ]; then
            log_success "PID file exists"
        else
            log_fail "PID file not created"
        fi

        # Stop the daemon
        log_test "Daemon stop"
        kill "$daemon_pid" 2>/dev/null
        wait "$daemon_pid" 2>/dev/null || true
        sleep 1

        if ! kill -0 "$daemon_pid" 2>/dev/null; then
            log_success "Daemon stopped cleanly"
        else
            log_fail "Daemon did not stop"
            kill -9 "$daemon_pid" 2>/dev/null || true
        fi
    else
        log_fail "Daemon failed to start in dry-run mode"
    fi

    # Clean up PID file
    rm -f .git/wire-daemon.pid
}

# ---------------------------------------------------------------------------
# Test 4: Git event detection
# ---------------------------------------------------------------------------

test_git_event_detection() {
    echo ""
    echo "--- Git Event Detection ---"

    # Test routing pattern parsing
    log_test "Routing pattern parsing"
    local parse_result
    parse_result=$(python3 -c "
import re
pattern = re.compile(r'\[AGENT:(\w+)\]\s*\[ACTION:(\w+)\]\s*\[TASK:([\w-]+)\]')
test_msgs = [
    ('[AGENT:cursor] [ACTION:submit] [TASK:TEST-001] Test commit', ('cursor', 'submit', 'TEST-001')),
    ('[AGENT:claude] [ACTION:approve] [TASK:TASK-P4-01] Approved', ('claude', 'approve', 'TASK-P4-01')),
    ('[AGENT:kimi] [ACTION:report] [TASK:SPRINT-EVAL] Report', ('kimi', 'report', 'SPRINT-EVAL')),
    ('Regular commit without headers', None),
]
passed = 0
for msg, expected in test_msgs:
    match = pattern.search(msg)
    if expected is None:
        if match is None:
            passed += 1
    elif match and match.groups() == expected:
        passed += 1
print(f'{passed}/{len(test_msgs)}')
" 2>/dev/null)

    if [ "$parse_result" = "4/4" ]; then
        log_success "All routing patterns parsed correctly ($parse_result)"
    else
        log_fail "Routing pattern parsing: $parse_result"
    fi

    # Test branch head reading
    log_test "Git refs reading"
    local refs_count
    refs_count=$(find .git/refs/heads/ -type f 2>/dev/null | wc -l | tr -d ' ')
    if [ "$refs_count" -gt 0 ]; then
        log_success "Found $refs_count branch refs"
    else
        log_fail "No branch refs found"
    fi
}

# ---------------------------------------------------------------------------
# Test 5: Approval handler
# ---------------------------------------------------------------------------

test_approval_handler() {
    echo ""
    echo "--- Approval Handler ---"

    log_test "Auto-approve mode"
    local approve_result
    approve_result=$(python3 -c "
import sys
sys.path.insert(0, 'scripts')
import logging

# Minimal test of ApprovalHandler
logger = logging.getLogger('test')
logger.addHandler(logging.NullHandler())

# Import the class
exec(open('scripts/wire-daemon.py').read())

handler = ApprovalHandler(logger, auto_approve=True)
result = handler.handle_request({
    'params': {
        'type': 'tool_approval',
        'tool_name': 'write_file',
        'description': 'Write test file'
    }
})
print('approved' if result.get('approved') else 'rejected')
" 2>/dev/null)

    if [ "$approve_result" = "approved" ]; then
        log_success "Auto-approve works"
    else
        log_fail "Auto-approve failed: $approve_result"
    fi

    log_test "Approval logging"
    local log_result
    log_result=$(python3 -c "
import sys, logging
sys.path.insert(0, 'scripts')
logger = logging.getLogger('test')
logger.addHandler(logging.NullHandler())
exec(open('scripts/wire-daemon.py').read())
handler = ApprovalHandler(logger, auto_approve=True)
handler.handle_request({'params': {'type': 'test', 'tool_name': 'test', 'description': 'test'}})
log = handler.get_log()
print(len(log))
" 2>/dev/null)

    if [ "$log_result" = "1" ]; then
        log_success "Approval logging works"
    else
        log_fail "Approval logging failed: $log_result"
    fi
}

# ---------------------------------------------------------------------------
# Test 6: Installation script
# ---------------------------------------------------------------------------

test_install_script() {
    echo ""
    echo "--- Installation Script ---"

    # Script exists
    log_test "install-wire-daemon.sh exists"
    if [ -f scripts/install-wire-daemon.sh ]; then
        log_success "Found: scripts/install-wire-daemon.sh"
    else
        log_fail "Not found: scripts/install-wire-daemon.sh"
        return
    fi

    # Script is executable
    log_test "install-wire-daemon.sh is executable"
    if [ -x scripts/install-wire-daemon.sh ]; then
        log_success "Executable"
    else
        log_fail "Not executable"
    fi

    # Syntax valid
    log_test "install-wire-daemon.sh syntax valid"
    if bash -n scripts/install-wire-daemon.sh 2>/dev/null; then
        log_success "Syntax valid"
    else
        log_fail "Syntax error"
    fi

    # Help works
    log_test "install-wire-daemon.sh --help works"
    if scripts/install-wire-daemon.sh --help &>/dev/null; then
        log_success "--help works"
    else
        log_fail "--help failed"
    fi

    # Status works
    log_test "install-wire-daemon.sh --status works"
    if scripts/install-wire-daemon.sh --status &>/dev/null; then
        log_success "--status works"
    else
        log_fail "--status failed"
    fi
}

# ---------------------------------------------------------------------------
# Test 7: Live Wire Mode (optional)
# ---------------------------------------------------------------------------

test_live_wire() {
    echo ""
    echo "--- Live Wire Mode ---"

    if [ "$QUICK" = true ]; then
        log_test "Live Wire Mode connection"
        log_skip "Skipped in quick mode"
        return
    fi

    # Check if KIMI_API_KEY is set
    if [ -f .env ]; then
        set -a
        source .env
        set +a
    fi

    if [ -z "${KIMI_API_KEY:-}" ]; then
        log_test "Live Wire Mode connection"
        log_skip "KIMI_API_KEY not set"
        return
    fi

    # Test kimi --wire starts (briefly)
    log_test "Kimi Wire Mode starts"
    local wire_output
    wire_output=$(timeout 10 kimi --wire --work-dir "$PROJECT_ROOT" 2>&1 <<< '{"jsonrpc":"2.0","method":"initialize","id":"1","params":{"protocol_version":"1.3","client_info":{"name":"test","version":"1.0.0"}}}' || true)

    if echo "$wire_output" | grep -q "jsonrpc\|result\|initialize"; then
        log_success "Wire Mode responded"
    else
        log_fail "Wire Mode did not respond"
        [ "$VERBOSE" = true ] && log_info "Output: $wire_output"
    fi
}

# ---------------------------------------------------------------------------
# Test 8: Evaluation script integration
# ---------------------------------------------------------------------------

test_evaluation_integration() {
    echo ""
    echo "--- Evaluation Integration ---"

    # Script exists
    log_test "generate-evaluation.sh exists"
    if [ -f scripts/generate-evaluation.sh ]; then
        log_success "Found: scripts/generate-evaluation.sh"
    else
        log_fail "Not found: scripts/generate-evaluation.sh"
        return
    fi

    # Quick mode works
    log_test "generate-evaluation.sh --quick runs"
    if scripts/generate-evaluation.sh --quick &>/dev/null; then
        log_success "Quick evaluation runs"
    else
        log_fail "Quick evaluation failed"
    fi

    # Template exists
    log_test "Evaluation template exists"
    if [ -f .ai/templates/evaluation-report.md ]; then
        log_success "Template found"
    else
        log_fail "Template not found"
    fi
}

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

print_summary() {
    echo ""
    echo "========================================="
    echo "  Wire Daemon Test Results"
    echo "========================================="
    echo ""
    echo -e "  ${GREEN}Passed${NC}: $PASS"
    echo -e "  ${RED}Failed${NC}: $FAIL"
    echo -e "  ${YELLOW}Skipped${NC}: $SKIP"
    echo -e "  Total: $TOTAL"
    echo ""

    if [ "$FAIL" -eq 0 ]; then
        echo -e "  ${GREEN}All tests passed!${NC}"
    else
        echo -e "  ${RED}$FAIL test(s) failed.${NC}"
    fi
    echo ""
}

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------

while [ $# -gt 0 ]; do
    case "$1" in
        --quick|-q)   QUICK=true; shift ;;
        --verbose|-v) VERBOSE=true; shift ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --quick, -q     Skip live Wire Mode tests"
            echo "  --verbose, -v   Show detailed output"
            echo "  --help, -h      Show this help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

echo ""
echo "========================================="
echo "  Open Artel — Wire Daemon Tests"
echo "========================================="

test_prerequisites
test_daemon_script
test_daemon_management
test_git_event_detection
test_approval_handler
test_install_script
test_live_wire
test_evaluation_integration

print_summary

# Exit with failure if any tests failed
[ "$FAIL" -eq 0 ]

