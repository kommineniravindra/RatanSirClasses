import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from 'sweetalert2'; 
import { 
    FaCertificate, FaCrown, FaCheckCircle, FaLock, FaDownload, 
    FaStar, FaCode, FaCss3Alt, FaJs, FaJava, FaPython, FaDatabase 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "../css/Certificates.css";

// --- ALL COURSES ---
const DEFAULT_ALL_COURSES_DATA = [
    { title: "HTML", id: 1, icon: FaCode, color: "#E44D26", description: "Proficiency in semantic HTML5, accessibility standards (ARIA), and form validation." },
    { title: "CSS", id: 2, icon: FaCss3Alt, color: "#2965F1", description: "Expertise in Flexbox, Grid Layout, complex animations, and responsive design principles." },
    { title: "JavaScript", id: 3, icon: FaJs, color: "#F0DB4F", description: "Completed ES6 projects, async programming, and DOM manipulation." },
    { title: "Java", id: 4, icon: FaJava, color: "#5382A1", description: "Mastered OOP, DSA basics, and multithreading." },
    { title: "Python", id: 5, icon: FaPython, color: "#306998", description: "Skilled in automation, web scraping, and app logic." },
    { title: "SQL", id: 6, icon: FaDatabase, color: "#00758F", description: "Strong in querying, normalization, indexing, and DB design." },
];

// --- CERTIFICATE MODAL ---
const CertificateModal = ({ cert, onClose, courseMap }) => {
    // FIX 1: Hook moved to the top level
    const [isDownloading, setIsDownloading] = useState(false); 
    
    if (!cert) return null;

    const mapData = courseMap[cert.title.toLowerCase()] || {};
    const isAwarded = cert.isCompleted;

    // *** MOCK DOWNLOAD HANDLER ***
    const handleDownload = () => {
        if (!isAwarded) return;

        setIsDownloading(true);
        // In a real application, you would make an API call here to generate/fetch the file URL
        setTimeout(() => {
            setIsDownloading(false);
            
            // Mock success notification
            Swal.fire({
                title: 'Download Complete!',
                text: `${cert.title} Certificate is ready to download. (Simulated file download)`,
                icon: 'success',
                confirmButtonColor: mapData.color,
            });

            onClose(); 
        }, 1500); 
    };

    return (
        <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div 
                className="modal-content"
                initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close-btn" onClick={onClose}>&times;</button>

                <div className="modal-header" style={{ borderBottom: `3px solid ${mapData.color}` }}>
                    {React.createElement(mapData.icon || FaCertificate, { className: "modal-icon", style: { color: mapData.color } })}
                    <h2 className="modal-title">{cert.title} Certification</h2>
                </div>

                <div className="modal-body">
                    {isAwarded ? (
                        <>
                            <p><strong>Certified On:</strong> {cert.date}</p>
                            <p><strong>Final Grade:</strong> <span className="modal-grade" style={{ backgroundColor: mapData.color }}>A+</span></p>
                            <p>{mapData.description}</p>

                            <div className="modal-actions">
                                <button 
                                    className="modal-download-btn" 
                                    style={{ backgroundColor: mapData.color }}
                                    onClick={handleDownload} 
                                    disabled={isDownloading}
                                >
                                    {isDownloading ? (
                                        <span>Downloading...</span>
                                    ) : (
                                        <>
                                            <FaDownload /> Download Certificate
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h4 style={{ color: "red" }}>Not Completed</h4>
                            <p>Your progress: {cert.progress}%</p>
                            <button className="modal-download-btn" disabled>
                                <FaLock /> Complete Course To Download
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// ===================================================
// 			MAIN CERTIFICATES
// ===================================================
const Certificates = ({ 
    allCourses = DEFAULT_ALL_COURSES_DATA, 
}) => {
    const location = useLocation();
    const navigate = useNavigate(); // For redirecting if data is missing
    const [selectedCert, setSelectedCert] = useState(null);

    // *** RETRIEVE STATE DATA ***
    const passedState = location.state || {};
    const allProgressData = passedState.progressData || []; 
    const completedTitles = passedState.completedCourses || [];
    
    // CASE INSENSITIVE MAP for lookup
    const COURSE_MAP = allCourses.reduce((acc, course) => {
        acc[course.title.toLowerCase()] = course;
        return acc;
    }, {});

    // --- NAVIGATION/DATA GUARD ---
    // If navigating directly or refreshing, state data is often lost.
    if (allProgressData.length === 0 && completedTitles.length === 0 && location.key !== 'default') {
        return (
            <div className="certificates-container" style={{ textAlign: 'center', padding: '50px' }}>
                <h1 className="certs-header"><FaCrown /> Certificates</h1>
                <p className="learning-info-box" style={{ backgroundColor: '#fff3cd', color: '#856404', borderLeft: '5px solid #ffc107', padding: '15px', borderRadius: '8px' }}>
                    ⚠️ **Data Error.** Please navigate back to the **Progress** page and click 'View Certificates' again. 
                    Course data was not loaded or was lost during refresh.
                </p>
                <button 
                    onClick={() => navigate('/', { replace: true })} 
                    style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }
    // -----------------------------


    // -------------------------
    // 		AWARDED LIST
    // -------------------------
    const awardedCertificates = completedTitles
        .map(title => {
            const mapData = COURSE_MAP[title.toLowerCase()];
            if (!mapData) return null;

            return {
                id: mapData.id,
                title: mapData.title,
                isCompleted: true,
                color: mapData.color,
                icon: mapData.icon,
                date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                grade: "A+",
                details: mapData.description
            };
        })
        .filter(x => x);

    // -------------------------
    // 	PENDING COURSE LIST (Uses actual progress data now)
    // -------------------------
    const comprehensiveCourseList = allProgressData
        .filter(course => course.progressPercent < 100) // Only include courses not yet complete
        .map(course => ({
            id: COURSE_MAP[course.title.toLowerCase()].id, // Use ID from mapData for consistency
            title: course.title,
            color: course.color,
            icon: COURSE_MAP[course.title.toLowerCase()].icon, // Get icon from COURSE_MAP
            progress: course.progressPercent,
            isCompleted: false
        }));

    const ProgressRing = ({ radius, stroke, progress, color }) => {
        const norm = radius - stroke * 2;
        const circ = norm * 2 * Math.PI;
        const offset = circ - (progress / 100) * circ;

        return (
            <svg width={radius * 2} height={radius * 2}>
                <circle stroke="#ddd" fill="transparent" strokeWidth={stroke} r={norm} cx={radius} cy={radius} />
                <motion.circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circ}
                    style={{ strokeDashoffset: offset }}
                    strokeLinecap="round"
                    r={norm}
                    cx={radius}
                    cy={radius}
                    transform={`rotate(-90 ${radius} ${radius})`}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.2 }}
                />
                <text x="50%" y="50%" textAnchor="middle" dy="5px">{progress}%</text>
            </svg>
        );
    };

    const handleCardClick = (course) => {
        const mapData = COURSE_MAP[course.title.toLowerCase()];
        setSelectedCert({
            ...course,
            details: mapData.description,
            icon: mapData.icon
        });
    };

    return (
        <div className="certificates-container">
            <h1 className="certs-header"><FaCrown /> My Certificates</h1>

            <h2 className="certs-subheader">Awarded Certificates ({awardedCertificates.length})</h2>
            <hr />

            {/* AWARDED SECTION */}
            <div className="certs-grid">
                {awardedCertificates.length > 0 ? (
                    awardedCertificates.map(cert => (
                        <motion.div key={cert.id}
                            className="certificate-card awarded"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleCardClick(cert)}
                        >
                            <div className="cert-color-band" style={{ background: cert.color }}></div>
                            <div className="cert-content">
                                {React.createElement(cert.icon, { className: "cert-icon", style: { color: cert.color } })}
                                <h3>{cert.title} Certificate</h3>
                                <p>Certified: {cert.date}</p>
                                <span className="cert-grade" style={{ background: cert.color }}>A+</span>
                                <button className="cert-view-btn" style={{ backgroundColor: cert.color }}>
                                    View / Download
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="learning-info-box">No certificates yet. Complete a course to unlock.</p>
                )}
            </div>

            <hr />

            {/* PROGRESS SECTION */}
            <h2 className="certs-subheader"><FaCheckCircle /> Continue Learning</h2>

            <div className="pending-grid">
                {comprehensiveCourseList.length > 0 ? (
                    comprehensiveCourseList.map(course => {
                        const Icon = course.icon;
                        return (
                            <motion.div key={course.id}
                                className="pending-course-card"
                                whileHover={{ scale: 1.05 }}
                                onClick={() => handleCardClick(course)}
                            >
                                <Icon className="pending-header-icon" style={{ color: course.color }} />
                                <h4>{course.title}</h4>

                                <ProgressRing radius={40} stroke={5} progress={course.progress} color={course.color} />

                                <p className="progress-text">{course.progress}% Completed</p>
                                <FaLock className="lock-icon" />
                            </motion.div>
                        );
                    })
                ) : (
                    <p className="learning-info-box">Great job! All defined courses are complete. </p>
                )}
            </div>

            <AnimatePresence>
                {selectedCert && (
                    <CertificateModal 
                        cert={selectedCert} 
                        onClose={() => setSelectedCert(null)} 
                        courseMap={COURSE_MAP}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Certificates;