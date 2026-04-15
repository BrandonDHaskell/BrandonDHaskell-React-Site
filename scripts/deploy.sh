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
NGINX_CONF="nginx/prod-site.conf"
NGINX_REMOTE="/etc/nginx/sites-available/site.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/site.conf"

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
# Nginx configuration
# ──────────────────────────────────────────────
NGINX_RELOAD=false

if [ -f "$NGINX_CONF" ]; then
    echo "Syncing Nginx config..."

    # Upload to a staging path so we can validate before activating
    scp "$NGINX_CONF" "$REMOTE_USER@$REMOTE_HOST:/tmp/nginx-site.conf.new"

    # Check if the config actually changed (skip reload if identical)
    CHANGED=$(ssh "$REMOTE_USER@$REMOTE_HOST" "
        if [ -f $NGINX_REMOTE ] && diff -q /tmp/nginx-site.conf.new $NGINX_REMOTE > /dev/null 2>&1; then
            echo 'no'
        else
            echo 'yes'
        fi
    ")

    if [ "$CHANGED" = "yes" ]; then
        # Validate syntax before activating
        ssh "$REMOTE_USER@$REMOTE_HOST" "
            sudo cp /tmp/nginx-site.conf.new $NGINX_REMOTE
            sudo ln -sf $NGINX_REMOTE $NGINX_ENABLED
            if sudo nginx -t 2>&1; then
                echo 'Nginx config valid'
            else
                echo 'ERROR: Nginx config test failed — rolling back'
                sudo git -C /etc/nginx checkout -- sites-available/site.conf 2>/dev/null || true
                exit 1
            fi
        "
        NGINX_RELOAD=true
    else
        echo "Nginx config unchanged, skipping."
    fi

    # Clean up staging file
    ssh "$REMOTE_USER@$REMOTE_HOST" "rm -f /tmp/nginx-site.conf.new"
else
    echo "No Nginx config found at $NGINX_CONF, skipping."
fi

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

# Reload Nginx if its config was updated (after Go server is back up)
if [ "$NGINX_RELOAD" = true ]; then
    echo "Reloading Nginx..."
    ssh "$REMOTE_USER@$REMOTE_HOST" "sudo systemctl reload nginx"
fi

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