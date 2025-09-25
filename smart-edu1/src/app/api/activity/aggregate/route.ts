import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Aggregate recent user activity into UserActivity:
 * - daysJson: last 8 days hours (sum of study_session + video_watch duration)
 * - statsJson: { accuracy, classAccuracy } derived from quiz_submit events (fallback keeps existing)
 * - streak: computed as consecutive days with any activity
 */
export async function POST() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const userId = session.user.id as string;

  const since = new Date();
  since.setDate(since.getDate() - 8);

  // Fetch events for the last 8 days
  const events = await prisma.activityEvent.findMany({
    where: { userId, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  });

  // Build per-day buckets
  const buckets = new Array(8).fill(0); // hours per day
  const today = new Date();
  for (const e of events) {
    const d = new Date(e.createdAt);
    const diffDays = Math.floor((today.getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / (1000 * 60 * 60 * 24));
    const idx = 7 - Math.min(7, Math.max(0, diffDays));
    if (idx >= 0 && idx < 8) {
      if (e.type === "study_session" || e.type === "video_watch") {
        buckets[idx] += (e.durationS || 0) / 3600; // to hours
      }
    }
  }

  // Compute accuracy from quiz_submit events
  let correct = 0;
  let total = 0;
  for (const e of events) {
    if (e.type === "quiz_submit") {
      try {
        const meta = JSON.parse(e.metaJson || "{}");
        correct += Number(meta.correct || 0);
        total += Number(meta.total || 0);
      } catch {}
    }
  }
  const accuracy = total > 0 ? correct / total : undefined;

  // Compute streak (consecutive days with any activity)
  let streak = 0;
  for (let i = 7; i >= 0; i--) {
    if (buckets[i] > 0) streak++; else break;
  }

  // Load previous UA to preserve classAccuracy if not provided
  const prev = await prisma.userActivity.findUnique({ where: { userId } });
  let classAccuracy = 0.62;
  try {
    if (prev?.statsJson) {
      const parsed = JSON.parse(prev.statsJson);
      if (typeof parsed.classAccuracy === "number") classAccuracy = parsed.classAccuracy;
    }
  } catch {}

  const ua = await prisma.userActivity.upsert({
    where: { userId },
    update: {
      daysJson: JSON.stringify(buckets),
      streak: streak,
      statsJson: JSON.stringify({ accuracy: accuracy ?? (prev ? JSON.parse(prev.statsJson || "{}")?.accuracy ?? 0.7 : 0.7), classAccuracy }),
    },
    create: {
      userId,
      daysJson: JSON.stringify(buckets),
      badgesJson: "[]",
      streak: streak,
      statsJson: JSON.stringify({ accuracy: accuracy ?? 0.7, classAccuracy }),
    },
  });

  return new Response(JSON.stringify({ ok: true, activity: ua }), { headers: { "content-type": "application/json" } });
}
