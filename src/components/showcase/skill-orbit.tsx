"use client";

import { useState } from "react";
import Image from "next/image";
import { SKILL_ICONS } from "@/lib/career-data";

const RINGS = [
  { id: "backend", label: "Backend", size: 28, speed: 38 },
  { id: "cloud", label: "Cloud", size: 40, speed: 52 },
  { id: "database", label: "Database", size: 52, speed: 64 },
  { id: "tool", label: "Tools", size: 64, speed: 78 },
  { id: "frontend", label: "Frontend", size: 77, speed: 92 },
  { id: "language", label: "Languages", size: 90, speed: 110 },
].map((r) => ({ ...r, items: SKILL_ICONS.filter((s) => s.category === r.id) }));

/** The toolset as a solar system: one ring per discipline. Tap a discipline to light up its ring. */
export function SkillOrbit() {
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? RINGS.filter((r) => r.id === active) : RINGS;

  return (
    <div className="grid lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-7">
        <div className="skill-orbit" data-focus={active ? "true" : "false"}>
          {RINGS.map((ring, ri) => (
            <div
              key={ring.id}
              className="skill-ring"
              data-on={active === ring.id}
              style={{
                width: `${ring.size}%`,
                height: `${ring.size}%`,
                animationDuration: `${ring.speed}s`,
                animationDirection: ri % 2 ? "reverse" : "normal",
              }}
            >
              {ring.items.map((s, i) => {
                const angle = (360 / ring.items.length) * i + ri * 17;
                return (
                  <div key={s.id} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
                    <div className="skill-sat" style={{ transform: `translate(-50%, -50%) rotate(${-angle}deg)` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://skillicons.dev/icons?i=${s.id}`}
                        alt={s.label}
                        title={s.label}
                        loading="lazy"
                        style={{
                          animationDuration: `${ring.speed}s`,
                          animationDirection: ri % 2 ? "normal" : "reverse",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div className="skill-core">
            <Image src="/logo.png" alt="" width={56} height={56} className="w-full h-full" />
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter skills by discipline">
          <button className="chip" data-active={active === null} onClick={() => setActive(null)}>
            All · {SKILL_ICONS.length}
          </button>
          {RINGS.map((r) => (
            <button
              key={r.id}
              className="chip"
              data-active={active === r.id}
              aria-pressed={active === r.id}
              onClick={() => setActive(active === r.id ? null : r.id)}
            >
              {r.label} · {r.items.length}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {shown.map((r) => (
            <div key={r.id}>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="meta-label w-24 shrink-0">{r.label}</span>
                <div className="gauge flex-1">
                  <div className="gauge-fill" style={{ width: `${(r.items.length / 9) * 100}%` }} />
                </div>
              </div>
              {active && (
                <div className="flex flex-wrap gap-2 pt-3">
                  {r.items.map((s) => (
                    <span key={s.id} className="skill-chip">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://skillicons.dev/icons?i=${s.id}`} alt="" loading="lazy" />
                      {s.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {!active && (
          <p className="meta-label mt-6" style={{ color: "var(--accent)" }}>
            Tap a discipline to light up its orbit →
          </p>
        )}
      </div>
    </div>
  );
}
