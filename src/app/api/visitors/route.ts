import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export const runtime = "edge";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST() {
  const total = await redis.incr("visitor_count");
  return NextResponse.json({ total });
}

export async function GET() {
  const total = (await redis.get<number>("visitor_count")) ?? 0;
  return NextResponse.json({ total });
}
