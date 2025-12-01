import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaChartLine, FaCheckCircle, FaBook, FaDownload } from "react-icons/fa"; // Removed FaShieldAlt
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import "../css/Progress.css";

// --- Constants ---
const ALL_COURSES = [
  { title: "HTML", color: "#E44D26" },
  { title: "CSS", color: "#2965F1" },
  { title: "JavaScript", color: "#F0DB4F" },
  { title: "Java", color: "#5382A1" },
  { title: "Python", color: "#306998" },
  { title: "SQL", color: "#00758F" }
];

const FALLBACK_MAX_MARKS = 250;

// Stagger animation container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 }, opacity: 1 }
};

const cardItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

// Floating stickers
const stickerVariants = {
  animate: {
    y: ["-10%", "10%"],
    rotate: [0, 5, -5, 0],
    transition: {
      y: { duration: 5, repeat: Infinity, repeatType: "reverse" },
      rotate: { duration: 10, repeat: Infinity }
    }
  }
};

// -----------------------------------------
// NOTE: CertificateDisplay component and PDF/QR imports are removed from here.
// -----------------------------------------

const calculateProgressMetrics = (courseData, maxMarksMap) => {
const { course: title, totalMarks, contests } = courseData;
const meta = ALL_COURSES.find((c) => c.title === title);
const key = title.toLowerCase();
const maxMarks = maxMarksMap[key] || FALLBACK_MAX_MARKS;

const rawPercent = (totalMarks / maxMarks) * 100;
const progressPercent = Math.min(100, rawPercent);

return {
...meta,
totalMarks,
maxMarks,
progressPercent: Number(progressPercent.toFixed(1)),
completedExamples: contests.length
};
};

const CourseCard = React.memo(({ course }) => {
const { title, color, progressPercent, totalMarks, maxMarks } = course;
const isCompleted = progressPercent >= 100;

return (
<motion.div
className="course-card-compact"
style={{ borderLeftColor: color }}
variants={cardItemVariants}
whileHover={{ scale: 1.02 }}
>
<div className="card-left-section">
 <FaBook className="card-icon" style={{ color }} />
 <h3 className="card-title">{title}</h3>

 {isCompleted && (
 <motion.div
 className="completed-tag-compact"
 initial={{ opacity: 0, scale: 0.5 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.4 }}
 >
 <FaCheckCircle />
 </motion.div>
 )}
</div>

<div className="card-middle-section">
 <div className="bar-container-compact">
 <motion.div
 className="bar-fill-compact"
 style={{ background: color }}
 initial={{ width: 0 }}
 animate={{ width: `${progressPercent}%` }}
 transition={{ duration: 1.2 }}
 />
 </div>
</div>

<div className="card-right-section">
 <div className="metric-group">
 <span className="metric-value" style={{ color }}>
 {progressPercent}%
 </span>
 <span className="metric-label">Progress</span>
 </div>

 <div className="metric-group">
 <span className="metric-value score-value">
 {totalMarks} / {maxMarks}
 </span>
 <span className="metric-label">Score</span>
 </div>
</div>
</motion.div>
);
});

const SkeletonWrapper = () => (
<div className="grid-compact">
{ALL_COURSES.map((c) => (
<div key={c.title} className="skeleton-card-compact"></div>
))}
</div>
);

const BackgroundStickers = () => (
<>
<motion.div
className="bg-sticker circle"
style={{ top: "10%", left: "5%", background: "#4c6fff30", width: "150px", height: "150px" }}
variants={stickerVariants}
animate="animate"
/>

<motion.div
className="bg-sticker circle"
style={{ bottom: "20%", right: "15%", background: "#E44D2630", width: "100px", height: "100px" }}
variants={stickerVariants}
animate="animate"
/>
</>
);

// --- MAIN PROGRESS COMPONENT ---
function Progress({ userId, allCourseMaxMarks = {}, currentUserName }) {
const [progressData, setProgressData] = useState([]);
const [isLoading, setIsLoading] = useState(true);

const navigate = useNavigate();

const fetchAllCourseProgress = useCallback(async () => {
if (!userId) {
setIsLoading(false);
Swal.fire("Login Required", "Please log in to view progress.", "warning");
return;
}

setIsLoading(true);

const coursePromises = ALL_COURSES.map((course) =>
axios
 .get(`/api/contests/${userId}/course?course=${course.title}`)
 .catch(() => ({ data: { course: course.title, totalMarks: 0, contests: [] } }))
);

try {
const results = await Promise.all(coursePromises);

const formatted = results.map((res) =>
 calculateProgressMetrics(res.data, allCourseMaxMarks)
);

setProgressData(formatted);
} catch {
Swal.fire("Error", "Could not load progress data.", "error");
} finally {
setIsLoading(false);
}
}, [userId, allCourseMaxMarks]);

useEffect(() => {
fetchAllCourseProgress();
}, [fetchAllCourseProgress]);

const completedCoursesCount = progressData.filter(
(c) => c.progressPercent >= 100
).length;

return (
<div className="progress-container-white">
<BackgroundStickers />

<motion.h1 className="title-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
 <FaChartLine /> My Learning Progress
</motion.h1>

<h2 className="section-title-white">Course Breakdown</h2>

{isLoading ? (
 <SkeletonWrapper />
) : (
 <motion.div
 className="grid-compact"
 variants={containerVariants}
 initial="hidden"
 animate="visible"
 >
 {progressData.map((c) => (
 <CourseCard key={c.title} course={c} />
 ))}
 </motion.div>
)}

  {/* Removed certificate display: Now happens entirely in Certificates.js */}
{completedCoursesCount > 0 && (
    <p className="certificate-tip">
        🎉 **{completedCoursesCount} Certificate{completedCoursesCount > 1 ? 's' : ''} earned!** View and download them in the **Certificates** section.
    </p>
)}

</div>
);
}

export default Progress;