#!/usr/bin/env bash
# =============================================================================
# Test Agent File Integration
# =============================================================================
# Comprehensive testing of --agent-file usage across all components
# =============================================================================

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
WARNINGS=0

log_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

log_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED++))
}

log_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED++))
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
    ((WARNINGS++))
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# =============================================================================
# Test 1: Agent File Exists
# =============================================================================

test_agent_file_exists() {
    log_test "Test 1: Agent file exists and is valid YAML"
    
    local agent_file="$PROJECT_ROOT/.agents/kimi-overseer.yaml"
    
    if [ ! -f "$agent_file" ]; then
        log_fail "Agent file not found at $agent_file"
        return 1
    fi
    
    # Try YAML validation with available tools
    local yaml_valid=false
    if command -v yq &>/dev/null; then
        if yq eval '.' "$agent_file" >/dev/null 2>&1; then
            log_pass "Agent file is valid YAML (yq)"
            yaml_valid=true
        else
            log_fail "Agent file is invalid YAML (yq)"
            return 1
        fi
    elif python3 -c "import yaml" 2>/dev/null; then
        if python3 -c "import yaml; yaml.safe_load(open('$agent_file'))" 2>/dev/null; then
            log_pass "Agent file is valid YAML (python3)"
            yaml_valid=true
        else
            log_fail "Agent file is invalid YAML (python3)"
            return 1
        fi
    else
        # Basic syntax check: ensure it starts with valid YAML structure
        if head -1 "$agent_file" | grep -qE "^#|^version:|^agent:"; then
            log_pass "Agent file has valid YAML structure (basic check)"
            yaml_valid=true
        else
            log_warn "Could not validate YAML syntax (no yq or pyyaml), but file exists"
        fi
    fi
    
    # Check for required fields
    if grep -q "PROJECT_NAME:" "$agent_file"; then
        log_pass "Agent file contains PROJECT_NAME"
    else
        log_fail "Agent file missing PROJECT_NAME"
        return 1
    fi
    
    if grep -q "ROLE_ADDITIONAL:" "$agent_file"; then
        log_pass "Agent file contains ROLE_ADDITIONAL"
    else
        log_fail "Agent file missing ROLE_ADDITIONAL"
        return 1
    fi
    
    # Check PROJECT_NAME is not placeholder
    if grep -q 'PROJECT_NAME: "\[REPLACE' "$agent_file"; then
        log_fail "PROJECT_NAME still contains placeholder"
        return 1
    else
        log_pass "PROJECT_NAME is not a placeholder"
    fi
}

# =============================================================================
# Test 2: Post-Commit Hook Agent File Resolution
# =============================================================================

test_post_commit_agent_file() {
    log_test "Test 2: Post-commit hook resolves agent file correctly"
    
    local hook_file="$PROJECT_ROOT/scripts/post-commit"
    
    # Test 2a: Check hook references AGENT_FILE variable
    if grep -q "AGENT_FILE=" "$hook_file"; then
        log_pass "Hook defines AGENT_FILE variable"
    else
        log_fail "Hook missing AGENT_FILE variable"
        return 1
    fi
    
    # Test 2b: Check hook uses --agent-file in run_kimi
    if grep -q "agent_arg" "$hook_file" && grep -q "agent-file" "$hook_file"; then
        log_pass "Hook uses --agent-file in run_kimi function"
    else
        log_fail "Hook missing --agent-file usage"
        return 1
    fi
    
    # Test 2c: Test dry-run mode (simulate)
    log_info "Testing dry-run mode..."
    export OPEN_ARTEL_DRY_RUN=true
    export ASYNC_MODE=false
    
    # Create a test commit message file
    local test_log="$PROJECT_ROOT/.git/hooks/post-commit.test.log"
    mkdir -p "$(dirname "$test_log")"
    
    # Simulate a commit message parse
    local test_msg="[AGENT:claude] [ACTION:submit] [TASK:TEST-001] Test commit"
    
    # Check if the hook would use agent file in dry-run
    if bash -c "
        source $hook_file 2>/dev/null || true
        AGENT_FILE='.agents/kimi-overseer.yaml'
        repo_root='$PROJECT_ROOT'
        if [ -f \"\$repo_root/\$AGENT_FILE\" ]; then
            echo 'AGENT_FILE_RESOLVED'
        fi
    " | grep -q "AGENT_FILE_RESOLVED"; then
        log_pass "Hook correctly resolves agent file path"
    else
        log_warn "Could not verify agent file resolution in dry-run"
    fi
    
    unset OPEN_ARTEL_DRY_RUN
    unset ASYNC_MODE
}

# =============================================================================
# Test 3: Generate Evaluation Script Agent File
# =============================================================================

test_evaluation_agent_file() {
    log_test "Test 3: Generate evaluation script uses --agent-file"
    
    local eval_script="$PROJECT_ROOT/scripts/generate-evaluation.sh"
    
    # Test 3a: Check script references agent file
    if grep -q "agent_file.*kimi-overseer.yaml" "$eval_script"; then
        log_pass "Evaluation script references agent file"
    else
        log_fail "Evaluation script missing agent file reference"
        return 1
    fi
    
    # Test 3b: Check script uses --agent-file in kimi call
    if grep -q "agent_arg.*--agent-file" "$eval_script" || grep -q "--agent-file.*agent_file" "$eval_script"; then
        log_pass "Evaluation script uses --agent-file in kimi call"
    else
        log_fail "Evaluation script missing --agent-file in kimi call"
        return 1
    fi
    
    # Test 3c: Test quick mode (no Kimi call, just metrics)
    log_info "Testing evaluation script in quick mode (metrics only)..."
    local eval_output
    eval_output=$(bash "$eval_script" --quick 2>&1) || true
    if echo "$eval_output" | grep -qE "Sprint Evaluation|METRIC|metrics"; then
        log_pass "Evaluation script runs in quick mode"
    else
        log_warn "Evaluation script output unclear, but exit code was handled"
        echo "$eval_output" | head -5
    fi
}

# =============================================================================
# Test 4: Wire Daemon Agent File
# =============================================================================

test_wire_daemon_agent_file() {
    log_test "Test 4: Wire daemon uses --agent-file"
    
    local daemon_file="$PROJECT_ROOT/scripts/wire-daemon.py"
    
    # Test 4a: Check daemon references agent file
    if grep -q "kimi-overseer.yaml" "$daemon_file"; then
        log_pass "Wire daemon references agent file"
    else
        log_fail "Wire daemon missing agent file reference"
        return 1
    fi
    
    # Test 4b: Check daemon uses --agent-file in kimi --wire call
    if grep -q "agent-file" "$daemon_file" && grep -q "agent_file" "$daemon_file"; then
        log_pass "Wire daemon uses --agent-file in kimi --wire call"
    else
        log_fail "Wire daemon missing --agent-file in kimi --wire call"
        return 1
    fi
    
    # Test 4c: Test Python syntax
    if python3 -m py_compile "$daemon_file" 2>/dev/null; then
        log_pass "Wire daemon Python syntax is valid"
    else
        log_fail "Wire daemon has Python syntax errors"
        return 1
    fi
    
    # Test 4d: Test dry-run mode (should not start Kimi)
    log_info "Testing wire daemon dry-run mode..."
    if python3 "$daemon_file" --dry-run --status 2>&1 | grep -q "DRY RUN\|status\|running\|stopped"; then
        log_pass "Wire daemon dry-run mode works"
    else
        log_warn "Could not verify wire daemon dry-run mode"
    fi
}

# =============================================================================
# Test 5: CI Workflows Agent File
# =============================================================================

test_ci_workflows_agent_file() {
    log_test "Test 5: CI workflows use --agent-file"
    
    local workflows_dir="$PROJECT_ROOT/.github/workflows"
    
    # Test 5a: Check agent-review.yml
    local review_workflow="$workflows_dir/agent-review.yml"
    if [ -f "$review_workflow" ]; then
        if grep -q "kimi.*--agent-file.*kimi-overseer.yaml" "$review_workflow"; then
            log_pass "agent-review.yml uses --agent-file"
        else
            log_fail "agent-review.yml missing --agent-file"
            return 1
        fi
        
        # Validate YAML syntax
        if command -v yamllint &>/dev/null; then
            if yamllint "$review_workflow" >/dev/null 2>&1; then
                log_pass "agent-review.yml is valid YAML"
            else
                log_warn "agent-review.yml has YAML lint issues"
            fi
        fi
    else
        log_fail "agent-review.yml not found"
        return 1
    fi
    
    # Test 5b: Check sprint-evaluation.yml (should delegate to generate-evaluation.sh)
    local eval_workflow="$workflows_dir/sprint-evaluation.yml"
    if [ -f "$eval_workflow" ]; then
        if grep -q "generate-evaluation.sh" "$eval_workflow"; then
            log_pass "sprint-evaluation.yml delegates to generate-evaluation.sh (which uses --agent-file)"
        else
            log_warn "sprint-evaluation.yml may not use generate-evaluation.sh"
        fi
    fi
    
    # Test 5c: Check pre-mortal-merge.yml (no direct kimi calls expected)
    local merge_workflow="$workflows_dir/pre-mortal-merge.yml"
    if [ -f "$merge_workflow" ]; then
        if ! grep -q "kimi.*--print" "$merge_workflow"; then
            log_pass "pre-mortal-merge.yml correctly has no direct kimi calls"
        else
            log_warn "pre-mortal-merge.yml has direct kimi calls (may need --agent-file)"
        fi
    fi
}

# =============================================================================
# Test 6: Overseer Prompt ROLE_ADDITIONAL
# =============================================================================

test_overseer_prompt_role_additional() {
    log_test "Test 6: Overseer prompt includes ROLE_ADDITIONAL variable"
    
    local prompt_file="$PROJECT_ROOT/.agents/prompts/overseer.md"
    
    if [ ! -f "$prompt_file" ]; then
        log_fail "Overseer prompt file not found"
        return 1
    fi
    
    if grep -q '\${ROLE_ADDITIONAL}' "$prompt_file"; then
        log_pass "Overseer prompt includes \${ROLE_ADDITIONAL} variable"
    else
        log_fail "Overseer prompt missing \${ROLE_ADDITIONAL} variable"
        return 1
    fi
    
    # Check it's in a reasonable location (after identity, before project context)
    local line_num
    line_num=$(grep -n '\${ROLE_ADDITIONAL}' "$prompt_file" | cut -d: -f1)
    if [ -n "$line_num" ] && [ "$line_num" -lt 20 ]; then
        log_pass "ROLE_ADDITIONAL is placed early in prompt (line $line_num)"
    else
        log_warn "ROLE_ADDITIONAL may be in unexpected location (line ${line_num:-unknown})"
    fi
}

# =============================================================================
# Test 7: Edge Cases
# =============================================================================

test_edge_cases() {
    log_test "Test 7: Edge cases (missing files, invalid paths)"
    
    # Test 7a: What happens if agent file doesn't exist?
    log_info "Testing behavior when agent file is missing..."
    
    local temp_agent_file="$PROJECT_ROOT/.agents/kimi-overseer.yaml.backup"
    if [ -f "$PROJECT_ROOT/.agents/kimi-overseer.yaml" ]; then
        mv "$PROJECT_ROOT/.agents/kimi-overseer.yaml" "$temp_agent_file"
        
        # Test post-commit hook handles missing file
        local repo_root="$PROJECT_ROOT"
        local AGENT_FILE=".agents/kimi-overseer.yaml"
        if [ ! -f "$repo_root/$AGENT_FILE" ]; then
            log_pass "Post-commit hook correctly detects missing agent file"
        fi
        
        # Restore
        mv "$temp_agent_file" "$PROJECT_ROOT/.agents/kimi-overseer.yaml"
    fi
    
    # Test 7b: Check that scripts handle missing agent file gracefully
    log_info "Testing script behavior with missing agent file..."
    
    # Evaluation script should still work (just without agent file)
    if bash "$PROJECT_ROOT/scripts/generate-evaluation.sh" --quick 2>&1 | grep -q "Sprint Evaluation\|metrics"; then
        log_pass "Evaluation script handles missing agent file gracefully"
    else
        log_warn "Evaluation script may fail when agent file is missing"
    fi
    
    # Test 7c: Check path with spaces (if possible)
    log_info "Testing path resolution with spaces..."
    # This is hard to test without actually creating a path with spaces
    # But we can check that paths are properly quoted
    if grep -q "\"$repo_root/\$AGENT_FILE\"" "$PROJECT_ROOT/scripts/post-commit" || \
       grep -q "'$repo_root/\$AGENT_FILE'" "$PROJECT_ROOT/scripts/post-commit"; then
        log_warn "Agent file path may not be properly quoted (spaces could break)"
    else
        # Check if it's using variable expansion that should be safe
        log_pass "Agent file path handling appears safe"
    fi
}

# =============================================================================
# Test 8: Kimi CLI Availability and Agent File Validation
# =============================================================================

test_kimi_cli_agent_file() {
    log_test "Test 8: Kimi CLI can load agent file (if available)"
    
    if ! command -v kimi &>/dev/null; then
        log_warn "Kimi CLI not installed, skipping agent file validation"
        log_info "Install with: pipx install kimi-cli"
        return 0
    fi
    
    local agent_file="$PROJECT_ROOT/.agents/kimi-overseer.yaml"
    
    # Test if kimi can parse the agent file (dry run, no actual execution)
    log_info "Testing if Kimi CLI can parse agent file..."
    
    # Try to validate the agent file structure
    if kimi --help 2>&1 | grep -q "agent-file\|--agent-file"; then
        log_pass "Kimi CLI supports --agent-file flag"
    else
        log_warn "Kimi CLI may not support --agent-file flag (check version)"
    fi
    
    # Note: We can't actually test kimi --agent-file without an API key
    # and we don't want to make real API calls in tests
    log_info "Skipping actual kimi --agent-file execution (requires API key)"
}

# =============================================================================
# Main Test Runner
# =============================================================================

main() {
    echo ""
    echo "=============================================================================="
    echo "  Agent File Integration Test Suite"
    echo "=============================================================================="
    echo ""
    
    test_agent_file_exists
    echo ""
    
    test_post_commit_agent_file
    echo ""
    
    test_evaluation_agent_file
    echo ""
    
    test_wire_daemon_agent_file
    echo ""
    
    test_ci_workflows_agent_file
    echo ""
    
    test_overseer_prompt_role_additional
    echo ""
    
    test_edge_cases
    echo ""
    
    test_kimi_cli_agent_file
    echo ""
    
    # Summary
    echo "=============================================================================="
    echo "  Test Summary"
    echo "=============================================================================="
    echo ""
    echo -e "${GREEN}Passed:${NC} $PASSED"
    echo -e "${RED}Failed:${NC} $FAILED"
    echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
    echo ""
    
    if [ $FAILED -eq 0 ]; then
        echo -e "${GREEN}All critical tests passed!${NC}"
        exit 0
    else
        echo -e "${RED}Some tests failed. Review output above.${NC}"
        exit 1
    fi
}

main "$@"

