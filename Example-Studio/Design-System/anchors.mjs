// Project anchors — the ONLY file you edit to set a palette. build-tokens.mjs generates the ramps and both themes from it.
// ramps: role → anchor hex, or [hex, { step: hex } pins, chromaBoost]. Required roles: primary, accent, neutral, danger,
// warning, success, info. The light theme reads steps 700 (primary/danger/warning/success/info), 500 (accent) and the
// neutral ramp; the dark theme reads steps 200–400. Pin the anchor at the step it should land on (e.g. { 700: anchor }).
// cats: optional category colours (chips, row groups, charts by category); chart: optional series override per theme.
// themeOverrides: { light: { key: value }, dark: { … } } replaces any derived theme key when a pair fails the contrast build.
//
// Fernly: fern green on warm paper, terracotta for the one brand moment (the pot), plant categories as muted ramps.
export default () => ({
  name: 'Fernly',
  version: '1.0.0',
  ramps: {
    primary: ['#2F5D34', { 700: '#2F5D34' }],
    accent: ['#B2582F', { 500: '#B2582F' }],
    neutral: ['#625D52', {}, 0.9],
    danger: ['#B4233C', { 700: '#B4233C' }],
    warning: ['#8A5A00', { 700: '#8A5A00' }],
    success: ['#17725A', { 700: '#17725A' }],
    info: ['#2F5FA8', { 700: '#2F5FA8' }],
  },
  cats: { foliage: '#5B8C3A', succulents: '#3E8A86', flowering: '#B5577A', herbs: '#A8892A', trees: '#6B5A8E' },
  type: {
    // Google Fonts stylesheet loaded by every board (shared/src/head.html). Keep IBM Plex Sans Arabic or another real Arabic face.
    fontsHref: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap',
    family: {
      ui: "'IBM Plex Sans', 'IBM Plex Sans Arabic', system-ui, sans-serif",
      ar: "'IBM Plex Sans Arabic', 'IBM Plex Sans', system-ui, sans-serif",
      display: "'Fraunces', 'IBM Plex Sans Arabic', Georgia, serif",
      displayAr: "'IBM Plex Sans Arabic', 'IBM Plex Sans', system-ui, sans-serif",
      mono: "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace",
    },
  },
  themeOverrides: { light: {}, dark: {} },
});
