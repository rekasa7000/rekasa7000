"use client";

import { motion } from "framer-motion";

/* Shared botanical drawing kit: flowers that grow when scrolled into view, and the little planets they grow on. */

export type FlowerKind = "daisy" | "sunflower" | "tulip" | "lavender" | "sprout";

const VIEW = { once: true, margin: "-40px" } as const;
const n = (v: number) => +v.toFixed(2);

function Head({ kind, color }: { kind: FlowerKind; color: string }) {
  if (kind === "daisy" || kind === "sunflower") {
    const count = kind === "daisy" ? 8 : 14;
    const r = kind === "daisy" ? 11 : 14;
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy={n(-r * 0.92)}
            rx={n(r * (kind === "daisy" ? 0.4 : 0.26))}
            ry={n(r * 0.62)}
            fill={kind === "daisy" ? color : "var(--accent-3)"}
            transform={`rotate(${n((360 / count) * i)})`}
          />
        ))}
        <circle r={n(r * (kind === "daisy" ? 0.42 : 0.58))} fill={kind === "daisy" ? "var(--accent-3)" : "#5a3a22"} />
      </>
    );
  }
  if (kind === "tulip") {
    return (
      <path
        d="M-9 3 C-13 -9 -7 -17 -5 -9 C-3 -16 3 -16 5 -9 C7 -17 13 -9 9 3 C6 10 -6 10 -9 3Z"
        fill={color}
        transform="translate(0 -3)"
      />
    );
  }
  if (kind === "lavender") {
    return (
      <>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={i % 2 ? 3 : -3} cy={n(8 - i * 6.5)} r={n(4.6 - i * 0.5)} fill={color} />
        ))}
      </>
    );
  }
  // sprout: two leaves
  return (
    <>
      <path d="M0 2 C-4 -8 -14 -10 -17 -6 C-13 2 -6 4 0 2Z" fill="var(--leaf)" />
      <path d="M0 2 C4 -10 14 -13 18 -8 C14 1 6 4 0 2Z" fill="var(--leaf-2)" />
    </>
  );
}

/** A flower rooted at (x, y) that grows upward by `h` when it scrolls into view, then sways. */
export function Flower({
  x = 0,
  y = 0,
  h = 60,
  kind = "daisy",
  color = "var(--petal)",
  delay = 0,
  lean = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  h?: number;
  kind?: FlowerKind;
  color?: string;
  delay?: number;
  lean?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${scale})`}>
      <g className="sway" style={{ animationDelay: `${n(-delay * 3)}s` }}>
        <motion.path
          d={`M0 0 Q ${n(lean * 2)} ${n(-h / 2)} ${lean} ${-h}`}
          fill="none"
          stroke="var(--leaf)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={VIEW}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
        />
        {kind !== "sprout" && h > 34 && (
          <g transform={`translate(${n(lean * 0.9)} ${n(-h * 0.42)})`}>
            <motion.path
              d="M0 0 C6 -9 15 -8 18 -3 C13 3 5 3 0 0Z"
              fill="var(--leaf-2)"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={VIEW}
              transition={{ duration: 0.4, delay: delay + 0.4 }}
            />
          </g>
        )}
        <g transform={`translate(${lean} ${-h})`}>
          <motion.g
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={VIEW}
            transition={{ type: "spring", stiffness: 180, damping: 11, delay: delay + 0.65 }}
          >
            <Head kind={kind} color={color} />
          </motion.g>
        </g>
      </g>
    </g>
  );
}

const STARS = (() => {
  let seed = 11;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 26 }, () => ({ x: n(rand() * 400), y: n(rand() * 240), r: n(0.6 + rand() * 1.3) }));
})();

export function Stars({ color = "#f4eedd", count = 26 }: { color?: string; count?: number }) {
  return (
    <g fill={color}>
      {STARS.slice(0, count).map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={i % 3 ? 0.5 : 0.9} />
      ))}
    </g>
  );
}

const HERO_FLOWERS: { a: number; kind: FlowerKind; h: number; color: string }[] = [
  { a: -74, kind: "lavender", h: 40, color: "var(--lilac)" },
  { a: -56, kind: "tulip", h: 52, color: "var(--accent)" },
  { a: -38, kind: "daisy", h: 66, color: "var(--petal)" },
  { a: -21, kind: "sunflower", h: 84, color: "" },
  { a: 22, kind: "daisy", h: 58, color: "#fbf7ea" },
  { a: 38, kind: "tulip", h: 72, color: "var(--petal)" },
  { a: 55, kind: "sprout", h: 30, color: "" },
  { a: 70, kind: "lavender", h: 46, color: "var(--lilac)" },
];

/** Hero: a small homestead planet with a farmhouse, crop rows and flowers taller than the house. */
export function GardenPlanet({ className = "" }: { className?: string }) {
  const cx = 200;
  const cy = 250;
  const r = 112;
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="A small planet with a farmhouse and flowers growing on it"
    >
      <defs>
        <radialGradient id="gp-soil" cx="38%" cy="28%" r="80%">
          <stop offset="0%" stopColor="var(--leaf-2)" />
          <stop offset="62%" stopColor="var(--leaf)" />
          <stop offset="100%" stopColor="var(--leaf-deep)" />
        </radialGradient>
        <clipPath id="gp-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* far sun and ringed neighbour */}
      <circle cx="330" cy="70" r="30" fill="var(--accent-3)" />
      <g transform="translate(62 96) rotate(-20)">
        <circle r="13" fill="var(--petal)" />
        <ellipse rx="25" ry="6" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" />
      </g>

      {/* orbit with a seed satellite */}
      <circle
        cx={cx}
        cy={cy}
        r="176"
        fill="none"
        stroke="var(--text-tertiary)"
        strokeOpacity="0.5"
        strokeDasharray="2 8"
      />
      <g className="orbit-spin" style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: "30s" }}>
        <g transform={`translate(${cx} ${cy - 176})`}>
          <path d="M0 0 C-5 -10 -16 -11 -19 -6 C-14 2 -6 3 0 0Z" fill="var(--leaf)" />
          <path d="M0 0 C5 -10 16 -11 19 -6 C14 2 6 3 0 0Z" fill="var(--leaf-2)" />
          <circle r="6" fill="var(--accent)" stroke="var(--text-primary)" strokeWidth="1.5" />
        </g>
      </g>

      {/* flowers behind the horizon */}
      {HERO_FLOWERS.map((f, i) => (
        <g key={f.a} transform={`rotate(${f.a} ${cx} ${cy}) translate(${cx} ${cy - r + 4})`}>
          <Flower kind={f.kind} h={f.h} color={f.color} delay={0.3 + i * 0.12} lean={i % 2 ? 4 : -4} />
        </g>
      ))}

      {/* farmhouse */}
      <g transform={`translate(${cx} ${cy - r + 3})`}>
        <rect x="-17" y="-22" width="34" height="24" fill="#fbf7ea" stroke="var(--text-primary)" strokeWidth="1.5" />
        <path
          d="M-22 -22 L0 -40 L22 -22Z"
          fill="var(--accent)"
          stroke="var(--text-primary)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <rect x="-4" y="-12" width="8" height="14" fill="var(--text-primary)" />
        <rect x="7" y="-16" width="6" height="6" fill="var(--accent-3)" stroke="var(--text-primary)" strokeWidth="1" />
      </g>

      {/* planet */}
      <circle cx={cx} cy={cy} r={r} fill="url(#gp-soil)" stroke="var(--text-primary)" strokeWidth="2" />
      <g clipPath="url(#gp-clip)" fill="none" stroke="var(--soil)" strokeWidth="5" strokeLinecap="round" opacity="0.55">
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${cx - 96} ${cy - 20 + i * 24} Q ${cx} ${cy + 14 + i * 26} ${cx + 96} ${cy - 20 + i * 24}`}
            strokeDasharray="1 13"
          />
        ))}
      </g>
      <g clipPath="url(#gp-clip)">
        <ellipse cx={cx - 46} cy={cy + 62} rx="34" ry="13" fill="var(--soil)" opacity="0.35" />
        <ellipse cx={cx + 58} cy={cy + 30} rx="22" ry="9" fill="var(--soil)" opacity="0.3" />
      </g>
    </svg>
  );
}

/** Tiny flowering planet used as an emblem (skill orbit core, destination markers). */
export function MiniPlanet({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g transform="translate(50 46)">
        <Flower kind="daisy" h={22} color="var(--petal)" scale={0.9} />
      </g>
      <g transform="rotate(-34 50 66) translate(50 46)">
        <Flower kind="sprout" h={12} scale={0.7} delay={0.1} />
      </g>
      <g transform="rotate(34 50 66) translate(50 46)">
        <Flower kind="tulip" h={15} color="var(--accent)" scale={0.75} delay={0.2} />
      </g>
      <circle cx="50" cy="66" r="21" fill="var(--leaf)" stroke="var(--text-primary)" strokeWidth="1.5" />
      <path
        d="M33 68 Q50 78 67 68"
        fill="none"
        stroke="var(--soil)"
        strokeWidth="3"
        strokeDasharray="1 6"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
