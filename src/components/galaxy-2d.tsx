"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────

type BodyKind = "work" | "education" | "project";

type SpaceBody = {
  name: string;
  kind: BodyKind;
  orbitR: number;
  orbitSpeed: number;
  orbitOffset: number;
  bodyR: number;
  color: string;
  hasRing?: boolean;
  // card data
  title: string;
  sub?: string;
  period?: string;
  desc: string;
};

type NearInfo = { body: SpaceBody; screenX: number; screenY: number } | null;

// ── Star hash ─────────────────────────────────────────────────────────────────

function lcg(s: number): number {
  return (((s * 1664525 + 1013904223) & 0xffffffff) >>> 0);
}

// ── Portfolio data ────────────────────────────────────────────────────────────

const BODIES: SpaceBody[] = [
  // Work
  {
    name: "Kloudtech", kind: "work",
    orbitR: 180, orbitSpeed: 0.09, orbitOffset: 0.5, bodyR: 16, color: "#f97316",
    title: "IT Intern → Software Engineer", period: "Aug 2022 – Present",
    desc: "Full-stack development, cloud infrastructure, and internal tooling.",
  },
  {
    name: "RevEarth", kind: "work",
    orbitR: 295, orbitSpeed: 0.055, orbitOffset: 2.1, bodyR: 14, color: "#22c55e",
    title: "Software Developer", period: "Jan 2024 – Jun 2024",
    desc: "Greentech startup. IoT dashboards and sensor data pipelines.",
  },
  {
    name: "Concentrix", kind: "work",
    orbitR: 405, orbitSpeed: 0.037, orbitOffset: 4.2, bodyR: 13, color: "#a855f7",
    title: "Technical Support Analyst", period: "2021 – 2022",
    desc: "Customer-facing technical support and internal scripting.",
  },
  // Education
  {
    name: "BPSU", kind: "education",
    orbitR: 540, orbitSpeed: 0.022, orbitOffset: 1.0, bodyR: 18, color: "#facc15", hasRing: true,
    title: "BS Information Technology", sub: "Bataan Peninsula State University",
    period: "2020 – 2024", desc: "Graduated with honors. Thesis on real-time fleet tracking.",
  },
  {
    name: "Microcity", kind: "education",
    orbitR: 670, orbitSpeed: 0.016, orbitOffset: 3.8, bodyR: 13, color: "#67e8f9",
    title: "Technical Vocational – ICT", sub: "Microcity College",
    period: "2018 – 2020", desc: "Computer systems servicing and network administration.",
  },
  // Projects
  {
    name: "KloudTrack", kind: "project",
    orbitR: 230, orbitSpeed: 0.066, orbitOffset: 1.6, bodyR: 10, color: "#60a5fa",
    title: "Fleet Tracking System", desc: "Real-time GPS fleet management — Next.js + Supabase.",
  },
  {
    name: "Logcha", kind: "project",
    orbitR: 345, orbitSpeed: 0.048, orbitOffset: 0.3, bodyR: 9, color: "#f472b6",
    title: "Chat Logger", desc: "Discord-style message logging with full-text search.",
  },
  {
    name: "Jobowl", kind: "project",
    orbitR: 460, orbitSpeed: 0.031, orbitOffset: 2.7, bodyR: 9, color: "#34d399",
    title: "Job Board Platform", desc: "Aggregated listings with smart filtering and alerts.",
  },
  {
    name: "HananAI", kind: "project",
    orbitR: 315, orbitSpeed: 0.054, orbitOffset: 5.0, bodyR: 10, color: "#fb923c",
    title: "AI Companion", desc: "GPT-powered conversational assistant for task management.",
  },
  {
    name: "Databox", kind: "project",
    orbitR: 495, orbitSpeed: 0.027, orbitOffset: 1.2, bodyR: 9, color: "#c084fc",
    title: "Analytics Dashboard", desc: "Data visualisation platform built with D3 + React.",
  },
  {
    name: "Knowt", kind: "project",
    orbitR: 590, orbitSpeed: 0.021, orbitOffset: 3.3, bodyR: 8, color: "#86efac",
    title: "Note-taking App", desc: "Markdown-first notes with AI-generated summaries.",
  },
];

const BELT_R = 760;

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
  onSwitch3D: () => void;
}

export function Galaxy2D({ onClose, onSwitch3D }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nearRef = useRef<NearInfo>(null);
  const [nearInfo, setNearInfo] = useState<NearInfo>(null);
  const [selected, setSelected] = useState<SpaceBody | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let running = true;
    let rafId = 0;
    let frame = 0;
    let prevTime = performance.now();

    // Ship state
    const ship = { x: 0, y: 0, vx: 0, vy: 0, angle: -Math.PI / 2 };
    let targetAngle = -Math.PI / 2;
    const keys: Record<string, boolean> = {};

    // Particles
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number };
    const particles: Particle[] = [];

    // ── Helpers ──────────────────────────────────────────────────────────────

    const STAR_CELL = 220;
    const STARS_PER_CELL = 6;
    const PARALLAX = [0.07, 0.22, 0.52];

    function drawStarLayer(W: number, H: number, p: number, layer: number, alpha: number, sz: number) {
      const camX = ship.x * p;
      const camY = ship.y * p;
      const cxW = W / 2, cyH = H / 2;
      const cl = Math.floor((camX - W / 2 - 20) / STAR_CELL);
      const cr = Math.ceil((camX + W / 2 + 20) / STAR_CELL);
      const ct = Math.floor((camY - H / 2 - 20) / STAR_CELL);
      const cb = Math.ceil((camY + H / 2 + 20) / STAR_CELL);
      for (let cx2 = cl; cx2 <= cr; cx2++) {
        for (let cy2 = ct; cy2 <= cb; cy2++) {
          let seed = ((cx2 * 73856093) ^ (cy2 * 19349663) ^ (layer * 83492791)) >>> 0;
          for (let i = 0; i < STARS_PER_CELL; i++) {
            seed = lcg(seed);
            const lx = (seed % STAR_CELL + STAR_CELL) % STAR_CELL;
            seed = lcg(seed);
            const ly = (seed % STAR_CELL + STAR_CELL) % STAR_CELL;
            seed = lcg(seed);
            const bright = 0.35 + (seed % 65) / 100;
            const wx = cx2 * STAR_CELL + lx;
            const wy = cy2 * STAR_CELL + ly;
            const sx = cxW + wx - camX;
            const sy = cyH + wy - camY;
            ctx.globalAlpha = alpha * bright;
            ctx.fillStyle = "#fff";
            ctx.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawShip(cx: number, cy: number, thrusting: boolean) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ship.angle + Math.PI / 2);

      // Engine exhaust
      if (thrusting) {
        const fh = 14 + Math.random() * 10;
        ctx.beginPath();
        ctx.moveTo(-5, 12); ctx.lineTo(5, 12); ctx.lineTo(0, 12 + fh);
        ctx.closePath();
        const fg = ctx.createLinearGradient(0, 12, 0, 12 + fh);
        fg.addColorStop(0, "rgba(255,210,60,0.95)");
        fg.addColorStop(0.45, "rgba(255,100,20,0.7)");
        fg.addColorStop(1, "rgba(255,40,0,0)");
        ctx.fillStyle = fg; ctx.fill();
      }

      // Hull glow
      const glow = ctx.createRadialGradient(0, 0, 6, 0, 0, 24);
      glow.addColorStop(0, "rgba(120,180,255,0.12)");
      glow.addColorStop(1, "rgba(120,180,255,0)");
      ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.fillStyle = glow; ctx.fill();

      // Wings
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(side * 4, 4);
        ctx.lineTo(side * 21, 15);
        ctx.lineTo(side * 12, 10);
        ctx.closePath();
        ctx.fillStyle = "#4a7fba"; ctx.fill();
        ctx.strokeStyle = "#6aaae0"; ctx.lineWidth = 1; ctx.stroke();
      }

      // Body
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(-8, 5); ctx.lineTo(-4, 11); ctx.lineTo(4, 11); ctx.lineTo(8, 5);
      ctx.closePath();
      ctx.fillStyle = "#c0d8f0"; ctx.fill();
      ctx.strokeStyle = "#7ab4f5"; ctx.lineWidth = 1.5; ctx.stroke();

      // Cockpit
      ctx.beginPath(); ctx.ellipse(0, -9, 4, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(100,215,255,0.65)"; ctx.fill();
      ctx.strokeStyle = "rgba(180,240,255,0.45)"; ctx.lineWidth = 1; ctx.stroke();

      ctx.restore();
    }

    function drawBody(body: SpaceBody, wx: number, wy: number, W: number, H: number) {
      const sx = W / 2 + wx - ship.x;
      const sy = H / 2 + wy - ship.y;
      if (sx < -250 || sx > W + 250 || sy < -250 || sy > H + 250) return;

      const r = body.bodyR;

      // Glow halo
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3);
      glow.addColorStop(0, body.color + "44");
      glow.addColorStop(1, body.color + "00");
      ctx.beginPath(); ctx.arc(sx, sy, r * 3, 0, Math.PI * 2);
      ctx.fillStyle = glow; ctx.fill();

      // Planet body
      const bodyGrad = ctx.createRadialGradient(sx - r * 0.3, sy - r * 0.35, r * 0.05, sx, sy, r);
      bodyGrad.addColorStop(0, body.color + "ff");
      bodyGrad.addColorStop(0.55, body.color + "cc");
      bodyGrad.addColorStop(1, body.color + "55");
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad; ctx.fill();

      // Saturn-style ring
      if (body.hasRing) {
        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(1, 0.28);
        ctx.beginPath(); ctx.arc(0, 0, r * 1.9, 0, Math.PI * 2);
        ctx.restore();
        ctx.strokeStyle = body.color + "77"; ctx.lineWidth = 3; ctx.stroke();
        ctx.save();
        ctx.translate(sx, sy); ctx.scale(1, 0.28);
        ctx.beginPath(); ctx.arc(0, 0, r * 1.55, 0, Math.PI * 2);
        ctx.restore();
        ctx.strokeStyle = body.color + "44"; ctx.lineWidth = 2; ctx.stroke();
      }

      // Label (fades in when close)
      const dist = Math.hypot(wx - ship.x, wy - ship.y);
      const labelA = Math.min(1, Math.max(0, 1 - (dist - 60) / 160));
      if (labelA > 0.05) {
        ctx.globalAlpha = labelA;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(body.name, sx, sy + r + 17);
        if (labelA > 0.45) {
          ctx.globalAlpha = labelA * 0.55;
          ctx.font = "9px monospace";
          ctx.fillStyle = body.color;
          ctx.fillText(body.title, sx, sy + r + 29);
        }
        ctx.globalAlpha = 1;
      }
    }

    function drawOrbitRing(orbitR: number, color: string, sunSX: number, sunSY: number) {
      ctx.beginPath(); ctx.arc(sunSX, sunSY, orbitR, 0, Math.PI * 2);
      ctx.strokeStyle = color + "1e";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 9]); ctx.stroke(); ctx.setLineDash([]);
    }

    function drawAsteroidBelt(sunSX: number, sunSY: number, t: number, W: number, H: number) {
      const N = 90;
      for (let i = 0; i < N; i++) {
        const angle = (i / N) * Math.PI * 2 + t * 0.007;
        const r = BELT_R + ((i * 137) % 44) - 22;
        const ax = sunSX + r * Math.cos(angle);
        const ay = sunSY + r * Math.sin(angle);
        if (ax < -10 || ax > W + 10 || ay < -10 || ay > H + 10) continue;
        const sz = 1 + (i % 3) * 0.8;
        ctx.globalAlpha = 0.4 + (i % 6) * 0.07;
        ctx.fillStyle = "#8899aa";
        ctx.beginPath(); ctx.arc(ax, ay, sz, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function spawnParticles(thrusting: boolean) {
      if (!thrusting || Math.random() > 0.6) return;
      const backAngle = ship.angle + Math.PI / 2 + Math.PI; // opposite to heading
      const spread = 0.4;
      particles.push({
        x: ship.x + Math.cos(backAngle) * 12,
        y: ship.y + Math.sin(backAngle) * 12,
        vx: ship.vx * 0.3 + Math.cos(backAngle + (Math.random() - 0.5) * spread) * 35,
        vy: ship.vy * 0.3 + Math.sin(backAngle + (Math.random() - 0.5) * spread) * 35,
        life: 0, maxLife: 0.5 + Math.random() * 0.4,
      });
    }

    function updateAndDrawParticles(dt: number, W: number, H: number) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vx *= 0.92; p.vy *= 0.92;
        const a = 1 - p.life / p.maxLife;
        const sx = W / 2 + p.x - ship.x;
        const sy = H / 2 + p.y - ship.y;
        ctx.globalAlpha = a * 0.7;
        ctx.fillStyle = a > 0.5 ? "#ffd060" : "#ff6020";
        ctx.beginPath(); ctx.arc(sx, sy, 1.5 * a + 0.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // ── Events ────────────────────────────────────────────────────────────────

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    onResize();
    window.addEventListener("resize", onResize);

    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (e.key === "Escape") onClose();
    };
    const onKeyUp = (e: KeyboardEvent) => { keys[e.key] = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const onClick = () => {
      if (nearRef.current) {
        setSelected(prev => prev?.name === nearRef.current?.body.name ? null : (nearRef.current?.body ?? null));
      }
    };
    canvas.addEventListener("click", onClick);

    // ── Main loop ─────────────────────────────────────────────────────────────

    const tick = (now: number) => {
      if (!running) return;
      rafId = requestAnimationFrame(tick);
      frame++;

      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;
      const t = now / 1000;

      const W = canvas.width, H = canvas.height;
      const SPEED = 240;
      const DAMP = 0.80;

      // Input
      let dx = 0, dy = 0;
      if (keys["w"] || keys["ArrowUp"])    dy -= 1;
      if (keys["s"] || keys["ArrowDown"])  dy += 1;
      if (keys["a"] || keys["ArrowLeft"])  dx -= 1;
      if (keys["d"] || keys["ArrowRight"]) dx += 1;
      const thrusting = dx !== 0 || dy !== 0;

      if (thrusting) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx /= len; dy /= len;
        ship.vx = dx * SPEED; ship.vy = dy * SPEED;
        targetAngle = Math.atan2(dy, dx);
      }
      ship.vx *= Math.pow(DAMP, dt * 60);
      ship.vy *= Math.pow(DAMP, dt * 60);
      ship.x += ship.vx * dt;
      ship.y += ship.vy * dt;

      // Smooth rotation
      let da = targetAngle - ship.angle;
      while (da > Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      ship.angle += da * Math.min(1, dt * 10);

      spawnParticles(thrusting);

      // ── Draw ──────────────────────────────────────────────────────────────

      ctx.fillStyle = "#00000c"; ctx.fillRect(0, 0, W, H);

      // Stars
      drawStarLayer(W, H, PARALLAX[0], 0, 0.4, 1);
      drawStarLayer(W, H, PARALLAX[1], 1, 0.6, 1.5);
      drawStarLayer(W, H, PARALLAX[2], 2, 0.85, 2);

      // Sun
      const sunSX = W / 2 - ship.x;
      const sunSY = H / 2 - ship.y;

      for (const [r, a] of [[130, 0.04], [85, 0.1], [55, 0.22]] as [number, number][]) {
        const g = ctx.createRadialGradient(sunSX, sunSY, 0, sunSX, sunSY, r);
        g.addColorStop(0, `rgba(255,220,80,${a})`); g.addColorStop(1, "rgba(255,100,0,0)");
        ctx.beginPath(); ctx.arc(sunSX, sunSY, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      }
      const sg = ctx.createRadialGradient(sunSX - 9, sunSY - 9, 2, sunSX, sunSY, 34);
      sg.addColorStop(0, "#fffde4"); sg.addColorStop(0.3, "#ffe566");
      sg.addColorStop(0.7, "#ff8c00"); sg.addColorStop(1, "rgba(255,60,0,0.3)");
      ctx.beginPath(); ctx.arc(sunSX, sunSY, 34, 0, Math.PI * 2); ctx.fillStyle = sg; ctx.fill();

      // Orbit rings
      for (const b of BODIES) drawOrbitRing(b.orbitR, b.color, sunSX, sunSY);
      // Asteroid belt ring
      ctx.beginPath(); ctx.arc(sunSX, sunSY, BELT_R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(160,160,180,0.1)"; ctx.lineWidth = 36; ctx.stroke();

      // Compute planet positions and draw
      const bodyPositions: { body: SpaceBody; wx: number; wy: number }[] = [];
      for (const b of BODIES) {
        const angle = t * b.orbitSpeed + b.orbitOffset;
        const wx = b.orbitR * Math.cos(angle);
        const wy = b.orbitR * Math.sin(angle);
        bodyPositions.push({ body: b, wx, wy });
        drawBody(b, wx, wy, W, H);
      }

      // Asteroid belt
      drawAsteroidBelt(sunSX, sunSY, t, W, H);

      // Engine particles
      updateAndDrawParticles(dt, W, H);

      // Ship (always at screen center)
      drawShip(W / 2, H / 2, thrusting);

      // ── Proximity (every 8 frames) ────────────────────────────────────────
      if (frame % 8 === 0) {
        let best: { body: SpaceBody; wx: number; wy: number; dist: number } | null = null;
        for (const { body, wx, wy } of bodyPositions) {
          const dist = Math.hypot(wx - ship.x, wy - ship.y);
          if (!best || dist < best.dist) best = { body, wx, wy, dist };
        }
        const near = best && best.dist < best.body.bodyR + 130 ? best : null;
        const prev = nearRef.current;
        if (near?.body.name !== prev?.body.name) {
          const next: NearInfo = near
            ? { body: near.body, screenX: W / 2 + near.wx - ship.x, screenY: H / 2 + near.wy - ship.y }
            : null;
          nearRef.current = next;
          setNearInfo(next);
        }
      }

      // ── HUD ───────────────────────────────────────────────────────────────
      const spd = Math.round(Math.hypot(ship.vx, ship.vy));
      ctx.globalAlpha = 0.3; ctx.fillStyle = "#fff"; ctx.font = "9px monospace"; ctx.textAlign = "left";
      ctx.fillText(`SPD ${String(spd).padStart(3, "0")}  X ${Math.round(ship.x)}  Y ${Math.round(ship.y)}`, 16, H - 12);
      ctx.globalAlpha = 1;
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("click", onClick);
    };
  }, [onClose]);

  // ── JSX ───────────────────────────────────────────────────────────────────

  const kindLabel =
    selected?.kind === "work"      ? "◉ WORK EXPERIENCE" :
    selected?.kind === "education" ? "◯ EDUCATION"       : "◆ PROJECT";

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />

      {/* Controls hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="text-[10px] font-mono text-white/25 tracking-widest">
          WASD / ↑↓←→ move · click planet to inspect · ESC exit
        </p>
      </div>

      {/* Nearby planet prompt */}
      <AnimatePresence>
        {nearInfo && !selected && (
          <motion.div
            key={nearInfo.body.name}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ top: "57%" }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[11px] font-mono text-white/50 text-center">
              click to inspect{" "}
              <span style={{ color: nearInfo.body.color }}>{nearInfo.body.name}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.name}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 w-80 rounded-lg font-mono text-sm"
            style={{
              background: "rgba(0,0,18,0.92)",
              border: `1px solid ${selected.color}44`,
              boxShadow: `0 0 40px ${selected.color}18`,
              backdropFilter: "blur(12px)",
              padding: "16px 18px",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.28)" }}>
                {kindLabel}
              </p>
              <button
                className="text-white/30 hover:text-white/70 text-xs ml-3 -mt-0.5"
                onClick={() => setSelected(null)}
              >✕</button>
            </div>
            <p className="font-bold text-sm leading-snug" style={{ color: selected.color }}>
              {selected.title}
            </p>
            {selected.sub && (
              <p className="text-white/50 text-xs mt-0.5">{selected.sub}</p>
            )}
            {selected.period && (
              <p className="text-[10px] mt-1" style={{ color: selected.color + "99" }}>{selected.period}</p>
            )}
            <p className="text-white/60 text-xs mt-2 leading-relaxed">{selected.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={onSwitch3D}
          className="text-[10px] font-mono px-3 py-1.5 rounded transition-colors"
          style={{
            border: "1px solid rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.45)",
            background: "rgba(0,0,20,0.6)",
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.8)"; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
        >
          3D explore
        </button>
        <button
          onClick={onClose}
          className="text-[10px] font-mono px-3 py-1.5 rounded transition-colors"
          style={{
            border: "1px solid rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.45)",
            background: "rgba(0,0,20,0.6)",
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.8)"; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
        >
          [ESC] exit
        </button>
      </div>

      {/* View label */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase">
          ◈ 2D navigation mode ◈
        </p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-12 left-5 space-y-1 pointer-events-none">
        <p className="text-[9px] font-mono" style={{ color: "rgba(255,200,70,0.45)" }}>✦ sun — that&apos;s me</p>
        <p className="text-[9px] font-mono" style={{ color: "rgba(100,150,255,0.4)" }}>◉ inner — work experience</p>
        <p className="text-[9px] font-mono" style={{ color: "rgba(245,200,66,0.4)" }}>◉ gold ring — education</p>
        <p className="text-[9px] font-mono" style={{ color: "rgba(200,150,255,0.35)" }}>◆ outer — projects</p>
      </div>
    </div>
  );
}
