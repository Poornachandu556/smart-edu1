"use client";
import FloatingChatbot from "@/components/FloatingChatbot";
import { motion } from "framer-motion";
import { useState } from "react";

export default function TutorPage() {
  const [isOpen, setIsOpen] = useState(false);
  // If navigated with ?open=1, open the floating chat automatically
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("open") === "1" && !isOpen) {
      setIsOpen(true);
      try { window.dispatchEvent(new CustomEvent('open-ai-tutor')); } catch {}
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-[family-name:var(--font-heading)] text-4xl font-bold mb-4"
          >
            AI Tutor
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl opacity-80 mb-8"
          >
            Your personal learning assistant is here to help you understand any concept
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="card p-6 text-center"
          >
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="font-semibold mb-2">Smart AI Assistant</h3>
            <p className="text-sm opacity-70">Get instant help with any programming or technical concept</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="card p-6 text-center"
          >
            <div className="text-4xl mb-4">💡</div>
            <h3 className="font-semibold mb-2">Learning Guidance</h3>
            <p className="text-sm opacity-70">Personalized explanations and step-by-step solutions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="card p-6 text-center"
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-semibold mb-2">Practice Problems</h3>
            <p className="text-sm opacity-70">Get hands-on exercises to reinforce your learning</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center"
        >
          <div className="card p-8 max-w-2xl mx-auto">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold mb-4">
              Ready to Learn?
            </h2>
            <p className="opacity-80 mb-6">
              Click the floating AI tutor button in the bottom right corner to start your conversation. 
              Ask about any programming language, concept, or get help with your coursework.
            </p>
            <motion.button
              onClick={() => {
                setIsOpen(true);
                try { window.dispatchEvent(new CustomEvent('open-ai-tutor')); } catch {}
              }}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Chatting with AI Tutor
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12"
        >
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-6 text-center">
            What You Can Ask
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Explain JavaScript closures",
              "How do React hooks work?",
              "What is Big O notation?",
              "Help me understand Python decorators",
              "Explain database normalization",
              "How to implement binary search?",
              "What are design patterns?",
              "Help with CSS Grid layout"
            ].map((example, index) => (
              <motion.div
                key={example}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                <p className="text-sm">💬 "{example}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <FloatingChatbot />
    </div>
  );
}


