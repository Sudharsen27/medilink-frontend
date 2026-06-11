import React, { useRef, useEffect, useState } from "react";
import { Sun, Moon, Monitor, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const OPTIONS = [
  {
    id: "light",
    label: "Light",
    description: "Bright clinical workspace",
    icon: Sun,
  },
  {
    id: "dark",
    label: "Dark",
    description: "Low-light healthcare view",
    icon: Moon,
  },
  {
    id: "system",
    label: "System",
    description: "Match device settings",
    icon: Monitor,
  },
];

const ThemeToggle = ({
  variant = "menu",
  className = "",
  align = "left",
  placement = "bottom",
}) => {
  const { theme, setTheme, isDark, cycleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (variant === "icon") {
    const ActiveIcon = isDark ? Sun : Moon;
    return (
      <button
        type="button"
        onClick={cycleTheme}
        className={`p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`}
        aria-label={`Theme: ${theme}. Click to change.`}
        title={`Theme: ${theme}`}
      >
        <ActiveIcon className="w-5 h-5" aria-hidden="true" />
      </button>
    );
  }

  if (variant === "sidebar-collapsed") {
    const ActiveIcon = OPTIONS.find((o) => o.id === theme)?.icon || Monitor;
    return (
      <button
        type="button"
        onClick={cycleTheme}
        className={`w-11 h-11 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors ${className}`}
        aria-label={`Theme: ${theme}. Click to cycle.`}
        title={`Theme: ${theme}`}
      >
        <ActiveIcon className="w-5 h-5" />
      </button>
    );
  }

  const current = OPTIONS.find((o) => o.id === theme) || OPTIONS[2];
  const CurrentIcon = current.icon;
  const opensUp = placement === "top";
  const popoverOffset = opensUp ? 6 : -6;

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Theme: ${current.label}. Choose appearance.`}
      >
        <CurrentIcon className="w-[18px] h-[18px] shrink-0 text-health-600 dark:text-health-400" />
        <span className="flex-1 min-w-0 text-left">
          <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Appearance
          </span>
          <span className="block text-xs text-slate-500 dark:text-slate-400 capitalize truncate">
            {current.label}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? (opensUp ? "" : "rotate-180") : opensUp ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: popoverOffset, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: popoverOffset, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            aria-label="Theme options"
            className={`absolute z-[100] w-full min-w-[14rem] rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-glass-lg py-1.5 ${
              opensUp ? "bottom-full mb-1.5" : "top-full mt-1.5"
            } ${align === "right" ? "right-0" : "left-0"}`}
          >
            {OPTIONS.map((option) => {
              const Icon = option.icon;
              const selected = theme === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setTheme(option.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? "bg-health-50 dark:bg-health-950/40"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      selected
                        ? "text-health-600 dark:text-health-400"
                        : "text-slate-400"
                    }`}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">
                      {option.label}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">
                      {option.description}
                    </span>
                  </span>
                  {selected && (
                    <Check className="w-4 h-4 text-health-600 dark:text-health-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
