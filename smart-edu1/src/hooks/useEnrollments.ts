"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

type Enrollment = {
	id: string;
	courseId: string;
	progressPercent: number;
};

export function useEnrollments() {
    const { data: session } = useSession();
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Per-user storage key so each logged-in user has isolated enrollments
    const userKey = useMemo(() => {
        const raw = (session?.user as any)?.id || session?.user?.email || "guest";
        return String(raw);
    }, [session]);
    const storageKey = useMemo(() => `smartedu.enrollments.${userKey}`, [userKey]);

    // Backfill to DB on login: merge server + local, ensure server has max(progress)
    useEffect(() => {
        const sync = async () => {
            try {
                // Only attempt when we have a logged-in user
                const uid = (session?.user as any)?.id;
                if (!uid) return;
                // Fetch server enrollments
                const res = await fetch("/api/enrollments", { cache: "no-store" });
                if (!res.ok) return; // not logged in or server unavailable
                const data = await res.json();
                const serverList: Enrollment[] = Array.isArray(data?.enrollments) ? data.enrollments : [];
                // Build maps
                const localMap = new Map<string, number>();
                enrollments.forEach(e => localMap.set(e.courseId, e.progressPercent || 0));
                const serverMap = new Map<string, number>();
                serverList.forEach((e: any) => serverMap.set(e.courseId, e.progressPercent || 0));

                // Merge: choose max progress per course
                const courseIds = new Set<string>([...localMap.keys(), ...serverMap.keys()]);
                const merged: Enrollment[] = [];
                for (const cid of courseIds) {
                    const pLocal = localMap.get(cid) ?? 0;
                    const pServer = serverMap.get(cid) ?? 0;
                    const p = Math.max(pLocal, pServer);
                    merged.push({ id: `enrollment-${cid}`, courseId: cid, progressPercent: p });
                    // If local is ahead, push to server
                    if (pLocal > pServer) {
                        try {
                            await fetch("/api/enrollments", {
                                method: "POST",
                                headers: { "content-type": "application/json" },
                                body: JSON.stringify({ courseId: cid, progressPercent: pLocal }),
                            });
                        } catch {}
                    }
                }

                // Update local state and storage if changed
                setEnrollments(prev => {
                    const jsonPrev = JSON.stringify(prev.map(e => ({ c: e.courseId, p: e.progressPercent })).sort((a,b)=>a.c.localeCompare(b.c)));
                    const jsonNext = JSON.stringify(merged.map(e => ({ c: e.courseId, p: e.progressPercent })).sort((a,b)=>a.c.localeCompare(b.c)));
                    if (jsonPrev !== jsonNext) {
                        if (typeof window !== "undefined") {
                            localStorage.setItem(storageKey, JSON.stringify(merged));
                            window.dispatchEvent(new CustomEvent("smartedu.enrollments.changed", { detail: merged }));
                        }
                        return merged;
                    }
                    return prev;
                });
            } catch {}
        };
        // Kick off once we have enrollments loaded
        if (loaded) { sync(); }
    }, [session, loaded, enrollments, storageKey]);

    useEffect(() => {
        // Load after mount (and when user changes) with migration from legacy keys
        try {
            if (typeof window !== "undefined") {
                let saved = localStorage.getItem(storageKey);
                if (!saved) {
                    // Try legacy keys and migrate
                    const legacyGlobal = localStorage.getItem("smartedu.enrollments");
                    const legacyGuest = localStorage.getItem("smartedu.enrollments.guest");
                    saved = legacyGlobal || legacyGuest || null;
                    if (saved) {
                        // Persist under the new per-user key
                        localStorage.setItem(storageKey, saved);
                    }
                }
                if (saved) setEnrollments(JSON.parse(saved)); else setEnrollments([]);
            }
        } finally {
            setLoaded(true);
        }

        const onStorage = (e: StorageEvent) => {
        if (e.key === storageKey && e.newValue) {
            try { setEnrollments(JSON.parse(e.newValue)); } catch {}
        }
    };
    window.addEventListener("storage", onStorage);
    // Intra-tab sync: listen for custom changes from other hook instances
    const onLocalChange = (e: Event) => {
        try {
            const detail = (e as CustomEvent)?.detail;
            if (detail && Array.isArray(detail)) {
                setEnrollments(detail as any);
            }
        } catch {}
    };
    window.addEventListener("smartedu.enrollments.changed", onLocalChange as EventListener);
    return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("smartedu.enrollments.changed", onLocalChange as EventListener);
    };
    }, [storageKey]);

    const enrolledIds = useMemo(() => new Set(enrollments.map((e) => e.courseId)), [enrollments]);

    const isEnrolled = useCallback((courseId: string) => enrolledIds.has(courseId), [enrolledIds]);

    const enroll = useCallback(async (courseId: string) => {
        if (enrolledIds.has(courseId)) return;
        const newEnrollment: Enrollment = { id: `enrollment-${Date.now()}` , courseId, progressPercent: 0 };
        setEnrollments((prev) => {
            if (prev.some((e) => e.courseId === courseId)) return prev;
            const updated = [...prev, newEnrollment];
            if (typeof window !== "undefined") {
                localStorage.setItem(storageKey, JSON.stringify(updated));
                window.dispatchEvent(new CustomEvent("smartedu.enrollments.changed", { detail: updated }));
            }
            return updated;
        });
        try { (await import("sonner")).toast.success("Added to My Courses"); } catch {}
    }, [enrolledIds, storageKey]);

    const updateProgress = useCallback(async (courseId: string, progressPercent: number) => {
        const clamped = Math.max(0, Math.min(100, Math.round(progressPercent)));
        let changed = false;
        setEnrollments((prev) => {
            const updated = prev.map((e) => {
                if (e.courseId !== courseId) return e;
                const nextVal = Math.max(e.progressPercent || 0, clamped); // monotonic increase
                if (e.progressPercent !== nextVal) { changed = true; return { ...e, progressPercent: nextVal }; }
                return e;
            });
            if (changed && typeof window !== "undefined") {
                localStorage.setItem(storageKey, JSON.stringify(updated));
                window.dispatchEvent(new CustomEvent("smartedu.enrollments.changed", { detail: updated }));
            }
            return updated;
        });
        if (changed) {
            // Fire-and-forget server sync; unauthorized users will just be ignored
            try {
                void fetch("/api/enrollments", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ courseId, progressPercent: clamped }),
                    cache: "no-store",
                });
            } catch {}
            try { (await import("sonner")).toast.success("Progress saved"); } catch {}
        }
    }, [storageKey]);

    const removeEnrollment = useCallback(async (courseId: string) => {
        setEnrollments((prev) => {
            const updated = prev.filter((e) => e.courseId !== courseId);
            if (typeof window !== "undefined") {
                localStorage.setItem(storageKey, JSON.stringify(updated));
                window.dispatchEvent(new CustomEvent("smartedu.enrollments.changed", { detail: updated }));
            }
            return updated;
        });
		try { (await import("sonner")).toast.success("Removed from My Courses"); } catch {}
    }, [storageKey]);

    // Keep localStorage in sync whenever enrollments change
    // Avoid writing on first mount before we've loaded existing data
    useEffect(() => {
        if (!loaded) return;
        if (typeof window !== "undefined") {
            localStorage.setItem(storageKey, JSON.stringify(enrollments));
            // Do NOT broadcast here to avoid feedback loops; only broadcast on direct mutations.
        }
    }, [enrollments, loaded, storageKey]);

    return { enrollments, loaded, isEnrolled, enroll, updateProgress, removeEnrollment, storageKey };
}


