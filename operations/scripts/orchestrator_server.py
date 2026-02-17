#!/usr/bin/env python3

from __future__ import annotations

import json
import os
import subprocess
import sys
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ORCHESTRATE_PATH = Path(__file__).resolve().parent / "orchestrate.py"
RUNNER_PATH = Path(__file__).resolve().parent / "runner.py"
AUTO_TEAM_PATH = Path(__file__).resolve().parent / "auto_team.py"
ROOT = Path(__file__).resolve().parents[2]
TOKEN = os.getenv("ORCHESTRATOR_TOKEN", "")
QA_SECRET = os.getenv("ORCHESTRATOR_QA_SECRET", "")
HOST = os.getenv("ORCHESTRATOR_HOST", "0.0.0.0")
PORT = int(os.getenv("ORCHESTRATOR_PORT", "8787"))


def build_args(payload: dict) -> list[str]:
    action = payload.get("action")
    if action == "list":
        return ["list"]
    if action == "validate":
        return ["validate"]
    if action == "next":
        return ["next"]
    if action == "cycle":
        return ["cycle"]
    if action == "dispatch":
        task_id = payload.get("task_id", "")
        return ["dispatch", task_id] if task_id else ["dispatch"]
    if action == "auto":
        return ["auto"]
    if action == "run":
        task_id = payload.get("task_id", "")
        args = ["run"]
        if task_id:
            args.append(task_id)
        return args
    if action == "autonomous":
        task_id = payload.get("task_id", "")
        args = ["autonomous"]
        if task_id:
            args.append(task_id)
        return args
    if action == "prompt":
        return ["prompt", payload["task_id"]]
    if action == "assign":
        return ["assign", payload["task_id"], payload["agent"]]
    if action == "move":
        return ["move", payload["task_id"], payload["status"]]
    if action == "qa":
        note = payload.get("note", "")
        args = ["qa", payload["task_id"], payload["result"]]
        if note:
            args.append(note)
        return args
    raise ValueError(f"Unsupported action: {action}")


def resolve_command(args: list[str]) -> list[str]:
    if args and args[0] == "run":
        return [sys.executable, str(RUNNER_PATH), *(args[1:])]
    if args and args[0] == "autonomous":
        return [sys.executable, str(AUTO_TEAM_PATH), *(args[1:])]
    return [sys.executable, str(ORCHESTRATE_PATH), *args]


class Handler(BaseHTTPRequestHandler):
    def _json(self, status: int, body: dict) -> None:
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(body).encode("utf-8"))

    def do_GET(self) -> None:
        if self.path == "/health":
            self._json(HTTPStatus.OK, {"ok": True, "service": "orchestrator_server"})
            return
        self._json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "not_found"})

    def do_POST(self) -> None:
        if self.path != "/event":
            self._json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "not_found"})
            return

        if TOKEN:
            header_token = self.headers.get("X-Orchestrator-Token", "")
            if header_token != TOKEN:
                self._json(HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "invalid_token"})
                return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(content_length)

        try:
            payload = json.loads(raw.decode("utf-8"))
            if QA_SECRET and payload.get("action") == "qa":
                if payload.get("qa_secret", "") != QA_SECRET:
                    self._json(HTTPStatus.UNAUTHORIZED, {"ok": False, "error": "invalid_qa_secret"})
                    return
            args = build_args(payload)
        except Exception as exc:
            self._json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(exc)})
            return

        result = subprocess.run(
            resolve_command(args),
            cwd=ROOT,
            capture_output=True,
            text=True,
        )

        if result.returncode != 0:
            self._json(
                HTTPStatus.BAD_REQUEST,
                {
                    "ok": False,
                    "command": args,
                    "stdout": result.stdout.strip(),
                    "stderr": result.stderr.strip(),
                },
            )
            return

        self._json(
            HTTPStatus.OK,
            {
                "ok": True,
                "command": args,
                "stdout": result.stdout.strip(),
            },
        )


def main() -> int:
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"orchestrator_server listening on http://{HOST}:{PORT}")
    server.serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
