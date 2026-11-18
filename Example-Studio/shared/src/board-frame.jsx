/* Board scaffolding (bilingual pairs, chapters, flows, canvas chrome).
 *
 * <ScreenFrame id name nameAr device v leadsTo callouts note chip url> children </ScreenFrame>
 *   Renders the SAME children twice: Arabic RTL (first) and English LTR, each in its own device frame.
 *   id → anchor s-<id>. v = 'v1'…'v4' (label override: FX.versions). device = 'phone' | 'tablet' | 'desktop'.
 *   callouts = [{ x:'62%', y:'18%', text, xAr?, yAr? }] positioned on the English frame; mirrored (100 − x) on Arabic
 *   unless xAr / yAr give an explicit Arabic position (use when the mirrored spot lands on text).
 *   leadsTo = ['2.3', 'B2:3.1'] → chips; same-board anchors or other boards via Boards/index.json.
 *   chip = optional short caption tag (e.g. a release or audience note).
 * <StateRow of="5.2" device items={[{ label, el }]} /> — state variants at reduced size, both languages.
 * <ChapterBand num name nameAr title lede lane screens layout> — narrative chapter (title = decision, lede = story, lane = rationale).
 * <FlowStrip name steps/> · <BoardIntro title sub points stats> · <BoardApp board title subtitle chapters index zoom0 url> · <BoardFoot>.
 */
(function () {
  const CHW = 3000; // chapter width: one desktop pair (2×1440 + gaps) or three phone pairs per row
  window.BOARD_INDEX = null;
  const resolve = (target) => {
    const index = window.BOARD_INDEX || [];
    if (target.includes(':')) {
      const [bid, sid] = target.split(':');
      const e = index.find(b => b.id === bid);
      if (!e) return { label: `${bid} · ${sid}`, href: null, built: false };
      const scr = (e.screens || []).find(s => s.id === sid);
      return { label: `${e.short || e.name} · ${sid}${scr ? ' ' + scr.name : ''}`, href: `${e.file}#s-${sid}`, built: e.status !== 'planned' };
    }
    return { label: target, href: `#s-${target}`, built: true };
  };
  const LeadsTo = ({ t }) => {
    const C = useC(); const r = resolve(t);
    const body = <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 24, padding: '0 10px', borderRadius: 12, border: `1px solid ${C.border}`, background: r.built ? C.surface : C.surface2, color: r.built ? C.primaryText : C.textSecondary, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', fontFamily: FONT }}><Ic n="arrowR" s={13} />{r.label}{!r.built && ' · not built'}</span>;
    return r.href && r.built ? <a href={r.href} style={{ textDecoration: 'none' }}>{body}</a> : body;
  };
  const Badge = ({ n, style }) => { const C = useC(); return <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: 13, display: 'inline-grid', placeItems: 'center', background: C.primary, color: C.onPrimary, fontFamily: MONO, fontSize: 13, fontWeight: 700, boxShadow: `0 0 0 3px ${C.surface}, ${C.el[3]}`, flexShrink: 0, ...style }}>{n}</span>; };
  const VerTag = ({ v }) => {
    const C = useC();
    const lab = (FX.versions && FX.versions[v]) || v;
    const m = { v1: [C.primary, C.onPrimary, lab], v2: [C.info, C.name === 'dark' ? C.text : C.paper, lab], v3: [C.accent, C.onAccent, lab], v4: [C.textSecondary, C.surface, lab] }[v] || [C.surface2, C.text, lab];
    return <span style={{ height: 22, padding: '0 8px', borderRadius: 6, background: C.name === 'dark' ? 'transparent' : m[0], border: `1.5px solid ${m[0]}`, color: C.name === 'dark' ? C.text : m[1], fontFamily: MONO, fontSize: 11.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>{m[2]}</span>;
  };
  const DEVS = { phone: { D: PhoneDevice, w: DEV.phone.w, h: DEV.phone.h, m: 13 }, tablet: { D: TabletDevice, w: DEV.tablet.w, h: DEV.tablet.h, m: 18 }, desktop: { D: DesktopDevice, w: DEV.desktop.w, h: DEV.desktop.h, m: 18 } };
  const Pair = ({ device, children, callouts = [], zoom, labels = true, url }) => {
    const C = useC(); const d = DEVS[device]; const D = d.D;
    return <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', zoom }}>
      {['ar', 'en'].map(lang => <div key={lang} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {labels && <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingInlineStart: d.m, height: 20 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: C.textSecondary }}>{lang === 'ar' ? 'AR · RTL' : 'EN · LTR'}</span>
          <span lang={lang} style={{ fontSize: 12, color: C.textSecondary, fontFamily: lang === 'ar' ? FONT_AR : FONT }}>{lang === 'ar' ? 'العربية' : 'English'}</span>
        </div>}
        <div style={{ position: 'relative', isolation: 'isolate' }}>
          <div style={{ position: 'relative', zIndex: 0, isolation: 'isolate' }}><LangProvider lang={lang}><D lang={lang} url={url}>{children}</D></LangProvider></div>
          {callouts.map((c, i) => { const x = parseFloat(c.x), y = parseFloat(lang === 'ar' && c.yAr != null ? c.yAr : c.y); const xa = lang === 'ar' ? (c.xAr != null ? parseFloat(c.xAr) : 100 - x) : x; const px = d.m + (xa / 100) * d.w, py = d.m + (y / 100) * d.h;
            return <Badge key={i} n={c.n || i + 1} style={{ position: 'absolute', left: Math.min(d.w + d.m - 14, Math.max(d.m + 14, px)), top: Math.min(d.h + d.m - 14, Math.max(d.m + 14, py)), transform: 'translate(-50%,-50%)', zIndex: 5, pointerEvents: 'none' }} />; })}
        </div>
      </div>)}
    </div>;
  };
  const ScreenFrame = ({ id, name, nameAr, device = 'phone', v = 'v1', chip, leadsTo = [], callouts = [], note, children, role, url }) => {
    const C = useC();
    return <figure id={`s-${id}`} style={{ margin: 0, scrollMarginTop: 110, width: 'fit-content' }}>
      <figcaption style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, paddingInlineStart: DEVS[device].m, flexWrap: 'wrap', maxWidth: device === 'phone' ? 840 : undefined }}>
        <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: C.primaryText }}>{id}</span>
        <span style={{ fontSize: 16, fontWeight: 650, color: C.text, fontFamily: FONT }}>{name}</span>
        {nameAr && <span lang="ar" style={{ fontSize: 15, color: C.textSecondary, fontFamily: FONT_AR }}>{nameAr}</span>}
        <VerTag v={v} />
        {chip && <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 700, padding: '2px 8px', borderRadius: 999, border: `1px solid ${C.border}`, color: C.textSecondary }}>{chip}</span>}
        {role && <span style={{ fontSize: 11.5, color: C.textSecondary, fontFamily: MONO }}>{role}</span>}
      </figcaption>
      <Pair device={device} callouts={callouts} url={url}>{children}</Pair>
      {(callouts.length > 0 || note) && <div style={{ display: 'grid', gridTemplateColumns: device === 'phone' ? '1fr' : '1fr 1fr', gap: '8px 28px', marginTop: 12, paddingInlineStart: DEVS[device].m, maxWidth: device === 'phone' ? 830 : 2940 }}>
        {callouts.length > 0 && <ol aria-label={`Callouts for ${id}`} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: device === 'phone' ? '1fr' : '1fr 1fr', gap: '8px 24px', gridColumn: device === 'phone' ? undefined : '1 / -1' }}>
          {callouts.map((c, i) => <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><Badge n={c.n || i + 1} style={{ width: 22, height: 22, fontSize: 11.5, boxShadow: 'none' }} /><span style={{ fontSize: 13.5, lineHeight: '20px', color: C.textSecondary, fontFamily: FONT, textWrap: 'pretty' }}>{c.text}</span></li>)}
        </ol>}
        {note && <p style={{ fontSize: 13.5, lineHeight: '20px', color: C.textSecondary, fontFamily: FONT, gridColumn: '1 / -1', borderInlineStart: `3px solid ${C.primary}`, paddingInlineStart: 12, textWrap: 'pretty' }}>{note}</p>}
      </div>}
      {leadsTo.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10, paddingInlineStart: DEVS[device].m, alignItems: 'center', maxWidth: device === 'phone' ? 840 : undefined }}><span style={{ fontSize: 12, color: C.textSecondary, fontFamily: FONT }}>Leads to</span>{leadsTo.map(t => <LeadsTo key={t} t={t} />)}</div>}
    </figure>;
  };
  // State variants of one screen, both languages, at half size. data-states lets capture-frames grab the row.
  const StateRow = ({ of, device = 'phone', items = [], scale, url }) => {
    const C = useC(); const s = scale || (device === 'phone' ? 0.5 : device === 'desktop' ? 0.33 : 0.4);
    return <div data-states={of} style={{ display: 'flex', flexWrap: 'wrap', gap: '28px 40px', padding: '18px 20px', borderRadius: 16, border: `1px dashed ${C.borderStrong}`, background: C.surface2, width: 'fit-content', maxWidth: CHW }}>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: C.primaryText }}>{of}</span><span style={{ fontSize: 13.5, fontWeight: 600, color: C.textSecondary, fontFamily: FONT }}>States</span></div>
      {items.map((it, i) => <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 650, color: C.text, fontFamily: FONT }}><span style={{ fontFamily: MONO, color: C.textSecondary }}>{of} · </span>{it.label}</span>
        <Pair device={device} zoom={s} labels={false} url={it.url || url}>{it.el}</Pair>
      </div>)}
    </div>;
  };
  const FlowStrip = ({ name, steps = [] }) => {
    const C = useC();
    return <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '14px 18px', borderRadius: 12, background: C.surface, border: `1px solid ${C.border}`, width: 'fit-content', maxWidth: CHW }}>
      <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: C.primaryText, letterSpacing: '.04em', marginInlineEnd: 6 }}>FLOW · {name}</span>
      {steps.map((s, i) => <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href={`#s-${s.split(' ')[0]}`} style={{ textDecoration: 'none', fontFamily: FONT, fontSize: 13, padding: '5px 12px', borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface2, color: C.text, whiteSpace: 'nowrap' }}>{s}</a>
        {i < steps.length - 1 && <Ic n="arrowR" s={14} c={C.textSecondary} />}
      </span>)}
    </div>;
  };
  const ChapterBand = ({ num, name, nameAr, screens, title, lede, lane, children, layout = 'phone', v }) => {
    const C = useC();
    return <section aria-labelledby={`ch${num}-t`} id={`ch${num}`} style={{ width: CHW, marginBottom: 140, scrollMarginTop: 100, paddingTop: 28 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 520px', gap: 48, marginBottom: 40, paddingBottom: 28, borderBottom: `1px solid ${C.border}`, alignItems: 'end' }}>
        <div>
          <div aria-hidden="true" style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 96, lineHeight: 1.05, paddingTop: 8, color: C.primaryText, letterSpacing: '-0.02em' }}>{String(num).padStart(2, '0')}</div>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 650, letterSpacing: '.08em', textTransform: 'uppercase', color: C.textSecondary, marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 18, height: 2, background: C.primary }} />{name}{screens != null ? ` · ${screens} screens` : ''}</div>
          {nameAr && <div lang="ar" style={{ fontFamily: FONT_AR, fontSize: 16, color: C.textSecondary, marginTop: 4 }}>{nameAr}</div>}
        </div>
        <div>
          <h2 id={`ch${num}-t`} style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 52, lineHeight: '58px', color: C.text, letterSpacing: '-0.01em', textWrap: 'balance', margin: 0 }}>{title}</h2>
          <p style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 24, lineHeight: '32px', color: C.textSecondary, marginTop: 12, maxWidth: 1200 }}>{lede}</p>
        </div>
        {lane && <div style={{ borderInlineStart: `3px solid ${C.primary}`, paddingInlineStart: 18 }}>
          <div style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 700, letterSpacing: '.1em', color: C.textSecondary, marginBottom: 6 }}>DESIGN RATIONALE</div>
          <p style={{ fontSize: 15, lineHeight: '23px', color: C.textSecondary, fontFamily: FONT, textWrap: 'pretty', margin: 0 }}>{lane}</p>
        </div>}
      </div>
      <div style={layout === 'phone' ? { display: 'flex', flexWrap: 'wrap', gap: '72px 56px', alignItems: 'flex-start' } : { display: 'flex', flexDirection: 'column', gap: 80 }}>{children}</div>
    </section>;
  };
  // Intro band at the top of every board: what this board is and how to read it.
  const BoardIntro = ({ title, sub, points = [], stats = [] }) => {
    const C = useC(); const S = TOKENS.scales; // brand band on the primary ramp: scale tokens, not literals
    return <section id="intro" aria-label="About this board" style={{ width: CHW, marginBottom: 140, borderRadius: 28, overflow: 'hidden', background: C.name === 'dark' ? C.surface : S.primary[800], boxShadow: C.el[3], display: 'grid', gridTemplateColumns: '1.1fr 1fr', minHeight: 620 }}>
      <div style={{ padding: '72px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 40 }}>
        <Wordmark size={56} ar={false} ink={S.neutral[50]} markBg={S.neutral[50]} markInk={S.primary[800]} />
        <div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 84, lineHeight: '88px', color: S.neutral[50], margin: 0, letterSpacing: '-0.015em' }}>{title}</h1>
          <p style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 28, lineHeight: '38px', color: S.primary[200], marginTop: 16, maxWidth: 1100 }}>{sub}</p>
        </div>
        <div style={{ display: 'flex', gap: 48 }}>{stats.map((s, i) => <div key={i}><div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 56, color: S.accent[200], lineHeight: 1 }}>{s[0]}</div><div style={{ fontFamily: FONT, fontSize: 15, color: S.primary[200], marginTop: 8 }}>{s[1]}</div></div>)}</div>
      </div>
      <div style={{ padding: '72px 72px', background: C.name === 'dark' ? C.surface2 : S.primary[900], display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, letterSpacing: '.12em', color: S.accent[200] }}>HOW TO READ THIS BOARD</div>
        {points.map((p, i) => <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}><span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, color: S.accent[200], width: 30, flexShrink: 0, lineHeight: '30px' }}>{i + 1}</span><p style={{ fontFamily: FONT, fontSize: 19, lineHeight: '29px', color: S.neutral[50], margin: 0, textWrap: 'pretty' }}>{p}</p></div>)}
      </div>
    </section>;
  };
  const BoardFoot = ({ board, screenCount, lang = 'AR + EN' }) => {
    const C = useC();
    return <footer style={{ width: CHW, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 22, borderTop: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 13, color: C.textSecondary }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><img src={AVINITI_LOGO} alt="Aviniti" width="20" height="20" />Designed by Aviniti · Your Ideas, Our Reality</span>
      <span>{FX.project.name.toUpperCase()} · {board} · {screenCount} SCREENS · {lang} · RTL + LTR{FX.project.boardDate ? ' · ' + FX.project.boardDate : ''}</span>
    </footer>;
  };
  const BoardApp = ({ board, title, subtitle, chapters = [], index = [], children, zoom0 = 0.22, url }) => {
    window.BOARD_INDEX = index; window.BOARD_DEFAULT_URL = url;
    const [zoom, setZoom] = useState(zoom0);
    const [theme, setTheme] = useState('light');
    const C = mkTheme(theme);
    useEffect(() => { let l = document.querySelector('link[rel=icon]'); if (!l) { l = document.createElement('link'); l.rel = 'icon'; document.head.appendChild(l); } l.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(monogramSvg(TOKENS.themes.light.primary, TOKENS.themes.light.onPrimary)); }, []);
    useEffect(() => { document.body.style.background = C.bg; document.documentElement.dataset.theme = theme; }, [theme]);
    useEffect(() => { if (title) document.title = title; }, [title]);
    const go = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    const ctl = { width: 34, height: 34, borderRadius: R.sm, border: `1px solid ${C.border}`, background: C.surface2, color: C.text, cursor: 'pointer', display: 'grid', placeItems: 'center' };
    const total = chapters.reduce((a, c) => a + (c.screens || 0), 0);
    return <ThemeCtx.Provider value={C}>
      <div style={{ '--focus': C.focus, width: '100vw', height: '100vh', overflow: 'auto', background: C.bg }} data-theme={theme}>
        <header style={{ position: 'fixed', top: 16, left: 16, zIndex: 100, background: C.surface, border: `1px solid ${C.border}`, boxShadow: C.el[2], padding: '10px 16px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12, maxWidth: 520 }}>
          <Monogram s={30} radius={18} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><a href="index.html" style={{ fontSize: 12, color: C.primaryText, fontWeight: 650, textDecoration: 'none', fontFamily: FONT }}>← Hub</a><h1 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0, fontFamily: FONT }}>{title}</h1></div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 1, fontFamily: FONT }}>{subtitle}</div>
          </div>
        </header>
        {chapters.length > 0 && <nav aria-label="Chapters" style={{ position: 'fixed', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 100, background: C.surface, border: `1px solid ${C.border}`, boxShadow: C.el[2], borderRadius: 14, padding: 6, display: 'flex', flexDirection: 'column', gap: 1, maxHeight: '74vh', overflow: 'auto' }}>
          {chapters.map(c => <button key={c.num} type="button" className="bk-focus" onClick={() => go(`ch${c.num}`)} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 26, padding: '0 10px', border: 'none', background: 'none', borderRadius: 6, cursor: 'pointer', color: C.textSecondary, fontSize: 12, fontWeight: 500, textAlign: 'left', fontFamily: FONT }}><span style={{ fontFamily: MONO, fontSize: 11, width: 18 }}>{String(c.num).padStart(2, '0')}</span>{c.name}</button>)}
        </nav>}
        <nav aria-label="Board controls" style={{ position: 'fixed', top: 16, right: 16, zIndex: 100, display: 'flex', gap: 6, alignItems: 'center', background: C.surface, border: `1px solid ${C.border}`, boxShadow: C.el[2], padding: 6, borderRadius: 14 }}>
          <button type="button" className="bk-focus" aria-label="Zoom out" onClick={() => setZoom(z => Math.max(0.1, +(z - 0.04).toFixed(2)))} style={ctl}><Ic n="minus" s={18} /></button>
          <span style={{ fontFamily: MONO, fontSize: 12.5, color: C.text, minWidth: 46, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <button type="button" className="bk-focus" aria-label="Zoom in" onClick={() => setZoom(z => Math.min(1, +(z + 0.04).toFixed(2)))} style={ctl}><Ic n="plus" s={18} /></button>
          <button type="button" className="bk-focus" onClick={() => setZoom(zoom0)} style={{ ...ctl, width: 'auto', padding: '0 12px', fontSize: 12.5, fontWeight: 600, fontFamily: FONT }}>Fit</button>
          <button type="button" className="bk-focus" onClick={() => setZoom(1)} style={{ ...ctl, width: 'auto', padding: '0 12px', fontSize: 12.5, fontWeight: 600, fontFamily: FONT }}>100%</button>
          <span style={{ width: 1, height: 22, background: C.border }} />
          <button type="button" className="bk-focus" aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} style={{ ...ctl, color: C.primaryText }}><Ic n={theme === 'dark' ? 'sun' : 'moon'} s={18} /></button>
        </nav>
        <aside aria-label="Aviniti" data-brand-bar="aviniti" style={{ position: 'fixed', left: 16, bottom: 16, zIndex: 100, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 8px', borderRadius: 9999, background: C.surface, border: `1px solid ${C.border}`, boxShadow: C.el[2] }}>
          <img src={AVINITI_LOGO} alt="Aviniti logo" style={{ width: 18, height: 18 }} /><span style={{ fontSize: 11.5, fontWeight: 600, color: C.textSecondary, fontFamily: FONT }}>Aviniti · Proposal board</span>
        </aside>
        <main style={{ zoom, padding: '160px 120px 120px 420px', width: 'fit-content' }}>
          {children}
          <BoardFoot board={board} screenCount={total} />
        </main>
      </div>
    </ThemeCtx.Provider>;
  };
  Object.assign(window, { ScreenFrame, StateRow, FlowStrip, ChapterBand, BoardApp, BoardFoot, BoardIntro, LeadsTo, VerTag, Pair, CHW });
})();
