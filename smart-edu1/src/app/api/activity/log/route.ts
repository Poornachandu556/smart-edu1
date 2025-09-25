import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { type, durationS = 0, meta = {} } = body || {};
  if (!type || typeof type !== "string") {
    return new Response(JSON.stringify({ error: "Missing type" }), { status: 400 });
  }

  const event = await prisma.activityEvent.create({
    data: {
      userId: session.user.id,
      type,
      durationS: Number.isFinite(durationS) ? Math.max(0, Math.floor(durationS)) : 0,
      metaJson: JSON.stringify(meta ?? {}),
    },
  });

  return new Response(JSON.stringify({ ok: true, event }), { headers: { "content-type": "application/json" } });
}
