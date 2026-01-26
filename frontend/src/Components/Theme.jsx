import React, { useState, useEffect } from "react";
import { Palette, Check } from "lucide-react";

const Theme = () => {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme") || "light",
  );

  const THEMES = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];

  const handleThemeChange = (themeValue) => {
    document.documentElement.setAttribute("data-theme", themeValue);
    localStorage.setItem("theme", themeValue);
    setCurrentTheme(themeValue);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  return (
    <div className="dropdown dropdown-end">
      {/* Tetikleyici Buton */}
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle hover:bg-base-200"
      >
        <Palette size={22} className="stroke-2" />
      </div>

      {/* Dropdown */}
      <ul
        tabIndex={0}
        className="dropdown-content z-[100] mt-4 p-2 shadow-2xl bg-base-300 rounded-xl w-60 max-h-96 overflow-y-auto border border-base-content/10 scrollbar-thin"
      >
        <li className="px-4 py-2 text-xs font-black uppercase tracking-widest opacity-50">
          Select Theme
        </li>

        {THEMES.map((theme) => (
          <li key={theme} className="mt-1">
            <button
              onClick={() => handleThemeChange(theme)}
              className={`
                w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors
                ${currentTheme === theme ? "bg-primary/20 text-primary font-bold" : "hover:bg-base-content/10 text-base-content"}
              `}
              data-theme={theme}
            >
              <div className="flex items-center gap-3">
                <Palette
                  size={14}
                  className={
                    currentTheme === theme ? "opacity-100" : "opacity-40"
                  }
                />
                <span className="text-[13px] capitalize">{theme}</span>
              </div>

              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-2 h-2 rounded-full bg-secondary" />
                <div className="w-2 h-2 rounded-full bg-accent" />
                <div className="w-2 h-2 rounded-full bg-neutral" />
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Theme;
