"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { CountUp } from "./count-up";

/* Every screen here is a simulation that illustrates the work — none of it is live production data. */

function Screen({
  label,
  children,
  innerRef,
}: {
  label: string;
  children: React.ReactNode;
  innerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={innerRef} className="crt-screen h-full min-h-[300px] flex flex-col">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 crt-bar">
        <span className="flex items-center gap-2">
          <span className="blink" aria-hidden="true">
            ●
          </span>
          {label}
        </span>
        <span className="opacity-60">Simulation</span>
      </div>
      <div className="flex-1 p-4 flex flex-col justify-center gap-4">{children}</div>
    </div>
  );
}

function useTick(active: boolean, ms: number) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setTick((t) => t + 1), ms);
    return () => window.clearInterval(id);
  }, [active, ms]);
  return tick;
}

/* ── Kloudtech: weather-station radar + streaming telemetry ── */

// Deterministic pseudo-random station positions (same on server and client).
const STATIONS = (() => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 25 }, () => {
    const angle = rand() * 360;
    const dist = 22 + rand() * 100;
    const rad = (angle * Math.PI) / 180;
    return {
      x: +(150 + dist * Math.sin(rad)).toFixed(1),
      y: +(150 - dist * Math.cos(rad)).toFixed(1),
      delay: +((((angle - 60 + 360) % 360) / 360) * 4).toFixed(2),
    };
  });
})();

const wave = (t: number, base: number, amp: number, speed: number) =>
  base + amp * Math.sin(t * speed) + amp * 0.4 * Math.sin(t * speed * 2.7 + 1);

export function RadarScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { margin: "-10% 0px" });
  const tick = useTick(active, 900);

  const temps = Array.from({ length: 28 }, (_, i) => wave(tick - 27 + i, 29, 1.6, 0.35));
  const temp = temps[temps.length - 1];
  const hum = wave(tick, 78, 6, 0.22);
  const wind = wave(tick, 14, 5, 0.4);
  const points = temps.map((v, i) => `${(i / 27) * 100},${(32 - (v - 26) * 5).toFixed(1)}`).join(" ");

  return (
    <Screen label="KloudTrack · 25 stations" innerRef={ref}>
      <svg
        viewBox="0 0 300 300"
        className="w-full max-w-[250px] mx-auto"
        role="img"
        aria-label="Radar of 25 weather stations"
      >
        <g fill="none" stroke="currentColor" strokeOpacity="0.3">
          <circle cx="150" cy="150" r="130" />
          <circle cx="150" cy="150" r="87" strokeDasharray="2 5" />
          <circle cx="150" cy="150" r="43" strokeDasharray="2 5" />
          <line x1="150" y1="20" x2="150" y2="280" />
          <line x1="20" y1="150" x2="280" y2="150" />
        </g>
        <g className="radar-sweep">
          <path d="M150 150 L150 20 A130 130 0 0 1 262.6 85 Z" fill="currentColor" fillOpacity="0.14" />
          <line x1="150" y1="150" x2="262.6" y2="85" stroke="currentColor" strokeWidth="1.5" />
        </g>
        {STATIONS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r="3.2"
            className="radar-blip"
            fill={i % 6 === 0 ? "#ff6b2c" : "currentColor"}
            style={{ animationDelay: `${s.delay}s` }}
          />
        ))}
      </svg>
      <div>
        <svg viewBox="0 0 100 34" preserveAspectRatio="none" className="w-full h-10" aria-hidden="true">
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="grid grid-cols-3 gap-2 mt-2 tabular-nums">
          <span>TEMP {temp.toFixed(1)}°C</span>
          <span className="text-center">HUM {hum.toFixed(0)}%</span>
          <span className="text-right">WIND {wind.toFixed(0)} km/h</span>
        </div>
      </div>
    </Screen>
  );
}

/* ── Concentrix: live translation relay + ticket migration ── */

const PHRASES = [
  { code: "ES", text: "¿Cómo puedo ayudarte hoy?" },
  { code: "FR", text: "Comment puis-je vous aider aujourd'hui ?" },
  { code: "DE", text: "Wie kann ich Ihnen heute helfen?" },
  { code: "JA", text: "本日はどのようなご用件でしょうか？" },
  { code: "TL", text: "Paano kita matutulungan ngayon?" },
  { code: "RO", text: "Cu ce vă pot ajuta astăzi?" },
  { code: "PT", text: "Como posso ajudar você hoje?" },
  { code: "IT", text: "Come posso aiutarti oggi?" },
];

export function RelayScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { margin: "-10% 0px" });
  const tick = useTick(active, 2200);
  const phrase = PHRASES[tick % PHRASES.length];

  return (
    <Screen label="Polyglot relay · Zendesk" innerRef={ref}>
      <div className="space-y-2">
        <div className="crt-bubble">
          <span className="crt-tag">EN</span>
          How can I help you today?
        </div>
        <div className="relay-line" aria-hidden="true" />
        <div className="crt-bubble crt-bubble-hot min-h-[4.25rem]" aria-live="off">
          <AnimatePresence mode="wait">
            <motion.div
              key={phrase.code}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <span className="crt-tag">{phrase.code}</span>
              <span className="font-jp">{phrase.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {PHRASES.map((p) => (
            <span key={p.code} className="crt-chip" data-on={p.code === phrase.code}>
              {p.code}
            </span>
          ))}
          <span className="crt-chip">+12</span>
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-1.5 tabular-nums">
          <span>Ticket migration</span>
          <span>
            <CountUp to={10000} duration={2.4} /> / 10,000
          </span>
        </div>
        <div className="crt-track">
          <motion.div
            className="crt-fill"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.4, ease: "easeOut" }}
          />
        </div>
        <div className="mt-1.5 opacity-70">0 records lost · 80% faster than manual</div>
      </div>
    </Screen>
  );
}

/* ── RevEarth: emissions by scope ── */

const QUARTERS = [
  { name: "Q1", scopes: [42, 61, 118] },
  { name: "Q2", scopes: [38, 66, 104] },
  { name: "Q3", scopes: [35, 58, 97] },
  { name: "Q4", scopes: [31, 52, 88] },
];
const SCOPE_LABELS = ["Scope 1 · Direct", "Scope 2 · Energy", "Scope 3 · Value chain"];
const SCOPE_COLORS = ["#ff6b2c", "#f4b63e", "currentColor"];

export function EmissionsScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { margin: "-10% 0px" });
  const tick = useTick(active, 2600);
  const q = QUARTERS[tick % QUARTERS.length];
  const total = q.scopes.reduce((a, b) => a + b, 0);

  return (
    <Screen label="GHG inventory · sample data" innerRef={ref}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="opacity-70 mb-1">Total emissions</div>
          <div className="text-3xl tabular-nums" style={{ fontFamily: "var(--stack-display)", fontWeight: 600 }}>
            {total}
            <span className="text-xs ml-1.5 opacity-70" style={{ fontFamily: "var(--stack-mono)" }}>
              tCO₂e
            </span>
          </div>
        </div>
        <div className="flex gap-1.5">
          {QUARTERS.map((x) => (
            <span key={x.name} className="crt-chip" data-on={x.name === q.name}>
              {x.name}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {q.scopes.map((v, i) => (
          <div key={SCOPE_LABELS[i]}>
            <div className="flex justify-between mb-1.5 tabular-nums">
              <span>{SCOPE_LABELS[i]}</span>
              <span>{v}</span>
            </div>
            <div className="crt-track">
              <motion.div
                className="crt-fill"
                style={{ background: SCOPE_COLORS[i], transformOrigin: "left" }}
                animate={{ scaleX: v / 130 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="opacity-70">Factors: EPA · IPCC AR5 · PH DOE 2024</div>
    </Screen>
  );
}

/* ── Internship: boot sequence ── */

const BOOT = [
  "> flash esp32 --firmware weather-node",
  "  writing .......... OK",
  "> audit endpoints --harden",
  "  security checks .. OK",
  "> ship webapp --optimize",
  "  bundle trimmed ... OK",
  "> status",
  "  READY FOR LIFTOFF",
];
const BOOT_TOTAL = BOOT.reduce((n, l) => n + l.length, 0);

export function BootScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { once: true, margin: "-15% 0px" });
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(
      () =>
        setTyped((n) => {
          if (n >= BOOT_TOTAL) {
            window.clearInterval(id);
            return n;
          }
          return reduce ? BOOT_TOTAL : n + 2;
        }),
      30,
    );
    return () => window.clearInterval(id);
  }, [active]);

  const offsets = BOOT.map((_, i) => BOOT.slice(0, i).reduce((n, l) => n + l.length, 0));
  return (
    <Screen label="Boot log · Oct 2023" innerRef={ref}>
      <div className="space-y-1 min-h-[13rem]" aria-label={BOOT.join(" ")}>
        {BOOT.map((line, i) => {
          const shown = line.slice(0, Math.max(0, typed - offsets[i]));
          if (!shown) return null;
          const last = typed <= offsets[i] + line.length || i === BOOT.length - 1;
          return (
            <div
              key={i}
              className="whitespace-pre-wrap"
              style={{ color: line.includes("READY") ? "#ff6b2c" : undefined }}
            >
              {shown}
              {last && <span className="blink">█</span>}
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
