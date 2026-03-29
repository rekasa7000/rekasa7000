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
    <div className="relative">
      {/* Vertical line */}
      <motion.div
        className="absolute left-0 top-0 w-[2px] hidden md:block"
        style={{ backgroundColor: "var(--border-color)", transformOrigin: "top", height: "100%" }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <div className="grid gap-10">
        {entries.map((entry, i) => (
          <motion.div
            key={i}
            className="grid md:grid-cols-12 gap-8 experience-item md:pl-6 relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.08 }}
          >
            {/* Timeline dot */}
            <motion.div
              className="absolute -left-[5px] top-6 w-3 h-3 rounded-full border-2 hidden md:block"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--demon-red)",
              }}
              whileHover={{ scale: 1.4 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />

            <div className="md:col-span-3">
              <div className="text-sm text-gray-500">{entry.period}</div>
            </div>
            <div className="md:col-span-9">
              <h3 className="font-semibold mb-1">{entry.title}</h3>
              <div className="text-gray-600 mb-3">{entry.organization}</div>
              {Array.isArray(entry.description) ? (
                <ul className="space-y-2">
                  {entry.description.map((point, j) => (
                    <li key={j} className="text-sm text-gray-600 flex gap-2">
                      <span className="neon-accent mt-0.75 shrink-0">▸</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">{entry.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
