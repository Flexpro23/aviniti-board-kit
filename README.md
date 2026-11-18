# Aviniti Board Kit

A kit for building **self-contained, interactive UI mockup boards** for client proposals and design reviews, made to be driven by [Claude Code](https://claude.com/claude-code).

Every board is a single HTML file. It opens in any browser, needs no build step and has nothing to install. Inside each board, React, Babel, Leaflet and the fonts load from CDNs.

## What's inside

| Path | What it is |
|---|---|
| `CLAUDE.md` | The full playbook Claude follows: pipeline, intake questionnaire, design rules, board anatomy |
| `_template/` | Four board starters (mobile, dashboard, tablet, watch), `design-tokens.js` (theme presets + components), and the `PROJECT.md` template |
| `qa/` | Automated QA: Playwright (9 checks + screenshots) and axe-core accessibility audit |
| `.claude/skills/` | `/brand-from-logo`, `/sync-project`, `/qa`, `/qa-quick` |
| `.claude/hooks/` | Reminds Claude to update `PROJECT.md` whenever a board changes |

## Setup

```bash
git clone <this repo> aviniti-board-kit
cd aviniti-board-kit/qa
npm install
npx playwright install chromium
```

Then open the repo folder in Claude Code. `CLAUDE.md`, the skills and the hook load automatically.

### Optional skills

These third-party skills extend the kit. They are not bundled, so install them yourself and respect each one's license (`skills-lock.json` lists the sources):

```bash
npx skills add addyosmani/web-quality-skills --skill accessibility
npx skills add addyosmani/web-quality-skills --skill performance
npx skills add google-labs-code/stitch-skills --skill stitch-design
npx skills add alchaincyf/huashu-design        # personal-use license
```

## Your first board

Ask Claude:

> New client: Acme Logistics, driver app, Arabic-first, Amman. Here's their logo: ./acme-logo.png

Claude runs intake, extracts the brand from the logo, creates `AcmeLogistics/PROJECT.md`, writes the chapter narrative, builds `AcmeLogistics/AcmeLogistics_Driver_UI_Board.html` from the mobile starter, and runs QA:

```bash
cd qa && npm run qa -- ../AcmeLogistics/AcmeLogistics_Driver_UI_Board.html
```

## Keeping client work private

`.gitignore` is an allowlist: only the kit files are tracked, so client folders never get committed here. Version client work in your own **private** repo.

---

*Designed by Aviniti · Your Ideas, Our Reality*
