"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function CursorSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Disable on touch/coarse pointer devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = spotlightRef.current;
    if (!el) return;

    let rafId: number;
    let x = -1000;
    let y = -1000;

    const onMouseMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const update = () => {
      if (el) {
        const isDark = document.documentElement.classList.contains("dark");
        const color = isDark
          ? "rgba(74,144,226,0.13)"
          : "rgba(74,144,226,0.07)";
        el.style.background = `radial-gradient(600px at ${x}px ${y}px, ${color}, transparent 80%)`;
      }
      rafId = requestAnimationFrame(update);
    };

    document.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(update);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [theme]);

  return (
    <div
      ref={spotlightRef}
      className="fixed inset-0 pointer-events-none z-0 transition-none"
    />
  );
}
