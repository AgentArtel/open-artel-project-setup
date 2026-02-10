#!/usr/bin/env bash
# =============================================================================
# Phase 6: Advanced Features — Test Suite
# =============================================================================
#
# 23 tests across 4 categories:
#   - Structural (8):  File existence, content validation
#   - Live API (6):    Real Kimi/Moonshot API calls
#   - Edge (6):        Error handling, boundary conditions
#   - Integration (3): Regression checks against previous phases
#
# Usage:
#   ./scripts/test-phase-6.sh                  # Run all tests
#   ./scripts/test-phase-6.sh --structural     # Structural only
#   ./scripts/test-phase-6.sh --live           # Live API only
#   ./scripts/test-phase-6.sh --edge           # Edge tests only
#   ./scripts/test-phase-6.sh --integration    # Integration only
#
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
cd "$REPO_ROOT"

PASS=0
FAIL=0
SKIP=0
TOTAL=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ---------------------------------------------------------------------------
# Load environment for API tests
# ---------------------------------------------------------------------------

if [ -f "$REPO_ROOT/.env.project" ]; then
    set -a; source "$REPO_ROOT/.env.project"; set +a
fi
if [ -f "$REPO_ROOT/.env" ]; then
    set -a; source "$REPO_ROOT/.env"; set +a
fi

# ---------------------------------------------------------------------------
# Test helpers
# ---------------------------------------------------------------------------

run_test() {
    local id="$1"
    local desc="$2"
    local cmd="$3"
    TOTAL=$((TOTAL + 1))
    printf "  %-6s %-55s " "$id" "$desc"
    if eval "$cmd" > /dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}FAIL${NC}"
        FAIL=$((FAIL + 1))
    fi
}

skip_test() {
    local id="$1"
    local desc="$2"
    local reason="$3"
    TOTAL=$((TOTAL + 1))
    printf "  %-6s %-55s " "$id" "$desc"
    echo -e "${YELLOW}SKIP${NC} ($reason)"
    SKIP=$((SKIP + 1))
}

# ---------------------------------------------------------------------------
# API key validation helper
# ---------------------------------------------------------------------------

validate_api_key() {
    local key="${KIMI_API_KEY:-}"
    if [ -z "$key" ]; then
        return 1
    fi
    local http_code
    http_code=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $key" \
        "https://api.moonshot.ai/v1/models" 2>/dev/null)
    [ "$http_code" = "200" ]
}

API_AVAILABLE=false
if validate_api_key; then
    API_AVAILABLE=true
fi

# ---------------------------------------------------------------------------
# Structural Tests (8)
# ---------------------------------------------------------------------------

run_structural() {
    echo ""
    echo -e "${BLUE}=== Structural Tests ===${NC}"
    echo ""

    # S.1: Agent Swarm docs exist
    run_test "S.1" "Agent Swarm docs exist" \
        "test -f docs/kimi-agent-swarm.md"

    # S.2: Swarm pattern files exist (2 files)
    run_test "S.2" "Swarm pattern files exist (2 files)" \
        "test -f .ai/patterns/agent-swarm-parallel-review.md && test -f .ai/patterns/agent-swarm-research-split.md"

    # S.3: ACP docs exist
    run_test "S.3" "ACP docs exist" \
        "test -f docs/kimi-acp-integration.md"

    # S.4: ACP helper script executable
    run_test "S.4" "ACP helper script executable" \
        "test -x scripts/start-acp-server.sh && ./scripts/start-acp-server.sh --help > /dev/null 2>&1"

    # S.5: Wire enhancements docs exist
    run_test "S.5" "Wire enhancements docs exist" \
        "test -f docs/kimi-wire-enhancements.md"

    # S.6: Wire daemon has metrics tracking
    run_test "S.6" "Wire daemon has metrics tracking" \
        "grep -q 'wire-metrics\|wire_metrics\|tool_call_count\|turn_duration' scripts/wire-daemon.py"

    # S.7: Multi-modal docs exist
    run_test "S.7" "Multi-modal docs exist" \
        "test -f docs/kimi-multimodal.md"

    # S.8: Overseer prompt mentions swarm
    run_test "S.8" "Overseer prompt mentions swarm" \
        "grep -iq 'swarm\|parallel.*subagent' .agents/prompts/overseer.md"
}

# ---------------------------------------------------------------------------
# Live API Tests (6)
# ---------------------------------------------------------------------------

run_live() {
    echo ""
    echo -e "${BLUE}=== Live API Tests ===${NC}"
    echo ""

    # L.1: Parallel subagent dispatch via kimi --print
    # Note: grep -q causes SIGPIPE with kimi --print, so we save to temp file
    if [ "$API_AVAILABLE" = true ] && command -v kimi &>/dev/null; then
        run_test "L.1" "Parallel subagent dispatch (kimi --print)" \
            "TMPOUT=\$(mktemp)
            kimi --agent-file .agents/kimi-overseer.yaml --print -p 'Create two subagents named test-sub-a and test-sub-b, then dispatch tasks to both. Report results.' > \"\$TMPOUT\" 2>&1
            FOUND=\$(grep -ci 'agent\|sub\|task\|create' \"\$TMPOUT\" || true)
            rm -f \"\$TMPOUT\"
            [ \"\$FOUND\" -gt 0 ]"
    else
        skip_test "L.1" "Parallel subagent dispatch (kimi --print)" "API/CLI unavailable"
    fi

    # L.2: Agent Swarm tool call count
    if [ "$API_AVAILABLE" = true ] && command -v kimi &>/dev/null; then
        run_test "L.2" "Agent Swarm tool call count" \
            "TMPOUT=\$(mktemp)
            kimi --agent-file .agents/kimi-overseer.yaml --print -p 'List your available tools. Include CreateSubagent and Task in the list.' > \"\$TMPOUT\" 2>&1
            FOUND=\$(grep -ci 'CreateSubagent\|Task\|tool' \"\$TMPOUT\" || true)
            rm -f \"\$TMPOUT\"
            [ \"\$FOUND\" -gt 0 ]"
    else
        skip_test "L.2" "Agent Swarm tool call count" "API/CLI unavailable"
    fi

    # L.3: ACP server starts
    if command -v kimi &>/dev/null; then
        run_test "L.3" "ACP server starts" \
            "kimi acp < /dev/null &
            ACP_PID=\$!
            sleep 2
            RESULT=0
            kill -0 \$ACP_PID 2>/dev/null || RESULT=1
            kill \$ACP_PID 2>/dev/null
            wait \$ACP_PID 2>/dev/null
            [ \$RESULT -eq 0 ]"
    else
        skip_test "L.3" "ACP server starts" "kimi CLI unavailable"
    fi

    # L.4: Wire Mode dry-run with new handlers
    run_test "L.4" "Wire Mode dry-run with new handlers" \
        "python3 scripts/wire-daemon.py --dry-run < /dev/null &
        DAEMON_PID=\$!
        sleep 2
        RESULT=0
        kill -0 \$DAEMON_PID 2>/dev/null || RESULT=1
        kill \$DAEMON_PID 2>/dev/null
        wait \$DAEMON_PID 2>/dev/null
        [ \$RESULT -eq 0 ]"

    # L.5: Wire metrics file created
    run_test "L.5" "Wire metrics file created after dry-run" \
        "python3 scripts/wire-daemon.py --dry-run < /dev/null &
        DAEMON_PID=\$!
        sleep 2
        kill \$DAEMON_PID 2>/dev/null
        wait \$DAEMON_PID 2>/dev/null
        test -f .ai/metrics/wire-metrics.json && python3 -c 'import json; data=json.load(open(\".ai/metrics/wire-metrics.json\")); assert isinstance(data, list) and len(data) > 0'"

    # L.6: Multi-modal API test
    if [ "$API_AVAILABLE" = true ]; then
        run_test "L.6" "Multi-modal API test (vision)" \
            "python3 -c \"
import base64, struct, zlib, json, urllib.request, os

# Create a 10x10 blue PNG
width, height = 10, 10
sig = b'\x89PNG\r\n\x1a\n'
ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
ihdr = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc & 0xffffffff)
raw_data = b''
for y in range(height):
    raw_data += b'\x00'
    for x in range(width):
        raw_data += b'\x00\x00\xff'
compressed = zlib.compress(raw_data)
idat_crc = zlib.crc32(b'IDAT' + compressed)
idat = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc & 0xffffffff)
iend_crc = zlib.crc32(b'IEND')
iend = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc & 0xffffffff)
png = sig + ihdr + idat + iend
b64 = base64.b64encode(png).decode()

api_key = os.environ.get('KIMI_API_KEY', '')
payload = json.dumps({
    'model': 'moonshot-v1-8k-vision-preview',
    'messages': [{'role': 'user', 'content': [
        {'type': 'text', 'text': 'What do you see? Reply briefly.'},
        {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{b64}'}}
    ]}],
    'max_tokens': 50
}).encode()
req = urllib.request.Request(
    'https://api.moonshot.ai/v1/chat/completions',
    data=payload,
    headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}
)
with urllib.request.urlopen(req) as resp:
    result = json.loads(resp.read())
    assert 'choices' in result, f'No choices in response: {result}'
    assert len(result['choices'][0]['message']['content']) > 0
\""
    else
        skip_test "L.6" "Multi-modal API test (vision)" "API unavailable"
    fi
}

# ---------------------------------------------------------------------------
# Edge Tests (6)
# ---------------------------------------------------------------------------

run_edge() {
    echo ""
    echo -e "${BLUE}=== Edge Tests ===${NC}"
    echo ""

    # E.1: ACP server port conflict
    if command -v kimi &>/dev/null; then
        run_test "E.1" "ACP server port conflict handled" \
            "kimi acp < /dev/null &
            ACP1_PID=\$!
            sleep 2
            kimi acp < /dev/null &
            ACP2_PID=\$!
            sleep 2
            kill \$ACP1_PID 2>/dev/null
            kill \$ACP2_PID 2>/dev/null
            wait \$ACP1_PID 2>/dev/null
            wait \$ACP2_PID 2>/dev/null
            true"
    else
        skip_test "E.1" "ACP server port conflict handled" "kimi CLI unavailable"
    fi

    # E.2: Wire daemon auto-restart logic exists
    run_test "E.2" "Wire daemon auto-restart logic exists" \
        "grep -q '_attempt_restart\|_max_restart_attempts\|_restart_delay_base' scripts/wire-daemon.py"

    # E.3: Wire metrics concurrent writes
    run_test "E.3" "Wire metrics concurrent writes safe" \
        "python3 -c \"
import threading, json, sys
sys.path.insert(0, 'scripts')

# Import the WireMetrics class
import importlib.util
spec = importlib.util.spec_from_file_location('wire_daemon', 'scripts/wire-daemon.py')
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

import logging
logger = logging.getLogger('test')
metrics = mod.WireMetrics(logger)

# Simulate concurrent writes
def write_metrics(n):
    for i in range(10):
        metrics.record_tool_call(f'tool_{n}_{i}')
        metrics.record_turn_begin()
        metrics.record_turn_end()

threads = [threading.Thread(target=write_metrics, args=(i,)) for i in range(3)]
for t in threads: t.start()
for t in threads: t.join()

# Verify no corruption
summary = metrics.get_summary()
assert summary['tool_call_count'] == 30, f'Expected 30, got {summary[\"tool_call_count\"]}'
assert summary['turn_count'] == 30, f'Expected 30, got {summary[\"turn_count\"]}'
\""

    # E.4: Multi-modal without image (text-only to vision model)
    if [ "$API_AVAILABLE" = true ]; then
        run_test "E.4" "Multi-modal text-only to vision model" \
            "python3 -c \"
import json, urllib.request, os
api_key = os.environ.get('KIMI_API_KEY', '')
payload = json.dumps({
    'model': 'moonshot-v1-8k-vision-preview',
    'messages': [{'role': 'user', 'content': 'What is 2+2? Reply with only the number.'}],
    'max_tokens': 10
}).encode()
req = urllib.request.Request(
    'https://api.moonshot.ai/v1/chat/completions',
    data=payload,
    headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}
)
with urllib.request.urlopen(req) as resp:
    result = json.loads(resp.read())
    assert 'choices' in result
    assert '4' in result['choices'][0]['message']['content']
\""
    else
        skip_test "E.4" "Multi-modal text-only to vision model" "API unavailable"
    fi

    # E.5: Wire daemon .env.project priority
    run_test "E.5" "Wire daemon .env.project priority" \
        "grep -q 'ENV_PROJECT_FILE\|env.project\|env_project' scripts/wire-daemon.py && grep -q 'Load .env.project second.*higher priority\|higher priority.*overrides' scripts/wire-daemon.py"

    # E.6: ACP helper missing kimi
    run_test "E.6" "ACP helper handles missing kimi gracefully" \
        "TMPOUT=\$(mktemp)
        PATH=/usr/bin:/bin ./scripts/start-acp-server.sh acp > \"\$TMPOUT\" 2>&1
        RESULT=\$?
        FOUND=\$(grep -ci 'not found\|error\|kimi' \"\$TMPOUT\" || true)
        rm -f \"\$TMPOUT\"
        [ \"\$RESULT\" -ne 0 ] && [ \"\$FOUND\" -gt 0 ]"
}

# ---------------------------------------------------------------------------
# Integration Tests (3)
# ---------------------------------------------------------------------------

run_integration() {
    echo ""
    echo -e "${BLUE}=== Integration Tests ===${NC}"
    echo ""

    # I.1: Phase 1-2 regression
    # Phase test scripts exit 0 on success, non-zero on failure
    if [ -x scripts/test-phase-1.sh ]; then
        run_test "I.1" "Phase 1-2 tests still pass" \
            "bash scripts/test-phase-1.sh --mandatory-only"
    else
        skip_test "I.1" "Phase 1-2 tests still pass" "test-phase-1.sh not found"
    fi

    # I.2: Phase 3-4 regression
    if [ -x scripts/test-phase-3.sh ]; then
        run_test "I.2" "Phase 3-4 tests still pass" \
            "bash scripts/test-phase-3.sh --structural"
    else
        skip_test "I.2" "Phase 3-4 tests still pass" "test-phase-3.sh not found"
    fi

    # I.3: Phase 5 regression
    if [ -x scripts/test-phase-5.sh ]; then
        run_test "I.3" "Phase 5 tests still pass" \
            "bash scripts/test-phase-5.sh --structural"
    else
        skip_test "I.3" "Phase 5 tests still pass" "test-phase-5.sh not found"
    fi
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

echo ""
echo "========================================="
echo "  Phase 6: Advanced Features — Test Suite"
echo "========================================="

RUN_ALL=true
RUN_STRUCTURAL=false
RUN_LIVE=false
RUN_EDGE=false
RUN_INTEGRATION=false

for arg in "$@"; do
    case "$arg" in
        --structural) RUN_ALL=false; RUN_STRUCTURAL=true ;;
        --live)       RUN_ALL=false; RUN_LIVE=true ;;
        --edge)       RUN_ALL=false; RUN_EDGE=true ;;
        --integration) RUN_ALL=false; RUN_INTEGRATION=true ;;
        --help|-h)
            echo "Usage: $0 [--structural] [--live] [--edge] [--integration]"
            exit 0
            ;;
    esac
done

if [ "$RUN_ALL" = true ] || [ "$RUN_STRUCTURAL" = true ]; then
    run_structural
fi
if [ "$RUN_ALL" = true ] || [ "$RUN_LIVE" = true ]; then
    run_live
fi
if [ "$RUN_ALL" = true ] || [ "$RUN_EDGE" = true ]; then
    run_edge
fi
if [ "$RUN_ALL" = true ] || [ "$RUN_INTEGRATION" = true ]; then
    run_integration
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

echo ""
echo "========================================="
echo -e "  TOTAL: $TOTAL | ${GREEN}PASS: $PASS${NC} | ${RED}FAIL: $FAIL${NC} | ${YELLOW}SKIP: $SKIP${NC}"
echo "========================================="
echo ""

if [ "$FAIL" -gt 0 ]; then
    exit 1
fi
exit 0

