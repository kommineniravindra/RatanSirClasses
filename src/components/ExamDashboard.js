import React, { useState, useEffect, useMemo, useRef } from "react";
import SEO from "./SEO";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import { MdQuiz } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "boxicons/css/boxicons.min.css";
import "../css/ExamDashboard.css";
import {
  FaJava,
  FaJs,
  FaPython,
  FaHtml5,
  FaCss3Alt,
  FaDatabase,
  FaServer,
  FaReact,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

import cssTopics from "../quiz/css/cssTopics";
import htmlTopics from "../quiz/html/htmlTopics";
import javaTopics from "../quiz/java/javaTopics";
import javascriptTopics from "../quiz/javascript/javascriptTopics";
import microservicesTopics from "../quiz/microservices/microservicesTopics";
import pythonTopics from "../quiz/python/pythonTopics";
import reactTopics from "../quiz/react/reactTopics";
import restapiTopics from "../quiz/restapi/restapiTopics";
import sqlTopics from "../quiz/sql/sqlTopics";

import cssExamTopics from "../exams/css/cssTopics";
import htmlExamTopics from "../exams/html/htmlTopics";
import javaExamTopics from "../exams/java/javaTopics";
import javascriptExamTopics from "../exams/javascript/javascriptTopics";
import microservicesExamTopics from "../exams/microservices/microservicesTopics";
import pythonExamTopics from "../exams/python/pythonTopics";
import reactExamTopics from "../exams/react/reactTopics";
import restapiExamTopics from "../exams/restapi/restapiTopics";
import sqlExamTopics from "../exams/sql/sqlTopics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// --- Reusable Modal Component ---
const Modal = ({ show, title, onClose, children }) => {
  if (!show) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

// --- Constants ---
const examAccessCodes = {
  // Here and in exam component Codes should be match
  "java-exam1": "JAVA101",
  "java-exam2": "JAVA202",
  "python-exam1": "PYTHON101",
  "python-exam2": "PYTHON202",
  "javascript-exam1": "JS101",
  "javascript-exam2": "JS202",
  "react-exam1": "REACT101",
  "react-exam2": "REACT202",
  "html-exam1": "HTML101",
  // "html-exam2": "HTML202",
  "css-exam1": "CSS101",
  "css-exam2": "CSS202",
  "sql-exam1": "SQL101",
  "sql-exam2": "SQL202",
  "microservices-exam1": "MS101",
  "microservices-exam2": "MS202",
  "restapi-exam1": "REST101",
  "restapi-exam2": "REST202",
};

const loadQuizChapters = () => {
  try {
    const quizFiles = import.meta.glob("../quiz/**/MCQChapter*.json", {
      eager: true,
    });
    const chaptersByTech = {};

    Object.keys(quizFiles).forEach((key) => {
      // key format: ../quiz/java/MCQChapter1.json
      const parts = key.split("/");
      // parts: ["..", "quiz", "java", "MCQChapter1.json"]
      // We look for the 'quiz' segment to be safe, or assume standard relative path structure
      const quizIndex = parts.indexOf("quiz");

      if (quizIndex !== -1 && parts.length > quizIndex + 2) {
        const tech = parts[quizIndex + 1]; // e.g., 'java'
        const fileName = parts[quizIndex + 2]; // e.g., 'MCQChapter1.json'
        const match = fileName.match(/MCQChapter(\d+)\.json/);

        if (match) {
          const chapterNum = parseInt(match[1], 10);
          if (!chaptersByTech[tech]) {
            chaptersByTech[tech] = new Set();
          }
          chaptersByTech[tech].add(chapterNum);
        }
      }
    });

    const result = {};
    for (const tech in chaptersByTech) {
      result[tech] = Array.from(chaptersByTech[tech]).sort((a, b) => a - b);
    }
    return result;
  } catch (e) {
    console.warn("Could not load quiz chapters dynamically", e);
    return {};
  }
};

const dynamicChapters = loadQuizChapters();

const technologies = [
  {
    key: "html",
    name: "HTML",
    icon: <FaHtml5 />,
    quizChapters: dynamicChapters["html"] || [],
    topics: htmlTopics,
    examTopics: htmlExamTopics,
  },
  // {
  //   key: "css",
  //   name: "CSS",
  //   icon: <FaCss3Alt />,
  //   quizChapters: dynamicChapters["css"] || [],
  //   topics: cssTopics,
  //   examTopics: cssExamTopics,
  // },
  {
    key: "javascript",
    name: "JavaScript",
    icon: <FaJs />,
    quizChapters: dynamicChapters["javascript"] || [],
    topics: javascriptTopics,
    examTopics: javascriptExamTopics,
  },
  // {
  //   key: "react",
  //   name: "React",
  //   icon: <FaReact />,
  //   quizChapters: dynamicChapters["react"] || [],
  //   topics: reactTopics,
  //   examTopics: reactExamTopics,
  // },
  {
    key: "java",
    name: "Java",
    icon: <FaJava />,
    quizChapters: dynamicChapters["java"] || [],
    topics: javaTopics,
    examTopics: javaExamTopics,
  },
  // {
  //   key: "python",
  //   name: "Python",
  //   icon: <FaPython />,
  //   quizChapters: dynamicChapters["python"] || [],
  //   topics: pythonTopics,
  //   examTopics: pythonExamTopics,
  // },
  // {
  //   key: "restapi",
  //   name: "Spring Boot",
  //   icon: <FaServer />,
  //   quizChapters: dynamicChapters["restapi"] || [],
  //   topics: restapiTopics,
  //   examTopics: restapiExamTopics,
  // },
  // {
  //   key: "microservices",
  //   name: "Microservices",
  //   icon: <FaServer />,
  //   quizChapters: dynamicChapters["microservices"] || [],
  //   topics: microservicesTopics,
  //   examTopics: microservicesExamTopics,
  // },
  {
    key: "sql",
    name: "SQL",
    icon: <FaDatabase />,
    quizChapters: dynamicChapters["sql"] || [],
    topics: sqlTopics,
    examTopics: sqlExamTopics,
  },
];

const techChartColors = {
  java: { bg: "rgba(248, 152, 32, 0.7)", border: "rgba(248, 152, 32, 1)" },
  python: { bg: "rgba(53, 114, 165, 0.7)", border: "rgba(53, 114, 165, 1)" },
  javascript: {
    bg: "rgba(247, 223, 30, 0.7)",
    border: "rgba(247, 223, 30, 1)",
  },
  react: { bg: "rgba(97, 218, 251, 0.7)", border: "rgba(97, 218, 251, 1)" },
  html: { bg: "rgba(227, 79, 38, 0.7)", border: "rgba(227, 79, 38, 1)" },
  css: { bg: "rgba(21, 114, 182, 0.7)", border: "rgba(21, 114, 182, 1)" },
  sql: { bg: "rgba(255, 153, 0, 0.7)", border: "rgba(255, 153, 0, 1)" },
  microservices: {
    bg: "rgba(56, 178, 172, 0.7)",
    border: "rgba(56, 178, 172, 1)",
  },
  restapi: { bg: "rgba(139, 92, 246, 0.7)", border: "rgba(139, 92, 246, 1)" },
  default: { bg: "rgba(54, 162, 235, 0.7)", border: "rgba(54, 162, 235, 1)" },
};

const getTechnologyFromCode = (code) => {
  if (!code) return "default";
  const lowerCode = code.toLowerCase();
  for (const tech of technologies) {
    if (lowerCode.startsWith(tech.key)) return tech.key;
  }
  return "default";
};

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const ExamDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [examHistory, setExamHistory] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState(null);

  const [avatarUrl, setAvatarUrl] = useState(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    return savedAvatar || null;
  });

  const fileInputRef = useRef(null);
  const enteredCodeRef = useRef("");

  useEffect(() => {
    const fetchProfileAndHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        onLogout();
        return;
      }
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const profileResponse = await axios.get(
          "/api/auth/profile",
          authHeaders
        );
        setProfile(profileResponse.data);
        const userId = profileResponse.data._id;
        if (userId) {
          const [examRes, quizRes] = await Promise.all([
            axios.get(`/api/exams/user/${userId}`, authHeaders),
            axios.get(`/api/quizzes/user/${userId}`, authHeaders),
          ]);
          setExamHistory(examRes.data);
          setQuizHistory(quizRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Your session may have expired. Please log in again.");
        setTimeout(() => onLogout(), 2000);
      }
    };
    fetchProfileAndHistory();
  }, [onLogout]);

  const handleLogout = () => onLogout();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result;
        setAvatarUrl(newAvatarUrl);
        localStorage.setItem("userAvatar", newAvatarUrl);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setModalTitle("Invalid File Type");
      setModalBody(
        <div className="feedback-message error">
          <p>Please upload a valid image file (e.g., PNG, JPG, GIF).</p>
        </div>
      );
      setModalOpen(true);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleExamTechSelect = (tech) => {
    const techExamKeys = Object.keys(examAccessCodes).filter(
      (key) => key.split("-")[0] === tech.key
    );

    const examButtons = techExamKeys.map((key, index) => {
      const examNumber = index + 1;
      const correctCode = examAccessCodes[key];

      // Retrieve Topic Name
      const topicName =
        tech.examTopics && tech.examTopics[index]
          ? tech.examTopics[index]
          : `Exam ${examNumber}`;

      // Check History
      const examAttempt = examHistory.find(
        (r) => r.examCode === key || r.examCode === correctCode
      );
      const isCompleted = !!examAttempt;

      let scoreDisplay = null;
      if (isCompleted) {
        const obtained = examAttempt.grandTotal || 0;
        const total = examAttempt.totalMarksPossible || 0;
        scoreDisplay = (
          <span className="quiz-score">
            {obtained}/{total}
          </span>
        );
      }

      return (
        <div key={key} className="quiz-card-item">
          <div className="quiz-info">
            <span className="quiz-list-icon">{tech.icon}</span>
            <span className="quiz-number">Exam {examNumber}</span>
            <span className="quiz-topic">{topicName}</span>
          </div>
          <div className="quiz-actions-right">
            {scoreDisplay}
            <button
              className={`quiz-action-btn ${isCompleted ? "retake" : "start"}`}
              onClick={() => {
                setModalOpen(false);
                setModalTitle(
                  `Enter Access Code - ${correctCode.toLowerCase()}`
                );
                setModalBody(
                  <div className="enter-code-body">
                    <p>
                      For{" "}
                      <strong>
                        {tech.name} Exam {examNumber}
                      </strong>
                    </p>
                    <input
                      type="text"
                      placeholder="Enter the exam code"
                      onChange={(e) =>
                        (enteredCodeRef.current = e.target.value)
                      }
                    />
                    <div className="button-group">
                      <button
                        className="confirm-btn"
                        onClick={() => {
                          if (
                            enteredCodeRef.current.trim().toUpperCase() ===
                            correctCode
                          ) {
                            setModalOpen(false);
                            window.open(
                              `/exam/${tech.key}/exam${examNumber}`,
                              "_blank"
                            );
                          } else {
                            setModalTitle("Incorrect Code");
                            setModalBody(
                              <div className="feedback-message error">
                                <p>The access code is invalid.</p>
                              </div>
                            );
                            setModalOpen(true);
                          }
                        }}
                      >
                        Verify & Start
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
                setModalOpen(true);
              }}
            >
              {isCompleted ? "Retake Exam" : "Start Exam"}
            </button>
          </div>
        </div>
      );
    });

    setModalTitle(`Select an Exam for ${tech.name}`);
    setModalBody(
      <div className="select-quiz-body">
        <div className="quiz-list-container">{examButtons}</div>
      </div>
    );
    setModalOpen(true);
  };

  const handleQuizTechSelect = (tech) => {
    const quizButtons = (tech.quizChapters || []).map((num) => {
      const topicName =
        tech.topics && tech.topics[num - 1]
          ? tech.topics[num - 1]
          : `Topic ${num}`;

      // Check if this quiz is completed in history
      const quizAttempt = quizHistory.find(
        (q) =>
          q.quizCode === `${tech.key}-quiz${num}` ||
          q.quizCode === `${tech.key}-${num}`
      );

      const isCompleted = !!quizAttempt;
      let scoreDisplay = null;

      if (isCompleted) {
        const obtained =
          (quizAttempt.mcqMarks || 0) +
          (quizAttempt.fillMarks || 0) +
          (quizAttempt.codingMarks || 0);
        const total = quizAttempt.totalMarksPossible || 0;
        scoreDisplay = (
          <span className="quiz-score">
            {obtained}/{total}
          </span>
        );
      }

      return (
        <div key={num} className="quiz-card-item">
          <div className="quiz-info">
            <span className="quiz-list-icon">{tech.icon}</span>
            <span className="quiz-number">Quiz {num}</span>
            <span className="quiz-topic">{topicName}</span>
          </div>
          <div className="quiz-actions-right">
            {scoreDisplay}
            <button
              className={`quiz-action-btn ${isCompleted ? "retake" : "start"}`}
              onClick={() => {
                setModalOpen(false);
                navigate(`/quiz/${tech.key}/${num}`);
              }}
            >
              {isCompleted ? "Retake Quiz" : "Start Quiz"}
            </button>
          </div>
        </div>
      );
    });
    setModalTitle(`Select a Quiz for ${tech.name}`);
    setModalBody(
      <div className="select-quiz-body">
        <div className="quiz-list-container">{quizButtons}</div>
      </div>
    );
    setModalOpen(true);
  };

  // ---------------- Chart Data Memoization ----------------
  const performanceChartData = useMemo(() => {
    const sorted = [...examHistory].sort((a, b) =>
      a.examCode.localeCompare(b.examCode)
    );
    return {
      labels: sorted.map((result) => result.examCode),
      datasets: [
        {
          label: "Score (%)",
          data: sorted.map((result) =>
            ((result.grandTotal / result.totalMarksPossible) * 100).toFixed(1)
          ),
          backgroundColor: sorted.map(
            (result) =>
              techChartColors[getTechnologyFromCode(result.examCode)]?.bg
          ),
          borderColor: sorted.map(
            (result) =>
              techChartColors[getTechnologyFromCode(result.examCode)]?.border
          ),
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    };
  }, [examHistory]);

  const examTechAverageChartData = useMemo(() => {
    const techData = {};
    examHistory.forEach((result) => {
      const tech = getTechnologyFromCode(result.examCode);
      const score = (result.grandTotal / result.totalMarksPossible) * 100;
      if (!techData[tech]) techData[tech] = { totalScore: 0, count: 0 };
      techData[tech].totalScore += score;
      techData[tech].count++;
    });
    return {
      labels: Object.keys(techData).map(capitalize),
      datasets: [
        {
          label: "Average Score",
          data: Object.values(techData).map((d) =>
            (d.totalScore / d.count).toFixed(1)
          ),
          backgroundColor: Object.keys(techData).map(
            (tech) => techChartColors[tech]?.bg
          ),
        },
      ],
    };
  }, [examHistory]);

  const quizPerformanceChartData = useMemo(() => {
    const sorted = [...quizHistory].sort((a, b) =>
      a.quizCode.localeCompare(b.quizCode)
    );
    return {
      labels: sorted.map((r) =>
        r.quizCode.split("-").map(capitalize).join(" ")
      ),
      datasets: [
        {
          label: "Score (%)",
          data: sorted.map((r) =>
            ((r.grandTotal / r.totalMarksPossible) * 100).toFixed(1)
          ),
          backgroundColor: sorted.map(
            (r) => techChartColors[getTechnologyFromCode(r.quizCode)]?.bg
          ),
        },
      ],
    };
  }, [quizHistory]);

  const quizTechAverageChartData = useMemo(() => {
    const techData = {};
    quizHistory.forEach((result) => {
      const tech = getTechnologyFromCode(result.quizCode);
      const score = (result.grandTotal / result.totalMarksPossible) * 100;
      if (!techData[tech]) techData[tech] = { totalScore: 0, count: 0 };
      techData[tech].totalScore += score;
      techData[tech].count++;
    });
    return {
      labels: Object.keys(techData).map(capitalize),
      datasets: [
        {
          label: "Average Score",
          data: Object.values(techData).map((d) =>
            (d.totalScore / d.count).toFixed(1)
          ),
          backgroundColor: Object.keys(techData).map(
            (tech) => techChartColors[tech]?.bg
          ),
        },
      ],
    };
  }, [quizHistory]);

  const chartOptions = (title, titleColor = "navy", titleFontSize = 25) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: title,
        color: titleColor,
        font: { size: titleFontSize, weight: "bold" },
      },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  });

  const doughnutChartOptions = (
    title,
    titleColor = "navy",
    titleFontSize = 20
  ) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: title,
        color: titleColor,
        font: { size: titleFontSize, weight: "bold" },
      },
    },
  });
  const maskMobile = (mobile) => {
    if (!mobile) return "";
    return mobile.replace(/(\d{2})\d{5}(\d{3})/, "$1XXXXX$2");
  };

  if (error) return <div className="feedback-message error">{error}</div>;
  if (!profile)
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );

  return (
    <div className="dashboard-container">
      <SEO
        title="Student Dashboard"
        description="View your exam and quiz performance, access new tests, and track your progress."
        keywords="student dashboard, exam results, quiz progress, learning analytics"
      />
      {/* ---------- Sidebar ---------- */}
      <aside className="dashboard-sidebar">
        <div className="profile-header">
          <div className="profile-avatar-container" onClick={handleAvatarClick}>
            <img
              src={
                avatarUrl ||
                `https://api.dicebear.com/8.x/initials/svg?seed=${profile.studentName}`
              }
              alt="Avatar"
              className="profile-avatar"
            />
          </div>
          <input
            type="file"
            id="avatar-upload"
            className="hidden-input"
            onChange={handleImageUpload}
            ref={fileInputRef}
            accept="image/*"
          />
          <h2>{profile.studentName}</h2>
          <p>{profile.email}</p>
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            <i className="bx bx-log-out"></i> Logout
          </button>
          <hr></hr>
        </div>
        <div className="profile-details">
          <h3>Your Information</h3>
          <ProfileDetailItem
            icon="bx bxs-phone"
            label="Mobile"
            value={maskMobile(profile.mobile)}
          />
          <ProfileDetailItem
            icon="bx bxs-graduation"
            label="Qualification"
            value={profile.qualification}
          />
          <ProfileDetailItem
            icon="bx bxs-calendar-check"
            label="Passing Year"
            value={profile.passingYear}
          />
          <ProfileDetailItem
            icon="bx bxs-star"
            label="CGPA"
            value={profile.cgpa}
          />
        </div>
      </aside>

      {/* ---------- Main Content ---------- */}
      <main className="dashboard-main">
        {/* --- Quiz Grid --- */}
        <div className="tech-grid-section">
          {/* <h2>📝Take Quizes</h2> */}
          <h2 className="ed-quiz-title">
            <MdQuiz className="ed-quiz-icon" />
            Take Quizzes
          </h2>
          <div className="tech-grid">
            {technologies
              .filter(
                (tech) => tech.quizChapters && tech.quizChapters.length > 0
              )
              .map((tech) => (
                <div
                  key={tech.key}
                  className={`tech-card ${tech.key}`}
                  onClick={() => handleQuizTechSelect(tech)}
                >
                  <div className="tech-icon">{tech.icon}</div>
                  <span className="tech-name">{tech.name}</span>
                </div>
              ))}
          </div>
        </div>

        {/* --- Quiz Charts --- */}
        <div className="progress-reports-section">
          <div className="chart-container">
            <Bar
              options={chartOptions("Quiz Overall Performance", "navy", 25)}
              data={quizPerformanceChartData}
            />
          </div>
          <div className="chart-container">
            <Doughnut
              options={doughnutChartOptions(
                "Quiz Average Score by Technology",
                "navy",
                20
              )}
              data={quizTechAverageChartData}
            />
          </div>
        </div>

        {/* --- Quiz History --- */}
        {quizHistory.length > 0 && (
          <div className="exam-history-section">
            <div className="history-header">
              <h2>Quiz History</h2>
            </div>
            <div className="history-grouped-container">
              {[...quizHistory]
                .sort((a, b) => a.quizCode.localeCompare(b.quizCode))
                .map((result) => {
                  const nameParts = result.quizCode.split("-");
                  const formattedName = `${capitalize(
                    nameParts[0]
                  )} ${capitalize(nameParts[1])}`;
                  return (
                    <div key={result._id} className="history-card">
                      <div className="history-card-header">
                        <FaCheckCircle className="completed-icon" />
                        <h3>{formattedName}</h3>
                      </div>
                      <div className="history-card-body">
                        <p>
                          <strong>Score:</strong> {result.grandTotal} /{" "}
                          {result.totalMarksPossible}
                        </p>
                        <p>
                          <FaCalendarAlt /> <strong>Completed:</strong>{" "}
                          {new Date(result.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* --- Separator --- */}
        {/* --- Animated Separator --- */}
        {/* --- Text Marquee Separator --- */}
        <div className="text-marquee-container">
          <div className="marquee-track">
            <div className="marquee-content">
              GET CERTIFIED <span className="dot">•</span> MASTER YOUR SKILLS{" "}
              <span className="dot">•</span> ACHIEVE EXCELLENCE{" "}
              <span className="dot">•</span>
            </div>
            <div className="marquee-content">
              GET CERTIFIED <span className="dot">•</span> MASTER YOUR SKILLS{" "}
              <span className="dot">•</span> ACHIEVE EXCELLENCE{" "}
              <span className="dot">•</span>
            </div>
            <div className="marquee-content">
              GET CERTIFIED <span className="dot">•</span> MASTER YOUR SKILLS{" "}
              <span className="dot">•</span> ACHIEVE EXCELLENCE{" "}
              <span className="dot">•</span>
            </div>
            <div className="marquee-content">
              GET CERTIFIED <span className="dot">•</span> MASTER YOUR SKILLS{" "}
              <span className="dot">•</span> ACHIEVE EXCELLENCE{" "}
              <span className="dot">•</span>
            </div>
          </div>
        </div>

        {/* --- Exam Grid --- */}
        <div className="tech-grid-section">
          {/* <h2>📜Take Exam</h2> */}
          <h2 className="ed-quiz-title">
            <FaRegEdit className="ed-quiz-icon" />
            Take Exams
          </h2>
          <div className="tech-grid">
            {technologies
              .filter((tech) =>
                Object.keys(examAccessCodes).some((key) =>
                  key.startsWith(tech.key)
                )
              )
              .map((tech) => (
                <div
                  key={tech.key}
                  className={`tech-card ${tech.key}`}
                  onClick={() => handleExamTechSelect(tech)}
                >
                  <div className="tech-icon">{tech.icon}</div>
                  <span className="tech-name">{tech.name}</span>
                </div>
              ))}
          </div>
        </div>

        {/* --- Exam Charts --- */}
        <div className="progress-reports-section">
          <div className="chart-container">
            <Bar
              options={chartOptions("Exam Overall Performance", "navy", 25)}
              data={performanceChartData}
            />
          </div>
          <div className="chart-container">
            <Doughnut
              options={doughnutChartOptions(
                "Exam Average Score by Technology",
                "navy",
                20
              )}
              data={examTechAverageChartData}
            />
          </div>
        </div>

        {/* --- Exam History --- */}
        {examHistory.length > 0 && (
          <div className="exam-history-section">
            <div className="history-header">
              <h2>Exam History</h2>
            </div>
            <div className="history-grouped-container">
              {[...examHistory]
                .sort((a, b) => a.examCode.localeCompare(b.examCode))
                .map((result) => (
                  <div key={result._id} className="history-card">
                    <div className="history-card-header">
                      <FaCheckCircle className="completed-icon" />
                      <h3>{result.examCode}</h3>
                    </div>
                    <div className="history-card-body">
                      <p>
                        <strong>Score:</strong> {result.grandTotal} /{" "}
                        {result.totalMarksPossible}
                      </p>
                      <p>
                        <FaCalendarAlt /> <strong>Completed:</strong>{" "}
                        {new Date(result.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* --- Global Modal for SweetAlert2 Replacement --- */}
      <Modal
        show={modalOpen}
        title={modalTitle}
        onClose={() => setModalOpen(false)}
      >
        {modalBody}
      </Modal>
    </div>
  );
};

const ProfileDetailItem = ({ icon, label, value }) => (
  <div className="profile-items">
    <i className={icon}></i>
    <div className="profile-item-detail">
      <span className="label">{label}</span>
      <span className="value">{value || "N/A"}</span>
    </div>
  </div>
);

export default ExamDashboard;
