/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      colors: {
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
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc",
          elevated: "rgba(255, 255, 255, 0.72)",
          dark: "#0c1419",
          "dark-muted": "#111b26",
          "dark-elevated": "#172231",
          "dark-card": "#1a2736",
        },
        ink: {
          DEFAULT: "#0f172a",
          muted: "#475569",
          subtle: "#64748b",
          "dark-primary": "#e8eef4",
          "dark-muted": "#a8b8c8",
          "dark-subtle": "#7d8fa3",
        },
        clinical: {
          blue: "#3b82f6",
          violet: "#8b5cf6",
          amber: "#f59e0b",
          rose: "#f43f5e",
          slate: "#64748b",
        },
      },
      borderRadius: {
        card: "1rem",
        "card-lg": "1.25rem",
        "card-xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(15, 23, 42, 0.06), 0 4px 16px -4px rgba(15, 23, 42, 0.08)",
        "soft-dark": "0 2px 12px -2px rgba(0, 0, 0, 0.35), 0 4px 20px -4px rgba(0, 0, 0, 0.25)",
        glass: "0 8px 32px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
        "glass-lg": "0 16px 48px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
        "glass-lg-dark": "0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        glow: "0 0 0 1px rgba(20, 184, 166, 0.15), 0 8px 24px rgba(20, 184, 166, 0.12)",
        "glow-dark": "0 0 0 1px rgba(45, 212, 191, 0.2), 0 8px 24px rgba(20, 184, 166, 0.15)",
      },
      transitionDuration: {
        theme: "350ms",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        "bottom-nav": "var(--bottom-nav-height)",
        fab: "var(--fab-offset)",
      },
      height: {
        "bottom-nav": "var(--bottom-nav-height)",
        "mobile-header": "3.5rem",
      },
      padding: {
        "mobile-chrome": "var(--mobile-chrome-bottom)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "slide-down": "slideDown 0.25s ease-out forwards",
        shimmer: "shimmer 1.8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
