"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { caseStudyForJob } from "@/lib/case-studies";
import { SIMPLE_TIMELINE, WORK_ENTRIES } from "@/lib/career-data";
import { CarbonArt, MusicArt, OneixArt, RainArt, SproutArt, WaterArt } from "./scene-art";

type MissionMeta = {
  codename: string;
  headline: string;
  metrics: { value: string; label: string }[];
  Screen: () => React.ReactNode;
};

const META: Record<string, MissionMeta> = {
  concentrix: {
    codename: "One workspace",
    headline: "Leading the team, and building ONEix: an AI agent answers first, a human picks up with the full story.",
    metrics: [
      { value: "8", label: "Engineers led" },
      { value: "5", label: "Industries in the ONEix demo" },
      { value: "10+", label: "Zendesk apps shipped" },
    ],
    Screen: OneixArt,
  },
  "kloudtech-swe": {
    codename: "Rain field",
    headline: SIMPLE_TIMELINE
      ? "Owner of a real-time weather network for disaster-response offices."
      : "Co-founder and owner of a real-time weather network for disaster-response offices.",
    metrics: [
      { value: "25+", label: "Weather stations" },
      { value: "99.9%", label: "Uptime" },
      { value: "<100ms", label: "Telemetry latency" },
    ],
    Screen: RainArt,
  },
  "up-ice": {
    codename: "Watershed",
    headline: "Turning a research team's water-footprint method into a map-based decision tool.",
    metrics: [
      { value: "41", label: "Subbasins" },
      { value: "25", label: "Barangays" },
      { value: "±2%", label: "Accuracy vs. the method" },
    ],
    Screen: WaterArt,
  },
  akosi: {
    codename: "Music card",
    headline: "Physical NFC cards that unlock an artist's music for the person who owns the card.",
    metrics: [
      { value: "2", label: "Card types" },
      { value: "0", label: "Native apps needed" },
      SIMPLE_TIMELINE ? { value: "NFC", label: "NTAG 424 DNA chips" } : { value: "Jun '27", label: "Planned launch" },
    ],
    Screen: MusicArt,
  },
  revearth: {
    codename: "Carbon tree",
    headline: "A carbon-footprint tracker for Philippine organizations, backed by real emission science.",
    metrics: [
      { value: "21", label: "API endpoints" },
      { value: "13", label: "Data models" },
      { value: "3", label: "Emission scopes" },
    ],
    Screen: CarbonArt,
  },
  "kloudtech-intern": {
    codename: "First sprout",
    headline: "Where it took root: IoT hardware, security practice, and a production web app.",
    metrics: [
      { value: "9 mo", label: "On the team" },
      { value: "IoT", label: "Embedded systems" },
      { value: "SEC", label: "Applied cybersecurity" },
    ],
    Screen: SproutArt,
  },
};

// the order of the résumé: current roles first, then engagements, then where it began
const ORDER = ["concentrix", "kloudtech-swe", "up-ice", "akosi", "revearth", "kloudtech-intern"];
const missions = ORDER.flatMap((id) => WORK_ENTRIES.filter((e) => e.id === id));

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
        const study = caseStudyForJob(m.id);
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
                {m.name}
                {m.period ? ` · ${m.period}` : ""}
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

              {study && (
                <Link href={`/works/${study.slug}`} className="btn-ghost self-start mb-4">
                  Read the case study <ArrowUpRight className="w-4 h-4" />
                </Link>
              )}

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
