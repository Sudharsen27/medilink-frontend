import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/**
 * Backward-compatible toggle for legacy Navbar usage.
 * Prefer ThemeToggle for full light / dark / system control.
 */
function DarkModeToggle({ className = "", variant = "navbar" }) {
  const { isDark, toggleTheme } = useTheme();

  const navbarStyles =
    "p-2 rounded-xl transition-all duration-300 bg-white/15 hover:bg-white/25 text-white border border-white/20";
  const defaultStyles =
    "p-2 rounded-xl transition-all duration-300 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`${variant === "navbar" ? navbarStyles : defaultStyles} ${className}`}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-300" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
}

export default DarkModeToggle;
