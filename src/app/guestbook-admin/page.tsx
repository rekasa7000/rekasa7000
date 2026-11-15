"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { GuestFlower } from "@/lib/guestbook";

/**
 * Owner's removal tool for the guestbook. The page itself shows nothing private: flowers
 * are public. Removing one needs the admin token, which is only held in this tab's memory.
 */
export default function GuestbookAdmin() {
  const [flowers, setFlowers] = useState<GuestFlower[]>([]);
  const [token, setToken] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/guestbook")
      .then((r) => r.json())
      .then((d: { flowers?: GuestFlower[] }) => alive && setFlowers(d.flowers ?? []))
      .catch(() => alive && setNote("Couldn't load the guestbook."));
    return () => {
      alive = false;
    };
  }, []);

  const remove = async (id: string) => {
    setNote("Removing…");
    const res = await fetch(`/api/guestbook?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setFlowers((f) => f.filter((x) => x.id !== id));
      setNote("Removed.");
    } else if (res.status === 401) setNote("That token was not accepted.");
    else if (res.status === 503) setNote("Removal is switched off: GUESTBOOK_ADMIN_TOKEN is not set on the server.");
    else setNote("Couldn't remove that one.");
  };

  return (
    <main
      className="min-h-screen relative z-10 px-6 py-12"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="meta-label link-underline" style={{ color: "var(--text-secondary)" }}>
          ← Back to the garden
        </Link>
        <h1 className="font-display text-4xl mt-8 mb-3">Guestbook tending</h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
          Paste your admin token, then pull any flower that shouldn&apos;t be there.
        </p>

        <label htmlFor="admin-token" className="meta-label block mb-2">
          Admin token
        </label>
        <input
          id="admin-token"
          type="password"
          className="guest-input mb-3"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          autoComplete="off"
        />
        <p className="text-sm min-h-[1.5rem] mb-8" role="status" style={{ color: "var(--text-secondary)" }}>
          {note}
        </p>

        <ul className="stage-card divide-y" style={{ borderColor: "var(--border-color)" }}>
          {flowers.length === 0 && <li className="p-5">No flowers planted yet.</li>}
          {flowers.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between gap-4 p-4"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{f.name || "(no name)"}</div>
                <div className="meta-label">
                  {f.kind} · {new Date(f.at).toLocaleString()}
                </div>
              </div>
              <button className="btn-ghost shrink-0" onClick={() => remove(f.id)} disabled={!token}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
