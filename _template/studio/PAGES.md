# <Product> — page inventory

Source of truth for what every board contains. Builders build exactly this; anything missing is logged, not invented.
Run `python3 _tools/pages2index.py` after any change here: it rewrites the screens in `Boards/index.json`.

Format per screen: `ID · Name (EN) · الاسم (AR) · version · device` then:
- **On it**: what the screen shows.
- **States**: each one is rendered as a StateRow, in both languages.
- **Leads to**: becomes the ScreenFrame's `leadsTo`.

Notation:
- `[P]` means the wide screen also gets a phone frame, with the id suffix `p` (e.g. `1.2p`).
- Cross-board links use `B1:` / `B2:`.
- Devices: `desktop` (browser 1440×900), `tablet` (1194×834), `phone` (390×844).

Versions: **v1** = launch. **v2** = <phase two>. Every frame carries its version.

"Now" for every live screen: <weekday dd/mm/yyyy, hh:mm, who is using it, where>. Use fixture data only (`FX`).

Canonical facts (reconcile every board to these):
- <the handful of numbers, people, times and events that appear on more than one screen or board — totals, order numbers, who did what when>

## B1 · <Board name> — <device(s)>

### Ch1 · <Chapter name> — <اسم الفصل>
- narrative: title "<a decision, one sentence>" · lede "<the user's story in one sentence>" · lane "<why the chapter is structured this way>"
- **1.1 · <Name> · <الاسم> · v1 · phone** — On it: … States: … Leads to: 1.2.
- **1.2 · <Name> · <الاسم> · v1 · desktop [P]** — On it: … Phone: … States: … Leads to: 1.3.

See `Example-Studio/PAGES.md` in the kit for a complete, built example.
