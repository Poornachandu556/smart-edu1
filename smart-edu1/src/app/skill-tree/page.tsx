"use client";
import { useGamification } from "@/hooks/useGamification";
import { useEffect, useMemo, useRef, useState } from "react";
import { updateDNAFromActivity } from "@/lib/learningDNA";
import { motion, AnimatePresence } from "framer-motion";
import { useEnrollments } from "@/hooks/useEnrollments";

const SkillTree = () => {
  const { badges, streak, stats } = useGamification();
  const { enrollments } = useEnrollments();
  const [celebrate, setCelebrate] = useState(false);
  const confettiRef = useRef<HTMLCanvasElement | null>(null);

  const skills = useMemo(() => (
    [
      { name: "Foundations", unlocked: true, progress: Math.min(100, stats.avgProgress) },
      { name: "Adaptivity", unlocked: stats.avgProgress >= 20, progress: Math.max(0, Math.min(100, stats.avgProgress - 20)) },
      { name: "Analytics", unlocked: stats.avgProgress >= 50, progress: Math.max(0, Math.min(100, stats.avgProgress - 50)) },
      { name: "Design", unlocked: stats.avgProgress >= 70, progress: Math.max(0, Math.min(100, stats.avgProgress - 70)) },
    ]
  ), [stats.avgProgress]);

  useEffect(() => { try { updateDNAFromActivity("study_session"); } catch {} }, []);

  // Celebrate when any course is completed (100%)
  useEffect(() => {
    const hasCompleted = enrollments.some(e => (e.progressPercent || 0) >= 100);
    const seen = typeof window !== 'undefined' && localStorage.getItem("smartedu-celebrated-finish") === "1";
    if (hasCompleted && !seen) {
      setCelebrate(true);
      if (typeof window !== 'undefined') localStorage.setItem("smartedu-celebrated-finish", "1");
      setTimeout(() => fireConfetti(confettiRef.current), 150);
      (async () => { try { (await import("sonner")).toast.success("Amazing! You completed a course 🎉"); } catch {} })();
    }
  }, [enrollments]);

  return (
    <div className="min-h-screen p-6 md:p-10">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-[family-name:var(--font-heading)] text-3xl font-bold">Skill Tree & Gamification</motion.h1>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card mt-6 p-6 md:p-8 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <StatPill label="Streak" value={`${streak} day${streak===1?"":"s"}`} />
          <StatPill label="Courses" value={`${stats.totalCourses}`} />
          <StatPill label="Avg Progress" value={`${stats.avgProgress}%`} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {skills.map((s, idx) => (
            <motion.div key={s.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + idx * 0.05 }} className={`relative aspect-square rounded-2xl p-4 border ${s.unlocked ? "border-primary-500/30 bg-gradient-to-br from-primary-500/10 to-accent-green/10" : "border-white/10 bg-white/5"}`}>
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className={`text-sm font-semibold mb-2 ${s.unlocked ? "" : "opacity-60"}`}>{s.name}</div>
                <ProgressCircle percent={Math.max(0, Math.min(100, Math.round(s.progress)))} unlocked={s.unlocked} />
                <div className="mt-2 text-xs opacity-70">{s.unlocked ? "Unlocked" : "Locked"}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-3 font-[family-name:var(--font-heading)] text-xl font-semibold">Badges</h2>
          {badges.length === 0 ? (
            <div className="text-sm opacity-70">No badges yet. Keep learning!</div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {badges.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04 }} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/60 px-3 py-1 text-xs text-foreground shadow-sm dark:bg-white/10">
                  <span>🏅</span>
                  <span className="font-medium">{b.label}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => downloadSummaryPNG(streak, stats, badges)} className="btn-primary">
            Download Skill Summary (PNG)
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={async () => {
              const payload = {
                daysJson: localStorage.getItem("smartedu-activity-days") || "[]",
                badgesJson: JSON.stringify(badges),
                streak,
                statsJson: JSON.stringify(stats),
              };
              await fetch("/api/user-activity", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
              try { (await import("sonner")).toast.success("Progress saved to your account"); } catch {}
            }}
            className="btn-secondary">
            Save Progress to Account
          </motion.button>
        </div>

        {/* Celebration overlay */}
        <canvas ref={confettiRef} className="pointer-events-none absolute inset-0 hidden" />
        <AnimatePresence>
          {celebrate && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="m-4 w-full max-w-md rounded-2xl border border-white/20 bg-white/90 p-6 text-center shadow-xl backdrop-blur dark:bg-white/10">
                <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} className="text-5xl mb-3">🎉</motion.div>
                <h3 className="text-xl font-semibold mb-2">Congratulations!</h3>
                <p className="text-sm opacity-80 mb-4">You completed a course. Keep the momentum going—new skills are unlocking!</p>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setCelebrate(false)} className="btn-primary w-full">Awesome!</motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default SkillTree;

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm shadow-sm">
      <span className="opacity-70 mr-1">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function ProgressCircle({ percent, unlocked }: { percent: number; unlocked: boolean }) {
  const size = 88; const stroke = 8; const r = (size - stroke) / 2; const c = 2 * Math.PI * r; const dash = c - (percent / 100) * c;
  return (
    <svg width={size} height={size} className="drop-shadow-sm">
      <circle cx={size/2} cy={size/2} r={r} stroke="currentColor" className="text-white/15" strokeWidth={stroke} fill="transparent" />
      <motion.circle cx={size/2} cy={size/2} r={r} stroke={unlocked ? "#2a8cff" : "#6b7280"} strokeLinecap="round" strokeWidth={stroke} fill="transparent" strokeDasharray={c} animate={{ strokeDashoffset: dash }} transition={{ duration: 1, ease: "easeOut" }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className={`text-xs ${unlocked ? "fill-white" : "fill-white/70"}`}>{percent}%</text>
    </svg>
  );
}

function fireConfetti(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d"); if (!ctx) return;
  canvas.classList.remove("hidden");
  const W = canvas.width = canvas.offsetWidth; const H = canvas.height = canvas.offsetHeight;
  const pieces = Array.from({ length: 120 }, () => ({ x: Math.random()*W, y: -20 - Math.random()*80, s: 6 + Math.random()*8, vy: 2 + Math.random()*2, vx: -1 + Math.random()*2, c: `hsl(${Math.floor(Math.random()*360)},90%,60%)` }));
  let frame = 0; const max = 160;
  const tick = () => { ctx.clearRect(0,0,W,H); pieces.forEach(p => { p.x += p.vx; p.y += p.vy; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.s, p.s); }); frame++; if (frame < max) requestAnimationFrame(tick); else canvas.classList.add("hidden"); };
  requestAnimationFrame(tick);
}

function downloadSummaryPNG(streak: number, stats: any, badges: any[]) {
  const canvas = document.createElement("canvas"); canvas.width = 1000; canvas.height = 600; const ctx = canvas.getContext("2d"); if (!ctx) return;
  ctx.fillStyle = "#0b1220"; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#ffffff"; ctx.font = "bold 32px system-ui"; ctx.fillText("SmartEdu — Skill Summary", 40, 60);
  ctx.font = "18px system-ui"; ctx.fillText(`Streak: ${streak} day${streak===1?"":"s"}`, 40, 100); ctx.fillText(`Courses: ${stats.totalCourses}`, 40, 130); ctx.fillText(`Average Progress: ${stats.avgProgress}%`, 40, 160);
  const barX = 40, barY = 190, barW = 400, barH = 14; ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillRect(barX, barY, barW, barH); ctx.fillStyle = "#2a8cff"; ctx.fillRect(barX, barY, (stats.avgProgress/100)*barW, barH);
  ctx.fillStyle = "#ffffff"; ctx.font = "bold 22px system-ui"; ctx.fillText("Badges", 40, 240); ctx.font = "18px system-ui"; const startY = 270; badges.slice(0, 10).forEach((b, i) => { const y = startY + i * 28; ctx.fillText(`🏅 ${b.label}`, 40, y); }); ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.font = "14px system-ui"; ctx.fillText(new Date().toLocaleString(), 40, 560);
  const url = canvas.toDataURL("image/png"); const a = document.createElement("a"); a.href = url; a.download = "smartedu-skill-summary.png"; a.click();
}


