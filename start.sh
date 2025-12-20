#!/usr/bin/env bash
set -e

# Always run relative to repo root
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "▶ Starting Docker services..."
docker compose up -d

FRONTEND_DIR="packages/frontend"
CERT_DIR="$FRONTEND_DIR/certs"

echo "▶ Setting up frontend..."
cd "$FRONTEND_DIR"

# Install dependencies if missing
if [ ! -d "node_modules" ]; then
  echo "▶ Installing frontend dependencies..."
  npm install
fi

# Setup mkcert certs once
if [ ! -f "$CERT_DIR/localhost.pem" ]; then
  echo "▶ Creating local HTTPS certificates..."
  mkdir -p certs

  if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert is not installed. Install it first."
    exit 1
  fi

  mkcert --install
  mkcert -cert-file certs/localhost.pem -key-file certs/localhost-key.pem localhost
else
  echo "▶ HTTPS certificates already exist, skipping"
fi

echo "▶ Starting frontend dev server..."
npm run dev
