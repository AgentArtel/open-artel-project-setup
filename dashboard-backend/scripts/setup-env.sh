#!/bin/bash
# Setup script for Open Artel Dashboard Backend
# Helps configure .env file interactively

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${BACKEND_DIR}/.env"
ENV_EXAMPLE="${BACKEND_DIR}/.env.example"

echo "=========================================="
echo "Open Artel Dashboard Backend Setup"
echo "=========================================="
echo ""

# Check if .env already exists
if [ -f "$ENV_FILE" ]; then
    echo "⚠️  .env file already exists"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    echo "Backing up existing .env to .env.backup"
    cp "$ENV_FILE" "${ENV_FILE}.backup"
fi

# Copy example
echo "Creating .env from .env.example..."
cp "$ENV_EXAMPLE" "$ENV_FILE"

echo ""
echo "=========================================="
echo "Configuration Setup"
echo "=========================================="
echo ""

# Server Port
echo "Server Port (default: 3001):"
read -p "> " PORT
PORT=${PORT:-3001}
sed -i '' "s/^PORT=.*/PORT=${PORT}/" "$ENV_FILE"

# CORS Origin
echo ""
echo "Frontend CORS Origin (default: http://localhost:5173):"
read -p "> " CORS_ORIGIN
CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:5173}
sed -i '' "s|^CORS_ORIGIN=.*|CORS_ORIGIN=${CORS_ORIGIN}|" "$ENV_FILE"

# GitHub Token
echo ""
echo "=========================================="
echo "GitHub API Token (REQUIRED)"
echo "=========================================="
echo "Get your token from: https://github.com/settings/tokens"
echo "Required scopes: repo, read:org"
echo ""
read -p "GitHub Token (ghp_...): " GITHUB_TOKEN
if [ -n "$GITHUB_TOKEN" ]; then
    sed -i '' "s/^GITHUB_TOKEN=.*/GITHUB_TOKEN=${GITHUB_TOKEN}/" "$ENV_FILE"
    echo "✅ GitHub token configured"
else
    echo "⚠️  GitHub token not set. GitHub API features will be unavailable."
fi

# Kimi API Key
echo ""
echo "=========================================="
echo "Kimi/Moonshot API Key (REQUIRED)"
echo "=========================================="
echo "Get your key from: https://platform.moonshot.cn/"
echo ""
read -p "Kimi API Key (sk-...): " KIMI_API_KEY
if [ -n "$KIMI_API_KEY" ]; then
    sed -i '' "s/^KIMI_API_KEY=.*/KIMI_API_KEY=${KIMI_API_KEY}/" "$ENV_FILE"
    echo "✅ Kimi API key configured"
else
    echo "⚠️  Kimi API key not set. Kimi chat features will be unavailable."
fi

# Log Level
echo ""
echo "Log Level (default: info):"
echo "Options: error, warn, info, debug"
read -p "> " LOG_LEVEL
LOG_LEVEL=${LOG_LEVEL:-info}
sed -i '' "s/^LOG_LEVEL=.*/LOG_LEVEL=${LOG_LEVEL}/" "$ENV_FILE"

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Configuration saved to: $ENV_FILE"
echo ""
echo "Next steps:"
echo "  1. Review your .env file: cat $ENV_FILE"
echo "  2. Start the backend: npm run dev"
echo "  3. Test health endpoint: curl http://localhost:${PORT}/health"
echo ""
echo "⚠️  Remember: .env contains sensitive keys - never commit it to git!"

