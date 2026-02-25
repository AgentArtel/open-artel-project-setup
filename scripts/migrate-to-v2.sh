#!/usr/bin/env bash
# =============================================================================
# Open Artel — Migrate to v2
# =============================================================================
#
# Upgrades an existing Open Artel project to the v2 coordination system.
# Safe: never overwrites existing files without --force flag.
#
# What it adds:
#   - .ai/board.md          (real-time coordination board)
#   - .ai/lessons.md        (if missing)
#   - .ai/workflow-principles.md (if missing)
#   - .ai/templates/task.md (updated task template — only with --force)
#   - hooks/session-start   (session context hook)
#   - docs/plans/           (brainstorm design directory)
#
# What it updates:
#   - CLAUDE.md             (adds pipeline reference — only with --update-claude)
#   - .ai/status.md         (adds board.md reference — only with --update-status)
#
# Usage:
#   ./scripts/migrate-to-v2.sh                  # Dry run (show what would change)
#   ./scripts/migrate-to-v2.sh --apply          # Create missing files
#   ./scripts/migrate-to-v2.sh --apply --force  # Also overwrite existing files
#
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Source files (templates from this repo)
SOURCE_DIR="$PROJECT_ROOT"

# Target detection — are we running inside the open-artel repo itself,
# or from a project that has this repo as a dependency/submodule?
# Default: apply to the current working directory.
TARGET_DIR="${MIGRATE_TARGET:-$(pwd)}"

# ---------------------------------------------------------------------------
# Color output
# ---------------------------------------------------------------------------

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
DIM='\033[2m'
NC='\033[0m'

info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
ok()      { echo -e "${GREEN}  [+]${NC} $*"; }
skip()    { echo -e "${YELLOW}  [~]${NC} $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; }
would()   { echo -e "${DIM}  [?]${NC} Would create: $*"; }

# ---------------------------------------------------------------------------
# Flags
# ---------------------------------------------------------------------------

APPLY=false
FORCE=false

for arg in "$@"; do
    case "$arg" in
        --apply) APPLY=true ;;
        --force) FORCE=true ;;
        --help|-h)
            echo "Usage: $0 [--apply] [--force]"
            echo ""
            echo "  (no args)  Dry run — show what would change"
            echo "  --apply    Create missing files"
            echo "  --force    Also overwrite existing files (task template, etc.)"
            echo ""
            echo "Environment:"
            echo "  MIGRATE_TARGET=/path/to/project  Target a different directory"
            exit 0
            ;;
        *)
            error "Unknown option: $arg"
            exit 1
            ;;
    esac
done

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

create_file() {
    local target="$1"
    local content="$2"
    local desc="$3"

    if [ -f "$target" ]; then
        if [ "$FORCE" = true ]; then
            if [ "$APPLY" = true ]; then
                echo "$content" > "$target"
                ok "Overwritten: $desc ($target)"
            else
                would "overwrite $desc ($target)"
            fi
        else
            skip "Exists: $desc ($target)"
        fi
    else
        if [ "$APPLY" = true ]; then
            mkdir -p "$(dirname "$target")"
            echo "$content" > "$target"
            ok "Created: $desc ($target)"
        else
            would "$desc ($target)"
        fi
    fi
}

create_dir() {
    local target="$1"
    local desc="$2"

    if [ -d "$target" ]; then
        skip "Exists: $desc ($target)"
    else
        if [ "$APPLY" = true ]; then
            mkdir -p "$target"
            ok "Created: $desc ($target)"
        else
            would "$desc ($target)"
        fi
    fi
}

copy_file() {
    local source="$1"
    local target="$2"
    local desc="$3"

    if [ -f "$target" ]; then
        if [ "$FORCE" = true ]; then
            if [ "$APPLY" = true ]; then
                cp "$source" "$target"
                ok "Overwritten: $desc ($target)"
            else
                would "overwrite $desc ($target)"
            fi
        else
            skip "Exists: $desc ($target)"
        fi
    else
        if [ "$APPLY" = true ]; then
            mkdir -p "$(dirname "$target")"
            cp "$source" "$target"
            ok "Created: $desc ($target)"
        else
            would "$desc ($target)"
        fi
    fi
}

# ---------------------------------------------------------------------------
# Pre-flight checks
# ---------------------------------------------------------------------------

echo ""
echo "========================================="
echo "  Open Artel — Migrate to v2"
echo "========================================="
echo ""

if [ "$APPLY" = false ]; then
    info "DRY RUN — showing what would change. Use --apply to execute."
    echo ""
fi

info "Target directory: $TARGET_DIR"
echo ""

# Check this looks like an Open Artel project (new or old style)
if [ ! -f "$TARGET_DIR/AGENTS.md" ] && [ ! -d "$TARGET_DIR/.ai" ] && \
   [ ! -f "$TARGET_DIR/boundaries.md" ] && [ ! -d "$TARGET_DIR/tasks" ]; then
    error "This doesn't look like an Open Artel project."
    error "Expected AGENTS.md, .ai/, boundaries.md, or tasks/ in: $TARGET_DIR"
    exit 1
fi

# Detect old-style (flat) vs new-style (.ai/) project layout
if [ -d "$TARGET_DIR/tasks" ] && [ ! -d "$TARGET_DIR/.ai" ]; then
    warn "Detected old-style layout (flat coordination files at root)."
    warn "This script targets new-style (.ai/ directory) projects."
    warn "For old-style projects, first move coordination files into .ai/:"
    echo "  mkdir -p .ai/tasks .ai/templates"
    echo "  mv tasks/* .ai/tasks/"
    echo "  mv templates/task.md .ai/templates/"
    echo "  mv boundaries.md .ai/"
    echo "  mv status.md .ai/"
    echo "  # Then re-run this script"
    echo ""
    info "Continuing anyway — will create .ai/ structure alongside existing files."
    echo ""
fi

# ---------------------------------------------------------------------------
# 1. Coordination files
# ---------------------------------------------------------------------------

info "Checking coordination files (.ai/)..."

# board.md — the big new addition
BOARD_CONTENT='# Coordination Board

The single source of truth for what'\''s happening right now. Every agent reads this at session start and updates it when their status changes.

**Last updated**: [DATE] by [AGENT]

---

## Active Work

| Agent | Task | Status | Branch | Notes |
|-------|------|--------|--------|-------|
| Claude Code | — | IDLE | — | — |
| Cursor | — | IDLE | — | No active assignment |
| Lovable | — | IDLE | — | No active assignment |

## Blocked

| Task | Blocked By | Owner | Since |
|------|-----------|-------|-------|
| — | — | — | — |

## Ready for Pickup

| Task | Priority | Type | Suitable For | Brief |
|------|----------|------|-------------|-------|
| — | — | — | — | — |

## Recently Completed

| Task | Agent | Date | Notes |
|------|-------|------|-------|

## Decisions Pending Human Input

| Question | Context | Raised By | Date |
|----------|---------|-----------|------|

---

## How to Use This Board

**Every session start**: Read this board. Know who'\''s doing what before you start work.

**When you start a task**: Update Active Work with your row. Set Status to IN_PROGRESS.

**When you finish**: Move your task to Recently Completed. Set your row to IDLE.

**When you'\''re blocked**: Add an entry to Blocked. Set your Active Work status to BLOCKED.

**When you need human input**: Add to Decisions Pending.'
create_file "$TARGET_DIR/.ai/board.md" "$BOARD_CONTENT" "Coordination board"

# lessons.md
if [ ! -f "$TARGET_DIR/.ai/lessons.md" ]; then
    copy_file "$SOURCE_DIR/.ai/templates/lessons.md" "$TARGET_DIR/.ai/lessons.md" "Lessons learned"
fi

# workflow-principles.md
if [ ! -f "$TARGET_DIR/.ai/workflow-principles.md" ]; then
    copy_file "$SOURCE_DIR/.ai/workflow-principles.md" "$TARGET_DIR/.ai/workflow-principles.md" "Workflow principles"
fi

# boundaries.md
if [ ! -f "$TARGET_DIR/.ai/boundaries.md" ]; then
    info "  No .ai/boundaries.md found. Create one manually with your file-to-agent ownership map."
fi

echo ""

# ---------------------------------------------------------------------------
# 2. Task template
# ---------------------------------------------------------------------------

info "Checking task template..."

copy_file "$SOURCE_DIR/.ai/templates/task.md" "$TARGET_DIR/.ai/templates/task.md" "Task template (v2)"

echo ""

# ---------------------------------------------------------------------------
# 3. Directories
# ---------------------------------------------------------------------------

info "Checking directories..."

create_dir "$TARGET_DIR/docs/plans" "Brainstorm designs directory"
create_dir "$TARGET_DIR/.ai/reviews" "Code reviews directory"
create_dir "$TARGET_DIR/.ai/chats" "Agent chat logs directory"
create_dir "$TARGET_DIR/.ai/reports" "Status reports directory"
create_dir "$TARGET_DIR/.ai/instructions" "Task assignments directory"

echo ""

# ---------------------------------------------------------------------------
# 4. Session hook
# ---------------------------------------------------------------------------

info "Checking session hook..."

if [ -f "$SOURCE_DIR/hooks/session-start" ]; then
    copy_file "$SOURCE_DIR/hooks/session-start" "$TARGET_DIR/hooks/session-start" "Session-start hook"
    if [ "$APPLY" = true ] && [ -f "$TARGET_DIR/hooks/session-start" ]; then
        chmod +x "$TARGET_DIR/hooks/session-start"
    fi
else
    warn "Source hooks/session-start not found. Skipping."
fi

echo ""

# ---------------------------------------------------------------------------
# 5. Summary
# ---------------------------------------------------------------------------

echo "========================================="
if [ "$APPLY" = true ]; then
    echo "  Migration complete!"
else
    echo "  Dry run complete."
fi
echo "========================================="
echo ""

if [ "$APPLY" = false ]; then
    info "Run with --apply to execute these changes."
    info "Run with --apply --force to also overwrite existing files."
    echo ""
fi

info "After migration, manually update:"
echo "  1. CLAUDE.md — add the pipeline to 'How You Work':"
echo "     brainstorm → write plan → execute → verify → finish"
echo "  2. .ai/board.md — fill in your current agent assignments"
echo "  3. .ai/boundaries.md — ensure file ownership map exists"
echo ""
info "Run ./hooks/session-start to verify the hook works."
echo ""
