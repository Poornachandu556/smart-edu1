export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/60 px-4 py-2 text-sm text-foreground/80 dark:bg-white/10">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary-600" />
        <span>Loading...</span>
      </div>
    </div>
  );
}


