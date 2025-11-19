import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaChartLine, FaCheckCircle, FaBook } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import "../css/Progress.css";

// --- Constants ---
const ALL_COURSES = [
    { title: "HTML", color: "#E44D26" },
    { title: "CSS", color: "#2965F1" },
    { title: "JavaScript", "color": "#F0DB4F" },
    { title: "Java", color: "#5382A1" },
    { title: "Python", color: "#306998" },
    { title: "SQL", color: "#00758F" },
];

const FALLBACK_MAX_MARKS = 250;

// Framer Motion Variants for Staggering
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Stagger effect for cards
            delayChildren: 0.2,
        },
    },
};

const cardItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};

const stickerVariants = {
    animate: {
        y: ["-10%", "10%"], // Float vertically
        rotate: [0, 5, -5, 0], // Subtle rotation
        transition: {
            y: {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
            },
            rotate: {
                duration: 10,
                repeat: Infinity,
                ease: "linear",
            },
        },
    },
};

/**
 * Calculates progress metrics for a single course.
 */
const calculateProgressMetrics = (courseData, maxMarksMap) => {
    const { course: title, totalMarks, contests } = courseData;
    const meta = ALL_COURSES.find(c => c.title === title);
    const key = title.toLowerCase();
    const maxMarks = maxMarksMap[key] || FALLBACK_MAX_MARKS;

    const rawPercent = (totalMarks / maxMarks) * 100;
    const progressPercent = Math.min(100, rawPercent);

    return {
        ...meta,
        totalMarks,
        maxMarks,
        progressPercent: Number(progressPercent.toFixed(1)),
        completedExamples: contests.length,
    };
};

// --- Sub-Components for Cleanliness ---

const CourseCard = React.memo(({ course }) => {
    const { title, color, progressPercent, totalMarks, maxMarks } = course;
    const isCompleted = progressPercent >= 100;

    return (
        <motion.div
            className="course-card-compact"
            style={{ borderLeftColor: color }}
            variants={cardItemVariants} // Apply stagger item variant
            whileHover={{ scale: 1.02, boxShadow: `0 8px 25px rgba(0,0,0,0.15)` }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
            <div className="card-left-section">
                <FaBook className="card-icon" style={{ color: color }} />
                <h3 className="card-title">{title}</h3>
                {isCompleted && (
                    <motion.div 
                        className="completed-tag-compact"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, type: "spring" }}
                    >
                        <FaCheckCircle />
                    </motion.div>
                )}
            </div>

            <div className="card-middle-section">
                {/* Compact Progress Bar */}
                <div className="bar-container-compact">
                    <motion.div
                        className="bar-fill-compact"
                        style={{ background: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                </div>
            </div>

            <div className="card-right-section">
                <motion.div 
                    className="metric-group"
                    whileHover={{ scale: 1.1, textShadow: `0 0 5px ${color}` }}
                    transition={{ type: "spring", stiffness: 500 }}
                >
                    <span className="metric-value" style={{ color: color }}>
                        {progressPercent}%
                    </span>
                    <span className="metric-label">Progress</span>
                </motion.div>
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

const SkeletonWrapper = React.memo(() => (
    <div className="grid-compact">
        {ALL_COURSES.map(course => (
            <div key={course.title} className="skeleton-card-compact"></div>
        ))}
    </div>
));

// --- Floating Background Elements ---
const BackgroundStickers = () => (
    <>
        {/* Large, transparent floating circles */}
        <motion.div 
            className="bg-sticker circle" 
            style={{ top: '10%', left: '5%', background: '#4c6fff30', width: '150px', height: '150px' }}
            variants={stickerVariants} 
            animate="animate"
        />
        <motion.div 
            className="bg-sticker circle" 
            style={{ bottom: '20%', right: '15%', background: '#E44D2630', width: '100px', height: '100px', animationDelay: '1s' }}
            variants={stickerVariants} 
            animate="animate"
        />
        {/* Smaller, square/blob shapes */}
        <motion.div 
            className="bg-sticker square" 
            style={{ top: '50%', right: '5%', background: '#F0DB4F30', width: '80px', height: '80px', borderRadius: '40% 60% 70% 30% / 50% 50% 50% 50%' }}
            variants={stickerVariants} 
            animate="animate"
        />
        <motion.div 
            className="bg-sticker square" 
            style={{ bottom: '5%', left: '30%', background: '#2965F130', width: '120px', height: '120px', animationDelay: '0.5s' }}
            variants={stickerVariants} 
            animate="animate"
        />
    </>
);


// --- Main Component ---
function Progress({ userId, allCourseMaxMarks = {} }) {
    const [progressData, setProgressData] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    // Fetch logic remains the same...
    const fetchAllCourseProgress = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            Swal.fire("Login Required", "Please log in to view progress.", "warning");
            return;
        }

        setIsLoading(true);

        const coursePromises = ALL_COURSES.map(course =>
            axios
                .get(`/api/contests/${userId}/course?course=${course.title}`)
                .catch(() => ({
                    data: { course: course.title, totalMarks: 0, contests: [] },
                }))
        );

        try {
            const results = await Promise.all(coursePromises);
            
            const formatted = results.map(result =>
                calculateProgressMetrics(result.data, allCourseMaxMarks)
            );

            setProgressData(formatted);

            // Set completed courses (only titles)
            setCompletedCourses(
                formatted.filter(c => c.progressPercent >= 100).map(c => c.title)
            );
        } catch {
            Swal.fire("Error", "Could not load progress data.", "error");
        } finally {
            setIsLoading(false);
        }
    }, [userId, allCourseMaxMarks]);

    useEffect(() => {
        fetchAllCourseProgress();
    }, [fetchAllCourseProgress]);

    // *** Passing progressData to Certificates component ***
    const goToCertificates = () => {
        navigate("/certificates", { 
            state: { 
                completedCourses, 
                progressData 
            } 
        });
    };

    return (
        <div className="progress-container-white">
            
            <BackgroundStickers /> 

            <motion.h1 
                className="title-white"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <FaChartLine /> My Learning Progress
            </motion.h1>

            <motion.button 
                className="certificate-btn-compact"
                onClick={goToCertificates}
                whileHover={{ scale: 1.08, boxShadow: "0 6px 25px rgba(76, 111, 255, 0.5)" }}
                whileTap={{ scale: 0.95 }}
            >
                View Certificates ({completedCourses.length})
            </motion.button>

            <h2 className="section-title-white">Course Breakdown</h2>

            {/* Apply staggering variants to the grid container */}
            {isLoading ? (
                <SkeletonWrapper />
            ) : (
                <motion.div 
                    className="grid-compact"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {progressData.map(course => (
                        <CourseCard key={course.title} course={course} />
                    ))}
                </motion.div>
            )}
        </div>
    );
}

export default Progress;