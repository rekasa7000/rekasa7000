"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Botanical drawing kit.
 *
 * Techniques adapted from CSS-art write-ups found on the web (no code copied):
 *  - layered petals that unfold one after another via staggered delays
 *  - stacked soft glows around suns, moons and fireflies
 *  - offset inner shading for a planet's night side, and rimmed craters
 *  - swaying grass and drifting fireflies for depth
 *
 * Everything grows through CSS transitions keyed off `data-grown`, set once when the
 * drawing scrolls into view, so hundreds of petals cost no JavaScript per frame.
 */

export type FlowerKind = "daisy" | "sunflower" | "tulip" | "lavender" | "poppy" | "sprout";

export const n = (v: number) => +v.toFixed(2);
/** CSS delay variable for grow-in elements */
export const d = (s: number) => ({ ["--d" as string]: `${n(s)}s` }) as React.CSSProperties;
const shade = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, #1d2433)`;
const tint = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, #fff8ec)`;

/** An <svg> whose contents grow in the first time it scrolls into view. */
export function GardenSvg({
  viewBox,
  className = "",
  label,
  preserveAspectRatio,
  children,
}: {
  viewBox: string;
  className?: string;
  label?: string;
  preserveAspectRatio?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGrown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={`garden ${className}`}
      data-grown={grown}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {children}
    </svg>
  );
}

/* ── Flower parts ── */

const PETAL = "M0 0 C-5.5 -6 -6 -16 0 -20 C6 -16 5.5 -6 0 0Z";
const POINTED = "M0 0 C-4 -7 -3.4 -17 0 -23 C3.4 -17 4 -7 0 0Z";
const LEAF = "M0 0 C5 -11 19 -13 25 -5 C18 4 6 5 0 0Z";

function Ring({
  count,
  path,
  fill,
  delay,
  offset = 0,
  scale = 1,
  vein,
}: {
  count: number;
  path: string;
  fill: string;
  delay: number;
  offset?: number;
  scale?: number;
  vein?: string;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <g key={i} transform={`rotate(${n((360 / count) * i + offset)}) scale(${scale})`}>
          <g className="g-grow" style={d(delay + i * 0.03)}>
            <path d={path} style={{ fill }} />
            {vein && <path d="M0 -3 L0 -15" stroke={vein} strokeWidth="0.7" strokeLinecap="round" fill="none" />}
          </g>
        </g>
      ))}
    </>
  );
}

function Head({ kind, color, delay }: { kind: FlowerKind; color: string; delay: number }) {
  if (kind === "daisy") {
    return (
      <>
        <Ring count={11} path={PETAL} fill={shade(color, 82)} delay={delay} scale={0.82} />
        <Ring
          count={11}
          path={PETAL}
          fill={color}
          delay={delay + 0.12}
          offset={16.4}
          scale={0.74}
          vein={shade(color, 70)}
        />
        <g className="g-grow" style={d(delay + 0.45)}>
          <circle r="5.6" fill="var(--accent-3)" stroke={shade("#efb23a", 78)} strokeWidth="0.8" />
          <circle r="3" fill={shade("#efb23a", 84)} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx={n(4 * Math.cos(i * 1.05))} cy={n(4 * Math.sin(i * 1.05))} r="0.7" fill="#7a4a2b" />
          ))}
        </g>
      </>
    );
  }
  if (kind === "sunflower") {
    return (
      <>
        <Ring count={16} path={POINTED} fill="#d9902a" delay={delay} scale={0.9} />
        <Ring
          count={16}
          path={POINTED}
          fill="var(--accent-3)"
          delay={delay + 0.14}
          offset={11.25}
          scale={0.8}
          vein="#d9902a"
        />
        <g className="g-grow" style={d(delay + 0.5)}>
          <circle r="8.6" fill="#4a2f1b" stroke="#2e1c0f" strokeWidth="0.8" />
          <circle r="5" fill="#6b4526" />
          {/* seeds on a golden-angle spiral */}
          {Array.from({ length: 22 }).map((_, i) => {
            const a = i * 2.39996;
            const r = 1.7 * Math.sqrt(i);
            return (
              <circle
                key={i}
                cx={n(r * Math.cos(a))}
                cy={n(r * Math.sin(a))}
                r="0.55"
                fill={i % 3 ? "#2e1c0f" : "#c98a3a"}
              />
            );
          })}
        </g>
      </>
    );
  }
  if (kind === "poppy") {
    return (
      <>
        {[0, 90, 180, 270].map((a, i) => (
          <g key={a} transform={`rotate(${a + 20})`}>
            <path
              className="g-grow"
              style={{ ...d(delay + i * 0.08), fill: i % 2 ? shade(color, 86) : color }}
              d="M0 2 C-13 -3 -14 -19 0 -21 C14 -19 13 -3 0 2Z"
            />
          </g>
        ))}
        <g className="g-grow" style={d(delay + 0.4)}>
          <circle r="4.6" fill="#1d2433" />
          {Array.from({ length: 10 }).map((_, i) => (
            <circle
              key={i}
              cx={n(6.4 * Math.cos(i * 0.628))}
              cy={n(6.4 * Math.sin(i * 0.628))}
              r="0.9"
              fill="var(--accent-3)"
            />
          ))}
          <circle r="1.6" fill="#6fae7f" />
        </g>
      </>
    );
  }
  if (kind === "tulip") {
    return (
      <g transform="translate(0 4)">
        <path
          className="g-grow"
          style={{ ...d(delay), fill: shade(color, 78) }}
          d="M0 0 C-14 -4 -13 -20 -8 -26 C-4 -18 -1 -10 0 0Z"
        />
        <path
          className="g-grow"
          style={{ ...d(delay + 0.08), fill: shade(color, 78) }}
          d="M0 0 C14 -4 13 -20 8 -26 C4 -18 1 -10 0 0Z"
        />
        <path
          className="g-grow"
          style={{ ...d(delay + 0.18), fill: color }}
          d="M0 0 C-9 -6 -7 -22 0 -29 C7 -22 9 -6 0 0Z"
        />
        <path
          className="g-grow"
          style={{ ...d(delay + 0.3), stroke: tint(color, 55) }}
          d="M-2.5 -6 C-4 -13 -2.5 -20 0 -25"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          className="g-grow"
          style={d(delay + 0.05)}
          d="M-4 1 C-2 4 2 4 4 1 C2 -1 -2 -1 -4 1Z"
          fill="var(--leaf-deep)"
        />
      </g>
    );
  }
  if (kind === "lavender") {
    return (
      <g transform="translate(0 10)">
        {Array.from({ length: 11 }).map((_, i) => {
          const y = -i * 3.5;
          const side = i % 2 ? 1 : -1;
          const r = 3.6 - i * 0.2;
          return (
            <g key={i} transform={`translate(${n(side * (2.6 - i * 0.12))} ${n(y)})`}>
              <ellipse
                className="g-grow"
                style={{
                  ...d(delay + i * 0.05),
                  fill: i % 3 === 0 ? shade(color, 80) : i % 3 === 1 ? color : tint(color, 70),
                }}
                rx={n(r)}
                ry={n(r * 0.8)}
              />
            </g>
          );
        })}
      </g>
    );
  }
  // sprout: two seed leaves with midribs and a bud
  return (
    <>
      <g transform="rotate(-8)">
        <g className="g-grow" style={d(delay)}>
          <path d="M0 2 C-5 -9 -17 -12 -21 -6 C-16 3 -7 5 0 2Z" fill="var(--leaf)" />
          <path
            d="M-2 1 Q-10 -4 -18 -6"
            stroke="var(--leaf-deep)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </g>
      <g transform="rotate(8)">
        <g className="g-grow" style={d(delay + 0.12)}>
          <path d="M0 2 C5 -11 17 -15 22 -9 C17 1 7 5 0 2Z" fill="var(--leaf-2)" />
          <path d="M2 1 Q10 -6 19 -9" stroke="var(--leaf)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>
      </g>
      <circle className="g-grow" style={d(delay + 0.25)} cy="-1" r="2.2" fill="var(--leaf-2)" />
    </>
  );
}

/** A detailed flower rooted at (x, y): the stem draws upward, leaves unfurl, then petals open one by one. */
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
  const stem = `M0 0 C${n(lean * 1.6)} ${n(-h * 0.35)} ${n(-lean * 0.6)} ${n(-h * 0.7)} ${lean} ${-h}`;
  const tall = kind !== "sprout" && h > 30;
  const fill = color || "var(--petal)";
  return (
    <g transform={`translate(${n(x)} ${n(y)}) scale(${scale})`}>
      <g className="sway" style={{ animationDelay: `${n(-delay * 3 - x / 40)}s` }}>
        <path className="g-stem" style={d(delay)} d={stem} pathLength={1} stroke="var(--leaf-deep)" strokeWidth="3.6" />
        <path className="g-stem" style={d(delay)} d={stem} pathLength={1} stroke="var(--leaf)" strokeWidth="2" />
        {tall && (
          <>
            <g transform={`translate(${n(lean * 0.45)} ${n(-h * 0.28)}) rotate(-14)`}>
              <g className="g-grow" style={d(delay + 0.3)}>
                <path d={LEAF} fill="var(--leaf-2)" />
                <path d="M1 -1 Q12 -6 22 -5" stroke="var(--leaf)" strokeWidth="0.9" fill="none" strokeLinecap="round" />
              </g>
            </g>
            <g transform={`translate(${n(lean * 0.2)} ${n(-h * 0.5)}) scale(-0.85 0.85) rotate(-10)`}>
              <g className="g-grow" style={d(delay + 0.45)}>
                <path d={LEAF} fill="var(--leaf)" />
                <path
                  d="M1 -1 Q12 -6 22 -5"
                  stroke="var(--leaf-deep)"
                  strokeWidth="0.9"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            </g>
            {h > 70 && (
              <g transform={`translate(${n(lean * 0.4)} ${n(-h * 0.7)}) scale(0.7) rotate(-20)`}>
                <g className="g-grow" style={d(delay + 0.55)}>
                  <path d={LEAF} fill="var(--leaf-2)" />
                </g>
              </g>
            )}
          </>
        )}
        <g transform={`translate(${lean} ${-h})`}>
          <Head kind={kind} color={fill} delay={delay + 0.6} />
        </g>
      </g>
    </g>
  );
}

/* ── Sky furniture ── */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

const STARS = (() => {
  const rand = seeded(11);
  return Array.from({ length: 60 }, () => ({ x: rand(), y: rand(), r: n(0.5 + rand() * 1.3), t: n(rand() * 4) }));
})();

/** Twinkling stars spread over a w × h box. Every fifth one is a four-point sparkle. */
export function Stars({
  color = "#f4eedd",
  count = 30,
  w = 400,
  h = 240,
}: {
  color?: string;
  count?: number;
  w?: number;
  h?: number;
}) {
  return (
    <g fill={color}>
      {STARS.slice(0, count).map((s, i) =>
        i % 5 === 0 ? (
          <path
            key={i}
            className="twinkle"
            style={{ animationDelay: `-${s.t}s` }}
            transform={`translate(${n(s.x * w)} ${n(s.y * h)}) scale(${n(0.5 + s.r * 0.5)})`}
            d="M0 -4 Q0.6 -0.6 4 0 Q0.6 0.6 0 4 Q-0.6 0.6 -4 0 Q-0.6 -0.6 0 -4Z"
          />
        ) : (
          <circle
            key={i}
            className="twinkle"
            style={{ animationDelay: `-${s.t}s` }}
            cx={n(s.x * w)}
            cy={n(s.y * h)}
            r={s.r}
          />
        ),
      )}
    </g>
  );
}

/** A glowing sun or moon: three stacked halos, a shaded disc, and rimmed craters for the moon. */
export function Orb({ x, y, r, kind = "sun" }: { x: number; y: number; r: number; kind?: "sun" | "moon" }) {
  const c = kind === "sun" ? "#f5bd4a" : "#f4eedd";
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r * 2.3} fill={c} opacity="0.05" />
      <circle r={r * 1.7} fill={c} opacity="0.09" />
      <circle r={r * 1.28} fill={c} opacity="0.16" className="blip-soft" />
      <circle r={r} fill={c} />
      {kind === "sun" ? (
        <>
          <circle r={r * 0.78} cx={-r * 0.1} cy={-r * 0.1} fill="#ffd778" opacity="0.7" />
          <circle r={r} fill="none" stroke="#e9963a" strokeWidth="1.5" opacity="0.7" />
        </>
      ) : (
        <>
          <path d={`M0 ${-r} A${r} ${r} 0 0 1 0 ${r} A${r * 0.62} ${r} 0 0 0 0 ${-r}Z`} fill="#c9c2b0" opacity="0.55" />
          {[
            [-0.35, -0.3, 0.2],
            [0.2, 0.25, 0.26],
            [-0.15, 0.48, 0.13],
            [0.42, -0.38, 0.12],
          ].map(([cx, cy, cr], i) => (
            <g key={i} transform={`translate(${n(cx * r)} ${n(cy * r)})`}>
              <circle r={n(cr * r)} fill="#cfc8b6" />
              <path
                d={`M${n(-cr * r)} 0 A${n(cr * r)} ${n(cr * r)} 0 0 1 ${n(cr * r)} 0`}
                fill="none"
                stroke="#a9a290"
                strokeWidth="1"
              />
            </g>
          ))}
        </>
      )}
    </g>
  );
}

/** Fireflies: each is a stacked glow that wanders on its own loop. */
export function Fireflies({ points }: { points: [number, number][] }) {
  return (
    <g>
      {points.map(([x, y], i) => (
        <g
          key={i}
          className="firefly"
          style={{ animationDelay: `${n(-i * 1.7)}s`, animationDuration: `${7 + (i % 4) * 2}s` }}
        >
          <circle cx={x} cy={y} r="7" fill="#ffe27a" opacity="0.12" />
          <circle cx={x} cy={y} r="3.4" fill="#ffe27a" opacity="0.3" />
          <circle cx={x} cy={y} r="1.5" fill="#fff6c9" />
        </g>
      ))}
    </g>
  );
}

/** A row of swaying grass blades following a ground curve. */
export function Grass({
  from,
  to,
  step = 9,
  ground,
  color = "var(--leaf)",
}: {
  from: number;
  to: number;
  step?: number;
  ground: (x: number) => number;
  color?: string;
}) {
  const blades = [];
  for (let x = from, i = 0; x <= to; x += step, i++) {
    const y = ground(x) + 2;
    const hgt = 7 + ((i * 7) % 6);
    blades.push(
      <g key={i} transform={`translate(${n(x)} ${n(y)})`}>
        <path
          className="sway"
          style={{ animationDelay: `${n(-i * 0.37)}s`, fill: i % 2 ? color : "var(--leaf-2)" }}
          d={`M-2 0 Q${i % 2 ? -3 : 3} ${-hgt * 0.6} ${i % 2 ? 2 : -2} ${-hgt} Q${i % 2 ? 0 : 1} ${-hgt * 0.5} 2 0Z`}
        />
      </g>,
    );
  }
  return <g>{blades}</g>;
}

/* ── The homestead planet (hero) ── */

const CX = 250;
const CY = 300;
const R = 132;

function OnPlanet({ a, children, lift = 0 }: { a: number; children: React.ReactNode; lift?: number }) {
  return <g transform={`rotate(${a} ${CX} ${CY}) translate(${CX} ${CY - R + 3 - lift})`}>{children}</g>;
}

const HERO_FLOWERS: { a: number; kind: FlowerKind; h: number; color: string }[] = [
  { a: -76, kind: "lavender", h: 38, color: "var(--lilac)" },
  { a: -64, kind: "poppy", h: 46, color: "var(--accent)" },
  { a: -52, kind: "daisy", h: 60, color: "var(--petal)" },
  { a: -40, kind: "tulip", h: 50, color: "var(--accent)" },
  { a: -27, kind: "sunflower", h: 92, color: "" },
  { a: 31, kind: "daisy", h: 62, color: "#fbf7ea" },
  { a: 42, kind: "tulip", h: 78, color: "var(--petal)" },
  { a: 53, kind: "poppy", h: 48, color: "var(--petal)" },
  { a: 64, kind: "lavender", h: 44, color: "var(--lilac)" },
  { a: 74, kind: "sprout", h: 22, color: "" },
];

/** Hero: a small homestead planet with a farmhouse, barn, windmill, fields, a pond and flowers taller than the house. */
export function GardenPlanet({ className = "" }: { className?: string }) {
  return (
    <GardenSvg
      viewBox="0 0 500 500"
      className={className}
      label="A small planet with a farmhouse, a barn, a windmill, fields and flowers growing on it"
    >
      <defs>
        <radialGradient id="gp-body" cx="36%" cy="26%" r="85%">
          <stop offset="0%" stopColor="var(--leaf-2)" />
          <stop offset="55%" stopColor="var(--leaf)" />
          <stop offset="100%" stopColor="var(--leaf-deep)" />
        </radialGradient>
        <radialGradient id="gp-night" cx="28%" cy="22%" r="95%">
          <stop offset="55%" stopColor="#0d111c" stopOpacity="0" />
          <stop offset="100%" stopColor="#0d111c" stopOpacity="0.55" />
        </radialGradient>
        <radialGradient id="gp-halo">
          <stop offset="62%" stopColor="var(--leaf-2)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--leaf-2)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="gp-clip">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
      </defs>

      <Stars color="var(--text-primary)" count={34} w={500} h={500} />

      {/* sun with stacked glow, and a ringed neighbour */}
      <Orb x={418} y={86} r={30} />
      <g transform="translate(70 122) rotate(-22)">
        <ellipse rx="34" ry="8" fill="none" stroke="var(--text-primary)" strokeWidth="1.6" opacity="0.5" />
        <circle r="17" fill="var(--petal)" />
        <path d="M-17 0 A17 17 0 0 0 17 0 A17 9 0 0 1 -17 0Z" fill="#1d2433" opacity="0.18" />
        <path d="M-15 -5 Q0 -1 15 -6 M-16 3 Q0 8 16 2" stroke="#fff8ec" strokeWidth="1.4" fill="none" opacity="0.6" />
        <path d="M-34 0 A34 8 0 0 0 34 0" fill="none" stroke="var(--text-primary)" strokeWidth="1.8" />
      </g>

      {/* orbits */}
      <circle
        cx={CX}
        cy={CY}
        r="206"
        fill="none"
        stroke="var(--text-tertiary)"
        strokeOpacity="0.45"
        strokeDasharray="2 9"
      />
      <g className="orbit-spin slow" style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: "70s" }}>
        <g transform={`translate(${CX - 206} ${CY})`}>
          <circle r="11" fill="#d8d2c0" stroke="var(--text-primary)" strokeWidth="1.4" />
          <circle cx="-3" cy="-3" r="3" fill="#b9b3a2" />
          <path d="M-6 -3 A3 3 0 0 1 0 -3" fill="none" stroke="#8f8a7c" strokeWidth="0.8" />
          <circle cx="4" cy="3" r="2" fill="#b9b3a2" />
          <circle cx="-2" cy="5" r="1.2" fill="#b9b3a2" />
        </g>
      </g>
      {/* watering-can satellite */}
      <g className="orbit-spin" style={{ transformOrigin: `${CX}px ${CY}px`, animationDuration: "34s" }}>
        <g transform={`translate(${CX} ${CY - 206}) rotate(18)`}>
          <path
            d="M-13 -9 h20 a3 3 0 0 1 3 3 v12 a3 3 0 0 1 -3 3 h-20 a3 3 0 0 1 -3 -3 v-12 a3 3 0 0 1 3 -3Z"
            fill="var(--accent-2)"
            stroke="var(--text-primary)"
            strokeWidth="1.4"
          />
          <path d="M10 -2 L26 -11" stroke="var(--text-primary)" strokeWidth="5" strokeLinecap="round" />
          <path d="M10 -2 L26 -11" stroke="var(--accent-2)" strokeWidth="2.6" strokeLinecap="round" />
          <ellipse
            cx="28"
            cy="-12"
            rx="3.2"
            ry="5.4"
            transform="rotate(-30 28 -12)"
            fill="var(--accent-3)"
            stroke="var(--text-primary)"
            strokeWidth="1.2"
          />
          <path
            d="M-16 -4 C-27 -6 -27 8 -16 6"
            fill="none"
            stroke="var(--text-primary)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path d="M-10 -9 C-6 -18 4 -18 6 -9" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
          <g className="drips" stroke="#8fc4ff" strokeWidth="1.8" strokeLinecap="round">
            <line x1="32" y1="-8" x2="34" y2="-2" />
            <line x1="35" y1="-13" x2="39" y2="-8" style={{ animationDelay: "-0.3s" }} />
            <line x1="30" y1="-3" x2="31" y2="3" style={{ animationDelay: "-0.6s" }} />
          </g>
        </g>
      </g>

      {/* atmosphere halo */}
      <circle cx={CX} cy={CY} r={R + 26} fill="url(#gp-halo)" />

      {/* things standing behind the horizon line */}
      {HERO_FLOWERS.map((f, i) => (
        <OnPlanet key={f.a} a={f.a}>
          <Flower kind={f.kind} h={f.h} color={f.color} delay={0.25 + i * 0.1} lean={i % 2 ? 4 : -4} />
        </OnPlanet>
      ))}

      {/* round trees */}
      {[-14, 20].map((a, i) => (
        <OnPlanet key={a} a={a}>
          <rect x="-2" y="-16" width="4" height="18" fill="#6b4526" />
          <g className="g-grow" style={d(0.4 + i * 0.2)} transform="translate(0 -22)">
            <circle r="12" fill="var(--leaf-deep)" />
            <circle cx="-4" cy="-4" r="8" fill="var(--leaf)" />
            <circle cx="3" cy="-7" r="5" fill="var(--leaf-2)" />
            <circle cx="5" cy="3" r="1.6" fill="var(--accent)" />
            <circle cx="-6" cy="4" r="1.6" fill="var(--accent)" />
          </g>
        </OnPlanet>
      ))}

      {/* windmill */}
      <OnPlanet a={-90}>
        <path
          d="M-7 2 L-4 -36 L4 -36 L7 2Z"
          fill="#fbf7ea"
          stroke="var(--text-primary)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M-5.6 -12 h11.2 M-4.8 -24 h9.6" stroke="var(--text-primary)" strokeWidth="0.9" />
        <rect x="-2" y="-8" width="4" height="10" fill="var(--text-primary)" />
        <g transform="translate(0 -36)">
          <g
            className="orbit-spin"
            style={{ transformOrigin: "0px 0px", transformBox: "view-box", animationDuration: "9s" }}
          >
            {[0, 90, 180, 270].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <path d="M0 0 L0 -24" stroke="var(--text-primary)" strokeWidth="1.4" />
                <path d="M1 -8 h7 v-15 h-7Z" fill="var(--accent)" stroke="var(--text-primary)" strokeWidth="1" />
              </g>
            ))}
          </g>
          <circle r="2.4" fill="var(--text-primary)" />
        </g>
      </OnPlanet>

      {/* barn */}
      <OnPlanet a={88}>
        <path
          d="M-15 2 V-16 L-9 -25 H9 L15 -16 V2Z"
          fill="var(--accent)"
          stroke="var(--text-primary)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M-17 -15 L-10 -27 H10 L17 -15"
          fill="none"
          stroke="var(--text-primary)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect x="-6" y="-12" width="12" height="14" fill="#fbf7ea" stroke="var(--text-primary)" strokeWidth="1.1" />
        <path d="M-6 -12 L6 2 M6 -12 L-6 2" stroke="var(--text-primary)" strokeWidth="1" />
        <rect x="-3" y="-21" width="6" height="5" fill="#1d2433" />
      </OnPlanet>

      {/* farmhouse with porch, rocking chair and chimney smoke */}
      <OnPlanet a={4}>
        <g className="smoke" fill="var(--text-tertiary)">
          <circle cx="11" cy="-52" r="3" />
          <circle cx="13" cy="-60" r="4" style={{ animationDelay: "-1.2s" }} />
          <circle cx="10" cy="-69" r="5" style={{ animationDelay: "-2.4s" }} />
        </g>
        <rect x="8" y="-48" width="6" height="12" fill="#b9683f" stroke="var(--text-primary)" strokeWidth="1.2" />
        <rect x="-19" y="-26" width="38" height="28" fill="#fbf7ea" stroke="var(--text-primary)" strokeWidth="1.5" />
        <path d="M-19 -18 h38 M-19 -10 h38 M-19 -2 h38" stroke="var(--text-primary)" strokeWidth="0.5" opacity="0.35" />
        <path
          d="M-25 -25 L0 -46 L25 -25Z"
          fill="var(--accent)"
          stroke="var(--text-primary)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M-17 -30 h34 M-11 -35 h22 M-5 -40 h10" stroke="var(--text-primary)" strokeWidth="0.6" opacity="0.5" />
        <rect
          x="-5"
          y="-14"
          width="10"
          height="16"
          rx="1"
          fill="#6b4526"
          stroke="var(--text-primary)"
          strokeWidth="1.1"
        />
        <circle cx="2.6" cy="-6" r="0.9" fill="var(--accent-3)" />
        {[-14, 9].map((wx) => (
          <g key={wx}>
            <rect
              x={wx}
              y="-18"
              width="7"
              height="8"
              fill="var(--accent-3)"
              stroke="var(--text-primary)"
              strokeWidth="1"
              className="window-glow"
            />
            <path d={`M${wx + 3.5} -18 v8 M${wx} -14 h7`} stroke="var(--text-primary)" strokeWidth="0.6" />
          </g>
        ))}
        {/* porch */}
        <path d="M-25 2 h50" stroke="var(--text-primary)" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M-24 -10 h48 M-22 -10 v12 M22 -10 v12" stroke="var(--text-primary)" strokeWidth="1.1" />
        {/* rocking chair */}
        <g transform="translate(-33 1)" className="rock">
          <path d="M-6 0 Q0 3 6 0" fill="none" stroke="#6b4526" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M-4 0 V-7 H4 V0 M-4 -7 V-15" fill="none" stroke="#6b4526" strokeWidth="1.4" strokeLinejoin="round" />
        </g>
        {/* cat and dog */}
        <g transform="translate(32 1)" fill="var(--text-primary)">
          <ellipse cx="0" cy="-3.2" rx="4" ry="3.2" />
          <circle cx="3.6" cy="-6.6" r="2.4" />
          <path d="M2 -8 l0.8 -2.6 l1.4 2 M4.4 -8.6 l1.6 -2 l0.4 2.6Z" />
          <path
            d="M-4 -3 C-8 -4 -8 -10 -5 -11"
            fill="none"
            stroke="var(--text-primary)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
        <g transform="translate(46 1)" fill="#b9683f" stroke="var(--text-primary)" strokeWidth="0.8">
          <ellipse cx="0" cy="-4" rx="5.5" ry="3.4" />
          <circle cx="5.6" cy="-7.6" r="2.8" />
          <path d="M4 -9.5 l-1.4 -3 l2.6 1.4Z" />
          <path d="M-5 -5 l-3.4 -4" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M-3 -1 v3 M3 -1 v3" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      </OnPlanet>

      {/* fence along the near horizon */}
      {Array.from({ length: 9 }).map((_, i) => (
        <OnPlanet key={i} a={-22 + i * 2.6 + (i > 3 ? 13 : -6)}>
          <rect x="-0.9" y="-7" width="1.8" height="8" fill="#fbf7ea" stroke="var(--text-primary)" strokeWidth="0.5" />
        </OnPlanet>
      ))}

      {/* the planet itself */}
      <circle cx={CX} cy={CY} r={R} fill="url(#gp-body)" />
      <g clipPath="url(#gp-clip)">
        {/* patchwork fields */}
        <path
          d={`M${CX - 122} ${CY - 34} Q${CX - 60} ${CY - 6} ${CX - 30} ${CY - 44} Q${CX - 70} ${CY - 92} ${CX - 108} ${CY - 74}Z`}
          fill="#e9c877"
          opacity="0.9"
        />
        <path
          d={`M${CX + 20} ${CY - 60} Q${CX + 70} ${CY - 30} ${CX + 124} ${CY - 52} Q${CX + 96} ${CY - 104} ${CX + 44} ${CY - 108}Z`}
          fill="var(--soil)"
          opacity="0.75"
        />
        <path
          d={`M${CX - 96} ${CY + 14} Q${CX - 30} ${CY + 40} ${CX + 8} ${CY + 4} Q${CX - 28} ${CY - 26} ${CX - 78} ${CY - 12}Z`}
          fill="var(--leaf-2)"
          opacity="0.8"
        />
        <path
          d={`M${CX + 30} ${CY + 20} Q${CX + 84} ${CY + 42} ${CX + 122} ${CY + 6} Q${CX + 84} ${CY - 22} ${CX + 44} ${CY - 8}Z`}
          fill="#e9c877"
          opacity="0.75"
        />
        <path
          d={`M${CX - 70} ${CY + 62} Q${CX} ${CY + 96} ${CX + 74} ${CY + 60} Q${CX + 10} ${CY + 40} ${CX - 40} ${CY + 46}Z`}
          fill="var(--soil)"
          opacity="0.65"
        />
        {/* furrows */}
        <g fill="none" strokeLinecap="round">
          {[0, 1, 2, 3].map((i) => (
            <path
              key={`a${i}`}
              d={`M${CX + 36 + i * 4} ${CY - 96 + i * 13} Q${CX + 78} ${CY - 76 + i * 13} ${CX + 116 - i * 2} ${CY - 62 + i * 9}`}
              stroke="var(--leaf-2)"
              strokeWidth="3"
              strokeDasharray="1 7"
            />
          ))}
          {[0, 1, 2].map((i) => (
            <path
              key={`b${i}`}
              d={`M${CX - 56 + i * 6} ${CY + 58 + i * 10} Q${CX} ${CY + 74 + i * 9} ${CX + 56 - i * 6} ${CY + 60 + i * 9}`}
              stroke="var(--leaf-2)"
              strokeWidth="3"
              strokeDasharray="1 7"
            />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <path
              key={`c${i}`}
              d={`M${CX - 112 + i * 6} ${CY - 66 + i * 10} Q${CX - 70} ${CY - 50 + i * 10} ${CX - 38} ${CY - 50 + i * 6}`}
              stroke="#c9a24e"
              strokeWidth="1.4"
            />
          ))}
          {[0, 1, 2].map((i) => (
            <path
              key={`d${i}`}
              d={`M${CX + 42 + i * 4} ${CY + 2 + i * 9} Q${CX + 84} ${CY + 18 + i * 8} ${CX + 116} ${CY + 4 + i * 6}`}
              stroke="#c9a24e"
              strokeWidth="1.4"
            />
          ))}
        </g>
        {/* pond with highlight and lily pads */}
        <ellipse cx={CX - 44} cy={CY + 6} rx="26" ry="11" fill="#6fb3e0" stroke="var(--leaf-deep)" strokeWidth="1.5" />
        <path
          d={`M${CX - 62} ${CY + 3} q10 -5 22 -3`}
          stroke="#d8eefc"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx={CX - 36} cy={CY + 9} r="3" fill="var(--leaf)" />
        <circle cx={CX - 50} cy={CY + 10} r="2.2" fill="var(--leaf-2)" />
        <circle cx={CX - 36} cy={CY + 8} r="1" fill="var(--petal)" />
        {/* winding path from the house */}
        <path
          d={`M${CX + 8} ${CY - 132} C${CX + 22} ${CY - 90} ${CX - 12} ${CY - 60} ${CX + 12} ${CY - 20} S${CX - 6} ${CY + 60} ${CX + 20} ${CY + 132}`}
          fill="none"
          stroke="#f1dfb4"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d={`M${CX + 8} ${CY - 132} C${CX + 22} ${CY - 90} ${CX - 12} ${CY - 60} ${CX + 12} ${CY - 20} S${CX - 6} ${CY + 60} ${CX + 20} ${CY + 132}`}
          fill="none"
          stroke="#c9a24e"
          strokeWidth="0.8"
          strokeDasharray="3 6"
        />
        {/* hay bales, bushes */}
        {[
          [CX + 70, CY + 26],
          [CX + 86, CY + 16],
          [CX - 82, CY - 44],
        ].map(([hx, hy], i) => (
          <g key={i} transform={`translate(${hx} ${hy})`}>
            <ellipse rx="6" ry="4.4" fill="#e3b54f" stroke="#9a7426" strokeWidth="0.8" />
            <path d="M-3 -3 q3 3 0 6 M1 -4 q3 4 0 8" stroke="#9a7426" strokeWidth="0.6" fill="none" />
          </g>
        ))}
        {[
          [CX - 20, CY + 30, 7],
          [CX + 30, CY - 34, 6],
          [CX - 92, CY + 40, 8],
          [CX + 96, CY + 52, 7],
        ].map(([bx, by, br], i) => (
          <g key={i}>
            <circle cx={bx} cy={by} r={br} fill="var(--leaf-deep)" />
            <circle cx={bx - 2} cy={by - 2} r={br * 0.6} fill="var(--leaf)" />
          </g>
        ))}
        {/* night-side shading and a soft highlight */}
        <circle cx={CX} cy={CY} r={R} fill="url(#gp-night)" />
        <ellipse
          cx={CX - 54}
          cy={CY - 74}
          rx="46"
          ry="22"
          fill="#fff8ec"
          opacity="0.14"
          transform={`rotate(-32 ${CX - 54} ${CY - 74})`}
        />
        {/* drifting clouds */}
        <g className="cloud-drift" fill="#fff8ec" opacity="0.8">
          <ellipse cx={CX - 30} cy={CY - 96} rx="26" ry="6" />
          <ellipse cx={CX - 12} cy={CY - 101} rx="14" ry="6" />
          <ellipse cx={CX + 62} cy={CY + 74} rx="22" ry="5" />
        </g>
      </g>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--text-primary)" strokeWidth="2" />
      <path
        d={`M${CX - R + 6} ${CY - 20} A${R - 4} ${R - 4} 0 0 1 ${CX - 20} ${CY - R + 6}`}
        fill="none"
        stroke="#fff8ec"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </GardenSvg>
  );
}

/** Tiny flowering planet used as an emblem (skill orbit core). */
export function MiniPlanet({ className = "" }: { className?: string }) {
  return (
    <GardenSvg viewBox="0 0 100 100" className={className}>
      <g transform="translate(50 46)">
        <Flower kind="daisy" h={22} color="var(--petal)" scale={0.9} />
      </g>
      <g transform="rotate(-34 50 66) translate(50 46)">
        <Flower kind="sprout" h={12} scale={0.7} delay={0.1} />
      </g>
      <g transform="rotate(34 50 66) translate(50 46)">
        <Flower kind="tulip" h={15} color="var(--accent)" scale={0.6} delay={0.2} />
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
      <ellipse cx="42" cy="58" rx="8" ry="4" fill="#fff8ec" opacity="0.2" transform="rotate(-30 42 58)" />
    </GardenSvg>
  );
}
