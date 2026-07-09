"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

interface HeaderProps {
  activePage: "home" | "about-me" | "about-portfolio";
}

const SECTION_LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#works", label: "Works" },
  { href: "#contact", label: "Contact" },
];

export function Header({ activePage }: HeaderProps) {
  const openGalaxy = () => window.dispatchEvent(new CustomEvent("galaxy-mode"));

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "color-mix(in srgb, var(--bg-primary) 85%, transparent)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Wordmark + seal */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <span className="hanko transition-transform duration-300 group-hover:-rotate-6" aria-hidden="true">
            レ
          </span>
          <span className="font-display text-lg hidden sm:block">Regee Casaña</span>
        </Link>

        {/* Section anchors — home only, large screens */}
        {activePage === "home" && (
          <nav className="hidden lg:flex items-center gap-7" aria-label="Sections">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="link-underline text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Page links + actions */}
        <div className="flex items-center gap-5">
          <nav className="flex items-center gap-5 text-sm" aria-label="Pages">
            <Link
              href="/about-me"
              className="link-underline"
              style={{
                color: activePage === "about-me" ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: activePage === "about-me" ? 500 : 400,
              }}
            >
              About Me
            </Link>
            <Link
              href="/about-portfolio"
              className="link-underline hidden md:block"
              style={{
                color: activePage === "about-portfolio" ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: activePage === "about-portfolio" ? 500 : 400,
              }}
            >
              About Portfolio
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={openGalaxy}
              className="icon-btn"
              title="Explore my career as a galaxy"
              aria-label="Open galaxy view"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
