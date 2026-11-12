"use client";

import { motion } from "framer-motion";
import { CountUp } from "./count-up";

const STATS = [
  { to: 10000, suffix: "+", label: "Tickets migrated", note: "Zero data loss" },
  { to: 25, suffix: "+", label: "Weather stations", note: "Online for DRRM offices" },
  { to: 100, prefix: "<", suffix: "ms", label: "Telemetry latency", note: "MQTT over TLS" },
  { to: 20, suffix: "+", label: "Languages", note: "Translated live for 100+ agents" },
  { to: 90, suffix: "%+", label: "Cache hit rate", note: "Custom LRU cache" },
  { to: 4, suffix: "", label: "Engineers led", note: "Across 2 platform versions" },
];

/** Headline numbers from the career log, counted up on scroll. */
export function MissionStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 stat-grid">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          className="stat-cell p-5 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
        >
          <div className="font-display text-[2rem] sm:text-5xl md:text-6xl mb-3" style={{ color: "var(--accent)" }}>
            <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
          </div>
          <div className="font-medium text-sm md:text-base leading-snug">{s.label}</div>
          <div className="meta-label mt-1.5" style={{ letterSpacing: "0.06em" }}>
            {s.note}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
