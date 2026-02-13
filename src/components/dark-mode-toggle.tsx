"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="jp-toggle"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <div className="toggle-slider">
          {isDark ? (
            <Moon className="w-3.5 h-3.5" />
          ) : (
            <Sun className="w-3.5 h-3.5" />
          )}
        </div>
      </button>
    </div>
  );
}
