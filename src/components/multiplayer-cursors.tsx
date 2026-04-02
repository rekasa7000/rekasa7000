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
  tx: number;
  ty: number;
  x: number;
  y: number;
  color: string;
  label: string;
  el: HTMLDivElement | null;
  updatedAt: number;
}

export function MultiplayerCursors() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visitorCount, setVisitorCount] = useState(1);
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const channelRef = useRef<ReturnType<typeof createClient>["channel"] | null>(null);

  // ── Fetch/increment total visits ──────────────────────────────────────────
  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
    const counted = sessionStorage.getItem("vcount");
    const method = counted ? "GET" : "POST";
    fetch("/api/visitors", { method })
      .then((r) => r.json())
      .then((d: { total: number }) => {
        setTotalVisits(d.total);
        if (!counted) {
          sessionStorage.setItem("vcount", "1");
          (channelRef.current as unknown as { send: (msg: object) => void } | null)?.send({
            type: "broadcast", event: "visits", payload: { total: d.total },
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const myId = shortId();
    const myColor = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
    const myLabel = `visitor_${myId}`;

    const cursors: Record<string, CursorState> = {};
    // Track other connected visitor IDs via broadcast handshake
    const peerIds = new Set<string>();
    let rafId = 0;
    let lastSent = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const now = Date.now();
      for (const _id in cursors) {
        const c = cursors[_id];
        if (now - c.updatedAt > 5000) {
          c.el?.remove();
          delete cursors[_id];
          // Also drop from peer set if stale
          peerIds.delete(_id);
          setVisitorCount(peerIds.size + 1);
          continue;
        }
        c.x = lerp(c.x, c.tx, 0.18);
        c.y = lerp(c.y, c.ty, 0.18);
        if (c.el) c.el.style.transform = `translate(${c.x}px, ${c.y}px)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

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

    const channel = supabase.channel("portfolio-cursors-v1", {
      config: { broadcast: { self: false, ack: false } },
    });

    channelRef.current = channel as unknown as ReturnType<typeof createClient>["channel"];

    channel
      .on("broadcast", { event: "cur" }, ({ payload }) => {
        const { id, x, y, color, label } = payload as {
          id: string; x: number; y: number; color: string; label: string;
        };
        if (!cursors[id]) {
          cursors[id] = { id, tx: x, ty: y, x, y, color, label, el: createCursorEl(id, color, label), updatedAt: Date.now() };
        } else {
          cursors[id].tx = x;
          cursors[id].ty = y;
          cursors[id].updatedAt = Date.now();
        }
      })
      // ── Broadcast-based visitor count ───────────────────────────────────
      // When someone new joins they send "hello"; existing clients respond
      // with their own "hello" so the newcomer learns everyone is there.
      .on("broadcast", { event: "hello" }, ({ payload }) => {
        const { id } = payload as { id: string };
        if (!peerIds.has(id)) {
          peerIds.add(id);
          setVisitorCount(peerIds.size + 1);
          // Reply so the new visitor knows we exist
          channel.send({ type: "broadcast", event: "hello", payload: { id: myId } });
        }
      })
      .on("broadcast", { event: "bye" }, ({ payload }) => {
        const { id } = payload as { id: string };
        cursors[id]?.el?.remove();
        delete cursors[id];
        peerIds.delete(id);
        setVisitorCount(peerIds.size + 1);
      })
      .on("broadcast", { event: "visits" }, ({ payload }) => {
        const { total } = payload as { total: number };
        setTotalVisits(total);
      })
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") return;

        // Announce ourselves — existing clients will reply with their own "hello"
        channel.send({ type: "broadcast", event: "hello", payload: { id: myId } });
        setMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
          const now = Date.now();
          if (now - lastSent < 35) return;
          lastSent = now;
          channel.send({
            type: "broadcast", event: "cur",
            payload: { id: myId, x: e.clientX, y: e.clientY, color: myColor, label: myLabel },
          });
        };

        window.addEventListener("mousemove", handleMouseMove);
        (channel as unknown as { _cleanup?: () => void })._cleanup = () => {
          window.removeEventListener("mousemove", handleMouseMove);
        };
      });

    return () => {
      cancelAnimationFrame(rafId);
      (channel as unknown as { _cleanup?: () => void })._cleanup?.();
      channel.send({ type: "broadcast", event: "bye", payload: { id: myId } });
      supabase.removeChannel(channel);
      for (const id in cursors) cursors[id].el?.remove();
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 pointer-events-none z-300" />
      {mounted && (
        <div
          className="fixed top-4 right-4 z-100 text-xs font-mono px-3 py-2 pointer-events-none select-none flex flex-col gap-1 items-end"
          style={{
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "6px",
            color: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span>◈ {visitorCount} {visitorCount === 1 ? "visitor" : "visitors"} online</span>
          {totalVisits !== null && (
            <span style={{ opacity: 0.55 }}>◈ {totalVisits.toLocaleString()} total visits</span>
          )}
        </div>
      )}
    </>
  );
}
