"use client";

import { motion } from "framer-motion";
import { Flower } from "./garden";

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

/** The career as a vine that grows across the years when scrolled into view. */
export function Trajectory() {
  const [ex, ey] = at(1);
  // soil line under the vine

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
        <line x1="30" x2="980" y1="372" y2="372" stroke="var(--soil)" strokeWidth="4" strokeLinecap="round" />

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
          stroke="var(--leaf)"
          strokeWidth="5"
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
              <path
                d="M0 0 C8 -14 24 -14 28 -6 C20 4 8 5 0 0Z"
                fill="var(--leaf-2)"
                transform={`translate(${x} ${y}) rotate(${i % 2 ? 150 : -20})`}
              />
              <circle cx={x} cy={y} r="8" fill="var(--bg-primary)" stroke="var(--leaf)" strokeWidth="3" />
              <circle cx={x} cy={y} r="3" fill="var(--accent)" />
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

        {/* the bloom at the tip */}
        <g transform={`translate(${ex} ${ey + 2})`}>
          <Flower kind="sunflower" h={2} delay={DRAW - 0.5} scale={1.5} />
        </g>
        <motion.text
          x={ex - 30}
          y={ey - 22}
          textAnchor="end"
          className="traj-title"
          style={{ fill: "var(--accent)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: DRAW }}
        >
          Now
        </motion.text>
      </svg>
    </div>
  );
}
