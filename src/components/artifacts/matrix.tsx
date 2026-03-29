"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFabcdef";

export function Matrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 14;
    let drops: number[] = [];
    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const cols = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: cols }, () => Math.random() * -80);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fontSize;
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];

        if (drops[i] > 0) {
          // bright head
          ctx.fillStyle = "#ccffcc";
          ctx.fillText(char, i * fontSize, y);
          // trail
          if (drops[i] > 1) {
            ctx.fillStyle = "#00ff41";
            ctx.fillText(
              CHARS[Math.floor(Math.random() * CHARS.length)],
              i * fontSize,
              (drops[i] - 1) * fontSize
            );
          }
        }

        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.5;
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
    <div className="relative" style={{ height: "calc(100vh - 57px)", backgroundColor: "#000" }}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p
          className="font-mono text-sm tracking-widest opacity-30"
          style={{ color: "#00ff41" }}
        >
          wake up, neo...
        </p>
      </div>
    </div>
  );
}
