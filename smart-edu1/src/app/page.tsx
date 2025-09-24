"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChatbot from "@/components/FloatingChatbot";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { courses } from "@/data/courses";
import { useEnrollments } from "@/hooks/useEnrollments";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const { enrollments } = useEnrollments();
  const active = useMemo(() => enrollments.map(e => ({
    ...e,
    course: courses.find(c=>c.id===e.courseId)
  })).filter((x): x is typeof x & { course: NonNullable<typeof x.course> } => Boolean(x.course)), [enrollments]);
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative gradient-hero pt-28 animate-gradientShift">
          <div className="hero-overlay" />
          <div className="container-px mx-auto py-20 text-center text-white relative">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-extrabold leading-tight sm:text-5xl">
              AI-Powered Smart Education for the Digital Age
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="mx-auto mt-4 max-w-2xl text-white/90">
              Personalized learning, AI tutors, progress tracking – all in one place.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="mt-8 flex items-center justify-center gap-3">
              {status === "unauthenticated" && (
                <a href="/signup" className="btn-primary hover:shadow-2xl">Start Learning Free</a>
              )}
              {status === "unauthenticated" && (
                <a href="/login" className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-white/90 transition hover:-translate-y-0.5 hover:bg-white/20">Sign In</a>
              )}
              {status === "authenticated" && (
                <a href="/dashboard" className="btn-primary hover:shadow-2xl">Go to Dashboard</a>
              )}
            </motion.div>
            {/* Feature cards removed as requested */}
          </div>
        </section>

        {status === "authenticated" && active.length > 0 && (
          <section className="container-px mx-auto py-12 animate-fadeIn">
            <h2 className="mb-3 font-[family-name:var(--font-heading)] text-2xl font-semibold">Continue learning</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {active.slice(0,6).map((a) => (
                <div key={a.courseId} className="card p-4">
                  <div className="relative h-28 w-full overflow-hidden rounded-xl">
                    <Image src={a.course.image} alt={a.course.title} fill className="object-cover" />
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{a.course.title}</p>
                      <div className="mt-2 h-2 w-full rounded-full bg-white/30">
                        <div className="h-2 rounded-full bg-accent-green" style={{ width: `${a.progressPercent}%` }} />
                      </div>
                      <div className="mt-1 text-xs opacity-70">{a.progressPercent}% completed</div>
                    </div>
                    <Link href={`/courses/${a.course.id}`} className="btn-primary whitespace-nowrap">Continue</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        <section className="container-px mx-auto py-16 animate-fadeIn">
          <h2 className="mb-6 text-center font-[family-name:var(--font-heading)] text-2xl font-semibold">What learners say</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                initials: "NR",
                name: "Nisha R.",
                role: "Frontend Developer",
                quote:
                  "SmartEdu turned my learning routine into a habit. I landed my first React job in 6 weeks.",
              },
              {
                initials: "AK",
                name: "Arjun K.",
                role: "CS Undergrad",
                quote:
                  "The bite-sized lessons and clear roadmaps cut my study time in half without losing depth.",
              },
              {
                initials: "MA",
                name: "Maria A.",
                role: "Career Switcher",
                quote:
                  "From zero to building full-stack projects. The progress tracking kept me motivated daily.",
              },
              {
                initials: "JT",
                name: "James T.",
                role: "Data Analyst",
                quote:
                  "Loved the curated playlists and practical exercises. I finally ‘got’ TypeScript.",
              },
              {
                initials: "SK",
                name: "Sana K.",
                role: "Student",
                quote:
                  "The clean UI and structured paths make studying feel effortless—and actually fun.",
              },
              {
                initials: "DV",
                name: "Dinesh V.",
                role: "Backend Engineer",
                quote:
                  "Short, actionable lessons. Real momentum. SmartEdu is the study partner I needed.",
              },
            ].map((t) => (
              <div key={t.name} className="card p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white">{t.initials}</div>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs opacity-70">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm opacity-90">{t.quote}</p>
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
