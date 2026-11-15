"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Counts from 0 to `to` the first time it scrolls into view. */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.6,
  decimals = 0,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  /** digits after the decimal point, e.g. 1 for 99.9 */
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: reduce ? 0 : duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(decimals ? Number(v.toFixed(decimals)) : Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}
