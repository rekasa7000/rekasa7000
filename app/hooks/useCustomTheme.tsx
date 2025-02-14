// hooks/useCustomTheme.ts
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

type ThemeOption = "light" | "dark" | "matcha" | "system";

export const useCustomTheme = () => {
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>("system");

  useEffect(() => {
    if (theme) {
      setCurrentTheme(theme as ThemeOption);
    }
  }, [theme]);

  const toggleTheme = (newTheme: ThemeOption) => {
    setTheme(newTheme);

    // Add matcha-specific class handling
    if (newTheme === "matcha") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("matcha-theme");
    } else if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("matcha-theme");
    } else {
      document.documentElement.classList.remove("dark", "matcha-theme");
    }
  };

  return { currentTheme, toggleTheme };
};
