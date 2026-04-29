#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

if [ ! -x ".venv/bin/python" ]; then
  echo "Ambiente virtuale non trovato. Esegui prima: bash scripts/setup_dev.sh"
  exit 1
fi

.venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
