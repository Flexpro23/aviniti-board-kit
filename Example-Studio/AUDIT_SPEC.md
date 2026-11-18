# Independent board audit spec

You did NOT build this board. Audit it adversarially against `PAGES.md`, `BRIEF.md` and the design system, then FIX what you find.
- Edit the board's part files in `Boards/src/`, never the built output.
- Don't edit `shared/src/*` unless the defect is in a shared component. If it is, keep the change backward compatible and note it.
- Rebuild with `sh shared/build.sh <src> Boards/<file>` (or `sh _tools/build-all.sh`).

Sources:
- `BUILD_SPEC.md` (rules)
- `PAGES.md` (your board's section and the canonical facts)
- `BRIEF.md`
- `shared/src/fixture.js`
- `Boards/index.json`
- `Design-System/src/board.html`
- `AUDIT.md` (prior findings, if any)

## Check
1. **Coverage:**
   - every screen ID in the board's PAGES.md section is present, including `p` phone variants
   - every "States" item is rendered as a StateRow
   - every "Leads to" target exists
   - chapter narratives match PAGES.md verbatim
   - ChapterBand screen counts are right
   - every chapter ends with a FlowStrip
2. **Missing pages:** walk each role's real day through the board: open → work → exceptions → close. List every moment where the user would need a screen the board doesn't have: a dead-end button, a tab with no destination, an error with no recovery, a state the brief implies.
   - Build the missing screens that are clearly needed. Give them new IDs continuing the chapter numbering (e.g. 3.14), and list them in your report so PAGES.md and index.json can be updated.
   - Do not invent features outside the brief.
3. **Product rules:** every rule in BRIEF.md and in BUILD_SPEC "Product rules" holds on every screen, including role visibility, permissions, money and privacy.
4. **Data:** every name, number, time, price and count agrees with `fixture.js`, the PAGES.md canonical facts and the other boards' telling of the same moment. The arithmetic on every screen adds up.
5. **Language:** every screen is in both languages. The Arabic is natural, not literal translation, with correct number/currency/% order. Nothing is in English inside the Arabic frame, or vice versa.
6. **Visual quality at 100 %:**
   - Run `node _tools/capture.mjs exports/audit-<B> Boards/<file> --states`, then again with `--dark`.
   - LOOK at every PNG in both languages. Look for:
     - clipping, overlap, cut text or misalignment
     - empty areas, or parts that look like wireframes
     - callout badges covering important text (check the Arabic frame too)
     - inconsistent spacing
     - anything less polished than the reference chapter
7. **QA:**
   - `cd <kit>/qa && npm run qa -- <abs path to Boards/<file>>`: 8/8 PASS, 0 axe violations.
   - `node axe-dark.mjs <abs path>`: 0 violations.
   - `_tools/capture.mjs` reports 0 errors and 0 layout issues in both themes.

## Output
- **AUDIT.md:** append `## <B> — independent audit`. List each finding as FIXED (what changed, where) or OPEN (only if it needs a human decision).
- **Report back:**
  - counts of fixed and open findings
  - the OPEN list
  - the screens you added (ID · EN name · AR name · version · device · one-line content), so the lead can update PAGES.md and index.json
