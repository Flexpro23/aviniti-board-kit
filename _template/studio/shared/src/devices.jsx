/* Devices + generic app shells.
 * PhoneDevice 390×844 (iPhone 15) · TabletDevice 1194×834 (iPad Pro 11″ landscape) · DesktopDevice 1440×900 (browser).
 * Shells: PhoneApp (top bar + bottom tabs from props) · DesktopApp (sidebar from props + 56 px top bar) · TabletApp (nav rail
 * from props) · PhoneBlank / DesktopBlank (full-bleed). Nav defaults come from FX.nav.{phone,desktop,tablet} when no prop is given.
 * Overlays: Scrim, Sheet (phone), Dialog, SidePanel (desktop side sheet), Toast, StickyAction (phone 56 px bar).
 * Requires core.jsx + kit.jsx (Row, Col, Tx, Ic, IconBtn, Btn, Avatar, Field, badgeStyle, toneOf).
 * Nav item shape: { id, i: icon, l: {ar, en} | string, badge?: n | { n, tone }, fab?: true (phone raised centre slot) }.
 * Sidebar shape: [{ g: {ar, en} | null, items: [navItem…] }].
 */

// Landmark names must be unique on a page that renders the same shell dozens of times (axe landmark-unique).
let NAV_SEQ = 0;
const useNavName = base => { const n = useRef(null); if (n.current == null) n.current = ++NAV_SEQ; return `${base} · ${n.current}`; };
// clock: optional 'HH:MM' for a screen that depicts another moment (default FX.now.time); date: optional 'YYYY-MM-DD'
const StatusBar = ({ tablet, tone, clock, date }) => {
  const C = useC(); const { isAr } = useL(); const ink = tone || C.statusInk;
  const icons = <Row gap={tablet ? 6 : 5} style={{ color: ink }}>
    {!tablet && <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1" fill={ink} /><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill={ink} /><rect x="10" y="3" width="3" height="9" rx="1" fill={ink} /><rect x="15" y="0" width="3" height="12" rx="1" fill={ink} /></svg>}
    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="M8 2.2c2.4 0 4.6.9 6.2 2.5l1.2-1.2A10.4 10.4 0 0 0 8 .5 10.4 10.4 0 0 0 .6 3.5l1.2 1.2A8.7 8.7 0 0 1 8 2.2zm0 3.4c1.5 0 2.8.6 3.8 1.5L13 5.9A7 7 0 0 0 8 3.9a7 7 0 0 0-5 2l1.2 1.2c1-.9 2.3-1.5 3.8-1.5zM8 9a1.6 1.6 0 1 0 0 3.2L10.4 9.6A3.3 3.3 0 0 0 8 9z" fill={ink} /></svg>
    <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke={ink} opacity=".4" /><rect x="2" y="2" width="16" height="9" rx="2" fill={ink} /><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill={ink} opacity=".4" /></svg>
  </Row>;
  const [hh, mm] = (clock || FX.now.time).split(':').map(Number); const d = new Date((date || FX.now.date) + 'T12:00:00');
  const dateStr = isAr ? `${FX.DAYS.ar[d.getDay()]} ${d.getDate()} ${FX.MONTHS.ar[d.getMonth()]}` : `${FX.DAYS_SHORT.en[d.getDay()]} ${d.getDate()} ${FX.MONTHS_SHORT.en[d.getMonth()]}`;
  const tm = <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: tablet ? 13 : 16.5, color: ink, letterSpacing: isAr ? 0 : '-0.01em', display: 'inline-flex', gap: 8 }}><span dir="ltr" style={{ unicodeBidi: 'isolate' }}>{`${pad2(hh)}:${pad2(mm)}`}</span>{tablet && <span>{dateStr}</span>}</span>;
  return <div style={{ height: tablet ? DEV.tablet.status : DEV.phone.status, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: tablet ? 0 : 14, paddingInlineStart: tablet ? 22 : 34, paddingInlineEnd: tablet ? 22 : 30, flexShrink: 0, position: 'relative', zIndex: 5 }}>
    {tm}{icons}
  </div>;
};
const HomeBar = ({ dark }) => { const C = useC(); return <div style={{ height: 34, display: 'grid', placeItems: 'center', flexShrink: 0 }}><span style={{ width: 139, height: 5, borderRadius: 3, background: dark ? C.onPhoto : C.text, opacity: .9 }} /></div>; };

// Device frames. data-frame lets QA count frames; dir/lang make the screen mirror.
const PhoneDevice = ({ children, lang, bg }) => {
  const C = useC();
  return <div data-frame="phone" lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ width: DEV.phone.w, height: DEV.phone.h, borderRadius: DEV.phone.radius, overflow: 'hidden', position: 'relative', background: bg || C.bg, boxShadow: `0 0 0 11px ${C.device}, 0 0 0 12.5px ${C.deviceRing}, ${C.el[4]}`, margin: 13, flexShrink: 0, fontFamily: FONT, textAlign: 'start' }}>
    {children}
    <span aria-hidden="true" style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 124, height: 36, borderRadius: 18, background: '#000', zIndex: 20 }} />
  </div>;
};
const TabletDevice = ({ children, lang, bg }) => {
  const C = useC();
  return <div data-frame="tablet" lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ width: DEV.tablet.w, height: DEV.tablet.h, borderRadius: DEV.tablet.radius, overflow: 'hidden', position: 'relative', background: bg || C.bg, boxShadow: `0 0 0 16px ${C.device}, 0 0 0 17.5px ${C.deviceRing}, ${C.el[4]}`, margin: 18, flexShrink: 0, fontFamily: FONT, textAlign: 'start' }}>
    {children}
  </div>;
};
// Browser frame: 44 px chrome with the app URL (url prop on ScreenFrame / StateRow, else BoardApp url, else FX.project.url)
const DesktopDevice = ({ children, lang, bg, url }) => {
  const C = useC();
  return <div data-frame="desktop" lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ width: DEV.desktop.w, height: DEV.desktop.h, borderRadius: DEV.desktop.radius, overflow: 'hidden', position: 'relative', background: bg || C.bg, boxShadow: `0 0 0 1.5px ${C.deviceRing}, ${C.el[4]}`, margin: 18, flexShrink: 0, fontFamily: FONT, textAlign: 'start', display: 'flex', flexDirection: 'column' }}>
    <div dir="ltr" style={{ height: DEV.desktop.chrome, flexShrink: 0, background: C.surfaceSunken, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px' }}>
      <span style={{ display: 'flex', gap: 7 }}>{[C.alert, C.warning, C.success].map((c, i) => <span key={i} style={{ width: 11, height: 11, borderRadius: 6, background: c, opacity: .85 }} />)}</span>
      <span style={{ display: 'flex', gap: 4, color: C.textFaint }}><Ic n="chevL" s={16} /><Ic n="chevR" s={16} /></span>
      <span style={{ flex: 1, maxWidth: 560, margin: '0 auto', height: 28, borderRadius: 8, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: MONO, fontSize: 12, color: C.textSecondary }}><Ic n="lock" s={12} />{url || window.BOARD_DEFAULT_URL || FX.project.url}</span>
      <span style={{ width: 60 }} />
    </div>
    <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>{children}</div>
  </div>;
};

// ── Overlays ─────────────────────────────────────────────────────────────────
const Scrim = ({ children, style }) => { const C = useC(); return <div style={{ position: 'absolute', inset: 0, background: C.scrim, zIndex: 40, ...style }}>{children}</div>; };
// Bottom sheet (phone). Radius xl, grab handle, safe-area padding; foot holds the sticky action.
const Sheet = ({ title, sub, children, foot, h, onClose = true, handle = true, style, full }) => {
  const C = useC(); const { $ } = useL();
  return <Scrim><div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: full ? 0 : undefined, height: h, maxHeight: full ? undefined : '92%', background: C.surface, borderRadius: full ? 0 : `${R.xl}px ${R.xl}px 0 0`, boxShadow: C.el[4], display: 'flex', flexDirection: 'column', ...style }}>
    {handle && !full && <div style={{ height: 22, display: 'grid', placeItems: 'center', flexShrink: 0 }}><span style={{ width: 36, height: 4, borderRadius: 2, background: C.borderStrong }} /></div>}
    {full && <StatusBar />}
    {title && <Row justify="space-between" style={{ padding: '2px 20px 12px' }}><Col gap={2}><Tx r="h2">{title}</Tx>{sub && <Tx r="bodySm" c={C.textSecondary}>{sub}</Tx>}</Col>{onClose && <IconBtn icon="x" label={$('إغلاق', 'Close')} size={44} v="quiet" />}</Row>}
    <div style={{ flex: 1, overflow: 'hidden', padding: '0 20px', display: 'flex', flexDirection: 'column', minHeight: 0, gap: 12 }}>{children}</div>
    {foot && <div style={{ padding: '12px 20px 0', borderTop: `1px solid ${C.border}` }}>{foot}<HomeBar /></div>}
    {!foot && <div style={{ height: 34, flexShrink: 0 }} />}
  </div></Scrim>;
};
// Dialog (desktop and tablet). Summary dialogs (irreversible actions) pass ONE named primary button in foot.
const Dialog = ({ title, sub, icon, tone, children, foot, w = 560, style }) => {
  const C = useC(); const { $ } = useL(); const t = tone ? toneOf(C, tone) : null;
  return <Scrim style={{ display: 'grid', placeItems: 'center' }}><div role="dialog" aria-modal="false" aria-label={typeof title === 'string' ? title : undefined} style={{ width: w, maxWidth: '92%', background: C.surface, borderRadius: R.lg, boxShadow: C.el[4], border: `1px solid ${C.border}`, overflow: 'hidden', ...style }}>
    <div style={{ padding: '20px 20px 0' }}><Row gap={14} align="flex-start">
      {icon && <span style={{ width: 44, height: 44, borderRadius: 22, display: 'grid', placeItems: 'center', background: t ? t.bg : C.primarySubtle, border: `1px solid ${t ? t.bd : C.primaryBorder}`, color: t ? t.fg : C.primaryText, flexShrink: 0 }}><Ic n={icon} s={22} /></span>}
      <Col gap={4} style={{ flex: 1 }}><Tx r="h2" c={tone === 'alert' ? C.alertText : undefined}>{title}</Tx>{sub && <Tx r="bodySm" c={C.textSecondary} style={{ textWrap: 'pretty' }}>{sub}</Tx>}</Col>
      <IconBtn icon="x" label={$('إغلاق', 'Close')} size={40} v="quiet" />
    </Row></div>
    <div style={{ padding: '16px 20px' }}>{children}</div>
    {foot && <div style={{ padding: '0 20px 20px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>{foot}</div>}
  </div></Scrim>;
};
// Side sheet (desktop detail panels and forms). Side sheets on desktop, bottom sheets on phone.
const SidePanel = ({ title, sub, children, foot, w = 480, scrim = true, tabs }) => {
  const C = useC(); const { $ } = useL();
  const panel = <div style={{ position: 'absolute', top: 0, bottom: 0, insetInlineEnd: 0, width: w, background: C.surface, boxShadow: C.el[4], borderInlineStart: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', zIndex: 41 }}>
    <Row justify="space-between" style={{ padding: '16px 20px', borderBottom: tabs ? 'none' : `1px solid ${C.border}` }}><Col gap={2}><Tx r="h2">{title}</Tx>{sub && <Tx r="bodySm" c={C.textSecondary}>{sub}</Tx>}</Col><IconBtn icon="x" label={$('إغلاق', 'Close')} size={40} v="quiet" /></Row>
    {tabs}
    <div className="bk-body" style={{ flex: 1, overflow: 'hidden', padding: 20, display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>{children}</div>
    {foot && <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.border}`, background: C.surface2, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>{foot}</div>}
  </div>;
  return scrim ? <Scrim>{panel}</Scrim> : panel;
};
// Toast on the raised surface; Undo link for reversible actions.
const Toast = ({ icon = 'checkCircle', tone = 'success', children, action, bottom = 96, style, desktop }) => {
  const C = useC(); const t = toneOf(C, tone);
  return <div role="status" style={{ position: 'absolute', bottom, [desktop ? 'insetInlineEnd' : 'left']: desktop ? 24 : '50%', transform: desktop ? undefined : 'translateX(-50%)', zIndex: 45, minWidth: 300, maxWidth: desktop ? 420 : '90%', display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderRadius: R.lg, background: C.surface, border: `1px solid ${C.border}`, boxShadow: C.el[2], ...style }}>
    <Ic n={icon} s={20} c={tone === 'neutral' ? C.textSecondary : t.fg} style={{ marginTop: 1 }} />
    <Tx r="bodySm" c={C.text} style={{ flex: 1, fontWeight: 500, textWrap: 'pretty' }}>{children}</Tx>
    {action && <Tx r="label" c={C.primaryText} style={{ fontWeight: 600, whiteSpace: 'nowrap', textDecoration: 'underline', textUnderlineOffset: 3 }}>{action}</Tx>}
  </div>;
};
// Phone sticky action bar: one 56 px primary button, optional summary line above, safe-area padding
const StickyAction = ({ children, info, style }) => { const C = useC(); return <div style={{ flexShrink: 0, background: C.surface, borderTop: `1px solid ${C.border}`, padding: '12px 16px 0', ...style }}>{info && <div style={{ marginBottom: 10 }}>{info}</div>}{children}<HomeBar /></div>; };

// ── Navigation pieces ─────────────────────────────────────────────────────────
const navLabel = (tr, l) => (typeof l === 'string' ? l : tr(l));
const navBadge = b => (b == null || b === 0 || b === '' ? null : typeof b === 'object' ? (b.n ? b : null) : { n: b });
// Phone bottom tabs. A tab with fab:true is drawn as the raised centre action.
const BottomNav = ({ tabs = [], active, badges = {} }) => {
  const C = useC(); const { tr, $ } = useL(); const navName = useNavName($('التنقل', 'Navigation'));
  return <nav aria-label={navName} style={{ flexShrink: 0, background: C.surface, borderTop: `1px solid ${C.border}` }}>
    <div style={{ height: TOUCH.tabBar, display: 'flex', alignItems: 'stretch' }}>
      {tabs.map(t => { const on = t.id === active; const bd = navBadge(badges[t.id] != null ? badges[t.id] : t.badge); return <a key={t.id} href="#" tabIndex={-1} aria-current={on ? 'page' : undefined} aria-label={t.fab ? navLabel(tr, t.l) : undefined} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, position: 'relative', color: on ? C.primaryText : C.textSecondary, textDecoration: 'none', minWidth: 0 }}>
        {t.fab ? <span style={{ width: 52, height: 52, marginTop: -22, borderRadius: 26, background: C.primary, color: C.onPrimary, display: 'grid', placeItems: 'center', boxShadow: `0 0 0 4px ${C.surface}, ${C.el[2]}` }}><Ic n={t.i} s={26} w={2.2} /></span> : <Ic n={t.i} s={24} w={on ? 2 : 1.75} />}
        {!t.fab && <Tx r="tab" c={on ? C.primaryText : C.textSecondary} style={{ fontWeight: on ? 600 : 500, whiteSpace: 'nowrap' }}>{navLabel(tr, t.l)}</Tx>}
        {bd && <span style={{ position: 'absolute', top: 4, insetInlineStart: '50%', marginInlineStart: 6, ...badgeStyle(C, bd.tone || 'alert', 18) }}>{bd.n}</span>}
      </a>; })}
    </div>
    <HomeBar />
  </nav>;
};
// Desktop sidebar (240 px, collapsible to a 64 px rail). groups: [{ g, items }]; logo: element (default the Wordmark).
const Sidebar = ({ groups = [], active, collapsed, badges = {}, logo, foot }) => {
  const C = useC(); const { tr, $, isAr } = useL(); const w = collapsed ? TOUCH.sidebarCollapsed : TOUCH.sidebar;
  const navName = useNavName($('القائمة الرئيسية', 'Main'));
  return <nav aria-label={navName} style={{ width: w, flexShrink: 0, background: C.surfaceSunken, borderInlineEnd: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', padding: 12, gap: 2, overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: collapsed ? '6px 0 14px' : '6px 8px 14px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
      {logo || (collapsed ? <Monogram s={30} /> : <Wordmark size={18} />)}
    </div>
    {groups.map((g, gi) => <React.Fragment key={gi}>
      {!collapsed && g.g && <div style={{ fontFamily: FONT, fontSize: 11, lineHeight: '16px', fontWeight: 500, letterSpacing: isAr ? 0 : '.06em', textTransform: isAr ? 'none' : 'uppercase', color: C.textFaint, padding: '12px 8px 4px' }}>{navLabel(tr, g.g)}</div>}
      {collapsed && gi > 0 && <div style={{ height: 1, background: C.border, margin: '8px 6px' }} />}
      {g.items.map(it => { const on = it.id === active; const bd = navBadge(badges[it.id] != null ? badges[it.id] : it.badge); const label = navLabel(tr, it.l); return <a key={it.id} href="#" tabIndex={-1} aria-current={on ? 'page' : undefined} aria-label={collapsed ? label : undefined} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, height: 36, padding: collapsed ? 0 : '0 8px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: R.md, background: on ? C.surfaceSelected : 'transparent', color: on ? C.primaryText : C.textSecondary, textDecoration: 'none', fontFamily: FONT, fontSize: 14, fontWeight: 500 }}>
        {on && <span aria-hidden="true" style={{ position: 'absolute', insetInlineStart: -12, top: 8, bottom: 8, width: 3, borderRadius: 2, background: C.primary }} />}
        <Ic n={it.i} s={20} />
        {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
        {bd && !collapsed && <span style={{ ...badgeStyle(C, bd.tone || 'neutral', 20), boxShadow: 'none', background: bd.tone ? undefined : C.surface, color: bd.tone ? undefined : C.textSecondary, border: bd.tone ? 'none' : `1px solid ${C.border}` }}>{bd.n}</span>}
        {bd && collapsed && <span style={{ position: 'absolute', top: 4, insetInlineEnd: 6, width: 8, height: 8, borderRadius: 4, background: bd.tone === 'alert' ? C.alert : C.primary }} />}
      </a>; })}
    </React.Fragment>)}
    <div style={{ flex: 1 }} />
    {!collapsed && foot}
    <IconBtn icon="panelLeft" label={collapsed ? $('توسيع القائمة', 'Expand sidebar') : $('طيّ القائمة', 'Collapse sidebar')} size={36} style={{ alignSelf: collapsed ? 'center' : 'flex-start', color: C.textSecondary }} />
  </nav>;
};
// Tablet nav rail: icon over label, 88 px wide.
const NavRail = ({ items = [], active, badges = {}, logo }) => {
  const C = useC(); const { tr, $ } = useL(); const navName = useNavName($('التنقل', 'Navigation'));
  return <nav aria-label={navName} style={{ width: TOUCH.rail, flexShrink: 0, background: C.surfaceSunken, borderInlineEnd: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0', gap: 6 }}>
    <div style={{ marginBottom: 10 }}>{logo || <Monogram s={36} />}</div>
    {items.map(it => { const on = it.id === active; const bd = navBadge(badges[it.id] != null ? badges[it.id] : it.badge); return <a key={it.id} href="#" tabIndex={-1} aria-current={on ? 'page' : undefined} style={{ width: 76, minHeight: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: R.lg, textDecoration: 'none', color: on ? C.primaryText : C.textSecondary, position: 'relative' }}>
      <span style={{ width: 56, height: 32, borderRadius: 16, display: 'grid', placeItems: 'center', background: on ? C.surfaceSelected : 'transparent' }}><Ic n={it.i} s={22} w={on ? 2 : 1.75} /></span>
      <Tx r="tab" c={on ? C.primaryText : C.textSecondary} style={{ fontWeight: on ? 600 : 500, whiteSpace: 'nowrap', maxWidth: 76, overflow: 'hidden', textOverflow: 'ellipsis' }}>{navLabel(tr, it.l)}</Tx>
      {bd && <span style={{ position: 'absolute', top: 2, insetInlineEnd: 10, ...badgeStyle(C, bd.tone || 'alert', 18) }}>{bd.n}</span>}
    </a>; })}
  </nav>;
};

// ── App shells ───────────────────────────────────────────────────────────────
// PhoneApp: status bar · top bar (root: avatar, title, search, bell · child: back, title, one overflow) · banner · body ·
// sticky bottom (replaces the tabs) · tabs. who: FX.person id for the avatar (default FX.user); lead replaces the avatar.
const PhoneApp = ({ title, sub, back, actions, children, tabs, active, badges, bottom, banner, pad = 16, bg, overlay, who, lead, clock, date, bell, search = true, noNav, noHeader, gap = 12 }) => {
  const C = useC(); const { $, tr } = useL(); const p = FX.person(who || FX.user); const T = tabs || (FX.nav && FX.nav.phone) || [];
  return <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: bg || C.bg }}>
    <div style={{ background: C.surface, borderBottom: noHeader ? 'none' : `1px solid ${C.border}` }}>
      <StatusBar clock={clock} date={date} />
      {!noHeader && <div style={{ height: TOUCH.topBarPhone, display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px' }}>
        {back ? <IconBtn icon="arrowL" label={$('رجوع', 'Back')} size={44} /> : <span style={{ width: 44, height: 44, display: 'grid', placeItems: 'center' }}>{lead || (p && <Avatar ini={tr(p.ini)} name={tr(p.name)} size={32} />)}</span>}
        <div style={{ flex: 1, minWidth: 0, paddingInlineStart: 4 }}>
          <Tx r="h3" as="div" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</Tx>
          {sub && <Tx r="caption" as="div" c={C.textSecondary} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</Tx>}
        </div>
        {back ? (actions || <IconBtn icon="moreV" label={$('المزيد', 'More')} size={44} />) : <>
          {search && <IconBtn icon="search" label={$('بحث', 'Search')} size={44} />}
          {bell !== false && <IconBtn icon="bell" label={$('الإشعارات', 'Notifications')} size={44} badge={bell || undefined} />}
          {actions}
        </>}
      </div>}
    </div>
    {banner}
    <div className="bk-body" style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: pad, display: 'flex', flexDirection: 'column', gap }}>{children}</div>
    {bottom && <StickyAction>{bottom}</StickyAction>}
    {!noNav && !bottom && <BottomNav tabs={T} active={active} badges={badges} />}
    {noNav && !bottom && <HomeBar />}
    {overlay}
  </div>;
};
// Full-bleed phone screen (sign-in, lock, onboarding, done states) with status bar + home indicator only
const PhoneBlank = ({ children, bg, dark, overlay, clock }) => { const C = useC(); return <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: bg || C.bg }}><StatusBar tone={dark ? C.onInverse : undefined} clock={clock} /><div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>{children}</div><HomeBar dark={dark} />{overlay}</div>; };
// DesktopApp: sidebar · 56 px top bar (title or crumb + title, sub/date, search, actions, bell, avatar) · banner · body · toast · overlay.
// search: placeholder string, or false to hide. collapsed draws the 64 px rail. sidebarFoot: element at the sidebar bottom.
const DesktopApp = ({ sidebar, active, title, crumb, sub, actions, children, overlay, collapsed, badges, banner, pad = 32, bg, search, who, toast, logo, sidebarFoot, bell = 3, gap = 24 }) => {
  const C = useC(); const { $, tr, date } = useL(); const p = FX.person(who || FX.user); const G = sidebar || (FX.nav && FX.nav.desktop) || [];
  return <div style={{ position: 'absolute', inset: 0, display: 'flex', background: bg || C.bg }}>
    <Sidebar groups={G} active={active} collapsed={collapsed} badges={badges} logo={logo} foot={sidebarFoot} />
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <header style={{ height: TOUCH.topBarDesktop, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ minWidth: 0, flexShrink: 0, maxWidth: 560, display: 'flex', alignItems: 'baseline', gap: 12 }}>
          {crumb && <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.textSecondary, fontFamily: FONT, fontSize: 13, whiteSpace: 'nowrap' }}>{crumb}</div>}
          <Tx r="title" as="h1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{title}</Tx>
          {!crumb && <Tx r="bodySm" c={C.textSecondary} style={{ whiteSpace: 'nowrap' }}>{sub || date(FX.now.date, { dow: true, year: true })}</Tx>}
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>{search !== false && <Field icon="search" placeholder={search || $('بحث', 'Search')} size="sm" style={{ width: '100%', maxWidth: 420 }} />}</div>
        {actions}
        {bell !== false && <IconBtn icon="bell" label={$('الإشعارات', 'Notifications')} size={40} badge={bell || undefined} />}
        {p && <Avatar ini={tr(p.ini)} name={tr(p.name)} size={36} />}
      </header>
      {banner}
      <div className="bk-body" style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: pad, display: 'flex', flexDirection: 'column', gap }}>{children}</div>
      {toast}
    </div>
    {overlay}
  </div>;
};
// TabletApp: status bar · nav rail (rail items via props, default FX.nav.tablet) · top bar · body. Landscape iPad.
const TabletApp = ({ rail, active, title, sub, actions, children, overlay, badges, banner, pad = 24, bg, who, logo, gap = 20 }) => {
  const C = useC(); const { tr } = useL(); const p = FX.person(who || FX.user); const I_ = rail || (FX.nav && FX.nav.tablet) || [];
  return <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: bg || C.bg }}>
    <div style={{ background: C.surfaceSunken }}><StatusBar tablet /></div>
    <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
      <NavRail items={I_} active={active} badges={badges} logo={logo} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <header style={{ height: TOUCH.topBarDesktop, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 12 }}><Tx r="title" as="h1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{title}</Tx>{sub && <Tx r="bodySm" c={C.textSecondary} style={{ whiteSpace: 'nowrap' }}>{sub}</Tx>}</div>
          {actions}
          {p && <Avatar ini={tr(p.ini)} name={tr(p.name)} size={36} />}
        </header>
        {banner}
        <div className="bk-body" style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: pad, display: 'flex', flexDirection: 'column', gap }}>{children}</div>
      </div>
    </div>
    <HomeBar />
    {overlay}
  </div>;
};
// Full-bleed desktop page (sign-in, error pages, a marketing page)
const DesktopBlank = ({ children, bg, overlay }) => { const C = useC(); return <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: bg || C.bg, overflow: 'hidden' }}>{children}{overlay}</div>; };
