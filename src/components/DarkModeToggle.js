import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

function DarkModeToggle({ darkMode: controlledDarkMode, setDarkMode: setControlledDarkMode }) {
  const [internalDarkMode, setInternalDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const isControlled = controlledDarkMode !== undefined && setControlledDarkMode;
  const darkMode = isControlled ? controlledDarkMode : internalDarkMode;
  const setDarkMode = isControlled ? setControlledDarkMode : setInternalDarkMode;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <button
      type="button"
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-xl transition-all duration-300 bg-white/15 hover:bg-white/25 text-white border border-white/20"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-amber-300" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}

export default DarkModeToggle;
