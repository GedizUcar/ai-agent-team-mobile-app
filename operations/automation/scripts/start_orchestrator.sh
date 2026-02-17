#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="/Users/gedizucar/Projects/ai-agent-team-mobile-app"
cd "$WORKSPACE"

if [ -f .env ]; then
  export ORCHESTRATOR_TOKEN="$(grep '^N8N_ORCH_TOKEN=' .env | cut -d'=' -f2-)"
  export ORCHESTRATOR_QA_SECRET="$(grep '^N8N_QA_SECRET=' .env | cut -d'=' -f2-)"
  export CODEX_DISPATCH_WEBHOOK="$(grep '^CODEX_DISPATCH_WEBHOOK=' .env | cut -d'=' -f2- || true)"
  export KIMI_DISPATCH_WEBHOOK="$(grep '^KIMI_DISPATCH_WEBHOOK=' .env | cut -d'=' -f2- || true)"
  export DISPATCH_API_TOKEN="$(grep '^DISPATCH_API_TOKEN=' .env | cut -d'=' -f2- || true)"
fi

exec /usr/bin/python3 operations/scripts/orchestrator_server.py
