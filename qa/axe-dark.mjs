// Usage: node axe-dark.mjs <board.html> — toggles to dark theme and runs axe (WCAG A/AA + best-practice).
import { chromium } from 'playwright'; import fs from 'fs'; import path from 'path';
const f = path.resolve(process.argv[2]); const axe = fs.readFileSync(new URL('./node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto('file://' + f); await p.waitForTimeout(2500);
const t = p.locator('button[aria-label*="dark" i], button[aria-label*="theme" i], button[title*="theme" i]').first();
if (await t.count()) await t.click(); else console.log('WARN no theme toggle found');
await p.waitForTimeout(800);
await p.addScriptTag({ content: axe });
const r = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'best-practice'] })).violations.map(v => `${v.impact} ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target}`));
console.log(`dark axe: ${r.length} violations; page errors: ${errs.length}`); r.forEach(x => console.log(' ', x)); errs.slice(0, 5).forEach(x => console.log('  ERR', x));
await b.close(); process.exit(r.length ? 1 : 0);
