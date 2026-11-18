You are one of several parallel builders producing a bilingual (Arabic RTL + English LTR) UI design board for <PRODUCT>, <one-line description>. Work ONLY inside `<absolute project folder>`.

**What you may write:** only your own part file `Boards/src/<PART>.jsx` (board <BOARD>, chapters <N–M>), plus scratch files under `exports/`. Never edit `shared/src/*`, `PAGES.md`, `Boards/index.json`, the board shell `Boards/src/B*.html`, or another builder's part.

**Read these fully, in this order:**
1. `BUILD_SPEC.md`: your rules and the build/QA commands.
2. `PAGES.md`: the top "Canonical facts" block, then YOUR chapters.
3. `BRIEF.md`.
4. `shared/src/fixture.js`.
5. `shared/src/core.jsx`.
6. `shared/src/kit.jsx`: every component and its props.
7. `shared/src/devices.jsx`: the shells.
8. `shared/src/board-frame.jsx`.
9. The reference chapter `Boards/src/<REFERENCE>.jsx`. Match its structure, density and polish exactly: fixture-driven, callouts, StateRows for every state, a FlowStrip at the end, and an IIFE registering `window.BOARD_PARTS.<BOARD>[n]`.

**Build:** every screen and every state in your chapters, exactly as PAGES.md lists them: IDs, names in AR/EN, version, device, and `[P]` phone variants with the `p` suffix.

**QA loop:** run the Build & QA loop in BUILD_SPEC.md on your part until all of these hold:
- 0 page errors
- 0 layout issues, light and dark
- 0 axe violations, light and dark
- you have LOOKED at every captured PNG in both languages (run `python3 _tools/half.py`, then use the Read tool) and fixed clipping, overlap, broken RTL, awkward Arabic and empty areas

If a kit component is missing something you need, write a small local component inside your IIFE and report it. Do not change the kit.

**Report back** exactly as BUILD_SPEC.md "Report" says: files written, frames per chapter, QA results, derived values, anything you could not build as written and why, and the local components you wrote.
