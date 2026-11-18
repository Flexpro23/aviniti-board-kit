# QA Quick Check

Fast single-pass audit — use this mid-session or before a build/deploy.
For the full deep audit, use `/qa`.

## Run in parallel:

1. `dart analyze --no-fatal-infos 2>&1 | head -40` (if Flutter project)
2. `npx tsc --noEmit 2>&1 | head -40` (if Next.js project)
3. Grep for: `print(`, `TODO`, `FIXME`, `hardcoded`, `allow read, write: if true`, fire-and-forget fetch patterns
4. Check for any file modified in the last session that is missing error handling

## Output

Print a compact list directly in the chat — no files written. Format:
```
ERRORS (build-breaking): X
  - file:line — description

WARNINGS (runtime risk): X
  - file:line — description

NOTES: X
  - file:line — description
```

If zero issues found, say so clearly.
