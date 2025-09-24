"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = { id: number; role: "user" | "assistant"; text: string };

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatBodyRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Seed a friendly welcome message when opening the chat for the first time
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          text:
            "Hi! I’m your AI tutor. Tell me what you’re learning and your current level, and I’ll tailor my help. You can ask for explanations, examples, or quick practice questions. How can I help today?",
        },
      ]);
      // Focus input shortly after opening
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Allow external pages to open the chatbot: window.dispatchEvent(new CustomEvent('open-ai-tutor'))
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-ai-tutor", handler as EventListener);
    return () => window.removeEventListener("open-ai-tutor", handler as EventListener);
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, typing]);
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const id = Date.now();
    const userText = input.trim();
    setMessages((prev) => [...prev, { id, role: "user", text: userText }]);
    setInput("");
    setTyping(true);
    setError(null);
    
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a warm, encouraging AI tutor for SmartEdu. Always answer in a CLEAR, STRUCTURED format using the following sections exactly in order (omit a section only if irrelevant):\n\n1) Summary – 1-2 sentences.\n2) Key Concepts – 3-6 bullet points.\n3) Step-by-step – short numbered steps.\n4) Example – concise code block or worked example.\n5) Practice – 1-2 short practice tasks.\n6) Next Steps – 2-3 suggestions.\n\nRules: Use simple language. Keep each section brief. Prefer bullets/numbered lists. Use fenced code blocks for code (```<lang> ... ```). End with a short follow-up question. Avoid fluff and avoid long paragraphs unless the user explicitly asks for detail." },
            ...messages
              .filter((m) => m.role !== "assistant" || !m.text.startsWith("Hi! I’m your AI tutor."))
              .slice(-10) // limit context to last 10 user/assistant turns
              .map((m) => ({ role: m.role, content: m.text })),
            { role: "user", content: userText },
          ],
        }),
      });
      // Try to parse response body even on non-OK to surface server error details
      let data: any = null;
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        const serverError = data?.error || `HTTP error! status: ${res.status}`;
        throw new Error(serverError);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const text = data?.text || "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { id: id + 1, role: "assistant", text }]);
    } catch (e) {
      console.error("AI Tutor Error:", e);
      const errorMessage = e instanceof Error ? e.message : "There was a network error. Please try again.";
      setError(errorMessage);
      setMessages((prev) => [...prev, { id: id + 1, role: "assistant", text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Regenerate the last assistant response using the last user message
  const regenerate = async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      setInput(lastUser.text);
      await handleSendMessage();
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl shadow-primary-600/30 hover:scale-105 transition-transform"
        aria-label="Open AI Tutor"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          scale: [1, 1.05, 1],
          transition: { duration: 2, repeat: Infinity, repeatDelay: 3 }
        }}
      >
        <span className="text-2xl">🤖</span>
      </motion.button>
      
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-black/20" 
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-tutor-title"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="m-4 w-full max-w-md rounded-2xl border border-white/20 bg-white/90 p-4 backdrop-blur dark:bg-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span id="ai-tutor-title" className="text-xl font-semibold">AI Tutor</span>
                  <span className="rounded-full bg-accent-green/20 px-2 py-0.5 text-xs text-accent-green font-medium">
                    {typing ? "thinking..." : "online"}
                  </span>
                </div>
                <button 
                  onClick={() => setOpen(false)} 
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/60 dark:hover:bg-white/20 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div ref={chatBodyRef} className="card h-72 overflow-auto p-3 text-sm">
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="opacity-80 mb-3">Hi! I'm your AI tutor. How can I help you learn today?</p>
                    <p className="opacity-70 text-xs mb-3">Suggested prompts:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Explain JavaScript basics", "Give me practice problems", "Help with React concepts", "Explain algorithms"].map((t) => (
                        <button 
                          key={t} 
                          onClick={() => setInput(t)} 
                          className="rounded-full border border-white/20 px-3 py-1 text-xs hover:bg-white/50 dark:hover:bg-white/20 transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                <div className="space-y-2">
                  <AnimatePresence>
                    {messages.map((m, index) => (
                      <motion.div 
                        key={m.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${m.role === "user" ? "text-right" : "text-left"}`}
                      >
                        <span className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user" 
                          ? "bg-primary-600 text-white"
                          : "bg-white text-foreground shadow-sm dark:bg-white/10 dark:text-white/90 border border-white/10"}`}>
                          {m.text}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {typing && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-left"
                    >
                      <span className="inline-flex items-center gap-1 rounded-2xl bg-white/60 px-3 py-2 text-xs dark:bg-white/10">
                        <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/70" />
                        <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/70 [animation-delay:150ms]" />
                        <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/70 [animation-delay:300ms]" />
                      </span>
                    </motion.div>
                  )}
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-left"
                    >
                      <span className="inline-block max-w-[85%] rounded-2xl px-3 py-2 bg-red-500/20 text-red-500 text-xs">
                        ⚠️ {error}
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
              
              <div className="mt-3 flex items-center gap-2">
                <input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me any question..." 
                  className="flex-1 rounded-full border border-white/20 bg-transparent px-4 py-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all" 
                  disabled={typing}
                  ref={inputRef}
                />
                <motion.button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || typing}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {typing ? "..." : "Send"}
                </motion.button>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-xs opacity-70">
                <div className="flex items-center gap-2">
                  <button onClick={regenerate} className="rounded-full border border-white/20 px-2 py-1 hover:bg-white/10 transition-colors">🔁 Regenerate</button>
                </div>
                <button 
                  onClick={() => setMessages([])}
                  className="text-xs opacity-60 hover:opacity-100 transition-opacity"
                >
                  Clear chat
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


