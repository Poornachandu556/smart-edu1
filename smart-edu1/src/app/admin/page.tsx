export default function AdminPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Admin & Teacher Panel</h1>
      <p className="text-sm opacity-70">Create courses, analyze performance, and get AI suggestions.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="card p-5 md:col-span-2">
          <p className="mb-3 font-medium">Course creation</p>
          <div className="grid gap-3 md:grid-cols-2">
            <input placeholder="Course title" className="rounded-xl border border-white/20 bg-transparent px-4 py-3 outline-none" />
            <input placeholder="Category" className="rounded-xl border border-white/20 bg-transparent px-4 py-3 outline-none" />
            <textarea placeholder="Description" className="md:col-span-2 rounded-xl border border-white/20 bg-transparent px-4 py-3 outline-none" />
            <button className="btn-primary md:col-span-2">Create course</button>
          </div>
        </div>
        <div className="card p-5">
          <p className="mb-2 font-medium">AI Insights</p>
          <p className="text-sm">50% of students struggled with Algebra Ch-2, consider adding a video.</p>
        </div>
        <div className="card p-5">
          <p className="mb-2 font-medium">Drop-off rates</p>
          <div className="h-40 rounded-xl bg-gradient-to-b from-primary-300/50 to-transparent" />
        </div>
        <div className="card p-5 md:col-span-2">
          <p className="mb-2 font-medium">Hardest lessons</p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>Algebra Ch-2</li>
            <li>Physics: Motion</li>
            <li>History: Renaissance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


