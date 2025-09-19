import Link from "next/link";

export default function Sidebar() {
  const items = [
    { href: "/dashboard", label: "Home", icon: "🏠" },
    { href: "/dashboard/courses", label: "My Courses", icon: "📚" },
    { href: "/progress", label: "Progress", icon: "📊" },
    { href: "/tutor", label: "AI Tutor", icon: "🤖" },
    { href: "/community", label: "Community", icon: "💬" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
  ];
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 p-4 md:block">
      <div className="mb-4 flex items-center gap-2">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-white">SE</div>
        <span className="font-[family-name:var(--font-heading)] text-lg font-semibold">SmartEdu</span>
      </div>
      <nav className="space-y-1">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/50 dark:hover:bg-white/10">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}


