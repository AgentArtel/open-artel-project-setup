# Feature Modules

Every file in this starter kit belongs to either the **core** (always needed) or a **feature module** (optional, add when needed). See [CORE.md](CORE.md) for the minimal setup.

## How to Use This

1. Start with the **core** files only (see [CORE.md](CORE.md))
2. Pick feature modules from the table below based on what you need
3. Copy the listed files into your project
4. Follow any "Setup" instructions in the module details

## Module Overview

| # | Module | Requires | Files | What You Get |
|---|--------|----------|-------|-------------|
| — | **Core** | Nothing | 8 files | Three-agent workflow, task protocol, sprint board |
| 1 | Cursor Workforce | Core | 3 files | Manager + Task chat system in Cursor |
| 2 | Lovable Integration | Core | 1 file | Lovable UI agent knowledge base |
| 3 | Templates | Core | 7 files | Templates for chats, reviews, reports, instructions, ideas, commits, evaluations |
| 4 | Kimi Overseer | Core | 16 files | Automated oversight, review, skills, subagent templates |
| 5 | Git Hooks | Kimi Overseer | 3 files | Commit-based routing to Kimi for review/approval |
| 6 | Session Management | Kimi Overseer | 4 files | Named Kimi sessions tied to sprints |
| 7 | Context Monitoring | Kimi Overseer | 4 files | Auto-compact when context grows large |
| 8 | Dynamic Subagents | Kimi Overseer | 5 files | Runtime-created specialist agents |
| 9 | Moonshot API | Kimi Overseer | 3 files | Upload project files for persistent AI context |
| 10 | GitHub Actions | Core | 3 files | CI/CD for automated reviews and evaluation |
| 11 | Wire Mode | Kimi Overseer | 2 files | JSON-RPC coordination daemon (advanced) |
| 12 | Sprint Evaluation | Kimi Overseer | 1 file | Generate evaluation reports with metrics |
| 13 | Patterns Library | Core | 11 files | Documented patterns from real projects |
| 14 | Sync Upstream | Core | 1 file | Check for and apply starter kit updates |
| 15 | Lessons & Metrics | Kimi Overseer | 5 files | Track lessons learned and context metrics |

## Dependency Tree

```
Core (always required)
├── 1. Cursor Workforce
├── 2. Lovable Integration
├── 3. Templates
├── 4. Kimi Overseer
│   ├── 5. Git Hooks
│   ├── 6. Session Management
│   ├── 7. Context Monitoring
│   ├── 8. Dynamic Subagents
│   ├── 9. Moonshot API
│   ├── 11. Wire Mode
│   ├── 12. Sprint Evaluation
│   └── 15. Lessons & Metrics
├── 10. GitHub Actions
├── 13. Patterns Library
└── 14. Sync Upstream
```

---

## Module Details

### Module 1: Cursor Workforce

**What it does**: Sets up Manager Chat + Task Chat system in Cursor IDE. Manager decomposes features into task briefs; Task chats execute one task each.

**Files**:
```
.cursor/rules/05-agent-boundaries.mdc    # File ownership map
.cursor/rules/07-workforce-protocol.mdc  # Manager/task chat roles
.ai/CURSOR_WORKFORCE.md                  # Setup guide for creating chats
```

**Setup**: Open `.ai/CURSOR_WORKFORCE.md` in Cursor and follow the steps to create your Manager Chat.

**Leave out if**: You don't use Cursor, or you use Cursor but prefer a simpler setup without the manager/task chat pattern.

---

### Module 2: Lovable Integration

**What it does**: Provides a knowledge base document to paste into Lovable's project settings, so Lovable understands the multi-agent workflow and stays in its lane.

**Files**:
```
.ai/lovable-knowledge.md    # Copy-paste into Lovable → Settings → Knowledge
```

**Leave out if**: You don't use Lovable.

---

### Module 3: Templates

**What it does**: Provides templates for all coordination file types — chats, reviews, reports, instructions, ideas, commit messages, and evaluations.

**Files**:
```
.ai/templates/chat.md               # Agent-to-agent chat log format
.ai/templates/commit-message.md     # Commit routing format guide
.ai/templates/evaluation-report.md  # Sprint evaluation template
.ai/templates/idea.md               # Feature idea template
.ai/templates/instruction.md        # Task assignment template
.ai/templates/report.md             # Status report template
.ai/templates/review.md             # Code review template
```

**Note**: `.ai/templates/task.md` is part of Core, not this module.

**Leave out if**: You want to define your own formats. The task template (Core) is sufficient to start.

---

### Module 4: Kimi Overseer

**What it does**: Adds Kimi Code as an automated overseer agent. Includes agent definitions, system prompts, 10 Agent Skills, and 4 subagent templates.

**Files**:
```
.agents/kimi-overseer.yaml                           # Main overseer config
.agents/prompts/overseer.md                          # System prompt (rules, responsibilities)
.agents/reviewer-sub.yaml                            # Review subagent
.agents/researcher-sub.yaml                          # Research subagent
.agents/skills/boundary-enforcement/SKILL.md         # File ownership enforcement
.agents/skills/code-review/SKILL.md                  # Review standards
.agents/skills/git-routing/SKILL.md                  # Commit message routing
.agents/skills/learn-from-past/SKILL.md              # Extract lessons from past configs
.agents/skills/open-artel-workflow/SKILL.md           # Multi-agent workflow conventions
.agents/skills/review-checklist/SKILL.md             # Review checklist
.agents/skills/sprint-execution/SKILL.md             # Sprint workflow (Flow Skill)
.agents/skills/sprint-management/SKILL.md            # Sprint planning
.agents/skills/task-handoff/SKILL.md                 # Agent handoff (Flow Skill)
.agents/skills/task-protocol/SKILL.md                # Task brief format
.cursor/rules/07-kimi-integration.mdc                # Cursor Kimi awareness rule
```

**Also creates**: `.agents/subagents/.gitkeep` (empty dir for dynamic subagents)

**Setup**: Install Kimi Code CLI (`pipx install kimi-cli`), authenticate (`kimi` then `/login`), then run `./scripts/setup-kimi-project.sh` if using the scripts module.

**Leave out if**: You don't use Kimi Code. The three-agent workflow (Claude + Cursor + Lovable) works without it — Kimi adds automated oversight on top.

---

### Module 5: Git Hooks

**Requires**: Module 4 (Kimi Overseer)

**What it does**: Git post-commit hook that parses `[AGENT:x] [ACTION:y] [TASK:z]` commit headers and routes them to Kimi for automated review, approval, or logging.

**Files**:
```
scripts/post-commit             # The hook itself
scripts/post-commit.template    # Template for customization
scripts/install-git-hooks.sh    # Interactive installer
```

**Setup**: Run `./scripts/install-git-hooks.sh`

**Leave out if**: You don't want automated commit routing. You can still use the `[AGENT:x] [ACTION:y]` format in commit messages without the hook — it just won't trigger automation.

---

### Module 6: Session Management

**Requires**: Module 4 (Kimi Overseer)

**What it does**: Manages named Kimi sessions linked to sprints. Supports create, resume, list, archive, and compact operations.

**Files**:
```
scripts/kimi-session-manager.sh                # Session lifecycle script
scripts/setup-kimi-project.sh                  # One-command Kimi project setup
.ai/sessions/active/.gitkeep                   # Active session summaries
.ai/sessions/archived/.gitkeep                 # Archived session summaries
```

**Leave out if**: You manage Kimi sessions manually or don't use Kimi.

---

### Module 7: Context Monitoring

**Requires**: Module 4 (Kimi Overseer)

**What it does**: Monitors Kimi context health and auto-compacts when context exceeds thresholds. Tracks context history over time.

**Files**:
```
scripts/kimi-context-monitor.sh           # Monitoring script
scripts/quick-kimi-check.sh               # Fast pre-work health check
scripts/verify-kimi-setup.sh              # Kimi installation verification
docs/kimi-context-optimization.md         # Guide
```

**Leave out if**: You don't use Kimi or are comfortable managing context manually.

---

### Module 8: Dynamic Subagents

**Requires**: Module 4 (Kimi Overseer)

**What it does**: Templates for creating specialist subagents at runtime — debugger, performance analyzer, documentation writer, test generator.

**Files**:
```
.agents/subagents/debugger-template.md               # Debug specialist
.agents/subagents/documentation-writer-template.md   # Docs specialist
.agents/subagents/performance-analyzer-template.md   # Performance specialist
.agents/subagents/test-generator-template.md          # Test specialist
scripts/create-specialized-subagent.sh                # Creation script
```

**Leave out if**: You don't need runtime-created specialist agents.

---

### Module 9: Moonshot API

**Requires**: Module 4 (Kimi Overseer)

**What it does**: Upload project files to Moonshot's Files API for persistent AI context. Python stdlib only — no pip dependencies.

**Files**:
```
scripts/moonshot-api-client.py            # Files API client
scripts/upload-project-files.py           # Batch uploader
scripts/setup-project-api-key.sh          # API key management
```

**Docs**: `docs/moonshot-api-integration.md`

**Leave out if**: You don't use Moonshot's API for file-level context.

---

### Module 10: GitHub Actions

**Requires**: Core only

**What it does**: CI/CD workflows for automated agent review on PRs, pre-mortal merge validation, and sprint evaluation.

**Files**:
```
.github/workflows/agent-review.yml        # Auto-review on PR
.github/workflows/pre-mortal-merge.yml    # Merge validation
.github/workflows/sprint-evaluation.yml   # Sprint metrics
```

**Leave out if**: You don't use GitHub Actions or prefer manual review.

---

### Module 11: Wire Mode

**Requires**: Module 4 (Kimi Overseer)

**What it does**: JSON-RPC coordination daemon for real-time agent communication. Advanced — most teams don't need this.

**Files**:
```
scripts/wire-daemon.py                    # The daemon (1,172 lines, Python stdlib)
scripts/install-wire-daemon.sh            # Installer
```

**Docs**: `docs/wire-daemon.md`, `docs/kimi-wire-enhancements.md`

**Leave out if**: You're fine with file-based coordination via `.ai/`. Wire Mode is for teams that need real-time inter-agent messaging.

---

### Module 12: Sprint Evaluation

**Requires**: Module 4 (Kimi Overseer)

**What it does**: Generates sprint evaluation reports with 8 metrics (velocity, quality, coordination, etc.).

**Files**:
```
scripts/generate-evaluation.sh            # Report generator
```

**Docs**: `docs/kimi-evaluation-procedures.md`

**Leave out if**: You don't need formal sprint evaluation metrics.

---

### Module 13: Patterns Library

**Requires**: Core only

**What it does**: Documented patterns from real projects — agent swarm strategies, subagent creation patterns, lessons from past configurations.

**Files**:
```
.ai/patterns/agent-swarm-parallel-review.md
.ai/patterns/agent-swarm-research-split.md
.ai/patterns/create-subagent-debugger.md
.ai/patterns/create-subagent-docs.md
.ai/patterns/create-subagent-performance.md
.ai/patterns/create-subagent-test-generator.md
.ai/patterns/multimodal-ui-review.md
.ai/patterns/from-past-configs/escalation-protocol.md
.ai/patterns/from-past-configs/file-ownership-mapping.md
.ai/patterns/from-past-configs/phased-approach.md
.ai/patterns/from-past-configs/task-decomposition.md
```

**Leave out if**: You prefer to develop your own patterns. These are reference material.

---

### Module 14: Sync Upstream

**Requires**: Core only

**What it does**: Check for starter kit updates and sync changes from the source repo.

**Files**:
```
scripts/sync-upstream.sh                  # Update checker + sync
```

**Leave out if**: You don't need automated update checking.

---

### Module 15: Lessons & Metrics

**Requires**: Module 4 (Kimi Overseer)

**What it does**: Track lessons learned from past configurations and context/wire metrics.

**Files**:
```
.ai/lessons/applied-lessons.md            # Lessons tracking template
.ai/metrics/context-history.json          # Context health history
.ai/metrics/thresholds.json               # Auto-compact thresholds
.ai/metrics/uploaded-files.json           # Moonshot upload tracking
.ai/metrics/.gitkeep
```

**Leave out if**: You don't need formal metrics tracking.

---

## Documentation Files

These docs support specific modules. Copy them if you're using that module.

| Doc | Supports Module |
|-----|----------------|
| `docs/claude-kimi-coordination.md` | Kimi Overseer (4) |
| `docs/cursor-kimi-integration.md` | Kimi Overseer (4) |
| `docs/github-actions-automation.md` | GitHub Actions (10) |
| `docs/kimi-acp-integration.md` | Kimi Overseer (4) |
| `docs/kimi-agent-swarm.md` | Dynamic Subagents (8) |
| `docs/kimi-context-optimization.md` | Context Monitoring (7) |
| `docs/kimi-evaluation-procedures.md` | Sprint Evaluation (12) |
| `docs/kimi-multimodal.md` | Kimi Overseer (4) |
| `docs/kimi-sessions.md` | Session Management (6) |
| `docs/kimi-wire-enhancements.md` | Wire Mode (11) |
| `docs/moonshot-api-integration.md` | Moonshot API (9) |
| `docs/wire-daemon.md` | Wire Mode (11) |
| `docs/examples/tool-usage-*.md` | Kimi Overseer (4) |

## Empty Directories

These `.gitkeep` files create directory structure. Included with their parent module:

| Directory | Module |
|-----------|--------|
| `.ai/tasks/.gitkeep` | Core |
| `.ai/chats/.gitkeep` | Templates (3) |
| `.ai/instructions/.gitkeep` | Templates (3) |
| `.ai/reports/.gitkeep` | Templates (3) |
| `.ai/reviews/.gitkeep` | Templates (3) |
| `.ai/patterns/.gitkeep` | Patterns Library (13) |
| `.ai/metrics/.gitkeep` | Lessons & Metrics (15) |
| `.ai/sessions/active/.gitkeep` | Session Management (6) |
| `.ai/sessions/archived/.gitkeep` | Session Management (6) |
| `.agents/subagents/.gitkeep` | Kimi Overseer (4) |
