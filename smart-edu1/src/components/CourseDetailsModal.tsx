"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Course } from "@/data/courses";
import { updateDNAFromActivity } from "@/lib/learningDNA";

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseDetailsModal({ course, isOpen, onClose }: CourseDetailsModalProps) {
  if (!course) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500/20 text-green-500 border-green-500/30";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "Advanced": return "bg-red-500/20 text-red-500 border-red-500/30";
      default: return "bg-primary-600/20 text-primary-700 border-primary-600/30";
    }
  };

  const getRelatedContent = (courseId: string) => {
    const contentMap: Record<string, any> = {
      "js-fundamentals": {
        topics: [
          "Variables and Data Types",
          "Functions and Scope",
          "Arrays and Objects",
          "DOM Manipulation",
          "ES6+ Features",
          "Async Programming"
        ],
        resources: [
          "MDN JavaScript Guide",
          "JavaScript.info Tutorial",
          "Eloquent JavaScript Book",
          "JavaScript30 Challenge"
        ],
        projects: [
          "Todo List App",
          "Weather Dashboard",
          "Memory Card Game",
          "Calculator App"
        ]
      },
      "react-essentials": {
        topics: [
          "Components and JSX",
          "Props and State",
          "Hooks (useState, useEffect)",
          "Event Handling",
          "Conditional Rendering",
          "Lists and Keys"
        ],
        resources: [
          "React Official Docs",
          "React Tutorial",
          "React Patterns",
          "React DevTools"
        ],
        projects: [
          "Portfolio Website",
          "Task Manager",
          "Shopping Cart",
          "Blog Application"
        ]
      },
      "python-basics": {
        topics: [
          "Python Syntax",
          "Data Structures",
          "Control Flow",
          "Functions and Modules",
          "File I/O",
          "Error Handling"
        ],
        resources: [
          "Python.org Tutorial",
          "Real Python",
          "Python for Everybody",
          "Automate the Boring Stuff"
        ],
        projects: [
          "Web Scraper",
          "Data Analysis Tool",
          "Automation Script",
          "Simple Game"
        ]
      },
      "ds-algo": {
        topics: [
          "Big O Notation",
          "Arrays and Strings",
          "Linked Lists",
          "Stacks and Queues",
          "Trees and Graphs",
          "Dynamic Programming"
        ],
        resources: [
          "LeetCode",
          "GeeksforGeeks",
          "Cracking the Coding Interview",
          "Algorithm Design Manual"
        ],
        projects: [
          "Pathfinding Visualizer",
          "Sorting Algorithm Demo",
          "Binary Tree Traversal",
          "Graph Algorithms"
        ]
      }
    };

    return contentMap[courseId] || {
      topics: ["Core Concepts", "Advanced Topics", "Best Practices", "Real-world Applications"],
      resources: ["Official Documentation", "Community Resources", "Books and Courses", "Practice Platforms"],
      projects: ["Beginner Project", "Intermediate Project", "Advanced Project", "Portfolio Project"]
    };
  };

  const relatedContent = getRelatedContent(course.id);

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
            className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <span className="text-xl">✕</span>
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Hero Section */}
              <div className="relative h-64 md:h-80">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-white mb-2">
                      {course.title}
                    </h1>
                    <div className="flex items-center gap-4 text-white/90">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span>{course.youtubeChannel}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold mb-4">About This Course</h2>
                  <p className="text-lg leading-relaxed opacity-80">
                    {course.description}
                  </p>
                </motion.div>

                {/* Topics Covered */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-4">Topics Covered</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {relatedContent.topics.map((topic: string, index: number) => (
                      <motion.div
                        key={topic}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <span className="text-primary-600">✓</span>
                        <span className="font-medium">{topic}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Learning Resources */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8"
                >
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-4">Learning Resources</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {relatedContent.resources.map((resource: string, index: number) => (
                      <motion.div
                        key={resource}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => { try { updateDNAFromActivity("reading"); } catch {} }}
                      >
                        <span className="text-accent-green">📚</span>
                        <span className="font-medium">{resource}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Practice Projects */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mb-8"
                >
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-4">Practice Projects</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {relatedContent.projects.map((project: string, index: number) => (
                      <motion.div
                        key={project}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => { try { updateDNAFromActivity("kinesthetic"); } catch {} }}
                      >
                        <span className="text-primary-600">🚀</span>
                        <span className="font-medium">{project}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="mb-8"
                  >
                    <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.1 + index * 0.1 }}
                          className="px-3 py-1 rounded-full bg-primary-600/20 text-primary-600 text-sm font-medium border border-primary-600/30"
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex gap-4"
                >
                  <motion.a
                    href={`/courses/${course.id}`}
                    className="flex-1 btn-primary text-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Full Course
                  </motion.a>
                  <motion.a
                    href={course.youtubePlaylistUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 btn-secondary text-center flex items-center justify-center gap-2"
                    onClick={() => { try { updateDNAFromActivity("auditory"); } catch {} }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>▶</span>
                    <span>Watch Playlist</span>
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
