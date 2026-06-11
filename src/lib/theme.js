export const THEME_STORAGE_KEY = "medilink-theme";
export const LEGACY_DARK_MODE_KEY = "darkMode";

export const THEMES = ["light", "dark", "system"];

export const getSystemTheme = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export const resolveTheme = (theme) =>
  theme === "system" ? getSystemTheme() : theme;

export const getStoredTheme = () => {
  if (typeof window === "undefined") return "system";

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored && THEMES.includes(stored)) return stored;

  const legacy = localStorage.getItem(LEGACY_DARK_MODE_KEY);
  if (legacy === "true") return "dark";
  if (legacy === "false") return "light";

  return "system";
};

export const applyTheme = (resolvedTheme, { animate = false } = {}) => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const isDark = resolvedTheme === "dark";

  if (animate) {
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 350);
  }

  root.classList.toggle("dark", isDark);
  root.setAttribute("data-theme", resolvedTheme);
  root.style.colorScheme = isDark ? "dark" : "light";

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", isDark ? "#0c1419" : "#0d9488");
  }
};

export const persistTheme = (theme) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  localStorage.removeItem(LEGACY_DARK_MODE_KEY);
};

export const initThemeBeforeRender = () => {
  const theme = getStoredTheme();
  applyTheme(resolveTheme(theme));
};
