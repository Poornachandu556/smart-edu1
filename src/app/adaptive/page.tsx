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
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/60 p-5 text-sm dark:bg-white/5">
          {mode === "Text" && <p>This module explains adaptive algorithms…</p>}
          {mode === "Video" && <div className="aspect-video w-full rounded-xl bg-black/80" />}
          {mode === "Quiz" && <p>Quiz placeholder…</p>}
          {mode === "Diagram" && <div className="h-48 w-full rounded-xl bg-gradient-to-br from-primary-200 to-primary-500" />}
        </div>
      </div>
    </div>
  );
}


