"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/use-in-view";

interface CounterProps {
  target: number;
  suffix?: string;
  label: string;
}

function CounterItem({ target, suffix = "", label }: CounterProps) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const duration = 1200;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="text-center px-6 py-4 border"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div className="text-3xl md:text-4xl font-bold neon-accent tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
        {label}
      </div>
    </div>
  );
}

export function StatsBar() {
  return (
    <div className="grid grid-cols-3 gap-4 my-10">
      <CounterItem target={2} suffix="+" label="years experience" />
      <CounterItem target={6} label="projects shipped" />
      <CounterItem target={35} suffix="+" label="technologies" />
    </div>
  );
}
