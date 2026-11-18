// Image helper (no Pillow): draws PNGs on a canvas in headless Chromium.
//   node _tools/img.mjs half <png…>                      → <name>.half<k>.png at 50 %, sliced every 1300 px
//   node _tools/img.mjs tiles <png> <outdir> [tw] [th]   → <outdir>/<name>_<row>_<col>.png tiles (default 1350 × 1000)
import { chromium } from './kit.mjs';
import fs from 'fs'; import path from 'path';
const [cmd, ...args] = process.argv.slice(2);
if (!['half', 'tiles'].includes(cmd)) { console.error('usage: img.mjs half <png…> | tiles <png> <outdir> [tw] [th]'); process.exit(2); }
const b = await chromium.launch(); const p = await b.newPage();
await p.setContent('<html><body></body></html>');
const run = async (file, scale, fn) => {
  const src = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
  return p.evaluate(async ({ src, scale, fn }) => {
    const img = new Image(); img.src = src; await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight; const rects = new Function('W', 'H', fn)(W, H); const out = [];
    for (const r of rects) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(r.w * scale)); c.height = Math.max(1, Math.round(r.h * scale)); const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, r.x, r.y, r.w, r.h, 0, 0, c.width, c.height); out.push({ name: r.name, data: c.toDataURL('image/png') }); }
    return out;
  }, { src, scale, fn });
};
const save = (f, d) => fs.writeFileSync(f, Buffer.from(d.split(',')[1], 'base64'));
if (cmd === 'half') {
  for (const f of args) {
    // slices of 1300 px at half size = 2600 px of the source
    const out = await run(f, 0.5, 'const r=[];let k=0;for(let y=0;y<H;y+=2600){r.push({name:k++,x:0,y,w:W,h:Math.min(2600,H-y)});}return r;');
    out.forEach(o => save(f.replace(/\.png$/, `.half${o.name}.png`), o.data)); console.log(f, out.length);
  }
} else {
  const [f, outDir, tw = 1350, th = 1000] = args; fs.mkdirSync(outDir, { recursive: true }); const base = path.basename(f, '.png');
  const out = await run(f, 1, `const r=[];for(let y=0;y<H;y+=${+th})for(let x=0;x<W;x+=${+tw})r.push({name:Math.floor(y/${+th})+'_'+Math.floor(x/${+tw}),x,y,w:Math.min(${+tw},W-x),h:Math.min(${+th},H-y)});return r;`);
  out.forEach(o => save(path.join(outDir, `${base}_${o.name}.png`), o.data)); console.log(out.length, 'tiles');
}
await b.close();
