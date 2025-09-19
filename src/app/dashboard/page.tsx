"use client";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Task = { id: number; title: string; done: boolean };

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
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
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Hi Alex 👋, ready to continue your journey?</h1>
            <p className="text-sm opacity-70">We suggest you revise Algebra today.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-white/20 px-3 py-2">🔔</button>
            <ThemeToggle />
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white">A</div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
            <p className="mb-2 text-sm opacity-70">Upcoming</p>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Math Quiz - Friday</li>
              <li>Science Project - Monday</li>
            </ul>
          </div>
        </div>

        <h2 className="mt-8 mb-3 font-[family-name:var(--font-heading)] text-xl font-semibold">Active Courses</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["Algebra Basics","Physics 101","World History"].map((c) => (
            <div key={c} className="card p-4">
              <div className="h-28 rounded-xl bg-gradient-to-br from-primary-300 to-primary-700"/>
              <div className="mt-3">
                <p className="font-medium">{c}</p>
                <div className="mt-2 h-2 w-full rounded-full bg-white/30">
                  <div className="h-2 w-1/2 rounded-full bg-accent-green" />
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>50% completed</span>
                  <a href="/course" className="text-primary-600">Continue →</a>
                </div>
              </div>
            </div>
          ))}
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


