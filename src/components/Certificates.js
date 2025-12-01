import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrophy, FaLock, FaCheckCircle, FaChartLine, FaDownload, FaShieldAlt } from "react-icons/fa";
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas'; 
import { jsPDF } from 'jspdf';       
// You must centralize these constants, but for this file, we define them here:
const ALL_COURSES = [
    { title: "HTML", color: "#E44D26" },
    { title: "CSS", color: "#2965F1" },
    { title: "JavaScript", color: "#F0DB4F" },
    { title: "Java", color: "#5382A1" },
    { title: "Python", color: "#306998" },
    { title: "SQL", color: "#00758F" }
];
const FALLBACK_MAX_MARKS = 250; 

// Utility function to calculate progress (Needed here for item status)
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


// -------------------------------------------------------------
// === HIGH-FIDELITY CERTIFICATE DISPLAY ===
// -------------------------------------------------------------
const CertificateDisplay = ({ course, userName }) => {
    const certificateRef = useRef(null); 
    const currentUserName = userName || "Recipinus Namel";
    const certId = `CERT-${new Date().getFullYear()}-XP${Math.floor(Math.random() * 900) + 100}`;
    const courseTitle = course.title;
    const organization = "CodePulse-R";
    const qrDataContent = `https://codepulse-r.com/verify/${certId}`; 
    
    // --- DOWNLOAD FUNCTION: Generates PDF from HTML ---
    const handleDownload = async () => {
        if (!certificateRef.current) return;

        Swal.fire({
            title: 'Generating PDF...',
            text: 'Please wait, this might take a moment.',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('l', 'mm', 'a4'); 
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${currentUserName}_${courseTitle}_Certificate.pdf`);

            Swal.close();
            Swal.fire('Success!', 'Your certificate has been downloaded.', 'success');

        } catch (error) {
            console.error("PDF generation failed:", error);
            Swal.close();
            Swal.fire('Error', 'Failed to generate PDF. Check console for details.', 'error');
        }
    };

    return (
        <motion.div
            className="certificate-wrapper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="certificate-mock-page" ref={certificateRef}> 
                <div className="certificate-frame">
                    <div className="certificate-content">
                        {/* Logo and Title */}
                        <div className="cert-header">
                            <svg className="cert-logo-icon" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 464c-114.7 0-208-93.3-208-208S141.3 48 256 48s208 93.3 208 208-93.3 208-208 208zm-40-184H96v-40h120V96h40v144h152v40H296v128h-40V280z"/>
                            </svg>
                            <h1 className="cert-company">{organization}</h1>
                        </div>

                        <h2 className="cert-course-completed">COURSE COMPLETED</h2>
                        
                        <div className="cert-body-text">
                            <p>
                                This certifies that <strong className="cert-user-name">{currentUserName}</strong>
                                <br />has successfully completed the specialized <strong className="cert-user-name">{courseTitle}</strong> course in web development, as verified by {organization}.
                            </p>
                        </div>
                        
                        {/* Footer Details: QR, Seal, Signature */}
                        <div className="cert-footer-details">
                            <div className="cert-qr-and-id">
                                <div className="cert-qr-code">
                                    <QRCode value={qrDataContent} size={70} style={{ height: "auto", maxWidth: "100%", width: "100%" }}/>
                                </div>
                                <div className="cert-id-tag">{certId}</div>
                            </div>

                            <div className="cert-center-seal">
                                <div className="cert-seal-icon"> <FaShieldAlt /> </div>
                            </div>

                            <div className="cert-signature-area">
                                <div className="cert-signature-line"></div>
                                <p className="cert-signature-name">Mr.Ratan sir</p>
                                <p className="cert-signature-title">Lead Instructor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <motion.button
                className="cert-download-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload} 
            >
                <FaDownload style={{ marginRight: '8px' }} /> Download Certificate (PDF)
            </motion.button>
        </motion.div>
    );
};


// -------------------------------------------------------------
// === CERTIFICATES LIST ITEM ===
// -------------------------------------------------------------
const CertificateListItem = ({ course, maxMarksMap, userId, currentUserName }) => {
    const [courseData, setCourseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showVisual, setShowVisual] = useState(false);

    const fetchProgress = useCallback(async () => {
        if (!userId) {
             setIsLoading(false);
             return;
        }
        try {
            const res = await axios.get(`/api/contests/${userId}/course?course=${course.title}`);
            const metrics = calculateProgressMetrics(res.data, maxMarksMap);
            setCourseData(metrics);
        } catch (error) {
             console.error(`Failed to fetch progress for ${course.title}:`, error);
             setCourseData(calculateProgressMetrics({ course: course.title, totalMarks: 0, contests: [] }, maxMarksMap));
        } finally {
            setIsLoading(false);
        }
    }, [course, maxMarksMap, userId]);

    useEffect(() => {
        fetchProgress();
    }, [fetchProgress]);

    if (isLoading) {
        return <div className="certificate-list-item skeleton"></div>;
    }

    const isCompleted = courseData?.progressPercent >= 100;
    const progress = courseData?.progressPercent || 0;
    const statusText = isCompleted ? "Earned & Available" : `Progress: ${progress}%`;
    const statusIcon = isCompleted ? <FaCheckCircle style={{ color: '#28a745' }} /> : <FaChartLine style={{ color: course.color }} />;

    return (
        <div className="certificate-item-container">
            <motion.div 
                className="certificate-list-item" 
                style={{ borderLeftColor: course.color }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="item-icon" style={{ background: course.color + '20', color: course.color }}>
                    {course.title.substring(0, 2)}
                </div>
                <div className="item-details">
                    <h4 className="item-title">{course.title} Certification</h4>
                    <div className="item-progress-bar-container">
                        <div className="item-progress-bar-fill" style={{ width: `${progress}%`, background: course.color }}></div>
                    </div>
                </div>
                <div className="item-action">
                    <p className="item-status">{statusIcon} {statusText}</p>
                    {isCompleted ? (
                        <button className="view-cert-btn" onClick={() => setShowVisual(!showVisual)}>
                            {showVisual ? "Hide Certificate" : "View/Download"}
                        </button>
                    ) : (
                        <button className="view-cert-btn locked" disabled>
                            <FaLock /> Locked
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Display the CertificateDisplay component when the user clicks 'View' */}
            {isCompleted && showVisual && (
                <div className="full-certificate-display-container">
                    <CertificateDisplay 
                        course={course} 
                        userName={currentUserName} 
                    />
                </div>
            )}
        </div>
    );
};


// -------------------------------------------------------------
// === MAIN CERTIFICATES COMPONENT ===
// -------------------------------------------------------------
function Certificates({ userId, allCourseMaxMarks, currentUserName }) {
    if (!userId) {
         return (
            <div className="certificate-page-list-container">
                <h1 className="title-white"><FaTrophy /> All Certificate Status</h1>
                <div className="certificate-list-placeholder">
                    <p>Please **log in** to track your course progress and view your earned certificates.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="certificate-page-list-container">
            <h1 className="title-white"><FaTrophy /> All Certificate Status</h1>
            
            <p className="section-title-white">
                Review the status of all available course certificates.
                Certificates are unlocked upon achieving  100% progress.
            </p>
            
            <div className="certificate-list-grid">
                {ALL_COURSES.map(course => (
                    <CertificateListItem 
                        key={course.title} 
                        course={course} 
                        maxMarksMap={allCourseMaxMarks} 
                        userId={userId} 
                        currentUserName={currentUserName}
                    />
                ))}
            </div>
        </div>
    );
}

export default Certificates;