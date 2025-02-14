// components/ThemeSwitcher.tsx
"use client";

import { motion } from "framer-motion";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useCustomTheme } from "@/app/hooks/useCustomTheme";

export default function ThemeSwitcher() {
  const { currentTheme, toggleTheme } = useCustomTheme();

  return (
    <div className="flex items-center space-x-2 rounded-full bg-opacity-20 p-1 backdrop-blur-sm">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`rounded-full p-2 ${
          currentTheme === "light"
            ? "bg-light-primary text-white"
            : "text-gray-400 hover:text-gray-200"
        }`}
        onClick={() => toggleTheme("light")}
        aria-label="Light mode"
      >
        <SunIcon className="h-5 w-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`rounded-full p-2 ${
          currentTheme === "dark"
            ? "bg-dark-primary text-white"
            : "text-gray-400 hover:text-gray-200"
        }`}
        onClick={() => toggleTheme("dark")}
        aria-label="Dark mode"
      >
        <MoonIcon className="h-5 w-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`rounded-full p-2 ${
          currentTheme === "matcha"
            ? "bg-matcha-primary text-white"
            : "text-gray-400 hover:text-gray-200"
        }`}
        onClick={() => toggleTheme("matcha")}
        aria-label="Matcha mode"
      >
        <CupIcon className="h-5 w-5" />
      </motion.button>
    </div>
  );
}

// components/Icons.tsx
export function CupIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M18 6h-7.25M18 6a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h1.5M18 6l-2-3h-4l-2 3M9 12v4m3-4v4m3-4v4"
      />
    </svg>
  );
}
