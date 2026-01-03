import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaChartLine, FaCheckCircle, FaBook, FaCrown } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import "../css/Progress.css";
import "../css/StartLearning.css"; // Ensure access to .premium-loading-overlay

// Register ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

// --- Constants ---
const ALL_COURSES = [
  { title: "HTML", color: "#E44D26", iconColor: "#f16529" },
  { title: "CSS", color: "#2965F1", iconColor: "#2965f1" },
  { title: "JavaScript", color: "#F0DB4F", iconColor: "#f7df1e" },
  { title: "Java", color: "#5382A1", iconColor: "#f89820" },
  { title: "Python", color: "#306998", iconColor: "#3776ab" },
  { title: "SQL", color: "#00758F", iconColor: "#00758f" },
];

const FALLBACK_MAX_MARKS = 250;

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 10 },
  },
  hover: {
    y: -8,
    scale: 1.03,
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
    transition: { type: "spring", stiffness: 300 },
  },
};

const CourseCard = React.memo(({ course }) => {
  const { title, color, progressPercent, totalMarks, maxMarks } = course;
  const isCompleted = progressPercent >= 100;

  // Chart Data
  const data = useMemo(
    () => ({
      labels: ["Completed", "Remaining"],
      datasets: [
        {
          data: [progressPercent, 100 - progressPercent],
          backgroundColor: [color, "#f0f2f5"],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    }),
    [progressPercent, color]
  );

  const options = {
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    maintainAspectRatio: false, // Ensure chart fits container
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1500,
      easing: "easeOutQuart",
    },
  };

  return (
    <motion.div
      className="premium-course-card"
      variants={cardVariants}
      whileHover="hover"
      style={{
        borderTop: `4px solid ${color}`,
      }}
    >
      <div className="card-header">
        <div className="icon-wrapper" style={{ background: `${color}15` }}>
          <FaBook style={{ color: color }} />
        </div>
        <div className="title-wrapper">
          <h3>{title}</h3>
          <span className="sc-label">Course</span>
        </div>
        {isCompleted && (
          <motion.div
            className="completion-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
          >
            <FaCheckCircle color="#2ecc71" size={20} />
          </motion.div>
        )}
      </div>

      <div className="chart-container">
        <div className="chart-wrapper">
          <Doughnut data={data} options={options} />
          <div className="chart-center-text">
            <span className="percent-text" style={{ color: color }}>
              {Math.round(progressPercent)}%
            </span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="stat-pill">
          <span className="label">Score</span>
          <span className="value">
            {totalMarks}/{maxMarks}
          </span>
        </div>
        <div className="stat-pill">
          <span className="label">Status</span>
          <span
            className="value"
            style={{ color: isCompleted ? "#2ecc71" : "#f1c40f" }}
          >
            {isCompleted ? "Done" : "Active"}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

// --- MAIN PROGRESS COMPONENT ---
function Progress({ userId, allCourseMaxMarks = {}, currentUserName }) {
  const [progressData, setProgressData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllCourseProgress = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Add artificial delay for spinner visibility
    const minLoadTime = new Promise((resolve) => setTimeout(resolve, 1200));

    const coursePromises = ALL_COURSES.map((course) =>
      axios
        .get(`/api/contests/${userId}/course?course=${course.title}`)
        .catch(() => ({
          data: { course: course.title, totalMarks: 0, contests: [] },
        }))
    );

    try {
      const [results] = await Promise.all([
        Promise.all(coursePromises),
        minLoadTime,
      ]);

      const formatted = results.map((res) => {
        const { course: title, totalMarks, contests } = res.data;
        const meta = ALL_COURSES.find((c) => c.title === title) || {};
        const key = (title || "").toLowerCase();
        const maxMarks = allCourseMaxMarks[key] || FALLBACK_MAX_MARKS;
        const safeTotalMarks = totalMarks || 0;

        const rawPercent = (safeTotalMarks / maxMarks) * 100;
        const progressPercent = Math.min(100, Math.max(0, rawPercent));

        return {
          title: title || "Unknown",
          color: meta.color || "#ccc",
          totalMarks: safeTotalMarks,
          maxMarks,
          progressPercent: Number(progressPercent.toFixed(1)),
          completedExamples: contests ? contests.length : 0,
        };
      });

      setProgressData(formatted);
    } catch (error) {
      console.error("Progress Error:", error);
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
      {/* Background Decor */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      {/* <AnimatePresence>
        {isLoading && (
          <motion.div
            className="premium-loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="spinner-wrapper">
              <div className="premium-spinner"></div>
            </div>
            <h2 className="loading-text">Analyzing Progress...</h2>
          </motion.div>
        )}
      </AnimatePresence> */}

      <motion.div
        className="header-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="title-premium">
          <FaChartLine className="title-icon" /> My Growth Analytics
        </h1>
        <p className="subtitle-premium">
          Track your coding journey across all technologies.
        </p>
      </motion.div>

      {!isLoading && (
        <motion.div
          className="premium-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {progressData.map((c) => (
            <CourseCard key={c.title} course={c} />
          ))}
        </motion.div>
      )}

      {completedCoursesCount > 0 && !isLoading && (
        <motion.div
          className="achievement-banner"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="crown-icon">
            <FaCrown />
          </div>
          <p>
            You have mastered <strong>{completedCoursesCount}</strong> courses!
            Access your verified certificates in the Certificates tab.
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default Progress;