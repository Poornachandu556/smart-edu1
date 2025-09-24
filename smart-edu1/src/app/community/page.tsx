export default function CommunityPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Community Forum</h1>
      <p className="text-sm opacity-70">Ask questions, share knowledge, earn badges.</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {[1,2,3,4].map((i) => (
            <div key={i} className="card p-4">
              <div className="mb-2 flex items-center gap-2 text-xs opacity-70">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white">U{i}</span>
                <span>Alex · 2h ago</span>
                <span className="ml-auto">{8+i} upvotes</span>
              </div>
              <p className="font-medium">Best way to remember algebraic identities?</p>
              <div className="mt-1 text-sm opacity-80">I keep forgetting a²-b² and others… any tips?</div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="rounded-full bg-accent-orange/20 px-2 py-0.5 text-accent-orange">algebra</span>
                <a href="#" className="ml-auto text-primary-600">Answer →</a>
              </div>
            </div>
          ))}
        </div>
        <aside className="space-y-3">
          <div className="card p-4">
            <p className="mb-2 font-medium">Top contributors</p>
            <ul className="space-y-2 text-sm">
              <li>Chris · 240 pts 🏅</li>
              <li>Sam · 210 pts 🥈</li>
              <li>Maya · 180 pts 🥉</li>
            </ul>
          </div>
          <div className="card p-4">
            <p className="mb-2 font-medium">Badges</p>
            <div className="flex flex-wrap gap-2 text-xl">
              <span>🏆</span><span>🎯</span><span>📚</span><span>🔥</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}


