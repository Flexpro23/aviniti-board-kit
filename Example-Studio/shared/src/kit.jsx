/* Kit — every UI primitive used inside a device frame. Token-only colours, touch-first sizes, logical properties for RTL.
 * Requires core.jsx (useC, useL, Tx, Ic, ts, TOKENS, R, TOUCH, FONT, MONO, rng, fmtNum, curDec, iso) and the fixture FX.
 * Rules enforced here so screens cannot break them:
 *   · red (C.alert) only for things that went wrong (overdue, failed, destructive actions). Amber (C.warning) for form
 *     problems and "due soon". The accent slot is for one brand moment per screen, never for status.
 *   · no ids inside components (each screen renders twice: AR + EN); logical properties only
 *   · placeholders use textSecondary (≥4.5:1), never textDisabled
 *   · form-control boundaries (Field, Check, Radio, Toggle track, PIN dots) use C.controlBorder (≥3:1, WCAG 1.4.11)
 *   · anything tappable below 44 px tall (Btn xs/sm/md, Chip, Segmented, small IconBtn) carries an invisible <Hit/>
 *     that extends its target to 44 px without changing layout
 *   · figures: <Money v cur/> renders "JOD 35.000" / "USD 49.00" (code first, decimals from FX.currencies, U+2212 for
 *     negatives, LTR isolate, tabular) in BOTH languages. <Num>, <Phone>, <Time> are LTR isolates. Western digits.
 *   · every status chip carries a word AND an icon or dot (StatusPill, vocabulary from FX.status) — colour is reinforcement only
 *   · sizes: Btn 40 (sm 32, lg 48) radius 8 · Field 40 (sm 32, lg 48) 1 px controlBorder, focus = primary border + 3 px
 *     halo · Pill 24 with a 6 px dot · Card radius 12, 1 px border, pad 20 (pass pad={16} on phone) · KPI label 12
 *     uppercase, value 32/36 600 · table th sunken uppercase 12/16
 */
const SR = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' };
// Invisible hit-area extension: keeps the visual size, makes the touch target ≥ min.
const Hit = ({ h, min = 44, w }) => (h < min || (w != null && w < min)) ? <span aria-hidden="true" data-hit="" style={{ position: 'absolute', top: Math.min(0, -(min - h) / 2), bottom: Math.min(0, -(min - h) / 2), insetInlineStart: w != null && w < min ? -(min - w) / 2 : 0, insetInlineEnd: w != null && w < min ? -(min - w) / 2 : 0 }} /> : null;
const Spinner = ({ s = 18, c = 'currentColor', w = 2.2 }) => <svg className="bk-spin" width={s} height={s} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}><circle cx="12" cy="12" r="9" fill="none" stroke={c} strokeOpacity=".25" strokeWidth={w} /><path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" /></svg>;
const badgeStyle = (C, tone = 'alert', size = 20) => { const solid = { alert: [C.alert, C.onAlert], primary: [C.primary, C.onPrimary], neutral: [C.textSecondary, C.surface], warning: [C.warning, C.name === 'dark' ? C.onPrimary : C.surface], info: [C.info, C.name === 'dark' ? C.onPrimary : C.surface] }[tone] || [C.alert, C.onAlert]; return { minWidth: size, height: size, padding: `0 ${size > 18 ? 6 : 5}px`, borderRadius: size / 2, background: solid[0], color: solid[1], fontSize: size > 18 ? 11.5 : 11, fontWeight: 700, display: 'grid', placeItems: 'center', fontFamily: FONT, boxShadow: `0 0 0 2px ${C.surface}`, fontVariantNumeric: 'tabular-nums' }; };


// ── Layout atoms ─────────────────────────────────────────────────────────────
const Box = ({ children, style, ...p }) => <div {...p} style={{ minWidth: 0, ...style }}>{children}</div>;
const Row = ({ children, gap = 8, align = 'center', justify, wrap, style, ...p }) => <div {...p} style={{ display: 'flex', alignItems: align, justifyContent: justify, gap, flexWrap: wrap ? 'wrap' : undefined, minWidth: 0, ...style }}>{children}</div>;
const Col = ({ children, gap = 8, style, ...p }) => <div {...p} style={{ display: 'flex', flexDirection: 'column', gap, minWidth: 0, ...style }}>{children}</div>;
const Grow = ({ children, style }) => <div style={{ flex: 1, minWidth: 0, ...style }}>{children}</div>;
const Divider = ({ style, inset = 0 }) => { const C = useC(); return <div style={{ height: 1, background: C.border, marginInlineStart: inset, flexShrink: 0, ...style }} />; };
const Gap = ({ h = 8 }) => <div style={{ height: h, flexShrink: 0 }} />;

// ── Buttons ──────────────────────────────────────────────────────────────────
const btnTone = (C, v) => ({
  primary: { bg: C.primary, fg: C.onPrimary, bd: C.primary },
  secondary: { bg: C.surface, fg: C.text, bd: C.borderStrong },
  tonal: { bg: C.primarySubtle, fg: C.primaryText, bd: C.primaryBorder },
  ghost: { bg: 'transparent', fg: C.text, bd: 'transparent' },
  link: { bg: 'transparent', fg: C.primaryText, bd: 'transparent' },
  quiet: { bg: C.surface2, fg: C.text, bd: 'transparent' },
  danger: { bg: C.alert, fg: C.onAlert, bd: C.alert },
  dangerGhost: { bg: C.surface, fg: C.alertText, bd: C.alertBorder },
  accent: { bg: C.accent, fg: C.onAccent, bd: C.accent },
  warn: { bg: C.warningSubtle, fg: C.warningText, bd: C.warningBorder },
}[v] || { bg: C.primary, fg: C.onPrimary, bd: C.primary });
// States: default · pressed (static mock of :active) · loading (spinner replaces the icon, label stays, width holds) · disabled.
const pressedBg = (C, v) => ({ primary: C.primaryPressed, secondary: C.surface2, tonal: C.primaryBorder, ghost: C.surface2, link: 'transparent', quiet: C.surfaceSunken, danger: C.name === 'dark' ? C.S.danger[400] : C.S.danger[800], dangerGhost: C.alertSubtle, accent: C.name === 'dark' ? C.S.accent[300] : C.S.accent[600], warn: C.warningBorder }[v]);
// Button: 40 px (sm 32, lg 48), radius-md, weight 500, 15 px (sm 13, lg 16). xs/xl kept for dense tables and the phone sticky bar.
const Btn = ({ v = 'primary', size = 'md', icon, iconEnd, full, children, disabled, style, badge, badgeTone = 'alert', label, loading, pressed }) => {
  const C = useC(); const { isAr } = useL();
  const h = { xs: 28, sm: 32, md: 40, lg: 48, xl: 56 }[size];
  const fs = { xs: 12, sm: 13, md: 15, lg: 16, xl: 17 }[size];
  const t = btnTone(C, v); const is = size === 'xs' || size === 'sm' ? 16 : 20;
  return (
    <button type="button" tabIndex={-1} disabled={disabled} aria-label={label} aria-busy={loading || undefined} aria-pressed={pressed || undefined} style={{
      height: h, minWidth: v === 'link' ? 0 : h, padding: v === 'link' ? 0 : children ? `0 ${size === 'xs' ? 10 : size === 'sm' ? 12 : size === 'lg' ? 20 : 16}px` : 0, borderRadius: R.md,
      background: disabled ? C.surface2 : pressed ? pressedBg(C, v) : t.bg, color: disabled ? C.textDisabled : t.fg, border: `1px solid ${disabled ? C.border : t.bd}`, boxShadow: 'none',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: full ? '100%' : undefined, flexShrink: 0,
      fontFamily: FONT, fontSize: isAr ? fs + 1 : fs, fontWeight: 500, letterSpacing: 0, lineHeight: 1, whiteSpace: 'nowrap', cursor: disabled ? 'default' : 'pointer', position: 'relative',
      textDecoration: v === 'link' ? 'underline' : undefined, textUnderlineOffset: 3, ...style,
    }}>
      {loading ? <Spinner s={is} /> : icon && <Ic n={icon} s={is} />}
      {children}
      {iconEnd && !loading && <Ic n={iconEnd} s={is} />}
      {badge != null && <span style={{ position: 'absolute', top: -6, insetInlineEnd: -6, ...badgeStyle(C, badgeTone, 20) }}>{badge}</span>}
      <Hit h={h} />
    </button>
  );
};
// IconButton: 40 (sm 32). v ghost by default; 'secondary' = outline variant.
const IconBtn = ({ icon, label, size = 40, v = 'ghost', badge, badgeTone = 'alert', style, s, pressed, disabled }) => {
  const C = useC(); const t = btnTone(C, v);
  return (
    <button type="button" tabIndex={-1} aria-label={label} disabled={disabled} style={{ width: size, height: size, borderRadius: R.md, background: disabled ? 'transparent' : pressed ? pressedBg(C, v) : t.bg, color: disabled ? C.textDisabled : t.fg, border: `1px solid ${disabled ? 'transparent' : t.bd}`, display: 'grid', placeItems: 'center', flexShrink: 0, cursor: 'pointer', position: 'relative', ...style }}>
      <Ic n={icon} s={s || (size >= 44 ? 22 : size <= 32 ? 18 : 20)} />
      {badge != null && <span style={{ position: 'absolute', top: 2, insetInlineEnd: 2, ...badgeStyle(C, badgeTone, 18) }}>{badge}</span>}
      <Hit h={size} w={size} />
    </button>
  );
};

// ── Inputs (static mockups: value or placeholder rendered as text) ───────────
// Field states: placeholder · value · focus (primary border + 3 px halo) · warn (amber, red is reserved) · readOnly · disabled.
const Field = ({ label, value, placeholder, hint, warn, icon, iconEnd, suffix, prefix, focus, size = 'md', mono, dir, style, multiline, readOnly, disabled, required, align }) => {
  const C = useC(); const { isAr, $ } = useL();
  const h = { sm: 32, md: 40, lg: 48 }[size];
  const bd = disabled ? C.border : warn ? C.warning : focus ? C.focus : C.controlBorder;
  if (disabled) { readOnly = true; iconEnd = iconEnd || 'lock'; }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, ...style }}>
      {label && <Row gap={4}><Tx r="label" upper c={C.textSecondary}>{label}</Tx>{required && <Tx r="caption" c={C.textSecondary}>{$('(مطلوب)', '(required)')}</Tx>}</Row>}
      <div style={{ minHeight: multiline ? 88 : h, padding: multiline ? '8px 12px' : `0 ${size === 'sm' ? 10 : 12}px`, display: 'flex', alignItems: multiline ? 'flex-start' : 'center', gap: 8, borderRadius: R.md, background: readOnly ? C.surfaceSunken : C.surface, border: `1px solid ${bd}`, boxShadow: focus ? `0 0 0 3px ${C.focusHalo}` : 'none', position: 'relative' }}>
        {icon && <Ic n={icon} s={size === 'sm' ? 16 : 18} c={C.textSecondary} />}
        {prefix && <span style={{ ...ts('monoSm', isAr), color: C.textSecondary, whiteSpace: 'nowrap' }}>{prefix}</span>}
        <span dir={dir} style={{ flex: 1, minWidth: 0, ...ts(mono ? 'mono' : size === 'sm' ? 'bodySm' : 'body', isAr), ...(mono ? { fontSize: 15 } : null), color: value && !disabled ? C.text : C.textSecondary, whiteSpace: multiline ? 'normal' : 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: align || (dir === 'ltr' && isAr ? 'right' : undefined), unicodeBidi: dir ? 'isolate' : undefined }}>
          {value || placeholder}{focus && <span style={{ display: 'inline-block', width: 1.5, height: 16, background: C.focus, marginInlineStart: 1, verticalAlign: 'middle' }} />}
        </span>
        {suffix && <span style={{ ...ts('monoSm', isAr), color: C.textSecondary, whiteSpace: 'nowrap' }}>{suffix}</span>}
        {iconEnd && <Ic n={iconEnd} s={size === 'sm' ? 16 : 18} c={C.textSecondary} />}
        <Hit h={h} />
      </div>
      {(hint || warn) && <Row gap={6} align="flex-start">{warn && <Ic n="alertCircle" s={16} c={C.warningText} />}<Tx r="bodySm" c={warn ? C.warningText : C.textSecondary}>{warn || hint}</Tx></Row>}
    </div>
  );
};
const Search = ({ placeholder, value, size = 'md', style, kbd, clear }) => <Field icon="search" placeholder={placeholder} value={value} size={size} style={style} iconEnd={clear && value ? 'x' : kbd} />;
// SegmentedControl: sunken track, 32 px buttons (sm 28, lg 40), selected on surface with shadow-sm.
const Segmented = ({ items, value, size = 'md', full, style }) => {
  const C = useC(); const h = size === 'sm' ? 28 : size === 'lg' ? 40 : 32;
  return (
    <div style={{ display: 'inline-flex', padding: 3, gap: 2, borderRadius: R.md, background: C.surfaceSunken, width: full ? '100%' : undefined, ...style }}>
      {items.map((it, i) => {
        const on = (it.v ?? i) === value;
        return <div key={i} style={{ flex: full ? 1 : undefined, height: h, padding: '0 12px', borderRadius: R.sm, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: on ? C.surface : 'transparent', boxShadow: on ? C.el[1] : 'none', color: on ? C.text : C.textSecondary, whiteSpace: 'nowrap', position: 'relative' }}>
          <Hit h={h + 6} />
          {it.icon && <Ic n={it.icon} s={16} />}<Tx r="bodySm" c={on ? C.text : C.textSecondary} style={{ fontWeight: 500 }}>{it.label}</Tx>
          {it.count != null && <span style={{ ...ts('caption'), color: on ? C.primaryText : C.textSecondary }}>{it.count}</span>}
        </div>;
      })}
    </div>
  );
};
// Controls: Toggle 40×24 track, 18 knob · Check/Radio 20 px, 1.5 px controlBorder. disabled → hairline, no fill.
const Toggle = ({ on, disabled }) => { const C = useC(); return <span aria-hidden="true" style={{ width: 40, height: 24, borderRadius: 12, background: disabled ? C.surface2 : on ? C.primary : C.controlBorder, border: disabled ? `1px solid ${C.border}` : 'none', boxSizing: 'border-box', position: 'relative', flexShrink: 0, display: 'inline-block' }}><span style={{ position: 'absolute', top: disabled ? 2 : 3, insetInlineStart: on ? 19 : disabled ? 2 : 3, width: 18, height: 18, borderRadius: 9, background: disabled ? C.border : on ? C.onPrimary : C.knob, boxShadow: disabled ? 'none' : C.el[1] }} /><Hit h={24} w={40} /></span>; };
const Check = ({ on, tone = 'primary', size = 20, disabled, mixed }) => { const C = useC(); const col = disabled ? C.textDisabled : tone === 'success' ? C.success : C.primary; return <span aria-hidden="true" style={{ width: size, height: size, borderRadius: R.sm, flexShrink: 0, display: 'grid', placeItems: 'center', background: on || mixed ? col : disabled ? C.surface2 : C.surface, border: `1.5px solid ${on || mixed ? col : disabled ? C.border : C.controlBorder}`, color: C.onPrimary, position: 'relative' }}>{on && <Ic n="check" s={size - 6} w={2.6} c={C.onPrimary} />}{mixed && !on && <span style={{ width: 10, height: 2, background: C.onPrimary }} />}<Hit h={size} w={size} /></span>; };
const Radio = ({ on, disabled }) => { const C = useC(); const col = disabled ? C.textDisabled : C.primary; return <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: 10, flexShrink: 0, display: 'grid', placeItems: 'center', border: `1.5px solid ${on ? col : disabled ? C.border : C.controlBorder}`, background: disabled ? C.surface2 : C.surface, position: 'relative' }}>{on && <span style={{ width: 10, height: 10, borderRadius: 5, background: col }} />}<Hit h={20} w={20} /></span>; };
// Filter chip (a control, unlike Pill): 32 visual, 44 hit. tone styles the selected state (e.g. a category filter).
const Chip = ({ children, on, icon, count, tone, style, disabled, iconEnd }) => {
  const C = useC(); const t = tone ? toneOf(C, tone) : null;
  const bg = disabled ? C.surface2 : on ? (t ? t.bg : C.primarySubtle) : C.surface, bd = disabled ? C.border : on ? (t ? t.dot : C.primary) : C.borderStrong, fg = disabled ? C.textDisabled : on ? (t ? t.fg : C.primaryText) : C.text;
  return <span style={{ height: 32, padding: '0 12px', borderRadius: 16, display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, background: bg, border: `1px solid ${bd}`, color: fg, whiteSpace: 'nowrap', position: 'relative', ...style }}>
    {icon && <Ic n={icon} s={16} />}<Tx r="bodySm" c={fg} style={{ fontWeight: 500 }}>{children}</Tx>
    {count != null && <span style={{ ...ts('caption'), fontWeight: 600, color: on ? fg : C.textSecondary }}>{count}</span>}
    {iconEnd && <Ic n={iconEnd} s={14} />}
    <Hit h={32} />
  </span>;
};

// ── Tones and status chips ───────────────────────────────────────────────────
const toneOf = (C, tone) => ({
  neutral: { bg: C.neutralSubtle, fg: C.textSecondary, bd: C.border, dot: C.textSecondary },
  primary: { bg: C.primarySubtle, fg: C.primaryText, bd: C.primaryBorder, dot: C.primary },
  success: { bg: C.successSubtle, fg: C.successText, bd: C.successBorder, dot: C.success },
  warning: { bg: C.warningSubtle, fg: C.warningText, bd: C.warningBorder, dot: C.warning },
  alert: { bg: C.alertSubtle, fg: C.alertText, bd: C.alertBorder, dot: C.alert },
  danger: { bg: C.alertSubtle, fg: C.alertText, bd: C.alertBorder, dot: C.alert },
  info: { bg: C.infoSubtle, fg: C.infoText, bd: C.infoBorder, dot: C.info },
  accent: { bg: C.accentSubtle, fg: C.accentText, bd: C.accentBorder, dot: C.accent },
}[tone] || (C.cat[tone] ? { bg: C.cat[tone].bg, fg: C.cat[tone].text, bd: C.cat[tone].border, dot: C.cat[tone].bar } : { bg: C.neutralSubtle, fg: C.textSecondary, bd: C.border, dot: C.textSecondary }));
// StatusChip: 24 px pill (sm 20, lg 28), tint ground + full-colour word, a 6 px dot unless an icon is given or plain.
// outline = tint-less variant for "Disputed" / "Ready"; solid = tone fill for a badge on a photo.
const Pill = ({ tone = 'neutral', children, icon, dot, size = 'md', solid, outline, plain, style, pulse }) => {
  const C = useC(); const t = toneOf(C, tone); const isCat = !!C.cat[tone];
  const h = size === 'sm' ? 20 : size === 'lg' ? 28 : 24; const showDot = dot != null ? dot : (!icon && !plain);
  const sBg = isCat ? t.fg : t.dot, sFg = tone === 'accent' ? C.onAccent : isCat ? C.surface : C.onPrimary;
  const fg = solid ? sFg : t.fg;
  return <span style={{ height: h, padding: `0 ${size === 'sm' ? 7 : size === 'lg' ? 10 : 8}px`, borderRadius: R.full, display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, whiteSpace: 'nowrap', background: solid ? sBg : outline ? 'transparent' : t.bg, border: `1px solid ${solid ? sBg : outline ? t.dot : 'transparent'}`, ...style }}>
    {showDot && <span className={pulse ? 'pulse-dot' : undefined} style={{ width: 6, height: 6, borderRadius: 3, background: fg, flexShrink: 0 }} />}
    {icon && <Ic n={icon} s={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} c={fg} w={2} />}
    <Tx r={size === 'sm' ? 'tab' : size === 'lg' ? 'bodySm' : 'label'} c={fg} style={{ fontWeight: 500, letterSpacing: 0 }}>{children}</Tx>
  </span>;
};
// Status vocabulary lives in the fixture: FX.status[kind][status] = { ar, en, icon, tone }. One vocabulary per project.
const statusMeta = (kind, s) => { const m = ((FX.status || {})[kind] || {})[s]; if (!m) console.warn(`StatusPill: no FX.status.${kind}.${s}`); return { tone: (m && m.tone) || 'neutral', icon: (m && m.icon) || 'help', l: m || { ar: s, en: s } }; };
// StatusPill: word + icon (never colour alone). extra appends a figure ("3 h", a date) as an LTR isolate.
const StatusPill = ({ kind = Object.keys(FX.status || {})[0], s, size, extra, outline, solid, icon: icon0, style, prefix }) => {
  const { tr, isAr } = useL(); const m = statusMeta(kind, s);
  return <Pill tone={m.tone} icon={icon0 || m.icon} size={size} outline={outline} solid={solid} style={{ alignSelf: 'flex-start', ...style }}>{prefix != null && <span>{prefix} </span>}{tr(m.l)}{extra != null && <>{' '}<span dir="ltr" style={{ unicodeBidi: 'isolate' }}>{extra}</span></>}</Pill>;
};
// ── Figures ──────────────────────────────────────────────────────────────────
// <Money v={35} cur="JOD" /> → "JOD 35.000" in both languages (code first, decimals from FX.currencies, U+2212 minus,
// LTR isolate, tabular nums). r picks the type role (money, moneyL, moneyXL, caption…).
const Money = ({ v, cur, dec, r = 'money', c, codeC, sign, strike, codeSize, style, hideCode }) => {
  const C = useC(); const { isAr } = useL(); const code = cur || FX.cur;
  const d = dec != null ? dec : curDec(code);
  const s = (v < 0 ? '−' : sign && v > 0 ? '+' : '') + fmtNum(Math.abs(v || 0), d);
  const st = ts(r, isAr);
  return <span dir="ltr" style={{ ...st, color: c || C.text, unicodeBidi: 'isolate', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'baseline', gap: '0.3em', textDecoration: strike ? 'line-through' : undefined, width: 'fit-content', flexWrap: r === 'moneyXL' ? 'wrap' : undefined, ...style }}>
    {!hideCode && <span style={{ fontSize: codeSize || Math.max(11, Math.round(st.fontSize * 0.72)), fontWeight: 500, color: codeC || c || C.textSecondary, letterSpacing: 0, fontFamily: FONT }}>{code}</span>}
    <span>{s}</span>
  </span>;
};
const Num = ({ children, r = 'mono', c, style }) => { const C = useC(); return <span dir="ltr" style={{ ...ts(r), color: c || C.text, unicodeBidi: 'isolate', width: 'fit-content', whiteSpace: 'nowrap', ...style }}>{children}</span>; };
// 24-hour time, LTR isolate
const Time = ({ t, r = 'label', c, style }) => { const C = useC(); const { t24, tr } = useL(); return <span style={{ ...ts(r), color: c || C.textSecondary, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', unicodeBidi: 'isolate', letterSpacing: 0, ...style }}>{typeof t === 'object' ? tr(t) : t24(t)}</span>; };
// Phone number as an LTR isolate; wa adds the WhatsApp icon button (brand mark never mirrors, see core).
const Phone = ({ v, r = 'body', c, wa, size = 32, style }) => {
  const C = useC(); const { $ } = useL();
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...style }}>
    <span dir="ltr" style={{ ...ts(r), color: c || C.text, unicodeBidi: 'isolate', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{v}</span>
    {wa && <IconBtn icon="whatsapp" label={$('مراسلة عبر واتساب', 'Message on WhatsApp')} size={size} style={{ color: C.successText }} />}
  </span>;
};
// ── People ───────────────────────────────────────────────────────────────────
// Avatar: initials on primarySubtle/primaryText (tone 'neutral' grey), radius-pill. src → generic photo stand-in (no faces).
const Avatar = ({ ini, name, size = 36, src, tone = 'primary', style, status }) => {
  const C = useC(); const { isAr } = useL(); const t = tone === 'neutral' ? { bg: C.surface2, fg: C.textSecondary } : { bg: C.primarySubtle, fg: C.primaryText };
  return <span title={name} role={name ? 'img' : undefined} aria-label={name} style={{ width: size, height: size, borderRadius: size / 2, flexShrink: 0, display: 'grid', placeItems: 'center', background: src ? C.photo : t.bg, color: src ? C.photoInk : t.fg, overflow: 'hidden', position: 'relative', ...style }}>
    {src ? <Ic n="user" s={size * 0.55} /> : <span style={{ fontFamily: isAr ? FONT_AR : FONT, fontWeight: 600, fontSize: Math.round(size * (isAr ? 0.42 : 0.36)), lineHeight: 1, letterSpacing: 0 }}>{ini}</span>}
    {status && <span style={{ position: 'absolute', bottom: 0, insetInlineEnd: 0, width: Math.max(10, size * 0.3), height: Math.max(10, size * 0.3), borderRadius: '50%', background: { on: C.success, off: C.textSecondary, busy: C.warning }[status] || C.success, border: `2px solid ${C.surface}` }} />}
  </span>;
};
// Stacked avatars. items: FX.person ids or { ini, name }.
const AvatarStack = ({ items = [], max = 3, size = 28 }) => {
  const C = useC(); const { tr } = useL(); const u = items.filter(Boolean); const shown = u.slice(0, max);
  return <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
    {shown.map((it, i) => { const p = typeof it === 'string' ? FX.person(it) : it; return <Avatar key={i} ini={p ? tr(p.ini) : '?'} name={p ? tr(p.name) : ''} size={size} style={{ marginInlineStart: i ? -Math.round(size * 0.28) : 0, boxShadow: `0 0 0 2px ${C.surface}` }} />; })}
    {u.length > max && <span style={{ marginInlineStart: 4, ...ts('caption'), color: C.textSecondary, fontWeight: 600 }}>+{u.length - max}</span>}
  </span>;
};

// ── Containers and feedback ──────────────────────────────────────────────────
// card: surface, 1 px border, radius-lg, pad 20 (pass pad={16} on phone). Cards have a border, not a shadow (elev 0).
const Card = ({ children, pad = 20, style, elev = 0, tone, onSurface, selected, radius }) => {
  const C = useC(); const t = tone ? toneOf(C, tone) : null;
  return <div style={{ background: selected ? C.surfaceSelected : t ? t.bg : onSurface ? C.surface2 : C.surface, border: `1px solid ${selected ? C.primary : t ? t.bd : C.border}`, borderRadius: radius || R.lg, padding: pad, boxShadow: elev ? C.el[elev] : 'none', minWidth: 0, ...style }}>{children}</div>;
};
const SectionHead = ({ title, sub, action, style }) => {
  const C = useC();
  return <Row justify="space-between" align="flex-end" style={{ marginBottom: 10, ...style }}>
    <Col gap={2}><Tx r="h3">{title}</Tx>{sub && <Tx r="bodySm" c={C.textSecondary}>{sub}</Tx>}</Col>
    {action}
  </Row>;
};
// List row: leading / title / sub / trailing / chevron. 56 px on phone (touch.rowPhone), 48 desktop.
const LRow = ({ lead, title, sub, trail, chev, h = 56, divider = true, tone, style, pad = 16, sub2, selected }) => {
  const C = useC(); const t = tone ? toneOf(C, tone) : null;
  return <div style={{ minHeight: h, display: 'flex', alignItems: 'center', gap: 12, padding: `8px ${pad}px`, background: selected ? C.surfaceSelected : t ? t.bg : 'transparent', borderBottom: divider ? `1px solid ${C.border}` : 'none', minWidth: 0, ...style }}>
    {lead}
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {typeof title === 'string' ? <Tx r="bodyStrong" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</Tx> : title}
      {sub && (typeof sub === 'string' ? <Tx r="bodySm" c={C.textSecondary} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</Tx> : sub)}
      {sub2}
    </div>
    {trail}
    {chev && <Ic n="chevR" s={20} c={C.textSecondary} />}
  </div>;
};
const IconTile = ({ n, tone = 'neutral', size = 40, s }) => { const C = useC(); const t = toneOf(C, tone); return <span style={{ width: size, height: size, borderRadius: R.md, background: t.bg, color: t.fg, display: 'grid', placeItems: 'center', flexShrink: 0 }}><Ic n={n} s={s || Math.round(size * 0.5)} /></span>; };
// KPITile: label 12 uppercase, value 32/36 600 tabular, delta body-sm (up success · down alert). tone='alert' colours the value.
const Kpi = ({ label, value, sub, delta, tone, icon, style, loading, pad }) => {
  const C = useC(); const { isAr } = useL();
  const val = typeof value === 'string' || typeof value === 'number' ? <span dir="ltr" style={{ ...ts('moneyXL', isAr), color: tone === 'alert' ? C.alertText : C.text, unicodeBidi: 'isolate', display: 'inline-block' }}>{value}</span> : value;
  return <Card pad={pad || '16px 20px'} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontVariantNumeric: 'tabular-nums', ...style }}>
    <Row gap={6}>{icon && <Ic n={icon} s={14} c={C.textSecondary} />}<Tx r="label" upper c={C.textSecondary}>{label}</Tx></Row>
    {loading ? <Skel h={36} w="60%" /> : <div>{val}</div>}
    {(sub || delta) && <Row gap={6}>{delta && <Row gap={4} style={{ color: delta.tone ? toneOf(C, delta.tone).fg : delta.up ? C.successText : delta.down ? C.alertText : C.textSecondary }}>{(delta.up || delta.down) && <Ic n={delta.up ? 'arrowUp' : 'arrowDown'} s={14} />}<Tx r="bodySm" c="inherit"><span dir="ltr" style={{ unicodeBidi: 'isolate' }}>{delta.t}</span></Tx></Row>}{sub && <Tx r="bodySm" c={C.textSecondary}>{sub}</Tx>}</Row>}
  </Card>;
};
const KpiRow = ({ items = [], cols, style }) => <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols || items.length}, minmax(0, 1fr))`, gap: 16, ...style }}>{items.map((k, i) => <Kpi key={i} {...k} />)}</div>;
// Banner: tint ground, 20 px icon, body 15, optional action at the end. tone alert only for things that went wrong.
const Banner = ({ tone = 'info', icon, title, body, action, style, compact }) => {
  const C = useC(); const t = toneOf(C, tone);
  return <div style={{ display: 'flex', gap: 12, alignItems: compact ? 'center' : 'flex-start', padding: compact ? '8px 12px' : '12px 16px', borderRadius: R.md, background: t.bg, border: `1px solid ${t.bd}`, ...style }}>
    <Ic n={icon || { info: 'info', warning: 'alert', alert: 'alertCircle', success: 'checkCircle', primary: 'info', accent: 'sparkle', neutral: 'info' }[tone] || 'info'} s={20} c={t.fg} style={{ marginTop: compact ? 0 : 1 }} />
    <Col gap={2} style={{ flex: 1 }}>{title && <Tx r="bodyStrong" c={C.text}>{title}</Tx>}{body && <Tx r={title ? 'bodySm' : 'body'} c={title ? C.textSecondary : C.text} style={{ textWrap: 'pretty' }}>{body}</Tx>}</Col>
    {action && <div style={{ alignSelf: 'center' }}>{action}</div>}
  </div>;
};
// EmptyState: 40 px icon in textFaint, h3, body in muted, first action.
const Empty = ({ icon = 'inbox', title, body, action, style }) => {
  const C = useC();
  return <Col gap={8} style={{ alignItems: 'center', textAlign: 'center', padding: '40px 20px', ...style }}>
    <Ic n={icon} s={40} c={C.textFaint} w={1.5} />
    <Tx r="h3">{title}</Tx>{body && <Tx r="bodySm" c={C.textSecondary} style={{ maxWidth: '36ch', textWrap: 'pretty' }}>{body}</Tx>}{action && <div style={{ marginTop: 8 }}>{action}</div>}
  </Col>;
};
const Skel = ({ w = '100%', h = 14, r = R.sm, style }) => { const C = useC(); return <span className="skel" style={{ display: 'block', width: w, height: h, borderRadius: r, background: C.surfaceSunken, ...style }} />; };
// Tabs: 40 px, 2 px underline in primary, optional count pill
const Tabs = ({ items, value, style, size = 'md' }) => {
  const C = useC();
  return <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${C.border}`, ...style }}>
    {items.map((it, i) => { const on = (it.v ?? i) === value; return <div key={i} style={{ height: size === 'lg' ? 48 : 40, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `2px solid ${on ? C.primary : 'transparent'}`, marginBottom: -1, position: 'relative', whiteSpace: 'nowrap' }}>
      <Hit h={40} />
      {it.icon && <Ic n={it.icon} s={16} c={on ? C.primaryText : C.textSecondary} />}
      <Tx r="bodySm" c={on ? C.primaryText : C.textSecondary} style={{ fontWeight: 500, fontSize: 14 }}>{it.label}</Tx>{it.count != null && <Pill size="sm" plain tone={it.tone || 'neutral'}>{it.count}</Pill>}
    </div>; })}
  </div>;
};
// ProgressSteps: 4 px bars, done + current in primary, labels under; error marks a step in alert (a failed step, not a form problem).
const Steps = ({ items, at, error, style }) => {
  const C = useC();
  return <div style={{ display: 'flex', gap: 8, ...style }}>{items.map((s, i) => { const done = i < at, cur = i === at, err = error === i; const col = err ? C.alert : done || cur ? C.primary : C.border; return <div key={i} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ height: 4, borderRadius: 2, background: col }} />
    <Tx r="bodySm" c={err ? C.alertText : cur ? C.primaryText : done ? C.text : C.textSecondary} style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</Tx>
  </div>; })}</div>;
};
const Progress = ({ v, tone = 'primary', h = 6, style, track }) => { const C = useC(); const t = toneOf(C, tone); return <div style={{ height: h, borderRadius: h / 2, background: track || C.surfaceSunken, overflow: 'hidden', ...style }}><div style={{ width: `${Math.min(100, Math.max(0, v) * 100)}%`, height: '100%', borderRadius: h / 2, background: t.dot }} /></div>; };
const Dot = ({ c, s = 8, pulse }) => <span className={pulse ? 'pulse-dot' : undefined} style={{ width: s, height: s, borderRadius: s, background: c, flexShrink: 0, display: 'inline-block' }} />;
// Description list: 2-column grid (label max-content, value 1fr). rows: [[label, value]] or [{ l, v }].
const DL = ({ rows = [], style, gap = '8px 16px', labelW }) => {
  const C = useC();
  return <dl style={{ display: 'grid', gridTemplateColumns: `${labelW ? labelW + 'px' : 'max-content'} 1fr`, gap, margin: 0, ...style }}>
    {rows.map((r, i) => { const l = Array.isArray(r) ? r[0] : r.l, v = Array.isArray(r) ? r[1] : r.v; return <Fragment key={i}><dt style={{ ...ts('body'), color: C.textSecondary, whiteSpace: 'nowrap' }}>{l}</dt><dd style={{ margin: 0, minWidth: 0, ...ts('body'), color: C.text }}>{v}</dd></Fragment>; })}
  </dl>;
};

// Summary row for TotalsBlock. total → sunken ground; tone colours the figure.
const TotRow = ({ r, big, cur, pad = '12px 20px', style }) => {
  const C = useC(); const t = r.tone ? toneOf(C, r.tone) : null;
  return <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: pad, background: big ? C.surfaceSunken : 'transparent', ...style }}>
    <Col gap={0} style={{ flex: 1 }}><Tx r={big ? 'bodyStrong' : 'body'} c={t ? t.fg : big ? C.text : r.muted ? C.textSecondary : C.text} style={{ fontWeight: big ? 600 : 400 }}>{r.l}</Tx>{r.sub && <Tx r="bodySm" c={C.textSecondary}>{r.sub}</Tx>}</Col>
    {r.strike != null && <Money v={r.strike} cur={cur} r="bodySm" c={C.textSecondary} strike />}
    <Money v={r.neg ? -Math.abs(r.v) : r.v} cur={cur} r={big ? 'moneyL' : 'money'} c={t ? t.fg : r.muted ? C.textSecondary : C.text} />
  </div>;
};
const TotalsBlock = ({ rows = [], total, after = [], balance, cur, style }) => {
  const C = useC();
  return <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
    {rows.map((r, i) => <TotRow key={i} r={r} cur={cur} pad="8px 0" />)}
    {total && <TotRow r={total} cur={cur} big pad="10px 12px" style={{ borderRadius: R.md, marginTop: 4 }} />}
    {after.map((r, i) => <TotRow key={'a' + i} r={r} cur={cur} pad="8px 0" />)}
    {balance && <TotRow r={balance} cur={cur} pad="8px 0" style={{ borderTop: `1px solid ${C.border}`, marginTop: 4 }} />}
  </div>;
};
// DataTable: th on surfaceSunken uppercase 12/16, rows 48 (dense 36), numbers end-aligned tabular.
const DTable = ({ cols, rows, dense, foot, style, zebra, selectable, selected = [] }) => {
  const C = useC(); const { isAr } = useL();
  const tpl = (selectable ? '32px ' : '') + cols.map(c => c.w || '1fr').join(' ');
  const cell = (c, v, i, role = 'cell') => <div key={i} role={role} style={{ textAlign: c && c.num ? 'end' : 'start', minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontVariantNumeric: c && c.num ? 'tabular-nums' : undefined }}>{v}</div>;
  return <div role="table" style={{ border: `1px solid ${C.border}`, borderRadius: R.lg, overflow: 'hidden', background: C.surface, ...style }}>
    <div role="row" style={{ display: 'grid', gridTemplateColumns: tpl, gap: 12, padding: '0 12px', height: 36, alignItems: 'center', background: C.surfaceSunken, borderBottom: `1px solid ${C.border}` }}>{selectable && <span role="columnheader"><span style={SR}>{isAr ? 'تحديد' : 'Select'}</span><Check on={selected.length === rows.length && rows.length > 0} mixed={selected.length > 0 && selected.length < rows.length} size={18} /></span>}{cols.map((c, i) => cell(c, <Tx r="label" upper c={C.textSecondary} style={{ whiteSpace: 'nowrap' }}>{c.l || <span style={SR}>{isAr ? 'إجراءات' : 'Actions'}</span>}{c.sort && <Ic n={c.sort === 'desc' ? 'arrowDown' : 'arrowUp'} s={12} style={{ display: 'inline-block', verticalAlign: '-2px', marginInlineStart: 4 }} />}</Tx>, i, 'columnheader'))}</div>
    {rows.map((r, ri) => { const cells = r.cells || r; const sel = selected.includes(ri); return <div key={ri} role="row" aria-selected={sel || undefined} style={{ display: 'grid', gridTemplateColumns: tpl, gap: 12, padding: '0 12px', minHeight: dense ? 36 : 48, alignItems: 'center', borderBottom: ri < rows.length - 1 || foot ? `1px solid ${C.border}` : 'none', background: sel ? C.surfaceSelected : r.tone ? toneOf(C, r.tone).bg : zebra && ri % 2 ? C.surface2 : 'transparent', ...ts(dense ? 'bodySm' : 'body', isAr) }}>{selectable && <span role="cell"><Check on={sel} size={18} /></span>}{cells.map((v, i) => cell(cols[i], v, i))}</div>; })}
    {foot && <div role="row" style={{ display: 'grid', gridTemplateColumns: tpl, gap: 12, padding: '0 12px', height: 44, alignItems: 'center', background: C.surfaceSunken, borderTop: `1px solid ${C.border}` }}>{selectable && <span role="cell" />}{foot.map((v, i) => cell(cols[i], v, i))}</div>}
  </div>;
};
// ── Form fields ──────────────────────────────────────────────────────────────
// MoneyField: code affix on sunken ground, end-aligned mono amount. cash variant adds tendered / change rows.
const MoneyField = ({ label, v, cur = FX.cur, tendered, change, focus, hint, warn, style, placeholder }) => {
  const C = useC(); const { $, isAr } = useL(); const d = curDec(cur);
  const bd = warn ? C.warning : focus ? C.focus : C.controlBorder;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
    {label && <Tx r="label" upper c={C.textSecondary}>{label}</Tx>}
    <div dir="ltr" style={{ display: 'flex', alignItems: 'stretch', height: 40, borderRadius: R.md, boxShadow: focus ? `0 0 0 3px ${C.focusHalo}` : 'none' }}>
      <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', border: `1px solid ${bd}`, borderRight: 0, borderRadius: `${R.md}px 0 0 ${R.md}px`, background: C.surfaceSunken, color: C.textSecondary, fontFamily: MONO, fontSize: 13, fontWeight: 500 }}>{cur}</span>
      <span style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 12px', border: `1px solid ${bd}`, borderRadius: `0 ${R.md}px ${R.md}px 0`, background: C.surface, fontFamily: MONO, fontSize: 15, fontWeight: 500, color: v != null ? C.text : C.textSecondary, fontVariantNumeric: 'tabular-nums', position: 'relative' }}>{v != null ? fmtNum(v, d) : (placeholder || (0).toFixed(d))}{focus && <span style={{ display: 'inline-block', width: 1.5, height: 16, background: C.focus, marginLeft: 1 }} />}<Hit h={40} /></span>
    </div>
    {(hint || warn) && <Row gap={6}>{warn && <Ic n="alertCircle" s={16} c={C.warningText} />}<Tx r="bodySm" c={warn ? C.warningText : C.textSecondary}>{warn || hint}</Tx></Row>}
    {(tendered != null || change != null) && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
      <Row gap={8} justify="space-between" style={{ padding: '8px 12px', borderRadius: R.md, background: C.surfaceSunken }}><Tx r="bodySm" c={C.textSecondary}>{$('المدفوع', 'Tendered')}</Tx><Money v={tendered || 0} cur={cur} /></Row>
      <Row gap={8} justify="space-between" style={{ padding: '8px 12px', borderRadius: R.md, background: (change || 0) < 0 ? C.warningSubtle : C.successSubtle }}><Tx r="bodySm" c={(change || 0) < 0 ? C.warningText : C.successText}>{(change || 0) < 0 ? $('الناقص', 'Short') : $('الباقي', 'Change')}</Tx><Money v={Math.abs(change || 0)} cur={cur} c={(change || 0) < 0 ? C.warningText : C.successText} /></Row>
    </div>}
  </div>;
};
// PhoneField: country affix "+962", LTR value, verified check.
const PhoneField = ({ label, v, country = FX.phoneCountry || 'JO', verified, focus, hint, warn, placeholder, style }) => {
  const C = useC(); const { $ } = useL(); const code = { JO: '+962', SA: '+966', AE: '+971', GB: '+44', US: '+1' }[country] || country;
  const bd = warn ? C.warning : focus ? C.focus : C.controlBorder;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
    {label && <Tx r="label" upper c={C.textSecondary}>{label}</Tx>}
    <div dir="ltr" style={{ display: 'flex', alignItems: 'stretch', height: 40, borderRadius: R.md, boxShadow: focus ? `0 0 0 3px ${C.focusHalo}` : 'none' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 10px', border: `1px solid ${bd}`, borderRight: 0, borderRadius: `${R.md}px 0 0 ${R.md}px`, background: C.surfaceSunken, color: C.textSecondary, fontFamily: MONO, fontSize: 13, fontWeight: 500 }}>{country} {code}<Ic n="chevD" s={12} /></span>
      <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', border: `1px solid ${bd}`, borderRadius: `0 ${R.md}px ${R.md}px 0`, background: C.surface, fontFamily: MONO, fontSize: 15, fontWeight: 500, color: v ? C.text : C.textSecondary, fontVariantNumeric: 'tabular-nums', position: 'relative' }}><span style={{ flex: 1 }}>{v || placeholder || '79 000 0000'}{focus && <span style={{ display: 'inline-block', width: 1.5, height: 16, background: C.focus, marginLeft: 1 }} />}</span>{verified && <Ic n="shieldCheck" s={18} c={C.successText} />}<Hit h={40} /></span>
    </div>
    {(hint || warn || verified) && <Row gap={6}>{warn && <Ic n="alertCircle" s={16} c={C.warningText} />}<Tx r="bodySm" c={warn ? C.warningText : verified ? C.successText : C.textSecondary}>{warn || hint || $('تم التحقق عبر رمز واتساب', 'Verified by WhatsApp code')}</Tx></Row>}
  </div>;
};
// OTPField: n boxes 44×52 mono 22; a wrong code is a form problem → amber. timer = seconds to resend.
const OTPField = ({ n = 6, filled = 0, error, timer, label, style, focus = true, channel = 'sms', hint }) => {
  const C = useC(); const { $ } = useL();
  return <div role="group" aria-label={label || $('رمز التحقق', 'Verification code')} style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
    {label && <Tx r="label" upper c={C.textSecondary}>{label}</Tx>}
    <div dir="ltr" style={{ display: 'flex', gap: 8 }}>{Array.from({ length: n }).map((_, i) => { const f = i < filled; const cur = focus && i === filled && !error; return <span key={i} style={{ width: 44, height: 52, borderRadius: R.md, border: `1px solid ${error ? C.warning : cur ? C.focus : C.controlBorder}`, background: C.surface, display: 'grid', placeItems: 'center', fontFamily: MONO, fontSize: 22, fontWeight: 500, color: C.text, boxShadow: cur ? `0 0 0 3px ${C.focusHalo}` : 'none' }}>{f ? '•' : cur ? <span style={{ width: 1.5, height: 20, background: C.focus }} /> : ''}</span>; })}</div>
    <Row gap={8} justify="space-between">
      {error ? <Row gap={6}><Ic n="alertCircle" s={16} c={C.warningText} /><Tx r="bodySm" c={C.warningText}>{typeof error === 'string' ? error : $('الرمز غير صحيح. جرّب مرة أخرى.', 'That code is not right. Try again.')}</Tx></Row> : <Tx r="bodySm" c={C.textSecondary}>{hint || (channel === 'whatsapp' ? $('أدخل الرمز المرسل عبر واتساب', 'Enter the code sent on WhatsApp') : $('أدخل الرمز المرسل برسالة نصية', 'Enter the code sent by SMS'))}</Tx>}
      {timer != null && <Tx r="bodySm" c={C.textSecondary} style={{ whiteSpace: 'nowrap' }}>{timer > 0 ? <>{$('إعادة الإرسال خلال', 'Resend in')} <Num r="bodySm" c={C.textSecondary}>{Math.floor(timer / 60)}:{pad2(timer % 60)}</Num></> : <Btn v="link" size="sm">{$('إعادة الإرسال', 'Resend')}</Btn>}</Tx>}
    </Row>
  </div>;
};
// PIN dots (lock screen). A wrong PIN is a form problem → amber.
const PinDots = ({ n = 4, filled = 0, warn }) => { const C = useC(); return <Row gap={16} justify="center" style={{ direction: 'ltr' }}>{Array.from({ length: n }).map((_, i) => <span key={i} style={{ width: 16, height: 16, borderRadius: 8, background: i < filled ? (warn ? C.warning : C.primary) : 'transparent', border: `2px solid ${warn ? C.warning : i < filled ? C.primary : C.controlBorder}` }} />)}</Row>; };
const PINField = ({ filled = 0, error, n = 4, label, style }) => {
  const C = useC(); const { $ } = useL();
  return <div role="group" aria-label={label || $('الرمز السري', 'PIN')} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', ...style }}>
    {label && <Tx r="bodySm" c={C.textSecondary}>{label}</Tx>}
    <PinDots n={n} filled={filled} warn={!!error} />
    {error && <Row gap={6}><Ic n="alertCircle" s={16} c={C.warningText} /><Tx r="bodySm" c={C.warningText}>{typeof error === 'string' ? error : $('رمز غير صحيح · محاولتان متبقيتان', 'Wrong PIN · 2 attempts left')}</Tx></Row>}
  </div>;
};
// DateTimeField: date and time inputs side by side with the timezone caption.
const DateTimeField = ({ label, date: d, time, tz, hint, warn, focus, style, required, compact }) => {
  const C = useC(); const { $, date, t24 } = useL();
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
    {label && <Row gap={4}><Tx r="label" upper c={C.textSecondary}>{label}</Tx>{required && <Tx r="caption" c={C.textSecondary}>{$('(مطلوب)', '(required)')}</Tx>}</Row>}
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 8 }}>
      <Field icon="calendar" value={d ? date(d, compact ? {} : { dow: true, year: true }) : undefined} placeholder={$('اختر التاريخ', 'Pick a date')} focus={focus === 'date'} warn={warn ? ' ' : undefined} />
      <Field icon="clock" value={time ? t24(time) : undefined} placeholder="10:00" mono dir="ltr" focus={focus === 'time'} />
    </div>
    {(hint || warn || tz) && <Row gap={6} align="flex-start">{warn && <Ic n="alertCircle" s={16} c={C.warningText} />}<Tx r="bodySm" c={warn ? C.warningText : C.textSecondary}>{warn || hint || ''}{tz ? `${warn || hint ? ' · ' : ''}${tz}` : ''}</Tx></Row>}
  </div>;
};
// Combobox with a static open list. options: strings or { l, sub, icon, lead }. highlight = index on surfaceSelected.
const Combobox = ({ label, value, placeholder, options = [], open, highlight, hint, warn, style, icon }) => {
  const C = useC(); const { $ } = useL();
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', ...style }}>
    <Field label={label} value={value} placeholder={placeholder || $('ابدأ الكتابة للبحث', 'Type to search')} icon={icon} iconEnd={open ? 'chevU' : 'chevD'} focus={open} hint={open ? undefined : hint} warn={open ? undefined : warn} />
    {open && <div role="listbox" aria-label={label || $('الخيارات', 'Options')} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.md, boxShadow: C.el[2], padding: 4, display: 'flex', flexDirection: 'column', zIndex: 5 }}>
      {options.length === 0 && <div style={{ padding: '10px 12px' }}><Tx r="bodySm" c={C.textSecondary}>{$('لا نتائج', 'No matches')}</Tx></div>}
      {options.map((o, i) => { const it = typeof o === 'string' ? { l: o } : o; const on = i === highlight; return <div key={i} role="option" aria-selected={on || undefined} style={{ minHeight: 40, display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: R.sm, background: on ? C.surfaceSelected : 'transparent' }}>
        {it.lead}{it.icon && <Ic n={it.icon} s={18} c={C.textSecondary} />}
        <Col gap={0} style={{ flex: 1 }}><Tx r="body" c={on ? C.primaryText : C.text} style={{ fontWeight: on ? 500 : 400 }}>{it.l}</Tx>{it.sub && <Tx r="caption" c={C.textSecondary}>{it.sub}</Tx>}</Col>
        {it.trail}{it.selected && <Ic n="check" s={16} c={C.primary} />}
      </div>; })}
    </div>}
  </div>;
};
// Quantity stepper: 40 px buttons, minus disabled at min.
const QtyStepper = ({ v = 1, min = 0, max, unit, size = 40, style, label }) => {
  const C = useC(); const { $ } = useL();
  const b = (icon, dis, lbl) => <button type="button" tabIndex={-1} aria-label={lbl} disabled={dis} style={{ width: size, height: size, display: 'grid', placeItems: 'center', color: dis ? C.textDisabled : C.text, background: 'transparent', border: 'none', padding: 0, cursor: dis ? 'default' : 'pointer', position: 'relative' }}><Ic n={icon} s={18} w={2} /><Hit h={size} w={size} /></button>;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
    {label && <Tx r="label" upper c={C.textSecondary}>{label}</Tx>}
    <div style={{ display: 'inline-flex', alignItems: 'center', height: size, borderRadius: R.md, border: `1px solid ${C.controlBorder}`, background: C.surface, overflow: 'hidden', flexShrink: 0, width: 'fit-content' }}>
      {b('minus', v <= min, $('أقل', 'Less'))}
      <span style={{ minWidth: 56, height: size, display: 'grid', placeItems: 'center', borderInline: `1px solid ${C.border}`, padding: '0 8px' }}><Num r="money">{v}{unit ? ` ${unit}` : ''}</Num></span>
      {b('plus', max != null && v >= max, $('أكثر', 'More'))}
    </div>
  </div>;
};
// FileDropzone: idle · uploading (pct) · done · error (a failed upload is alert).
const FileDropzone = ({ label, state = 'idle', pct = 0, name, hint, style, accept }) => {
  const C = useC(); const { $ } = useL();
  const t = state === 'error' ? toneOf(C, 'alert') : state === 'done' ? toneOf(C, 'success') : null;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
    {label && <Tx r="label" upper c={C.textSecondary}>{label}</Tx>}
    <div style={{ minHeight: 96, padding: 16, borderRadius: R.md, border: `1.5px dashed ${t ? t.dot : C.controlBorder}`, background: t ? t.bg : C.surface, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, textAlign: 'center' }}>
      {state === 'idle' && <><Ic n="upload" s={24} c={C.textSecondary} /><Tx r="bodySm" c={C.text}>{$('أفلت ملفاً هنا أو ', 'Drop a file here or ')}<span style={{ color: C.primaryText, fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}>{$('اختر من الجهاز', 'browse')}</span></Tx><Tx r="caption" c={C.textSecondary}>{hint || accept || $('PDF أو JPG حتى 10 م.ب', 'PDF or JPG up to 10 MB')}</Tx></>}
      {state === 'uploading' && <><Row gap={8} style={{ width: '100%' }}><Ic n="file" s={20} c={C.textSecondary} /><Tx r="bodySm" style={{ flex: 1, textAlign: 'start', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</Tx><Num r="caption" c={C.textSecondary}>{pct}%</Num></Row><Progress v={pct / 100} style={{ width: '100%' }} /></>}
      {state === 'done' && <Row gap={8} style={{ width: '100%' }}><Ic n="checkCircle" s={20} c={t.fg} /><Tx r="bodySm" style={{ flex: 1, textAlign: 'start', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</Tx><Btn v="ghost" size="xs" icon="x" label={$('إزالة', 'Remove')} /></Row>}
      {state === 'error' && <Row gap={8} style={{ width: '100%' }}><Ic n="alertCircle" s={20} c={t.fg} /><Col gap={0} style={{ flex: 1, textAlign: 'start' }}><Tx r="bodySm" c={t.fg} style={{ fontWeight: 500 }}>{$('فشل الرفع', 'Upload failed')}</Tx><Tx r="caption" c={C.textSecondary}>{name} · {$('انقطع الاتصال. حاول مرة أخرى.', 'Connection dropped. Try again.')}</Tx></Col><Btn v="secondary" size="sm" icon="sync">{$('إعادة', 'Retry')}</Btn></Row>}
    </div>
  </div>;
};
// QR is always dark-on-light (scanners need it): paper tokens, never theme surfaces.
const QR = ({ seed = 'x', size = 120, ink: ink0, bg: bg0, pad = 2 }) => {
  const C = useC(); const ink = ink0 || C.paperInk, bg = bg0 || C.paper; const N = 25; const r = rng(seed); const cells = [];
  const finder = (x, y) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!finder(x, y) && r() > 0.52) cells.push(<rect key={x + '-' + y} x={x} y={y} width="1" height="1" />);
  const F = (x, y) => <g key={'f' + x + y}><rect x={x} y={y} width="7" height="7" fill={ink} /><rect x={x + 1} y={y + 1} width="5" height="5" fill={bg} /><rect x={x + 2} y={y + 2} width="3" height="3" fill={ink} /></g>;
  return <svg width={size} height={size} viewBox={`-${pad} -${pad} ${N + pad * 2} ${N + pad * 2}`} role="img" aria-label="QR code" style={{ display: 'block', background: bg, borderRadius: 6, flexShrink: 0 }}><g fill={ink}>{cells}</g>{F(0, 0)}{F(N - 7, 0)}{F(0, N - 7)}</svg>;
};
