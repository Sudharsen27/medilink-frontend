

import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react"; // modern lightweight icons

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <button
  onClick={() => setDarkMode(!darkMode)}
  className={`p-2 rounded-full transition-all duration-300 shadow-md 
    ${darkMode
      ? "bg-white text-gray-800 hover:bg-gray-100"
      : "bg-green-600 text-white hover:bg-green-500"}
  `}
  title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
>
  {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-yellow-300" />}
</button>
  );
}

export default DarkModeToggle;
