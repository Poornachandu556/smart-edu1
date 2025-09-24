"use client";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import lottieLoginAnimation from "@/assets/lottie-login.json";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
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
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (res?.ok) {
      router.push("/");
    } else {
      setError(res?.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen gradient-hero animate-gradientShift flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/80 p-6 backdrop-blur transition duration-300 hover:shadow-2xl hover:shadow-primary-600/20 dark:bg-white/10">
        <h1 className="text-center font-[family-name:var(--font-heading)] text-2xl font-semibold text-foreground animate-floatUp">Welcome back</h1>
        <div className="mt-3 rounded-xl border border-white/20 bg-white/60 p-3 text-center text-sm text-foreground/80 dark:bg-white/10">
          Please log in or <a href="/signup" className="text-primary-600 underline">sign up</a> to continue.
        </div>
        <form onSubmit={onSubmit} className="mt-6 space-y-3 animate-fadeIn">
          {error && <div className="rounded-lg bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">{error}</div>}
          <input value={email} onChange={(e)=>setEmail(e.target.value)} name="email" placeholder="Email" type="email" className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-3 outline-none" />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} name="password" placeholder="Password" type="password" className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-3 outline-none" />
          <button disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? "Signing in..." : "Continue"}</button>
        </form>
        <div className="my-4 text-center text-xs opacity-70">or</div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={()=> signIn("google") } className="rounded-xl border border-white/30 px-4 py-3 transition hover:-translate-y-0.5 hover:bg-white/50 dark:hover:bg-white/20">Continue with Google</button>
          <button className="rounded-xl border border-white/30 px-4 py-3 transition hover:-translate-y-0.5 hover:bg-white/50 dark:hover:bg-white/20">Continue with Facebook</button>
        </div>
        <div className="mt-4 text-center text-sm">
          New here? <a href="/signup" className="text-primary-600 underline">Create an account</a>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <Lottie
            animationData={lottieLoginAnimation}
            loop
            style={{ width: 80, height: 80 }}
          />
        </div>
      </div>
    </div>
  );
}


