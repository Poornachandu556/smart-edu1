"use client";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSuggestion, loadDNA } from "@/lib/learningDNA";
import { useUserActivity } from "@/hooks/useUserActivity";


export default function ProgressPage() {
  const { status } = useSession();
  const router = useRouter();
  const { loading, stats, save, hydrate } = useUserActivity();
  const [dna, setDna] = useState(loadDNA());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    // hydrate DNA from localStorage in client
    setDna(loadDNA());
    setMounted(true);
  }, []);

  const suggestion = useMemo(() => getSuggestion(dna), [dna]);

  // Build SVG points for the line chart based on hours
  const { points, maxHour } = useMemo(() => {
    const spanW = 280; // width minus padding for the grid
    const baseY = 100; // bottom y
    const topY = 20; // top padding
    const data = stats?.hoursPerDay ?? [];
    const max = Math.max(1, ...data);
    const step = data.length > 1 ? spanW / (data.length - 1) : 0;
    const pts = data.map((h, i) => {
      const x = i * step;
      const y = baseY - ((h / max) * (baseY - topY));
      return `${x},${Math.round(y)}`;
    }).join(" ");
    return { points: pts, maxHour: max };
  }, [stats]);

  const accuracyPct = Math.round((stats?.accuracy ?? 0.7) * 100);
  const classAccuracyPct = Math.round((stats?.classAccuracy ?? 0.62) * 100);

  // Radial progress metrics
  const r = 54;
  const C = 2 * Math.PI * r; // circumference
  const offset = C * (1 - (accuracyPct / 100));

  const varkBars = useMemo(() => {
    const entries = [
      { key: "Visual", color: "#22c55e", val: dna.visual },
      { key: "Auditory", color: "#3b82f6", val: dna.auditory },
      { key: "Reading", color: "#f59e0b", val: dna.reading },
      { key: "Hands-on", color: "#a855f7", val: dna.kinesthetic },
    ];
    return entries;
  }, [dna]);

  return (
    <div className="min-h-screen p-6 md:p-10">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Progress & Analytics</h1>
      <p className="text-sm opacity-70">Track your study time, quiz accuracy, and learning preferences. Data is personalized to your recent activity.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Daily Study Time */}
        <div className="card p-5 fade-in">
          <p className="mb-2 font-medium">Daily study time (hrs)</p>
          <div className="flex items-center justify-between text-xs opacity-70 mb-2">
            <span suppressHydrationWarning>
              Last {mounted ? (stats?.hoursPerDay.length ?? 0) : 0} days
            </span>
            <span suppressHydrationWarning>
              Peak: {mounted ? maxHour.toFixed(1) : "0.0"}h
            </span>
          </div>
          <svg viewBox="0 0 300 120" className="h-48 w-full">
            <polyline
              className="line-grow"
              fill="none"
              stroke="url(#g1)"
              strokeWidth="3"
              points={`0,100 ${points}`}
              pathLength={100}
            />
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#86c1ff" />
                <stop offset="100%" stopColor="#0f74f0" />
              </linearGradient>
            </defs>
            {/* grid */}
            <line x1="0" y1="100" x2="300" y2="100" stroke="#e5e7eb22" />
            <line x1="0" y1="60" x2="300" y2="60" stroke="#e5e7eb22" />
            <line x1="0" y1="20" x2="300" y2="20" stroke="#e5e7eb22" />
          </svg>
        </div>

        {/* Accuracy */}
        <div className="card p-5 fade-in">
          <p className="mb-2 font-medium">Accuracy % in quizzes</p>
          <svg viewBox="0 0 120 120" className="h-48 w-full">
            <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e7eb33" strokeWidth="8" />
            <circle
              cx="60" cy="60" r={r}
              fill="none"
              stroke="#22c55e"
              strokeWidth="8"
              strokeDasharray={C}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="radial-grow"
            />
            <text suppressHydrationWarning x="60" y="66" textAnchor="middle" className="fill-current text-lg font-semibold">{accuracyPct}%</text>
          </svg>
          <div className="mt-2 text-xs opacity-70" suppressHydrationWarning>Class avg: {classAccuracyPct}%</div>
        </div>

        {/* Learning DNA Bars */}
        <div className="card p-5 fade-in">
          <p className="mb-2 font-medium">Your learning style (VARK)</p>
          <svg viewBox="0 0 300 120" className="h-48 w-full">
            {varkBars.map((b, i) => {
              const x = 25 + i * 60;
              const maxH = 80;
              const h = Math.max(4, (b.val / 100) * maxH);
              const y = 100 - h;
              return (
                <g key={b.key}>
                  <rect x={x} y={y} width="36" height={h} fill={b.color} className="bar-grow" style={{ ['--bar-delay' as any]: `${i * 100}ms` }} />
                  <text x={x + 18} y={110} textAnchor="middle" className="fill-current text-[10px] opacity-80">{b.key}</text>
                </g>
              );
            })}
          </svg>
          <p className="text-sm opacity-80" suppressHydrationWarning>Tip: {suggestion}</p>
        </div>

        {/* Class comparison */}
        <div className="card p-5 fade-in">
          <p className="mb-2 font-medium">Class average comparison</p>
          <svg viewBox="0 0 300 120" className="h-48 w-full">
            <polyline
              fill="none"
              stroke="#2a8cff"
              strokeWidth="3"
              className="line-grow"
              points="20,95 100,80 180,60 280,40"
              pathLength={100}
            />
            <polyline
              fill="none"
              stroke="#94a3b8"
              strokeWidth="3"
              className="line-grow"
              style={{ animationDelay: "150ms" }}
              points="20,98 100,90 180,78 280,65"
              pathLength={100}
            />
            <text x="22" y="20" className="fill-current text-xs">You vs Class</text>
          </svg>
        </div>
      </div>

      {loading && (
        <div className="mt-4 text-xs opacity-70">Loading fresh activity from server...</div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={async () => {
            if (!stats) return;
            await save(stats);
            try { await fetch("/api/activity/aggregate", { method: "POST" }); } catch {}
            hydrate();
          }}
          className="rounded-full border border-white/20 px-4 py-3 hover:bg-white/10 transition-colors"
          disabled={loading}
        >
          {loading ? "Syncing..." : "Sync now"}
        </button>
        <button
          onClick={() => {
            const rows = [
              ["metric", "value"],
              ["avg_daily_hours", ((stats?.hoursPerDay.reduce((a,b)=>a+b,0) || 0) / (stats?.hoursPerDay.length || 1)).toFixed(2)],
              ["accuracy", (stats?.accuracy ?? 0.7).toFixed(2)],
            ];
            const csv = rows.map(r => r.join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "smartedu-progress.csv"; a.click();
            URL.revokeObjectURL(url);
          }}
          className="rounded-full border border-white/20 px-4 py-3 hover:bg-white/10 transition-colors"
        >
          Export CSV
        </button>
        <button onClick={() => window.print()} className="btn-primary">Print to PDF</button>
      </div>

      <style jsx>{`
        .fade-in { animation: fadeIn 500ms ease both; }
        .line-grow {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: dash 900ms ease forwards;
        }
        .radial-grow {
          transition: stroke-dashoffset 900ms ease;
        }
        .bar-grow { transform: translateY(8px) scaleY(0.2); transform-origin: bottom; animation: bar 700ms ease forwards; animation-delay: var(--bar-delay, 0ms); }
        @keyframes dash { to { stroke-dashoffset: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes bar { to { transform: translateY(0) scaleY(1); } }
      `}</style>
    </div>
  );
}


