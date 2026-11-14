import type * as T from "three";
import type { Three } from "./stage";

/* Low-poly garden building blocks shared by every scene. */

export const PAL = {
  leaf: 0x3d7f56,
  leaf2: 0x6fae7f,
  leafDeep: 0x2a5c3d,
  soil: 0x7a4a2b,
  soilLight: 0xb9683f,
  clay: 0xd9552b,
  sun: 0xf5bd4a,
  petal: 0xe58aa0,
  lilac: 0x9a86d6,
  cream: 0xfbf7ea,
  ink: 0x1d2433,
  wood: 0x6b4526,
  water: 0x6fb3e0,
  wheat: 0xe3b54f,
  white: 0xffffff,
  stone: 0xcfc8b6,
};

export type FlowerKind = "daisy" | "sunflower" | "tulip" | "lavender" | "poppy" | "sprout";
type V3 = [number, number, number];

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const easeOutBack = (k: number) => {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2);
};

export function makeKit(THREE: Three) {
  const mats = new Map<string, T.MeshStandardMaterial>();
  const mat = (color: number, emissive = 0) => {
    const key = `${color}-${emissive}`;
    let m = mats.get(key);
    if (!m) {
      m = new THREE.MeshStandardMaterial({
        color,
        flatShading: true,
        roughness: 0.95,
        metalness: 0,
        emissive,
        emissiveIntensity: emissive ? 1 : 0,
      });
      mats.set(key, m);
    }
    return m;
  };

  const G = {
    ico: new THREE.IcosahedronGeometry(1, 1),
    ball: new THREE.SphereGeometry(1, 14, 10),
    cyl: new THREE.CylinderGeometry(1, 1, 1, 8),
    taper: new THREE.CylinderGeometry(0.6, 1, 1, 8),
    cone: new THREE.ConeGeometry(1, 1, 8),
    pyramid: new THREE.ConeGeometry(1, 1, 4),
    box: new THREE.BoxGeometry(1, 1, 1),
  };

  /** a mesh from a shared geometry: scale, position, optional rotation */
  const m = (g: keyof typeof G, color: number, s: V3, p: V3 = [0, 0, 0], r?: V3, emissive = 0) => {
    const mesh = new THREE.Mesh(G[g], mat(color, emissive));
    mesh.scale.set(...s);
    mesh.position.set(...p);
    if (r) mesh.rotation.set(...r);
    return mesh;
  };

  const group = (...children: T.Object3D[]) => {
    const g = new THREE.Group();
    for (const c of children) g.add(c);
    return g;
  };

  /* ── growth: objects scale in with a springy ease after a delay ── */
  const growers: { o: T.Object3D; d: number; s: number }[] = [];
  const grow = <O extends T.Object3D>(o: O, delay: number) => {
    growers.push({ o, d: delay, s: o.scale.x || 1 });
    o.scale.setScalar(0.0001);
    return o;
  };
  const updateGrowth = (t: number) => {
    for (const g of growers) {
      const k = clamp01((t - g.d) / 0.9);
      g.o.scale.setScalar(Math.max(0.0001, g.s * (k <= 0 ? 0 : easeOutBack(k))));
    }
  };

  /* ── swaying: registered objects rock gently around their base ── */
  const swayers: { o: T.Object3D; phase: number; amp: number }[] = [];
  const sway = <O extends T.Object3D>(o: O, amp = 0.07) => {
    swayers.push({ o, phase: swayers.length * 1.7, amp });
    return o;
  };
  const updateSway = (t: number) => {
    for (const s of swayers) {
      s.o.rotation.z = Math.sin(t * 1.3 + s.phase) * s.amp;
      s.o.rotation.x = Math.cos(t * 0.9 + s.phase) * s.amp * 0.5;
    }
  };

  /* ── plants ── */

  const flower = (kind: FlowerKind, color: number, h: number) => {
    const g = new THREE.Group();
    if (kind !== "sprout") {
      g.add(m("cyl", PAL.leafDeep, [0.03, h, 0.03], [0, h / 2, 0]));
      g.add(m("ico", PAL.leaf2, [0.17, 0.025, 0.07], [0.15, h * 0.32, 0], [0, 0, 0.5]));
      g.add(m("ico", PAL.leaf, [0.15, 0.025, 0.07], [-0.13, h * 0.52, 0], [0, 0, -0.5]));
    } else {
      g.add(m("cyl", PAL.leaf, [0.025, h, 0.025], [0, h / 2, 0]));
    }
    const head = new THREE.Group();
    head.position.y = h;
    const ring = (count: number, r: number, s: V3, c: number, y = 0, tilt = 0, off = 0) => {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + off;
        const p = m("ico", c, s, [Math.cos(a) * r, y, Math.sin(a) * r], [0, -a, tilt]);
        head.add(p);
      }
    };
    if (kind === "daisy") {
      ring(10, 0.17, [0.13, 0.014, 0.055], color, -0.01, 0, 0.3);
      ring(10, 0.15, [0.12, 0.014, 0.05], color);
      head.add(m("ico", PAL.sun, [0.085, 0.05, 0.085]));
      head.rotation.x = 0.75;
    } else if (kind === "sunflower") {
      ring(14, 0.24, [0.15, 0.014, 0.045], 0xd9902a, -0.012, 0, 0.22);
      ring(14, 0.22, [0.14, 0.014, 0.045], PAL.sun);
      head.add(m("ico", 0x4a2f1b, [0.15, 0.055, 0.15]));
      head.add(m("ico", 0x6b4526, [0.09, 0.07, 0.09]));
      head.rotation.x = 0.9;
    } else if (kind === "poppy") {
      ring(4, 0.1, [0.16, 0.02, 0.14], color, 0.02, 0.35);
      ring(4, 0.09, [0.13, 0.02, 0.12], color, 0.05, 0.6, 0.78);
      head.add(m("ico", PAL.ink, [0.05, 0.05, 0.05], [0, 0.06, 0]));
      ring(8, 0.075, [0.014, 0.014, 0.014], PAL.sun, 0.08);
      head.rotation.x = 0.55;
    } else if (kind === "tulip") {
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        head.add(
          m(
            "ico",
            color,
            [0.075, 0.15, 0.075],
            [Math.cos(a) * 0.045, 0.12, Math.sin(a) * 0.045],
            [Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25],
          ),
        );
      }
      head.add(m("ico", color, [0.06, 0.14, 0.06], [0, 0.14, 0]));
      head.add(m("ico", PAL.leafDeep, [0.05, 0.03, 0.05], [0, 0.01, 0]));
    } else if (kind === "lavender") {
      for (let i = 0; i < 9; i++) {
        const side = i % 2 ? 1 : -1;
        const r = 0.065 - i * 0.004;
        head.add(
          m(
            "ico",
            i % 3 === 0 ? 0x7d6bc0 : color,
            [r, r * 0.85, r],
            [side * 0.035, -0.12 + i * 0.05, (i % 3) * 0.02 - 0.02],
          ),
        );
      }
    } else {
      head.add(m("ico", PAL.leaf, [0.16, 0.035, 0.085], [-0.13, 0.03, 0], [0.5, 0, 0.45]));
      head.add(m("ico", PAL.leaf2, [0.17, 0.035, 0.09], [0.14, 0.05, 0], [0.5, 0, -0.5]));
      head.add(m("ico", PAL.leaf2, [0.03, 0.03, 0.03]));
    }
    g.add(head);
    return g;
  };

  const tree = (h = 1) => {
    const g = new THREE.Group();
    g.add(m("taper", PAL.wood, [0.07 * h, 0.5 * h, 0.07 * h], [0, 0.25 * h, 0]));
    g.add(m("ico", PAL.leafDeep, [0.3 * h, 0.3 * h, 0.3 * h], [0, 0.62 * h, 0]));
    g.add(m("ico", PAL.leaf, [0.22 * h, 0.22 * h, 0.22 * h], [0.1 * h, 0.78 * h, 0.06 * h]));
    g.add(m("ico", PAL.leaf2, [0.14 * h, 0.14 * h, 0.14 * h], [-0.1 * h, 0.84 * h, 0.1 * h]));
    return g;
  };

  const pine = (h = 1, color = PAL.leafDeep) => {
    const g = new THREE.Group();
    g.add(m("cone", color, [0.28 * h, 0.5 * h, 0.28 * h], [0, 0.35 * h, 0]));
    g.add(m("cone", color, [0.2 * h, 0.42 * h, 0.2 * h], [0, 0.66 * h, 0]));
    return g;
  };

  const cloud = (color = PAL.cream) => {
    const g = new THREE.Group();
    const puffs: [number, number, number, number][] = [
      [0, 0, 0, 0.62],
      [-0.7, -0.1, 0.05, 0.46],
      [0.72, -0.08, 0, 0.5],
      [-0.3, 0.3, -0.1, 0.48],
      [0.34, 0.34, 0.1, 0.44],
      [-1.2, -0.2, 0, 0.3],
      [1.25, -0.2, 0.05, 0.32],
      [0.1, -0.18, 0.35, 0.42],
      [-0.5, -0.12, -0.35, 0.4],
    ];
    for (const [x, y, z, r] of puffs) g.add(m("ico", color, [r, r * 0.82, r], [x, y, z]));
    return g;
  };

  const house = () => {
    const g = new THREE.Group();
    g.add(m("box", PAL.cream, [0.5, 0.34, 0.4], [0, 0.17, 0]));
    const roof = m("pyramid", PAL.clay, [0.46, 0.26, 0.46], [0, 0.47, 0], [0, Math.PI / 4, 0]);
    roof.scale.set(0.46, 0.26, 0.4);
    g.add(roof);
    g.add(m("box", PAL.soilLight, [0.07, 0.2, 0.07], [0.14, 0.52, -0.06]));
    g.add(m("box", PAL.wood, [0.1, 0.18, 0.02], [0, 0.09, 0.205]));
    g.add(m("box", PAL.sun, [0.09, 0.09, 0.02], [-0.15, 0.2, 0.205], undefined, 0x8a5a10));
    g.add(m("box", PAL.sun, [0.09, 0.09, 0.02], [0.15, 0.2, 0.205], undefined, 0x8a5a10));
    // porch
    g.add(m("box", PAL.wood, [0.62, 0.03, 0.18], [0, 0.015, 0.29]));
    g.add(m("box", PAL.clay, [0.62, 0.02, 0.2], [0, 0.3, 0.29], [0.18, 0, 0]));
    g.add(m("cyl", PAL.cream, [0.012, 0.28, 0.012], [-0.29, 0.14, 0.37]));
    g.add(m("cyl", PAL.cream, [0.012, 0.28, 0.012], [0.29, 0.14, 0.37]));
    return g;
  };

  const barn = () => {
    const g = new THREE.Group();
    g.add(m("box", PAL.clay, [0.44, 0.3, 0.5], [0, 0.15, 0]));
    g.add(m("box", 0xb8431f, [0.34, 0.14, 0.52], [0, 0.34, 0], [0, 0, 0]));
    g.add(m("box", PAL.ink, [0.48, 0.03, 0.54], [0, 0.42, 0]));
    g.add(m("box", PAL.cream, [0.16, 0.2, 0.02], [0, 0.1, 0.255]));
    g.add(m("box", PAL.ink, [0.08, 0.07, 0.02], [0, 0.32, 0.265]));
    return g;
  };

  const windmill = () => {
    const g = new THREE.Group();
    g.add(m("taper", PAL.cream, [0.13, 0.62, 0.13], [0, 0.31, 0]));
    g.add(m("cone", PAL.clay, [0.11, 0.12, 0.11], [0, 0.68, 0]));
    g.add(m("box", PAL.wood, [0.06, 0.12, 0.02], [0, 0.06, 0.125]));
    const blades = new THREE.Group();
    blades.position.set(0, 0.58, 0.13);
    for (let i = 0; i < 4; i++) {
      const arm = new THREE.Group();
      arm.rotation.z = (i * Math.PI) / 2;
      arm.add(m("box", PAL.wood, [0.015, 0.4, 0.015], [0, 0.2, 0]));
      arm.add(m("box", PAL.cream, [0.1, 0.26, 0.008], [0.055, 0.25, 0]));
      blades.add(arm);
    }
    blades.add(m("ico", PAL.ink, [0.035, 0.035, 0.035]));
    g.add(blades);
    return { group: g, blades };
  };

  const wateringCan = (color = PAL.leaf) => {
    const g = new THREE.Group();
    g.add(m("cyl", color, [0.16, 0.26, 0.16], [0, 0.13, 0]));
    const spout = m("cyl", color, [0.03, 0.34, 0.03], [0.26, 0.2, 0], [0, 0, -0.95]);
    g.add(spout);
    g.add(m("cone", PAL.sun, [0.065, 0.07, 0.065], [0.41, 0.3, 0], [0, 0, -0.95 + Math.PI]));
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 6, 12, Math.PI), mat(PAL.ink));
    handle.position.set(-0.17, 0.14, 0);
    handle.rotation.z = Math.PI / 2;
    g.add(handle);
    return g;
  };

  /* ── flat things drawn with a 2D canvas ── */

  const canvasTexture = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const c = cv.getContext("2d");
    if (c) draw(c);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  /** a wooden garden marker with a short label */
  const sign = (text: string, w = 0.42) => {
    const tex = canvasTexture(192, 96, (c) => {
      c.fillStyle = "#fbf7ea";
      c.strokeStyle = "#1d2433";
      c.lineWidth = 8;
      c.beginPath();
      c.roundRect(6, 6, 180, 84, 16);
      c.fill();
      c.stroke();
      c.fillStyle = "#1d2433";
      c.font = `bold ${text.length > 3 ? 34 : 52}px ui-monospace, Menlo, monospace`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(text, 96, 51);
    });
    const g = new THREE.Group();
    const h = w / 2;
    const plate = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }),
    );
    plate.position.y = 0.3 + h / 2;
    g.add(plate);
    g.add(m("box", PAL.wood, [0.03, 0.34, 0.02], [0, 0.17, -0.012]));
    return g;
  };

  /** a soft round glow that always faces the camera */
  const glow = (color: string, size: number, opacity = 1) => {
    const tex = canvasTexture(128, 128, (c) => {
      const grad = c.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, color);
      grad.addColorStop(0.25, color);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      c.globalAlpha = 1;
      c.fillStyle = grad;
      c.fillRect(0, 0, 128, 128);
    });
    const s = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    s.scale.setScalar(size);
    return s;
  };

  /** a labelled bubble sprite, e.g. CO₂ */
  const bubble = (text: string, stroke: string, size: number) => {
    const tex = canvasTexture(128, 128, (c) => {
      c.strokeStyle = stroke;
      c.lineWidth = 5;
      c.setLineDash([10, 9]);
      c.beginPath();
      c.arc(64, 64, 54, 0, Math.PI * 2);
      c.stroke();
      c.fillStyle = stroke;
      c.font = "bold 38px ui-monospace, Menlo, monospace";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(text, 64, 66);
    });
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    s.scale.setScalar(size);
    return s;
  };

  /** a soft round dot, so point sprites are circles rather than squares */
  const dot = () =>
    canvasTexture(64, 64, (c) => {
      const grad = c.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.45, "rgba(255,255,255,0.9)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = grad;
      c.fillRect(0, 0, 64, 64);
    });

  /** stars scattered over a dome */
  const stars = (count: number, radius: number, color = 0xf4eedd, size = 3.4) => {
    const pos = new Float32Array(count * 3);
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < count; i++) {
      const th = rand() * Math.PI * 2;
      const ph = Math.acos(rand() * 0.95);
      pos[i * 3] = radius * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = radius * Math.cos(ph) * 0.9 + 2;
      pos[i * 3 + 2] = -Math.abs(radius * Math.sin(ph) * Math.sin(th)) * 0.6 - 8;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color,
        size,
        map: dot(),
        alphaTest: 0.05,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.85,
        fog: false,
        depthWrite: false,
      }),
    );
  };

  /** vertical gradient for scene.background */
  const sky = (stops: [number, string][]) =>
    canvasTexture(4, 256, (c) => {
      const grad = c.createLinearGradient(0, 0, 0, 256);
      for (const [o, col] of stops) grad.addColorStop(o, col);
      c.fillStyle = grad;
      c.fillRect(0, 0, 4, 256);
    });

  return {
    THREE,
    mat,
    m,
    group,
    G,
    grow,
    updateGrowth,
    sway,
    updateSway,
    flower,
    tree,
    pine,
    cloud,
    house,
    barn,
    windmill,
    wateringCan,
    sign,
    glow,
    bubble,
    stars,
    sky,
    dot,
    canvasTexture,
  };
}

export type Kit = ReturnType<typeof makeKit>;
