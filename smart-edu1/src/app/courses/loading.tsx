export default function LoadingCourses() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="h-32 w-full rounded-xl bg-white/20" />
            <div className="mt-3 h-4 w-1/2 rounded bg-white/20" />
            <div className="mt-2 h-3 w-3/4 rounded bg-white/10" />
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-20 rounded bg-white/20" />
              <div className="h-8 w-20 rounded bg-white/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


