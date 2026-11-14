"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { WORK_ENTRIES } from "@/lib/career-data";
import { Carbon3D, Languages3D, Rain3D, Sprout3D } from "@/components/three/garden-3d";

type MissionMeta = {
  codename: string;
  headline: string;
  metrics: { value: string; label: string }[];
  Screen: () => React.ReactNode;
};

const META: Record<string, MissionMeta> = {
  concentrix: {
    codename: "Language garden",
    headline: "Wiring live translation into the help desk for an international team.",
    metrics: [
      { value: "100+", label: "Support agents" },
      { value: "20+", label: "Languages" },
      { value: "10K+", label: "Tickets migrated" },
    ],
    Screen: Languages3D,
  },
  revearth: {
    codename: "Carbon tree",
    headline: "A carbon-footprint tracker for Philippine organizations, backed by real emission science.",
    metrics: [
      { value: "21", label: "API endpoints" },
      { value: "13", label: "Data models" },
      { value: "3", label: "Emission scopes" },
    ],
    Screen: Carbon3D,
  },
  "kloudtech-swe": {
    codename: "Rain field",
    headline: "Leading the team behind a real-time weather network for disaster-response offices.",
    metrics: [
      { value: "25+", label: "Weather stations" },
      { value: "<100ms", label: "Telemetry latency" },
      { value: "8+ mo", label: "Continuous uptime" },
    ],
    Screen: Rain3D,
  },
  "kloudtech-intern": {
    codename: "First sprout",
    headline: "Where it took root: IoT hardware, security practice, and a production web app.",
    metrics: [
      { value: "9 mo", label: "On the team" },
      { value: "IoT", label: "Embedded systems" },
      { value: "SEC", label: "Applied cybersecurity" },
    ],
    Screen: Sprout3D,
  },
};

const missions = [...WORK_ENTRIES].reverse();

/** Experience as garden plots: three numbers and a growing scene each; full text is one tap away. */
export function Missions() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-10 md:space-y-14">
      {missions.map((m, i) => {
        const meta = META[m.id];
        if (!meta) return null;
        const isOpen = open === m.id;
        const live = m.period?.includes("Present");
        const Screen = meta.Screen;
        return (
          <motion.article
            key={m.id}
            className="mission grid md:grid-cols-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className={`p-6 md:p-9 flex flex-col ${i % 2 ? "md:order-2" : ""}`}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
                <span className="session-tag">Plot {String(missions.length - i).padStart(2, "0")}</span>
                <span className="meta-label">{meta.codename}</span>
                {live && (
                  <span className="meta-label signal-text ml-auto">
                    <span className="blink" aria-hidden="true">
                      ●
                    </span>{" "}
                    Growing
                  </span>
                )}
              </div>

              <h3 className="font-display text-2xl md:text-3xl mb-2" style={{ lineHeight: 1.1 }}>
                {m.title}
              </h3>
              <div className="meta-label mb-5" style={{ color: "var(--accent)" }}>
                {m.name} · {m.period}
              </div>
              <p className="text-base leading-snug mb-7" style={{ color: "var(--text-secondary)" }}>
                {meta.headline}
              </p>

              <dl className="grid grid-cols-3 gap-3 mb-7">
                {meta.metrics.map((x) => (
                  <div key={x.label}>
                    <dd className="font-display text-xl sm:text-2xl md:text-[1.7rem] mb-1.5">{x.value}</dd>
                    <dt className="meta-label" style={{ letterSpacing: "0.04em", fontSize: "0.625rem" }}>
                      {x.label}
                    </dt>
                  </div>
                ))}
              </dl>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {m.technologies.map((t) => (
                  <span key={t} className="chip" style={{ cursor: "default" }}>
                    {t}
                  </span>
                ))}
              </div>

              <button
                className="mt-auto self-start flex items-center gap-2 meta-label cursor-pointer py-2"
                style={{ color: "var(--text-primary)" }}
                onClick={() => setOpen(isOpen ? null : m.id)}
                aria-expanded={isOpen}
              >
                {isOpen ? "Close" : "Read"} the full story
                <ChevronDown
                  className="w-3.5 h-3.5 transition-transform duration-300"
                  style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className={`p-3 md:p-4 ${i % 2 ? "md:order-1" : ""}`}>
              <Screen />
            </div>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="md:col-span-2 md:order-3 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <ul
                    className="px-6 md:px-9 py-7 space-y-3 border-t border-dashed"
                    style={{ borderColor: "var(--border-strong)" }}
                  >
                    {m.homeBullets.map((b) => (
                      <li
                        key={b}
                        className="text-sm leading-relaxed flex gap-3"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span
                          className="font-mono text-xs mt-0.5 shrink-0"
                          style={{ color: "var(--accent)" }}
                          aria-hidden="true"
                        >
                          ›
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        );
      })}
    </div>
  );
}
