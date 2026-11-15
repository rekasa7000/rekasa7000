"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export const AUTO_KEY = "theme-auto";

/**
 * Until a visitor picks a theme themselves, the site follows the real time of day in
 * Manila: daylight from 06:00 to 18:00, the night garden otherwise.
 */
export function ManilaDaylight() {
  const { setTheme } = useTheme();

  useEffect(() => {
    try {
      const auto = localStorage.getItem(AUTO_KEY);
      const stored = localStorage.getItem("theme");
      if (auto === "off") return;
      // a theme saved before this feature existed counts as the visitor's own choice
      if (auto === null && stored && stored !== "system") {
        localStorage.setItem(AUTO_KEY, "off");
        return;
      }
      const hour = Number(
        new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Manila", hour: "2-digit", hour12: false }).format(
          new Date(),
        ),
      );
      localStorage.setItem(AUTO_KEY, "on");
      setTheme(hour >= 6 && hour < 18 ? "light" : "dark");
    } catch {
      // storage unavailable: leave the theme alone
    }
  }, [setTheme]);

  return null;
}
