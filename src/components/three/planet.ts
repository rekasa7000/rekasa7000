import type * as T from "three";
import { makeKit, PAL, type FlowerKind } from "./kit";
import type { Builder } from "./stage";

/*
 * The homestead planet. Farmland is laid out on a latitude/longitude grid and painted
 * into one texture, and the 3D crops are placed from the same grid, so rows, lanes and
 * plants always line up on the sphere.
 */

const R = 2;
const D = Math.PI / 180;

type FieldType = "wheat" | "crops" | "grass" | "lavender" | "tulips" | "soil" | "pond";
type Field = { lat0: number; lat1: number; lon0: number; lon1: number; type: FieldType; across: boolean };

const BANDS: [number, number][] = [
  [-50, -30],
  [-26, -6],
  [-2, 20],
  [24, 44],
];
const ORDER: FieldType[][] = [
  ["soil", "wheat", "grass", "crops", "lavender", "wheat", "tulips", "grass"],
  ["wheat", "crops", "tulips", "grass", "soil", "lavender", "crops", "wheat"],
  ["grass", "lavender", "pond", "wheat", "crops", "grass", "wheat", "tulips"],
  ["crops", "wheat", "grass", "tulips", "wheat", "crops", "lavender", "soil"],
];

const FIELDS: Field[] = BANDS.flatMap(([lat0, lat1], b) =>
  ORDER[b].map((type, c) => ({
    lat0,
    lat1,
    lon0: -90 + c * 45 + 3.5,
    lon1: -90 + c * 45 + 41.5,
    type,
    across: (b + c) % 2 === 0,
  })),
);

const seg = (c: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
};

export const buildPlanet: Builder = ({ THREE, scene, camera }) => {
  const k = makeKit(THREE);
  const UP = new THREE.Vector3(0, 1, 0);

  camera.position.set(0, 1.1, 9.6);
  camera.lookAt(0, 0.45, 0);
  scene.add(new THREE.HemisphereLight(0xfff6e0, 0x33455a, 1.35));
  const sun = new THREE.DirectionalLight(0xfff0d0, 2.4);
  sun.position.set(-4, 6, 6);
  scene.add(sun);

  const tilt = new THREE.Group();
  tilt.rotation.set(0.42, 0, -0.08);
  scene.add(tilt);
  const globe = new THREE.Group();
  tilt.add(globe);

  /* ── farmland texture ── */
  const W = 2048;
  const H = 1024;
  const X = (lon: number) => (0.25 + lon / 360) * W;
  const Y = (lat: number) => ((90 - lat) / 180) * H;
  let seed = 3;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  const map = k.canvasTexture(W, H, (c) => {
    c.fillStyle = "#4a9163";
    c.fillRect(0, 0, W, H);
    // soft variation in the meadow
    for (let i = 0; i < 220; i++) {
      c.fillStyle = i % 2 ? "rgba(111,174,127,0.28)" : "rgba(42,92,61,0.22)";
      c.beginPath();
      c.ellipse(rand() * W, rand() * H, 30 + rand() * 70, 14 + rand() * 30, 0, 0, Math.PI * 2);
      c.fill();
    }
    // wildflowers
    const dots = ["#fbf7ea", "#f4a3b5", "#f5bd4a", "#b9a4ee"];
    for (let i = 0; i < 1500; i++) {
      c.fillStyle = dots[i % 4];
      c.beginPath();
      c.arc(rand() * W, rand() * H, 1.6 + rand() * 1.6, 0, Math.PI * 2);
      c.fill();
    }
    // farm lanes run in the gaps of the grid
    c.strokeStyle = "#ecdcae";
    c.lineWidth = 9;
    c.lineCap = "round";
    for (let col = 0; col <= 8; col++) {
      const x = X(-90 + col * 45);
      c.beginPath();
      c.moveTo(x, Y(46));
      c.lineTo(x, Y(-52));
      c.stroke();
    }
    for (const lat of [22, -4, -28]) {
      c.beginPath();
      c.moveTo(0, Y(lat));
      c.lineTo(W, Y(lat));
      c.stroke();
    }
    // the lane up to the farmhouse
    c.beginPath();
    c.moveTo(X(0), Y(46));
    c.lineTo(X(0), Y(57));
    c.stroke();

    const fill: Record<FieldType, [string, string]> = {
      wheat: ["#e3b54f", "#c9983a"],
      crops: ["#8a5632", "#6b3f22"],
      grass: ["#77b886", "#64a674"],
      lavender: ["#4f7f55", "#9a86d6"],
      tulips: ["#8a5632", "#f08aa0"],
      soil: ["#9a6038", "#7a4a2b"],
      pond: ["#6fb3e0", "#d8eefc"],
    };
    for (const f of FIELDS) {
      const x = X(f.lon0);
      const y = Y(f.lat1);
      const w = X(f.lon1) - x;
      const h = Y(f.lat0) - y;
      const [base, line] = fill[f.type];
      c.save();
      c.beginPath();
      if (f.type === "pond") c.ellipse(x + w / 2, y + h / 2, w * 0.44, h * 0.42, 0, 0, Math.PI * 2);
      else c.roundRect(x, y, w, h, 16);
      c.fillStyle = base;
      c.fill();
      c.clip();
      c.strokeStyle = line;
      if (f.type === "pond") {
        c.lineWidth = 4;
        for (let i = 0; i < 4; i++) {
          c.beginPath();
          c.ellipse(x + w / 2, y + h / 2, w * (0.12 + i * 0.08), h * (0.1 + i * 0.07), 0, 3.4, 5);
          c.stroke();
        }
      } else {
        c.lineWidth = f.type === "lavender" || f.type === "tulips" ? 7 : 3;
        const step = f.type === "grass" ? 22 : 16;
        if (f.across) for (let yy = y + step / 2; yy < y + h; yy += step) seg(c, x, yy, x + w, yy);
        else for (let xx = x + step / 2; xx < x + w; xx += step) seg(c, xx, y, xx, y + h);
        if (f.type === "tulips") {
          c.strokeStyle = "#ff9a5c";
          c.setLineDash([step, step]);
          if (f.across) for (let yy = y + step / 2; yy < y + h; yy += step * 2) seg(c, x, yy, x + w, yy);
          else for (let xx = x + step / 2; xx < x + w; xx += step * 2) seg(c, xx, y, xx, y + h);
        }
      }
      c.restore();
      // hedge
      c.strokeStyle = f.type === "pond" ? "#2a5c3d" : "#2f6a46";
      c.lineWidth = 6;
      c.beginPath();
      if (f.type === "pond") c.ellipse(x + w / 2, y + h / 2, w * 0.44, h * 0.42, 0, 0, Math.PI * 2);
      else c.roundRect(x, y, w, h, 16);
      c.stroke();
    }
  });
  map.anisotropy = 8;
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(R, 72, 48),
    new THREE.MeshStandardMaterial({ map, roughness: 0.92, metalness: 0 }),
  );
  globe.add(body);

  /* ── placing things on the surface ── */
  const dir = (lat: number, lon: number) => {
    const p = (90 - lat) * D;
    const th = lon * D;
    return new THREE.Vector3(Math.sin(p) * Math.sin(th), Math.cos(p), Math.sin(p) * Math.cos(th));
  };
  const place = <O extends T.Object3D>(o: O, lat: number, lon: number, spin = 0, lift = 0) => {
    const nrm = dir(lat, lon);
    o.position.copy(nrm).multiplyScalar(R + lift);
    o.quaternion.setFromUnitVectors(UP, nrm);
    o.rotateY(spin);
    globe.add(o);
    return o;
  };

  // crops, tulips and lavender planted on the same grid as the painted rows
  const dummy = new THREE.Object3D();
  const plant = (
    type: FieldType,
    color: number,
    s: [number, number, number],
    lift: number,
    latStep: number,
    lonStep: number,
  ) => {
    const spots: [number, number][] = [];
    for (const f of FIELDS.filter((x) => x.type === type))
      for (let lat = f.lat0 + 2.5; lat < f.lat1 - 1; lat += latStep)
        for (let lon = f.lon0 + 3; lon < f.lon1 - 2; lon += lonStep / Math.max(0.5, Math.cos(lat * D)))
          spots.push([lat, lon]);
    const inst = new THREE.InstancedMesh(k.G.ico, k.mat(color), spots.length);
    spots.forEach(([lat, lon], i) => {
      const nrm = dir(lat, lon);
      dummy.position.copy(nrm).multiplyScalar(R + lift);
      dummy.quaternion.setFromUnitVectors(UP, nrm);
      dummy.scale.set(...s);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    });
    globe.add(inst);
  };
  plant("crops", PAL.leaf2, [0.035, 0.06, 0.035], 0.04, 5, 4.5);
  plant("tulips", 0xf08aa0, [0.03, 0.05, 0.03], 0.05, 5, 4);
  plant("lavender", PAL.lilac, [0.035, 0.06, 0.035], 0.04, 5, 4);

  // hay bales on the wheat
  FIELDS.filter((f) => f.type === "wheat").forEach((f, i) => {
    for (let j = 0; j < 3; j++) {
      const bale = k.m("cyl", PAL.wheat, [0.07, 0.1, 0.07], [0, 0, 0], [Math.PI / 2, 0, 0]);
      const holder = k.group(bale);
      bale.position.y = 0.06;
      place(holder, f.lat0 + 5 + j * 5, f.lon0 + 8 + ((i + j) % 3) * 10, j);
    }
  });

  /* ── the homestead at the top ── */
  place(k.house(), 62, 0, 0).scale.set(1.5, 1.9, 1.5);
  // cat and dog on the lane
  const cat = k.group(
    k.m("ico", PAL.ink, [0.05, 0.045, 0.07], [0, 0.045, 0]),
    k.m("ico", PAL.ink, [0.035, 0.035, 0.035], [0, 0.09, 0.06]),
    k.m("cyl", PAL.ink, [0.008, 0.09, 0.008], [0, 0.09, -0.07], [-0.6, 0, 0]),
  );
  place(cat, 53.5, 9, 0.6);
  const dog = k.group(
    k.m("ico", PAL.soilLight, [0.06, 0.055, 0.1], [0, 0.07, 0]),
    k.m("ico", PAL.soilLight, [0.045, 0.045, 0.05], [0, 0.13, 0.09]),
    k.m("ico", PAL.wood, [0.02, 0.03, 0.015], [0.035, 0.16, 0.08]),
    k.m("ico", PAL.wood, [0.02, 0.03, 0.015], [-0.035, 0.16, 0.08]),
  );
  place(dog, 53, -9, -0.5);

  const mill = k.windmill();
  place(mill.group, 54, -60, 0.6).scale.setScalar(1.5);
  place(k.barn(), 54, 62, -0.5).scale.setScalar(1.4);

  // flowers taller than the house
  const tall: [number, number, FlowerKind, number, number][] = [
    [70, -62, "sunflower", PAL.sun, 1.25],
    [60, -34, "daisy", PAL.petal, 0.95],
    [80, -30, "tulip", PAL.clay, 0.85],
    [82, 60, "poppy", 0xf0603a, 0.9],
    [60, 34, "daisy", PAL.cream, 1.0],
    [68, 66, "sunflower", PAL.sun, 1.15],
    [66, 104, "lavender", PAL.lilac, 0.9],
    [62, -100, "tulip", PAL.petal, 0.95],
    [72, 150, "daisy", 0xffb37a, 1.05],
    [64, -150, "poppy", PAL.petal, 0.9],
    [58, 180, "sunflower", PAL.sun, 1.2],
    [80, -120, "lavender", PAL.lilac, 0.8],
  ];
  tall.forEach(([lat, lon, kind, color, h], i) => {
    const f = k.flower(kind, color, h);
    f.scale.setScalar(0.78);
    const holder = k.group(k.sway(f, 0.06));
    place(holder, lat, lon, i);
    k.grow(holder, 0.3 + i * 0.12);
  });

  // orchard trees, pines in the south, bushes along lanes
  const trees: [number, number, number][] = [
    [50, 22, 0.55],
    [50, -22, 0.55],
    [54, 82, 0.8],
    [53, 120, 0.7],
    [56, 150, 0.85],
    [55, -84, 0.8],
    [52, -128, 0.7],
    [57, -168, 0.85],
    [84, 60, 0.6],
    [22, 0, 0.45],
    [-4, 45, 0.45],
    [-4, -45, 0.45],
    [-28, 90, 0.45],
    [22, 135, 0.45],
    [-28, -90, 0.45],
    [-4, 180, 0.45],
  ];
  trees.forEach(([lat, lon, s], i) => k.grow(place(k.tree(s), lat, lon, i), 0.2 + (i % 6) * 0.1));
  for (let i = 0; i < 16; i++) place(k.pine(0.5 + (i % 3) * 0.12), -60 - (i % 4) * 7, i * 22.5 + (i % 2) * 9, 0);

  // a scarecrow in the first crop field
  const crop = FIELDS.find((f) => f.type === "crops" && f.lon0 < 0 && f.lat0 > 0) ?? FIELDS[0];
  place(
    k.group(
      k.m("cyl", PAL.wood, [0.012, 0.3, 0.012], [0, 0.15, 0]),
      k.m("box", PAL.clay, [0.22, 0.07, 0.03], [0, 0.22, 0]),
      k.m("ico", PAL.wheat, [0.045, 0.045, 0.045], [0, 0.32, 0]),
      k.m("cone", PAL.wood, [0.07, 0.05, 0.07], [0, 0.375, 0]),
    ),
    (crop.lat0 + crop.lat1) / 2,
    (crop.lon0 + crop.lon1) / 2,
  );

  // a glass greenhouse on the far side
  const glass = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: 0xd8f0ff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.2,
      flatShading: true,
    }),
  );
  const greenhouse = k.group(glass, k.m("cyl", PAL.cream, [0.35, 0.03, 0.35], [0, 0.015, 0]));
  const inside = k.flower("tulip", PAL.petal, 0.14);
  greenhouse.add(inside);
  place(greenhouse, 52, -176, 0);

  /* ── sky around the planet ── */
  const air = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.09, 40, 28),
    new THREE.MeshBasicMaterial({
      color: 0x9bdcab,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
      depthWrite: false,
    }),
  );
  tilt.add(air);

  const clouds = new THREE.Group();
  tilt.add(clouds);
  const cloudSpots: [number, number, number][] = [
    [34, 40, 0.3],
    [-12, 150, 0.36],
    [10, -100, 0.28],
    [-38, -20, 0.3],
    [48, -140, 0.24],
  ];
  for (const [lat, lon, s] of cloudSpots) {
    const c = k.cloud(PAL.white);
    c.scale.setScalar(s);
    const nrm = dir(lat, lon);
    c.position.copy(nrm).multiplyScalar(R + 0.62);
    c.quaternion.setFromUnitVectors(UP, nrm);
    clouds.add(c);
  }

  const moonOrbit = new THREE.Group();
  moonOrbit.rotation.z = 0.35;
  scene.add(moonOrbit);
  const moon = k.group(
    k.m("ico", PAL.stone, [0.24, 0.24, 0.24]),
    k.m("ico", 0xa9a290, [0.07, 0.03, 0.07], [0.08, 0.2, 0.08]),
    k.m("ico", 0xa9a290, [0.05, 0.03, 0.05], [-0.12, 0.1, 0.17]),
  );
  moon.position.set(3.5, 0, 0);
  moonOrbit.add(moon);

  const canOrbit = new THREE.Group();
  canOrbit.rotation.z = -0.5;
  scene.add(canOrbit);
  const can = k.wateringCan(PAL.leaf);
  can.scale.setScalar(0.85);
  can.position.set(-3.25, 0, 0);
  can.rotation.z = -0.5;
  canOrbit.add(can);
  const drips = [0, 1, 2, 3].map(() => {
    const dmesh = new THREE.Mesh(k.G.ico, new THREE.MeshBasicMaterial({ color: 0x8fc4ff }));
    dmesh.scale.setScalar(0.03);
    can.add(dmesh);
    return dmesh;
  });

  const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(0.62, 32), new THREE.MeshBasicMaterial({ color: 0xf5bd4a }));
  sunDisc.position.set(3.3, 3.6, -3);
  const halo = new THREE.Mesh(
    new THREE.CircleGeometry(1.05, 32),
    new THREE.MeshBasicMaterial({ color: 0xf5bd4a, transparent: true, opacity: 0.22 }),
  );
  halo.position.copy(sunDisc.position).z -= 0.01;
  scene.add(halo, sunDisc);

  let spin = 0;
  let vel = 0;
  return {
    hfov: 42,
    drag: (dx) => {
      spin += dx * 0.008;
      vel = dx * 0.25;
    },
    update: (t, dt) => {
      k.updateGrowth(t);
      k.updateSway(t);
      spin += (0.1 + vel) * dt;
      vel *= Math.pow(0.05, dt);
      globe.rotation.y = spin;
      clouds.rotation.y = spin * 0.6 + t * 0.03;
      mill.blades.rotation.z = t * 1.6;
      moonOrbit.rotation.y = t * 0.18;
      moon.rotation.y = t * 0.4;
      canOrbit.rotation.y = -t * 0.3;
      drips.forEach((dm, i) => {
        const p = (t * 1.4 + i * 0.25) % 1;
        dm.position.set(0.44 + p * 0.1, 0.3 - p * 0.5, 0);
        dm.scale.setScalar(0.03 * (1 - p * 0.6));
      });
      halo.scale.setScalar(1 + Math.sin(t * 1.2) * 0.06);
    },
  };
};
