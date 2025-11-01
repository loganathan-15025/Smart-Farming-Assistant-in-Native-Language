import React from "react";
import { Leaf, Wifi, WifiOff, Menu, X, Sun, Moon } from "lucide-react";
import { languages } from "../../data/languages";
import { useTheme } from "../../hooks/useTheme";

export default function Header({
  isOnline,
  language,
  onLanguageChange,
  showMenu,
  onMenuToggle,
}) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <header className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-colors duration-200">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Corner - Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 p-2 rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:scale-105">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50 tracking-tight leading-tight">
                விவசாய உதவியாளர்
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Smart Farming AI Assistant
              </p>
            </div>
          </div>

          {/* Right Corner - Online, Language, Theme */}
          <div className="flex items-center gap-2">
            {/* Online Status */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                isOnline
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800/50"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 ring-1 ring-rose-200 dark:ring-rose-800/50"
              }`}
            >
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5" />
              ) : (
                <WifiOff className="w-3.5 h-3.5" />
              )}
              <span className="text-xs font-semibold tracking-wide">
                {isOnline ? "ஆன்லைன்" : "ஆஃப்லைன்"}
              </span>
            </div>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-soft hover:shadow-soft-lg transition-all duration-200 cursor-pointer"
            >
              {Object.entries(languages).map(([key, lang]) => (
                <option key={key} value={key}>
                  {lang.name}
                </option>
              ))}
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-soft hover:shadow-soft-lg transition-all duration-200 hover:scale-105 active:scale-95"
              title={isDark ? "Light mode" : "Dark mode"}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-200 transition-all duration-200 shadow-soft hover:shadow-soft-lg"
              aria-label={showMenu ? "Close menu" : "Open menu"}
            >
              {showMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
