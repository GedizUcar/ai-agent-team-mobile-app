#!/usr/bin/env bash
set -euo pipefail

WORKSPACE="/Users/gedizucar/Projects/ai-agent-team-mobile-app"
AGENTS_DIR="$HOME/Library/LaunchAgents"

mkdir -p "$AGENTS_DIR"
cp "$WORKSPACE/operations/automation/launchd/com.aiagent.orchestrator.plist" "$AGENTS_DIR/"
cp "$WORKSPACE/operations/automation/launchd/com.aiagent.tunnel.plist" "$AGENTS_DIR/"

launchctl unload "$AGENTS_DIR/com.aiagent.orchestrator.plist" >/dev/null 2>&1 || true
launchctl unload "$AGENTS_DIR/com.aiagent.tunnel.plist" >/dev/null 2>&1 || true

launchctl load "$AGENTS_DIR/com.aiagent.orchestrator.plist"
launchctl load "$AGENTS_DIR/com.aiagent.tunnel.plist"

echo "Installed and loaded:"
launchctl list | rg 'com.aiagent.orchestrator|com.aiagent.tunnel' || true
