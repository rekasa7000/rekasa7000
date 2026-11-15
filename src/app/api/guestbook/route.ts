import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { GUEST_COLORS, GUEST_KINDS, NAME_MAX, NAME_PATTERN, type GuestFlower, type GuestKind } from "@/lib/guestbook";

export const runtime = "edge";

const KEY = "guestbook:flowers";
const KEEP = 200;
const SHOWN = 80;
const COOLDOWN_SECONDS = 300;

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

// Without Redis (local development) flowers live in memory so the feature still works.
const memory: GuestFlower[] = [];
const memoryCooldown = new Map<string, number>();

export async function GET() {
  const flowers = redis ? await redis.lrange<GuestFlower>(KEY, 0, SHOWN - 1) : memory.slice(0, SHOWN);
  return NextResponse.json({ flowers });
}

export async function POST(req: Request) {
  let body: { name?: unknown; kind?: unknown; color?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const kind = body.kind as GuestKind;
  const color = body.color as string;
  if (!GUEST_KINDS.includes(kind) || !(GUEST_COLORS as readonly string[]).includes(color)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (name.length > NAME_MAX || (name && !NAME_PATTERN.test(name))) {
    return NextResponse.json({ error: "bad_name" }, { status: 400 });
  }

  // one flower per visitor every few minutes; the address is only kept as a short-lived key
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (redis) {
    const fresh = await redis.set(`guestbook:cooldown:${ip}`, 1, { nx: true, ex: COOLDOWN_SECONDS });
    if (!fresh) return NextResponse.json({ error: "cooldown" }, { status: 429 });
  } else {
    const last = memoryCooldown.get(ip) ?? 0;
    if (Date.now() - last < COOLDOWN_SECONDS * 1000) return NextResponse.json({ error: "cooldown" }, { status: 429 });
    memoryCooldown.set(ip, Date.now());
  }

  const flower: GuestFlower = { id: crypto.randomUUID().slice(0, 8), name, kind, color, at: Date.now() };
  if (redis) {
    await redis.lpush(KEY, flower);
    await redis.ltrim(KEY, 0, KEEP - 1);
  } else {
    memory.unshift(flower);
    memory.length = Math.min(memory.length, KEEP);
  }
  return NextResponse.json({ flower });
}
