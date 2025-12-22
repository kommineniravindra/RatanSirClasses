import React, { useState, useEffect, useMemo } from "react";
import {
  FaHome,
  FaChartLine,
  FaUserCircle,
  FaBook,
  FaFileCode,
  FaBars,
  FaDatabase,
  FaCss3Alt,
  FaJava,
  FaJs,
  FaPython,
  FaTasks,
  FaCommentDots,
  FaSignOutAlt,
  FaHtml5,
  FaChevronRight,
  FaArrowAltCircleRight,
  FaArrowRight,
  FaDiscourse,
} from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/StartLearning.css";
import Feedback from "./Feedback";
import Certificates from "./Certificates";
import Progress from "./Progress";
import Worksheets from "./Worksheets";
import Profile from "./Profile";
import StartLearning1, {
  chapterInfoByLang,
  ExamConfig,
  learningContexts,
} from "./StartLearning1";

// ----------------- Component -----------------
function StartLearning() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize from LocalStorage if available
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("userProfile");
      return saved
        ? JSON.parse(saved)
        : {
            studentName: "Student",
            _id: null,
            email: null,
            mobile: null,
            dob: null,
            college: null,
            qualification: null,
            passingYear: null,
            cgpa: null,
          };
    } catch (e) {
      return { studentName: "Student" };
    }
  });
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Calculate Max Marks (using exported chapterInfoByLang from StartLearning1)
  const allCourseMaxMarks = useMemo(() => {
    const maxMarksMap = {};
    if (chapterInfoByLang && learningContexts) {
      Object.entries(chapterInfoByLang).forEach(([lang, info]) => {
        let totalExamples = 0;
        const context = learningContexts[lang];
        info.chapterKeys.forEach((chapterNum) => {
          try {
            const key = `./CodingChapter${chapterNum}.json`;
            const data = context(key);
            totalExamples += Array.isArray(data) ? data.length : 0;
          } catch (e) {}
        });
        maxMarksMap[lang] = totalExamples * ExamConfig.codingMarks;
      });
    }
    return maxMarksMap;
  }, []);

  // ----------------- Fetch profile -----------------
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserProfile((prev) => ({
          ...prev,
          studentName: "Guest",
          _id: null,
        }));
        return;
      }

      if (userProfile._id && activeSection !== "Profile") return;

      setIsProfileLoading(true);
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const profileResponse = await axios.get(
          "/api/auth/profile",
          authHeaders
        );
        const profileData =
          profileResponse.data.user || profileResponse.data || {};
        // Save to LocalStorage
        localStorage.setItem("userProfile", JSON.stringify(profileData));

        setUserProfile((prev) => ({
          ...prev,
          ...profileData,
          studentName: profileData.studentName || "User",
          _id: profileData._id || null,
        }));
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          Swal.fire({
            title: "Session Expired",
            text: "Please log in again.",
            icon: "warning",
          }).then(() => {
            handleLogout(false);
          });
        }
        setUserProfile((prev) => ({
          ...prev,
          studentName: "Guest",
          _id: null,
        }));
      } finally {
        setIsProfileLoading(false);
      }
    };
    fetchUserProfile();
  }, [activeSection]);

  // ----------------- Logout -----------------
  const handleLogout = (showConfirmation = true) => {
    const performLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userProfile");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      setUserProfile({ studentName: "Student", _id: null });
      window.location.reload();
    };

    if (showConfirmation) {
      Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Yes, Logout",
      }).then((result) => {
        if (result.isConfirmed) performLogout();
      });
    } else {
      performLogout();
    }
  };

  // ----------------- UI data -----------------
  const courses = [
    {
      id: 1,
      title: "HTML",
      icon: <FaHtml5 />,
      color: "#e44c26",
      gradient: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)", // Soft Pink/Red
      description: "Structure the web with HTML tags.",
    },
    {
      id: 2,
      title: "CSS",
      icon: <FaCss3Alt />,
      color: "#2965f1",
      gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", // Soft Purple/Blue
      description: "Style pages beautifully with CSS.",
    },
    {
      id: 3,
      title: "JavaScript",
      icon: <FaJs />,
      color: "#f7df1e",
      gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", // Soft Yellow/Orange
      description: "Make web pages dynamic.",
    },
    {
      id: 4,
      title: "Java",
      icon: <FaJava />,
      color: "#5382A1",
      gradient: "linear-gradient(135deg, #ffafbd 0%, #ffc3a0 100%)", // Rose/Start
      description: "Master object-oriented programming.",
    },
    {
      id: 5,
      title: "Python",
      icon: <FaPython />,
      color: "#306998",
      gradient: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)", // Soft Blue
      description: "Write powerful Python scripts.",
    },
    {
      id: 6,
      title: "SQL",
      icon: <FaDatabase />,
      color: "#8f0000",
      gradient: "linear-gradient(135deg, #fab2ff 0%, #1904e5 100%)", // Purple/Blue Mix
      // Or softer:
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", // Soft Amber/Orange
      description: "Query databases effectively.",
    },
  ];

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, action: "setSection" },
    { name: "My Courses", icon: <FaBook />, action: "setSection" },
    { name: "Profile", icon: <FaUserCircle />, action: "setSection" },
    { name: "Progress", icon: <FaChartLine />, action: "setSection" },
    { name: "certificates", icon: <FaTasks />, action: "setSection" },
    { name: "Worksheets", icon: <FaFileCode />, action: "setSection" },
    { name: "feedback", icon: <FaCommentDots />, action: "setSection" },
    { name: "Logout", icon: <FaSignOutAlt />, action: "logout" },
  ];

  const handleCourseClick = (courseTitle) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedCourse(courseTitle);
      setActiveSection("My Courses");
      setIsLoading(false);
    }, 1500);
  };

  const handleMenuItemClick = (item) => {
    if (item.action === "logout") {
      handleLogout();
      return;
    }
    setActiveSection(item.name);
    setSelectedCourse(null);
  };

  // ----------------- Render Content -----------------
  const renderMainContent = () => {
    if (activeSection === "certificates")
      return (
        <Certificates
          userId={userProfile._id}
          allCourseMaxMarks={allCourseMaxMarks}
          currentUserName={userProfile.studentName}
        />
      );
    if (activeSection === "feedback") return <Feedback />;
    if (activeSection === "Worksheets")
      return <Worksheets userId={userProfile._id} />;
    if (activeSection === "Progress") {
      if (!userProfile._id && !isProfileLoading) {
        return (
          <p className="learning-info-box">
            Please log in to view your progress.
          </p>
        );
      }
      return (
        <Progress
          userId={userProfile._id}
          allCourseMaxMarks={allCourseMaxMarks}
          currentUserName={userProfile.studentName}
        />
      );
    }

    if (activeSection === "My Courses") {
      // Delegating entire logic to StartLearning1
      if (selectedCourse) {
        return (
          <StartLearning1
            selectedCourse={selectedCourse}
            userProfile={userProfile}
            handleBackToDashboard={() => {
              setSelectedCourse(null);
              setActiveSection("My Courses");
            }}
          />
        );
      }
      // Fallback Course Grid
      return (
        <div className="learning-courses-section">
          <h1 className="upgraded-catalog-header">📚 Available Courses</h1>
          <div className="upgraded-courses-container">
            {courses.map((course) => (
              <div
                key={course.id}
                className="upgraded-course-card"
                onClick={() => handleCourseClick(course.title)}
              >
                {/* Header Section */}
                <div
                  className="course-card-header"
                  style={{ background: course.gradient }}
                >
                  <div className="header-watermark-icon">{course.icon}</div>
                </div>

                {/* Floating Icon */}
                <div
                  className="course-floating-icon"
                  style={{ color: course.color }}
                >
                  {course.icon}
                </div>

                {/* Body Content */}
                <div className="course-card-body">
                  <h3 className="upgraded-course-title">{course.title}</h3>
                  {/* <p className="course-meta-info">6 Chapters</p> */}
                  <p className="upgraded-course-description">
                    {course.description}
                  </p>

                  <button className="upgraded-cta-btn">
                    Access Now <FaArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeSection === "Profile") {
      return <Profile userProfile={userProfile} />;
    }

    // VIEW 4: Dashboard
    if (activeSection === "Dashboard") {
      const profile = userProfile || {};
      const greetingName = profile.studentName || "Student";

      return (
        <div className="learning-dashboard">
          <Profile userProfile={userProfile} />

          <div className="dashboard-courses-preview">
            <h2 className="upgraded-catalog-header">✨ Available Courses</h2>
            <div className="upgraded-courses-container">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="upgraded-course-card"
                  onClick={() => handleCourseClick(course.title)}
                >
                  {/* Header Section */}
                  <div
                    className="course-card-header"
                    style={{ background: course.gradient }}
                  >
                    <div className="header-watermark-icon">{course.icon}</div>
                  </div>

                  {/* Floating Icon */}
                  <div
                    className="course-floating-icon"
                    style={{ color: course.color }}
                  >
                    {course.icon}
                  </div>

                  {/* Body Content */}
                  <div className="course-card-body">
                    <h3 className="upgraded-course-title">{course.title}</h3>
                    {/* <p className="course-meta-info">6 Chapters • {course.learners}</p> */}
                    <p className="upgraded-course-description">
                      {course.description}
                    </p>

                    <button className="upgraded-cta-btn">
                      Access Now <FaArrowRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="learning-info-box">
            Click on any course card above to view chapters and start coding!
          </p>
        </div>
      );
    }
    return <h1 className="learning-content-header">Coming Soon...</h1>;
  };

  const isExamActive = activeSection === "My Courses" && selectedCourse; // Simplified

  return (
    <div className="learning-container">
      {isLoading && (
        <div className="premium-loading-overlay">
          <div className="spinner-wrapper">
            <div className="premium-spinner"></div>
          </div>
          <h2 className="loading-text">Accessing Content...</h2>
        </div>
      )}
      <aside
        className={`learning-sidebar ${
          isSidebarOpen && !isExamActive ? "open" : ""
        }`}
        onMouseEnter={() => !isExamActive && setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="learning-sidebar-header">
          {isSidebarOpen && !isExamActive ? (
            "CodePulse-R Portal"
          ) : (
            <FaBars className="menu-icon" />
          )}
        </div>
        <ul className="learning-menu-list">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`learning-menu-item ${
                activeSection === item.name ? "active" : ""
              }`}
              onClick={() => handleMenuItemClick(item)}
              title={!isSidebarOpen || isExamActive ? item.name : ""}
            >
              <span className="menu-icon">{item.icon}</span>
              {isSidebarOpen && !isExamActive && (
                <>
                  <span className="learning-menu-text">{item.name}</span>
                  <FaChevronRight className="menu-arrow-icon" />
                </>
              )}
            </li>
          ))}
        </ul>
      </aside>
      <main className="learning-main-content">{renderMainContent()}</main>
    </div>
  );
}

export default StartLearning;
