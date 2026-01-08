import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-blue-600 dark:text-blue-400"
        : "text-zinc-700 dark:text-zinc-200 hover:text-blue-600"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">

        {/* Logo */}
        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
          LLM-APM
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={navClass}>
            Chat
          </NavLink>

          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-blue-600"
          >
            Grafana
          </a>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="text-lg"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-zinc-700 dark:text-zinc-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col items-center gap-4 py-4">
            <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>
              Chat
            </NavLink>

            <NavLink to="/dashboard" className={navClass} onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>

            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
            >
              Grafana
            </a>

            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="text-lg"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
