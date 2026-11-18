# Aviniti UI Board QA

Automated QA for Aviniti's self-contained UI proposal boards. Replaces the manual
"click around and check the console" loop documented in `CLAUDE.md` → *Step 8 — Playwright QA*.

## What it does

Given a path to a board HTML file, the tooling will:

1. Launch headless Chromium via **Playwright**
2. Watch for console errors / page errors
3. Exercise the zoom controls (−, +, Fit)
4. Assert every screen has bilingual (EN + AR) labels
5. Verify Leaflet map tiles actually load (not grey placeholders)
6. Scan for leftover `TODO` text at default zoom
7. Confirm the Aviniti brand bar is present
8. Confirm the Arabic font (IBM Plex Sans Arabic) is loaded
9. Click the dark/light toggle and verify the background flips
10. Screenshot the full canvas at zoom 0.35 + each phone frame at zoom 1.0
11. Inject **axe-core** and run a WCAG 2 A/AA + best-practice audit
12. Emit a single `QA_report.md` plus per-screen screenshots under `QA_screenshots/<timestamp>/`

## One-time install

```
cd qa
npm install
```

This pulls down Playwright + axe-core. Playwright will also download the Chromium
browser binary on first install (`npx playwright install chromium` if it didn't).

## Usage

From inside `qa/`:

```
npm run qa -- ../Example/Example_UI_Board.html
```

That runs the full pipeline (Playwright checks → axe audit → merged report).

Run either phase individually:

```
npm run pw  -- ../Example/Example_UI_Board.html
npm run axe -- ../Example/Example_UI_Board.html
```

## Output layout

```
qa/
└── QA_screenshots/
    └── 2026-04-17T12-33-07-415Z/
        ├── board.png              ← full canvas @ zoom 0.35
        ├── screen-01.png          ← phone frame detail @ zoom 1.0
        ├── screen-02.png
        ├── ...
        ├── playwright-report.json ← raw checklist results
        ├── axe-violations.json    ← raw axe findings
        ├── axe-summary.md         ← grouped violations table
        └── QA_report.md           ← the one you share
```

## Exit codes

| Runner           | Meaning                                         |
|------------------|-------------------------------------------------|
| `0`              | All checks passed, no critical/serious a11y hits|
| `1`              | A Playwright check failed or a critical a11y violation was found |
| `2`              | Only serious a11y violations (no critical)      |

## Notes

- Boards are loaded via `file://` — no web server needed.
- Scripts target macOS (user's platform) but are pure Node / no shell assumptions.
- axe-core is preferred from `node_modules/axe-core/axe.min.js`; falls back to CDN
  (`https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js`) if missing.
- If the target HTML file doesn't exist, the scripts exit early with a clear message.

## Reference

See `CLAUDE.md` at the workspace root for the full board pipeline and design tokens.
