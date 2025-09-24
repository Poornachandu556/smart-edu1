"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSuggestion, loadDNA, resetDNA as resetStoredDNA, saveDNA as persistDNA, updateDNAFromActivity } from "@/lib/learningDNA";

export default function LearningDNA() {
  const [visual, setVisual] = useState(60);
  const [auditory, setAuditory] = useState(30);
  const [reading, setReading] = useState(40);
  const [kinesthetic, setKinesthetic] = useState(30);
  const [suggested, setSuggested] = useState("Prefer visuals: diagrams & short videos.");

  useEffect(() => {
    try {
      const s = loadDNA();
      setVisual(s.visual ?? 60);
      setAuditory(s.auditory ?? 30);
      setReading(s.reading ?? 40);
      setKinesthetic(s.kinesthetic ?? 30);
      setSuggested(getSuggestion(s));
    } catch {}
  }, []);

  function saveDNA() {
    const data = persistDNA({ visual, auditory, reading, kinesthetic });
    setSuggested(getSuggestion(data));
    toast.success("Learning DNA saved");
  }

  function resetDNA() {
    setVisual(60);
    setAuditory(30);
    setReading(40);
    setKinesthetic(30);
    resetStoredDNA();
    setSuggested(getSuggestion({ visual: 60, auditory: 30, reading: 40, kinesthetic: 30 }));
    toast("Assessment reset", { description: "Defaults restored" });
  }
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Learning DNA</h1>
        <div className="flex items-center gap-3">
          <a
            href="https://pythontutor.com/visualize.html#mode=edit"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            onClick={() => {
              try { updateDNAFromActivity("visual"); setSuggested(getSuggestion(loadDNA())); } catch {}
            }}
          >
            Code Visualizer
          </a>
          <a
            href="https://www.programiz.com/online-compiler/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10"
            onClick={() => {
              try { updateDNAFromActivity("kinesthetic"); setSuggested(getSuggestion(loadDNA())); } catch {}
            }}
          >
            Run Code
          </a>
        </div>
      </div>
      <div className="card mt-6 p-6">
        <h2 className="text-xl font-semibold">Quick Assessment</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block">Visual</label>
            <input type="range" min={0} max={100} value={visual} onChange={(e) => setVisual(parseInt(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="mb-2 block">Auditory</label>
            <input type="range" min={0} max={100} value={auditory} onChange={(e) => setAuditory(parseInt(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="mb-2 block">Reading</label>
            <input type="range" min={0} max={100} value={reading} onChange={(e) => setReading(parseInt(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="mb-2 block">Kinesthetic</label>
            <input type="range" min={0} max={100} value={kinesthetic} onChange={(e) => setKinesthetic(parseInt(e.target.value))} className="w-full" />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button onClick={saveDNA} className="btn-primary">Save DNA</button>
          <button onClick={resetDNA} className="rounded-xl border border-white/20 px-4 py-2">Reset</button>
        </div>
        <div className="mt-6 text-sm">
          <p className="font-medium">Suggested delivery:</p>
          <p className="opacity-80">{suggested}</p>
          <p className="mt-2 opacity-70">Visual:{visual} Auditory:{auditory} Reading:{reading} Kin:{kinesthetic}</p>
        </div>
      </div>
    </div>
  );
}


