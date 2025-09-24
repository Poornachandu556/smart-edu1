"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Course } from "@/data/courses";

interface YouTubePlaylistModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function YouTubePlaylistModal({ course, isOpen, onClose }: YouTubePlaylistModalProps) {
  if (!course) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500/20 text-green-500 border-green-500/30";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "Advanced": return "bg-red-500/20 text-red-500 border-red-500/30";
      default: return "bg-primary-600/20 text-primary-700 border-primary-600/30";
    }
  };

  const getPlaylistId = (url: string) => {
    const match = url.match(/[?&]list=([^&]+)/);
    return match ? match[1] : null;
  };

  const playlistId = getPlaylistId(course.youtubePlaylistUrl);
  const embedUrl = playlistId 
    ? `https://www.youtube.com/embed/videoseries?list=${playlistId}`
    : null;

  const getPlaylistVideos = (courseId: string) => {
    const videoMap: Record<string, any[]> = {
      "js-fundamentals": [
        { title: "JavaScript Variables and Data Types", duration: "12:34", thumbnail: "https://img.youtube.com/vi/vi1/0.jpg" },
        { title: "Functions and Scope in JavaScript", duration: "15:22", thumbnail: "https://img.youtube.com/vi/vi2/0.jpg" },
        { title: "Arrays and Objects Deep Dive", duration: "18:45", thumbnail: "https://img.youtube.com/vi/vi3/0.jpg" },
        { title: "DOM Manipulation Techniques", duration: "20:12", thumbnail: "https://img.youtube.com/vi/vi4/0.jpg" },
        { title: "ES6+ Modern JavaScript Features", duration: "22:30", thumbnail: "https://img.youtube.com/vi/vi5/0.jpg" },
        { title: "Async Programming with Promises", duration: "16:55", thumbnail: "https://img.youtube.com/vi/vi6/0.jpg" }
      ],
      "react-essentials": [
        { title: "React Components and JSX Basics", duration: "14:20", thumbnail: "https://img.youtube.com/vi/vi1/0.jpg" },
        { title: "Props and State Management", duration: "16:45", thumbnail: "https://img.youtube.com/vi/vi2/0.jpg" },
        { title: "useState and useEffect Hooks", duration: "19:30", thumbnail: "https://img.youtube.com/vi/vi3/0.jpg" },
        { title: "Event Handling in React", duration: "13:15", thumbnail: "https://img.youtube.com/vi/vi4/0.jpg" },
        { title: "Conditional Rendering Patterns", duration: "11:40", thumbnail: "https://img.youtube.com/vi/vi5/0.jpg" },
        { title: "Lists, Keys, and Performance", duration: "17:25", thumbnail: "https://img.youtube.com/vi/vi6/0.jpg" }
      ],
      "python-basics": [
        { title: "Python Syntax and Variables", duration: "13:45", thumbnail: "https://img.youtube.com/vi/vi1/0.jpg" },
        { title: "Data Structures in Python", duration: "18:20", thumbnail: "https://img.youtube.com/vi/vi2/0.jpg" },
        { title: "Control Flow and Loops", duration: "15:10", thumbnail: "https://img.youtube.com/vi/vi3/0.jpg" },
        { title: "Functions and Modules", duration: "16:35", thumbnail: "https://img.youtube.com/vi/vi4/0.jpg" },
        { title: "File I/O and Error Handling", duration: "14:50", thumbnail: "https://img.youtube.com/vi/vi5/0.jpg" },
        { title: "Python Best Practices", duration: "12:25", thumbnail: "https://img.youtube.com/vi/vi6/0.jpg" }
      ],
      "ds-algo": [
        { title: "Big O Notation Explained", duration: "20:15", thumbnail: "https://img.youtube.com/vi/vi1/0.jpg" },
        { title: "Arrays and String Algorithms", duration: "25:30", thumbnail: "https://img.youtube.com/vi/vi2/0.jpg" },
        { title: "Linked Lists Implementation", duration: "22:45", thumbnail: "https://img.youtube.com/vi/vi3/0.jpg" },
        { title: "Stacks and Queues", duration: "18:20", thumbnail: "https://img.youtube.com/vi/vi4/0.jpg" },
        { title: "Tree Traversal Algorithms", duration: "24:10", thumbnail: "https://img.youtube.com/vi/vi5/0.jpg" },
        { title: "Graph Algorithms and DFS/BFS", duration: "26:35", thumbnail: "https://img.youtube.com/vi/vi6/0.jpg" }
      ]
    };

    return videoMap[courseId] || [
      { title: "Introduction to the Course", duration: "10:00", thumbnail: "https://img.youtube.com/vi/vi1/0.jpg" },
      { title: "Core Concepts", duration: "15:00", thumbnail: "https://img.youtube.com/vi/vi2/0.jpg" },
      { title: "Advanced Topics", duration: "20:00", thumbnail: "https://img.youtube.com/vi/vi3/0.jpg" },
      { title: "Practice Problems", duration: "18:00", thumbnail: "https://img.youtube.com/vi/vi4/0.jpg" },
      { title: "Real-world Applications", duration: "22:00", thumbnail: "https://img.youtube.com/vi/vi5/0.jpg" },
      { title: "Course Conclusion", duration: "12:00", thumbnail: "https://img.youtube.com/vi/vi6/0.jpg" }
    ];
  };

  // Real playlist fetching with YouTube Data API v3 (optional)
  type VideoItem = { title: string; thumbnail: string; duration?: string; videoId: string };
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    // If no API key or no playlistId, fallback to static map
    if (!isOpen) return;
    if (!playlistId || !apiKey) {
      setVideos(getPlaylistVideos(course.id).map((v, idx) => ({
        title: v.title,
        thumbnail: v.thumbnail,
        duration: v.duration,
        videoId: `${course.id}-${idx}`,
      })));
      return;
    }

    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
        url.searchParams.set("part", "snippet,contentDetails");
        url.searchParams.set("maxResults", "25");
        url.searchParams.set("playlistId", playlistId);
        url.searchParams.set("key", apiKey);
        const resp = await fetch(url.toString());
        if (!resp.ok) throw new Error(`YouTube API error: ${resp.status}`);
        const data = await resp.json();
        const items: VideoItem[] = (data.items || []).map((it: any) => {
          const vid = it.contentDetails?.videoId || it.snippet?.resourceId?.videoId || Math.random().toString(36).slice(2);
          const title = it.snippet?.title || "Untitled";
          const thumb = it.snippet?.thumbnails?.medium?.url
            || it.snippet?.thumbnails?.high?.url
            || (vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : "https://img.youtube.com/vi/vi1/0.jpg");
          return { title, thumbnail: thumb, videoId: vid };
        });
        if (!aborted) setVideos(items);
      } catch (e: any) {
        if (!aborted) {
          setError(typeof e?.message === "string" ? e.message : "Failed to load playlist");
          // Fallback to static list
          setVideos(getPlaylistVideos(course.id).map((v, idx) => ({
            title: v.title,
            thumbnail: v.thumbnail,
            duration: v.duration,
            videoId: `${course.id}-${idx}`,
          })));
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    };
    fetchPlaylist();
    return () => { aborted = true; };
  }, [isOpen, playlistId, course.id]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl max-h-[90vh] mx-4 bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <span className="text-xl">✕</span>
            </button>

            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-2">
                    {course.title} - Playlist
                  </h1>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                    <div className="flex items-center gap-2 text-sm opacity-70">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      <span>{course.youtubeChannel}</span>
                    </div>
                    <span className="text-sm opacity-70">{videos.length} videos</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row h-[calc(90vh-120px)]">
              {/* Video Player */}
              <div className="flex-1 p-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative w-full h-64 lg:h-80 rounded-2xl overflow-hidden bg-black"
                >
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={course.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎥</div>
                        <p className="text-white/80 mb-4">Playlist not available for embedding</p>
                        <a
                          href={course.youtubePlaylistUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary"
                        >
                          Open in YouTube
                        </a>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Playlist Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6"
                >
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-2">Playlist Description</h3>
                  <p className="text-sm opacity-80 leading-relaxed">
                    {course.description} This comprehensive playlist covers all the essential concepts with practical examples and real-world applications.
                  </p>
                  {error && (
                    <p className="mt-3 text-sm text-red-500">{error}</p>
                  )}
                </motion.div>
              </div>

              {/* Video List */}
              <div className="w-full lg:w-80 border-l border-white/10 p-6 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold mb-4">Playlist Videos</h3>
                  {loading && <div className="text-sm opacity-70">Loading playlist...</div>}
                  <div className="space-y-3">
                    {videos.map((video, index) => (
                      <motion.div
                        key={video.videoId || index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                      >
                        <div className="relative w-20 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-xs">▶</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {video.title}
                          </h4>
                          {video.duration && <p className="text-xs opacity-70 mt-1">{video.duration}</p>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 space-y-3"
                >
                  <a
                    href={course.youtubePlaylistUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full btn-primary text-center block"
                  >
                    Open Full Playlist
                  </a>
                  <a
                    href={`/courses/${course.id}`}
                    className="w-full btn-secondary text-center block"
                  >
                    View Course Details
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
