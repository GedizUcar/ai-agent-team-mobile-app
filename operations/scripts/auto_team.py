#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import date, datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TASKS_DIR = ROOT / "operations" / "hub" / "tasks"
REPORTS_DIR = ROOT / "deliverables" / "reports"
RUNNER_PATH = Path(__file__).resolve().parent / "runner.py"


def task_files() -> list[Path]:
    return sorted(p for p in TASKS_DIR.glob("*.json") if p.name != "task-template.json")


def read_task(task_id: str) -> dict:
    p = TASKS_DIR / f"{task_id}.json"
    if not p.exists():
        raise ValueError(f"Task not found: {task_id}")
    return json.loads(p.read_text(encoding="utf-8"))


def write_task(task: dict) -> None:
    p = TASKS_DIR / f"{task['id']}.json"
    p.write_text(json.dumps(task, indent=2) + "\n", encoding="utf-8")


def all_tasks() -> list[dict]:
    return [json.loads(p.read_text(encoding="utf-8")) for p in task_files()]


def can_start(task: dict, tasks: list[dict]) -> bool:
    deps = task.get("depends_on", [])
    if not deps:
        return True
    by_id = {t["id"]: t for t in tasks}
    return all(dep in by_id and by_id[dep].get("status") == "done" for dep in deps)


def latest_in_progress(tasks: list[dict]) -> dict | None:
    in_progress = [t for t in tasks if t.get("status") == "in_progress"]
    if not in_progress:
        return None
    in_progress.sort(key=lambda t: t.get("id", ""))
    return in_progress[-1]


def start_next_todo(tasks: list[dict]) -> dict | None:
    candidate = next((t for t in tasks if t.get("status") == "todo" and can_start(t, tasks)), None)
    if candidate is None:
        return None
    candidate["status"] = "in_progress"
    write_task(candidate)
    return candidate


def run_runner(task_id: str, dry_run: bool) -> dict:
    cmd = [sys.executable, str(RUNNER_PATH), task_id]
    if dry_run:
        cmd.append("--dry-run")
    proc = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    return {
        "ok": proc.returncode == 0,
        "returncode": proc.returncode,
        "stdout": proc.stdout.strip(),
        "stderr": proc.stderr.strip(),
    }


def read_runner_report(task_id: str) -> dict:
    p = REPORTS_DIR / f"{task_id}-runner.json"
    if not p.exists():
        return {}
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:  # noqa: BLE001
        return {}


def qa_task(task: dict, result: str, note: str) -> Path:
    qa = task.setdefault(
        "qa",
        {
            "required": True,
            "gate": "operations/quality/tester-review-gate.md",
            "result": "pending",
        },
    )
    qa["result"] = result
    task["status"] = "in_progress" if result == "FAIL" else "done"
    write_task(task)

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_path = REPORTS_DIR / f"{task['id']}-qa.md"
    body = (
        f"## QA Report: {task['id']} - {task.get('title')}\n\n"
        f"- Date: {date.today().isoformat()}\n"
        "- Owner: tester\n"
        f"- Result: {result}\n\n"
        "### Note\n"
        f"{note or 'No note provided.'}\n"
    )
    report_path.write_text(body, encoding="utf-8")
    return report_path


def evaluate_and_qa(task: dict, runner_result: dict, runner_report: dict, skip_qa: bool) -> dict:
    response = runner_report.get("response", {}) if isinstance(runner_report, dict) else {}
    automation = response.get("automation", {}) if isinstance(response, dict) else {}

    if skip_qa:
        return {"qa": "SKIPPED", "note": "skip_qa enabled", "report": ""}

    if not runner_result.get("ok"):
        note = runner_result.get("stderr") or runner_result.get("stdout") or "Runner command failed"
        report_path = qa_task(task, "FAIL", note)
        return {"qa": "FAIL", "note": note, "report": str(report_path.relative_to(ROOT))}

    if isinstance(automation, dict) and automation:
        if not automation.get("ok"):
            note = automation.get("error", "Automation step failed")
            report_path = qa_task(task, "FAIL", note)
            return {"qa": "FAIL", "note": note, "report": str(report_path.relative_to(ROOT))}

        note = "Auto QA PASS: patch applied and checks passed"
        report_path = qa_task(task, "PASS", note)
        return {"qa": "PASS", "note": note, "report": str(report_path.relative_to(ROOT))}

    note = "Runner completed but no automation metadata found; marked CONDITIONAL"
    report_path = qa_task(task, "CONDITIONAL", note)
    return {"qa": "CONDITIONAL", "note": note, "report": str(report_path.relative_to(ROOT))}


def run(task_id: str | None, dry_run: bool, skip_qa: bool) -> int:
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    tasks = all_tasks()

    selected = read_task(task_id) if task_id else latest_in_progress(tasks)
    started_new = False
    if selected is None:
        selected = start_next_todo(tasks)
        started_new = selected is not None

    if selected is None:
        print("No runnable task found")
        return 0

    task_id_value = str(selected["id"])
    runner_result = run_runner(task_id_value, dry_run=dry_run)
    runner_report = read_runner_report(task_id_value)
    fresh_task = read_task(task_id_value)
    qa_result = evaluate_and_qa(fresh_task, runner_result, runner_report, skip_qa=skip_qa)

    summary = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "task_id": task_id_value,
        "started_new_task": started_new,
        "team_lead": {
            "selected_task": task_id_value,
            "owner_agent": fresh_task.get("owner_agent"),
        },
        "developer": runner_result,
        "tester": qa_result,
    }

    summary_path = REPORTS_DIR / f"{task_id_value}-autonomous.json"
    summary_path.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")

    print(f"Autonomous run completed for {task_id_value}")
    print(f"Summary: {summary_path.relative_to(ROOT)}")

    return 0 if qa_result.get("qa") != "FAIL" else 1


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Team autonomous cycle (lead + dev + tester)")
    parser.add_argument("task_id", nargs="?", help="Task ID (optional)")
    parser.add_argument("--dry-run", action="store_true", help="Runner dry-run")
    parser.add_argument("--skip-qa", action="store_true", help="Skip QA status update")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        return run(args.task_id, dry_run=args.dry_run, skip_qa=args.skip_qa)
    except Exception as exc:  # noqa: BLE001
        print(str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
