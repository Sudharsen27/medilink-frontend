import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  persistTheme,
  resolveTheme,
  THEMES,
} from "../lib/theme";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    resolveTheme(getStoredTheme())
  );

  const apply = useCallback((nextTheme, { animate = true } = {}) => {
    const resolved = resolveTheme(nextTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved, { animate });
  }, []);

  useEffect(() => {
    apply(theme, { animate: false });
    persistTheme(theme);
  }, [theme, apply]);

  useEffect(() => {
    if (theme !== "system") return undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system", { animate: true });

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme, apply]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== "medilink-theme") return;
      const next = getStoredTheme();
      setThemeState(next);
      apply(next, { animate: false });
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [apply]);

  const setTheme = useCallback((next) => {
    if (!THEMES.includes(next)) return;
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const resolved = resolveTheme(current);
      return resolved === "dark" ? "light" : "dark";
    });
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const index = THEMES.indexOf(current);
      return THEMES[(index + 1) % THEMES.length];
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      isDark: resolvedTheme === "dark",
      setTheme,
      toggleTheme,
      cycleTheme,
      systemTheme: getSystemTheme(),
    }),
    [theme, resolvedTheme, setTheme, toggleTheme, cycleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
