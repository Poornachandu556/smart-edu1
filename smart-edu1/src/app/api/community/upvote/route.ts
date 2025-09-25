import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const body = await req.json().catch(() => null);
  const { postId } = (body || {}) as { postId?: string };
  if (!postId) return new Response(JSON.stringify({ error: "Missing postId" }), { status: 400 });

  // Try create unique upvote; if exists ignore
  try {
    await prisma.postUpvote.create({ data: { postId, userId: session.user.id } });
    await prisma.post.update({ where: { id: postId }, data: { upvotes: { increment: 1 } } });
  } catch {}

  return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
}
