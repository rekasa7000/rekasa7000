import type { CropId, ObjectKind, UpgradeId } from "./data";

export interface Tile {
  c?: CropId;
  /** growth, 0 to 1 (1 = ripe) */
  g: number;
  /** seconds of water left; growth stops at 0 */
  wet: number;
}

export interface Order {
  need: Partial<Record<CropId, number>>;
  got: Partial<Record<CropId, number>>;
  /** seconds left; ignored when total is 0 (the first order has no timer) */
  time: number;
  total: number;
}

export interface Save {
  v: 3;
  coins: number;
  launches: number;
  streak: number;
  best: number;
  day: number;
  /** seconds into the current day-night cycle */
  clock: number;
  tiles: Record<number, Tile>;
  bag: Record<CropId, number>;
  selected: CropId;
  up: Record<UpgradeId, number>;
  order: Order | null;
  muted: boolean;
  px: number;
  py: number;
  /** which one-time tips have been shown (bit flags) */
  tips: number;
  intro: boolean;
}

export interface Pest {
  id: number;
  x: number;
  y: number;
  /** tile index it is heading for or eating */
  tile: number;
  state: "seek" | "eat" | "leave";
  t: number;
  seed: number;
}

export interface Ufo {
  /** ground position below the saucer */
  x: number;
  y: number;
  sx: number;
  tile: number;
  state: "in" | "beam" | "out";
  t: number;
  scared: boolean;
}

export interface Meteor {
  x: number;
  y: number;
  /** seconds until impact */
  t: number;
}

export interface Pickup {
  x: number;
  y: number;
  value: number;
  life: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  grav: number;
}

export interface FloatText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  coin?: boolean;
}

export interface Task {
  kind: "tile" | "object" | "pest";
  x: number;
  y: number;
  obj?: ObjectKind;
  pest?: number;
}

export interface World {
  s: Save;
  /** Carlos, in tiles, smoothly between tiles while walking */
  fx: number;
  fy: number;
  path: [number, number][];
  tasks: Task[];
  face: 1 | -1;
  dir: "down" | "up" | "side";
  moving: boolean;
  busy: number;
  stun: number;
  pests: Pest[];
  ufos: Ufo[];
  meteors: Meteor[];
  craters: { x: number; y: number; life: number }[];
  pickups: Pickup[];
  particles: Particle[];
  floats: FloatText[];
  rocket: { state: "pad" | "launch" | "away" | "land"; t: number };
  zap: { x1: number; y1: number; x2: number; y2: number; life: number } | null;
  drone: { x: number; y: number };
  rain: number;
  shower: number;
  camX: number;
  camY: number;
  shake: number;
  fade: number;
  napping: boolean;
  t: number;
}

export interface Hud {
  coins: number;
  bag: number;
  cap: number;
  launches: number;
  streak: number;
  best: number;
  day: number;
  night: boolean;
  rain: boolean;
  shower: boolean;
  selected: CropId;
  order: {
    items: { id: CropId; need: number; got: number; have: number }[];
    time: number;
    total: number;
  } | null;
  rocket: World["rocket"]["state"];
  eta: number;
  up: Record<UpgradeId, number>;
  hint: string;
  muted: boolean;
  intro: boolean;
}
