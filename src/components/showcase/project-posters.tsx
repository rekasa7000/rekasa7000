"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { homeProjects } from "@/lib/career-data";

const INK = "#14132a";
const CREAM = "#f3ecdc";
const PALETTES = [
  ["#ff6b2c", "#f4b63e", "#5c86ff"],
  ["#5c86ff", "#ff6b2c", "#f4b63e"],
  ["#f4b63e", "#5c86ff", "#ff6b2c"],
];

/** Six procedural poster motifs in the site palette, one per project. */
function Cover({ variant, id }: { variant: number; id: string }) {
  const [a, b, c] = PALETTES[variant % PALETTES.length];
  const motif = variant % 6;
  return (
    <svg viewBox="0 0 400 260" className="w-full h-auto block" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <clipPath id={`clip-${id}`}>
          <rect width="400" height="260" />
        </clipPath>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={b} />
          <stop offset="1" stopColor={a} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#clip-${id})`}>
        <rect width="400" height="260" fill={INK} />
        {motif === 0 && (
          <>
            <circle cx="200" cy="150" r="92" fill={`url(#g-${id})`} />
            {[150, 172, 192, 210, 226].map((y, i) => (
              <rect key={y} x="90" y={y} width="220" height={4 + i * 2} fill={INK} />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={i}
                x1={200 + (i - 4) * 16}
                y1="236"
                x2={200 + (i - 4) * 90}
                y2="270"
                stroke={c}
                strokeWidth="1.5"
              />
            ))}
            <line x1="0" x2="400" y1="236" y2="236" stroke={c} strokeWidth="1.5" />
          </>
        )}
        {motif === 1 && (
          <>
            {[150, 122, 94, 66, 38].map((r, i) => (
              <circle key={r} cx="290" cy="130" r={r} fill={[a, INK, b, INK, c][i]} />
            ))}
            <rect x="0" y="126" width="290" height="8" fill={CREAM} />
          </>
        )}
        {motif === 2 && (
          <>
            <circle cx="200" cy="130" r="70" fill={`url(#g-${id})`} />
            <ellipse
              cx="200"
              cy="130"
              rx="150"
              ry="30"
              fill="none"
              stroke={CREAM}
              strokeWidth="5"
              transform="rotate(-18 200 130)"
            />
            <circle cx="72" cy="56" r="7" fill={c} />
            <circle cx="338" cy="212" r="4" fill={CREAM} />
          </>
        )}
        {motif === 3 &&
          Array.from({ length: 9 }).flatMap((_, row) =>
            Array.from({ length: 14 }).map((_, col) => {
              const r = 3 + 7 * Math.abs(Math.sin(col * 0.55 + row * 0.6));
              return (
                <circle
                  key={`${row}-${col}`}
                  cx={22 + col * 27.5}
                  cy={22 + row * 27}
                  r={+r.toFixed(1)}
                  fill={[a, b, c][(row + col) % 3]}
                />
              );
            }),
          )}
        {motif === 4 && (
          <>
            {Array.from({ length: 18 }).map((_, i) => {
              const ang = (i * 10 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1="200"
                  y1="270"
                  x2={+(200 - 420 * Math.cos(ang)).toFixed(1)}
                  y2={+(270 - 420 * Math.sin(ang)).toFixed(1)}
                  stroke={i % 2 ? a : b}
                  strokeWidth="9"
                />
              );
            })}
            <circle cx="200" cy="270" r="86" fill={CREAM} />
            <circle cx="200" cy="270" r="54" fill={c} />
          </>
        )}
        {motif === 5 && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M${-40 + i * 6} ${300 - i * 4} A${250 - i * 38} ${250 - i * 38} 0 0 1 ${440 - i * 6} ${300 - i * 4}`}
                fill="none"
                stroke={[a, b, c, CREAM, a][i]}
                strokeWidth="20"
              />
            ))}
            <circle cx="330" cy="54" r="16" fill={b} />
          </>
        )}
      </g>
    </svg>
  );
}

/** Selected works as a wall of event posters. */
export function ProjectPosters() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
      {homeProjects.map((p, i) => (
        <motion.a
          key={p.title}
          href={p.githubUrl || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="poster group block"
          initial={{ opacity: 0, y: 30, rotate: i % 2 ? 1.5 : -1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: "easeOut" }}
        >
          <div className="relative">
            <Cover variant={i} id={`p${i}`} />
            <span className="session-tag absolute top-3 left-3">{p.year}</span>
            <span className="poster-arrow" aria-hidden="true">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="p-5">
            <h3 className="font-display text-lg mb-2.5" style={{ lineHeight: 1.15 }}>
              {p.title}
            </h3>
            <p className="text-sm leading-snug mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
              {p.description}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {p.technologies.slice(0, 4).map((t) => (
                <span key={t} className="meta-label" style={{ letterSpacing: "0.06em" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
