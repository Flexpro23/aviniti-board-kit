// Project anchors — the ONLY file you edit to set a palette. build-tokens.mjs generates the ramps and both themes from it.
// ramps: role → anchor hex, or [hex, { step: hex } pins, chromaBoost]. Required roles: primary, accent, neutral, danger,
// warning, success, info. The light theme reads steps 700 (primary/danger/warning/success/info), 500 (accent) and the
// neutral ramp; the dark theme reads steps 200–400. Pin the anchor at the step it should land on (e.g. { 700: anchor }).
// cats: optional category colours (chips, row groups, charts by category); chart: optional series override per theme.
// themeOverrides: { light: { key: value }, dark: { … } } replaces any derived theme key when a pair fails the contrast build.
export default () => ({
  name: 'Project',
  version: '1.0.0',
  ramps: {
    primary: ['#1F6A66', { 700: '#1F6A66' }],
    accent: '#B07A2A',
    neutral: '#5C6066',
    danger: '#B42318',
    warning: ['#8A5A00', { 700: '#8A5A00' }],
    success: '#1E7A4C',
    info: '#2F5FA8',
  },
  cats: {},
  type: {
    // Google Fonts stylesheet loaded by every board (shared/src/head.html). Keep IBM Plex Sans Arabic or another real Arabic face.
    fontsHref: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap',
    family: {
      ui: "'IBM Plex Sans', 'IBM Plex Sans Arabic', system-ui, sans-serif",
      ar: "'IBM Plex Sans Arabic', 'IBM Plex Sans', system-ui, sans-serif",
      display: "'IBM Plex Sans', 'IBM Plex Sans Arabic', system-ui, sans-serif",
      displayAr: "'IBM Plex Sans Arabic', 'IBM Plex Sans', system-ui, sans-serif",
      mono: "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace",
    },
  },
  themeOverrides: { light: {}, dark: {} },
});
