"use client";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const resp = await fetch("/api/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create account");
      }
      // Auto sign-in after successful signup
      const res = await signIn("credentials", { redirect: false, email, password });
      if (res?.ok) {
        router.push("/");
      } else {
        throw new Error(res?.error || "Signup succeeded but login failed");
      }
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero animate-gradientShift flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/80 p-6 backdrop-blur transition duration-300 hover:shadow-2xl hover:shadow-primary-600/20 dark:bg-white/10">
        <h1 className="text-center font-[family-name:var(--font-heading)] text-2xl font-semibold text-foreground animate-floatUp">Create your account</h1>
        <div className="mt-3 rounded-xl border border-white/20 bg-white/60 p-3 text-center text-sm text-foreground/80 dark:bg-white/10">
          Please sign up or <a href="/login" className="text-primary-600 underline">log in</a> to continue.
        </div>
        <form onSubmit={onSubmit} className="mt-6 space-y-3 animate-fadeIn">
          {error && <div className="rounded-lg bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">{error}</div>}
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Full name" 
            className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-3 outline-none placeholder:opacity-60 focus:border-white/50" 
          />
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            type="email" 
            className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-3 outline-none placeholder:opacity-60 focus:border-white/50" 
          />
          <input 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            type="password" 
            className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-3 outline-none placeholder:opacity-60 focus:border-white/50" 
          />
          <button 
            disabled={loading} 
            className="btn-primary w-full focus:outline-none focus:ring-0 focus-visible:outline-none disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <div className="my-4 text-center text-xs opacity-70">or</div>
        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={() => signIn("google")} 
            className="rounded-xl border border-white/30 px-4 py-3 transition hover:-translate-y-0.5 hover:bg-white/50 dark:hover:bg-white/20 focus:outline-none focus:ring-0 focus-visible:outline-none"
          >
            Continue with Google
          </button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-primary-600 underline focus:outline-none focus:ring-0 focus-visible:outline-none">Log in</a>
        </div>
      </div>
    </div>
  );
}


