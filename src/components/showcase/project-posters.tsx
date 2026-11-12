"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { homeProjects } from "@/lib/career-data";
import { Flower, Stars, type FlowerKind } from "./garden";

const SKY = "#1b2440";
const CREAM = "#f4eedd";

const COVERS: { ground: string; body: "sun" | "ring" | "moon"; kinds: FlowerKind[]; colors: string[] }[] = [
  { ground: "#3d7f56", body: "sun", kinds: ["daisy", "sunflower", "daisy"], colors: ["#f4a3b5", "", CREAM] },
  { ground: "#b9683f", body: "ring", kinds: ["tulip", "tulip", "sprout"], colors: ["#ff7a45", "#f4a3b5", ""] },
  {
    ground: "#3d7f56",
    body: "moon",
    kinds: ["lavender", "daisy", "lavender"],
    colors: ["#b9a4ee", "#ffb37a", "#b9a4ee"],
  },
  { ground: "#b9683f", body: "sun", kinds: ["sprout", "sunflower", "tulip"], colors: ["", "", "#f4a3b5"] },
  { ground: "#3d7f56", body: "ring", kinds: ["daisy", "tulip", "daisy"], colors: [CREAM, "#ff7a45", "#f4a3b5"] },
  { ground: "#b9683f", body: "moon", kinds: ["sunflower", "lavender", "sprout"], colors: ["", "#b9a4ee", ""] },
];

/** Seed-packet cover: three flowers on a small world, different for each project. */
function Cover({ variant }: { variant: number }) {
  const c = COVERS[variant % COVERS.length];
  return (
    <svg viewBox="0 0 400 240" className="w-full h-auto block" aria-hidden="true">
      <rect width="400" height="240" fill={SKY} />
      <Stars count={18} />
      {c.body === "sun" && <circle cx="316" cy="64" r="34" fill="#f5bd4a" />}
      {c.body === "moon" && (
        <>
          <circle cx="84" cy="60" r="26" fill={CREAM} />
          <circle cx="96" cy="54" r="24" fill={SKY} />
        </>
      )}
      {c.body === "ring" && (
        <g transform="translate(318 62) rotate(-20)">
          <circle r="22" fill="#f4a3b5" />
          <ellipse rx="42" ry="9" fill="none" stroke={CREAM} strokeWidth="3" />
        </g>
      )}
      {c.kinds.map((k, i) => (
        <Flower
          key={i}
          x={130 + i * 70}
          y={182 + (i === 1 ? -8 : 0)}
          h={[64, 96, 54][i]}
          kind={k}
          color={c.colors[i]}
          delay={i * 0.15}
          lean={(i - 1) * 6}
          scale={1.25}
        />
      ))}
      <ellipse cx="200" cy="330" rx="300" ry="160" fill={c.ground} stroke="#12182b" strokeWidth="2" />
      <ellipse
        cx="200"
        cy="352"
        rx="290"
        ry="160"
        fill="none"
        stroke="#12182b"
        strokeOpacity="0.18"
        strokeWidth="5"
        strokeDasharray="1 14"
        strokeLinecap="round"
      />
    </svg>
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
