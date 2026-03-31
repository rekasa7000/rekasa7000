import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST() {
  const total = await kv.incr("visitor_count");
  return NextResponse.json({ total });
}

export async function GET() {
  const total = (await kv.get<number>("visitor_count")) ?? 0;
  return NextResponse.json({ total });
}
