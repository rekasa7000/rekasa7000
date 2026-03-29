"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const WHITE_KEYS = [
  { key: "a", note: "C4", freq: 261.63 },
  { key: "s", note: "D4", freq: 293.66 },
  { key: "d", note: "E4", freq: 329.63 },
  { key: "f", note: "F4", freq: 349.23 },
  { key: "g", note: "G4", freq: 392.0 },
  { key: "h", note: "A4", freq: 440.0 },
  { key: "j", note: "B4", freq: 493.88 },
  { key: "k", note: "C5", freq: 523.25 },
  { key: "l", note: "D5", freq: 587.33 },
  { key: ";", note: "E5", freq: 659.25 },
];

// `after` = index of the white key to the left of this black key
const BLACK_KEYS = [
  { key: "w", note: "C#4", freq: 277.18, after: 0 },
  { key: "e", note: "D#4", freq: 311.13, after: 1 },
  { key: "t", note: "F#4", freq: 369.99, after: 3 },
  { key: "y", note: "G#4", freq: 415.3, after: 4 },
  { key: "u", note: "A#4", freq: 466.16, after: 5 },
  { key: "o", note: "C#5", freq: 554.37, after: 7 },
  { key: "p", note: "D#5", freq: 622.25, after: 8 },
];

function playTone(audioCtx: AudioContext, freq: number) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = "triangle";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 1.5);
}

export function Piano() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [pressed, setPressed] = useState<Set<string>>(new Set());

  const getCtx = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    return audioCtxRef.current;
  };

  const pressKey = useCallback((key: string, freq: number) => {
    setPressed((p) => new Set([...p, key]));
    playTone(getCtx(), freq);
    setTimeout(
      () =>
        setPressed((p) => {
          const n = new Set(p);
          n.delete(key);
          return n;
        }),
      180
    );
  }, []);

  useEffect(() => {
    const map = Object.fromEntries(
      [...WHITE_KEYS, ...BLACK_KEYS].map((k) => [k.key, k.freq])
    );
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const freq = map[e.key.toLowerCase()] ?? map[e.key];
      if (freq) pressKey(e.key.toLowerCase() === e.key ? e.key : e.key.toLowerCase(), freq);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey]);

  const n = WHITE_KEYS.length;
  const blackWidthPct = (100 / n) * 0.65;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] px-6 py-12 select-none">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold neon-accent mb-2">piano</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          white keys: <span className="neon-accent">a s d f g h j k l ;</span>
          &nbsp;·&nbsp; black keys:{" "}
          <span className="neon-accent">w e t y u o p</span>
        </p>
      </div>

      <div className="relative w-full max-w-2xl" style={{ height: 200 }}>
        {/* White keys */}
        {WHITE_KEYS.map((k, i) => {
          const active = pressed.has(k.key);
          return (
            <div
              key={k.key}
              onMouseDown={() => pressKey(k.key, k.freq)}
              className="absolute border rounded-b-md cursor-pointer flex flex-col justify-end items-center pb-3 transition-colors duration-75"
              style={{
                left: `calc(${(i / n) * 100}% + 1px)`,
                width: `calc(${100 / n}% - 2px)`,
                height: "100%",
                top: 0,
                backgroundColor: active ? "var(--water-blue)" : "white",
                borderColor: "#ccc",
                color: active ? "white" : "#aaa",
              }}
            >
              <span className="text-[10px] font-mono">{k.key}</span>
            </div>
          );
        })}

        {/* Black keys */}
        {BLACK_KEYS.map((k) => {
          const active = pressed.has(k.key);
          const left = ((k.after + 1) / n) * 100 - blackWidthPct / 2;
          return (
            <div
              key={k.key}
              onMouseDown={(e) => {
                e.stopPropagation();
                pressKey(k.key, k.freq);
              }}
              className="absolute z-10 rounded-b-sm cursor-pointer flex flex-col justify-end items-center pb-2 transition-colors duration-75"
              style={{
                left: `${left}%`,
                width: `${blackWidthPct}%`,
                height: "60%",
                top: 0,
                backgroundColor: active ? "var(--water-blue)" : "#111",
                border: "1px solid #333",
                color: active ? "white" : "#555",
              }}
            >
              <span className="text-[9px] font-mono">{k.key}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
