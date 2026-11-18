// Usage: node _tools/capture.mjs <out-dir> <board.html> [--dark] [--only=id,id] [--states]
// Captures every screen figure (figure[id^="s-"]) or DS section at 100 % with fixed board chrome hidden,
// and checks inside every device frame for: content overflowing the device, clipped text (scrollWidth > clientWidth
// on nowrap/ellipsis text is allowed; on wrapping text it is not), and elements wider than the frame.
import { chromium } from './kit.mjs';
import fs from 'fs'; import path from 'path';
const args = process.argv.slice(2); const out = args[0]; const file = args[1];
const dark = args.includes('--dark'); const only = (args.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean); const states = args.includes('--states');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 3300, height: 2000 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(2500);
if (dark) { await p.locator('button[aria-label*="dark" i]').first().click(); await p.waitForTimeout(500); }
await p.addStyleTag({ content: 'header[style*="fixed"], nav[aria-label="Chapters"], nav[aria-label="Board controls"], aside[data-brand-bar]{display:none!important} body{overflow:auto!important} #root{height:auto!important} #root > div{height:auto!important;overflow:visible!important}' });
await p.evaluate(() => { const m = document.querySelector('main'); if (m) m.style.zoom = '1'; }); await p.waitForTimeout(600);
const name = path.basename(file, '.html') + (dark ? '-dark' : ''); const dir = path.join(out, name); fs.mkdirSync(dir, { recursive: true });
let figs = await p.$$('figure[id^="s-"]'); const isDS = !figs.length; if (isDS) figs = await p.$$('section[aria-labelledby], section#cover, section#intro');
let n = 0;
for (const f of figs) {
  const id = await f.getAttribute('id') || 'sec';
  if (only.length && !only.some(o => id === 's-' + o || id === o)) continue;
  try { await f.scrollIntoViewIfNeeded(); await p.waitForTimeout(80); await f.screenshot({ path: path.join(dir, `${String(n).padStart(3, '0')}_${id}.png`) }); n++; } catch (e) { console.log('ERR', id, e.message.slice(0, 100)); }
}
if (states) { const rows = await p.$$('[data-states]'); let i = 0; for (const r of rows) { const sid = await r.getAttribute('data-states'); if (only.length && !only.includes(sid)) continue; await r.scrollIntoViewIfNeeded(); await r.screenshot({ path: path.join(dir, `states_${String(i++).padStart(2, '0')}_${sid}.png`) }); } }
// device-level layout checks
const issues = await p.evaluate(() => {
  const r = [];
  document.querySelectorAll('[data-frame]').forEach(fr => {
    const fig = fr.closest('figure, [data-states]'); const fid = fig ? (fig.id || 'states:' + fig.getAttribute('data-states')) : 'ds';
    const lang = fr.getAttribute('lang'); const fb = fr.getBoundingClientRect(); const z = fb.width / fr.offsetWidth || 1;
    fr.querySelectorAll('*').forEach(el => {
      const eb = el.getBoundingClientRect(); if (!eb.width || !eb.height) return;
      if (el.hasAttribute('data-hit')) return; // invisible touch-target extension (kit <Hit/>), allowed past the frame edge
      const cs = getComputedStyle(el);
      // element sticks out of the device (and is not inside a clipping ancestor within the device)
      if (eb.right > fb.right + 1 || eb.left < fb.left - 1 || eb.bottom > fb.bottom + 1) {
        let a = el.parentElement, clipped = false; while (a && a !== fr) { const o = getComputedStyle(a); if (/(hidden|auto|scroll|clip)/.test(o.overflow + o.overflowX + o.overflowY)) { const ab = a.getBoundingClientRect(); if (ab.right <= fb.right + 1 && ab.left >= fb.left - 1 && ab.bottom <= fb.bottom + 1) { clipped = true; break; } } a = a.parentElement; }
        if (!clipped) r.push(`${fid} [${lang}] OUT <${el.tagName.toLowerCase()}> "${(el.innerText || '').slice(0, 30).replace(/\n/g, ' ')}"`);
      }
      // text cut: a text-bearing element whose content is wider than its box without an ellipsis
      if (el.children.length === 0 && (el.innerText || '').trim() && el.scrollWidth > el.clientWidth + 2 && cs.textOverflow !== 'ellipsis' && cs.overflow !== 'visible') r.push(`${fid} [${lang}] CUT "${el.innerText.slice(0, 40)}"`);
    });
  });
  return [...new Set(r)];
});
const dup = await p.evaluate(() => { const c = {}; document.querySelectorAll('figure[id^="s-"]').forEach(f => c[f.id] = (c[f.id] || 0) + 1); return Object.entries(c).filter(([, v]) => v > 1).map(([k]) => k); });
fs.writeFileSync(path.join(dir, '_issues.txt'), issues.join('\n'));
console.log(`${name}: ${n} captures · ${errs.length} errors · ${issues.length} layout issues · dup ids: ${dup.join(' ') || 'none'}`);
issues.slice(0, 40).forEach(i => console.log('  ' + i)); errs.slice(0, 5).forEach(e => console.log('  ERROR ' + e.slice(0, 200)));
await b.close(); process.exit(errs.length || issues.length ? 1 : 0);
