#!/usr/bin/env bash
# =============================================================================
# Open Artel — Export Dashboard for Lovable Repo
# =============================================================================
#
# Copies dashboard-frontend and dashboard-backend into a standalone directory
# so you can push it to a new GitHub repo and connect it to Lovable for
# database creation and deployment.
#
# Usage:
#   ./scripts/export-dashboard-for-lovable.sh
#   ./scripts/export-dashboard-for-lovable.sh /path/to/output-dir
#   ./scripts/export-dashboard-for-lovable.sh --help
#
# See: docs/dashboard-lovable-separate-repo.md
#
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEFAULT_OUTPUT="$PROJECT_ROOT/../open-artel-dashboard"

# ---------------------------------------------------------------------------
# Help
# ---------------------------------------------------------------------------
show_help() {
    cat << 'EOF'
Usage: ./scripts/export-dashboard-for-lovable.sh [OUTPUT_DIR]

  OUTPUT_DIR  Target directory for the exported dashboard (default: ../open-artel-dashboard).

Creates OUTPUT_DIR with:
  frontend/   — dashboard-frontend (Vite + React + TypeScript)
  backend/   — dashboard-backend (Node/Express API)
  README.md  — short instructions
  .gitignore — node_modules, .env, etc.

Then you can:
  cd OUTPUT_DIR && git init && git add . && git commit -m "Initial dashboard"
  git remote add origin https://github.com/YOUR_ORG/your-repo.git && git push -u origin main

See docs/dashboard-lovable-separate-repo.md for full steps and Lovable setup.
EOF
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    show_help
    exit 0
fi

OUTPUT_DIR="${1:-$DEFAULT_OUTPUT}"
cd "$PROJECT_ROOT"

# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------
if [ ! -d "dashboard-frontend" ]; then
    echo "Error: dashboard-frontend/ not found. Run from open-artel-project-setup root." >&2
    exit 1
fi
if [ ! -d "dashboard-backend" ]; then
    echo "Error: dashboard-backend/ not found. Run from open-artel-project-setup root." >&2
    exit 1
fi
if [ -e "$OUTPUT_DIR" ] && [ ! -d "$OUTPUT_DIR" ]; then
    echo "Error: $OUTPUT_DIR exists and is not a directory." >&2
    exit 1
fi

# ---------------------------------------------------------------------------
# Copy (exclude node_modules, .env, .vite, dist)
# ---------------------------------------------------------------------------
mkdir -p "$OUTPUT_DIR"
OUTPUT_DIR="$(cd "$OUTPUT_DIR" && pwd)"

copy_excluding() {
    local src="$1"
    local dest="$2"
    mkdir -p "$dest"
    if command -v rsync >/dev/null 2>&1; then
        rsync -a --exclude='node_modules' --exclude='.env' --exclude='.env.*' \
              --exclude='.vite' --exclude='dist' --exclude='.git' \
              "$src/" "$dest/"
    else
        cp -R "$src"/* "$dest/" 2>/dev/null || true
        rm -rf "$dest/node_modules" "$dest/.vite" "$dest/dist" "$dest/.env" "$dest/.env."* 2>/dev/null || true
    fi
}

echo "Exporting dashboard to $OUTPUT_DIR ..."
copy_excluding "dashboard-frontend" "$OUTPUT_DIR/frontend"
copy_excluding "dashboard-backend"  "$OUTPUT_DIR/backend"

# ---------------------------------------------------------------------------
# Root README and .gitignore
# ---------------------------------------------------------------------------
cat > "$OUTPUT_DIR/README.md" << 'README'
# Open Artel Dashboard

Frontend + backend for the Open Artel dashboard. Exported from open-artel-project-setup for Lovable-managed deployment.

## Structure

- **frontend/** — Vite + React + TypeScript (dashboard UI)
- **backend/**  — Node/Express API (projects, tasks, commits, GitHub, WebSocket)

## Setup

1. **Frontend**: `cd frontend && npm install && npm run dev`
2. **Backend**: `cd backend && npm install && cp .env.example .env` then configure and `npm run dev`

## Deploy with Lovable

Connect this repo to Lovable so Lovable can create the database and deploy. See Lovable project settings for GitHub connection and environment variables.
README

cat > "$OUTPUT_DIR/.gitignore" << 'GITIGNORE'
# Dependencies and build
node_modules/
.vite/
dist/
*.local

# Environment
.env
.env.*
!.env.example

# OS and editor
.DS_Store
.idea/
*.log
GITIGNORE

echo "Done. Exported to: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "  1. Create a new repo on GitHub (do not add README)."
echo "  2. cd $OUTPUT_DIR"
echo "  3. git init && git add . && git commit -m \"Initial dashboard: frontend + backend\""
echo "  4. git branch -M main && git remote add origin <your-new-repo-url> && git push -u origin main"
echo "  5. In Lovable: connect the GitHub repo and set up database + deploy."
echo ""
echo "Full guide: docs/dashboard-lovable-separate-repo.md (in open-artel-project-setup repo)"
