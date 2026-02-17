#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
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


def write_task(task: dict) -> None:
    p = TASKS_DIR / f"{task.get('id')}.json"
    p.write_text(json.dumps(task, indent=2) + "\n", encoding="utf-8")


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
    codex_lines.extend(
        [
            "",
            "Output rules:",
            "- Return only a unified git diff in a single ```diff fenced block.",
            "- No explanations before or after the diff.",
            "- Ensure output files listed above are created/updated.",
        ]
    )

    kimi_lines = [
        "Role: Frontend UI Agent (Kimi 2.5)",
        f"Task: {task.get('id')} - {task.get('title')}",
        "Build UI according to the API contract and provide screen/component level output.",
        "Required states: loading, empty, success, error.",
        "Return: file-by-file changes and integration notes for Codex backend agent.",
    ]
    return "\n".join(codex_lines), "\n".join(kimi_lines)


def post_json(url: str, payload: dict, headers: dict[str, str], timeout: int = 180) -> dict:
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

    kimi_temperature = float(os.getenv("KIMI_TEMPERATURE", "1"))

    payload = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You are a senior React Native frontend engineer. Return actionable implementation steps.",
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": kimi_temperature,
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
            {
                "role": "system",
                "content": "You are a senior backend engineer. Return only a unified git diff in one ```diff fenced block.",
            },
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


def extract_assistant_content(body: str) -> str:
    try:
        parsed = json.loads(body)
        return parsed["choices"][0]["message"]["content"]
    except Exception:  # noqa: BLE001
        return ""


def extract_diff(text: str) -> str:
    match = re.search(r"```diff\s*(.*?)```", text, flags=re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip() + "\n"

    if "diff --git " in text:
        idx = text.find("diff --git ")
        return text[idx:].strip() + "\n"

    if "--- " in text and "+++ " in text:
        idx = text.find("--- ")
        return text[idx:].strip() + "\n"

    return ""


def changed_files() -> list[str]:
    proc = subprocess.run(
        ["git", "diff", "--name-only"],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    if proc.returncode != 0:
        return []
    return [line.strip() for line in proc.stdout.splitlines() if line.strip()]


def apply_diff(diff_text: str) -> dict:
    proc = subprocess.run(
        ["git", "apply", "--whitespace=fix", "-"],
        cwd=ROOT,
        input=diff_text,
        text=True,
        capture_output=True,
        check=False,
    )
    ok = proc.returncode == 0
    return {
        "ok": ok,
        "returncode": proc.returncode,
        "stdout": proc.stdout.strip(),
        "stderr": proc.stderr.strip(),
        "changed_files": changed_files() if ok else [],
    }


def maybe_run_checks(task: dict) -> dict:
    owner = (task.get("owner_agent") or "").lower()
    if owner == "frontend":
        cmd = os.getenv("RUNNER_TEST_COMMAND_FRONTEND", "").strip() or os.getenv("RUNNER_TEST_COMMAND", "").strip()
    else:
        cmd = os.getenv("RUNNER_TEST_COMMAND", "").strip()

    if not cmd:
        return {"ok": True, "skipped": True, "reason": "RUNNER_TEST_COMMAND not set"}

    proc = subprocess.run(
        cmd,
        cwd=ROOT,
        shell=True,
        text=True,
        capture_output=True,
        check=False,
    )
    return {
        "ok": proc.returncode == 0,
        "skipped": False,
        "command": cmd,
        "returncode": proc.returncode,
        "stdout": proc.stdout[-4000:],
        "stderr": proc.stderr[-4000:],
        "task_id": task.get("id"),
    }


def set_task_status(task_id: str, status: str) -> dict:
    task = read_task(task_id)
    old_status = task.get("status")
    task["status"] = status
    write_task(task)
    return {"ok": True, "from": old_status, "to": status}


def run_codex_automation(task: dict, codex_response: dict) -> dict:
    body = codex_response.get("body", "")
    content = extract_assistant_content(body)
    diff_text = extract_diff(content)

    if not content:
        return {"ok": False, "error": "No assistant content in Codex response"}

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    raw_path = REPORTS_DIR / f"{task.get('id')}-codex-raw.md"
    raw_path.write_text(content + "\n", encoding="utf-8")

    if not diff_text:
        return {
            "ok": False,
            "error": "Codex response does not contain a unified diff",
            "raw_report": str(raw_path.relative_to(ROOT)),
        }

    apply_result = apply_diff(diff_text)
    if not apply_result.get("ok"):
        return {
            "ok": False,
            "error": "Failed to apply generated diff",
            "apply": apply_result,
            "raw_report": str(raw_path.relative_to(ROOT)),
            "raw_content": content,
        }

    check_result = maybe_run_checks(task)
    if not check_result.get("ok"):
        return {
            "ok": False,
            "error": "Checks failed after applying diff",
            "apply": apply_result,
            "checks": check_result,
            "raw_report": str(raw_path.relative_to(ROOT)),
        }

    status_result = set_task_status(str(task.get("id")), "review")
    return {
        "ok": True,
        "raw_report": str(raw_path.relative_to(ROOT)),
        "apply": apply_result,
        "checks": check_result,
        "status_update": status_result,
    }


def extract_kimi_content(kimi_response: dict) -> str:
    parsed = kimi_response.get("parsed", {})
    if isinstance(parsed, dict) and isinstance(parsed.get("content"), str):
        return parsed.get("content", "")

    body = kimi_response.get("body", "")
    return extract_assistant_content(body)


def parse_kimi_file_blocks(text: str) -> list[tuple[str, str]]:
    blocks: list[tuple[str, str]] = []
    pattern = re.compile(
        r"^([A-Za-z0-9_./\-]+\.[A-Za-z0-9]+)[^\n]*\n```[A-Za-z0-9_-]*\n(.*?)\n```",
        flags=re.MULTILINE | re.DOTALL,
    )

    for match in pattern.finditer(text):
        rel_path = match.group(1).strip()
        code = match.group(2)
        if rel_path.startswith("/") or ".." in rel_path.split("/"):
            continue
        blocks.append((rel_path, code + "\n"))

    return blocks


def write_kimi_files(blocks: list[tuple[str, str]]) -> list[str]:
    changed: list[str] = []
    for rel_path, code in blocks:
        target = ROOT / rel_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(code, encoding="utf-8")
        changed.append(rel_path)
    return changed


def run_kimi_automation(task: dict, kimi_response: dict) -> dict:
    content = extract_kimi_content(kimi_response)
    if not content:
        return {"ok": False, "error": "No assistant content in Kimi response"}

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    raw_path = REPORTS_DIR / f"{task.get('id')}-kimi-raw.md"
    raw_path.write_text(content + "\n", encoding="utf-8")

    blocks = parse_kimi_file_blocks(content)
    if not blocks:
        return {
            "ok": False,
            "error": "Kimi response does not contain file code blocks",
            "raw_report": str(raw_path.relative_to(ROOT)),
        }

    changed_files = write_kimi_files(blocks)
    check_result = maybe_run_checks(task)
    if not check_result.get("ok"):
        return {
            "ok": False,
            "error": "Checks failed after writing Kimi files",
            "changed_files": changed_files,
            "checks": check_result,
            "raw_report": str(raw_path.relative_to(ROOT)),
        }

    status_result = set_task_status(str(task.get("id")), "review")
    return {
        "ok": True,
        "raw_report": str(raw_path.relative_to(ROOT)),
        "changed_files": changed_files,
        "checks": check_result,
        "status_update": status_result,
    }


def run(task_id: str | None, dry_run: bool) -> int:
    load_env_file(ROOT / ".env")

    task = read_task(task_id) if task_id else latest_in_progress_task()
    codex_prompt, kimi_prompt = render_prompts(task)

    owner = (task.get("owner_agent") or "").lower()
    now_iso = datetime.now(timezone.utc).isoformat()

    result: dict
    if owner == "frontend":
        response = {"ok": True, "dry_run": True} if dry_run else call_kimi(kimi_prompt)
        result = {"target": "kimi", "response": response}
        if not dry_run and result["response"].get("ok"):
            kimi_automation = run_kimi_automation(task, result["response"])
            result["response"]["automation"] = kimi_automation
            if not kimi_automation.get("ok"):
                result["response"]["ok"] = False
    else:
        response = {"ok": True, "dry_run": True} if dry_run else call_codex(codex_prompt, task)
        result = {"target": "codex", "response": response}

    # Direct Codex mode: apply generated patch and move task to review.
    direct_codex = bool(not dry_run and owner != "frontend" and not os.getenv("CODEX_DISPATCH_WEBHOOK", "").strip())
    if direct_codex and result["response"].get("ok"):
        automation = run_codex_automation(task, result["response"])
        # One retry for malformed patches returned by the model.
        if not automation.get("ok") and "raw_content" in automation:
            first_err = automation.get("apply", {}).get("stderr", "") if isinstance(automation.get("apply"), dict) else ""
            retry_prompt = (
                f"{codex_prompt}\n\n"
                "Your previous patch failed to apply.\n"
                f"Apply error: {first_err}\n"
                "Return a corrected unified git diff only in one ```diff fenced block."
            )
            retry_response = call_codex(retry_prompt, task)
            if retry_response.get("ok"):
                retry_automation = run_codex_automation(task, retry_response)
                retry_automation["retried"] = True
                retry_automation["first_error"] = first_err
                result["response"]["retry_response"] = retry_response
                automation = retry_automation
        result["response"]["automation"] = automation
        if not automation.get("ok"):
            result["response"]["ok"] = False

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
