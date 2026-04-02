"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EasterEggEffects } from "@/components/easter-egg-effects";
import { MatchaEffects } from "@/components/matcha-effects";
import { StrawberryEffects } from "@/components/strawberry-effects";

interface ModeContextValue {
  easterEgg: boolean;
  matchaMode: boolean;
  strawberryMode: boolean;
}

const ModeContext = createContext<ModeContextValue>({ easterEgg: false, matchaMode: false, strawberryMode: false });

export function useModeContext() {
  return useContext(ModeContext);
}

const OVERLAY_LINES = [
  "████████████████████████████████████",
  "█                                  █",
  "█   ▸ SYSTEM ACCESS: GRANTED       █",
  "█   ▸ USER: rekasa7000             █",
  "█   ▸ CLEARANCE: DEVELOPER         █",
  "█                                  █",
  "████████████████████████████████████",
];

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [easterEgg, setEasterEgg] = useState(false);
  const [matchaMode, setMatchaMode] = useState(false);
  const [strawberryMode, setStrawberryMode] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Apply class directly to <html> so all routes inherit it
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dev-mode", easterEgg);
    html.classList.toggle("matcha-mode", matchaMode);
    html.classList.toggle("strawberry-mode", strawberryMode);
  }, [easterEgg, matchaMode, strawberryMode]);

  useEffect(() => {
    const activateDev = () => {
      setMatchaMode(false);
      setStrawberryMode(false);
      setEasterEgg(false);
      setShowOverlay(true);
      setTimeout(() => {
        setShowOverlay(false);
        setEasterEgg(true);
      }, 2800);
    };
    const activateMatcha = () => {
      setEasterEgg(false);
      setStrawberryMode(false);
      setMatchaMode(true);
    };
    const activateStrawberry = () => {
      setEasterEgg(false);
      setMatchaMode(false);
      setStrawberryMode(true);
    };
    const exitMode = () => {
      setEasterEgg(false);
      setMatchaMode(false);
      setStrawberryMode(false);
    };

    window.addEventListener("rekasa-easter-egg", activateDev);
    window.addEventListener("matcha-mode", activateMatcha);
    window.addEventListener("strawberry-mode", activateStrawberry);
    window.addEventListener("exit-mode", exitMode);
    return () => {
      window.removeEventListener("rekasa-easter-egg", activateDev);
      window.removeEventListener("matcha-mode", activateMatcha);
      window.removeEventListener("strawberry-mode", activateStrawberry);
      window.removeEventListener("exit-mode", exitMode);
    };
  }, []);

  return (
    <ModeContext.Provider value={{ easterEgg, matchaMode, strawberryMode }}>
      {children}

      {/* Dev mode: fullscreen overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.96)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="font-mono text-center select-none" style={{ color: "#00ff41" }}>
              <p className="text-xs mb-6 opacity-40 tracking-widest">// hidden feature unlocked</p>
              {OVERLAY_LINES.map((line, i) => (
                <motion.p
                  key={i}
                  className="text-xs md:text-sm leading-relaxed"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                >
                  {line}
                </motion.p>
              ))}
              <motion.p
                className="text-sm mt-8 tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.9 }}
              >
                developer mode activated
              </motion.p>
              <motion.p
                className="text-xs mt-2 opacity-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1.2 }}
              >
                welcome back, regee.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {easterEgg && <EasterEggEffects />}
      {matchaMode && <MatchaEffects />}
      {strawberryMode && <StrawberryEffects />}
    </ModeContext.Provider>
  );
}
