"use client";
import { useState } from "react";

const TABS = ["Notes & Resources", "Discussion", "AI Tutor Help"] as const;

export default function CoursePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Notes & Resources");
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Algebra Basics</h1>
          <div className="text-sm opacity-70">Progress: 40%</div>
        </div>

        <div className="rounded-2xl bg-black/90 p-2">
          <video controls className="aspect-video w-full rounded-xl bg-black">
            {/* Use a placeholder video URL or remove source to avoid empty src warning */}
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-2 w-2/5 bg-primary-600" />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm ${tab === t ? "bg-primary-600 text-white" : "border border-white/20 hover:bg-white/50 dark:hover:bg-white/10"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === "Notes & Resources" && (
            <div className="card p-4">
              <p className="mb-2 font-medium">Downloadable PDFs</p>
              <ul className="space-y-2 text-sm">
                <li><a className="text-primary-600" href="#">Lecture Notes - Ch 1.pdf</a></li>
                <li><a className="text-primary-600" href="#">Practice Set - Algebra Intro.pdf</a></li>
              </ul>
            </div>
          )}
          {tab === "Discussion" && (
            <div className="card space-y-3 p-4">
              {[1,2].map((i) => (
                <div key={i} className="rounded-xl border border-white/10 p-3">
                  <p className="text-sm font-medium">How to solve linear equations?</p>
                  <div className="mt-1 text-xs opacity-70">12 upvotes · 4 answers</div>
                </div>
              ))}
              <button className="btn-primary">Ask a question</button>
            </div>
          )}
          {tab === "AI Tutor Help" && (
            <div className="card p-4">
              <p className="mb-2">Ask me anything about this video</p>
              <div className="flex items-center gap-2">
                <input placeholder="Explain in simple terms" className="flex-1 rounded-full border border-white/20 bg-transparent px-4 py-3 outline-none" />
                <button className="btn-primary">Send</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


