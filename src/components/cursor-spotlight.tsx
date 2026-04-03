"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const COLORS = ["#1e40af", "#2563eb", "#3b82f6", "#6366f1", "#818cf8"];

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  life: number;   // 1 → 0
  size: number;
  color: string;
};

export function CursorSpotlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let mx = -1000, my = -1000;
    const particles: Particle[] = [];
    let rafId: number;
    let lastSpawn = 0;
    let prevTime  = performance.now();

    const onMouseMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", onMouseMove);

    const isDark = () => document.documentElement.classList.contains("dark");

    const spawn = () => {
      particles.push({
        x:     mx + (Math.random() - 0.5) * 12,
        y:     my + (Math.random() - 0.5) * 12,
        vx:    (Math.random() - 0.5) * 1.4,
        vy:    -(Math.random() * 1.6 + 0.5),
        life:  1,
        size:  Math.random() * 2.2 + 0.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    };

    const tick = (now: number) => {
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isDark()) {
        // ── Blue glow spotlight (dark mode) ──────────────────────────────────
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 300);
        grd.addColorStop(0, "rgba(74,144,226,0.13)");
        grd.addColorStop(1, "rgba(74,144,226,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // ── Sparkle trail (light mode) ────────────────────────────────────────
        if (now - lastSpawn > 28 && mx > 0) {
          spawn();
          if (Math.random() > 0.55) spawn();
          lastSpawn = now;
        }

        ctx.save();
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life -= dt * 1.6;
          p.x   += p.vx;
          p.y   += p.vy;
          p.vy  += 0.03; // gentle gravity pull

          if (p.life <= 0) { particles.splice(i, 1); continue; }

          const alpha = p.life * p.life;

          // Soft outer glow
          ctx.globalAlpha = alpha * 0.25;
          ctx.fillStyle   = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Solid core dot
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life + 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
    />
  );
}
