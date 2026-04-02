"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    description: [
      "Carbon footprint tracking app for Philippine orgs",
      "Next.js 15 · React 19 · PostgreSQL · Prisma ORM",
      "EPA/IPCC AR5 emission factor calculations",
      "Automated PDF/Excel reporting with Recharts",
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
    description: [
      "Led team of 4 developers through 2 major platform versions",
      "KloudTrack IoT Platform v1→v2 on AWS infrastructure",
      "MQTT · TLS · Socket.IO · WebSocket · React 19",
      "90%+ LRU cache hit rate, <100ms MQTT latency",
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
    description: [
      "Zendesk integration for Polyglot translation platform",
      "OAuth 2.0 · Azure AD B2C · SignalR · WebSocket",
      "TypeScript DDD migration · 18-state Shopee FSM",
      "AWS Lambda for MediGuide insurance policy API",
      "Python CLI: 10K+ tickets migrated, zero data loss",
    ],
  },
];

const SKILLS = [
  "TypeScript", "JavaScript", "Python", "Go", "C#",
  "React", "Next.js", "Node.js", "NestJS", "FastAPI",
  "PostgreSQL", "MongoDB", "Redis", "Supabase",
  "Docker", "AWS", "GitHub Actions", "Prisma",
];

type PlanetData = typeof PLANET_DATA[0];

// Stored outside the component so it survives StrictMode double-invocation
// and open/close cycles without recreating the WebGL context.
type SceneHandle = {
  canvas: HTMLCanvasElement;
  startAnimation: (
    onSelect: (p: PlanetData | null) => void,
    container: HTMLElement,
  ) => void;
  stopAnimation: () => void;
  detach: (container: HTMLElement) => void;
  destroy: () => void;
};

async function buildScene(): Promise<SceneHandle> {
  const THREE = await import("three");
  const { OrbitControls } = await import(
    "three/examples/jsm/controls/OrbitControls.js"
  );

  // ── Renderer (created once, never recreated) ────────────────────────────
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
  scene.fog = new THREE.FogExp2(0x00000c, 0.003);

  // ── Camera ─────────────────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 800);
  camera.position.set(0, 35, 70);

  // ── Controls ───────────────────────────────────────────────────────────
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 12;
  controls.maxDistance = 150;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;

  // ── Sprite helper ──────────────────────────────────────────────────────
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

  // ── Stars ──────────────────────────────────────────────────────────────
  {
    const count = 12000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 900;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 900;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 900;
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
    const s = 90 + Math.random() * 100;
    sprite.scale.set(s, s, 1);
    sprite.position.set((Math.random()-.5)*250, (Math.random()-.5)*100, (Math.random()-.5)*250);
    scene.add(sprite);
  }

  // ── Lighting ───────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x111133, 2.5));
  scene.add(new THREE.PointLight(0xffcc44, 10, 350));

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

  // ── Planets ────────────────────────────────────────────────────────────
  const planetMeshes: InstanceType<typeof THREE.Mesh>[] = [];
  const planetAngles = PLANET_DATA.map(() => Math.random() * Math.PI * 2);
  const planetLabels: InstanceType<typeof THREE.Sprite>[] = [];

  for (let i = 0; i < PLANET_DATA.length; i++) {
    const p = PLANET_DATA[i];
    const hexStr = "#" + p.color.toString(16).padStart(6, "0");
    scene.add(new THREE.Mesh(
      new THREE.TorusGeometry(p.orbitRadius, 0.06, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0x223344, transparent: true, opacity: 0.45 }),
    ));
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(p.size, 32, 32),
      new THREE.MeshStandardMaterial({ color: p.color, emissive: p.emissive, emissiveIntensity: 0.4, roughness: 0.65, metalness: 0.1 }),
    );
    mesh.userData = { planetIndex: i };
    planetMeshes.push(mesh);
    scene.add(mesh);
    const label = makeSprite(p.name, hexStr, 18, 0.9);
    planetLabels.push(label);
    scene.add(label);
  }

  // ── Asteroid belt ──────────────────────────────────────────────────────
  type AsteroidDatum = {
    mesh: InstanceType<typeof THREE.Mesh>;
    label: InstanceType<typeof THREE.Sprite> | null;
    angle: number; radius: number; speed: number; y: number;
  };
  const asteroids: AsteroidDatum[] = [];
  for (let i = 0; i < SKILLS.length * 5; i++) {
    const angle = (i / (SKILLS.length * 5)) * Math.PI * 2 + Math.random() * 0.4;
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

  // ── Raycaster ──────────────────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // ── Animation state ────────────────────────────────────────────────────
  let rafId = 0;
  let running = false;

  function startAnimation(
    onSelect: (p: PlanetData | null) => void,
    container: HTMLElement,
  ) {
    // Resize canvas to container
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // Pointer events for planet selection
    let pointerDownAt = { x: 0, y: 0 };
    const onPointerDown = (e: PointerEvent) => { pointerDownAt = { x: e.clientX, y: e.clientY }; };
    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - pointerDownAt.x, dy = e.clientY - pointerDownAt.y;
      if (dx*dx + dy*dy > 25) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(planetMeshes);
      if (hits.length > 0) {
        const idx = (hits[0].object as InstanceType<typeof THREE.Mesh>).userData.planetIndex as number;
        onSelect(PLANET_DATA[idx]);
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
        const x = Math.cos(planetAngles[i]) * p.orbitRadius;
        const z = Math.sin(planetAngles[i]) * p.orbitRadius;
        const y = Math.sin(planetAngles[i] * 0.5) * 0.8;
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
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    // Return cleanup for pointer/resize listeners
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

// Window-level singleton — survives both React StrictMode double-invocation
// AND webpack/Next.js HMR module re-evaluation (module-level vars reset on
// each hot reload, leaking the old WebGL context; window does not reset).
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
    w.__galaxyFailed = true; // don't retry after a driver failure
    return null;
  } finally {
    w.__galaxyBuilding = false;
  }
}

export function GalaxyMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<PlanetData | null>(null);

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setVisible(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Start/stop animation on visibility change
  useEffect(() => {
    if (!visible || !containerRef.current) return;

    const container = containerRef.current;
    let stopListeners: (() => void) | null = null;
    let retryId: ReturnType<typeof setTimeout> | null = null;

    const activate = async () => {
      let s = await getScene();

      // If a build was in flight when we called, wait and retry once
      if (!s && gs().__galaxyBuilding) {
        retryId = setTimeout(() => { activate().catch(console.error); }, 400);
        return;
      }

      // If the driver failed, nothing we can do — silently bail
      if (gs().__galaxyFailed) return;

      s = gs().__galaxyScene ?? null; // re-read after potential await
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

  // No per-instance destroy — module singleton lives for the page session.
  // (_scene is cleaned up when the page navigates away.)
  useEffect(() => {
    return () => {
      // intentionally empty — singleton manages its own lifetime
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div ref={containerRef} className="absolute inset-0" />

          <motion.div
            className="absolute top-5 left-0 right-0 text-center pointer-events-none select-none"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs font-mono tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.25)" }}>
              ◈ GALAXY MODE · drag to explore · scroll to zoom · click planets ◈
            </p>
          </motion.div>

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

          <motion.div
            className="absolute bottom-5 left-5 text-xs font-mono space-y-1.5 pointer-events-none select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p style={{ color: "rgba(255,200,70,0.55)" }}>✦ sun — that&apos;s me</p>
            <p style={{ color: "rgba(100,150,255,0.5)" }}>◉ planets — work experience</p>
            <p style={{ color: "rgba(100,120,180,0.4)" }}>◌ asteroids — skills &amp; languages</p>
          </motion.div>

          <AnimatePresence>
            {selected && (
              <motion.div
                className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-sm w-90 pointer-events-auto"
                style={{
                  backgroundColor: "rgba(0,0,22,0.93)",
                  border: `1px solid #${selected.color.toString(16).padStart(6, "0")}44`,
                  borderRadius: "6px",
                  padding: "16px 20px",
                  boxShadow: `0 0 50px #${selected.color.toString(16).padStart(6, "0")}1a`,
                }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-sm" style={{ color: `#${selected.color.toString(16).padStart(6, "0")}` }}>
                      {selected.role}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {selected.name} · {selected.period}
                    </p>
                  </div>
                  <button className="text-white/30 hover:text-white/60 text-xs ml-3 mt-0.5" onClick={() => setSelected(null)}>
                    ✕
                  </button>
                </div>
                <ul className="space-y-1 mt-3">
                  {selected.description.map((line, i) => (
                    <li key={i} className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                      <span style={{ color: `#${selected.color.toString(16).padStart(6, "0")}77` }}>◈</span> {line}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
