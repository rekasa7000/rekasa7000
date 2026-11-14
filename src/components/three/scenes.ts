import type * as T from "three";
import { makeKit, PAL, type FlowerKind, type Kit } from "./kit";
import type { Builder, StageCtx } from "./stage";

/* Four small 3D dioramas, one per job. They share a night sky, a curved horizon, hills, grass and fireflies. */

const GR = 26; // radius of the ground sphere
const gy = (x: number, z: number) => Math.sqrt(GR * GR - x * x - z * z) - GR;

type Tick = (t: number, dt: number) => void;

function base(ctx: StageCtx, opts: { ground: number; far: number; body: "sun" | "moon" | "dawn"; fireflies?: number }) {
  const { THREE, scene, camera } = ctx;
  const k = makeKit(THREE);
  const ticks: Tick[] = [];

  scene.background = k.sky([
    [0, "#0d1330"],
    [0.55, "#1b2440"],
    [1, opts.body === "dawn" ? "#6a4a6a" : "#3a3a6a"],
  ]);
  scene.fog = new THREE.Fog(0x252c55, 16, 52);
  camera.position.set(0, 2.2, 9.6);

  const hemi = new THREE.HemisphereLight(0xd6e0ff, 0x2a3350, 1.7);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff0d0, 2.6);
  key.position.set(-3, 6, 5);
  scene.add(key);

  scene.add(k.stars(170, 70));

  // sun, moon or dawn
  if (opts.body === "dawn") {
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 40),
      new THREE.MeshBasicMaterial({ color: 0xf0a03c, fog: false }),
    );
    disc.position.set(0, -0.9, -22);
    const halo = k.glow("rgba(245,150,74,0.9)", 22, 0.32);
    halo.position.set(0, 0, -21);
    scene.add(disc, halo);
    ticks.push((t) => halo.scale.setScalar(22 + Math.sin(t * 0.8) * 1.2));
  } else {
    const isSun = opts.body === "sun";
    const col = isSun ? 0xf5bd4a : 0xf4eedd;
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(1.25, 32),
      new THREE.MeshBasicMaterial({ color: col, fog: false }),
    );
    disc.position.set(5.2, 8.0, -24);
    const halo = k.glow(isSun ? "rgba(245,170,74,0.85)" : "rgba(200,210,255,0.7)", 8, 0.3);
    halo.position.set(5.2, 8.0, -24.5);
    scene.add(disc, halo);
    if (!isSun)
      for (const [x, y, r] of [
        [-0.4, 0.3, 0.26],
        [0.3, -0.3, 0.32],
        [0.45, 0.45, 0.15],
      ]) {
        const crater = new THREE.Mesh(
          new THREE.CircleGeometry(r, 16),
          new THREE.MeshBasicMaterial({ color: 0xcfc8b6, fog: false }),
        );
        crater.position.set(5.2 + x, 8.0 + y, -23.9);
        scene.add(crater);
      }
  }

  // ground: the top of a big sphere, so the horizon curves like a small planet
  const ground = new THREE.Mesh(
    new THREE.SphereGeometry(GR, 64, 32),
    new THREE.MeshStandardMaterial({ color: opts.ground, roughness: 1 }),
  );
  ground.position.y = -GR;
  scene.add(ground);

  // far hills with pines
  for (let i = 0; i < 7; i++) {
    const x = -13 + i * 4.4;
    const z = -12 - (i % 3) * 2.2;
    const hill = k.m("ico", opts.far, [3.6 + (i % 2), 1.5 + (i % 3) * 0.5, 2.6], [x, gy(x, z) - 0.2, z]);
    scene.add(hill);
    for (let j = 0; j < 3; j++) {
      const p = k.pine(1.1 + (j % 2) * 0.4, opts.far);
      p.position.set(x - 1.6 + j * 1.5, gy(x, z) + 0.9 + (j % 2) * 0.35, z + 1.2);
      scene.add(p);
    }
  }

  // grass tufts
  const tuftCount = 150;
  const tufts = new THREE.InstancedMesh(k.G.cone, k.mat(opts.ground === PAL.leaf ? PAL.leaf2 : 0xd98a5c), tuftCount);
  const dummy = new THREE.Object3D();
  let seed = 5;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < tuftCount; i++) {
    const x = (rand() - 0.5) * 15;
    const z = 3.6 - rand() * 11;
    dummy.position.set(x, gy(x, z) + 0.06, z);
    dummy.scale.set(0.03, 0.12 + rand() * 0.12, 0.03);
    dummy.rotation.set((rand() - 0.5) * 0.4, 0, (rand() - 0.5) * 0.4);
    dummy.updateMatrix();
    tufts.setMatrixAt(i, dummy.matrix);
  }
  scene.add(tufts);

  // fireflies
  const n = opts.fireflies ?? 9;
  if (n > 0) {
    const pos = new Float32Array(n * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const flies = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xffe27a,
        map: k.dot(),
        size: 9,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      }),
    );
    const homes = Array.from({ length: n }, () => [(rand() - 0.5) * 7, 0.6 + rand() * 2.6, 2 - rand() * 4, rand() * 6]);
    scene.add(flies);
    ticks.push((t) => {
      homes.forEach(([x, y, z, ph], i) => {
        pos[i * 3] = x + Math.sin(t * 0.5 + ph) * 0.6;
        pos[i * 3 + 1] = y + Math.sin(t * 0.8 + ph * 2) * 0.35;
        pos[i * 3 + 2] = z + Math.cos(t * 0.4 + ph) * 0.5;
      });
      geo.attributes.position.needsUpdate = true;
      (flies.material as T.PointsMaterial).opacity = 0.55 + Math.sin(t * 2.2) * 0.35;
    });
  }

  /** put an object on the ground at (x, z) */
  const on = <O extends T.Object3D>(o: O, x: number, z: number, lift = 0) => {
    o.position.set(x, gy(x, z) + lift, z);
    scene.add(o);
    return o;
  };

  const finish = (extra?: Tick): ReturnType<Builder> => ({
    hfov: 44,
    update: (t, dt) => {
      k.updateGrowth(t);
      k.updateSway(t);
      camera.position.x = Math.sin(t * 0.22) * 0.55;
      camera.position.y = 2.2 + Math.sin(t * 0.17) * 0.12;
      camera.lookAt(0, 1.75, 0);
      for (const tick of ticks) tick(t, dt);
      extra?.(t, dt);
    },
  });

  return { k, on, ticks, finish, hemi, key, rand };
}

/** rings that pulse out of an antenna */
function signal(k: Kit, parent: T.Object3D, y: number, ticks: Tick[], scale = 1) {
  const { THREE } = k;
  const rings = [0, 1, 2].map((i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.014, 6, 24, Math.PI),
      new THREE.MeshBasicMaterial({ color: PAL.sun, transparent: true, fog: false }),
    );
    ring.position.y = y;
    parent.add(ring);
    return { ring, i };
  });
  ticks.push((t) => {
    for (const { ring, i } of rings) {
      const p = (t * 0.7 + i / 3) % 1;
      ring.scale.setScalar(scale * (0.5 + p * 2.2));
      (ring.material as T.MeshBasicMaterial).opacity = 1 - p;
    }
  });
}

/* ── Kloudtech: a storm cloud, real rain, and a weather station over 25 sprouts ── */

export const buildRain: Builder = (ctx) => {
  const { THREE, scene } = ctx;
  const { k, on, ticks, finish, hemi, rand } = base(ctx, {
    ground: PAL.leaf,
    far: 0x22422f,
    body: "moon",
    fireflies: 0,
  });

  // three planted beds, 25 sprouts
  const sprouts: { o: T.Object3D; x: number; z: number }[] = [];
  [1.5, 0.75, 0].forEach((z, row) => {
    for (let s = -5; s <= 5; s++) on(k.m("ico", PAL.soil, [0.34, 0.07, 0.24]), s * 0.5 - 0.3, z, 0.01);
    const count = row === 0 ? 9 : 8;
    for (let i = 0; i < count; i++) {
      const x = -2.75 + (i + (row === 1 ? 0.5 : 0)) * (4.9 / (count - (row === 1 ? 0 : 1)));
      const sp = k.flower("sprout", PAL.leaf2, 0.22 + row * 0.03);
      sp.scale.setScalar(0.8);
      const holder = k.group(k.sway(sp, 0.1));
      on(holder, x, z, 0.06);
      k.grow(holder, 0.2 + i * 0.06 + row * 0.2);
      sprouts.push({ o: sp, x, z });
    }
  });

  // puddles
  const puddles = [
    [-1.2, 2.3, 0.55],
    [0.9, 2.6, 0.7],
  ].map(([x, z, r]) => {
    const p = new THREE.Mesh(
      new THREE.CircleGeometry(r, 24),
      new THREE.MeshBasicMaterial({ color: 0x6fb3e0, transparent: true, opacity: 0.8 }),
    );
    p.rotation.x = -Math.PI / 2;
    p.scale.y = 0.6;
    return on(p, x, z, 0.03);
  });

  // the cloud: a lit top and a heavy underside
  const cloud = new THREE.Group();
  const top = k.cloud(PAL.cream);
  const under = k.cloud(0x8f96ad);
  under.scale.set(0.94, 0.5, 0.94);
  under.position.y = -0.3;
  cloud.add(under, top);
  cloud.scale.setScalar(1.1);
  const CLOUD_Y = 4.0;
  cloud.position.set(-0.6, CLOUD_Y, 0.6);
  scene.add(cloud);

  // rain: instanced streaks that fall, slant with the wind and splash where they land
  const N = 240;
  const rain = new THREE.InstancedMesh(
    k.G.box,
    new THREE.MeshBasicMaterial({ color: 0xa9d6ff, transparent: true, opacity: 0.85 }),
    N,
  );
  rain.frustumCulled = false;
  scene.add(rain);
  const drops = Array.from({ length: N }, () => ({
    ox: (rand() - 0.5) * 3.2,
    oz: (rand() - 0.5) * 1.5,
    y: rand() * CLOUD_Y,
    v: 6.5 + rand() * 4,
  }));
  const dummy = new THREE.Object3D();

  const SPL = 40;
  const splashes = Array.from({ length: SPL }, () => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.7, 1, 14),
      new THREE.MeshBasicMaterial({
        color: 0xd8eefc,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    scene.add(ring);
    return { ring, life: 1 };
  });
  let nextSplash = 0;

  // lightning: a jagged bolt, a flash of light, and the cloud lighting up from inside
  const boltGeo = new THREE.BufferGeometry();
  boltGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(8 * 3), 3));
  const bolt = new THREE.Line(boltGeo, new THREE.LineBasicMaterial({ color: 0xfff6c9, fog: false }));
  bolt.visible = false;
  scene.add(bolt);
  const flash = new THREE.PointLight(0xdfe8ff, 0, 30);
  scene.add(flash);
  let strikeAt = 3.5;
  let strikeEnd = 0;

  // weather station
  const SX = 2.75;
  const SZ = 0.9;
  const station = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    station.add(
      k.m(
        "cyl",
        PAL.stone,
        [0.02, 0.5, 0.02],
        [Math.cos(a) * 0.14, 0.22, Math.sin(a) * 0.14],
        [Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5],
      ),
    );
  }
  station.add(k.m("cyl", PAL.cream, [0.035, 2.5, 0.035], [0, 1.25, 0]));
  const panel = k.m("box", 0x2b55c9, [0.6, 0.03, 0.4], [-0.3, 1.25, 0.05], [0.2, 0, 0.55]);
  station.add(panel, k.m("box", PAL.cream, [0.26, 0.34, 0.16], [0.17, 1.55, 0]));
  const led = k.m("ico", 0x7ee2a8, [0.035, 0.035, 0.035], [0.17, 1.66, 0.09], undefined, 0x7ee2a8);
  led.material = led.material.clone();
  station.add(led);
  const vane = k.group(
    k.m("box", PAL.clay, [0.62, 0.03, 0.03]),
    k.m("cone", PAL.clay, [0.07, 0.14, 0.07], [0.36, 0, 0], [0, 0, -Math.PI / 2]),
    k.m("box", PAL.clay, [0.03, 0.18, 0.14], [-0.3, 0, 0]),
  );
  vane.position.y = 2.15;
  station.add(vane);
  const cups = new THREE.Group();
  cups.position.y = 2.55;
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    cups.add(
      k.m("cyl", PAL.ink, [0.012, 0.36, 0.012], [Math.cos(a) * 0.18, 0, Math.sin(a) * 0.18], [0, -a, Math.PI / 2]),
    );
    cups.add(k.m("ico", PAL.sun, [0.075, 0.075, 0.075], [Math.cos(a) * 0.36, 0, Math.sin(a) * 0.36]));
  }
  station.add(cups, k.m("ico", PAL.ink, [0.045, 0.045, 0.045], [0, 2.55, 0]));
  signal(k, station, 2.8, ticks, 1.1);
  on(station, SX, SZ);

  return finish((t, dt) => {
    const cx = -0.6 + Math.sin(t * 0.28) * 1.5;
    cloud.position.x = cx;
    cloud.position.y = CLOUD_Y + Math.sin(t * 0.6) * 0.08;
    const gust = 1 + Math.sin(t * 0.9) * 0.5;
    const slant = -0.16 * gust;

    drops.forEach((dr, i) => {
      dr.y -= dr.v * dt;
      const x = cx + dr.ox + (CLOUD_Y - dr.y) * slant;
      const z = 0.6 + dr.oz;
      const floor = gy(x, z) + 0.02;
      if (dr.y <= floor) {
        const s = splashes[nextSplash++ % SPL];
        s.life = 0;
        s.ring.position.set(x, floor + 0.02, z);
        dr.y = CLOUD_Y - 0.5 - rand() * 0.3;
      }
      dummy.position.set(x, dr.y, z);
      dummy.rotation.set(0, 0, -slant);
      dummy.scale.set(0.014, 0.26, 0.014);
      dummy.updateMatrix();
      rain.setMatrixAt(i, dummy.matrix);
    });
    rain.instanceMatrix.needsUpdate = true;

    for (const s of splashes) {
      s.life = Math.min(1, s.life + dt * 2.6);
      s.ring.scale.setScalar(0.03 + s.life * 0.17);
      (s.ring.material as T.MeshBasicMaterial).opacity = (1 - s.life) * 0.9;
    }
    puddles.forEach((p, i) => p.scale.set(1 + Math.sin(t * 2 + i) * 0.03, 0.6 + Math.sin(t * 2 + i) * 0.02, 1));

    // sprouts under the cloud perk up
    for (const sp of sprouts) {
      const wet = Math.max(0, 1 - Math.abs(sp.x - cx) / 1.8);
      sp.o.scale.setScalar(0.8 + wet * 0.35 + wet * Math.sin(t * 9 + sp.x * 3) * 0.04);
    }

    cups.rotation.y -= dt * 5 * gust;
    vane.rotation.y = 0.5 + Math.sin(t * 0.9) * 0.35;
    (led.material as T.MeshStandardMaterial).emissiveIntensity = Math.sin(t * 5) > 0 ? 2.2 : 0.2;

    if (!ctx.reduce && t > strikeAt) {
      const arr = boltGeo.attributes.position.array as Float32Array;
      const bx = cx + (rand() - 0.5) * 1.4;
      const tx = bx + (rand() - 0.5) * 1.6;
      for (let i = 0; i < 8; i++) {
        const p = i / 7;
        arr[i * 3] = bx + (tx - bx) * p + (i > 0 && i < 7 ? (rand() - 0.5) * 0.5 : 0);
        arr[i * 3 + 1] = CLOUD_Y - 0.5 - p * (CLOUD_Y - 0.5);
        arr[i * 3 + 2] = -0.6;
      }
      boltGeo.attributes.position.needsUpdate = true;
      flash.position.set(bx, CLOUD_Y - 0.4, 1.5);
      strikeEnd = t + 0.22;
      strikeAt = t + 5 + rand() * 5;
    }
    const striking = t < strikeEnd;
    bolt.visible = striking && Math.sin(t * 90) > -0.3;
    flash.intensity = striking ? 60 + Math.sin(t * 120) * 40 : 0;
    hemi.intensity = striking ? 3.2 : 1.7;
  });
};

/* ── Concentrix: a bed of flowers, one per language ── */

const LANGS: [string, FlowerKind, number, number][] = [
  ["ES", "tulip", 0xff7a45, 0.95],
  ["FR", "daisy", 0xf4a3b5, 1.3],
  ["DE", "sunflower", PAL.sun, 1.75],
  ["JA", "daisy", PAL.cream, 1.15],
  ["TL", "poppy", 0xf0603a, 1.5],
  ["RO", "lavender", 0xb9a4ee, 1.1],
  ["PT", "daisy", 0xffb37a, 1.3],
  ["IT", "tulip", 0xf4a3b5, 0.9],
];

export const buildLanguages: Builder = (ctx) => {
  const { THREE, scene } = ctx;
  const { k, on, finish } = base(ctx, { ground: PAL.leaf, far: 0x22422f, body: "sun" });

  LANGS.forEach(([code, kind, color, h], i) => {
    const x = -2.62 + i * 0.75;
    const z = 0.2 + Math.cos((i - 3.5) * 0.5) * 0.5;
    on(k.m("ico", PAL.soil, [0.42, 0.09, 0.36]), x, z, 0.01);
    const f = k.flower(kind, color, h);
    f.scale.setScalar(1.5);
    const holder = k.group(k.sway(f, 0.06));
    on(holder, x, z, 0.05);
    k.grow(holder, 0.2 + i * 0.14);
    const s = k.sign(code, 0.4);
    s.rotation.y = (3.5 - i) * 0.06;
    on(s, x + 0.1, z + 0.85);
    k.grow(s, 0.1 + i * 0.1);
  });

  // butterflies
  const wingGeo = new THREE.CircleGeometry(0.11, 10);
  const flies = [0xf5bd4a, 0x8fc4ff, 0xf4a3b5].map((color, i) => {
    const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, fog: false });
    const l = new THREE.Mesh(wingGeo, mat);
    const r = new THREE.Mesh(wingGeo, mat);
    l.position.x = -0.1;
    r.position.x = 0.1;
    const lp = k.group(l);
    const rp = k.group(r);
    const g = k.group(lp, rp, k.m("box", PAL.ink, [0.02, 0.14, 0.02]));
    g.rotation.x = -0.9;
    scene.add(g);
    return { g, lp, rp, i };
  });

  return finish((t) => {
    for (const { g, lp, rp, i } of flies) {
      const a = t * (0.35 + i * 0.07) + i * 2.1;
      g.position.set(
        Math.sin(a) * (2.4 - i * 0.5),
        2.4 + i * 0.5 + Math.sin(a * 2.3) * 0.5,
        0.6 + Math.cos(a * 1.3) * 0.8,
      );
      g.rotation.y = Math.cos(a) * 0.8;
      const flap = Math.sin(t * 16 + i) * 1.1;
      lp.rotation.y = flap;
      rp.rotation.y = -flap;
    }
  });
};

/* ── RevEarth: a fruit tree taking in carbon and breathing out oxygen ── */

export const buildCarbon: Builder = (ctx) => {
  const { scene } = ctx;
  const { k, on, finish } = base(ctx, { ground: PAL.soilLight, far: 0x5a3a2a, body: "moon" });

  const tree = k.group(
    k.m("taper", PAL.wood, [0.3, 2.3, 0.3], [0, 1.15, 0]),
    k.m("cyl", PAL.wood, [0.09, 1.2, 0.09], [-0.5, 2.3, 0], [0, 0, 0.75]),
    k.m("cyl", PAL.wood, [0.09, 1.2, 0.09], [0.5, 2.35, 0.1], [0, 0, -0.75]),
    k.m("cyl", PAL.wood, [0.08, 0.9, 0.08], [0.05, 2.7, -0.3], [0.5, 0, 0]),
    k.m("ico", PAL.wood, [0.5, 0.12, 0.45], [0, 0.05, 0]),
  );
  const leaves: [number, number, number, number, number][] = [
    [0, 3.5, -0.3, 1.05, PAL.leafDeep],
    [-1.05, 3.0, -0.1, 0.85, PAL.leafDeep],
    [1.1, 3.05, -0.1, 0.9, PAL.leafDeep],
    [-0.55, 3.75, 0.1, 0.8, PAL.leaf],
    [0.6, 3.8, 0.15, 0.82, PAL.leaf],
    [0, 3.1, 0.45, 0.9, PAL.leaf],
    [-1.3, 3.55, 0.2, 0.55, PAL.leaf],
    [1.35, 3.6, 0.25, 0.55, 0x4d9668],
    [0.05, 4.3, 0.1, 0.7, 0x4d9668],
    [-0.75, 2.75, 0.5, 0.55, PAL.leaf2],
    [0.75, 2.8, 0.55, 0.55, PAL.leaf2],
    [0.25, 3.75, 0.6, 0.5, PAL.leaf2],
    [-0.35, 4.15, 0.45, 0.4, 0x9bdcab],
    [0.9, 3.4, 0.7, 0.36, 0x9bdcab],
  ];
  leaves.forEach(([x, y, z, r, c], i) => {
    const holder = k.group(k.m("ico", c, [r, r * 0.9, r]));
    holder.position.set(x, y, z);
    tree.add(k.grow(holder, 0.5 + i * 0.09));
  });
  [
    [-0.9, 2.75, 0.75],
    [0.35, 2.7, 0.95],
    [1.05, 3.0, 0.7],
    [-0.3, 3.45, 0.95],
    [0.7, 3.7, 0.75],
    [-1.2, 3.3, 0.55],
    [0.05, 4.0, 0.7],
  ].forEach(([x, y, z], i) => {
    const fruit = k.group(k.m("ball", 0xff7a45, [0.13, 0.13, 0.13], [0, 0, 0], undefined, 0x551c08));
    fruit.position.set(x, y, z);
    tree.add(k.grow(fruit, 1.9 + i * 0.12));
  });
  on(k.sway(tree, 0.012), 0, 0);

  // saplings on stakes
  [-3.1, -2.2, 2.3, 3.2].forEach((x, i) => {
    const sp = k.flower("sprout", PAL.leaf2, 0.35 + (i % 2) * 0.15);
    sp.scale.setScalar(1.3);
    const g = k.group(k.sway(sp, 0.09), k.m("cyl", PAL.cream, [0.012, 0.6, 0.012], [0.1, 0.3, 0]));
    on(g, x, 0.8 + (i % 2) * 0.5, 0.02);
    k.grow(g, 1.2 + i * 0.12);
  });

  // carbon drifts in, oxygen drifts out
  const crown: [number, number, number] = [0, 3.4, 0.6];
  const co2 = [
    [-3.6, 4.6, 0],
    [3.5, 5.0, 1.4],
    [-3.3, 2.4, 2.8],
    [3.4, 2.6, 0.7],
  ].map(([x, y, off]) => {
    const s = k.bubble("CO₂", "#f4eedd", 0.95);
    scene.add(s);
    return { s, x, y, off };
  });
  const o2 = [
    [-0.7, 0],
    [0.5, 1.6],
    [1.2, 3.1],
  ].map(([x, off]) => {
    const s = k.bubble("O₂", "#9bdcab", 0.7);
    scene.add(s);
    return { s, x, off };
  });

  return finish((t) => {
    for (const b of co2) {
      const p = ((t + b.off) % 5) / 5;
      const e = p * p;
      b.s.position.set(b.x + (crown[0] - b.x) * e, b.y + (crown[1] - b.y) * e, 1.2 - e * 0.4);
      b.s.scale.setScalar(0.95 * (1 - e * 0.75));
      b.s.material.opacity = Math.min(1, p * 5) * (1 - Math.max(0, p - 0.8) * 5);
    }
    for (const b of o2) {
      const p = ((t + b.off) % 5.5) / 5.5;
      b.s.position.set(b.x + p * 0.8, 4.4 + p * 2.6, 1.3);
      b.s.scale.setScalar(0.35 + p * 0.55);
      b.s.material.opacity = Math.min(1, p * 4) * (1 - p);
    }
  });
};

/* ── Internship: the first sprout, watered at dawn beside the first IoT node ── */

export const buildSprout: Builder = (ctx) => {
  const { THREE, scene } = ctx;
  const { k, on, ticks, finish } = base(ctx, { ground: PAL.soilLight, far: 0x5a3a2a, body: "dawn", fireflies: 6 });

  on(k.m("ico", PAL.soil, [1.0, 0.24, 0.8]), 0, 0.3, 0.02);

  const stem = k.m("cyl", PAL.leaf, [0.07, 1.5, 0.07], [0, 0.75, 0]);
  const leafL = k.group(k.m("ico", PAL.leaf, [0.55, 0.09, 0.3], [-0.48, 0, 0]));
  const leafR = k.group(k.m("ico", PAL.leaf2, [0.62, 0.09, 0.32], [0.54, 0, 0]));
  leafL.position.y = leafR.position.y = 1.5;
  leafL.rotation.set(0.7, 0, -0.45);
  leafR.rotation.set(0.7, 0, 0.5);
  const sprout = k.group(stem, leafL, leafR, k.m("ico", PAL.leaf2, [0.08, 0.08, 0.08], [0, 1.52, 0]));
  const holder = k.group(k.sway(sprout, 0.04));
  on(holder, 0, 0.3, 0.2);
  k.grow(holder, 0.4);
  // the seed it came from
  on(k.m("ico", PAL.wheat, [0.13, 0.08, 0.1]), 0.5, 0.75, 0.2).rotation.z = 0.5;

  // watering can and its stream
  const can = k.wateringCan(PAL.leaf);
  can.scale.setScalar(1.7);
  can.position.set(-1.9, 2.55, 0.35);
  can.rotation.z = -0.55;
  scene.add(can);
  const drops = Array.from({ length: 16 }, () => {
    const dmesh = new THREE.Mesh(k.G.ico, new THREE.MeshBasicMaterial({ color: 0x9fd0ff }));
    scene.add(dmesh);
    return dmesh;
  });

  // the first IoT node: a board on a stake with a blinking light and a signal
  const node = new THREE.Group();
  node.add(k.m("cyl", PAL.cream, [0.025, 1.0, 0.025], [0, 0.5, 0]));
  node.add(k.m("box", 0x22422f, [0.62, 0.46, 0.06], [0, 1.2, 0]));
  node.add(k.m("box", PAL.ink, [0.3, 0.22, 0.03], [-0.05, 1.22, 0.04]));
  for (let i = 0; i < 4; i++) {
    node.add(k.m("box", PAL.sun, [0.07, 0.025, 0.02], [-0.34, 1.07 + i * 0.09, 0.03]));
    node.add(k.m("box", PAL.sun, [0.07, 0.025, 0.02], [0.34, 1.07 + i * 0.09, 0.03]));
  }
  const led = k.m("ico", 0xff7a45, [0.04, 0.04, 0.04], [0.22, 1.05, 0.05], undefined, 0xff7a45);
  led.material = led.material.clone();
  node.add(led, k.m("cyl", PAL.cream, [0.012, 0.34, 0.012], [0.2, 1.6, 0]));
  signal(k, node, 1.82, ticks, 0.8);
  node.position.x = 0.2;
  on(node, 1.85, 0.5);
  k.grow(node, 1.2);

  const date = k.sign("OCT 2023", 0.8);
  date.rotation.y = -0.2;
  on(date, 2.75, 1.5);
  k.grow(date, 1.5);

  [-3.0, -2.4, 3.3].forEach((x, i) => {
    const sp = k.flower("sprout", PAL.leaf2, 0.22);
    const g = k.group(k.sway(sp, 0.1));
    on(g, x, 1.2 - i * 0.4, 0.02);
    k.grow(g, 1.6 + i * 0.15);
  });

  return finish((t) => {
    can.rotation.z = -0.55 + Math.sin(t * 0.8) * 0.05;
    drops.forEach((dm, i) => {
      const p = (t * 0.9 + i / drops.length) % 1;
      // from the rose of the can, arcing down onto the sprout
      dm.position.set(-1.05 + p * 1.0 + (i % 3) * 0.05, 2.5 - p * p * 1.9, 0.35 + (i % 2) * 0.06);
      dm.scale.setScalar(0.035 * (1 - p * 0.4));
    });
    (led.material as T.MeshStandardMaterial).emissiveIntensity = Math.sin(t * 4) > 0 ? 2.4 : 0.15;
  });
};
