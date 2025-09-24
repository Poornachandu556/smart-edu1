"use client";
import { useState } from "react";

export default function AdaptiveModule() {
  const [mode, setMode] = useState<"Text" | "Video" | "Quiz" | "Diagram">("Text");
  return (
    <div className="min-h-screen p-6 md:p-10">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Adaptive Algorithms</h1>
      <div className="card mt-6 p-6">
        <div className="flex flex-wrap gap-2">
          {["Text","Video","Quiz","Diagram"].map((m) => (
            <button key={m} onClick={() => setMode(m as any)} className={`rounded-xl px-4 py-2 ${mode===m?"bg-primary-600 text-white":"border border-white/20"}`}>{m}</button>
          ))}
          <button className="ml-auto rounded-xl border border-white/20 px-4 py-2">Mark Complete</button>
        </div>
        <div className="mt-6 rounded-2xl border border-white/15 bg-white p-5 text-sm text-foreground shadow-sm dark:bg-white/5">
          {mode === "Text" && (
            <div className="space-y-3">
              <p className="opacity-90">This module adapts to your style. Choose below to learn via text, videos, quick quizzes, or diagrams.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="font-medium">Concept summary:</span> short explanation with examples.</li>
                <li><span className="font-medium">Practice prompt:</span> try a quick exercise.</li>
                <li><span className="font-medium">Next step:</span> what to study after this.</li>
              </ul>
            </div>
          )}
          {mode === "Video" && (
            <div>
              <div className="video-container mb-3">
                <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Learning Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              <p className="opacity-80">Suggested video: Intro to adaptive strategies. Watch 3–5 minutes, then try the quiz.</p>
            </div>
          )}
          {mode === "Quiz" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-white/20 p-4 dark:border-white/10">
                <p className="font-medium mb-2">Quick check</p>
                <p className="mb-3">Which approach best adapts difficulty based on user performance?</p>
                <div className="flex flex-col gap-2">
                  {['Fixed sequence','Random order','Adaptive path with feedback','Repeat last lesson'].map((q) => (
                    <label key={q} className="inline-flex items-center gap-2">
                      <input type="radio" name="q1" />
                      <span>{q}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          {mode === "Diagram" && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary-200/60 to-primary-500/40 text-foreground">
              <p className="font-medium mb-2">Flow</p>
              <p className="opacity-80">Learn → Check understanding → Adjust difficulty → Repeat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


