import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import { FaFileAlt } from "react-icons/fa";
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
  "html-exam2": "HTML202",
  "css-exam1": "CSS101",
  "css-exam2": "CSS202",
  "sql-exam1": "SQL101",
  "sql-exam2": "SQL202",
  "microservices-exam1": "MS101",
  "microservices-exam2": "MS202",
  "restapi-exam1": "REST101",
  "restapi-exam2": "REST202",

};

const technologies = [
  { key: "html", name: "HTML", icon: <FaHtml5 />, quizChapters: [1, 2, 3, 4, 5, 6] },
  // { key: "css", name: "CSS", icon: <FaCss3Alt />, quizChapters: [1, 2, 3, 4, 5, 6]  },
  // {
  //   key: "javascript",
  //   name: "JavaScript",
  //   icon: <FaJs />,
  //   quizChapters: [1, 2, 3, 4, 5, 6, 7, 8] ,
  // },
  { key: "react", name: "React", icon: <FaReact />, quizChapters: [1, 2, 3, 4, 5, 6]  },
  // { key: "java", name: "Java", icon: <FaJava />, quizChapters:[1, 2, 3, 4, 5, 6]  },
  // {
  //   key: "python",
  //   name: "Python",
  //   icon: <FaPython />,
  //   quizChapters: [1, 2, 3, 4, 5, 6] ,
  // },
  //  {
  //   key: "restapi",
  //   name: "Spring Boot",
  //   icon: <FaServer />,
  //   quizChapters: [1, 2, 3, 4, 5, 6] ,
  // },
  // {
  //   key: "microservices",
  //   name: "Microservices",
  //   icon: <FaServer />,
  //   quizChapters: [1, 2, 3, 4, 5, 6] ,
  // },
  // { key: "sql", name: "SQL", icon: <FaDatabase />, quizChapters: [1, 2, 3, 4, 5, 6,]  },
 
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

const TOTAL_POSSIBLE_MARKS = 35;
const TOTAL_QUIZ_POSSIBLE_MARKS = 25;
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
            axios.get(
              `/api/exams/user/${userId}`,
              authHeaders
            ),
            axios.get(
              `/api/quizzes/user/${userId}`,
              authHeaders
            ),
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

  const startExamModal = (tech, examNumber) => {
    setModalTitle(`Start ${tech.name} - Exam ${examNumber}?`);
    setModalBody(
      <div className="start-exam-body">
        <h4>Instructions:</h4>
        <ul>
          <li>Timer starts immediately.</li>
          <li>
            Duration: <strong>15 minutes</strong>.
          </li>
          <li>Switching tabs will auto-submit the test.</li>
        </ul>
        <div className="button-group">
          <button
            className="confirm-btn"
            onClick={() => {
              navigate(`/exam/${tech.key}/exam${examNumber}`);
              setModalOpen(false);
            }}
          >
            Yes, start exam!
          </button>
          <button className="cancel-btn" onClick={() => setModalOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
    setModalOpen(true);
  };
  const handleExamTechSelect = (tech) => {
    const techExamKeys = Object.keys(examAccessCodes).filter(
      (key) => key.split("-")[0] === tech.key
    );

    setModalTitle(`Select an Exam for ${tech.name}`);
    setModalBody(
      <div className="select-exam-body">
        <p>Choose an exam to start.</p>
        <div className="activity-buttons-container">
          {techExamKeys.map((key, index) => {
            const examNumber = index + 1;
            const correctCode = examAccessCodes[key];
            return (
              <button
                key={key}
                className="exam-selection-btn"
                onClick={() => {
                  setModalOpen(false);
                  setModalTitle(`Enter Access Code`);
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
                              startExamModal(tech, examNumber);
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
                <FaFileAlt className="exam-icon" /> Exam {examNumber}
              </button>
            );
          })}
        </div>
      </div>
    );
    setModalOpen(true);
  };

  const handleQuizTechSelect = (tech) => {
    const quizButtons = (tech.quizChapters || []).map((num) => (
      <button
        key={num}
        className="quiz-selection-btn"
        onClick={() => {
          setModalOpen(false);
          navigate(`/quiz/${tech.key}/${num}`);
        }}
      >
        <i className="bx bxs-file-archive"></i> Quiz {num}
      </button>
    ));
    setModalTitle(`Select a Quiz for ${tech.name}`);
    setModalBody(
      <div className="select-quiz-body">
        <p>Choose a quiz to start.</p>
        <div className="activity-buttons-container">{quizButtons}</div>
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
            ((result.grandTotal / TOTAL_POSSIBLE_MARKS) * 100).toFixed(1)
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
      const score = (result.grandTotal / TOTAL_POSSIBLE_MARKS) * 100;
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
            ((r.grandTotal / TOTAL_QUIZ_POSSIBLE_MARKS) * 100).toFixed(1)
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
      const score = (result.grandTotal / TOTAL_QUIZ_POSSIBLE_MARKS) * 100;
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
            style={{ display: "none" }}
            onChange={handleImageUpload}
            ref={fileInputRef}
            accept="image/*"
          />
          <h2>{profile.studentName}</h2>
          <p >{profile.email}</p>
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
            value={profile.mobile}
          />
          {/* <ProfileDetailItem
            icon="bx bxs-calendar"
            label="Date of Birth"
            value={new Date(profile.dob).toLocaleDateString()}
          /> */}
          {/* <ProfileDetailItem
            icon="bx bxs-user-detail"
            label="Gender"
            value={profile.gender}
          /> */}
          <ProfileDetailItem
            icon="bx bxs-institution"
            label="College"
            value={profile.college}
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
          <h2>Select a Technology for Quizzes</h2>
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
                          {TOTAL_QUIZ_POSSIBLE_MARKS}
                        </p>
                        <p>
                          <FaCalendarAlt /> <strong>Completed:</strong>{" "}
                          {new Date(result.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Next-Level Cybernetic Flow Divider */}

        <span className="cyber-message">
          Your curiosity is the spark. Our courses are the fuel.
        </span>

        {/* --- Exam Grid --- */}
        <div className="tech-grid-section">
          <h2>Select a Technology for Exams</h2>
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
                        {TOTAL_POSSIBLE_MARKS}
                      </p>
                      <p>
                        <FaCalendarAlt /> <strong>Completed:</strong>{" "}
                        {new Date(result.createdAt).toLocaleDateString()}
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
