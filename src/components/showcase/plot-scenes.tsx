"use client";

import { motion } from "framer-motion";
import { Flower, Stars, type FlowerKind } from "./garden";

/* One illustrated garden scene per job. Each is a picture of the work, drawn as something growing. */

const SKY = "#1b2440";
const CREAM = "#f4eedd";
const VIEW = { once: true, margin: "-60px" } as const;

// Height of the curved horizon at a given x
const ground = (x: number) => +(430 - 200 * Math.sqrt(1 - ((x - 200) / 340) ** 2)).toFixed(1);

function Scene({
  label,
  groundColor,
  children,
  front,
}: {
  label: string;
  groundColor: string;
  children: React.ReactNode;
  front?: React.ReactNode;
}) {
  return (
    <div className="plot-scene">
      <svg
        viewBox="0 -90 400 390"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full block"
        role="img"
        aria-label={label}
      >
        <rect y="-90" width="400" height="390" fill={SKY} />
        <g transform="translate(0 -80)">
          <Stars count={12} />
        </g>
        <Stars />
        {children}
        <ellipse cx="200" cy="430" rx="340" ry="200" fill={groundColor} stroke="#12182b" strokeWidth="2" />
        <g
          fill="none"
          stroke="#12182b"
          strokeOpacity="0.18"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="1 14"
        >
          <ellipse cx="200" cy="452" rx="330" ry="200" />
          <ellipse cx="200" cy="474" rx="320" ry="200" />
        </g>
        {front}
      </svg>
      <span className="plot-caption">{label}</span>
    </div>
  );
}

/* Concentrix — one bed, many languages in bloom */
const LANGS: { code: string; kind: FlowerKind; color: string; h: number }[] = [
  { code: "ES", kind: "tulip", color: "#ff7a45", h: 62 },
  { code: "FR", kind: "daisy", color: "#f4a3b5", h: 84 },
  { code: "DE", kind: "sunflower", color: "", h: 104 },
  { code: "JA", kind: "daisy", color: CREAM, h: 72 },
  { code: "TL", kind: "tulip", color: "#f4a3b5", h: 92 },
  { code: "RO", kind: "lavender", color: "#b9a4ee", h: 66 },
  { code: "PT", kind: "daisy", color: "#ffb37a", h: 80 },
  { code: "IT", kind: "tulip", color: "#ff7a45", h: 56 },
];

export function LanguageGarden() {
  return (
    <Scene
      label="One help desk, 20+ languages in bloom"
      groundColor="#3d7f56"
      front={
        <>
          {LANGS.map((l, i) => {
            const x = 62 + i * 39.5;
            return (
              <g key={l.code} transform={`translate(${x} ${ground(x) + 24})`}>
                <rect x="-12" y="-9" width="24" height="16" rx="4" fill={CREAM} stroke="#12182b" strokeWidth="1.2" />
                <text textAnchor="middle" y="4" className="plot-tag">
                  {l.code}
                </text>
              </g>
            );
          })}
        </>
      }
    >
      <circle cx="306" cy="-24" r="26" fill="#f5bd4a" />
      {LANGS.map((l, i) => {
        const x = 62 + i * 39.5;
        const y = ground(x) + 3;
        return (
          <g key={l.code}>
            <Flower x={x} y={y} h={l.h} kind={l.kind} color={l.color} delay={i * 0.12} lean={i % 2 ? 5 : -5} />
          </g>
        );
      })}
    </Scene>
  );
}

/* RevEarth — a tree that drinks carbon */
export function CarbonTree() {
  const canopy = [
    [200, 96, 46, "#3d7f56"],
    [160, 126, 38, "#4d9668"],
    [242, 124, 40, "#2f6a46"],
    [200, 142, 42, "#86cf9a"],
    [178, 92, 26, "#86cf9a"],
  ] as const;
  return (
    <Scene label="A tree that keeps count of carbon" groundColor="#b9683f">
      {[
        [84, 40, 0],
        [318, 24, 1.4],
        [92, 130, 2.6],
        [314, 120, 0.7],
      ].map(([x, y, d], i) => (
        <g
          key={i}
          className="co2"
          style={{ animationDelay: `${d}s`, ["--tx" as string]: `${200 - x}px`, ["--ty" as string]: `${120 - y}px` }}
        >
          <circle cx={x} cy={y} r="17" fill="none" stroke={CREAM} strokeOpacity="0.7" strokeDasharray="3 4" />
          <text x={x} y={y + 4} textAnchor="middle" className="plot-tag" style={{ fill: CREAM }}>
            CO₂
          </text>
        </g>
      ))}
      <motion.path
        d="M200 236 C196 200 204 180 200 150 M200 190 C186 178 176 170 168 150 M201 176 C214 166 226 158 236 142"
        fill="none"
        stroke="#5a3a22"
        strokeWidth="9"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={VIEW}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      {canopy.map(([x, y, r, c], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={r}
          fill={c}
          stroke="#12182b"
          strokeWidth="1.5"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={VIEW}
          transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.8 + i * 0.12 }}
        />
      ))}
      {[84, 122, 284, 322].map((x, i) => (
        <Flower key={x} x={x} y={ground(x) + 3} h={24 + (i % 2) * 10} kind="sprout" delay={1.2 + i * 0.1} />
      ))}
    </Scene>
  );
}

/* Kloudtech — a weather station watching over 25 sprouts */
export function RainField() {
  const sprouts = Array.from({ length: 25 }, (_, i) => {
    const row = i < 9 ? 0 : i < 17 ? 1 : 2;
    const col = row === 0 ? i : row === 1 ? i - 9 : i - 17;
    const count = row === 0 ? 9 : 8;
    const x = 66 + (col + (row === 1 ? 0.5 : 0)) * (240 / (count - (row === 1 ? 0 : 1)));
    return { x: +x.toFixed(1), y: ground(x) + 4 + row * 17, row };
  });
  return (
    <Scene label="25 stations watching the weather" groundColor="#3d7f56">
      <g className="cloud-drift">
        {[true, false].map((outline) => (
          <g key={String(outline)} fill={CREAM} stroke={outline ? "#12182b" : "none"} strokeWidth="3">
            <ellipse cx="170" cy="74" rx="58" ry="22" />
            <circle cx="140" cy="62" r="24" />
            <circle cx="176" cy="50" r="30" />
            <circle cx="208" cy="64" r="22" />
          </g>
        ))}
        <g stroke="#8fc4ff" strokeWidth="2.5" strokeLinecap="round" className="rain">
          {[126, 146, 166, 186, 206, 222].map((x, i) => (
            <line key={x} x1={x} y1="104" x2={x - 8} y2="200" style={{ animationDelay: `${-i * 0.13}s` }} />
          ))}
        </g>
      </g>
      {/* weather station */}
      <g transform={`translate(322 ${ground(322) + 2})`}>
        <line y2="-84" stroke={CREAM} strokeWidth="3" />
        <line x1="-16" x2="16" y1="-64" y2="-64" stroke={CREAM} strokeWidth="3" />
        <circle cx="-16" cy="-64" r="5" fill="#f5bd4a" stroke="#12182b" />
        <circle cx="16" cy="-64" r="5" fill="#f5bd4a" stroke="#12182b" />
        <circle cy="-88" r="6" fill="#ff7a45" className="blip-soft" />
      </g>
      {sprouts.map((s, i) => (
        <Flower
          key={i}
          x={s.x}
          y={s.y}
          h={15 + s.row * 3}
          kind="sprout"
          scale={0.62 + s.row * 0.1}
          delay={0.2 + (i % 9) * 0.07 + s.row * 0.2}
        />
      ))}
    </Scene>
  );
}

/* Internship — the first sprout */
export function FirstSprout() {
  return (
    <Scene label="Where it started: the first sprout" groundColor="#b9683f">
      <circle cx="200" cy={ground(200) - 26} r="74" fill="#f5bd4a" opacity="0.16" className="blip-soft" />
      <circle cx="200" cy={ground(200) - 26} r="44" fill="#f5bd4a" opacity="0.2" />
      <ellipse cx="200" cy={ground(200) + 6} rx="46" ry="13" fill="#7a4326" stroke="#12182b" strokeWidth="1.5" />
      <Flower x={200} y={ground(200) + 2} h={58} kind="sprout" scale={1.7} delay={0.3} />
      <g transform={`translate(286 ${ground(286) + 4})`}>
        <line y2="-34" stroke={CREAM} strokeWidth="2.5" />
        <rect x="-30" y="-58" width="60" height="26" rx="5" fill={CREAM} stroke="#12182b" strokeWidth="1.5" />
        <text textAnchor="middle" y="-41" className="plot-tag">
          OCT 2023
        </text>
      </g>
      <Flower x={96} y={ground(96) + 4} h={20} kind="sprout" scale={0.7} delay={0.9} />
      <Flower x={130} y={ground(130) + 4} h={14} kind="sprout" scale={0.55} delay={1.1} />
    </Scene>
  );
}
