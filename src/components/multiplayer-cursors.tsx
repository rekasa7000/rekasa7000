"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const CURSOR_COLORS = [
  "#4a90e2", "#e24a4a", "#e2a84a", "#4ae27a",
  "#a84ae2", "#4ae2d4", "#e24aa8", "#e2e24a",
];

function shortId() {
  return Math.random().toString(36).slice(2, 7);
}

interface CursorState {
  id: string;
  tx: number; // target x
  ty: number; // target y
  x: number;  // displayed x (lerped)
  y: number;  // displayed y (lerped)
  color: string;
  label: string;
  el: HTMLDivElement | null;
  updatedAt: number;
}

export function MultiplayerCursors() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const myId = shortId();
    const myColor = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
    const myLabel = `visitor_${myId}`;

    // Track remote cursors purely in a ref — no React state, no re-renders
    const cursors: Record<string, CursorState> = {};
    let rafId = 0;
    let lastSent = 0;

    // ── Lerp loop ──────────────────────────────────────────────────────────
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const now = Date.now();
      for (const _id in cursors) {
        const c = cursors[_id];
        // Prune stale
        if (now - c.updatedAt > 5000) {
          c.el?.remove();
          delete cursors[_id];
          continue;
        }
        // Smooth lerp toward target
        c.x = lerp(c.x, c.tx, 0.18);
        c.y = lerp(c.y, c.ty, 0.18);
        if (c.el) {
          c.el.style.transform = `translate(${c.x}px, ${c.y}px)`;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // ── DOM helpers ────────────────────────────────────────────────────────
    function createCursorEl(_id: string, color: string, label: string): HTMLDivElement {
      const wrap = document.createElement("div");
      wrap.style.cssText = `
        position: fixed; top: 0; left: 0;
        pointer-events: none; z-index: 300; will-change: transform;
      `;

      wrap.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 2L14 8L9 9.5L7 15L2 2Z"
            fill="${color}" stroke="rgba(0,0,0,0.5)" stroke-width="1"/>
        </svg>
        <div style="
          position:absolute; top:18px; left:4px;
          font-size:10px; font-family:monospace;
          padding:2px 6px; border-radius:3px; white-space:nowrap;
          background:${color}; color:#000; opacity:0.9;
        ">${label}</div>
      `;

      containerRef.current?.appendChild(wrap);
      return wrap;
    }

    // ── Supabase channel ───────────────────────────────────────────────────
    const channel = supabase.channel("portfolio-cursors-v1", {
      config: {
        broadcast: { self: false, ack: false },
        presence: { key: myId },
      },
    });

    channel
      .on("broadcast", { event: "cur" }, ({ payload }) => {
        const { id, x, y, color, label } = payload as {
          id: string; x: number; y: number; color: string; label: string;
        };
        if (!cursors[id]) {
          cursors[id] = {
            id, tx: x, ty: y, x, y, color, label,
            el: createCursorEl(id, color, label),
            updatedAt: Date.now(),
          };
        } else {
          cursors[id].tx = x;
          cursors[id].ty = y;
          cursors[id].updatedAt = Date.now();
        }
      })
      .on("broadcast", { event: "bye" }, ({ payload }) => {
        const { id } = payload as { id: string };
        cursors[id]?.el?.remove();
        delete cursors[id];
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setVisitorCount(Object.keys(state).length);
      })
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") return;

        // Track this visitor in presence
        channel.track({ id: myId, color: myColor, label: myLabel, joinedAt: Date.now() });

        // Only start sending AFTER channel is ready
        const handleMouseMove = (e: MouseEvent) => {
          const now = Date.now();
          if (now - lastSent < 35) return;
          lastSent = now;
          channel.send({
            type: "broadcast",
            event: "cur",
            payload: { id: myId, x: e.clientX, y: e.clientY, color: myColor, label: myLabel },
          });
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Store cleanup ref on channel object
        (channel as unknown as { _cleanup?: () => void })._cleanup = () => {
          window.removeEventListener("mousemove", handleMouseMove);
        };
      });

    return () => {
      cancelAnimationFrame(rafId);
      (channel as unknown as { _cleanup?: () => void })._cleanup?.();
      channel.send({ type: "broadcast", event: "bye", payload: { id: myId } });
      supabase.removeChannel(channel);
      // Clean up DOM nodes
      for (const id in cursors) cursors[id].el?.remove();
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 pointer-events-none z-300" />
      {visitorCount > 0 && (
        <div
          className="fixed bottom-6 left-6 z-50 text-xs font-mono px-3 py-1.5 pointer-events-none select-none"
          style={{
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "4px",
            color: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
          }}
        >
          ◈ {visitorCount} {visitorCount === 1 ? "visitor" : "visitors"} online
        </div>
      )}
    </>
  );
}
