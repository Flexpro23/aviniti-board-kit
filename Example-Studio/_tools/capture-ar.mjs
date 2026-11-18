// Usage: node _tools/capture-ar.mjs <out-dir> <BOARD-KEY> <board.html>
// Captures ONLY the Arabic device screen of every ScreenFrame and every StateRow item at 2x, light theme,
// with board callout badges hidden and state rows un-zoomed. Writes <out-dir>/<KEY>/<id>.jpg,
// <out-dir>/<KEY>/<id>__s<n>.jpg and appends to <out-dir>/manifest.json.
import { chromium } from './kit.mjs';
import fs from 'fs'; import path from 'path';
const [out, KEY, file] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 3300, height: 2000 }, deviceScaleFactor: 2 });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(3000);
await p.evaluate(() => document.fonts && document.fonts.ready);
await p.addStyleTag({ content: 'header[style*="fixed"], nav[aria-label="Chapters"], nav[aria-label="Board controls"], aside[data-brand-bar]{display:none!important} body{overflow:auto!important} #root{height:auto!important} #root > div{height:auto!important;overflow:visible!important}' });
await p.evaluate(() => {
  const m = document.querySelector('main'); if (m) m.style.zoom = '1';
  // un-zoom state rows so every state is captured at full device size
  document.querySelectorAll('[data-states] [style*="zoom"]').forEach(e => { e.style.zoom = '1'; });
  // hide numbered callout badges that sit over the device frames
  document.querySelectorAll('span[aria-hidden="true"]').forEach(s => { if (s.style.position === 'absolute' && s.style.zIndex === '5' && !s.closest('[data-frame]')) s.style.display = 'none'; });
});
await p.waitForTimeout(800);
const dir = path.join(out, KEY); fs.mkdirSync(dir, { recursive: true });
const items = [];
const figs = await p.$$('figure[id^="s-"]');
for (const f of figs) {
  const meta = await f.evaluate(fig => {
    const cap = fig.querySelector('figcaption'); const sp = [...cap.querySelectorAll('span')].map(s => s.innerText.trim());
    const fr = fig.querySelector('[data-frame][lang="ar"]');
    return { id: fig.id.slice(2), name: sp[1] || '', nameAr: sp[2] || '', v: (sp.find(t => /^v\d/.test(t)) || '').split(' ')[0], device: fr ? fr.getAttribute('data-frame') : '' };
  });
  const fr = await f.$('[data-frame][lang="ar"]'); if (!fr) continue;
  await fr.scrollIntoViewIfNeeded(); await p.waitForTimeout(60);
  const fn = `${meta.id}.jpg`; await fr.screenshot({ path: path.join(dir, fn), type: 'jpeg', quality: 92 });
  items.push({ board: KEY, ...meta, file: `${KEY}/${fn}`, states: [] });
}
const rows = await p.$$('[data-states]');
for (const r of rows) {
  const of = await r.getAttribute('data-states'); const host = items.find(i => i.id === of);
  const kids = await r.$$(':scope > div'); let n = 0;
  for (const k of kids.slice(1)) {
    const label = await k.evaluate(el => { const s = el.querySelector('span'); return s ? s.innerText.replace(/^.*?·\s*/, '').trim() : ''; });
    const fr = await k.$('[data-frame][lang="ar"]'); if (!fr) continue;
    await fr.scrollIntoViewIfNeeded(); await p.waitForTimeout(60);
    const fn = `${of}__s${++n}.jpg`; await fr.screenshot({ path: path.join(dir, fn), type: 'jpeg', quality: 92 });
    (host ? host.states : items).push(host ? { label, file: `${KEY}/${fn}` } : { board: KEY, id: `${of}__s${n}`, name: label, file: `${KEY}/${fn}`, states: [] });
  }
}
const mf = path.join(out, 'manifest.json'); const all = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')).filter(i => i.board !== KEY) : [];
fs.writeFileSync(mf, JSON.stringify([...all, ...items], null, 1));
console.log(`${KEY}: ${items.length} screens, ${items.reduce((a, i) => a + i.states.length, 0)} states, ${errs.length} page errors`);
await b.close();
