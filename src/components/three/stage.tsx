"use client";

import { useEffect, useRef, useState } from "react";
import type * as T from "three";

export type Three = typeof T;

export type StageCtx = {
  THREE: Three;
  scene: T.Scene;
  camera: T.PerspectiveCamera;
  renderer: T.WebGLRenderer;
  /** true when the visitor prefers reduced motion: one settled frame is drawn, no loop */
  reduce: boolean;
};

export type StageApi = {
  /** advance the scene; t is seconds since the scene was built */
  update: (t: number, dt: number) => void;
  /** horizontal field of view to hold as the panel changes shape (degrees) */
  hfov?: number;
  /** called while the visitor drags across the canvas */
  drag?: (dx: number, dy: number) => void;
};

export type Builder = (ctx: StageCtx) => StageApi;

/**
 * Hosts one three.js scene. The WebGL context exists only while the panel is near the
 * viewport: it is built on approach and fully disposed on leaving, so a long page never
 * holds more than a couple of contexts (phones cap them).
 */
export function ThreeStage({
  build,
  className = "",
  label,
  fallback,
  draggable = false,
}: {
  build: Builder;
  className?: string;
  label: string;
  /** shown instead if WebGL is unavailable */
  fallback?: React.ReactNode;
  draggable?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let gone = false;
    let visible = false;
    let starting = false;
    let teardown: (() => void) | null = null;

    const start = async () => {
      if (teardown || starting) return;
      starting = true;
      try {
        const THREE = await import("three");
        if (gone || !visible) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        const canvas = renderer.domElement;
        canvas.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity .5s ease";
        if (draggable) {
          canvas.style.touchAction = "pan-y";
          canvas.style.cursor = "grab";
        }
        host.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 400);
        const api = build({ THREE, scene, camera, renderer, reduce });

        const resize = () => {
          const w = Math.max(1, host.clientWidth);
          const h = Math.max(1, host.clientHeight);
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          if (api.hfov) {
            const half = Math.tan((api.hfov * Math.PI) / 360) / camera.aspect;
            camera.fov = Math.min(70, (Math.atan(half) * 360) / Math.PI);
          }
          camera.updateProjectionMatrix();
          if (reduce) renderer.render(scene, camera);
        };

        let raf = 0;
        let last = performance.now();
        let t = 0;
        const frame = (now: number) => {
          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          t += dt;
          api.update(t, dt);
          renderer.render(scene, camera);
          raf = requestAnimationFrame(frame);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(host);
        resize();

        if (reduce) {
          api.update(12, 0);
          renderer.render(scene, camera);
        } else {
          raf = requestAnimationFrame(frame);
        }
        requestAnimationFrame(() => (canvas.style.opacity = "1"));

        // dragging
        let px = 0;
        let py = 0;
        let down = false;
        const onDown = (e: PointerEvent) => {
          down = true;
          px = e.clientX;
          py = e.clientY;
          canvas.style.cursor = "grabbing";
        };
        const onMove = (e: PointerEvent) => {
          if (!down || !api.drag) return;
          api.drag(e.clientX - px, e.clientY - py);
          px = e.clientX;
          py = e.clientY;
          if (reduce) {
            api.update(12, 0);
            renderer.render(scene, camera);
          }
        };
        const onUp = () => {
          down = false;
          canvas.style.cursor = "grab";
        };
        if (draggable) {
          canvas.addEventListener("pointerdown", onDown);
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
          window.addEventListener("pointercancel", onUp);
        }

        const onLost = (e: Event) => {
          e.preventDefault();
          teardown?.();
        };
        canvas.addEventListener("webglcontextlost", onLost);

        teardown = () => {
          teardown = null;
          cancelAnimationFrame(raf);
          ro.disconnect();
          canvas.removeEventListener("webglcontextlost", onLost);
          canvas.removeEventListener("pointerdown", onDown);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          window.removeEventListener("pointercancel", onUp);
          scene.traverse((o) => {
            const m = o as T.Mesh;
            m.geometry?.dispose?.();
            const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
            for (const mat of mats) {
              (mat as T.MeshStandardMaterial).map?.dispose?.();
              mat.dispose();
            }
          });
          if (scene.background && "dispose" in scene.background) scene.background.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
          canvas.remove();
        };
      } catch {
        if (!gone) setFailed(true);
      } finally {
        starting = false;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else teardown?.();
      },
      { rootMargin: "350px 0px" },
    );
    io.observe(host);

    return () => {
      gone = true;
      io.disconnect();
      teardown?.();
    };
  }, [build, draggable]);

  return (
    <div ref={hostRef} className={className} role="img" aria-label={label}>
      {failed && fallback}
    </div>
  );
}
