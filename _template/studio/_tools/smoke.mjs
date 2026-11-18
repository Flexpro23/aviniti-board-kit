// Usage: node _tools/smoke.mjs <board.html> [shot.png] — page errors, render time, frame count, optional full screenshot at current zoom
import { chromium } from './kit.mjs';
import path from 'path';
const f = path.resolve(process.argv[2]); const shot = process.argv[3];
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const errs = []; p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => m.type() === 'error' && errs.push('CONSOLE ' + m.text()));
const warns = []; p.on('console', m => m.type() === 'warning' && warns.push(m.text()));
const t0 = Date.now(); await p.goto('file://' + f); await p.waitForFunction(() => document.querySelectorAll('main').length > 0, null, { timeout: 60000 }).catch(() => {}); const t1 = Date.now();
await p.waitForTimeout(1500);
const info = await p.evaluate(() => ({ frames: document.querySelectorAll('[data-frame]').length, figs: document.querySelectorAll('figure[id^="s-"]').length, sections: document.querySelectorAll('section').length, nodes: document.querySelectorAll('*').length }));
console.log(JSON.stringify({ renderMs: t1 - t0, ...info, errors: errs.length, warnings: warns.length }));
errs.slice(0, 10).forEach(e => console.log('  ' + e)); warns.slice(0, 10).forEach(w => console.log('  WARN ' + w));
if (shot) { await p.screenshot({ path: shot }); }
await b.close(); process.exit(errs.length ? 1 : 0);
