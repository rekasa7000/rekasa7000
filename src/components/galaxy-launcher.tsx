"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const THRESHOLD = 110;

export function GalaxyLauncher() {
  const x = useMotionValue(0);
  const [launched, setLaunched] = useState(false);

  const trailWidth = useTransform(x, [0, THRESHOLD], [0, THRESHOLD]);
  const planetGlow = useTransform(
    x,
    [0, THRESHOLD],
    [
      "drop-shadow(0 0 4px rgba(100,180,255,0.35))",
      "drop-shadow(0 0 18px rgba(100,180,255,1)) drop-shadow(0 0 36px rgba(59,130,246,0.6))",
    ],
  );
  const hintOpacity = useTransform(x, [0, 50], [1, 0]);
  const launchOpacity = useTransform(x, [70, THRESHOLD], [0, 1]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x >= THRESHOLD - 6 && !launched) {
      setLaunched(true);
      animate(x, THRESHOLD + 300, { duration: 0.38, ease: "easeIn" });
      setTimeout(() => window.dispatchEvent(new CustomEvent("galaxy-mode")), 240);
      setTimeout(() => {
        x.set(0);
        setLaunched(false);
      }, 580);
    } else {
      animate(x, 0, { type: "spring", stiffness: 380, damping: 28 });
    }
  };

  return (
    <div
      className="fixed top-4 left-4 z-100 select-none flex flex-col gap-1.5 px-3 py-2.5 rounded"
      style={{
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Track row */}
      <div className="relative flex items-center" style={{ width: THRESHOLD + 16, height: 18 }}>
        {/* Dashed base track */}
        <div
          className="absolute left-4 border-t border-dashed"
          style={{ width: THRESHOLD, borderColor: "rgba(255,255,255,0.18)" }}
        />

        {/* Glow trail */}
        <motion.div
          className="absolute left-4 h-[2px] rounded-full pointer-events-none"
          style={{
            width: trailWidth,
            background: "linear-gradient(to right, #c41e3a, #4a90e2)",
          }}
        />

        {/* Draggable planet */}
        <motion.div
          drag={launched ? false : "x"}
          dragConstraints={{ left: 0, right: THRESHOLD }}
          dragElastic={0}
          style={{ x, position: "absolute", left: 0 }}
          onDragEnd={handleDragEnd}
          className="cursor-grab active:cursor-grabbing"
          title="Drag right to enter galaxy mode"
        >
          <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            <motion.div
              className="w-5 h-5 rounded-full relative"
              style={{
                background: "radial-gradient(circle at 36% 30%, #93c5fd, #3b82f6 45%, #1e3a8a 75%, #0c1a3d)",
                filter: planetGlow,
              }}
            >
              {/* Ring */}
              <div
                className="absolute pointer-events-none"
                style={{
                  width: "138%",
                  height: "26%",
                  top: "37%",
                  left: "-19%",
                  borderRadius: "50%",
                  border: "1.5px solid rgba(147,197,253,0.4)",
                  transform: "rotate(-18deg)",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Labels */}
      <div className="relative text-[10px] font-mono" style={{ height: 14 }}>
        <motion.span
          style={{ opacity: hintOpacity, color: "rgba(255,255,255,0.45)" }}
          className="absolute whitespace-nowrap"
        >
          drag → galaxy mode
        </motion.span>
        <motion.span style={{ opacity: launchOpacity, color: "#4a90e2" }} className="absolute whitespace-nowrap">
          launching ✦
        </motion.span>
      </div>
    </div>
  );
}
