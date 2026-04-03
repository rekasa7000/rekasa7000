"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

const THRESHOLD = 110;

// Fixed star positions for the loading screen — generated once at module level
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: (i * 37 + 13) % 100,
  y: (i * 53 + 7) % 100,
  size: ((i * 17) % 3) + 1,
  delay: (i * 0.07) % 1.5,
  dur: 1.2 + ((i * 0.11) % 1.4),
}));

export function GalaxyLauncher() {
  const x = useMotionValue(0);
  const [launched, setLaunched] = useState(false);
  const [loading, setLoading] = useState(false);

  const trailWidth = useTransform(x, [0, THRESHOLD], [0, THRESHOLD]);
  const planetGlow = useTransform(x, [0, THRESHOLD], [
    "drop-shadow(0 0 4px rgba(100,180,255,0.35))",
    "drop-shadow(0 0 18px rgba(100,180,255,1)) drop-shadow(0 0 36px rgba(59,130,246,0.6))",
  ]);
  const hintOpacity = useTransform(x, [0, 50], [1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x >= THRESHOLD - 6 && !launched) {
      setLaunched(true);
      // Snap planet back to start
      animate(x, 0, { type: "spring", stiffness: 380, damping: 28 });
      // Show loading screen
      setLoading(true);
      // Open galaxy mode after loading
      setTimeout(() => window.dispatchEvent(new CustomEvent("galaxy-mode")), 900);
      // Fade out loading screen shortly after galaxy appears
      setTimeout(() => {
        setLoading(false);
        setLaunched(false);
      }, 1150);
    } else {
      animate(x, 0, { type: "spring", stiffness: 380, damping: 28 });
    }
  };

  return (
    <>
      {/* HUD launcher widget */}
      <div
        className="fixed top-4 left-4 z-100 select-none flex flex-col gap-1.5 px-3 py-2.5 rounded bg-black/5 dark:bg-transparent"
        style={{ backdropFilter: "blur(8px)" }}
      >
        {/* Track row */}
        <div className="relative flex items-center" style={{ width: THRESHOLD + 16, height: 18 }}>
          <div
            className="absolute left-4 border-t-2 border-dashed border-gray-500/60 dark:border-blue-400/35"
            style={{ width: THRESHOLD }}
          />
          <motion.div
            className="absolute left-4 h-0.5 rounded-full pointer-events-none"
            style={{ width: trailWidth, background: "linear-gradient(to right, #c41e3a, #4a90e2)" }}
          />
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
                <div
                  className="absolute pointer-events-none"
                  style={{
                    width: "138%", height: "26%", top: "37%", left: "-19%",
                    borderRadius: "50%", border: "1.5px solid rgba(147,197,253,0.4)",
                    transform: "rotate(-18deg)",
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Hint label */}
        <div className="relative text-[10px] font-mono" style={{ height: 14 }}>
          <motion.span
            style={{ opacity: hintOpacity }}
            className="absolute whitespace-nowrap text-gray-700 dark:text-blue-300/75"
          >
            drag → galaxy mode
          </motion.span>
        </div>
      </div>

      {/* Full-screen loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-500 flex flex-col items-center justify-center overflow-hidden"
            style={{ background: "#000" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Stars */}
            {STARS.map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full bg-white"
                style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
              />
            ))}

            {/* Center content */}
            <div className="flex flex-col items-center gap-8 relative z-10">
              {/* Pulsing planet */}
              <motion.div
                className="rounded-full relative"
                style={{
                  width: 72, height: 72,
                  background: "radial-gradient(circle at 36% 30%, #93c5fd, #3b82f6 45%, #1e3a8a 75%, #0c1a3d)",
                  boxShadow: "0 0 40px rgba(59,130,246,0.8), 0 0 80px rgba(59,130,246,0.3)",
                }}
                animate={{ scale: [1, 1.08, 1], boxShadow: [
                  "0 0 40px rgba(59,130,246,0.7), 0 0 80px rgba(59,130,246,0.2)",
                  "0 0 70px rgba(59,130,246,1),   0 0 140px rgba(59,130,246,0.4)",
                  "0 0 40px rgba(59,130,246,0.7), 0 0 80px rgba(59,130,246,0.2)",
                ]}}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Ring */}
                <div className="absolute pointer-events-none" style={{
                  width: "145%", height: "24%", top: "38%", left: "-22%",
                  borderRadius: "50%", border: "2px solid rgba(147,197,253,0.5)",
                  transform: "rotate(-18deg)",
                }} />
              </motion.div>

              {/* Text */}
              <div className="flex flex-col items-center gap-2">
                <motion.p
                  className="text-xs font-mono uppercase tracking-[0.3em]"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  entering galaxy mode
                </motion.p>
                {/* Dot loader */}
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 rounded-full bg-blue-400"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
