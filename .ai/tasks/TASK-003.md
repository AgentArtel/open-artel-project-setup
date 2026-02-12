# TASK-003: Upstream Feedback System + Version Tracking

- **Status**: PLANNING
- **Assigned**: Claude Code
- **Priority**: P1
- **Type**: Create
- **Depends on**: TASK-002 (research complete)
- **Blocks**: Downstream project adoption quality

## Context

Once a project copies the starter kit, there's **zero connection back** to this repo. No version tracking, no feedback channel, no way for agents to report issues upstream. Even-Openclaw (our only past configuration) has no reference to the starter kit at all.

This task creates the infrastructure for:
1. **Version tracking** — downstream projects know which starter kit version they're running
2. **Feedback channel** — agents and humans in downstream projects can report issues/ideas back
3. **Agent-initiated feedback** — agents can programmatically submit upstream feedback
4. **GitHub issue templates** — structured intake for feedback on this repo

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

## File Changes Summary

### New files to create:

| File | Location | Purpose |
|------|----------|---------|
| `origin.md` | `setups/multi-agent-starter/.ai/` | Version + source tracking template |
| `upstream-feedback.md` | `setups/multi-agent-starter/.ai/templates/` | Feedback template for downstream agents |
| `.gitkeep` | `setups/multi-agent-starter/.ai/feedback/` | Feedback collection folder |
| `submit-feedback.sh` | `setups/multi-agent-starter/scripts/` | Feedback submission script |
| `submit-feedback.sh` | `scripts/` | Same script for this repo |
| `downstream-feedback.yml` | `.github/ISSUE_TEMPLATE/` | GitHub issue form for downstream feedback |
| `bug-report.yml` | `.github/ISSUE_TEMPLATE/` | Standard bug report form |
| `config.yml` | `.github/ISSUE_TEMPLATE/` | Issue template chooser |

### Files to modify:

| File | Change |
|------|--------|
| `setups/multi-agent-starter/AGENTS.md` | Add version comment + Upstream Feedback section |
| `setups/multi-agent-starter/CLAUDE.md` | Add version comment |
| `setups/multi-agent-starter/BOOTSTRAP_PLAYBOOK.md` | Add origin file setup + feedback instructions |
| `setups/multi-agent-starter/README.md` | Add feedback CTAs + version info |
| `.ai/templates/commit-message.md` | Add `feedback` as valid ACTION |
| `.ai/templates/idea.md` | Add `downstream-feedback` as valid Origin |
| `AGENTS.md` (root) | Document feedback folder + script in structure |
| `README.md` (root) | Add feedback section for downstream users |

### Files NOT changed:

- No changes to existing idea files, task files, or research docs
- No changes to `.agents/` skills or overseer config
- No changes to `scripts/post-commit` or `install-git-hooks.sh`
- No changes to `past-configurations/`

---

## Acceptance Criteria

- [ ] Downstream projects have `.ai/origin.md` tracking which version they installed
- [ ] Agents can fill `.ai/templates/upstream-feedback.md` to report issues
- [ ] `scripts/submit-feedback.sh` creates GitHub issues when `gh` is available
- [ ] Script degrades gracefully when `gh` is not available (prints manual instructions)
- [ ] GitHub issue templates provide structured intake on this repo
- [ ] BOOTSTRAP_PLAYBOOK.md includes origin file creation during setup
- [ ] Starter kit AGENTS.md includes upstream feedback section
- [ ] Commit routing recognizes `[ACTION:feedback]`
- [ ] All new files follow existing template patterns (Markdown, no dependencies)
- [ ] No runtime dependencies added (pure bash + optional `gh`)

---

## Implementation Order

1. **Version tracking first** (origin.md, version comments) — smallest, most valuable
2. **Feedback template** (upstream-feedback.md, feedback folder) — enables the channel
3. **GitHub issue templates** (.github/ISSUE_TEMPLATE/) — structured intake on this repo
4. **Submission script** (submit-feedback.sh) — automation for agents
5. **Documentation updates** (AGENTS.md, BOOTSTRAP_PLAYBOOK.md, README.md) — tie it together
6. **Commit routing update** (commit-message.md, idea.md) — integrate with existing system

## Notes

- `gh` CLI is NOT installed in current environment — script must work without it
- No telemetry or tracking — version stamps are passive, human/agent-readable
- Follows repo philosophy: pure markdown, zero runtime dependencies, convention over automation
- Script follows `install-git-hooks.sh` patterns: color output, prereq checks, dry-run, graceful degradation
