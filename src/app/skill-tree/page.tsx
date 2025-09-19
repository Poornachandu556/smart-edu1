"use client";

export default function SkillTree() {
  const skills = [
    { name: "Foundations", status: "Unlocked" },
    { name: "Adaptivity", status: "Locked" },
    { name: "Analytics", status: "Locked" },
    { name: "Design", status: "Locked" },
  ];
  return (
    <div className="min-h-screen p-6 md:p-10">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Skill Tree & Gamification</h1>
      <div className="card mt-6 p-6">
        <div className="flex flex-wrap gap-6">
          {skills.map((s) => (
            <div key={s.name} className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-black/5 text-center dark:bg-white/10">
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="text-xs opacity-70">{s.status}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            const payload = {
              user: "demo",
              credentials: skills,
              exportedAt: new Date().toISOString(),
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "smartedu-credentials.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="btn-primary mt-6"
        >
          Export Credentials (JSON)
        </button>
      </div>
    </div>
  );
}


