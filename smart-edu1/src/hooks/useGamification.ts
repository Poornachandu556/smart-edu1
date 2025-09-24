"use client";
import { useEffect, useMemo, useState } from "react";
import { useEnrollments } from "./useEnrollments";

type Badge = {
  id: string;
  label: string;
  description: string;
};

function getTodayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function calcStreak(days: string[]): number {
  if (!days.length) return 0;
  const set = new Set(days);
  let streak = 0;
  let cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (set.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function useGamification() {
  const { enrollments } = useEnrollments();
  const [activityDays, setActivityDays] = useState<string[]>([]);

  // Load + ensure today recorded as active when visiting the skill tree
  useEffect(() => {
    try {
      const raw = localStorage.getItem("smartedu-activity-days") || "[]";
      const parsed: string[] = JSON.parse(raw);
      const today = getTodayKey();
      if (!parsed.includes(today)) parsed.push(today);
      setActivityDays(parsed);
      localStorage.setItem("smartedu-activity-days", JSON.stringify(parsed));
    } catch {}
  }, []);

  const stats = useMemo(() => {
    const totalCourses = enrollments.length;
    const avgProgress = totalCourses
      ? Math.round(
          enrollments.reduce((acc, e) => acc + (e.progressPercent || 0), 0) /
            totalCourses
        )
      : 0;
    const maxProgress = enrollments.reduce(
      (m, e) => Math.max(m, e.progressPercent || 0),
      0
    );
    return { totalCourses, avgProgress, maxProgress };
  }, [enrollments]);

  const streak = useMemo(() => calcStreak(activityDays), [activityDays]);

  const badges: Badge[] = useMemo(() => {
    const list: Badge[] = [];
    if (stats.totalCourses > 0) list.push({ id: "starter", label: "Starter", description: "Enrolled in your first course" });
    if (stats.maxProgress >= 50) list.push({ id: "achiever", label: "Achiever", description: "Reached 50% in a course" });
    if (stats.maxProgress >= 100) list.push({ id: "finisher", label: "Finisher", description: "Completed a course" });
    if (streak >= 3) list.push({ id: "streak-3", label: "3-day Streak", description: "Learned 3 days in a row" });
    if (streak >= 7) list.push({ id: "streak-7", label: "7-day Streak", description: "Learned 7 days in a row" });
    if (streak >= 14) list.push({ id: "streak-14", label: "14-day Streak", description: "Kept momentum for two weeks" });
    return list;
  }, [stats, streak]);

  const recordActivity = () => {
    try {
      const today = getTodayKey();
      setActivityDays((prev) => {
        if (prev.includes(today)) return prev;
        const next = [...prev, today];
        localStorage.setItem("smartedu-activity-days", JSON.stringify(next));
        return next;
      });
    } catch {}
  };

  return { badges, streak, stats, activityDays, recordActivity };
}


