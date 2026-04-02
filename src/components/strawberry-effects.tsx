"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  hue: number;
}

export function StrawberryEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 90 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3.5 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.5 + 0.2),
        alpha: Math.random() * 0.55 + 0.05,
        hue: 340 + Math.random() * 30, // pinks/reds: 340–370
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx + Math.sin(p.y * 0.009 + Date.now() * 0.0006) * 0.2;
        p.y += p.vy;

        if (p.y < canvas.height * 0.3) p.alpha -= 0.003;
        else if (p.alpha < 0.4) p.alpha += 0.002;

        if (p.y < -12 || p.alpha <= 0) {
          p.y = canvas.height + 12;
          p.x = Math.random() * canvas.width;
          p.alpha = Math.random() * 0.35 + 0.05;
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Soft scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,80,120,0.02) 3px, rgba(255,80,120,0.02) 4px)",
        }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(30,0,10,0.45) 100%)",
        }}
      />

      {/* Top banner */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 text-center py-2 text-xs font-mono tracking-[0.25em] select-none"
        style={{
          backgroundColor: "rgba(30, 4, 14, 0.92)",
          borderBottom: "1px solid rgba(255,80,120,0.4)",
          color: "#ff5078",
          textShadow: "0 0 12px rgba(255,80,120,0.6)",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: [0.7, 1, 0.7], y: 0 }}
        transition={{ opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }, y: { duration: 0.4 } }}
      >
        🍓 いちごモード ◈ STRAWBERRY MODE ◈ あまい 🍓
      </motion.div>

      {/* Bottom badge */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 text-xs font-mono px-3 py-2 border"
        style={{
          borderColor: "rgba(255,80,120,0.6)",
          color: "#ff5078",
          backgroundColor: "rgba(30,4,14,0.92)",
          textShadow: "0 0 8px rgba(255,80,120,0.6)",
          boxShadow: "0 0 16px rgba(255,80,120,0.15)",
        }}
        initial={{ opacity: 0, y: 12, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        🍓 strawberry mode
      </motion.div>
    </>
  );
}
