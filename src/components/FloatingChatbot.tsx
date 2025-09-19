"use client";
import { useState } from "react";

type Message = { id: number; role: "user" | "assistant"; text: string };

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl shadow-primary-600/30 hover:scale-105 transition-transform"
        aria-label="Open AI Tutor"
      >
        <span className="text-2xl">🤖</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-black/20" onClick={() => setOpen(false)}>
          <div
            className="m-4 w-full max-w-md rounded-2xl border border-white/20 bg-white/90 p-4 backdrop-blur dark:bg-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">AI Tutor</span>
                <span className="rounded-full bg-accent-green/20 px-2 py-0.5 text-xs text-accent-green">online</span>
              </div>
              <button onClick={() => setOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/60 dark:hover:bg-white/20">✕</button>
            </div>
            <div className="card h-72 overflow-auto p-3 text-sm">
              {messages.length === 0 && (
                <div>
                  <p className="opacity-80">Suggested prompts:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Explain in simple terms","Give practice problems","Summarize this chapter"].map((t) => (
                      <button key={t} onClick={() => setInput(t)} className="rounded-full border border-white/20 px-3 py-1 text-xs hover:bg-white/50 dark:hover:bg-white/20">{t}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {messages.map((m) => (
                  <div key={m.id} className={`${m.role === "user" ? "text-right" : "text-left"}`}>
                    <span className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 ${m.role === "user" ? "bg-primary-600 text-white" : "bg-white/60 dark:bg-white/10"}`}>{m.text}</span>
                  </div>
                ))}
                {typing && (
                  <div className="text-left">
                    <span className="inline-flex items-center gap-1 rounded-2xl bg-white/60 px-3 py-2 text-xs dark:bg-white/10">
                      <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/70" />
                      <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/70 [animation-delay:150ms]" />
                      <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/70 [animation-delay:300ms]" />
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me any question" className="flex-1 rounded-full border border-white/20 bg-transparent px-4 py-3 outline-none" />
              <button onClick={async () => {
                if (!input.trim()) return;
                const id = Date.now();
                const userText = input.trim();
                setMessages((prev) => [...prev, { id, role: "user", text: userText }]);
                setInput("");
                setTyping(true);
                try {
                  const res = await fetch("/api/ai", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                      messages: [
                        { role: "system", content: "You are a friendly AI tutor. Provide concise explanations, simple steps, and 2 practice problems when helpful." },
                        ...messages.map((m) => ({ role: m.role, content: m.text })),
                        { role: "user", content: userText },
                      ],
                    }),
                  });
                  const data = await res.json();
                  const text = data?.text || "Sorry, I couldn’t generate a response.";
                  setMessages((prev) => [...prev, { id: id + 1, role: "assistant", text }]);
                } catch (e) {
                  setMessages((prev) => [...prev, { id: id + 1, role: "assistant", text: "There was a network error. Please try again." }]);
                } finally {
                  setTyping(false);
                }
              }} className="btn-primary">Send</button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
              <button className="rounded-full border border-white/20 px-2 py-1">🎙 Voice</button>
              <button className="rounded-full border border-white/20 px-2 py-1">🔊 AI Voice</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


