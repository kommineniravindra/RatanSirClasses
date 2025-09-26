import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import Editor from "@monaco-editor/react";
import { FaExclamationTriangle } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import emailjs from "emailjs-com";
import "../css/Exam.css";

const ExamConfig = {
  mcqCount: 20, // no of MCQ
  blankCount: 10, // no of blanks
  codingCount: 2, //no of coding questions
  mcqMarks: 1,
  blankMarks: 1,
  codingMarks: 10,
};
const EXAM_DURATION_MINUTES = 30; // set timmer for exam

const languageConfig = {
  java: {
    language: "java",
    judge0Id: 62,
    type: "judge0",
    boilerplate: `public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
  },
  python: {
    language: "python",
    judge0Id: 71,
    type: "judge0",
    boilerplate: `# Your code here`,
  },
  javascript: {
    language: "javascript",
    judge0Id: 63,
    type: "judge0",
    boilerplate: `// Your code here`,
  },
  sql: {
    language: "sql",
    judge0Id: 82,
    type: "judge0",
    boilerplate: `-- Your SQL query here`,
  },
  html: {
    language: "html",
    type: "codepad",
    boilerplate: `<!DOCTYPE html>\n<html>\n<head>\n    <title>My HTML Page</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n    <p>This is a sample HTML structure.</p>\n</body>\n</html>`,
  },
  css: {
    language: "css",
    type: "codepad",
    boilerplate: `/* Type your CSS code here */\nbody {\n    font-family: sans-serif;\n}`,
  },
  react: { language: "javascript", type: "none" },
  microservices: { language: "plaintext", type: "none" },
  restapi: { language: "plaintext", type: "none" },
  default: { language: "plaintext", type: "none" },
};

// const shuffleArray = (array) => {
//   const newArray = [...array];
//   for (let i = newArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//   }
//   return newArray;
// };

const JUDGE0_API = "https://ce.judge0.com";

const runCode = async (userCode, customInput, languageId) => {
  if (!languageId)
    return { compileError: "Execution not supported.", output: "" };
  try {
    const res = await fetch(
      `${JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: userCode,
          language_id: languageId,
          stdin: customInput || "",
        }),
      }
    );
    const data = await res.json();
    if (data.compile_output)
      return { compileError: data.compile_output.trim(), output: "" };
    return {
      compileError: null,
      output: data.stdout ? data.stdout.trim() : data.stderr || "",
    };
  } catch (err) {
    return { compileError: err.message, output: "" };
  }
};

const calculateAccuracyMarks = (expectedOutput, actualOutput, maxMarks) => {
  if (!expectedOutput || !actualOutput) return 0;
  const s1 = expectedOutput.trim().replace(/\s+/g, " ");
  const s2 = actualOutput.trim().replace(/\s+/g, " ");
  if (s1 === s2) return maxMarks;
  const levenshteinDistance = (a, b) => {
    const matrix = Array(b.length + 1)
      .fill(null)
      .map(() => Array(a.length + 1).fill(null));
    for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;
    for (let j = 1; j <= b.length; j += 1) {
      for (let i = 1; i <= a.length; i += 1) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    return matrix[b.length][a.length];
  };
  const maxLength = Math.max(s1.length, s2.length);
  if (maxLength === 0) return maxMarks;
  const distance = levenshteinDistance(s1, s2);
  const similarity = (maxLength - distance) / maxLength;
  return Math.round(Math.max(0, similarity) * maxMarks);
};

const examCodeMap = {
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
  "restapi-exam1": "RESTAPI101",
  "restapi-exam2": "RESTAPI202",
};

const examsContext = require.context("../exams", true, /\.json$/);

const Exam = () => {
  const { technology, examId } = useParams();
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState([]);
  const [selectedBlanks, setSelectedBlanks] = useState([]);
  const [selectedCoding, setSelectedCoding] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [blankResults, setBlankResults] = useState({});
  const [codeResults, setCodeResults] = useState({});
  const [totals, setTotals] = useState({ mcq: 0, blanks: 0, coding: 0 });
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [malpracticeDetected, setMalpracticeDetected] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_MINUTES * 60);
  const [timerActive, setTimerActive] = useState(true);
  const [showTwoMinuteModal, setShowTwoMinuteModal] = useState(false);

  const techConfig = languageConfig[technology] || languageConfig.default;
  const isCodingRoundAvailable = useMemo(
    () => techConfig.type === "judge0" || techConfig.type === "codepad",
    [techConfig]
  );

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const shuffleArray = (array) => {
      return [...array].sort(() => Math.random() - 0.5);
    };

    const shuffleAnswers = (questions) => {
      return questions.map((q) => {
        if (q.options) {
          // Shuffle options if it's an MCQ type
          return {
            ...q,
            options: shuffleArray(q.options),
          };
        }
        return q;
      });
    };

    const loadQuestions = () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load MCQ questions
        const quizModule = examsContext(`./${technology}/${examId}MCQ.json`);
        let shuffledMCQ = shuffleArray(quizModule).slice(
          0,
          ExamConfig.mcqCount
        );
        shuffledMCQ = shuffleAnswers(shuffledMCQ); // randomize answers

        // Load Fill in the Blanks
        const blanksModule = examsContext(
          `./${technology}/${examId}Blanks.json`
        );
        const shuffledBlanks = shuffleArray(blanksModule).slice(
          0,
          ExamConfig.blankCount
        );

        // Load Coding if available
        let shuffledCoding = [];
        if (isCodingRoundAvailable) {
          const codingModule = examsContext(
            `./${technology}/${examId}Coding.json`
          );
          shuffledCoding = shuffleArray(codingModule).slice(
            0,
            ExamConfig.codingCount
          );
        }

        // Save to state
        setSelectedQuiz(shuffledMCQ);
        setSelectedBlanks(shuffledBlanks);
        setSelectedCoding(shuffledCoding);
      } catch (err) {
        setError(`Could not find questions for "${technology} - ${examId}".`);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [technology, examId, isCodingRoundAvailable]);

  const submitExam = useCallback(
    async (isAutoSubmit = false, isMalpractice = false) => {
      if (!isAutoSubmit && !isMalpractice) {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You can't change answers after submitting!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, submit!",
        });
        if (!result.isConfirmed) return;
      }

      setIsSubmitting(true);
      setMalpracticeDetected(isMalpractice);
      setTimerActive(false);

      // ---- calculate results ----
      let mcqTotal = 0;
      const qRes = {};
      selectedQuiz.forEach((q, i) => {
        const correct = answers[`quiz-${i}`] === q.answer;
        qRes[i] = { correct, chosen: answers[`quiz-${i}`] || "" };
        mcqTotal += correct ? ExamConfig.mcqMarks : 0;
      });
      setQuizResults(qRes);

      let blanksTotal = 0;
      const bRes = {};
      selectedBlanks.forEach((q, i) => {
        const correct =
          (answers[`blank-${i}`] || "").trim().toLowerCase() ===
          q.answer.trim().toLowerCase();
        bRes[i] = { correct, entered: answers[`blank-${i}`] || "" };
        blanksTotal += correct ? ExamConfig.blankMarks : 0;
      });
      setBlankResults(bRes);

      let codingTotal = 0;
      if (isCodingRoundAvailable) {
        selectedCoding.forEach((q, i) => {
          if (techConfig.type === "codepad" && !codeResults[i]?.evaluated) {
            const marks = calculateAccuracyMarks(
              q.answer,
              answers[`code-${i}`] || "",
              q.maxMarks || ExamConfig.codingMarks
            );
            codingTotal += marks;
          } else {
            codingTotal += codeResults[i]?.marks || 0;
          }
        });
      }
      setTotals({ mcq: mcqTotal, blanks: blanksTotal, coding: codingTotal });

      try {
        const token = localStorage.getItem("token");
        const userEmail = localStorage.getItem("userEmail");
        const userName = localStorage.getItem("userName") || "Student";

        console.log("📌 Sending email for student_name:", userName);

        if (!token || !userEmail)
          throw new Error("Authentication details not found.");

        const examKey = `${technology}-${examId}`;
        const examCode = examCodeMap[examKey];
        if (!examCode) throw new Error("Invalid exam identifier.");

        // ---- payload for DB ----
        const payload = {
          email: userEmail,
          examCode: examCode,
          mcqMarks: mcqTotal,
          fillMarks: blanksTotal,
          codingMarks: codingTotal,
        };

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        try {
          await axios.post(
            "http://localhost:5000/api/exams",
            payload,
            authHeaders
          );
        } catch (error) {
          if (
            error.response &&
            error.response.status === 400 &&
            error.response.data.message.includes("already exists")
          ) {
            await axios.patch(
              "http://localhost:5000/api/exams",
              payload,
              authHeaders
            );
          } else {
            throw error;
          }
        }

        //  EmailJS Send Mail - Using a single template
        if (userEmail) {
          const totalMarks = mcqTotal + blanksTotal + codingTotal;
          const totalPossibleMCQ = selectedQuiz.length * ExamConfig.mcqMarks;
          const totalPossibleBlanks =
            selectedBlanks.length * ExamConfig.blankMarks;
          const totalPossibleCoding = selectedCoding.reduce(
            (sum, q) => sum + (q.maxMarks || ExamConfig.codingMarks),
            0
          );
          const totalPossibleTotal =
            totalPossibleMCQ + totalPossibleBlanks + totalPossibleCoding;

          const templateParams = {
            to_email: userEmail,
            subject: `Exam Results - ${technology} (${examId})`,
            student_name: userName,
            technology:
              technology.charAt(0).toUpperCase() + technology.slice(1),
            exam_number: examId.replace("exam", ""),
            quiz_number: null,
            mcq_marks: `${mcqTotal} / ${totalPossibleMCQ}`,
            blanks_marks: `${blanksTotal} / ${totalPossibleBlanks}`,
            coding_marks: isCodingRoundAvailable
              ? `${codingTotal} / ${totalPossibleCoding}`
              : "N/A",
            total_marks: `${totalMarks} / ${totalPossibleTotal}`,
            malpractice_message: isMalpractice
              ? "Malpractice Detected: Your test was auto-submitted due to leaving the page."
              : null,
          };

          await emailjs
            .send(
              "service_o1fbb8a",
              "template_oxeq679",
              templateParams,
              "QT4vFNSyQjWyMeDEz"
            )
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Submitted!",
                text: "Your exam has been submitted and results have been sent to your email.",
              });
            })
            .catch(() => {
              Swal.fire({
                icon: "error",
                title: "Email Failed",
                text: "Your exam was submitted, but we could not send the results email. Please check your console for more details.",
              });
            });
        } else {
          Swal.fire({
            icon: "warning",
            title: "Email Not Sent",
            text: "Your exam was submitted, but your email address was not found, so the results could not be sent. You can view them below.",
          });
        }
      } catch (error) {
        console.error("Failed to save/send exam results:", error);
        await Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            error.response?.data?.message ||
            "Could not save/send your results.",
        });
      } finally {
        setIsSubmitting(false);
        setShowResult(true);
      }
    },
    [
      answers,
      codeResults,
      isCodingRoundAvailable,
      techConfig.type,
      selectedBlanks,
      selectedCoding,
      selectedQuiz,
      technology,
      examId,
    ]
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !showResult && timerActive) {
        submitExam(true, true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [showResult, timerActive, submitExam]);

  // Timer effect
  useEffect(() => {
    if (!timerActive || isLoading) return;

    if (timeLeft === 120) {
      setShowTwoMinuteModal(true); // Show modal at 2 minutes
    }

    if (timeLeft <= 0) {
      submitExam(true);
      return;
    }

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, timerActive, isLoading, submitExam]);

  const handleChange = (qKey, value) =>
    setAnswers((prev) => ({ ...prev, [qKey]: value }));
  const formatTime = () =>
    `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(
      timeLeft % 60
    ).padStart(2, "0")}`;

  const handleRunCode = async (i, code) => {
    if (!code || techConfig.type !== "judge0") return;
    setLoading(true);
    const { compileError, output } = await runCode(
      code,
      selectedCoding[i].sampleInput,
      techConfig.judge0Id
    );
    let marks = 0;
    if (!compileError) {
      marks = calculateAccuracyMarks(
        selectedCoding[i].sampleOutput,
        output,
        selectedCoding[i].maxMarks || ExamConfig.codingMarks
      );
    }
    setCodeResults((prev) => ({
      ...prev,
      [i]: { compileError, output, marks },
    }));
    setLoading(false);
  };

  const handleEvaluateCodePad = (index, code) => {
    const question = selectedCoding[index];
    const marks = calculateAccuracyMarks(
      question.answer,
      code,
      question.maxMarks || ExamConfig.codingMarks
    );
    setCodeResults((prev) => ({
      ...prev,
      [index]: { marks, evaluated: true },
    }));
  };

  const createPreviewContent = (code, type) => {
    if (type === "html") return code;
    if (type === "css") {
      return `<html><head><style>${code}</style></head><body><h1>Styled Heading</h1><p>A sample paragraph.</p><button>Button</button></body></html>`;
    }
    return "";
  };

  if (error)
    return (
      <div className="loading-screen error-screen">
        <FaExclamationTriangle size="3rem" />
        <p>{error}</p>
      </div>
    );
  if (isLoading)
    return <div className="loading-screen">Loading Your Exam...</div>;

  const examNumber = examId ? examId.replace("exam", "") : "";

  return (
    <div className="page-container">
      <div className="exam-container">
        <div className="exam-header">
          <h1>
            {technology.charAt(0).toUpperCase() + technology.slice(1)} Exam #
            {examNumber}
          </h1>
          {!showResult && (
            <div className="header-controls">
              <div className={`timer ${timeLeft <= 60 ? "flash-red" : ""}`}>
                Time Left: {formatTime()}
              </div>

{showTwoMinuteModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      {/* Header and text are now grouped */}
      <div className="modal-body">
        <h3 className="modal-title">⚠️ Hurry Up!</h3>
        <p className="modal-message">Only 2 minutes left to complete your exam.</p>
      </div>

      {/* The footer with the button is now separate and will be pushed to the bottom */}
      <div className="modal-footer">
        <button
          onClick={() => setShowTwoMinuteModal(false)}
          className="modal-close-btn"
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}



              <button
                className="submit-button"
                onClick={() => submitExam(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="spinner-container">
                    <div className="exam-spinner"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit Test"
                )}
              </button>
            </div>
          )}
        </div>

        {!showResult ? (
          <>
            {malpracticeDetected && (
              <div className="malpractice-warning">
                <FaExclamationTriangle />
                <h3>Malpractice Detected</h3>
                <p>Your test was auto-submitted due to leaving the page.</p>
              </div>
            )}
            <div className="pagination-buttons">
              <button
                className={currentPage === 1 ? "active" : ""}
                onClick={() => setCurrentPage(1)}
              >
                MCQs
              </button>
              <button
                className={currentPage === 2 ? "active" : ""}
                onClick={() => setCurrentPage(2)}
              >
                Fill in the Blanks
              </button>
              {isCodingRoundAvailable && (
                <button
                  className={currentPage === 3 ? "active" : ""}
                  onClick={() => setCurrentPage(3)}
                >
                  Coding
                </button>
              )}
            </div>
            <div className="questions-area">
              {currentPage === 1 &&
                selectedQuiz.map((q, i) => (
                  <div key={`quiz-${i}`} className="question-block">
                    <p className="question-title">
                      <strong>{i + 1}. </strong> {q.question}
                    </p>
                    <div className="options-group">
                      {q.options.map((opt) => (
                        <label key={opt} className="option-label">
                          <input
                            type="radio"
                            name={`quiz-${i}`}
                            value={opt}
                            checked={answers[`quiz-${i}`] === opt}
                            onChange={(e) =>
                              handleChange(`quiz-${i}`, e.target.value)
                            }
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
{currentPage === 2 &&
  selectedBlanks.map((q, i) => {
    // Split question at any number of consecutive underscores
    const parts = q.question.split(/_+/);

    return (
      <div key={`blank-${i}`} className="question-block">
        <p className="question-title1">
          <strong>{i + 1}. </strong>
          {parts.map((part, idx) => (
            <React.Fragment key={idx}>
              {part}
              {/* Insert input after each part except the last */}
              {idx < parts.length - 1 && (
                <input
                  type="text"
                  className="inline-blank-input"
                  value={answers[`blank-${i}-${idx}`] || ""}
                  onChange={(e) =>
                    handleChange(`blank-${i}-${idx}`, e.target.value)
                  }
                />
              )}
            </React.Fragment>
          ))}
        </p>
      </div>
    );
  })}

              {isCodingRoundAvailable &&
                currentPage === 3 &&
                selectedCoding.map((q, i) => (
                  <div
                    key={`code-${i}`}
                    className="question-block coding-block"
                  >
                    <p className="question-title">
                      <strong>
                        {i + 1}. 
                      </strong>{" "}
                      {q.question}
                    </p>

                    <div className="sample-box">
                      <div>
                        <p>
                          <strong>Sample Input:</strong>
                        </p>
                        <pre>{q.sampleInput || "N/A"}</pre>
                      </div>
                      <div>
                        <p>
                          <strong>Sample Output:</strong>
                        </p>
                        <pre>{q.sampleOutput || "N/A"}</pre>
                      </div>
                    </div>

                    {techConfig.type === "judge0" && (
                      <>
                        <Editor
                          height="300px"
                          language={techConfig.language}
                          defaultValue={
                            answers[`code-${i}`] || techConfig.boilerplate
                          }
                          theme="vs-dark"
                          onChange={(val) =>
                            handleChange(`code-${i}`, val || "")
                          }
                          options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                          }}
                        />
                        <button
                          className="run-button"
                          onClick={() => handleRunCode(i, answers[`code-${i}`])}
                          disabled={loading}
                        >
                          {loading ? "Running..." : "Run & Evaluate"}
                        </button>
                        {codeResults[i] && (
                          <div className="testcases">
                            {codeResults[i].compileError ? (
                              <div className="output-error">
                                <h4>Error</h4>
                                <pre>{codeResults[i].compileError}</pre>
                              </div>
                            ) : (
                              <div className="output-success">
                                <h4>Your Output:</h4>
                                <pre>
                                  {codeResults[i].output || "(no output)"}
                                </pre>
                                <p className="marks-display">
                                  Marks: {codeResults[i].marks} /{" "}
                                  {q.maxMarks || ExamConfig.codingMarks}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {techConfig.type === "codepad" && (
                      <>
                        <div className="codepad-container">
                          <div className="codepad-editor">
                            <Editor
                              height="300px"
                              language={techConfig.language}
                              defaultValue={
                                answers[`code-${i}`] || techConfig.boilerplate
                              }
                              theme="vs-dark"
                              onChange={(val) =>
                                handleChange(`code-${i}`, val || "")
                              }
                            />
                          </div>
                          <div className="codepad-preview">
                            <iframe
                              srcDoc={createPreviewContent(
                                answers[`code-${i}`] || techConfig.boilerplate,
                                techConfig.language
                              )}
                              title="Live Preview"
                              sandbox="allow-scripts"
                              frameBorder="0"
                            />
                          </div>
                        </div>
                        <button
                          className="run-button"
                          onClick={() =>
                            handleEvaluateCodePad(i, answers[`code-${i}`])
                          }
                        >
                          Run & Evaluate
                        </button>
                        {codeResults[i]?.evaluated && (
                          <div className="testcases">
                            <div className="output-success">
                              <p className="marks-display">
                                Marks: {codeResults[i].marks} /{" "}
                                {q.maxMarks || ExamConfig.codingMarks}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div className="result-page">
            <h2>Exam Results</h2>
            {malpracticeDetected && (
              <div className="malpractice-warning">
                <FaExclamationTriangle />
                <h3>Malpractice Detected</h3>
                <p>Your test was auto-submitted due to leaving the page.</p>
              </div>
            )}
            <div className="total-summary">
              <h3>Overall Score</h3>
              <div className="score-details">
                <p>
                  MCQ:{" "}
                  <span>
                    {totals.mcq} / {selectedQuiz.length * ExamConfig.mcqMarks}
                  </span>
                </p>
                <p>
                  Blanks:{" "}
                  <span>
                    {totals.blanks} /{" "}
                    {selectedBlanks.length * ExamConfig.blankMarks}
                  </span>
                </p>
                {isCodingRoundAvailable && (
                  <p>
                    Coding:{" "}
                    <span>
                      {totals.coding} /{" "}
                      {selectedCoding.reduce(
                        (sum, q) =>
                          sum + (q.maxMarks || ExamConfig.codingMarks),
                        0
                      )}
                    </span>
                  </p>
                )}
              </div>
              {/* Grand Total */}
              <p className="grand-total">
                Grand Total:{" "}
                <span>
                  {totals.mcq + totals.blanks + totals.coding} /{" "}
                  {selectedQuiz.length * ExamConfig.mcqMarks +
                    selectedBlanks.length * ExamConfig.blankMarks +
                    (isCodingRoundAvailable
                      ? selectedCoding.reduce(
                          (sum, q) =>
                            sum + (q.maxMarks || ExamConfig.codingMarks),
                          0
                        )
                      : 0)}
                </span>
              </p>
              <button
                className="go-to-dashboard-button"
                onClick={handleGoToDashboard}
              >
                Go to Dashboard
              </button>
            </div>

            <div className="feedback-section">
              <h3>Detailed Feedback</h3>

              <h4>MCQ Questions</h4>
              {selectedQuiz.map((q, i) => (
                <div key={`quiz-fb-${i}`} className="feedback-item">
                  <p>
                    <strong>Q:</strong> {q.question}
                  </p>
                  <p
                    className={`feedback-answer ${
                      quizResults[i]?.correct ? "correct" : "incorrect"
                    }`}
                  >
                    <strong>Your Answer:</strong>{" "}
                    {quizResults[i]?.chosen || "Not answered"}
                  </p>
                  {!quizResults[i]?.correct && (
                    <p className="feedback-answer correct">
                      <strong>Correct Answer:</strong> {q.answer}
                    </p>
                  )}
                </div>
              ))}

              <h4>Fill in the Blanks</h4>
              {selectedBlanks.map((q, i) => (
                <div key={`blank-fb-${i}`} className="feedback-item">
                  <p>
                    <strong>Q:</strong> {q.question}
                  </p>
                  <p
                    className={`feedback-answer ${
                      blankResults[i]?.correct ? "correct" : "incorrect"
                    }`}
                  >
                    <strong>Your Answer:</strong>{" "}
                    {blankResults[i]?.entered || "Not answered"}
                  </p>
                  {!blankResults[i]?.correct && (
                    <p className="feedback-answer correct">
                      <strong>Correct Answer:</strong> {q.answer}
                    </p>
                  )}
                </div>
              ))}

              {isCodingRoundAvailable && (
                <>
                  <h4>Coding Questions</h4>
                  {selectedCoding.map((q, i) => (
                    <div key={`code-fb-${i}`} className="feedback-item">
                      <p>
                        <strong>Q:</strong> {q.question}
                      </p>
                      <p className="marks-display">
                        <strong>Marks Scored:</strong>{" "}
                        {codeResults[i]?.marks || 0} /{" "}
                        {q.maxMarks || ExamConfig.codingMarks}
                      </p>
                      <details>
                        <summary>Show Solution & Your Code</summary>
                        <div className="code-feedback-details">
                          <h5>Your Submitted Code:</h5>
                          <SyntaxHighlighter
                            language={techConfig.language}
                            style={coy}
                            customStyle={{ borderRadius: "8px" }}
                          >
                            {answers[`code-${i}`] ||
                              "// You did not submit any code for this question."}
                          </SyntaxHighlighter>
                          <h5>Correct Solution:</h5>
                          <SyntaxHighlighter
                            language={techConfig.language}
                            style={coy}
                            customStyle={{ borderRadius: "8px" }}
                          >
                            {q.answer}
                          </SyntaxHighlighter>
                        </div>
                      </details>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exam;
