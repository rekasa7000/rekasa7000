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
          className="flex gap-6 pb-10 group"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.08 }}
        >
          {/* Left: dot + line */}
          <div className="hidden md:flex flex-col items-center shrink-0 w-3">
            <motion.div
              className="w-3 h-3 rounded-full border-2 shrink-0"
              style={{
                borderColor: "var(--demon-red)",
                backgroundColor: "var(--bg-primary)",
                marginTop: "3px",
              }}
              whileHover={{ scale: 1.4 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
            {i < entries.length - 1 && (
              <motion.div
                className="w-0.5 flex-1 mt-2"
                style={{ backgroundColor: "var(--border-color)", transformOrigin: "top" }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 + 0.2 }}
              />
            )}
          </div>

          {/* Content */}
          <div
            className="flex-1 grid md:grid-cols-12 gap-8 pb-4 rounded transition-colors duration-200"
          >
            <div className="md:col-span-3">
              <div className="text-sm text-gray-500">{entry.period}</div>
            </div>
            <div className="md:col-span-9">
              <h3
                className="font-semibold mb-1 transition-colors duration-200 group-hover:text-(--water-blue)"
              >
                {entry.title}
              </h3>
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
          </div>
        </motion.div>
      ))}
    </div>
  );
}
