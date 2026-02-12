---
name: "Critical Fix: Commit Message Routing Headers Enforcement"
overview: "Address critical Issue #1 by enforcing commit message routing headers through Cursor rules updates, pre-commit validation, documentation improvements, and validation scripts to ensure automation workflow functions correctly."
todos:
  - id: update-cursor-rules
    content: Update .cursor/rules/00-project-context.mdc to add explicit Commit Message Requirements section with routing header format requirement
    status: pending
  - id: create-verification-rule
    content: Create .cursor/rules/99-verification.mdc with pre-commit checklist and validation reminders
    status: pending
  - id: update-agents-md
    content: Update AGENTS.md Git Workflow section to emphasize routing headers as REQUIRED with examples and warnings
    status: pending
  - id: create-validation-script
    content: Create scripts/validate-commit-message.sh standalone validation script
    status: pending
  - id: create-pre-commit-source
    content: Create scripts/pre-commit source file with validation logic
    status: pending
    dependencies:
      - create-validation-script
  - id: update-install-hooks
    content: Update scripts/install-git-hooks.sh to install pre-commit hook
    status: pending
    dependencies:
      - create-pre-commit-source
  - id: update-docs
    content: Update docs/claude-kimi-coordination.md and docs/github-actions-automation.md to emphasize routing header requirements
    status: pending
  - id: create-onboarding-checklist
    content: Create .ai/templates/agent-onboarding-checklist.md with commit message requirements
    status: pending
  - id: update-commit-template
    content: Update .ai/templates/commit-message.md to add automation failure warning
    status: pending
  - id: test-validation
    content: Test pre-commit hook validation with valid and invalid commit messages
    status: pending
    dependencies:
      - update-install-hooks
---

# Critical Fix: Commit Message Routing Headers Enforcement

## Overview

Fix the critical issue where agents are not using required commit message routing headers, causing automation failures. This plan addresses Issue #1 (Critical), Issue #2 (Medium), Issue #4 (Low), and Issue #5 (Low - will be resolved by fixing #1).

## Problem Statement

**Critical Impact**: Without routing headers, the entire automation workflow breaks:

- Post-commit hook skips commits
- Kimi automated review not triggered
- No automatic status updates
- Manual intervention required

**Root Cause**:

- Cursor rules don't explicitly require routing headers
- No pre-commit validation
- Agents may not be aware of requirements
- Documentation doesn't emphasize the requirement

## Implementation Tasks

### Task 1: Update Core Cursor Rules (CRITICAL)

**File**: `.cursor/rules/00-project-context.mdc`**Changes**:

- Add explicit "Commit Message Requirements" section
- State that ALL commits MUST use routing header format
- Reference `.agents/skills/git-routing/SKILL.md`
- Add examples for each agent
- Make it prominent (near top of file)

**Content to add**:

```markdown
## Commit Message Requirements (CRITICAL)

**ALL commits MUST use the routing header format:**

```

[AGENT:agent] [ACTION:action] [TASK:task-id] Short description

```javascript

**This is REQUIRED** - commits without routing headers will:
- Skip automated review
- Miss status updates
- Break the automation workflow

**Examples**:
- `[AGENT:cursor] [ACTION:submit] [TASK:TASK-005] Complete LLM integration`
- `[AGENT:cursor] [ACTION:update] [TASK:TASK-005] Progress update`
- `[AGENT:kimi] [ACTION:approve] [TASK:TASK-005] Work approved`

**Full specification**: See `.agents/skills/git-routing/SKILL.md`

**Before committing, verify your commit message includes all three headers.**
```



### Task 2: Create Verification Rule File

**File**: `.cursor/rules/99-verification.mdc` (NEW)**Purpose**: Pre-commit checklist and validation reminders**Content**:

- Commit message format validation checklist
- Reference to routing header requirements
- Link to git-routing skill
- Reminder about automation dependencies

### Task 3: Update AGENTS.md Git Workflow Section

**File**: `AGENTS.md` (around line 135-150)**Changes**:

- Emphasize routing header format as REQUIRED (not optional)
- Add warning about automation failure without headers
- Provide clear examples for each agent
- Link to git-routing skill
- Add to "Done Checklist" section

### Task 4: Create Pre-Commit Hook for Validation

**File**: `.git/hooks/pre-commit` (NEW)**Purpose**: Validate commit message format before commit is finalized**Functionality**:

- Check if commit message starts with `[AGENT:`
- Check if commit message contains `[ACTION:`
- Check if commit message contains `[TASK:`
- Warn if headers missing (with option to bypass with `--no-verify`)
- Provide helpful error message with format example

**Implementation**:

- Read commit message from `$1` (commit message file)
- Use regex to validate format
- Exit with error if validation fails (unless `--no-verify`)
- Log validation attempts

### Task 5: Create Validation Script

**File**: `scripts/validate-commit-message.sh` (NEW)**Purpose**: Standalone script to validate commit messages**Functionality**:

- Can be run manually: `./scripts/validate-commit-message.sh "commit message"`
- Can be used by pre-commit hook
- Returns exit code 0 if valid, 1 if invalid
- Provides helpful error messages

### Task 6: Update Install Git Hooks Script

**File**: `scripts/install-git-hooks.sh`**Changes**:

- Install pre-commit hook in addition to post-commit
- Copy `scripts/pre-commit` to `.git/hooks/pre-commit`
- Make it executable
- Document pre-commit hook in help text

### Task 7: Create Pre-Commit Hook Source File

**File**: `scripts/pre-commit` (NEW)**Purpose**: Source file for pre-commit hook (installed by install-git-hooks.sh)**Content**: Same validation logic as `.git/hooks/pre-commit` but as source file

### Task 8: Update Documentation

**Files to update**:

- `docs/claude-kimi-coordination.md` - Emphasize routing header requirement
- `docs/github-actions-automation.md` - Add routing header validation section
- `.ai/templates/commit-message.md` - Add warning about automation failure

### Task 9: Create Agent Onboarding Checklist

**File**: `.ai/templates/agent-onboarding-checklist.md` (NEW)**Purpose**: Checklist for new agents to ensure they understand requirements**Content**:

- Commit message format requirement
- Routing header examples
- Pre-commit validation explanation
- Links to relevant documentation

### Task 10: Update Done Checklist in Cursor Rules

**File**: `.cursor/rules/00-project-context.mdc`**Changes**:

- Add commit message validation to "Done Checklist"
- Require verification before committing

## Files to Create

1. `.cursor/rules/99-verification.mdc` - Verification checklist
2. `scripts/pre-commit` - Pre-commit hook source
3. `scripts/validate-commit-message.sh` - Validation script
4. `.ai/templates/agent-onboarding-checklist.md` - Onboarding checklist

## Files to Modify

1. `.cursor/rules/00-project-context.mdc` - Add routing header requirements
2. `AGENTS.md` - Emphasize routing header requirement in Git Workflow section
3. `scripts/install-git-hooks.sh` - Add pre-commit hook installation
4. `docs/claude-kimi-coordination.md` - Emphasize routing headers
5. `docs/github-actions-automation.md` - Add validation section
6. `.ai/templates/commit-message.md` - Add automation warning

## Validation Logic

The pre-commit hook should check:

1. Commit message contains `[AGENT:` (case-insensitive)
2. Commit message contains `[ACTION:` (case-insensitive)
3. Commit message contains `[TASK:` (case-insensitive)
4. All three headers are present

**Error message if validation fails**:

```javascript
❌ Commit message missing required routing headers!

Required format:
  [AGENT:agent] [ACTION:action] [TASK:task-id] Description

Example:
  [AGENT:cursor] [ACTION:submit] [TASK:TASK-005] Complete feature

Your commit message:
  [your commit message here]

See .agents/skills/git-routing/SKILL.md for full specification.

To bypass this check (not recommended): git commit --no-verify
```



## Testing

After implementation, verify:

1. Pre-commit hook rejects commits without routing headers
2. Pre-commit hook accepts commits with routing headers
3. `--no-verify` bypass works (for emergency commits)
4. Validation script works standalone
5. Documentation is clear and accessible
6. Cursor rules are prominent and visible

## Priority

**CRITICAL** - This blocks all automation. Should be implemented immediately.

## Related Issues

- Issue #1: Commit Message Routing Headers (THIS PLAN)
- Issue #2: Agent Communication Alignment (partially addressed by this plan)
- Issue #4: Pre-Commit Validation (THIS PLAN addresses this)
- Issue #5: Kimi Automation (will be resolved by fixing #1)

## Additional Considerations

### Issue #8: GitHub Secrets Setup

- Document in setup instructions
- Add to project setup checklist
- Create setup guide for new projects

### Issue #3: Vite .env (Already Resolved)