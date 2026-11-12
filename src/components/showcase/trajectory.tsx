"use client";

import { motion } from "framer-motion";

const WAYPOINTS = [
  { t: 0.02, year: "2018", title: "STEM track", sub: "Microcity College" },
  { t: 0.24, year: "2020", title: "BS Computer Science", sub: "BPSU" },
  { t: 0.5, year: "2023", title: "Engineering intern", sub: "Kloudtech" },
  { t: 0.68, year: "2024", title: "Software Engineer", sub: "Kloudtech · Cum Laude" },
  { t: 0.88, year: "2025", title: "Software Developer", sub: "Concentrix · RevEarth" },
];

// Cubic bezier launch arc
const P = [
  [50, 300],
  [330, 290],
  [640, 220],
  [950, 60],
] as const;

function at(t: number) {
  const u = 1 - t;
  const b = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [0, 1].map((k) => +b.reduce((sum, w, i) => sum + w * P[i][k], 0).toFixed(1));
}

const PATH = `M${P[0][0]} ${P[0][1]} C${P[1][0]} ${P[1][1]}, ${P[2][0]} ${P[2][1]}, ${P[3][0]} ${P[3][1]}`;
const DRAW = 2.4;

/** The career as a launch arc that draws itself when scrolled into view. */
export function Trajectory() {
  const [ex, ey] = at(1);

  return (
    <div className="trajectory-scroll -mx-6 px-6 overflow-x-auto">
      <svg
        viewBox="0 0 1000 420"
        className="min-w-[760px] w-full"
        role="img"
        aria-label="Career trajectory from 2018 to today"
      >
        {/* altitude grid */}
        <g stroke="var(--text-tertiary)" strokeOpacity="0.3" strokeDasharray="2 8">
          {[60, 140, 220, 300].map((y) => (
            <line key={y} x1="30" x2="980" y1={y} y2={y} />
          ))}
        </g>
        <line x1="30" x2="980" y1="372" y2="372" stroke="var(--text-primary)" strokeWidth="1.5" />

        <path
          d={PATH}
          fill="none"
          stroke="var(--text-tertiary)"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeDasharray="3 7"
        />
        <motion.path
          d={PATH}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: DRAW, ease: "easeInOut" }}
        />

        {WAYPOINTS.map((w, i) => {
          const [x, y] = at(w.t);
          const first = i === 0;
          const lx = first ? x : x - 14;
          const ly = first ? y + 34 : y - 36;
          const anchor = first ? "start" : "end";
          return (
            <motion.g
              key={w.year}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: 0.2 + w.t * DRAW }}
            >
              <line x1={x} x2={x} y1={y} y2={372} stroke="var(--text-primary)" strokeOpacity="0.25" />
              <circle cx={x} cy={y} r="9" fill="var(--bg-primary)" stroke="var(--text-primary)" strokeWidth="2.5" />
              <circle cx={x} cy={y} r="3.5" fill="var(--accent)" />
              <text x={x} y={394} textAnchor="middle" className="traj-year">
                {w.year}
              </text>
              <text x={lx} y={ly} textAnchor={anchor} className="traj-title">
                {w.title}
              </text>
              <text x={lx} y={ly + 18} textAnchor={anchor} className="traj-sub">
                {w.sub}
              </text>
            </motion.g>
          );
        })}

        {/* craft at the tip */}
        <motion.g
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: DRAW }}
          style={{ transformOrigin: `${ex}px ${ey}px`, transformBox: "view-box" }}
        >
          <circle cx={ex} cy={ey} r="20" fill="var(--accent)" fillOpacity="0.18" className="blip-soft" />
          <g transform={`translate(${ex} ${ey}) rotate(-27)`}>
            <path d="M-16 -8 L14 0 L-16 8 L-9 0 Z" fill="var(--text-primary)" />
          </g>
          <text x={ex - 12} y={ey - 26} textAnchor="end" className="traj-title" fill="var(--accent)">
            Now
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
