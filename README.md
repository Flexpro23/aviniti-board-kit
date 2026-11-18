# Aviniti Board Kit

A kit for designing products as **bilingual (Arabic RTL + English LTR) interactive UI boards**: a design system plus every screen, for client proposals and design reviews. It is meant to be driven by [Claude Code](https://claude.com/claude-code).

Every board is a self-contained HTML file. It opens in any browser and needs no build step to view.

## Two ways to build

| | Quick board | Studio (`/studio`) |
|---|---|---|
| For | A sales teaser, the first few key screens | A full design system plus complete boards for every role |
| Size | 3–12 screens in one HTML file | 20–300 screens across several boards and a hub |
| Example | `Example/Example_UI_Board.html` | `Example-Studio/Boards/index.html` (Fernly) |

## What's inside

| Path | What it is |
|---|---|
| `CLAUDE.md` | The playbook Claude follows: pipeline, intake questionnaire, design rules, board anatomy |
| `_template/*-starter.html` | Quick-board starters: mobile, dashboard, tablet, watch |
| `_template/design-tokens.js` | Theme presets and component specs for quick boards |
| `_template/studio/` | Studio scaffold, in four parts: <br>• **Specs:** brief, page inventory, build and audit specs <br>• **Token generator:** palette anchors → contrast-checked light/dark tokens <br>• **Board engine:** design-system board, shared React components, device shells <br>• **Tools:** build, capture and verify |
| `Example-Studio/` | A complete studio project for a fictional plant shop, already built |
| `qa/` | Automated QA: Playwright checks + axe-core accessibility audits in light and dark |
| `.claude/skills/` | `/studio`, `/brand-from-logo`, `/sync-project`, `/qa`, `/qa-quick` |
| `.claude/hooks/` | Reminds Claude to update `PROJECT.md` whenever a board changes |

## Requirements

- [Claude Code](https://claude.com/claude-code)
- Node.js 18 or later
- Python 3 (standard library only)
- git
- Internet access: boards load React, Babel and Google Fonts from CDNs

## Setup

```bash
git clone https://github.com/Flexpro23/aviniti-board-kit.git
cd aviniti-board-kit/qa
npm install
npx playwright install chromium
```

Then open the `aviniti-board-kit` folder in Claude Code. `CLAUDE.md`, the skills and the hook load automatically.

### Optional skills

Third-party skills that extend the kit. They are not bundled; each keeps its own license. Install them for your user (`-g`) so they stay out of the repo:

```bash
npx skills add addyosmani/web-quality-skills -s accessibility -s performance -a claude-code -g -y
npx skills add alchaincyf/huashu-design -a claude-code -g -y
```

## Your first project

Describe the product to Claude. For a full design system and boards:

> /studio — Acme Logistics: a delivery platform in Amman, Arabic-first. A driver app, a dispatcher console and an admin dashboard. Here's their logo: ./acme-logo.png

Claude works through the project in order:
1. **Brief:** writes the brief.
2. **Design system:** sets the palette and builds the design-system board. It stops for your approval.
3. **Page inventory:** lists every screen per board. It stops for your approval again.
4. **Reference chapter:** builds one chapter itself, to set the quality bar.
5. **Boards and audits:** sends parallel builder agents for the rest, then independent auditors.
6. **Final QA:** runs it and hands you `AcmeLogistics/Boards/index.html`.

For a quick board, just ask for one, for example: "a 6-screen driver app board for Acme Logistics."

## Keeping client work private

`.gitignore` is an allowlist: only the kit files are tracked, so client folders never get committed here. Version client work in your own **private** repo.

---

*Designed by Aviniti · Your Ideas, Our Reality*
