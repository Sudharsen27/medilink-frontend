/**
 * MediLink typography scale
 * Sans: Inter (body) | Display: Plus Jakarta Sans (headings)
 */

export const fontFamily = {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
  mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
};

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

/** Type scale — mobile-first, fluid where noted */
export const typeScale = {
  display: {
    size: "2.25rem",      // 36px
    lineHeight: "2.5rem",
    weight: fontWeight.extrabold,
    tracking: "-0.025em",
    class: "text-4xl font-display font-extrabold tracking-tight",
  },
  h1: {
    size: "1.875rem",     // 30px
    lineHeight: "2.25rem",
    weight: fontWeight.bold,
    tracking: "-0.02em",
    class: "text-3xl font-display font-bold tracking-tight",
  },
  h2: {
    size: "1.5rem",       // 24px
    lineHeight: "2rem",
    weight: fontWeight.bold,
    tracking: "-0.015em",
    class: "text-2xl font-display font-bold tracking-tight",
  },
  h3: {
    size: "1.25rem",      // 20px
    lineHeight: "1.75rem",
    weight: fontWeight.semibold,
    class: "text-xl font-display font-semibold",
  },
  h4: {
    size: "1.125rem",     // 18px
    lineHeight: "1.5rem",
    weight: fontWeight.semibold,
    class: "text-lg font-semibold",
  },
  body: {
    size: "0.875rem",     // 14px
    lineHeight: "1.25rem",
    weight: fontWeight.normal,
    class: "text-sm",
  },
  bodyLg: {
    size: "1rem",
    lineHeight: "1.5rem",
    weight: fontWeight.normal,
    class: "text-base",
  },
  caption: {
    size: "0.75rem",      // 12px
    lineHeight: "1rem",
    weight: fontWeight.medium,
    class: "text-xs",
  },
  eyebrow: {
    size: "0.6875rem",    // 11px
    lineHeight: "1rem",
    weight: fontWeight.semibold,
    tracking: "0.08em",
    class: "text-[11px] font-semibold uppercase tracking-widest",
  },
  label: {
    size: "0.875rem",
    lineHeight: "1.25rem",
    weight: fontWeight.medium,
    class: "text-sm font-medium",
  },
};
