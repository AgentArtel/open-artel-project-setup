# TASK-003: Upstream Feedback System + Version Tracking + Session Lifecycle

- **Status**: PLANNING
- **Assigned**: Claude Code
- **Priority**: P1
- **Type**: Create
- **Depends on**: TASK-002 (research complete)
- **Blocks**: Downstream project adoption quality

## Context

Once a project copies the starter kit, there's **zero connection back** to this repo. No version tracking, no feedback channel, no way for agents to report issues upstream. Even-Openclaw (our only past configuration) has no reference to the starter kit at all.

Additionally, agents lose context between sessions. Every new Claude Code conversation, Kimi session, or Cursor chat starts cold — agents must manually re-orient before being productive. There's no standard for session initialization, conversation summarization, or upgrade checking.

This task creates the infrastructure for:
1. **Version tracking** — downstream projects know which starter kit version they're running
2. **Feedback channel** — agents and humans in downstream projects can report issues/ideas back
3. **Agent-initiated feedback** — agents can programmatically submit upstream feedback
4. **GitHub issue templates** — structured intake for feedback on this repo
5. **Upgrade path** — existing projects can check for and apply updates
6. **Session initialization** — agents review their role and context at session start
7. **Conversation summarization** — context preserved across sessions

## Research Findings

### Distribution (current)
- Manual `cp` from `setups/multi-agent-starter/` into project
- `BOOTSTRAP_PLAYBOOK.md` guides Claude Code to fill `[REPLACE]` placeholders
- No version stamp, no upstream link, no feedback mechanism
- Even-Openclaw snapshot confirms: zero upstream references in practice

### GitHub CLI (`gh`)
- `gh issue create --repo owner/repo` creates issues on ANY repo (not just cwd)
- `--body-file` reads body from a file — perfect for agent-generated feedback
- `--label` attaches labels, `--template` selects issue form
- Auth: `GITHUB_TOKEN` env var or `gh auth login`
- Not installed in this environment — must be optional, not required

### GitHub Issue Templates
- `.github/ISSUE_TEMPLATE/*.yml` creates structured web forms
- Input types: `input`, `textarea`, `dropdown`, `checkboxes`, `markdown`
- Can enforce required fields (project name, version, feedback type)
- CLI can bypass forms with `--body-file` for agent automation

### Version Tracking Patterns
- Embed version comment in distributed files: `<!-- STARTER_VERSION: 1.0.0 -->`
- Dedicated origin file: `.ai/origin.md` with source, version, install date
- Git tags for releases on this repo
- No telemetry/tracking — just passive stamps that agents can read

### Upstream Feedback Patterns (open source)
- GitHub Issues + Discussions is the standard — no complex portals needed
- Yeoman, Next.js, CRA: all rely on organic issue reports
- Key: make it easy to report, not mandatory
- CTAs in README and docs drive feedback better than any automation

### Claude Code Session Hooks
- **SessionStart hook** runs on session startup, resume, clear, and compact
- **stdout from SessionStart hooks is injected into Claude's context** — unique feature
- Can execute shell scripts that output dynamic context (sprint status, active tasks)
- Configured in `.claude/settings.json` under `hooks.SessionStart`
- Static context should go in CLAUDE.md (@ imports); dynamic context via hooks
- CLAUDE.md supports `@path/to/file` imports — can reference AGENTS.md, status.md, etc.
- `.claude/rules/*.md` for modular rules (like Cursor's `.cursor/rules/`)

### Kimi Session Continuity
- `kimi --continue` resumes most recent session (conversational continuity)
- `/compact` command: AI summarizes conversation, replaces original context with summary
- Auto-triggered when context exceeds limit
- Sessions auto-reset after 4am or 30 days idle
- Critical state must live in files (`.ai/`), not just session context

### Conversation Summarization Patterns (2026)
- **Hierarchical summarization**: Sprint summary → Phase summary → Task summary → Key decisions
- **Context Bus**: Centralized state files (JSON/Markdown) shared across agents
- **Narrative casting** (Google ADK): Re-frame prior messages as narrative for next agent
- **Sliding window**: Keep last N messages in full, summarize older ones
- **Key insight**: "Most agent failures are orchestration and context-transfer issues"

### Current Session Initialization Patterns (in this repo)
All agents follow the same hierarchy:
1. AGENTS.md (identity + structure) — universal entry point
2. `.ai/status.md` (current state) — session checkpoint
3. `.ai/tasks/` (work items) — what to do
4. `.ai/boundaries.md` (ownership) — what NOT to touch

Kimi: environment variable injection + explicit status check
Claude Code: CLAUDE.md with @ references + memory directory
Cursor: always-on `.mdc` rules + explicit Manager Chat preamble

---

## Implementation Plan

### Part 1: Version Tracking (in this repo)

**1a. Create `.ai/origin.md` template in starter kit**

File: `setups/multi-agent-starter/.ai/origin.md`

Purpose: Downstream projects keep this file to track where their setup came from and what version they started with.

```markdown
# Open Artel Origin

- **Source**: https://github.com/AgentArtel/open-artel-project-setup
- **Setup**: multi-agent-starter
- **Version**: [STARTER_VERSION]
- **Installed**: [DATE]
- **Installed by**: [AGENT or HUMAN]

## How to Check for Updates

1. Visit the source repo's releases page
2. Compare your version against the latest
3. Review the changelog for breaking changes
4. Manually apply relevant updates

## Feedback

Found an issue with the starter kit? See `.ai/templates/upstream-feedback.md`
```

**1b. Add version comments to key distributed files**

Add `<!-- STARTER_VERSION: 0.1.0 -->` comment to the top of:
- `setups/multi-agent-starter/AGENTS.md`
- `setups/multi-agent-starter/CLAUDE.md`

These survive the `[REPLACE]` customization process — agents can always find them.

**1c. Add version to BOOTSTRAP_PLAYBOOK.md**

Update the playbook to instruct Claude Code to fill in the origin file during setup:
- Record the version
- Record the install date
- Record who installed it (Claude Code during bootstrap)

---

### Part 2: Feedback Template (in starter kit)

**2a. Create upstream feedback template**

File: `setups/multi-agent-starter/.ai/templates/upstream-feedback.md`

This template is what agents in downstream projects fill out when they find an issue with the coordination system itself (not a product bug).

```markdown
# Upstream Feedback

- **Project**: [project name]
- **Starter Kit Version**: [from .ai/origin.md]
- **Reporter**: [agent name or human]
- **Date**: [YYYY-MM-DD]
- **Category**: [bug | enhancement | clarification | missing-feature]

## Affected File(s)

[Which starter kit file(s) does this relate to?]

## Description

[What's the issue or suggestion?]

## Impact

[How does this affect your project's workflow?]

## Proposed Fix (optional)

[If you have a suggestion for how to fix or improve it]
```

**2b. Create feedback folder in starter kit**

Add `setups/multi-agent-starter/.ai/feedback/.gitkeep` so downstream projects have a place to collect feedback files before submitting.

---

### Part 3: Feedback Submission Script (in starter kit)

**3a. Create `scripts/submit-feedback.sh`**

File: `setups/multi-agent-starter/scripts/submit-feedback.sh`

A lightweight script that:
1. Reads a feedback file from `.ai/feedback/`
2. Reads version from `.ai/origin.md`
3. If `gh` is available and authenticated: creates a GitHub issue on `AgentArtel/open-artel-project-setup` with labels
4. If `gh` is NOT available: prints instructions for manual submission
5. Never blocks, never fails hard — graceful degradation

Follows the same patterns as `install-git-hooks.sh`:
- Color-coded output (info/success/warn/error)
- Prerequisite checking (gh installed? authenticated? feedback file exists?)
- Dry-run mode (`--dry-run` flag)
- Help mode (`--help`)

```bash
# Usage examples:
./scripts/submit-feedback.sh .ai/feedback/FEEDBACK-001.md
./scripts/submit-feedback.sh --dry-run .ai/feedback/FEEDBACK-001.md
./scripts/submit-feedback.sh --help
```

**3b. Also copy to this repo's own `scripts/`**

So this repo itself can use the same mechanism.

---

### Part 4: GitHub Issue Templates (in this repo)

**4a. Create `.github/ISSUE_TEMPLATE/downstream-feedback.yml`**

A structured GitHub issue form for feedback from projects using the starter kit:

Fields:
- Project Name (input, required)
- Starter Kit Version (input, required — "Check .ai/origin.md")
- Feedback Type (dropdown: bug, enhancement, clarification, missing feature, success story)
- Affected File (input — which starter kit file)
- Description (textarea, required)
- Impact (textarea)
- Proposed Fix (textarea, optional)
- Labels: auto-assign `downstream-feedback`

**4b. Create `.github/ISSUE_TEMPLATE/bug-report.yml`**

Standard bug report for issues with this repo itself (not downstream feedback).

**4c. Create `.github/ISSUE_TEMPLATE/config.yml`**

Issue template chooser config:
- Links to feedback form
- Links to bug report
- Links to GitHub Discussions (if enabled)
- Contact link for general questions

---

### Part 5: Agent Integration (instructions for downstream agents)

**5a. Add feedback instructions to starter kit AGENTS.md**

Add a section to `setups/multi-agent-starter/AGENTS.md`:

```markdown
## Upstream Feedback

If you find an issue with the coordination system itself (not a product bug):

1. Create a feedback file: `.ai/feedback/FEEDBACK-XXX.md` using the template at `.ai/templates/upstream-feedback.md`
2. Submit it: `./scripts/submit-feedback.sh .ai/feedback/FEEDBACK-XXX.md`
3. Or manually: open an issue at [source repo URL]
```

**5b. Add feedback action to commit routing**

Add `feedback` as a valid ACTION in the commit message routing:
- `[AGENT:claude] [ACTION:feedback] [TASK:UPSTREAM] Description`
- Not routed to Kimi — just logged and flagged for human review
- Agent writes feedback file, commits with this header
- Human relays to upstream (or script auto-submits)

**5c. Update BOOTSTRAP_PLAYBOOK.md**

Add a step (or note in "Ongoing Maintenance") telling users:
- How to report issues with the starter kit
- Where to check for updates
- How to submit feedback

---

### Part 6: Upstream Intake (in this repo)

**6a. Add feedback tracking to `.ai/ideas.md`**

When feedback arrives (via GitHub issue or manually), it enters the idea pipeline:
- `1-capture/` for raw feedback
- Promoted through the pipeline if actionable

**6b. Add `feedback` label convention**

In `.ai/templates/idea.md`, add "downstream-feedback" as a valid Origin:
- `- **Origin**: downstream-feedback (ProjectName)`

This lets us track which ideas came from real project usage vs internal brainstorming.

---

### Part 7: Upgrade Path for Existing Projects

**Problem**: Projects that adopted v0.1.0 of the starter kit have no way to know v0.2.0 exists, what changed, or how to update. Files have been customized — can't just re-copy everything.

**7a. Create `CHANGELOG.md` in this repo**

Track what changed between versions, organized by which files are affected:

```markdown
# Changelog

## v0.2.0 (2026-02-12)

### New Files (safe to copy)
- `.ai/templates/upstream-feedback.md`
- `.ai/origin.md`
- `scripts/submit-feedback.sh`

### Modified Files (merge carefully)
- `AGENTS.md` — Added Upstream Feedback section, Git Automation section
- `BOOTSTRAP_PLAYBOOK.md` — Added origin file setup step

### No Changes
- `CLAUDE.md`
- `.cursor/rules/*`
- `.ai/templates/task.md`
```

Key: separate files into "safe to copy" (new files, generic files) vs "merge carefully" (customized files).

**7b. Create `scripts/check-updates.sh` in starter kit**

A lightweight script that:
1. Reads current version from `.ai/origin.md`
2. Checks latest release on GitHub (via `gh api` or `curl`)
3. Compares versions
4. If newer version exists: prints changelog summary and upgrade instructions
5. If current: prints "You're up to date"
6. Graceful degradation if no network / no `gh`

```bash
./scripts/check-updates.sh
# Output:
# Current version: 0.1.0
# Latest version: 0.2.0
#
# New in v0.2.0:
# - Upstream feedback system (new files, safe to copy)
# - Session initialization hooks (new files, safe to copy)
# - AGENTS.md updates (merge carefully — you've customized this)
#
# To upgrade:
# 1. Review changelog: https://github.com/AgentArtel/open-artel-project-setup/blob/main/CHANGELOG.md
# 2. Copy new files from the starter kit
# 3. Manually merge changes to customized files
```

**7c. Create `.ai/templates/upgrade-checklist.md` in starter kit**

Template for tracking an upgrade:

```markdown
# Upgrade Checklist: v[OLD] → v[NEW]

## New Files (copy directly)
- [ ] `.ai/templates/upstream-feedback.md`
- [ ] `scripts/submit-feedback.sh`

## Modified Files (merge manually)
- [ ] `AGENTS.md` — review diff, apply relevant changes
- [ ] `BOOTSTRAP_PLAYBOOK.md` — review diff

## Post-Upgrade
- [ ] Update `.ai/origin.md` version
- [ ] Run `./scripts/check-updates.sh` to confirm
- [ ] Test: verify build passes
- [ ] Commit: `[AGENT:claude] [ACTION:update] [TASK:UPGRADE] Upgrade starter kit to vX.Y.Z`
```

**7d. File categorization system**

In `.ai/origin.md`, maintain a list of which files were customized vs left generic. This helps upgrade scripts know what's safe to overwrite:

```markdown
## File Status

### Generic (safe to overwrite on upgrade)
- `.ai/templates/task.md`
- `.cursor/rules/06-task-protocol.mdc`
- `.cursor/rules/07-workforce-protocol.mdc`

### Customized (merge manually on upgrade)
- `AGENTS.md` — customized during bootstrap
- `.ai/boundaries.md` — generated from codebase analysis
- `.cursor/rules/00-project-context.mdc` — project-specific context
```

---

### Part 8: Session Initialization (role review at session start)

**Problem**: Every new conversation starts cold. Agents waste the first 2-3 turns re-orienting. The user has to say "read AGENTS.md and status.md" every time.

**8a. Create `scripts/session-init.sh` for Claude Code SessionStart hook**

A script that runs automatically when Claude Code starts a new session. Its stdout is injected into Claude's context.

```bash
#!/bin/bash
# scripts/session-init.sh — SessionStart hook for Claude Code
# Output goes directly into Claude's conversation context

echo "## Session Context (auto-loaded)"
echo ""

# 1. Current sprint status (2-3 lines)
echo "### Sprint Status"
head -20 .ai/status.md 2>/dev/null || echo "No status file found."
echo ""

# 2. Active tasks
echo "### Active Tasks"
if ls .ai/tasks/*.md 1>/dev/null 2>&1; then
    for f in .ai/tasks/*.md; do
        status=$(grep -m1 "Status" "$f" | head -1)
        title=$(head -1 "$f" | sed 's/^# //')
        echo "- $title — $status"
    done
else
    echo "No active tasks."
fi
echo ""

# 3. Last session summary (if exists)
if [ -f .ai/sessions/latest.md ]; then
    echo "### Last Session Summary"
    cat .ai/sessions/latest.md
    echo ""
fi

# 4. Pending feedback/reviews
if ls .ai/reviews/*.md 1>/dev/null 2>&1; then
    echo "### Pending Reviews"
    ls -1 .ai/reviews/*.md
    echo ""
fi

# 5. Version check (quick, no network)
if [ -f .ai/origin.md ]; then
    version=$(grep "Version" .ai/origin.md | head -1)
    echo "### Starter Kit"
    echo "$version"
    echo ""
fi
```

**8b. Create `.claude/settings.json` template in starter kit**

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "bash scripts/session-init.sh"
          }
        ]
      }
    ]
  }
}
```

**8c. Add session init to Kimi overseer prompt**

Update `.agents/prompts/overseer.md` to include explicit session start protocol:

```markdown
## Session Start Protocol

When starting or resuming a session:
1. Read `.ai/status.md` — current sprint state
2. Run `git log --oneline -10` — recent activity
3. Check `.ai/tasks/` for active assignments
4. Check `.ai/reviews/` for pending reviews
5. Check `.ai/instructions/` for new directives
6. Read `.ai/sessions/latest.md` if it exists — last session summary
7. Report: "Session resumed. Sprint: [status]. Active tasks: [count]. Pending reviews: [count]."
```

**8d. Add session init to Cursor Manager Chat template**

Update the Manager Chat prompt in `.ai/CURSOR_WORKFORCE.md` to include:

```markdown
Before responding to any request, always read:
1. AGENTS.md (your role and boundaries)
2. .ai/status.md (current sprint)
3. .ai/boundaries.md (file ownership)
4. .ai/sessions/latest.md (last session summary, if exists)

Start every session by reporting: "Manager ready. Sprint: [status]. [N] active tasks."
```

**8e. Create `.ai/sessions/` directory in starter kit**

Add `setups/multi-agent-starter/.ai/sessions/.gitkeep` for session summaries.

---

### Part 9: Conversation Summarization (context across sessions)

**Problem**: When a session ends (context window full, user closes terminal, etc.), all conversation context is lost. The next session starts from scratch.

**9a. Create `scripts/summarize-session.sh`**

A script that generates a session summary from recent activity. Can be run manually at session end or triggered by a hook.

```bash
#!/bin/bash
# scripts/summarize-session.sh — Generate session summary
# Usage: ./scripts/summarize-session.sh [optional: session notes]

SESSIONS_DIR=".ai/sessions"
mkdir -p "$SESSIONS_DIR"

DATE=$(date +%Y-%m-%d)
SESSION_NUM=$(ls "$SESSIONS_DIR"/"$DATE"-*.md 2>/dev/null | wc -l)
SESSION_NUM=$((SESSION_NUM + 1))
SESSION_FILE="$SESSIONS_DIR/${DATE}-${SESSION_NUM}.md"

# Gather context
echo "# Session Summary: $DATE #$SESSION_NUM" > "$SESSION_FILE"
echo "" >> "$SESSION_FILE"
echo "## Recent Commits" >> "$SESSION_FILE"
git log --oneline -10 --since="8 hours ago" >> "$SESSION_FILE" 2>/dev/null
echo "" >> "$SESSION_FILE"
echo "## Files Changed This Session" >> "$SESSION_FILE"
git diff --name-only HEAD~5..HEAD >> "$SESSION_FILE" 2>/dev/null
echo "" >> "$SESSION_FILE"
echo "## Status at Session End" >> "$SESSION_FILE"
cat .ai/status.md >> "$SESSION_FILE" 2>/dev/null
echo "" >> "$SESSION_FILE"

# Add user notes if provided
if [ -n "$1" ]; then
    echo "## Session Notes" >> "$SESSION_FILE"
    echo "$1" >> "$SESSION_FILE"
    echo "" >> "$SESSION_FILE"
fi

# Update latest pointer
cp "$SESSION_FILE" "$SESSIONS_DIR/latest.md"

echo "Session summary saved to: $SESSION_FILE"
```

**9b. Create `.ai/templates/session-summary.md`**

Template for agent-written session summaries (richer than the script-generated version):

```markdown
# Session Summary

- **Date**: [YYYY-MM-DD]
- **Agent**: [who worked this session]
- **Duration**: [approximate]
- **Sprint**: [current sprint status]

## What Was Done
[1-3 bullet points of accomplishments]

## Key Decisions Made
[Decisions that affect future work — don't lose these]

## Current State
[Where things stand right now — what's in progress, what's blocked]

## Next Steps
[What the next session should start with]

## Open Questions
[Anything unresolved that needs human input]
```

**9c. Add session end instructions to CLAUDE.md template**

Add to `setups/multi-agent-starter/CLAUDE.md`:

```markdown
## Session End Protocol

Before ending a session or when context is getting long:
1. Write a session summary to `.ai/sessions/` using the template
2. Update `.ai/status.md` if task statuses changed
3. Commit any uncommitted work
4. Note any open questions for the human in the summary
```

**9d. Add session summarization to Kimi overseer**

Update `.agents/prompts/overseer.md` to include:

```markdown
## Session End Protocol

Before ending a session:
1. Run `/compact` to compress conversation context
2. Write session summary to `.ai/sessions/YYYY-MM-DD-N.md`
3. Update `.ai/status.md` with current sprint state
4. Commit: `[AGENT:kimi] [ACTION:report] [TASK:SESSION] Session summary`
```

**9e. Add `summarize` as a valid commit routing ACTION**

In `.ai/templates/commit-message.md`, add:
- `[AGENT:any] [ACTION:summarize] [TASK:SESSION] Session end summary`
- Not routed to automation — just logged for reference
- Signals to the next session that a summary is available

---

## File Changes Summary

### New files to create:

| # | File | Location | Purpose |
|---|------|----------|---------|
| 1 | `origin.md` | `setups/multi-agent-starter/.ai/` | Version + source tracking template |
| 2 | `upstream-feedback.md` | `setups/multi-agent-starter/.ai/templates/` | Feedback template for agents |
| 3 | `.gitkeep` | `setups/multi-agent-starter/.ai/feedback/` | Feedback collection folder |
| 4 | `submit-feedback.sh` | `setups/multi-agent-starter/scripts/` | Feedback submission script |
| 5 | `submit-feedback.sh` | `scripts/` | Same script for this repo |
| 6 | `downstream-feedback.yml` | `.github/ISSUE_TEMPLATE/` | GitHub issue form |
| 7 | `bug-report.yml` | `.github/ISSUE_TEMPLATE/` | Standard bug report form |
| 8 | `config.yml` | `.github/ISSUE_TEMPLATE/` | Issue template chooser |
| 9 | `CHANGELOG.md` | repo root | Version history with upgrade guidance |
| 10 | `check-updates.sh` | `setups/multi-agent-starter/scripts/` | Upgrade checker script |
| 11 | `upgrade-checklist.md` | `setups/multi-agent-starter/.ai/templates/` | Upgrade tracking template |
| 12 | `session-init.sh` | `setups/multi-agent-starter/scripts/` | SessionStart hook script |
| 13 | `session-init.sh` | `scripts/` | Same script for this repo |
| 14 | `settings.json` | `setups/multi-agent-starter/.claude/` | Claude Code hook config |
| 15 | `.gitkeep` | `setups/multi-agent-starter/.ai/sessions/` | Session summaries folder |
| 16 | `summarize-session.sh` | `setups/multi-agent-starter/scripts/` | Session summary generator |
| 17 | `summarize-session.sh` | `scripts/` | Same script for this repo |
| 18 | `session-summary.md` | `setups/multi-agent-starter/.ai/templates/` | Session summary template |

### Files to modify:

| # | File | Change |
|---|------|--------|
| 1 | `setups/multi-agent-starter/AGENTS.md` | Version comment + Upstream Feedback + Session Protocol sections |
| 2 | `setups/multi-agent-starter/CLAUDE.md` | Version comment + Session End Protocol |
| 3 | `setups/multi-agent-starter/BOOTSTRAP_PLAYBOOK.md` | Origin file setup + feedback + session init setup steps |
| 4 | `setups/multi-agent-starter/README.md` | Feedback CTAs + version info + session features |
| 5 | `.ai/templates/commit-message.md` | Add `feedback` and `summarize` as valid ACTIONs |
| 6 | `.ai/templates/idea.md` | Add `downstream-feedback` as valid Origin |
| 7 | `AGENTS.md` (root) | Document feedback, sessions, scripts in structure |
| 8 | `README.md` (root) | Feedback section + session initialization docs |
| 9 | `.agents/prompts/overseer.md` | Add Session Start + Session End protocols |
| 10 | `setups/multi-agent-starter/.ai/CURSOR_WORKFORCE.md` | Add session init to Manager Chat template |

### Files NOT changed:

- No changes to existing idea files, task files, or research docs
- No changes to `.agents/skills/` SKILL.md files
- No changes to `.agents/` YAML agent definitions (only overseer prompt)
- No changes to `scripts/post-commit` or `install-git-hooks.sh`
- No changes to `past-configurations/`

---

## Acceptance Criteria

### Version Tracking + Feedback (Parts 1-6)
- [ ] Downstream projects have `.ai/origin.md` tracking which version they installed
- [ ] Origin file categorizes files as generic vs customized
- [ ] Agents can fill `.ai/templates/upstream-feedback.md` to report issues
- [ ] `scripts/submit-feedback.sh` creates GitHub issues when `gh` is available
- [ ] Script degrades gracefully when `gh` is not available (prints manual instructions)
- [ ] GitHub issue templates provide structured intake on this repo
- [ ] BOOTSTRAP_PLAYBOOK.md includes origin file creation during setup
- [ ] Starter kit AGENTS.md includes upstream feedback section
- [ ] Commit routing recognizes `[ACTION:feedback]`

### Upgrade Path (Part 7)
- [ ] CHANGELOG.md exists with clear per-version file categorization
- [ ] `scripts/check-updates.sh` compares local version against latest release
- [ ] Upgrade checklist template guides manual merge of customized files
- [ ] Graceful degradation when offline or `gh` not available

### Session Initialization (Part 8)
- [ ] `scripts/session-init.sh` outputs sprint status + active tasks + last session summary
- [ ] `.claude/settings.json` configures SessionStart hook
- [ ] Kimi overseer prompt includes session start protocol
- [ ] Cursor Manager Chat template includes session init preamble
- [ ] `.ai/sessions/` directory exists for session summaries

### Conversation Summarization (Part 9)
- [ ] `scripts/summarize-session.sh` generates summary from recent git activity
- [ ] `.ai/templates/session-summary.md` provides agent-friendly summary format
- [ ] CLAUDE.md template includes session end protocol
- [ ] Kimi overseer prompt includes session end protocol
- [ ] Commit routing recognizes `[ACTION:summarize]`

### General
- [ ] All new files follow existing template patterns (Markdown, no dependencies)
- [ ] No runtime dependencies added (pure bash + optional `gh` + optional `curl`)
- [ ] Scripts follow `install-git-hooks.sh` patterns: color output, prereq checks, graceful degradation

---

## Implementation Order

### Phase A: Version + Feedback (Parts 1-6)
1. Version tracking (origin.md, version comments) — smallest, most valuable
2. Feedback template (upstream-feedback.md, feedback folder) — enables the channel
3. GitHub issue templates (.github/ISSUE_TEMPLATE/) — structured intake
4. Submission script (submit-feedback.sh) — agent automation
5. Documentation updates (AGENTS.md, BOOTSTRAP_PLAYBOOK.md, README.md)
6. Commit routing update (commit-message.md, idea.md)

### Phase B: Upgrade Path (Part 7)
7. CHANGELOG.md with version history
8. check-updates.sh script
9. Upgrade checklist template
10. Origin file customization tracking

### Phase C: Session Lifecycle (Parts 8-9)
11. session-init.sh script + .claude/settings.json hook config
12. Session summary template + summarize-session.sh
13. Overseer prompt updates (session start + end protocols)
14. Cursor workforce template updates
15. CLAUDE.md session end protocol
16. Commit routing: add `summarize` ACTION

## Notes

- `gh` CLI is NOT installed in current environment — all scripts must work without it
- No telemetry or tracking — version stamps are passive, human/agent-readable
- Follows repo philosophy: pure markdown, zero runtime dependencies, convention over automation
- Scripts follow `install-git-hooks.sh` patterns: color output, prereq checks, dry-run, graceful degradation
- SessionStart hook stdout goes directly into Claude's context — keep output concise (< 100 lines)
- Session summaries are Git-tracked — full history of what happened when
- Upgrade path is manual-merge by design — projects customize too much for auto-update
