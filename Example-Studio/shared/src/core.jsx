/* Core — tokens, theme + language contexts, bilingual formatters, type, icons, the project wordmark.
 * Inlined first after the fixture by shared/build.sh. Every board (and the design-system board) shares this file.
 *
 * Language model: every device frame is rendered twice, under <LangCtx lang="ar"> (RTL) and "en" (LTR).
 * Components never hard-code a language: they call useL() and write $('عربي', 'English') or tr(fixtureObj).
 * Layout uses logical properties (paddingInlineStart, insetInlineEnd, borderInlineStart, textAlign:'start')
 * so the Arabic frame mirrors without a second layout. Icons with direction carry a mirror flag (MIRROR set).
 * Project data comes from the fixture global FX (shared/src/fixture.js): FX.project, FX.now, FX.cur, FX.currencies,
 * FX.MONTHS / MONTHS_SHORT / DAYS / DAYS_SHORT, FX.person(id), FX.user, FX.status.
 */
const { useState, useContext, createContext, useEffect, useRef, Fragment } = React;

const AVINITI_LOGO = "/*__LOGO__*/";
const TOKENS = /*__TOKENS__*/;
const ThemeCtx = createContext(null);
const LangCtx = createContext({ lang: 'en' });
const mkTheme = n => ({ name: n, ...TOKENS.themes[n], el: TOKENS.elevation[n], cat: TOKENS.cat[n], chart: TOKENS.chart[n], S: TOKENS.scales });
const R = TOKENS.radius, SP = TOKENS.space, TOUCH = TOKENS.touch, DEV = TOKENS.device;
const FONT = TOKENS.type.family.ui, FONT_AR = TOKENS.type.family.ar, DISPLAY = TOKENS.type.family.display, DISPLAY_AR = TOKENS.type.family.displayAr, MONO = TOKENS.type.family.mono;
const useC = () => useContext(ThemeCtx);

// ── Bilingual helpers ─────────────────────────────────────────────────────────
const pad2 = n => String(n).padStart(2, '0');
const fmtNum = (v, dec = 0) => Number(v).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const curDec = code => (FX.currencies.find(c => c.code === code) || { dec: 2 }).dec;
// Bidi: inside Arabic strings every figure (signed, decimal, %, grouped phone digits, codes like ORD-1042, ranges like
// 16:00–18:00) is wrapped in an LTR isolate, so "−15.000", "15%" and "079 555 0142" read the same as <Money/> and <Num/> do.
const LRI = '⁦', PDI = '⁩';
const AR_CHARS = /[؀-ۿ]/;
const CUR_CODES = '(?:' + FX.currencies.map(c => c.code).join('|') + ')';
const NUM_TOKEN = new RegExp('(?<![\\w\\-./:#\\u2066])((?:' + CUR_CODES + ' )?(?:[A-Z]{1,5}-)?[\\u2212+\\-]?\\d(?:[\\d.,:/]|[-\\u2013](?=\\d))*(?: \\d(?:[\\d.,:/]|[-\\u2013](?=\\d))*)*%?)', 'g');
// Only wraps figures outside segments that are already isolated (LRI…PDI), so iso('1–17') inside Arabic copy is left alone.
const bidiAr = s => (typeof s === 'string' && AR_CHARS.test(s) && /\d/.test(s)) ? s.split(/(⁦[^⁩]*⁩)/).map(seg => seg.startsWith(LRI) ? seg : seg.replace(NUM_TOKEN, LRI + '$1' + PDI)).join('') : s;
const iso = s => LRI + s + PDI;
// Arabic counting: 1 → singular, 2 → dual, 3–10 → plural, 11+ → singular accusative-style (Levantine UI usage).
const arCount = (n, one, two, few, many) => (n === 1 ? one : n === 2 ? two : n >= 3 && n <= 10 ? `${n} ${few}` : `${n} ${many}`);
const useL = () => {
  const { lang } = useContext(LangCtx);
  const isAr = lang === 'ar';
  const $ = (ar, en) => (isAr ? bidiAr(ar) : en);
  const tr = o => (o == null ? '' : typeof o === 'string' ? bidiAr(o) : typeof o === 'number' ? o : isAr ? bidiAr(o.ar) : o.en);
  const cur = FX.cur; // project base currency; pass another code to money()
  // money string (plain text contexts: messages, receipts, chips). In UI prefer <Money/>. Code first in both languages,
  // the whole thing an LTR isolate: "JOD 35.000" / "USD 49.00" / "JOD −12.000".
  const money = (v, code = FX.cur, dec) => { const d = dec != null ? dec : curDec(code); const s = (v < 0 ? '−' : '') + fmtNum(Math.abs(v), d); return iso(`${code} ${s}`); };
  const time = hm => { if (hm && typeof hm === 'object') return tr(hm); if (!hm || !/^\d{1,2}:\d{2}$/.test(hm)) return hm; let [h, m] = hm.split(':').map(Number); const pm = h >= 12; const h12 = ((h + 11) % 12) + 1; return `${h12}:${pad2(m)} ${isAr ? (pm ? 'م' : 'ص') : (pm ? 'pm' : 'am')}`; };
  const date = (iso_, o = {}) => { const d = new Date(iso_ + 'T12:00:00'); const m = (o.long ? FX.MONTHS : FX.MONTHS_SHORT)[lang][d.getMonth()]; const dw = (o.short ? FX.DAYS_SHORT : FX.DAYS)[lang][d.getDay()]; const core = `${d.getDate()} ${m}`; return (o.dow ? `${dw} ` : '') + core + (o.year ? ` ${d.getFullYear()}` : ''); };
  const dmy = iso_ => { const [y, m, d] = iso_.split('-'); return `${d}/${m}/${y}`; };
  const ago = min => { if (min < 60) return isAr ? 'قبل ' + arCount(min, 'دقيقة', 'دقيقتين', 'دقائق', 'دقيقة') : `${min} min ago`; const h = Math.round(min / 60); return isAr ? 'قبل ' + arCount(h, 'ساعة', 'ساعتين', 'ساعات', 'ساعة') : `${h} h ago`; };
  const dur = min => { const h = Math.floor(min / 60), m = min % 60; return isAr ? [h ? `${h} س` : '', m ? `${m} د` : ''].filter(Boolean).join(' ') : [h ? `${h} h` : '', m ? `${m} min` : ''].filter(Boolean).join(' '); };
  // count(n, {ar:[one, two, few, many], en:[one, many]}) — grammatical counts in both languages
  const count = (n, f) => (isAr ? arCount(n, ...f.ar) : `${n} ${n === 1 ? f.en[0] : f.en[1]}`);
  // dt('2026-11-12 17:00') → '12 Nov 17:00' (date then 24-hour time)
  const t24 = hm => (hm && /^\d{1,2}:\d{2}$/.test(hm)) ? iso(hm.padStart(5, '0')) : hm;
  const dt = (s_, o = {}) => { if (!s_) return ''; const [d_, t_] = s_.split(' '); return `${date(d_, o)}${t_ ? ' ' + t24(t_) : ''}`; };
  return { lang, isAr, dir: isAr ? 'rtl' : 'ltr', $, tr, cur, money, time, t24, date, dt, dmy, ago, dur, num: fmtNum, iso, count };
};
const LangProvider = ({ lang, children }) => <LangCtx.Provider value={{ lang }}>{children}</LangCtx.Provider>;

// ── Type ──────────────────────────────────────────────────────────────────────
// ts(role, isAr): Arabic gets +4px line-height on text roles, +1px size (13px floor), zero tracking, never uppercase.
const ts = (k, isAr) => {
  const [s, l, w, tr] = TOKENS.type.scale[k];
  const fam = k.startsWith('mono') ? MONO : k.startsWith('brand') ? (isAr ? DISPLAY_AR : DISPLAY) : FONT;
  const textRole = !k.startsWith('money') && !k.startsWith('mono') && !k.startsWith('brand');
  const fs = isAr && textRole ? Math.max(TOKENS.type.arFloor, s + TOKENS.type.arSizeBoost) : s;
  return { fontSize: fs, lineHeight: (l + (isAr && textRole ? TOKENS.type.arLineBoost : 0)) + 'px', fontWeight: w, letterSpacing: isAr ? 0 : tr, fontFamily: fam, ...(k.startsWith('money') || k.startsWith('mono') ? { fontVariantNumeric: 'tabular-nums' } : null) };
};
// <Tx r="h2" c={C.textSecondary}>…</Tx> — the only way screens set text styles.
const Tx = ({ r = 'body', c, as = 'span', upper, style, children, ...p }) => {
  const C = useC(); const { isAr } = useL(); const El = as;
  return <El {...p} style={{ ...ts(r, isAr), color: c || C.text, ...(upper && !isAr ? { textTransform: 'uppercase' } : null), ...style }}>{children}</El>;
};
// Overline: uppercase tracked in English, plain in Arabic.
const Over = ({ children, c, style }) => { const C = useC(); return <Tx r="overline" upper c={c || C.textSecondary} style={{ display: 'block', ...style }}>{children}</Tx>; };

// ── Icons — 24 grid, 1.75 stroke. Names in MIRROR flip in RTL. ────────────────
const ICONS = {
  wrench: 'M14.7 6.3a4 4 0 0 0 5 5L13 18a2.1 2.1 0 0 1-3-3l6.7-6.7zM3 21l6-6',
  ban: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM5.6 5.6l12.8 12.8',
  zoomIn: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4-4M11 8v6M8 11h6',
  paperclip: 'm21.4 11.1-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5',
  languages: 'm5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6',
  trash: 'M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6',
  externalLink: 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
  panelLeft: 'M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 3v18',
  grip: 'M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01',
  columns: 'M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 3v18M15 3v18',
  dashboard: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  calClock: 'M21 11V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h6M3 10h18M8 2v4M16 2v4M17.5 15.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM17.5 17.5v1.5l1 1',
  store: 'M3 9l1.5-5h15L21 9M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 11v10h14V11M9 21v-6h6v6',
  arrowUpRight: 'M7 17 17 7M8 7h9v9',
  share: 'M18 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM6 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM18 15a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
  settings: 'M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  timerOff: 'M10 2h4M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 11.3 0M12 9v4M2 2l20 20M19.4 13a8 8 0 0 0-10-9.5',
  cameraOff: 'M2 2l20 20M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14M9.5 4h5L16.5 7H20a2 2 0 0 1 2 2v7.5M9.9 9.9a3.5 3.5 0 0 0 4.9 4.9',
  calendarX: 'M5 4.5h14a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2zM3 9.5h18M8 2.5v4M16 2.5v4M10 13l4 4M14 13l-4 4',
  mapPin: 'M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12zM12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  building2: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18zM6 12H4a2 2 0 0 0-2 2v8h4M18 9h2a2 2 0 0 1 2 2v11h-4M10 6h1M13 6h1M10 10h1M13 10h1M10 14h1M13 14h1M10 18h4',
  moreH: 'M5 12h.01M12 12h.01M19 12h.01',
  bellOff: 'M8.7 3A6 6 0 0 1 18 8a21 21 0 0 0 .6 5M17 17H3s3-2 3-9a4.7 4.7 0 0 1 .3-1.7M10.3 21a1.94 1.94 0 0 0 3.4 0M2 2l20 20',
  cheque: 'M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM6 10h6M6 14h4M15 13.5h3',
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  calendar: 'M5 4.5h14a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2zM3 9.5h18M8 2.5v4M16 2.5v4',
  calCheck: 'M5 4.5h14a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2zM3 9.5h18M8 2.5v4M16 2.5v4M9 15l2 2 4-4',
  ticket: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 0 0 5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.5a2.5 2.5 0 0 0 0-5zM14.5 5v2M14.5 11v2M14.5 17v2',
  ticketPlus: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 0 0 5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.5a2.5 2.5 0 0 0 0-5zM12 9v6M9 12h6',
  receipt: 'M5 3h14v18l-2.3-1.5L14.3 21 12 19.5 9.7 21l-2.4-1.5L5 21zM9 8h6M9 12h6M9 16h3.5',
  cash: 'M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM12 9.25a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5zM6 12h.01M18 12h.01',
  card: 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM2 10h20M6 15h4',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2.5v2.5H14zM18.5 14H20M14 18.5V20h2.5M18.5 18.5H20V20h-1.5',
  wallet: 'M19 7V5.5A1.5 1.5 0 0 0 17.5 4H5a2 2 0 0 0 0 4h14.5A1.5 1.5 0 0 1 21 9.5V12h-3.5a2 2 0 0 0 0 4H21v2.5a1.5 1.5 0 0 1-1.5 1.5H5a2 2 0 0 1-2-2V6',
  coins: 'M9 3a6 6 0 1 1 0 12A6 6 0 0 1 9 3zM18.1 10.4a6 6 0 1 1-7.7 7.7M7.5 6.5H9v5',
  bank: 'M3 21h18M5 21v-10M9.5 21v-10M14.5 21v-10M19 21v-10M2.5 10 12 3.5l9.5 6.5z',
  users: 'M9 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M21.5 20a6.5 6.5 0 0 0-4-6',
  user: 'M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM4 21a8 8 0 0 1 16 0',
  userPlus: 'M10 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM2 21a8 8 0 0 1 13.5-5.8M19 14v6M16 17h6',
  search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4-4',
  plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', x: 'M6 6l12 12M18 6 6 18', check: 'm5 12.5 4.5 4.5L19 7',
  checkCircle: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM8 12.5l3 3 5-6',
  checks: 'm2 12.5 4 4 8.5-9.5M10.5 15l1.5 1.5L21 7',
  alert: 'M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
  alertCircle: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 8v4.5M12 16h.01',
  info: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 11v5M12 8h.01',
  help: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM9.5 9.5a2.5 2.5 0 0 1 4.9.7c0 1.7-2.4 2.1-2.4 3.6M12 17h.01',
  lock: 'M6.5 10.5h11a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-6.5a2 2 0 0 1 2-2zM8 10.5V7a4 4 0 0 1 8 0v3.5',
  unlock: 'M6.5 10.5h11a2 2 0 0 1 2 2V19a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-6.5a2 2 0 0 1 2-2zM8 10.5V7a4 4 0 0 1 7.6-1.7',
  key: 'M7.5 10a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zM11.4 11.6 21 2M15.5 7.5l3 3L22 7l-3-3',
  clock: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM12 7v5l3 2',
  timer: 'M12 5a8 8 0 1 1 0 16 8 8 0 0 1 0-16zM12 9v4l2.5 1.5M10 2h4',
  hourglass: 'M6 2h12M6 22h12M7 2v4a5 5 0 0 0 10 0V2M7 22v-4a5 5 0 0 1 10 0v4',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  sliders: 'M3 6h11M18 6h3M3 12h5M12 12h9M3 18h13M20 18h1M16 4v4M10 10v4M18 16v4',
  chevR: 'm9 6 6 6-6 6', chevL: 'm15 6-6 6 6 6', chevD: 'm6 9 6 6 6-6', chevU: 'm18 15-6-6-6 6',
  arrowR: 'M5 12h14M13 6l6 6-6 6', arrowL: 'M19 12H5M11 6l-6 6 6 6', arrowUp: 'M12 19V5M6 11l6-6 6 6', arrowDown: 'M12 5v14M6 13l6 6 6-6',
  sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
  crown: 'M2.5 7.5 7 11l5-6.5 5 6.5 4.5-3.5L19 18H5zM5 21h14',
  gift: 'M4 8h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM12 8v13M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5',
  tag: 'M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4zM7.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z',
  percent: 'M19 5 5 19M6.5 4a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM17.5 15a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z',
  camera: 'M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5zM12 9.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z',
  image: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM21 15l-3.1-3.1a2 2 0 0 0-2.8 0L6 21',
  whatsapp: 'M3.5 20.5l1.3-4.3A8.5 8.5 0 1 1 8 19.5zM9 8.4c0 3.6 3 6.6 6.6 6.6l1.1-1.6-2.1-1-1 .9a4.6 4.6 0 0 1-2.9-2.9l.9-1-1-2.1z',
  printer: 'M6 9V3h12v6M5 9h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M7 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2M7 14h10v7H7z',
  wifiOff: 'M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5.2-2.7M19 13a10 10 0 0 0-2.1-1.6M2 8.8a15 15 0 0 1 4.2-2.7M22 8.8a15 15 0 0 0-11.3-3.7M12 20h.01',
  wifi: 'M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 8.8a15 15 0 0 1 20 0M12 20h.01',
  sync: 'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5',
  cloudCheck: 'M17.5 19H8a6 6 0 1 1 5.7-8h1.8a4 4 0 0 1 2 8zM9.5 14l2 2 3.5-3.5',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  shieldCheck: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  eyeOff: 'M3 3l18 18M10.6 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.2 3.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2',
  history: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3.5 2',
  filter: 'M3 5h18l-7 8.5V20l-4-2v-4.5z',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z',
  message: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
  login: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  door: 'M13 4h3a2 2 0 0 1 2 2v14M2 20h3M13 20h9M10 12v.01M13 4.6v16.8a.5.5 0 0 1-.6.5L5 20V5.6a1 1 0 0 1 .8-1l6.6-1.5a.5.5 0 0 1 .6.5z',
  box: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  truck: 'M2 6h12v10H2zM14 9h4l4 4v3h-8M6 16a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM18 16a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  chart: 'M3 3v18h18M8 16v-5M13 16V8M18 16V9',
  trendUp: 'm3 17 6-6 4 4 8-8M15 7h6v6', trendDown: 'm3 7 6 6 4-4 8 8M15 17h6v-6',
  building: 'M5 2h14a1 1 0 0 1 1 1v19H4V3a1 1 0 0 1 1-1zM9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01',
  idcard: 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM5 16.5a3 3 0 0 1 6 0M14 10h5M14 14h3',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5',
  clipboard: 'M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 14l2 2 4-4',
  pen: 'M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  droplet: 'M12 2.7s7 7.3 7 12.3a7 7 0 0 1-14 0c0-5 7-12.3 7-12.3z',
  flask: 'M9 3h6M10 3v6L4.5 19A1.5 1.5 0 0 0 5.8 21h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7 15h10',
  more: 'M5 12h.01M12 12h.01M19 12h.01', moreV: 'M12 5h.01M12 12h.01M12 19h.01', menu: 'M3 6h18M3 12h18M3 18h18',
  globe: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  sun: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  star: 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z',
  link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  undo: 'M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
  credit: 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM12 9v6M9 12h6',
  split: 'M16 3h5v5M8 3H3v5M21 3l-7 7M3 3l7 7M12 14v7',
  backspace: 'M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM18 9l-6 6M12 9l6 6',
  queue: 'M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1',
  fingerprint: 'M2 12a10 10 0 0 1 18-6M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .3-2M17.3 21.5c.2-1 .7-3.4.7-7.5a6 6 0 0 0-1-3.3M12 10a2 2 0 0 0-2 2c0 3-.6 5.6-1.6 7.5M14 12c0 2.6-.3 5-1 7M22 16c.2-1 .3-2.4.3-4',
  tablet: 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01',
  smartphone: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM12 18h.01',
  download: 'M12 3v12M7 10l5 5 5-5M5 21h14', upload: 'M12 21V9M7 14l5-5 5 5M5 3h14',
  scan: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 8v8M10 8v8M13.5 8v8M17 8v8',
  pause: 'M7 4h3v16H7zM14 4h3v16h-3z', play: 'M6 4l14 8-14 8z',
  note: 'M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5zM15 3v6h6',
  inbox: 'M22 12h-6l-2 3h-4l-2-3H2M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z',
  briefcase: 'M4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3',
  plane: 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z',
  layers: 'M12 2l10 5-10 5L2 7zM2 12l10 5 10-5M2 17l10 5 10-5',
  hash: 'M4 9h16M4 15h16M10 3 8 21M16 3l-2 18',
  pin: 'M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12zM12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  flag: 'M4 22V4M4 4h13l-2 4 2 4H4',
  zap: 'M13 2 3 14h9l-1 8 10-12h-9z',
  copy: 'M9 9h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  table: 'M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM3 9h18M3 15h18M9 9v12',
  equal: 'M5 9h14M5 15h14',
  scale: 'M12 3v18M7 21h10M5 7h14M5 7l-3 7a4 4 0 0 0 6 0zM19 7l-3 7a4 4 0 0 0 6 0z',
  leaf: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10zM2 21c0-3 1.9-5.4 5.1-6',
  sprout: 'M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8zM14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z',
  cart: 'M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM2 2h3l2.7 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6',
  heart: 'M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z',
};// Mirrored in Arabic. Brand marks (whatsapp) never mirror. Icons that contain digits get a hand-drawn RTL variant in
// ICONS_RTL instead of a flip, so the 1 and 2 of "queue" do not come out backwards.
const MIRROR = new Set(['chevR', 'chevL', 'arrowR', 'arrowL', 'arrowUpRight', 'send', 'login', 'logout', 'undo', 'backspace', 'list', 'trendUp', 'trendDown', 'door', 'message', 'flag', 'history', 'truck', 'externalLink', 'panelLeft', 'cart']);
const ICONS_RTL = { queue: 'M3 6h11M3 12h11M3 18h11M19 6h1v4M19 10h2M21 18h-2c0-1 2-2 2-3s-1-1.5-2-1' };
const warned = new Set();
const Ic = ({ n, s = 22, c = 'currentColor', w = 1.75, style, fill }) => {
  const { isAr } = useL();
  if (!ICONS[n] && !warned.has(n)) { warned.add(n); console.warn(`Ic: unknown icon "${n}" (rendered as help)`); }
  const d = (isAr && ICONS_RTL[n]) || ICONS[n] || ICONS.help;
  const fat = n === 'more' || n === 'moreV';
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={fill || 'none'} stroke={c} strokeWidth={fat ? 3 : w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ flexShrink: 0, display: 'block', transform: isAr && MIRROR.has(n) ? 'scaleX(-1)' : undefined, ...style }}><path d={d} /></svg>
  );
};

// ── Project wordmark ─────────────────────────────────────────────────────────
// Generic stand-in until the client's logo is drawn: the project name from FX.project in the display face (Arabic name in
// the Arabic display face when lang="ar" or ar is set). Monogram = first letter on a rounded tile (favicon, app icon).
// Logos are exempt from text-contrast rules (they read as one image).
const Monogram = ({ s = 32, bg, ink, radius, style }) => {
  const C = useC(); const ch = (FX.project.name || '?').trim().charAt(0).toUpperCase();
  return <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label={FX.project.name} style={{ flexShrink: 0, display: 'block', ...style }}>
    <rect width="64" height="64" rx={radius != null ? radius : 16} fill={bg || C.primary} />
    <text x="32" y="33" textAnchor="middle" dominantBaseline="central" fontFamily={DISPLAY} fontWeight="600" fontSize="38" fill={ink || C.onPrimary}>{ch}</text>
  </svg>;
};
const monogramSvg = (bg, ink) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${bg}"/><text x="32" y="44" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="36" fill="${ink}">${(FX.project.name || '?').trim().charAt(0).toUpperCase()}</text></svg>`;
const Wordmark = ({ size = 40, ink, mark = true, markBg, markInk, ar, style }) => {
  const C = useC(); const { isAr } = useL(); const A_ = ar != null ? ar : isAr; const I_ = ink || C.text;
  const label = A_ ? (FX.project.nameAr || FX.project.name) : FX.project.name;
  return <span role="img" aria-label={label} style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.3, lineHeight: 1, ...style }}>
    {mark && <Monogram s={size * 1.15} bg={markBg} ink={markInk} />}
    <span aria-hidden="true" lang={A_ ? 'ar' : undefined} style={{ fontFamily: A_ ? DISPLAY_AR : DISPLAY, fontWeight: 600, fontSize: size, letterSpacing: A_ ? 0 : '-0.01em', color: I_, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{label}</span>
  </span>;
};

// deterministic pseudo-random for QR / patterns
const rng = seed => { let s = 0; for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
