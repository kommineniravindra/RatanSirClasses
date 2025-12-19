import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCheck,
  FaSyncAlt,
  FaGraduationCap,
  FaPenFancy,
  FaBook,
  FaGlobe,
  FaSpinner,
  FaRocket,
} from "react-icons/fa";
import { IoTimerOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from "axios";
import "../css/Quiz.css";

// --- Config and Helper Functions ---
const TOTAL_TIME = 1200;
const MAX_CHAPTERS = 1;
const AVAILABLE_CHAPTERS = Array.from(
  { length: MAX_CHAPTERS },
  (_, i) => i + 1
);
const STORAGE_KEY = "quiz_progress";

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- Flexible Spinner Component ---
const iconMap = {
  submit: [<FaGraduationCap />, <FaPenFancy />, <FaBook />, <FaGlobe />],
  loading: [<FaSyncAlt />, <FaSpinner className="spin-fast" />, <FaRocket />],
};

const QuizSpinner = ({ type, message }) => {
  const icons = iconMap[type] || iconMap.submit;
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        {icons.map((Icon, index) => (
          <div key={index} className="spinner-icon">
            {Icon}
          </div>
        ))}
      </div>
      <p className="spinner-text">{message}</p>
    </div>
  );
};

const Quiz = () => {
  const { technology, quizId } = useParams();
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentChapter, setCurrentChapter] = useState(0);
  const [mcqs, setMcqs] = useState([]);
  const [blanks, setBlanks] = useState([]);
  const [answersMCQ, setAnswersMCQ] = useState([]);
  const [answersBlanks, setAnswersBlanks] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(TOTAL_TIME);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (forceSubmit = false) => {
      if (!forceSubmit) {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You can't change answers after submitting!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, submit!",
        });

        if (!result.isConfirmed) {
          return;
        }
      }

      setIsSubmitting(true);
      setTimerRunning(false);

      // ---- Calculate Marks ----
      let mcqMarks = 0;
      mcqs.forEach((q, i) => {
        if (answersMCQ[i] === q.answer) mcqMarks++;
      });

      let fillMarks = 0;
      blanks.forEach((q, i) => {
        if (
          (answersBlanks[i] || "").trim().toLowerCase() ===
          q.answer.trim().toLowerCase()
        )
          fillMarks++;
      });

      const finalScore = mcqMarks + fillMarks;
      const totalMarksPossible = mcqs.length + blanks.length;

      try {
        const token = localStorage.getItem("token");

        const quizCode = `${technology}-quiz${quizId}`;
        const payload = {
          quizCode,
          mcqMarks,
          fillMarks,
          codingMarks: 0,
          totalMarksPossible,
        };

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        // Save/update results in the database (Backend will send the email)
        try {
          await axios.post("/api/quizzes/submit", payload, authHeaders);
        } catch (error) {
          if (
            error.response &&
            error.response.status === 400 &&
            error.response.data.message.includes("already exists")
          ) {
            await axios.patch("/api/quizzes/submit", payload, authHeaders);
          } else {
            throw error;
          }
        }

        Swal.fire({
          icon: "success",
          title: "Submitted!",
          text: "Your quiz has been submitted successfully. Check your email for results.",
        });
      } catch (error) {
        console.error("Submission failed:", error);
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            error.response?.data?.message ||
            "An unexpected error occurred. Please try again.",
        });
      } finally {
        localStorage.removeItem(STORAGE_KEY);

        setIsSubmitting(false);
        setScore(finalScore);
        setShowResults(true);
      }
    },
    [
      answersMCQ,
      answersBlanks,
      technology,
      quizId,
      mcqs,
      blanks,
      selectedLanguage,
      currentChapter,
    ]
  );

  // ... (remaining Quiz.js code)
  const startQuiz = useCallback(async (language, chapterNumber) => {
    if (!language || !chapterNumber) return;

    setSelectedLanguage(language);
    setCurrentChapter(chapterNumber);
    setIsLoading(true);
    setIsModalOpen(false);
    setScore(0);
    setShowResults(false);
    setTimer(TOTAL_TIME);
    setTimerRunning(false);

    const lang = language.toLowerCase().replace(/\s+/g, "");
    let mcqData = [];
    let blanksData = [];

    try {
      const mcqModule = await import(
        `../quiz/${lang}/MCQChapter${chapterNumber}.json`
      );
      mcqData = shuffleArray(
        mcqModule.default.map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }))
      );
    } catch (error) {
      console.warn(
        `No MCQ questions found for ${lang} Chapter ${chapterNumber}.`
      );
    }

    try {
      const blanksModule = await import(
        `../quiz/${lang}/BlanksChapter${chapterNumber}.json`
      );
      blanksData = shuffleArray(blanksModule.default);
    } catch (error) {
      console.warn(
        `No Fill-in-the-Blanks questions found for ${lang} Chapter ${chapterNumber}.`
      );
    }

    setMcqs(mcqData);
    setBlanks(blanksData);
    setAnswersMCQ(Array(mcqData.length).fill(null));
    setAnswersBlanks(Array(blanksData.length).fill(null));
    setIsLoading(false);
    setTimerRunning(true);
  }, []);

  useEffect(() => {
    if (technology && quizId) {
      const storedProgress = localStorage.getItem(STORAGE_KEY);
      const requestedChapter = Number(quizId);

      if (storedProgress) {
        try {
          const progress = JSON.parse(storedProgress);
          // Check if the stored data belongs to the currently requested quiz
          if (
            progress.selectedLanguage.toLowerCase() ===
              technology.toLowerCase() &&
            progress.currentChapter === requestedChapter
          ) {
            // Restore persisted state
            setSelectedLanguage(progress.selectedLanguage);
            setCurrentChapter(progress.currentChapter);
            setMcqs(progress.mcqs);
            setBlanks(progress.blanks);
            setAnswersMCQ(progress.answersMCQ);
            setAnswersBlanks(progress.answersBlanks);
            setTimer(progress.timer);
            setTimerRunning(progress.timer > 0); // Only run timer if time remains
            setIsLoading(false);
            console.log("Restored quiz progress from local storage.");
            return; // Stop here, use restored state
          }
        } catch (e) {
          console.error("Error parsing stored progress:", e);
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      // If no matching data is found, start a new quiz
      startQuiz(technology, requestedChapter);
    }
  }, [technology, quizId, startQuiz]);

  useEffect(() => {
    if (timerRunning && mcqs.length > 0) {
      const progress = {
        selectedLanguage,
        currentChapter,
        mcqs,
        blanks,
        answersMCQ,
        answersBlanks,
        timer,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [
    timer,
    answersMCQ,
    answersBlanks,
    mcqs,
    blanks,
    selectedLanguage,
    currentChapter,
    timerRunning,
  ]);

  useEffect(() => {
    if (timerRunning && timer > 0) {
      // 2-Minute Warning
      if (timer === 120) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "warning",
          title: "Hurry Up! Last 2 minutes.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }

      const timerId = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timerId);
    } else if (timer === 0 && timerRunning) {
      handleSubmit(true); // Force submit
    }
  }, [timer, timerRunning, handleSubmit]);

  const handleAnswerChangeMCQ = (index, value) => {
    const newAnswers = [...answersMCQ];
    newAnswers[index] = value;
    setAnswersMCQ(newAnswers);
  };
  const handleAnswerChangeBlanks = (index, value) => {
    const newAnswers = [...answersBlanks];
    newAnswers[index] = value;
    setAnswersBlanks(newAnswers);
  };

  const handleRetryQuiz = () => {
    // Clear storage before retrying
    localStorage.removeItem(STORAGE_KEY);
    if (selectedLanguage && currentChapter) {
      startQuiz(selectedLanguage, currentChapter);
    }
  };

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setIsModalOpen(true);
  };
  const handleReturnToDashboard = () => navigate("/dashboard");
  const handleReturnToHome = () => navigate("/");

  const quizStats = useMemo(() => {
    if (!showResults) return null;
    const totalPossibleMarks = mcqs.length + blanks.length;

    const correctAnswers = score;
    const incorrectAnswers = totalPossibleMarks - correctAnswers;
    const percentage =
      totalPossibleMarks > 0
        ? Math.round((correctAnswers / totalPossibleMarks) * 100)
        : 0;
    return { totalPossibleMarks, correctAnswers, incorrectAnswers, percentage };
  }, [showResults, score, mcqs, blanks]);

  // --- Render Functions ---
  const renderChapterSelectionModal = () => {
    if (!isModalOpen) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button
            className="modal-close-btn"
            onClick={() => setIsModalOpen(false)}
          >
            &times;
          </button>
          <h2 className="modal-title">{selectedLanguage} Chapters</h2>
          <div className="quiz-options-grid">
            {AVAILABLE_CHAPTERS.map((num) => (
              <button
                key={num}
                className="btn btn-quiz-option"
                onClick={() =>
                  navigate(
                    `/ratan-tutotrials/quiz/${selectedLanguage.toLowerCase()}/${num}`
                  )
                }
              >
                Quiz {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderQuizHeader = () => (
    <div className="quiz-header-fixed">
      <div className="top-header-row">
        <button onClick={handleReturnToHome} className="btn btn-home-header">
          <FaHome /> Home
        </button>

        <h1 className="quiz-title-center">
          {selectedLanguage
            ? `${selectedLanguage} - Quiz ${currentChapter}`
            : "Quiz App"}
        </h1>

        <div className="controls-right">
          <div
            className={`timer-container ${timer <= 120 ? "timer-alert" : ""}`}
          >
            <span className="timer-value">
              <IoTimerOutline />
              {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </span>
          </div>

          {!showResults && (
            <button onClick={handleSubmit} className="btn btn-submit-header">
              <FaCheck /> Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderQuizPage = () => (
    <div className="app-wrapper quiz-content-wrapper">
      {renderQuizHeader()}
      <div className="quiz-container">
        <div className="quiz-content">
          <section className="question-type-section">
            {/* <h2 className="section-title">Multiple Choice Questions</h2> */}
            {mcqs.map((q, index) => (
              <div key={`mcq-${index}`} className="question-panel">
                <p className="question-text">
                  <b>{index + 1}</b>. {q.question}
                </p>
                <ul className="options-list">
                  {q.options.map((opt, i) => (
                    <li
                      key={i}
                      className={`option-item ${
                        answersMCQ[index] === opt ? "selected" : ""
                      }`}
                      onClick={() => handleAnswerChangeMCQ(index, opt)}
                    >
                      <span className="option-prefix">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="option-text">{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="question-type-section">
            {/* <h2 className="section-title">Fill in the Blanks</h2> */}
            {blanks.map((q, index) => {
              const parts = q.question.split("___");
              return (
                <div key={`blank-${index}`} className="question-panel1">
                  <p className="question-text">
                    <b>{mcqs.length + index + 1}</b>. {parts[0]}
                    <input
                      type="text"
                      className="inline-blank-input"
                      value={answersBlanks[index] || ""}
                      onChange={(e) =>
                        handleAnswerChangeBlanks(index, e.target.value)
                      }
                      aria-label={`Answer for question ${
                        mcqs.length + index + 1
                      }`}
                    />
                    {parts[1]}
                  </p>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );

  const renderResultsPage = () => {
    if (!quizStats) return null;
    const { totalPossibleMarks, correctAnswers, incorrectAnswers, percentage } =
      quizStats;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="app-wrapper">
        <div className="results-page">
          {renderQuizHeader()}

          <div className="results-summary-layout">
            <div className="score-summary-card">
              {/* <h1 className="results-main-title">Quiz Results</h1> */}
              <h2 className="summary-card-title">Your Performance</h2>
              <div className="circular-progress-container">
                <svg
                  className="circular-progress-bar"
                  width="160"
                  height="160"
                  viewBox="0 0 160 160"
                >
                  <circle
                    className="progress-track"
                    cx="80"
                    cy="80"
                    r={radius}
                  />
                  <circle
                    className="progress-fill"
                    cx="80"
                    cy="80"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                  />
                </svg>
                <span className="score-percentage-text">{percentage}%</span>
              </div>
              <p className="final-score-text">
                You scored <strong>{correctAnswers}</strong> out of{" "}
                <strong>{totalPossibleMarks}</strong>
              </p>

              <div className="results-stats">
                <div className="stat-item total">
                  <span className="stat-label">Total Marks</span>
                  <span className="stat-value">{totalPossibleMarks}</span>
                </div>
                <div className="stat-item correct">
                  <span className="stat-label">Scored</span>
                  <span className="stat-value">{correctAnswers}</span>
                </div>
                <div className="stat-item incorrect">
                  <span className="stat-label">Incorrect</span>
                  <span className="stat-value">{incorrectAnswers}</span>
                </div>
              </div>

              {/* Action Buttons inside performance card */}
              <div className="action-buttons">
                <button
                  onClick={handleRetryQuiz}
                  className="action-btn action-btn-success"
                >
                  <FaSyncAlt /> Try Again
                </button>
                <button
                  onClick={handleReturnToDashboard}
                  className="action-btn action-btn-primary"
                >
                  <FaHome /> Go to Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Always show Answer Review */}
          <div className="answer-review-section">
            <h2 className="review-title">Answer Review</h2>

            {/* MCQs */}
            {mcqs.map((q, index) => {
              const isCorrect = answersMCQ[index] === q.answer;
              return (
                <div
                  key={`mcq-${index}`}
                  className={`review-item ${
                    isCorrect ? "correct" : "incorrect"
                  }`}
                >
                  <p className="review-question-text">
                    {index + 1}. {q.question}
                  </p>
                  <p
                    className={`your-answer ${
                      !isCorrect && "incorrect-answer-text"
                    }`}
                  >
                    Your Answer: {answersMCQ[index] || "Not Answered"}
                  </p>
                  {!isCorrect && (
                    <p className="correct-answer-text">
                      <FaCheck className="answer-icon" /> Correct Answer:{" "}
                      {q.answer}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Fill in the Blanks */}
            {blanks.map((q, index) => {
              const isCorrect =
                (answersBlanks[index] || "").trim().toLowerCase() ===
                q.answer.trim().toLowerCase();
              return (
                <div
                  key={`blank-${index}`}
                  className={`review-item ${
                    isCorrect ? "correct" : "incorrect"
                  }`}
                >
                  <p className="review-question-text">
                    {mcqs.length + index + 1}. {q.question}
                  </p>
                  <p
                    className={`your-answer ${
                      !isCorrect && "incorrect-answer-text"
                    }`}
                  >
                    Your Answer: {answersBlanks[index] || "Not Answered"}
                  </p>
                  {!isCorrect && (
                    <p className="correct-answer-text">
                      <FaCheck className="answer-icon" /> Correct Answer:{" "}
                      {q.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Conditional rendering for the spinner
  if (isSubmitting) {
    return <QuizSpinner type="submit" message="Submitting your quiz..." />;
  }

  if (isLoading) {
    return <QuizSpinner type="loading" message="Loading questions..." />;
  }

  if (showResults) {
    return renderResultsPage();
  }
  if (timerRunning || mcqs.length > 0) {
    return renderQuizPage();
  }
};

export default Quiz;
