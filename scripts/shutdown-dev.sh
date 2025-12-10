#!/usr/bin/env bash
set -euo pipefail

echo "[shutdown-dev] Stopping dev stack..."
docker compose down \
  --remove-orphans

echo "[shutdown-dev] Done."