"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────

type BodyKind = "work" | "education" | "project";

type SpaceBody = {
  worldX: number;
  worldY: number;   // vertical offset from center (px)
  kind: BodyKind;
  name: string;
  title: string;
  sub?: string;
  period?: string;
  desc: string;
  color: string;
  radius: number;
  hasRing?: boolean;
};

type Waypoint = { x: number; text: string };

// ── World layout ──────────────────────────────────────────────────────────────

const WORLD_END = 47000;

const BODIES: SpaceBody[] = [
  // Work
  { worldX: 3500,  worldY: -80,  kind: "work",
    name: "Kloudtech",  title: "IT Intern → Software Engineer",
    period: "Aug 2022 – Present", color: "#f97316", radius: 52,
    desc: "Full-stack development, cloud infrastructure, and internal tooling." },
  { worldX: 8000,  worldY:  70,  kind: "work",
    name: "RevEarth",   title: "Software Developer",
    period: "Jan 2024 – Jun 2024", color: "#22c55e", radius: 44,
    desc: "Greentech startup — IoT dashboards and sensor data pipelines." },
  { worldX: 13000, worldY: -55,  kind: "work",
    name: "Concentrix", title: "Technical Support Analyst",
    period: "2021 – 2022", color: "#a855f7", radius: 38,
    desc: "Customer-facing technical support and internal scripting." },
  // Education
  { worldX: 19500, worldY:  45,  kind: "education",
    name: "BPSU",     title: "BS Information Technology",
    sub: "Bataan Peninsula State University",
    period: "2020 – 2024", color: "#facc15", radius: 62, hasRing: true,
    desc: "Graduated with honors. Thesis on real-time GPS fleet tracking." },
  { worldX: 25000, worldY: -75,  kind: "education",
    name: "Microcity", title: "Technical Vocational – ICT",
    sub: "Microcity College",
    period: "2018 – 2020", color: "#67e8f9", radius: 38,
    desc: "Computer systems servicing and network administration." },
  // Projects
  { worldX: 29500, worldY:  90,  kind: "project",
    name: "KloudTrack", title: "Fleet Tracking System",
    color: "#60a5fa", radius: 30,
    desc: "Real-time GPS fleet management — Next.js + Supabase." },
  { worldX: 32500, worldY: -95,  kind: "project",
    name: "Logcha",    title: "Chat Logger",
    color: "#f472b6", radius: 26,
    desc: "Discord-style message logging with full-text search." },
  { worldX: 35500, worldY:  60,  kind: "project",
    name: "Jobowl",    title: "Job Board Platform",
    color: "#34d399", radius: 28,
    desc: "Aggregated job listings with smart filtering and alerts." },
  { worldX: 38500, worldY: -50,  kind: "project",
    name: "HananAI",   title: "AI Companion",
    color: "#fb923c", radius: 30,
    desc: "GPT-powered conversational assistant for task management." },
  { worldX: 41500, worldY:  80,  kind: "project",
    name: "Databox",   title: "Analytics Dashboard",
    color: "#c084fc", radius: 26,
    desc: "Data visualisation platform built with D3 + React." },
  { worldX: 44500, worldY: -65,  kind: "project",
    name: "Knowt",     title: "Note-taking App",
    color: "#86efac", radius: 24,
    desc: "Markdown-first notes with AI-generated summaries." },
];

const WAYPOINTS: Waypoint[] = [
  { x: 900,   text: "scroll down to fly forward →" },
  { x: 2000,  text: "this is my story, written in space." },
  { x: 5600,  text: "3+ years of shipping real software." },
  { x: 10200, text: "still out here in the black…" },
  { x: 15000, text: "— asteroid belt — skills & languages —" },
  { x: 17500, text: "education sector ahead." },
  { x: 22500, text: "keep going." },
  { x: 27500, text: "projects start here." },
  { x: 31000, text: "still building things." },
  { x: 34500, text: "not stopping yet…" },
  { x: 38000, text: "almost at the edge." },
  { x: 42500, text: "you really scrolled all the way here." },
  { x: 46000, text: "— end of known universe —" },
];

// Skills asteroid belt  (worldX 15500–17000)
const SKILLS = [
  "TypeScript","JavaScript","Python","Go","C#",
  "React","Next.js","Node.js","Tailwind","Framer Motion",
  "PostgreSQL","Redis","Docker","AWS","Supabase",
  "Prisma","Three.js","Git",
];

const BELT_START = 15500;
const BELT_END   = 17000;

// Pre-generate asteroids (deterministic)
function lcg(s: number) { return (((s * 1664525 + 1013904223) & 0xffffffff) >>> 0); }

const ASTEROIDS = Array.from({ length: 130 }, (_, i) => {
  let s = lcg(i * 7919 + 3571);
  const x = BELT_START + (s % (BELT_END - BELT_START));
  s = lcg(s); const y = (s % 320) - 160;
  s = lcg(s); const sz = 1.5 + (s % 30) / 10;
  s = lcg(s); const skill = i < SKILLS.length ? SKILLS[i % SKILLS.length] : null;
  s = lcg(s); const bright = 0.4 + (s % 50) / 100;
  return { x, y, sz, skill, bright };
});

// Nebula clouds
const NEBULAE = [
  { x:  1200, y: -120, r: 500, r2: 220, c: "rgba(60,20,100,0.18)"  },
  { x:  6500, y:  140, r: 420, r2: 180, c: "rgba(10,60,130,0.14)"  },
  { x: 11000, y:  -80, r: 480, r2: 200, c: "rgba(80,10,80,0.15)"   },
  { x: 16000, y:  100, r: 600, r2: 280, c: "rgba(20,50,120,0.12)"  },
  { x: 22000, y: -150, r: 450, r2: 190, c: "rgba(40,80,40,0.11)"   },
  { x: 30000, y:   90, r: 500, r2: 210, c: "rgba(100,20,60,0.13)"  },
  { x: 38000, y: -110, r: 460, r2: 195, c: "rgba(20,70,110,0.12)"  },
  { x: 45000, y:   60, r: 500, r2: 230, c: "rgba(60,10,100,0.15)"  },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface Props { onClose: () => void; onSwitch3D: () => void; }

export function Galaxy2D({ onClose, onSwitch3D }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const selectedRef = useRef<SpaceBody | null>(null);
  const [selected, setSelected] = useState<SpaceBody | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let running  = true;
    let rafId    = 0;
    let cameraX  = 0;
    let targetX  = 0;
    let bobT     = 0;
    let prevTime = performance.now();

    // ── Resize ─────────────────────────────────────────────────────────────
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    onResize();
    window.addEventListener("resize", onResize);

    // ── Input ──────────────────────────────────────────────────────────────
    const SCROLL_SPEED = 4;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetX = Math.max(0, Math.min(WORLD_END, targetX + e.deltaY * SCROLL_SPEED));
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });

    const keys: Record<string, boolean> = {};
    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (e.key === "Escape") onClose();
    };
    const onKeyUp = (e: KeyboardEvent) => { keys[e.key] = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Click to select/deselect
    const onClick = () => {
      const near = getNearBody(canvas.width);
      if (near) {
        const next = selectedRef.current?.name === near.name ? null : near;
        selectedRef.current = next;
        setSelected(next);
      }
    };
    canvas.addEventListener("click", onClick);

    // ── Helpers ────────────────────────────────────────────────────────────

    const STAR_CELL  = 280;
    const STARS_CELL = 5;
    const PARALLAX   = [0.04, 0.18, 0.48];

    function drawStars(W: number, H: number) {
      for (let layer = 0; layer < 3; layer++) {
        const p = PARALLAX[layer];
        const camX = cameraX * p;
        const baseAlpha = [0.4, 0.6, 0.85][layer];
        const baseSz    = [1, 1.4, 2][layer];

        const cl = Math.floor((camX - W / 2 - 20) / STAR_CELL);
        const cr = Math.ceil( (camX + W / 2 + 20) / STAR_CELL);
        const ct = Math.floor((-H / 2 - 20)       / STAR_CELL);
        const cb = Math.ceil( ( H / 2 + 20)       / STAR_CELL);

        for (let cx2 = cl; cx2 <= cr; cx2++) {
          for (let cy2 = ct; cy2 <= cb; cy2++) {
            let seed = ((cx2 * 73856093) ^ (cy2 * 19349663) ^ (layer * 83492791)) >>> 0;
            for (let i = 0; i < STARS_CELL; i++) {
              seed = lcg(seed);
              const lx = (seed % STAR_CELL + STAR_CELL) % STAR_CELL;
              seed = lcg(seed);
              const ly = (seed % STAR_CELL + STAR_CELL) % STAR_CELL;
              seed = lcg(seed);
              const bright = 0.3 + (seed % 70) / 100;
              const wx = cx2 * STAR_CELL + lx;
              const wy = cy2 * STAR_CELL + ly;
              ctx.globalAlpha = baseAlpha * bright;
              ctx.fillStyle = "#fff";
              ctx.fillRect(W / 2 + wx - camX - 0.5, H / 2 + wy - 0.5, baseSz, baseSz);
            }
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawNebulae(W: number, H: number) {
      for (const nb of NEBULAE) {
        const sx = W / 2 + nb.x - cameraX;
        if (sx < -nb.r - 50 || sx > W + nb.r + 50) continue;
        const sy = H / 2 + nb.y;
        const g = ctx.createRadialGradient(sx, sy, nb.r2 * 0.3, sx, sy, nb.r);
        g.addColorStop(0, nb.c);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(sx, sy, nb.r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      }
    }

    function drawSun(W: number, H: number) {
      const sx = W / 2 - cameraX;
      const sy = H / 2;
      if (sx < -250 || sx > W + 250) return;

      // Corona layers
      for (const [r, a] of [[180, 0.03], [110, 0.08], [70, 0.18]] as [number,number][]) {
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
        g.addColorStop(0, `rgba(255,210,80,${a})`); g.addColorStop(1, "rgba(255,100,0,0)");
        ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      }
      // Body
      const sg = ctx.createRadialGradient(sx - 10, sy - 10, 3, sx, sy, 38);
      sg.addColorStop(0, "#fffde6"); sg.addColorStop(0.35, "#ffe566");
      sg.addColorStop(0.75, "#ff8c00"); sg.addColorStop(1, "rgba(255,50,0,0.4)");
      ctx.beginPath(); ctx.arc(sx, sy, 38, 0, Math.PI * 2); ctx.fillStyle = sg; ctx.fill();

      // "Me" label
      if (sx > -100 && sx < W + 100) {
        ctx.globalAlpha = Math.max(0, 1 - Math.abs(sx - W / 2) / (W * 0.6));
        ctx.fillStyle = "#ffe566"; ctx.font = "bold 13px monospace";
        ctx.textAlign = "center"; ctx.fillText("— me —", sx, sy + 58);
        ctx.globalAlpha = 1;
      }
    }

    function drawBody(b: SpaceBody, W: number, H: number) {
      const sx = W / 2 + b.worldX - cameraX;
      const sy = H / 2 + b.worldY;
      if (sx < -b.radius - 100 || sx > W + b.radius + 100) return;

      // Glow
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, b.radius * 3.5);
      g.addColorStop(0, b.color + "44"); g.addColorStop(1, b.color + "00");
      ctx.beginPath(); ctx.arc(sx, sy, b.radius * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();

      // Body
      const bg = ctx.createRadialGradient(sx - b.radius * 0.3, sy - b.radius * 0.35, b.radius * 0.05, sx, sy, b.radius);
      bg.addColorStop(0, b.color + "ff"); bg.addColorStop(0.55, b.color + "cc"); bg.addColorStop(1, b.color + "55");
      ctx.beginPath(); ctx.arc(sx, sy, b.radius, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill();

      // Ring
      if (b.hasRing) {
        ctx.save(); ctx.translate(sx, sy); ctx.scale(1, 0.26);
        ctx.beginPath(); ctx.arc(0, 0, b.radius * 1.9, 0, Math.PI * 2);
        ctx.restore();
        ctx.strokeStyle = b.color + "70"; ctx.lineWidth = 3; ctx.stroke();
        ctx.save(); ctx.translate(sx, sy); ctx.scale(1, 0.26);
        ctx.beginPath(); ctx.arc(0, 0, b.radius * 1.5, 0, Math.PI * 2);
        ctx.restore();
        ctx.strokeStyle = b.color + "40"; ctx.lineWidth = 2; ctx.stroke();
      }

      // Label — fade in as it approaches screen center
      const distFromCenter = Math.abs(sx - W / 2);
      const labelA = Math.max(0, 1 - distFromCenter / (W * 0.52));
      if (labelA > 0.02) {
        ctx.globalAlpha = labelA;
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${Math.round(11 + b.radius * 0.1)}px monospace`;
        ctx.textAlign = "center";
        ctx.fillText(b.name, sx, sy + b.radius + 20);

        if (labelA > 0.45 && b.title) {
          ctx.globalAlpha = labelA * 0.5;
          ctx.font = "10px monospace";
          ctx.fillStyle = b.color;
          ctx.fillText(b.title, sx, sy + b.radius + 34);
        }
        if (labelA > 0.7 && b.period) {
          ctx.globalAlpha = labelA * 0.35;
          ctx.font = "9px monospace";
          ctx.fillStyle = "#aaa";
          ctx.fillText(b.period, sx, sy + b.radius + 46);
        }
        ctx.globalAlpha = 1;
      }
    }

    function drawAsteroidBelt(W: number, H: number) {
      for (const a of ASTEROIDS) {
        const sx = W / 2 + a.x - cameraX;
        const sy = H / 2 + a.y;
        if (sx < -10 || sx > W + 10) continue;

        ctx.globalAlpha = a.bright;
        ctx.fillStyle = "#8899aa";
        ctx.beginPath(); ctx.arc(sx, sy, a.sz, 0, Math.PI * 2); ctx.fill();

        // Skill label when near screen center
        if (a.skill) {
          const d = Math.abs(sx - W / 2);
          if (d < 180) {
            const la = Math.max(0, 1 - d / 180) * 0.7;
            ctx.globalAlpha = la;
            ctx.fillStyle = "#99aacc";
            ctx.font = "9px monospace";
            ctx.textAlign = "center";
            ctx.fillText(a.skill, sx, sy - a.sz - 6);
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawWaypoints(W: number, H: number) {
      for (const wp of WAYPOINTS) {
        const sx = W / 2 + wp.x - cameraX;
        if (sx < -50 || sx > W + 50) continue;
        const d = Math.abs(sx - W / 2);
        const a = Math.max(0, 1 - d / (W * 0.46)) * 0.32;
        if (a < 0.01) continue;
        ctx.globalAlpha = a;
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(wp.text, sx, H / 2 + 155);
        ctx.globalAlpha = 1;
      }
    }

    function drawShip(W: number, H: number, speed: number) {
      const cx = W / 2;
      const cy = H / 2 + Math.sin(bobT) * 4; // gentle bob
      const thrust = Math.min(1, speed / 80);

      ctx.save();
      ctx.translate(cx, cy);
      // ship points right

      // Engine glow
      if (thrust > 0.05) {
        const fLen = 14 + thrust * 20 + Math.random() * 8;
        const fg = ctx.createLinearGradient(-14, 0, -14 - fLen, 0);
        fg.addColorStop(0, `rgba(255,200,60,${0.9 * thrust})`);
        fg.addColorStop(0.5, `rgba(255,90,20,${0.6 * thrust})`);
        fg.addColorStop(1, "rgba(255,40,0,0)");
        ctx.beginPath();
        ctx.moveTo(-14, -5); ctx.lineTo(-14, 5); ctx.lineTo(-14 - fLen, 0);
        ctx.closePath(); ctx.fillStyle = fg; ctx.fill();
      }

      // Hull glow
      const hg = ctx.createRadialGradient(0, 0, 8, 0, 0, 26);
      hg.addColorStop(0, "rgba(120,180,255,0.1)"); hg.addColorStop(1, "rgba(120,180,255,0)");
      ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.fillStyle = hg; ctx.fill();

      // Top fin
      ctx.beginPath();
      ctx.moveTo(-6, -6); ctx.lineTo(2, -6); ctx.lineTo(2, -16); ctx.closePath();
      ctx.fillStyle = "#3a6fa0"; ctx.fill();

      // Bottom fin
      ctx.beginPath();
      ctx.moveTo(-6, 6); ctx.lineTo(2, 6); ctx.lineTo(2, 16); ctx.closePath();
      ctx.fillStyle = "#3a6fa0"; ctx.fill();

      // Body
      ctx.beginPath();
      ctx.moveTo(22, 0);       // nose
      ctx.lineTo(-10, -10);    // top-left
      ctx.lineTo(-14, -6);     // top engine
      ctx.lineTo(-14,  6);     // bottom engine
      ctx.lineTo(-10,  10);    // bottom-left
      ctx.closePath();
      ctx.fillStyle = "#c0d8f0"; ctx.fill();
      ctx.strokeStyle = "#7ab4f5"; ctx.lineWidth = 1.5; ctx.stroke();

      // Cockpit
      ctx.beginPath(); ctx.ellipse(8, 0, 6, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(100,215,255,0.65)"; ctx.fill();
      ctx.strokeStyle = "rgba(180,240,255,0.4)"; ctx.lineWidth = 1; ctx.stroke();

      ctx.restore();
    }

    function getNearBody(W: number): SpaceBody | null {
      let best: SpaceBody | null = null;
      let bestD = Infinity;
      for (const b of BODIES) {
        const sx = W / 2 + b.worldX - cameraX;
        const d = Math.abs(sx - W / 2);
        if (d < b.radius + 160 && d < bestD) { best = b; bestD = d; }
      }
      return best;
    }

    // ── Main loop ──────────────────────────────────────────────────────────

    const tick = (now: number) => {
      if (!running) return;
      rafId = requestAnimationFrame(tick);

      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;

      // Keyboard movement
      const KEY_SPEED = 600;
      if (keys["ArrowRight"] || keys["d"]) targetX = Math.min(WORLD_END, targetX + KEY_SPEED * dt);
      if (keys["ArrowLeft"]  || keys["a"]) targetX = Math.max(0,         targetX - KEY_SPEED * dt);

      // Smooth camera
      const prevCamX = cameraX;
      cameraX += (targetX - cameraX) * Math.min(1, dt * 7);
      const speed = Math.abs(cameraX - prevCamX) / dt;

      bobT += dt * 0.9;

      const W = canvas.width, H = canvas.height;

      // ── Background ──
      ctx.fillStyle = "#00000c"; ctx.fillRect(0, 0, W, H);

      drawNebulae(W, H);
      drawStars(W, H);
      drawAsteroidBelt(W, H);
      drawWaypoints(W, H);
      drawSun(W, H);

      for (const b of BODIES) drawBody(b, W, H);

      drawShip(W, H, speed);

      // ── Progress ──
      const p = Math.min(1, cameraX / WORLD_END);
      setProgress(p);

      // ── Nearby check (every 6 frames) ──
      if (Math.floor(now / 16) % 6 === 0) {
        const near = getNearBody(W);
        if (!near && selectedRef.current) {
          selectedRef.current = null; setSelected(null);
        }
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onClose]);

  // ── JSX ────────────────────────────────────────────────────────────────────

  const kindLabel =
    selected?.kind === "work"      ? "◉ WORK EXPERIENCE" :
    selected?.kind === "education" ? "◯ EDUCATION"       : "◆ PROJECT";

  return (
    <div className="relative w-full h-full bg-black">
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Info card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.name}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-80 rounded-lg font-mono text-sm pointer-events-auto"
            style={{
              background: "rgba(0,0,18,0.92)",
              border: `1px solid ${selected.color}44`,
              boxShadow: `0 0 40px ${selected.color}18`,
              backdropFilter: "blur(14px)",
              padding: "16px 18px",
            }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.28)" }}>
                {kindLabel}
              </p>
              <button className="text-white/30 hover:text-white/70 text-xs ml-3 -mt-0.5"
                onClick={() => { selectedRef.current = null; setSelected(null); }}>✕</button>
            </div>
            <p className="font-bold text-sm leading-snug" style={{ color: selected.color }}>{selected.title}</p>
            {selected.sub    && <p className="text-white/50 text-xs mt-0.5">{selected.sub}</p>}
            {selected.period && <p className="text-[10px] mt-1" style={{ color: selected.color + "99" }}>{selected.period}</p>}
            <p className="text-white/60 text-xs mt-2 leading-relaxed">{selected.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
        <motion.div
          className="h-full"
          style={{ width: `${progress * 100}%`, background: "linear-gradient(to right, #f97316, #facc15, #22c55e, #60a5fa)" }}
          transition={{ duration: 0 }}
        />
      </div>
      {/* Progress ship icon */}
      <div
        className="absolute bottom-1 text-[8px]"
        style={{ left: `calc(${progress * 100}% - 4px)`, color: "rgba(255,255,255,0.5)" }}
      >▶</div>

      {/* Controls hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="text-[10px] font-mono text-white/20 tracking-widest">
          scroll / ←→ keys to travel · click to inspect · ESC exit
        </p>
      </div>

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        {(["3D explore", "2D nav"] as const).map((label, i) => (
          <button key={label}
            onClick={i === 0 ? onSwitch3D : undefined}
            className="text-[10px] font-mono px-3 py-1.5 rounded"
            style={{
              border: "1px solid rgba(255,255,255,0.18)",
              color: i === 1 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)",
              background: i === 1 ? "rgba(255,255,255,0.08)" : "rgba(0,0,20,0.6)",
              cursor: i === 0 ? "pointer" : "default",
            }}
          >{label}</button>
        ))}
        <button onClick={onClose}
          className="text-[10px] font-mono px-3 py-1.5 rounded"
          style={{ border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.4)", background: "rgba(0,0,20,0.6)" }}
        >[ESC] exit</button>
      </div>

      {/* Mode label */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase">◈ 2D navigation · scroll to travel ◈</p>
      </div>
    </div>
  );
}
