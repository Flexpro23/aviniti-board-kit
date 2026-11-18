---
name: studio
description: Run the full design-system + multi-board workflow for a client project — brief, token palette, design-system board, page inventory, a reference chapter, parallel builder agents, independent audits, final QA and a hub page. Use when the user describes a product and wants its design system and complete boards (anything bigger than a quick single-file board), or says "studio", "design system", "full boards", "all the screens".
---

# Studio — design system + boards from a product description

This runs the engine in `_template/studio/`. `Example-Studio/` (Fernly) is a complete, built example: open its files whenever you are unsure what "good" looks like.

**When to use which path**
- **Quick board** (a sales teaser, 3–12 screens, one file): use a single-file starter from `_template/*-starter.html` as described in CLAUDE.md. Skip this skill.
- **Studio** (a design system, several boards, 20–300 screens, several roles): use this skill.

Every phase ends with a check. Never move on with a failing check. There are two **user gates**, marked ⛔: stop and wait for the user's approval at each.

## Phase 0 — Intake & brief
1. Run the CLAUDE.md intake. Ask only for what the user's description doesn't answer.
2. Scaffold the project: `cp -R _template/studio "<ClientName>"`. It must sit directly in the kit root, next to `_template/` and `qa/`.
3. Fill `<ClientName>/BRIEF.md` (template sections 1–8). Put the product rules (§3) in numbered, testable form: builders and auditors cite them.
4. Create `<ClientName>/PROJECT.md` from `_template/PROJECT.md`. Log every call you made without the user's input under "Assumptions".

## Phase 1 — Design system (board B0)
1. **Palette:** set `Design-System/anchors.mjs`: project name, ramp anchors (primary, accent, neutral, danger, warning, success, info), fonts, optional category colours. If the client sent only a logo, run `/brand-from-logo` first.
2. **Fixture:** in `shared/src/fixture.js`, fill the engine keys: `project`, `now`, `cur`, `currencies`, `MONTHS`/`DAYS`, `people`, `user`, `nav`, `status`, `versions`. Then add the project data the boards will need (names, items, prices, times), all as `{ar, en}`. This is the only source of values for every screen.
3. **Hub entry:** in `Boards/index.json`, set the B0 `name`/`nameAr`/`blurb` and the hub entry.
4. **Design-system board:** tailor `Design-System/src/board.html`. Keep the chapters that apply, rewrite the principles and the voice/glossary from BRIEF.md, and add specimens of the product's own components.
5. **Build:** `sh _tools/build-all.sh`. The build fails on any contrast miss: fix it in `anchors.mjs` (pins or `themeOverrides`), never by editing generated files.
6. **Check:**
   - `node _tools/smoke.mjs Boards/<B0 file>`: 0 errors
   - `node _tools/capture.mjs exports/cap Boards/<B0 file>`, light and `--dark`: 0 layout issues
   - `cd ../qa && npm run qa -- <abs path>`: 8/8, 0 axe
   - `node axe-dark.mjs <abs path>`: 0
   - LOOK at the captures (`python3 _tools/half.py`, then Read) in both languages.
7. ⛔ **Gate 1:** show the user B0 (open the built file) and summarise palette, type and principles. Wait for approval or changes.

## Phase 2 — Page inventory
1. Write `PAGES.md`:
   - the boards: one per role or surface, e.g. B1 customer app, B2 operator console, B3 admin
   - per board, the chapters in the order of a real day
   - per chapter, the narrative (title/lede/lane) and every screen in the exact format: `ID · Name · الاسم · version · device`, then On it / States / Leads to
   - the "Now" moment and the **Canonical facts** block (the numbers and events that appear on more than one screen)
2. Every value in PAGES.md must exist in the fixture. Add whatever is missing to `fixture.js` now, not later.
3. Run `python3 _tools/pages2index.py`, which writes the screens into `Boards/index.json`. Add a board entry for each new board, and create `Boards/src/B<n>.html` by copying `B1.html` and listing that board's chapters and parts.
4. Run `python3 _tools/verify.py`: every `leadsTo` resolves.
5. ⛔ **Gate 2:** show the user the inventory as a table of boards → chapters → screen counts, plus the canonical facts. Wait for approval. This fixes scope, and builders build exactly what's listed.

## Phase 3 — Reference chapter
1. Build the most representative chapter yourself (normally `Boards/src/B1-ch01.jsx`), following `BUILD_SPEC.md`. Model it on `Example-Studio/Boards/src/B1-ch01.jsx`.
2. Fill the `<!-- PROJECT: … -->` blocks in `BUILD_SPEC.md`: language rules, colour rules and product rules from BRIEF.md.
3. Run the full Build & QA loop from BUILD_SPEC.md until clean, and look at every PNG. This chapter sets the quality bar for every builder.

## Phase 4 — Parallel builders
1. **Split:** divide the remaining chapters into parts of about 15–30 screens each. Each part is one file `Boards/src/B<n>-chNN[-MM].jsx`, listed with `/* @inline … */` in its board shell.
2. **Brief each builder:** fill `_tools/BUILDER_PROMPT.md` per part (product, folder, part file, board, chapters, reference chapter).
3. **Spawn:** one Agent per part, in parallel (several Agent calls in one message). Use your strongest model for complex parts.
4. **Recover:** if a builder stops early, spawn a new one with `_tools/FINISHER_PROMPT.md` for that part.
5. **Check each report:** read every report, and rebuild with `sh _tools/build-all.sh`. Run `sh _tools/build-part.sh` on any part that fails, to isolate it. Fold derived values back into the fixture and canonical facts.

## Phase 5 — Independent audits
1. **Spawn auditors:** for each board, spawn a fresh Agent that did not build it, with `AUDIT_SPEC.md` and the board id. Auditors fix and append to `AUDIT.md`.
2. **Add new screens:** add the screens auditors created to PAGES.md, then re-run `pages2index.py` and `verify.py`.
3. **Take decisions to the user:** bring OPEN findings that need a human decision to the user. Don't guess them.

## Phase 6 — Final QA & hand-off
1. Run `sh _tools/build-all.sh && sh _tools/final-qa.sh`, then read `exports/final/*`. Targets:
   - verify exit 0
   - every board 8/8 with 0 axe in light and dark
   - 0 layout issues
   - The hub's `zoom_controls` failure is expected: the hub has no canvas.
2. **Update PROJECT.md:** flows, screen inventory, decisions, changelog, version.
3. **Share:** the hub `Boards/index.html` links every board, so deploy the `Boards/` folder to any static host if the user wants a URL.
4. **Report to the user:** the boards with screen counts, the QA summary, the OPEN decisions, and what was assumed.

## Rules that never bend
- **Edit sources only:** `anchors.mjs`, `fixture.js`, `Boards/src/*`, `Design-System/src/*`, `shared/src/*`. Never edit built files or `Design-System/tokens.*`.
- **Fixture first:** a screen never invents a value. Add it to `fixture.js`, then use it.
- **Shared code:** changes to `shared/src/*` happen only between builder waves, never while builders run, and must stay backward compatible.
- **Bilingual:** every frame renders in Arabic RTL and English LTR, with logical properties everywhere.
- **Brand:** client names stay in the client folder, never in `_template/`.
