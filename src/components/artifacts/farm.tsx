"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Lock, Plus } from "lucide-react";

// ── Crop definitions ──────────────────────────────────────────────────────────

type CropId = "turnip" | "carrot" | "rice" | "strawberry" | "pumpkin" | "melon";

interface CropDef {
  id: CropId;
  name: string;
  emoji: string;
  cost: number;
  sell: number;
  growMs: number;
  unlockAt: number; // lifetime earnings required
}

const CROPS: CropDef[] = [
  { id: "turnip", name: "Turnip", emoji: "🥬", cost: 5, sell: 12, growMs: 15_000, unlockAt: 0 },
  { id: "carrot", name: "Carrot", emoji: "🥕", cost: 15, sell: 38, growMs: 40_000, unlockAt: 100 },
  { id: "rice", name: "Rice", emoji: "🌾", cost: 40, sell: 110, growMs: 90_000, unlockAt: 400 },
  { id: "strawberry", name: "Strawberry", emoji: "🍓", cost: 100, sell: 300, growMs: 240_000, unlockAt: 1_500 },
  { id: "pumpkin", name: "Pumpkin", emoji: "🎃", cost: 250, sell: 800, growMs: 600_000, unlockAt: 5_000 },
  { id: "melon", name: "Melon", emoji: "🍈", cost: 600, sell: 2_100, growMs: 1_500_000, unlockAt: 15_000 },
];

const CROP_MAP = Object.fromEntries(CROPS.map((c) => [c.id, c])) as Record<CropId, CropDef>;

// ── Economy ───────────────────────────────────────────────────────────────────

const START_PLOTS = 3;
const MAX_PLOTS = 12;
// Cost of plot #n (1-indexed); first three are free
const PLOT_COSTS = [0, 0, 0, 50, 150, 400, 1_000, 2_500, 6_000, 15_000, 40_000, 100_000];

const FERT_MAX = 5;
const FERT_COSTS = [100, 400, 1_600, 6_400, 25_600];
const FERT_FACTOR = 0.85; // growth time multiplier per level

const DRONE_COST = 750;
const DRONE_INTERVAL = 5_000;
const SOWER_COST = 2_000;

// ── State ─────────────────────────────────────────────────────────────────────

interface Plot {
  crop: CropId | null;
  plantedAt: number;
  readyAt: number;
}

interface FarmState {
  coins: number;
  lifetime: number;
  harvests: number;
  plots: Plot[];
  fert: number;
  drone: boolean;
  sower: boolean;
}

const EMPTY_PLOT: Plot = { crop: null, plantedAt: 0, readyAt: 0 };

const DEFAULT_STATE: FarmState = {
  coins: 10,
  lifetime: 0,
  harvests: 0,
  plots: Array.from({ length: START_PLOTS }, () => ({ ...EMPTY_PLOT })),
  fert: 0,
  drone: false,
  sower: false,
};

const STORAGE_KEY = "rekasa-farm-v1";

function loadState(): FarmState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw) as Partial<FarmState>;
    return {
      ...structuredClone(DEFAULT_STATE),
      ...parsed,
      plots: Array.isArray(parsed.plots) && parsed.plots.length > 0 ? parsed.plots : DEFAULT_STATE.plots,
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k`;
  return `${Math.floor(n)}`;
}

function fmtDuration(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return rest === 0 ? `${m}m` : `${m}m${rest}s`;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface CoinFloat {
  id: number;
  plot: number;
  text: string;
}

export function Farm() {
  const [state, setState] = useState<FarmState | null>(null);
  const [selected, setSelected] = useState<CropId>("turnip");
  const [now, setNow] = useState(() => Date.now());
  const [floats, setFloats] = useState<CoinFloat[]>([]);

  const stateRef = useRef<FarmState | null>(null);
  const floatId = useRef(0);
  const lastDrone = useRef(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Load once on mount (client only)
  useEffect(() => {
    setState(loadState());
  }, []);

  // Persist on every change
  useEffect(() => {
    if (!state) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable — play without saving
    }
  }, [state]);

  const spawnFloat = useCallback((plot: number, text: string) => {
    const id = ++floatId.current;
    setFloats((f) => [...f, { id, plot, text }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1100);
  }, []);

  const harvestPlots = useCallback(
    (indices: number[]) => {
      const cur = stateRef.current;
      if (!cur || indices.length === 0) return;
      const time = Date.now();
      let coins = cur.coins;
      let lifetime = cur.lifetime;
      let harvests = cur.harvests;
      const plots = cur.plots.map((p) => ({ ...p }));

      for (const idx of indices) {
        const plot = plots[idx];
        if (!plot?.crop || time < plot.readyAt) continue;
        const def = CROP_MAP[plot.crop];
        coins += def.sell;
        lifetime += def.sell;
        harvests += 1;
        spawnFloat(idx, `+${fmt(def.sell)}`);

        // Auto-sower replants the same crop if affordable
        if (cur.sower && coins >= def.cost) {
          coins -= def.cost;
          const growMs = def.growMs * Math.pow(FERT_FACTOR, cur.fert);
          plots[idx] = { crop: def.id, plantedAt: time, readyAt: time + growMs };
        } else {
          plots[idx] = { ...EMPTY_PLOT };
        }
      }

      setState({ ...cur, coins, lifetime, harvests, plots });
    },
    [spawnFloat]
  );

  // Game tick: refresh clock + run harvest drone
  useEffect(() => {
    const t = setInterval(() => {
      const time = Date.now();
      setNow(time);
      const cur = stateRef.current;
      if (!cur?.drone || time - lastDrone.current < DRONE_INTERVAL) return;
      const ready = cur.plots.map((p, i) => (p.crop && time >= p.readyAt ? i : -1)).filter((i) => i >= 0);
      if (ready.length > 0) {
        lastDrone.current = time;
        harvestPlots(ready);
      }
    }, 250);
    return () => clearInterval(t);
  }, [harvestPlots]);

  if (!state) return <div className="min-h-[calc(100vh-57px)]" />;

  const plant = (idx: number) => {
    const def = CROP_MAP[selected];
    if (state.coins < def.cost || state.plots[idx].crop) return;
    const time = Date.now();
    const growMs = def.growMs * Math.pow(FERT_FACTOR, state.fert);
    const plots = state.plots.map((p, i) =>
      i === idx ? { crop: def.id, plantedAt: time, readyAt: time + growMs } : p
    );
    setState({ ...state, coins: state.coins - def.cost, plots });
  };

  const buyPlot = () => {
    const cost = PLOT_COSTS[state.plots.length];
    if (state.plots.length >= MAX_PLOTS || state.coins < cost) return;
    setState({ ...state, coins: state.coins - cost, plots: [...state.plots, { ...EMPTY_PLOT }] });
  };

  const buyFert = () => {
    const cost = FERT_COSTS[state.fert];
    if (state.fert >= FERT_MAX || state.coins < cost) return;
    setState({ ...state, coins: state.coins - cost, fert: state.fert + 1 });
  };

  const buyDrone = () => {
    if (state.drone || state.coins < DRONE_COST) return;
    setState({ ...state, coins: state.coins - DRONE_COST, drone: true });
  };

  const buySower = () => {
    if (state.sower || state.coins < SOWER_COST) return;
    setState({ ...state, coins: state.coins - SOWER_COST, sower: true });
  };

  const reset = () => {
    if (!window.confirm("Start the farm over? All progress will be lost.")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState(structuredClone(DEFAULT_STATE));
    setSelected("turnip");
  };

  const nextPlotCost = state.plots.length < MAX_PLOTS ? PLOT_COSTS[state.plots.length] : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 select-none">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h2 className="font-display text-3xl mb-1">
            Little Farm <span className="font-jp text-lg" style={{ color: "var(--accent)" }}>畑</span>
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Plant, wait, harvest, upgrade. Crops keep growing while you&apos;re away.
          </p>
        </div>
        <button onClick={reset} className="icon-btn shrink-0" title="Reset farm" aria-label="Reset farm">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 py-6 mb-8 border-b" style={{ borderColor: "var(--border-color)" }}>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-4xl tabular-nums">{fmt(state.coins)}</span>
          <span className="meta-label">coins</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg tabular-nums" style={{ color: "var(--text-secondary)" }}>{fmt(state.lifetime)}</span>
          <span className="meta-label">earned</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg tabular-nums" style={{ color: "var(--text-secondary)" }}>{fmt(state.harvests)}</span>
          <span className="meta-label">harvests</span>
        </div>
      </div>

      {/* Seed selector */}
      <div className="mb-8">
        <div className="meta-label mb-3">Seeds</div>
        <div className="flex flex-wrap gap-2">
          {CROPS.map((crop) => {
            const locked = state.lifetime < crop.unlockAt;
            return (
              <button
                key={crop.id}
                className="chip flex items-center gap-1.5 disabled:cursor-not-allowed"
                data-active={!locked && selected === crop.id}
                disabled={locked}
                onClick={() => setSelected(crop.id)}
                style={locked ? { opacity: 0.45 } : undefined}
                title={
                  locked
                    ? `Unlocks after earning ${fmt(crop.unlockAt)} coins`
                    : `${crop.name} — costs ${fmt(crop.cost)}, sells for ${fmt(crop.sell)}, grows in ${fmtDuration(
                        crop.growMs * Math.pow(FERT_FACTOR, state.fert)
                      )}`
                }
              >
                {locked ? <Lock className="w-3 h-3" /> : <span>{crop.emoji}</span>}
                {crop.name}
                <span style={{ opacity: 0.65 }}>{locked ? `@${fmt(crop.unlockAt)}` : fmt(crop.cost)}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs mt-2.5" style={{ color: "var(--text-tertiary)" }}>
          {CROP_MAP[selected].emoji} {CROP_MAP[selected].name}: sells for {fmt(CROP_MAP[selected].sell)} · grows in{" "}
          {fmtDuration(CROP_MAP[selected].growMs * Math.pow(FERT_FACTOR, state.fert))}
        </p>
      </div>

      {/* Plots */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-10">
        {state.plots.map((plot, idx) => {
          const def = plot.crop ? CROP_MAP[plot.crop] : null;
          const ready = def !== null && now >= plot.readyAt;
          const pct = def ? Math.min(1, (now - plot.plantedAt) / (plot.readyAt - plot.plantedAt)) : 0;
          const stageEmoji = !def ? null : ready ? def.emoji : pct < 0.45 ? "🌱" : "🌿";
          const canPlant = !def && state.coins >= CROP_MAP[selected].cost;

          return (
            <button
              key={idx}
              onClick={() => (ready ? harvestPlots([idx]) : !def ? plant(idx) : undefined)}
              className="relative aspect-square rounded-lg border flex flex-col items-center justify-center gap-1 transition-all duration-200 overflow-hidden"
              style={{
                borderColor: ready ? "var(--accent)" : "var(--border-color)",
                borderStyle: def ? "solid" : "dashed",
                backgroundColor: ready ? "var(--accent-soft)" : "var(--bg-secondary)",
                cursor: ready || canPlant ? "pointer" : "default",
              }}
              title={
                ready
                  ? `Harvest ${def!.name} (+${fmt(def!.sell)})`
                  : def
                    ? `${def.name} — ${fmtDuration(Math.max(0, plot.readyAt - now))} left`
                    : canPlant
                      ? `Plant ${CROP_MAP[selected].name} (−${fmt(CROP_MAP[selected].cost)})`
                      : "Not enough coins"
              }
              aria-label={ready ? `Harvest ${def!.name}` : def ? `${def.name} growing` : "Empty plot"}
            >
              {def ? (
                <motion.span
                  key={stageEmoji}
                  className="text-3xl"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={ready ? { scale: [1, 1.12, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
                  transition={ready ? { scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } } : { duration: 0.3 }}
                >
                  {stageEmoji}
                </motion.span>
              ) : (
                <span style={{ color: "var(--text-tertiary)", opacity: canPlant ? 1 : 0.4 }}>
                  <Plus className="w-5 h-5" />
                </span>
              )}

              {def && !ready && (
                <span className="text-[10px] font-mono tabular-nums" style={{ color: "var(--text-tertiary)" }}>
                  {fmtDuration(Math.max(0, plot.readyAt - now))}
                </span>
              )}
              {ready && (
                <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                  harvest
                </span>
              )}

              {/* Growth bar */}
              {def && !ready && (
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: "var(--border-color)" }}>
                  <div
                    className="h-full transition-[width] duration-300"
                    style={{ width: `${pct * 100}%`, backgroundColor: "var(--accent)" }}
                  />
                </div>
              )}

              {/* Floating coin gains */}
              <AnimatePresence>
                {floats
                  .filter((f) => f.plot === idx)
                  .map((f) => (
                    <motion.span
                      key={f.id}
                      className="absolute font-mono text-sm font-medium pointer-events-none"
                      style={{ color: "var(--accent)" }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: -22 }}
                      exit={{ opacity: 0, y: -34 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    >
                      {f.text}
                    </motion.span>
                  ))}
              </AnimatePresence>
            </button>
          );
        })}

        {/* Buy next plot */}
        {nextPlotCost !== null && (
          <button
            onClick={buyPlot}
            disabled={state.coins < nextPlotCost}
            className="aspect-square rounded-lg border border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors duration-200 disabled:cursor-not-allowed"
            style={{ borderColor: "var(--border-strong)", opacity: state.coins < nextPlotCost ? 0.45 : 1 }}
            title={`Buy plot for ${fmt(nextPlotCost)} coins`}
          >
            <span className="text-lg" aria-hidden="true">🟫</span>
            <span className="text-[11px] font-mono" style={{ color: "var(--text-secondary)" }}>
              plot · {fmt(nextPlotCost)}
            </span>
          </button>
        )}
      </div>

      {/* Upgrades */}
      <div className="meta-label mb-3">Upgrades</div>
      <div className="grid sm:grid-cols-3 gap-3">
        {/* Fertilizer */}
        <div className="border rounded-lg p-4" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
          <div className="text-sm font-medium mb-1">🌰 Fertilizer</div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
            Crops grow 15% faster per level. Level {state.fert}/{FERT_MAX}.
          </p>
          <button
            onClick={buyFert}
            disabled={state.fert >= FERT_MAX || state.coins < FERT_COSTS[state.fert]}
            className="chip disabled:cursor-not-allowed disabled:opacity-45"
          >
            {state.fert >= FERT_MAX ? "Maxed out" : `Upgrade · ${fmt(FERT_COSTS[state.fert])}`}
          </button>
        </div>

        {/* Harvest drone */}
        <div className="border rounded-lg p-4" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
          <div className="text-sm font-medium mb-1">🛸 Harvest Drone</div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
            Automatically harvests ready crops every {DRONE_INTERVAL / 1000} seconds.
          </p>
          <button
            onClick={buyDrone}
            disabled={state.drone || state.coins < DRONE_COST}
            className="chip disabled:cursor-not-allowed disabled:opacity-45"
            data-active={state.drone}
          >
            {state.drone ? "Active" : `Buy · ${fmt(DRONE_COST)}`}
          </button>
        </div>

        {/* Auto-sower */}
        <div className="border rounded-lg p-4" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
          <div className="text-sm font-medium mb-1">🧺 Auto-Sower</div>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
            Replants the same crop after each harvest, if you can afford the seed.
          </p>
          <button
            onClick={buySower}
            disabled={state.sower || state.coins < SOWER_COST}
            className="chip disabled:cursor-not-allowed disabled:opacity-45"
            data-active={state.sower}
          >
            {state.sower ? "Active" : `Buy · ${fmt(SOWER_COST)}`}
          </button>
        </div>
      </div>

      <p className="text-xs mt-8" style={{ color: "var(--text-tertiary)" }}>
        Progress is saved in your browser.
      </p>
    </div>
  );
}
