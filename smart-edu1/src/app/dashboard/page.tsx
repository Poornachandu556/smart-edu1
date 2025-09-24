"use client";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { courses } from "@/data/courses";
import { useEnrollments } from "@/hooks/useEnrollments";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type Task = { id: number; title: string; done: boolean };

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const featured = courses[0];
  const { isEnrolled, enroll, enrollments } = useEnrollments();
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("smartedu:tasks");
      if (raw) setTasks(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("smartedu:tasks", JSON.stringify(tasks));
  }, [tasks]);
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">
              Hi {session?.user?.name || 'User'} 👋, ready to continue your journey?
            </h1>
            <p className="text-sm opacity-70">
              Welcome back! {session?.user?.email && `Logged in as ${session.user.email}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn-primary">Go to main page</Link>
            <button className="rounded-full border border-white/20 px-3 py-2">🔔</button>
            <ThemeToggle />
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="mb-6 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold">Profile Information</h2>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 text-sm bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Logout
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white text-lg font-semibold">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="font-medium">{session?.user?.name || 'User'}</p>
                <p className="text-sm opacity-70">{session?.user?.email || 'No email provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-green/20 text-accent-green">
                📧
              </div>
              <div>
                <p className="font-medium">Email Verified</p>
                <p className="text-sm opacity-70">{(session?.user as any)?.emailVerified ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
                🔐
              </div>
              <div>
                <p className="font-medium">Account Status</p>
                <p className="text-sm opacity-70">Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="card p-0 md:col-span-3 overflow-hidden">
            <div className="relative h-40 w-full">
              <Image src={featured.image} alt={featured.title} fill className="object-cover opacity-90" />
            </div>
            <div className="p-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2"><span className="rounded-full bg-primary-600/15 px-2 py-0.5 text-xs text-primary-700">Featured</span></div>
                <h2 className="mt-1 font-[family-name:var(--font-heading)] text-xl font-semibold">{featured.title}</h2>
                <p className="text-sm opacity-80">{featured.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/courses/${featured.id}`} className="rounded-xl border border-white/30 px-3 py-2">Details</Link>
                {isEnrolled(featured.id) ? (
                  <Link href={`/courses/${featured.id}`} className="btn-primary">Continue</Link>
                ) : (
                  featured.id !== "js-fundamentals" ? (
                    <Link href="/" className="btn-primary">Add</Link>
                  ) : null
                )}
              </div>
            </div>
          </div>
          <div className="card p-5">
            <p className="mb-2 text-sm opacity-70">Overall Progress</p>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20">
                <svg viewBox="0 0 36 36" className="h-20 w-20">
                  <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="65, 100" className="text-primary-600" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">65%</div>
              </div>
              <div>
                <p className="text-sm">Great job! Keep the streak going.</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <p className="mb-2 text-sm opacity-70">AI Recommendation</p>
            <p>Focus on Algebra - Chapter 2 today. Try 5 practice problems.</p>
          </div>
          <div className="card p-5">
            <h3 className="mb-2 font-[family-name:var(--font-heading)] text-lg font-semibold">AI Tutor</h3>
            <p className="text-sm opacity-80">Get instant help from your AI tutor.</p>
            <div className="mt-3">
              <Link href="/tutor?open=1" className="btn-primary">
                Start Chatting with AI Tutor
              </Link>
            </div>
          </div>
          <div className="card p-5">
            <p className="mb-2 text-sm opacity-70">Upcoming</p>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Math Quiz - Friday</li>
              <li>Science Project - Monday</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 mb-3 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold">Active Courses</h2>
          <Link href="/dashboard/courses" className="text-sm text-primary-600 hover:text-primary-500 transition-colors">
            View All My Courses →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.length === 0 && (
            <div className="col-span-full text-sm opacity-70">No active courses yet. Explore courses and enroll to see them here.</div>
          )}
          {enrollments.map((e) => {
            const course = courses.find((c) => c.id === e.courseId);
            if (!course) return null;
            return (
              <div key={e.id} className="card p-4">
                <div className="relative h-28 w-full overflow-hidden rounded-xl">
                  <Image src={course.image} alt={course.title} fill className="object-cover" />
                </div>
                <div className="mt-3">
                  <p className="font-medium">{course.title}</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-white/30">
                    <div className="h-2 rounded-full bg-accent-green" style={{ width: `${e.progressPercent}%` }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span>{e.progressPercent}% completed</span>
                    <Link href={`/courses/${course.id}`} className="text-primary-600">Continue →</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="mt-8 mb-3 font-[family-name:var(--font-heading)] text-xl font-semibold">Tasks</h2>
        <div className="card p-4">
          <div className="mb-3 flex items-center gap-2">
            <input value={newTask} onChange={(e)=>setNewTask(e.target.value)} placeholder="Add a new task" className="flex-1 rounded-xl border border-white/20 bg-transparent px-4 py-2 outline-none" />
            <button onClick={()=>{ if(!newTask.trim()) return; setTasks(prev=>[...prev,{ id: Date.now(), title: newTask.trim(), done:false }]); setNewTask(""); toast.success("Task added"); }} className="btn-primary">Add</button>
          </div>
          <ul className="space-y-2">
            {tasks.map(t=> (
              <li key={t.id} className="flex items-center gap-2">
                <input type="checkbox" checked={t.done} onChange={()=> setTasks(prev=> prev.map(p=> p.id===t.id? { ...p, done: !p.done }: p))} />
                <span className={`flex-1 ${t.done?"line-through opacity-60":""}`}>{t.title}</span>
                <button onClick={()=> setTasks(prev=> prev.filter(p=> p.id!==t.id))} className="rounded-full border border-white/20 px-3 py-1 text-xs">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


