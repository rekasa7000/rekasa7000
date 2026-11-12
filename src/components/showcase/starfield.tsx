"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas sky behind the hero: twinkling stars that drift with scroll, petals
 * floating down, plus the occasional shooting star. Static under prefers-reduced-motion.
 */
export function Starfield({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let shoot: { x: number; y: number; life: number } | null = null;
    let nextShoot = 2500;
    let last = performance.now();

    const stars = Array.from({ length: 110 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.4,
      depth: 0.2 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      warm: i % 9 === 0,
    }));

    const petals = Array.from({ length: 9 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 4 + Math.random() * 4,
      speed: 0.012 + Math.random() * 0.016,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const dt = now - last;
      last = now;
      const styles = getComputedStyle(canvas);
      const ink = styles.getPropertyValue("--text-primary").trim() || "#888";
      const accent = styles.getPropertyValue("--accent").trim() || "#f60";
      const scroll = window.scrollY;

      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const y = (((s.y * h - scroll * s.depth * 0.25) % h) + h) % h;
        const tw = reduce ? 0.7 : 0.45 + 0.55 * Math.sin(now / 900 + s.phase);
        ctx.globalAlpha = tw * (0.25 + s.depth * 0.5);
        ctx.fillStyle = s.warm ? accent : ink;
        ctx.beginPath();
        ctx.arc(s.x * w, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // petals drifting down through the sky
      const petal = styles.getPropertyValue("--petal").trim() || "#e58aa0";
      ctx.fillStyle = petal;
      for (const p of petals) {
        if (!reduce) {
          p.y += (p.speed * dt) / 1000;
          if (p.y > 1.05) {
            p.y = -0.05;
            p.x = Math.random();
          }
        }
        const px = p.x * w + Math.sin(now / 1400 + p.phase) * 26;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.ellipse(px, p.y * h, p.size, p.size * 0.55, now / 1100 + p.phase, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce) {
        nextShoot -= dt;
        if (!shoot && nextShoot <= 0) {
          shoot = { x: Math.random() * w * 0.7, y: Math.random() * h * 0.4, life: 0 };
          nextShoot = 3500 + Math.random() * 4500;
        }
        if (shoot) {
          shoot.life += dt;
          const p = shoot.life / 700;
          const x = shoot.x + p * 260;
          const y = shoot.y + p * 110;
          const grad = ctx.createLinearGradient(x - 90, y - 38, x, y);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(1, accent);
          ctx.globalAlpha = Math.max(0, 1 - p);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x - 90, y - 38);
          ctx.lineTo(x, y);
          ctx.stroke();
          if (p >= 1) shoot = null;
        }
      }
      ctx.globalAlpha = 1;
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      if (reduce) draw(performance.now());
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was && !reduce) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
