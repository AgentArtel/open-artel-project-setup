#!/usr/bin/env bash
# =============================================================================
# Open Artel Dashboard — .ai Upstream Sync
# =============================================================================
#
# Pulls the latest .ai/templates and .ai/patterns from open-artel-project-setup
# into this repo. Dashboard-specific files (status, tasks, instructions, etc.)
# are never overwritten.
#
# Usage:
#   ./scripts/sync-ai-upstream.sh              # Sync templates and patterns
#   ./scripts/sync-ai-upstream.sh --dry-run    # Show what would change
#   ./scripts/sync-ai-upstream.sh --diff       # Show diff for never-touch files
#   ./scripts/sync-ai-upstream.sh --help       # This help
#
# Configuration:
#   OPEN_ARTEL_UPSTREAM          Override upstream repo URL
#   OPEN_ARTEL_UPSTREAM_BRANCH   Override branch (default: main)
#
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

if [ -f "$PROJECT_ROOT/.env.project" ]; then
    set -a; source "$PROJECT_ROOT/.env.project"; set +a
fi
if [ -f "$PROJECT_ROOT/.env" ]; then
    set -a; source "$PROJECT_ROOT/.env"; set +a
fi

UPSTREAM_REPO="${OPEN_ARTEL_UPSTREAM:-https://github.com/AgentArtel/open-artel-project-setup.git}"
UPSTREAM_BRANCH="${OPEN_ARTEL_UPSTREAM_BRANCH:-main}"
CACHE_DIR="$PROJECT_ROOT/.git/open-artel-ai-upstream"
UPSTREAM_AI="$CACHE_DIR/.ai"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

DRY_RUN=false
DIFF_ONLY=false
FILES_UPDATED=0
FILES_NEW=0
FILES_SKIPPED=0

# Generic: overwrite from upstream
GENERIC_DIRS=("templates" "patterns")

# Never overwrite (dashboard-owned)
NEVER_TOUCH=(
    ".ai/README.md"
    ".ai/status.md"
    ".ai/boundaries.md"
    ".ai/tasks"
    ".ai/instructions"
    ".ai/reviews"
    ".ai/reports"
    ".ai/chats"
    ".ai/ideas"
    ".ai/metrics"
    ".ai/sessions"
)

log_info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
log_success() { echo -e "${GREEN}[SYNC]${NC} $*"; }
log_new()     { echo -e "${CYAN}[NEW]${NC}  $*"; }
log_skip()    { echo -e "${YELLOW}[SKIP]${NC} $*"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error()   { echo -e "${RED}[ERR]${NC}  $*"; }

show_help() {
    echo "Open Artel Dashboard — .ai Upstream Sync"
    echo ""
    echo "Usage:"
    echo "  ./scripts/sync-ai-upstream.sh              Sync .ai/templates and .ai/patterns from upstream"
    echo "  ./scripts/sync-ai-upstream.sh --dry-run    Show what would change (no writes)"
    echo "  ./scripts/sync-ai-upstream.sh --diff       Show diff for dashboard-owned files"
    echo "  ./scripts/sync-ai-upstream.sh --help       This help"
    echo ""
    echo "Upstream: $UPSTREAM_REPO (branch: $UPSTREAM_BRANCH)"
    echo "Synced:   .ai/templates/, .ai/patterns/"
    echo "Never overwritten: .ai/README.md, .ai/status.md, .ai/boundaries.md, .ai/tasks/, .ai/instructions/, .ai/reviews/, .ai/reports/, .ai/chats/, .ai/ideas/, .ai/metrics/, .ai/sessions/"
    exit 0
}

fetch_upstream() {
    log_info "Upstream: $UPSTREAM_REPO (branch: $UPSTREAM_BRANCH)"

    if [ -d "$CACHE_DIR/.git" ]; then
        log_info "Updating cached upstream..."
        (cd "$CACHE_DIR" && git fetch origin "$UPSTREAM_BRANCH" --quiet && git checkout "origin/$UPSTREAM_BRANCH" --quiet) 2>/dev/null || {
            log_warn "Cache update failed — re-cloning..."
            rm -rf "$CACHE_DIR"
        }
    fi

    if [ ! -d "$CACHE_DIR/.git" ]; then
        log_info "Cloning upstream repo (first time)..."
        git clone --depth 1 --branch "$UPSTREAM_BRANCH" --single-branch \
            "$UPSTREAM_REPO" "$CACHE_DIR" --quiet 2>/dev/null || {
            log_error "Failed to clone upstream repo."
            exit 1
        }
    fi

    if [ ! -d "$UPSTREAM_AI" ]; then
        log_error "Upstream .ai not found at $UPSTREAM_AI"
        exit 1
    fi

    local upstream_commit
    upstream_commit="$(cd "$CACHE_DIR" && git rev-parse --short HEAD)"
    local upstream_date
    upstream_date="$(cd "$CACHE_DIR" && git log -1 --format='%ci' | cut -d' ' -f1)"
    log_info "Upstream version: $upstream_commit ($upstream_date)"
    echo ""
}

sync_file() {
    local src="$1"
    local dest_rel="$2"
    local dest_full="$PROJECT_ROOT/$dest_rel"

    if [ ! -f "$src" ]; then
        return
    fi

    if [ ! -f "$dest_full" ]; then
        if [ "$DRY_RUN" = "true" ]; then
            log_new "$dest_rel"
        else
            mkdir -p "$(dirname "$dest_full")"
            cp "$src" "$dest_full"
            [ -x "$src" ] && chmod +x "$dest_full"
            log_new "$dest_rel"
        fi
        FILES_NEW=$((FILES_NEW + 1))
        return
    fi

    if diff -q "$src" "$dest_full" >/dev/null 2>&1; then
        return
    fi

    if [ "$DRY_RUN" = "true" ]; then
        log_success "$dest_rel (would update)"
    else
        cp "$src" "$dest_full"
        [ -x "$src" ] && chmod +x "$dest_full"
        log_success "$dest_rel"
    fi
    FILES_UPDATED=$((FILES_UPDATED + 1))
}

sync_dir() {
    local dir="$1"
    local upstream_path="$UPSTREAM_AI/$dir"
    local dest_base=".ai/$dir"

    if [ ! -d "$upstream_path" ]; then
        log_warn "Not found in upstream: .ai/$dir"
        return
    fi

    while IFS= read -r src_file; do
        local rel_path="${src_file#$upstream_path/}"
        local dest_rel="$dest_base/$rel_path"
        sync_file "$src_file" "$dest_rel"
    done < <(find "$upstream_path" -type f | sort)
}

show_never_touch_diff() {
    echo ""
    echo -e "${BOLD}Dashboard-owned files — Upstream vs Local (for reference only)${NC}"
    echo ""

    for item in "${NEVER_TOUCH[@]}"; do
        local upstream_path="$CACHE_DIR/$item"
        local local_path="$PROJECT_ROOT/$item"

        if [ -f "$upstream_path" ] && [ -f "$local_path" ]; then
            if ! diff -q "$local_path" "$upstream_path" >/dev/null 2>&1; then
                echo -e "${YELLOW}--- $item ---${NC}"
                diff -u "$local_path" "$upstream_path" \
                    --label "local: $item" --label "upstream: $item" 2>/dev/null | head -50 || true
                echo ""
                FILES_SKIPPED=$((FILES_SKIPPED + 1))
            fi
        elif [ -d "$upstream_path" ] && [ -d "$local_path" ]; then
            local count
            count=$(diff -rq "$local_path" "$upstream_path" 2>/dev/null | wc -l)
            if [ "${count:-0}" -gt 0 ]; then
                log_skip "$item (dirs differ — not overwritten)"
                FILES_SKIPPED=$((FILES_SKIPPED + 1))
            fi
        fi
    done

    log_info "Dashboard-owned files are never overwritten. Merge manually if desired."
}

main() {
    echo ""
    echo -e "${BOLD}Open Artel Dashboard — .ai Upstream Sync${NC}"
    echo ""

    if [ "$DRY_RUN" = "true" ]; then
        log_info "Mode: DRY RUN (no files will be modified)"
        echo ""
    fi

    fetch_upstream

    if [ "$DIFF_ONLY" = "true" ]; then
        show_never_touch_diff
        echo ""
        exit 0
    fi

    echo -e "${BOLD}Syncing .ai/templates and .ai/patterns...${NC}"
    echo ""

    for dir in "${GENERIC_DIRS[@]}"; do
        sync_dir "$dir"
    done

    echo ""
    echo -e "${BOLD}Summary${NC}"
    echo "  Updated: $FILES_UPDATED"
    echo "  New:     $FILES_NEW"
    echo ""

    if [ "$DRY_RUN" = "true" ]; then
        log_info "Dry run. Run without --dry-run to apply changes."
    elif [ $((FILES_UPDATED + FILES_NEW)) -gt 0 ]; then
        log_info "Run: git add .ai && git commit -m 'Sync .ai from open-artel-project-setup'"
    else
        log_info "Templates and patterns are up to date."
    fi
    echo ""
}

case "${1:-}" in
    --dry-run) DRY_RUN=true ;;
    --diff)    DIFF_ONLY=true ;;
    --help|-h) show_help ;;
    "")
        ;;
    *)
        log_error "Unknown option: $1"
        echo "Run with --help for usage."
        exit 1
        ;;
esac

main
