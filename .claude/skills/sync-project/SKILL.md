---
name: sync-project
description: Reconcile a client's PROJECT.md frontmatter with the JS PROJECT block inside their *_UI_Board.html files. Detects drift, extracts newly-added flows/screens, proposes an updated PROJECT.md. Use inside this board kit (see CLAUDE.md).
---

# Sync Project

## When to use
- Right before committing a client board iteration (ensures PROJECT.md is current)
- After adding a flow or screen to a board
- When starting work on an existing client and you want fresh context
- When the user asks "what's the status of <ClientName>?" (run this, then summarize)

## How it works

### Inputs
- Client folder name (e.g. "AcmeLogistics") — ask user if not given
- Path is `<repo root>/<ClientName>/`

### Steps
1. Read `<ClientName>/PROJECT.md` — parse YAML frontmatter + all section headers
2. Read every `<ClientName>/*_UI_Board.html` — extract:
   - JS `const PROJECT = {…}` block → name, nameAr, persona, version, rtl, mapCenter, mapZoom
   - JS `const C = {…}` block → primary, bg, card tokens (infer theme)
   - All `<PF label="…" sub="…">`, `<DF …>`, `<TF …>`, `<WF …>` → screens (EN + AR labels)
   - All `<FS title="…" sub="…">` and `<ChapterBand …>` → flows
3. Compare and report drift:
   - PROJECT.md frontmatter vs. HTML PROJECT block → field-level diff
   - PROJECT.md Flows section vs. HTML flows → new/missing flows
   - PROJECT.md Screens Inventory vs. HTML frames → new/missing screens
4. Propose an updated PROJECT.md with:
   - Frontmatter reconciled (PROJECT.md wins for config fields; HTML wins if PROJECT.md is obviously stale based on mtime)
   - New flows appended under the correct persona
   - New screens added to inventory table with state `✅ built`
   - A fresh changelog entry for the current version bump, summarizing detected changes

### Output
- A diff showing what would change
- The fully updated PROJECT.md (ready to write after user confirms)
- A short summary: "N new flows, M new screens, K frontmatter fields differ"

## Rules
- **PROJECT.md frontmatter wins** for config (theme, palette, stakeholders, deploy URL) — if HTML has a stale mapCenter, update HTML, not .md
- **HTML wins** for structure (flows, screens) — if the user added S7 in HTML, propagate to .md inventory
- **Always preserve** manual prose in PROJECT.md Design Decisions, Assumptions, Client Vocabulary — these are human-written and must not be overwritten by this skill
- **Never silently write** — always propose changes and ask user to confirm before writing
- **Append to changelog** — don't replace existing entries

## Edge cases
- No PROJECT.md exists: offer to generate from `_template/PROJECT.md` + the HTML
- No HTML boards exist (scoping status): skip HTML parse, just validate frontmatter freshness
- Multiple versions across boards (Driver v1.2, Admin v1.0): list per-board versions; suggest unified bump

## Related
- `_template/PROJECT.md` — the canonical template
- `/brand-from-logo` — for new client setup
- `CLAUDE.md` → "Project Context File" section has the rule reference
