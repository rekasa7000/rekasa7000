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

export function MatchaEffects() {
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
      particles = Array.from({ length: 80 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.4 + 0.15),
        alpha: Math.random() * 0.5 + 0.05,
        hue: 100 + Math.random() * 30,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 55%, 55%, ${p.alpha})`;
        ctx.fill();

        // Gentle sway
        p.x += p.vx + Math.sin(p.y * 0.008 + Date.now() * 0.0005) * 0.15;
        p.y += p.vy;

        // Fade near top
        if (p.y < canvas.height * 0.3) p.alpha -= 0.003;
        else if (p.alpha < 0.35) p.alpha += 0.002;

        if (p.y < -12 || p.alpha <= 0) {
          p.y = canvas.height + 12;
          p.x = Math.random() * canvas.width;
          p.alpha = Math.random() * 0.3 + 0.05;
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
      {/* Floating particles */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Very soft scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(143,188,90,0.025) 3px, rgba(143,188,90,0.025) 4px)",
        }}
      />

      {/* Soft vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,8,0,0.5) 100%)",
        }}
      />

      {/* Top banner */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 text-center py-2 text-xs font-mono tracking-[0.25em] select-none"
        style={{
          backgroundColor: "rgba(5, 18, 7, 0.92)",
          borderBottom: "1px solid rgba(143,188,90,0.35)",
          color: "#8fbc5a",
          textShadow: "0 0 12px rgba(143,188,90,0.5)",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: [0.7, 1, 0.7], y: 0 }}
        transition={{ opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }, y: { duration: 0.4 } }}
      >
        ◈ 抹茶モード ◈ MATCHA MODE ◈ 一期一会 ◈
      </motion.div>

      {/* Bottom badge */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 text-xs font-mono px-3 py-2 border"
        style={{
          borderColor: "rgba(143,188,90,0.6)",
          color: "#8fbc5a",
          backgroundColor: "rgba(5,18,7,0.92)",
          textShadow: "0 0 8px rgba(143,188,90,0.6)",
          boxShadow: "0 0 16px rgba(143,188,90,0.15)",
        }}
        initial={{ opacity: 0, y: 12, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        🍵 matcha mode
      </motion.div>
    </>
  );
}
