"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChatbot from "@/components/FloatingChatbot";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero pt-28 animate-gradientShift">
          <div className="container-px mx-auto py-20 text-center text-white">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-extrabold leading-tight sm:text-5xl">
              AI-Powered Smart Education for the Digital Age
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="mx-auto mt-4 max-w-2xl text-white/85">
              Personalized learning, AI tutors, progress tracking – all in one place.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="mt-8 flex items-center justify-center gap-3">
              <a href="/signup" className="btn-primary hover:shadow-2xl">Start Learning Free</a>
              <a href="/login" className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-white/90 transition hover:-translate-y-0.5 hover:bg-white/20">Sign Up Now</a>
            </motion.div>
            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { title: "AI Tutor", emoji: "🤖" },
                { title: "Progress Dashboard", emoji: "📊" },
                { title: "Interactive Courses", emoji: "🎥" },
                { title: "Rewards & Certificates", emoji: "🏆" },
              ].map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }} className="card flex items-center gap-2 p-4 text-left transition hover:-translate-y-1 hover:shadow-lg">
                  <span className="text-2xl">{f.emoji}</span>
                  <span className="font-medium text-foreground">{f.title}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container-px mx-auto py-16 animate-fadeIn">
          <h2 className="mb-6 text-center font-[family-name:var(--font-heading)] text-2xl font-semibold">What learners say</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white">A{i}</div>
                  <div>
                    <p className="font-medium">Alex {i}</p>
                    <p className="text-xs opacity-70">Student</p>
                  </div>
                </div>
                <p className="text-sm opacity-90">SmartEdu helped me stay consistent and actually enjoy studying. The AI tutor is amazing!</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingChatbot />
    </div>
  );
}
