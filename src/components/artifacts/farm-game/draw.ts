import {
  CROP_MAP,
  FIELD,
  H,
  LANTERNS,
  ROCKET,
  SOLIDS,
  W,
  hash,
  inField,
  nightLevel,
  solidAt,
  type CropId,
} from "./data";
import type { World } from "./types";

type Ctx = CanvasRenderingContext2D;

const OUTLINE = "#0b2a2a";

/** Painted sprites in /public/images/farm. Anything not loaded yet falls back to a simple shape. */
const SPRITE_FILES = [
  "turnip-mid",
  "turnip-ripe",
  "carrot-mid",
  "carrot-ripe",
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
  "rock",
  "lantern",
  "coin",
  "grass",
  "soil",
];
const sprites: Record<string, HTMLImageElement> = {};

export function loadSprites() {
  for (const name of SPRITE_FILES) {
    if (sprites[name]) continue;
    const img = new Image();
    img.src = `/images/farm/${name}.webp`;
    img.onload = () => {
      sprites[name] = img;
    };
  }
}

let grassPattern: { T: number; pat: CanvasPattern } | null = null;

const stageOf = (g: number) => (g >= 1 ? 3 : g < 0.15 ? 0 : g < 0.42 ? 1 : 2);

function drawCrop(c: Ctx, id: CropId, g: number, T: number, t: number) {
  const stage = stageOf(g);
  const sprite =
    sprites[
      stage === 0
        ? "seeds"
        : stage === 1
          ? "sprout"
          : `${id}-${stage === 2 ? "mid" : "ripe"}`
    ];
  if (!sprite) {
    c.fillStyle = CROP_MAP[id].color;
    c.beginPath();
    c.arc(0, 0, T * (0.12 + 0.2 * g), 0, Math.PI * 2);
    c.fill();
    return;
  }
  // sprites sit on the bottom edge of their square; ripe crops stand a little taller and sway
  const size = T * (stage === 3 ? 1.25 : stage === 2 ? 1.1 : 0.9);
  if (stage === 3) c.rotate(Math.sin(t * 2.2) * 0.05);
  c.drawImage(sprite, -size / 2, T * 0.42 - size, size, size);
}

function drawCarlos(c: Ctx, w: World, T: number) {
  const u = T / 16;
  const t = w.t;
  const bob = w.moving
    ? Math.abs(Math.sin(t * 13)) * u * 1.3
    : Math.sin(t * 2) * u * 0.3;
  c.fillStyle = "rgba(0,0,0,0.28)";
  c.beginPath();
  c.ellipse(0, 6.5 * u, 5 * u, 1.8 * u, 0, 0, Math.PI * 2);
  c.fill();
  const sprite =
    sprites[
      w.dir === "up"
        ? "carlos-back"
        : w.dir === "side"
          ? "carlos-side"
          : "carlos-front"
    ];
  const size = T * 1.3;
  c.save();
  c.translate(0, -bob);
  if (w.stun > 0) c.rotate(Math.sin(t * 22) * 0.18);
  else if (w.moving) c.rotate(Math.sin(t * 13) * 0.06);
  // a quick squash when he does something
  if (w.busy > 0) c.scale(1.08, 0.9);
  if (w.dir === "side") c.scale(w.face, 1);
  if (sprite) c.drawImage(sprite, -size / 2, 7.2 * u - size, size, size);
  else {
    c.fillStyle = "#f6f1e7";
    c.beginPath();
    c.arc(0, 0, 5 * u, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
  if (w.stun > 0) {
    c.fillStyle = "#ffd76a";
    for (let i = 0; i < 3; i++) {
      const a = t * 6 + (i * Math.PI * 2) / 3;
      drawStar(c, Math.cos(a) * 6 * u, -11 * u + Math.sin(a) * 2 * u, 1.8 * u);
    }
  }
}

function drawStar(c: Ctx, x: number, y: number, r: number) {
  c.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const rr = i % 2 ? r * 0.5 : r;
    c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  c.closePath();
  c.fill();
}

/** a small space slug: purple blob, one big eye, two feelers */
function drawPest(c: Ctx, T: number, t: number, eating: boolean) {
  const u = T / 16;
  const squish = 1 + Math.sin(t * (eating ? 16 : 7)) * 0.08;
  c.fillStyle = "rgba(0,0,0,0.25)";
  c.beginPath();
  c.ellipse(0, 4.5 * u, 4.5 * u, 1.5 * u, 0, 0, Math.PI * 2);
  c.fill();
  c.save();
  c.scale(squish, 2 - squish);
  c.strokeStyle = OUTLINE;
  c.lineWidth = u * 0.9;
  c.lineCap = "round";
  for (const sx of [-1, 1]) {
    c.beginPath();
    c.moveTo(sx * 1.6 * u, -3 * u);
    c.quadraticCurveTo(
      sx * 3 * u,
      -7 * u,
      sx * 3.6 * u + Math.sin(t * 5) * u * 0.5,
      -7.5 * u,
    );
    c.stroke();
    c.fillStyle = "#ff6a1f";
    c.beginPath();
    c.arc(
      sx * 3.6 * u + Math.sin(t * 5) * u * 0.5,
      -7.8 * u,
      1 * u,
      0,
      Math.PI * 2,
    );
    c.fill();
  }
  c.fillStyle = "#8f6fd6";
  c.beginPath();
  c.ellipse(0, 0.5 * u, 5 * u, 4.2 * u, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillStyle = "#b79cf0";
  c.beginPath();
  c.ellipse(-1.6 * u, -1.2 * u, 1.8 * u, 1.1 * u, -0.5, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#f6f1e7";
  c.beginPath();
  c.arc(0.4 * u, -0.2 * u, 2.1 * u, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillStyle = OUTLINE;
  c.beginPath();
  c.arc(0.8 * u, 0.1 * u, 0.9 * u, 0, Math.PI * 2);
  c.fill();
  if (eating) {
    c.beginPath();
    c.arc(0, 3 * u, 1.4 * u, 0, Math.PI);
    c.fill();
  }
  c.restore();
}

function drawRocket(c: Ctx, T: number, t: number, flame: number) {
  // origin = centre of the pad, at ground level
  const u = T / 16;
  c.lineJoin = "round";
  c.strokeStyle = OUTLINE;
  c.lineWidth = u * 1.1;
  if (flame > 0) {
    const len = (8 + Math.sin(t * 40) * 2) * u * flame;
    const g = c.createLinearGradient(0, -2 * u, 0, len);
    g.addColorStop(0, "#fff3c4");
    g.addColorStop(0.4, "#ffb347");
    g.addColorStop(1, "rgba(255,106,31,0)");
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(-3.2 * u, -2 * u);
    c.quadraticCurveTo(0, len * 1.6, 3.2 * u, -2 * u);
    c.closePath();
    c.fill();
  }
  // fins
  c.fillStyle = "#ff6a1f";
  for (const sx of [-1, 1]) {
    c.beginPath();
    c.moveTo(sx * 4 * u, -12 * u);
    c.lineTo(sx * 8.5 * u, -1.5 * u);
    c.lineTo(sx * 4 * u, -3.5 * u);
    c.closePath();
    c.fill();
    c.stroke();
  }
  // body
  c.fillStyle = "#f3ebdd";
  c.beginPath();
  c.moveTo(-4.6 * u, -2.5 * u);
  c.lineTo(-4.6 * u, -22 * u);
  c.quadraticCurveTo(-4.6 * u, -31 * u, 0, -35 * u);
  c.quadraticCurveTo(4.6 * u, -31 * u, 4.6 * u, -22 * u);
  c.lineTo(4.6 * u, -2.5 * u);
  c.closePath();
  c.fill();
  c.stroke();
  // nose cone
  c.fillStyle = "#ff6a1f";
  c.beginPath();
  c.moveTo(-4.3 * u, -25.5 * u);
  c.quadraticCurveTo(-3.6 * u, -31.5 * u, 0, -35 * u);
  c.quadraticCurveTo(3.6 * u, -31.5 * u, 4.3 * u, -25.5 * u);
  c.closePath();
  c.fill();
  c.stroke();
  // stripe, window, engine
  c.fillStyle = "#013230";
  c.fillRect(-4.6 * u, -9.5 * u, 9.2 * u, 1.6 * u);
  c.fillStyle = "#7fd4cc";
  c.beginPath();
  c.arc(0, -18.5 * u, 2.6 * u, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillStyle = "rgba(255,255,255,0.7)";
  c.beginPath();
  c.arc(-0.9 * u, -19.4 * u, 0.8 * u, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#5c6b6a";
  c.beginPath();
  c.roundRect(-3 * u, -3 * u, 6 * u, 2.2 * u, u * 0.6);
  c.fill();
  c.stroke();
}

function drawUfo(c: Ctx, T: number, t: number, beam: number, alpha: number) {
  // origin = ground below the saucer
  const u = T / 16;
  const hover = -24 * u + Math.sin(t * 3) * u;
  c.globalAlpha = alpha;
  c.fillStyle = "rgba(0,0,0,0.22)";
  c.beginPath();
  c.ellipse(0, 3 * u, 7 * u, 2.2 * u, 0, 0, Math.PI * 2);
  c.fill();
  if (beam > 0) {
    const g = c.createLinearGradient(0, hover, 0, 4 * u);
    g.addColorStop(0, "rgba(170,255,225,0.55)");
    g.addColorStop(1, "rgba(170,255,225,0.08)");
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(-3 * u, hover + 2 * u);
    c.lineTo(3 * u, hover + 2 * u);
    c.lineTo(8 * u, 4 * u);
    c.lineTo(-8 * u, 4 * u);
    c.closePath();
    c.fill();
    // how close it is to stealing the crop
    c.strokeStyle = "#ff6a1f";
    c.lineWidth = u * 1.4;
    c.beginPath();
    c.arc(0, 0, 9 * u, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * beam);
    c.stroke();
  }
  c.strokeStyle = OUTLINE;
  c.lineWidth = u;
  c.fillStyle = "rgba(170,232,225,0.85)";
  c.beginPath();
  c.arc(0, hover - 1.5 * u, 4.5 * u, Math.PI, 0);
  c.closePath();
  c.fill();
  c.stroke();
  c.fillStyle = "#8fa7a3";
  c.beginPath();
  c.ellipse(0, hover, 10 * u, 3.3 * u, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  for (let i = -2; i <= 2; i++) {
    c.fillStyle = Math.floor(t * 6 + i) % 2 ? "#ff6a1f" : "#ffd76a";
    c.beginPath();
    c.arc(i * 3.6 * u, hover + 0.6 * u, 0.9 * u, 0, Math.PI * 2);
    c.fill();
  }
  c.globalAlpha = 1;
}

function drawDrone(c: Ctx, T: number, t: number) {
  const u = T / 16;
  const y = -12 * u + Math.sin(t * 4) * u;
  c.fillStyle = "rgba(0,0,0,0.18)";
  c.beginPath();
  c.ellipse(0, 3 * u, 3.5 * u, 1.2 * u, 0, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = OUTLINE;
  c.lineWidth = u * 0.9;
  c.lineCap = "round";
  for (const sx of [-1, 1]) {
    c.beginPath();
    c.moveTo(sx * 2.5 * u, y - 1.5 * u);
    c.lineTo(sx * 5 * u, y - 3 * u);
    c.stroke();
    c.beginPath();
    c.ellipse(
      sx * 5 * u,
      y - 3.4 * u,
      3 * u * Math.abs(Math.sin(t * 30)) + 0.6 * u,
      0.6 * u,
      0,
      0,
      Math.PI * 2,
    );
    c.stroke();
  }
  c.fillStyle = "#f3ebdd";
  c.beginPath();
  c.roundRect(-3.4 * u, y - 2.6 * u, 6.8 * u, 5.2 * u, u * 2);
  c.fill();
  c.stroke();
  c.fillStyle = "#ff6a1f";
  c.beginPath();
  c.arc(0, y, 1.4 * u, 0, Math.PI * 2);
  c.fill();
  c.stroke();
}

export function drawWorld(c: Ctx, w: World, T: number, vw: number, vh: number) {
  const { s, t } = w;
  const u = T / 16;
  const blit = (name: string, cx: number, bottom: number, size: number) => {
    const img = sprites[name];
    if (!img) return false;
    c.drawImage(img, cx - size / 2, bottom - size, size, size);
    return true;
  };

  // ── space ──
  c.fillStyle = "#011a19";
  c.fillRect(0, 0, vw, vh);
  c.save();
  const sh = w.shake > 0 ? w.shake * u : 0;
  c.translate(
    -Math.round(w.camX * T) + (sh ? (Math.random() - 0.5) * sh : 0),
    -Math.round(w.camY * T) + (sh ? (Math.random() - 0.5) * sh : 0),
  );
  const x0 = Math.max(0, Math.floor(w.camX));
  const y0 = Math.max(0, Math.floor(w.camY));
  const x1 = Math.min(W - 1, Math.ceil(w.camX + vw / T));
  const y1 = Math.min(H - 1, Math.ceil(w.camY + vh / T));

  for (let i = 0; i < 520; i++) {
    const sx = hash(i, 1) * W;
    const sy = hash(i, 2) * H;
    if (sx > 1 && sx < W - 1 && sy > 1 && sy < H - 1) continue;
    const tw = 0.45 + 0.55 * Math.sin(t * (1 + hash(i, 3) * 2) + i);
    c.fillStyle =
      i % 11 === 0 ? `rgba(255,179,71,${tw})` : `rgba(243,235,221,${tw * 0.9})`;
    const r = u * (0.5 + hash(i, 4) * 0.9);
    c.fillRect(sx * T, sy * T, r, r);
  }
  // a ringed planet and a small moon out in the dark
  c.fillStyle = "#3f8f89";
  c.beginPath();
  c.arc(12.7 * T, 0.48 * T, 0.3 * T, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = "rgba(205,232,224,0.8)";
  c.lineWidth = u;
  c.beginPath();
  c.ellipse(12.7 * T, 0.48 * T, 0.56 * T, 0.13 * T, -0.35, 0, Math.PI * 2);
  c.stroke();
  c.fillStyle = "#c9d6d2";
  c.beginPath();
  c.arc(0.5 * T, 10.3 * T, 0.2 * T, 0, Math.PI * 2);
  c.fill();

  // ── the island ──
  const ix = T;
  const iy = T;
  const iw = (W - 2) * T;
  const ih = (H - 2) * T;
  const ir = T * 0.75;
  c.fillStyle = "#2d2019";
  c.beginPath();
  c.roundRect(ix + 3 * u, iy + 0.62 * T, iw - 6 * u, ih, ir);
  c.fill();
  c.fillStyle = "#5c4636";
  c.beginPath();
  c.roundRect(ix, iy + 0.34 * T, iw, ih, ir);
  c.fill();
  c.save();
  c.beginPath();
  c.roundRect(ix, iy, iw, ih, ir);
  c.clip();
  const grass = sprites.grass;
  if (grass && (!grassPattern || grassPattern.T !== T)) {
    const size = T * 4;
    const tileCanvas = document.createElement("canvas");
    tileCanvas.width = size;
    tileCanvas.height = size;
    tileCanvas.getContext("2d")?.drawImage(grass, 0, 0, size, size);
    const pat = c.createPattern(tileCanvas, "repeat");
    grassPattern = pat ? { T, pat } : null;
  }
  c.fillStyle = grass && grassPattern ? grassPattern.pat : "#24604a";
  c.fillRect(ix, iy, iw, ih);
  c.fillStyle = "rgba(1,40,38,0.22)";
  c.fillRect(ix, iy, iw, ih);
  c.fillStyle = "rgba(255,255,255,0.07)";
  c.fillRect(
    FIELD.x0 * T,
    FIELD.y0 * T,
    (FIELD.x1 - FIELD.x0 + 1) * T,
    (FIELD.y1 - FIELD.y0 + 1) * T,
  );

  for (let y = Math.max(1, y0); y <= Math.min(H - 2, y1); y++) {
    for (let x = Math.max(1, x0); x <= Math.min(W - 2, x1); x++) {
      const tile = s.tiles[y * W + x];
      if (tile) {
        c.save();
        c.beginPath();
        c.roundRect(x * T + u, y * T + u, T - 2 * u, T - 2 * u, u * 2.5);
        c.clip();
        if (sprites.soil)
          c.drawImage(sprites.soil, x * T + u, y * T + u, T - 2 * u, T - 2 * u);
        else {
          c.fillStyle = "#7a5536";
          c.fillRect(x * T, y * T, T, T);
        }
        if (tile.c && tile.wet > 0 && tile.g < 1) {
          c.fillStyle = "rgba(24,10,4,0.42)";
          c.fillRect(x * T, y * T, T, T);
        }
        c.restore();
      } else if (!solidAt(x, y) && !inField(x, y)) {
        const h = hash(x, y);
        if (h > 0.86) {
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
        }
      }
    }
  }
  c.restore();
  c.strokeStyle = OUTLINE;
  c.lineWidth = u * 1.3;
  c.beginPath();
  c.roundRect(ix, iy, iw, ih, ir);
  c.stroke();

  // field border
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

  // tiles Carlos is on his way to
  for (let i = 0; i < w.tasks.length; i++) {
    const task = w.tasks[i];
    if (task.kind !== "tile") continue;
    c.fillStyle = `rgba(255,106,31,${0.55 + 0.25 * Math.sin(t * 6 + i)})`;
    c.beginPath();
    c.arc(task.x * T + T / 2, task.y * T + T / 2, u * 1.6, 0, Math.PI * 2);
    c.fill();
  }

  // pond: calm teal water with pale ripples that drift slowly
  const pond = {
    x: 14 * T + 2 * u,
    y: 2 * T + 2 * u,
    w: 4 * T - 4 * u,
    h: 3 * T - 4 * u,
  };
  c.save();
  c.beginPath();
  c.roundRect(pond.x, pond.y, pond.w, pond.h, T * 0.8);
  c.fillStyle = "#17918f";
  c.fill();
  c.clip();
  c.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    const len = T * (0.5 + hash(i, 11) * 0.5);
    const span = pond.w + len * 2;
    const rx =
      pond.x -
      len +
      ((hash(i, 3) * span + t * T * 0.12 * (0.6 + hash(i, 5))) % span);
    const ry =
      pond.y + pond.h * (0.1 + 0.8 * hash(i, 8)) + Math.sin(t * 1.2 + i) * u;
    for (const [dy, alpha, scale] of [
      [0, 0.55, 1],
      [2.2 * u, 0.3, 0.6],
    ]) {
      c.strokeStyle = `rgba(214,240,232,${alpha})`;
      c.lineWidth = u * 0.8;
      c.beginPath();
      c.moveTo(rx, ry + dy);
      c.bezierCurveTo(
        rx + len * scale * 0.3,
        ry + dy - 2 * u,
        rx + len * scale * 0.6,
        ry + dy + 2 * u,
        rx + len * scale,
        ry + dy - u,
      );
      c.stroke();
    }
  }
  c.restore();
  c.strokeStyle = OUTLINE;
  c.lineWidth = u * 1.2;
  c.beginPath();
  c.roundRect(pond.x, pond.y, pond.w, pond.h, T * 0.8);
  c.stroke();

  // meteor craters fade away
  for (const cr of w.craters) {
    c.fillStyle = `rgba(20,12,8,${Math.min(0.5, cr.life * 0.12)})`;
    c.beginPath();
    c.ellipse(cr.x * T, cr.y * T + 2 * u, 6.5 * u, 4 * u, 0, 0, Math.PI * 2);
    c.fill();
  }

  // launch pad
  const padX = (ROCKET.x + 0.5) * T;
  const padY = (ROCKET.y + 0.82) * T;
  c.fillStyle = "#5c6b6a";
  c.strokeStyle = OUTLINE;
  c.lineWidth = u * 1.1;
  c.beginPath();
  c.ellipse(padX, padY, 0.72 * T, 0.3 * T, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.strokeStyle = "#ff6a1f";
  c.lineWidth = u * 1.2;
  c.setLineDash([u * 2.4, u * 2.4]);
  c.beginPath();
  c.ellipse(padX, padY, 0.56 * T, 0.21 * T, 0, 0, Math.PI * 2);
  c.stroke();
  c.setLineDash([]);

  blit("house", 3.5 * T, 4.15 * T, 3.5 * T);
  blit("stall", 8 * T, 3.1 * T, 2.5 * T);

  // ── everything with height, back to front, so Carlos can walk behind things ──
  const py = Math.round(w.fy);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const tile = s.tiles[y * W + x];
      if (tile?.c) {
        const thirsty = tile.g < 1 && tile.wet <= 0;
        const eaten = w.pests.some(
          (p) => p.state === "eat" && p.tile === y * W + x,
        );
        c.save();
        c.translate(
          x * T + T / 2 + (eaten ? Math.sin(t * 40) * u * 0.8 : 0),
          y * T + T / 2,
        );
        if (tile.gold && tile.g >= 0.15) {
          const gg = c.createRadialGradient(0, -2 * u, 0, 0, -2 * u, 11 * u);
          gg.addColorStop(
            0,
            `rgba(255,215,106,${0.5 + 0.2 * Math.sin(t * 5 + x)})`,
          );
          gg.addColorStop(1, "rgba(255,215,106,0)");
          c.fillStyle = gg;
          c.fillRect(-11 * u, -13 * u, 22 * u, 22 * u);
          c.fillStyle = "#fff3c4";
          for (let k = 0; k < 3; k++) {
            const a = t * 2 + (k * Math.PI * 2) / 3;
            drawStar(
              c,
              Math.cos(a) * 7 * u,
              -3 * u + Math.sin(a) * 5 * u,
              1.5 * u,
            );
          }
        }
        drawCrop(c, tile.c, tile.g, T, t + x);
        c.restore();
        if (tile.g >= 1) {
          c.fillStyle = `rgba(255,236,170,${0.5 + 0.5 * Math.sin(t * 4 + x + y)})`;
          drawStar(c, x * T + 12.5 * u, y * T + 2.5 * u, u * 1.7);
        } else if (thirsty) {
          // a blue drop that bobs above a thirsty crop
          const bx = x * T + T / 2;
          const by = y * T - 2 * u + Math.sin(t * 5 + x) * u;
          c.fillStyle = "#f3ebdd";
          c.strokeStyle = OUTLINE;
          c.lineWidth = u * 0.8;
          c.beginPath();
          c.arc(bx, by, 3.6 * u, 0, Math.PI * 2);
          c.fill();
          c.stroke();
          c.fillStyle = "#3aa6d8";
          c.beginPath();
          c.moveTo(bx, by - 2.4 * u);
          c.quadraticCurveTo(bx + 2.4 * u, by + 0.6 * u, bx, by + 2 * u);
          c.quadraticCurveTo(bx - 2.4 * u, by + 0.6 * u, bx, by - 2.4 * u);
          c.fill();
        }
      }
      const k = SOLIDS[y * W + x];
      if (k === "tree") blit("tree", x * T + T / 2, y * T + T * 1.02, T * 1.5);
      else if (k === "fruit")
        blit("fruit-tree", x * T + T / 2, y * T + T * 1.02, T * 1.5);
      else if (k === "lantern")
        blit("lantern", x * T + T / 2, y * T + T * 1.02, T * 1.55);
      else if (k === "rock")
        blit("rock", x * T + T / 2, y * T + T * 0.98, T * 1.05);
      else if (k === "crate")
        blit("bin", x * T + T / 2, y * T + T * 1.02, T * 1.15);
      else if (k === "rocket" && w.rocket.state === "pad") {
        c.save();
        c.translate(padX, padY);
        drawRocket(c, T, t, 0);
        c.restore();
      }
    }
    for (const p of w.pickups) {
      if (Math.floor(p.y) !== y) continue;
      if (p.life < 5 && Math.floor(t * 8) % 2) continue;
      const bob = Math.sin(t * 4 + p.x) * u * 1.2;
      c.fillStyle = "rgba(0,0,0,0.2)";
      c.beginPath();
      c.ellipse(p.x * T, p.y * T + 4 * u, 3 * u, 1 * u, 0, 0, Math.PI * 2);
      c.fill();
      if (p.fruit) {
        c.fillStyle = "#ff8a2a";
        c.strokeStyle = OUTLINE;
        c.lineWidth = u * 0.8;
        c.beginPath();
        c.arc(p.x * T, p.y * T + bob * 0.4, 3 * u, 0, Math.PI * 2);
        c.fill();
        c.stroke();
        c.fillStyle = "#5fbf6a";
        c.beginPath();
        c.ellipse(
          p.x * T + 1.6 * u,
          p.y * T - 3 * u + bob * 0.4,
          1.8 * u,
          0.9 * u,
          -0.6,
          0,
          Math.PI * 2,
        );
        c.fill();
        continue;
      }
      const glow = c.createRadialGradient(
        p.x * T,
        p.y * T - 2 * u + bob,
        0,
        p.x * T,
        p.y * T - 2 * u + bob,
        9 * u,
      );
      glow.addColorStop(0, "rgba(255,215,106,0.55)");
      glow.addColorStop(1, "rgba(255,215,106,0)");
      c.fillStyle = glow;
      c.fillRect(p.x * T - 9 * u, p.y * T - 11 * u + bob, 18 * u, 18 * u);
      c.fillStyle = "#ffd76a";
      drawStar(c, p.x * T, p.y * T - 2 * u + bob, 5.6 * u);
      c.fillStyle = "#fff6d0";
      drawStar(c, p.x * T, p.y * T - 2 * u + bob, 2.6 * u);
    }
    for (const p of w.pests) {
      if (Math.floor(p.y) !== y) continue;
      c.save();
      c.translate(p.x * T, p.y * T);
      if (p.queen) c.scale(1.8, 1.8);
      drawPest(c, T, t + p.seed, p.state === "eat");
      if (p.queen) {
        c.fillStyle = "#ffd76a";
        c.strokeStyle = OUTLINE;
        c.lineWidth = u * 0.5;
        c.beginPath();
        c.moveTo(-2.6 * u, -3.6 * u);
        c.lineTo(-2.6 * u, -6.4 * u);
        c.lineTo(-1.2 * u, -5 * u);
        c.lineTo(0, -6.8 * u);
        c.lineTo(1.2 * u, -5 * u);
        c.lineTo(2.6 * u, -6.4 * u);
        c.lineTo(2.6 * u, -3.6 * u);
        c.closePath();
        c.fill();
        c.stroke();
        for (let k = 0; k < 3; k++) {
          c.fillStyle = k < p.hp ? "#ff6a1f" : "rgba(243,235,221,0.35)";
          c.beginPath();
          c.arc((k - 1) * 2.4 * u, -9 * u, 0.9 * u, 0, Math.PI * 2);
          c.fill();
        }
      }
      c.restore();
    }
    if (py === y) {
      c.save();
      c.translate(w.fx * T + T / 2, w.fy * T + T / 2);
      drawCarlos(c, w, T);
      c.restore();
    }
  }

  // fishing line and bobber
  if (w.fish) {
    const bx = w.fish.x * T;
    const by =
      w.fish.y * T +
      Math.sin(t * (w.fish.state === "bite" ? 26 : 3)) *
        u *
        (w.fish.state === "bite" ? 1.6 : 0.8);
    c.strokeStyle = "rgba(243,235,221,0.9)";
    c.lineWidth = u * 0.5;
    c.beginPath();
    c.moveTo(w.fx * T + T / 2, w.fy * T + T / 2 - 9 * u);
    c.quadraticCurveTo((w.fx * T + T / 2 + bx) / 2, by - 12 * u, bx, by);
    c.stroke();
    c.fillStyle = "#ff6a1f";
    c.strokeStyle = OUTLINE;
    c.lineWidth = u * 0.7;
    c.beginPath();
    c.arc(bx, by, 1.8 * u, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    if (w.fish.state === "bite") {
      c.fillStyle = "#ffd76a";
      c.beginPath();
      c.arc(bx, by - 9 * u, 4.2 * u, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.fillStyle = OUTLINE;
      c.font = `900 ${Math.round(6.5 * u)}px sans-serif`;
      c.textAlign = "center";
      c.fillText("!", bx, by - 6.8 * u);
    }
  }

  // an arrow over the rocket when Carlos is carrying something it wants
  if (w.rocket.state === "pad" && s.order) {
    const wants = Object.entries(s.order.need).some(
      ([id, n]) =>
        (s.bag[id as CropId] ?? 0) > 0 &&
        (s.order?.got[id as CropId] ?? 0) < (n ?? 0),
    );
    if (wants) {
      const ay = padY - 2.55 * T + Math.sin(t * 6) * u * 2;
      c.fillStyle = "#ff6a1f";
      c.strokeStyle = OUTLINE;
      c.lineWidth = u;
      c.beginPath();
      c.moveTo(padX - 4 * u, ay);
      c.lineTo(padX + 4 * u, ay);
      c.lineTo(padX, ay + 5 * u);
      c.closePath();
      c.fill();
      c.stroke();
    }
  }

  // guard drone and its zap
  if (s.up.drone > 0) {
    c.save();
    c.translate(w.drone.x * T, w.drone.y * T);
    drawDrone(c, T, t);
    c.restore();
  }
  if (w.zap) {
    c.strokeStyle = `rgba(255,236,150,${Math.min(1, w.zap.life * 5)})`;
    c.lineWidth = u * 1.4;
    c.beginPath();
    c.moveTo(w.zap.x1 * T, w.zap.y1 * T - 12 * u);
    const mx = ((w.zap.x1 + w.zap.x2) / 2) * T + Math.sin(t * 90) * 4 * u;
    const my = ((w.zap.y1 + w.zap.y2) / 2) * T - 6 * u;
    c.lineTo(mx, my);
    c.lineTo(w.zap.x2 * T, w.zap.y2 * T);
    c.stroke();
  }

  // the rocket in flight
  if (w.rocket.state === "launch" || w.rocket.state === "land") {
    const k = w.rocket.t;
    const up =
      w.rocket.state === "launch"
        ? k < 0.5
          ? 0
          : Math.pow(k - 0.5, 2) * 3.4
        : Math.pow(Math.max(0, 1.6 - k), 2) * 4.5;
    c.save();
    c.translate(
      padX +
        (w.rocket.state === "launch" && k < 0.5
          ? Math.sin(t * 70) * u * 0.6
          : 0),
      padY - up * T,
    );
    drawRocket(
      c,
      T,
      t,
      w.rocket.state === "launch" ? Math.min(1.4, 0.5 + k) : 0.8,
    );
    c.restore();
  }

  // UFOs
  for (const uf of w.ufos) {
    c.save();
    c.translate(uf.x * T, uf.y * T);
    c.scale(1.5, 1.5);
    drawUfo(
      c,
      T,
      t,
      uf.state === "beam" ? Math.min(1, uf.t / 5) : 0,
      uf.state === "out" ? Math.max(0, 1 - uf.t / 1.2) : 1,
    );
    c.restore();
  }

  // meteors: a shrinking ring warns where each one lands
  for (const m of w.meteors) {
    const k = Math.max(0, m.t / 1.7);
    c.strokeStyle = `rgba(255,106,31,${0.9 - k * 0.4})`;
    c.lineWidth = u * 1.4;
    c.beginPath();
    c.arc(m.x * T, m.y * T, (5 + k * 9) * u, 0, Math.PI * 2);
    c.stroke();
    c.fillStyle = `rgba(255,106,31,${0.18 + 0.12 * Math.sin(t * 20)})`;
    c.beginPath();
    c.arc(m.x * T, m.y * T, 5 * u, 0, Math.PI * 2);
    c.fill();
    if (m.t < 0.5) {
      const f = m.t / 0.5;
      const mx = m.x * T + f * T * 5;
      const my = m.y * T - f * T * 9;
      const g = c.createLinearGradient(mx, my, mx + T * 1.6, my - T * 2.9);
      g.addColorStop(0, "#fff3c4");
      g.addColorStop(1, "rgba(255,106,31,0)");
      c.strokeStyle = g;
      c.lineWidth = u * 3;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(mx, my);
      c.lineTo(mx + T * 1.6, my - T * 2.9);
      c.stroke();
      c.fillStyle = "#fff3c4";
      c.beginPath();
      c.arc(mx, my, u * 2.6, 0, Math.PI * 2);
      c.fill();
    }
  }

  for (const p of w.particles) {
    c.globalAlpha = Math.max(0, p.life / p.max);
    c.fillStyle = p.color;
    c.beginPath();
    c.arc(p.x * T, p.y * T, p.size * u, 0, Math.PI * 2);
    c.fill();
  }
  c.globalAlpha = 1;

  c.textAlign = "center";
  c.font = `700 ${Math.round(T * 0.4)}px sans-serif`;
  for (const f of w.floats) {
    c.globalAlpha = Math.min(1, f.life * 2.5);
    c.fillStyle = OUTLINE;
    c.fillText(f.text, f.x * T + 1, f.y * T + 1);
    c.fillStyle = f.color;
    c.fillText(f.text, f.x * T, f.y * T);
    if (f.coin && sprites.coin) {
      const cs = T * 0.55;
      const half = c.measureText(f.text).width / 2;
      c.drawImage(
        sprites.coin,
        f.x * T - half - cs * 1.05,
        f.y * T - cs * 0.8,
        cs,
        cs,
      );
    }
  }
  c.globalAlpha = 1;
  c.restore();

  // ── light: night, lamps, rain ──
  const night = nightLevel(s.clock);
  const dark = Math.max(night * 0.42, w.rain > 0 ? 0.16 : 0);
  if (dark > 0) {
    c.fillStyle = `rgba(2,18,30,${dark})`;
    c.fillRect(0, 0, vw, vh);
  }
  if (night > 0.2) {
    c.globalCompositeOperation = "lighter";
    const lights: [number, number][] = [
      [3.9, 3.3],
      [8, 2.4],
      [ROCKET.x + 0.5, ROCKET.y + 0.4],
      ...LANTERNS.map(([lx, ly]): [number, number] => [lx + 0.5, ly - 0.1]),
    ];
    for (const [lx, ly] of lights) {
      const gx = (lx - w.camX) * T;
      const gy = (ly - w.camY) * T;
      const g = c.createRadialGradient(gx, gy, 0, gx, gy, T * 2.6);
      g.addColorStop(0, `rgba(255,170,80,${night * 0.34})`);
      g.addColorStop(1, "rgba(255,170,80,0)");
      c.fillStyle = g;
      c.fillRect(gx - T * 3, gy - T * 3, T * 6, T * 6);
    }
    c.globalCompositeOperation = "source-over";
  }
  if (w.rain > 0) {
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
  if (w.fade > 0) {
    c.fillStyle = `rgba(1,20,24,${w.fade})`;
    c.fillRect(0, 0, vw, vh);
  }
}
