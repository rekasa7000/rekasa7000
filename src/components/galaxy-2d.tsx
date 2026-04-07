"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ENTRIES, SKILLS as CAREER_SKILLS } from "@/lib/career-data";

// ── Types ─────────────────────────────────────────────────────────────────────

type BodyKind = "work" | "education" | "project";

type Satellite = {
  label: string;
  color: string;
  orbitR: number;
  speed: number;
  offset: number;
  size?: number;
};

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
  tex: string;
  satellites?: Satellite[];
};

type Waypoint = { x: number; text: string };

// ── World layout ──────────────────────────────────────────────────────────────

const WORLD_END = 47000;

// Derive planets from the single source of truth in career-data.ts
const BODIES: SpaceBody[] = ENTRIES.map(e => ({
  worldX:    e.worldX,
  worldY:    e.worldY,
  kind:      e.kind as BodyKind,
  name:      e.shortName ?? e.name,
  title:     e.title,
  sub:       e.sub,
  period:    e.period,
  desc:      e.shortDesc.join(" · "),
  color:     e.color,
  radius:    e.radius,
  hasRing:   e.hasRing,
  tex:       e.tex,
  satellites: e.satellites,
}));

const SUN_TEX_SRC = "/planets/2k_sun.jpg";

const WAYPOINTS: Waypoint[] = [
  { x: 900,   text: "scroll down to fly through my career →" },
  { x: 2500,  text: "software engineer · full-stack · systems" },
  { x: 5500,  text: "building production systems since 2023." },
  { x: 8500,  text: "still out here in the black…" },
  { x: 15000, text: "— asteroid belt — skills & languages —" },
  { x: 17200, text: "education sector ahead." },
  { x: 21500, text: "graduated cum laude, 2024." },
  { x: 25500, text: "academic projects start here." },
  { x: 30000, text: "still building things." },
  { x: 35000, text: "not stopping yet…" },
  { x: 39500, text: "personal projects out here." },
  { x: 43500, text: "almost at the edge of known space." },
  { x: 46200, text: "— end of known universe —" },
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
  s = lcg(s); const skill = i < CAREER_SKILLS.length ? CAREER_SKILLS[i % CAREER_SKILLS.length] : null;
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

    let running     = true;
    let rafId       = 0;
    let cameraX     = 0;
    let targetX     = 0;
    let bobT        = 0;
    let prevTime    = performance.now();
    let shipFacing  = 1;   // 1 = right, -1 = left (target)
    let shipScaleX  = 1;   // animated value, lerps toward shipFacing

    // ── Texture preload ────────────────────────────────────────────────────
    const textures = new Map<string, HTMLImageElement>();
    for (const src of [...new Set([...ENTRIES.map(e => e.tex), SUN_TEX_SRC])]) {
      const img = new Image();
      img.onload = () => textures.set(src, img);
      img.src = src;
    }

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

    // Draws an equirectangular texture inside a clipped circle with horizontal spin + limb darkening
    function drawSphereTexture(sx: number, sy: number, radius: number, img: HTMLImageElement, spinAngle: number) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.clip();

      const texW = img.naturalWidth  || 1;
      const texH = img.naturalHeight || 1;
      const scale  = (radius * 2) / texH;
      const drawW  = texW * scale;
      const drawH  = radius * 2;
      const offset = ((spinAngle % (Math.PI * 2)) / (Math.PI * 2)) * drawW;
      const normOff = ((offset % drawW) + drawW) % drawW;

      for (let x = sx - radius - normOff; x < sx + radius + drawW; x += drawW) {
        ctx.drawImage(img, x, sy - radius, drawW, drawH);
      }

      // Limb darkening
      const ld = ctx.createRadialGradient(sx, sy, radius * 0.45, sx, sy, radius);
      ld.addColorStop(0,    "rgba(0,0,0,0)");
      ld.addColorStop(0.72, "rgba(0,0,0,0.12)");
      ld.addColorStop(1,    "rgba(0,0,0,0.72)");
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.fillStyle = ld;
      ctx.fill();

      ctx.restore();
    }

    function drawSun(W: number, H: number, t: number) {
      const sx = W / 2 - cameraX;
      const sy = H / 2;
      if (sx < -250 || sx > W + 250) return;

      // Corona layers
      for (const [r, a] of [[180, 0.03], [110, 0.08], [70, 0.18]] as [number,number][]) {
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
        g.addColorStop(0, `rgba(255,210,80,${a})`); g.addColorStop(1, "rgba(255,100,0,0)");
        ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      }

      // Body — texture if loaded, else gradient fallback
      const sunImg = textures.get(SUN_TEX_SRC);
      if (sunImg && sunImg.complete && sunImg.naturalWidth > 0) {
        drawSphereTexture(sx, sy, 38, sunImg, t * 0.4);
      } else {
        const sg = ctx.createRadialGradient(sx - 10, sy - 10, 3, sx, sy, 38);
        sg.addColorStop(0, "#fffde6"); sg.addColorStop(0.35, "#ffe566");
        sg.addColorStop(0.75, "#ff8c00"); sg.addColorStop(1, "rgba(255,50,0,0.4)");
        ctx.beginPath(); ctx.arc(sx, sy, 38, 0, Math.PI * 2); ctx.fillStyle = sg; ctx.fill();
      }

      // "Me" label
      if (sx > -100 && sx < W + 100) {
        ctx.globalAlpha = Math.max(0, 1 - Math.abs(sx - W / 2) / (W * 0.6));
        ctx.fillStyle = "#ffe566"; ctx.font = "bold 13px monospace";
        ctx.textAlign = "center"; ctx.fillText("— me —", sx, sy + 58);
        ctx.globalAlpha = 1;
      }
    }

    function drawSatellites(sx: number, sy: number, sats: Satellite[], t: number, distFromCenter: number, W: number) {
      const fadeIn = Math.max(0, 1 - distFromCenter / (W * 0.44));
      if (fadeIn < 0.015) return;

      for (const sat of sats) {
        const angle = t * sat.speed + sat.offset;
        const mx = sx + Math.cos(angle) * sat.orbitR;
        const my = sy + Math.sin(angle) * sat.orbitR;
        const sz = sat.size ?? 4;

        // Orbit ring
        ctx.globalAlpha = fadeIn * 0.22;
        ctx.beginPath(); ctx.arc(sx, sy, sat.orbitR, 0, Math.PI * 2);
        ctx.strokeStyle = "#8ab4d4"; ctx.lineWidth = 0.7;
        ctx.setLineDash([3, 5]); ctx.stroke(); ctx.setLineDash([]);

        // Moon glow
        ctx.globalAlpha = fadeIn * 0.35;
        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, sz * 2.8);
        glow.addColorStop(0, sat.color + "99"); glow.addColorStop(1, sat.color + "00");
        ctx.beginPath(); ctx.arc(mx, my, sz * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = glow; ctx.fill();

        // Moon body
        ctx.globalAlpha = fadeIn * 0.9;
        ctx.beginPath(); ctx.arc(mx, my, sz, 0, Math.PI * 2);
        ctx.fillStyle = sat.color; ctx.fill();

        // Label
        if (fadeIn > 0.35) {
          ctx.globalAlpha = fadeIn * 0.7;
          ctx.fillStyle = "#ccddee";
          ctx.font = "8px monospace";
          ctx.textAlign = "center";
          const labelY = my + (Math.sin(angle) < 0 ? -sz - 5 : sz + 10);
          ctx.fillText(sat.label, mx, labelY);
        }
        ctx.globalAlpha = 1;
      }
    }

    function drawBody(b: SpaceBody, idx: number, W: number, H: number, t: number) {
      const sx = W / 2 + b.worldX - cameraX;
      const sy = H / 2 + b.worldY;
      if (sx < -b.radius - 100 || sx > W + b.radius + 100) return;

      // Glow
      const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, b.radius * 3.5);
      g.addColorStop(0, b.color + "44"); g.addColorStop(1, b.color + "00");
      ctx.beginPath(); ctx.arc(sx, sy, b.radius * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();

      // Body — texture if loaded, else gradient fallback
      const planetImg = textures.get(b.tex);
      if (planetImg && planetImg.complete && planetImg.naturalWidth > 0) {
        drawSphereTexture(sx, sy, b.radius, planetImg, t * (0.08 + idx * 0.004) + idx * 0.9);
      } else {
        const bg = ctx.createRadialGradient(sx - b.radius * 0.3, sy - b.radius * 0.35, b.radius * 0.05, sx, sy, b.radius);
        bg.addColorStop(0, b.color + "ff"); bg.addColorStop(0.55, b.color + "cc"); bg.addColorStop(1, b.color + "55");
        ctx.beginPath(); ctx.arc(sx, sy, b.radius, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill();
      }

      // Ring
      if (b.hasRing) {
        ctx.save(); ctx.translate(sx, sy); ctx.scale(1, 0.26);
        ctx.beginPath(); ctx.arc(0, 0, b.radius * 1.9, 0, Math.PI * 2);
        ctx.strokeStyle = b.color + "70"; ctx.lineWidth = 3; ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, b.radius * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = b.color + "40"; ctx.lineWidth = 2; ctx.stroke();
        ctx.restore();
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

      if (b.satellites?.length) {
        drawSatellites(sx, sy, b.satellites, t, distFromCenter, W);
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

    function drawShip(W: number, H: number, speed: number, scaleX: number) {
      const cx = W / 2;
      const cy = H / 2 + Math.sin(bobT) * 4;
      const thrust = Math.min(1, speed / 80);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scaleX, 1);
      // ship points right (positive-X); scaleX flips it when going left

      // ── Dual engine exhausts (drawn first, behind everything) ─────────────
      if (thrust > 0.04) {
        for (const ey of [-11, 11]) {
          const fLen = 20 + thrust * 38 + Math.random() * 14;
          const fg = ctx.createLinearGradient(-28, ey, -28 - fLen, ey);
          fg.addColorStop(0,   `rgba(255,220,80,${thrust})`);
          fg.addColorStop(0.25, `rgba(255,120,20,${0.75 * thrust})`);
          fg.addColorStop(0.6,  `rgba(255,40,0,${0.4 * thrust})`);
          fg.addColorStop(1,   "rgba(255,20,0,0)");
          ctx.beginPath();
          ctx.moveTo(-28, ey - 4); ctx.lineTo(-28, ey + 4); ctx.lineTo(-28 - fLen, ey);
          ctx.closePath(); ctx.fillStyle = fg; ctx.fill();
        }
      }

      // ── Outer hull ambient glow ───────────────────────────────────────────
      const hg = ctx.createRadialGradient(0, 0, 12, 0, 0, 50);
      hg.addColorStop(0, "rgba(80,150,255,0.14)"); hg.addColorStop(1, "rgba(80,150,255,0)");
      ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI * 2); ctx.fillStyle = hg; ctx.fill();

      // ── Swept wings (behind fuselage) ─────────────────────────────────────
      for (const [sy, gy1, gy2] of [[1, 9, 32], [-1, -9, -32]] as [number,number,number][]) {
        ctx.beginPath();
        ctx.moveTo(12, sy * 8);    // wing root front
        ctx.lineTo(-20, sy * 9);   // wing root back
        ctx.lineTo(-30, sy * 30);  // wingtip trailing
        ctx.lineTo(-10, sy * 26);  // wingtip leading
        ctx.lineTo(10, sy * 14);   // leading-edge sweep
        ctx.closePath();
        const wg = ctx.createLinearGradient(12, gy1, -30, gy2);
        wg.addColorStop(0, "#1e4870"); wg.addColorStop(1, "#0e1e34");
        ctx.fillStyle = wg; ctx.fill();
        ctx.strokeStyle = "#2a5a90"; ctx.lineWidth = 0.8; ctx.stroke();

        // Wing accent stripe
        ctx.beginPath(); ctx.moveTo(0, sy * 10); ctx.lineTo(-22, sy * 26);
        ctx.strokeStyle = "rgba(42,90,144,0.35)"; ctx.lineWidth = 1; ctx.stroke();

        // Engine nacelle
        ctx.beginPath(); ctx.ellipse(-18, sy * 21, 11, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#0e1e34"; ctx.fill();
        ctx.strokeStyle = "#2a5a90"; ctx.lineWidth = 0.8; ctx.stroke();

        // Nacelle intake ring
        ctx.beginPath(); ctx.arc(-8, sy * 21, 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = "#3a6aaa"; ctx.lineWidth = 1; ctx.stroke();

        // Nacelle nozzle ring
        ctx.beginPath(); ctx.arc(-28, sy * 21, 3.5, 0, Math.PI * 2);
        ctx.strokeStyle = "#3a6aaa"; ctx.lineWidth = 1; ctx.stroke();

        // Nacelle thrust glow
        if (thrust > 0.08) {
          const ng = ctx.createRadialGradient(-28, sy * 21, 0, -28, sy * 21, 10);
          ng.addColorStop(0, `rgba(255,160,40,${0.85 * thrust})`);
          ng.addColorStop(1, "rgba(255,60,0,0)");
          ctx.beginPath(); ctx.arc(-28, sy * 21, 10, 0, Math.PI * 2);
          ctx.fillStyle = ng; ctx.fill();
        }
      }

      // ── Main fuselage ─────────────────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(42, 0);     // nose tip
      ctx.lineTo(30, -8);    // upper shoulder
      ctx.lineTo(8,  -10);   // upper body
      ctx.lineTo(-16, -9);   // upper waist
      ctx.lineTo(-26, -5);   // upper tail flare
      ctx.lineTo(-30, 0);    // tail center
      ctx.lineTo(-26, 5);    // lower tail flare
      ctx.lineTo(-16, 9);    // lower waist
      ctx.lineTo(8,   10);   // lower body
      ctx.lineTo(30, 8);     // lower shoulder
      ctx.closePath();
      const fhullG = ctx.createLinearGradient(-30, -10, 42, 10);
      fhullG.addColorStop(0,    "#0a2030");
      fhullG.addColorStop(0.3,  "#172840");
      fhullG.addColorStop(0.65, "#2a5a90");
      fhullG.addColorStop(1,    "#3a6aaa");
      ctx.fillStyle = fhullG; ctx.fill();
      ctx.strokeStyle = "#3a6aaa"; ctx.lineWidth = 1.2; ctx.stroke();

      // ── Hull panel details ────────────────────────────────────────────────
      ctx.strokeStyle = "rgba(80,140,210,0.28)"; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(22, 0); ctx.stroke();   // center seam
      ctx.beginPath(); ctx.moveTo(12, -6); ctx.lineTo(-12, -6); ctx.stroke(); // upper panel
      ctx.beginPath(); ctx.moveTo(12, 6);  ctx.lineTo(-12, 6);  ctx.stroke(); // lower panel
      ctx.beginPath(); ctx.moveTo(-14, -4); ctx.lineTo(-14, 4); ctx.stroke(); // vertical bulkhead

      // ── Tail engine block ─────────────────────────────────────────────────
      ctx.beginPath();
      ctx.rect(-32, -6, 5, 12);
      ctx.fillStyle = "#1a3050"; ctx.fill();
      ctx.strokeStyle = "#3a70b0"; ctx.lineWidth = 0.8; ctx.stroke();
      // Twin nozzle openings
      for (const ny of [-11, 11]) {
        ctx.beginPath(); ctx.arc(-30, ny, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#0a1828"; ctx.fill();
        ctx.strokeStyle = "#4a80c0"; ctx.lineWidth = 1; ctx.stroke();
      }

      // ── Cockpit ───────────────────────────────────────────────────────────
      // Frame
      ctx.beginPath(); ctx.ellipse(22, 0, 13, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,15,35,0.95)"; ctx.fill();
      ctx.strokeStyle = "rgba(100,180,255,0.55)"; ctx.lineWidth = 1; ctx.stroke();
      // Glass
      ctx.beginPath(); ctx.ellipse(22, 0, 10, 6, 0, 0, Math.PI * 2);
      const cg = ctx.createRadialGradient(18, -3, 1, 22, 0, 10);
      cg.addColorStop(0,   "rgba(210,245,255,0.95)");
      cg.addColorStop(0.4, "rgba(80,210,255,0.65)");
      cg.addColorStop(1,   "rgba(0,80,180,0.25)");
      ctx.fillStyle = cg; ctx.fill();
      // Glare spot
      ctx.beginPath(); ctx.ellipse(18, -3, 4.5, 2.5, -0.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fill();

      // ── Nose beacon ───────────────────────────────────────────────────────
      ctx.beginPath(); ctx.arc(42, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(180,210,255,0.8)"; ctx.fill();

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
      const velocity = (cameraX - prevCamX) / dt;
      const speed = Math.abs(velocity);

      // Ship facing direction — only update when actually moving
      if (speed > 8) shipFacing = velocity > 0 ? 1 : -1;
      // Animate flip: lerp scaleX toward facing; passing through 0 gives a banking turn
      shipScaleX += (shipFacing - shipScaleX) * Math.min(1, dt * 7);

      bobT += dt * 0.9;

      const W = canvas.width, H = canvas.height;

      // ── Background ──
      ctx.fillStyle = "#00000c"; ctx.fillRect(0, 0, W, H);

      drawNebulae(W, H);
      drawStars(W, H);
      drawAsteroidBelt(W, H);
      drawWaypoints(W, H);
      const t = now / 1000;
      drawSun(W, H, t);

      for (let i = 0; i < BODIES.length; i++) drawBody(BODIES[i], i, W, H, t);

      drawShip(W, H, speed, shipScaleX);

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
