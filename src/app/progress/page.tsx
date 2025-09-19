"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProgressPage() {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);
  return (
    <div className="min-h-screen p-6 md:p-10">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Progress & Analytics</h1>
      <p className="text-sm opacity-70">Track your daily study time, accuracy, and strengths.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <p className="mb-2 font-medium">Daily study time (hrs)</p>
          <svg viewBox="0 0 300 120" className="h-48 w-full">
            <polyline fill="none" stroke="url(#g1)" strokeWidth="3" points="0,90 40,80 80,60 120,70 160,50 200,40 240,45 280,30" />
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#86c1ff" />
                <stop offset="100%" stopColor="#0f74f0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="card p-5">
          <p className="mb-2 font-medium">Accuracy % in quizzes</p>
          <svg viewBox="0 0 120 120" className="h-48 w-full">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle cx="60" cy="60" r="54" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray="226" strokeDashoffset="68" strokeLinecap="round" />
            <text x="60" y="66" textAnchor="middle" className="fill-current">70%</text>
          </svg>
        </div>
        <div className="card p-5">
          <p className="mb-2 font-medium">Strong vs weak topics</p>
          <svg viewBox="0 0 300 120" className="h-48 w-full">
            <rect x="20" y="40" width="30" height="60" fill="#22c55e" />
            <rect x="70" y="60" width="30" height="40" fill="#f59e0b" />
            <rect x="120" y="30" width="30" height="70" fill="#22c55e" />
            <rect x="170" y="70" width="30" height="30" fill="#f59e0b" />
            <rect x="220" y="35" width="30" height="65" fill="#22c55e" />
          </svg>
        </div>
        <div className="card p-5">
          <p className="mb-2 font-medium">Class average comparison</p>
          <svg viewBox="0 0 300 120" className="h-48 w-full">
            <line x1="20" y1="90" x2="280" y2="30" stroke="#2a8cff" strokeWidth="3" />
            <line x1="20" y1="95" x2="280" y2="50" stroke="#94a3b8" strokeWidth="3" />
            <text x="22" y="20" className="fill-current text-xs">You vs Class</text>
          </svg>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button onClick={()=>{
          const rows = [
            ["metric","value"],
            ["daily_hours","2.5"],
            ["accuracy","0.70"],
          ];
          const csv = rows.map(r=> r.join(",")).join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "smartedu-progress.csv"; a.click();
          URL.revokeObjectURL(url);
        }} className="rounded-full border border-white/20 px-4 py-3">Export CSV</button>
        <button onClick={()=> window.print()} className="btn-primary">Print to PDF</button>
      </div>
    </div>
  );
}


