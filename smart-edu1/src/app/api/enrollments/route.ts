import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const enrollments = await prisma.enrollment.findMany({ where: { userId: session.user.id } });
  return new Response(JSON.stringify({ enrollments }), { headers: { "content-type": "application/json" } });
}

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const body = await req.json();
  const { courseId, progressPercent } = body || {};
  if (!courseId || typeof progressPercent !== "number") {
    return new Response(JSON.stringify({ error: "courseId and progressPercent are required" }), { status: 400 });
  }
  const clamped = Math.max(0, Math.min(100, Math.round(progressPercent)));
  const up = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: session.user.id, courseId } },
    create: { userId: session.user.id, courseId, progressPercent: clamped },
    update: { progressPercent: clamped },
  });
  return new Response(JSON.stringify({ enrollment: up }), { headers: { "content-type": "application/json" } });
}
