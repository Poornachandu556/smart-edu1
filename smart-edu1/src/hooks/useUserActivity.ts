"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

export type ServerActivity = {
  id: string;
  userId: string;
  daysJson: string; // JSON string of number[] hours per day
  badgesJson: string; // JSON string of badge identifiers
  streak: number;
  statsJson: string; // JSON string of { accuracy:number, classAccuracy:number }
  updatedAt: string;
} | null;

export type ActivityStats = {
  hoursPerDay: number[];
  accuracy: number; // 0..1
  classAccuracy: number; // 0..1
};

function loadLocalFallback(): ActivityStats {
  try {
    const raw = localStorage.getItem("smartedu:activity");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { hoursPerDay: [1.2, 1.8, 2.3, 2.0, 2.8, 3.1, 2.7, 3.4], accuracy: 0.7, classAccuracy: 0.62 };
}

export function useUserActivity() {
  const [loading, setLoading] = useState(true);
  const [serverData, setServerData] = useState<ServerActivity>(null);
  const [stats, setStats] = useState<ActivityStats>(loadLocalFallback());
  const [error, setError] = useState<string | null>(null);

  const hydrate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user-activity", { cache: "no-store" });
      if (res.status === 401) {
        // unauthenticated, keep local fallback
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const json = await res.json();
      const activity = (json?.activity ?? null) as ServerActivity;
      setServerData(activity);
      if (activity) {
        const days = JSON.parse(activity.daysJson || "[]") as number[];
        const s = JSON.parse(activity.statsJson || "{}") as Partial<ActivityStats>;
        setStats({
          hoursPerDay: Array.isArray(days) && days.length ? days : loadLocalFallback().hoursPerDay,
          accuracy: typeof s.accuracy === "number" ? s.accuracy : loadLocalFallback().accuracy,
          classAccuracy: typeof s.classAccuracy === "number" ? s.classAccuracy : loadLocalFallback().classAccuracy,
        });
      }
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { hydrate(); }, [hydrate]);

  const save = useCallback(async (next: ActivityStats) => {
    // persist to API if available; always update local as well
    try {
      localStorage.setItem("smartedu:activity", JSON.stringify(next));
    } catch {}
    try {
      const body = {
        daysJson: JSON.stringify(next.hoursPerDay),
        badgesJson: JSON.stringify([]),
        streak: (serverData?.streak ?? 0),
        statsJson: JSON.stringify({ accuracy: next.accuracy, classAccuracy: next.classAccuracy }),
      };
      const res = await fetch("/api/user-activity", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        const json = await res.json();
        setServerData(json.activity ?? null);
      }
      setStats(next);
    } catch (e) {
      setStats(next); // at least update UI
    }
  }, [serverData]);

  return { loading, stats, error, serverData, hydrate, save };
}
