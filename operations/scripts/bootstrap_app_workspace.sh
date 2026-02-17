#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  operations/scripts/bootstrap_app_workspace.sh --repo <repo_url> [options]

Options:
  --repo <url>        Git repository URL for the app (required)
  --name <name>       App workspace name (default: derived from repo name)
  --base-dir <dir>    Base directory for app workspaces (default: /srv/apps)
  --branch <branch>   Target branch (default: main)
  --env-file <path>   Orchestrator env file to print/update (default: /opt/ai-agent-team-mobile-app/.env)
  --write-env         Update env file in-place with TARGET_REPO/TARGET_DIR/TARGET_BRANCH
  --init-readme       If repo is empty, create README.md and first commit (push attempted)
  -h, --help          Show this help

Examples:
  operations/scripts/bootstrap_app_workspace.sh \
    --repo https://github.com/GedizUcar/todo-mobile-app.git \
    --write-env

  operations/scripts/bootstrap_app_workspace.sh \
    --repo git@github.com:GedizUcar/expense-mobile-app.git \
    --name expense-mobile-app \
    --branch main \
    --write-env --init-readme
USAGE
}

REPO_URL=""
APP_NAME=""
BASE_DIR="/srv/apps"
BRANCH="main"
ENV_FILE="/opt/ai-agent-team-mobile-app/.env"
WRITE_ENV="false"
INIT_README="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      REPO_URL="${2:-}"
      shift 2
      ;;
    --name)
      APP_NAME="${2:-}"
      shift 2
      ;;
    --base-dir)
      BASE_DIR="${2:-}"
      shift 2
      ;;
    --branch)
      BRANCH="${2:-}"
      shift 2
      ;;
    --env-file)
      ENV_FILE="${2:-}"
      shift 2
      ;;
    --write-env)
      WRITE_ENV="true"
      shift
      ;;
    --init-readme)
      INIT_README="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$REPO_URL" ]]; then
  echo "--repo is required" >&2
  usage
  exit 1
fi

if [[ -z "$APP_NAME" ]]; then
  APP_NAME="$(basename "$REPO_URL")"
  APP_NAME="${APP_NAME%.git}"
fi

if [[ -z "$APP_NAME" ]]; then
  echo "Could not derive app name from repo URL" >&2
  exit 1
fi

TARGET_DIR="${BASE_DIR%/}/$APP_NAME"

mkdir -p "$BASE_DIR"

if [[ ! -d "$TARGET_DIR/.git" ]]; then
  echo "[bootstrap] cloning: $REPO_URL -> $TARGET_DIR"
  git clone "$REPO_URL" "$TARGET_DIR"
else
  echo "[bootstrap] existing workspace found: $TARGET_DIR"
  git -C "$TARGET_DIR" remote set-url origin "$REPO_URL"
fi

echo "[bootstrap] syncing branch: $BRANCH"
git -C "$TARGET_DIR" fetch origin || true
if git -C "$TARGET_DIR" rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  git -C "$TARGET_DIR" checkout "$BRANCH"
else
  git -C "$TARGET_DIR" checkout -b "$BRANCH" || git -C "$TARGET_DIR" checkout "$BRANCH"
fi
git -C "$TARGET_DIR" pull --ff-only origin "$BRANCH" || true

if [[ "$INIT_README" == "true" ]]; then
  if [[ -z "$(find "$TARGET_DIR" -mindepth 1 -maxdepth 1 ! -name .git -print -quit)" ]]; then
    echo "[bootstrap] initializing empty repository with README.md"
    echo "# $APP_NAME" > "$TARGET_DIR/README.md"
    git -C "$TARGET_DIR" add README.md
    git -C "$TARGET_DIR" commit -m "init repo" || true
    git -C "$TARGET_DIR" push -u origin "$BRANCH" || true
  fi
fi

echo
cat <<EOV
[bootstrap] target workspace ready
TARGET_REPO=$REPO_URL
TARGET_DIR=$TARGET_DIR
TARGET_BRANCH=$BRANCH
EOV

if [[ "$WRITE_ENV" == "true" ]]; then
  touch "$ENV_FILE"
  if grep -q '^TARGET_REPO=' "$ENV_FILE"; then
    sed -i "" "s|^TARGET_REPO=.*|TARGET_REPO=$REPO_URL|" "$ENV_FILE" 2>/dev/null || sed -i "s|^TARGET_REPO=.*|TARGET_REPO=$REPO_URL|" "$ENV_FILE"
  else
    echo "TARGET_REPO=$REPO_URL" >> "$ENV_FILE"
  fi

  if grep -q '^TARGET_DIR=' "$ENV_FILE"; then
    sed -i "" "s|^TARGET_DIR=.*|TARGET_DIR=$TARGET_DIR|" "$ENV_FILE" 2>/dev/null || sed -i "s|^TARGET_DIR=.*|TARGET_DIR=$TARGET_DIR|" "$ENV_FILE"
  else
    echo "TARGET_DIR=$TARGET_DIR" >> "$ENV_FILE"
  fi

  if grep -q '^TARGET_BRANCH=' "$ENV_FILE"; then
    sed -i "" "s|^TARGET_BRANCH=.*|TARGET_BRANCH=$BRANCH|" "$ENV_FILE" 2>/dev/null || sed -i "s|^TARGET_BRANCH=.*|TARGET_BRANCH=$BRANCH|" "$ENV_FILE"
  else
    echo "TARGET_BRANCH=$BRANCH" >> "$ENV_FILE"
  fi

  echo
  echo "[bootstrap] env updated: $ENV_FILE"
  grep -E '^TARGET_(REPO|DIR|BRANCH)=' "$ENV_FILE" || true
fi
