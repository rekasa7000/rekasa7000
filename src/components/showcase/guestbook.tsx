"use client";

import { useEffect, useState } from "react";
import { Flower, GardenSvg, Orb, Stars } from "./garden";
import { GUEST_COLORS, GUEST_KINDS, NAME_MAX, NAME_PATTERN, type GuestFlower, type GuestKind } from "@/lib/guestbook";

const LABEL: Record<GuestKind, string> = {
  daisy: "Daisy",
  sunflower: "Sunflower",
  tulip: "Tulip",
  lavender: "Lavender",
  poppy: "Poppy",
};
const COLOR_NAME = ["Pink", "Orange", "Cream", "Lilac", "Peach"];

// stable pseudo-random number from a flower's id
const hash = (s: string, salt: number) => {
  let h = salt;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973;
  return h / 9973;
};

const groundY = (x: number) => 300 - 70 * Math.sqrt(Math.max(0, 1 - ((x - 500) / 720) ** 2));

type Status = "idle" | "sending" | "done" | "cooldown" | "bad_name" | "error";
const MESSAGE: Record<Status, string> = {
  idle: "",
  sending: "Planting…",
  done: "Planted. Thank you for stopping by.",
  cooldown: "You planted one a moment ago. Come back in a few minutes for another.",
  bad_name: `Names can use letters, numbers, spaces, dots, apostrophes and hyphens, up to ${NAME_MAX} characters.`,
  error: "Couldn't plant that just now. Please try again.",
};

/** Visitors plant a flower in a shared field. Flowers are stored by /api/guestbook. */
export function Guestbook() {
  const [flowers, setFlowers] = useState<GuestFlower[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<GuestKind>("daisy");
  const [color, setColor] = useState<string>(GUEST_COLORS[0]);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let alive = true;
    fetch("/api/guestbook")
      .then((r) => (r.ok ? r.json() : { flowers: [] }))
      .then((d: { flowers?: GuestFlower[] }) => alive && setFlowers(Array.isArray(d.flowers) ? d.flowers : []))
      .catch(() => {})
      .finally(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  const plant = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = name.trim();
    if (clean && !NAME_PATTERN.test(clean)) return setStatus("bad_name");
    setStatus("sending");
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: clean, kind, color }),
      });
      const data: { flower?: GuestFlower; error?: string } = await res.json().catch(() => ({}));
      if (res.ok && data.flower) {
        setFlowers((f) => [data.flower as GuestFlower, ...f]);
        setName("");
        setStatus("done");
      } else setStatus(res.status === 429 ? "cooldown" : data.error === "bad_name" ? "bad_name" : "error");
    } catch {
      setStatus("error");
    }
  };

  // back rows first so nearer flowers overlap farther ones
  const placed = flowers
    .slice(0, 60)
    .map((f) => {
      const row = Math.floor(hash(f.id, 7) * 3);
      const x = 50 + hash(f.id, 13) * 900;
      return { f, row, x, y: groundY(x) + 6 + row * 20, h: 46 + hash(f.id, 29) * 44, s: 0.95 + row * 0.2 };
    })
    .sort((a, b) => a.row - b.row);

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-8 min-w-0">
        <div className="guest-field">
          <GardenSvg
            viewBox="0 0 1000 360"
            preserveAspectRatio="xMidYMax slice"
            className="w-full h-full block"
            label={`A field with ${flowers.length} flowers planted by visitors`}
          >
            <defs>
              <linearGradient id="gb-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#011f1e" />
                <stop offset="65%" stopColor="#013230" />
                <stop offset="100%" stopColor="#0b4f4a" />
              </linearGradient>
            </defs>
            <rect width="1000" height="360" fill="url(#gb-sky)" />
            <Stars count={46} w={1000} h={210} />
            <Orb x={860} y={70} r={30} kind="moon" />
            <path d="M0 250 Q160 190 330 236 T640 222 T1000 240 V360 H0Z" fill="#22422f" />
            {placed.map(({ f, x, y, h, s }, i) => (
              <g key={f.id}>
                <title>{f.name ? `${f.name}'s ${f.kind}` : `A ${f.kind}`}</title>
                <Flower
                  x={x}
                  y={y}
                  h={h}
                  kind={f.kind}
                  color={f.color}
                  scale={s}
                  delay={Math.min(i, 20) * 0.05}
                  lean={hash(f.id, 3) > 0.5 ? 5 : -5}
                />
              </g>
            ))}
            <ellipse cx="500" cy="590" rx="820" ry="360" fill="#3d7f56" stroke="#012624" strokeWidth="2" />
            <ellipse
              cx="500"
              cy="612"
              rx="800"
              ry="360"
              fill="none"
              stroke="#2a5c3d"
              strokeOpacity="0.5"
              strokeWidth="5"
              strokeDasharray="1 14"
              strokeLinecap="round"
            />
          </GardenSvg>
          {loaded && flowers.length === 0 && (
            <p className="guest-empty">Nothing planted yet. Yours could be the first.</p>
          )}
          <span className="plot-caption">
            {flowers.length === 0
              ? "The visitors' field"
              : `${flowers.length} ${flowers.length === 1 ? "flower" : "flowers"} planted by visitors`}
          </span>
        </div>

        {flowers.some((f) => f.name) && (
          <ul className="flex flex-wrap gap-2 mt-5" aria-label="Recent visitors">
            {flowers
              .filter((f) => f.name)
              .slice(0, 12)
              .map((f) => (
                <li key={f.id} className="chip" style={{ cursor: "default" }}>
                  <span
                    className="guest-dot"
                    style={{ background: f.kind === "sunflower" ? "var(--accent-3)" : f.color }}
                  />{" "}
                  {f.name}
                </li>
              ))}
          </ul>
        )}
      </div>

      <form onSubmit={plant} className="lg:col-span-4 stage-card p-6 space-y-6">
        <div>
          <label htmlFor="guest-name" className="meta-label block mb-2">
            Your name (optional)
          </label>
          <input
            id="guest-name"
            className="guest-input"
            value={name}
            maxLength={NAME_MAX}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ana"
            autoComplete="off"
          />
        </div>

        <fieldset>
          <legend className="meta-label mb-2">Flower</legend>
          <div className="flex flex-wrap gap-2">
            {GUEST_KINDS.map((k) => (
              <button
                type="button"
                key={k}
                className="chip"
                data-active={kind === k}
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
              >
                {LABEL[k]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset disabled={kind === "sunflower"} style={{ opacity: kind === "sunflower" ? 0.4 : 1 }}>
          <legend className="meta-label mb-2">
            Colour{kind === "sunflower" ? " (sunflowers are always yellow)" : ""}
          </legend>
          <div className="flex gap-3">
            {GUEST_COLORS.map((c, i) => (
              <button
                type="button"
                key={c}
                className="guest-swatch"
                style={{ background: c }}
                data-active={color === c}
                aria-pressed={color === c}
                aria-label={COLOR_NAME[i]}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </fieldset>

        <button type="submit" className="btn-ink" disabled={status === "sending"}>
          Plant it
        </button>
        <p
          className="text-sm min-h-[2.5rem]"
          role="status"
          style={{ color: status === "done" ? "var(--leaf)" : "var(--text-secondary)" }}
        >
          {MESSAGE[status]}
        </p>
      </form>
    </div>
  );
}
