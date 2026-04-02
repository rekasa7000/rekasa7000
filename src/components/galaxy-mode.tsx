"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Work Experience ───────────────────────────────────────────────────────────

const PLANET_DATA = [
  {
    id: "kloudtech-intern",
    name: "Kloudtech Corp",
    role: "Software Engineering Intern",
    period: "Oct 2023 – Jun 2024",
    color: 0x8fbc5a,
    emissive: 0x3a6010,
    size: 1.2,
    orbitRadius: 10,
    speed: 0.005,
    inc: 0.18,   // inclination (radians)
    rotY: 0.0,   // orbit plane rotation around Y
    kind: "work" as const,
    description: [
      "Gained hands-on IoT & cybersecurity experience",
      "Enhanced and maintained company web application",
      "Optimized existing codebase",
    ],
  },
  {
    id: "revearth",
    name: "RevEarth",
    role: "Full-Stack Developer (Freelance)",
    period: "Aug 2025 – Dec 2025",
    color: 0x4ae27a,
    emissive: 0x1a7030,
    size: 1.6,
    orbitRadius: 16,
    speed: 0.003,
    inc: 0.22,
    rotY: 0.9,
    kind: "work" as const,
    description: [
      "Carbon footprint tracking app for Philippine orgs",
      "Next.js 15 · React 19 · PostgreSQL · Prisma ORM",
      "EPA / IPCC AR5 emission factor calculations",
      "Automated PDF & Excel reporting with Recharts",
    ],
  },
  {
    id: "kloudtech-swe",
    name: "Kloudtech Corp",
    role: "Software Engineer",
    period: "Jun 2024 – Present",
    color: 0x4a90e2,
    emissive: 0x183060,
    size: 2.0,
    orbitRadius: 24,
    speed: 0.002,
    inc: 0.12,
    rotY: 1.8,
    kind: "work" as const,
    description: [
      "Led team of 4 developers through 2 major platform versions",
      "KloudTrack IoT Platform v1→v2 on AWS infrastructure",
      "MQTT · TLS · Socket.IO · WebSocket · React 19",
      "90%+ LRU cache hit rate, <100ms MQTT latency",
      "25+ weather stations, 4 station types, multi-tenant SaaS",
    ],
  },
  {
    id: "concentrix",
    name: "Concentrix",
    role: "Software Developer",
    period: "Aug 2025 – Present",
    color: 0xe2a84a,
    emissive: 0x704010,
    size: 2.4,
    orbitRadius: 33,
    speed: 0.0015,
    inc: 0.28,
    rotY: 0.5,
    kind: "work" as const,
    description: [
      "Zendesk integration for Polyglot translation platform",
      "OAuth 2.0 · Azure AD B2C · SignalR · WebSocket",
      "TypeScript DDD migration · 18-state Shopee FSM",
      "AWS Lambda for MediGuide insurance policy API",
      "Python CLI: 10K+ tickets migrated, zero data loss",
    ],
  },
];

// ── Education ─────────────────────────────────────────────────────────────────

const EDUCATION_DATA = [
  {
    id: "bpsu",
    name: "Bataan Peninsula State University",
    short: "BPSU",
    degree: "BS Computer Science",
    honor: "Cum Laude",
    period: "2020 – 2024",
    color: 0xf5c842,
    emissive: 0x7a5800,
    size: 1.9,
    orbitRadius: 44,
    speed: 0.0011,
    inc: 0.48,
    rotY: 1.2,
    kind: "education" as const,
    description: [
      "Bachelor of Science in Computer Science",
      "Graduated Cum Laude",
      "Specialization: Software Engineering, Algorithms & System Design",
      "Strong foundation in programming, database management & methodology",
    ],
  },
  {
    id: "microcity",
    name: "Microcity College of Business & Technology",
    short: "Microcity",
    degree: "STEM",
    honor: "With Honor",
    period: "2018 – 2020",
    color: 0xe8a87c,
    emissive: 0x703010,
    size: 1.2,
    orbitRadius: 52,
    speed: 0.0009,
    inc: 0.38,
    rotY: 2.8,
    kind: "education" as const,
    description: [
      "Science, Technology, Engineering and Mathematics",
      "Graduated with Honor",
      "Focus: Mathematics, Science & Technology fundamentals",
    ],
  },
];

// ── Projects ──────────────────────────────────────────────────────────────────

const PROJECT_DATA = [
  {
    id: "kloudtrack",
    name: "KloudTrack",
    tagline: "Weather monitoring system",
    year: "2024",
    color: 0x4fc3f7,
    emissive: 0x0d4a70,
    size: 1.0,
    orbitRadius: 63,
    speed: 0.0008,
    inc: 0.32,
    rotY: 0.6,
    kind: "project" as const,
    github: "github.com/rekasa7000/kloudtrack",
    description: [
      "Real-time weather data from IoT hardware stations",
      "Web dashboard for DRRM government officials & citizens",
      "React · TypeScript · Node.js · PostgreSQL · AWS",
    ],
  },
  {
    id: "logcha",
    name: "Logcha",
    tagline: "Time tracking for interns",
    year: "2024",
    color: 0x80cbc4,
    emissive: 0x1a5a55,
    size: 0.85,
    orbitRadius: 69,
    speed: 0.00075,
    inc: 0.58,
    rotY: 2.2,
    kind: "project" as const,
    github: "github.com/rekasa7000/logcha",
    description: [
      "Simple and modern time tracking app for interns & OJTs",
      "React · TypeScript · TanStack · Go · Fiber",
    ],
  },
  {
    id: "jobowl",
    name: "Jobowl",
    tagline: "Desktop job application tracker",
    year: "2024",
    color: 0xef9a9a,
    emissive: 0x6a1010,
    size: 0.85,
    orbitRadius: 75,
    speed: 0.0007,
    inc: 0.44,
    rotY: 1.4,
    kind: "project" as const,
    github: "github.com/rekasa7000/jobowl",
    description: [
      "Desktop job tracker with intuitive GUI for GNOME",
      "Track applications, manage statuses & search progress",
      "Rust · GTK4",
    ],
  },
  {
    id: "hananai",
    name: "HananAI",
    tagline: "AI breakfast companion",
    year: "2024",
    color: 0xf48fb1,
    emissive: 0x6a1040,
    size: 0.9,
    orbitRadius: 80,
    speed: 0.00065,
    inc: 0.70,
    rotY: 3.0,
    kind: "project" as const,
    github: "github.com/rekasa7000/hananai",
    description: [
      "AI agent inspired by Hanan, Tagalog goddess of morning",
      "Conversational breakfast companion",
      "Python · Google Gemini",
    ],
  },
  {
    id: "databox",
    name: "Databox",
    tagline: "Student scheduler & tracker",
    year: "2023",
    color: 0xce93d8,
    emissive: 0x4a0070,
    size: 0.8,
    orbitRadius: 85,
    speed: 0.0006,
    inc: 0.36,
    rotY: 2.5,
    kind: "project" as const,
    github: "github.com/rekasa7000/databox",
    description: [
      "Student scheduler & progress tracker",
      "Background real-time notifications & alerts",
      "C# · .NET · MySQL · Apache",
    ],
  },
  {
    id: "knowt",
    name: "Knowt",
    tagline: "AI article summarization",
    year: "2023",
    color: 0x90caf9,
    emissive: 0x0d2c6a,
    size: 0.8,
    orbitRadius: 90,
    speed: 0.00055,
    inc: 0.55,
    rotY: 0.2,
    kind: "project" as const,
    github: "github.com/rekasa7000/knowt",
    description: [
      "Advanced article summarization with AI sentiment analysis",
      "Secure content processing & management",
      "Python · Flask · Firebase",
    ],
  },
];

// ── Skills asteroid belt ───────────────────────────────────────────────────────

const SKILLS = [
  // Languages
  "TypeScript", "JavaScript", "Python", "Go", "C#", "Rust", "PHP", "Java",
  // Frontend
  "React", "Next.js", "Vue.js", "Tailwind CSS", "Angular", "Svelte",
  // Backend
  "Node.js", "NestJS", "FastAPI", "Flask", "Gin", "Express",
  // Database
  "PostgreSQL", "MongoDB", "MySQL", "Redis", "Prisma", "Firebase", "Supabase",
  // Cloud & DevOps
  "AWS", "Docker", "GitHub Actions", "Vercel",
  // Tools
  "Figma", "Git",
];

// ── Types ─────────────────────────────────────────────────────────────────────

type WorkBody     = typeof PLANET_DATA[0];
type EduBody      = typeof EDUCATION_DATA[0];
type ProjectBody  = typeof PROJECT_DATA[0];
type AnyBody      = WorkBody | EduBody | ProjectBody;

type SceneHandle = {
  canvas: HTMLCanvasElement;
  startAnimation: (onSelect: (b: AnyBody | null) => void, container: HTMLElement) => void;
  stopAnimation: () => void;
  detach: (container: HTMLElement) => void;
  destroy: () => void;
};

// ── Orbit position helper ─────────────────────────────────────────────────────
// Computes 3D position for a body on an inclined orbit.
// inc  = inclination (0 = flat XZ plane, π/2 = fully vertical)
// rotY = longitude of ascending node (rotation of orbit plane around Y)
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
  const { OrbitControls } = await import(
    "three/examples/jsm/controls/OrbitControls.js"
  );

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

  // ── Controls ───────────────────────────────────────────────────────────
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
    cv.width = 320; cv.height = 80;
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
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }),
    );
    sprite.scale.set(5 * scaleMult, 1.25 * scaleMult, 1);
    return sprite;
  }

  // Orbit ring with matching inclination/orientation to the orbit path.
  // ring.rotation.x = π/2 - inc  →  ring lying flat at inc=0, more upright as inc grows
  // ring.rotation.y = rotY        →  rotates the orbit plane around Y
  function makeOrbitRing(radius: number, color: number, opacity: number, inc = 0, rotY = 0) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.06, 8, 160),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity }),
    );
    ring.rotation.x = Math.PI / 2 - inc;
    ring.rotation.y = rotY;
    return ring;
  }

  // ── Stars ──────────────────────────────────────────────────────────────
  {
    const count = 14000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 1100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1100;
      const r = Math.random();
      if (r < 0.15)     { col[i*3]=0.6; col[i*3+1]=0.7; col[i*3+2]=1;   }
      else if (r < 0.3) { col[i*3]=1;   col[i*3+1]=0.9; col[i*3+2]=0.5; }
      else              { col[i*3]=1;   col[i*3+1]=1;   col[i*3+2]=1;   }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.22, sizeAttenuation: true, vertexColors: true,
      transparent: true, opacity: 0.85,
    })));
  }

  // ── Nebula clouds ──────────────────────────────────────────────────────
  const nebulaConfigs = [
    { r: 30, g: 10, b: 80 }, { r: 10, g: 20, b: 60 },
    { r: 50, g: 5,  b: 40 }, { r: 5,  g: 40, b: 30 },
    { r: 20, g: 5,  b: 60 }, { r: 60, g: 10, b: 20 },
    { r: 10, g: 30, b: 50 }, { r: 40, g: 15, b: 60 },
    { r: 15, g: 50, b: 20 }, { r: 35, g: 8,  b: 55 },
  ];
  for (const nc of nebulaConfigs) {
    const cv = document.createElement("canvas"); cv.width = 128; cv.height = 128;
    const ctx = cv.getContext("2d")!;
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, `rgba(${nc.r},${nc.g},${nc.b},0.3)`);
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 128, 128);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(cv), transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    const s = 100 + Math.random() * 130;
    sprite.scale.set(s, s, 1);
    sprite.position.set((Math.random()-.5)*350, (Math.random()-.5)*130, (Math.random()-.5)*350);
    scene.add(sprite);
  }

  // ── Lighting ───────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x111133, 2.5));
  scene.add(new THREE.PointLight(0xffcc44, 12, 500));

  // ── Sun ────────────────────────────────────────────────────────────────
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(4, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xffee44, emissive: 0xffaa00, emissiveIntensity: 2.2, roughness: 0.1 }),
  );
  scene.add(sun);

  const sgCv = document.createElement("canvas"); sgCv.width = 128; sgCv.height = 128;
  const sgCtx = sgCv.getContext("2d")!;
  const sgGrd = sgCtx.createRadialGradient(64,64,0,64,64,64);
  sgGrd.addColorStop(0, "rgba(255,200,50,0.7)");
  sgGrd.addColorStop(0.35, "rgba(255,140,20,0.3)");
  sgGrd.addColorStop(1, "rgba(255,60,0,0)");
  sgCtx.fillStyle = sgGrd; sgCtx.fillRect(0,0,128,128);
  const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(sgCv), transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  sunGlow.scale.set(22, 22, 1);
  scene.add(sunGlow);

  const sunLabel = makeSprite("✦ REGEE", "#ffcc44", 26, 1.15);
  sunLabel.position.set(0, 7.5, 0);
  scene.add(sunLabel);

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
      new THREE.MeshStandardMaterial({ color: p.color, emissive: p.emissive, emissiveIntensity: 0.4, roughness: 0.65, metalness: 0.1 }),
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
    angle: number; radius: number; speed: number; y: number;
  };
  const asteroids: AsteroidDatum[] = [];
  const ASTEROID_COUNT = SKILLS.length * 4;
  for (let i = 0; i < ASTEROID_COUNT; i++) {
    const angle = (i / ASTEROID_COUNT) * Math.PI * 2 + Math.random() * 0.5;
    const radius = 19.5 + (Math.random() - 0.5) * 5;
    const y = (Math.random() - 0.5) * 2;
    const mesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.1 + Math.random() * 0.22, 0),
      new THREE.MeshStandardMaterial({ color: 0x6677aa, roughness: 0.9, metalness: 0.15 }),
    );
    mesh.position.set(Math.cos(angle)*radius, y, Math.sin(angle)*radius);
    mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
    scene.add(mesh);
    let label: InstanceType<typeof THREE.Sprite> | null = null;
    if (i < SKILLS.length) { label = makeSprite(SKILLS[i], "#7799cc", 16, 0.65); scene.add(label); }
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
      new THREE.MeshStandardMaterial({ color: e.color, emissive: e.emissive, emissiveIntensity: 0.5, roughness: 0.55, metalness: 0.2 }),
    );
    mesh.userData = { bodyKind: "education", bodyIndex: i };
    eduMeshes.push(mesh);
    scene.add(mesh);

    // Saturn-style ring for BPSU (Cum Laude honor)
    if (e.id === "bpsu") {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(e.size + 1.4, 0.28, 4, 80),
        new THREE.MeshBasicMaterial({ color: 0xf5c842, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
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
      new THREE.MeshStandardMaterial({ color: p.color, emissive: p.emissive, emissiveIntensity: 0.55, roughness: 0.6, metalness: 0.15 }),
    );
    mesh.userData = { bodyKind: "project", bodyIndex: i };
    projMeshes.push(mesh);
    scene.add(mesh);
    const label = makeSprite(p.name, hexStr, 16, 0.8);
    projLabels.push(label);
    scene.add(label);
  }

  // ── Raycaster ──────────────────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const clickableMeshes = [...planetMeshes, ...eduMeshes, ...projMeshes];

  // ── Animation state ────────────────────────────────────────────────────
  let rafId = 0;
  let running = false;

  function startAnimation(
    onSelect: (b: AnyBody | null) => void,
    container: HTMLElement,
  ) {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    let pointerDownAt = { x: 0, y: 0 };
    const onPointerDown = (e: PointerEvent) => { pointerDownAt = { x: e.clientX, y: e.clientY }; };
    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - pointerDownAt.x, dy = e.clientY - pointerDownAt.y;
      if (dx*dx + dy*dy > 25) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(clickableMeshes);
      if (hits.length > 0) {
        const { bodyKind, bodyIndex } = (hits[0].object as InstanceType<typeof THREE.Mesh>).userData as { bodyKind: string; bodyIndex: number };
        let body: AnyBody | null = null;
        if (bodyKind === "work")           body = PLANET_DATA[bodyIndex];
        else if (bodyKind === "education") body = EDUCATION_DATA[bodyIndex];
        else if (bodyKind === "project")   body = PROJECT_DATA[bodyIndex];
        onSelect(body);
        controls.autoRotate = false;
      } else {
        onSelect(null);
        controls.autoRotate = true;
      }
    };
    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    window.addEventListener("resize", onResize);

    running = true;
    const tick = () => {
      if (!running) return;
      rafId = requestAnimationFrame(tick);
      const now = Date.now() * 0.001;

      sun.rotation.y += 0.004;
      const pulse = 1 + Math.sin(now * 1.8) * 0.06;
      sunGlow.scale.set(22 * pulse, 22 * pulse, 1);

      for (let i = 0; i < PLANET_DATA.length; i++) {
        const p = PLANET_DATA[i];
        planetAngles[i] += p.speed;
        const { x, y, z } = orbitPos(p.orbitRadius, planetAngles[i], p.inc, p.rotY);
        planetMeshes[i].position.set(x, y, z);
        planetMeshes[i].rotation.y += 0.009;
        planetLabels[i].position.set(x, y + p.size + 1.6, z);
      }

      for (const a of asteroids) {
        a.angle += a.speed;
        const x = Math.cos(a.angle) * a.radius, z = Math.sin(a.angle) * a.radius;
        a.mesh.position.set(x, a.y, z);
        a.mesh.rotation.x += 0.018; a.mesh.rotation.y += 0.013;
        if (a.label) a.label.position.set(x, a.y + 0.9, z);
      }

      for (let i = 0; i < EDUCATION_DATA.length; i++) {
        const e = EDUCATION_DATA[i];
        eduAngles[i] += e.speed;
        const { x, y, z } = orbitPos(e.orbitRadius, eduAngles[i], e.inc, e.rotY);
        eduMeshes[i].position.set(x, y, z);
        eduMeshes[i].rotation.y += 0.007;
        eduLabels[i].position.set(x, y + e.size + 1.8, z);
      }

      for (let i = 0; i < PROJECT_DATA.length; i++) {
        const p = PROJECT_DATA[i];
        projAngles[i] += p.speed;
        const { x, y, z } = orbitPos(p.orbitRadius, projAngles[i], p.inc, p.rotY);
        projMeshes[i].position.set(x, y, z);
        projMeshes[i].rotation.y += 0.011;
        projLabels[i].position.set(x, y + p.size + 1.5, z);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", onResize);
    };
  }

  function stopAnimation() {
    running = false;
    cancelAnimationFrame(rafId);
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

  return { canvas, startAnimation, stopAnimation, detach, destroy };
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
  const [selected, setSelected] = useState<AnyBody | null>(null);

  useEffect(() => {
    const show = () => { setVisible(true); setSelected(null); };
    const hide = () => setVisible(false);
    window.addEventListener("galaxy-mode", show);
    window.addEventListener("exit-mode", hide);
    return () => {
      window.removeEventListener("galaxy-mode", show);
      window.removeEventListener("exit-mode", hide);
    };
  }, []);

  // Lock body scroll while galaxy is open so no scrollbar appears
  useEffect(() => {
    const html = document.documentElement;
    if (visible) {
      html.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
    }
    return () => { html.style.overflow = ""; };
  }, [visible]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setVisible(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!visible || !containerRef.current) return;

    const container = containerRef.current;
    let stopListeners: (() => void) | null = null;
    let retryId: ReturnType<typeof setTimeout> | null = null;

    const activate = async () => {
      let s = await getScene();

      if (!s && gs().__galaxyBuilding) {
        retryId = setTimeout(() => { activate().catch(console.error); }, 400);
        return;
      }
      if (gs().__galaxyFailed) return;

      s = gs().__galaxyScene ?? null;
      if (!s || !containerRef.current) return;

      if (!container.contains(s.canvas)) {
        s.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
        container.appendChild(s.canvas);
      }

      stopListeners = s.startAnimation(setSelected, container) ?? null;
    };

    activate().catch(console.error);

    return () => {
      if (retryId) clearTimeout(retryId);
      stopListeners?.();
      gs().__galaxyScene?.stopAnimation();
      if (containerRef.current) gs().__galaxyScene?.detach(containerRef.current);
    };
  }, [visible]);

  useEffect(() => {
    return () => { /* singleton manages its own lifetime */ };
  }, []);

  // ── Info card helpers ───────────────────────────────────────────────────
  const colorHex = selected ? selected.color.toString(16).padStart(6, "0") : "ffffff";
  const colorStr = `#${colorHex}`;

  const kindLabel =
    selected?.kind === "work"      ? "◉ WORK EXPERIENCE" :
    selected?.kind === "education" ? "◯ EDUCATION"       :
    selected?.kind === "project"   ? "◆ PROJECT"         : "";

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
              ◈ GALAXY MODE · drag to explore · scroll to zoom · click to inspect ◈
            </p>
          </motion.div>

          {/* Exit button */}
          <button
            className="absolute top-4 right-4 z-10 text-xs font-mono px-3 py-1.5 transition-opacity hover:opacity-100"
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

          {/* Legend */}
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
