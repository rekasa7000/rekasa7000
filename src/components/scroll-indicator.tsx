"use client";

import { useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";

export function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < window.innerHeight * 0.4);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNextSection = () => {
    document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      className="fixed right-8 bottom-8 z-40 hidden md:flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 transition-colors duration-200"
      style={{ color: "var(--text-tertiary)" }}
      onClick={scrollToNextSection}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
      aria-label="Scroll to experience section"
    >
      <span className="meta-label" style={{ color: "inherit" }}>
        Scroll
      </span>
      <ArrowDown className="w-3.5 h-3.5 animate-bounce" style={{ animationDuration: "2s" }} />
    </button>
  );
}
