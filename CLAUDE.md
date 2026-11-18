# CLAUDE.md — Aviniti Board Kit

This repo is a kit for producing **high-quality, self-contained interactive UI mockup boards** for client proposals and design reviews — rapidly, consistently, and at premium quality.

Every board: one HTML file, opens in any browser, no build step, no dependencies to install.

Client work lives in one folder per client at the repo root (`ClientName/`). Those folders are yours — keep them out of any public fork (see `.gitignore`).

---

## Pipeline Overview

Every new board follows this sequence end-to-end:

```
0.   INTAKE           → Pre-fill the intake questionnaire from your client notes → ask only for gaps
0.3  BRAND FROM LOGO  → If the client sent only a logo, run /brand-from-logo
0.5  THEME IDEATION   → (optional) Generate 3 theme concepts for a new aesthetic
1.   CREATE PROJECT.md → Copy _template/PROJECT.md → ClientName/PROJECT.md and fill
2.5  REFERENCE SCRAPE → (optional) Pull 3-5 reference apps into ClientName/REFERENCES.md
2.8  NARRATIVE PASS   → Write title / lede / lane for every chapter — before building screens
3.   BUILD BOARD      → Duplicate starter, configure tokens, build screens inside ChapterBand
4.   UPDATE PROJECT.md → Log flows, screens, decisions as they're built
5.   AUTOMATED QA     → Run qa/ pipeline (Playwright + axe-core + screenshots)
6.   VERSION          → Commit HTML + PROJECT.md
7.   DEPLOY           → (optional) Push to a static host → paste URL into PROJECT.md → share with client
```

**Step 2.8 — Narrative Pass is non-negotiable.** Writing the `title/lede/lane` per chapter before building screens prevents the most common failure mode: boards that look polished but don't tell a story. Clients read the title first, the lede second, and only then look at the screens. If the title is weak, the screens don't matter.

---

## Folder Structure

```
aviniti-board-kit/
├── CLAUDE.md                          ← this file
├── README.md                          ← setup for humans
├── NBG-logo.png                       ← Aviniti logo (source; also embedded as base64 in starters)
├── skills-lock.json                   ← optional third-party skills (install separately, see README)
│
├── _template/                         ← starting points for every new board
│   ├── design-tokens.js               ← full design system reference (all theme presets + components)
│   ├── mobile-board-starter.html      ← phone-frame board
│   ├── dashboard-board-starter.html   ← desktop browser-frame board
│   ├── tablet-board-starter.html      ← iPad Pro 11" frame
│   ├── watch-board-starter.html       ← Apple Watch Ultra frame
│   ├── PROJECT.md                     ← per-client context file template
│   ├── REFERENCE_SCRAPER.md           ← pattern for pulling reference-app inspiration
│   └── _aviniti-logo-base64.txt       ← base64 data URI of NBG-logo.png (embedded in each starter)
│
├── qa/                                ← automated QA tooling (Playwright + axe-core)
│   ├── README.md                      ← install + usage
│   ├── package.json
│   ├── playwright-qa.mjs              ← 9 automated checks + screenshots
│   ├── axe-audit.mjs                  ← a11y audit, WCAG AA + best-practice
│   └── run-qa.mjs                     ← chains both → unified QA_report.md
│
├── .claude/
│   ├── settings.json                  ← registers the PROJECT.md reminder hook
│   ├── hooks/project-md-reminder.sh   ← nudges Claude to update PROJECT.md after board edits
│   └── skills/                        ← brand-from-logo, sync-project, qa, qa-quick
│
└── ClientName/                        ← one folder per client (you create these)
    ├── PROJECT.md
    └── ClientName_Persona_UI_Board.html
```

---

## Tools & Skills

### Skills bundled in this repo (invoke with `/skill-name`)
| Skill | Purpose |
|---|---|
| **/brand-from-logo** | Extract palette, mood, and ready-to-paste C block from a client logo image |
| **/sync-project** | Reconcile a client's PROJECT.md with the PROJECT block inside their board HTML |
| **/qa** + **/qa-quick** | Full or fast code audits (geared to Flutter / Next.js app repos, not boards — use `qa/` for boards) |

### Optional skills (install separately — see README and `skills-lock.json`)
| Skill | Purpose |
|---|---|
| **/accessibility** | WCAG 2.2 audit, ARIA patterns, RTL a11y, keyboard nav — fix guidance on top of the axe-core pipeline |
| **/performance** | Core Web Vitals budgets, CDN loading strategy, font/image/JS optimization |
| **/huashu-design** | Design Direction Advisor (3 philosophy-grounded concepts when a brief is vague), anti-AI-slop critique. Personal-use license — install it yourself |
| **/stitch-design** | Generate 3 theme concepts in Google Stitch for a new aesthetic (needs the Stitch MCP) |

### Optional MCPs
| MCP | Purpose |
|---|---|
| **Playwright** | Ad-hoc screenshots / PDF export (routine QA runs through the `qa/` scripts) |
| **GitHub** | Version boards per client |
| **Vercel** (or any static host) | Deploy boards as live URLs for client sharing |
| **Notion / your CRM** | Read client data to pre-fill intake |
| **Figma** | Import brand assets if the client provides a Figma file |

### Local Helpers (live in every starter)
- **`FONT`, `FONT_AR`, `FONT_MX`** — Latin / Arabic / Mixed font stacks (Inter + IBM Plex Sans Arabic + Cairo + Tajawal)
- **`MONO`** — `'ui-monospace', 'SF Mono', 'Fira Code', monospace` — for board footers and code labels
- **`img(seed, w, h)` / `unsplash(id, w, h)`** — realistic imagery without assets
- **`SEED`** — inline MENA seed data (AR/EN names, Amman/Riyadh/Dubai addresses, JOD/SAR/AED amounts, JO phone formatter)
- **`AVINITI_LOGO`** — full base64 brand logo (watermark + inline title usage)
- **`<dotlottie-player>`** — CDN-loaded, drop-in Lottie playback
- **`DARK_THEME` / `LIGHT_THEME` + `ThemeCtx`** — reactive theme toggle
- **`ChapterBand`** — narrative chapter wrapper: see `_template/design-tokens.js` §4 for full spec
- **`BoardFoot`** — branded footer with OrbitMark, version, screen count, language tag

---

## Step 0 — Intake

**Do this before asking the designer anything.**

1. Read whatever you have on the client — CRM/Notion page, meeting notes, brief, email thread
2. Extract answers to the 13 intake questions (below)
3. Identify which questions are unanswered
4. Present a single consolidated list of missing answers and ask only for those

Typically only 2-4 questions need the designer's input.

---

## Project Context File — `ClientName/PROJECT.md`

**Every client folder has a `PROJECT.md` — the single source of truth for that engagement.**

It holds everything an agent needs to resume work with full context:
- **YAML frontmatter** (machine-readable): theme, palette, personas, deploy URL, status, stakeholders
- **Flows list** with priority tags (P0 must-ship / P1 next / P2 backlog)
- **Screens inventory** with state (planned / draft / in-review / built / cut)
- **Design decisions** — *why* this theme, *why* this palette
- **Client-specific vocabulary** — AR/EN product terms, status labels (extends global SEED)
- **Stakeholders** — who approves what
- **Assumptions & open questions** — what needs client sign-off
- **Changelog** — per-version history mirrored from git

### Rules for agents working on a client board
1. **Read `ClientName/PROJECT.md` first** — before touching any HTML file.
2. **Frontmatter wins** — if the HTML file's `PROJECT = {…}` block disagrees with the `.md` frontmatter, update the HTML to match.
3. **Update on every change** — whenever you add/modify a flow, screen, decision, or stakeholder, update `PROJECT.md` in the same turn. Do not defer this. (The `.claude/hooks/project-md-reminder.sh` hook reminds you.)
4. **Append to changelog** — every version bump (v1.0 → v1.1) adds a changelog entry with bullet-point summary.
5. **Flag assumptions** — if you made a call without explicit client input, log it under "Assumptions & Open Questions" so it surfaces in the next client review.

### Backfilling an existing board
If a client folder has boards but no `PROJECT.md`:
1. Read every `*.html` board in the folder → extract the PROJECT block + infer flows from screen labels
2. Read any README, proposal doc, or client notes available
3. Emit a filled-out `PROJECT.md` → ask the designer to validate the assumption rows

---

## Step 0.3 — Brand From Logo + Brand Asset Protocol

### Quick path (logo only)
Use when the client provided only a logo and nothing else.

1. Run the `/brand-from-logo` skill with the logo path
2. Skill returns: dominant palette (5 hex), visual mood tags, recommended base theme, industry hypothesis, paste-ready `C` block
3. Confirm palette with the designer → skip theme ideation if the palette is decisive

### Full Brand Asset Protocol (run for every client board)

Mandatory when the board represents a specific brand. Five hard steps — don't skip any:

| Step | Action |
|---|---|
| 1 · Ask | Request: logo file, product screenshots, brand guidelines, color palette, fonts |
| 2 · Search | `<brand>.com/brand` · `/press` · `brand.<brand>.com` · product pages → find authoritative assets |
| 3 · Download | Logo (SVG → inline-SVG) · Product shots (hero → press kit) · UI (App Store screenshots → official video frames) |
| 4 · Verify + extract | Check logo fidelity · verify image resolution · grep real hex values — **never guess colors from memory** |
| 5 · Freeze | Write `ClientName/brand-spec.md` with logo paths, image paths, CSS color variables · all HTML boards reference this file |

**Asset priority ranking:** logo → product renders → UI screenshots → color values → fonts.

**Why this matters:** Un-frozen brand knowledge evaporates between iterations. Board v1.3 always drifts from v1.0 without a written spec. The `brand-spec.md` is the single source of truth — if it's not in there, it didn't happen.

---

## Step 0.5 — Theme Ideation / Design Direction (Optional)

Use when the client doesn't fit any existing preset in `design-tokens.js` — i.e., when a new aesthetic is needed.

### Path A — Stitch visual concepts (requires `/stitch-design` + Stitch MCP)
1. Use `/stitch-design` with a 2-sentence brief: product type + vibe (e.g., "healthcare dashboard for hospital admin, clinical and trustworthy")
2. Generate 3 rough screen concepts
3. Show the directions → pick one → extract the color palette and component style as starting point
4. Document the new palette in `_template/design-tokens.js` under a new theme block
5. Build the full board using the HTML engine (Stitch is for ideation only)

### Path B — Design Direction Advisor (requires `/huashu-design`)
1. Invoke `/huashu-design` with a vague brief — the skill enters Design Direction Advisor mode
2. It recommends 3 directions from different design schools, each with philosophy-backed rationale
3. Generates 3 visual HTML demos in parallel — client-presentable
4. Pick one → extract palette + component style → continue into Step 1

**When to use Path B:** When the brief is "make it feel luxurious but I don't know exactly what that means", or when the vertical has no established aesthetic convention.

---

## Step 2.5 — Reference Scraping (Optional)

Use when the client says "I want this to feel like X app" or when the vertical has strong category conventions worth matching (food delivery, fintech, healthcare).

1. See `_template/REFERENCE_SCRAPER.md` for the full pattern
2. Output lands at `./<ClientName>/REFERENCES.md` — one entry per reference app with vertical, layout, palette, and a "steal-worthy" one-liner
3. Use these during the build to ground layout choices in real-shipped patterns

---

## Client Intake Questionnaire

These are the 13 questions. Pre-fill as many as you can (Step 0); ask only for what's missing.

### Identity
1. **Product name** — English name + Arabic name (if applicable)
2. **Company / brand** — who is the client?
3. **Tagline or positioning** — one sentence describing what the product does

### Scope
4. **App types in scope** — which boards to build?
   - Mobile app (user-facing consumer)
   - Mobile app (operator / vendor / driver)
   - Desktop admin dashboard
   - Tablet (iPad Pro)
   - Smartwatch (Apple Watch)
5. **User personas** — who are the actors? (e.g., customer, driver, vendor, admin, student, trainer, therapist)
6. **Screens per persona** — what are the 3 most important moments to show per persona?
   - Rule: max 3 screens per initial board. Add flows only after approval.

### Brand & Visual
7. **Language direction** — Arabic-first (RTL), English-first (LTR), or bilingual?
8. **Brand palette** — primary color (hex if available), secondary, light/dark theme preference
9. **Design aesthetic** — choose one as starting point:
   - Dark & premium (Gold Noir)
   - Light glassmorphism (Violet Glass)
   - Minimal & clean (flat, lots of white space)
   - Bold & expressive (strong color, oversized type)
   - Other (describe or provide reference app)
10. **Reference apps** — 1-3 apps the client likes the look/feel of

### Context
11. **City / region** — determines map center coordinates and currency
12. **Purpose of this board** — sales proposal / client design review / internal alignment / investor deck?
13. **Deadline or urgency** — any presentation date to plan for?

---

## The Design System

All presets live in `_template/design-tokens.js` with full token documentation. The two base themes below are what the starters ship with; each has a **paired inverse theme** for dark/light toggling. The file also holds further presets (Golden Hour, Clinic Luxe, Limestone/Basalt, Module, Gallery Wall) — read their comment blocks for when to use each.

### Gold Noir — "Dark Premium"
- **Palette:** Gold `#C8A951` on near-black `#0A0A0A`
- **Surfaces:** `#141414` cards, `#2A2A2A` borders, `#F0EDE8` warm white text
- **Feel:** authoritative, exclusive, high-end, focused — think Bloomberg Terminal meets luxury brand
- **Use for:** logistics ops, fintech, enterprise dashboards, B2B platforms, marketplace backends
- **Paired light:** `GOLD_IVORY` — warm-white canvas, dark ink text, gold still primary

### Violet Glass — "Liquid Glassmorphism"
- **Palette:** Purple `#9B4DCA` on soft white `#F8F6FF` with amber `#F5A623` accent
- **Surfaces:** `rgba(255,255,255,0.65)` glass cards, `backdrop-filter: blur(20-28px)`
- **Feel:** modern, airy, approachable, trustworthy — think iOS Settings meets Headspace
- **Use for:** wellness, education, coaching, consumer lifestyle, health tech, community apps
- **Paired dark:** `VIOLET_NIGHT` — deep purple canvas, smoked glass cards, same accent

### The Constant: Premium Feel
Regardless of theme, every board must have:
1. **Real depth** — every surface has a shadow. Nothing is flat.
2. **Warm white** — never `#FFFFFF` for text on dark. Always `#F0EDE8`.
3. **Breathing room** — 16px card padding, 36px gap between screens, 60px between sections.
4. **Live indicators** — pulsing dot for anything real-time; inline Lottie accent for one hero moment per board.
5. **Real map data** — Leaflet with CartoDB tiles (`dark_all` ↔ `light_all` per theme) and actual coordinates.
6. **Proper Arabic typography** — IBM Plex Sans Arabic / Cairo / Tajawal with `font-feature-settings: "ss01","kern","liga"`. Never system-ui fallback for Arabic.
7. **Seeded realistic data** — use `SEED` for names/addresses/phones; use `img()` for avatars and hero images. No lorem, no abstract placeholders.
8. **Aviniti brand bar** — watermark pill with the logo at bottom-left of every canvas; 20px inline logo next to PROJECT.name in title card.
9. **Dark/light toggle** — sun/moon button next to zoom controls; canvas, chrome, and map tiles all flip reactively.
10. **Bilingual labels** — every screen has AR + EN labels underneath.
11. **Flow annotations** — dashed SVG arrows showing user transitions between screens.

### Anti-AI-Slop Rules

AI slop = the visual common denominator of AI output. These elements appear in every AI-generated design because they live in the training corpus, not because they serve the brand. Avoid them unless the brand explicitly uses them.

| Banned element | Why it's slop | Exception |
|---|---|---|
| Purple / blue radial gradients | "Tech feel" formula — appears in every SaaS/AI/Web3 landing page | Brand actually uses it (e.g., Linear) |
| Emoji as icons | Training-corpus default for bullets — signals "undesigned" | Brand uses emoji (Notion), or audience is children |
| Rounded card + left border accent | AI's default "card with personality" | Brand spec explicitly calls for it |
| SVG human silhouettes / CSS avatar shapes | AI substitute for real photography | Brief is explicitly illustrative |
| Inter / Roboto / system fonts as display | Too common — signals demo page, not designed product | Brand spec explicitly uses them with micro-adjustments |
| Decorative stock photos unrelated to content | Filler that looks AI-assembled | Never — use `img()` seeded or Wikimedia real assets |

**Positive rules — what to use instead:**
- `oklch()` for any color not pulled from `brand-spec.md` — never invent hex values on the fly
- `text-wrap: pretty` on all paragraph and label text blocks
- CSS Grid for layout (not nested flexbox stacks)
- Curated serif display faces: Fraunces (already in starters), Newsreader, Source Serif, EB Garamond
- One accent color carried through the entire board — not multi-color clusters
- **One "worth screenshotting" detail per board** — one element at 120% quality; everything else at 80%. Concentrate effort.

**Test before you ship:** *does every gradient / every icon / every accent box earn its place?* If you can't answer yes, remove it.

---

## How to Create a New Board

### Step 1 — Intake (see Step 0)

### Step 2 — Theme ideation / Brand-from-Logo / Reference scrape (see Steps 0.3, 0.5, 2.5)

### Step 3 — Duplicate the right starter + PROJECT.md
- **Mobile** → `_template/mobile-board-starter.html`
- **Dashboard** → `_template/dashboard-board-starter.html`
- **Tablet** → `_template/tablet-board-starter.html`
- **Watch** → `_template/watch-board-starter.html`
- **Context file** → `_template/PROJECT.md` (always — copy into `ClientName/PROJECT.md`)

Copy the board into `ClientName/` and rename: `ClientName_[Persona]_UI_Board.html`. Fill `ClientName/PROJECT.md` frontmatter from intake data.

All four starters ship with Arabic typography, the Aviniti brand bar, imagery helpers, SEED data, the Lottie player, and the dark/light toggle.

### Step 4 — Configure PROJECT block
At the top of the script, update:
```js
const PROJECT = {
  name:      "...",   // product name
  nameAr:    "...",   // Arabic name
  persona:   "...",   // e.g. "Driver App"
  version:   "v1.0",
  designer:  "Aviniti",
  date:      "...",
  rtl:       true/false,
  mapCenter: [lat, lng],
  mapZoom:   14,
};
```

### Step 5 — Configure DARK_THEME / LIGHT_THEME
- Swap `DARK_THEME.primary` to the client's brand color (derive `primaryLight` +15% brightness, `primaryDim` 12% alpha).
- Adjust `LIGHT_THEME` to match — usually keep same primary, invert surfaces.
- For a glass-first brand: start from the `VIOLET_GLASS` / `VIOLET_NIGHT` pair in `design-tokens.js`.
- For a brand new palette: document the full token set in `design-tokens.js` under a new section (see Design System Update Rule).

### Step 5.5 — Write Narrative Copy (ChapterBand)
Before building a single screen, write the `title / lede / lane` for every chapter. Record the copy in `PROJECT.md §3 Flows` under the `narrative:` key for each flow.

**Copy rules:**
- `title` — Fraunces 42, one sentence, reads like a chapter of a book. A decision, not a label. *"Scan before signup."* not *"Onboarding screens"*
- `lede` — Fraunces 18 italic, product story in one sentence. Verb + outcome.
- `lane` — Inter 12.5, designer rationale. Why this chapter is structured this way. See `CHAPTER_COPY_EXAMPLE` in `_template/design-tokens.js §5` for canonical examples.

### Step 6 — Build screens inside ChapterBand
Wrap every chapter in `<ChapterBand>` (see `_template/design-tokens.js §4` for full JSX spec). Screen components go as `children`.

```jsx
<ChapterBand
  num={1} name="Onboarding" screens={6}
  title="Scan before signup."
  lede="Meet the user where they are, not at an OTP wall."
  lane="Goal → core value moment → preferences → commitment → deferred auth.">
  <O1/> <O2/> <O3/> <O4/> <O5/> <O6/>
</ChapterBand>
```

- Each screen is a React component wrapped in `<PF>` (phone), `<DF>` (desktop), `<TF>` (tablet), or `<WF>` (watch).
- **Always** grab C via `const C = React.useContext(ThemeCtx);` at the top of each component.
- Use `SEED.pair(i)` for names, `SEED.phoneJO()` for phones, `SEED.amountJOD()` for money.
- Use `img(seed, w, h)` for avatars and hero images; `unsplash(id, w, h)` for curated product photos.
- Wrap Arabic spans: `<span lang="ar" style={{fontFamily:FONT_AR}}>…</span>`.
- Drop in `<dotlottie-player>` for one hero Lottie moment per board — no more.
- End the board with `<BoardFoot>` component.

### Step 7 — Flow annotations (optional but impressive)
Between screens inside a `<ChapterBand>`, add dashed SVG flow arrows: an absolutely-positioned `<svg>` overlay with `stroke-dasharray="6 6"`, an arrowhead `<marker>`, and a small bilingual label pill at the midpoint describing the user action ("Tap Confirm · اضغط تأكيد").

### Step 8 — Automated QA
Run the `qa/` pipeline against the board:
```bash
cd qa
npm install                                   # one-time
npx playwright install chromium               # one-time
npm run qa -- ../ClientName/Client_Board.html
```

This produces `./QA_screenshots/<timestamp>/` containing:
- `board.png` (full canvas at zoom 0.35)
- One detail PNG per screen at zoom 1.0
- `QA_report.md` covering 9 checks: console clean, zoom controls, AR+EN labels, Leaflet tiles, no "TODO" text, Aviniti brand bar present, IBM Plex Sans Arabic loaded, theme toggle works, performance metrics
- `axe-violations.json` + `axe-summary.md` — WCAG 2 A/AA + best-practice findings grouped by impact

**Exit code discipline:**
- 0 = clean
- 1 = critical a11y violations (do not ship)
- 2 = serious a11y violations (fix before client share)

`QA_screenshots/` grows fast — it is git-ignored; prune old runs regularly.

### Step 9 — Version
Commit each iteration with a consistent message:
- `feat(ClientName): [Persona] UI Board v1.0 — initial`
- `feat(ClientName): [Persona] UI Board v1.1 — [brief change description]`
- `fix(ClientName): [Persona] map tiles fix`

Keep client work in a **private** repo (or a private branch/fork of this kit). Never commit client-sensitive data (contract values, personal phone numbers) or client logo files.

### Step 10 — Deploy (optional)
Boards are static HTML, so any static host works (Vercel, Netlify, GitHub Pages, Firebase Hosting). Share **only the URL** with the client — not the HTML file — so updated iterations reach them automatically. Record the URL in `PROJECT.md`.

---

## Conversion-First UX Principle

**"Scan before signup" is the highest-leverage change in any consumer app.**

The principle: let the user experience the core value of the product *before* asking for account creation or payment. Apply this to every consumer-facing onboarding flow:

1. **Show the wow moment first.** The product's primary value action (scan, search, generate, match) happens before auth.
2. **Defer auth as long as possible.** Auth at screen 1 of 6 kills conversion. Auth at screen 5 of 6, after the user has already committed emotionally, converts.
3. **When you do ask, make it minimal.** Apple/Google SSO first. Phone OTP second. Email/password never as the first option.
4. **The ask is cheap only because the gift came first.** Every screen before the auth screen must give value, never demand it.

Apply to: health, wellness, and other consumer verticals.
Do not apply to: B2B dashboards, enterprise tools, driver/vendor apps (auth is expected at the door there).

---

## The Design System Update Rule

**After every approved client board, update `_template/design-tokens.js`.**

- New color token introduced → add it to the appropriate theme block with a comment
- New component pattern built (card style, animation) → document it in the COMPONENT SPEC REFERENCE section
- New map center used → add it to `UNIVERSAL.map` with the city name
- New design aesthetic established → create a new theme block alongside the existing presets, named for the aesthetic (never the client)
- New Lottie category proved useful → add it to `MOTION.curated`
- New seed data pool (new locale, new industry vocabulary) → append to `SEED`

The goal: each project contributes to a growing library. Every new board gets better than the last because the foundation grows with every delivery.

---

## Architecture Reference

Every board is fully self-contained:
- **React 18.2 + ReactDOM** — from CDN (UMD build, no npm)
- **Babel Standalone 7.23.9** — transpiles JSX in-browser at runtime (`<script type="text/babel">`)
- **Leaflet 1.9.4** — interactive maps (used in static mode for mockups)
- **Fonts** — Inter (Latin) + IBM Plex Sans Arabic + Cairo + Tajawal (Arabic), all from Google Fonts
- **`<dotlottie-player>`** — loaded from unpkg as ES module; used for ≤1-2 Lottie accents per board
- **CartoDB tiles** — `dark_all` for dark theme, `light_all` for glass/light theme (switches via theme context)
- **All styles inline** — React style objects, no CSS framework, no external stylesheets
- **Arabic rendering** — IBM Plex Sans Arabic with `font-feature-settings: "ss01","kern","liga"` and proper `lang="ar"` spans
- **Aviniti branding** — logo embedded as base64 via `_template/_aviniti-logo-base64.txt`; rendered in brand-bar watermark + title-card inline

### Frame Dimensions
| Frame | Outer | Starter | Default Zoom |
|---|---|---|---|
| iPhone 15 Pro | 393×852 | `mobile-board-starter.html` | 0.35 |
| Desktop browser | 1440×900 (+220 sidebar) | `dashboard-board-starter.html` | 0.35 |
| iPad Pro 11" | 834×1194 | `tablet-board-starter.html` | 0.35 |
| Apple Watch Ultra | 216×260 case / 205×251 screen | `watch-board-starter.html` | 0.70 |

### Board Canvas
- Min zoom: 0.15 · Max: 1.0 · Step: 0.05
- Canvas padding: 80px top, 60px sides
- `transformOrigin: "top left"` — always
- Theme toggle: live via `ThemeCtx` — never re-render the page

---

*Designed by Aviniti · Your Ideas, Our Reality · This kit grows with every project.*
