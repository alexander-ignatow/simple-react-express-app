#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:-dev}"

if [[ "$MODE" != "dev" && "$MODE" != "prod" ]]; then
  echo "Usage: ./start.sh [dev|prod]" >&2
  exit 1
fi

if [[ -f "$ROOT_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

SERVER_PORT="${SERVER_PORT:-3001}"
CLIENT_PORT="${CLIENT_PORT:-5173}"

if [[ -z "${API_TOKEN:-}" ]]; then
  echo "API_TOKEN is required. Copy .env.example to .env and set API_TOKEN." >&2
  exit 1
fi

ensure_dependencies() {
  local service="$1"

  if [[ ! -d "$ROOT_DIR/$service/node_modules" ]]; then
    echo "Installing $service dependencies..."
    (cd "$ROOT_DIR/$service" && npm ci)
  fi
}

cleanup() {
  trap - EXIT INT TERM
  kill "${SERVER_PID:-}" "${CLIENT_PID:-}" 2>/dev/null || true
  wait "${SERVER_PID:-}" "${CLIENT_PID:-}" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

ensure_dependencies server
ensure_dependencies client

export PORT="$SERVER_PORT"
export API_TOKEN
export VITE_API_URL="http://localhost:$SERVER_PORT"
export VITE_API_TOKEN="$API_TOKEN"

if [[ "$MODE" == "prod" ]]; then
  echo "Building production bundles..."
  (cd "$ROOT_DIR/server" && npm run build)
  (cd "$ROOT_DIR/client" && npm run build)

  export NODE_ENV=production
  export CLIENT_URL="http://localhost:$CLIENT_PORT"
  (cd "$ROOT_DIR/server" && npm start) &
  SERVER_PID=$!
  (cd "$ROOT_DIR/client" && npm run preview -- --host 0.0.0.0 --port "$CLIENT_PORT") &
  CLIENT_PID=$!
else
  export NODE_ENV=development
  (cd "$ROOT_DIR/server" && npm run dev) &
  SERVER_PID=$!
  (cd "$ROOT_DIR/client" && npm run dev -- --host 0.0.0.0 --port "$CLIENT_PORT") &
  CLIENT_PID=$!
fi

echo "Client: http://localhost:$CLIENT_PORT"
echo "Server: http://localhost:$SERVER_PORT"
echo "Press Ctrl+C to stop both services."

wait "$SERVER_PID" "$CLIENT_PID"
