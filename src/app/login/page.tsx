import Lottie from "lottie-react";
import lottieLoginAnimation from "@/public/lottie-login.json";
export default function LoginPage() {
  return (
    <div className="min-h-screen gradient-hero animate-gradientShift flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/80 p-6 backdrop-blur transition duration-300 hover:shadow-2xl hover:shadow-primary-600/20 dark:bg-white/10">
        <h1 className="text-center font-[family-name:var(--font-heading)] text-2xl font-semibold text-foreground animate-floatUp">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-foreground/70">Log in to continue learning</p>
        <form action="/api/auth/signin/credentials" method="post" className="mt-6 space-y-3 animate-fadeIn">
          <input name="csrfToken" type="hidden" />
          <input name="email" placeholder="Email" type="email" className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-3 outline-none" />
          <input name="password" placeholder="Password" type="password" className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-3 outline-none" />
          <button className="btn-primary w-full">Continue</button>
        </form>
        <div className="my-4 text-center text-xs opacity-70">or</div>
        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-xl border border-white/30 px-4 py-3 transition hover:-translate-y-0.5 hover:bg-white/50 dark:hover:bg-white/20">Continue with Google</button>
          <button className="rounded-xl border border-white/30 px-4 py-3 transition hover:-translate-y-0.5 hover:bg-white/50 dark:hover:bg-white/20">Continue with Facebook</button>
        </div>
        <div className="mt-4 text-center text-sm">
          New here? <a href="/signup" className="text-primary-600 underline">Create an account</a>
        </div>
        <div className="mt-4 flex items-center justify-center">
          {/* Replaced <lottie-player> with Lottie React component */}
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


