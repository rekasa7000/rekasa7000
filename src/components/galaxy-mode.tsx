"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Galaxy2D } from "./galaxy-2d";
import { ENTRIES, SKILLS as CAREER_SKILLS } from "@/lib/career-data";

// ── Planet / education / project data derived from career-data.ts ─────────────

const PLANET_DATA = ENTRIES.filter(e => e.kind === "work").map(e => ({
  id: e.id,
  name: e.shortName ?? e.name,
  role: e.title,
  period: e.period!,
  color: e.color3d,
  emissive: e.emissive,
  size: e.size3d,
  orbitRadius: e.orbitRadius,
  speed: e.speed3d,
  inc: e.inc,
  rotY: e.rotY,
  tex: e.tex,
  kind: "work" as const,
  description: e.shortDesc,
}));

const EDUCATION_DATA = ENTRIES.filter(e => e.kind === "education").map(e => ({
  id: e.id,
  name: e.name,
  short: e.shortName ?? e.name,
  degree: e.title,
  honor: "Cum Laude",
  period: e.period!,
  color: e.color3d,
  emissive: e.emissive,
  size: e.size3d,
  orbitRadius: e.orbitRadius,
  speed: e.speed3d,
  inc: e.inc,
  rotY: e.rotY,
  tex: e.tex,
  hasRing: e.hasRing,
  kind: "education" as const,
  description: e.shortDesc,
}));

const PROJECT_DATA = ENTRIES.filter(e => e.kind === "project").map(e => ({
  id: e.id,
  name: e.name,
  tagline: e.title,
  year: e.period,
  color: e.color3d,
  emissive: e.emissive,
  size: e.size3d,
  orbitRadius: e.orbitRadius,
  speed: e.speed3d,
  inc: e.inc,
  rotY: e.rotY,
  tex: e.tex,
  kind: "project" as const,
  github: e.github,
  description: e.shortDesc,
}));

// ── Types ─────────────────────────────────────────────────────────────────────

type WorkBody = (typeof PLANET_DATA)[0];
type EduBody = (typeof EDUCATION_DATA)[0];
type ProjectBody = (typeof PROJECT_DATA)[0];
type AnyBody = WorkBody | EduBody | ProjectBody;
type CamMode = "cockpit" | "chase";
type ViewMode = "3d" | "ship" | "2d";

type SceneHandle = {
  canvas: HTMLCanvasElement;
  startAnimation: (
    onSelect: (b: AnyBody | null) => void,
    container: HTMLElement,
    opts?: {
      mode?: "explore" | "ship";
      onCamMode?: (m: CamMode) => void;
      onPointerLock?: (locked: boolean) => void;
      onShipUpdate?: (d: { speed: number; heading: number; throttle: number }) => void;
    },
  ) => () => void;
  stopAnimation: () => void;
  setCamMode: (m: CamMode) => void;
  detach: (container: HTMLElement) => void;
  destroy: () => void;
};

// ── Orbit position helper ─────────────────────────────────────────────────────

function orbitPos(r: number, angle: number, inc: number, rotY: number) {
  const bx = r * Math.cos(angle);
  const by = r * Math.sin(angle) * Math.sin(inc);
  const bz = r * Math.sin(angle) * Math.cos(inc);
  return {
    x: bx * Math.cos(rotY) + bz * Math.sin(rotY),
    y: by,
    z: -bx * Math.sin(rotY) + bz * Math.cos(rotY),
  };
}

// ── Scene builder ─────────────────────────────────────────────────────────────

async function buildScene(): Promise<SceneHandle> {
  const THREE = await import("three");
  const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

  // ── Renderer ───────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "default" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x00000c, 1);

  const gl = renderer.getContext();
  if (!gl) {
    renderer.dispose();
    throw new Error("WebGL context unavailable");
  }

  const canvas = renderer.domElement;

  // ── Scene ──────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x00000c, 0.0018);

  // ── Camera ─────────────────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1200);
  camera.position.set(0, 50, 110);

  // ── Controls (for explore mode) ────────────────────────────────────────
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 12;
  controls.maxDistance = 220;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;

  // ── Helpers ────────────────────────────────────────────────────────────
  function makeSprite(text: string, hexColor: string, fontSize = 22, scaleMult = 1) {
    const cv = document.createElement("canvas");
    cv.width = 320;
    cv.height = 80;
    const ctx = cv.getContext("2d")!;
    ctx.clearRect(0, 0, 320, 80);
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.fillStyle = hexColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = hexColor;
    ctx.shadowBlur = 10;
    ctx.fillText(text, 160, 40);
    const tex = new THREE.CanvasTexture(cv);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sprite.scale.set(5 * scaleMult, 1.25 * scaleMult, 1);
    return sprite;
  }

  function makeOrbitRing(radius: number, color: number, opacity: number, inc = 0, rotY = 0) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.06, 8, 160),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity }),
    );
    const orbitNormal = new THREE.Vector3(
      Math.sin(inc) * Math.sin(rotY),
      -Math.cos(inc),
      Math.sin(inc) * Math.cos(rotY),
    ).normalize();
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), orbitNormal);
    return ring;
  }

  // ── Stars ──────────────────────────────────────────────────────────────
  {
    const count = 14000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1100;
      const r = Math.random();
      if (r < 0.15) {
        col[i * 3] = 0.6;
        col[i * 3 + 1] = 0.7;
        col[i * 3 + 2] = 1;
      } else if (r < 0.3) {
        col[i * 3] = 1;
        col[i * 3 + 1] = 0.9;
        col[i * 3 + 2] = 0.5;
      } else {
        col[i * 3] = 1;
        col[i * 3 + 1] = 1;
        col[i * 3 + 2] = 1;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    scene.add(
      new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          size: 0.22,
          sizeAttenuation: true,
          vertexColors: true,
          transparent: true,
          opacity: 0.85,
        }),
      ),
    );
  }

  // ── Nebula clouds ──────────────────────────────────────────────────────
  const nebulaConfigs = [
    { r: 30, g: 10, b: 80 },
    { r: 10, g: 20, b: 60 },
    { r: 50, g: 5, b: 40 },
    { r: 5, g: 40, b: 30 },
    { r: 20, g: 5, b: 60 },
    { r: 60, g: 10, b: 20 },
    { r: 10, g: 30, b: 50 },
    { r: 40, g: 15, b: 60 },
    { r: 15, g: 50, b: 20 },
    { r: 35, g: 8, b: 55 },
  ];
  for (const nc of nebulaConfigs) {
    const cv = document.createElement("canvas");
    cv.width = 128;
    cv.height = 128;
    const ctx = cv.getContext("2d")!;
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, `rgba(${nc.r},${nc.g},${nc.b},0.3)`);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(cv),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    const s = 100 + Math.random() * 130;
    sprite.scale.set(s, s, 1);
    sprite.position.set((Math.random() - 0.5) * 350, (Math.random() - 0.5) * 130, (Math.random() - 0.5) * 350);
    scene.add(sprite);
  }

  // ── Lighting ───────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x223355, 4.5));
  // decay=0 disables inverse-square falloff so all planets get equal sunlight
  scene.add(new THREE.PointLight(0xffdd88, 6, 0, 0));

  // ── Sun ────────────────────────────────────────────────────────────────
  const sunTex = new THREE.TextureLoader().load("/planets/2k_sun.jpg");
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(4, 32, 32),
    // MeshBasicMaterial ignores scene lighting — shows texture as-is
    new THREE.MeshBasicMaterial({ map: sunTex }),
  );
  scene.add(sun);

  const sgCv = document.createElement("canvas");
  sgCv.width = 128;
  sgCv.height = 128;
  const sgCtx = sgCv.getContext("2d")!;
  const sgGrd = sgCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
  sgGrd.addColorStop(0, "rgba(255,200,50,0.7)");
  sgGrd.addColorStop(0.35, "rgba(255,140,20,0.3)");
  sgGrd.addColorStop(1, "rgba(255,60,0,0)");
  sgCtx.fillStyle = sgGrd;
  sgCtx.fillRect(0, 0, 128, 128);
  const sunGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(sgCv),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  sunGlow.scale.set(22, 22, 1);
  scene.add(sunGlow);

  const sunLabel = makeSprite("✦ REGEE", "#ffcc44", 26, 1.15);
  sunLabel.position.set(0, 7.5, 0);
  scene.add(sunLabel);

  // ── Planet textures ────────────────────────────────────────────────────
  const texLoader = new THREE.TextureLoader();
  const PLANET_TEXTURES = [
    "/planets/2k_mars.jpg",
    "/planets/2k_venus_surface.jpg",
    "/planets/2k_neptune.jpg",
    "/planets/2k_uranus.jpg",
    "/planets/2k_ceres_fictional.jpg",
    "/planets/2k_haumea_fictional.jpg",
    "/planets/2k_makemake_fictional.jpg",
    "/planets/2k_eris_fictional.jpg",
  ];
  let texIdx = 0;

  // ── Work experience planets ────────────────────────────────────────────
  const planetMeshes: InstanceType<typeof THREE.Mesh>[] = [];
  const planetAngles = PLANET_DATA.map(() => Math.random() * Math.PI * 2);
  const planetLabels: InstanceType<typeof THREE.Sprite>[] = [];

  for (let i = 0; i < PLANET_DATA.length; i++) {
    const p = PLANET_DATA[i];
    const hexStr = "#" + p.color.toString(16).padStart(6, "0");
    scene.add(makeOrbitRing(p.orbitRadius, 0x223344, 0.45, p.inc, p.rotY));
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(p.size, 32, 32),
      new THREE.MeshStandardMaterial({
        map: texLoader.load(PLANET_TEXTURES[texIdx++ % PLANET_TEXTURES.length]),
        emissive: p.emissive,
        emissiveIntensity: 0.04,
        roughness: 0.75,
        metalness: 0.05,
      }),
    );
    mesh.userData = { bodyKind: "work", bodyIndex: i };
    planetMeshes.push(mesh);
    scene.add(mesh);
    const label = makeSprite(p.name, hexStr, 18, 0.9);
    planetLabels.push(label);
    scene.add(label);
  }

  // ── Asteroid belt (skills) ─────────────────────────────────────────────
  type AsteroidDatum = {
    mesh: InstanceType<typeof THREE.Mesh>;
    label: InstanceType<typeof THREE.Sprite> | null;
    angle: number;
    radius: number;
    speed: number;
    y: number;
  };
  const asteroids: AsteroidDatum[] = [];
  const ASTEROID_COUNT = CAREER_SKILLS.length * 4;
  for (let i = 0; i < ASTEROID_COUNT; i++) {
    const angle = (i / ASTEROID_COUNT) * Math.PI * 2 + Math.random() * 0.5;
    const radius = 19.5 + (Math.random() - 0.5) * 5;
    const y = (Math.random() - 0.5) * 2;
    const mesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.1 + Math.random() * 0.22, 0),
      new THREE.MeshStandardMaterial({ color: 0x6677aa, roughness: 0.9, metalness: 0.15 }),
    );
    mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    scene.add(mesh);
    let label: InstanceType<typeof THREE.Sprite> | null = null;
    if (i < CAREER_SKILLS.length) {
      label = makeSprite(CAREER_SKILLS[i], "#7799cc", 16, 0.65);
      scene.add(label);
    }
    asteroids.push({ mesh, label, angle, radius, speed: 0.0007 + Math.random() * 0.001, y });
  }

  // ── Education planets ──────────────────────────────────────────────────
  const eduMeshes: InstanceType<typeof THREE.Mesh>[] = [];
  const eduAngles = EDUCATION_DATA.map(() => Math.random() * Math.PI * 2);
  const eduLabels: InstanceType<typeof THREE.Sprite>[] = [];

  for (let i = 0; i < EDUCATION_DATA.length; i++) {
    const e = EDUCATION_DATA[i];
    const hexStr = "#" + e.color.toString(16).padStart(6, "0");
    scene.add(makeOrbitRing(e.orbitRadius, 0x443322, 0.35, e.inc, e.rotY));
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(e.size, 32, 32),
      new THREE.MeshStandardMaterial({
        map: texLoader.load(PLANET_TEXTURES[texIdx++ % PLANET_TEXTURES.length]),
        emissive: e.emissive,
        emissiveIntensity: 0.04,
        roughness: 0.7,
        metalness: 0.1,
      }),
    );
    mesh.userData = { bodyKind: "education", bodyIndex: i };
    eduMeshes.push(mesh);
    scene.add(mesh);

    if (e.id === "bpsu") {
      const inner = e.size + 0.6;
      const outer = e.size + 3.4;
      const ringGeo = new THREE.RingGeometry(inner, outer, 128, 1);
      // Remap UVs: u = 0 at inner edge, 1 at outer edge
      const uvAttr = ringGeo.attributes.uv;
      const posAttr = ringGeo.attributes.position;
      const _rv = new THREE.Vector3();
      for (let j = 0; j < posAttr.count; j++) {
        _rv.fromBufferAttribute(posAttr, j);
        uvAttr.setXY(j, (_rv.length() - inner) / (outer - inner), 0.5);
      }
      const ring = new THREE.Mesh(
        ringGeo,
        new THREE.MeshBasicMaterial({
          map: texLoader.load("/planets/2k_saturn_ring_alpha.png"),
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      ring.rotation.x = Math.PI / 2.8;
      mesh.add(ring);
    }

    const label = makeSprite(e.short, hexStr, 18, 0.88);
    eduLabels.push(label);
    scene.add(label);
  }

  // ── Project mini-planets ───────────────────────────────────────────────
  const projMeshes: InstanceType<typeof THREE.Mesh>[] = [];
  const projAngles = PROJECT_DATA.map((_, i) => (i / PROJECT_DATA.length) * Math.PI * 2);
  const projLabels: InstanceType<typeof THREE.Sprite>[] = [];

  for (let i = 0; i < PROJECT_DATA.length; i++) {
    const p = PROJECT_DATA[i];
    const hexStr = "#" + p.color.toString(16).padStart(6, "0");
    scene.add(makeOrbitRing(p.orbitRadius, 0x221133, 0.28, p.inc, p.rotY));
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(p.size, 28, 28),
      new THREE.MeshStandardMaterial({
        map: texLoader.load(PLANET_TEXTURES[texIdx++ % PLANET_TEXTURES.length]),
        emissive: p.emissive,
        emissiveIntensity: 0.04,
        roughness: 0.75,
        metalness: 0.05,
      }),
    );
    mesh.userData = { bodyKind: "project", bodyIndex: i };
    projMeshes.push(mesh);
    scene.add(mesh);
    const label = makeSprite(p.name, hexStr, 16, 0.8);
    projLabels.push(label);
    scene.add(label);
  }

  // ── Comets ────────────────────────────────────────────────────────────
  const comaCv = document.createElement("canvas");
  comaCv.width = 64;
  comaCv.height = 64;
  {
    const ctx = comaCv.getContext("2d")!;
    const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(220,240,255,1)");
    grd.addColorStop(0.3, "rgba(170,210,255,0.6)");
    grd.addColorStop(1, "rgba(100,150,255,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 64, 64);
  }
  const comaTex = new THREE.CanvasTexture(comaCv);

  type CometDatum = {
    nucleus: InstanceType<typeof THREE.Mesh>;
    coma: InstanceType<typeof THREE.Sprite>;
    tail: InstanceType<typeof THREE.Mesh>;
    start: InstanceType<typeof THREE.Vector3>;
    end: InstanceType<typeof THREE.Vector3>;
    t: number;
    speed: number;
  };

  const COMET_CONFIGS = [
    { start: new THREE.Vector3(-185, 55, -75), end: new THREE.Vector3(175, -45, 85), speed: 1 / 18, t0: 0.02 },
    { start: new THREE.Vector3(105, -75, -165), end: new THREE.Vector3(-95, 65, 145), speed: 1 / 26, t0: 0.42 },
    { start: new THREE.Vector3(-55, 95, 175), end: new THREE.Vector3(75, -85, -135), speed: 1 / 15, t0: 0.71 },
  ];

  const comets: CometDatum[] = [];
  const TAIL_H = 22;

  for (const cc of COMET_CONFIGS) {
    const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xddeeff, emissive: 0xaaccff, emissiveIntensity: 5, roughness: 0.1 }),
    );
    scene.add(nucleus);

    const coma = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: comaTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(coma);

    const tailGeo = new THREE.ConeGeometry(0.9, TAIL_H, 8, 1, true);
    tailGeo.translate(0, TAIL_H / 2, 0);
    const tail = new THREE.Mesh(
      tailGeo,
      new THREE.MeshBasicMaterial({
        color: 0xaaccff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    scene.add(tail);

    const trailDir = new THREE.Vector3().subVectors(cc.end, cc.start).normalize().negate();
    tail.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), trailDir);

    comets.push({ nucleus, coma, tail, start: cc.start, end: cc.end, t: cc.t0, speed: cc.speed });
  }

  // ── Raycaster ──────────────────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const clickableMeshes = [...planetMeshes, ...eduMeshes, ...projMeshes];

  // ── Ship state ─────────────────────────────────────────────────────────
  let camMode: CamMode = "cockpit";
  let onCamModeChange: ((m: CamMode) => void) | null = null;

  const shipPos = new THREE.Vector3(0, 8, 95);
  const shipQuat = new THREE.Quaternion();
  const shipVel = new THREE.Vector3();
  const chaseCamPos = new THREE.Vector3(0, 10, 103);
  // Euler angles — yaw + pitch only (no roll ever accumulates)
  let shipYaw   = 0;
  let shipPitch = 0;
  let shipRoll  = 0;
  const MAX_PITCH = Math.PI * 0.45;
  const MAX_ROLL  = Math.PI * 0.65; // ±117° max bank
  shipQuat.setFromEuler(new THREE.Euler(0, 0, 0, "YXZ"));

  // ── Ship mesh ──────────────────────────────────────────────────────────
  const shipGroup = new THREE.Group();

  // ── Ship mesh — extruded from the exact same 2D canvas-ship outline ────
  // Coordinate mapping: 2D +X (forward) → 3D -Z; 2D ±Y (wingspan) → 3D ±X
  // Shape is defined in local XY. After mesh.rotation.x = +PI/2:
  //   local X → world X  (wingspan)
  //   local Y → world Z  (negative = forward = -Z in world)
  //   extrude (local +Z, depth) → world -Y  (downward)
  // Center by setting position.y = depth / 2.
  const SC = 0.12; // 2D pixel → 3D unit  (2D ship ≈74 px = 9 world units)
  const bodyH = 1.4;

  // Fuselage — identical polygon to the 2D hull
  const fusShape = new THREE.Shape();
  fusShape.moveTo(   0,       -42 * SC);  // nose tip
  fusShape.lineTo(-8  * SC,  -30 * SC);   // port shoulder
  fusShape.lineTo(-10 * SC,  - 8 * SC);   // port body (widest point)
  fusShape.lineTo(- 9 * SC,   16 * SC);   // port waist
  fusShape.lineTo(- 5 * SC,   26 * SC);   // port tail flare
  fusShape.lineTo(   0,        30 * SC);  // tail center
  fusShape.lineTo(  5 * SC,   26 * SC);   // stbd tail flare
  fusShape.lineTo(  9 * SC,   16 * SC);   // stbd waist
  fusShape.lineTo( 10 * SC,  - 8 * SC);   // stbd body
  fusShape.lineTo(  8 * SC,  -30 * SC);   // stbd shoulder
  fusShape.closePath();

  const fusMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(fusShape, {
      depth: bodyH,
      bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: 2,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x2a5a90, emissive: 0x0a2030, emissiveIntensity: 0.3, metalness: 0.7, roughness: 0.3,
    }),
  );
  fusMesh.rotation.x = Math.PI / 2;
  fusMesh.position.y = bodyH / 2;
  shipGroup.add(fusMesh);

  // Wings — same swept shape as the 2D canvas wing polygon
  // 2D wing points for sy=+1 side (starboard): (12,8),(-20,9),(-30,30),(-10,26),(10,14)
  // Mapped to shape local XY: localX=2D_y*SC, localY=-(2D_x)*SC
  const wingMat = new THREE.MeshStandardMaterial({
    color: 0x172840, metalness: 0.7, roughness: 0.3, side: THREE.DoubleSide,
  });
  for (const s of [1, -1]) {
    const ws = new THREE.Shape();
    ws.moveTo(s *  8 * SC,  -12 * SC);  // root-leading  (2D: 12,  8)
    ws.lineTo(s *  9 * SC,   20 * SC);  // root-trailing (2D:-20,  9)
    ws.lineTo(s * 30 * SC,   30 * SC);  // tip-trailing  (2D:-30, 30) — swept back
    ws.lineTo(s * 26 * SC,   10 * SC);  // tip-leading   (2D:-10, 26)
    ws.lineTo(s * 14 * SC,  -10 * SC);  // leading-edge  (2D: 10, 14)
    ws.closePath();
    const wingMesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(ws, { depth: 0.14, bevelEnabled: false }),
      wingMat,
    );
    wingMesh.rotation.x = Math.PI / 2;
    wingMesh.position.y = 0.1; // slightly above fuselage bottom so wings are visible
    shipGroup.add(wingMesh);
  }

  // Wing nacelles — at 2D (x=-18, y=±21) → 3D (x=±2.52, z=2.16)
  const nacMat = new THREE.MeshStandardMaterial({ color: 0x1a3a60, metalness: 0.8, roughness: 0.25 });
  for (const s of [1, -1]) {
    const nacGeo = new THREE.CylinderGeometry(0.28, 0.45, 2.8, 8);
    nacGeo.rotateX(Math.PI / 2);
    const nac = new THREE.Mesh(nacGeo, nacMat);
    nac.position.set(s * 21 * SC, -0.3, 18 * SC); // under wing at ~70% span
    shipGroup.add(nac);
  }

  // Cockpit canopy — at 2D x=22 → 3D z=-2.64, raised on top
  const cockpitMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.6),
    new THREE.MeshStandardMaterial({
      color: 0x7ab4f5, transparent: true, opacity: 0.75,
      emissive: 0x1a4a80, emissiveIntensity: 0.9, metalness: 0.05, roughness: 0.04,
    }),
  );
  cockpitMesh.position.set(0, bodyH / 2 + 0.45, -22 * SC);
  cockpitMesh.rotation.x = -0.2;
  shipGroup.add(cockpitMesh);

  // Twin engine nozzles — at 2D (x=-30, y=±11) → 3D (x=±1.32, z=3.6+0.5)
  for (const s of [1, -1]) {
    const nozzleGeo = new THREE.CylinderGeometry(0.42, 0.58, 1.8, 8);
    nozzleGeo.rotateX(Math.PI / 2);
    const nozzle = new THREE.Mesh(
      nozzleGeo,
      new THREE.MeshStandardMaterial({ color: 0x080f1a, metalness: 0.95, roughness: 0.15 }),
    );
    nozzle.position.set(s * 11 * SC, -0.2, 30 * SC + 0.5);
    shipGroup.add(nozzle);
  }

  // Engine glow (scales with thrust)
  const engCv = document.createElement("canvas");
  engCv.width = 64;
  engCv.height = 64;
  {
    const ctx = engCv.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,200,100,1)");
    g.addColorStop(0.35, "rgba(255,110,20,0.65)");
    g.addColorStop(1, "rgba(255,40,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  }
  const engineGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(engCv),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  engineGlow.position.z = 30 * SC + 1.6; // behind the tail nozzles
  engineGlow.scale.set(0, 0, 1);
  shipGroup.add(engineGlow);

  shipGroup.scale.setScalar(0.05); // ship is ~0.4 world-units long — dwarfed by planets
  shipGroup.visible = false; // hidden until ship mode activates
  scene.add(shipGroup);
  shipGroup.position.copy(shipPos);
  shipGroup.quaternion.copy(shipQuat);

  // ── Input cleanup tracker ──────────────────────────────────────────────
  let inputCleanup: (() => void) | null = null;

  // ── Animation state ────────────────────────────────────────────────────
  let rafId = 0;
  let running = false;

  // Reusable vectors (avoid GC in hot loop)
  const _fwd = new THREE.Vector3();
  const _up = new THREE.Vector3();
  const _chaseTgt = new THREE.Vector3();
  const _lookAt = new THREE.Vector3();
  const _cometPos = new THREE.Vector3();

  function startAnimation(
    onSelect: (b: AnyBody | null) => void,
    container: HTMLElement,
    opts?: {
      mode?: "explore" | "ship";
      onCamMode?: (m: CamMode) => void;
      onPointerLock?: (locked: boolean) => void;
      onShipUpdate?: (d: { speed: number; heading: number; throttle: number }) => void;
    },
  ): () => void {
    const mode = opts?.mode ?? "explore";
    onCamModeChange = opts?.onCamMode ?? null;
    const onPointerLockCb   = opts?.onPointerLock   ?? null;
    const onShipUpdateCb    = opts?.onShipUpdate     ?? null;

    // ── Clean up any previous session ──────────────────────────────────
    running = false;
    cancelAnimationFrame(rafId);
    inputCleanup?.();
    inputCleanup = null;

    // ── Resize ──────────────────────────────────────────────────────────
    const resize = () => {
      const w = container.clientWidth,
        h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    // ── Mode-specific setup ──────────────────────────────────────────────
    if (mode === "explore") {
      controls.enabled = true;
      camera.fov = 60;
      camera.updateProjectionMatrix();
      // Reset to orbit view if camera has drifted
      if (camera.position.length() < 5) {
        camera.position.set(0, 50, 110);
      }
      shipGroup.visible = false;
    } else {
      // Ship mode
      controls.enabled = false;
      camera.fov = 80; // wider FOV for cockpit feel
      camera.updateProjectionMatrix();
    }

    // ── Pointer + planet selection ───────────────────────────────────────
    let pointerDownAt = { x: 0, y: 0 };
    let pointerLocked = false;

    const onPointerDown = (e: PointerEvent) => {
      pointerDownAt = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: PointerEvent) => {
      if (mode === "ship" && pointerLocked) return; // mouse captured — no selection
      const dx = e.clientX - pointerDownAt.x,
        dy = e.clientY - pointerDownAt.y;
      if (dx * dx + dy * dy > 25) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(clickableMeshes);
      if (hits.length > 0) {
        const { bodyKind, bodyIndex } = (hits[0].object as InstanceType<typeof THREE.Mesh>).userData as {
          bodyKind: string;
          bodyIndex: number;
        };
        let body: AnyBody | null = null;
        if (bodyKind === "work") body = PLANET_DATA[bodyIndex];
        else if (bodyKind === "education") body = EDUCATION_DATA[bodyIndex];
        else if (bodyKind === "project") body = PROJECT_DATA[bodyIndex];
        onSelect(body);
        if (mode === "explore") controls.autoRotate = false;
      } else {
        onSelect(null);
        if (mode === "explore") controls.autoRotate = true;
        if (mode === "ship" && !pointerLocked) canvas.requestPointerLock();
      }
    };

    // ── Ship input (only in ship mode) ───────────────────────────────────
    const keys: Record<string, boolean> = {};
    let accMouseX = 0,
      accMouseY = 0;

    const onKeyDown = (e: KeyboardEvent) => {
      if (mode !== "ship") return;
      const k = e.key.toLowerCase();
      keys[k] = true;
      if (k === "v") {
        camMode = camMode === "cockpit" ? "chase" : "cockpit";
        onCamModeChange?.(camMode);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (mode === "ship" && pointerLocked) {
        accMouseX += e.movementX;
        accMouseY += e.movementY;
      }
    };
    const onLockChange = () => {
      pointerLocked = document.pointerLockElement === canvas;
      onPointerLockCb?.(pointerLocked);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    window.addEventListener("resize", resize);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerlockchange", onLockChange);

    inputCleanup = () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", resize);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onLockChange);
      if (document.pointerLockElement === canvas) document.exitPointerLock();
    };

    let prevTime   = Date.now() * 0.001;
    let frameCount = 0;
    running = true;

    const tick = () => {
      if (!running) return;
      rafId = requestAnimationFrame(tick);
      const now = Date.now() * 0.001;
      const dt = Math.min(now - prevTime, 0.05);
      prevTime = now;

      // ── Ship physics ────────────────────────────────────────────────
      if (mode === "ship") {
        const THRUST    = 55;
        const ROLL_RATE = 1.6;
        const SENS      = 0.0018;
        const MAX_SPD   = 100;

        // A/D → bank/roll like an aileron
        if (keys["a"]) shipRoll += ROLL_RATE * dt;
        if (keys["d"]) shipRoll -= ROLL_RATE * dt;
        shipRoll = Math.max(-MAX_ROLL, Math.min(MAX_ROLL, shipRoll));

        // Mouse X → roll (fine), Mouse Y → pitch
        if (pointerLocked && (accMouseX !== 0 || accMouseY !== 0)) {
          shipRoll  -= accMouseX * SENS * 1.2;
          shipPitch -= accMouseY * SENS;
          shipRoll   = Math.max(-MAX_ROLL, Math.min(MAX_ROLL, shipRoll));
          shipPitch  = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, shipPitch));
          accMouseX  = 0;
          accMouseY  = 0;
        }

        // Auto-level: wings drift back to level when A/D not held
        if (!keys["a"] && !keys["d"]) {
          shipRoll *= Math.exp(-2.5 * dt);
        }

        // Coordinated turn: banking generates yaw (like a real aircraft)
        shipYaw += Math.sin(shipRoll) * 0.9 * dt;

        // Rebuild quaternion with roll included
        shipQuat.setFromEuler(new THREE.Euler(shipPitch, shipYaw, shipRoll, "YXZ"));
        _fwd.set(0, 0, -1).applyQuaternion(shipQuat);
        _up.set(0, 1, 0).applyQuaternion(shipQuat);

        if (keys["w"]) shipVel.addScaledVector(_fwd, THRUST * dt);
        if (keys["s"]) shipVel.addScaledVector(_fwd, -THRUST * 0.35 * dt);
        if (keys["q"]) shipVel.addScaledVector(_up,  THRUST * 0.4 * dt);
        if (keys["e"]) shipVel.addScaledVector(_up, -THRUST * 0.4 * dt);

        const spd = shipVel.length();
        if (spd > MAX_SPD) shipVel.multiplyScalar(MAX_SPD / spd);
        shipVel.multiplyScalar(Math.pow(0.88, dt * 60));
        shipPos.addScaledVector(shipVel, dt);

        shipGroup.position.copy(shipPos);
        shipGroup.quaternion.copy(shipQuat);

        // Engine glow scales with speed
        const thrust = Math.min(1, spd / 55);
        const gs = thrust > 0.05 ? (2.5 + thrust * 9) * (0.85 + Math.random() * 0.3) : 0;
        engineGlow.scale.set(gs, gs, 1);

        // Emit ship telemetry to React HUD (~30 fps)
        frameCount++;
        if (frameCount % 2 === 0 && onShipUpdateCb) {
          const headingDeg = (((Math.atan2(_fwd.x, -_fwd.z) * 180) / Math.PI) + 360) % 360;
          onShipUpdateCb({ speed: Math.round(spd), heading: Math.round(headingDeg), throttle: thrust });
        }

        // ── Camera (ship mode) ─────────────────────────────────────────

        if (camMode === "cockpit") {
          camera.position.copy(shipPos).addScaledVector(_fwd, 0.02).addScaledVector(_up, 0.01);
          camera.quaternion.copy(shipQuat);
          shipGroup.visible = false;
        } else {
          // Chase cam — smooth lerp behind and above ship
          _chaseTgt.copy(shipPos).addScaledVector(_fwd, -2.5).addScaledVector(_up, 0.7);
          chaseCamPos.lerp(_chaseTgt, Math.min(1, dt * 5));
          camera.position.copy(chaseCamPos);
          _lookAt.copy(shipPos).addScaledVector(_fwd, 1.5);
          camera.lookAt(_lookAt);
          shipGroup.visible = true;
        }
      }

      // ── Sun ──────────────────────────────────────────────────────────
      sun.rotation.y += 0.004;
      const pulse = 1 + Math.sin(now * 1.8) * 0.06;
      sunGlow.scale.set(22 * pulse, 22 * pulse, 1);

      // ── Planets ──────────────────────────────────────────────────────
      for (let i = 0; i < PLANET_DATA.length; i++) {
        const p = PLANET_DATA[i];
        planetAngles[i] += p.speed;
        const { x, y, z } = orbitPos(p.orbitRadius, planetAngles[i], p.inc, p.rotY);
        planetMeshes[i].position.set(x, y, z);
        planetMeshes[i].rotation.y += 0.009;
        planetLabels[i].position.set(x, y + p.size + 1.6, z);
      }

      // ── Asteroids ────────────────────────────────────────────────────
      for (const a of asteroids) {
        a.angle += a.speed;
        const ax = Math.cos(a.angle) * a.radius,
          az = Math.sin(a.angle) * a.radius;
        a.mesh.position.set(ax, a.y, az);
        a.mesh.rotation.x += 0.018;
        a.mesh.rotation.y += 0.013;
        if (a.label) a.label.position.set(ax, a.y + 0.9, az);
      }

      // ── Education ────────────────────────────────────────────────────
      for (let i = 0; i < EDUCATION_DATA.length; i++) {
        const e = EDUCATION_DATA[i];
        eduAngles[i] += e.speed;
        const { x, y, z } = orbitPos(e.orbitRadius, eduAngles[i], e.inc, e.rotY);
        eduMeshes[i].position.set(x, y, z);
        eduMeshes[i].rotation.y += 0.007;
        eduLabels[i].position.set(x, y + e.size + 1.8, z);
      }

      // ── Projects ─────────────────────────────────────────────────────
      for (let i = 0; i < PROJECT_DATA.length; i++) {
        const p = PROJECT_DATA[i];
        projAngles[i] += p.speed;
        const { x, y, z } = orbitPos(p.orbitRadius, projAngles[i], p.inc, p.rotY);
        projMeshes[i].position.set(x, y, z);
        projMeshes[i].rotation.y += 0.011;
        projLabels[i].position.set(x, y + p.size + 1.5, z);
      }

      // ── Comets ───────────────────────────────────────────────────────
      for (const comet of comets) {
        comet.t = (comet.t + comet.speed * dt) % 1;
        _cometPos.lerpVectors(comet.start, comet.end, comet.t);
        const dist = _cometPos.length();
        const alpha = 1 - Math.min(1, Math.max(0, (dist - 45) / 65));
        const vis = alpha > 0.01;
        comet.nucleus.visible = vis;
        comet.coma.visible = vis;
        comet.tail.visible = vis;
        if (vis) {
          comet.nucleus.position.copy(_cometPos);
          comet.coma.position.copy(_cometPos);
          comet.tail.position.copy(_cometPos);
          comet.coma.scale.set(6 * alpha, 6 * alpha, 1);
          (comet.tail.material as import("three").MeshBasicMaterial).opacity = 0.32 * alpha;
          (comet.nucleus.material as import("three").MeshStandardMaterial).emissiveIntensity = 5 * alpha;
        }
      }

      if (mode === "explore") controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      inputCleanup?.();
      inputCleanup = null;
      // Restore defaults for next session
      controls.enabled = true;
      camera.fov = 60;
      camera.updateProjectionMatrix();
      shipGroup.visible = false;
    };
  }

  function stopAnimation() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  function setCamMode(m: CamMode) {
    camMode = m;
    onCamModeChange?.(m);
  }

  function detach(container: HTMLElement) {
    if (container.contains(canvas)) container.removeChild(canvas);
  }

  function destroy() {
    running = false;
    cancelAnimationFrame(rafId);
    renderer.forceContextLoss();
    renderer.dispose();
  }

  return { canvas, startAnimation, stopAnimation, setCamMode, detach, destroy };
}

// ── Window-level singleton ────────────────────────────────────────────────────

type GalaxyWin = Window & {
  __galaxyScene?: SceneHandle | null;
  __galaxyBuilding?: boolean;
  __galaxyFailed?: boolean;
};

function gs(): GalaxyWin {
  return window as GalaxyWin;
}

async function getScene(): Promise<SceneHandle | null> {
  const w = gs();
  if (w.__galaxyScene) return w.__galaxyScene;
  if (w.__galaxyBuilding || w.__galaxyFailed) return null;
  w.__galaxyBuilding = true;
  try {
    w.__galaxyScene = await buildScene();
    return w.__galaxyScene;
  } catch {
    w.__galaxyFailed = true;
    return null;
  } finally {
    w.__galaxyBuilding = false;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GalaxyMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<ViewMode>("3d");
  const [selected, setSelected] = useState<AnyBody | null>(null);
  const [camMode3D, setCamMode3D] = useState<CamMode>("cockpit");
  const [ptrLocked, setPtrLocked] = useState(false);
  const [shipStats, setShipStats] = useState({ speed: 0, heading: 0, throttle: 0 });

  // Store cleanup from startAnimation so switching views properly tears down
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const show = () => {
      setVisible(true);
      setSelected(null);
      setView("3d");
    };
    const hide = () => setVisible(false);
    window.addEventListener("galaxy-mode", show);
    window.addEventListener("exit-mode", hide);
    return () => {
      window.removeEventListener("galaxy-mode", show);
      window.removeEventListener("exit-mode", hide);
    };
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    const html = document.documentElement;
    if (visible) html.style.overflow = "hidden";
    else html.style.overflow = "";
    return () => {
      html.style.overflow = "";
    };
  }, [visible]);

  // ESC: release pointer lock first, then exit galaxy on second press
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (document.pointerLockElement) return; // browser releases lock; stay in galaxy
        setVisible(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Combined effect: handles scene init, canvas attach, and view switching.
  // Both visible and view are deps so switching view restarts correctly.
  useEffect(() => {
    if (!visible || !containerRef.current) return;
    const container = containerRef.current;
    let retryId: ReturnType<typeof setTimeout> | null = null;
    let stopped = false;

    const activate = async () => {
      const s = await getScene();
      if (stopped) return;
      if (!s && gs().__galaxyBuilding) {
        retryId = setTimeout(() => {
          if (!stopped) activate().catch(console.error);
        }, 400);
        return;
      }
      if (gs().__galaxyFailed) return;
      const scene = gs().__galaxyScene;
      if (!scene || !containerRef.current) return;

      if (!container.contains(scene.canvas)) {
        scene.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
        container.appendChild(scene.canvas);
      }

      if (view === "2d") {
        scene.stopAnimation();
        return;
      }

      stopRef.current?.();
      stopRef.current = scene.startAnimation(
        setSelected,
        container,
        view === "ship"
          ? { mode: "ship", onCamMode: setCamMode3D, onPointerLock: setPtrLocked, onShipUpdate: setShipStats }
          : { mode: "explore" },
      );
    };

    activate().catch(console.error);

    return () => {
      stopped = true;
      if (retryId) clearTimeout(retryId);
      stopRef.current?.();
      stopRef.current = null;
      const scene = gs().__galaxyScene;
      if (scene) {
        scene.stopAnimation();
        if (containerRef.current) scene.detach(containerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, view]);

  // ── Info card helpers ─────────────────────────────────────────────────────
  const colorHex = selected ? selected.color.toString(16).padStart(6, "0") : "ffffff";
  const colorStr = `#${colorHex}`;

  const kindLabel =
    selected?.kind === "work"
      ? "◉ WORK EXPERIENCE"
      : selected?.kind === "education"
        ? "◯ EDUCATION"
        : selected?.kind === "project"
          ? "◆ PROJECT"
          : "";

  // ── View label for hint ───────────────────────────────────────────────────
  const hintText =
    view === "ship"
      ? camMode3D === "cockpit"
        ? "◈ COCKPIT · W/S thrust · A/D roll · Q/E up-down · mouse to steer · V for chase view ◈"
        : "◈ CHASE CAM · W/S thrust · A/D roll · mouse to steer · V for cockpit ◈"
      : view === "2d"
        ? "◈ 2D NAV · scroll or arrow keys to fly ◈"
        : "◈ GALAXY MODE · drag to explore · scroll to zoom · click to inspect ◈";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-500 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div ref={containerRef} className="absolute inset-0" />

          {/* Top hint */}
          <motion.div
            className="absolute top-5 left-0 right-0 text-center pointer-events-none select-none"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs font-mono tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.25)" }}>
              {hintText}
            </p>
          </motion.div>

          {/* Top-right controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2 flex-wrap justify-end">
            {/* 3D Explore */}
            <button
              className="text-xs font-mono px-3 py-1.5 transition-opacity hover:opacity-100"
              style={{
                border: `1px solid ${view === "3d" ? "rgba(100,180,255,0.5)" : "rgba(255,255,255,0.15)"}`,
                color: view === "3d" ? "rgba(140,200,255,0.9)" : "rgba(255,255,255,0.45)",
                backgroundColor: "rgba(0,0,20,0.65)",
                borderRadius: "4px",
                opacity: view === "3d" ? 1 : 0.7,
              }}
              onClick={() => setView("3d")}
            >
              3D explore
            </button>

            {/* Ship Nav */}
            <button
              className="text-xs font-mono px-3 py-1.5 transition-opacity hover:opacity-100"
              style={{
                border: `1px solid ${view === "ship" ? "rgba(100,200,255,0.5)" : "rgba(255,255,255,0.15)"}`,
                color: view === "ship" ? "rgba(140,220,255,0.9)" : "rgba(255,255,255,0.45)",
                backgroundColor: "rgba(0,0,20,0.65)",
                borderRadius: "4px",
                opacity: view === "ship" ? 1 : 0.7,
              }}
              onClick={() => setView("ship")}
            >
              ship nav
            </button>

            {/* 2D Nav */}
            <button
              className="text-xs font-mono px-3 py-1.5 transition-opacity hover:opacity-100"
              style={{
                border: `1px solid ${view === "2d" ? "rgba(100,180,255,0.5)" : "rgba(255,255,255,0.15)"}`,
                color: view === "2d" ? "rgba(140,200,255,0.9)" : "rgba(255,255,255,0.45)",
                backgroundColor: "rgba(0,0,20,0.65)",
                borderRadius: "4px",
                opacity: view === "2d" ? 1 : 0.7,
              }}
              onClick={() => setView("2d")}
            >
              2D nav
            </button>

            <button
              className="text-xs font-mono px-3 py-1.5 transition-opacity hover:opacity-100"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.45)",
                backgroundColor: "rgba(0,0,20,0.65)",
                borderRadius: "4px",
                opacity: 0.7,
              }}
              onClick={() => setVisible(false)}
            >
              [ESC] exit
            </button>
          </div>

          {/* ── Ship mode HUD ─────────────────────────────────────────────── */}
          {view === "ship" && (
            <>
              {/* Cockpit cam mode sub-toggle */}
              <div className="absolute top-14 right-4 z-10 flex gap-2">
                <button
                  className="text-[10px] font-mono px-2 py-1 transition-opacity hover:opacity-100"
                  style={{
                    border: `1px solid ${camMode3D === "cockpit" ? "rgba(100,200,255,0.45)" : "rgba(255,255,255,0.1)"}`,
                    color: camMode3D === "cockpit" ? "rgba(120,210,255,0.85)" : "rgba(255,255,255,0.3)",
                    backgroundColor: "rgba(0,0,20,0.55)",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    gs().__galaxyScene?.setCamMode("cockpit");
                    setCamMode3D("cockpit");
                  }}
                >
                  cockpit
                </button>
                <button
                  className="text-[10px] font-mono px-2 py-1 transition-opacity hover:opacity-100"
                  style={{
                    border: `1px solid ${camMode3D === "chase" ? "rgba(100,200,255,0.45)" : "rgba(255,255,255,0.1)"}`,
                    color: camMode3D === "chase" ? "rgba(120,210,255,0.85)" : "rgba(255,255,255,0.3)",
                    backgroundColor: "rgba(0,0,20,0.55)",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    gs().__galaxyScene?.setCamMode("chase");
                    setCamMode3D("chase");
                  }}
                >
                  chase cam
                </button>
              </div>

              {/* ── Full cockpit interior overlay ── */}
              {camMode3D === "cockpit" && (
                <div className="absolute inset-0 pointer-events-none">

                  {/* ── Canopy structural frame (SVG) ── */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                    style={{ opacity: 0.55 }}
                  >
                    {/* Left A-pillar: bottom-left → upper-center-left */}
                    <line x1="0" y1="100" x2="46" y2="10" stroke="rgba(80,130,200,0.5)" strokeWidth="0.55" />
                    {/* Right A-pillar */}
                    <line x1="100" y1="100" x2="54" y2="10" stroke="rgba(80,130,200,0.5)" strokeWidth="0.55" />
                    {/* Canopy bow (horizontal bar across top) */}
                    <line x1="46" y1="10" x2="54" y2="10" stroke="rgba(80,130,200,0.4)" strokeWidth="0.4" />
                    {/* Center spine */}
                    <line x1="50" y1="0" x2="50" y2="10" stroke="rgba(80,130,200,0.25)" strokeWidth="0.35" />
                    {/* Mid-frame cross braces */}
                    <line x1="0" y1="55" x2="12" y2="52" stroke="rgba(60,110,180,0.3)" strokeWidth="0.35" />
                    <line x1="100" y1="55" x2="88" y2="52" stroke="rgba(60,110,180,0.3)" strokeWidth="0.35" />
                    {/* Bottom side rails */}
                    <line x1="0" y1="82" x2="18" y2="80" stroke="rgba(60,110,180,0.25)" strokeWidth="0.3" />
                    <line x1="100" y1="82" x2="82" y2="80" stroke="rgba(60,110,180,0.25)" strokeWidth="0.3" />
                    {/* Subtle edge glow lines */}
                    <line x1="0" y1="0" x2="0" y2="100" stroke="rgba(40,80,160,0.2)" strokeWidth="1.2" />
                    <line x1="100" y1="0" x2="100" y2="100" stroke="rgba(40,80,160,0.2)" strokeWidth="1.2" />
                  </svg>

                  {/* ── Edge vignette (cockpit walls) ── */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 55%, rgba(4,10,28,0.72) 100%)",
                  }} />
                  {/* Side wall darkening */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to right, rgba(4,10,28,0.55) 0%, transparent 18%, transparent 82%, rgba(4,10,28,0.55) 100%)",
                  }} />

                  {/* ── Crosshair + center telemetry ── */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div style={{ position: "relative", width: 32, height: 32 }}>
                      <div style={{ position:"absolute", top:"50%", left:0, right:0, height:1, background:"rgba(100,200,255,0.45)", transform:"translateY(-50%)" }} />
                      <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:1, background:"rgba(100,200,255,0.45)", transform:"translateX(-50%)" }} />
                      <div style={{ position:"absolute", top:"50%", left:"50%", width:8, height:8, border:"1px solid rgba(100,200,255,0.55)", borderRadius:"50%", transform:"translate(-50%,-50%)" }} />
                    </div>
                    {/* Speed + heading just below reticle */}
                    <div style={{ marginTop:14, display:"flex", gap:20, fontFamily:"monospace", fontSize:10, color:"rgba(120,200,255,0.6)", letterSpacing:"0.08em" }}>
                      <span>
                        <span style={{ fontSize:8, opacity:0.5, marginRight:4 }}>VEL</span>
                        <span style={{ color:"rgba(160,230,255,0.85)", fontWeight:"bold" }}>{String(shipStats.speed).padStart(3,"0")}</span>
                        <span style={{ fontSize:8, opacity:0.45, marginLeft:2 }}>u/s</span>
                      </span>
                      <span style={{ opacity:0.3 }}>|</span>
                      <span>
                        <span style={{ fontSize:8, opacity:0.5, marginRight:4 }}>HDG</span>
                        <span style={{ color:"rgba(160,230,255,0.85)", fontWeight:"bold" }}>{String(Math.round(shipStats.heading)).padStart(3,"0")}°</span>
                      </span>
                    </div>
                  </div>

                  {/* ── Bottom instrument console ── */}
                  <div style={{
                    position:"absolute", bottom:0, left:0, right:0,
                    background:"linear-gradient(to top, rgba(3,8,22,0.97) 55%, rgba(3,8,22,0.7) 82%, transparent 100%)",
                    paddingBottom:14, paddingTop:36,
                  }}>
                    {/* Top accent line — inset from edges */}
                    <div style={{ position:"absolute", top:36, left:"12%", right:"12%", height:1, background:"linear-gradient(to right, transparent, rgba(60,120,220,0.4), transparent)" }} />

                    {/* Instrument row — 14% padding each side keeps panels away from vignette edges */}
                    <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:0, paddingLeft:"14%", paddingRight:"14%" }}>

                      {/* LEFT PANEL — throttle + engine */}
                      <div style={{ flex:1, fontFamily:"monospace", color:"rgba(100,180,255,0.8)" }}>
                        <div style={{ fontSize:8, letterSpacing:"0.2em", color:"rgba(80,140,200,0.5)", marginBottom:6 }}>THROTTLE</div>
                        <div style={{ height:5, background:"rgba(20,40,80,0.8)", borderRadius:3, marginBottom:4, overflow:"hidden", border:"1px solid rgba(40,80,160,0.3)" }}>
                          <div style={{ height:"100%", width:`${shipStats.throttle * 100}%`, background:"linear-gradient(to right, rgba(60,120,220,0.8), rgba(100,200,255,0.9))", borderRadius:3, transition:"width 0.1s" }} />
                        </div>
                        <div style={{ fontSize:10, color:"rgba(100,180,255,0.55)" }}>{Math.round(shipStats.throttle * 100)}%</div>
                        <div style={{ marginTop:8, display:"flex", gap:8 }}>
                          {["ENG-L","ENG-R"].map(l => (
                            <div key={l} style={{ fontSize:8, letterSpacing:"0.1em", color: shipStats.throttle > 0.05 ? "rgba(60,220,120,0.7)" : "rgba(80,100,140,0.5)", display:"flex", alignItems:"center", gap:4 }}>
                              <div style={{ width:5, height:5, borderRadius:"50%", background: shipStats.throttle > 0.05 ? "rgba(60,220,120,0.8)" : "rgba(60,80,120,0.5)" }} />
                              {l}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CENTER PANEL — compass + heading readout */}
                      <div style={{ flex:"0 0 200px", fontFamily:"monospace", textAlign:"center", paddingBottom:4 }}>
                        <div style={{ position:"relative", height:44, overflow:"hidden", marginBottom:6 }}>
                          <svg width="200" height="44" style={{ overflow:"visible" }}>
                            <path d="M 10 44 A 90 90 0 0 1 190 44" fill="none" stroke="rgba(40,80,160,0.3)" strokeWidth="1" />
                            {[0,30,60,90,120,150,180].map(deg => {
                              const a = ((deg - shipStats.heading + 180) * Math.PI) / 180;
                              const cx2 = 100 + 90 * Math.cos(Math.PI - a);
                              const cy2 = 44 - 90 * Math.sin(Math.PI - a);
                              const isMain = deg % 90 === 0;
                              return cy2 > 0 && cy2 < 50 ? (
                                <line key={deg} x1={cx2} y1={cy2} x2={cx2} y2={cy2 + (isMain ? 8 : 5)}
                                  stroke={isMain ? "rgba(100,180,255,0.6)" : "rgba(60,120,180,0.35)"} strokeWidth={isMain ? 1.5 : 0.8} />
                              ) : null;
                            })}
                            <line x1="100" y1="28" x2="100" y2="44" stroke="rgba(140,220,255,0.9)" strokeWidth="2" />
                            <polygon points="100,22 96,30 104,30" fill="rgba(140,220,255,0.8)" />
                          </svg>
                        </div>
                        <div style={{ fontSize:18, fontWeight:"bold", color:"rgba(160,230,255,0.95)", letterSpacing:"0.08em" }}>
                          {String(Math.round(shipStats.heading)).padStart(3,"0")}°
                        </div>
                        <div style={{ fontSize:8, letterSpacing:"0.25em", color:"rgba(80,140,200,0.45)", marginTop:2 }}>HEADING</div>
                      </div>

                      {/* RIGHT PANEL — system status */}
                      <div style={{ flex:1, fontFamily:"monospace", color:"rgba(100,180,255,0.8)", display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
                        <div style={{ fontSize:8, letterSpacing:"0.2em", color:"rgba(80,140,200,0.5)", marginBottom:6 }}>SYSTEMS</div>
                        {[
                          { label:"HULL" },
                          { label:"DRIVE" },
                          { label:"NAV" },
                          { label:"COMMS" },
                        ].map(s => (
                          <div key={s.label} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                            <span style={{ fontSize:9, letterSpacing:"0.12em", color:"rgba(80,130,180,0.6)" }}>{s.label}</span>
                            <div style={{ width:6, height:6, borderRadius:"50%", background:"rgba(60,220,120,0.8)", boxShadow:"0 0 6px rgba(60,220,120,0.5)" }} />
                          </div>
                        ))}
                        <div style={{ marginTop:4, fontSize:8, letterSpacing:"0.12em", color:"rgba(60,200,100,0.55)" }}>ALL NOMINAL</div>
                      </div>
                    </div>

                    {/* Bottom status bar — also padded 14% */}
                    <div style={{ marginTop:10, paddingLeft:"14%", paddingRight:"14%", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontSize:8, fontFamily:"monospace", color:"rgba(60,120,180,0.4)", letterSpacing:"0.12em" }}>
                        {shipStats.speed > 0 ? "THRUST" : "DRIFT"}
                      </div>
                      <div style={{ fontSize:8, fontFamily:"monospace", color:"rgba(60,120,180,0.4)", letterSpacing:"0.12em" }}>
                        {!ptrLocked ? "CLICK TO TAKE CONTROL" : "MOUSE LOCKED · ESC TO RELEASE"}
                      </div>
                      <div style={{ fontSize:8, fontFamily:"monospace", color:"rgba(60,120,180,0.4)", letterSpacing:"0.12em" }}>
                        W/S · A/D · Q/E · V
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </>
          )}

          {/* 2D navigation overlay */}
          {view === "2d" && (
            <div className="absolute inset-0 z-10">
              <Galaxy2D onClose={() => setVisible(false)} onSwitch3D={() => setView("3d")} />
            </div>
          )}

          {/* Legend (hide during ship cockpit to reduce clutter) */}
          {!(view === "ship" && camMode3D === "cockpit") && (
            <motion.div
              className="absolute bottom-5 left-5 text-xs font-mono space-y-1.5 pointer-events-none select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p style={{ color: "rgba(255,200,70,0.55)" }}>✦ sun — that&apos;s me</p>
              <p style={{ color: "rgba(100,150,255,0.5)" }}>◉ inner planets — work experience</p>
              <p style={{ color: "rgba(245,200,66,0.5)" }}>◉ gold ring — education</p>
              <p style={{ color: "rgba(200,150,255,0.45)" }}>◆ outer ring — projects</p>
              <p style={{ color: "rgba(100,120,180,0.4)" }}>◌ asteroid belt — skills &amp; languages</p>
            </motion.div>
          )}

          {/* Info card */}
          <AnimatePresence>
            {selected && (
              <motion.div
                className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-sm pointer-events-auto"
                style={{
                  backgroundColor: "rgba(0,0,22,0.93)",
                  border: `1px solid #${colorHex}44`,
                  borderRadius: "6px",
                  padding: "16px 20px",
                  boxShadow: `0 0 50px #${colorHex}1a`,
                  width: "clamp(280px, 92vw, 420px)",
                }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-[10px] tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {kindLabel}
                  </p>
                  <button
                    className="text-white/30 hover:text-white/60 text-xs ml-3 -mt-0.5"
                    onClick={() => setSelected(null)}
                  >
                    ✕
                  </button>
                </div>

                {selected.kind === "work" && (
                  <>
                    <p className="font-bold text-sm leading-tight" style={{ color: colorStr }}>
                      {selected.role}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {selected.name} · {selected.period}
                    </p>
                  </>
                )}

                {selected.kind === "education" && (
                  <>
                    <p className="font-bold text-sm leading-tight" style={{ color: colorStr }}>
                      {selected.degree}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {selected.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: `#${colorHex}99` }}>
                      {selected.honor} · {selected.period}
                    </p>
                  </>
                )}

                {selected.kind === "project" && (
                  <>
                    <p className="font-bold text-sm leading-tight" style={{ color: colorStr }}>
                      {selected.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {selected.tagline} · {selected.year}
                    </p>
                  </>
                )}

                <ul className="space-y-1 mt-3">
                  {selected.description.map((line, i) => (
                    <li key={i} className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                      <span style={{ color: `#${colorHex}77` }}>◈</span> {line}
                    </li>
                  ))}
                </ul>

                {selected.kind === "project" && (
                  <p
                    className="text-[10px] mt-3 pt-3"
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    ↗ {selected.github}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
