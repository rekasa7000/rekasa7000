"use client";

import { useEffect, useRef, useState } from "react";
import type * as T from "three";
import type { Builder, StageApi, Three } from "./stage";

/*
 * Small 3D illustrations (project covers, pots, emblems) all draw through ONE WebGL
 * context. Each one owns a plain 2D canvas; a single hidden renderer draws every visible
 * scene in turn and copies the pixels across. A page can show a dozen of them without
 * coming near a phone's limit on WebGL contexts.
 */

type Item = {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  build: Builder;
  scene?: T.Scene;
  camera?: T.PerspectiveCamera;
  api?: StageApi;
  visible: boolean;
  dirty: boolean;
  t: number;
};

const SIZE = 768; // the shared drawing buffer, in device pixels
const FRAME_MS = 30; // ~30fps is plenty for gentle sway and saves battery

const items = new Set<Item>();
const failListeners = new Set<() => void>();
let THREE: Three | null = null;
let renderer: T.WebGLRenderer | null = null;
let loading = false;
let failed = false;
let raf = 0;
let last = 0;
let reduce = false;

function disposeScene(it: Item) {
  it.scene?.traverse((o) => {
    const m = o as T.Mesh;
    m.geometry?.dispose?.();
    const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
    for (const mat of mats) {
      (mat as T.MeshStandardMaterial).map?.dispose?.();
      mat.dispose();
    }
  });
  if (it.scene?.background && "dispose" in it.scene.background) it.scene.background.dispose();
  it.scene = undefined;
  it.camera = undefined;
  it.api = undefined;
}

function fail() {
  failed = true;
  for (const f of failListeners) f();
}

function ensureRenderer() {
  if (renderer || loading || failed) return;
  loading = true;
  import("three")
    .then((mod) => {
      THREE = mod;
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const r = new mod.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      r.setPixelRatio(1);
      r.setSize(SIZE, SIZE, false);
      r.setScissorTest(true);
      r.domElement.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        renderer = null;
        for (const it of items) {
          it.scene = undefined;
          it.api = undefined;
          it.dirty = true;
        }
        ensureRenderer();
      });
      renderer = r;
    })
    .catch(fail)
    .finally(() => {
      loading = false;
      kick();
    });
}

function kick() {
  if (!raf && renderer) raf = requestAnimationFrame(frame);
}

function frame(now: number) {
  raf = 0;
  if (!renderer || !THREE) return;
  if (now - last < FRAME_MS) {
    raf = requestAnimationFrame(frame);
    return;
  }
  const dt = Math.min(0.06, (now - last) / 1000);
  last = now;

  let animating = false;
  for (const it of items) {
    if (!it.visible) continue;
    const w = it.el.width;
    const h = it.el.height;
    if (!w || !h) continue;
    try {
      if (!it.scene) {
        it.scene = new THREE.Scene();
        it.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 400);
        it.api = it.build({ THREE, scene: it.scene, camera: it.camera, renderer, reduce });
        it.t = 0;
        it.dirty = true;
      }
      if (reduce) {
        if (!it.dirty) continue;
        it.api!.update(12, 0);
      } else {
        it.t += dt;
        it.api!.update(it.t, dt);
        animating = true;
      }
      const k = Math.min(1, SIZE / Math.max(w, h));
      const rw = Math.max(1, Math.floor(w * k));
      const rh = Math.max(1, Math.floor(h * k));
      const cam = it.camera!;
      cam.aspect = rw / rh;
      if (it.api!.hfov)
        cam.fov = Math.min(70, (Math.atan(Math.tan((it.api!.hfov * Math.PI) / 360) / cam.aspect) * 360) / Math.PI);
      cam.updateProjectionMatrix();
      renderer.setViewport(0, 0, rw, rh);
      renderer.setScissor(0, 0, rw, rh);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(it.scene, cam);
      it.ctx.clearRect(0, 0, w, h);
      it.ctx.drawImage(renderer.domElement, 0, SIZE - rh, rw, rh, 0, 0, w, h);
      it.dirty = false;
    } catch {
      fail();
      return;
    }
  }
  if (animating) raf = requestAnimationFrame(frame);
}

function register(it: Item) {
  items.add(it);
  ensureRenderer();
  kick();
}

function unregister(it: Item) {
  items.delete(it);
  disposeScene(it);
  if (items.size === 0 && renderer) {
    cancelAnimationFrame(raf);
    raf = 0;
    renderer.dispose();
    renderer.forceContextLoss();
    renderer = null;
  }
}

/** One small 3D illustration, drawn through the shared renderer. */
export function SharedStage({
  build,
  className = "",
  label,
  fallback,
}: {
  build: Builder;
  className?: string;
  label?: string;
  fallback?: React.ReactNode;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    const item: Item = { el, ctx, build, visible: false, dirty: true, t: 0 };
    const onFail = () => setBroken(true);
    failListeners.add(onFail);
    if (failed) onFail();

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(el.clientWidth * dpr);
      const h = Math.round(el.clientHeight * dpr);
      if (w && h && (el.width !== w || el.height !== h)) {
        el.width = w;
        el.height = h;
        item.dirty = true;
        kick();
      }
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();

    const io = new IntersectionObserver(
      ([entry]) => {
        item.visible = entry.isIntersecting;
        if (item.visible) {
          item.dirty = true;
          kick();
        }
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(el);
    register(item);

    return () => {
      failListeners.delete(onFail);
      ro.disconnect();
      io.disconnect();
      unregister(item);
    };
  }, [build]);

  if (broken && fallback) return <>{fallback}</>;
  return (
    <canvas
      ref={ref}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
