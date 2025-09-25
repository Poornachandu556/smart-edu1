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

  const { title, body: content, courseId, tags = [] } = body as { title: string; body: string; courseId?: string; tags?: string[] };
  if (!title || !content) return new Response(JSON.stringify({ error: "Missing title/body" }), { status: 400 });

  const post = await prisma.post.create({
    data: {
      userId: session.user.id,
      title: title.slice(0, 160),
      body: content.slice(0, 4000),
      courseId: courseId ?? null,
      tagsJson: JSON.stringify(tags ?? []),
    },
  });

  return new Response(JSON.stringify({ ok: true, post }), { headers: { "content-type": "application/json" } });
}
