"use client";

// Lightweight client SDK to log activity and video progress
// Usage examples:
//   import { logEvent, upsertVideoProgress } from "@/lib/activityClient";
//   await logEvent("study_session", 1800, { topic: "Algebra" });
//   await upsertVideoProgress({ videoId: "yt:abc123", courseId: "math101", secondsWatched: 120, lastPositionS: 120 });

export async function logEvent(type: string, durationS = 0, meta: Record<string, any> = {}) {
  try {
    const res = await fetch("/api/activity/log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type, durationS, meta }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export type VideoProgressInput = {
  videoId: string;
  courseId?: string;
  secondsWatched?: number;
  lastPositionS?: number;
  completed?: boolean;
};

export async function upsertVideoProgress(input: VideoProgressInput) {
  try {
    const res = await fetch("/api/activity/video", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    return res.ok;
  } catch {
    return false;
  }
}
