"use client";

import { useState, useEffect } from "react";

export function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(scrollPosition < windowHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNextSection = () => {
    const experienceSection = document.getElementById("experience");
    if (experienceSection) {
      experienceSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed right-8 bottom-8 z-40 cursor-pointer"
      onClick={scrollToNextSection}
    >
      <div className="flex items-center space-x-3 text-gray-500 hover:text-black transition-colors">
        <span className="text-sm font-mono">scroll</span>
        <svg
          className="w-5 h-8 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M12 5v14m7-7l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
