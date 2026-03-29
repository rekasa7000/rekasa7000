"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const CHARS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF><{}[]|/\\";

export function EasterEggEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 13;
    let drops: number[] = [];
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops = Array.from(
        { length: Math.floor(canvas.width / fontSize) },
        () => Math.random() * -120
      );
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fontSize;
        if (y > 0 && y < canvas.height) {
          const char = CHARS[Math.floor(Math.random() * CHARS.length)];
          // bright head
          ctx.fillStyle = drops[i] < 2 ? "rgba(200,255,200,0.9)" : "rgba(0,255,65,0.18)";
          ctx.fillText(char, i * fontSize, y);
        }
        if (y > canvas.height && Math.random() > 0.97) drops[i] = 0;
        drops[i] += 0.4;
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
      {/* Matrix rain */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.05) 2px, rgba(0,255,65,0.05) 3px)",
        }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Top banner */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 text-center py-2 text-xs font-mono tracking-[0.3em] select-none"
        style={{
          backgroundColor: "rgba(0,10,0,0.9)",
          borderBottom: "1px solid rgba(0,255,65,0.5)",
          color: "#00ff41",
          textShadow: "0 0 10px rgba(0,255,65,0.8)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        ◈ DEVELOPER MODE ACTIVE ◈ rekasa7000 ◈ ACCESS LEVEL: MAXIMUM ◈
      </motion.div>

      {/* Bottom badge */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 text-xs font-mono px-3 py-2 border"
        style={{
          borderColor: "rgba(0,255,65,0.7)",
          color: "#00ff41",
          backgroundColor: "rgba(0,10,0,0.9)",
          textShadow: "0 0 8px rgba(0,255,65,0.8)",
          boxShadow: "0 0 12px rgba(0,255,65,0.3), inset 0 0 12px rgba(0,255,65,0.05)",
        }}
        animate={{ opacity: [0.7, 1, 0.7], boxShadow: [
          "0 0 8px rgba(0,255,65,0.2)",
          "0 0 20px rgba(0,255,65,0.5)",
          "0 0 8px rgba(0,255,65,0.2)",
        ]}}
        transition={{ duration: 2, repeat: Infinity }}
        initial={{ opacity: 0, y: 12, scale: 0.85 }}
      >
        ◈ DEV MODE
      </motion.div>
    </>
  );
}
