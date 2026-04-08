#!/usr/bin/env bash
set -euo pipefail

# ──────────────────────────────────────────────
# Configuration — edit these for your environment
# ──────────────────────────────────────────────
REMOTE_USER="${DEPLOY_USER:-ec2-user}"
REMOTE_HOST="${DEPLOY_HOST:?Set DEPLOY_HOST (e.g. export DEPLOY_HOST=1.2.3.4)}"
REMOTE_DIR="${DEPLOY_DIR:-/opt/site}"
SERVICE_NAME="${DEPLOY_SERVICE:-site}"

LOCAL_DIST="dist"

# ──────────────────────────────────────────────
# Preflight checks
# ──────────────────────────────────────────────
if [ ! -f "$LOCAL_DIST/server" ]; then
    echo "Error: $LOCAL_DIST/server not found. Run 'make package' first."
    exit 1
fi

if [ ! -f "$LOCAL_DIST/static/index.html" ]; then
    echo "Error: $LOCAL_DIST/static/index.html not found. Run 'make package' first."
    exit 1
fi

echo "Deploying to $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

# ──────────────────────────────────────────────
# Upload
# ──────────────────────────────────────────────

# Ensure remote directory exists
ssh "$REMOTE_USER@$REMOTE_HOST" "sudo mkdir -p $REMOTE_DIR/static && sudo chown -R $REMOTE_USER:$REMOTE_USER $REMOTE_DIR"

# Upload Go binary
echo "Uploading server binary..."
scp "$LOCAL_DIST/server" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/server.new"

# Upload static assets (incremental sync, delete stale files)
echo "Syncing static assets..."
rsync -az --delete "$LOCAL_DIST/static/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/static/"

# ──────────────────────────────────────────────
# Swap binary and restart
# ──────────────────────────────────────────────
echo "Swapping binary and restarting service..."
ssh "$REMOTE_USER@$REMOTE_HOST" "
    cd $REMOTE_DIR
    chmod +x server.new
    mv server.new server
    sudo systemctl restart $SERVICE_NAME
"

# ──────────────────────────────────────────────
# Verify
# ──────────────────────────────────────────────
echo "Waiting for service to start..."
sleep 2
if ssh "$REMOTE_USER@$REMOTE_HOST" "curl -sf http://localhost:4000/healthz > /dev/null"; then
    echo "Deploy successful — health check passed."
else
    echo "Warning: health check failed. Check logs with: ssh $REMOTE_USER@$REMOTE_HOST 'journalctl -u $SERVICE_NAME -n 50'"
    exit 1
fi