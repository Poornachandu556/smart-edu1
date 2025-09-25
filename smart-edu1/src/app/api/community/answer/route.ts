import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });

  const { postId, body: content } = body as { postId: string; body: string };
  if (!postId || !content) return new Response(JSON.stringify({ error: "Missing postId/body" }), { status: 400 });

  const answer = await prisma.answer.create({
    data: {
      postId,
      userId: session.user.id,
      body: content.slice(0, 4000),
    },
  });

  // Award a small badge for first answer
  const totalAnswers = await prisma.answer.count({ where: { userId: session.user.id } });
  if (totalAnswers === 1) {
    await prisma.badgeAward.create({ data: { userId: session.user.id, badge: "First Answer" } });
  }

  return new Response(JSON.stringify({ ok: true, answer }), { headers: { "content-type": "application/json" } });
}
