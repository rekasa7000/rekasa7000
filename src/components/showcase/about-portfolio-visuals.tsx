"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  Accessibility,
  Check,
  Code,
  FlaskConical,
  Gauge,
  Moon,
  Palette,
  Presentation,
  Smartphone,
  Sun,
  Terminal,
} from "lucide-react";

const rise = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

/* ── The stack as exploded layers ── */

const LAYERS = [
  {
    name: "Experience",
    role: "What you see and touch",
    items: ["React 19", "Tailwind CSS 4", "Framer Motion", "Three.js", "Lucide", "Skillicons"],
    color: "var(--accent)",
  },
  {
    name: "Framework",
    role: "Rendering and routing",
    items: ["Next.js 16", "TypeScript", "next/font"],
    color: "var(--accent-3)",
  },
  {
    name: "Live data",
    role: "Shared cursors and visitor count",
    items: ["Supabase Realtime", "Upstash Redis"],
    color: "var(--accent-2)",
  },
  {
    name: "Ground crew",
    role: "Build, check, ship",
    items: ["Bun", "ESLint", "Git", "Vercel"],
    color: "var(--text-primary)",
  },
];

export function StackLayers() {
  const [active, setActive] = useState(0);
  const layer = LAYERS[active];

  return (
    <div className="grid lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-6">
        <div className="stack" role="group" aria-label="Technology stack layers">
          {LAYERS.map((l, i) => (
            <motion.button
              key={l.name}
              className="stack-slab"
              data-on={active === i}
              style={{ zIndex: LAYERS.length - i, ["--slab" as string]: l.color }}
              initial={{ opacity: 0, y: -60 - i * 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: (LAYERS.length - 1 - i) * 0.15, ease: "easeOut" }}
              onClick={() => setActive(i)}
              aria-pressed={active === i}
            >
              <span className="stack-face">
                <span className="meta-label" style={{ color: "inherit" }}>
                  L{LAYERS.length - i} · {l.name}
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-6">
        <motion.div
          key={layer.name}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="meta-label mb-3" style={{ color: "var(--accent)" }}>
            Layer {LAYERS.length - active} of {LAYERS.length}
          </div>
          <h3 className="font-display text-3xl md:text-4xl mb-3">{layer.name}</h3>
          <p className="text-base mb-6" style={{ color: "var(--text-secondary)" }}>
            {layer.role}
          </p>
          <div className="flex flex-wrap gap-2">
            {layer.items.map((t) => (
              <span key={t} className="chip" style={{ cursor: "default" }}>
                {t}
              </span>
            ))}
          </div>
        </motion.div>
        <p className="meta-label mt-8" style={{ color: "var(--accent)" }}>
          Tap a layer to inspect it
        </p>
      </div>
    </div>
  );
}

/* ── Icon tiles (purpose, approach) ── */

type Tile = { icon: typeof Gauge; title: string; text: string };

export const PURPOSE_TILES: Tile[] = [
  { icon: Presentation, title: "Showcase", text: "Skills, experience and projects in one place." },
  { icon: Terminal, title: "Demonstration", text: "Modern web tech in a real, shipped product." },
  { icon: FlaskConical, title: "Laboratory", text: "A safe place to try new ideas." },
  { icon: Palette, title: "Expression", text: "Purposeful, user-first design made visible." },
];

export const APPROACH_TILES: Tile[] = [
  { icon: Gauge, title: "Performance", text: "Pages are pre-rendered; images load lazily." },
  { icon: Accessibility, title: "Accessibility", text: "Semantic HTML, keyboard support, motion off on request." },
  { icon: Smartphone, title: "Responsive", text: "Designed phone-first, scaled up." },
  { icon: Code, title: "Developer experience", text: "TypeScript for safety, ESLint for consistency." },
];

export function IconTiles({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {tiles.map((t, i) => (
        <motion.div key={t.title} {...rise} transition={{ duration: 0.4, delay: i * 0.08 }} className="stage-card p-6">
          <span className="stage-icon mb-7">
            <t.icon className="w-5 h-5" aria-hidden="true" />
          </span>
          <h3 className="font-display text-lg mb-2.5" style={{ lineHeight: 1.15 }}>
            {t.title}
          </h3>
          <p className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
            {t.text}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Live design specimen: palette, type, and a working theme switch ── */

const SWATCHES = [
  { name: "Paper", v: "--bg-primary" },
  { name: "Ink", v: "--text-primary" },
  { name: "Signal", v: "--accent" },
  { name: "Cobalt", v: "--accent-2" },
  { name: "Sun", v: "--accent-3" },
];

const TYPE = [
  { name: "Unbounded", use: "Display", stack: "var(--stack-display)", weight: 600 },
  { name: "Space Grotesk", use: "Reading", stack: "var(--stack-sans)", weight: 500 },
  { name: "Space Mono", use: "Labels", stack: "var(--stack-mono)", weight: 400 },
];

const DESIGN_RULES = ["Signal over noise", "Instruments, not decoration", "Warm machines", "Optimism by design"];

export function DesignSpecimen() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hex, setHex] = useState<Record<string, string>>({});

  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      setHex(Object.fromEntries(SWATCHES.map((s) => [s.v, cs.getPropertyValue(s.v).trim()])));
      setMounted(true);
    };
    const id = window.requestAnimationFrame(read);
    return () => window.cancelAnimationFrame(id);
  }, [resolvedTheme]);

  const dark = mounted && resolvedTheme === "dark";

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <motion.div {...rise} transition={{ duration: 0.45 }} className="lg:col-span-7 stage-card p-6 md:p-8">
        <div className="meta-label mb-5">Palette · {dark ? "Phosphor terminal" : "Space-age print"}</div>
        <div className="grid grid-cols-5 gap-2 sm:gap-3 mb-9">
          {SWATCHES.map((s) => (
            <div key={s.v}>
              <div className="swatch" style={{ background: `var(${s.v})` }} />
              <div className="font-medium text-xs sm:text-sm mt-2.5">{s.name}</div>
              <div className="meta-label hidden sm:block" style={{ letterSpacing: "0.04em" }}>
                {hex[s.v] ?? " "}
              </div>
            </div>
          ))}
        </div>

        <div className="meta-label mb-4">Type</div>
        <div className="space-y-4">
          {TYPE.map((t) => (
            <div key={t.name} className="flex items-baseline justify-between gap-4 type-row">
              <span
                className="text-3xl sm:text-4xl truncate"
                style={{
                  fontFamily: t.stack,
                  fontWeight: t.weight,
                  letterSpacing: t.name === "Unbounded" ? "-0.035em" : undefined,
                }}
              >
                {t.name}
              </span>
              <span className="meta-label shrink-0">{t.use}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="lg:col-span-5 grid gap-6">
        <motion.div {...rise} transition={{ duration: 0.45, delay: 0.1 }} className="stage-card p-6 md:p-8">
          <div className="meta-label mb-5">Two worlds, one switch</div>
          <button
            className="lever"
            data-dark={dark}
            onClick={() => setTheme(dark ? "light" : "dark")}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="lever-side">
              <Sun className="w-4 h-4" aria-hidden="true" /> Print
            </span>
            <span className="lever-side">
              <Moon className="w-4 h-4" aria-hidden="true" /> Terminal
            </span>
            <span className="lever-thumb" aria-hidden="true" />
          </button>
          <p className="text-sm mt-5" style={{ color: "var(--text-secondary)" }}>
            Flip it. The whole site changes era.
          </p>
        </motion.div>

        <motion.div {...rise} transition={{ duration: 0.45, delay: 0.2 }} className="stage-card p-6 md:p-8">
          <div className="meta-label mb-5">House rules</div>
          <ol className="space-y-3">
            {DESIGN_RULES.map((r, i) => (
              <li key={r} className="flex items-baseline gap-3">
                <span className="meta-label" style={{ color: "var(--accent)" }}>
                  0{i + 1}
                </span>
                <span className="font-display text-base">{r}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Roadmap ── */

const ROADMAP = [
  { title: "Dark mode", note: "The phosphor terminal", done: true },
  { title: "Interactive homepage", note: "Missions, orbit, flight path", done: true },
  { title: "Blog", note: "Articles, tutorials, notes", done: false },
  { title: "Project case studies", note: "Embedded demos and deep dives", done: false },
  { title: "Performance tuning", note: "Load time and bundle size", done: false },
];

export function Roadmap() {
  return (
    <ol className="roadmap">
      {ROADMAP.map((r, i) => (
        <motion.li
          key={r.title}
          {...rise}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="roadmap-item"
          data-done={r.done}
        >
          <span className="roadmap-dot" aria-hidden="true">
            {r.done && <Check className="w-3.5 h-3.5" />}
          </span>
          <div className="min-w-0">
            <div className="font-display text-lg md:text-xl mb-1">{r.title}</div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {r.note}
            </div>
          </div>
          <span className="meta-label ml-auto shrink-0" style={{ color: r.done ? "var(--signal)" : undefined }}>
            {r.done ? "Landed" : "Planned"}
          </span>
        </motion.li>
      ))}
    </ol>
  );
}
