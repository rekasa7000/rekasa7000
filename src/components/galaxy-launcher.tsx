"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const THRESHOLD = 120;

export function GalaxyLauncher() {
  const x = useMotionValue(0);
  const [launched, setLaunched] = useState(false);

  const trailWidth = useTransform(x, [0, THRESHOLD], [0, THRESHOLD]);
  const planetGlow = useTransform(
    x,
    [0, THRESHOLD],
    [
      "drop-shadow(0 0 4px rgba(100,180,255,0.4))",
      "drop-shadow(0 0 20px rgba(100,180,255,1)) drop-shadow(0 0 40px rgba(59,130,246,0.5))",
    ],
  );
  const hintOpacity = useTransform(x, [0, 55], [1, 0]);
  const launchOpacity = useTransform(x, [75, THRESHOLD], [0, 1]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x >= THRESHOLD && !launched) {
      setLaunched(true);
      animate(x, 520, { duration: 0.42, ease: "easeIn" });
      setTimeout(() => window.dispatchEvent(new CustomEvent("galaxy-mode")), 260);
      setTimeout(() => {
        x.set(0);
        setLaunched(false);
      }, 650);
    } else {
      animate(x, 0, { type: "spring", stiffness: 380, damping: 28 });
    }
  };

  return (
    <div className="flex items-center gap-4 mt-8 select-none">
      {/* Drag track */}
      <div className="relative flex items-center" style={{ width: THRESHOLD + 20, height: 44 }}>
        {/* Dashed base track */}
        <div
          className="absolute left-4 border-t border-dashed"
          style={{ width: THRESHOLD, borderColor: "var(--border-color)" }}
        />

        {/* Glow trail that follows the planet */}
        <motion.div
          className="absolute left-4 h-[2px] rounded-full pointer-events-none"
          style={{
            width: trailWidth,
            background: "linear-gradient(to right, var(--demon-red), var(--water-blue))",
          }}
        />

        {/* Draggable planet */}
        <motion.div
          drag={launched ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0, right: 1.05 }}
          style={{ x, position: "absolute", left: 0 }}
          onDragEnd={handleDragEnd}
          className="cursor-grab active:cursor-grabbing"
          title="Drag right to enter galaxy mode"
        >
          {/* Floating bob animation wrapper */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Planet body */}
            <motion.div
              className="w-9 h-9 rounded-full relative"
              style={{
                background:
                  "radial-gradient(circle at 36% 30%, #93c5fd, #3b82f6 45%, #1e3a8a 75%, #0c1a3d)",
                filter: planetGlow,
              }}
            >
              {/* Saturn-style ring */}
              <div
                className="absolute pointer-events-none"
                style={{
                  width: "140%",
                  height: "28%",
                  top: "36%",
                  left: "-20%",
                  borderRadius: "50%",
                  border: "1.5px solid rgba(147,197,253,0.45)",
                  transform: "rotate(-18deg)",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Hint labels */}
      <div className="relative text-xs" style={{ minWidth: 130, height: 16 }}>
        <motion.span
          style={{ opacity: hintOpacity, color: "var(--text-secondary)" }}
          className="absolute whitespace-nowrap"
        >
          drag to galaxy mode ✦
        </motion.span>
        <motion.span
          style={{ opacity: launchOpacity }}
          className="absolute whitespace-nowrap neon-accent"
        >
          launching ✦
        </motion.span>
      </div>
    </div>
  );
}
