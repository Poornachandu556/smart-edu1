export default function CoursesPage() {
  const courses = [
    { title: "Algebra Basics", href: "/course" },
    { title: "Physics 101", href: "/course" },
    { title: "World History", href: "/course" },
  ];
  return (
    <div className="min-h-screen p-6 md:p-10">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Browse Courses</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <a key={c.title} href={c.href} className="card block p-4">
            <div className="h-28 rounded-xl bg-gradient-to-br from-primary-300 to-primary-700" />
            <p className="mt-3 font-medium">{c.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
}


