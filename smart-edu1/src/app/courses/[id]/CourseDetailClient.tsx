"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo as useMemoReact } from "react";
import Image from "next/image";
import Link from "next/link";
import { courses } from "@/data/courses";
import { EnrollControls } from "./EnrollControls";
import { useEnrollments } from "@/hooks/useEnrollments";

type Course = {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  youtubePlaylistUrl: string;
  youtubeChannel: string;
  image: string;
  tags?: string[];
};

interface CourseDetailClientProps {
  course: Course;
}

export function CourseDetailClient({ course }: CourseDetailClientProps) {
  const { isEnrolled, updateProgress, enroll } = useEnrollments();
  const playlistUrl = course.youtubePlaylistUrl && course.youtubePlaylistUrl.startsWith("http")
    ? course.youtubePlaylistUrl
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + " playlist")}`;

  // Get related courses based on tags and level
  const relatedCourses = useMemoReact(() => {
    return courses
      .filter(c => c.id !== course.id && (
        c.tags?.some(tag => course.tags?.includes(tag)) || 
        c.level === course.level
      ))
      .slice(0, 3);
  }, [course]);

  // Get level color
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500/20 text-green-500 border-green-500/30";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "Advanced": return "bg-red-500/20 text-red-500 border-red-500/30";
      default: return "bg-primary-600/20 text-primary-700 border-primary-600/30";
    }
  };

  

  // Course suggestions based on the current course
  const suggestions = useMemoReact(() => {
    const suggestions = [];
    
    if (course.tags?.includes("JavaScript")) {
      suggestions.push("Learn TypeScript next for better type safety");
    }
    if (course.tags?.includes("React")) {
      suggestions.push("Explore Next.js for full-stack React development");
    }
    if (course.tags?.includes("Python")) {
      suggestions.push("Try Django or Flask for web development");
    }
    if (course.level === "Beginner") {
      suggestions.push("Consider intermediate courses after mastering this");
    }
    if (course.tags?.includes("Web")) {
      suggestions.push("Learn about databases and APIs to build complete apps");
    }
    
    return suggestions.slice(0, 3);
  }, [course]);

  // --- Playlist fetching and watch tracking ---
  type VideoItem = { index: number; videoId: string; title: string; thumbnail: string };
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [watched, setWatched] = useState<Set<string>>(new Set());

  function safeParseJson<T = any>(s: any): T | null {
    try { return s ? JSON.parse(String(s)) as T : null; } catch { return null; }
  }

  const getPlaylistId = (url: string) => {
    const match = url.match(/[?&]list=([^&]+)/);
    return match ? match[1] : null;
  };

  const playlistId = getPlaylistId(course.youtubePlaylistUrl);

  // Load existing user activity to pre-check watched videos
  useEffect(() => {
    let cancelled = false;
    const loadActivity = async () => {
      try {
        const res = await fetch("/api/user-activity", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const stats = safeParseJson<Record<string, any>>(data?.activity?.statsJson) || {};
        const courseStats = stats?.watched?.[course.id];
        if (courseStats?.videos && !cancelled) {
          setWatched(new Set(Object.keys(courseStats.videos)));
        }
      } catch {}
    };
    loadActivity();
    return () => { cancelled = true; };
  }, [course.id]);

  // Fetch playlist videos
  useEffect(() => {
    let aborted = false;
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const fallback = () => {
      if (!aborted) {
        setVideos([
          { index: 1, videoId: `${course.id}-intro`, title: `${course.title} Playlist`, thumbnail: course.image },
        ]);
      }
    };
    if (!playlistId || !apiKey) { fallback(); return; }
    const run = async () => {
      try {
        setLoadingVideos(true);
        setLoadError(null);
        const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
        url.searchParams.set("part", "snippet,contentDetails");
        url.searchParams.set("maxResults", "50");
        url.searchParams.set("playlistId", playlistId);
        url.searchParams.set("key", apiKey);
        const resp = await fetch(url.toString());
        if (!resp.ok) throw new Error(`YouTube API ${resp.status}`);
        const data = await resp.json();
        const items: VideoItem[] = (data.items || []).map((it: any, idx: number) => {
          const videoId = it.contentDetails?.videoId || it.snippet?.resourceId?.videoId || `${course.id}-${idx}`;
          const title = it.snippet?.title || `Video ${idx + 1}`;
          const thumb = it.snippet?.thumbnails?.medium?.url
            || it.snippet?.thumbnails?.high?.url
            || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : course.image);
          return { index: idx + 1, videoId, title, thumbnail: thumb };
        });
        if (!aborted) setVideos(items);
      } catch (e: any) {
        if (!aborted) { setLoadError(e?.message || "Failed to load playlist"); fallback(); }
      } finally {
        if (!aborted) setLoadingVideos(false);
      }
    };
    run();
    return () => { aborted = true; };
  }, [playlistId, course.id, course.image, course.title]);

  const markWatched = async (videoId: string) => {
    // Auto-enroll if not yet enrolled so progress can be tracked
    if (!isEnrolled(course.id)) {
      try { await enroll(course.id); } catch {}
    }
    // Optimistic UI first
    setWatched(prev => new Set(prev).add(videoId));
    // Defer network work so browser can open the new tab instantly
    setTimeout(async () => {
      try {
        const res = await fetch("/api/user-activity", { method: "GET", cache: "no-store" });
        const data = res.ok ? await res.json() : {};
        const stats = safeParseJson<any>(data?.activity?.statsJson) || {};
        if (!stats.watched) stats.watched = {};
        if (!stats.watched[course.id]) stats.watched[course.id] = { playlistId, videos: {} };
        stats.watched[course.id].playlistId = playlistId;
        stats.watched[course.id].videos[videoId] = { watchedAt: new Date().toISOString() };

        await fetch("/api/user-activity", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ statsJson: JSON.stringify(stats) }),
        });

        // Immediate progress update (in addition to effect)
        const total = videos.length || 1;
        const watchedCount = new Set([...watched, videoId]).size; // include just-clicked
        const percent = Math.max(0, Math.min(100, Math.round((watchedCount / total) * 100)));
        updateProgress(course.id, percent);
      } catch {
        setWatched(prev => {
          const next = new Set(prev);
          next.delete(videoId);
          return next;
        });
      }
    }, 0);
  };

  // Sync watched ratio to enrollment progress (after state and helpers are defined)
  useEffect(() => {
    const ensureAndUpdate = async () => {
      if (!isEnrolled(course.id)) {
        try { await enroll(course.id); } catch {}
      }
      const total = videos.length;
      if (!total) return;
      const watchedCount = Array.from(watched).filter(v => videos.some(it => it.videoId === v)).length;
      const percent = Math.max(0, Math.min(100, Math.round((watchedCount / total) * 100)));
      updateProgress(course.id, percent);
    };
    ensureAndUpdate();
  }, [watched, videos, course.id, isEnrolled, updateProgress, enroll]);

  return (
    <div className="min-h-screen font-sans">
      <div className="container-px mx-auto py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl mb-12"
        >
          <div className="relative h-96 w-full">
            <Image 
              src={course.image} 
              alt={course.title} 
              fill 
              className="object-cover" 
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-end p-8">
              <div className="text-white">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="font-[family-name:var(--font-heading)] text-4xl font-bold mb-4"
                >
                  {course.title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-xl opacity-90 mb-6 max-w-3xl"
                >
                  {course.description}
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                  <div className="flex items-center gap-2 text-sm opacity-80">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>{course.youtubeChannel}</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="card p-8"
            >
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold mb-6">Course Overview</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center text-primary-600">
                    📚
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">What You'll Learn</h3>
                    <p className="text-sm opacity-80">
                      Master the fundamentals and advanced concepts through hands-on projects and real-world examples.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-green/20 flex items-center justify-center text-accent-green">
                    ⏱️
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Duration</h3>
                    <p className="text-sm opacity-80">
                      Self-paced learning with approximately 10-15 hours of content
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Prerequisites</h3>
                    <p className="text-sm opacity-80">
                      {course.level === "Beginner" 
                        ? "No prior experience required - perfect for beginners!"
                        : course.level === "Intermediate"
                        ? "Basic knowledge of programming concepts recommended"
                        : "Strong foundation in programming and related technologies required"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Course Content (from YouTube Playlist) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="card p-8"
            >
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Course Content</h2>
              <div className="mt-1 mb-6 text-xs opacity-70">
                Watched {Array.from(watched).filter(v => videos.some(it => it.videoId === v)).length} of {videos.length || 0}
              </div>
              {loadingVideos && <div className="text-sm opacity-70">Loading playlist...</div>}
              {loadError && <div className="text-sm text-red-500 mb-3">{loadError}</div>}
              <div className="space-y-4">
                {videos.map((v, idx) => (
                  <motion.div
                    key={v.videoId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + idx * 0.05, duration: 0.3 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-sm font-semibold text-primary-600">
                      {v.index}
                    </div>
                    <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image src={v.thumbnail} alt={v.title} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-2">{v.title}</h3>
                      <div className="text-xs opacity-70 mt-1">YouTube</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        className="px-3 py-1 rounded-lg border border-white/20 hover:bg-white/10 text-sm"
                        href={playlistId ? `https://www.youtube.com/watch?v=${v.videoId}&list=${playlistId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(course.title)}`}
                        target="_blank" rel="noreferrer"
                        onClick={() => markWatched(v.videoId)}
                      >
                        Watch
                      </a>
                      <button
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${watched.has(v.videoId) ? 'border-green-500 text-green-500' : 'border-white/30'}`}
                        onClick={() => markWatched(v.videoId)}
                        title={watched.has(v.videoId) ? 'Watched' : 'Mark as watched'}
                      >
                        {watched.has(v.videoId) ? '✓' : ''}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Learning Suggestions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="card p-8"
            >
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold mb-6">Learning Suggestions</h2>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-green/10 border border-primary-500/20"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">
                      💡
                    </div>
                    <p className="text-sm">{suggestion}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enroll Controls */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="card p-6"
            >
              <h3 className="font-semibold mb-4">Get Started</h3>
              <EnrollControls courseId={course.id} />
            </motion.div>

            {/* Course Stats */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="card p-6"
            >
              <h3 className="font-semibold mb-4">Course Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm opacity-70">Level</span>
                  <span className="text-sm font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm opacity-70">Duration</span>
                  <span className="text-sm font-medium">10-15 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm opacity-70">Format</span>
                  <span className="text-sm font-medium">Video + Projects</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm opacity-70">Language</span>
                  <span className="text-sm font-medium">English</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="card p-6"
            >
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href={playlistUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full btn-primary text-center block"
                >
                  🎥 Watch Playlist
                </a>
                <button className="w-full btn-secondary text-center">
                  📖 Add to Favorites
                </button>
                <button className="w-full btn-secondary text-center">
                  📤 Share Course
                </button>
              </div>
            </motion.div>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="card p-6"
              >
                <h3 className="font-semibold mb-4">Related Courses</h3>
                <div className="space-y-3">
                  {relatedCourses.map((relatedCourse) => (
                    <Link 
                      key={relatedCourse.id}
                      href={`/courses/${relatedCourse.id}`}
                      className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <Image 
                            src={relatedCourse.image} 
                            alt={relatedCourse.title} 
                            width={48} 
                            height={48} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{relatedCourse.title}</h4>
                          <p className="text-xs opacity-70">{relatedCourse.level}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
