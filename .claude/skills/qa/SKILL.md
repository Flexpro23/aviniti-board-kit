# QA Agent — Full Project Audit

Autonomous QA workflow. Learns project context, runs parallel specialist agents, produces a prioritized bug report and fix plan.

---

## Phase 1 — Context Discovery (do this first, always)

Before spawning any agents, read the project to understand its shape:

1. Detect project type by checking for:
   - `pubspec.yaml` → Flutter app
   - `package.json` with `next` → Next.js web app
   - `firebase.json` → Firebase project
   - Multiple of the above → monorepo / full-stack
2. Read `CLAUDE.md` if present (project-level instructions)
3. Read `pubspec.yaml` or `package.json` for version, dependencies, known issues
4. Read the top-level directory structure to understand feature areas
5. Check for any existing `QA_REPORT.md` or `FIX_PLAN.md` — if found, this is a re-run; note what was previously flagged

Store this context. Pass it explicitly to every sub-agent below.

---

## Phase 1b — MCP Auto-Setup

Check each MCP tool. If missing, install it automatically. Do not ask the user — just run the commands.

### Flutter/Dart MCP
```bash
dart pub global list 2>/dev/null | grep dart_mcp_server
```
- If **not found**: run `dart pub global activate dart_mcp_server`, then:
  `claude mcp add dart --scope project -- dart pub global run dart_mcp_server`
- If **found but not in project MCP list**: run:
  `claude mcp add dart --scope project -- dart pub global run dart_mcp_server`
- `--scope project` is critical — this registers the MCP only for the current project directory, not globally. It will not appear or consume context in any other project.
- Set flag: `DART_MCP_READY=true/false` (true only if it was already running before this session — newly installed requires restart)

### Playwright MCP
```bash
npx --yes @playwright/mcp@latest --version 2>/dev/null
```
- If **not found or errors**: run `npm install -g @playwright/mcp@latest`, then:
  `claude mcp add playwright --scope project -- npx @playwright/mcp@latest`
- `--scope project` only — never register globally.
- Set flag: `PLAYWRIGHT_MCP_READY=true/false`

### Mobile MCP (Drengr) — skip auto-install, requires physical device
- Try `mcp__mobile__screenshot` — set `MOBILE_MCP_READY=true` if it responds, false otherwise

### After auto-install
- If any MCP was **newly installed** this session (not previously running): note at top of QA_REPORT.md:
  > "Dart MCP / Playwright MCP was installed during this run. For live test execution and browser testing, restart Claude Code and re-run `/qa` to activate them. This run used static analysis only for those agents."
- Proceed immediately — do not wait for the user. Use whatever is currently available.

---

## Phase 2 — Parallel Specialist Agents

Spawn ALL applicable agents in parallel using the Task tool. Pass the context from Phase 1 to each.

---

### Agent A — Static Analysis & Build Health

**For Flutter projects:**
- Run `xattr -cr .` first (iCloud attribute stripping)
- Run `dart analyze --no-fatal-infos` and collect ALL warnings and errors
- Attempt `flutter build apk --debug` (fastest build check) — capture any compilation errors
- Check `pubspec.yaml` for dependency version conflicts
- Check that `GoogleService-Info.plist` (iOS) and `google-services.json` (Android) exist
- List any TODO/FIXME comments in Dart files under `/lib`

**For Next.js projects:**
- Run `npx tsc --noEmit` and collect all type errors
- Run `next build` and capture errors
- Check for missing environment variables (compare `.env.example` vs `.env.local`)

**Output:** List of errors/warnings with file:line references, severity (P0=build-breaking, P1=runtime risk, P2=warning)

---

### Agent B — Bilingual & RTL Audit

*(Run this for ALL projects — user always has AR/EN requirements)*

- Scan all Dart/TSX/HTML files for hardcoded Arabic or English strings that are NOT in a localization file
- Check localization files (`.arb`, `intl_*.dart`, or i18n JSON) — find any keys present in English but missing in Arabic, or vice versa
- Check any RTL layout widgets: look for `Row` without `TextDirection` awareness, hardcoded `left`/`right` padding that should be `start`/`end`
- For web: check for `dir="rtl"` on root, CSS `text-align: left` that should be `start`
- Flag any date/number formats not using locale-aware formatting

**Output:** Table of missing translations, hardcoded strings with file:line, RTL layout issues

---

### Agent C — Firebase & API Integrity

- Read all Firebase calls (Firestore reads/writes, Auth, Storage, Functions)
- Check every async Firebase call: does it have `await`? Does it have error handling (`try/catch` or `.catchError`)?
- Look for fire-and-forget patterns (fetch/axios calls without `await`, unawaited Futures in Dart)
- Check Firestore security rules if `firestore.rules` exists — flag any `allow read, write: if true`
- Check for API tokens or secrets hardcoded in source files (not in `.env`)
- For Flutter: check if Firebase is initialized before `runApp()`

**Output:** List of unhandled async calls, missing error handling, security rule gaps, hardcoded secrets

---

### Agent D — UI & Screen Completeness (Flutter)

*(Skip if not a Flutter project)*

- List all screens/pages under `lib/screens/` or `lib/features/`
- For each screen, check:
  - Does it handle loading state?
  - Does it handle empty state?
  - Does it handle error state?
  - Are there any `print()` statements left (should be removed for release)?
  - Are there any placeholder `// TODO` or `Container()` widgets?
- Check navigation: are all routes in the router actually implemented?
- Check image assets: does every asset referenced in code exist in `assets/`?

**Output:** Screen-by-screen checklist, missing states, dead routes, missing assets

---

### Agent F — Live Browser Test *(only if Playwright MCP is available)*

- Navigate to the running web app (ask user for URL if not in CLAUDE.md or `.env`)
- Walk through these flows and screenshot each:
  1. Homepage / landing
  2. Auth flow (login/signup)
  3. Main dashboard or primary feature
  4. Arabic/RTL mode — switch language and screenshot same screens
- Flag: broken layouts, missing text, console errors, RTL rendering issues
- Flag: any screen that takes >3s to load

**Output:** Screenshots with annotations, list of visual bugs

---

### Agent G — Device UI Test *(only if Drengr/Mobile MCP is available)*

- Take a screenshot of the currently running app on the connected device
- Navigate through key screens by tapping
- Check: text overflow, missing images, broken navigation, AR/EN switching
- Compare UI against any design spec files in `/docs/` or `/design/`

**Output:** Device screenshots, list of UI discrepancies

---

### Agent E — Performance & Code Smell

- Find `setState` calls that rebuild large widget trees unnecessarily
- Find N+1 Firestore query patterns (queries inside loops or `ListView.builder`)
- Find large files (>500 lines) that are doing too much
- Find duplicate code blocks (same logic copy-pasted in 3+ places)
- For Next.js: find missing `loading.tsx` / `error.tsx` route files, missing `Suspense` boundaries

**Output:** Performance risks with file:line, refactor candidates

---

## Phase 3 — Consolidation

After ALL agents complete, consolidate their findings:

1. De-duplicate overlapping findings
2. Assign final priority:
   - **P0 — Critical**: build-breaking, data loss risk, security holes, production crashes
   - **P1 — High**: broken features, missing error handling on user-facing flows, missing translations in main screens
   - **P2 — Medium**: code smells, incomplete states, minor RTL issues
   - **P3 — Low**: TODOs, print statements, style issues
3. Count totals per priority

---

## Phase 4 — Output Files

Write two files to the project root:

### `QA_REPORT.md`
```
# QA Report — [Project Name]
Generated: [date]

## Summary
| Priority | Count |
|----------|-------|
| P0 Critical | X |
| P1 High | X |
| P2 Medium | X |
| P3 Low | X |

## P0 — Critical Issues
[Each issue: description, file:line, reproduction steps if applicable]

## P1 — High Priority
...

## P2 — Medium
...

## P3 — Low
...
```

### `FIX_PLAN.md`
```
# Fix Plan — [Project Name]

## Immediate (fix before next build)
- [ ] [Issue]: [file:line] — [one-line fix description]

## This Sprint
- [ ] ...

## Backlog
- [ ] ...
```

---

## Execution Note

Do not ask for clarification before starting. Run Phase 1 immediately, then spawn all applicable Phase 2 agents in parallel. Only report back when both output files are written.
