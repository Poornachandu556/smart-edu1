"use client";
import { useEnrollments } from "@/hooks/useEnrollments";
import { motion } from "framer-motion";
import { useState } from "react";

export function EnrollControls({ courseId }: { courseId: string }) {
  const { isEnrolled, enroll, updateProgress, enrollments } = useEnrollments();
  const enrolled = isEnrolled(courseId);
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  const enrollment = enrollments.find(e => e.courseId === courseId);
  const progress = enrollment?.progressPercent || 0;

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      await enroll(courseId);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleProgressUpdate = async (newProgress: number) => {
    await updateProgress(courseId, newProgress);
  };

  return (
    <div className="space-y-4">
      {!enrolled ? (
        <motion.button 
          onClick={handleEnroll}
          disabled={isEnrolling}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-primary text-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEnrolling ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Enrolling...</span>
            </div>
          ) : (
            "🎓 Enroll in Course"
          )}
        </motion.button>
      ) : (
        <div className="space-y-4">
          {/* Progress Display */}
          <div className="text-center">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="opacity-70">Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary-500 to-accent-green rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Progress Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <motion.button 
              onClick={() => handleProgressUpdate(25)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 text-xs rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
            >
              25%
            </motion.button>
            <motion.button 
              onClick={() => handleProgressUpdate(50)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 text-xs rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
            >
              50%
            </motion.button>
            <motion.button 
              onClick={() => handleProgressUpdate(100)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 text-xs rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
            >
              Complete
            </motion.button>
          </div>

          {/* Status Badge */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-green/20 text-accent-green text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-accent-green"></span>
              Enrolled
            </span>
          </div>
        </div>
      )}
    </div>
  );
}


