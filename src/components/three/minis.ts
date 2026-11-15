import { makeKit, PAL, type FlowerKind } from "./kit";
import { base } from "./scenes";
import type { Builder } from "./stage";

/* Small scenes drawn through the shared renderer: project covers, plant pots, and the Skills emblem. */

type CoverSpec = { ground: number; far: number; body: "sun" | "moon"; flowers: [FlowerKind, number, number][] };

const GREEN = { ground: PAL.leaf, far: 0x22422f };
const SOIL = { ground: PAL.soilLight, far: 0x5a3a2a };

const COVERS: CoverSpec[] = [
  {
    ...GREEN,
    body: "sun",
    flowers: [
      ["daisy", 0xf4a3b5, 1.1],
      ["sunflower", PAL.sun, 1.7],
      ["daisy", PAL.cream, 1.0],
    ],
  },
  {
    ...SOIL,
    body: "moon",
    flowers: [
      ["tulip", 0xff7a45, 1.0],
      ["poppy", 0xf0603a, 1.5],
      ["tulip", 0xf4a3b5, 0.9],
    ],
  },
  {
    ...GREEN,
    body: "moon",
    flowers: [
      ["lavender", 0xb9a4ee, 1.1],
      ["daisy", 0xffb37a, 1.6],
      ["lavender", 0xb9a4ee, 0.95],
    ],
  },
  {
    ...SOIL,
    body: "sun",
    flowers: [
      ["poppy", 0xf4a3b5, 1.0],
      ["sunflower", PAL.sun, 1.75],
      ["tulip", 0xf4a3b5, 0.95],
    ],
  },
  {
    ...GREEN,
    body: "sun",
    flowers: [
      ["daisy", PAL.cream, 1.05],
      ["tulip", 0xff7a45, 1.55],
      ["daisy", 0xf4a3b5, 1.0],
    ],
  },
  {
    ...SOIL,
    body: "moon",
    flowers: [
      ["sunflower", PAL.sun, 1.15],
      ["lavender", 0xb9a4ee, 1.6],
      ["poppy", 0xff7a45, 0.95],
    ],
  },
];

/** A seed-packet cover: three flowers on a small world under its own sky. */
export const coverBuilders: Builder[] = COVERS.map((spec) => (ctx) => {
  const { k, on, finish } = base(ctx, { ground: spec.ground, far: spec.far, body: spec.body, fireflies: 5 });
  spec.flowers.forEach(([kind, color, h], i) => {
    const x = (i - 1) * 1.7;
    const z = i === 1 ? 0.2 : 0.7;
    on(k.m("ico", PAL.soil, [0.5, 0.1, 0.42]), x, z, 0.01);
    const f = k.flower(kind, color, h);
    f.scale.setScalar(1.75);
    const holder = k.group(k.sway(f, 0.06));
    on(holder, x, z, 0.06);
    k.grow(holder, 0.15 + i * 0.18);
  });
  [-3.3, 3.1, -2.6].forEach((x, i) => {
    const sp = k.flower("sprout", PAL.leaf2, 0.26);
    const g = k.group(k.sway(sp, 0.1));
    on(g, x, 1.4 - i * 0.3, 0.02);
    k.grow(g, 0.7 + i * 0.12);
  });
  return finish();
});

const POTS: [FlowerKind, number, number][] = [
  ["daisy", PAL.petal, 1.15],
  ["poppy", 0xf4a3b5, 1.0],
  ["sunflower", PAL.sun, 1.4],
  ["lavender", PAL.lilac, 1.1],
  ["sprout", PAL.leaf2, 0.5],
];

/** A terracotta pot with one plant, on a transparent background. */
export const potBuilders: Builder[] = POTS.map(([kind, color, h]) => ({ THREE, scene, camera }) => {
  const k = makeKit(THREE);
  camera.position.set(0, 1.9, 8.2);
  camera.lookAt(0, 1.55, 0);
  scene.add(new THREE.HemisphereLight(0xfff6e0, 0x4a4a5a, 1.5));
  const key = new THREE.DirectionalLight(0xfff0d0, 2.2);
  key.position.set(-3, 5, 4);
  scene.add(key);

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.42, 0.75, 14), k.mat(PAL.clay));
  pot.position.y = 0.38;
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.16, 14), k.mat(0xe2673c));
  rim.position.y = 0.8;
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.05, 14), k.mat(PAL.soil));
  soil.position.y = 0.88;
  scene.add(pot, rim, soil);

  const f = k.flower(kind, color, h);
  f.scale.setScalar(kind === "sprout" ? 1.9 : 1.45);
  const holder = k.group(k.sway(f, 0.07));
  holder.position.y = 0.9;
  scene.add(holder);
  k.grow(holder, 0.2);

  return {
    hfov: 24,
    update: (t) => {
      k.updateGrowth(t);
      k.updateSway(t);
    },
  };
});

/** The emblem at the centre of the Skills orbit: a small turning globe with flowers. */
export const buildEmblem: Builder = ({ THREE, scene, camera }) => {
  const k = makeKit(THREE);
  camera.position.set(0, 0.9, 6);
  camera.lookAt(0, 0.35, 0);
  scene.add(new THREE.HemisphereLight(0xfff6e0, 0x33455a, 1.5));
  const key = new THREE.DirectionalLight(0xfff0d0, 2.2);
  key.position.set(-3, 5, 4);
  scene.add(key);

  const globe = new THREE.Group();
  globe.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 16),
      new THREE.MeshStandardMaterial({ color: PAL.leaf, roughness: 1 }),
    ),
  );
  const UP = new THREE.Vector3(0, 1, 0);
  const spots: [number, number, FlowerKind, number, number][] = [
    [80, 0, "sunflower", PAL.sun, 0.75],
    [48, 60, "daisy", PAL.petal, 0.6],
    [50, 180, "tulip", PAL.clay, 0.55],
    [46, 300, "poppy", 0xf0603a, 0.6],
    [20, 120, "lavender", PAL.lilac, 0.5],
    [18, 240, "daisy", PAL.cream, 0.5],
  ];
  spots.forEach(([lat, lon, kind, color, h], i) => {
    const p = ((90 - lat) * Math.PI) / 180;
    const th = (lon * Math.PI) / 180;
    const n = new THREE.Vector3(Math.sin(p) * Math.sin(th), Math.cos(p), Math.sin(p) * Math.cos(th));
    const f = k.flower(kind, color, h);
    f.scale.setScalar(1.25);
    const holder = k.group(k.sway(f, 0.06));
    holder.position.copy(n);
    holder.quaternion.setFromUnitVectors(UP, n);
    globe.add(holder);
    k.grow(holder, 0.2 + i * 0.12);
  });
  globe.rotation.x = 0.3;
  scene.add(globe);

  return {
    hfov: 32,
    update: (t) => {
      k.updateGrowth(t);
      k.updateSway(t);
      globe.rotation.y = t * 0.35;
    },
  };
};
