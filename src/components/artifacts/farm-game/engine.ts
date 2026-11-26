import { Sfx } from "./audio";
import {
  CROPS,
  CROP_IDS,
  CROP_MAP,
  CYCLE,
  DAY_SECS,
  FIELD,
  H,
  ROCKET,
  UPGRADES,
  W,
  bfs,
  inField,
  objectAt,
  solidAt,
  type CropId,
  type ObjectKind,
  type UpgradeId,
} from "./data";
import { drawWorld, loadSprites } from "./draw";
import type { Hud, Order, Save, Task, World } from "./types";

const KEY = "rekasa-farm-v3";
const OLD_KEYS = ["rekasa-farm-v2", "rekasa-farm-v1"];

// one-time tips
const TIP_SLUG = 1;
const TIP_UFO = 2;
const TIP_THIRST = 4;
const TIP_BAG = 8;
const TIP_NIGHT = 16;
const TIP_DRAG = 32;

export interface GameApi {
  destroy(): void;
  /** leave the intro card and begin */
  start(): void;
  buy(id: UpgradeId): void;
  select(id: CropId): void;
  setMuted(muted: boolean): void;
  setPaused(paused: boolean): void;
  reset(): void;
}

export interface Callbacks {
  onHud(hud: Hud): void;
  onToast(text: string): void;
  onShop(): void;
}

const zeroCounts = () =>
  Object.fromEntries(CROP_IDS.map((id) => [id, 0])) as Record<CropId, number>;

function makeOrder(launches: number): Order {
  if (launches === 0)
    return { need: { turnip: 3 }, got: {}, time: 0, total: 0 };
  const unlocked = CROPS.filter((c) => c.unlock <= launches);
  const newest = unlocked[unlocked.length - 1];
  const kinds = Math.min(
    unlocked.length,
    launches >= 6 ? 3 : launches >= 2 ? 2 : 1,
  );
  const picks = [newest];
  const pool = unlocked.slice(0, -1);
  while (picks.length < kinds && pool.length)
    picks.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  const budget = Math.min(12, 3 + launches);
  const need: Partial<Record<CropId, number>> = {};
  let left = budget;
  let work = 0;
  picks.forEach((crop, i) => {
    const others = picks.length - 1 - i;
    const share =
      others === 0
        ? left
        : Math.round(budget / picks.length + (Math.random() - 0.5));
    const qty = Math.max(1, Math.min(left - others, share));
    need[crop.id] = qty;
    left -= qty;
    work += qty * crop.grow;
  });
  const total = Math.round(45 + work * 0.35);
  return { need, got: {}, time: total, total };
}

function freshSave(): Save {
  return {
    v: 3,
    coins: 10,
    launches: 0,
    streak: 0,
    best: 0,
    day: 1,
    clock: 0,
    tiles: {},
    bag: zeroCounts(),
    selected: "turnip",
    up: { boots: 0, bag: 0, can: 0, compost: 0, drone: 0 },
    order: makeOrder(0),
    muted: false,
    px: 9,
    py: 4,
    tips: 0,
    intro: false,
  };
}

function loadSave(): Save {
  const base = freshSave();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Save>;
      const merged: Save = {
        ...base,
        ...p,
        v: 3,
        bag: { ...base.bag, ...p.bag },
        up: { ...base.up, ...p.up },
        tiles: p.tiles ?? {},
      };
      if (solidAt(merged.px, merged.py)) {
        merged.px = base.px;
        merged.py = base.py;
      }
      if (!merged.order) merged.order = makeOrder(merged.launches);
      return merged;
    }
    // a few coins carry over from the earlier versions of the game
    for (const key of OLD_KEYS) {
      const old = localStorage.getItem(key);
      if (!old) continue;
      const o = JSON.parse(old) as { coins?: number };
      base.coins = Math.max(
        base.coins,
        Math.min(150, Math.floor(o.coins ?? 0)),
      );
      break;
    }
  } catch {
    /* start fresh */
  }
  return base;
}

export function createGame(
  canvas: HTMLCanvasElement,
  wrap: HTMLElement,
  cb: Callbacks,
): GameApi {
  const noop: GameApi = {
    destroy() {},
    start() {},
    buy() {},
    select() {},
    setMuted() {},
    setPaused() {},
    reset() {},
  };
  const maybeCtx = canvas.getContext("2d");
  if (!maybeCtx) return noop;
  const ctx = maybeCtx;

  loadSprites();
  const sfx = new Sfx();
  const s = loadSave();
  sfx.muted = s.muted;

  const w: World = {
    s,
    fx: s.px,
    fy: s.py,
    path: [],
    tasks: [],
    face: 1,
    dir: "down",
    moving: false,
    busy: 0,
    stun: 0,
    pests: [],
    ufos: [],
    meteors: [],
    craters: [],
    pickups: [],
    particles: [],
    floats: [],
    rocket: { state: "pad", t: 0 },
    zap: null,
    drone: { x: FIELD.x0 + 1, y: FIELD.y0 - 0.6 },
    rain: 0,
    shower: 0,
    camX: 0,
    camY: 0,
    shake: 0,
    fade: 0,
    napping: false,
    t: 0,
  };

  let paused = false;
  let pestId = 0;
  let pestT = 12;
  let ufoT = 10;
  let meteorT = 0;
  let droneT = 3;
  let combo = 0;
  let comboT = 0;
  let ripeSoundT = 0;
  let wasNight = s.clock >= DAY_SECS;
  const keys = new Set<string>();

  // ── layout ──
  let T = 40;
  let vw = 0;
  let vh = 0;
  const resize = () => {
    const aw = wrap.clientWidth;
    const ah = wrap.clientHeight;
    if (aw < 20 || ah < 20) return;
    // show the whole island when it fits; otherwise zoom in and follow Carlos
    const fit = Math.floor(Math.min(aw / W, ah / H));
    T =
      fit >= 30
        ? Math.min(52, fit)
        : Math.max(30, Math.min(46, Math.floor(aw / 9.5)));
    vw = Math.min(aw, W * T);
    vh = Math.min(ah, H * T);
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

  // ── small helpers ──
  const idx = (x: number, y: number) => y * W + x;
  const bagCount = () => CROP_IDS.reduce((n, id) => n + s.bag[id], 0);
  const bagCap = () => 8 + 4 * s.up.bag;
  const wetSecs = () => 16 + 3 * s.up.can;
  const streakMult = () => 1 + 0.1 * Math.min(10, s.streak);
  const isNight = () => s.clock >= DAY_SECS;
  const pcx = () => w.fx + 0.5;
  const pcy = () => w.fy + 0.5;
  const say = (text: string) => cb.onToast(text);
  const tip = (bit: number, text: string) => {
    if (s.tips & bit) return;
    s.tips |= bit;
    say(text);
  };
  const float = (
    x: number,
    y: number,
    text: string,
    color = "#f3ebdd",
    coin = false,
  ) => w.floats.push({ x, y, text, color, life: coin ? 1.5 : 1.05, coin });
  const burst = (
    x: number,
    y: number,
    n: number,
    color: string,
    speed = 2.4,
    grav = 6,
    size = 1.6,
    life = 0.5,
  ) => {
    for (let i = 0; i < n && w.particles.length < 320; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.4 + Math.random() * 0.6);
      const l = life * (0.6 + Math.random() * 0.6);
      w.particles.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - speed * 0.5,
        life: l,
        max: l,
        size: size * (0.6 + Math.random() * 0.8),
        color,
        grav,
      });
    }
  };

  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* storage unavailable: the game still plays */
    }
  };

  const hintFor = (): string => {
    if (s.launches >= 4) return "";
    const tiles = Object.values(s.tiles);
    const crops = tiles.filter((t) => t.c);
    if (w.ufos.some((u) => u.state === "beam"))
      return "A UFO is stealing a crop. Tap it to send Carlos!";
    if (w.pests.length) return "Tap the slug before it eats your crop.";
    if (crops.length === 0 && bagCount() === 0)
      return "Tap the field to plant. Drag to plant a whole row.";
    if (bagCount() >= bagCap())
      return "Basket full. Tap the rocket to load it.";
    if (crops.some((t) => t.g >= 1))
      return "Sparkling crops are ripe. Tap or drag across them to harvest.";
    if (bagCount() > 0 && w.rocket.state === "pad")
      return "Tap the rocket to load your harvest.";
    if (crops.some((t) => t.g < 1 && t.wet <= 0))
      return "A blue drop means thirsty. Tap the crop to water it.";
    if (w.rocket.state !== "pad")
      return "The rocket is on its way back. Keep planting.";
    return "Fill the rocket's order before its timer runs out.";
  };

  let hudAt = 0;
  const syncHud = () => {
    const order = s.order;
    cb.onHud({
      coins: s.coins,
      bag: bagCount(),
      cap: bagCap(),
      launches: s.launches,
      streak: s.streak,
      best: s.best,
      day: s.day,
      night: isNight(),
      rain: w.rain > 0,
      shower: w.shower > 0 || w.meteors.length > 0,
      selected: s.selected,
      order: order
        ? {
            items: CROP_IDS.filter((id) => order.need[id]).map((id) => ({
              id,
              need: order.need[id] ?? 0,
              got: order.got[id] ?? 0,
              have: s.bag[id],
            })),
            time: order.time,
            total: order.total,
          }
        : null,
      rocket: w.rocket.state,
      eta:
        w.rocket.state === "launch"
          ? 2.4 - w.rocket.t + 6 + 1.6
          : w.rocket.state === "away"
            ? 6 - w.rocket.t + 1.6
            : w.rocket.state === "land"
              ? 1.6 - w.rocket.t
              : 0,
      up: { ...s.up },
      hint: hintFor(),
      muted: s.muted,
      intro: s.intro,
    });
  };

  // ── farming ──
  const plant = (x: number, y: number) => {
    let crop = CROP_MAP[s.selected];
    if (crop.unlock > s.launches) crop = CROP_MAP.turnip;
    if (s.coins < crop.cost) {
      float(x + 0.5, y, `Need ${crop.cost}`, "#ff9d7a");
      sfx.play("deny");
      return;
    }
    s.coins -= crop.cost;
    s.tiles[idx(x, y)] = { c: crop.id, g: 0, wet: wetSecs() };
    burst(x + 0.5, y + 0.6, 6, "#7a5536", 1.8, 7, 1.5, 0.35);
    sfx.play("plant");
  };

  const water = (x: number, y: number) => {
    const reach = s.up.can;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const far = Math.abs(dx) + Math.abs(dy);
        if (far > 0 && (reach === 0 || (reach === 1 && far > 1))) continue;
        const tile = s.tiles[idx(x + dx, y + dy)];
        if (!tile?.c || tile.g >= 1) continue;
        tile.wet = wetSecs();
        burst(x + dx + 0.5, y + dy + 0.3, 5, "#7fd0ee", 1.6, 9, 1.3, 0.4);
      }
    }
    sfx.play("water");
  };

  const harvest = (x: number, y: number) => {
    const tile = s.tiles[idx(x, y)];
    if (!tile?.c) return;
    if (bagCount() >= bagCap()) {
      float(x + 0.5, y, "Basket full", "#ff9d7a");
      sfx.play("deny");
      tip(
        TIP_BAG,
        "Your basket is full. Load the rocket, or buy a bigger basket at the stall.",
      );
      return;
    }
    const crop = CROP_MAP[tile.c];
    s.bag[tile.c] += 1;
    delete tile.c;
    tile.g = 0;
    combo = comboT > 0 ? combo + 1 : 1;
    comboT = 1.3;
    burst(x + 0.5, y + 0.3, 9, crop.color, 2.8, 7, 1.7, 0.45);
    burst(x + 0.5, y + 0.3, 4, "#5fbf6a", 2.2, 7, 1.4, 0.4);
    sfx.play("pluck", combo - 1);
    if (combo >= 3 && combo % 3 === 0) {
      s.coins += combo;
      float(x + 0.5, y - 0.3, `Combo ×${combo}  +${combo}`, "#ffd76a", true);
    } else float(x + 0.5, y, `+1 ${crop.name}`, "#f3ebdd");
  };

  const smartAct = (x: number, y: number) => {
    const tile = s.tiles[idx(x, y)];
    if (!tile?.c) plant(x, y);
    else if (tile.g >= 1) harvest(x, y);
    else if (tile.wet <= 0) water(x, y);
  };

  // ── the rocket ──
  const launch = (complete: boolean) => {
    w.rocket = { state: "launch", t: 0 };
    sfx.play("launch");
    if (complete) {
      const bonus = Math.round((10 + 5 * s.launches) * streakMult());
      s.launches += 1;
      s.streak += 1;
      s.best = Math.max(s.best, s.streak);
      s.coins += bonus;
      float(ROCKET.x + 0.5, ROCKET.y - 0.6, `+${bonus}`, "#ffd76a", true);
      const unlocked = CROPS.find((c) => c.unlock === s.launches);
      say(
        unlocked
          ? `Lift-off! Launch ${s.launches}. ${unlocked.name} seeds unlocked.`
          : `Lift-off! Launch ${s.launches}${s.streak > 1 ? `, streak ×${s.streak}` : ""}.`,
      );
      if (unlocked) s.selected = unlocked.id;
    } else {
      s.streak = 0;
      say(
        "Time's up. The rocket left without the full order, and your streak is gone.",
      );
    }
    s.order = null;
  };

  const deliver = () => {
    if (w.rocket.state !== "pad" || !s.order) {
      say("The rocket is away. It will be back in a moment.");
      return;
    }
    if (bagCount() === 0) {
      say("Harvest crops and bring them here to load the rocket.");
      sfx.play("deny");
      return;
    }
    const order = s.order;
    let total = 0;
    for (const id of CROP_IDS) {
      const n = s.bag[id];
      if (!n) continue;
      const wanted = Math.max(0, (order.need[id] ?? 0) - (order.got[id] ?? 0));
      const take = Math.min(n, wanted);
      if (take) order.got[id] = (order.got[id] ?? 0) + take;
      // crops the order asked for pay double; anything else still sells
      total += (take * 2 + (n - take)) * CROP_MAP[id].sell;
      s.bag[id] = 0;
    }
    total = Math.round(total * streakMult());
    s.coins += total;
    float(ROCKET.x + 0.5, ROCKET.y - 0.2, `+${total}`, "#ffd76a", true);
    burst(ROCKET.x + 0.5, ROCKET.y + 0.2, 10, "#ffd76a", 2.6, 5, 1.6, 0.6);
    sfx.play("coin");
    if (CROP_IDS.every((id) => (order.got[id] ?? 0) >= (order.need[id] ?? 0)))
      launch(true);
  };

  const nap = () => {
    if (!isNight()) {
      say(
        "Carlos only naps at night. Tap the house after dark to skip to morning.",
      );
      return;
    }
    w.napping = true;
    w.tasks = [];
    w.path = [];
  };

  const actObject = (kind: ObjectKind) => {
    if (kind === "stall") cb.onShop();
    else if (kind === "rocket") deliver();
    else nap();
    syncHud();
  };

  // ── trouble ──
  const cropTiles = () =>
    Object.entries(s.tiles)
      .filter(([, tile]) => tile.c)
      .map(([key]) => Number(key));

  const killPest = (id: number, reward: boolean) => {
    const pest = w.pests.find((p) => p.id === id);
    if (!pest) return;
    w.pests = w.pests.filter((p) => p.id !== id);
    burst(pest.x, pest.y, 12, "#8f6fd6", 3, 5, 1.8, 0.5);
    sfx.play("zap");
    if (reward) {
      const coins = 1 + Math.floor(s.launches / 3);
      s.coins += coins;
      float(pest.x, pest.y - 0.4, `+${coins}`, "#ffd76a", true);
    }
  };

  const spawnPest = () => {
    const free = cropTiles().filter((i) => !w.pests.some((p) => p.tile === i));
    if (!free.length) return;
    const side = Math.floor(Math.random() * 4);
    w.pests.push({
      id: ++pestId,
      x: side === 0 ? 0.6 : side === 1 ? W - 0.6 : 1 + Math.random() * (W - 2),
      y: side === 2 ? 0.6 : side === 3 ? H - 0.6 : 1 + Math.random() * (H - 2),
      tile: free[Math.floor(Math.random() * free.length)],
      state: "seek",
      t: 0,
      seed: Math.random() * 10,
    });
    tip(
      TIP_SLUG,
      "A space slug is after your crops. Tap it and Carlos will chase it off.",
    );
  };

  const spawnUfo = () => {
    const all = cropTiles().filter((i) => !w.ufos.some((u) => u.tile === i));
    const ripe = all.filter((i) => s.tiles[i].g >= 1);
    const pool = ripe.length ? ripe : all.filter((i) => s.tiles[i].g > 0.5);
    if (!pool.length) return;
    const tile = pool[Math.floor(Math.random() * pool.length)];
    w.ufos.push({
      x: (tile % W) + 0.5,
      y: -3,
      sx: (tile % W) + 0.5 + (Math.random() < 0.5 ? -5 : 5),
      tile,
      state: "in",
      t: 0,
      scared: false,
    });
  };

  const impact = (x: number, y: number) => {
    w.shake = 7;
    w.craters.push({ x, y, life: 7 });
    burst(x, y, 18, "#ffb347", 4.2, 6, 2, 0.6);
    burst(x, y, 10, "#5c4636", 3, 8, 1.8, 0.5);
    sfx.play("boom");
    const tile = s.tiles[idx(Math.floor(x), Math.floor(y))];
    if (tile?.c) {
      delete tile.c;
      tile.g = 0;
      float(x, y - 0.5, "Crushed", "#ff9d7a");
    }
    if (Math.hypot(pcx() - x, pcy() - y) < 0.8 && w.stun <= 0) {
      w.stun = 1.5;
      w.tasks = [];
      w.path = [];
      float(pcx(), pcy() - 0.9, "Ouch!", "#ff9d7a");
      sfx.play("ouch");
    } else w.pickups.push({ x, y, value: 5 + s.launches, life: 22 });
  };

  // ── input ──
  const adjacent = (x: number, y: number, kind: ObjectKind) =>
    [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ].some(([dx, dy]) => objectAt(x + dx, y + dy) === kind);

  let painting = false;
  let lastPaint = -1;
  const toWorld = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / T + w.camX,
      y: (e.clientY - r.top) / T + w.camY,
    };
  };

  const onDown = (e: PointerEvent) => {
    sfx.unlock();
    if (paused || w.napping) return;
    const p = toWorld(e);
    // a slug or a UFO under the finger comes first
    const pest = w.pests.find(
      (q) => Math.hypot(q.x - p.x, q.y - p.y - 0.1) < 0.85,
    );
    if (pest) {
      w.tasks = [{ kind: "pest", x: 0, y: 0, pest: pest.id }];
      w.path = [];
      return;
    }
    const ufo = w.ufos.find(
      (u) =>
        u.state !== "out" &&
        (Math.hypot(u.x - p.x, u.y - 1.5 - p.y) < 1 ||
          Math.hypot(u.x - p.x, u.y - p.y) < 0.8),
    );
    const x = ufo ? ufo.tile % W : Math.floor(p.x);
    const y = ufo ? Math.floor(ufo.tile / W) : Math.floor(p.y);
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const kind = objectAt(x, y);
    if (kind) {
      w.tasks = [{ kind: "object", x, y, obj: kind }];
      w.path = [];
      return;
    }
    if (solidAt(x, y)) return;
    w.tasks = [{ kind: "tile", x, y }];
    w.path = [];
    painting = inField(x, y) && !ufo;
    lastPaint = idx(x, y);
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* not supported: dragging still works while the finger stays on the canvas */
    }
  };

  const onMove = (e: PointerEvent) => {
    if (!painting || paused) return;
    const p = toWorld(e);
    const x = Math.floor(p.x);
    const y = Math.floor(p.y);
    if (!inField(x, y) || idx(x, y) === lastPaint) return;
    lastPaint = idx(x, y);
    if (
      w.tasks.length < 60 &&
      !w.tasks.some(
        (task) => task.kind === "tile" && task.x === x && task.y === y,
      )
    ) {
      w.tasks.push({ kind: "tile", x, y });
      s.tips |= TIP_DRAG;
    }
  };

  const onUp = () => {
    painting = false;
  };

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
    if (paused) return;
    const k = e.key.toLowerCase();
    if (MOVE[k]) {
      sfx.unlock();
      keys.add(k);
      e.preventDefault();
    } else if (k === " " || k === "e" || k === "enter") {
      sfx.unlock();
      e.preventDefault();
      if (w.napping || w.moving || w.stun > 0) return;
      const near = w.pests.find(
        (p) => Math.hypot(p.x - pcx(), p.y - pcy()) < 1.6,
      );
      const obj = (["rocket", "stall", "house"] as ObjectKind[]).find((kind) =>
        adjacent(s.px, s.py, kind),
      );
      if (near) killPest(near.id, true);
      else if (obj) actObject(obj);
      else if (inField(s.px, s.py)) smartAct(s.px, s.py);
      w.busy = 0.1;
      syncHud();
    }
  };
  const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  // ── Carlos ──
  const updatePlayer = (dt: number) => {
    if (w.stun > 0) {
      w.stun -= dt;
      w.moving = false;
      return;
    }
    if (w.busy > 0) {
      w.busy -= dt;
      return;
    }
    // keyboard: one step at a time while a key is held
    if (w.path.length === 0 && w.tasks.length === 0) {
      for (const k of keys) {
        const [dx, dy] = MOVE[k];
        if (!solidAt(s.px + dx, s.py + dy)) w.path = [[s.px + dx, s.py + dy]];
        if (dx) w.face = dx as 1 | -1;
        w.dir = dx ? "side" : dy < 0 ? "up" : "down";
        break;
      }
    }
    if (w.path.length === 0 && w.tasks.length) {
      const task: Task = w.tasks[0];
      const px = s.px;
      const py = s.py;
      if (task.kind === "tile") {
        if (px === task.x && py === task.y) {
          w.tasks.shift();
          if (inField(px, py)) {
            smartAct(px, py);
            w.busy = 0.09;
          }
          return;
        }
        const path = bfs(px, py, (cx, cy) => cx === task.x && cy === task.y);
        if (!path) {
          w.tasks.shift();
          return;
        }
        w.path = path;
      } else if (task.kind === "object" && task.obj) {
        const kind = task.obj;
        if (adjacent(px, py, kind)) {
          w.tasks.shift();
          w.face = task.x < px ? -1 : 1;
          w.dir = task.y < py ? "up" : task.y > py ? "down" : "side";
          actObject(kind);
          w.busy = 0.12;
          return;
        }
        const path = bfs(px, py, (cx, cy) => adjacent(cx, cy, kind));
        if (!path) {
          w.tasks.shift();
          return;
        }
        w.path = path;
      } else {
        const pest = w.pests.find((p) => p.id === task.pest);
        if (!pest) {
          w.tasks.shift();
          return;
        }
        if (Math.hypot(px + 0.5 - pest.x, py + 0.5 - pest.y) <= 1.35) {
          w.tasks.shift();
          w.face = pest.x < px + 0.5 ? -1 : 1;
          w.dir = "side";
          killPest(pest.id, true);
          w.busy = 0.15;
          return;
        }
        const path = bfs(
          px,
          py,
          (cx, cy) => Math.hypot(cx + 0.5 - pest.x, cy + 0.5 - pest.y) <= 1.2,
        );
        if (!path || path.length === 0) {
          w.tasks.shift();
          return;
        }
        w.path = path;
      }
    }
    if (w.path.length === 0) {
      w.moving = false;
      return;
    }
    w.moving = true;
    const [nx, ny] = w.path[0];
    const dx = nx - w.fx;
    const dy = ny - w.fy;
    const dist = Math.hypot(dx, dy);
    const step = 6.2 * (1 + 0.18 * s.up.boots) * dt;
    if (dx > 0.01) w.face = 1;
    else if (dx < -0.01) w.face = -1;
    if (dist > 0.01)
      w.dir = Math.abs(dx) > Math.abs(dy) ? "side" : dy < 0 ? "up" : "down";
    if (dist <= step) {
      w.fx = nx;
      w.fy = ny;
      s.px = nx;
      s.py = ny;
      w.path.shift();
      // the slug may have moved: plan the next step afresh
      if (w.tasks[0]?.kind === "pest") w.path = [];
      if (w.path.length === 0) w.moving = w.tasks.length > 0;
    } else {
      w.fx += (dx / dist) * step;
      w.fy += (dy / dist) * step;
    }
  };

  // ── one step of the world ──
  const update = (dt: number) => {
    const L = s.launches;

    // time of day
    s.clock += dt;
    if (s.clock >= CYCLE) {
      s.clock -= CYCLE;
      s.day += 1;
      const rains = L >= 1 && Math.random() < 0.22;
      if (rains) w.rain = 14;
      say(
        rains
          ? `Day ${s.day}. Rain: everything gets watered.`
          : `Day ${s.day}.`,
      );
    }
    const night = isNight();
    if (night && !wasNight) {
      if (L >= 3) {
        w.shower = 5 + Math.min(7, L);
        meteorT = 4;
        say(
          "Meteor shower! Stay off the orange rings, then grab the star shards.",
        );
      } else if (L >= 1)
        tip(
          TIP_NIGHT,
          "Night falls. Slugs get bolder in the dark. Tap the house to sleep through it.",
        );
    }
    wasNight = night;

    if (w.rain > 0) w.rain -= dt;
    comboT -= dt;
    ripeSoundT -= dt;

    // crops
    const speed = 1 + 0.15 * s.up.compost;
    for (const tile of Object.values(s.tiles)) {
      if (!tile.c || tile.g >= 1) continue;
      if (w.rain > 0) tile.wet = Math.max(tile.wet, 2);
      if (tile.wet <= 0) {
        if (!w.pests.length)
          tip(
            TIP_THIRST,
            "A blue drop means a crop is thirsty. Tap it to water it.",
          );
        continue;
      }
      tile.wet -= dt;
      tile.g += (dt / CROP_MAP[tile.c].grow) * speed;
      if (tile.g >= 1) {
        tile.g = 1;
        if (ripeSoundT <= 0) {
          sfx.play("ripe");
          ripeSoundT = 0.25;
        }
      }
    }

    // slugs
    if (L >= 1) {
      pestT -= dt;
      if (pestT <= 0) {
        if (w.pests.length < Math.min(5, 2 + Math.floor(L / 3))) spawnPest();
        pestT =
          Math.max(7, 20 - 1.3 * L) *
          (night ? 0.6 : 1) *
          (0.7 + Math.random() * 0.6);
      }
    }
    for (const p of w.pests) {
      p.t += dt;
      let tile = s.tiles[p.tile];
      if (p.state !== "leave" && !tile?.c) {
        const free = cropTiles().filter(
          (i) => !w.pests.some((q) => q !== p && q.tile === i),
        );
        if (free.length) {
          p.tile = free[Math.floor(Math.random() * free.length)];
          p.state = "seek";
          tile = s.tiles[p.tile];
        } else p.state = "leave";
      }
      if (p.state === "seek") {
        const tx = (p.tile % W) + 0.5;
        const ty = Math.floor(p.tile / W) + 0.5;
        const d = Math.hypot(tx - p.x, ty - p.y);
        if (d < 0.06) p.state = "eat";
        else {
          const step = Math.min(d, 0.95 * dt);
          p.x += ((tx - p.x) / d) * step;
          p.y += ((ty - p.y) / d) * step;
        }
      } else if (p.state === "eat" && tile?.c) {
        tile.g -= dt * 0.12;
        if (Math.random() < dt * 5)
          burst(p.x, p.y - 0.2, 1, "#5fbf6a", 1.6, 6, 1.2, 0.35);
        if (tile.g <= 0) {
          delete tile.c;
          tile.g = 0;
          float(p.x, p.y - 0.5, "Eaten", "#ff9d7a");
        }
      } else if (p.state === "leave") {
        const ax = p.x - W / 2;
        const ay = p.y - H / 2;
        const d = Math.hypot(ax, ay) || 1;
        p.x += (ax / d) * 1.6 * dt;
        p.y += (ay / d) * 1.6 * dt;
      }
    }
    w.pests = w.pests.filter(
      (p) => p.x > -1 && p.y > -1 && p.x < W + 1 && p.y < H + 1,
    );

    // guard drone
    if (s.up.drone > 0) {
      w.drone.x =
        FIELD.x0 +
        0.5 +
        ((Math.sin(w.t * 0.35) + 1) / 2) * (FIELD.x1 - FIELD.x0);
      w.drone.y = FIELD.y0 - 0.3;
      droneT -= dt;
      if (droneT <= 0) {
        const target = w.pests.find((p) => p.state !== "leave");
        if (target) {
          w.zap = {
            x1: w.drone.x,
            y1: w.drone.y,
            x2: target.x,
            y2: target.y,
            life: 0.25,
          };
          killPest(target.id, true);
          droneT = s.up.drone >= 2 ? 4 : 8;
        } else droneT = 0.5;
      }
    }
    if (w.zap) {
      w.zap.life -= dt;
      if (w.zap.life <= 0) w.zap = null;
    }

    // UFOs
    if (L >= 2 && (night || L >= 6)) {
      ufoT -= dt;
      if (ufoT <= 0) {
        if (w.ufos.length < (L >= 9 ? 2 : 1)) spawnUfo();
        ufoT = (night ? 13 : 34) * (0.7 + Math.random() * 0.6);
      }
    }
    for (const u of w.ufos) {
      u.t += dt;
      const tx = (u.tile % W) + 0.5;
      const ty = Math.floor(u.tile / W) + 0.5;
      if (u.state === "in") {
        const k = Math.min(1, u.t / 1.3);
        const e = 1 - Math.pow(1 - k, 3);
        u.x = u.sx + (tx - u.sx) * e;
        u.y = -3 + (ty + 3) * e;
        if (k >= 1) {
          u.state = "beam";
          u.t = 0;
          sfx.play("ufo");
          tip(
            TIP_UFO,
            "A UFO is beaming up a crop! Send Carlos under it before the ring fills.",
          );
        }
      } else if (u.state === "beam") {
        const tile = s.tiles[u.tile];
        if (!tile?.c) {
          u.state = "out";
          u.t = 0;
        } else if (Math.hypot(pcx() - tx, pcy() - ty) <= 1.3 && w.stun <= 0) {
          u.state = "out";
          u.t = 0;
          u.scared = true;
          w.pickups.push({ x: tx, y: ty, value: 6 + 2 * L, life: 22 });
          float(tx, ty - 1.6, "Shoo!", "#bfe8b0");
          sfx.play("zap");
        } else if (u.t >= 5) {
          burst(tx, ty, 10, CROP_MAP[tile.c].color, 2, -6, 1.6, 0.7);
          delete tile.c;
          tile.g = 0;
          float(tx, ty - 0.6, "Stolen", "#ff9d7a");
          u.state = "out";
          u.t = 0;
        }
      } else {
        u.y -= dt * 7;
        u.x += dt * (u.scared ? 9 : 3);
      }
    }
    w.ufos = w.ufos.filter((u) => !(u.state === "out" && u.t > 1.2));

    // meteors
    if (w.shower > 0 && night) {
      meteorT -= dt;
      if (meteorT <= 0) {
        w.shower -= 1;
        meteorT = 0.9 + Math.random() * 0.7;
        for (let tries = 0; tries < 12; tries++) {
          const onField = Math.random() < 0.65;
          const x = onField
            ? FIELD.x0 + Math.floor(Math.random() * (FIELD.x1 - FIELD.x0 + 1))
            : 1 + Math.floor(Math.random() * (W - 2));
          const y = onField
            ? FIELD.y0 + Math.floor(Math.random() * (FIELD.y1 - FIELD.y0 + 1))
            : 1 + Math.floor(Math.random() * (H - 2));
          if (solidAt(x, y)) continue;
          w.meteors.push({ x: x + 0.5, y: y + 0.5, t: 1.7 });
          break;
        }
      }
    } else if (!night) w.shower = 0;
    for (const m of w.meteors) {
      m.t -= dt;
      if (m.t <= 0) impact(m.x, m.y);
    }
    w.meteors = w.meteors.filter((m) => m.t > 0);
    for (const cr of w.craters) cr.life -= dt;
    w.craters = w.craters.filter((cr) => cr.life > 0);

    // things to pick up
    for (const p of w.pickups) {
      p.life -= dt;
      if (Math.hypot(pcx() - p.x, pcy() - p.y) < 0.8) {
        p.life = 0;
        s.coins += p.value;
        float(p.x, p.y - 0.5, `+${p.value}`, "#ffd76a", true);
        burst(p.x, p.y, 8, "#ffd76a", 2.4, 3, 1.5, 0.5);
        sfx.play("pickup");
      }
    }
    w.pickups = w.pickups.filter((p) => p.life > 0);

    // the rocket and its order
    const r = w.rocket;
    if (r.state === "pad") {
      const order = s.order;
      if (order && order.total > 0) {
        order.time -= dt;
        if (order.time <= 0) launch(false);
      }
    } else {
      r.t += dt;
      if (r.state === "launch") {
        if (r.t < 0.5) w.shake = Math.max(w.shake, 3);
        if (Math.random() < dt * 40) {
          const up = r.t < 0.5 ? 0 : Math.pow(r.t - 0.5, 2) * 3.4;
          burst(
            ROCKET.x + 0.5,
            ROCKET.y + 0.8 - up,
            1,
            r.t < 0.8 ? "#f3ebdd" : "#d8cdbb",
            1.6,
            -1,
            2.6,
            0.9,
          );
        }
        if (r.t >= 2.4) w.rocket = { state: "away", t: 0 };
      } else if (r.state === "away") {
        if (r.t >= 6) {
          w.rocket = { state: "land", t: 0 };
          sfx.play("land");
        }
      } else if (r.t >= 1.6) {
        w.rocket = { state: "pad", t: 0 };
        s.order = makeOrder(s.launches);
        burst(ROCKET.x + 0.5, ROCKET.y + 0.8, 10, "#d8cdbb", 2.4, 2, 2.2, 0.6);
        w.shake = Math.max(w.shake, 2);
      }
    }

    updatePlayer(dt);
  };

  // ── frame loop ──
  let raf = 0;
  let last = performance.now();
  let saveAt = last;
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    w.t += dt;

    if (w.napping) {
      w.fade = Math.min(1, w.fade + dt * 1.8);
      if (w.fade >= 1) {
        s.clock = 0;
        s.day += 1;
        w.pests = [];
        w.ufos = [];
        w.meteors = [];
        w.shower = 0;
        wasNight = false;
        w.napping = false;
        say(`Day ${s.day}. Carlos slept through the night.`);
      }
    } else {
      w.fade = Math.max(0, w.fade - dt * 1.4);
      if (!paused && s.intro) update(dt);
    }

    for (const p of w.particles) {
      p.life -= dt;
      p.vy += p.grav * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    w.particles = w.particles.filter((p) => p.life > 0);
    for (const f of w.floats) {
      f.life -= dt;
      f.y -= dt * 0.7;
    }
    w.floats = w.floats.filter((f) => f.life > 0);
    w.shake = Math.max(0, w.shake - dt * 14);

    // the camera follows Carlos, but never shows past the edge of the world
    const viewW = vw / T;
    const viewH = vh / T;
    const tx = Math.max(0, Math.min(W - viewW, w.fx + 0.5 - viewW / 2));
    const ty = Math.max(0, Math.min(H - viewH, w.fy + 0.5 - viewH / 2));
    w.camX += (tx - w.camX) * Math.min(1, dt * 8);
    w.camY += (ty - w.camY) * Math.min(1, dt * 8);

    if (vw > 0) drawWorld(ctx, w, T, vw, vh);

    if (now - hudAt > 200) {
      hudAt = now;
      syncHud();
    }
    if (now - saveAt > 3000) {
      saveAt = now;
      save();
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  syncHud();

  const onHide = () => save();
  window.addEventListener("pagehide", onHide);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("pagehide", onHide);
      save();
      sfx.close();
    },
    start() {
      sfx.unlock();
      s.intro = true;
      syncHud();
    },
    buy(id) {
      const def = UPGRADES.find((u) => u.id === id);
      const cost = def?.costs[s.up[id]];
      if (!def || cost === undefined || s.coins < cost) {
        sfx.play("deny");
        return;
      }
      s.coins -= cost;
      s.up[id] += 1;
      sfx.play("buy");
      syncHud();
      save();
    },
    select(id) {
      if (CROP_MAP[id].unlock > s.launches) return;
      s.selected = id;
      syncHud();
    },
    setMuted(muted) {
      s.muted = muted;
      sfx.muted = muted;
      if (!muted) sfx.unlock();
      syncHud();
    },
    setPaused(value) {
      paused = value;
      keys.clear();
    },
    reset() {
      const muted = s.muted;
      Object.assign(s, freshSave(), { muted, intro: true });
      try {
        for (const key of OLD_KEYS) localStorage.removeItem(key);
      } catch {
        /* nothing to clear */
      }
      w.fx = s.px;
      w.fy = s.py;
      w.path = [];
      w.tasks = [];
      w.pests = [];
      w.ufos = [];
      w.meteors = [];
      w.pickups = [];
      w.craters = [];
      w.rocket = { state: "pad", t: 0 };
      w.rain = 0;
      w.shower = 0;
      w.stun = 0;
      wasNight = false;
      pestT = 12;
      ufoT = 10;
      save();
      syncHud();
    },
  };
}
