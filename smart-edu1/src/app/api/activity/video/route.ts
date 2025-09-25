import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Upsert per-video progress for the current user
export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { videoId, courseId, secondsWatched = 0, lastPositionS = 0, completed = false } = body || {};
  if (!videoId || typeof videoId !== "string") {
    return new Response(JSON.stringify({ error: "Missing videoId" }), { status: 400 });
  }

  const vp = await prisma.videoProgress.upsert({
    where: { userId_videoId: { userId: session.user.id, videoId } } as any,
    update: {
      courseId: courseId ?? undefined,
      secondsWatched: Math.max(0, Number.isFinite(secondsWatched) ? Math.floor(secondsWatched) : 0),
      lastPositionS: Math.max(0, Number.isFinite(lastPositionS) ? Math.floor(lastPositionS) : 0),
      completed: Boolean(completed),
    },
    create: {
      userId: session.user.id,
      videoId,
      courseId: courseId ?? null,
      secondsWatched: Math.max(0, Number.isFinite(secondsWatched) ? Math.floor(secondsWatched) : 0),
      lastPositionS: Math.max(0, Number.isFinite(lastPositionS) ? Math.floor(lastPositionS) : 0),
      completed: Boolean(completed),
    },
  });

  // Also log an activity event for video progress
  await prisma.activityEvent.create({
    data: {
      userId: session.user.id,
      type: "video_watch",
      durationS: Math.max(0, Number.isFinite(secondsWatched) ? Math.floor(secondsWatched) : 0),
      metaJson: JSON.stringify({ videoId, courseId, lastPositionS, completed }),
    },
  });

  return new Response(JSON.stringify({ ok: true, progress: vp }), { headers: { "content-type": "application/json" } });
}
