// Token generator (engine, identical in every project) — run: node build-tokens.mjs
// Reads the project's anchors from ./anchors.mjs, generates 50–950 ramps in OKLCH around each anchor, derives the light and
// dark themes from ramp steps (anchors.mjs may override any theme key), contrast-checks every semantic pair in both themes
// and FAILS (exit 1, list on stderr) on any miss. Emits tokens.{json,js,css}. Never hand-edit the generated files.
import fs from 'fs';
import anchors from './anchors.mjs';

// ── Colour maths (sRGB ↔ OKLCH, WCAG contrast, OKLab ΔE) ─────────────────────
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const rgb2hex = c => '#' + c.map(v => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const lin = v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
const gam = v => v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
function toOklch(h) {
  const [r, g, b] = hex2rgb(h).map(lin);
  const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
  const L = .2104542553 * l + .793617785 * m - .0040720468 * s, A = 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, B = .0259040371 * l + .7827717662 * m - .808675766 * s;
  return [L, Math.hypot(A, B), Math.atan2(B, A)];
}
function fromOklch(L, C, H) {
  const A = C * Math.cos(H), B = C * Math.sin(H);
  const l = (L + .3963377774 * A + .2158037573 * B) ** 3, m = (L - .1055613458 * A - .0638541728 * B) ** 3, s = (L - .0894841775 * A - 1.291485548 * B) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + .2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s, -.0041960863 * l - .7034186147 * m + 1.707614701 * s];
}
function inGamut(L, C, H) { let c = C; for (let i = 0; i < 40; i++) { const v = fromOklch(L, c, H); if (v.every(x => x >= -1e-4 && x <= 1 + 1e-4)) return rgb2hex(v.map(gam)); c *= 0.95; } return rgb2hex(fromOklch(L, 0, H).map(gam)); }
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const LT = { 50: .975, 100: .945, 200: .89, 300: .81, 400: .72, 500: .63, 600: .545, 700: .47, 800: .395, 900: .32, 950: .245 };
const CT = { 50: .10, 100: .2, 200: .4, 300: .65, 400: .88, 500: 1, 600: 1, 700: .92, 800: .82, 900: .7, 950: .55 };
const CT_NEUTRAL = { 50: .45, 100: .5, 200: .6, 300: .72, 400: .86, 500: 1, 600: 1, 700: .95, 800: .9, 900: .78, 950: .6 };
function scale(anchor, pins = {}, chromaBoost = 1, ct = CT) { const [, C, H] = toOklch(anchor); const o = {}; for (const s of STEPS) o[s] = inGamut(LT[s], C * ct[s] * chromaBoost, H); Object.assign(o, pins); return o; }
function lum(h) { const [r, g, b] = hex2rgb(h).map(lin); return .2126 * r + .7152 * g + .0722 * b; }
export const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const hexA = (h, a) => { const [r, g, b] = hex2rgb(h).map(v => Math.round(v * 255)); return `rgba(${r},${g},${b},${a})`; };
const mix = (a, b, t) => rgb2hex(hex2rgb(a).map((v, i) => v * t + hex2rgb(b)[i] * (1 - t)));
const best = (bg, ...inks) => inks.reduce((p, c) => contrast(c, bg) > contrast(p, bg) ? c : p);
const oklab = h => { const [L_, C_, H_] = toOklch(h); return [L_, C_ * Math.cos(H_), C_ * Math.sin(H_)]; };
const dE = (x, y) => { const a = oklab(x), b = oklab(y); return +(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) * 100).toFixed(1); };

// ── Project anchors ──────────────────────────────────────────────────────────
const A = anchors({ scale, mix, hexA, best, inGamut, toOklch, CT, CT_NEUTRAL, contrast });
const ROLES = ['primary', 'accent', 'neutral', 'danger', 'warning', 'success', 'info'];
const scales = {};
for (const [k, v] of Object.entries(A.ramps)) scales[k] = Array.isArray(v) ? scale(v[0], v[1] || {}, v[2] || 1, k === 'neutral' ? CT_NEUTRAL : CT) : scale(v, {}, 1, k === 'neutral' ? CT_NEUTRAL : CT);
const missing = ROLES.filter(r => !scales[r]);
if (missing.length) { console.error('anchors.mjs: missing ramps ' + missing.join(', ')); process.exit(1); }
for (const [k, v] of Object.entries(A.cats || {})) scales['cat_' + k] = scale(Array.isArray(v) ? v[0] : v, {}, Array.isArray(v) ? v[1] : 1);

// ── Themes derived from ramp steps (override any key in anchors.themeOverrides) ─
const P = scales.primary, X = scales.accent, N = scales.neutral, D = scales.danger, W = scales.warning, G = scales.success, I = scales.info;
const [, nC, nH] = toOklch(Array.isArray(A.ramps.neutral) ? A.ramps.neutral[0] : A.ramps.neutral); const nd = (L, k = 0.5) => inGamut(L, nC * k, nH);
const WHITE = '#FFFFFF';
const light = {
  bg: N[50], surface: WHITE, surface2: mix(N[50], N[100], 0.4), surfaceSunken: N[100], surfaceSelected: P[50], border: N[200], borderStrong: N[500],
  text: N[950], textSecondary: N[700], textFaint: mix(N[600], N[700], 0.35), textDisabled: N[400],
  primary: P[700], primaryHover: P[800], primaryPressed: P[900], primarySubtle: P[50], primaryBorder: P[200], primaryText: P[700], onPrimary: best(P[700], WHITE, N[950]),
  accent: X[500], accentSubtle: X[50], accentBorder: X[300], accentText: X[800], onAccent: best(X[500], WHITE, N[950]),
  alert: D[700], alertSubtle: D[50], alertBorder: D[200], alertText: D[700], onAlert: best(D[700], WHITE, N[950]),
  warning: W[700], warningSubtle: W[50], warningBorder: W[200], warningText: W[700],
  success: G[700], successSubtle: G[50], successBorder: G[200], successText: G[700],
  info: I[700], infoSubtle: I[50], infoBorder: I[200], infoText: I[700],
  neutralSubtle: N[100], focus: P[700], focusHalo: hexA(P[700], 0.22), scrim: hexA(N[950], 0.7),
  device: N[950], deviceRing: N[800], statusInk: N[950], paper: WHITE, paperInk: '#111111',
  controlBorder: N[500], knob: WHITE, inverse: N[950], onInverse: N[50], photoScrim: hexA(N[950], 0.72), onPhoto: WHITE,
  photo: N[200], photo2: N[300], photoInk: N[700], chartMuted: P[500],
};
const dSurface = nd(0.205);
const dark = {
  bg: nd(0.17), surface: dSurface, surface2: nd(0.25), surfaceSunken: nd(0.14), surfaceSelected: mix(P[400], dSurface, 0.18), border: nd(0.29), borderStrong: nd(0.55),
  text: nd(0.95, 0.2), textSecondary: nd(0.77, 0.3), textFaint: nd(0.69, 0.3), textDisabled: nd(0.52, 0.3),
  primary: P[300], primaryHover: P[200], primaryPressed: P[400], primarySubtle: mix(P[400], dSurface, 0.16), primaryBorder: hexA(P[300], 0.38), primaryText: P[300], onPrimary: best(P[300], P[950], N[950], WHITE),
  accent: X[400], accentSubtle: mix(X[400], dSurface, 0.14), accentBorder: hexA(X[300], 0.38), accentText: X[200], onAccent: best(X[400], N[950], WHITE),
  alert: D[300], alertSubtle: mix(D[400], dSurface, 0.16), alertBorder: hexA(D[300], 0.42), alertText: D[300], onAlert: best(D[300], D[950], N[950]),
  warning: W[300], warningSubtle: mix(W[400], dSurface, 0.14), warningBorder: hexA(W[300], 0.4), warningText: W[300],
  success: G[300], successSubtle: mix(G[400], dSurface, 0.14), successBorder: hexA(G[300], 0.38), successText: G[300],
  info: I[300], infoSubtle: mix(I[400], dSurface, 0.14), infoBorder: hexA(I[300], 0.4), infoText: I[300],
  neutralSubtle: nd(0.27), focus: P[300], focusHalo: hexA(P[300], 0.32), scrim: 'rgba(0,0,0,0.70)',
  device: nd(0.12), deviceRing: nd(0.26), statusInk: nd(0.95, 0.2), paper: WHITE, paperInk: '#111111',
  controlBorder: nd(0.55), knob: nd(0.95, 0.2), inverse: nd(0.27), onInverse: nd(0.95, 0.2), photoScrim: hexA(nd(0.14), 0.72), onPhoto: WHITE,
  photo: nd(0.3), photo2: nd(0.36), photoInk: nd(0.77, 0.3), chartMuted: P[600],
};
const themes = { light: { ...light, ...((A.themeOverrides || {}).light || {}) }, dark: { ...dark, ...((A.themeOverrides || {}).dark || {}) } };

// category tokens (row groups, category chips, charts by category) — per theme: bg / border / text / bar
const cat = { light: {}, dark: {} };
for (const k of Object.keys(A.cats || {})) { const r = scales['cat_' + k]; cat.light[k] = { bg: r[100], border: r[200], text: r[800], bar: r[500] }; cat.dark[k] = { bg: mix(r[400], themes.dark.surface, 0.16), border: r[700], text: r[200], bar: r[400] }; }
// chart series: every series ≥ 3:1 on the surface and ≥ 10 ΔE apart (checked below)
const chart = A.chart || { light: [P[700], X[600], N[500]], dark: [P[300], X[300], N[500]] };

const type = {
  fontsHref: A.type.fontsHref, family: A.type.family,
  // [size, lineHeight, weight, tracking]. Arabic: +4px line-height on text roles, +1px size (13px floor), tracking 0, never uppercase.
  scale: {
    brandXL: [40, 44, 600, '-0.01em'], brand: [28, 32, 600, '-0.005em'],
    display: [32, 38, 600, '-0.01em'], title: [24, 30, 600, '-0.01em'], h2: [20, 26, 600, '-0.005em'], h3: [16, 22, 600, '0'],
    body: [15, 22, 400, '0'], bodyStrong: [15, 22, 500, '0'], bodySm: [13, 18, 400, '0'], label: [12, 16, 500, '0.04em'], caption: [12, 16, 400, '0'],
    overline: [11, 14, 600, '0.06em'], tab: [11, 14, 500, '0'],
    moneyXL: [32, 36, 600, '-0.01em'], moneyL: [18, 24, 600, '0'], money: [15, 22, 500, '0'],
    mono: [13, 18, 500, '0'], monoSm: [12, 16, 500, '0'], ...(A.type.scale || {}) },
  arLineBoost: 4, arSizeBoost: 1, arFloor: 13 };
const space = { 0: 0, 0.5: 2, 1: 4, 1.5: 6, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64 };
const radius = { none: 0, xs: 4, sm: 6, md: 8, lg: 12, xl: 16, full: 9999, ...(A.radius || {}) };
// targets: 44 px minimum on touch; desktop controls 40 px; the phone sticky action is 56 px
const touch = { phoneMin: 44, desktopControl: 40, controlSm: 32, control: 40, controlLg: 48, controlXl: 56, rowPhone: 56, rowDesktop: 48, tabBar: 64, topBarPhone: 56, topBarDesktop: 56, sidebar: 240, sidebarCollapsed: 64, rail: 88, stickyAction: 56 };
const device = { phone: { w: 390, h: 844, radius: 55, status: 54, home: 34, name: 'iPhone 15' }, tablet: { w: 1194, h: 834, radius: 30, status: 24, home: 20, name: 'iPad Pro 11″ · landscape' }, desktop: { w: 1440, h: 900, radius: 12, chrome: 44, name: 'Browser · 1440 × 900' } };
const ink = themes.light.text;
const elevation = { light: { 0: 'none', 1: `0 1px 2px ${hexA(ink, 0.08)}`, 2: `0 4px 16px ${hexA(ink, 0.12)}, 0 1px 3px ${hexA(ink, 0.08)}`, 3: `0 8px 24px ${hexA(ink, 0.14)}, 0 2px 6px ${hexA(ink, 0.08)}`, 4: `0 16px 48px ${hexA(ink, 0.16)}, 0 2px 6px ${hexA(ink, 0.08)}` },
  dark: { 0: 'none', 1: '0 1px 2px rgba(0,0,0,0.40)', 2: '0 4px 16px rgba(0,0,0,0.60), 0 1px 3px rgba(0,0,0,0.40)', 3: '0 8px 24px rgba(0,0,0,0.62)', 4: '0 16px 48px rgba(0,0,0,0.70), 0 2px 6px rgba(0,0,0,0.50)' } };
const border = { hairline: '1px', default: '1px', strong: '1.5px', focus: '2px', focusOffset: '2px' };
const motion = { duration: { instant: 0, fast: 120, base: 200, slow: 260, sheet: 260, pulse: 1600 }, easing: { standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)', enter: 'cubic-bezier(0, 0, 0, 1)', exit: 'cubic-bezier(0.4, 0, 1, 1)' }, reducedMotion: 'all durations → 0; no transforms' };
const z = { base: 0, sticky: 10, nav: 20, popover: 30, overlay: 40, dialog: 50, toast: 60, tooltip: 70 };

// ── Contrast report (alpha tokens composited over the surface they sit on) ───
const REQUIRED = Object.keys(light);
const rgbaParse = v => { const m = v.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/); return m ? { c: [+m[1], +m[2], +m[3]].map(x => x / 255), a: +m[4] } : null; };
const solid = (v, under) => { if (v.startsWith('#')) return v; const p = rgbaParse(v); if (!p) return null; const u = hex2rgb(under); return rgb2hex(p.c.map((x, i) => x * p.a + u[i] * (1 - p.a))); };
const pairs = [['text', 'bg'], ['text', 'surface'], ['text', 'surface2'], ['text', 'surfaceSunken'], ['textSecondary', 'bg'], ['textSecondary', 'surface'], ['textSecondary', 'surface2'], ['textSecondary', 'surfaceSunken'], ['textFaint', 'surface'], ['textFaint', 'surfaceSunken'],
  ['primaryText', 'surface'], ['primaryText', 'bg'], ['primaryText', 'primarySubtle'], ['onPrimary', 'primary'], ['onPrimary', 'primaryHover'], ['onPrimary', 'primaryPressed'],
  ['accentText', 'surface'], ['accentText', 'accentSubtle'], ['onAccent', 'accent'], ['alertText', 'surface'], ['alertText', 'alertSubtle'], ['onAlert', 'alert'],
  ['warningText', 'surface'], ['warningText', 'warningSubtle'], ['successText', 'surface'], ['successText', 'successSubtle'], ['infoText', 'surface'], ['infoText', 'infoSubtle'],
  ['text', 'neutralSubtle'], ['textSecondary', 'neutralSubtle'], ['onInverse', 'inverse'], ['text', 'surfaceSelected'], ['primaryText', 'surfaceSelected'], ['photoInk', 'photo'], ['textDisabled', 'surface']];
const ntPairs = [['controlBorder', 'surface'], ['controlBorder', 'surface2'], ['borderStrong', 'surface'], ['focus', 'surface'], ['focus', 'bg'], ['chartMuted', 'surface'], ['primary', 'surface'], ['accent', 'surface'], ['alert', 'surface'], ['warning', 'surface'], ['success', 'surface'], ['info', 'surface']];
const report = {}, nonText = {}, fails = [];
for (const t of ['light', 'dark']) {
  const T = themes[t];
  const miss = REQUIRED.filter(k => T[k] == null); if (miss.length) fails.push(`${t} missing theme keys: ${miss.join(', ')}`);
  report[t] = pairs.map(([f, b]) => { const bv = solid(T[b], T.surface); const r = contrast(solid(T[f], bv), bv); return { fg: f, bg: b, bgHex: bv, ratio: +r.toFixed(2), aa: r >= 4.5, aaLarge: r >= 3 }; });
  nonText[t] = [...ntPairs.map(([f, b]) => { const r = contrast(solid(T[f], T.surface), solid(T[b], T.surface)); return { fg: f, bg: b, ratio: +r.toFixed(2), pass: r >= 3 }; }),
    ...chart[t].map((c, i) => { const r = contrast(c, T.surface); return { fg: `chart[${i}]`, bg: 'surface', ratio: +r.toFixed(2), pass: r >= 3 }; })];
}
const catContrast = { light: {}, dark: {} }; for (const t of ['light', 'dark']) for (const [k, v] of Object.entries(cat[t])) catContrast[t][k] = +contrast(v.text, v.bg).toFixed(2);
const minPair = list => { let m = 1e9, p = null; for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) { const d = dE(list[i][1], list[j][1]); if (d < m) { m = d; p = [list[i][0], list[j][0]]; } } return { dE: list.length > 1 ? m : null, pair: p }; };
const distinct = {}; for (const t of ['light', 'dark']) distinct[t] = { categories: minPair(Object.entries(cat[t]).map(([k, v]) => [k, v.bar])), chart: minPair(chart[t].map((c, i) => [String(i), c])) };
const scaleContrast = {}; for (const [k, s] of Object.entries(scales)) { scaleContrast[k] = {}; for (const st of STEPS) scaleContrast[k][st] = { onSurface: +contrast(s[st], themes.light.surface).toFixed(2), onBg: +contrast(s[st], themes.light.bg).toFixed(2), onDarkBg: +contrast(s[st], themes.dark.bg).toFixed(2) }; }
for (const t of ['light', 'dark']) for (const p of report[t]) if (!p.aa && p.fg !== 'textDisabled') fails.push(`${t} ${p.fg}/${p.bg} ${p.ratio}`);
for (const t of ['light', 'dark']) for (const p of nonText[t]) if (!p.pass) fails.push(`${t} non-text ${p.fg}/${p.bg} ${p.ratio}`);
for (const t of ['light', 'dark']) for (const [k, v] of Object.entries(catContrast[t])) if (v < 4.5) fails.push(`${t} cat ${k} ${v}`);
for (const t of ['light', 'dark']) { const d = distinct[t]; if (d.categories.dE != null && d.categories.dE < 7) fails.push(`${t} categories too close: ${d.categories.pair} ${d.categories.dE}`); if (d.chart.dE != null && d.chart.dE < 10) fails.push(`${t} chart series too close: ${d.chart.pair} ${d.chart.dE}`); }

// ── Emit ─────────────────────────────────────────────────────────────────────
const TOKENS = { name: A.name, version: A.version || '1.0.0', scales, themes, cat, catMap: Object.keys(A.cats || {}), chart, type, space, radius, touch, device, elevation, border, motion, z, contrast: { pairs: report, nonText, cat: catContrast.light, catDark: catContrast.dark, distinct, scales: scaleContrast } };
fs.writeFileSync('tokens.json', JSON.stringify(TOKENS, null, 2));
fs.writeFileSync('tokens.js', `// ${A.name} design tokens v${TOKENS.version} — GENERATED by build-tokens.mjs, do not hand-edit.\nexport const TOKENS = ${JSON.stringify(TOKENS, null, 2)};\nexport const LIGHT = TOKENS.themes.light;\nexport const DARK = TOKENS.themes.dark;\nexport default TOKENS;\n`);
const kebab = s => s.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
let css = `/* ${A.name} design tokens v${TOKENS.version} — GENERATED by build-tokens.mjs */\n:root{\n`;
for (const [k, s] of Object.entries(scales)) for (const st of STEPS) css += `  --bk-${kebab(k).replace('_', '-')}-${st}:${s[st]};\n`;
for (const [k, v] of Object.entries(type.family)) css += `  --bk-font-${kebab(k)}:${v};\n`;
for (const [k, [fs_, lh, w, tr]] of Object.entries(type.scale)) css += `  --bk-text-${kebab(k)}:${w} ${fs_}px/${lh}px var(--bk-font-${k.startsWith('mono') ? 'mono' : 'ui'});\n  --bk-tracking-${kebab(k)}:${tr};\n`;
for (const [k, v] of Object.entries(space)) css += `  --bk-space-${String(k).replace('.', '_')}:${v}px;\n`;
for (const [k, v] of Object.entries(radius)) css += `  --bk-radius-${k}:${v}px;\n`;
for (const [k, v] of Object.entries(touch)) css += `  --bk-${kebab(k)}:${v}px;\n`;
for (const [k, v] of Object.entries(border)) css += `  --bk-border-${kebab(k)}:${v};\n`;
for (const [k, v] of Object.entries(motion.duration)) css += `  --bk-dur-${k}:${v}ms;\n`;
for (const [k, v] of Object.entries(motion.easing)) css += `  --bk-ease-${k}:${v};\n`;
for (const [k, v] of Object.entries(z)) css += `  --bk-z-${k}:${v};\n`;
const themeBlock = t => Object.entries(themes[t]).map(([k, v]) => `  --bk-${kebab(k)}:${v};`).join('\n') + '\n' + Object.entries(elevation[t]).map(([k, v]) => `  --bk-elevation-${k}:${v};`).join('\n') + '\n' + Object.entries(cat[t]).map(([k, v]) => Object.entries(v).map(([p, x]) => `  --bk-cat-${k}-${p}:${x};`).join('\n')).join('\n');
css += themeBlock('light') + `\n}\n@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){\n${themeBlock('dark')}\n}}\n:root[data-theme="dark"]{\n${themeBlock('dark')}\n}\n@media (prefers-reduced-motion: reduce){:root{--bk-dur-fast:0ms;--bk-dur-base:0ms;--bk-dur-slow:0ms;--bk-dur-sheet:0ms;}}\n`;
fs.writeFileSync('tokens.css', css);
if (fails.length) { console.error('CONTRAST FAILS (fix anchors.mjs, or override the theme key in themeOverrides):\n  ' + fails.join('\n  ')); process.exitCode = 1; }
else console.log(`${A.name}: contrast OK — text pairs ≥ 4.5:1, non-text ≥ 3:1 (light + dark, alpha composited) · category ΔE ≥ ${distinct.light.categories.dE == null ? 'n/a' : Math.min(distinct.light.categories.dE, distinct.dark.categories.dE)} · chart ΔE ≥ ${Math.min(distinct.light.chart.dE, distinct.dark.chart.dE)}`);
