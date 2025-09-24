import React, { useState, useEffect } from "react";

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
    >
      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}

export default DarkModeToggle;
