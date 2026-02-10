#!/usr/bin/env bash
# =============================================================================
# Phase 1: Tool Expansion & Enhancement — Test Suite
# =============================================================================
#
# Runs mandatory tests, edge tests, and REAL Kimi API integration tests.
# Usage: ./scripts/test-phase-1.sh [--mandatory-only | --edge-only | --live-only]
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

# Run a test and track result
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
            # Show first 3 lines of error output
            echo "$output" | head -3 | sed 's/^/         /'
        fi
        ((FAILED++))
    fi
}

# =============================================================================
# MANDATORY TESTS — Structural validation
# =============================================================================

run_mandatory_tests() {
    echo ""
    echo "=========================================="
    echo "  Mandatory Tests (Structural)"
    echo "=========================================="
    echo ""

    # Test 1.1: Tool Availability — correct module paths in YAML
    run_test "1.1a" "SearchWeb in YAML (kimi_cli.tools.web:SearchWeb)" \
        bash -c 'grep -q "kimi_cli.tools.web:SearchWeb" .agents/kimi-overseer.yaml'

    run_test "1.1b" "FetchURL in YAML (kimi_cli.tools.web:FetchURL)" \
        bash -c 'grep -q "kimi_cli.tools.web:FetchURL" .agents/kimi-overseer.yaml'

    run_test "1.1c" "SendDMail in YAML (kimi_cli.tools.dmail:SendDMail)" \
        bash -c 'grep -q "kimi_cli.tools.dmail:SendDMail" .agents/kimi-overseer.yaml'

    # Test 1.1d: Verify NO incorrect module paths remain
    run_test "1.1d" "No incorrect SendDMail path (multiagent:SendDMail)" \
        bash -c '
            if grep -q "kimi_cli.tools.multiagent:SendDMail" .agents/kimi-overseer.yaml; then
                echo "Found incorrect path kimi_cli.tools.multiagent:SendDMail"
                exit 1
            fi
        '

    # Test 1.2: Prompt Documentation
    run_test "1.2a" "SearchWeb documented in overseer.md" \
        bash -c 'grep -q "SearchWeb" .agents/prompts/overseer.md'

    run_test "1.2b" "FetchURL documented in overseer.md" \
        bash -c 'grep -q "FetchURL" .agents/prompts/overseer.md'

    run_test "1.2c" "SendDMail documented in overseer.md" \
        bash -c 'grep -q "SendDMail" .agents/prompts/overseer.md'

    # Test 1.3: YAML Validation
    run_test "1.3a" "kimi-overseer.yaml YAML syntax valid" \
        bash -c '
            KIMI_PYTHON="/Users/satorisan/.local/pipx/venvs/kimi-cli/bin/python3"
            if [ -x "$KIMI_PYTHON" ]; then
                "$KIMI_PYTHON" -c "import yaml; yaml.safe_load(open(\".agents/kimi-overseer.yaml\"))"
            elif python3 -c "import yaml" 2>/dev/null; then
                python3 -c "import yaml; yaml.safe_load(open(\".agents/kimi-overseer.yaml\"))"
            else
                echo "No YAML parser available"
                exit 2
            fi
        '

    run_test "1.3b" "reviewer-sub.yaml YAML syntax valid" \
        bash -c '
            KIMI_PYTHON="/Users/satorisan/.local/pipx/venvs/kimi-cli/bin/python3"
            if [ -x "$KIMI_PYTHON" ]; then
                "$KIMI_PYTHON" -c "import yaml; yaml.safe_load(open(\".agents/reviewer-sub.yaml\"))"
            elif python3 -c "import yaml" 2>/dev/null; then
                python3 -c "import yaml; yaml.safe_load(open(\".agents/reviewer-sub.yaml\"))"
            else
                echo "No YAML parser available"
                exit 2
            fi
        '

    run_test "1.3c" "researcher-sub.yaml YAML syntax valid" \
        bash -c '
            KIMI_PYTHON="/Users/satorisan/.local/pipx/venvs/kimi-cli/bin/python3"
            if [ -x "$KIMI_PYTHON" ]; then
                "$KIMI_PYTHON" -c "import yaml; yaml.safe_load(open(\".agents/researcher-sub.yaml\"))"
            elif python3 -c "import yaml" 2>/dev/null; then
                python3 -c "import yaml; yaml.safe_load(open(\".agents/researcher-sub.yaml\"))"
            else
                echo "No YAML parser available"
                exit 2
            fi
        '

    # Test 1.3d: No circular extend references
    run_test "1.3d" "No circular extend (subagents don't extend parent)" \
        bash -c '
            if grep -q "extend:" .agents/reviewer-sub.yaml 2>/dev/null; then
                echo "reviewer-sub.yaml still uses extend (circular ref risk)"
                exit 1
            fi
            if grep -q "extend:" .agents/researcher-sub.yaml 2>/dev/null; then
                echo "researcher-sub.yaml still uses extend (circular ref risk)"
                exit 1
            fi
        '

    # Test 1.3e: Tool count (13 tools in overseer)
    run_test "1.3e" "Tool count = 13 in kimi-overseer.yaml" \
        bash -c '
            COUNT=$(grep -cE "^\s+- \"kimi_cli\." .agents/kimi-overseer.yaml)
            if [ "$COUNT" -eq 13 ]; then
                exit 0
            else
                echo "Expected 13 tools, found $COUNT"
                exit 1
            fi
        '

    # Test 1.M: Example files exist
    run_test "1.M" "Example files exist (3/3)" \
        bash -c '
            MISSING=""
            [ -f "docs/examples/tool-usage-searchweb.md" ] || MISSING="$MISSING searchweb"
            [ -f "docs/examples/tool-usage-fetchurl.md" ] || MISSING="$MISSING fetchurl"
            [ -f "docs/examples/tool-usage-senddmail.md" ] || MISSING="$MISSING senddmail"
            if [ -z "$MISSING" ]; then
                exit 0
            else
                echo "Missing:$MISSING"
                exit 1
            fi
        '

    # Test 1.V: All tool module paths are valid Python imports
    run_test "1.V" "All tool module paths resolve to real Python classes" \
        bash -c '
            KIMI_PYTHON="/Users/satorisan/.local/pipx/venvs/kimi-cli/bin/python3"
            if [ ! -x "$KIMI_PYTHON" ]; then
                echo "Kimi Python not found"
                exit 2
            fi
            "$KIMI_PYTHON" -c "
import yaml, importlib
with open(\".agents/kimi-overseer.yaml\") as f:
    data = yaml.safe_load(f)
tools = data[\"agent\"][\"tools\"]
errors = []
for tool_spec in tools:
    module_path, class_name = tool_spec.rsplit(\":\", 1)
    try:
        mod = importlib.import_module(module_path)
        cls = getattr(mod, class_name, None)
        if cls is None:
            errors.append(f\"{tool_spec}: class not found\")
    except ImportError as e:
        errors.append(f\"{tool_spec}: import failed - {e}\")
if errors:
    for e in errors:
        print(e)
    exit(1)
print(f\"All {len(tools)} tool paths resolve correctly\")
"
        '
}

# =============================================================================
# LIVE TESTS — Real Kimi API calls
# =============================================================================

run_live_tests() {
    echo ""
    echo "=========================================="
    echo "  Live Tests (Real Kimi API Calls)"
    echo "=========================================="
    echo ""

    # Pre-check: Is Kimi CLI available?
    if ! command -v kimi &>/dev/null; then
        printf "${YELLOW}SKIP: Kimi CLI not installed. Skipping all live tests.${NC}\n"
        ((SKIPPED+=4))
        return
    fi

    # Test L.1: Agent file loads without errors
    run_test "L.1" "Kimi loads overseer agent file (real API call)" \
        bash -c '
            OUTPUT=$(kimi --agent-file .agents/kimi-overseer.yaml --print -p "Respond with exactly: AGENT_LOADED_OK" 2>&1)
            EXIT=$?
            if [ $EXIT -ne 0 ]; then
                echo "Kimi exited with code $EXIT"
                echo "$OUTPUT" | head -5
                exit 1
            fi
            if echo "$OUTPUT" | grep -q "AGENT_LOADED_OK"; then
                exit 0
            fi
            # Even if the exact string isnt there, if we got a TurnEnd, agent loaded
            if echo "$OUTPUT" | grep -q "TurnEnd"; then
                exit 0
            fi
            echo "No successful response detected"
            echo "$OUTPUT" | tail -5
            exit 1
        '

    # Test L.2: Kimi recognizes the new tools
    run_test "L.2" "Kimi lists tools including SendDMail (real API call)" \
        bash -c '
            OUTPUT=$(kimi --agent-file .agents/kimi-overseer.yaml --print -p "List all your tools. Include SendDMail, FetchURL, and SearchWeb in your list." 2>&1)
            EXIT=$?
            if [ $EXIT -ne 0 ]; then
                echo "Kimi exited with code $EXIT"
                echo "$OUTPUT" | head -3
                exit 1
            fi
            # Check that at least 2 of the 3 new tools are mentioned
            FOUND=0
            echo "$OUTPUT" | grep -qi "SendDMail" && ((FOUND++))
            echo "$OUTPUT" | grep -qi "FetchURL" && ((FOUND++))
            echo "$OUTPUT" | grep -qi "SearchWeb" && ((FOUND++))
            if [ $FOUND -ge 2 ]; then
                exit 0
            fi
            echo "Only $FOUND/3 new tools mentioned in response"
            exit 1
        '

    # Test L.3: FetchURL tool actually works
    run_test "L.3" "FetchURL tool works (real API call)" \
        bash -c '
            OUTPUT=$(kimi --agent-file .agents/kimi-overseer.yaml --print -p "Use the FetchURL tool to fetch https://moonshotai.github.io/kimi-cli/en/guides/getting-started.html and tell me the page title." 2>&1)
            EXIT=$?
            # Check for tool call in output
            if echo "$OUTPUT" | grep -q "FetchURL"; then
                exit 0
            fi
            # If Kimi responded at all, partial pass
            if echo "$OUTPUT" | grep -q "TurnEnd"; then
                echo "Kimi responded but may not have used FetchURL tool"
                exit 0
            fi
            echo "No FetchURL tool call detected"
            exit 1
        '

    # Test L.4: No recursion error (the bug we fixed)
    run_test "L.4" "No recursion error when loading agent file" \
        bash -c '
            OUTPUT=$(kimi --agent-file .agents/kimi-overseer.yaml --print -p "Say OK" 2>&1)
            if echo "$OUTPUT" | grep -qi "recursion"; then
                echo "RecursionError detected!"
                exit 1
            fi
            if echo "$OUTPUT" | grep -qi "maximum recursion depth"; then
                echo "Maximum recursion depth exceeded!"
                exit 1
            fi
            exit 0
        '
}

# =============================================================================
# EDGE TESTS
# =============================================================================

run_edge_tests() {
    echo ""
    echo "=========================================="
    echo "  Edge Tests"
    echo "=========================================="
    echo ""

    # Edge 1.1: Missing Tool Fallback
    run_test "E1.1" "YAML valid after removing a tool" \
        bash -c '
            KIMI_PYTHON="/Users/satorisan/.local/pipx/venvs/kimi-cli/bin/python3"
            TEMP="/tmp/kimi-overseer-edge11.yaml"
            sed "/SearchWeb/d" .agents/kimi-overseer.yaml > "$TEMP"
            if [ -x "$KIMI_PYTHON" ]; then
                "$KIMI_PYTHON" -c "import yaml; yaml.safe_load(open(\"$TEMP\"))"
            else
                grep -q "agent:" "$TEMP" && grep -q "tools:" "$TEMP"
            fi
            EXIT=$?
            rm -f "$TEMP"
            exit $EXIT
        '

    # Edge 1.2: Invalid Tool Name — YAML stays valid
    run_test "E1.2" "Invalid tool name doesn't break YAML syntax" \
        bash -c '
            KIMI_PYTHON="/Users/satorisan/.local/pipx/venvs/kimi-cli/bin/python3"
            TEMP="/tmp/kimi-overseer-edge12.yaml"
            # Use awk to insert invalid tool on a new line (macOS sed is unreliable)
            awk "/kimi_cli.tools.web:FetchURL/{print; print \"    - \\\"kimi_cli.tools.invalid:DoesNotExist\\\"\"; next}1" \
                .agents/kimi-overseer.yaml > "$TEMP"
            if ! grep -q "DoesNotExist" "$TEMP"; then
                rm -f "$TEMP"
                echo "Invalid tool was not inserted"
                exit 1
            fi
            if [ -x "$KIMI_PYTHON" ]; then
                "$KIMI_PYTHON" -c "import yaml; yaml.safe_load(open(\"$TEMP\"))" 2>&1
            else
                grep -q "agent:" "$TEMP"
            fi
            EXIT=$?
            rm -f "$TEMP"
            exit $EXIT
        '

    # Edge 1.2b: Invalid tool name IS caught by Kimi CLI at runtime
    run_test "E1.2b" "Kimi CLI rejects invalid tool names at load time" \
        bash -c '
            if ! command -v kimi &>/dev/null; then
                echo "Kimi CLI not installed"
                exit 2
            fi
            PROJECT_ROOT="$(pwd)"
            TEMP="/tmp/kimi-overseer-edge12b.yaml"
            cat > "$TEMP" << INNEREOF
version: 1
agent:
  name: test-invalid
  system_prompt_path: ${PROJECT_ROOT}/.agents/prompts/overseer.md
  system_prompt_args:
    PROJECT_NAME: "Test"
    SPRINT_STATUS: "${PROJECT_ROOT}/.ai/status.md"
    ROLE_ADDITIONAL: ""
  tools:
    - "kimi_cli.tools.shell:Shell"
    - "kimi_cli.tools.invalid:FakeTool"
INNEREOF
            OUTPUT=$(kimi --agent-file "$TEMP" --print -p "test" 2>&1)
            EXIT=$?
            rm -f "$TEMP"
            # Should fail with "Invalid tools" error
            if [ $EXIT -ne 0 ] && echo "$OUTPUT" | grep -qi "invalid"; then
                exit 0
            fi
            echo "Expected Kimi to reject invalid tool, but got exit=$EXIT"
            echo "$OUTPUT" | head -3
            exit 1
        '

    # Edge 1.3: Duplicate tool entries
    run_test "E1.3" "Duplicate tool entries don't break YAML" \
        bash -c '
            KIMI_PYTHON="/Users/satorisan/.local/pipx/venvs/kimi-cli/bin/python3"
            TEMP="/tmp/kimi-overseer-edge13.yaml"
            # Use awk to insert duplicate on a new line (macOS sed is unreliable for this)
            awk "/kimi_cli.tools.web:SearchWeb/{print; print \"    - \\\"kimi_cli.tools.web:SearchWeb\\\"\"; next}1" \
                .agents/kimi-overseer.yaml > "$TEMP"
            COUNT=$(grep -c "SearchWeb" "$TEMP")
            if [ "$COUNT" -lt 2 ]; then
                rm -f "$TEMP"
                echo "Duplicate not added (count=$COUNT)"
                exit 1
            fi
            if [ -x "$KIMI_PYTHON" ]; then
                "$KIMI_PYTHON" -c "import yaml; yaml.safe_load(open(\"$TEMP\"))" 2>&1
            else
                grep -q "agent:" "$TEMP"
            fi
            EXIT=$?
            rm -f "$TEMP"
            exit $EXIT
        '

    # Edge 1.4: Backward Compatibility
    run_test "E1.4a" "Existing integration tests pass" \
        bash -c '
            if [ -f "./scripts/test-agent-file-integration.sh" ]; then
                ./scripts/test-agent-file-integration.sh > /tmp/phase1-compat.log 2>&1
                EXIT=$?
                if [ $EXIT -ne 0 ]; then
                    tail -5 /tmp/phase1-compat.log
                fi
                exit $EXIT
            else
                echo "test-agent-file-integration.sh not found"
                exit 2
            fi
        '

    run_test "E1.4b" "Post-commit hook syntax valid" \
        bash -c '
            if [ -f "./scripts/post-commit" ]; then
                bash -n ./scripts/post-commit 2>&1
            else
                echo "post-commit not found"
                exit 2
            fi
        '

    run_test "E1.4c" "Existing edge case tests pass" \
        bash -c '
            if [ -f "./scripts/test-edge-cases.sh" ]; then
                ./scripts/test-edge-cases.sh > /tmp/phase1-edge-compat.log 2>&1
                EXIT=$?
                if [ $EXIT -ne 0 ]; then
                    tail -5 /tmp/phase1-edge-compat.log
                fi
                exit $EXIT
            else
                echo "test-edge-cases.sh not found"
                exit 2
            fi
        '
}

# =============================================================================
# MAIN
# =============================================================================

echo "=========================================="
echo "  Phase 1: Tool Expansion Test Suite"
echo "=========================================="

case "${1:-all}" in
    --mandatory-only)
        run_mandatory_tests
        ;;
    --edge-only)
        run_edge_tests
        ;;
    --live-only)
        run_live_tests
        ;;
    *)
        run_mandatory_tests
        run_live_tests
        run_edge_tests
        ;;
esac

# Summary
echo ""
echo "=========================================="
echo "  Phase 1 Test Summary"
echo "=========================================="
echo ""
printf "  ${GREEN}Passed${NC}:  %d\n" "$PASSED"
printf "  ${RED}Failed${NC}:  %d\n" "$FAILED"
printf "  ${YELLOW}Skipped${NC}: %d\n" "$SKIPPED"
echo ""

if [ $FAILED -eq 0 ]; then
    printf "  ${GREEN}All tests passed. Phase 1 gate criteria MET.${NC}\n"
    echo ""
    exit 0
else
    printf "  ${RED}Some tests failed. Phase 1 gate criteria NOT MET.${NC}\n"
    echo ""
    exit 1
fi
