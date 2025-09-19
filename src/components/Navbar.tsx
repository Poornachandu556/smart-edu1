"use client";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-px mx-auto">
        <nav className="mt-4 flex items-center justify-between rounded-full border border-white/20 bg-white/70 p-2 pl-4 pr-2 backdrop-blur dark:bg-white/10">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white">SE</span>
            <span className="font-[family-name:var(--font-heading)] text-lg font-semibold">SmartEdu</span>
          </Link>
          <div className="hidden items-center gap-6 sm:flex">
            <Link href="/courses" className="hover:opacity-80">Courses</Link>
            <Link href="/dna" className="hover:opacity-80">Learning DNA</Link>
            <Link href="/adaptive" className="hover:opacity-80">Adaptive Module</Link>
            <Link href="/skill-tree" className="hover:opacity-80">Skill Tree</Link>
            <Link href="/community" className="hover:opacity-80">Community</Link>
            <Link href="/progress" className="hover:opacity-80">Analytics</Link>
            <Link href="/dashboard" className="btn-primary">Start Learning</Link>
            <ThemeToggle />
            {session?.user ? (
              <>
                <span className="text-sm opacity-80">{session.user.name}</span>
                <button onClick={()=> signOut()} className="rounded-full border border-white/20 px-3 py-2">Sign out</button>
              </>
            ) : (
              <Link href="/login" className="rounded-full border border-white/20 px-3 py-2">Sign in</Link>
            )}
          </div>
          <button aria-label="Open menu" onClick={() => setOpen((v) => !v)} className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/50 dark:hover:bg-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-foreground"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </nav>
        {open && (
          <div className="mx-2 mt-2 rounded-2xl border border-white/20 bg-white/70 p-2 backdrop-blur dark:bg-white/10 sm:hidden">
            <div className="flex flex-col divide-y divide-white/10">
              <Link href="/courses" className="px-3 py-3">Courses</Link>
              <Link href="/community" className="px-3 py-3">Community</Link>
              <Link href="/progress" className="px-3 py-3">Analytics</Link>
              <Link href="/dashboard" className="px-3 py-3">Start Learning</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}


