import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaGraduationCap,
  FaCamera,
  FaAward,
  FaMapMarkerAlt,
  FaPen,
  FaCheckCircle,
  FaChartLine,
  FaStar,
  FaTrophy,
  FaUser,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "../css/Profile.css";
import {
  chapterInfoByLang,
  ExamConfig,
  learningContexts,
} from "./StartLearning1";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ALL_COURSES = [
  { title: "HTML", color: "#E44D26" },
  { title: "CSS", color: "#2965F1" },
  { title: "JavaScript", color: "#F0DB4F" },
  { title: "Java", color: "#5382A1" },
  { title: "Python", color: "#306998" },
  { title: "SQL", color: "#00758F" },
];

const FALLBACK_MAX_MARKS = 250;

const Profile = ({ userProfile }) => {
  const [profile, setProfile] = useState(userProfile || {});
  const [courseProgress, setCourseProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Sync prop changes
  useEffect(() => {
    if (userProfile) setProfile(userProfile);
  }, [userProfile]);

  // Load images from local storage
  useEffect(() => {
    const savedImage = localStorage.getItem("userProfileImage");
    if (savedImage) setProfileImage(savedImage);

    const savedCover = localStorage.getItem("userCoverImage");
    if (savedCover) setCoverImage(savedCover);
  }, []);

  // Calculate Max Marks (Memoized like StartLearning.js)
  const allCourseMaxMarks = useMemo(() => {
    const maxMarksMap = {};
    if (chapterInfoByLang && learningContexts) {
      Object.entries(chapterInfoByLang).forEach(([lang, info]) => {
        let totalExamples = 0;
        const context = learningContexts[lang];
        // Ensure chapterKeys exists
        if (info && info.chapterKeys) {
          info.chapterKeys.forEach((chapterNum) => {
            try {
              const key = `./CodingChapter${chapterNum}.json`;
              const data = context(key);
              totalExamples += Array.isArray(data) ? data.length : 0;
            } catch (e) {}
          });
        }
        maxMarksMap[lang] = totalExamples * ExamConfig.codingMarks;
      });
    }
    return maxMarksMap;
  }, []);
  const maskMobile = (mobile) => {
    if (!mobile) return "";
    return mobile.replace(/(\d{2})\d{5}(\d{3})/, "$1XXXXX$2");
  };
  // --- Categorization Helpers ---
  const CATEGORIES = {
    Frontend: ["HTML", "CSS", "JavaScript"],
    Backend: ["Java", "Python"],
    Database: ["SQL"],
  };

  const getCategory = (course) => {
    const c = course.toUpperCase();
    if (CATEGORIES.Frontend.some((t) => t.toUpperCase() === c))
      return "Frontend";
    if (CATEGORIES.Backend.some((t) => t.toUpperCase() === c)) return "Backend";
    if (CATEGORIES.Database.some((t) => t.toUpperCase() === c))
      return "Database";
    return "Other";
  };

  // State to hold raw contest history
  const [allContests, setAllContests] = useState([]);

  // Fetch Course Progress & History
  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem("token");
      if (!token || !profile._id) {
        setLoading(false);
        return;
      }

      try {
        const coursePromises = ALL_COURSES.map((course) =>
          axios
            .get(`/api/contests/${profile._id}/course?course=${course.title}`)
            .catch(() => ({
              data: { course: course.title, totalMarks: 0, contests: [] },
            }))
        );

        const results = await Promise.all(coursePromises);

        let grandContestList = [];
        const formatted = results.map((res) => {
          const { course: title, totalMarks, contests = [] } = res.data;

          // Collect history
          if (Array.isArray(contests)) {
            contests.forEach((c) => {
              grandContestList.push({
                ...c,
                course: title,
                date: new Date(c.createdAt || Date.now()).toLocaleDateString(), // Normalize date
              });
            });
          }

          const key = (title || "").toLowerCase();
          const maxMarks = allCourseMaxMarks[key] || FALLBACK_MAX_MARKS;
          const safeTotalMarks = totalMarks || 0;
          const rawPercent = (safeTotalMarks / maxMarks) * 100;

          return {
            title: title || "Unknown",
            score: Number(Math.min(100, Math.max(0, rawPercent)).toFixed(1)),
            totalMarks: safeTotalMarks,
          };
        });

        setCourseProgress(formatted);
        setAllContests(grandContestList);
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    if (profile._id) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [profile._id, allCourseMaxMarks]);

  // --- Handlers ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem("userProfileImage", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Statistics Calculations ---
  const stats = useMemo(() => {
    const totalScore = courseProgress.reduce(
      (acc, curr) => acc + curr.score,
      0
    );
    const avgScore =
      courseProgress.length > 0
        ? (totalScore / courseProgress.length).toFixed(1)
        : 0;

    const totalMarksObtained = courseProgress.reduce(
      (acc, curr) => acc + curr.totalMarks,
      0
    );

    return { avgScore, totalMarksObtained };
  }, [courseProgress]);

  // Time Range State
  const [timeRange, setTimeRange] = useState("7"); // "7", "30", "ALL", "CUSTOM"
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // --- Process Data for Stock-like Chart ---
  const performanceData = useMemo(() => {
    if (allContests.length === 0) return { labels: [], datasets: [] };

    // 1. Sort all contests chronologically
    const sortedHistory = [...allContests].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    // 2. Extract unique Dates
    let uniqueDates = [
      ...new Set(
        sortedHistory.map((item) =>
          new Date(item.createdAt).toLocaleDateString()
        )
      ),
    ];
    uniqueDates.sort((a, b) => new Date(a) - new Date(b));

    // FILTER DATES BASED ON RANGE
    if (timeRange === "7") {
      uniqueDates = uniqueDates.slice(-7);
    } else if (timeRange === "30") {
      uniqueDates = uniqueDates.slice(-30);
    } else if (timeRange === "CUSTOM" && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      // Include end date by setting time to end of day
      end.setHours(23, 59, 59, 999);

      uniqueDates = uniqueDates.filter((d) => {
        const dateObj = new Date(d);
        return dateObj >= start && dateObj <= end;
      });
    }
    // "ALL" keeps it as is

    // 3. Calculate Category Max Marks for Percentage Scale
    const catMaxMarks = { Frontend: 0, Backend: 0, Database: 0 };
    Object.entries(allCourseMaxMarks).forEach(([course, marks]) => {
      const cat = getCategory(course);
      if (catMaxMarks[cat] !== undefined) catMaxMarks[cat] += marks;
    });
    // Fallback to avoid division by zero
    if (catMaxMarks.Frontend === 0) catMaxMarks.Frontend = 1000;
    if (catMaxMarks.Backend === 0) catMaxMarks.Backend = 1000;
    if (catMaxMarks.Database === 0) catMaxMarks.Database = 1000;

    // 4. Calculate Cumulative Totals for ALL dates first
    // Tracking current total marks for each category
    let currentTotals = { Frontend: 0, Backend: 0, Database: 0 };

    // Arrays to store full history
    const fullHistory = {
      Frontend: [],
      Backend: [],
      Database: [],
    };


    // Re-calculating uniqueDatesFull for calculation
    const allUniqueDates = [
      ...new Set(
        sortedHistory.map((item) =>
          new Date(item.createdAt).toLocaleDateString()
        )
      ),
    ].sort((a, b) => new Date(a) - new Date(b));

    const dateToTotalsMap = {};

    allUniqueDates.forEach((date) => {
      const daysContests = sortedHistory.filter(
        (c) => new Date(c.createdAt).toLocaleDateString() === date
      );

      daysContests.forEach((c) => {
        const cat = getCategory(c.course);
        if (currentTotals[cat] !== undefined) {
          const marks = c.marksObtained || c.score || 10;
          currentTotals[cat] += marks;
        }
      });

      // Save snapshot for this date
      dateToTotalsMap[date] = {
        Frontend: Math.min(
          100,
          (currentTotals.Frontend / catMaxMarks.Frontend) * 100
        ),
        Backend: Math.min(
          100,
          (currentTotals.Backend / catMaxMarks.Backend) * 100
        ),
        Database: Math.min(
          100,
          (currentTotals.Database / catMaxMarks.Database) * 100
        ),
      };
    });

    // Now decide which dates to show
    let displayDates = [...allUniqueDates];
    if (timeRange === "7") {
      displayDates = displayDates.slice(-7);
    } else if (timeRange === "30") {
      displayDates = displayDates.slice(-30);
    } else if (timeRange === "CUSTOM" && customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      end.setHours(23, 59, 59, 999);

      displayDates = displayDates.filter((d) => {
        const dateObj = new Date(d);
        return dateObj >= start && dateObj <= end;
      });
    }

    // Build the final arrays from the map
    const displayFrontend = displayDates.map(
      (d) => dateToTotalsMap[d].Frontend
    );
    const displayBackend = displayDates.map((d) => dateToTotalsMap[d].Backend);
    const displayDatabase = displayDates.map(
      (d) => dateToTotalsMap[d].Database
    );

    return {
      labels: displayDates.length > 0 ? displayDates : ["Start"],
      datasets: [
        {
          label: "Frontend",
          data: displayDates.length > 0 ? displayFrontend : [0],
          borderColor: "#2965F1", // Blue
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, "rgba(41, 101, 241, 0.5)");
            gradient.addColorStop(1, "rgba(41, 101, 241, 0.0)");
            return gradient;
          },
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Backend",
          data: displayDates.length > 0 ? displayBackend : [0],
          borderColor: "#E44D26", // Red/Orange
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, "rgba(228, 77, 38, 0.5)");
            gradient.addColorStop(1, "rgba(228, 77, 38, 0.0)");
            return gradient;
          },
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Database",
          data: displayDates.length > 0 ? displayDatabase : [0],
          borderColor: "#00B8D9", // Cyan
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, "rgba(0, 184, 217, 0.5)");
            gradient.addColorStop(1, "rgba(0, 184, 217, 0.0)");
            return gradient;
          },
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [
    allContests,
    allCourseMaxMarks,
    timeRange,
    customStartDate,
    customEndDate,
  ]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#2b3674",
        bodyColor: "#4a5568",
        borderColor: "#E0E5F2",
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (context) =>
            ` ${context.dataset.label}: ${Number(context.parsed.y).toFixed(
              1
            )}%`, // Percent
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Enforce 100% max
        grid: {
          color: "#F4F7FE",
          borderDash: [5, 5],
        },
        ticks: { font: { family: "'Poppins', sans-serif" }, color: "#A3AED0" },
        title: {
          display: true,
          text: "Proficiency %",
          color: "#A3AED0",
          font: { size: 10 },
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#A3AED0", font: { weight: "600", size: 10 } },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  // Safe CGPA Display
  const displayCGPA =
    profile.cgpa !== undefined && profile.cgpa !== null ? profile.cgpa : "N/A";

  return (
    <div className="profile-premium-wrapper">
      <div className="profile-header-premium">
        <div className="header-overlay"></div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          hidden
          accept="image/*"
        />

        <div className="profile-identity-premium">
          {/* LEFT SIDE: Avatar + Name + Contact + Badges */}
          <div className="header-left-section">
            <div className="avatar-row">
              <div
                className="avatar-wrapper"
                onClick={() => fileInputRef.current.click()}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    {profile.studentName?.[0] || "U"}
                  </div>
                )}
                <div className="avatar-edit-overlay">
                  <FaCamera />
                </div>
              </div>

              <div className="left-name-block">
                {/* Row 1: Name Only */}
                {/* <h2 className="left-profile-name">
                  {profile.studentName || "Student Name"}
                </h2> */}

                {/* Row 2: Badges */}
                {/* <div className="badges-row-left">
                  <span className="badge-premium badge-gold">
                    <FaTrophy /> Top Coder
                  </span>
                  <span className="badge-premium badge-blue">
                    <FaCheckCircle /> Verified
                  </span>
                </div> */}
              </div>
            </div>
          </div>

          {/* CENTRE: Big Decorative Name & Title & Contact */}
          <div className="business-card-content">
            <h1 className="bc-name">
              <span className="welcome-text">Welcome,&nbsp;</span>
              {profile.studentName
                ? profile.studentName.toUpperCase()
                : "Student"}
            </h1>
            <h3 className="bc-title">FULL STACK DEVELOPER</h3>

            <p className="bc-contact">
              {profile.email || "email@example.com"}{" "}
              <span className="bc-sep">|</span> {profile.college || "Collage"}
            </p>
          </div>
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      <div className="profile-content-premium">
        {/* Left Column: Personal Info & Summary */}
        <aside className="profile-sidebar-premium">
          {/* Quick Stats Grid Vertical */}
          <div className="stats-vertical-stack">
            <div className="stat-card-vertical">
              <div className="icon-circle c1">
                <FaAward />
              </div>
              <div className="stat-data">
                <h3>{stats.totalMarksObtained}</h3>
                <p>Total Points</p>
              </div>
            </div>
            <div className="stat-card-vertical">
              <div className="icon-circle c2">
                <FaStar />
              </div>
              <div className="stat-data">
                <h3>{stats.avgScore}%</h3>
                <p>Avg Proficiency</p>
              </div>
            </div>
          </div>

          <div className="glass-panel info-panel">
            <h3>
              <FaUser className="info-icon" /> Personal Details
            </h3>
            <div className="info-row">
              <FaEnvelope className="info-icon" />
              <div>
                <label>Email</label>
                <p>{profile.email || "N/A"}</p>
              </div>
            </div>
            <div className="info-row">
              <FaPhone className="info-icon" />
              <div>
                <label>Mobile</label>
                <p>{maskMobile(profile.mobile) || "N/A"}</p>
              </div>
            </div>
            <div className="info-row">
              <FaUniversity className="info-icon" />
              <div>
                <label>College</label>
                <p>{profile.college || "N/A"}</p>
              </div>
            </div>
            <div className="info-row">
              <FaGraduationCap className="info-icon" />
              <div>
                <label>Qualification</label>
                <p>{profile.qualification || "N/A"}</p>
              </div>
            </div>
            <div className="info-row">
              <FaAward className="info-icon" />
              <div>
                <label>CGPA</label>
                <p>{displayCGPA}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: MAIN GRAPH */}
        <main className="profile-main-area">
          <div className="glass-panel chart-panel-large">
            <div className="chart-header">
              <div className="chart-header-content">
                <h3>
                  <FaChartLine /> Tech Performance Growth
                </h3>
                <p>Tracking your cumulative proficiency % over time.</p>
              </div>
              <div className="chart-actions">
                {timeRange === "CUSTOM" && (
                  <>
                    <input
                      type="date"
                      className="chart-date-input"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                    <span className="date-sep">-</span>
                    <input
                      type="date"
                      className="chart-date-input"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                  </>
                )}
                <select
                  className="chart-filter-select"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="ALL">All Time</option>
                  <option value="CUSTOM">Custom Range</option>
                </select>
              </div>
            </div>

            <div className="main-chart-container">
              {courseProgress.length > 0 ? (
                <Line data={performanceData} options={chartOptions} />
              ) : (
                <div className="empty-chart-state">
                  <p>
                    Start solving challenges to see your performance graph build
                    up!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Encouragement Section */}
          <div className="glass-panel encouragement-panel">
            <div className="encouragement-content">
              <h4>Keep Pushing Forward! 🚀</h4>
              <p>
                Consistent practice in contests is key. Improve your scores to
                see your growth graph rise!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
