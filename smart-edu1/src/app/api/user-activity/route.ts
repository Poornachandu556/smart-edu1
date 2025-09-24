import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const ua = await prisma.userActivity.findUnique({ where: { userId: session.user.id } });
  return new Response(JSON.stringify({ activity: ua }), { headers: { "content-type": "application/json" } });
}

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const body = await req.json();
  const { daysJson, badgesJson, streak, statsJson } = body || {};
  const ua = await prisma.userActivity.upsert({
    where: { userId: session.user.id },
    update: { daysJson, badgesJson, streak, statsJson },
    create: { userId: session.user.id, daysJson, badgesJson, streak, statsJson },
  });
  return new Response(JSON.stringify({ activity: ua }), { headers: { "content-type": "application/json" } });
}


