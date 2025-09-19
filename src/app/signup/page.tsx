export default function SignupPage() {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/80 p-6 backdrop-blur dark:bg_white/10">
        <h1 className="text-center font-[family-name:var(--font-heading)] text-2xl font-semibold text-foreground">Create your account</h1>
        <p className="mt-1 text-center text-sm text-foreground/70">Start learning free</p>
        <form className="mt-6 space-y-3">
          <input placeholder="Full name" className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-3 outline-none" />
          <input placeholder="Email" type="email" className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-3 outline-none" />
          <input placeholder="Password" type="password" className="w-full rounded-xl border border-white/30 bg-transparent px-4 py-3 outline-none" />
          <button className="btn-primary w-full">Sign Up</button>
        </form>
        <div className="my-4 text-center text-xs opacity-70">or</div>
        <div className="grid grid-cols-2 gap-3">
          <button className="rounded-xl border border-white/30 px-4 py-3 hover:bg-white/50 dark:hover:bg-white/20">Continue with Google</button>
          <button className="rounded-xl border border-white/30 px-4 py-3 hover:bg-white/50 dark:hover:bg-white/20">Continue with Facebook</button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-primary-600 underline">Log in</a>
        </div>
      </div>
    </div>
  );
}


