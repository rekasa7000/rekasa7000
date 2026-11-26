/** Rules and map for Carlos's space farm. Tune the game here. */

export type CropId =
  | "turnip"
  | "carrot"
  | "rice"
  | "strawberry"
  | "pumpkin"
  | "melon";

export interface CropDef {
  id: CropId;
  name: string;
  /** coins to plant one */
  cost: number;
  /** coins when loaded on the rocket (doubled if the order asked for it) */
  sell: number;
  /** seconds from seed to ripe while watered */
  grow: number;
  /** launches needed before it can be planted */
  unlock: number;
  color: string;
}

export const CROPS: CropDef[] = [
  {
    id: "turnip",
    name: "Turnip",
    cost: 0,
    sell: 4,
    grow: 8,
    unlock: 0,
    color: "#e9dff0",
  },
  {
    id: "carrot",
    name: "Carrot",
    cost: 3,
    sell: 10,
    grow: 14,
    unlock: 1,
    color: "#ff8a2a",
  },
  {
    id: "rice",
    name: "Rice",
    cost: 8,
    sell: 24,
    grow: 22,
    unlock: 3,
    color: "#e6c65a",
  },
  {
    id: "strawberry",
    name: "Strawberry",
    cost: 18,
    sell: 52,
    grow: 30,
    unlock: 5,
    color: "#e2413f",
  },
  {
    id: "pumpkin",
    name: "Pumpkin",
    cost: 40,
    sell: 115,
    grow: 44,
    unlock: 8,
    color: "#f27a1a",
  },
  {
    id: "melon",
    name: "Melon",
    cost: 85,
    sell: 250,
    grow: 60,
    unlock: 12,
    color: "#b9d98a",
  },
];
export const CROP_MAP = Object.fromEntries(
  CROPS.map((c) => [c.id, c]),
) as Record<CropId, CropDef>;
export const CROP_IDS = CROPS.map((c) => c.id);

export type UpgradeId = "boots" | "bag" | "can" | "compost" | "drone";

export const UPGRADES: {
  id: UpgradeId;
  name: string;
  desc: string;
  costs: number[];
}[] = [
  {
    id: "boots",
    name: "Rocket boots",
    desc: "Carlos runs faster.",
    costs: [40, 130, 320],
  },
  {
    id: "bag",
    name: "Bigger basket",
    desc: "Carry 4 more crops.",
    costs: [30, 110, 280],
  },
  {
    id: "can",
    name: "Sprinkler can",
    desc: "Watering also reaches the tiles around.",
    costs: [90, 340],
  },
  {
    id: "compost",
    name: "Star compost",
    desc: "Crops grow 15% faster.",
    costs: [60, 190, 460],
  },
  {
    id: "drone",
    name: "Guard drone",
    desc: "Zaps a slug every few seconds.",
    costs: [160, 620],
  },
];

// ── Time ──────────────────────────────────────────────────────────────────────

export const DAY_SECS = 60;
export const NIGHT_SECS = 30;
export const CYCLE = DAY_SECS + NIGHT_SECS;

/** 0 in daylight, 1 at full night, easing at dusk and dawn */
export function nightLevel(clock: number) {
  if (clock < DAY_SECS - 6) return 0;
  if (clock < DAY_SECS) return (clock - (DAY_SECS - 6)) / 6;
  if (clock < CYCLE - 5) return 1;
  return (CYCLE - clock) / 5;
}

// ── Map ───────────────────────────────────────────────────────────────────────

export const W = 20;
export const H = 15;

/** the plantable field */
export const FIELD = { x0: 4, y0: 6, x1: 15, y1: 12 };
export const inField = (x: number, y: number) =>
  x >= FIELD.x0 && x <= FIELD.x1 && y >= FIELD.y0 && y <= FIELD.y1;

export type Solid =
  | "void"
  | "tree"
  | "fruit"
  | "house"
  | "stall"
  | "rocket"
  | "crate"
  | "pond"
  | "rock"
  | "lantern";
export type ObjectKind = "house" | "stall" | "rocket";

/** lamp posts: they block the way and glow after dark */
export const LANTERNS: [number, number][] = [
  [6, 2],
  [10, 2],
  [3, 13],
  [16, 13],
];

export const ROCKET = { x: 11, y: 2 };

function buildSolids(): (Solid | null)[] {
  const s: (Solid | null)[] = Array(W * H).fill(null);
  const set = (x: number, y: number, k: Solid) => {
    if (x >= 0 && y >= 0 && x < W && y < H) s[y * W + x] = k;
  };
  // the island floats in space: the outer ring is empty sky
  for (let x = 0; x < W; x++) {
    set(x, 0, "void");
    set(x, H - 1, "void");
  }
  for (let y = 0; y < H; y++) {
    set(0, y, "void");
    set(W - 1, y, "void");
  }
  for (let x = 2; x <= 4; x++) for (let y = 1; y <= 3; y++) set(x, y, "house");
  set(7, 2, "stall");
  set(8, 2, "stall");
  set(ROCKET.x, ROCKET.y, "rocket");
  set(12, 2, "crate");
  for (let x = 14; x <= 17; x++) for (let y = 2; y <= 4; y++) set(x, y, "pond");
  set(2, 8, "rock");
  set(17, 9, "rock");
  set(2, 12, "fruit");
  set(17, 12, "fruit");
  set(17, 6, "fruit");
  set(1, 6, "tree");
  set(18, 8, "tree");
  set(9, 13, "tree");
  set(1, 1, "tree");
  set(18, 1, "tree");
  for (const [lx, ly] of LANTERNS) set(lx, ly, "lantern");
  return s;
}

export const SOLIDS = buildSolids();
export const solidAt = (x: number, y: number): Solid | null =>
  x < 0 || y < 0 || x >= W || y >= H ? "void" : SOLIDS[y * W + x];
export const objectAt = (x: number, y: number): ObjectKind | null => {
  const s = solidAt(x, y);
  return s === "house" || s === "stall" || s === "rocket" ? s : null;
};

/** stable pseudo-random number per pair, for stars, ripples and scatter */
export const hash = (x: number, y: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

/** shortest walkable path from a tile to the first tile that satisfies `goal`; null when unreachable */
export function bfs(
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
