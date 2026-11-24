"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CloudRain,
  Coins,
  Moon,
  RotateCcw,
  ShoppingBasket,
  Sun,
  X,
} from "lucide-react";

/**
 * Carlos's farm: a small top-down farming game. Walk Carlos around (tap a tile, or use the
 * arrow keys / WASD), till soil, plant seeds, water them, sleep to pass the day, harvest,
 * and sell at the shipping bin. Everything is drawn on one canvas; progress is saved locally.
 */

// ── Crops ─────────────────────────────────────────────────────────────────────

type CropId = "turnip" | "carrot" | "rice" | "strawberry" | "pumpkin" | "melon";

interface CropDef {
  id: CropId;
  name: string;
  cost: number;
  sell: number;
  /** watered days until harvest */
  days: number;
  /** lifetime earnings needed before the stall sells it */
  unlockAt: number;
  color: string;
}

const CROPS: CropDef[] = [
  {
    id: "turnip",
    name: "Turnip",
    cost: 5,
    sell: 14,
    days: 2,
    unlockAt: 0,
    color: "#e9dff0",
  },
  {
    id: "carrot",
    name: "Carrot",
    cost: 15,
    sell: 42,
    days: 3,
    unlockAt: 80,
    color: "#ff8a2a",
  },
  {
    id: "rice",
    name: "Rice",
    cost: 40,
    sell: 120,
    days: 4,
    unlockAt: 350,
    color: "#e6c65a",
  },
  {
    id: "strawberry",
    name: "Strawberry",
    cost: 100,
    sell: 320,
    days: 5,
    unlockAt: 1_200,
    color: "#e2413f",
  },
  {
    id: "pumpkin",
    name: "Pumpkin",
    cost: 250,
    sell: 850,
    days: 6,
    unlockAt: 4_000,
    color: "#f27a1a",
  },
  {
    id: "melon",
    name: "Melon",
    cost: 600,
    sell: 2_200,
    days: 8,
    unlockAt: 12_000,
    color: "#b9d98a",
  },
];
const CROP_MAP = Object.fromEntries(CROPS.map((c) => [c.id, c])) as Record<
  CropId,
  CropDef
>;
const CROP_IDS = CROPS.map((c) => c.id);

// ── World ─────────────────────────────────────────────────────────────────────

const W = 20;
const H = 15;
const DAY_MS = 150_000; // 06:00 → 22:00
const SPEED = 5.5; // tiles per second
const STORAGE_KEY = "rekasa-farm-v2";
const OLD_STORAGE_KEY = "rekasa-farm-v1";

type Solid = "tree" | "house" | "stall" | "bin" | "pond" | "rock";
type ObjectKind = "house" | "stall" | "bin";

const FIELD = { x0: 4, y0: 6, x1: 15, y1: 12 };
const inField = (x: number, y: number) =>
  x >= FIELD.x0 && x <= FIELD.x1 && y >= FIELD.y0 && y <= FIELD.y1;

function buildSolids(): (Solid | null)[] {
  const s: (Solid | null)[] = Array(W * H).fill(null);
  const set = (x: number, y: number, k: Solid) => {
    if (x >= 0 && y >= 0 && x < W && y < H) s[y * W + x] = k;
  };
  for (let x = 0; x < W; x++) {
    set(x, 0, "tree");
    set(x, H - 1, "tree");
  }
  for (let y = 0; y < H; y++) {
    set(0, y, "tree");
    set(W - 1, y, "tree");
  }
  for (let x = 2; x <= 4; x++) for (let y = 1; y <= 3; y++) set(x, y, "house");
  set(7, 2, "stall");
  set(8, 2, "stall");
  set(11, 2, "bin");
  for (let x = 14; x <= 17; x++) for (let y = 2; y <= 4; y++) set(x, y, "pond");
  set(2, 8, "rock");
  set(17, 9, "rock");
  set(2, 12, "tree");
  set(17, 12, "tree");
  set(17, 6, "tree");
  return s;
}
const SOLIDS = buildSolids();
const solidAt = (x: number, y: number) =>
  x < 0 || y < 0 || x >= W || y >= H ? "tree" : SOLIDS[y * W + x];
const objectAt = (x: number, y: number): ObjectKind | null => {
  const s = solidAt(x, y);
  return s === "house" || s === "stall" || s === "bin" ? s : null;
};

/** stable pseudo-random number per tile, for grass tufts and flowers */
const hash = (x: number, y: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

// ── Saved state ───────────────────────────────────────────────────────────────

interface Tile {
  /** watered today */
  w: boolean;
  c?: CropId;
  /** watered days so far */
  d: number;
}

interface Save {
  coins: number;
  lifetime: number;
  day: number;
  timeMs: number;
  rain: boolean;
  tiles: Record<number, Tile>;
  seeds: Record<CropId, number>;
  bag: Record<CropId, number>;
  px: number;
  py: number;
  selected: CropId;
}

const zeroCounts = () =>
  Object.fromEntries(CROP_IDS.map((id) => [id, 0])) as Record<CropId, number>;

function freshSave(): Save {
  return {
    coins: 30,
    lifetime: 0,
    day: 1,
    timeMs: 0,
    rain: false,
    tiles: {},
    seeds: { ...zeroCounts(), turnip: 5 },
    bag: zeroCounts(),
    px: 5,
    py: 5,
    selected: "turnip",
  };
}

function loadSave(): Save {
  const base = freshSave();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Save>;
      return {
        ...base,
        ...p,
        seeds: { ...base.seeds, ...p.seeds },
        bag: { ...base.bag, ...p.bag },
        tiles: p.tiles ?? {},
      };
    }
    // carry coins over from the earlier version of the game
    const old = localStorage.getItem(OLD_STORAGE_KEY);
    if (old) {
      const o = JSON.parse(old) as { coins?: number; lifetime?: number };
      base.coins = Math.max(base.coins, Math.floor(o.coins ?? 0));
      base.lifetime = Math.floor(o.lifetime ?? 0);
    }
  } catch {
    /* start fresh */
  }
  return base;
}

// ── Runtime (not saved) ───────────────────────────────────────────────────────

interface Float {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

interface Runtime {
  s: Save;
  /** pixel-smooth position in tiles */
  fx: number;
  fy: number;
  path: [number, number][];
  face: 1 | -1;
  /** which way Carlos looks: toward the camera, away from it, or sideways */
  dir: "down" | "up" | "side";
  moving: boolean;
  pending: { x: number; y: number } | null;
  target: { x: number; y: number; life: number } | null;
  floats: Float[];
  keys: Set<string>;
  camX: number;
  camY: number;
  fade: number;
  sleeping: boolean;
  t: number;
  dirty: boolean;
}

interface Hud {
  coins: number;
  day: number;
  clock: string;
  night: boolean;
  rain: boolean;
  seeds: Record<CropId, number>;
  bag: number;
  bagValue: number;
  selected: CropId;
  lifetime: number;
  hint: string;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${Math.floor(n)}`;
}

function clockText(timeMs: number) {
  const mins = 6 * 60 + Math.floor((timeMs / DAY_MS) * 16 * 60);
  const h = Math.floor(mins / 60);
  const m = Math.floor((mins % 60) / 10) * 10;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function bfs(
  sx: number,
  sy: number,
  goal: (x: number, y: number) => boolean,
): [number, number][] | null {
  const prev = new Int32Array(W * H).fill(-1);
  const start = sy * W + sx;
  prev[start] = start;
  const q = [start];
  for (let i = 0; i < q.length; i++) {
    const cur = q[i];
    const cx = cur % W;
    const cy = (cur - cx) / W;
    if (goal(cx, cy)) {
      const out: [number, number][] = [];
      let n = cur;
      while (n !== start) {
        out.push([n % W, Math.floor(n / W)]);
        n = prev[n];
      }
      return out.reverse();
    }
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (solidAt(nx, ny)) continue;
      const ni = ny * W + nx;
      if (prev[ni] !== -1) continue;
      prev[ni] = cur;
      q.push(ni);
    }
  }
  return null;
}

function hintFor(s: Save): string {
  const tiles = Object.values(s.tiles);
  const ready = tiles.some((t) => t.c && t.d >= CROP_MAP[t.c].days);
  const bag = CROP_IDS.reduce((n, id) => n + s.bag[id], 0);
  const seeds = CROP_IDS.reduce((n, id) => n + s.seeds[id], 0);
  const planted = tiles.filter((t) => t.c);
  if (ready) return "A crop is ready. Tap it to harvest.";
  if (bag > 0) return "Carry your harvest to the wooden bin to sell it.";
  if (tiles.length === 0)
    return "Tap the field to walk there and till the soil.";
  if (tiles.some((t) => !t.c) && s.seeds[s.selected] > 0)
    return "Tap tilled soil to plant a seed.";
  if (planted.some((t) => !t.w)) return "Tap a planted tile to water it.";
  if (planted.length > 0)
    return "All watered. Tap the house door to sleep until morning.";
  if (seeds === 0) return "Out of seeds. Tap the striped stall to buy more.";
  return "Tap the field to till more soil.";
}

// ── Drawing ───────────────────────────────────────────────────────────────────

type Ctx = CanvasRenderingContext2D;

/**
 * Painted sprites, used when the file exists; anything missing falls back to the drawn version.
 * Files live in /public/images/farm, e.g. carrot-mid.webp, carrot-ripe.webp, seeds.webp, sprout.webp.
 */
const SPRITE_FILES = [
  "carrot-mid",
  "carrot-ripe",
  "turnip-mid",
  "turnip-ripe",
  "rice-mid",
  "rice-ripe",
  "strawberry-mid",
  "strawberry-ripe",
  "pumpkin-mid",
  "pumpkin-ripe",
  "melon-mid",
  "melon-ripe",
  "seeds",
  "sprout",
  "carlos-front",
  "carlos-back",
  "carlos-side",
  "house",
  "stall",
  "bin",
  "tree",
  "fruit-tree",
];
const sprites: Record<string, HTMLImageElement> = {};

function loadSprites() {
  for (const name of SPRITE_FILES) {
    if (sprites[name]) continue;
    const img = new Image();
    img.src = `/images/farm/${name}.webp`;
    img.onload = () => {
      sprites[name] = img;
    };
  }
}

function drawCrop(c: Ctx, id: CropId, stage: number, T: number, t: number) {
  // origin = tile centre bottom-ish
  const u = T / 16;
  const sprite =
    sprites[
      stage === 0
        ? "seeds"
        : stage === 1
          ? "sprout"
          : `${id}-${stage === 2 ? "mid" : "ripe"}`
    ];
  if (sprite) {
    // sprites sit on the bottom edge of their square; ripe crops stand a little taller and sway
    const size = T * (stage === 3 ? 1.25 : stage === 2 ? 1.1 : 0.9);
    if (stage === 3) c.rotate(Math.sin(t * 2.2) * 0.05);
    c.drawImage(sprite, -size / 2, T * 0.42 - size, size, size);
    return;
  }
  c.lineCap = "round";
  if (stage === 0) {
    c.fillStyle = "#d9c9a3";
    for (const [dx, dy] of [
      [-3, 0],
      [2, -2],
      [1, 3],
    ])
      c.fillRect(dx * u, dy * u, u * 1.4, u * 1.4);
    return;
  }
  const leaf = (
    x: number,
    y: number,
    r: number,
    rot: number,
    col = "#5fbf6a",
  ) => {
    c.save();
    c.translate(x * u, y * u);
    c.rotate(rot);
    c.fillStyle = col;
    c.beginPath();
    c.ellipse(0, -r * u * 0.5, r * u * 0.42, r * u * 0.62, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
  };
  if (stage === 1) {
    c.strokeStyle = "#3f9a55";
    c.lineWidth = u * 1.2;
    c.beginPath();
    c.moveTo(0, 3 * u);
    c.lineTo(0, -1 * u);
    c.stroke();
    leaf(0, -1, 4, -0.8);
    leaf(0, -1, 4, 0.8);
    return;
  }
  if (stage === 2) {
    leaf(0, 3, 6, -1);
    leaf(0, 3, 6, 1);
    leaf(0, 2, 7, -0.35, "#4aa85c");
    leaf(0, 2, 7, 0.35, "#4aa85c");
    return;
  }
  // ready: bob a little and draw the crop itself
  c.translate(0, Math.sin(t * 3) * u * 0.6);
  const col = CROP_MAP[id].color;
  const outline = "#0b2a2a";
  c.strokeStyle = outline;
  c.lineWidth = u * 0.9;
  switch (id) {
    case "turnip":
      leaf(0, -1, 6, -0.6);
      leaf(0, -1, 6, 0.6);
      c.fillStyle = col;
      c.beginPath();
      c.ellipse(0, 2 * u, 4 * u, 3.6 * u, 0, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.fillStyle = "#a96bd0";
      c.beginPath();
      c.ellipse(0, 0.4 * u, 3.4 * u, 1.6 * u, 0, Math.PI, Math.PI * 2);
      c.fill();
      break;
    case "carrot":
      leaf(0, -2, 6, -0.5);
      leaf(0, -2, 6, 0.5);
      c.fillStyle = col;
      c.beginPath();
      c.moveTo(-3 * u, -1.5 * u);
      c.lineTo(3 * u, -1.5 * u);
      c.lineTo(0, 6 * u);
      c.closePath();
      c.fill();
      c.stroke();
      break;
    case "rice":
      c.lineWidth = u * 1.1;
      for (const a of [-0.5, -0.2, 0.1, 0.4]) {
        c.strokeStyle = "#8cab4a";
        c.beginPath();
        c.moveTo(0, 5 * u);
        c.quadraticCurveTo(a * 6 * u, -2 * u, a * 12 * u, -5 * u);
        c.stroke();
        c.fillStyle = col;
        c.beginPath();
        c.ellipse(a * 12 * u, -5 * u, 1.3 * u, 2.2 * u, a, 0, Math.PI * 2);
        c.fill();
      }
      break;
    case "strawberry":
      leaf(0, 3, 7, -1, "#3f9a55");
      leaf(0, 3, 7, 1, "#3f9a55");
      leaf(0, 2, 7, 0, "#4aa85c");
      c.fillStyle = col;
      for (const [x, y] of [
        [-3, 2],
        [3, 3],
        [0, 5],
      ]) {
        c.beginPath();
        c.moveTo((x - 1.8) * u, (y - 1.2) * u);
        c.quadraticCurveTo(x * u, (y - 2.4) * u, (x + 1.8) * u, (y - 1.2) * u);
        c.lineTo(x * u, (y + 2) * u);
        c.closePath();
        c.fill();
      }
      break;
    case "pumpkin":
    case "melon":
      c.fillStyle = col;
      c.beginPath();
      c.ellipse(0, 2 * u, 5.2 * u, 4 * u, 0, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.strokeStyle = id === "pumpkin" ? "#c85a0c" : "#86ab5c";
      c.lineWidth = u * 0.7;
      for (const dx of [-2.4, 0, 2.4]) {
        c.beginPath();
        c.ellipse(dx * u, 2 * u, 1.3 * u, 3.8 * u, 0, 0, Math.PI * 2);
        c.stroke();
      }
      c.strokeStyle = "#3f9a55";
      c.lineWidth = u * 1.2;
      c.beginPath();
      c.moveTo(0, -2 * u);
      c.quadraticCurveTo(2 * u, -5 * u, 4 * u, -3.5 * u);
      c.stroke();
      break;
  }
}

function drawCarlos(
  c: Ctx,
  T: number,
  face: number,
  moving: boolean,
  t: number,
  asleep: boolean,
  dir: "down" | "up" | "side",
) {
  const u = T / 16;
  const bob = moving
    ? Math.abs(Math.sin(t * 12)) * u * 1.2
    : Math.sin(t * 2) * u * 0.3;
  c.fillStyle = "rgba(0,0,0,0.25)";
  c.beginPath();
  c.ellipse(0, 6.5 * u, 5 * u, 1.8 * u, 0, 0, Math.PI * 2);
  c.fill();
  const sprite =
    sprites[
      dir === "up"
        ? "carlos-back"
        : dir === "side"
          ? "carlos-side"
          : "carlos-front"
    ];
  if (sprite) {
    const size = T * 1.3;
    c.save();
    c.translate(0, -bob);
    // the side sprite faces right; a little waddle while walking
    if (dir === "side") c.scale(face, 1);
    if (moving) c.rotate(Math.sin(t * 12) * 0.06);
    c.drawImage(sprite, -size / 2, 7.2 * u - size, size, size);
    c.restore();
    return;
  }
  c.save();
  c.translate(0, -bob);
  c.scale(face, 1);
  const line = "#0b2a2a";
  c.strokeStyle = line;
  c.lineWidth = u * 0.9;
  c.lineJoin = "round";
  // tail
  c.strokeStyle = "#f6f1e7";
  c.lineWidth = u * 2;
  c.beginPath();
  c.moveTo(-3.5 * u, 4 * u);
  c.quadraticCurveTo(-8 * u, 3 * u, -6.5 * u, -1 * u + Math.sin(t * 4) * u);
  c.stroke();
  c.strokeStyle = line;
  c.lineWidth = u * 0.9;
  // body
  c.fillStyle = "#f6f1e7";
  c.beginPath();
  c.ellipse(0, 3 * u, 4.2 * u, 3.8 * u, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillStyle = "#a9adb0";
  c.beginPath();
  c.ellipse(-2 * u, 2.4 * u, 1.6 * u, 2 * u, 0.4, 0, Math.PI * 2);
  c.fill();
  // ears
  for (const sx of [-1, 1]) {
    c.fillStyle = sx === -1 ? "#a9adb0" : "#a9adb0";
    c.beginPath();
    c.moveTo(sx * 1.2 * u, -6.5 * u);
    c.lineTo(sx * 4.6 * u, -9.6 * u);
    c.lineTo(sx * 4.8 * u, -4.6 * u);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = "#f4a3b5";
    c.beginPath();
    c.moveTo(sx * 2.4 * u, -6.4 * u);
    c.lineTo(sx * 4 * u, -8 * u);
    c.lineTo(sx * 4.1 * u, -5.4 * u);
    c.closePath();
    c.fill();
  }
  // head
  c.fillStyle = "#f6f1e7";
  c.beginPath();
  c.ellipse(0, -3 * u, 5 * u, 4.2 * u, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  // grey cap split by a white blaze
  c.fillStyle = "#a9adb0";
  for (const sx of [-1, 1]) {
    c.beginPath();
    c.ellipse(sx * 2.6 * u, -5.4 * u, 2 * u, 1.5 * u, sx * 0.3, 0, Math.PI * 2);
    c.fill();
  }
  if (asleep) {
    c.strokeStyle = line;
    c.lineWidth = u * 0.8;
    for (const sx of [-1, 1]) {
      c.beginPath();
      c.moveTo((sx * 2.2 - 1.2) * u, -3 * u);
      c.lineTo((sx * 2.2 + 1.2) * u, -3 * u);
      c.stroke();
    }
  } else {
    // sunglasses
    c.fillStyle = "#0a0a0a";
    c.beginPath();
    c.roundRect(-4.4 * u, -4.2 * u, 3.8 * u, 2.5 * u, u * 0.9);
    c.roundRect(0.6 * u, -4.2 * u, 3.8 * u, 2.5 * u, u * 0.9);
    c.fill();
    c.fillRect(-1 * u, -3.8 * u, 2 * u, 0.8 * u);
  }
  c.fillStyle = "#f4a3b5";
  c.beginPath();
  c.ellipse(0, -1.2 * u, 0.7 * u, 0.5 * u, 0, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

function drawWorld(c: Ctx, rt: Runtime, T: number, vw: number, vh: number) {
  const { s, t } = rt;
  const u = T / 16;
  c.save();
  c.translate(-Math.round(rt.camX * T), -Math.round(rt.camY * T));
  const x0 = Math.max(0, Math.floor(rt.camX));
  const y0 = Math.max(0, Math.floor(rt.camY));
  const x1 = Math.min(W - 1, Math.ceil(rt.camX + vw / T));
  const y1 = Math.min(H - 1, Math.ceil(rt.camY + vh / T));

  // ground
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const h = hash(x, y);
      const field = inField(x, y);
      c.fillStyle = field
        ? (x + y) % 2
          ? "#2f7150"
          : "#2c6b4c"
        : (x + y) % 2
          ? "#24604a"
          : "#215a46";
      c.fillRect(x * T, y * T, T, T);
      const tile = s.tiles[y * W + x];
      if (tile) {
        c.fillStyle = tile.w ? "#4a3222" : "#7a5536";
        c.beginPath();
        c.roundRect(x * T + u, y * T + u, T - 2 * u, T - 2 * u, u * 2);
        c.fill();
        c.strokeStyle = tile.w ? "#3a2619" : "#63432a";
        c.lineWidth = u;
        for (let i = 1; i <= 3; i++) {
          c.beginPath();
          c.moveTo(x * T + 2.5 * u, y * T + i * 4 * u);
          c.lineTo(x * T + T - 2.5 * u, y * T + i * 4 * u);
          c.stroke();
        }
      } else if (!solidAt(x, y)) {
        if (h > 0.86 && !field) {
          c.fillStyle = h > 0.93 ? "#ff6a1f" : "#f3ebdd";
          c.beginPath();
          c.arc(
            x * T + T * hash(y, x),
            y * T + T * hash(x + 9, y),
            u * 1.5,
            0,
            Math.PI * 2,
          );
          c.fill();
        } else if (h > 0.55) {
          c.strokeStyle = "#3a8560";
          c.lineWidth = u;
          const gx = x * T + T * hash(y + 3, x);
          const gy = y * T + T * (0.3 + 0.6 * hash(x, y + 5));
          c.beginPath();
          c.moveTo(gx - 2 * u, gy);
          c.lineTo(gx - 3 * u, gy - 3 * u);
          c.moveTo(gx, gy);
          c.lineTo(gx, gy - 4 * u);
          c.moveTo(gx + 2 * u, gy);
          c.lineTo(gx + 3 * u, gy - 3 * u);
          c.stroke();
        }
      }
    }
  }

  // field fence
  c.strokeStyle = "#8a6238";
  c.lineWidth = u * 1.5;
  c.setLineDash([u * 3, u * 3]);
  c.strokeRect(
    FIELD.x0 * T - u,
    FIELD.y0 * T - u,
    (FIELD.x1 - FIELD.x0 + 1) * T + 2 * u,
    (FIELD.y1 - FIELD.y0 + 1) * T + 2 * u,
  );
  c.setLineDash([]);

  // pond
  c.fillStyle = "#1f8f96";
  c.beginPath();
  c.roundRect(
    14 * T + 2 * u,
    2 * T + 2 * u,
    4 * T - 4 * u,
    3 * T - 4 * u,
    T * 0.8,
  );
  c.fill();
  c.strokeStyle = "rgba(243,235,221,0.5)";
  c.lineWidth = u;
  for (let i = 0; i < 3; i++) {
    const rx = 14.8 * T + i * T * 1.1;
    const ry = 3 * T + ((i * 13) % 20) * u + Math.sin(t * 1.5 + i) * u * 2;
    c.beginPath();
    c.ellipse(rx, ry, 5 * u + Math.sin(t + i) * u, 1.6 * u, 0, 0, Math.PI * 2);
    c.stroke();
  }

  // painted sprite, bottom-centred on a point; false when the image isn't there yet
  const blit = (name: string, cx: number, bottom: number, size: number) => {
    const img = sprites[name];
    if (!img) return false;
    c.drawImage(img, cx - size / 2, bottom - size, size, size);
    return true;
  };

  if (!blit("house", 3.5 * T, 4.15 * T, 3.5 * T)) {
    // house (a small dome, like the paintings)
    c.fillStyle = "#e8dcc4";
    c.strokeStyle = "#0b2a2a";
    c.lineWidth = u * 1.2;
    c.beginPath();
    c.moveTo(2 * T, 4 * T);
    c.lineTo(2 * T, 2.6 * T);
    c.quadraticCurveTo(3.5 * T, 0.3 * T, 5 * T, 2.6 * T);
    c.lineTo(5 * T, 4 * T);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = "#ffb357";
    c.beginPath();
    c.roundRect(2.3 * T, 2.6 * T, 0.9 * T, 0.8 * T, u * 3);
    c.fill();
    c.stroke();
    c.fillStyle = "#ff6a1f";
    c.beginPath();
    c.moveTo(3.5 * T, 4 * T);
    c.lineTo(3.5 * T, 3.2 * T);
    c.arc(3.9 * T, 3.2 * T, 0.4 * T, Math.PI, 0);
    c.lineTo(4.3 * T, 4 * T);
    c.closePath();
    c.fill();
    c.stroke();
  }

  if (!blit("stall", 8 * T, 3.1 * T, 2.5 * T)) {
    // stall
    c.fillStyle = "#8a6238";
    c.fillRect(7 * T + u, 2.45 * T, 2 * T - 2 * u, 0.55 * T);
    c.strokeRect(7 * T + u, 2.45 * T, 2 * T - 2 * u, 0.55 * T);
    for (let i = 0; i < 6; i++) {
      c.fillStyle = i % 2 ? "#f3ebdd" : "#ff6a1f";
      c.fillRect(7 * T + (i * 2 * T) / 6, 1.7 * T, (2 * T) / 6 + 1, 0.5 * T);
    }
    c.strokeRect(7 * T, 1.7 * T, 2 * T, 0.5 * T);
    c.fillStyle = "#8a6238";
    c.fillRect(7 * T + u, 2.2 * T, u * 1.5, 0.3 * T);
    c.fillRect(9 * T - 2.5 * u, 2.2 * T, u * 1.5, 0.3 * T);
  }

  if (!blit("bin", 11.5 * T, 3.05 * T, 1.3 * T)) {
    // shipping bin
    c.fillStyle = "#a9773f";
    c.beginPath();
    c.roundRect(11 * T + 2 * u, 2 * T + 4 * u, T - 4 * u, T - 5 * u, u * 2);
    c.fill();
    c.stroke();
    c.fillStyle = "#c08a4c";
    c.beginPath();
    c.roundRect(11 * T + u, 2 * T + 2 * u, T - 2 * u, 5 * u, u * 2);
    c.fill();
    c.stroke();
  }

  // things with height, sorted with Carlos by row
  const py = rt.fy;
  const drawTall = (x: number, y: number, k: Solid | null) => {
    if (k === "tree") {
      // the hedge of trees round the edge is plain; the ones inside the farm bear fruit
      const edge = x === 0 || y === 0 || x === W - 1 || y === H - 1;
      if (
        blit(
          edge ? "tree" : "fruit-tree",
          x * T + T / 2,
          y * T + T * 1.02,
          T * 1.5,
        )
      )
        return;
      c.fillStyle = "#6b4a2f";
      c.fillRect(x * T + 6.5 * u, y * T + 8 * u, 3 * u, 7 * u);
      c.fillStyle = (x * 7 + y * 3) % 2 ? "#17523f" : "#1b5c45";
      c.strokeStyle = "#0b2a2a";
      c.lineWidth = u;
      c.beginPath();
      c.arc(x * T + 8 * u, y * T + 5 * u, 7.5 * u, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.fillStyle = "rgba(120,190,130,0.35)";
      c.beginPath();
      c.arc(x * T + 6 * u, y * T + 3 * u, 3 * u, 0, Math.PI * 2);
      c.fill();
    } else if (k === "rock") {
      c.fillStyle = "#7d8a8a";
      c.strokeStyle = "#0b2a2a";
      c.lineWidth = u;
      c.beginPath();
      c.ellipse(
        x * T + 8 * u,
        y * T + 10 * u,
        6 * u,
        4.5 * u,
        0,
        0,
        Math.PI * 2,
      );
      c.fill();
      c.stroke();
    }
  };
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const tile = s.tiles[y * W + x];
      if (tile?.c) {
        const need = CROP_MAP[tile.c].days;
        const stage =
          tile.d >= need ? 3 : tile.d === 0 ? 0 : tile.d / need < 0.5 ? 1 : 2;
        c.save();
        c.translate(x * T + T / 2, y * T + T / 2);
        drawCrop(c, tile.c, stage, T, t + x);
        c.restore();
        if (stage === 3) {
          c.fillStyle = `rgba(255,236,170,${0.5 + 0.5 * Math.sin(t * 4 + x + y)})`;
          c.fillRect(x * T + 12 * u, y * T + 2 * u, u * 1.5, u * 1.5);
        }
      }
      drawTall(x, y, SOLIDS[y * W + x]);
    }
    if (Math.round(py) === y) {
      c.save();
      c.translate(rt.fx * T + T / 2, rt.fy * T + T / 2);
      drawCarlos(c, T, rt.face, rt.moving, t, rt.sleeping, rt.dir);
      c.restore();
    }
  }

  // tap marker
  if (rt.target) {
    c.strokeStyle = `rgba(255,106,31,${Math.min(1, rt.target.life)})`;
    c.lineWidth = u * 1.2;
    c.beginPath();
    c.roundRect(
      rt.target.x * T + u,
      rt.target.y * T + u,
      T - 2 * u,
      T - 2 * u,
      u * 3,
    );
    c.stroke();
  }

  // floating text
  c.textAlign = "center";
  c.font = `700 ${Math.round(T * 0.42)}px sans-serif`;
  for (const f of rt.floats) {
    c.globalAlpha = Math.min(1, f.life * 2);
    c.fillStyle = "#0b2a2a";
    c.fillText(f.text, f.x * T + T / 2 + 1, f.y * T + 1);
    c.fillStyle = f.color;
    c.fillText(f.text, f.x * T + T / 2, f.y * T);
  }
  c.globalAlpha = 1;
  c.restore();

  // dusk and night
  const p = s.timeMs / DAY_MS;
  const dark =
    p < 0.06 ? (0.06 - p) * 4 : p > 0.7 ? Math.min(0.62, (p - 0.7) * 2.2) : 0;
  if (dark > 0 || s.rain) {
    c.fillStyle = `rgba(2,22,34,${Math.max(dark, s.rain ? 0.18 : 0)})`;
    c.fillRect(0, 0, vw, vh);
  }
  if (dark > 0.15) {
    c.globalCompositeOperation = "lighter";
    for (const [lx, ly] of [
      [3.9, 3.3],
      [8, 2.4],
    ]) {
      const gx = (lx - rt.camX) * T;
      const gy = (ly - rt.camY) * T;
      const g = c.createRadialGradient(gx, gy, 0, gx, gy, T * 2.6);
      g.addColorStop(0, `rgba(255,170,80,${dark * 0.7})`);
      g.addColorStop(1, "rgba(255,170,80,0)");
      c.fillStyle = g;
      c.fillRect(gx - T * 3, gy - T * 3, T * 6, T * 6);
    }
    c.globalCompositeOperation = "source-over";
  }
  if (s.rain) {
    c.strokeStyle = "rgba(200,235,235,0.45)";
    c.lineWidth = 1;
    c.beginPath();
    for (let i = 0; i < 70; i++) {
      const rx = (hash(i, 1) * (vw + 80) + t * 60) % (vw + 80);
      const ry = (hash(i, 7) * vh + t * 520 * (0.7 + hash(i, 3) * 0.6)) % vh;
      c.moveTo(rx, ry);
      c.lineTo(rx - 4, ry + 12);
    }
    c.stroke();
  }
  if (rt.fade > 0) {
    c.fillStyle = `rgba(1,20,24,${rt.fade})`;
    c.fillRect(0, 0, vw, vh);
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Farm() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rtRef = useRef<Runtime | null>(null);
  const [hud, setHud] = useState<Hud | null>(null);
  const [shop, setShop] = useState(false);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const shopRef = useRef(false);
  const toastId = useRef(0);

  const say = useCallback((text: string) => {
    toastId.current += 1;
    setToast({ id: toastId.current, text });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const syncHud = useCallback(() => {
    const rt = rtRef.current;
    if (!rt) return;
    const s = rt.s;
    setHud({
      coins: s.coins,
      day: s.day,
      clock: clockText(s.timeMs),
      night: s.timeMs / DAY_MS > 0.75,
      rain: s.rain,
      seeds: { ...s.seeds },
      bag: CROP_IDS.reduce((n, id) => n + s.bag[id], 0),
      bagValue: CROP_IDS.reduce(
        (n, id) => n + s.bag[id] * CROP_MAP[id].sell,
        0,
      ),
      selected: s.selected,
      lifetime: s.lifetime,
      hint: hintFor(s),
    });
  }, []);

  const openShop = useCallback((open: boolean) => {
    shopRef.current = open;
    setShop(open);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !wrap || !ctx) return;

    const s = loadSave();
    loadSprites();
    const rt: Runtime = {
      s,
      fx: s.px,
      fy: s.py,
      path: [],
      face: 1,
      dir: "down",
      moving: false,
      pending: null,
      target: null,
      floats: [],
      keys: new Set(),
      camX: 0,
      camY: 0,
      fade: 0,
      sleeping: false,
      t: 0,
      dirty: false,
    };
    rtRef.current = rt;

    let T = 40;
    let vw = 0;
    let vh = 0;
    const resize = () => {
      const width = wrap.clientWidth;
      T = Math.max(30, Math.min(48, Math.floor(width / 9.5)));
      if (width >= W * 30) T = Math.min(48, Math.floor(width / W));
      vw = Math.min(width, W * T);
      vh = Math.min(
        H * T,
        Math.max(T * 8, Math.floor(window.innerHeight * 0.7)),
      );
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(vw * dpr);
      canvas.height = Math.round(vh * dpr);
      canvas.style.width = `${vw}px`;
      canvas.style.height = `${vh}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const save = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rt.s));
      } catch {
        /* storage unavailable: the game still plays */
      }
      rt.dirty = false;
    };

    const float = (x: number, y: number, text: string, color = "#f3ebdd") =>
      rt.floats.push({ x, y, text, color, life: 1.2 });

    const nextDay = () => {
      const st = rt.s;
      let grew = 0;
      for (const tile of Object.values(st.tiles)) {
        if (tile.c && tile.w && tile.d < CROP_MAP[tile.c].days) {
          tile.d += 1;
          grew += 1;
        }
      }
      st.day += 1;
      st.timeMs = 0;
      st.rain = Math.random() < 0.22;
      for (const tile of Object.values(st.tiles)) tile.w = st.rain && !!tile.c;
      st.px = 3;
      st.py = 4;
      rt.fx = 3;
      rt.fy = 4;
      rt.path = [];
      rt.pending = null;
      say(
        `Day ${st.day}. ${grew > 0 ? `${grew} crop${grew === 1 ? "" : "s"} grew overnight.` : "Nothing grew: water crops before bed."}${st.rain ? " It's raining, so everything is watered." : ""}`,
      );
      save();
      syncHud();
    };

    const sleep = () => {
      if (rt.sleeping) return;
      rt.sleeping = true;
      rt.path = [];
    };

    const actObject = (kind: ObjectKind) => {
      const st = rt.s;
      if (kind === "stall") openShop(true);
      if (kind === "house") sleep();
      if (kind === "bin") {
        const total = CROP_IDS.reduce(
          (n, id) => n + st.bag[id] * CROP_MAP[id].sell,
          0,
        );
        if (total === 0) {
          say("The bin is for selling. Harvest something first.");
          return;
        }
        st.coins += total;
        st.lifetime += total;
        st.bag = zeroCounts();
        float(11, 1.6, `+${fmt(total)}`, "#ffd76a");
        const unlocked = CROPS.find(
          (cr) =>
            cr.unlockAt > st.lifetime - total && cr.unlockAt <= st.lifetime,
        );
        say(
          unlocked
            ? `Sold for ${fmt(total)} coins. The stall now sells ${unlocked.name} seeds!`
            : `Sold for ${fmt(total)} coins.`,
        );
      }
      rt.dirty = true;
      syncHud();
    };

    const actTile = (x: number, y: number) => {
      const st = rt.s;
      if (!inField(x, y)) return;
      const i = y * W + x;
      const tile = st.tiles[i];
      if (!tile) {
        st.tiles[i] = { w: st.rain, d: 0 };
        float(x, y, "tilled");
      } else if (!tile.c) {
        if (st.seeds[st.selected] > 0) {
          st.seeds[st.selected] -= 1;
          tile.c = st.selected;
          tile.d = 0;
          float(x, y, CROP_MAP[st.selected].name, "#bfe8b0");
        } else {
          const other = CROP_IDS.find((id) => st.seeds[id] > 0);
          if (other) {
            st.selected = other;
            st.seeds[other] -= 1;
            tile.c = other;
            tile.d = 0;
            float(x, y, CROP_MAP[other].name, "#bfe8b0");
          } else say("No seeds left. Visit the striped stall to buy some.");
        }
      } else if (tile.d >= CROP_MAP[tile.c].days) {
        st.bag[tile.c] += 1;
        float(x, y, `+1 ${CROP_MAP[tile.c].name}`, "#ffd76a");
        delete tile.c;
        tile.d = 0;
      } else if (!tile.w) {
        tile.w = true;
        float(x, y, "watered", "#9fe0e6");
      } else {
        const left = CROP_MAP[tile.c].days - tile.d;
        say(
          `${CROP_MAP[tile.c].name}: ${left} more day${left === 1 ? "" : "s"}. Sleep to pass the night.`,
        );
      }
      rt.dirty = true;
      syncHud();
    };

    const arrive = () => {
      const p = rt.pending;
      rt.pending = null;
      if (!p) return;
      const kind = objectAt(p.x, p.y);
      if (kind) {
        rt.face = p.x < rt.s.px ? -1 : 1;
        rt.dir = p.y < rt.s.py ? "up" : p.y > rt.s.py ? "down" : "side";
        actObject(kind);
      } else if (p.x === rt.s.px && p.y === rt.s.py) actTile(p.x, p.y);
    };

    const goTo = (x: number, y: number) => {
      if (rt.sleeping || shopRef.current) return;
      const st = rt.s;
      rt.target = { x, y, life: 1.2 };
      const solid = solidAt(x, y);
      const sx = Math.round(rt.fx);
      const sy = Math.round(rt.fy);
      if (solid) {
        const kind = objectAt(x, y);
        if (!kind) return;
        // walk to any free tile next to that building
        const path = bfs(sx, sy, (cx, cy) =>
          [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ].some(([dx, dy]) => objectAt(cx + dx, cy + dy) === kind),
        );
        if (!path) return;
        rt.path = path;
        rt.pending = { x, y };
      } else {
        const path = bfs(sx, sy, (cx, cy) => cx === x && cy === y);
        if (!path) return;
        rt.path = path;
        rt.pending = { x, y };
      }
      if (rt.path.length === 0) {
        st.px = sx;
        st.py = sy;
        arrive();
      }
    };

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - r.left) / T + rt.camX);
      const y = Math.floor((e.clientY - r.top) / T + rt.camY);
      if (x < 0 || y < 0 || x >= W || y >= H) return;
      goTo(x, y);
    };
    canvas.addEventListener("pointerdown", onPointer);

    const MOVE: Record<string, [number, number]> = {
      arrowup: [0, -1],
      w: [0, -1],
      arrowdown: [0, 1],
      s: [0, 1],
      arrowleft: [-1, 0],
      a: [-1, 0],
      arrowright: [1, 0],
      d: [1, 0],
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (shopRef.current) {
        if (e.key === "Escape") openShop(false);
        return;
      }
      const k = e.key.toLowerCase();
      if (MOVE[k]) {
        rt.keys.add(k);
        e.preventDefault();
      } else if (k === " " || k === "e" || k === "enter") {
        e.preventDefault();
        if (rt.sleeping || rt.moving) return;
        const { px, py } = rt.s;
        const near = (
          [
            [rt.face, 0],
            [0, -1],
            [0, 1],
            [-rt.face, 0],
          ] as [number, number][]
        )
          .map(([dx, dy]) => objectAt(px + dx, py + dy))
          .find(Boolean);
        if (near) actObject(near);
        else actTile(px, py);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => rt.keys.delete(e.key.toLowerCase());
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let raf = 0;
    let last = performance.now();
    let hudAt = 0;
    let saveAt = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      rt.t += dt;
      const st = rt.s;

      if (rt.sleeping) {
        rt.fade = Math.min(1, rt.fade + dt * 1.6);
        if (rt.fade >= 1) {
          nextDay();
          rt.sleeping = false;
        }
      } else {
        rt.fade = Math.max(0, rt.fade - dt * 1.2);
        if (!shopRef.current) st.timeMs += dt * 1000;
        if (st.timeMs >= DAY_MS) {
          say("It's late. Carlos fell asleep where he stood.");
          sleep();
        }
      }

      // keyboard: take one step at a time while a key is held
      if (
        !rt.moving &&
        rt.path.length === 0 &&
        !rt.sleeping &&
        !shopRef.current
      ) {
        for (const k of rt.keys) {
          const [dx, dy] = MOVE[k];
          if (!solidAt(st.px + dx, st.py + dy)) {
            rt.path = [[st.px + dx, st.py + dy]];
            rt.pending = null;
          }
          if (dx) rt.face = dx as 1 | -1;
          rt.dir = dx ? "side" : dy < 0 ? "up" : "down";
          break;
        }
      }

      // walk along the path
      if (rt.path.length > 0) {
        rt.moving = true;
        const [nx, ny] = rt.path[0];
        const dx = nx - rt.fx;
        const dy = ny - rt.fy;
        const dist = Math.hypot(dx, dy);
        const step = SPEED * dt;
        if (dx > 0.01) rt.face = 1;
        else if (dx < -0.01) rt.face = -1;
        if (dist > 0.01)
          rt.dir =
            Math.abs(dx) > Math.abs(dy) ? "side" : dy < 0 ? "up" : "down";
        if (dist <= step) {
          rt.fx = nx;
          rt.fy = ny;
          st.px = nx;
          st.py = ny;
          rt.path.shift();
          if (rt.path.length === 0) {
            rt.moving = false;
            arrive();
          }
        } else {
          rt.fx += (dx / dist) * step;
          rt.fy += (dy / dist) * step;
        }
      } else rt.moving = false;

      // camera follows Carlos, clamped to the world
      const viewW = vw / T;
      const viewH = vh / T;
      const tx = Math.max(0, Math.min(W - viewW, rt.fx + 0.5 - viewW / 2));
      const ty = Math.max(0, Math.min(H - viewH, rt.fy + 0.5 - viewH / 2));
      rt.camX += (tx - rt.camX) * Math.min(1, dt * 8);
      rt.camY += (ty - rt.camY) * Math.min(1, dt * 8);

      for (const f of rt.floats) {
        f.life -= dt;
        f.y -= dt * 0.8;
      }
      rt.floats = rt.floats.filter((f) => f.life > 0);
      if (rt.target) {
        rt.target.life -= dt;
        if (rt.target.life <= 0) rt.target = null;
      }

      ctx.clearRect(0, 0, vw, vh);
      drawWorld(ctx, rt, T, vw, vh);

      if (now - hudAt > 500) {
        hudAt = now;
        syncHud();
      }
      if (rt.dirty && now - saveAt > 2000) {
        saveAt = now;
        save();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    syncHud();

    const onHide = () => save();
    window.addEventListener("pagehide", onHide);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("pagehide", onHide);
      save();
      rtRef.current = null;
    };
  }, [openShop, say, syncHud]);

  const buy = (id: CropId, count: number) => {
    const rt = rtRef.current;
    if (!rt) return;
    const cost = CROP_MAP[id].cost * count;
    if (rt.s.coins < cost) return;
    rt.s.coins -= cost;
    rt.s.seeds[id] += count;
    rt.s.selected = id;
    rt.dirty = true;
    syncHud();
  };

  const select = (id: CropId) => {
    const rt = rtRef.current;
    if (!rt) return;
    rt.s.selected = id;
    rt.dirty = true;
    syncHud();
  };

  const reset = () => {
    const rt = rtRef.current;
    if (
      !rt ||
      !window.confirm(
        "Start the farm over? Your coins, seeds and crops will be cleared.",
      )
    )
      return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(OLD_STORAGE_KEY);
    } catch {
      /* nothing to clear */
    }
    rt.s = freshSave();
    rt.fx = rt.s.px;
    rt.fy = rt.s.py;
    rt.path = [];
    rt.pending = null;
    rt.dirty = true;
    syncHud();
  };

  const owned = hud
    ? CROPS.filter((c) => hud.seeds[c.id] > 0 || c.id === hud.selected)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <p className="session-tag mb-3">Playground</p>
          <h1 className="font-display text-3xl md:text-4xl">
            Carlos&apos;s farm
          </h1>
        </div>
        {hud && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="chip flex items-center gap-1.5">
              Day {hud.day}
            </span>
            <span className="chip flex items-center gap-1.5">
              {hud.rain ? (
                <CloudRain className="w-3.5 h-3.5" />
              ) : hud.night ? (
                <Moon className="w-3.5 h-3.5" />
              ) : (
                <Sun className="w-3.5 h-3.5" />
              )}
              {hud.clock}
            </span>
            <span className="chip flex items-center gap-1.5" data-active="true">
              <Coins className="w-3.5 h-3.5" /> {fmt(hud.coins)}
            </span>
            <span
              className="chip flex items-center gap-1.5"
              title="Harvest waiting to be sold at the bin"
            >
              <ShoppingBasket className="w-3.5 h-3.5" /> {hud.bag}
              {hud.bag > 0 && (
                <span style={{ opacity: 0.7 }}>({fmt(hud.bagValue)})</span>
              )}
            </span>
          </div>
        )}
      </div>

      <div ref={wrapRef} className="farm-stage">
        <canvas
          ref={canvasRef}
          className="farm-canvas"
          aria-label="The farm. Tap a tile to walk Carlos there."
        />
        {toast && (
          <div key={toast.id} className="farm-toast" role="status">
            {toast.text}
          </div>
        )}
        {shop && hud && (
          <div className="farm-shop" role="dialog" aria-label="Seed stall">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-xl">Seed stall</span>
              <button
                className="farm-x"
                onClick={() => openShop(false)}
                aria-label="Close the stall"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs mb-3" style={{ opacity: 0.8 }}>
              You have {fmt(hud.coins)} coins.
            </p>
            <div className="space-y-2">
              {CROPS.map((c) => {
                const locked = hud.lifetime < c.unlockAt;
                return (
                  <div
                    key={c.id}
                    className="farm-row"
                    style={locked ? { opacity: 0.5 } : undefined}
                  >
                    <span
                      className="farm-dot"
                      style={{ background: c.color }}
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold">
                        {c.name}
                      </span>
                      <span className="block text-xs" style={{ opacity: 0.75 }}>
                        {locked
                          ? `Unlocks after earning ${fmt(c.unlockAt)} coins`
                          : `${c.days} days · sells for ${fmt(c.sell)} · you have ${hud.seeds[c.id]}`}
                      </span>
                    </span>
                    {!locked && (
                      <>
                        <button
                          className="farm-buy"
                          disabled={hud.coins < c.cost}
                          onClick={() => buy(c.id, 1)}
                        >
                          {fmt(c.cost)}
                        </button>
                        <button
                          className="farm-buy"
                          disabled={hud.coins < c.cost * 5}
                          onClick={() => buy(c.id, 5)}
                        >
                          ×5
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {hud && (
        <>
          <p className="farm-hint" aria-live="polite">
            {hud.hint}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="meta-label mr-1">Seeds</span>
            {owned.map((c) => (
              <button
                key={c.id}
                className="chip flex items-center gap-1.5"
                data-active={hud.selected === c.id}
                onClick={() => select(c.id)}
              >
                <span className="farm-dot" style={{ background: c.color }} />
                {c.name}
                <span style={{ opacity: 0.7 }}>×{hud.seeds[c.id]}</span>
              </button>
            ))}
            <button
              className="chip flex items-center gap-1.5 ml-auto"
              onClick={reset}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Start over
            </button>
          </div>
          <p className="text-xs mt-5" style={{ color: "var(--text-tertiary)" }}>
            Tap any tile and Carlos walks there and does the sensible thing:
            till, plant, water or harvest. Tap the stall to buy seeds, the bin
            to sell, and the house to sleep. On a keyboard, move with the arrow
            keys or WASD and press Space to act.
          </p>
        </>
      )}
    </div>
  );
}
