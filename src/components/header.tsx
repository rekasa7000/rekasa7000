"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { motion, useScroll } from "framer-motion";
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
  const { scrollYProgress } = useScroll();
  const openGalaxy = () => window.dispatchEvent(new CustomEvent("galaxy-mode"));

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "color-mix(in srgb, var(--bg-primary) 88%, transparent)",
        borderBottomWidth: "1.5px",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-[68px] flex items-center justify-between gap-4">
        {/* Wordmark + seal */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <Image
            src="/logo.png"
            alt="re7000 logo"
            width={36}
            height={36}
            priority
            className="brand-logo transition-transform duration-300 group-hover:-rotate-6"
          />
          <span className="hidden sm:flex flex-col leading-none gap-1">
            <span className="font-display text-[15px]">Regee Casaña</span>
            <span className="meta-label" style={{ fontSize: "0.5625rem" }}>
              <span className="blink signal-text" aria-hidden="true">
                ●
              </span>{" "}
              Transmitting from PH
            </span>
          </span>
        </Link>

        {/* Section anchors — home only, large screens */}
        {activePage === "home" && (
          <nav className="hidden lg:flex items-center gap-7" aria-label="Sections">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="link-underline meta-label"
                style={{ color: "var(--text-secondary)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Page links + actions */}
        <div className="flex items-center gap-5">
          <nav className="flex items-center gap-5 meta-label" aria-label="Pages">
            <Link
              href="/about-me"
              className="link-underline"
              style={{
                color: activePage === "about-me" ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: activePage === "about-me" ? 700 : 400,
              }}
            >
              About Me
            </Link>
            <Link
              href="/about-portfolio"
              className="link-underline hidden md:block"
              style={{
                color: activePage === "about-portfolio" ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: activePage === "about-portfolio" ? 700 : 400,
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
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    </header>
  );
}
