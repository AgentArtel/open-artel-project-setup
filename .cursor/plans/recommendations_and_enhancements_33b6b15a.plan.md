---
name: Recommendations and Enhancements
overview: A catalog of recommendations, enhancements, and new features organized by category and priority, grounded in what actually exists after 7 phases of implementation and the gaps observed in real usage (Even-Openclaw).
todos:
  - id: rec-a1
    content: Dependency Resolution Skill (.agents/skills/dependency-resolution/)
    status: pending
  - id: rec-a2
    content: Security Review Skill (.agents/skills/security-review/)
    status: pending
  - id: rec-a3
    content: Onboarding Skill (.agents/skills/agent-onboarding/)
    status: pending
  - id: rec-a4
    content: Escalation Skill (.agents/skills/escalation/)
    status: pending
  - id: rec-b1-b4
    content: New subagent templates (security, refactoring, migration, API)
    status: pending
  - id: rec-c1-c3
    content: New patterns (rollback, hotfix, retrospective)
    status: pending
  - id: rec-d1-d4
    content: Automation enhancements (perf tracking, stale detection, etc)
    status: pending
  - id: rec-e1-e3
    content: Starter kit variants (two-agent, stack templates, workforce)
    status: pending
  - id: rec-f1-f3
    content: Agent intelligence features (learn from past, self-improve)
    status: pending
---

# Recommendations, Enhancements, and New Features

## What We Have (Inventory)

Before recommending new things, here is the grounded reality of what exists:

- **9 skills** (6 standard + 3 flow) in `.agents/skills/`
- **4 subagent templates** (debugger, performance-analyzer, documentation-writer, test-generator) in `.agents/subagents/`
- **7 patterns** (2 agent swarm, 4 subagent creation, 1 multimodal) in `.ai/patterns/`
- **13 tools** wired into Kimi Overseer (Shell, ReadFile, WriteFile, StrReplaceFile, Glob, Grep, SetTodoList, Think, Task, CreateSubagent, SendDMail, SearchWeb, FetchURL)
- **3 GitHub Actions** (agent-review, pre-mortal-merge, sprint-evaluation)
- **1 starter kit** (multi-agent-starter with 4 agents: Claude Code, Cursor, Lovable, Kimi)
- **1 past configuration** (Even-Openclaw, 30+ tasks, 4 phases)
- **18 ideas** tracked in `.ai/ideas/`
- **152 tests** across 7 phase test scripts

## Gaps Identified

Looking at Even-Openclaw's real usage ([past-configurations/Even-Openclaw/](past-configurations/Even-Openclaw/)) versus our templates:

1. Even-Openclaw has a `CURSOR_WORKFORCE.md` with Manager/Task chat patterns -- our starter kit has no equivalent workforce concept
2. Even-Openclaw has `project-vision/README.md` for architecture context -- no template for this
3. No skill exists for dependency resolution between tasks
4. No skill for security review (code-review checks boundaries but not vulnerabilities)
5. No automated escalation when tasks get stuck
6. No rollback or hot-fix patterns
7. Only one starter kit variant (multi-agent) -- no two-agent or solo-agent options
8. No stack-specific templates despite IDEA-014 being "Ready"
9. No mono-repo support despite IDEA-015 being researched

---

## Category A: New Skills (High Priority)

### A1. Dependency Resolution Skill

**Problem**: Tasks mention dependencies (`Depends on: TASK-XXX`) but there is no automated way to build a dependency graph, detect circular dependencies, or determine execution order.**What it would do**:

- Parse all task briefs in `.ai/tasks/`
- Build a directed acyclic graph (DAG)
- Detect and flag circular dependencies
- Output optimal execution order (topological sort)
- Identify parallelizable task groups

**Skill type**: Standard (not a flow)**Location**: `.agents/skills/dependency-resolution/SKILL.md`

### A2. Security Review Skill

**Problem**: The `code-review` skill checks boundaries and acceptance criteria but never specifically audits for security issues. Real projects need this.**What it would do**:

- Check for exposed secrets (API keys, tokens, passwords in code)
- Check for injection vulnerabilities (SQL, XSS, command injection)
- Check for insecure dependencies (known CVEs)
- Check for insecure configurations (CORS, headers, auth)
- Produce a security finding report in `.ai/reviews/`

**Skill type**: Standard**Location**: `.agents/skills/security-review/SKILL.md`

### A3. Onboarding Skill

**Problem**: When agents start on a new project, there is no structured way for them to "onboard" -- read the codebase, understand architecture, and build context before starting work.**What it would do**:

- Read `AGENTS.md`, `.ai/boundaries.md`, and project structure
- Scan codebase for key patterns (state management, routing, API layer)
- Identify existing conventions (naming, folder structure, test patterns)
- Produce a context summary saved to `.ai/reports/onboarding-<agent>.md`
- Agent can reference this summary at the start of each session

**Skill type**: Flow**Location**: `.agents/skills/agent-onboarding/SKILL.md`

### A4. Escalation Skill

**Problem**: If a task is rejected multiple times or stuck for too long, there is no defined escalation path. The task just loops.**What it would do**:

- Detect when a task has been rejected 3+ times (configurable threshold)
- Detect when a task has been `in_progress` beyond a time/cycle threshold
- Escalate to Human PM via `.ai/instructions/human-escalation-TASK-XXX.md`
- Optionally reassign to a different agent
- Log escalation in `.ai/chats/`

**Skill type**: Flow**Location**: `.agents/skills/escalation/SKILL.md`---

## Category B: New Subagent Templates (Medium Priority)

### B1. Security Auditor Subagent

Complements the Security Review Skill (A2). A dynamic subagent specialized in finding security issues.**Template**: `.agents/subagents/security-auditor-template.md`

### B2. Refactoring Specialist Subagent

For tasks that involve restructuring code without changing behavior. Checks that refactoring preserves functionality.**Template**: `.agents/subagents/refactoring-specialist-template.md`

### B3. Migration Specialist Subagent

For dependency upgrades, framework migrations (e.g., React 18 to 19, Vite 5 to 6). Handles breaking changes, migration guides, and compatibility checks.**Template**: `.agents/subagents/migration-specialist-template.md`

### B4. API Contract Validator Subagent

Validates API contracts between frontend and backend. Checks that types match, endpoints are used correctly, and request/response shapes are consistent.**Template**: `.agents/subagents/api-validator-template.md`---

## Category C: New Patterns (Medium Priority)

### C1. Rollback Pattern

**Problem**: If approved work causes issues after merge, there is no defined rollback procedure.**What it would do**:

- Detect regression after merge (via test failure or human report)
- Revert the merge commit on `pre-mortal`
- Re-open the task with regression notes
- Assign back to original agent
- Document the rollback in `.ai/chats/`

**Pattern**: `.ai/patterns/rollback-on-regression.md`

### C2. Hot-Fix Pattern

**Problem**: Emergency fixes need a fast path that bypasses the full submit-review-approve cycle.**What it would do**:

- Agent creates hot-fix branch: `hotfix/TASK-XXX-description`
- Abbreviated review (boundary check only, skip acceptance criteria)
- Fast merge with `[ACTION:hotfix]` routing
- Post-merge full review scheduled as follow-up task

**Pattern**: `.ai/patterns/emergency-hotfix.md`

### C3. Sprint Retrospective Pattern

**Problem**: Sprint evaluation generates metrics but there is no structured way to learn from them and improve the next sprint.**What it would do**:

- After evaluation, overseer identifies top 3 issues
- Proposes process improvements
- Human PM approves/rejects improvements
- Approved improvements are encoded into skills/patterns for next sprint

**Pattern**: `.ai/patterns/sprint-retrospective.md`---

## Category D: Automation Enhancements (Medium Priority)

### D1. Agent Performance Tracking

**Problem**: No way to track agent performance across sprints.**What it would do**:

- Track per-agent: approval rate, rejection rate, average review cycles, tasks completed
- Store in `.ai/metrics/agent-performance.json`
- Include in sprint evaluation reports
- Script: `scripts/track-agent-performance.sh`

### D2. Stale Task Detection

**Problem**: Tasks can sit in `in_progress` indefinitely with no alert.**What it would do**:

- GitHub Action (cron schedule, e.g., daily) that checks `.ai/status.md`
- Flags tasks that have been `in_progress` for more than N days
- Creates an escalation instruction if threshold exceeded
- Workflow: `.github/workflows/stale-task-detection.yml`

### D3. Branch Cleanup Automation

**Problem**: After merging agent branches, old branches accumulate.**What it would do**:

- GitHub Action that runs after successful merge to `pre-mortal`
- Deletes the source agent branch
- Logs the cleanup
- Workflow: `.github/workflows/branch-cleanup.yml`

### D4. Dependency Graph Visualization

**Problem**: Task dependencies are hard to visualize from text files.**What it would do**:

- Script that reads all `.ai/tasks/` files
- Parses `Depends on:` fields
- Generates a Mermaid diagram of the dependency graph
- Outputs to `.ai/reports/dependency-graph.md`
- Script: `scripts/generate-dependency-graph.sh`

---

## Category E: Starter Kit Variants (High Priority -- Backlog Items)

### E1. Two-Agent Starter Kit

From the existing backlog. For projects that do not use Lovable.**Location**: `setups/two-agent-starter/` (Claude Code + Cursor + Kimi)**Key difference**: No Lovable agent, combined UI/logic ownership for Cursor, simpler boundaries.

### E2. Stack-Specific Templates (IDEA-014)

From the existing backlog. Pre-configured for common stacks.**Templates**:

- `setups/templates/react-supabase/` -- based on Even-Openclaw patterns
- `setups/templates/typescript-api/` -- Node.js backend
- `setups/templates/full-stack/` -- Combined frontend + backend

### E3. Workforce Protocol Skill

**Problem**: Even-Openclaw's `CURSOR_WORKFORCE.md` defines a Manager/Task chat pattern for Cursor that is not captured in any skill.**What it would do**:

- Codify the Manager Chat / Task Chat pattern as a skill
- Define how Manager assigns work, how Task Chats report back
- Template for workforce setup guide
- Integrate into starter kit

**Location**: `.agents/skills/workforce-protocol/SKILL.md`---

## Category F: Agent Intelligence (Experimental)

### F1. Learn from Past Configurations

**Problem**: We have Even-Openclaw's data but agents never study it to apply lessons.**What it would do**:

- Skill that instructs agents to read `past-configurations/` before starting a new project
- Compare current project structure against past successes/failures
- Apply patterns that worked, avoid patterns that did not

### F2. Self-Improvement Loop

**Problem**: After each sprint, agents could propose improvements to their own skills/patterns but there is no process for this.**What it would do**:

- After sprint evaluation, overseer reviews its own performance
- Proposes updates to skills, patterns, or templates
- Human PM reviews proposals
- Approved changes are committed as skill/pattern updates

### F3. Context-Aware Task Assignment

**Problem**: Tasks are assigned based on file ownership, not agent current context state.**What it would do**:

- Before assigning a task, check agent's current session context size
- If context is near threshold, suggest compaction first
- Prefer assigning related tasks to agents with relevant context still loaded
- Factor in agent's recent rejection rate for task type

---

## Recommended Priority Order