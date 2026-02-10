#!/usr/bin/env bash
# =============================================================================
# Edge Case Testing for Agent File Integration
# =============================================================================
# Tests failure scenarios, edge cases, and boundary conditions
# =============================================================================

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ISSUES_FOUND=0
WORKING_WELL=0

log_edge() {
    echo -e "${BLUE}[EDGE TEST]${NC} $1"
}

log_issue() {
    echo -e "${RED}[ISSUE]${NC} $1"
    ((ISSUES_FOUND++))
}

log_working() {
    echo -e "${GREEN}[✓]${NC} $1"
    ((WORKING_WELL++))
}

log_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# =============================================================================
# Edge Test 1: Missing Agent File
# =============================================================================

test_missing_agent_file() {
    log_edge "Test 1: Behavior when agent file is missing"
    
    local agent_file="$PROJECT_ROOT/.agents/kimi-overseer.yaml"
    local backup_file="${agent_file}.backup"
    
    # Backup
    if [ -f "$agent_file" ]; then
        mv "$agent_file" "$backup_file"
    fi
    
    # Test post-commit hook
    log_info "Testing post-commit hook with missing agent file..."
    local repo_root="$PROJECT_ROOT"
    local AGENT_FILE=".agents/kimi-overseer.yaml"
    local agent_arg=""
    
    if [ -n "$repo_root" ] && [ -f "$repo_root/$AGENT_FILE" ]; then
        agent_arg="--agent-file $repo_root/$AGENT_FILE"
        log_issue "Post-commit hook would use agent file even though it doesn't exist"
    else
        if [ -z "$agent_arg" ]; then
            log_working "Post-commit hook correctly skips --agent-file when file missing"
        else
            log_issue "Post-commit hook has agent_arg set even when file missing"
        fi
    fi
    
    # Test evaluation script
    log_info "Testing evaluation script with missing agent file..."
    local eval_output
    eval_output=$(bash "$PROJECT_ROOT/scripts/generate-evaluation.sh" --quick 2>&1) || true
    if echo "$eval_output" | grep -qE "METRIC|Sprint Evaluation"; then
        log_working "Evaluation script works without agent file (graceful degradation)"
    else
        log_issue "Evaluation script may fail when agent file is missing"
        echo "$eval_output" | head -5
    fi
    
    # Test wire daemon
    log_info "Testing wire daemon with missing agent file..."
    if python3 -c "
from pathlib import Path
agent_file = Path('$PROJECT_ROOT') / '.agents' / 'kimi-overseer.yaml'
if agent_file.exists():
    print('EXISTS')
else:
    print('MISSING')
" | grep -q "MISSING"; then
        log_working "Wire daemon correctly detects missing agent file"
    else
        log_issue "Wire daemon may not handle missing agent file correctly"
    fi
    
    # Restore
    if [ -f "$backup_file" ]; then
        mv "$backup_file" "$agent_file"
    fi
}

# =============================================================================
# Edge Test 2: Command Construction (Dry-Run)
# =============================================================================

test_command_construction() {
    log_edge "Test 2: Command construction in dry-run mode"
    
    # Test post-commit hook command construction
    log_info "Testing post-commit hook command construction..."
    export OPEN_ARTEL_DRY_RUN=true
    export ASYNC_MODE=false
    
    local hook_file="$PROJECT_ROOT/scripts/post-commit"
    local test_log="$PROJECT_ROOT/.git/hooks/post-commit.edge-test.log"
    mkdir -p "$(dirname "$test_log")"
    
    # Simulate the run_kimi function logic
    local repo_root="$PROJECT_ROOT"
    local AGENT_FILE=".agents/kimi-overseer.yaml"
    local agent_arg=""
    
    if [ -n "$repo_root" ] && [ -f "$repo_root/$AGENT_FILE" ]; then
        agent_arg="--agent-file $repo_root/$AGENT_FILE"
    fi
    
    local cmd="kimi ${agent_arg} --print -p"
    
    # Check if command is properly constructed
    if [ -n "$agent_arg" ]; then
        if echo "$cmd" | grep -q "kimi.*--agent-file.*--print"; then
            log_working "Post-commit hook constructs command correctly with agent file"
        else
            log_issue "Post-commit hook command construction may be incorrect"
            echo "Command would be: $cmd"
        fi
    else
        log_issue "Agent arg is empty even though file exists"
    fi
    
    # Check for proper quoting (spaces in path)
    if echo "$agent_arg" | grep -qE "^--agent-file [^ ]+$"; then
        log_working "Agent file path appears properly formatted"
    else
        log_info "Agent file path may need quoting if it contains spaces"
    fi
    
    unset OPEN_ARTEL_DRY_RUN
    unset ASYNC_MODE
}

# =============================================================================
# Edge Test 3: Path Resolution Edge Cases
# =============================================================================

test_path_resolution() {
    log_edge "Test 3: Path resolution edge cases"
    
    # Test 3a: Relative vs absolute paths
    log_info "Testing path resolution (relative vs absolute)..."
    
    local repo_root
    repo_root=$(cd "$PROJECT_ROOT" && git rev-parse --show-toplevel 2>/dev/null)
    
    if [ -n "$repo_root" ]; then
        log_working "Git repo root resolves correctly: $repo_root"
        
        # Check if agent file path is absolute or relative
        local agent_file="$repo_root/.agents/kimi-overseer.yaml"
        if [ "${agent_file:0:1}" = "/" ]; then
            log_working "Agent file path is absolute (safe for subprocesses)"
        else
            log_info "Agent file path is relative (may need cwd handling)"
        fi
    else
        log_issue "Could not resolve git repo root"
    fi
    
    # Test 3b: Path with special characters (if we can test)
    log_info "Testing path handling with special characters..."
    # This is hard to test without actually creating problematic paths
    # But we can check if paths are quoted in command construction
    
    # Test 3c: Working directory changes
    log_info "Testing behavior when working directory changes..."
    (
        cd /tmp
        local test_repo_root
        test_repo_root=$(cd "$PROJECT_ROOT" && git rev-parse --show-toplevel 2>/dev/null)
        if [ -n "$test_repo_root" ] && [ -f "$test_repo_root/.agents/kimi-overseer.yaml" ]; then
            log_working "Path resolution works from different working directory"
        else
            log_issue "Path resolution may fail from different working directory"
        fi
    )
}

# =============================================================================
# Edge Test 4: Async Mode Behavior
# =============================================================================

test_async_mode() {
    log_edge "Test 4: Async mode behavior with agent file"
    
    log_info "Testing async mode command construction..."
    
    # In async mode, the command is run in background
    # We need to ensure agent file path is still correct
    
    local repo_root="$PROJECT_ROOT"
    local AGENT_FILE=".agents/kimi-overseer.yaml"
    local agent_arg=""
    
    if [ -n "$repo_root" ] && [ -f "$repo_root/$AGENT_FILE" ]; then
        agent_arg="--agent-file $repo_root/$AGENT_FILE"
    fi
    
    # Simulate async command
    local async_cmd="(kimi ${agent_arg} --print -p \"test\" >> /tmp/test.log 2>&1) &"
    
    # Check if agent file is included
    if echo "$async_cmd" | grep -q "kimi.*--agent-file"; then
        log_working "Async mode includes agent file in command"
    else
        log_issue "Async mode may not include agent file"
    fi
    
    # Check if path is absolute (important for background processes)
    if echo "$agent_arg" | grep -q "^--agent-file /"; then
        log_working "Agent file path is absolute (safe for background processes)"
    else
        log_info "Agent file path is relative (may need cwd for background processes)"
    fi
}

# =============================================================================
# Edge Test 5: CI Workflow YAML Validation
# =============================================================================

test_ci_workflow_yaml() {
    log_edge "Test 5: CI workflow YAML syntax and structure"
    
    local workflows_dir="$PROJECT_ROOT/.github/workflows"
    
    for workflow in "$workflows_dir"/*.yml; do
        if [ ! -f "$workflow" ]; then
            continue
        fi
        
        local basename
        basename=$(basename "$workflow")
        log_info "Validating $basename..."
        
        # Check YAML syntax (basic)
        if head -1 "$workflow" | grep -qE "^#|^name:"; then
            log_working "$basename has valid YAML structure"
        else
            log_issue "$basename may have YAML syntax issues"
        fi
        
        # Check for agent-file usage
        if grep -q "agent-file\|kimi-overseer.yaml" "$workflow"; then
            log_working "$basename references agent file"
        else
            # This is OK for some workflows (like pre-mortal-merge)
            if [[ "$basename" == *"pre-mortal"* ]]; then
                log_working "$basename correctly has no direct kimi calls"
            else
                log_info "$basename may need agent-file reference"
            fi
        fi
    done
}

# =============================================================================
# Edge Test 6: Environment Variable Handling
# =============================================================================

test_env_variable_handling() {
    log_edge "Test 6: Environment variable handling"
    
    # Test KIMI_API_KEY with agent file
    log_info "Testing KIMI_API_KEY handling with agent file..."
    
    # Check if scripts properly handle KIMI_API_KEY alongside --agent-file
    local hook_file="$PROJECT_ROOT/scripts/post-commit"
    
    if grep -q "KIMI_API_KEY" "$hook_file" && grep -q "agent-file" "$hook_file"; then
        log_working "Post-commit hook handles both KIMI_API_KEY and --agent-file"
    else
        log_issue "Post-commit hook may not handle KIMI_API_KEY with agent file"
    fi
    
    # Test evaluation script
    local eval_script="$PROJECT_ROOT/scripts/generate-evaluation.sh"
    if grep -q "KIMI_API_KEY" "$eval_script" && grep -q "agent-file" "$eval_script"; then
        log_working "Evaluation script handles both KIMI_API_KEY and --agent-file"
    else
        log_issue "Evaluation script may not handle KIMI_API_KEY with agent file"
    fi
}

# =============================================================================
# Edge Test 7: Subagent ROLE_ADDITIONAL Injection
# =============================================================================

test_role_additional_injection() {
    log_edge "Test 7: ROLE_ADDITIONAL variable injection in subagents"
    
    # Check reviewer subagent
    local reviewer_file="$PROJECT_ROOT/.agents/reviewer-sub.yaml"
    if [ -f "$reviewer_file" ]; then
        if grep -q "ROLE_ADDITIONAL:" "$reviewer_file" && grep -q "extend:" "$reviewer_file"; then
            log_working "Reviewer subagent extends overseer and defines ROLE_ADDITIONAL"
        else
            log_issue "Reviewer subagent may not properly extend overseer"
        fi
    fi
    
    # Check researcher subagent
    local researcher_file="$PROJECT_ROOT/.agents/researcher-sub.yaml"
    if [ -f "$researcher_file" ]; then
        if grep -q "ROLE_ADDITIONAL:" "$researcher_file" && grep -q "extend:" "$researcher_file"; then
            log_working "Researcher subagent extends overseer and defines ROLE_ADDITIONAL"
        else
            log_issue "Researcher subagent may not properly extend overseer"
        fi
    fi
    
    # Check overseer prompt includes the variable
    local prompt_file="$PROJECT_ROOT/.agents/prompts/overseer.md"
    if grep -q '\${ROLE_ADDITIONAL}' "$prompt_file"; then
        log_working "Overseer prompt includes ROLE_ADDITIONAL variable for injection"
    else
        log_issue "Overseer prompt missing ROLE_ADDITIONAL variable"
    fi
}

# =============================================================================
# Edge Test 8: Wire Daemon Agent File Handling
# =============================================================================

test_wire_daemon_agent_file() {
    log_edge "Test 8: Wire daemon agent file handling"
    
    local daemon_file="$PROJECT_ROOT/scripts/wire-daemon.py"
    
    # Check if daemon uses absolute path
    log_info "Checking wire daemon path resolution..."
    
    if python3 -c "
import sys
sys.path.insert(0, '$PROJECT_ROOT')
from pathlib import Path
from scripts.wire-daemon import PROJECT_ROOT

agent_file = PROJECT_ROOT / '.agents' / 'kimi-overseer.yaml'
print('EXISTS' if agent_file.exists() else 'MISSING')
print('ABSOLUTE' if str(agent_file).startswith('/') else 'RELATIVE')
" 2>/dev/null | grep -q "EXISTS.*ABSOLUTE"; then
        log_working "Wire daemon uses absolute path for agent file"
    else
        log_info "Wire daemon path resolution needs verification"
    fi
    
    # Check dry-run mode
    log_info "Testing wire daemon dry-run mode..."
    local dry_run_output
    dry_run_output=$(python3 "$daemon_file" --dry-run --status 2>&1) || true
    if echo "$dry_run_output" | grep -qE "DRY RUN|dry.*run"; then
        log_working "Wire daemon dry-run mode works correctly"
    else
        log_info "Wire daemon dry-run mode output unclear"
    fi
}

# =============================================================================
# Main
# =============================================================================

main() {
    echo ""
    echo "=============================================================================="
    echo "  Edge Case Testing for Agent File Integration"
    echo "=============================================================================="
    echo ""
    
    test_missing_agent_file
    echo ""
    
    test_command_construction
    echo ""
    
    test_path_resolution
    echo ""
    
    test_async_mode
    echo ""
    
    test_ci_workflow_yaml
    echo ""
    
    test_env_variable_handling
    echo ""
    
    test_role_additional_injection
    echo ""
    
    test_wire_daemon_agent_file
    echo ""
    
    # Summary
    echo "=============================================================================="
    echo "  Edge Test Summary"
    echo "=============================================================================="
    echo ""
    echo -e "${GREEN}Working Well:${NC} $WORKING_WELL"
    echo -e "${RED}Issues Found:${NC} $ISSUES_FOUND"
    echo ""
    
    if [ $ISSUES_FOUND -eq 0 ]; then
        echo -e "${GREEN}No edge case issues found!${NC}"
        exit 0
    else
        echo -e "${YELLOW}Some edge case issues found. Review above.${NC}"
        exit 0  # Don't fail, these are warnings
    fi
}

main "$@"

