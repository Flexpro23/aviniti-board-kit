# Builder spec — applies to every chapter part of every board

Fill the three `<!-- PROJECT: … -->` blocks when you scaffold the project, then hand this file to every builder unchanged.

## Read first
1. `PAGES.md`: your chapters. Build **exactly** the screens listed (IDs, names, version, device, "On it", "States", "Leads to"). `[P]` means also build the phone version with id `<id>p`. Build nothing unlisted. If something is missing or contradictory, log it in your report, not in PAGES.md.
2. `BRIEF.md`: the product, its roles, its rules and its glossary.
3. `shared/src/fixture.js` (`FX`): the ONLY source of names, prices, numbers, times and statuses. "Now" = `FX.now`. Never invent a conflicting value. If you need a value the fixture lacks, derive it plausibly and consistently from fixture values and list it in your report.
4. `shared/src/core.jsx`, `kit.jsx`, `devices.jsx`, `board-frame.jsx`: every component you may use. Read them fully before writing a screen.
5. `Design-System/src/board.html`: the design-system board. Match its quality.
6. The reference chapter named in your task (normally `Boards/src/B1-ch01.jsx`): the model for file structure, density and polish.

## File structure (mandatory)
Your part file is `Boards/src/<part>.jsx` (the name is given in your task). It is inlined into one Babel script together with other builders' parts, so **wrap everything in an IIFE** and register only chapter components:

```jsx
(() => {
  const S31 = () => { const { $, tr } = useL(); const C = useC(); return <PhoneApp title={$('…', '…')} active="orders">…</PhoneApp>; };
  // …
  const Ch3 = () => <ChapterBand num={3} name="Orders" nameAr="الطلبات" screens={6} layout="phone"
      title="…" lede="…" lane="…">   {/* title/lede/lane verbatim from PAGES.md */}
    <ScreenFrame id="3.1" name="Orders" nameAr="الطلبات" device="phone" v="v1" leadsTo={['3.2']} callouts={[…]}><S31 /></ScreenFrame>
    <StateRow of="3.1" device="phone" items={[{ label: 'Empty', el: <S31 empty /> }]} />
    …
    <FlowStrip name="Orders" steps={['3.1 Orders', '3.2 Order detail']} />
  </ChapterBand>;
  window.BOARD_PARTS.B1 = { ...(window.BOARD_PARTS.B1 || {}), 3: Ch3 };
})();
```

- Use `layout="phone"` when the chapter is mostly phone frames (they wrap three per row). Use `layout="desktop"` or `layout="tablet"` for wide frames, which stack vertically, with any phone variant in its own row after its wide frame.
- End every chapter with one or more `<FlowStrip>`. Steps are written as "ID Name".
- Render state variants with `<StateRow of="<id>" device=… items={[{label, el}]}>`, placed right after the screen. Never use a second ScreenFrame with the same id.
- Give the main state of each screen that has interaction worth explaining 2–4 `callouts` (`{x:'%', y:'%', text}`), positioned on the **English** frame. The Arabic frame mirrors them to 100 − x; add `xAr`/`yAr` when the mirrored spot lands on text. Each callout says what a tap does and what changes. Use them on the important screens, not everywhere.
- `leadsTo`: write `'3.2'` for the same board and `'B2:3.2'` for another board. Every target must exist in `Boards/index.json`.
- Each screen renders twice, so screens must contain no `id` attributes, no `<h1>`–`<h6>` (use `<Tx>`), and no `<nav>`/`<main>`.

## Screen rules
- **Shells:** `PhoneApp` (tabs from `FX.nav.phone` or the `tabs` prop), `DesktopApp` (sidebar from `FX.nav.desktop` or the `sidebar` prop) and `TabletApp` (the `rail` prop). Full-bleed screens use `PhoneBlank` / `DesktopBlank`. Overlays use `Dialog`, `SidePanel`, `Sheet` (phone) and `Toast`.
- **Text:** all text goes through `$('عربي', 'English')` or `tr(fixtureObj)`. Write natural Arabic, not word-for-word translation.
  <!-- PROJECT: language rules — e.g. form of address (masculine / feminine / plural), MSA vs dialect, where dialect is allowed -->
- **Formats:**
  - Money: `<Money v=…/>`.
  - Phones, codes and references: `<Num>` / `<Phone>`.
  - Times: `<Time t=…/>` or `time()`.
  - Dates: `date()` / `dt()` / `dmy()`. Arabic month names come from `FX.MONTHS`.
- **Colour:** tokens only, never hex literals in screens. Use `tone=` on Pill/Banner/StatusPill (`alert`, `warn`, `success`, `info`, `neutral`, `primary`).
  <!-- PROJECT: colour rules — e.g. what red is reserved for, where the accent is allowed -->
- **Layout:** logical properties only (`paddingInlineStart`, `marginInlineEnd`, `insetInlineStart`, `textAlign: 'start'`). Never use `left`/`right` to place content. Grids and flex mirror automatically.
- **Fit:** content must fit the frame: phone 390 × 844, tablet 1194 × 834, desktop 1440 × 900. Bodies don't scroll in a mockup, so choose what's visible and show a natural cut at the bottom of long lists. A last row partly visible is fine; text overflowing a box is not. Check both languages, because Arabic strings are often longer.
- **Density:** real product UI with fixture data. Never wireframes, never lorem, never empty grey boxes. Give one element per chapter 120 % polish.
- **Product rules:**
  <!-- PROJECT: role rules — e.g. what each role may and may not see, money/permission rules, privacy rules -->
- **Missing components:** if you need a generic component that isn't in the kit, write it inside your IIFE and mention it in your report. Do NOT edit `shared/src/*`, because other builders depend on it.

## Build & QA (your part only)
Run from the project folder:
```
sh _tools/build-part.sh B1 B1-ch03.jsx                             # → exports/preview/B1-ch03.html
node _tools/smoke.mjs exports/preview/B1-ch03.html                  # page errors, frame count
node _tools/capture.mjs exports/cap exports/preview/B1-ch03.html    # 100 % PNG per screen + layout issues
node _tools/capture.mjs exports/cap exports/preview/B1-ch03.html --dark --only=3.1,3.4
python3 _tools/half.py exports/cap/B1-ch03/<file>.png               # readable crops, then LOOK with the Read tool
(cd ../qa && node axe-audit.mjs <abs path to preview> && node axe-dark.mjs <abs path to preview>)
```
(`../qa` is the kit's `qa/` folder; `python3 _tools/_index.py kit` prints the kit root if your project sits deeper.)

Done means all of these:
- 0 page errors
- 0 layout issues reported by `capture.mjs`
- 0 axe violations, light and dark
- every screen and state in your PAGES.md chapters is present
- you have LOOKED at every captured PNG in both languages and fixed clipping, overlap, broken RTL, awkward Arabic and empty areas

## Report
- files written
- frames built per chapter
- QA results
- values you had to derive
- anything in PAGES.md you could not build as written, and why
- any generic component you had to write locally
