import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET /api/community/feed?courseId=optional&limit=20
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId") || undefined;
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));

  const posts = await prisma.post.findMany({
    where: { courseId: courseId ?? undefined },
    include: {
      answers: { include: { user: { select: { id: true, name: true, email: true } } } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return new Response(JSON.stringify({ posts }), { headers: { "content-type": "application/json" } });
}
