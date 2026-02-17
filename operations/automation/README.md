# Automation Runtime (macOS)

Bu klasor, orchestrator server + cloudflare tunnel sureclerini macOS'ta reboot sonrasi otomatik baslatmak icin kullanilir.

## Dosyalar
- `scripts/start_orchestrator.sh`
- `scripts/start_tunnel.sh`
- `launchd/com.aiagent.orchestrator.plist`
- `launchd/com.aiagent.tunnel.plist`
- `install_launchd.sh`

## Kurulum

```bash
cd /Users/gedizucar/Desktop/Gediz/Orkestra/ai-agent-team-mobile-app
./operations/automation/install_launchd.sh
```

## Durum Kontrolu

```bash
launchctl list | rg 'com.aiagent.orchestrator|com.aiagent.tunnel'
curl http://localhost:8787/health
```

## Loglar
- `/tmp/aiagent-orchestrator.out.log`
- `/tmp/aiagent-orchestrator.err.log`
- `/tmp/aiagent-tunnel.out.log`
- `/tmp/aiagent-tunnel.err.log`
