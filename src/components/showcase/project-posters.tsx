"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { homeProjects } from "@/lib/career-data";
import { Fireflies, Flower, GardenSvg, Grass, Orb, Stars, type FlowerKind } from "./garden";

const CREAM = "#f4eedd";

const COVERS: { ground: string; body: "sun" | "ring" | "moon"; kinds: FlowerKind[]; colors: string[] }[] = [
  { ground: "#3d7f56", body: "sun", kinds: ["daisy", "sunflower", "daisy"], colors: ["#f4a3b5", "", CREAM] },
  { ground: "#b9683f", body: "ring", kinds: ["tulip", "poppy", "tulip"], colors: ["#ff7a45", "#f0603a", "#f4a3b5"] },
  {
    ground: "#3d7f56",
    body: "moon",
    kinds: ["lavender", "daisy", "lavender"],
    colors: ["#b9a4ee", "#ffb37a", "#b9a4ee"],
  },
  { ground: "#b9683f", body: "sun", kinds: ["poppy", "sunflower", "tulip"], colors: ["#f4a3b5", "", "#f4a3b5"] },
  { ground: "#3d7f56", body: "ring", kinds: ["daisy", "tulip", "daisy"], colors: [CREAM, "#ff7a45", "#f4a3b5"] },
  { ground: "#b9683f", body: "moon", kinds: ["sunflower", "lavender", "poppy"], colors: ["", "#b9a4ee", "#ff7a45"] },
];

const cg = (x: number) => +(330 - 160 * Math.sqrt(1 - ((x - 200) / 300) ** 2)).toFixed(1);
const FAR = ["#22422f", "#5a3a2a"];

/** Seed-packet cover: flowers on a small world under its own sky, different for each project. */
function Cover({ variant }: { variant: number }) {
  const c = COVERS[variant % COVERS.length];
  const soil = c.ground !== "#3d7f56";
  return (
    <GardenSvg viewBox="0 0 400 240" className="w-full h-auto block">
      <defs>
        <linearGradient id="pc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f1530" />
          <stop offset="70%" stopColor="#1b2440" />
          <stop offset="100%" stopColor="#3a3a6a" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#pc-sky)" />
      <Stars count={26} h={170} />
      {c.body === "sun" && <Orb x={316} y={62} r={28} />}
      {c.body === "moon" && <Orb x={84} y={60} r={24} kind="moon" />}
      {c.body === "ring" && (
        <g transform="translate(318 62) rotate(-20)">
          <ellipse rx="44" ry="10" fill="none" stroke={CREAM} strokeWidth="2.4" opacity="0.5" />
          <circle r="22" fill="#f4a3b5" />
          <path d="M-22 0 A22 22 0 0 0 22 0 A22 12 0 0 1 -22 0Z" fill="#1d2433" opacity="0.2" />
          <path
            d="M-19 -7 Q0 -2 19 -8 M-21 4 Q0 10 21 3"
            stroke="#fff8ec"
            strokeWidth="1.6"
            fill="none"
            opacity="0.55"
          />
          <path d="M-44 0 A44 10 0 0 0 44 0" fill="none" stroke={CREAM} strokeWidth="2.8" />
        </g>
      )}
      <path
        d={`M-10 240 ${Array.from({ length: 22 }, (_, i) => `L${i * 20 - 10} ${(176 - 18 * Math.sin((i * 20 + variant * 50) / 58) - 8 * Math.sin(i * 0.9)).toFixed(1)}`).join(" ")} L410 240Z`}
        fill={FAR[soil ? 1 : 0]}
      />
      {c.kinds.map((k, i) => (
        <Flower
          key={i}
          x={130 + i * 70}
          y={cg(130 + i * 70) + 3}
          h={[70, 104, 58][i]}
          kind={k}
          color={c.colors[i]}
          delay={i * 0.15}
          lean={(i - 1) * 6}
          scale={1.2}
        />
      ))}
      {[70, 268, 330].map((x, i) => (
        <Flower key={x} x={x} y={cg(x) + 3} h={16 + i * 4} kind="sprout" scale={0.7} delay={0.5 + i * 0.1} />
      ))}
      <ellipse cx="200" cy="330" rx="300" ry="160" fill={c.ground} stroke="#12182b" strokeWidth="2" />
      <path
        d={`M40 ${cg(40) + 4} Q200 ${cg(200) - 5} 360 ${cg(360) + 4}`}
        fill="none"
        stroke={soil ? "#d98a5c" : "#6fae7f"}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <ellipse
        cx="200"
        cy="352"
        rx="290"
        ry="160"
        fill="none"
        stroke={soil ? "#7a4326" : "#2a5c3d"}
        strokeOpacity="0.5"
        strokeWidth="4.5"
        strokeDasharray="1 13"
        strokeLinecap="round"
      />
      <ellipse
        cx="200"
        cy="374"
        rx="280"
        ry="160"
        fill="none"
        stroke={soil ? "#7a4326" : "#2a5c3d"}
        strokeOpacity="0.5"
        strokeWidth="4.5"
        strokeDasharray="1 13"
        strokeLinecap="round"
      />
      <Grass from={44} to={356} step={13} ground={cg} />
      <Fireflies
        points={[
          [96, 120],
          [226, 96],
          [300, 140],
        ]}
      />
    </GardenSvg>
  );
}

/** Selected works as a rack of seed packets. */
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
            <Cover variant={i} />
            <span className="session-tag absolute top-3 left-3">{p.year}</span>
            <span className="poster-arrow" aria-hidden="true">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <div className="p-5">
            <h3 className="font-display text-xl mb-2.5" style={{ lineHeight: 1.15 }}>
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
