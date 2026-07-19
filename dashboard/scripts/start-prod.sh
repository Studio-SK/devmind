#!/usr/bin/env bash
# Build and (re)start the dashboard in prod mode under pm2, on port 3300.
# Re-run this after making changes and rebuilding — it restarts the existing
# pm2 process if already running, or starts a fresh one otherwise.
set -euo pipefail

cd "$(dirname "$0")/.."

PORT=3300
PM2_NAME=devmind-dashboard

npm run build

if pm2 describe "$PM2_NAME" > /dev/null 2>&1; then
  pm2 restart "$PM2_NAME" --update-env
else
  pm2 start npm --name "$PM2_NAME" -- start -- -p "$PORT"
fi

pm2 save

echo ""
echo "Running at http://localhost:$PORT (pm2 process: $PM2_NAME)"
echo "Logs:    pm2 logs $PM2_NAME"
echo "Stop:    pm2 stop $PM2_NAME"
