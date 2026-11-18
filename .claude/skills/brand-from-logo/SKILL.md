---
name: brand-from-logo
description: Extract palette, mood, and a ready-to-paste design-tokens block from a client logo image. Use when starting a new board in this kit and the client has provided only a logo / limited brand assets.
---

# Brand From Logo

## When to use
- Starting a new UI board in this kit (see `CLAUDE.md` at the repo root)
- Client provided a logo but no palette, no brand guide, and no reference apps
- You need a defensible starting point for the PROJECT block, the `C` block, and the theme choice

## Steps
1. Ask the user for the path to the logo file (PNG/JPG/SVG)
2. Use the Read tool to load the image — Claude can see it directly
3. Analyze and produce:
   a. **Dominant colors** — pick 5 colors from the logo (primary, secondary, 3 supporting). Give hex values. Note which is the brand primary.
   b. **Contrast/brightness assessment** — is the logo predominantly dark, light, or mixed? This informs whether GOLD_NOIR (dark premium) or VIOLET_GLASS (light glass) is the better base theme.
   c. **Visual mood** — 3-5 descriptors (e.g. "clinical, trustworthy, precise" or "warm, friendly, artisanal"). Extract from: typography style, logomark geometry (hard vs soft curves), color warmth, overall weight.
   d. **Recommended theme base** — GOLD_NOIR, VIOLET_GLASS, one of the other presets in `_template/design-tokens.js`, or NEW. If NEW, justify why none fits.
   e. **Suggested industry fit** — cross-reference mood to common verticals (logistics, wellness, fintech, healthcare, e-commerce, education).
4. Output a ready-to-paste C block for `_template/mobile-board-starter.html`, with the client's primary color substituted, and primaryLight (+15% brightness) + primaryDim (12% alpha) derived. Include a comment above showing what was extracted.
5. Output ALSO a 3-line suggested PROJECT.name / tagline guess (mark as "draft — confirm with the designer") based on logo typography.
6. If recommending NEW theme, also draft an additional theme block for `design-tokens.js` using the palette.

## Output format
Always structure the response as:
- **Extracted palette** (table: role | hex | swatch preview if possible)
- **Mood tags**: comma-separated
- **Recommended base theme**: one theme name or NEW
- **Industry hypothesis**: one sentence
- **Paste-ready C block**: fenced JS
- **Next actions**: 2-3 bullets (e.g. "confirm primary hex with client", "run /stitch-design with mood tags to validate")

## Quality guardrails
- Never invent colors not visibly present in the logo
- If the logo is single-color, state that and suggest 2 complementary colors based on color theory
- For Arabic-first brands, check whether the logo has Arabic typography and flag if absent (affects bilingual board design)
- Round hex values to common web-safe equivalents only if they improve clarity

## Related
- `_template/design-tokens.js` — every theme preset
- `/stitch-design` — optional, use after this skill to generate 3 ideation concepts once the client approves a palette direction
