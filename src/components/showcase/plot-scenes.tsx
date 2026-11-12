"use client";

import { d, Fireflies, Flower, GardenSvg, Grass, n, Orb, Stars, type FlowerKind } from "./garden";

/* One illustrated garden scene per job. Each is a picture of the work, drawn as something growing. */

const CREAM = "#f4eedd";
const INK = "#12182b";

// Height of the curved horizon at a given x
const ground = (x: number) => +(430 - 200 * Math.sqrt(1 - ((x - 200) / 340) ** 2)).toFixed(1);
const hill = (x: number) => +(222 - 26 * Math.sin((x + 40) / 62) - 12 * Math.sin(x / 23)).toFixed(1);

type Palette = { ground: string; rim: string; furrow: string; far: string };
const GREEN: Palette = { ground: "#3d7f56", rim: "#6fae7f", furrow: "#2a5c3d", far: "#22422f" };
const SOIL: Palette = { ground: "#b9683f", rim: "#d98a5c", furrow: "#7a4326", far: "#5a3a2a" };

function Scene({
  label,
  palette,
  children,
  back,
  front,
  flies = true,
}: {
  label: string;
  palette: Palette;
  children: React.ReactNode;
  /** drawn behind the far hills (suns, moons) */
  back?: React.ReactNode;
  front?: React.ReactNode;
  flies?: boolean;
}) {
  const far = `M-10 300 ${Array.from({ length: 22 }, (_, i) => `L${i * 20 - 10} ${hill(i * 20 - 10)}`).join(" ")} L410 300Z`;
  return (
    <div className="plot-scene">
      <GardenSvg
        viewBox="0 -90 400 390"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full block"
        label={label}
      >
        <defs>
          <linearGradient id="ps-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f1530" />
            <stop offset="60%" stopColor="#1b2440" />
            <stop offset="100%" stopColor="#3a3a6a" />
          </linearGradient>
        </defs>
        <rect y="-90" width="400" height="390" fill="url(#ps-sky)" />
        <g transform="translate(0 -84)">
          <Stars count={34} w={400} h={250} />
        </g>
        <ellipse cx="200" cy="232" rx="260" ry="50" fill="#f5bd4a" opacity="0.08" />

        {back}

        {/* far hills with a few distant trees */}
        <path d={far} fill={palette.far} />
        {[36, 92, 150, 262, 318, 368].map((x, i) => (
          <g key={x} transform={`translate(${x} ${hill(x) + 2}) scale(${i % 2 ? 1 : 0.75})`} fill={palette.far}>
            <path d="M0 -16 L6 0 H-6Z M0 -10 L7 6 H-7Z" stroke="#0f1530" strokeOpacity="0.35" strokeWidth="0.6" />
          </g>
        ))}

        {children}

        {/* near ground */}
        <ellipse cx="200" cy="430" rx="340" ry="200" fill={palette.ground} stroke={INK} strokeWidth="2" />
        <path
          d={`M30 ${ground(30) + 4} Q200 ${ground(200) - 6} 370 ${ground(370) + 4}`}
          fill="none"
          stroke={palette.rim}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        <g
          fill="none"
          stroke={palette.furrow}
          strokeOpacity="0.45"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="1 13"
        >
          <ellipse cx="200" cy="452" rx="330" ry="200" />
          <ellipse cx="200" cy="474" rx="320" ry="200" />
          <ellipse cx="200" cy="497" rx="310" ry="200" />
        </g>
        {[
          [78, 268],
          [140, 286],
          [246, 280],
          [312, 266],
          [196, 262],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={3 + (i % 2)} ry="2" fill={palette.furrow} opacity="0.55" />
        ))}
        <Grass from={34} to={366} step={11} ground={ground} />
        {front}
        {flies && (
          <Fireflies
            points={[
              [70, 170],
              [150, 120],
              [250, 150],
              [330, 185],
              [205, 90],
            ]}
          />
        )}
      </GardenSvg>
      <span className="plot-caption">{label}</span>
    </div>
  );
}

function Butterfly({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) {
  return (
    <g className="flutter" style={{ animationDelay: `${delay}s` }}>
      <g transform={`translate(${x} ${y})`}>
        <g className="wing">
          <path d="M0 0 C-9 -11 -15 -5 -10 1 C-14 6 -6 9 0 2Z" fill={color} stroke={INK} strokeWidth="0.6" />
          <circle cx="-8" cy="-3" r="1.3" fill={CREAM} />
        </g>
        <g className="wing wing-r">
          <path d="M0 0 C9 -11 15 -5 10 1 C14 6 6 9 0 2Z" fill={color} stroke={INK} strokeWidth="0.6" />
          <circle cx="8" cy="-3" r="1.3" fill={CREAM} />
        </g>
        <path d="M0 -3 V5" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M0 -3 q-2 -4 -4 -5 M0 -3 q2 -4 4 -5" stroke={INK} strokeWidth="0.6" fill="none" />
      </g>
    </g>
  );
}

/* Concentrix — one bed, many languages in bloom */
const LANGS: { code: string; kind: FlowerKind; color: string; h: number }[] = [
  { code: "ES", kind: "tulip", color: "#ff7a45", h: 62 },
  { code: "FR", kind: "daisy", color: "#f4a3b5", h: 86 },
  { code: "DE", kind: "sunflower", color: "", h: 112 },
  { code: "JA", kind: "daisy", color: CREAM, h: 72 },
  { code: "TL", kind: "poppy", color: "#f0603a", h: 96 },
  { code: "RO", kind: "lavender", color: "#b9a4ee", h: 70 },
  { code: "PT", kind: "daisy", color: "#ffb37a", h: 82 },
  { code: "IT", kind: "tulip", color: "#f4a3b5", h: 58 },
];
const lx = (i: number) => 62 + i * 39.5;

export function LanguageGarden() {
  return (
    <Scene
      label="One help desk, 20+ languages in bloom"
      palette={GREEN}
      back={<Orb x={306} y={-28} r={24} />}
      front={
        <>
          {LANGS.map((l, i) => (
            <g key={l.code} transform={`translate(${lx(i) + 12} ${ground(lx(i)) + 12})`}>
              <path d="M0 0 V14" stroke="#6b4526" strokeWidth="2.4" strokeLinecap="round" />
              <rect x="-11" y="-9" width="22" height="14" rx="3" fill={CREAM} stroke={INK} strokeWidth="1.1" />
              <path d="M-11 -9 h22" stroke="#6b4526" strokeWidth="1" opacity="0.4" />
              <text textAnchor="middle" y="2" className="plot-tag">
                {l.code}
              </text>
            </g>
          ))}
        </>
      }
    >
      {LANGS.map((l, i) => (
        <Flower
          key={l.code}
          x={lx(i)}
          y={ground(lx(i)) + 3}
          h={l.h}
          kind={l.kind}
          color={l.color}
          delay={i * 0.12}
          lean={i % 2 ? 5 : -5}
        />
      ))}
      <Butterfly x={120} y={96} color="#f5bd4a" delay={0} />
      <Butterfly x={270} y={70} color="#8fc4ff" delay={-2.5} />
    </Scene>
  );
}

/* RevEarth — a tree that drinks carbon and breathes out oxygen */
const CANOPY: [number, number, number, string][] = [
  [200, 60, 40, "#2a5c3d"],
  [156, 86, 34, "#2a5c3d"],
  [246, 84, 36, "#2a5c3d"],
  [176, 116, 34, "#2f6a46"],
  [228, 118, 34, "#2f6a46"],
  [200, 92, 40, "#3d7f56"],
  [164, 64, 26, "#3d7f56"],
  [238, 58, 24, "#3d7f56"],
  [140, 110, 22, "#3d7f56"],
  [262, 112, 22, "#4d9668"],
  [188, 46, 22, "#4d9668"],
  [214, 76, 26, "#6fae7f"],
  [172, 96, 20, "#6fae7f"],
  [232, 100, 16, "#86cf9a"],
  [196, 62, 14, "#86cf9a"],
];

export function CarbonTree() {
  return (
    <Scene label="A tree that keeps count of carbon" palette={SOIL} back={<Orb x={92} y={-34} r={20} kind="moon" />}>
      {/* carbon drifting in */}
      {[
        [70, 30, 0],
        [330, 10, 1.4],
        [84, 130, 2.6],
        [322, 118, 0.7],
      ].map(([x, y, dl], i) => (
        <g
          key={i}
          className="co2"
          style={{ animationDelay: `${dl}s`, ["--tx" as string]: `${200 - x}px`, ["--ty" as string]: `${90 - y}px` }}
        >
          <circle
            cx={x}
            cy={y}
            r="15"
            fill="#1b2440"
            fillOpacity="0.5"
            stroke={CREAM}
            strokeOpacity="0.75"
            strokeDasharray="3 4"
          />
          <text x={x} y={y + 3.5} textAnchor="middle" className="plot-tag" style={{ fill: CREAM }}>
            CO₂
          </text>
        </g>
      ))}

      {/* trunk, roots and branches */}
      <path
        d="M186 238 C192 214 190 196 192 172 C178 160 168 148 160 128 L168 124 C176 142 186 152 196 158 C198 144 198 132 196 116 L206 116 C206 134 206 146 208 158 C220 150 230 140 238 122 L246 126 C238 148 226 160 212 172 C212 196 212 214 218 238 C210 232 202 234 200 240 C198 234 192 232 186 238Z"
        fill="#6b4526"
        stroke={INK}
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="g-rise"
      />
      <path
        d="M198 228 C200 206 198 190 200 170 M194 214 q3 -8 1 -18 M206 220 q-2 -12 1 -24 M203 164 q4 -6 8 -10"
        fill="none"
        stroke="#4a2f1b"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="g-rise"
      />
      <path
        d="M186 238 q-14 2 -24 10 M218 238 q14 2 24 10 M200 240 q0 8 -4 14"
        fill="none"
        stroke="#6b4526"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* layered canopy: dark at the back, light on top */}
      {CANOPY.map(([x, y, r, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className="g-grow" style={d(0.5 + i * 0.07)}>
            <circle r={r} fill={c} stroke={i < 5 ? INK : "none"} strokeWidth="1.5" />
            {i > 10 && (
              <path
                d={`M${n(-r * 0.6)} ${n(-r * 0.3)} A${n(r * 0.75)} ${n(r * 0.75)} 0 0 1 ${n(r * 0.2)} ${n(-r * 0.72)}`}
                fill="none"
                stroke="#c4efce"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.7"
              />
            )}
          </g>
        </g>
      ))}
      {/* fruit */}
      {[
        [160, 100],
        [184, 70],
        [226, 62],
        [248, 100],
        [204, 124],
        [176, 128],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className="g-grow" style={d(1.7 + i * 0.1)}>
            <circle r="4.4" fill="#ff7a45" stroke={INK} strokeWidth="0.8" />
            <circle cx="-1.4" cy="-1.4" r="1.2" fill="#ffd0b8" />
            <path d="M0 -4 q2 -3 4 -3" stroke="#2a5c3d" strokeWidth="1" fill="none" />
          </g>
        </g>
      ))}

      {/* oxygen breathing out */}
      {[
        [176, 30, 0],
        [222, 20, 1.8],
        [248, 44, 3.2],
      ].map(([x, y, dl], i) => (
        <g key={i} className="o2" style={{ animationDelay: `${dl}s` }}>
          <circle cx={x} cy={y} r="9" fill="#86cf9a" fillOpacity="0.2" stroke="#86cf9a" />
          <text x={x} y={y + 3} textAnchor="middle" className="plot-tag" style={{ fill: "#c4efce", fontSize: 7.5 }}>
            O₂
          </text>
        </g>
      ))}

      {/* saplings on stakes */}
      {[84, 122, 284, 322].map((x, i) => (
        <g key={x}>
          <path
            d={`M${x + 7} ${ground(x) + 4} v-26`}
            stroke={CREAM}
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.8"
          />
          <Flower x={x} y={ground(x) + 3} h={22 + (i % 2) * 10} kind="sprout" delay={1.2 + i * 0.1} />
        </g>
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
  const sx = 322;
  const sy = ground(sx) + 2;
  return (
    <Scene
      label="25 stations watching the weather"
      palette={GREEN}
      flies={false}
      back={<Orb x={318} y={-40} r={16} kind="moon" />}
    >
      <g className="cloud-drift">
        {/* outline pass, then fill, then a shaded underside */}
        {[true, false].map((outline) => (
          <g key={String(outline)} fill={CREAM} stroke={outline ? INK : "none"} strokeWidth="3">
            <ellipse cx="170" cy="72" rx="62" ry="22" />
            <circle cx="134" cy="60" r="24" />
            <circle cx="172" cy="44" r="32" />
            <circle cx="208" cy="60" r="24" />
            <circle cx="232" cy="72" r="14" />
          </g>
        ))}
        <path d="M112 76 Q170 96 240 78 Q232 92 170 94 Q124 92 112 76Z" fill="#c9c2b0" />
        <path
          d="M150 34 q16 -14 36 -4 M124 52 q6 -8 14 -8"
          fill="none"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.8"
        />
        <g stroke="#8fc4ff" strokeWidth="2.4" strokeLinecap="round" className="rain">
          {[118, 132, 146, 160, 174, 188, 202, 216, 230].map((x, i) => (
            <line
              key={x}
              x1={x}
              y1={100 + (i % 3) * 4}
              x2={x - 9}
              y2={214}
              style={{ animationDelay: `${n(-i * 0.11)}s` }}
            />
          ))}
        </g>
      </g>

      {/* puddles and splash rings */}
      {[
        [126, 252, 16],
        [204, 262, 20],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.26} fill="#6fb3e0" stroke="#2a5c3d" strokeWidth="1" />
          <path
            d={`M${x - r * 0.6} ${y - 1} q${r * 0.4} -3 ${r * 0.8} -1`}
            stroke="#d8eefc"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse
            cx={x}
            cy={y}
            rx="5"
            ry="1.6"
            fill="none"
            stroke="#d8eefc"
            strokeWidth="1"
            className="splash"
            style={{ animationDelay: `${-i * 0.5}s` }}
          />
        </g>
      ))}

      {/* weather station */}
      <g transform={`translate(${sx} ${sy})`}>
        {/* signal arcs */}
        <g fill="none" stroke="#f5bd4a" strokeWidth="1.6" strokeLinecap="round" transform="translate(0 -104)">
          {[8, 15, 22].map((r, i) => (
            <path
              key={r}
              className="signal"
              style={{ animationDelay: `${i * 0.25}s` }}
              d={`M${-r} ${-r * 0.5} A${r} ${r} 0 0 1 ${r} ${-r * 0.5}`}
            />
          ))}
        </g>
        <path d="M0 0 L-12 6 M0 0 L12 6 M0 -6 V4" stroke={CREAM} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M0 0 V-98" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M0 0 V-98" stroke={CREAM} strokeWidth="3" strokeLinecap="round" />
        {/* solar panel */}
        <g transform="translate(-4 -44) rotate(-24)">
          <rect x="-22" y="-8" width="22" height="14" fill="#2b55c9" stroke={INK} strokeWidth="1.2" />
          <path d="M-14.6 -8 v14 M-7.3 -8 v14 M-22 -1 h22" stroke="#8fc4ff" strokeWidth="0.7" />
        </g>
        {/* sensor box with status light */}
        <rect x="3" y="-66" width="16" height="20" rx="2" fill={CREAM} stroke={INK} strokeWidth="1.2" />
        <path d="M6 -60 h10 M6 -56 h10 M6 -52 h10" stroke={INK} strokeWidth="0.8" opacity="0.5" />
        <circle cx="11" cy="-63" r="1.6" fill="#7ee2a8" className="blink" />
        {/* wind vane */}
        <g transform="translate(0 -84)">
          <path
            d="M-16 0 H14 M14 0 l-6 -4 v8Z M-16 0 l-5 -5 v10Z"
            fill="#ff7a45"
            stroke={INK}
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </g>
        {/* spinning anemometer cups */}
        <g transform="translate(0 -98)">
          <g className="spin-fast">
            {[0, 120, 240].map((a) => (
              <g key={a} transform={`rotate(${a})`}>
                <path d="M0 0 H15" stroke={INK} strokeWidth="1.6" />
                <path d="M15 -4 a4 4 0 0 1 0 8Z" fill="#f5bd4a" stroke={INK} strokeWidth="1" />
              </g>
            ))}
          </g>
          <circle r="2.6" fill={INK} />
        </g>
      </g>

      {sprouts.map((s, i) => (
        <Flower
          key={i}
          x={s.x}
          y={s.y}
          h={14 + s.row * 3}
          kind="sprout"
          scale={0.6 + s.row * 0.1}
          delay={0.2 + (i % 9) * 0.07 + s.row * 0.2}
        />
      ))}
    </Scene>
  );
}

/* Internship — the first sprout */
export function FirstSprout() {
  const gy = ground(200);
  return (
    <Scene label="Where it started: the first sprout" palette={SOIL} back={<Orb x={200} y={206} r={46} />}>
      {/* watering can pouring */}
      <g transform={`translate(118 ${gy - 92}) rotate(24)`}>
        <path
          d="M-20 -13 h30 a4 4 0 0 1 4 4 v20 a4 4 0 0 1 -4 4 h-30 a4 4 0 0 1 -4 -4 v-20 a4 4 0 0 1 4 -4Z"
          fill="#3d7f56"
          stroke={INK}
          strokeWidth="1.6"
        />
        <path d="M-20 -3 h34" stroke={INK} strokeWidth="1" opacity="0.4" />
        <path d="M14 0 L40 -16" stroke={INK} strokeWidth="7.5" strokeLinecap="round" />
        <path d="M14 0 L40 -16" stroke="#3d7f56" strokeWidth="4.5" strokeLinecap="round" />
        <ellipse
          cx="43"
          cy="-18"
          rx="5"
          ry="8.5"
          transform="rotate(-32 43 -18)"
          fill="#f5bd4a"
          stroke={INK}
          strokeWidth="1.4"
        />
        <path d="M-24 -6 C-40 -8 -40 12 -24 9" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M-14 -13 C-8 -26 6 -26 9 -13" fill="none" stroke={INK} strokeWidth="2.6" />
      </g>
      <g className="drips" stroke="#8fc4ff" strokeWidth="2.2" strokeLinecap="round">
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={164 + i * 6}
            y1={gy - 92 + i * 3}
            x2={170 + i * 7}
            y2={gy - 60 + i * 6}
            style={{ animationDelay: `${-i * 0.18}s` }}
          />
        ))}
      </g>

      {/* mound, cracked seed shell and the sprout */}
      <ellipse cx="200" cy={gy + 6} rx="50" ry="14" fill="#7a4326" stroke={INK} strokeWidth="1.5" />
      <path
        d={`M158 ${gy + 4} q20 -12 42 -12 q22 0 42 12`}
        fill="none"
        stroke="#9a5a36"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g transform={`translate(226 ${gy + 2})`}>
        <path d="M0 0 C-2 -9 8 -12 12 -5 C9 1 4 2 0 0Z" fill="#e9c877" stroke={INK} strokeWidth="1" />
        <path d="M3 -3 l3 -2 l1 3" fill="none" stroke={INK} strokeWidth="0.7" />
      </g>
      <Flower x={200} y={gy + 2} h={60} kind="sprout" scale={1.9} delay={0.3} />

      {/* the first IoT node, planted next to it */}
      <g transform={`translate(272 ${ground(272) + 4})`}>
        <path d="M0 0 V-30" stroke={CREAM} strokeWidth="2.6" strokeLinecap="round" />
        <rect x="-15" y="-52" width="30" height="24" rx="3" fill="#22422f" stroke={INK} strokeWidth="1.4" />
        <rect x="-8" y="-46" width="16" height="12" rx="1.5" fill="#12182b" />
        <path
          d="M-15 -47 h-4 M-15 -41 h-4 M-15 -35 h-4 M15 -47 h4 M15 -41 h4 M15 -35 h4"
          stroke="#f5bd4a"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="10" cy="-31" r="1.8" fill="#ff7a45" className="blink" />
        <path d="M0 -52 v-10" stroke={CREAM} strokeWidth="1.4" />
        <g fill="none" stroke="#f5bd4a" strokeWidth="1.3" strokeLinecap="round" transform="translate(0 -64)">
          {[5, 10].map((r, i) => (
            <path
              key={r}
              className="signal"
              style={{ animationDelay: `${i * 0.3}s` }}
              d={`M${-r} ${-r * 0.5} A${r} ${r} 0 0 1 ${r} ${-r * 0.5}`}
            />
          ))}
        </g>
      </g>

      {/* date marker */}
      <g transform={`translate(330 ${ground(330) + 4})`}>
        <path d="M0 0 V-28" stroke="#6b4526" strokeWidth="2.6" strokeLinecap="round" />
        <rect x="-26" y="-48" width="52" height="22" rx="4" fill={CREAM} stroke={INK} strokeWidth="1.4" />
        <text textAnchor="middle" y="-33" className="plot-tag">
          OCT 2023
        </text>
      </g>

      <Flower x={84} y={ground(84) + 4} h={18} kind="sprout" scale={0.7} delay={0.9} />
      <Flower x={128} y={ground(128) + 4} h={12} kind="sprout" scale={0.55} delay={1.1} />
    </Scene>
  );
}
