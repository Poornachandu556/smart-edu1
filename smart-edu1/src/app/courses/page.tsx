"use client";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { courses as allCourses, Course } from "@/data/courses";
import { useEnrollments } from "@/hooks/useEnrollments";
import { toast } from "sonner";
import CourseDetailsModal from "@/components/CourseDetailsModal";
import YouTubePlaylistModal from "@/components/YouTubePlaylistModal";
import { useRouter } from "next/navigation";
import { updateDNAFromActivity } from "@/lib/learningDNA";

export default function CoursesPage() {
  const { isEnrolled, enroll } = useEnrollments();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("Recently Added");
  const [tag, setTag] = useState<string>("All");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  
  const tags = useMemo(() => {
    const set = new Set<string>();
    allCourses.forEach(c=> c.tags?.forEach(t=> set.add(t)));
    return ["All", ...Array.from(set).sort()];
  }, []);
  
  const courses = useMemo(() => {
    const levelRank: Record<string, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 };
    const filtered = allCourses.filter((c) =>
      (level === "All" || c.level === level) &&
      (tag === "All" || (c.tags?.includes(tag))) &&
      (c.title.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase()))
    );
    const withIndex = filtered.map((c) => ({ c, idx: allCourses.findIndex(a => a.id === c.id) }));
    const sorted = withIndex.sort((a, b) => {
      if (sortBy === "Title A-Z") return a.c.title.localeCompare(b.c.title);
      if (sortBy === "Level") return levelRank[a.c.level] - levelRank[b.c.level];
      return b.idx - a.idx;
    }).map(x => x.c);
    return sorted;
  }, [query, level, tag, sortBy]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500/20 text-green-500 border-green-500/30";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "Advanced": return "bg-red-500/20 text-red-500 border-red-500/30";
      default: return "bg-primary-600/20 text-primary-700 border-primary-600/30";
    }
  };

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  const handleWatchPlaylist = (course: Course) => {
    setSelectedCourse(course);
    setShowPlaylistModal(true);
  };

  return (
    <div className="min-h-screen font-sans">
      <main className="container-px mx-auto py-8">
        {/* Header Actions (top-left and top-right) */}
        <div className="relative mb-4">
          <a
            href="https://pythontutor.com/visualize.html#mode=edit"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary absolute left-0 top-0"
            onClick={() => { try { updateDNAFromActivity("visual"); } catch {} }}
          >
            Code Visualizer
          </a>
          <a
            href="https://www.programiz.com/online-compiler/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10 absolute right-0 top-0"
            onClick={() => { try { updateDNAFromActivity("kinesthetic"); } catch {} }}
          >
            Run Code
          </a>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold mb-4">
            Browse Courses
          </h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Discover amazing courses to enhance your skills and advance your career
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="card p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium mb-2">Search Courses</label>
                <input 
                  value={query} 
                  onChange={(e)=> setQuery(e.target.value)} 
                  placeholder="Search by title or description..." 
                  className="search-input" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Level</label>
                <select 
                  value={level} 
                  onChange={(e)=> setLevel(e.target.value)} 
                  className="filter-select"
                >
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select 
                  value={tag} 
                  onChange={(e)=> setTag(e.target.value)} 
                  className="filter-select"
                >
                  {tags.map(t=> <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-70">Sort by:</span>
                <select 
                  value={sortBy} 
                  onChange={(e)=> setSortBy(e.target.value)} 
                  className="rounded-lg border border-white/30 bg-transparent px-3 py-2 text-sm outline-none focus:border-primary-500 transition-all"
                >
                  <option>Recently Added</option>
                  <option>Title A-Z</option>
                  <option>Level</option>
                </select>
              </div>
              <div className="text-sm opacity-70">
                {courses.length} course{courses.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {courses.map((c, index) => {
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="course-card group"
              >
                {/* Course Image */}
                <div className="course-image">
                  <Image 
                    src={c.image} 
                    alt={c.title} 
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  <div className="course-overlay" />
                  <div className="course-level-badge">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLevelColor(c.level)}`}>
                      {c.level}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-5 relative z-[1]">
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {c.title}
                  </h3>
                  
                  <p className="text-sm opacity-80 mb-4 line-clamp-3">
                    {c.description}
                  </p>

                  {/* Tags */}
                  {c.tags && c.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {c.tags.slice(0, 3).map(t => (
                        <motion.button 
                          key={t} 
                          onClick={()=> setTag(t)} 
                          className="course-tag"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          #{t}
                        </motion.button>
                      ))}
                      {c.tags.length > 3 && (
                        <span className="px-2 py-1 rounded-full bg-white/10 text-xs opacity-60">
                          +{c.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-3">
                    <motion.button
                      onClick={() => handleViewDetails(c)}
                      className="flex-1 btn-primary text-center text-sm py-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      onClick={() => handleWatchPlaylist(c)}
                      className="px-4 py-2 rounded-xl border border-white/30 text-sm hover:bg-white/10 transition-colors flex items-center gap-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>▶</span>
                      <span className="hidden sm:inline">Watch</span>
                    </motion.button>
                    {c.id !== "js-fundamentals" && (
                      <motion.button
                        onClick={async () => {
                          if (isEnrolled(c.id)) { toast.success("Already in My Courses"); return; }
                          await enroll(c.id);
                          toast.success("Added to My Courses");
                          // Navigate to My Courses with context of which was added
                          router.push(`/dashboard/courses?added=${encodeURIComponent(c.id)}`);
                        }}
                        className="px-4 py-2 rounded-xl border border-white/30 text-sm hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Add to My Courses
                      </motion.button>
                    )}
                  </div>

                  {/* Channel Info */}
                  <div className="flex items-center gap-2 text-xs opacity-70">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>{c.youtubeChannel}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {courses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">No courses found</h2>
            <p className="text-sm opacity-70 mb-4">Try adjusting your search or filter criteria</p>
            <motion.button 
              onClick={() => {
                setQuery("");
                setLevel("All");
                setTag("All");
                setSortBy("Recently Added");
              }}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <CourseDetailsModal
        course={selectedCourse}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
      <YouTubePlaylistModal
        course={selectedCourse}
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
      />
    </div>
  );
}


