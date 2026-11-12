"use client";

import { motion } from "framer-motion";

export interface TimelineEntry {
  period: string;
  title: string;
  organization: string;
  description: string | string[];
}

export function AnimatedTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div>
      {entries.map((entry, i) => (
        <motion.div
          key={i}
          className="flex gap-6 group"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.06 }}
        >
          {/* Left: dot + line */}
          <div className="hidden md:flex flex-col items-center shrink-0 w-3">
            <div
              className="w-2.5 h-2.5 shrink-0 mt-2 rotate-45 border-[1.5px] transition-colors duration-200 group-hover:bg-[var(--accent)]"
              style={{ borderColor: "var(--accent)" }}
            />
            {i < entries.length - 1 && (
              <motion.div
                className="w-px flex-1 mt-3"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, var(--border-strong) 0 3px, transparent 3px 7px)",
                  opacity: 0.5,
                  transformOrigin: "top",
                }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 + 0.2 }}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 grid md:grid-cols-12 gap-3 md:gap-8 pb-14">
            <div className="md:col-span-3 pt-1">
              <div className="meta-label">{entry.period}</div>
            </div>
            <div className="md:col-span-9">
              <h3
                className="font-display text-lg md:text-xl tracking-tight mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {entry.title}
              </h3>
              <div className="meta-label mb-4" style={{ color: "var(--accent)" }}>
                {entry.organization}
              </div>
              {Array.isArray(entry.description) ? (
                <ul className="space-y-2.5">
                  {entry.description.map((point, j) => (
                    <li
                      key={j}
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
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {entry.description}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
