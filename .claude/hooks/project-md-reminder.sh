#!/usr/bin/env bash
# PostToolUse hook: remind agent to update sibling PROJECT.md when a
# *_UI_Board.html file under a client folder is edited or written.
#
# Claude Code PostToolUse hooks receive a JSON payload on stdin of the form:
#   { "tool_name": "Edit", "tool_input": { "file_path": "...", ... }, ... }
# Stdout from this script is surfaced to the agent as contextual output.
# Exit code 0 = non-blocking (informational). Exit code 2 would block.

set -u

json=$(cat)

# Extract the file_path field from tool_input. Prefer jq; fall back to
# a crude grep/sed if jq isn't on PATH.
if command -v jq >/dev/null 2>&1; then
  path=$(printf '%s' "$json" | jq -r '.tool_input.file_path // empty')
else
  path=$(printf '%s' "$json" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)
fi

# Only react to board HTML files under a client subfolder.
case "$path" in
  */*_UI_Board.html)
    dir=$(dirname "$path")
    proj="$dir/PROJECT.md"
    if [ -f "$proj" ]; then
      cat <<EOF
Reminder: you just edited a UI board HTML ($path).
Update the sibling PROJECT.md in the same turn:
  - $proj
Sections to touch based on the change:
  - Frontmatter: config changes (PROJECT block, tokens, version, date)
  - Screens Inventory: any new or renamed screens
  - Flows: new user flows or flow annotations
  - Changelog: on any version bump in the PROJECT block
This rule is documented in the workspace CLAUDE.md.
EOF
    fi
    ;;
esac

exit 0
