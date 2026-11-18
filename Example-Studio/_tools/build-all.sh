#!/bin/sh
# Usage: sh _tools/build-all.sh — builds every board listed in Boards/index.json (src → Boards/<file>) and the hub.
set -e
cd "$(dirname "$0")/.."
python3 _tools/_index.py builds | while read -r src out; do sh shared/build.sh "$src" "$out"; done
