"use client";

import { useEffect, useState } from "react";

export function VisitorCounter() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const counted = sessionStorage.getItem("vcount");
    if (counted) {
      // Already counted this session — just read
      fetch("/api/visitors")
        .then((r) => r.json())
        .then((d) => setTotal(d.total))
        .catch(() => {});
    } else {
      // New session — increment
      fetch("/api/visitors", { method: "POST" })
        .then((r) => r.json())
        .then((d) => {
          sessionStorage.setItem("vcount", "1");
          setTotal(d.total);
        })
        .catch(() => {});
    }
  }, []);

  if (total === null) return null;

  return (
    <span
      title="Total visits"
      style={{ opacity: 0.45, fontSize: "10px", fontFamily: "monospace", letterSpacing: "0.05em" }}
    >
      ◈ {total.toLocaleString()} visits
    </span>
  );
}
