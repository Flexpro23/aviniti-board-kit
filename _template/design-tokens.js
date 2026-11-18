// ═══════════════════════════════════════════════════════════════════════════════
//  Aviniti Design System — UI Board Tokens
//  Reference file. Copy the relevant block into each new board.
//  This file is NOT imported — it is the specification.
//
//  Design systems live here — grep for "§" section markers below:
//    1. GOLD_NOIR     — dark premium (gold on near-black)
//    2. VIOLET_GLASS    — light glassmorphism (purple on soft white)
//    3b. GOLDEN_HOUR     — warm morning light (terracotta/sage/champagne, Fraunces+Inter)
//    3c. CLINIC_LUXE — luxe med-aesthetic (teal/jade/antique-gold, clinical+patient registers)
//
//  Most share UNIVERSAL tokens (typography, spacing, radii, frame dims, map);
//  CLINIC_LUXE defines its own shape/elevation/motion/breakpoint tokens
//  (see its section header) since its register system doesn't map 1:1 to UNIVERSAL.
//
//  THE RULE: After every approved client board, extract any new patterns here.
//  Every project has its own feel — but the premium quality is universal.
//
//  Updated: July 2026 · Designed by Aviniti
// ═══════════════════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────────────────────
//  1. GOLD NOIR — "Dark Premium"
//  Identity: authoritative, exclusive, night-shift energy
//  Use for: logistics, marketplace ops, fintech, enterprise, B2B dashboards,
//           any app that should feel like a Bloomberg terminal but beautiful
// ─────────────────────────────────────────────────────────────────────────────
const GOLD_NOIR = {

  // ── Primary brand ──────────────────────────────────────────────────────────
  primary:       "#C8A951",                           // gold — CTAs, active states, headings
  primaryLight:  "#DCBE6A",                           // gold highlight / hover
  primaryDim:    "rgba(200,169,81,0.12)",             // gold tint for backgrounds / badges
  primaryDimSm:  "rgba(200,169,81,0.10)",             // lighter variant (admin panels)
  grad:          "linear-gradient(135deg,#A68B3E,#C8A951,#DCBE6A)",  // button gradient

  // ── Background scale (darkest → surface) ──────────────────────────────────
  bg:    "#0A0A0A",  // root page / phone screen background
  card:  "#141414",  // primary card surface         (driver/vendor)
  card_: "#121212",  // primary card surface variant (admin)
  card2: "#1C1C1C",  // secondary surface / inputs  (driver/vendor)
  card2_:"#1A1A1A",  // secondary surface variant   (admin)
  bbg:   "linear-gradient(135deg,#060606,#0E0E0E,#080808)",  // board canvas bg

  // ── Borders ────────────────────────────────────────────────────────────────
  brd:  "#2A2A2A",  // default border
  brd_: "#252525",  // tighter border (admin)
  brdL: "#333333",  // lighter separator / hover border

  // ── Text ───────────────────────────────────────────────────────────────────
  w:  "#F0EDE8",  // warm white — primary text (intentionally not pure white)
  ts: "#9A9690",  // secondary — labels, subtitles, captions
  td: "#6A6660",  // dim — timestamps, placeholders, inactive icons

  // ── Semantic status ────────────────────────────────────────────────────────
  grn:  "#4ADE80",  grnD: "rgba(74,222,128,0.10)",   // success / available
  red:  "#F87171",  redD: "rgba(248,113,113,0.10)",   // error / offline / danger
  blu:  "#60A5FA",  bluD: "rgba(96,165,250,0.10)",    // info / in-progress
  org:  "#FB923C",  orgD: "rgba(251,146,60,0.10)",    // warning / pending / on-delivery

  // Admin uses 0.08 alpha for status backgrounds (slightly more restrained):
  grnD_admin: "rgba(74,222,128,0.08)",
  redD_admin: "rgba(248,113,113,0.08)",
  bluD_admin: "rgba(96,165,250,0.08)",
  orgD_admin: "rgba(251,146,60,0.08)",

  // ── Special surfaces ────────────────────────────────────────────────────────
  // Admin glassmorphism panel (left stats sidebar in S1):
  glassPanel: {
    background:           "rgba(10,10,10,0.85)",
    backdropFilter:       "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border:               "1px solid rgba(255,255,255,0.07)",
  },

  // ── Shadows ─────────────────────────────────────────────────────────────────
  shadowPhone:   "0 0 0 1px #3D3D3D, 0 0 0 3px #1A1A1A, 0 30px 80px rgba(0,0,0,0.8)",
  shadowDesktop: "0 24px 80px rgba(0,0,0,0.8)",
  shadowCard:    "0 4px 20px rgba(200,169,81,0.2)",
  shadowGlow:    "0 0 20px rgba(200,169,81,0.12)",

  // ── Phone frame hardware ──────────────────────────────────────────────────
  phoneShell: "linear-gradient(145deg,#2A2A2A,#1A1A1A)",
  phoneBorder: "#3D3D3D",
};


// ─────────────────────────────────────────────────────────────────────────────
//  2. VIOLET GLASS — "Liquid Glassmorphism"
//  Identity: modern, airy, approachable, trustworthy, forward-thinking
//  Use for: wellness, education, coaching, community, consumer lifestyle,
//           health tech, professional services, any app for human connection
// ─────────────────────────────────────────────────────────────────────────────
const VIOLET_GLASS = {

  // ── Primary brand ──────────────────────────────────────────────────────────
  primary:      "#9B4DCA",   // purple — CTAs, active states
  primaryDark:  "#7B2FA0",   // pressed / darker variant
  primaryLight: "#F3E8FF",   // tinted background surface
  primaryGlow:  "#C084FC",   // highlight / glow / gradient endpoint

  // ── Secondary accent ───────────────────────────────────────────────────────
  accent:       "#F5A623",   // amber — secondary role (student vs trainer)
  accentLight:  "#FFF8EB",   // amber tint

  // ── Background / page ──────────────────────────────────────────────────────
  bg:    "#F8F6FF",   // page background (soft purple-tinted white)
  white: "#FFFFFF",

  // ── Board canvas background ────────────────────────────────────────────────
  boardBg: "linear-gradient(135deg,#F0EBF8 0%,#E8ECF0 50%,#EDE7F6 100%)",

  // ── Glass surfaces ─────────────────────────────────────────────────────────
  card:        "rgba(255,255,255,0.65)",
  glass:       "rgba(255,255,255,0.45)",
  glassStrong: "rgba(255,255,255,0.72)",
  glassBorder: "rgba(255,255,255,0.60)",

  // ── Borders ────────────────────────────────────────────────────────────────
  border: "#E8E0F0",

  // ── Text ───────────────────────────────────────────────────────────────────
  text:          "#1A1A2E",   // near-black
  textSecondary: "#6B7280",
  textLight:     "#9CA3AF",   // placeholder / inactive

  // ── Semantic status ────────────────────────────────────────────────────────
  success: "#10B981",
  error:   "#EF4444",
  warning: "#F59E0B",
  info:    "#818CF8",   // indigo — used for informational flows

  // ── Gradients ──────────────────────────────────────────────────────────────
  gradient:       "linear-gradient(135deg,#9B4DCA 0%,#C084FC 50%,#818CF8 100%)",
  gradientDark:   "linear-gradient(135deg,#7B2FA0 0%,#9B4DCA 100%)",
  gradientSplash: "linear-gradient(160deg,#7B2FA0 0%,#9B4DCA 40%,#C084FC 70%,#818CF8 100%)",
  accentGrad:     "linear-gradient(135deg,#F5A623 0%,#E8930C 100%)",

  // ── Shadows ─────────────────────────────────────────────────────────────────
  shadowGlass: "0 8px 32px rgba(120,47,160,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
  shadowCard:  "0 4px 16px rgba(155,77,202,0.12)",
  shadowAvatar: "0 4px 12px rgba(155,77,202,0.25)",  // color avatar glow

  // ── Phone frame ────────────────────────────────────────────────────────────
  phoneFrame:  "3px solid rgba(155,77,202,0.15)",
  phoneShell:  "#F8F6FF",
  phoneShadow: "0 12px 48px rgba(120,47,160,0.15), 0 0 0 1px rgba(255,255,255,0.5)",

  // ── Glass helper function (copy into board script) ─────────────────────────
  // const glass = (opacity=0.45, blur=20) => ({
  //   background:           `rgba(255,255,255,${opacity})`,
  //   backdropFilter:       `blur(${blur}px)`,
  //   WebkitBackdropFilter: `blur(${blur}px)`,
  //   border:               "1px solid rgba(255,255,255,0.55)",
  //   boxShadow:            "0 8px 32px rgba(120,47,160,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
  // });
  //
  // const glassCard = (radius=20) => ({
  //   ...glass(0.55, 24),
  //   borderRadius: radius,
  //   padding: 16,
  // });
};


// ─────────────────────────────────────────────────────────────────────────────
//  3. UNIVERSAL — Shared across all boards regardless of theme
// ─────────────────────────────────────────────────────────────────────────────
const UNIVERSAL = {

  // ── Typography ─────────────────────────────────────────────────────────────
  font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  // Inter weights loaded: 400, 500, 600, 700, 800, 900
  // Arabic fallback: system-ui (uses device Arabic font — intentional)

  size: {
    "2xs": 8,    // tiny labels (ADMIN PANEL badge)
    xs:    10,   // badge text (admin)
    sm:    11,   // badge text (mobile), subtitles
    base:  12,   // sidebar nav, small cards
    md:    13,   // board toolbar text
    body:  14,   // button text, body copy
    lg:    15,   // status bar time, sidebar product name
    xl:    16,   // screen body text, driver name
    "2xl": 18,   // board title header
    "3xl": 20,   // flow section heading
    "4xl": 24,   // large stat numbers
    "5xl": 28,   // hero numbers
  },

  weight: {
    normal:    400,
    medium:    500,
    semibold:  600,
    bold:      700,
    extrabold: 800,
    black:     900,
  },

  // ── Spacing scale (px) ─────────────────────────────────────────────────────
  space: {
    1: 4, 2: 8, 3: 12, 4: 16, 5: 20,
    6: 24, 8: 32, 10: 40, 12: 48, 16: 64,
  },

  // ── Border radii ───────────────────────────────────────────────────────────
  radius: {
    badge:    7,   // badge/pill (admin)
    badgeMd:  8,   // badge/pill (mobile)
    sm:       9,   // small chip
    btn:      14,  // button
    card:     16,  // standard card
    lg:       20,  // large card / glass card (Violet Glass)
    xl:       24,  // overlays, tooltips
    "2xl":    30,  // logo squares, avatar containers
    phoneInner: 49,  // phone screen inner bezel
    phoneOuter: 52,  // phone frame outer shell
    desktopFrame: 16, // desktop browser frame
  },

  // ── Frame dimensions ───────────────────────────────────────────────────────
  frames: {
    // iPhone 15 Pro (Gold Noir — includes hardware buttons)
    phone: { outerW: 393, outerH: 852, innerOffset: 3, statusBarH: 59 },
    // Standard phone (Violet Glass — slightly shorter, simpler frame)
    phoneSm: { outerW: 390, outerH: 844, statusBarH: 54 },
    // Desktop browser (Admin dashboards)
    desktop: { w: 1440, h: 900, chromeH: 36 },
    // Sidebar width
    sidebar: 220,
  },

  // ── Board canvas ───────────────────────────────────────────────────────────
  board: {
    defaultZoom: 0.35,
    minZoom:     0.15,
    maxZoom:     1.0,
    step:        0.05,
    padding:     "80px 60px",
    gapScreens:  36,   // gap between screens in a flow (px, pre-scale)
    gapFlows:    60,   // margin-bottom on each flow section (px, pre-scale)
    gapDesktop:  48,   // gap between desktop frames in a flow
  },

  // ── Map ────────────────────────────────────────────────────────────────────
  map: {
    tilesDark:  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    tilesLight: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    // Default center: Amman, Jordan downtown (Hashem Restaurant area)
    amman:     [31.9539, 35.9297],
    zoom:       14,
    zoomAdmin:  12,    // wider view for ops maps
    // Route: Downtown Amman → Al-Shmeisani (example route)
    routeAmman: [
      [31.9539, 35.9297],
      [31.9580, 35.9200],
      [31.9650, 35.9050],
      [31.9710, 35.8970],
      [31.9773, 35.8894],
    ],
    // Map is always static (no interaction):
    mapOptions: { zoomControl: false, attributionControl: false, dragging: false, touchZoom: false, scrollWheelZoom: false, doubleClickZoom: false },
  },

  // ── CSS animations (paste into <style> block) ──────────────────────────────
  animations: `
    /* Pulsing live indicator dot */
    @keyframes pulse-dot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.3)} }

    /* Reveal from below — card / screen entrance */
    @keyframes slide-up   { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }

    /* Reveal from left — sidebar rows */
    @keyframes slide-in   { from{transform:translateX(-12px);opacity:0} to{transform:translateX(0);opacity:1} }

    /* Stat counter entrance */
    @keyframes count-up   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

    /* Bar chart fill */
    @keyframes bar-fill   { from{height:0} to{height:var(--h)} }

    /* Gold glow oscillation — card hover hint */
    @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(200,169,81,.12)} 50%{box-shadow:0 0 30px rgba(200,169,81,.25)} }

    /* Skeleton shimmer */
    @keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }

    /* Countdown bar — auto-accept timer */
    @keyframes countdown  { from{width:100%} to{width:0%} }

    /* Scale pop — modal appear */
    @keyframes pop-in     { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
  `,

  // ── Flow annotations (SVG arrows between screens) ─────────────────────────
  // Arrow marker definition — paste inside <defs> of annotation SVG:
  // <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
  //   <path d="M0,0 L0,6 L8,3 z" fill={C.primary}/>
  // </marker>
  //
  // Arrow path:
  // <path d="M {x1} {y} C {mid} {y}, {mid} {y}, {x2} {y}"
  //   stroke={C.primary} strokeWidth="2" fill="none"
  //   strokeDasharray="5,3" markerEnd="url(#arr)"/>
  //
  // Annotation tooltip:
  // style={{ position:"absolute", background:"rgba(14,14,14,0.92)",
  //   backdropFilter:"blur(10px)", border:`1px solid ${C.primary}40`,
  //   borderRadius:8, padding:"5px 10px", fontSize:11,
  //   color:C.primary, fontWeight:600, whiteSpace:"nowrap" }}

  // ── Browser chrome colors (macOS traffic lights) ───────────────────────────
  trafficLights: ["#FF5F57", "#FEBC2E", "#28C840"],

  // ── Dynamic Island (iPhone 15 Pro) ────────────────────────────────────────
  dynamicIsland: { top: 12, width: 120, height: 34, borderRadius: 20, background: "#000" },

  // ── Home indicator ─────────────────────────────────────────────────────────
  homeIndicator: { width: 134, height: 5, borderRadius: 3, opacity: 0.2, bottom: 8 },
};


// ─────────────────────────────────────────────────────────────────────────────
//  3b. GOLDEN HOUR — "Warm Morning Light"
//  Identity: committed, warm, narrative, personal — daylight-first consumer product
//  Use for: wellness, plant care, personal health, habit-tracking, consumer lifestyle
//  Typography: Fraunces (serif, 300–600 + italic) + Inter (sans, 400–700)
//
//  RULES:
//  - Light is always default; dark is a full-parity override (never an afterthought)
//  - surfaceBase (#FAF7F2) is CREAM — never pure white as page background
//  - accentPrimary (#C06B4A) TERRACOTTA — CTAs, active states, score heroes
//  - accentSecondary (#6B8563) SAGE — positive delta, good match, success states
//  - accentTertiary (#C99856) CHAMPAGNE GOLD — AI-guide presence, milestones, badge borders
//  - accentPlum (#4A2C4D) DEEP PLUM — PM / evening / wind-down register only
//  - AMBER (#D4894A) — watch-out signals only (declining metric, >5 days since scan)
//  - DANGER (#B04848) — "Not For You" verdict, destructive actions — never for errors
//  - Gold border (1.5px rgba(201,152,86,0.55)) appears ONLY on paywall price card + active plan card
//  - Fraunces italic = the AI guide's voice; Fraunces roman = user's voice; Inter = system/data
// ─────────────────────────────────────────────────────────────────────────────
const GOLDEN_HOUR_LIGHT = {

  // ── Brand palette ──────────────────────────────────────────────────────────
  accentPrimary:   "#C06B4A",                          // terracotta — CTAs, active, score
  accentSecondary: "#6B8563",                          // sage — positive delta, match verdicts
  accentTertiary:  "#C99856",                          // champagne gold — AI-guide glyph, milestones
  accentPlum:      "#4A2C4D",                          // deep plum — evening / PM register
  amber:           "#D4894A",                          // signal: watch-out, declining metric
  danger:          "#B04848",                          // "Not For You", destructive actions

  // ── Surface scale (warm cream → white → sunken) ────────────────────────────
  surfaceBase:    "#FAF7F2",   // page / phone screen background (cream)
  surfaceRaised:  "#FFFFFF",   // card surface
  surfaceSunken:  "#F3EFE8",   // recessed inputs, sunken rows

  // ── Borders ────────────────────────────────────────────────────────────────
  borderSubtle:   "#EAE4DA",   // default card borders
  borderStrong:   "#D4C8BC",   // chapter dividers, section separators (ChapterBand)
  goldBorder:     "rgba(201,152,86,0.55)",  // paywall card ONLY — do not reuse

  // ── Text ───────────────────────────────────────────────────────────────────
  textPrimary:    "#1A1620",
  textSecondary:  "#5C5661",
  textTertiary:   "#9A939F",   // ⚠ WCAG fail at small sizes on surfaceBase — use ≥12px only

  // ── Shadows (warm, not cool) ───────────────────────────────────────────────
  sh1: "0 1px 2px rgba(42,36,32,0.04), 0 2px 8px rgba(42,36,32,0.04)",
  sh2: "0 4px 16px rgba(42,36,32,0.06), 0 1px 3px rgba(42,36,32,0.04)",
  sh3: "0 12px 40px rgba(42,36,32,0.08), 0 2px 8px rgba(42,36,32,0.06)",

  // ── Canvas background ──────────────────────────────────────────────────────
  boardBg: "radial-gradient(circle at 20% 20%,rgba(201,152,86,0.04) 0%,transparent 60%), radial-gradient(circle at 80% 80%,rgba(192,107,74,0.03) 0%,transparent 60%), #F5F1EA",

  // ── Typography ─────────────────────────────────────────────────────────────
  serif: "'Fraunces', Georgia, serif",
  sans:  "'Inter', -apple-system, sans-serif",
  // Fraunces: 300/400/500/600 + italic 300/400 (for the AI-guide voice)
  // Inter: 400/500/600/700 (for system/data/CTAs)

  // ── Brand mark ─────────────────────────────────────────────────────────────
  // OrbitMark: gradient sphere (terracotta#D88A62 → rose#B8607A → plum#6B3570 → dark#3A1A40)
  //            + gold ring #C99856 at -18° rotation
  // States: standard (gold ring) · spinning (loading) · 15% opacity (empty) · grey ring (error)
  // Sizes: 24px nav · 28-32px top bar · 48-64px title strip · 80-96px paywall hero · 120-161px full hero

  // ── AI-guide glyph ─────────────────────────────────────────────────────────────
  // 3 concentric circles: r=5 fill (gold gradient) · r=8 stroke 0.8 · r=10.5 stroke 0.5
  // Always gold (#C99856). Always precedes the guide's copy. Never appears without copy.

  // ── Gradient helpers ───────────────────────────────────────────────────────
  gradScoreRing: "linear-gradient(135deg, #C06B4A 0%, #C99856 55%, #6B8563 100%)",
  gradCompatRing:"linear-gradient(135deg, #6B8563 0%, #C99856 50%, #6B8563 100%)",
  gradTerracotta:"linear-gradient(135deg, #C06B4A, #D88B6B)",

  // ── Component patterns ─────────────────────────────────────────────────────
  // Score ring: 270° arc (0.75 × circ), strokeWidth 11, rounded caps
  // Compat ring: same geometry, sage-gold gradient (not terracotta-gold)
  // Never reuse same gradient for two different ring meanings

  // ── Phone frame ────────────────────────────────────────────────────────────
  phoneShell:    "linear-gradient(145deg, #2C2C2C, #1A1A1A)",
  phoneShadow:   "0 0 0 1px #3D3D3D, 0 0 0 3px #1A1A1A, 0 30px 80px rgba(0,0,0,0.60)",
};

// Dark mode — full parity override (not a tint — a complete inversion)
const GOLDEN_HOUR_DARK = {
  accentPrimary:   "#D88B6B",   // terracotta lightened for dark surfaces
  accentSecondary: "#8BA583",   // sage lightened
  accentTertiary:  "#E0B672",   // gold lightened
  accentPlum:      "#7A5080",   // plum lightened for visibility
  amber:           "#E09E6A",   // amber lightened

  surfaceBase:    "#1A1620",    // deep plum-near-black
  surfaceRaised:  "#241E2A",    // raised card
  surfaceSunken:  "#14101A",    // sunken / input

  borderSubtle:   "#2D2733",

  textPrimary:    "#F5F0EA",    // warm white — not pure #FFF
  textSecondary:  "#A8A39E",
  textTertiary:   "#6B6560",

  sh1: "0 1px 2px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.12)",
  sh2: "0 4px 16px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15)",
  sh3: "0 12px 40px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",

  borderStrong:   "#3D3540",   // chapter dividers in dark mode

  boardBg: "#1A1620",

  serif: "'Fraunces', Georgia, serif",
  sans:  "'Inter', -apple-system, sans-serif",
};

// Semantic role aliases — copy these into board scripts as `const C = {...GOLDEN_HOUR_LIGHT}`
// then override with CD for dark mode toggle.
//
// Usage pattern:
//   const [dark, setDark] = useState(false);
//   const C = dark ? GOLDEN_HOUR_DARK : GOLDEN_HOUR_LIGHT;
//   const SERIF = C.serif; const SANS = C.sans;


// ─────────────────────────────────────────────────────────────────────────────
//  3c. CLINIC LUXE — "Luxe Med-Aesthetic"
//  Identity: the credibility of a medical device with the finish of a premium
//            cosmetic brand. Quiet luxury — generous whitespace, editorial
//            type, warm ivory surfaces, teal + antique-gold restrained motion.
//            Never neon, never "techy dashboard," never cheap SaaS.
//  Use for: med-aesthetic / cosmetic-clinic consultation platforms, and
//           any product spanning a clinical register (surgeon/coordinator/
//           owner tools) and a patient register (lead flow, simulation
//           reveal, treatment-plan microsite, portal) on ONE shared token set.
//
//  RULES:
//  - ONE component language, TWO registers. Clinical = compact density
//    (Inter/Plex UI type only). Patient = comfortable density (Fraunces /
//    Noto Naskh Arabic display type layered on top). Never fork components —
//    only spacing, warmth, and copy shift between registers.
//  - Stone-50 `#FAF9F7` ivory is the app background — NEVER pure `#FFFFFF`
//    for canvas; White is reserved for cards/surfaces sitting on ivory.
//  - Gold `#B98A2E` is a PRESTIGE accent only (booked/deposit, awarded/
//    selected state, patient-surface dividers) — never the sole affordance
//    for a routine or primary action. Contrast on gold is unreliable.
//  - Jade reuses the `success` semantic slot (vitality/growth/"balanced").
//  - Image-Review is a purpose-built DARK surface for photography/simulation
//    ONLY (Photo Studio, Simulation Studio, before/after reveal, full-screen
//    media) — the ONLY dark surface in this preset; this is
//    NOT a global dark mode. Do not extend it to nav/cards/tables/forms.
//  - Arabic display face: Noto Naskh Arabic — chosen over Reem
//    Kufi (Naskh's calligraphic warmth pairs better with Fraunces' editorial
//    luxe than Reem Kufi's geometric-Kufic modernity). Reem Kufi is kept here
//    as a documented alternate for a future white-label clinic whose own
//    brand mark skews more modern/geometric — swap `fontArDisplay` only.
//  - Digits: Western (Latin) by default even in Arabic UI, for clinical
//    clarity; expose a locale toggle for Arabic-Indic digits in patient copy.
//  - Never signal domain-semantic state (confidence/feasibility/consent) by
//    color alone — always pair with label + icon + value (see A11Y section).
// ─────────────────────────────────────────────────────────────────────────────
const CLINIC_LUXE = {

  // ── Primitive ramps ─────────────────────────────────────────────────────────
  pine: { 50:"#EEF4F4", 100:"#D6E5E6", 200:"#AECCCF", 300:"#7FADB2", 400:"#4E8890",
          500:"#356E77", 600:"#2E606A", 700:"#254C54", 800:"#1C3A41", 900:"#14282D" },
  jade: { 50:"#ECF6F0", 100:"#CFE9DA", 200:"#A3D6B9", 300:"#6FBE93", 400:"#479E72",
          500:"#2E8659", 600:"#227048", 700:"#1B5A3A", 800:"#15452C", 900:"#0E2E1E" },
  gold: { 50:"#FBF7EF", 100:"#F4EAD3", 200:"#E9D3A3", 300:"#DCBD76", 400:"#CFA64C",
          500:"#B98A2E", 600:"#9A7122", 700:"#7A581B", 800:"#5C4215", 900:"#3F2D0E" },
  stone:{ 0:"#FFFFFF", 50:"#FAF9F7", 100:"#F3F1EC", 200:"#E7E3DC", 300:"#D4CFC5",
          400:"#B0A99C", 500:"#8A8477", 600:"#6B655A", 700:"#4E4A42", 800:"#362F26", 900:"#1F1D19" },
  // Bronze — added to resolve the feas-aggressive/gold-accent collision (see below).
  // Distinct hue (warm orange-brown, ~20° hue) from Gold (~40° hue) so the two are
  // never confused at a glance, even though both read as "warm/warning-adjacent."
  bronze:{ 50:"#F7ECE4", 100:"#EAD3C0", 300:"#C68F63", 500:"#A65A2E", 700:"#7A431F" },

  // ── Functional hues (distinct from brand — status never reads as brand) ────
  info:   { 50:"#E8F1FA", 500:"#2F6FB0", 700:"#22507F" },
  warn:   { 50:"#FBEFD6", 500:"#C77A15", 700:"#8A5310" },
  danger: { 50:"#FBE7E4", 500:"#C33B2E", 700:"#8A241A" },

  // ── Semantic tokens (reference these in UI, not the primitives above) ──────
  bg:            "#FAF9F7",   // stone-50 · ivory app canvas
  surface:       "#FFFFFF",   // cards, sheets
  surfaceSunken: "#F3F1EC",   // wells, table stripes
  surfaceInverse:"#14282D",   // pine-900
  border:        "#E7E3DC",
  borderStrong:  "#D4CFC5",
  text:          "#1F1D19",   // stone-900, warm ink — ≥12.5:1 on ivory
  textMuted:     "#6B655A",
  textSubtle:    "#6E6A5F",   // fixed: was stone-500 #8A8477 (3.53:1 on Ivory — failed WCAG AA
                              // for small text, violating this system's own "muted text ≥4.5:1" rule).
                              // Darkened to 5.13:1, confirmed via QA gate contrast audit.
  textOnBrand:   "#FFFFFF",

  primary:       "#2E606A",   // pine-600
  primaryHover:  "#254C54",   // pine-700
  primaryPress:  "#1C3A41",   // pine-800
  primaryWeak:   "#EEF4F4",   // pine-50 tint bg — selected/active
  accent:        "#B98A2E",   // gold-500 — prestige ONLY, never a routine CTA
  accentWeak:    "#FBF7EF",   // gold-50

  success: "#2E8659",   // jade-500
  info_:   "#2F6FB0",
  warning: "#C77A15",
  danger_: "#C33B2E",

  focusRing: "#4E8890",                        // pine-400 @ 2px + 2px offset, AA on ivory
  overlay:   "rgba(20, 40, 40, 0.48)",         // modal scrim, warm (not neutral black)

  // ── Image-Review surface — dark, purpose-built. NOT a global dark mode. ────
  reviewBg:        "#101615",   // near-black warm — renders skin tone true
  reviewSurface:   "#1A2221",
  reviewBorder:    "#2B3634",
  reviewText:      "#F3F1EC",
  reviewTextMuted: "#9AA6A2",
  // Controls on the review surface keep Pine-300 / Gold-300 for contrast:
  reviewAccentPine: "#7FADB2",
  reviewAccentGold: "#DCBD76",

  // ── Domain semantic tokens (the differentiators — never color-alone) ───────
  confHigh:  "#2E8659",   // ≥ ~80
  confMed:   "#C77A15",   // ~55–79
  confLow:   "#C33B2E",   // < ~55
  confTrack: "#E7E3DC",

  feasConservative: "#356E77",   // pine-500 — safe, calm
  feasBalanced:     "#2E8659",   // jade-500 — recommended
  feasAggressive:   "#A65A2E",   // bronze-500 — caution: verify donor supply
                                  // RESOLVED: was gold-600 (#9A7122), too close in value
                                  // to the gold-500 accent (#B98A2E). Bronze is a distinct hue so
                                  // "aggressive plan" and "prestige/booked" are never confusable.
  feasNotCandidate: "#8A8477",   // stone-500 — not a candidate yet

  // Case pipeline chip families → { bg (tint), dot (solid), text }
  pipeline: {
    newInquiry:   { bg:"#F3F1EC", dot:"#6B655A", text:"#4E4A42" },
    photosPending:{ bg:"#FBEFD6", dot:"#C77A15", text:"#8A5310" },
    analysisReady:{ bg:"#EEF4F4", dot:"#2E606A", text:"#254C54" },
    planApproved: { bg:"#ECF6F0", dot:"#2E8659", text:"#1B5A3A" },
    depositBooked:{ bg:"#FBF7EF", dot:"#B98A2E", text:"#7A581B" },   // prestige
    postOp:       { bg:"#E8F1FA", dot:"#2F6FB0", text:"#22507F" },
    lostArchived: { bg:"#F3F1EC", dot:"#B0A99C", text:"#8A8477" },
    redFlag:      { bg:"#FBE7E4", dot:"#C33B2E", text:"#8A241A" },
  },

  // Consent & media-rights badges → { bg, text } — locked, never re-themed
  consent: {
    consultOnly: { bg:"#F3F1EC", text:"#4E4A42" },
    website:     { bg:"#E8F1FA", text:"#22507F" },
    socialAds:   { bg:"#FBF7EF", text:"#7A581B" },
    anonymized:  { bg:"#EEF4F4", text:"#254C54" },
    noReuse:     { bg:"#FBE7E4", text:"#8A241A" },
    simulation:  { bg:"transparent", text:"#7A581B", outline:"#B98A2E" },
  },

  // ── Data-visualization palette — categorical, max 6 series ─────────────────
  viz: { 1:"#2E606A", 2:"#B98A2E", 3:"#2E8659", 4:"#4A6D8C", 5:"#B26E4E", 6:"#8A6A88" },
  vizSequentialPine: ["#EEF4F4","#D6E5E6","#AECCCF","#7FADB2","#4E8890","#356E77","#2E606A","#254C54","#1C3A41","#14282D"],
  vizGrid: "#E7E3DC", vizAxis: "#8A8477",

  // ── Shadows — warm, tinted teal-black, never hard black ─────────────────────
  elev1: "0 1px 2px rgba(20,40,40,.06), 0 1px 1px rgba(20,40,40,.04)",
  elev2: "0 2px 8px rgba(20,40,40,.08)",
  elev3: "0 8px 24px rgba(20,40,40,.10)",
  elev4: "0 16px 40px rgba(20,40,40,.14)",     // modals, popovers
  elevMedia: "0 12px 32px rgba(20,40,40,.16)", // lifted photo/sim cards

  // ── Shape ────────────────────────────────────────────────────────────────────
  radius: { xs:4, sm:8, md:12, lg:16, xl:24, pill:999 },

  // ── Typography ───────────────────────────────────────────────────────────────
  fontDisplay:     "'Fraunces', Georgia, serif",              // patient headlines, hero numbers
  fontUI:          "'Inter', -apple-system, sans-serif",       // all product UI
  fontArDisplay:   "'Noto Naskh Arabic', 'Reem Kufi', serif",  // confirmed default: Noto Naskh (Reem Kufi documented fallback)
  fontArUI:        "'IBM Plex Sans Arabic', 'Cairo', system-ui, sans-serif",

  // ── Motion — luxe = graceful and quiet, motion clarifies, never performs ───
  dur1: 120, dur2: 180, dur3: 240, dur4: 320, dur5: 480,   // ms — dur5 = patient reveal moments
  easeStandard:   "cubic-bezier(.2,0,0,1)",
  easeEmphasized: "cubic-bezier(.2,0,0,1.0)",   // enter
  easeExit:       "cubic-bezier(.4,0,1,1)",

  // ── Breakpoints — tablet-portrait is the PRIMARY consult canvas ────────────
  breakpoints: { xs:360, sm:600, md:840, lg:1024, xl:1440 },
  consultFrame: { w:834, h:1112 },   // reference frame — design Consult mode here first
};

// Usage pattern:
//   const C = CLINIC_LUXE;                       // one token set, two registers
//   const register = 'clinical' | 'patient';         // controls density + display-font usage, not color
//   const dir = 'ltr' | 'rtl';
//   // Image-Review surface is opted into per-component, not via a global theme toggle:
//   <div style={{ background: C.reviewBg, color: C.reviewText }}>…</div>
//
// ── Companion patterns for this preset ─────────────────────────────────────
// Documented here per the Design System Update Rule so the next board reuses
// them instead of re-deriving. Not yet promoted to first-class exported
// components — build them from the description when reusing.
//
//   MF (microsite frame)      — thin mobile-browser chrome (URL pill + share
//                                icon) distinct from the native-app PF/TF
//                                frames, for any "shared link opened on a
//                                phone" screen (e.g. a treatment-plan microsite).
//   ResourceGauge             — 0–10 semi-circular gauge for a finite resource
//                                or reserve.
//   CostRangeBar              — currency range-builder bar tied to a scenario.
//   StyleGlyph                — abstract vector/line-art icons (never
//                                photographic) for an option-library grid or
//                                a simulation-studio picker.
//   SystemGlyph               — broken / jagged / dashed / slashed variants of
//                                the brand's wave mark, used as the
//                                error/maintenance/offline illustration
//                                instead of stock iconography.



// ─────────────────────────────────────────────────────────────────────────────
//  3f. LIMESTONE — "Measured Ground"   
//
//  For products whose subject is ACCESSIBILITY, MEASUREMENT or PUBLIC TRUST:
//  verification registries, inspection and certification platforms, field-audit
//  tools, compliance dashboards, anything where a number and its provenance are
//  the product.
//
//  THE ONE RULE THAT MAKES THIS SYSTEM DIFFERENT — light is the DEFAULT, not the
//  alternative. Dark ink on a warm light ground is more legible for low-vision
//  users than the reverse, and a dark-first accessibility product contradicts
//  itself. The dark pair (BASALT) exists for the toggle, never as the
//  shipping default.
//
//  Other standing rules:
//  - NO backdrop-filter behind text, anywhere. Glassmorphism costs contrast and
//    this class of product cannot pay it. Do not reach for VIOLET_GLASS here.
//  - Ground is warm limestone (#EFEBE3), not clinical white — lower glare, and
//    locally rooted for Levant work (limestone is the region's building stone).
//  - Every measurement renders with `font-variant-numeric: tabular-nums` so
//    columns of figures align down the page. Non-negotiable in this vertical.
//  - No gradient sits behind any text. Gradients are decoration; this system
//    has almost none.
// ─────────────────────────────────────────────────────────────────────────────
const LIMESTONE = {
  name:         "light",                        // ← the DEFAULT of the pair
  primary:      "#0A6152",                      // verified green · 7.4:1 on card
  primaryLight: "#0E7C68",
  primaryDim:   "rgba(10,97,82,0.09)",
  grad:         "linear-gradient(135deg,#084C40,#0A6152,#0E7C68)",  // decorative only

  bg:    "#EFEBE3",   // warm limestone canvas
  card:  "#FFFFFF",
  card2: "#F7F4EE",

  brd:  "#DCD5C8",
  brdL: "#C7BEAD",

  w:  "#16181A",      // ink · 16.1:1 on card
  ts: "#585C61",      // secondary · 7.0:1
  td: "#84888D",       // tertiary/meta · 4.6:1 — never below this for real text

  grn: "#0A6152",  grnD: "rgba(10,97,82,0.08)",   // met / verified
  red: "#9E2B18",  redD: "rgba(158,43,24,0.08)",  // not met · 7.6:1
  blu: "#1D4E6B",  bluD: "rgba(29,78,107,0.08)",
  org: "#A8461B",  orgD: "rgba(168,70,27,0.08)",  // partial / caution · 5.9:1
  stn: "#6B6357",  stnD: "rgba(107,99,87,0.08)",  // "self-declared" — deliberately
                                                  // inert; see GRADE_CHIP below

  canvasBg: "linear-gradient(160deg,#E8E3D9,#EFEBE3 45%,#E4DED2)",
  mapTiles: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  mapFilter:"grayscale(1) contrast(.86) brightness(1.09) sepia(.16) saturate(1.4)",
  shadow:   "0 1px 2px rgba(30,26,18,.05), 0 8px 24px rgba(30,26,18,.07)",
  shadowLg: "0 2px 4px rgba(30,26,18,.06), 0 24px 60px rgba(30,26,18,.12)",
};

const BASALT = {                          // paired dark — toggle only
  name:         "dark",
  primary:      "#3FA98F",
  primaryLight: "#5BC4A9",
  primaryDim:   "rgba(63,169,143,0.13)",
  grad:         "linear-gradient(135deg,#2A7D69,#3FA98F,#5BC4A9)",

  bg:    "#111312",   card:  "#1A1D1C",   card2: "#232726",
  brd:   "#2E3331",   brdL:  "#3D4441",
  w:     "#F0EDE6",   ts:    "#9EA5A1",   td:    "#6E7571",

  grn: "#3FA98F",  grnD: "rgba(63,169,143,0.11)",
  red: "#E0705A",  redD: "rgba(224,112,90,0.11)",
  blu: "#6FA8C7",  bluD: "rgba(111,168,199,0.11)",
  org: "#DB8A56",  orgD: "rgba(219,138,86,0.11)",
  stn: "#A79A87",  stnD: "rgba(167,154,135,0.11)",

  canvasBg: "linear-gradient(160deg,#0C0E0D,#111312 45%,#0E100F)",
  mapTiles: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  mapFilter:"grayscale(1) invert(1) contrast(.92) brightness(.82)",
  shadow:   "0 1px 2px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.5)",
  shadowLg: "0 2px 4px rgba(0,0,0,.45), 0 24px 60px rgba(0,0,0,.6)",
};

// ── ✦ GRADE CHIP — the reusable pattern this theme exists to carry ───────────
//  Generalise this for ANY tiered status that a user acts on — verification tiers, compliance levels, risk bands, trust
//  scores. Three independent signals per tier so the chip survives greyscale
//  printing AND every form of colour blindness:
//
//    1. NAME      — the tier spelled out, always. Colour is never the carrier.
//    2. FILL      — a shield whose fill PATTERN differs per tier:
//                     solid / half (clip-path) / dotted stroke / dashed empty
//    3. PIP METER — 4 unit squares, filled 4 / 2 / 0 / 0
//
//  THE RULE THAT PROTECTS THE PRODUCT: the lowest "claimed but unverified" tier
//  must look like NOTHING. No brand colour, no fill, no pips, dashed border,
//  and any attached photo greyscaled. A self-declaration that reads as a
//  credential is the single failure that costs a verification business the one
//  thing it sells. A tier labelled "self-declared" (الإقرار الذاتي) uses `stn` (stone)
//  for exactly this.
//
//  ALWAYS ship a greyscale proof strip in the board's design-system band —
//  `filter: grayscale(1)` over the four chips. It is a 20-line addition that
//  proves the claim instead of asserting it, and clients screenshot it.
//
//  COMPANION RULE — no score before the standard is fixed. Where the reference
//  standard is not yet agreed, publish the raw measurements and a met/not-met
//  verdict, and print the standard's status on screen ("قيد الاعتماد" / "pending").
//  Never render a percentage or a conformity certificate the publisher cannot defend.

// ── MEASURED ROW — the atom of any inspection product ────────────────────────
//  Four parts, in this order, and never fewer:
//    item name · measured value WITH ITS UNIT · the requirement · a verdict in WORDS
//  ("met" / "not met" — plus an icon; never a bare green or red dot). Below it,
//  optionally, one line saying who is affected by a failure. A row that shows a
//  number without its requirement is decoration, not evidence.

// ── PROVENANCE STRIP — measured on · by · valid until ────────────────────────
//  Three cells, hairline dividers, set on `card2`.
//  Any published measurement carries it. A measurement without a date and an
//  author is an opinion.


// ─────────────────────────────────────────────────────────────────────────────
//  3f2. MODULE — "Module"
//
//  Module — graphite + hi-vis · hi-vis is never a status colour.
//
//  For bilingual (AR/EN) school-operations products — attendance, gate
//  verification, dismissal, parent/staff/admin apps, and locked kiosk tablets
//  at the gate or in the classroom.
//
//  THE RULE THAT MAKES THIS SYSTEM DIFFERENT — the hi-vis orange (`primary`
//  below) is a BRAND colour, full stop. It is never repurposed as a success/
//  warning/critical/info colour anywhere on the board, even for a single
//  demo screen. Status always comes from `grn`/`red`/`blu`, and warning is
//  `org` here in NAME ONLY — its actual value is the yellow/amber warning
//  token, not hi-vis orange, precisely so a designer skimming this file for
//  "the orange one" doesn't reach for the brand colour by habit. A status
//  colour is always paired with a fixed shape/icon (success = square-check,
//  warning = triangle, critical = octagon, info = circle) — colour is never
//  the only signal. Orange fills always take graphite text, never white.
// ─────────────────────────────────────────────────────────────────────────────
const MODULE_LIGHT = {
  name:         "light",                        // ← the DEFAULT of the pair
  primary:      "#FF6B2C",                      // hivis-500 — brand accent, NEVER a status colour
  primaryLight: "#FF8246",                      // hivis-400 — hover
  primaryDim:   "rgba(255,107,44,0.09)",
  grad:         "linear-gradient(135deg,#E8531A,#FF6B2C,#FF8246)",  // decorative only

  bg:    "#F4F5F7",   // Frost — brand ground
  card:  "#FFFFFF",
  card2: "#EBEDF0",   // surface-sunken

  brd:  "#DCDFE4",
  brdL: "#C3C8D0",

  w:  "#1B1E24",      // Graphite — 16.1:1 on card
  ts: "#677080",      // secondary · 5.0:1
  td: "#8A93A3",      // tertiary/meta · decorative only, not body

  grn: "#146B3C",  grnD: "#E7F6EE",              // success-fg / success-bg (fill = green-600 #188048)
  red: "#B42318",  redD: "#FDECEA",              // critical-fg / critical-bg (fill = red-600 #D92D20)
  blu: "#1F4FA8",  bluD: "#EAF1FD",              // info-fg / info-bg (fill = blue-600 #2A62C9)
  org: "#7A5A00",  orgD: "#FFF7D6",              // ⚠ NAME ONLY — this is the WARNING token (yellow-800/50),
                                                  // never hi-vis orange. Fill = yellow-400 #F2C200.
  stn: "#4B5260",  stnD: "#EBEDF0",              // neutral-fg / neutral-bg — inert, no verdict implied

  canvasBg: "linear-gradient(160deg,#EBEDF0,#F4F5F7 45%,#E4E7EB)",
  mapTiles: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  shadow:   "0 1px 2px rgba(27,30,36,.06), 0 8px 24px rgba(27,30,36,.08)",
  shadowLg: "0 2px 4px rgba(27,30,36,.06), 0 24px 56px rgba(27,30,36,.14)",
};

const MODULE_DARK = {                      // paired dark — toggle only
  name:         "dark",
  primary:      "#FF6B2C",                      // unchanged — hivis-500 stays the accent on dark too
  primaryLight: "#FF8246",
  primaryDim:   "rgba(255,107,44,0.14)",
  grad:         "linear-gradient(135deg,#E8531A,#FF6B2C,#FF8246)",

  bg:    "#121418",   card:  "#1B1E24",   card2: "#16181D",
  brd:   "#30343D",   brdL:  "#4B5260",
  w:     "#E9EBEF",   ts:    "#A2A9B5",   td:    "#8A93A3",   // text never pure white

  grn: "#5FCB93",  grnD: "rgba(24,128,72,0.20)",   // fill = green-600 #188048 (unchanged)
  red: "#FF8A80",  redD: "rgba(217,45,32,0.18)",   // fill = red-600 #D92D20 (unchanged)
  blu: "#8DB2F7",  bluD: "rgba(42,98,201,0.20)",   // fill = blue-600 #2A62C9 (unchanged)
  org: "#F7D65A",  orgD: "rgba(242,194,0,0.14)",   // ⚠ NAME ONLY — WARNING token, not hi-vis orange
  stn: "#C3C8D0",  stnD: "#252930",                // neutral-fg / neutral-bg

  canvasBg: "linear-gradient(160deg,#0E1013,#121418 45%,#0F1114)",
  mapTiles: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  shadow:   "0 0 0 1px rgba(255,255,255,.04)",
  shadowLg: "0 0 0 1px rgba(255,255,255,.06), 0 24px 56px rgba(0,0,0,.5)",
};

// ── FOCUS RING — the one token that intentionally diverges between the pair ──
//  Light uses hivis-600 `#E8531A` for focus rings (3.7:1 on white — hivis-500,
//  the accent, is only 2.8:1 and fails as a non-text UI indicator). Dark uses
//  hivis-500 `#FF6B2C` (5.9:1 on dark surfaces) — the same value as `primary`
//  there. Neither MODULE_LIGHT.primary nor _DARK.primary should be read
//  as "the focus colour" directly; consume a dedicated `focus` value per theme
//  (`#E8531A` light / `#FF6B2C` dark) when wiring focus-visible styles.

// ── EMERGENCY MODE — withdraws the accent entirely ───────────────────────────
//  An emergency mode attribute (e.g. `[data-mode="emergency"]`) overrides MODULE_DARK's
//  bg/surface/text/border AND replaces `primary`/accent with graphite-50/white
//  so nothing brand-coloured competes with the red takeover ground. This is a
//  MODE, not a third paired theme — build it as an override layer on top of
//  MODULE_DARK, never as its own toggle target.

// ── KIOSK DENSITY — always forces MODULE_DARK ──────────────────────────
//  Gate and classroom kiosk surfaces (e.g. `[data-surface="kiosk"]`) ship dark-only, at 64px controls / 88px rows / up to 56px display
//  type — there is no light kiosk variant. If a board includes a kiosk
//  screen, wire it to MODULE_DARK regardless of the toggle's own state.


// ─────────────────────────────────────────────────────────────────────────────
//  3g. GALLERY WALL — "Cream, Ink and Leaf Gold"
//
//  For products where SOMEONE ELSE'S WORK IS THE CONTENT and the interface must
//  disappear behind it: art and craft marketplaces, galleries, photography,
//  publishing, editorial, portfolio and exhibition platforms, catalogues.
//
//  THE ONE RULE: cream is the ground, not black. A gallery wall is light. The
//  work supplies the colour and every surface exists to get out of its way.
//  A dark-luxury shell around someone else's painting competes with it.
//
//  Distinguishing it from GOLD_NOIR — both are "gold", and they must never
//  read as one house style:
//    · Gold Noir is dark-first brass (#C8A951 on #0A0A0A) — authority, terminal, ops.
//    · Gallery Wall is cream-first old LEAF gold (#8A6A1F on #FBF8F2) — quiet,
//      printed, curatorial. Lower chroma, browner, deliberately unbrassy.
//  If a project could take either, ask whose content is on screen: the operator's
//  data (Gold Noir) or a third party's work (Gallery Wall).
//
//  Standing rules:
//  - Two golds, two jobs. `gold` is the only one allowed near text (4.9:1).
//    `goldBright` is for rules, chapter numerals and hairlines — never small type.
//  - Artwork is MATTED, never bled: wrap every image in `frameMat` padding with a
//    hairline border and a real shadow, so a photo reads as a hung object.
//  - Status is never colour alone — every pill carries its words plus a dot, or
//    a dashed outline for the inactive states.
// ─────────────────────────────────────────────────────────────────────────────
const GALLERY_WALL = {
  name:  "light",                               // ← the DEFAULT of the pair
  gold:      "#8A6A1F",   // text-safe leaf gold · 4.9:1 on the plinth
  goldBright:"#C9A227",   // display / rules ONLY — never small text
  goldDim:   "rgba(138,106,31,0.10)",

  bg:    "#EDE7DA",       // the gallery wall — the ground
  card:  "#FBF8F2",       // "the plinth" — cards, sheets
  card2: "#F4EFE4",
  ink:   "#141210",       // 17.1:1 on the plinth

  brd:  "#DED6C5",
  brdL: "#C9BFA9",

  w:  "#141210",
  ts: "#585247",          // secondary · 7.4:1
  td: "#7A7367",          // tertiary/meta · 4.6:1

  grn: "#3F6B43",  grnD: "rgba(63,107,67,0.09)",    // live / on display · 5.8:1
  red: "#8F3320",  redD: "rgba(143,51,32,0.09)",
  blu: "#2E5266",  bluD: "rgba(46,82,102,0.09)",

  canvasBg: "linear-gradient(165deg,#E6DFD0,#EDE7DA 45%,#E2DACB)",
  shadow:   "0 1px 2px rgba(30,22,10,.05), 0 10px 30px rgba(30,22,10,.08)",
  shadowLg: "0 2px 6px rgba(30,22,10,.07), 0 28px 70px rgba(30,22,10,.14)",
  frameMat: "#FBF8F2",    // ← the mat colour behind every artwork. Use it.
};

const GALLERY_AFTER_HOURS = {                    // paired dark — the gallery at night
  name:  "dark",
  gold:      "#D4AF52",
  goldBright:"#E8C86B",
  goldDim:   "rgba(212,175,82,0.13)",

  bg:    "#131110",   card:  "#1C1917",   card2: "#252220",
  ink:   "#F2EDE3",
  brd:   "#302B26",   brdL:  "#413A33",
  w:     "#F2EDE3",   ts:    "#A39B8E",   td:    "#786F63",

  grn: "#7FAE7B",  grnD: "rgba(127,174,123,0.11)",
  red: "#D97C63",  redD: "rgba(217,124,99,0.11)",
  blu: "#7FA8C0",  bluD: "rgba(127,168,192,0.11)",

  canvasBg: "linear-gradient(165deg,#0D0C0B,#131110 45%,#100E0D)",
  shadow:   "0 1px 2px rgba(0,0,0,.45), 0 10px 30px rgba(0,0,0,.55)",
  shadowLg: "0 2px 6px rgba(0,0,0,.5), 0 28px 70px rgba(0,0,0,.65)",
  frameMat: "#1C1917",
};

// ── TYPE PAIRING FOR THIS THEME ──────────────────────────────────────────────
//  Fraunces  — anything a PERSON would have written: work titles, artist and
//              author names, prices, chapter headlines. 300–500 weight, optical
//              size axis 9–144, tight tracking (-.02em) at display sizes.
//  Inter     — anything the SYSTEM says: field labels, tables, meta, buttons.
//              Always `tabular-nums` for prices and counts.
//  Plex Arabic — Arabic content inside an otherwise-Latin product.
//  Never use Inter as a display face here; it reads as an unfinished demo (see
//  the Anti-AI-Slop rules in CLAUDE.md).

// ── ✦ PHYSICAL LABEL OBJECT — the reusable pattern ───────────────────────────
//  When a product bridges a PHYSICAL place and
//  a digital page — a gallery label, a museum caption, a menu card, a shelf
//  talker, a plaque, a table tent — draw the physical object at true proportion
//  inside the board, and draw it more than once:
//    1. inside the admin screen that generates it (as a print preview), and
//    2. at scale in the design-system band, as an object in its own right.
//  Anatomy: title (serif) → second-language title → hairline rule → creator →
//  caption line (medium · dimensions) → code + its instruction in both languages.
//  Match any existing printed collateral exactly, so the board and the
//  document agree rather than compete.

// ── ✦ DETERMINISTIC QR — see PREMIUM_PATTERNS.qrMatrix below ─────────────────
//  A mock QR must have real finder, separator and timing patterns or it reads as
//  a grey smudge at any zoom. Seed the PRNG from the item's slug so the same
//  artwork always draws the same code across board versions. ALWAYS print the
//  URL beneath it and note in PROJECT.md that codes are representative — a
//  client WILL try to scan one.

// ── ✦ SCOPE BAND — "Deliberately not in this phase" ──────────────────────────
//  When a board covers ONE PHASE of a multi-phase build, add a final band
//  listing what the phase excludes, grouped by the phase that will carry it,
//  in the agreed scope document's own words.
//  Pair it with greyed, phase-stamped (P2 / P3) rows in the product's own
//  navigation, so the boundary is visible inside the UI and not only in prose.
//  A board that shows only what is included quietly oversells, and the gap
//  surfaces as a dispute at launch instead of a conversation now.


// ─────────────────────────────────────────────────────────────────────────────
//  4. CHAPTER BAND — Narrative wrapper component (extracted from a storyboard project)
//
//  The single most important structural upgrade to come out of the storyboard
//  project it was extracted from. Every chapter in a board now has three client-facing copy layers
//  and one designer-facing rationale layer. Use this in every board going forward.
//
//  USAGE:
//    <ChapterBand num={1} name="Onboarding" screens={6}
//      title="Scan before signup."
//      lede="Meet the user where they are, not at an OTP wall."
//      lane="Goal → Meet the guide → care times → commitment → first scan → deferred auth.">
//      <Screen1/> <Screen2/> ...
//    </ChapterBand>
//
//  COPY RULES:
//    title  — Fraunces 42, client-readable chapter headline. A decision, not a description.
//             Good: "Scan before signup."  Bad: "Onboarding flow screens"
//    lede   — Fraunces 18 italic, one-sentence product story for the client.
//             Should contain a verb + outcome. "At the nursery, in 2 seconds: verdict
//             tied back to your window light."
//    lane   — Inter 12.5, designer rationale. Internal — explains WHY this chapter
//             is structured this way. Good for design reviews, collapse for sales demos.
//             "Rectangular label frame is intentionally unlike the leaf close-up oval. Traffic-
//             light framing is shorthand the audience already speaks."
//
//  VISUAL ANATOMY:
//    ┌─────────────────────────────────────────────────────────────────────┐
//    │  01                                                    Design notes │
//    │  ──                                                    ─────────── │
//    │  ONBOARDING · 6 SCREENS                                [lane text]  │
//    │  Scan before signup.                                                │
//    │  Meet the user where they are, not at an OTP wall.                  │
//    ├─────────────────────────────────────────────────────────────────────┤
//    │  [Screen1]  →  [Screen2]  →  [Screen3]  →  [Screen4]               │
//    └─────────────────────────────────────────────────────────────────────┘
// ─────────────────────────────────────────────────────────────────────────────

// Paste this JSX component into any board that uses ChapterBand:
/*
const MONO = "'ui-monospace', 'SF Mono', 'Fira Code', 'Cascadia Mono', monospace";

const ChapterBand = ({ num, name, title, lede, screens, children, lane }) => (
  <section
    data-chapter={String(num).padStart(2,'0')}
    style={{ padding:'56px 72px 40px', borderBottom:`1px solid ${C.borderStrong || C.borderSubtle}` }}>

    <div style={{ display:'flex', alignItems:'flex-start', gap:36, marginBottom:36 }}>

      <div style={{ flexShrink:0, width:96 }}>
        <div style={{
          fontFamily:SERIF, fontSize:72, fontWeight:300,
          color:C.accentPrimary, lineHeight:1, letterSpacing:'-0.03em',
        }}>
          {String(num).padStart(2,'0')}
        </div>
        <div style={{ width:40, height:2, background:C.accentTertiary, marginTop:8 }}/>
      </div>

      <div style={{ flex:1, maxWidth:780 }}>
        <div style={{
          fontFamily:SANS, fontSize:11, fontWeight:600,
          color:C.accentPrimary, letterSpacing:'1.6px',
          textTransform:'uppercase', marginBottom:10,
        }}>
          {name} · {screens} {screens === 1 ? 'screen' : 'screens'}
        </div>
        <div style={{
          fontFamily:SERIF, fontSize:42, fontWeight:400,
          lineHeight:'48px', color:C.textPrimary,
          letterSpacing:'-0.02em', marginBottom:14,
        }}>
          {title}
        </div>
        <div style={{
          fontFamily:SERIF, fontSize:18, fontStyle:'italic',
          color:C.textSecondary, lineHeight:'28px',
        }}>
          {lede}
        </div>
      </div>

      {lane && (
        <div style={{
          flexShrink:0, maxWidth:280,
          paddingLeft:24, borderLeft:`1px solid ${C.borderSubtle}`,
        }}>
          <div style={{
            fontFamily:SANS, fontSize:10.5, fontWeight:700,
            color:C.accentTertiary, letterSpacing:'1.1px',
            textTransform:'uppercase', marginBottom:8,
          }}>Design notes</div>
          <div style={{
            fontFamily:SANS, fontSize:12.5,
            color:C.textSecondary, lineHeight:'19px',
          }}>{lane}</div>
        </div>
      )}
    </div>

    <div style={{
      display:'flex', gap:56, overflowX:'auto',
      padding:'40px 0 20px', justifyContent:'flex-start',
    }}>
      {children}
    </div>
  </section>
);

// Branded board footer — paste once at the bottom of every storyboard
const BoardFoot = ({ projectName, themeLabel = 'Storyboard', version = 'v1.0', screens, language = 'English LTR' }) => (
  <div style={{ padding:'48px 72px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
      <OrbitMark size={36}/>
      <div>
        <div style={{ fontFamily:SERIF, fontSize:15, color:C.textPrimary, fontStyle:'italic' }}>
          {projectName} · {themeLabel}
        </div>
        <div style={{
          fontFamily:SANS, fontSize:11, color:C.textTertiary,
          letterSpacing:'0.3px', marginTop:2,
        }}>
          Aviniti · {new Date().getFullYear()} · {version} · complete
        </div>
      </div>
    </div>
    <div style={{ fontFamily:MONO, fontSize:10.5, color:C.textTertiary, letterSpacing:'0.4px', textTransform:'uppercase' }}>
      {screens} screens · {language} · ready for Arabic mirror
    </div>
  </div>
);
*/

// ── Additional token needed by ChapterBand: ───────────────────────────────────
// Add to GOLDEN_HOUR_LIGHT:  borderStrong: "#D4C8BC"   (stronger border for chapter dividers)
// Add to GOLDEN_HOUR_DARK:   borderStrong: "#3D3540"


// ─────────────────────────────────────────────────────────────────────────────
//  5. CHAPTER NARRATIVE COPY — worked example
//
//  10 title/lede/lane sets for a fictional plant-care app ("Fernly"), showing the
//  quality bar: titles are decisions, ledes carry a verb and an outcome, lanes
//  explain the design reasoning. Copy-paste the structure as a starting point for
//  new boards; always rewrite lede and lane for the specific product.
// ─────────────────────────────────────────────────────────────────────────────
/*
CHAPTER_COPY_EXAMPLE = [
  {
    num: 1, name: "Onboarding",
    title: "Scan before signup.",
    lede: "The first leaf is identified before any form appears. Meet the user at their windowsill, not at a password wall.",
    lane: "Goal → meet the guide → light and room check → first plant scan → commitment → deferred auth (Apple/Google first) → warm arrival. OTP is demoted to a phone-only fallback.",
  },
  {
    num: 2, name: "Home",
    title: "Today, not a dashboard.",
    lede: "Fernly leads with what the plants need now. Watering day, a heatwave warning, a new leaf, or 'all quiet' — each state has its own shape.",
    lane: "Weather and time of day are the strongest context the app has, so we use them. Mornings lean task-card, evenings lean gentle recap. A missed watering never scolds; it reschedules.",
  },
  {
    num: 3, name: "Diagnose flow",
    title: "The moment a leaf explains itself.",
    lede: "Camera → capture confirm → analyse → likely cause → treatment steps. Dark UI for the capture, warm paper tones for the answer.",
    lane: "Named leaf zones (tip, edge, underside) teach the vocabulary used everywhere else. A 'good light' check protects data quality and doubles as a small delight. The full report is one deep scroll — power-user depth, never in the way.",
  },
  {
    num: 4, name: "Results",
    title: "One cause, one next step.",
    lede: "A single likely diagnosis, two alternatives, one action to take today. Everything else waits behind a tap.",
    lane: "The diagnosis is the hero. The leaf diagram is schematic, not a photo overlay: fast to render, culturally neutral, RTL-safe. Confidence is always shown in words as well as a number.",
  },
  {
    num: 5, name: "Care plan & shelf",
    title: "Three small things this week.",
    lede: "The habit layer. Task cards, the shelf of plants behind them, plant detail, and three ways to add a new one.",
    lane: "Every task carries a plain-language 'why' — never an instruction without a reason. The shelf uses the same verdict language as the shop scanner, so nothing contradicts across screens.",
  },
  {
    num: 6, name: "Shop scanner",
    title: "Will it survive my flat?",
    lede: "At the nursery, in two seconds: a verdict tied back to your window light. Green, amber, or red — and always an alternative when we say no.",
    lane: "The rectangular tag frame is deliberately unlike the leaf close-up frame, so users never confuse the two modes. 'Not for you' must always offer a hardier swap — never a dead end.",
  },
  {
    num: 7, name: "Growth journal",
    title: "A year of small green receipts.",
    lede: "Photo timeline, growth trends, milestone leaves, and the seasons you have kept a plant alive through.",
    lane: "Before/after lives here rather than at the moment of capture, because distance makes change visible. Check-in prompts protect the streak explicitly; loss aversion beats novelty.",
  },
  {
    num: 8, name: "Moments",
    title: "The states between the states.",
    lede: "Celebration, emptiness, errors, and the Sunday digest. These are the app's emotional punctuation.",
    lane: "Errors are the app's fault, never the user's. Empty states invite rather than apologise. Celebrations are quiet — no confetti; we hand over something worth sharing.",
  },
  {
    num: 9, name: "Account & billing",
    title: "The quiet infrastructure.",
    lede: "Profile, settings, paywall, and the post-subscribe view. The paywall waits until the user has seen a plant recover.",
    lane: "Paywall framing is benefit-first, not a feature list. The active-subscription view thanks the user in the same voice that did the selling, so the relationship doesn't change after the purchase.",
  },
  {
    num: 10, name: "Auth",
    title: "Welcome back.",
    lede: "One screen for returning users. Apple and Google lead; OTP is a fallback, not the front door.",
    lane: "Copy reassures ('your plants kept growing') — we are not asking for trust again, we are handing it back.",
  },
];
*/


// ─────────────────────────────────────────────────────────────────────────────
//  6. PREMIUM PATTERN LIBRARY
//  Patterns that define the "premium feel" across ALL projects.
//  These are non-negotiable regardless of client theme.
// ─────────────────────────────────────────────────────────────────────────────
const PREMIUM_PATTERNS = {

  // ── P1: DEPTH — Every layer has a shadow story ────────────────────────────
  // Never use flat colored boxes. Every surface sits at a z-level:
  // Page bg → card → elevated card → modal → tooltip
  // Use box-shadow or filter:drop-shadow to separate layers visually.

  // ── P2: LIVE INDICATOR — Shows the system is breathing ────────────────────
  // Pulsing dot = something is happening in real-time.
  // Always pair with a color (grn = online/active, org = busy, red = offline).
  // liveIndicator: `<div style={{ width:7, height:7, borderRadius:4,
  //   background:C.grn, animation:"pulse-dot 2s infinite" }}/>`

  // ── P3: WARM WHITE — Never pure #FFF for text on dark ─────────────────────
  // Use C.w (#F0EDE8) — the slight warmth prevents eye strain and feels premium.
  // Pure white feels clinical. Warm white feels crafted.

  // ── P4: GOLD ACCENTS ON DARK = PREMIUM ────────────────────────────────────
  // The gold (#C8A951) is the signature of Gold Noir-style boards.
  // Use it for: active nav states, CTAs, metric highlights, section bars.
  // Never use for body text — only for things that deserve attention.

  // ── P5: GLASS ON LIGHT = TRUST + MODERNITY ────────────────────────────────
  // The glass effect (backdrop-filter blur) on white backgrounds = Violet Glass style.
  // Key: the blur must be real (20-28px), not faked. Use WebkitBackdropFilter too.
  // Glass cards need an inset highlight: inset 0 1px 0 rgba(255,255,255,0.6)

  // ── P6: SECTION BARS — Visual hierarchy without headers ───────────────────
  // The 4px wide vertical bar with gradient fade is a signature Aviniti element.
  // style={{ width:4, height:32, borderRadius:2,
  //   background:`linear-gradient(180deg,${C.primary},${C.primary}40)` }}

  // ── P7: STATUS BADGES — Never plain text for status ───────────────────────
  // Always use the Bg/Badge component for status labels.
  // Background = translucent version of the status color (0.08–0.12 alpha).
  // Text = full saturation status color. Border = none.

  // ── P8: TYPOGRAPHY SCALE — Dense but breathable ──────────────────────────
  // Labels: 10-11px / 700. Body: 13-14px / 400-500. Headings: 16-24px / 700-900.
  // The jump from label to heading should always feel decisive, not gradual.

  // ── P9: BILINGUAL LABELS — AR+EN shows market understanding ───────────────
  // Every screen label on the board has both languages.
  // Arabic uses system-ui font (not Inter — Inter lacks Arabic glyphs).
  // Content direction in phones: rtl for Arabic-first layouts.

  // ── P10: REAL MAP DATA — Never a grey rectangle ───────────────────────────
  // Always embed a Leaflet map with actual location data.
  // Dark theme: CartoDB dark_all tiles. Light theme: CartoDB light_all.
  // Draw real routes (polylines) with the brand color. Use circleMarkers for pins.
  // Map is static (no user interaction) — it's a mockup, not a functional map.
};


// ─────────────────────────────────────────────────────────────────────────────
//  5. COMPONENT SPEC REFERENCE
//  Copy these patterns into new boards.
// ─────────────────────────────────────────────────────────────────────────────

/*
── Btn (Dark theme)
   Primary:  background=C.grad, color="#0A0A0A", border=none, shadow=shadowCard
   Outline:  background=transparent, color=C.primary, border=`1.5px solid ${C.primary}`
   Danger:   background=C.redD, color=C.red, border=`1.5px solid ${C.red}`
   All:      padding="12px 20px", borderRadius=14, fontWeight=700, fontSize=14

── Cd (Card — Dark theme)
   Default:  background=C.card, borderRadius=16, border=`1px solid ${C.brd}`, padding=16
   Glow:     border=`1px solid ${C.primary}30`, boxShadow=shadowGlow

── Bg (Badge — Dark theme)
   Mobile:   padding="4px 10px", borderRadius=8, fontSize=11, fontWeight=700
   Admin:    padding="3px 9px",  borderRadius=7, fontSize=10, fontWeight=700
   Color map: grn→grnD, red→redD, org→orgD, blu→bluD, else→primaryDim

── GlassBtn (Glass theme)
   Primary:  background=gradient, border="1px solid rgba(255,255,255,0.3)", shadow=`0 4px 16px ${color}40`
   Outline:  background="rgba(255,255,255,0.4)", border=`1.5px solid ${color}`, shadow=none

── Avatar (Glass theme)
   background=`linear-gradient(135deg,${color},${color}CC)`
   border="2px solid rgba(255,255,255,0.3)"
   boxShadow=`0 4px 12px ${color}40`

── SB (Sidebar — Desktop)
   Width: 220px, background=C.card, borderRight=`1px solid ${C.brd}`
   Active item: borderRight=`3px solid ${C.primary}`, background=C.primaryDim
   Logo square: 36×36, borderRadius=10, background=C.grad, fontSize=14, fontWeight=900

── DF (Desktop Frame)
   Width: 1440, Height: 900, borderRadius=16
   Chrome: height=36, macOS traffic lights, URL bar with project URL
   Shadow: shadowDesktop

── PF (Phone Frame — iPhone 15 Pro)
   Outer: 393×852, borderRadius=52, shell=phoneShell, shadow=shadowPhone
   Buttons: silent (left, t=90, h=24), volUp (left, t=130, h=32),
            volDown (left, t=175, h=32), power (right, t=150, h=64)
   Inner: inset=3, borderRadius=49, background=C.bg
   Status bar: height=59, Dynamic Island (120×34 pill at top:12)
   Home indicator: width=134, height=5, bottom=8, opacity=0.2

── FS (Flow Section)
   marginBottom=60
   Header: 4px left bar + title (20px/700) + sub (14px/ts)
   Content: flexbox row, gap=36 (screens), gap=48 (desktop frames)

── SeededAvatar (Realistic user photos)
   Source:   IMAGERY.picsum(seed, 64, 64)   — deterministic across renders
   Element:  <img src={IMAGERY.picsum(`user-${id}`, 64, 64)}
                  alt={name} loading="lazy" decoding="async" />
   Style:    width=44 or 64, height=same, borderRadius="50%",
             border=`2px solid ${C.bg}` (dark) OR `2px solid ${C.white}` (glass),
             boxShadow=shadowAvatar
   Rule: use a stable seed tied to a row id — never Math.random (breaks QA diffs).
   Fallback: if offline, swap <img> for a colored initials circle using SEED.namesEn.

── InlineLottie (Motion accent)
   Dependency: add MOTION.dotlottiePlayerCdn once in <head> as <script type="module">.
   Element:    <dotlottie-player src={MOTION.curated.success.url}
                                 autoplay
                                 style={{ width:72, height:72 }}
                                 aria-label="Order confirmed"/>
   Placement: success confirmation card hero, empty-state illustration,
              onboarding splash, post-checkout thank-you screen.
   Reduced-motion: gate autoplay with window.matchMedia('(prefers-reduced-motion: reduce)').
   Never loop on sales decks — one-shot, then hold last frame.

── ArabicSpan (lang-tagged Arabic text)
   Element: <span lang="ar" dir="rtl" style={{
              fontFamily: TYPOGRAPHY.fonts.arabic,
              fontFeatureSettings: TYPOGRAPHY.featureSettings.arabic,
              fontWeight: 600,
            }}>مُرشد</span>
   Use: every AR label under a screen, every bilingual button, every AR-first persona chip.
   Rule: always set lang="ar" and dir="rtl" — enables screen readers + proper glyph shaping.
   Mixing inline with EN: keep parent dir="ltr" and let the Arabic span handle its own direction.
*/


// ═══════════════════════════════════════════════════════════════════════════════
//  6. TYPOGRAPHY — Bilingual (Latin + Arabic) Font System
//  Expanded from UNIVERSAL.font. Use this block when building any bilingual board.
//  Arabic rendering quality is a premium differentiator — do NOT rely on system-ui
//  alone if the board has more than a handful of Arabic labels.
// ═══════════════════════════════════════════════════════════════════════════════
const TYPOGRAPHY = {

  // ── Font stacks ────────────────────────────────────────────────────────────
  fonts: {
    // Latin-only screens (EN-first boards, dashboard UI labels):
    latin:  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

    // Arabic-only content (RTL screens, AR persona boards).
    // IBM Plex Sans Arabic is the preferred body face — clean, modern, excellent weight range.
    // Cairo is the fallback (strong display face, slightly heavier).
    // Tajawal is the tertiary fallback (narrower, good for UI chrome).
    arabic: "'IBM Plex Sans Arabic','Cairo','Tajawal',system-ui,sans-serif",

    // Mixed content (recommended default for ALL bilingual boards):
    // Browser picks Inter for Latin glyphs and IBM Plex Sans Arabic for Arabic glyphs automatically.
    // This is the cleanest approach — one font-family declaration for the whole tree.
    mixed:  "'Inter','IBM Plex Sans Arabic','Cairo',-apple-system,sans-serif",
  },

  // ── Google Fonts loader URL ────────────────────────────────────────────────
  // Paste as <link rel="stylesheet"> in the board's <head>.
  // Loads all 4 families with the weight ranges used across both design systems.
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?" +
    "family=Inter:wght@400;500;600;700;800;900" +
    "&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700" +
    "&family=Cairo:wght@400;600;700;800;900" +
    "&family=Tajawal:wght@400;500;700;800" +
    "&display=swap",

  // ── OpenType feature settings ──────────────────────────────────────────────
  featureSettings: {
    // Apply to Arabic text runs for superior kashida / ligature behavior:
    //   style={{ fontFeatureSettings: TYPOGRAPHY.featureSettings.arabic }}
    arabic: '"ss01","kern","liga"',
    // Latin default — already on in Inter, but set explicitly if mixing with another stack:
    latin: '"cv11","ss01","kern"',
  },

  // ── Usage rules ────────────────────────────────────────────────────────────
  // 1. Board root <body>: use fonts.mixed. Browser auto-switches per script.
  // 2. Arabic persona label under a screen: wrap in a <span lang="ar" dir="rtl">
  //    with explicit fonts.arabic and featureSettings.arabic.
  //    Example:
  //      <span lang="ar" dir="rtl" style={{
  //        fontFamily: TYPOGRAPHY.fonts.arabic,
  //        fontFeatureSettings: TYPOGRAPHY.featureSettings.arabic,
  //        fontWeight: 600,
  //      }}>مُرشد</span>
  // 3. Inside phone frames rendering an Arabic-first UI, set dir="rtl" on the
  //    phone screen container — NOT on the board canvas (which must stay LTR
  //    for zoom/pan transforms).
  // 4. Numbers inside Arabic text: keep as Latin digits unless the client
  //    specifically requested Arabic-Indic numerals. Latin digits read faster
  //    and the design system hasn't been audited for Arabic-Indic yet.
  // 5. NEVER use Inter alone for Arabic — it has no Arabic glyphs and falls
  //    back to a generic system face that breaks the premium feel.
};


// ═══════════════════════════════════════════════════════════════════════════════
//  7. IMAGERY — Realistic Photo Helpers (Avatars, Hero Images, Banners)
//  Use these helpers to populate boards with real photography instead of placeholder
//  colored blocks. Every board should feel like a product with real content.
// ═══════════════════════════════════════════════════════════════════════════════
const IMAGERY = {

  // ── Lorem Picsum — seeded, deterministic, realistic stock photos ───────────
  // Seed keeps the same photo across re-renders; changing seed reshuffles.
  // Good for: avatars, card thumbnails, marketplace listings, filler content.
  //   <img src={IMAGERY.picsum('driver-12', 64, 64)} />
  picsum: (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`,

  // ── Unsplash direct — curated, high-quality, category-aligned photos ───────
  // Use an Unsplash photo ID (from unsplash.com/photos/:id) for brand-aligned hero imagery.
  //   <img src={IMAGERY.unsplash('photo-1517248135467-4c7edcad34c4', 1200, 400)} />
  unsplash: (id, w, h) => `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`,

  // ── Common aspect ratios ───────────────────────────────────────────────────
  // Avatar       1:1   — 64×64, 96×96, 120×120
  // Card hero    16:9  — 320×180, 640×360
  // Story        9:16  — 270×480 (vertical feed card)
  // Banner       3:1   — 1200×400 (dashboard top banner)
  // Square card  4:3   — 320×240 (marketplace listing)

  // ── Curated seed examples per vertical ─────────────────────────────────────
  curated: {
    // Food & restaurants — warm, appetizing
    food: ["hashem-falafel", "mansaf-plate", "arabic-bread", "shawarma-cart", "kunafa"],

    // Logistics & delivery — motion, city energy
    logistics: ["amman-rider", "delivery-bike", "warehouse-lights", "route-map"],

    // Wellness & coaching — soft, approachable portraits
    wellness: ["therapist-01", "yoga-studio", "journal-quiet", "morning-tea"],

    // Fintech & B2B — crisp, geometric, architectural
    fintech: ["office-glass", "chart-desk", "keyboard-macro", "boardroom"],

    // Healthcare — clinical but human, avoid overly sterile
    healthcare: ["doctor-portrait", "clinic-reception", "stethoscope", "pharmacy-shelf"],

    // E-commerce / retail — product-forward
    retail: ["packaged-box", "storefront", "shopping-bag", "product-flat-lay"],
  },

  // Rule: ALWAYS add loading="lazy" and decoding="async" to board <img> tags.
  // Rule: never use Unsplash source (source.unsplash.com) — unpredictable, deprecated.
  //       Always use images.unsplash.com with an explicit photo ID.
};


// ═══════════════════════════════════════════════════════════════════════════════
//  8. SEED — Realistic Data Pools (Names, Companies, Addresses, Currencies)
//  Use these for filler content. Mix AR + EN across a board to show bilingual intent.
//  Numbers and currency formatters match MENA conventions.
// ═══════════════════════════════════════════════════════════════════════════════
const SEED = {

  // ── Arabic names (common MENA, region-agnostic) ────────────────────────────
  namesAr: [
    "أحمد الخطيب", "ليلى حدّاد", "يوسف النعيمي", "سارة الزعبي",
    "خالد المصري", "نور العموش", "رامي البطاينة", "دانا السقاف",
    "عمر الجبوري", "هالة العبدلات", "بلال الشوابكة", "ريم الخصاونة",
  ],

  // ── English names (transliterated + Western, bilingual-ready) ─────────────
  namesEn: [
    "Ahmad Khatib", "Layla Haddad", "Yousef Naimi", "Sara Zoubi",
    "Khalid Masri", "Nour Amoush", "Rami Btaineh", "Dana Saqqaf",
    "Omar Jabouri", "Hala Abdallat", "Bilal Shawabkeh", "Reem Khasawneh",
  ],

  // ── Companies — fictional but plausibly MENA-operating ─────────────────────
  companiesMENA: [
    "Acme Logistics", "Cedar Coaching", "Bazaar Marketplace", "Orchard Wellness",
    "Amman Foods Co.", "Levant Digital", "Gulf Dispatch", "Petra Fintech",
    "Shoruq Retail", "Nimr Ventures", "Cedar Holdings", "Falcon Freight",
  ],

  // ── Addresses by city (street + area, formatted for display) ───────────────
  addressesAmman: [
    "Rainbow St, Jabal Amman",
    "Wakalat St, Sweifieh",
    "Mecca St, Khalda",
    "Abdoun Circle",
    "Shmeisani, Queen Noor St",
    "University St, Tla' Al-Ali",
    "Zahran St, 4th Circle",
    "Al-Madina Al-Munawara St",
  ],

  addressesRiyadh: [
    "King Fahd Rd, Olaya",
    "Tahlia St, Sulaimaniya",
    "Prince Sultan Rd, Al Khobar",
    "Diplomatic Quarter",
    "King Abdullah Rd, Al Malqa",
    "Northern Ring Rd, An Nakheel",
  ],

  addressesDubai: [
    "Sheikh Zayed Rd, Downtown",
    "Al Wasl Rd, Jumeirah",
    "Jumeirah Beach Rd, JBR",
    "Business Bay, Marasi Dr",
    "Al Barsha Heights, TECOM",
    "Deira, Al Rigga",
  ],

  // ── Phone formatter (Jordan) ───────────────────────────────────────────────
  //   phoneJO(791234567) → "+962 79 123 4567"
  phoneJO: (n) => {
    const s = String(n).padStart(9, '0');
    return `+962 ${s.slice(0, 2)} ${s.slice(2, 5)} ${s.slice(5)}`;
  },

  // ── Currency formatters ────────────────────────────────────────────────────
  //   amountJOD(12.5)  → "12.500 JOD"   (3 decimal fils — Jordan convention)
  //   amountSAR(120)   → "120.00 SAR"   (2 decimal halalas — Saudi)
  //   amountAED(450)   → "450.00 AED"   (2 decimal fils — UAE)
  amountJOD: (n) => `${Number(n).toFixed(3)} JOD`,
  amountSAR: (n) => `${Number(n).toFixed(2)} SAR`,
  amountAED: (n) => `${Number(n).toFixed(2)} AED`,

  // ── Usage patterns ─────────────────────────────────────────────────────────
  // Picking names: deterministic by index (avoid Math.random — breaks Playwright diffs).
  //   const pick = (arr, i) => arr[i % arr.length];
  //   <div>{pick(SEED.namesAr, idx)} · {pick(SEED.namesEn, idx)}</div>
  //
  // Mixing AR + EN in a list: alternate names per row to demonstrate bilingual support.
  // Mixing cities: match to PROJECT.mapCenter — if Amman, use addressesAmman etc.
};


// ═══════════════════════════════════════════════════════════════════════════════
//  9. MOTION — Lottie Animations (via dotLottie Player)
//  Adds premium micro-interactions to boards without authoring video.
//  Use sparingly — 1 or 2 per board max, in spots that benefit from motion.
// ═══════════════════════════════════════════════════════════════════════════════
const MOTION = {

  // ── dotLottie Player CDN (module script) ───────────────────────────────────
  // Add once to the board <head>:
  //   <script src="..." type="module"></script>
  dotlottiePlayerCdn:
    "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs",

  // ── Curated Lottie categories ──────────────────────────────────────────────
  // Placeholder URLs from lottiefiles.com — replace with approved files per client.
  // The URL shape is: https://lottie.host/<id>/<slug>.lottie
  curated: {
    success:     {
      url: "https://lottie.host/placeholder-success/checkmark.lottie",
      use: "Order confirmed, payment success, task complete — one-shot, no loop",
    },
    error: {
      url: "https://lottie.host/placeholder-error/x-mark.lottie",
      use: "Payment failed, form error, destructive confirm — one-shot, no loop",
    },
    loading: {
      url: "https://lottie.host/placeholder-loading/spinner.lottie",
      use: "Skeleton-alternative for hero sections — subtle loop, 1.2s cycle",
    },
    emptyState: {
      url: "https://lottie.host/placeholder-empty/inbox.lottie",
      use: "Empty inbox, no results, no items — gentle loop, 3s cycle",
    },
    onboarding: {
      url: "https://lottie.host/placeholder-onboarding/wave.lottie",
      use: "Welcome splash, first-run tutorial hero — 2-4s one-shot then hold",
    },
    celebration: {
      url: "https://lottie.host/placeholder-celebration/confetti.lottie",
      use: "Milestone unlocked, referral reward, streak achieved — one-shot",
    },
    mapPulse: {
      url: "https://lottie.host/placeholder-mappulse/radar.lottie",
      use: "Live driver location, tracking ping — subtle loop, respect reduced-motion",
    },
    notification: {
      url: "https://lottie.host/placeholder-notif/bell.lottie",
      use: "New message, incoming order ring — one-shot on mount",
    },
  },

  // ── Integration pattern ────────────────────────────────────────────────────
  // Inline Lottie inside a card (JSX):
  //   <dotlottie-player
  //     src={MOTION.curated.success.url}
  //     autoplay
  //     style={{ width: 80, height: 80 }}
  //   />
  //
  // Looped map pulse overlay:
  //   <dotlottie-player
  //     src={MOTION.curated.mapPulse.url}
  //     autoplay loop
  //     style={{ position: 'absolute', top: pinY-20, left: pinX-20,
  //              width: 40, height: 40, pointerEvents: 'none' }}
  //   />

  // ── Performance & UX rules ────────────────────────────────────────────────
  // 1. MAX 1–2 Lotties per screen. Every active Lottie runs on the main thread
  //    and can tank zoom-out board performance.
  // 2. NEVER autoplay loops on sales decks viewed on laptop battery — one-shot only.
  //    Loop is acceptable for interactive demos and live pitches on wall displays.
  // 3. Always set explicit width/height — layout shift is unacceptable.
  // 4. Respect prefers-reduced-motion: wrap autoplay in a media query or
  //    gate autoplay={!prefersReducedMotion}.
  // 5. Keep file size under 40KB per .lottie asset. Reject anything over 80KB.
  // 6. Board zoom-out (default 0.35) makes Lotties nearly invisible — prefer
  //    Lotties inside 1.0-zoom detail views, not thumbnail previews.
};


// ═══════════════════════════════════════════════════════════════════════════════
//  10. GOLD IVORY — Inverse of Gold Noir
//  Same gold primary, flipped canvas. Enables a light/dark toggle on dark-first
//  boards when a client wants to see both modes before committing.
// ═══════════════════════════════════════════════════════════════════════════════
const GOLD_IVORY = {

  // ── Primary brand (unchanged — gold remains the signature) ─────────────────
  primary:       "#B8953F",                           // gold — slightly deeper for contrast on light
  primaryLight:  "#D4B360",                           // hover / highlight
  primaryDim:    "rgba(184,149,63,0.10)",             // tint for backgrounds / badges
  primaryDimSm:  "rgba(184,149,63,0.06)",
  grad:          "linear-gradient(135deg,#9C7E30,#B8953F,#D4B360)",

  // ── Background scale (lightest → surface) ──────────────────────────────────
  bg:    "#FAF7F1",  // warm off-white page background (matches warm-white text ethos)
  card:  "#FFFFFF",  // primary card — crisp white
  card_: "#FDFBF6",  // secondary surface variant
  card2: "#F5F1E8",  // inputs / subtle raised surfaces
  card2_:"#F0EBDF",
  bbg:   "linear-gradient(135deg,#F3EDDF,#FAF7F1,#EDE5D2)",  // board canvas

  // ── Borders ────────────────────────────────────────────────────────────────
  brd:  "#E5DFD0",
  brd_: "#DDD6C3",
  brdL: "#CFC5AE",

  // ── Text (dark ink on warm paper) ──────────────────────────────────────────
  w:  "#1A1714",   // near-black ink (was warm white in dark variant)
  ts: "#5A544A",   // secondary
  td: "#8A8276",   // dim / placeholder

  // ── Semantic status (muted for light bg) ───────────────────────────────────
  grn: "#059669", grnD: "rgba(5,150,105,0.10)",
  red: "#DC2626", redD: "rgba(220,38,38,0.10)",
  blu: "#2563EB", bluD: "rgba(37,99,235,0.10)",
  org: "#EA580C", orgD: "rgba(234,88,12,0.10)",

  // ── Shadows (stronger, since bg is light) ──────────────────────────────────
  shadowPhone:   "0 0 0 1px #D4CDB8, 0 0 0 3px #F0EBDF, 0 30px 80px rgba(80,60,20,0.18)",
  shadowDesktop: "0 24px 80px rgba(80,60,20,0.15)",
  shadowCard:    "0 4px 20px rgba(184,149,63,0.18)",
  shadowGlow:    "0 0 20px rgba(184,149,63,0.10)",

  // ── Phone frame ────────────────────────────────────────────────────────────
  phoneShell:  "linear-gradient(145deg,#E5DFD0,#F5F1E8)",
  phoneBorder: "#D4CDB8",

  // ── Map tiles (use light variant) ──────────────────────────────────────────
  mapTiles: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
};


// ═══════════════════════════════════════════════════════════════════════════════
//  11. VIOLET NIGHT — Smoked-Glass Inverse
//  Dark-mode companion to Violet Glass. Deep purple canvas, same amber accent.
//  Ideal for "night mode" demos of wellness / coaching / community apps.
// ═══════════════════════════════════════════════════════════════════════════════
const VIOLET_NIGHT = {

  // ── Primary brand ──────────────────────────────────────────────────────────
  primary:      "#B57DE3",   // brighter purple (pops on dark)
  primaryDark:  "#9B4DCA",   // base Violet Glass purple
  primaryLight: "rgba(181,125,227,0.20)",
  primaryGlow:  "#D4A7F5",

  // ── Accent ─────────────────────────────────────────────────────────────────
  accent:       "#F5A623",   // amber unchanged — signature color
  accentLight:  "rgba(245,166,35,0.15)",

  // ── Background / page ──────────────────────────────────────────────────────
  bg:    "#130A1F",   // deep indigo-purple (not pure black — retains Violet Glass warmth)
  white: "#F8F6FF",   // text white (reuses Violet Glass light bg as text tone)

  // ── Board canvas background ────────────────────────────────────────────────
  boardBg: "linear-gradient(135deg,#0E0618 0%,#1A1030 50%,#120A22 100%)",

  // ── Smoked glass surfaces ──────────────────────────────────────────────────
  card:        "rgba(40,22,64,0.55)",    // smoked purple glass
  glass:       "rgba(40,22,64,0.35)",
  glassStrong: "rgba(48,28,76,0.72)",
  glassBorder: "rgba(181,125,227,0.25)",

  // ── Borders ────────────────────────────────────────────────────────────────
  border: "rgba(181,125,227,0.18)",

  // ── Text ───────────────────────────────────────────────────────────────────
  text:          "#F0EBFA",   // soft lavender-white (warm, not clinical)
  textSecondary: "#A89BBC",
  textLight:     "#6D6283",

  // ── Semantic status (brighter to stand out on dark) ────────────────────────
  success: "#34D399",
  error:   "#F87171",
  warning: "#FBBF24",
  info:    "#A5B4FC",

  // ── Gradients ──────────────────────────────────────────────────────────────
  gradient:       "linear-gradient(135deg,#B57DE3 0%,#D4A7F5 50%,#A5B4FC 100%)",
  gradientDark:   "linear-gradient(135deg,#7B2FA0 0%,#9B4DCA 100%)",
  gradientSplash: "linear-gradient(160deg,#1A1030 0%,#3D1F5E 40%,#6B3A9A 70%,#9B4DCA 100%)",
  accentGrad:     "linear-gradient(135deg,#F5A623 0%,#E8930C 100%)",

  // ── Shadows ────────────────────────────────────────────────────────────────
  shadowGlass:  "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
  shadowCard:   "0 4px 16px rgba(0,0,0,0.45)",
  shadowAvatar: "0 4px 12px rgba(181,125,227,0.35)",

  // ── Phone frame ────────────────────────────────────────────────────────────
  phoneFrame:  "3px solid rgba(181,125,227,0.25)",
  phoneShell:  "#1A1030",
  phoneShadow: "0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(181,125,227,0.15)",

  // ── Map tiles ──────────────────────────────────────────────────────────────
  mapTiles: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};


// ═══════════════════════════════════════════════════════════════════════════════
//  THEME PAIRING RULE
//  GOLD_NOIR ↔ GOLD_IVORY  — paired set (same gold primary, inverted canvas)
//  VIOLET_GLASS ↔ VIOLET_NIGHT  — paired set (same purple/amber, inverted glass)
//
//  When a client requests a dark/light toggle in the board:
//  1. Import both tokens of the pair into the script
//  2. Wrap the C reference in a React context: const [mode, setMode] = useState('dark')
//  3. const C = mode === 'dark' ? GOLD_NOIR : GOLD_IVORY  (or the Violet pair)
//  4. Add a small toggle in the board toolbar (sun/moon icon, top-right of zoom bar)
//  5. Transition bg/card colors with `transition: background-color 300ms ease`
// ═══════════════════════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════════════════════
//  12. BRAND_BAR — The "Designed by Aviniti" Watermark Pill
//  Appears once per board, fixed bottom-left. Signals authorship without
//  dominating the composition.
// ═══════════════════════════════════════════════════════════════════════════════
const BRAND_BAR = {

  // ── Position ───────────────────────────────────────────────────────────────
  position: {
    position: "fixed",
    bottom:   20,
    left:     20,
    zIndex:   100,        // above zoom controls (zIndex 50), below modals (200+)
  },

  // ── Composition (left → right) ─────────────────────────────────────────────
  // 1. Aviniti logo mark — 24×24, rounded corners, loaded from base64 asset
  // 2. "DESIGNED BY AVINITI" — uppercase, tracked-out, 10px / 700, color=C.primary
  // 3. "Your Ideas, Our Reality" — tagline, 9px / 500, color=C.ts (or equivalent)
  //
  // Layout: flex, alignItems=center, gap=10. Text stack is flex-column on the right of the logo.

  // ── Style spec (glass pill) ────────────────────────────────────────────────
  style: {
    display:              "flex",
    alignItems:           "center",
    gap:                  10,
    padding:              "8px 14px 8px 8px",        // extra-left to hug the logo
    borderRadius:         999,                        // full pill
    background:           "rgba(20,20,20,0.70)",      // default (dark themes)
    backdropFilter:       "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)",
    border:               "1px solid rgba(255,255,255,0.08)",
    boxShadow:            "0 8px 24px rgba(0,0,0,0.40)",
  },

  // ── Logo reference ─────────────────────────────────────────────────────────
  // The Aviniti logo mark lives in a permanent workspace file:
  //   _template/_aviniti-logo-base64.txt
  // Contents: a single data URI string starting "data:image/png;base64,..."
  // Read the file, trim whitespace, and use as src:
  //   <img src={aviniteLogoBase64} alt="Aviniti" width={24} height={24}
  //        style={{ borderRadius: 6 }} />
  logoFile: "_template/_aviniti-logo-base64.txt",
  logoSize: 24,

  // ── Typography tokens ──────────────────────────────────────────────────────
  text: {
    label: {
      fontSize:       10,
      fontWeight:     700,
      letterSpacing:  1.2,
      textTransform:  "uppercase",
      // color: set per theme (C.primary on dark, C.primary on glass)
    },
    tagline: {
      fontSize:   9,
      fontWeight: 500,
      marginTop:  1,
      // color: secondary text token (C.ts dark, C.textSecondary glass)
    },
  },

  // ── Variant: inline logo in title card ─────────────────────────────────────
  // The board title card (top-left of canvas, shows PROJECT.name + version) gets
  // a 20px Aviniti logo placed immediately before the product name.
  //   <img src={aviniteLogoBase64} width={20} height={20}
  //        style={{ borderRadius: 5, marginRight: 10 }} />
  //   <span>{PROJECT.name}</span>
  titleCardLogoSize: 20,

  // ── Light-theme variant (GOLD_IVORY, VIOLET_GLASS) ─────────────────────
  // Swap style.background → "rgba(255,255,255,0.72)"
  // Swap style.border    → "1px solid rgba(255,255,255,0.9)"
  // Swap style.boxShadow → "0 8px 24px rgba(120,47,160,0.12)"
};


// ═══════════════════════════════════════════════════════════════════════════════
//  13. A11Y — Accessibility Tokens & Rules
//  WCAG 2.1 AA baseline. Every board must clear these bars before client delivery.
// ═══════════════════════════════════════════════════════════════════════════════
const A11Y = {

  // ── Contrast ratios (WCAG AA minimum) ──────────────────────────────────────
  contrast: {
    bodyText:       4.5,   // body copy ≤ 18px regular / 14px bold — ratio ≥ 4.5:1
    largeText:      3.0,   // headings ≥ 18px bold / 24px regular — ratio ≥ 3.0:1
    uiComponents:   3.0,   // icons, borders, focus rings — ratio ≥ 3.0:1
    nonText:        3.0,   // graphics essential to understanding
  },
  // Verified pairings:
  //   GOLD_NOIR.w (#F0EDE8) on GOLD_NOIR.bg (#0A0A0A)     → 17.8:1 ✓
  //   GOLD_NOIR.primary (#C8A951) on GOLD_NOIR.bg         → 9.1:1  ✓
  //   VIOLET_GLASS.text (#1A1A2E) on VIOLET_GLASS.bg (#F8F6FF)→ 15.9:1 ✓
  //   VIOLET_GLASS.primary (#9B4DCA) on VIOLET_GLASS.bg       → 5.4:1  ✓ (AA)
  // Re-verify any time a primary color is swapped for a new client brand.

  // ── Focus ring ─────────────────────────────────────────────────────────────
  focus: {
    outlineWidth:  2,
    outlineStyle:  "solid",
    outlineOffset: 2,
    // Outline color = C.primary of the active theme. Example CSS:
    //   *:focus-visible {
    //     outline: 2px solid var(--primary);
    //     outline-offset: 2px;
    //     border-radius: inherit;
    //   }
  },

  // ── Reduced-motion media query ─────────────────────────────────────────────
  reducedMotion: `
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `,
  // Gate autoplaying Lotties: <dotlottie-player autoplay={!prefersReducedMotion()} />

  // ── Minimum tap target ─────────────────────────────────────────────────────
  minTapTarget: { w: 44, h: 44 },   // Apple HIG + WCAG 2.5.5 (Level AAA, adopted as our floor)
  // Apply as min-width/min-height on every interactive element at phone scale.
  // Exception: inline text links inside a paragraph (covered by WCAG 2.5.5 exception).

  // ── RTL icon mirroring ─────────────────────────────────────────────────────
  rtlMirror: {
    // MUST flip horizontally in RTL layouts (direction-aware):
    flip: [
      "arrow-left", "arrow-right", "arrow-forward", "arrow-back",
      "chevron-left", "chevron-right",
      "undo", "redo",
      "reply", "forward",
      "caret-left", "caret-right",
      "send",                  // paper-plane points "forward" — flips to point right in RTL
      "list-indent", "list-outdent",
      "next", "previous",
      "external-link",         // arrow component implies outward motion
    ],
    // MUST NOT flip (fixed cultural / semantic meaning):
    noFlip: [
      "clock", "hourglass",    // time direction is universal
      "check", "checkmark",    // tick is culturally fixed
      "close", "x", "cancel",  // symmetrical
      "phone", "phone-handset",// handset shape is fixed
      "search", "magnifier",   // loupe handle is culturally neutral
      "lock", "unlock",
      "heart", "star", "thumbs-up",
      "media-play", "pause",   // media playback direction is a global convention (don't flip)
      "volume", "volume-mute",
      "calendar", "camera", "image", "user",
    ],
    // Implementation: in RTL, apply transform: scaleX(-1) to icons in the `flip` list.
    //   <svg style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}>...</svg>
  },

  // ── Alt-text rules ─────────────────────────────────────────────────────────
  // Every <img> needs alt. Decorative imagery = alt="". Informational = descriptive.
  // Lottie players need aria-label describing the state they convey.
};


// Export for reference (not used in browser — paste directly into board scripts)
if (typeof module !== 'undefined') {
  module.exports = {
    GOLD_NOIR, GOLD_IVORY,
    VIOLET_GLASS, VIOLET_NIGHT,
    MODULE_LIGHT, MODULE_DARK,
    UNIVERSAL, PREMIUM_PATTERNS,
    TYPOGRAPHY, IMAGERY, SEED, MOTION,
    BRAND_BAR, A11Y,
  };
}
