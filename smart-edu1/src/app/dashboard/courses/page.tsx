"use client";
import Link from "next/link";
import Image from "next/image";
import { courses, Course } from "@/data/courses";
import { useEnrollments } from "@/hooks/useEnrollments";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function CoursesPage() {
  const { enrollments, loaded, removeEnrollment, storageKey } = useEnrollments();
  const searchParams = useSearchParams();
  // If navigated with ?added=... ensure state sync across pages
  useEffect(() => {
    const added = searchParams.get("added");
    if (added && typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      let list: any[] = [];
      try { list = saved ? JSON.parse(saved) : []; } catch {}
      const exists = Array.isArray(list) && list.some((e) => e.courseId === added);
      if (!exists) {
        const optimistic = { id: `enrollment-${Date.now()}`, courseId: added, progressPercent: 0 };
        list = [...list, optimistic];
        localStorage.setItem(storageKey, JSON.stringify(list));
      }
      window.dispatchEvent(new StorageEvent("storage", { key: storageKey, newValue: JSON.stringify(list) }));
    }
  }, [searchParams, storageKey]);
  
  // Filter to show only enrolled courses; fall back to localStorage if needed
  type EnrolledCourse = Course & { enrollment: { courseId: string; progressPercent: number } };
  const enrolledCourses = useMemo<EnrolledCourse[]>(() => {
    let source = enrollments;
    if (source.length === 0 && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) source = JSON.parse(raw);
      } catch {}
    }
    return source
      .map((enrollment: any) => {
        const course = courses.find(c => c.id === enrollment.courseId);
        return course ? { ...course, enrollment } as EnrolledCourse : null;
      })
      .filter((x): x is EnrolledCourse => x !== null);
  }, [enrollments, storageKey]);

  if (!loaded) {
    return (
      <div className="min-h-screen md:flex">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-sm opacity-70">Loading your courses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">My Courses</h1>
          <p className="text-sm opacity-70">
            {enrolledCourses.length > 0 
              ? `You're enrolled in ${enrolledCourses.length} course${enrolledCourses.length === 1 ? '' : 's'}`
              : "You haven't enrolled in any courses yet"
            }
          </p>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold mb-2">No courses yet</h2>
            <p className="text-sm opacity-70 mb-4">Start your learning journey by enrolling in a course</p>
            <Link href="/courses" className="btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="card p-4">
                <div className="relative h-28 w-full overflow-hidden rounded-xl">
                  <Image src={course.image} alt={course.title} fill className="object-cover" />
                </div>
                <div className="mt-3">
                  <p className="font-medium">{course.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-primary-600/15 px-2 py-0.5 text-xs text-primary-700">
                      {course.level}
                    </span>
                    <span className="rounded-full bg-accent-green/15 px-2 py-0.5 text-xs text-accent-green">
                      Enrolled
                    </span>
                  </div>
                  <p className="mt-2 text-sm opacity-80 line-clamp-2">{course.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{course.enrollment.progressPercent}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/20">
                      <div 
                        className="h-2 rounded-full bg-accent-green transition-all duration-300" 
                        style={{ width: `${course.enrollment.progressPercent}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Link 
                      href={`/courses/${course.id}`} 
                      className="flex-1 rounded-xl border border-white/30 px-3 py-2 text-center text-sm hover:bg-white/10 transition-colors"
                    >
                      View Details
                    </Link>
                    <a 
                      href={course.youtubePlaylistUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-primary text-sm"
                    >
                      Continue Learning
                    </a>
                    <button
                      onClick={() => removeEnrollment(course.id)}
                      className="rounded-xl border border-red-500/30 px-3 py-2 text-center text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


