#!/usr/bin/env bash
set -euo pipefail

exec /opt/homebrew/bin/cloudflared tunnel --url http://localhost:8787 --no-autoupdate
