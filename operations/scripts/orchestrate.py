#!/usr/bin/env python3

from __future__ import annotations

import json
import os
import sys
from datetime import date
from pathlib import Path
from urllib import error, request

ROOT = Path.cwd()
TASKS_DIR = ROOT / "operations" / "hub" / "tasks"
REPORTS_DIR = ROOT / "deliverables" / "reports"
VALID_STATUS = {"todo", "in_progress", "review", "qa", "done", "blocked"}

CODEX_DISPATCH_WEBHOOK = os.getenv("CODEX_DISPATCH_WEBHOOK", "")
KIMI_DISPATCH_WEBHOOK = os.getenv("KIMI_DISPATCH_WEBHOOK", "")
DISPATCH_API_TOKEN = os.getenv("DISPATCH_API_TOKEN", "")


def ensure_dirs() -> None:
    TASKS_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)


def task_files() -> list[Path]:
    return sorted(
        p for p in TASKS_DIR.glob("*.json") if p.name != "task-template.json"
    )


def read_task(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_task(task: dict) -> None:
    path = TASKS_DIR / f"{task['id']}.json"
    path.write_text(json.dumps(task, indent=2) + "\n", encoding="utf-8")


def all_tasks() -> list[dict]:
    return [read_task(p) for p in task_files()]


def find_task(task_id: str) -> dict:
    path = TASKS_DIR / f"{task_id}.json"
    if not path.exists():
        raise ValueError(f"Task not found: {task_id}")
    return read_task(path)


def print_usage() -> None:
    print(
        "Usage:\n"
        "  python3 operations/scripts/orchestrate.py list\n"
        "  python3 operations/scripts/orchestrate.py validate\n"
        "  python3 operations/scripts/orchestrate.py next\n"
        "  python3 operations/scripts/orchestrate.py cycle\n"
        "  python3 operations/scripts/orchestrate.py dispatch [TASK_ID]\n"
        "  python3 operations/scripts/orchestrate.py auto\n"
        "  python3 operations/scripts/orchestrate.py assign <TASK_ID> <AGENT>\n"
        "  python3 operations/scripts/orchestrate.py move <TASK_ID> <STATUS>\n"
        "  python3 operations/scripts/orchestrate.py qa <TASK_ID> <PASS|CONDITIONAL|FAIL> [note]\n"
        "  python3 operations/scripts/orchestrate.py prompt <TASK_ID>\n"
    )


def can_start(task: dict, tasks: list[dict]) -> bool:
    deps = task.get("depends_on", [])
    if not deps:
        return True

    by_id = {t["id"]: t for t in tasks}
    return all(dep in by_id and by_id[dep].get("status") == "done" for dep in deps)


def list_tasks() -> None:
    tasks = all_tasks()
    if not tasks:
        print("No task found in operations/hub/tasks")
        return

    for task in sorted(tasks, key=lambda t: t["id"]):
        print(f"{task['id']} | {task.get('status')} | {task.get('owner_agent')} | {task.get('title')}")


def validate_tasks() -> None:
    tasks = all_tasks()
    if not tasks:
        print("No task found in operations/hub/tasks")
        return

    required = {
        "id",
        "title",
        "status",
        "priority",
        "owner_agent",
        "depends_on",
        "inputs",
        "outputs",
        "acceptance_criteria",
        "handoff",
        "qa",
    }

    errors: list[str] = []
    for task in tasks:
        missing = [key for key in required if key not in task]
        if missing:
            errors.append(f"{task.get('id', '<unknown>')}: missing fields {', '.join(missing)}")
        if task.get("status") not in VALID_STATUS:
            errors.append(f"{task.get('id', '<unknown>')}: invalid status '{task.get('status')}'")
        if not isinstance(task.get("depends_on", []), list):
            errors.append(f"{task.get('id', '<unknown>')}: depends_on must be a list")
        if not isinstance(task.get("acceptance_criteria", []), list):
            errors.append(f"{task.get('id', '<unknown>')}: acceptance_criteria must be a list")

    if errors:
        for err in errors:
            print(err, file=sys.stderr)
        raise ValueError(f"Task validation failed with {len(errors)} error(s)")

    print(f"Task validation passed ({len(tasks)} task files)")


def next_task() -> None:
    tasks = all_tasks()
    candidate = next((t for t in tasks if t.get("status") == "todo" and can_start(t, tasks)), None)
    if not candidate:
        print("No runnable todo task found.")
        return

    print(f"Next task: {candidate['id']}")
    print(f"Title: {candidate.get('title')}")
    print(f"Owner: {candidate.get('owner_agent')}")
    handoff = candidate.get("handoff", {})
    print(f"Handoff: {handoff.get('from', '-')} -> {handoff.get('to', '-')}")


def assign_task(task_id: str, agent: str) -> None:
    task = find_task(task_id)
    task["owner_agent"] = agent
    handoff = task.setdefault("handoff", {"from": "team_lead", "to": agent, "notes": ""})
    handoff["to"] = agent
    write_task(task)
    print(f"Assigned {task_id} to {agent}")


def move_task(task_id: str, status: str) -> None:
    if status not in VALID_STATUS:
        raise ValueError(f"Invalid status: {status}")

    task = find_task(task_id)
    task["status"] = status
    write_task(task)
    print(f"Moved {task_id} to {status}")


def qa_task(task_id: str, result: str, note: str) -> None:
    upper = result.upper()
    if upper not in {"PASS", "CONDITIONAL", "FAIL"}:
        raise ValueError(f"Invalid QA result: {result}")

    task = find_task(task_id)
    qa = task.setdefault(
        "qa",
        {
            "required": True,
            "gate": "operations/quality/tester-review-gate.md",
            "result": "pending",
        },
    )
    qa["result"] = upper
    task["status"] = "in_progress" if upper == "FAIL" else "done"
    write_task(task)

    report_path = REPORTS_DIR / f"{task_id}-qa.md"
    report = (
        f"## QA Report: {task_id} - {task.get('title')}\n\n"
        f"- Date: {date.today().isoformat()}\n"
        "- Owner: tester\n"
        f"- Result: {upper}\n\n"
        "### Note\n"
        f"{note or 'No note provided.'}\n"
    )
    report_path.write_text(report, encoding="utf-8")

    print(f"QA saved for {task_id}: {upper}")
    print(f"Report: deliverables/reports/{task_id}-qa.md")


def prompt_for_task(task_id: str) -> None:
    task = find_task(task_id)
    codex_prompt, kimi_prompt = render_prompts(task)

    print("--- Codex Prompt ---")
    print(codex_prompt)
    print("\n--- Kimi Prompt ---")
    print(kimi_prompt)


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


def write_prompt_report(task: dict) -> Path:
    codex_prompt, kimi_prompt = render_prompts(task)
    report_path = REPORTS_DIR / f"{task.get('id')}-prompts.md"
    report = (
        f"## Team Lead Dispatch: {task.get('id')}\n\n"
        f"- Date: {date.today().isoformat()}\n"
        f"- Status: {task.get('status')}\n\n"
        "### Codex Prompt\n\n"
        f"{codex_prompt}\n\n"
        "### Kimi Prompt\n\n"
        f"{kimi_prompt}\n"
    )
    report_path.write_text(report, encoding="utf-8")
    return report_path


def run_cycle() -> str | None:
    tasks = all_tasks()
    candidate = next((t for t in tasks if t.get("status") == "todo" and can_start(t, tasks)), None)
    if not candidate:
        print("No runnable todo task found.")
        return None

    candidate["status"] = "in_progress"
    write_task(candidate)

    report_path = write_prompt_report(candidate)

    print(f"Cycle started for {candidate.get('id')}")
    print(f"Prompt file: {report_path.relative_to(ROOT)}")
    return str(candidate.get("id"))


def resolve_dispatch_target(task: dict) -> tuple[str, str]:
    owner = (task.get("owner_agent") or "").lower()
    if owner == "frontend":
        return owner, KIMI_DISPATCH_WEBHOOK
    return owner, CODEX_DISPATCH_WEBHOOK


def post_json(url: str, payload: dict) -> tuple[int, str]:
    data = json.dumps(payload).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    if DISPATCH_API_TOKEN:
        headers["Authorization"] = f"Bearer {DISPATCH_API_TOKEN}"

    req = request.Request(url, data=data, headers=headers, method="POST")
    try:
        with request.urlopen(req, timeout=20) as resp:
            body = resp.read().decode("utf-8", errors="ignore")
            return resp.status, body
    except error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="ignore")
        raise ValueError(f"Dispatch HTTP {exc.code}: {body}") from exc
    except error.URLError as exc:
        raise ValueError(f"Dispatch network error: {exc}") from exc


def get_latest_in_progress() -> dict | None:
    tasks = [t for t in all_tasks() if t.get("status") == "in_progress"]
    if not tasks:
        return None
    tasks.sort(key=lambda t: t.get("id", ""))
    return tasks[-1]


def dispatch_task(task_id: str | None = None) -> None:
    task = find_task(task_id) if task_id else get_latest_in_progress()
    if task is None:
        raise ValueError("No in_progress task found for dispatch")

    owner, webhook = resolve_dispatch_target(task)
    codex_prompt, kimi_prompt = render_prompts(task)

    payload = {
        "task_id": task.get("id"),
        "title": task.get("title"),
        "owner_agent": owner,
        "status": task.get("status"),
        "acceptance_criteria": task.get("acceptance_criteria", []),
        "inputs": task.get("inputs", []),
        "outputs": task.get("outputs", []),
        "codex_prompt": codex_prompt,
        "kimi_prompt": kimi_prompt,
        "dispatched_at": date.today().isoformat(),
    }

    report_path = REPORTS_DIR / f"{task.get('id')}-dispatch.json"

    if not webhook:
        result = {
            "ok": False,
            "reason": "webhook_not_configured",
            "owner_agent": owner,
            "expected_env": "KIMI_DISPATCH_WEBHOOK" if owner == "frontend" else "CODEX_DISPATCH_WEBHOOK",
            "payload": payload,
        }
        report_path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
        print(f"Dispatch skipped for {task.get('id')}: webhook not configured")
        print(f"Report: {report_path.relative_to(ROOT)}")
        return

    status, body = post_json(webhook, payload)
    result = {
        "ok": True,
        "http_status": status,
        "response_body": body,
        "webhook": webhook,
        "payload": payload,
    }
    report_path.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")

    print(f"Dispatch sent for {task.get('id')} -> {owner}")
    print(f"Report: {report_path.relative_to(ROOT)}")


def run_auto() -> None:
    validate_tasks()
    task_id = run_cycle()
    if task_id is None:
        print("Auto: no runnable task")
        return
    dispatch_task(task_id)
    print(f"Auto completed for {task_id}")


def main() -> int:
    ensure_dirs()
    if len(sys.argv) < 2:
        print_usage()
        return 1

    cmd = sys.argv[1]
    args = sys.argv[2:]

    try:
        if cmd == "list":
            list_tasks()
        elif cmd == "validate":
            validate_tasks()
        elif cmd == "next":
            next_task()
        elif cmd == "cycle":
            run_cycle()
        elif cmd == "dispatch":
            dispatch_task(args[0] if args else None)
        elif cmd == "auto":
            run_auto()
        elif cmd == "assign":
            assign_task(args[0], args[1])
        elif cmd == "move":
            move_task(args[0], args[1])
        elif cmd == "qa":
            note = " ".join(args[2:]) if len(args) > 2 else ""
            qa_task(args[0], args[1], note)
        elif cmd == "prompt":
            prompt_for_task(args[0])
        else:
            print_usage()
            return 1
    except (IndexError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
