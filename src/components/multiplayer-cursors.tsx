"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const CURSOR_COLORS = [
  "#4a90e2", "#e24a4a", "#e2a84a", "#4ae27a",
  "#a84ae2", "#4ae2d4", "#e24aa8", "#e2e24a",
];

function shortId(): string {
  return Math.random().toString(36).slice(2, 7);
}

interface RemoteCursor {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
  updatedAt: number;
}

export function MultiplayerCursors() {
  const [cursors, setCursors] = useState<Record<string, RemoteCursor>>({});
  const myIdRef = useRef(shortId());
  const myColorRef = useRef(CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)]);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const myId = myIdRef.current;
    const myColor = myColorRef.current;
    const myLabel = `visitor_${myId}`;

    const channel = supabase.channel("cursors", {
      config: { broadcast: { self: false } },
    });

    channelRef.current = channel;

    channel
      .on("broadcast", { event: "cursor" }, ({ payload }) => {
        const { id, x, y, color, label } = payload as RemoteCursor;
        setCursors((prev) => ({
          ...prev,
          [id]: { id, x, y, color, label, updatedAt: Date.now() },
        }));
      })
      .on("broadcast", { event: "leave" }, ({ payload }) => {
        const { id } = payload as { id: string };
        setCursors((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      })
      .subscribe();

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSentRef.current < 40) return; // ~25fps throttle
      lastSentRef.current = now;

      channel.send({
        type: "broadcast",
        event: "cursor",
        payload: { id: myId, x: e.clientX, y: e.clientY, color: myColor, label: myLabel },
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Prune stale cursors every 3s
    const prune = setInterval(() => {
      setCursors((prev) => {
        const now = Date.now();
        const next = { ...prev };
        for (const id in next) {
          if (now - next[id].updatedAt > 5000) delete next[id];
        }
        return next;
      });
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(prune);
      channel.send({ type: "broadcast", event: "leave", payload: { id: myId } });
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      {Object.values(cursors).map((cursor) => (
        <div
          key={cursor.id}
          className="fixed pointer-events-none z-[300] transition-none"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: "translate(-2px, -2px)",
          }}
        >
          {/* Cursor SVG */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M2 2L14 8L9 9.5L7 15L2 2Z"
              fill={cursor.color}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="1"
            />
          </svg>
          {/* Label */}
          <div
            className="absolute top-4 left-3 text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap"
            style={{
              backgroundColor: cursor.color,
              color: "#000",
              opacity: 0.9,
            }}
          >
            {cursor.label}
          </div>
        </div>
      ))}
    </>
  );
}
