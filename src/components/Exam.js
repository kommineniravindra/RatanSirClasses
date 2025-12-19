import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import AceEditor from "react-ace"; // Added Ace
import ace from "ace-builds"; // Added Ace Core
import { FaExclamationTriangle, FaMagic, FaChevronDown } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import "../css/Exam.css";
import BrowserPreview from "./BrowserPreview";

// Utilities
import javaSnippets from "../utils/javaSnippets";
import { languageBoilerplates } from "../utils/languageBoilerplates";
import sqlSnippets from "../utils/sqlSnippets";
import { generateJavaCode } from "../utils/javaCodeGenerator";

// Ace Imports
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

// Configure Ace
ace.config.set(
  "basePath",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.35.0/src-noconflict/"
);
ace.config.set(
  "workerPath",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.35.0/src-noconflict/"
);

const examsContext = require.context("../exams", true, /\.json$/);

const ExamConfig = {
  mcqCount: 50, // no of MCQ
  blankCount: 50, // no of blanks
  codingCount: 3, //no of coding questions
  mcqMarks: 1,
  blankMarks: 1,
  codingMarks: 10,
};
const EXAM_DURATION_MINUTES = 30; // set timmer for exam

const languageConfig = {
  java: {
    language: "java",
    aceMode: "java",
    judge0Id: 62,
    type: "judge0",
    boilerplate: languageBoilerplates.Java,
  },
  python: {
    language: "python",
    aceMode: "python",
    judge0Id: 71,
    type: "judge0",
    boilerplate: languageBoilerplates.Python, // Exam default was "# Your code here", utils has hello world. Let's strictly use utils as requested.
  },
  javascript: {
    language: "javascript",
    aceMode: "javascript",
    judge0Id: 63,
    type: "judge0",
    boilerplate: languageBoilerplates.JavaScript,
  },
  sql: {
    language: "sql",
    aceMode: "sql",
    judge0Id: 82,
    type: "judge0",
    boilerplate: languageBoilerplates.SQL,
  },
  html: {
    language: "html",
    aceMode: "html",
    type: "codepad",
    boilerplate: languageBoilerplates.HTML,
  },
  css: {
    language: "css",
    aceMode: "css",
    type: "codepad",
    boilerplate: languageBoilerplates.CSS, // Exam uses regular CSS, not wrapped
  },
  restapi: {
    language: "java",
    aceMode: "java",
    judge0Id: 62,
    type: "judge0",
    boilerplate: languageBoilerplates.Java,
  },
  react: { language: "javascript", aceMode: "javascript", type: "none" },
  microservices: { language: "plaintext", aceMode: "text", type: "none" },
  default: { language: "plaintext", aceMode: "text", type: "none" },
};

const JUDGE0_API = "https://ce.judge0.com";

// --- HELPER FUNCTION: Run code using Judge0 API ---
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

// --- HELPER FUNCTION: Calculate marks based on Levenshtein distance ---
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
    for (let i = 1; i <= a.length; i += 1) {
      for (let j = 1; j <= b.length; j += 1) {
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
  "restapi-exam1": "REST101",
  "restapi-exam2": "REST202",
};

// --- HELPER FUNCTION: Get the question section based on a global index ---
const getQuestionDetailsFromGlobalIndex = (
  globalIndex,
  quiz,
  blanks,
  coding
) => {
  if (globalIndex < quiz.length) {
    return { page: 1, index: globalIndex, question: quiz[globalIndex] };
  }
  const blankStart = quiz.length;
  if (globalIndex < blankStart + blanks.length) {
    return {
      page: 2,
      index: globalIndex - blankStart,
      question: blanks[globalIndex - blankStart],
    };
  }
  const codingStart = blankStart + blanks.length;
  if (globalIndex < codingStart + coding.length) {
    return {
      page: 3,
      index: globalIndex - codingStart,
      question: coding[globalIndex - codingStart],
    };
  }
  return { page: 1, index: 0, question: quiz[0] };
};

// --- START: Question Palette Component (FLATTENED for single-line scroll) ---
const QuestionPalette = ({
  quiz,
  blanks,
  coding,
  handleQuestionJump,
  isCodingRoundAvailable,
  calculateAnswerStatus,
}) => {
  // Define all sections' data in the desired order
  const getSectionDetails = (section) => {
    if (section === 1) return { questions: quiz, startIndex: 0 };
    if (section === 2) return { questions: blanks, startIndex: quiz.length };
    if (section === 3)
      return { questions: coding, startIndex: quiz.length + blanks.length };
    return { questions: [], startIndex: 0 };
  };

  const allQuestionsData = [
    getSectionDetails(1),
    getSectionDetails(2),
    isCodingRoundAvailable ? getSectionDetails(3) : null,
  ].filter(Boolean);

  // Flatten all questions from all sections into a single array of button JSX
  const allButtons = allQuestionsData.flatMap(
    ({ questions, startIndex }, sectionIndex) => {
      const section = sectionIndex + 1;
      if (questions.length === 0) return [];

      return questions.map((_, i) => {
        const globalIndex = startIndex + i;
        const status = calculateAnswerStatus(section, i);

        return (
          <button
            key={`pal-${globalIndex}`}
            className={`palette-button ${status}`}
            onClick={() => handleQuestionJump(globalIndex, section)}
          >
            {globalIndex + 1}
          </button>
        );
      });
    }
  );

  // Auto-scroll palette to keep current question in view
  useEffect(() => {
    const activeBtn = document.querySelector(".palette-button.current-in-view");
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  });

  return (
    <div className="question-palette-fixed-header">
      {/* Using .palette-inner for the scrolling container */}
      <div className="palette-inner">{allButtons}</div>
    </div>
  );
};
// --- END: Question Palette Component ---

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [malpracticeDetected, setMalpracticeDetected] = useState(false);

  // New State for Refined Coding Round
  const [customInputs, setCustomInputs] = useState({});
  const [runResults, setRunResults] = useState({}); // For "Run Code" (Debug) output
  const [runningQuestionId, setRunningQuestionId] = useState(null); // Track which question is running

  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuestionInView, setCurrentQuestionInView] = useState(0);

  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_MINUTES * 60);
  const [timerActive, setTimerActive] = useState(true);
  const [showTwoMinuteModal, setShowTwoMinuteModal] = useState(false);

  // Code Generation State
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const generateDropdownRef = useRef(null);
  const editorRefs = useRef({});
  const [activeCodeQuestionIndex, setActiveCodeQuestionIndex] = useState(null);

  const sqlDbRef = useRef(null);
  const SQL_WASM_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm";

  useEffect(() => {
    const loadSql = async () => {
      if (window.initSqlJs) {
        try {
          const SQL = await window.initSqlJs({
            locateFile: () => SQL_WASM_URL,
          });
          sqlDbRef.current = new SQL.Database();
          return;
        } catch (e) {
          console.error("Error initializing existing SQL", e);
        }
      }
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js";
      script.async = true;
      script.onload = async () => {
        try {
          const SQL = await window.initSqlJs({
            locateFile: () => SQL_WASM_URL,
          });
          sqlDbRef.current = new SQL.Database();
        } catch (err) {
          console.error("Failed to initialize SQL.js", err);
        }
      };
      script.onerror = () => console.error("Failed to load SQL.js script");
      document.body.appendChild(script);
    };
    loadSql();
  }, []);

  // Auto-Fullscreen on Mount
  useEffect(() => {
    const enterFullScreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.warn("Fullscreen request denied:", err);
      }
    };
    enterFullScreen();
  }, []);

  const techConfig = languageConfig[technology] || languageConfig.default;
  const isCodingRoundAvailable = useMemo(
    () => techConfig.type === "judge0" || techConfig.type === "codepad",
    [techConfig]
  );

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleQuestionJump = useCallback((globalIndex, section) => {
    const questionId = `question-${globalIndex}`;
    const element = document.getElementById(questionId);
    if (element) {
      const offset = 150;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setCurrentPage(section);
      setCurrentQuestionInView(globalIndex);
    }
  }, []);

  useEffect(() => {
    if (showResult || isLoading) return;

    const allQuestions = [];
    const totalMCQ = selectedQuiz.length;
    const totalBlank = selectedBlanks.length;
    const totalCoding = selectedCoding.length;
    const totalCount = totalMCQ + totalBlank + totalCoding;

    for (let i = 0; i < totalCount; i++) {
      allQuestions.push(`question-${i}`);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const globalIndex = parseInt(entry.target.id.split("-")[1]);
            setCurrentQuestionInView(globalIndex);

            const details = getQuestionDetailsFromGlobalIndex(
              globalIndex,
              selectedQuiz,
              selectedBlanks,
              selectedCoding
            );
            setCurrentPage(details.page);

            // Track active code question for generating code
            if (details.page === 3) {
              setActiveCodeQuestionIndex(details.index);
            } else {
              setActiveCodeQuestionIndex(null);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-50px 0px -50% 0px",
        threshold: 0.1,
      }
    );

    allQuestions.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [selectedQuiz, selectedBlanks, selectedCoding, showResult, isLoading]);

  const calculateAnswerStatus = useCallback(
    (section, index) => {
      let key;
      if (section === 1) key = `quiz-${index}`;
      else if (section === 2) key = `blank-${index}`;
      else if (section === 3) key = `code-${index}`;

      const isAnswered = answers[key] && String(answers[key]).trim() !== "";

      let globalIndex = 0;
      if (section === 1) globalIndex = index;
      if (section === 2) globalIndex = selectedQuiz.length + index;
      if (section === 3)
        globalIndex = selectedQuiz.length + selectedBlanks.length + index;

      const isCurrentInView = globalIndex === currentQuestionInView;

      if (isCurrentInView) return "current-in-view";
      if (isAnswered) return "answered";
      return "unanswered";
    },
    [answers, currentQuestionInView, selectedQuiz, selectedBlanks]
  );

  useEffect(() => {
    const shuffleArray = (array) => {
      return [...array].sort(() => Math.random() - 0.5);
    };

    const shuffleAnswers = (questions) => {
      return questions.map((q) => {
        if (q.options) {
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

        // Load MCQ
        const quizModule = examsContext(`./${technology}/${examId}MCQ.json`);
        let shuffledMCQ = shuffleArray(quizModule).slice(
          0,
          ExamConfig.mcqCount
        );
        shuffledMCQ = shuffleAnswers(shuffledMCQ);

        // Load Blanks
        const blanksModule = examsContext(
          `./${technology}/${examId}Blanks.json`
        );
        const shuffledBlanks = shuffleArray(blanksModule).slice(
          0,
          ExamConfig.blankCount
        );

        // Load Coding
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

        setSelectedQuiz(shuffledMCQ);
        setSelectedBlanks(shuffledBlanks);
        setSelectedCoding(shuffledCoding);
        setCurrentQuestionInView(0);
      } catch (err) {
        setError(`Could not find questions for "${technology} - ${examId}".`);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [technology, examId, isCodingRoundAvailable]);

  // Snippet Registration
  const handleEditorLoad = (editor, index) => {
    if (index !== undefined) {
      editorRefs.current[index] = editor;
    }
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
    });

    const customCompleter = {
      getCompletions: function (editor, session, pos, prefix, callback) {
        // Only for Java or SQL
        const mode = session.getMode().$id;
        let snippetsToUse = [];

        if (mode && mode.endsWith("/java")) {
          snippetsToUse = javaSnippets;
        } else if (mode && mode.endsWith("/sql")) {
          snippetsToUse = sqlSnippets;
        } else {
          callback(null, []);
          return;
        }

        if (prefix.length === 0) {
          callback(null, []);
          return;
        }

        callback(
          null,
          snippetsToUse.map((s) => ({
            caption: s.caption,
            snippet: s.snippet,
            type: "snippet",
            meta: s.customImport ? "Auto-Import" : "Snippet",
            customImport: s.customImport,
            score: 1000000,
            completer: customCompleter,
          }))
        );
      },
      insertMatch: function (editor, data) {
        if (
          editor.completer &&
          editor.completer.completions &&
          editor.completer.completions.filterText
        ) {
          const ranges = editor.selection.getAllRanges();
          const len = editor.completer.completions.filterText.length;
          for (let i = 0; i < ranges.length; i++) {
            const r = ranges[i];
            editor.getSession().remove({
              start: { row: r.start.row, column: r.start.column - len },
              end: r.start,
            });
          }
        }

        if (data.customImport) {
          const doc = editor.getSession().getDocument();
          const content = doc.getValue();
          const importsToAdd = data.customImport.split("\n");

          importsToAdd.forEach((impStr) => {
            const trimmed = impStr.trim();
            // Check if import already exists to prevent duplicates
            if (trimmed && !content.includes(trimmed)) {
              // Insert at the very top, ensuring a newline follows
              doc.insert({ row: 0, column: 0 }, trimmed + "\n");
            }
          });
        }

        ace
          .require("ace/snippets")
          .snippetManager.insertSnippet(editor, data.snippet);
      },
    };

    const langTools = ace.require("ace/ext/language_tools");
    if (langTools) {
      langTools.addCompleter(customCompleter);
    }
  };

  const handleGenerateCode = (type, index) => {
    setOpenDropdownIndex(null);
    const code = answers[`code-${index}`] || techConfig.boilerplate;
    const result = generateJavaCode(code, type);
    if (result.success) {
      handleChange(`code-${index}`, result.newCode);
    } else {
      Swal.fire("Info", result.message || "Could not generate code.", "info");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        generateDropdownRef.current &&
        !generateDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdownIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            // For codepad, calculate marks if not already evaluated
            const marks = calculateAccuracyMarks(
              q.answer,
              answers[`code-${i}`] || "",
              q.maxMarks || ExamConfig.codingMarks
            );
            codingTotal += marks;
          } else {
            // For judge0, or already evaluated codepad, use stored marks
            codingTotal += codeResults[i]?.marks || 0;
          }
        });
      }
      setTotals({ mcq: mcqTotal, blanks: blanksTotal, coding: codingTotal });

      try {
        const token = localStorage.getItem("token");
        const userEmail = localStorage.getItem("userEmail");
        // const userName = localStorage.getItem("userName") || "Student";

        if (!token || !userEmail)
          throw new Error("Authentication details not found.");

        const totalPossibleMCQ = selectedQuiz.length * ExamConfig.mcqMarks;
        const totalPossibleBlanks =
          selectedBlanks.length * ExamConfig.blankMarks;
        const totalPossibleCoding = isCodingRoundAvailable
          ? selectedCoding.reduce(
              (sum, q) => sum + (q.maxMarks || ExamConfig.codingMarks),
              0
            )
          : 0;

        const maxTotalMarks =
          totalPossibleMCQ + totalPossibleBlanks + totalPossibleCoding;

        const examKey = `${technology}-${examId}`;
        const examCode = examCodeMap[examKey];
        if (!examCode) throw new Error("Invalid exam identifier.");

        const payload = {
          email: userEmail,
          examCode: examCode,
          mcqMarks: mcqTotal,
          fillMarks: blanksTotal,
          codingMarks: codingTotal,
          totalMarksPossible: maxTotalMarks,
        };

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        try {
          // Attempt to save new result
          await axios.post("/api/exams", payload, authHeaders);
        } catch (error) {
          if (
            error.response &&
            error.response.status === 400 &&
            error.response.data.message.includes("already exists")
          ) {
            await axios.patch("/api/exams", payload, authHeaders);
          } else {
            throw error;
          }
        }

        await Swal.fire({
          icon: "success",
          title: "Submitted!",
          text: "Your exam has been submitted and results have been sent to your email (via backend).",
        });
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

  // --- HELPER FUNCTION: Run code using Piston API (Replacing Judge0) ---
  const runCode = async (userCode, customInput, language) => {
    // Map Exam.js languages to Piston API languages
    const langMap = {
      java: "java",
      python: "python",
      javascript: "javascript",
      sql: "sql",
    };

    // Special handling for SQL (Local Execution)
    if (language === "sql") {
      if (!sqlDbRef.current) {
        return { compileError: "SQL Database initializing...", output: "" };
      }
      try {
        const db = sqlDbRef.current;

        // Strip comments
        const sanitizedCode = userCode
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .split("\n")
          .map((line) => {
            const idx = line.indexOf("--");
            return idx >= 0 ? line.substring(0, idx) : line;
          })
          .join("\n");

        const commands = sanitizedCode
          .split(";")
          .filter((c) => c.trim().length > 0);
        let outputLog = [];
        for (let cmd of commands) {
          try {
            const res = db.exec(cmd);
            const trimmedCmd = cmd.trim();
            const lowerCmd = trimmedCmd.toLowerCase();

            if (lowerCmd.startsWith("create table")) {
              const match = trimmedCmd.match(
                /create\s+table\s+(?:if\s+not\s+exists\s+)?["`]?([^\s("`]+)/i
              );
              const tableName = match ? match[1] : "Table";
              outputLog.push(`Table '${tableName}' created successfully.`);
            } else if (lowerCmd.startsWith("drop table")) {
              const match = trimmedCmd.match(
                /drop\s+table\s+(?:if\s+exists\s+)?["`]?([^\s("`]+)/i
              );
              const tableName = match ? match[1] : "Table";
              outputLog.push(`Table '${tableName}' dropped successfully.`);
            } else if (lowerCmd.startsWith("insert into")) {
              const match = trimmedCmd.match(
                /insert\s+into\s+["`]?([^\s("`]+)/i
              );
              const tableName = match ? match[1] : "table";
              outputLog.push(
                `Values inserted into '${tableName}' successfully.`
              );
            } else if (lowerCmd.startsWith("update")) {
              const match = trimmedCmd.match(/update\s+["`]?([^\s("`]+)/i);
              const tableName = match ? match[1] : "table";
              outputLog.push(`Table '${tableName}' updated successfully.`);
            } else if (lowerCmd.startsWith("delete from")) {
              const match = trimmedCmd.match(
                /delete\s+from\s+["`]?([^\s("`]+)/i
              );
              const tableName = match ? match[1] : "table";
              outputLog.push(`Rows deleted from '${tableName}' successfully.`);
            } else if (lowerCmd.startsWith("select")) {
              if (res.length > 0) {
                // Format simple table text for exam output (since we can't easily render HTML table in current Exam UI)
                const cols = res[0].columns.join(" | ");
                const separator = "-".repeat(cols.length);
                const rows = res[0].values
                  .map((row) => row.join(" | "))
                  .join("\n");
                outputLog.push(`${cols}\n${separator}\n${rows}`);
              } else {
                outputLog.push("Query returned no results.");
              }
            } else {
              if (res.length > 0) outputLog.push(JSON.stringify(res[0]));
              else outputLog.push("Command executed successfully.");
            }
          } catch (e) {
            return { compileError: `SQL Error: ${e.message}`, output: "" };
          }
        }
        return { compileError: null, output: outputLog.join("\n\n") };
      } catch (err) {
        return { compileError: err.message, output: "" };
      }
    }

    const apiLang = langMap[language] || language;

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: apiLang,
          version: "*",
          files: [{ content: userCode }],
          stdin: customInput || "",
        }),
      });
      const data = await response.json();

      if (data.run && data.run.code !== 0) {
        // Error case
        return { compileError: data.run.stderr || data.run.stdout, output: "" };
      }

      return {
        compileError: null,
        output: data.run ? data.run.stdout : "",
      };
    } catch (err) {
      return { compileError: err.message, output: "" };
    }
  };

  useEffect(() => {
    if (!timerActive || isLoading) return;

    if (timeLeft === 120) {
      setShowTwoMinuteModal(true);
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

  const handleRunCode = async (i, code, mode = "run") => {
    if (!code) return; // techConfig check removed as we support Piston now

    setRunningQuestionId(i);

    // Determine input: Custom Input for "run" mode, Sample Input for "evaluate" mode
    const inputToUse =
      mode === "run" ? customInputs[i] || "" : selectedCoding[i].sampleInput;

    // Check for selection
    let codeToRun = code;
    if (editorRefs.current[i]) {
      const selectedText = editorRefs.current[i].getSelectedText();
      if (selectedText && selectedText.trim().length > 0) {
        codeToRun = selectedText;
      }
    }

    // No preprocessing needed for Piston (handles custom class names better)
    const { compileError, output } = await runCode(
      codeToRun,
      inputToUse,
      techConfig.language
    );

    if (mode === "run") {
      // Just update run results for debugging
      setRunResults((prev) => ({
        ...prev,
        [i]: { compileError, output },
      }));
    } else {
      // Evaluate mode: Calculate marks based on Sample Output
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
        [i]: { compileError, output, marks, evaluated: true },
      }));
    }
    setRunningQuestionId(null);
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

  // Calculate Max Total Marks for Result Display (used only in the return block)
  const maxTotalMarksDisplay =
    selectedQuiz.length * ExamConfig.mcqMarks +
    selectedBlanks.length * ExamConfig.blankMarks +
    (isCodingRoundAvailable
      ? selectedCoding.reduce(
          (sum, q) => sum + (q.maxMarks || ExamConfig.codingMarks),
          0
        )
      : 0);

  return (
    <>
      {/* Top Fixed Bar Container (Header + Palette) */}
      {!showResult && (
        <div className="top-fixed-bar">
          {/* 1. Exam Name, Timer, Submit Button */}
          <div className="exam-header">
            <h1>
              {technology.charAt(0).toUpperCase() + technology.slice(1)} Exam #
              {examNumber}
            </h1>
            <div className="header-controls">
              <div className={`timer ${timeLeft <= 60 ? "flash-red" : ""}`}>
                Time Left: {formatTime()}
              </div>

              {showTwoMinuteModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-body">
                      <h3 className="modal-title">⚠️ Hurry Up!</h3>
                      <p className="modal-message">
                        Only 2 minutes left to complete your exam.
                      </p>
                    </div>
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
          </div>

          {/* 2. Question Palette (Flattened Button Grid) */}
          <QuestionPalette
            quiz={selectedQuiz}
            blanks={selectedBlanks}
            coding={selectedCoding}
            // currentPage={currentPage} // Removed unused prop
            // setCurrentPage={setCurrentPage} // Removed unused prop
            handleQuestionJump={handleQuestionJump}
            isCodingRoundAvailable={isCodingRoundAvailable}
            calculateAnswerStatus={calculateAnswerStatus}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="page-container">
        <div className="exam-container">
          {/* Header for Result Page only */}
          {showResult && (
            <div className="exam-header">
              <h1>
                {technology.charAt(0).toUpperCase() + technology.slice(1)} Exam
                #{examNumber}
              </h1>
            </div>
          )}

          {!showResult ? (
            <>
              {malpracticeDetected && (
                <div className="malpractice-warning">
                  <FaExclamationTriangle />
                  <h3>Malpractice Detected</h3>
                  <p>Your test was auto-submitted due to leaving the page.</p>
                </div>
              )}

              <div className="questions-area-wrapper">
                {/* --- PAGINATION BUTTONS (for sectional view) --- */}
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

                {/* --- START: Full Section View --- */}
                <div className="questions-scroll-area">
                  {currentPage === 1 &&
                    selectedQuiz.map((q, i) => (
                      <div
                        key={`quiz-${i}`}
                        id={`question-${i}`}
                        className="question-block"
                      >
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
                      const parts = q.question.split(/_+/);
                      const inputKey = `blank-${i}`;
                      const globalIndex = selectedQuiz.length + i;

                      return (
                        <div
                          key={inputKey}
                          id={`question-${globalIndex}`}
                          className="question-block"
                        >
                          <p className="question-title1">
                            <strong>{globalIndex + 1}. </strong>

                            {parts.map((part, idx) => (
                              <React.Fragment key={idx}>
                                {part}
                                {idx < parts.length - 1 && (
                                  <input
                                    type="text"
                                    className="inline-blank-input"
                                    value={answers[inputKey] || ""}
                                    onChange={(e) =>
                                      handleChange(inputKey, e.target.value)
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
                    selectedCoding.map((q, i) => {
                      const globalIndex =
                        selectedQuiz.length + selectedBlanks.length + i;

                      return (
                        <div
                          key={`code-${i}`}
                          id={`question-${globalIndex}`}
                          className="question-block coding-block"
                        >
                          <p className="question-title">
                            <strong>{globalIndex + 1}.</strong> {q.question}
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
                                <strong>Expected Output:</strong>
                              </p>
                              {techConfig.type === "codepad" ? (
                                <div className="expected-preview">
                                  <BrowserPreview
                                    htmlCode={q.sampleOutput || ""}
                                  />
                                </div>
                              ) : (
                                <pre>{q.sampleOutput || "N/A"}</pre>
                              )}
                            </div>
                          </div>

                          {techConfig.type === "judge0" && (
                            <>
                              {/* Generate Code Tool (Java only) */}
                              {techConfig.language === "java" && (
                                <div
                                  style={{
                                    position: "relative",
                                    marginBottom: "10px",
                                  }}
                                  ref={generateDropdownRef}
                                >
                                  <button
                                    className="btn-compiler"
                                    style={{
                                      background: "#8b5cf6",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      color: "white",
                                      padding: "8px 12px",
                                      borderRadius: "5px",
                                      border: "none",
                                      cursor: "pointer",
                                      fontSize: "0.9rem",
                                    }}
                                    onClick={() => {
                                      setOpenDropdownIndex(
                                        openDropdownIndex === i ? null : i
                                      );
                                    }}
                                    title="Generate Boilerplate Code"
                                  >
                                    <FaMagic /> Generate{" "}
                                    <FaChevronDown size={10} />
                                  </button>
                                  {openDropdownIndex === i && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        top: "110%",
                                        left: 0,
                                        backgroundColor:
                                          "rgba(255, 255, 255, 0.95)",
                                        backdropFilter: "blur(10px)",
                                        border:
                                          "1px solid rgba(255, 255, 255, 0.5)",
                                        borderRadius: "8px",
                                        zIndex: 1000,
                                        display: "flex",
                                        flexDirection: "column",
                                        minWidth: "180px",
                                        boxShadow:
                                          "0 10px 40px rgba(0,0,0,0.1)",
                                        padding: "8px",
                                      }}
                                    >
                                      <button
                                        onClick={() =>
                                          handleGenerateCode("constructor", i)
                                        }
                                        style={{
                                          textAlign: "left",
                                          padding: "8px",
                                          border: "none",
                                          background: "transparent",
                                          cursor: "pointer",
                                          display: "block",
                                          width: "100%",
                                        }}
                                      >
                                        Constructor
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleGenerateCode("getters", i)
                                        }
                                        style={{
                                          textAlign: "left",
                                          padding: "8px",
                                          border: "none",
                                          background: "transparent",
                                          cursor: "pointer",
                                          display: "block",
                                          width: "100%",
                                        }}
                                      >
                                        Getters
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleGenerateCode("setters", i)
                                        }
                                        style={{
                                          textAlign: "left",
                                          padding: "8px",
                                          border: "none",
                                          background: "transparent",
                                          cursor: "pointer",
                                          display: "block",
                                          width: "100%",
                                        }}
                                      >
                                        Setters
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleGenerateCode("tostring", i)
                                        }
                                        style={{
                                          textAlign: "left",
                                          padding: "8px",
                                          border: "none",
                                          background: "transparent",
                                          cursor: "pointer",
                                          display: "block",
                                          width: "100%",
                                        }}
                                      >
                                        toString()
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleGenerateCode(
                                            "hashcode-equals",
                                            i
                                          )
                                        }
                                        style={{
                                          textAlign: "left",
                                          padding: "8px",
                                          border: "none",
                                          background: "transparent",
                                          cursor: "pointer",
                                          display: "block",
                                          width: "100%",
                                        }}
                                      >
                                        HashCode & Equals
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Ace Editor for Judge0 */}
                              <div
                                style={{
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                  marginBottom: "15px",
                                }}
                              >
                                <AceEditor
                                  mode={techConfig.aceMode || "text"}
                                  theme="monokai"
                                  name={`exam-editor-${i}`}
                                  onLoad={(editor) =>
                                    handleEditorLoad(editor, i)
                                  }
                                  onChange={(val) =>
                                    handleChange(`code-${i}`, val)
                                  }
                                  value={
                                    answers[`code-${i}`] ||
                                    techConfig.boilerplate
                                  }
                                  fontSize={16}
                                  width="100%"
                                  height="400px"
                                  showPrintMargin={false}
                                  showGutter={true}
                                  highlightActiveLine={true}
                                  setOptions={{
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: true,
                                    showLineNumbers: true,
                                    tabSize: 4,
                                  }}
                                />
                              </div>

                              <div className="coding-controls-area">
                                <div className="action-buttons">
                                  <button
                                    className="run-button secondary"
                                    onClick={() =>
                                      handleRunCode(
                                        i,
                                        answers[`code-${i}`],
                                        "run"
                                      )
                                    }
                                    disabled={runningQuestionId === i}
                                  >
                                    {runningQuestionId === i
                                      ? "Running..."
                                      : "Run Code"}
                                  </button>
                                  <button
                                    className="run-button primary"
                                    onClick={() =>
                                      handleRunCode(
                                        i,
                                        answers[`code-${i}`],
                                        "evaluate"
                                      )
                                    }
                                    disabled={runningQuestionId === i}
                                  >
                                    {runningQuestionId === i
                                      ? "Evaluating..."
                                      : "Submit & Evaluate"}
                                  </button>
                                </div>
                              </div>

                              {/* Display Run Results (Debug) */}
                              {runResults[i] && !codeResults[i]?.evaluated && (
                                <div className="run-output-display">
                                  <h4>Run Output:</h4>
                                  {runResults[i].compileError ? (
                                    <pre className="error-text">
                                      {runResults[i].compileError}
                                    </pre>
                                  ) : (
                                    <pre>
                                      {runResults[i].output || "(No output)"}
                                    </pre>
                                  )}
                                </div>
                              )}

                              {/* Display Evaluation Results (Grading) */}
                              {codeResults[i] && (
                                <div className="testcases">
                                  {codeResults[i].compileError ? (
                                    <div className="output-error">
                                      <h4>Error</h4>
                                      <pre>{codeResults[i].compileError}</pre>
                                    </div>
                                  ) : (
                                    <div className="output-success">
                                      <h4>Evaluation Output:</h4>
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
                                  {/* Ace Editor for Codepad */}
                                  <AceEditor
                                    mode={techConfig.aceMode || "html"}
                                    theme="monokai"
                                    name={`codepad-editor-${i}`}
                                    onLoad={(editor) =>
                                      handleEditorLoad(editor, i)
                                    }
                                    onChange={(val) =>
                                      handleChange(`code-${i}`, val)
                                    }
                                    value={
                                      answers[`code-${i}`] ||
                                      techConfig.boilerplate
                                    }
                                    fontSize={14}
                                    width="100%"
                                    height="300px"
                                    showPrintMargin={false}
                                    setOptions={{
                                      enableBasicAutocompletion: true,
                                      enableLiveAutocompletion: true,
                                      enableSnippets: true,
                                    }}
                                  />
                                </div>
                                <div className="codepad-preview">
                                  <BrowserPreview
                                    htmlCode={createPreviewContent(
                                      answers[`code-${i}`] ||
                                        techConfig.boilerplate,
                                      techConfig.language
                                    )}
                                  />
                                </div>
                              </div>

                              <span>Note: To Get Marks Run & Evaluate</span>
                              <br></br>
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
                      );
                    })}
                </div>
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
                <p className="grand-total">
                  Grand Total:{" "}
                  <span>
                    {totals.mcq + totals.blanks + totals.coding} /{" "}
                    {maxTotalMarksDisplay}
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
    </>
  );
};

export default Exam;
