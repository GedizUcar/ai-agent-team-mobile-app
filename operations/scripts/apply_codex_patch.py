#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


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


def apply_patch_text(diff_text: str, check_only: bool) -> dict:
    cmd = ["git", "apply", "--whitespace=fix"]
    if check_only:
        cmd.append("--check")
    cmd.append("-")

    proc = subprocess.run(
        cmd,
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
        "changed_files": changed_files() if ok and not check_only else [],
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Extract and apply codex unified diff output")
    parser.add_argument("--file", help="Input file that contains model output. If omitted, stdin is used.")
    parser.add_argument("--check", action="store_true", help="Only validate patch without applying it.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    raw_text = Path(args.file).read_text(encoding="utf-8") if args.file else sys.stdin.read()
    diff_text = extract_diff(raw_text)

    if not diff_text:
        print(json.dumps({"ok": False, "error": "No diff block found in model output"}, ensure_ascii=False))
        return 1

    result = apply_patch_text(diff_text, check_only=args.check)
    result["diff_bytes"] = len(diff_text.encode("utf-8"))
    print(json.dumps(result, ensure_ascii=False))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
