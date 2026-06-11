/**
 * MediLink color palette — healthcare SaaS 2026
 * Primary: teal (trust, clinical calm)
 * Semantic: blue info, amber warning, rose danger, violet accent
 */

export const palette = {
  health: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
    950: "#042f2e",
  },
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  clinical: {
    blue: "#3b82f6",
    violet: "#8b5cf6",
    amber: "#f59e0b",
    rose: "#f43f5e",
    emerald: "#10b981",
    indigo: "#6366f1",
  },
};

/** CSS variable names — synced with src/index.css */
export const cssVars = {
  appBg: "--app-bg",
  surfaceBase: "--surface-base",
  surfaceElevated: "--surface-elevated",
  surfaceMuted: "--surface-muted",
  surfaceBorder: "--surface-border",
  textPrimary: "--text-primary",
  textSecondary: "--text-secondary",
  textMuted: "--text-muted",
  accent: "--accent",
  accentSoft: "--accent-soft",
  focusRingOffset: "--focus-ring-offset",
  bottomNavHeight: "--bottom-nav-height",
  fabOffset: "--fab-offset",
  mobileChromeBottom: "--mobile-chrome-bottom",
};

/** Semantic roles for components */
export const semantic = {
  brand: {
    primary: palette.health[600],
    primaryHover: palette.health[700],
    primaryLight: palette.health[50],
    accent: palette.health[500],
  },
  surface: {
    light: {
      base: "#ffffff",
      muted: "#f8fafc",
      elevated: "rgba(255, 255, 255, 0.72)",
      border: "rgba(148, 163, 184, 0.28)",
    },
    dark: {
      base: "#141f2b",
      muted: "#111b26",
      elevated: "rgba(20, 31, 43, 0.88)",
      border: "rgba(148, 163, 184, 0.14)",
      app: "#0c1419",
    },
  },
  text: {
    light: {
      primary: palette.slate[900],
      secondary: palette.slate[600],
      muted: palette.slate[500],
      inverse: "#ffffff",
    },
    dark: {
      primary: "#e8eef4",
      secondary: "#a8b8c8",
      muted: "#7d8fa3",
      inverse: palette.slate[900],
    },
  },
  status: {
    success: palette.health[600],
    info: palette.clinical.blue,
    warning: palette.clinical.amber,
    danger: palette.clinical.rose,
    neutral: palette.slate[500],
  },
};

/** Chart series palette — ordered for multi-series dashboards */
export const chartSeries = [
  palette.health[600],
  palette.clinical.blue,
  palette.clinical.violet,
  palette.clinical.amber,
  palette.clinical.rose,
  palette.health[500],
  palette.clinical.indigo,
  palette.slate[500],
];

export const chartGradients = {
  health: { from: palette.health[600], to: palette.health[400] },
  blue: { from: palette.clinical.blue, to: "#60a5fa" },
  violet: { from: palette.clinical.violet, to: "#a78bfa" },
  amber: { from: palette.clinical.amber, to: "#fbbf24" },
  rose: { from: palette.clinical.rose, to: "#fb7185" },
};
