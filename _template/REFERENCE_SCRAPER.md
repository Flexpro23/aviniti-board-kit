# Reference Scraper Pattern

A lightweight workflow for pulling real-world UI inspiration into the Aviniti UI board workspace before building a new board. Uses the built-in **WebFetch** tool — no MCP setup required.

---

## 1. Purpose

Use this pattern **before Step 3 (Build Board)** and **after Step 0.5 (Stitch Ideation)** when more grounded, real-shipped-app references are needed. It ensures new boards are anchored in patterns that production apps actually use — not generic AI-generated aesthetics.

The output is a structured `REFERENCES.md` inside the client folder, giving Claude a pattern library to reference while building screens. It also gives the designer a defensible "here's the design lineage" artifact for client conversations.

---

## 2. The Pattern

A simple, repeatable 4-step workflow:

**a. Gather URLs.** The designer shares 3-5 reference URLs (Mobbin, Dribbble, public case studies, landing pages). If none were volunteered, Claude asks: *"Which apps do you want this board to feel like? Share 3-5 reference URLs."*

**b. Fetch each URL.** Claude runs WebFetch on every URL using the extraction prompt below. One WebFetch call per source, in parallel when possible.

**c. Distill into a single file.** Claude writes `./<ClientName>/REFERENCES.md` with one structured entry per source.

**d. Use during build.** When building screens in Step 3, Claude references this file to borrow layout patterns, color strategies, and distinctive UI moves — grounding the board in real examples rather than inventing from scratch.

---

## 3. The Extraction Prompt Template

Copy-paste this into WebFetch's `prompt` parameter for each reference URL:

```
Analyze this product UI reference page. Extract and structure:
1. What the product does (one sentence)
2. Screens visible (list, e.g. "onboarding, home, detail, settings")
3. Visual style (dark/light, flat/depth, density)
4. Color strategy (primary color, accent, background — approximate)
5. Typography (sans/serif, weight, hierarchy)
6. Layout patterns (bottom nav, sidebar, cards, lists, tables, maps)
7. Animation / motion (inferred — skeleton loaders, transitions)
8. Three distinctive UI moves worth stealing for a similar product
Return as structured markdown, no preamble.
```

Keep the prompt literal — WebFetch responds best to explicit numbered asks.

---

## 4. Mobbin-Specific Notes

Mobbin.com is the best mobile UI pattern library on the web, but **most screens sit behind a login wall**. WebFetch will typically return only the page's metadata, marketing copy, or app index — not the actual screen thumbnails.

**Workaround:** The designer opens Mobbin in a browser, screenshots the relevant screens, and drops them into the client folder. Claude then reads the screenshots directly via the **Read** tool (it handles PNG/JPG natively and can describe UI from images). This is actually richer than WebFetch output because Claude sees the real pixels.

Document the Mobbin reference manually in `REFERENCES.md` with the URL + `(screenshots: ./refs/mobbin_<app>_1.png)` note.

The same fallback applies to any login-gated source: **Dribbble shots with Pro-only views, Refero's full grids, Behance case studies behind "project files only"**.

---

## 5. Curated Sources

A short, return-to list for the designer:

| Source | Best For | Login Required? |
|---|---|---|
| **Mobbin.com** | Mobile UI patterns (iOS + Android) by vertical | Yes — use screenshot fallback |
| **Godly.website** | Sharp, experimental web UI | No — WebFetch works |
| **Dribbble.com** | Concept-stage designs, visual direction | Partial — shot pages public |
| **Land-book.com** | SaaS landing pages, marketing sites | No — WebFetch works |
| **Pageflows.com** | Onboarding and signup flows specifically | Yes — screenshot fallback |
| **Behance.net** | Brand + UI case studies, full project write-ups | No — WebFetch works well |
| **Refero.design** | Categorized UI patterns (empty states, settings, etc.) | Partial — category pages public |
| **SaaSLandingPage.com** | Conversion-focused web UI | No — WebFetch works |
| **UI-Sources.com** | iOS/Android screen libraries | Partial |

**Rule of thumb:** public marketing pages (Land-book, Godly, Behance) work great with WebFetch. Login-gated screen libraries (Mobbin, Page Flows, Pro Dribbble) need the screenshot fallback.

---

## 6. Output File Spec

Write to `./<ClientName>/REFERENCES.md`. Structure:

```
# <ClientName> — UI References
Compiled: YYYY-MM-DD

## 1. <App Name> — <URL>
**Vertical:** <e.g. Food delivery>
**Layout:** <e.g. Bottom tab nav + FAB>
**Palette:** <hex approx — primary / accent / background>
**Typography:** <family, weight range>
**Motion:** <notable transitions or skeletons>
**Steal-worthy:**
  - <one-line pattern 1>
  - <one-line pattern 2>
  - <one-line pattern 3>

## 2. <App Name> — <URL>
...
```

Keep entries tight — one screenful per source. Aim for 5-8 lines per reference, not a wall of text.

---

## 7. Integration With the Pipeline

This step **inserts between Step 2 (Stitch Ideation) and Step 3 (Build Board)** in the master pipeline documented in `CLAUDE.md`. It is **optional**: skip it when the client has already provided strong brand assets, a Figma file, or a clearly defined visual direction.

**Use this step when the designer says "I want this to feel like [X app]"** — that phrase is the trigger. Also use it when the vertical is unfamiliar (e.g., first time building a healthcare admin board), or when Stitch Ideation returned directions that feel too generic and need real-world grounding.

Output: a single `REFERENCES.md` inside the client folder. Claude reads it during Step 3 to inform screen layouts, color ratios, and micro-interactions.

---

## 8. Example Entry

A fully filled-out reference entry for Uber Eats, as a template:

```
## 1. Uber Eats — https://mobbin.com/apps/uber-eats-ios
**Vertical:** Food delivery, consumer-facing mobile
**Layout:** Sticky search header + horizontally scrolling category chips + vertical feed of restaurant cards; bottom tab nav (Home / Browse / Orders / Account)
**Palette:** Primary black #000000, accent green #06C167, background white #FFFFFF, subtle gray dividers #EEEEEE
**Typography:** Uber Move (proprietary sans), heavy weights for prices and CTAs, regular for body; clear 3-tier hierarchy (section title / card title / metadata)
**Motion:** Skeleton shimmer on restaurant card load; bottom sheet springs for filter drawer; smooth collapse of header on scroll
**Steal-worthy:**
  - Restaurant cards lead with a large photo (60% of card height) — photography does the selling, not text
  - "Delivery in 15-25 min" ETA badge over the photo in top-left — always visible, builds urgency
  - Filter chips row uses pill buttons that scroll horizontally; selected state inverts (black fill, white text) instead of adding a border
```

Use this as the shape for every entry — same density, same headers, same brevity.

---

*Part of the Aviniti UI Board Workspace pipeline. See `CLAUDE.md` for the full sequence.*
