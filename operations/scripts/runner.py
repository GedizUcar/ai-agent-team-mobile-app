#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib import error, request

ROOT = Path(__file__).resolve().parents[2]
TASKS_DIR = ROOT / "operations" / "hub" / "tasks"
REPORTS_DIR = ROOT / "deliverables" / "reports"


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        raw = line.strip()
        if not raw or raw.startswith("#") or "=" not in raw:
            continue
        key, value = raw.split("=", 1)
        if key and key not in os.environ:
            os.environ[key] = value


def read_task(task_id: str) -> dict:
    p = TASKS_DIR / f"{task_id}.json"
    if not p.exists():
        raise ValueError(f"Task not found: {task_id}")
    return json.loads(p.read_text(encoding="utf-8"))


def latest_in_progress_task() -> dict:
    tasks = []
    for p in TASKS_DIR.glob("*.json"):
        if p.name == "task-template.json":
            continue
        task = json.loads(p.read_text(encoding="utf-8"))
        if task.get("status") == "in_progress":
            tasks.append(task)
    if not tasks:
        raise ValueError("No in_progress task found")
    tasks.sort(key=lambda t: t.get("id", ""))
    return tasks[-1]


def render_prompts(task: dict) -> tuple[str, str]:
    codex_lines = [
        f"You are the {task.get('owner_agent')} agent for task {task.get('id')}.",
        f"Task title: {task.get('title')}",
        "Acceptance criteria:",
    ]
    codex_lines.extend(f"- {c}" for c in task.get("acceptance_criteria", []))
    codex_lines.append("Inputs:")
    codex_lines.extend(f"- {i}" for i in task.get("inputs", []))
    codex_lines.append("Outputs:")
    codex_lines.extend(f"- {o}" for o in task.get("outputs", []))

    kimi_lines = [
        "Role: Frontend UI Agent (Kimi 2.5)",
        f"Task: {task.get('id')} - {task.get('title')}",
        "Build UI according to the API contract and provide screen/component level output.",
        "Required states: loading, empty, success, error.",
        "Return: file-by-file changes and integration notes for Codex backend agent.",
    ]
    return "\n".join(codex_lines), "\n".join(kimi_lines)


def post_json(url: str, payload: dict, headers: dict[str, str], timeout: int = 45) -> dict:
    req = request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", **headers},
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8", errors="ignore")
            return {"ok": True, "status": resp.status, "body": body}
    except error.HTTPError as exc:
        return {
            "ok": False,
            "status": exc.code,
            "body": exc.read().decode("utf-8", errors="ignore"),
            "error": str(exc),
        }
    except Exception as exc:  # noqa: BLE001
        return {"ok": False, "status": 0, "body": "", "error": str(exc)}


def call_kimi(prompt: str) -> dict:
    api_key = os.getenv("KIMI_API_KEY", "")
    if not api_key:
        return {"ok": False, "error": "KIMI_API_KEY missing"}

    base_url = os.getenv("KIMI_BASE_URL", "https://api.moonshot.cn/v1")
    model = os.getenv("KIMI_MODEL", "kimi-k2.5")
    url = f"{base_url.rstrip('/')}/chat/completions"

    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You are a senior React Native frontend engineer. Return actionable implementation steps.",
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.2,
    }

    res = post_json(url, payload, {"Authorization": f"Bearer {api_key}"})
    if not res.get("ok"):
        return res

    try:
        parsed = json.loads(res.get("body", "{}"))
        content = parsed["choices"][0]["message"]["content"]
        res["parsed"] = {"content": content}
    except Exception:  # noqa: BLE001
        pass
    return res


def call_codex(prompt: str, task: dict) -> dict:
    webhook = os.getenv("CODEX_DISPATCH_WEBHOOK", "")
    bearer = os.getenv("DISPATCH_API_TOKEN", "")

    if webhook:
        payload = {
            "task_id": task.get("id"),
            "owner_agent": task.get("owner_agent"),
            "title": task.get("title"),
            "prompt": prompt,
            "inputs": task.get("inputs", []),
            "outputs": task.get("outputs", []),
        }
        headers = {"Authorization": f"Bearer {bearer}"} if bearer else {}
        return post_json(webhook, payload, headers)

    openai_key = os.getenv("OPENAI_API_KEY", "")
    if not openai_key:
        return {"ok": False, "error": "No CODEX_DISPATCH_WEBHOOK or OPENAI_API_KEY configured"}

    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
    model = os.getenv("CODEX_MODEL", "gpt-4.1-mini")
    url = f"{base_url.rstrip('/')}/chat/completions"
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a senior backend engineer. Return actionable implementation steps."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.1,
    }
    return post_json(url, payload, {"Authorization": f"Bearer {openai_key}"})


def append_usage(entry: dict) -> None:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    usage_path = REPORTS_DIR / f"usage-{datetime.now(timezone.utc).date().isoformat()}.json"
    usage = []
    if usage_path.exists():
        try:
            usage = json.loads(usage_path.read_text(encoding="utf-8"))
        except Exception:  # noqa: BLE001
            usage = []
    usage.append(entry)
    usage_path.write_text(json.dumps(usage, indent=2) + "\n", encoding="utf-8")


def run(task_id: str | None, dry_run: bool) -> int:
    load_env_file(ROOT / ".env")

    task = read_task(task_id) if task_id else latest_in_progress_task()
    codex_prompt, kimi_prompt = render_prompts(task)

    owner = (task.get("owner_agent") or "").lower()
    now_iso = datetime.now(timezone.utc).isoformat()

    result: dict
    if owner == "frontend":
        result = {"target": "kimi", "response": {"ok": True, "dry_run": True}} if dry_run else {"target": "kimi", "response": call_kimi(kimi_prompt)}
    else:
        result = {"target": "codex", "response": {"ok": True, "dry_run": True}} if dry_run else {"target": "codex", "response": call_codex(codex_prompt, task)}

    report = {
        "timestamp": now_iso,
        "task_id": task.get("id"),
        "title": task.get("title"),
        "owner_agent": owner,
        "target": result["target"],
        "response": result["response"],
    }

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_path = REPORTS_DIR / f"{task.get('id')}-runner.json"
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")

    append_usage(
        {
            "timestamp": now_iso,
            "task_id": task.get("id"),
            "target": result["target"],
            "ok": bool(result["response"].get("ok")),
            "status": result["response"].get("status", 0),
            "dry_run": dry_run,
        }
    )

    print(f"Runner target: {result['target']}")
    print(f"Report: {report_path.relative_to(ROOT)}")

    return 0 if result["response"].get("ok") else 1


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Agent runner for Codex/Kimi dispatch")
    parser.add_argument("task_id", nargs="?", help="Task ID (defaults to latest in_progress)")
    parser.add_argument("--dry-run", action="store_true", help="Do not call remote APIs")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        return run(args.task_id, args.dry_run)
    except Exception as exc:  # noqa: BLE001
        print(str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
