import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import SEO from "./SEO";
import { useParams, useNavigate } from "react-router-dom";
import AceEditor from "react-ace"; // Added Ace
import ace from "ace-builds"; // Added Ace Core
import {
  FaExclamationTriangle,
  FaMagic,
  FaChevronDown,
  FaPlay,
  FaRedo,
  FaPlus,
  FaMinus,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import "../css/Exam.css";
import BrowserPreview from "./BrowserPreview";
import ExamResult from "./ExamResult";
import QuestionPalette from "./QuestionPalette";

// Utilities
import javaSnippets from "../utils/javaSnippets";
import alasql from "alasql"; // Added Alasql
import {
  sqlSnippets,
  runSqlCode,
  populateDbFromHtml,
  verifySqlSolution,
} from "../utils/sqllogic";
import { generateJavaCode } from "../utils/javaCodeGenerator";
import { runJavaCode } from "../utils/javalogic"; // Added
import { runPythonCode } from "../utils/pythonlogic"; // Added
import { runJavascriptCode } from "../utils/javascriptlogic"; // Added
import {
  analyzeInputPrompts,
  checkForInput,
  checkKeywords,
} from "../utils/codeAnalysis";

import {
  languageConfig,
  examCodeMap,
  getExamConfig,
  getExamDuration,
} from "../utils/examConfig";

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

const examsFiles = import.meta.glob("../exams/**/*.json", { eager: true });

// Define Toast Mixin
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

// --- HELPER FUNCTION: Calculate marks based on Levenshtein distance & Keyword Analysis ---
const calculateAccuracyMarks = (
  expectedOutput,
  actualOutput,
  maxMarks,
  code = "",
  expectedKeywords = []
) => {
  // 1. Output Accuracy
  let outputScore = 0;
  if (expectedOutput && actualOutput) {
    try {
      // --- DOM-BASED NORMALIZATION ---
      const getNormalizedBody = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html || "", "text/html");

        const normalizeNode = (node) => {
          // Bottom-up traversal
          Array.from(node.childNodes).forEach(normalizeNode);

          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.replace(/\s+/g, " ").trim();
            if (text) node.textContent = text;
            else node.remove(); // Remove empty text nodes
          } else if (node.nodeType === Node.COMMENT_NODE) {
            node.remove();
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            let tagName = node.tagName.toLowerCase();

            // Remove purely visual/spacing tags to flatten structure (fixes <br> vs <div> layout diffs)
            if (tagName === "br" || tagName === "hr") {
              node.remove();
              return;
            }

            // Unwrap cosmetic/layout containers to ignore layout implementation details
            // Note: We keep <p> because some questions explicitly ask for paragraphs.
            const containersToUnwrap = [
              "div",
              "span",
              "center",
              "section",
              "article",
              "main",
              "header",
              "footer",
            ];
            if (containersToUnwrap.includes(tagName)) {
              while (node.firstChild) {
                node.parentNode.insertBefore(node.firstChild, node);
              }
              node.remove();
              return;
            }

            // Unwrap <label>: strict checks usually don't care about labels in this context
            if (tagName === "label") {
              while (node.firstChild) {
                node.parentNode.insertBefore(node.firstChild, node);
              }
              node.remove();
              return;
            }

            // Normalize <strong> -> <b>, <em> -> <i>
            if (tagName === "strong" || tagName === "em") {
              const newTag = document.createElement(
                tagName === "strong" ? "b" : "i"
              );
              while (node.firstChild) newTag.appendChild(node.firstChild);
              Array.from(node.attributes).forEach((a) =>
                newTag.setAttribute(a.name, a.value)
              );
              node.parentNode.replaceChild(newTag, node);
              node = newTag;
              tagName = node.tagName.toLowerCase();
            }

            // Normalize <input type="submit"|"reset"|"button"> -> <button>
            const inputType = node.getAttribute("type");
            if (
              tagName === "input" &&
              ["submit", "reset", "button"].includes(inputType)
            ) {
              const btn = document.createElement("button");
              // specific value or fallback to capitalized type
              const defaultText =
                inputType.charAt(0).toUpperCase() + inputType.slice(1);
              btn.textContent = node.getAttribute("value") || defaultText;

              // Keep type for reset/button, strip for submit (default)
              if (inputType !== "submit") {
                btn.setAttribute("type", inputType);
              }

              node.parentNode.replaceChild(btn, node);
              node = btn;
              tagName = "button";
            }
            // Normalize <button>: Strip type="submit" (default) to match converted inputs
            if (
              tagName === "button" &&
              node.getAttribute("type") === "submit"
            ) {
              node.removeAttribute("type");
            }

            // Normalize <option value>

            if (tagName === "option" && !node.hasAttribute("value")) {
              node.setAttribute("value", node.textContent.trim());
            }

            // Strip non-visual & validation attributes
            const attrsToRemove = [
              "id",
              "name",
              "class",
              "style",
              "title",
              "alt",
              "placeholder",
              "action",
              "method",
              "enctype",
              "target",
              "rel",
              "for",
              "autocomplete",
              "autofocus",
              "rows",
              "cols",
              "spellcheck",
              "tabindex",
              "role",
              "required",
              "checked",
              "selected",
              "disabled",
              "readonly",
              "multiple",
              "min",
              "max",
              "step",
              "pattern",
              "list",
              "size",
              "maxlength",
              "minlength",
            ];
            attrsToRemove.forEach((attr) => node.removeAttribute(attr));

            // Default input type="text"
            if (tagName === "input" && !node.hasAttribute("type")) {
              node.setAttribute("type", "text");
            }

            // Remove empty 'value' attributes and standardizing
            if (node.hasAttribute("value") && !node.getAttribute("value")) {
              node.removeAttribute("value");
            }
          }
        };

        normalizeNode(doc.body);
        return doc.body;
      };

      const expectedBody = getNormalizedBody(expectedOutput);
      const actualBody = getNormalizedBody(actualOutput);

      // 1. Exact Structural Match (Attributes order ignored by isEqualNode)
      if (expectedBody && actualBody && expectedBody.isEqualNode(actualBody)) {
        return maxMarks;
      }

      // 2. Fallback: Normalized String Comparison
      // We use the normalized HTML string from the DOM
      const s1 = expectedBody ? expectedBody.innerHTML : expectedOutput;
      const s2 = actualBody ? actualBody.innerHTML : actualOutput;

      // Remove all whitespaces for a very loose check if structure failed
      const cleanS1 = s1.replace(/\s+/g, "").toLowerCase();
      const cleanS2 = s2.replace(/\s+/g, "").toLowerCase();

      if (cleanS1 === cleanS2) return maxMarks;

      // Levenshtein Distance
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

      const maxLength = Math.max(cleanS1.length, cleanS2.length);
      const distance = levenshteinDistance(cleanS1, cleanS2);
      const similarity =
        maxLength === 0 ? 1 : (maxLength - distance) / maxLength;

      // High similarity threshold
      if (similarity > 0.9) return maxMarks;

      outputScore = Math.max(0, similarity);
    } catch (e) {
      console.error("Scoring Error:", e);
      // Fallback to original simple string match if DOM fails
      const s1 = expectedOutput.replace(/\s+/g, "").toLowerCase();
      const s2 = actualOutput.replace(/\s+/g, "").toLowerCase();
      if (s1 === s2) return maxMarks;
    }
  }

  // 2. Keyword Accuracy (Backup if output is not perfect)
  let keywordScore = 0;
  const hasKeywords = expectedKeywords && expectedKeywords.length > 0;

  if (hasKeywords) {
    const { score } = checkKeywords(code, expectedKeywords);
    keywordScore = score / 100;
  }

  // Calculate Weighted Total
  let finalRatio = 0;
  if (hasKeywords) {
    finalRatio = outputScore * 0.6 + keywordScore * 0.4;
  } else {
    finalRatio = outputScore;
  }

  return Math.round(finalRatio * maxMarks);
};

const getQuestionDetailsFromGlobalIndex = (
  globalIndex,
  quiz,
  blanks,
  coding,
  pseudo
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
  const pseudoStart = blankStart + blanks.length;
  if (globalIndex < pseudoStart + pseudo.length) {
    return {
      page: 3,
      index: globalIndex - pseudoStart,
      question: pseudo[globalIndex - pseudoStart],
    };
  }
  const codingStart = pseudoStart + pseudo.length;
  if (globalIndex < codingStart + coding.length) {
    return {
      page: 4,
      index: globalIndex - codingStart,
      question: coding[globalIndex - codingStart],
    };
  }
  return { page: 1, index: 0, question: quiz[0] };
};

// --- END: Question Palette Component (Moved to QuestionPalette.js) ---

const Exam = () => {
  const { technology, examId } = useParams();
  const ExamConfig = useMemo(
    () => getExamConfig(technology, examId),
    [technology, examId]
  );

  // Logic for SEO Title
  // const seoTitle = `${
  //   technology
  //     ? technology.charAt(0).toUpperCase() + technology.slice(1)
  //     : "Tech"
  // } Exam ${examId}`;
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState([]);
  const [selectedBlanks, setSelectedBlanks] = useState([]);
  const [selectedCoding, setSelectedCoding] = useState([]);
  const [selectedPseudo, setSelectedPseudo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [blankResults, setBlankResults] = useState({});
  const [codeResults, setCodeResults] = useState({});
  const [pseudoResults, setPseudoResults] = useState({});
  const [totals, setTotals] = useState({
    mcq: 0,
    blanks: 0,
    coding: 0,
    pseudo: 0,
  });
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [malpracticeDetected, setMalpracticeDetected] = useState(false);

  // New State for Refined Coding Round
  const [customInputs, setCustomInputs] = useState({});
  const [runResults, setRunResults] = useState({}); // For "Run Code" (Debug) output
  const [runningQuestionId, setRunningQuestionId] = useState(null); // Track which question is running

  // Sequential Input State
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [detectedPrompts, setDetectedPrompts] = useState([]);
  const [promptValues, setPromptValues] = useState({});
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuestionInView, setCurrentQuestionInView] = useState(0);

  const [timeLeft, setTimeLeft] = useState(getExamDuration(technology, examId));
  const [timerActive, setTimerActive] = useState(true);
  const [showTwoMinuteModal, setShowTwoMinuteModal] = useState(false);

  // Code Generation State
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const editorRefs = useRef({});
  const [activeCodeQuestionIndex, setActiveCodeQuestionIndex] = useState(null);

  // Editor styling state
  const [fontSize, setFontSize] = useState(16);
  const [editorTheme, setEditorTheme] = useState("monokai");

  const [isExamStarted, setIsExamStarted] = useState(false);

  const sqlDbRef = useRef(null);
  const generateDropdownRef = useRef(null);

  const handleStartExam = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      setIsExamStarted(true);
    } catch (err) {
      console.warn("Fullscreen request denied:", err);
      // Still start the exam even if fullscreen is denied
      setIsExamStarted(true);
    }
  };

  const techConfig = languageConfig[technology] || languageConfig.default;
  const isCodingRoundAvailable = useMemo(
    () => techConfig.type === "piston" || techConfig.type === "codepad",
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
    const totalPseudo = selectedPseudo.length;
    const totalCount = totalMCQ + totalBlank + totalCoding + totalPseudo;

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
              selectedCoding,
              selectedPseudo
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
        rootMargin: "-10% 0px -50% 0px",
        threshold: 0,
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
  }, [
    selectedQuiz,
    selectedBlanks,
    selectedCoding,
    selectedPseudo,
    showResult,
    isLoading,
  ]);

  const calculateAnswerStatus = useCallback(
    (section, index) => {
      let key;
      if (section === 1) key = `quiz-${index}`;
      else if (section === 2) key = `blank-${index}`;
      else if (section === 3) key = `pseudo-${index}`;
      else if (section === 4) key = `code-${index}`;

      const isAnswered = answers[key] && String(answers[key]).trim() !== "";

      let globalIndex = 0;
      if (section === 1) globalIndex = index;
      if (section === 2) globalIndex = selectedQuiz.length + index;
      if (section === 3)
        // Pseudo
        globalIndex = selectedQuiz.length + selectedBlanks.length + index;
      if (section === 4)
        // Coding
        globalIndex =
          selectedQuiz.length +
          selectedBlanks.length +
          selectedPseudo.length +
          index;

      // const isCurrentInView = globalIndex === currentQuestionInView;

      // if (isCurrentInView) return "current-in-view";
      if (isAnswered) return "answered";
    },
    [
      answers,
      // currentQuestionInView,
      selectedQuiz,
      selectedBlanks,
      selectedCoding,
      selectedPseudo,
    ]
  );

  useEffect(() => {
    // Fisher-Yates Shuffle
    const shuffleArray = (array) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
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

        // --- UPDATED: Retrieve from import.meta.glob (examsFiles) ---
        const loadSafe = (fileSuffix) => {
          // Construct the path key to look up in the glob object
          // Note relative path logic used in glob: ../exams/**/*.json
          // We need: ../exams/${technology}/${examId}${fileSuffix}.json
          const key = `../exams/${technology}/${examId}${fileSuffix}.json`;
          return examsFiles[key] ? examsFiles[key] : []; // If file module exists, return it (assuming it exports array directly, or check default)
        };

        // Helper to extract data from module (Vite glob imports return module object)
        const getData = (module) => {
          if (Array.isArray(module)) return module;
          if (module && Array.isArray(module.default)) return module.default;
          // If 'eager: true' used, examsFiles[key] is the module itself
          return [];
        };

        // Load MCQ
        const quizData = getData(loadSafe("MCQ"));
        let shuffledMCQ = shuffleArray(quizData).slice(0, ExamConfig.mcqCount);
        shuffledMCQ = shuffleAnswers(shuffledMCQ);

        // Load Blanks
        const blanksData = getData(loadSafe("Blanks"));
        const shuffledBlanks = shuffleArray(blanksData).slice(
          0,
          ExamConfig.blankCount
        );

        // Load Coding
        let shuffledCoding = [];
        if (isCodingRoundAvailable) {
          const codingData = getData(loadSafe("Coding"));
          shuffledCoding = shuffleArray(codingData).slice(
            0,
            ExamConfig.codingCount
          );
        }

        // Load Pseudo
        const pseudoData = getData(loadSafe("Psuedo"));
        let shuffledPseudo = shuffleArray(pseudoData).slice(
          0,
          ExamConfig.pseudoCount
        );
        shuffledPseudo = shuffleAnswers(shuffledPseudo);

        if (
          shuffledMCQ.length === 0 &&
          shuffledBlanks.length === 0 &&
          shuffledCoding.length === 0 &&
          shuffledPseudo.length === 0
        ) {
          setError(
            `Could not find any questions for "${technology} - ${examId}".`
          );
        } else {
          setSelectedQuiz(shuffledMCQ);
          setSelectedBlanks(shuffledBlanks);
          setSelectedCoding(shuffledCoding);
          setSelectedPseudo(shuffledPseudo);
          setCurrentQuestionInView(0);
        }
      } catch (err) {
        console.error(err);
        setError(`Error loading questions: ${err.message}`);
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

        // --- Context Aware Logic for Dot (.) ---
        const line = session.getLine(pos.row);
        const lineUpToCursor = line.slice(0, pos.column);
        const isDotTrigger = lineUpToCursor.trimEnd().endsWith(".");

        // If trigger is dot, ignore prefix length check, OR if regular typing check prefix
        if (!isDotTrigger && prefix.length === 0) {
          callback(null, []);
          return;
        }

        let filteredSnippets = snippetsToUse;

        // If triggered by dot, ONLY show snippets starting with "." (methods)
        if (isDotTrigger && mode.endsWith("/java")) {
          filteredSnippets = snippetsToUse.filter((s) =>
            s.snippet.startsWith(".")
          );
        }

        // Return our snippets with high score
        callback(
          null,
          filteredSnippets.map((s) => {
            // If dot trigger, we need to STRIP the leading dot from snippet to avoid double dot
            let finalSnippet = s.snippet;
            let displayCaption = s.caption;

            if (isDotTrigger && finalSnippet.startsWith(".")) {
              finalSnippet = finalSnippet.substring(1); // Remove leading dot
            }

            return {
              caption: displayCaption,
              snippet: finalSnippet,
              type: "snippet",
              meta: s.customImport
                ? "Auto-Import"
                : isDotTrigger
                ? "Method"
                : "Snippet",
              customImport: s.customImport, // Very high score to appear first
              score: 1000000 + (isDotTrigger ? 1000 : 0),
              completer: customCompleter, // Self reference
            };
          })
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
      Toast.fire({
        icon: "success",
        title: "Code Generated!",
      });
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
              q.maxMarks
            );
            codingTotal += marks;
          } else {
            codingTotal += codeResults[i]?.marks || 0;
          }
        });
      }

      let pseudoTotal = 0;
      const pRes = {};
      selectedPseudo.forEach((q, i) => {
        const correct = answers[`pseudo-${i}`] === q.answer;
        pRes[i] = { correct, chosen: answers[`pseudo-${i}`] || "" };
        pseudoTotal += correct ? ExamConfig.pseudoMarks : 0;
      });
      setPseudoResults(pRes);

      setTotals({
        mcq: mcqTotal,
        blanks: blanksTotal,
        coding: codingTotal,
        pseudo: pseudoTotal,
      });

      try {
        const token = localStorage.getItem("token");
        const userEmail = localStorage.getItem("userEmail");

        if (!token || !userEmail)
          throw new Error("Authentication details not found.");

        const totalPossibleMCQ = selectedQuiz.length * ExamConfig.mcqMarks;
        const totalPossibleBlanks =
          selectedBlanks.length * ExamConfig.blankMarks;
        const totalPossibleCoding = isCodingRoundAvailable
          ? selectedCoding.reduce((sum, q) => sum + (q.maxMarks || 0), 0)
          : 0;

        const totalPossiblePseudo =
          selectedPseudo.length * ExamConfig.pseudoMarks;

        const maxTotalMarks =
          totalPossibleMCQ +
          totalPossibleBlanks +
          totalPossibleCoding +
          totalPossiblePseudo;

        const examKey = `${technology}-${examId}`;
        const examCode = examCodeMap[examKey];
        if (!examCode) throw new Error("Invalid exam identifier.");

        const payload = {
          email: userEmail,
          examCode: examCode,
          mcqMarks: mcqTotal,
          fillMarks: blanksTotal,
          codingMarks: codingTotal,
          pseudoMarks: pseudoTotal,
          totalMarksPossible: maxTotalMarks,
        };

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        // --- OPTIMISTIC SUBMISSION ---
        // 1. Immediately show results (Don't wait for Email/DB)
        setIsSubmitting(false);
        setShowResult(true);

        // 2. Perform Save in Background
        (async () => {
          try {
            await axios.post("/api/exams", payload, authHeaders);
          } catch (error) {
            // Retry with PATCH if it already exists
            if (
              error.response &&
              error.response.status === 400 &&
              error.response.data.message.includes("already exists")
            ) {
              try {
                await axios.patch("/api/exams", payload, authHeaders);
              } catch (patchError) {
                console.error("Background Save Failed (Patch):", patchError);
                Swal.fire(
                  "Warning",
                  "Your result was displayed, but we couldn't save it to the server.",
                  "error"
                );
              }
            } else {
              console.error("Background Save Failed (Post):", error);
              Swal.fire(
                "Warning",
                "Your result was displayed, but we couldn't save it to the server.",
                "error"
              );
            }
          }
        })();
      } catch (error) {
        console.error("Submission Prep Failed:", error);
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: error.message,
        });
        setIsSubmitting(false);
        // Do not show result if prep failed
      }
    },
    [
      answers,
      codeResults,
      isCodingRoundAvailable,
      techConfig.type,
      selectedBlanks,
      selectedCoding,
      selectedPseudo,
      selectedQuiz,
      technology,
      examId,
    ]
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !showResult && timerActive && isExamStarted) {
        submitExam(true, true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [showResult, timerActive, submitExam, isExamStarted]);

  // --- HELPER FUNCTION: Run code using Piston API (Refactored) ---
  const executeCode = async (userCode, customInput, language) => {
    const langMap = {
      java: "java",
      python: "python",
      javascript: "javascript",
      sql: "sql",
    };

    // Special handling for SQL (Global Execution Logic)
    if (language === "sql") {
      try {
        // Initialize DB locally for Exam session if not exists
        if (!sqlDbRef.current) {
          // const alasql = require("alasql"); // Removed
          sqlDbRef.current = new alasql.Database();
          sqlDbRef.current.exec("CREATE DATABASE IF NOT EXISTS myDB; USE myDB");
        }

        // --- Auto-Populate Logic ---
        // ... (lines skipped are identical, I will focus on the replacement block efficiency)
        // Actually, strict replacement requires matching context.
        // I will target the specific blocks to be safe.

        // --- Auto-Populate Logic ---
        // If user code does NOT contain CREATE or INSERT, try to populate from Sample Input (HTML)
        const hasDDL = /CREATE\s+TABLE/i.test(userCode);
        const hasDML = /INSERT\s+INTO/i.test(userCode);

        if (!hasDDL && !hasDML) {
          populateDbFromHtml(sqlDbRef.current, customInput);
        }

        const { messages, error } = runSqlCode(sqlDbRef.current, userCode);

        // Format output for Exam display (String Log)
        const outputLog = messages
          .map((m) => {
            if (m.type === "table") {
              if (!m.data || m.data.values.length === 0)
                return "Query returned no results.";
              const header = m.data.columns.join(" | ");
              const separator = "-".repeat(header.length);
              const rows = m.data.values
                .map((row) =>
                  row.map((v) => (v === null ? "NULL" : v)).join(" | ")
                )
                .join("\n");
              return `${header}\n${separator}\n${rows}`;
            }
            return m.text;
          })
          .join("\n\n");

        // Format output for HTML Preview (Table)
        const htmlLog = messages
          .map((m) => {
            if (m.type === "table") {
              if (!m.data || m.data.values.length === 0)
                return '<div class="sql-msg info">Query returned no results.</div>';

              const headers = m.data.columns
                .map((c) => `<th>${c}</th>`)
                .join("");

              const rows = m.data.values
                .map((row) => {
                  const cells = row
                    .map((v) => `<td>${v === null ? "NULL" : v}</td>`)
                    .join("");
                  return `<tr>${cells}</tr>`;
                })
                .join("");

              return `<table class="sql-result-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
            }
            return `<div class="sql-msg ${m.type}">${m.text}</div>`;
          })
          .join("");

        // Format output for GRADING (Tables Only, No Status Messages)
        const gradingLog = messages
          .filter((m) => m.type === "table")
          .map((m) => {
            if (!m.data || m.data.values.length === 0) return "";
            const header = m.data.columns.join(" | ");
            const separator = "-".repeat(header.length);
            const rows = m.data.values
              .map((row) =>
                row.map((v) => (v === null ? "NULL" : v)).join(" | ")
              )
              .join("\n");
            return `${header}\n${separator}\n${rows}`;
          })
          .join("\n\n");

        return {
          compileError: error,
          output: outputLog,
          htmlOutput: htmlLog,
          gradingOutput: gradingLog,
          sqlMessages: messages,
        };
      } catch (err) {
        return {
          compileError: err.message,
          output: "",
          htmlOutput: "",
          gradingOutput: "",
          sqlMessages: [],
        };
      }
    }

    const apiLang = langMap[language] || language;

    // 1. Check for Extracted Logic (Java, Python, JS)
    if (["java", "python", "javascript"].includes(apiLang)) {
      let result = { output: "", compileError: null, isError: false };

      if (apiLang === "java") {
        const r = await runJavaCode(userCode, customInput);
        result.output = r.output;
        result.isError = r.isError;
        if (r.isError) result.compileError = r.error;
      } else if (apiLang === "python") {
        const r = await runPythonCode(userCode, customInput);
        result.output = r.output;
        result.isError = r.isError;
        if (r.isError) result.compileError = r.error;
      } else if (apiLang === "javascript") {
        const r = await runJavascriptCode(userCode, customInput);
        result.output = r.output;
        result.isError = r.isError;
        if (r.isError) result.compileError = r.error;
      }

      return {
        compileError: result.isError
          ? result.compileError || result.output
          : null,
        output: result.output || "",
      };
    }

    // 2. Fallback Piston Logic (for others)
    try {
      let codeToExecute = userCode;
      let fileName = "Main.java"; // Default

      // Java Fallback (removed since extracted)

      const fileData = { content: codeToExecute };

      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: apiLang,
          version: "*",
          files: [fileData],
          stdin: customInput || "",
        }),
      });
      const data = await response.json();

      if (data.run && data.run.code !== 0) {
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

    // Checks executed every second because of the setTimeout dependency chain below
    const totalDuration = getExamDuration(technology, examId); // Assuming we can get max time, but here we just check remaining.

    // 30-Minute Warning (Every 30 mins remaining, e.g. 90 mins, 60 mins, 30 mins)
    // Avoid spamming by checking exact second match.
    if (timeLeft > 0 && timeLeft % 1800 === 0 && timeLeft !== totalDuration) {
      Toast.fire({
        icon: "info",
        title: `${Math.floor(timeLeft / 60)} Minutes Remaining`,
      });
    }

    if (timeLeft === 120) {
      setShowTwoMinuteModal(true);
    }

    // 5-Minute Warning Toast
    if (timeLeft === 300) {
      Toast.fire({
        icon: "warning",
        title: "5 Minutes Remaining!",
      });
    }

    if (timeLeft <= 0) {
      submitExam(true); // Auto-submit
      return;
    }

    // Use setTimeout to create a countdown loop that respects new values of `timeLeft`
    const timerId = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, timerActive, isLoading, submitExam, technology, examId]);

  // --- NAVIGATION BLOCKER ---
  const isBlocking = timerActive && !isLoading && timeLeft > 0;

  // 1. Browser Level (Tab Close/Refresh)

  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     if (isBlocking) {
  //       e.preventDefault();
  //       e.returnValue = "";
  //     }
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  // }, [isBlocking]);

  const handleChange = (qKey, value) =>
    setAnswers((prev) => ({ ...prev, [qKey]: value }));
  const formatTime = () =>
    `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(
      timeLeft % 60
    ).padStart(2, "0")}`;

  const handleRunCode = async (
    i,
    code,
    mode = "run",
    inputsOverride = null
  ) => {
    if (!code) return;

    // 1. Check for Prompts (Only in 'run' mode and if not already provided)
    if (mode === "run" && !inputsOverride && techConfig.language === "java") {
      const prompts = analyzeInputPrompts(code, techConfig.language);
      if (prompts.length > 0) {
        setDetectedPrompts(prompts);
        setPromptValues({});
        setCurrentPromptIndex(0);
        setIsWaitingForInput(true);
        setRunningQuestionId(i);
        return;
      }

      // Fallback: Generic Input Check
      if (checkForInput(code, techConfig.language)) {
        setDetectedPrompts(["Input:"]); // Generic prompt to trigger UI
        setIsWaitingForInput(true);
        setRunningQuestionId(i);
        // setOutput("Program requires input. Please enter values..."); // Maybe logic handled in UI?
        return;
      }
    }

    setRunningQuestionId(i);

    // Determine input: Use Override (from Wizard) OR Custom Input OR Sample Input
    const inputToUse = inputsOverride
      ? inputsOverride
      : mode === "run" && customInputs[i] // if custom input is present
      ? customInputs[i]
      : selectedCoding[i].sampleInput || ""; // default to sample input

    // Check for selection
    let codeToRun = code;
    if (editorRefs.current[i]) {
      const selectedText = editorRefs.current[i].getSelectedText();
      if (selectedText && selectedText.trim().length > 0) {
        codeToRun = selectedText;
      }
    }

    const { compileError, output, htmlOutput, gradingOutput, sqlMessages } =
      await executeCode(codeToRun, inputToUse, techConfig.language);

    // Terminal Echo Injection
    let finalOutput = output;
    if (mode === "run" && inputsOverride && detectedPrompts.length > 0) {
      detectedPrompts.forEach((prompt, idx) => {
        const val = promptValues[idx] || "";
        if (finalOutput.includes(prompt)) {
          finalOutput = finalOutput.replace(prompt, prompt + " " + val + "\n");
        }
      });
    }

    if (mode === "run") {
      setRunResults((prev) => ({
        ...prev,
        [i]: { compileError, output: finalOutput, htmlOutput },
      }));

      // Update Marks Calculation for Immediate Feedback (Only if using Sample Input)
      const originalSample = selectedCoding[i].sampleInput || "";
      if (inputToUse === originalSample) {
        let marks = 0;
        if (!compileError) {
          // Special Grading Logic for SQL
          let expected = selectedCoding[i].sampleOutput;
          let actual = output;

          if (techConfig.language === "sql") {
            const verification = verifySqlSolution(
              sqlMessages,
              selectedCoding[i].answer,
              selectedCoding[i].sampleInput,
              selectedCoding[i].maxMarks
            );
            marks = verification.marks;
          } else {
            marks = calculateAccuracyMarks(
              expected,
              actual,
              selectedCoding[i].maxMarks,
              codeToRun,
              selectedCoding[i].expectedKeywords || []
            );
          }
        }
        setCodeResults((prev) => ({
          ...prev,
          [i]: { compileError, output, marks, evaluated: true },
        }));
      }
    } else {
      let marks = 0;
      if (!compileError) {
        // Special Grading Logic for SQL
        let expected = selectedCoding[i].sampleOutput;
        let actual = output;

        if (techConfig.language === "sql") {
          // Normalize Expected (Strip HTML tags & whitespace)
          expected = expected
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          // Normalize Actual (Strip table separators & extra whitespace)
          actual = actual
            .replace(/[|\-+]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        }

        marks = calculateAccuracyMarks(
          expected,
          actual,
          selectedCoding[i].maxMarks,
          codeToRun, // Pass code
          selectedCoding[i].expectedKeywords || [] // Pass expectedKeywords
        );
      }
      setCodeResults((prev) => ({
        ...prev,
        [i]: { compileError, output, htmlOutput, marks, evaluated: true },
      }));
    }

    setRunningQuestionId(null);
    setIsWaitingForInput(false);
    setDetectedPrompts([]);
    setCurrentPromptIndex(0);
  };

  const handleEvaluateCodePad = (index, code) => {
    const question = selectedCoding[index];
    const marks = calculateAccuracyMarks(
      question.answer,
      code,
      question.maxMarks,
      code, // Pass Code
      question.expectedKeywords || [] // Pass Keywords
    );
    setCodeResults((prev) => ({
      ...prev,
      [index]: { marks, evaluated: true },
    }));

    // Scroll to preview
    setTimeout(() => {
      const el = document.getElementById(`preview-container-${index}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
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
      : 0) +
    selectedPseudo.length * ExamConfig.pseudoMarks;

  return (
    <>
      <SEO
        title={
          showResult
            ? `Results: ${
                technology
                  ? technology.charAt(0).toUpperCase() + technology.slice(1)
                  : "Coding"
              } Exam #${examNumber}`
            : `${
                technology
                  ? technology.charAt(0).toUpperCase() + technology.slice(1)
                  : "Coding"
              } Exam #${examNumber} - CodePulse-R`
        }
        description={`Take the ${
          technology || "coding"
        } exam #${examNumber} to test your programming skills.`}
        keywords={`${technology} exam, coding test, programming certification, codepulse-r`}
      />
      {/* Start Exam Overlay */}
      {!isLoading && !showResult && !isExamStarted && (
        <div className="exam-start-overlay">
          <div className="start-card">
            <h2>Welcome to the {technology.toUpperCase()} Exam</h2>
            <p>
              <strong>Instructions:</strong>
            </p>
            <ul style={{ textAlign: "left", marginBottom: "2rem" }}>
              <li>
                The exam will be conducted in <strong>Full Screen Mode</strong>.
              </li>
              <li>Do not try to exit full screen or switch tabs.</li>
              <li>Ensure you have a stable internet connection.</li>
            </ul>
            <button className="start-action-btn" onClick={handleStartExam}>
              Start My Exam
            </button>
          </div>
        </div>
      )}

      {/* Top Fixed Bar Container (Header + Palette) */}
      {!showResult && (
        <div
          className={`top-fixed-bar ${!isExamStarted ? "blur-content" : ""}`}
        >
          {/* 1. Exam Name, Timer, Submit Button */}
          <div className="exam-header">
            <h1>
              {technology.charAt(0).toUpperCase() + technology.slice(1)} Exam #
              {examNumber}
            </h1>

            {/* 2. Question Palette (Moved to Header) */}
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                minWidth: 0,
              }}
            >
              <QuestionPalette
                quiz={selectedQuiz}
                blanks={selectedBlanks}
                coding={selectedCoding}
                pseudo={selectedPseudo}
                handleQuestionJump={handleQuestionJump}
                isCodingRoundAvailable={isCodingRoundAvailable}
                calculateAnswerStatus={calculateAnswerStatus}
                currentQuestionInView={currentQuestionInView}
                currentPage={currentPage}
              />
            </div>

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
        </div>
      )}

      {/* Main Content Area */}
      <div className={`page-container ${!isExamStarted ? "blur-content" : ""}`}>
        <div
          className={`exam-container ${currentPage === 4 ? "coding-mode" : ""}`}
        >
          {/* Header for Result Page only */}
          {/* {showResult && (
            <div className="exam-header">
              <h1>
                {technology.charAt(0).toUpperCase() + technology.slice(1)} Exam
                #{examNumber}
              </h1>
            </div>
          )} */}

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
                      Pseudo Code
                    </button>
                  )}
                  <button
                    className={currentPage === 4 ? "active" : ""}
                    onClick={() => setCurrentPage(4)}
                  >
                    Coding
                  </button>
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
                        <p
                          className="question-title"
                          dangerouslySetInnerHTML={{
                            __html: `<strong>${i + 1}. </strong> ${q.question}`,
                          }}
                        ></p>
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
                            {/* Render question parts with HTML safety */}
                            <strong>{i + 1}. </strong>
                            {parts.map((part, idx) => (
                              <React.Fragment key={idx}>
                                <span
                                  dangerouslySetInnerHTML={{ __html: part }}
                                />
                                {idx < parts.length - 1 && (
                                  <input
                                    type="text"
                                    className="inline-blank-input"
                                    value={answers[inputKey] || ""}
                                    onChange={(e) =>
                                      handleChange(inputKey, e.target.value)
                                    }
                                    onFocus={() =>
                                      setCurrentQuestionInView(globalIndex)
                                    }
                                  />
                                )}
                              </React.Fragment>
                            ))}
                          </p>
                        </div>
                      );
                    })}

                  {/* --- SECTION 3: PSEUDO CODE --- */}
                  {currentPage === 3 &&
                    selectedPseudo.map((q, i) => {
                      return (
                        <div
                          key={`pseudo-${i}`}
                          id={`question-${i}`}
                          className="question-block"
                        >
                          <div className="main-code-block-wrapper">
                            <pre className="code-block1">
                              <p className="question-title">
                                {i + 1}. What will be the output of the
                                following code?
                              </p>
                              <code>{q.question}</code>
                            </pre>
                          </div>
                          <div className="options-group">
                            {q.options.map((opt, optIndex) => (
                              <label key={opt} className="option-label">
                                <input
                                  type="radio"
                                  name={`pseudo-${i}`}
                                  value={opt}
                                  checked={answers[`pseudo-${i}`] === opt}
                                  onChange={(e) =>
                                    handleChange(`pseudo-${i}`, e.target.value)
                                  }
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                  {/* --- SECTION 4: CODING QUESTIONS --- */}
                  {isCodingRoundAvailable && currentPage === 4 && (
                    <>
                      {selectedCoding.map((q, i) => {
                        return (
                          <div
                            key={`code-${i}`}
                            id={`question-${i}`}
                            className="question-block coding-block coding-split-container"
                            data-task-label={`Task - ${i + 1}`}
                          >
                            {/* LEFT PANEL */}
                            <div className="coding-left-panel">
                              <p
                                className="question-title2 coding-question-title"
                                dangerouslySetInnerHTML={{
                                  __html: `<strong>${i + 1}.</strong> ${
                                    q.question
                                  }`,
                                }}
                              />

                              <div className="sample-box coding-sample-box">
                                <div className="coding-sample-input">
                                  <p className="coding-sample-label">
                                    <strong>Sample Input:</strong>
                                  </p>
                                  <pre
                                    dangerouslySetInnerHTML={{
                                      __html: q.sampleInput || "N/A",
                                    }}
                                  />
                                </div>
                                <div className="coding-sample-output">
                                  <p className="coding-sample-label">
                                    <strong>Expected Output:</strong>
                                  </p>
                                  {techConfig.type === "codepad" ? (
                                    <div className="expected-preview">
                                      <BrowserPreview
                                        htmlCode={q.sampleOutput || ""}
                                      />
                                    </div>
                                  ) : (
                                    <pre
                                      dangerouslySetInnerHTML={{
                                        __html: q.sampleOutput || "N/A",
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* RIGHT PANEL */}
                            <div className="coding-right-panel">
                              {/* --- PISTON / JUDGE0 EDITOR WITH NEW STYLING --- */}
                              {(techConfig.type === "judge0" ||
                                techConfig.type === "piston") && (
                                <div
                                  className="exam-editor-wrapper coding-editor-wrapper"
                                  style={{ minHeight: "450px" }}
                                >
                                  {/* TOOLBAR */}
                                  <div className="exam-editor-toolbar">
                                    <div className="exam-toolbar-left">
                                      <div className="exam-lang-badge">
                                        <FaMagic size={12} />
                                        {technology.toUpperCase()}
                                      </div>
                                      {techConfig.language === "java" && (
                                        <div
                                          className="exam-dropdown-container"
                                          ref={
                                            openDropdownIndex === i
                                              ? generateDropdownRef
                                              : null
                                          }
                                        >
                                          <button
                                            className="exam-action-btn"
                                            style={{
                                              width: "auto",
                                              padding: "0 10px",
                                              fontSize: "0.85rem",
                                              gap: "6px",
                                            }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setOpenDropdownIndex(
                                                openDropdownIndex === i
                                                  ? null
                                                  : i
                                              );
                                            }}
                                          >
                                            Generate <FaChevronDown size={10} />
                                          </button>
                                          {openDropdownIndex === i && (
                                            <div className="exam-dropdown-menu">
                                              {[
                                                {
                                                  id: "all",
                                                  label: "Generate All ✨",
                                                },
                                                {
                                                  id: "constructor",
                                                  label: "Constructor",
                                                },
                                                {
                                                  id: "getters",
                                                  label: "Getters",
                                                },
                                                {
                                                  id: "setters",
                                                  label: "Setters",
                                                },
                                                {
                                                  id: "tostring",
                                                  label: "toString()",
                                                },
                                                {
                                                  id: "hashcode-equals",
                                                  label: "HashCode & Equals",
                                                },
                                                {
                                                  id: "scanner",
                                                  label: "Add Scanner Input",
                                                },
                                              ].map((item) => (
                                                <button
                                                  key={item.id}
                                                  className="exam-dropdown-item"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleGenerateCode(
                                                      item.id,
                                                      i
                                                    );
                                                    setOpenDropdownIndex(null);
                                                  }}
                                                >
                                                  {item.label}
                                                </button>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="exam-toolbar-right">
                                      <button
                                        className="exam-action-btn"
                                        onClick={() =>
                                          setEditorTheme(
                                            editorTheme === "monokai"
                                              ? "github"
                                              : "monokai"
                                          )
                                        }
                                        title="Toggle Theme"
                                      >
                                        {editorTheme === "monokai" ? (
                                          <FaSun />
                                        ) : (
                                          <FaMoon />
                                        )}
                                      </button>
                                      <button
                                        className="exam-action-btn"
                                        onClick={() =>
                                          setFontSize((p) =>
                                            Math.max(12, p - 2)
                                          )
                                        }
                                        title="Decrease Font Size"
                                      >
                                        <FaMinus size={12} />
                                      </button>
                                      <span
                                        style={{
                                          fontSize: "0.85rem",
                                          fontWeight: "600",
                                          color: "#64748b",
                                        }}
                                      >
                                        {fontSize}px
                                      </span>
                                      <button
                                        className="exam-action-btn"
                                        onClick={() =>
                                          setFontSize((p) =>
                                            Math.min(24, p + 2)
                                          )
                                        }
                                        title="Increase Font Size"
                                      >
                                        <FaPlus size={12} />
                                      </button>
                                      <button
                                        className="exam-action-btn"
                                        onClick={() =>
                                          handleChange(
                                            `code-${i}`,
                                            techConfig.boilerplate
                                          )
                                        }
                                        title="Reset Code"
                                      >
                                        <FaRedo size={12} />
                                      </button>

                                      {/* MOVED RUN BUTTON TO TOOLBAR */}
                                      <button
                                        className="exam-run-btn coding-run-btn-toolbar"
                                        onClick={() =>
                                          handleRunCode(
                                            i,
                                            answers[`code-${i}`],
                                            "run"
                                          )
                                        }
                                        disabled={runningQuestionId === i}
                                      >
                                        {runningQuestionId === i ? (
                                          "..."
                                        ) : (
                                          <>
                                            <FaPlay size={10} /> Run
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  {/* EDITOR */}
                                  <AceEditor
                                    mode={techConfig.aceMode || "text"}
                                    theme={editorTheme}
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
                                    fontSize={fontSize}
                                    width="100%"
                                    height="100%"
                                    style={{ flex: 1 }}
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
                              )}

                              {/* --- MARKS DISPLAY (Between Editor and Output) --- */}
                              {codeResults[i]?.evaluated && (
                                <div
                                  style={{
                                    // marginTop: "1px",
                                    // marginBottom: "1px",
                                    padding: "5px 5px",
                                    backgroundColor:
                                      codeResults[i].marks > 0
                                        ? "#dcfce7"
                                        : "#fee2e2",
                                    border:
                                      codeResults[i].marks > 0
                                        ? "1px solid #86efac"
                                        : "1px solid #fca5a5",
                                    borderRadius: "6px",
                                    color:
                                      codeResults[i].marks > 0
                                        ? "#15803d"
                                        : "#b91c1c",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  <span>Evaluation Result:</span>
                                  <span style={{ fontSize: "1.1rem" }}>
                                    {codeResults[i].marks} /{" "}
                                    {selectedCoding[i].maxMarks} Marks
                                  </span>
                                </div>
                              )}

                              {/* Display Run Results (Debug) OR Input Wizard */}
                              <div className=" coding-output-section">
                                {runningQuestionId === i &&
                                isWaitingForInput ? (
                                  <div
                                    className="console-input-overlay"
                                    style={{
                                      padding: "15px",
                                      backgroundColor: "#fff",
                                      color: "#ff0000ff",
                                      border: "1px solid #ccc",
                                      borderRadius: "5px",
                                      marginBottom: "5px",
                                      fontFamily: "monospace",
                                      fontWeight: "bold", // Bold
                                      fontSize: "18px", // 18px
                                    }}
                                  >
                                    <h4
                                      style={{
                                        color: "#000",
                                        marginBottom: "1px",
                                      }}
                                    >
                                      Interactive Input:
                                    </h4>

                                    {/* History */}
                                    {detectedPrompts.map((prompt, idx) => {
                                      if (idx < currentPromptIndex) {
                                        return (
                                          <div
                                            key={idx}
                                            style={{
                                              marginBottom: "5px",
                                              opacity: 0.7,
                                            }}
                                          >
                                            <span>{prompt} </span>
                                            <strong>{promptValues[idx]}</strong>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })}

                                    {/* Active Input */}
                                    {currentPromptIndex <
                                      detectedPrompts.length && (
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <span>
                                          {detectedPrompts[currentPromptIndex]}{" "}
                                        </span>
                                        <input
                                          autoFocus
                                          type="text"
                                          style={{
                                            flex: 1,
                                            marginLeft: "10px",
                                            border: "none",
                                            borderBottom: "1px solid #000",
                                            outline: "none",
                                            fontFamily: "monospace",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                            color: "#000",
                                          }}
                                          value={
                                            promptValues[currentPromptIndex] ||
                                            ""
                                          }
                                          onChange={(e) =>
                                            setPromptValues({
                                              ...promptValues,
                                              [currentPromptIndex]:
                                                e.target.value,
                                            })
                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              const nextIndex =
                                                currentPromptIndex + 1;
                                              if (
                                                nextIndex <
                                                detectedPrompts.length
                                              ) {
                                                setCurrentPromptIndex(
                                                  nextIndex
                                                );
                                              } else {
                                                // Execute
                                                const inputs =
                                                  detectedPrompts.map(
                                                    (_, k) =>
                                                      promptValues[k] || ""
                                                  );
                                                // Capture last value explicitly
                                                inputs[currentPromptIndex] =
                                                  e.target.value;

                                                handleRunCode(
                                                  i,
                                                  answers[`code-${i}`],
                                                  "run",
                                                  inputs.join("\n")
                                                );
                                              }
                                            }
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <>
                                    {/* Loading Indicator */}
                                    <div
                                      style={{
                                        marginTop: "15px",
                                        color: "#0000FF", // Blue
                                        fontWeight: "bold",
                                        fontFamily: "monospace",
                                        display:
                                          runningQuestionId === i
                                            ? "block"
                                            : "none",
                                      }}
                                    >
                                      Codepulse-R generating Output.......
                                    </div>

                                    {/* Run Output (Console) */}
                                    {runResults[i] && !isWaitingForInput && (
                                      <>
                                        {/* Console Output (Hidden for SQL) */}
                                        {techConfig.language !== "sql" && (
                                          <div
                                            className="exam-terminal-output"
                                            // style={{ marginTop: "1px" }}
                                          >
                                            <h4>Console Output:</h4>
                                            {runResults[i].compileError ? (
                                              <pre className="error-text">
                                                {runResults[i].compileError}
                                              </pre>
                                            ) : (
                                              <pre>
                                                {runResults[i].output ||
                                                  "(No output)"}
                                              </pre>
                                            )}
                                          </div>
                                        )}

                                        {/* SQL Preview Section (Visible for SQL) */}
                                        {techConfig.language === "sql" &&
                                          runResults[i]?.htmlOutput && (
                                            <div className="sql-preview-container">
                                              <div className="sql-preview-header">
                                                📄 Output/Preview:
                                                {/* {codeResults[i]?.evaluated && (
                                                <span
                                                  style={{
                                                    marginLeft: "15px",
                                                    fontWeight: "bold",
                                                    color:
                                                      codeResults[i].marks > 0
                                                        ? "#28a745"
                                                        : "#dc3545",
                                                    fontSize: "0.9rem",
                                                  }}
                                                >
                                                  MARK SCORED:{" "}
                                                  {codeResults[i].marks} /{" "}
                                                  {selectedCoding[i].maxMarks}
                                                </span>
                                              )} */}
                                              </div>
                                              <div
                                                dangerouslySetInnerHTML={{
                                                  __html:
                                                    runResults[i].htmlOutput,
                                                }}
                                                style={{ overflowX: "auto" }}
                                              />
                                            </div>
                                          )}
                                      </>
                                    )}
                                  </>
                                )}
                              </div>

                              {/* Display Evaluation Results (Grading) */}

                              {techConfig.type === "codepad" && (
                                <div
                                  className="html-css-workspace"
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    minHeight: "100%", // Allow growth for scrolling
                                    gap: "0px",
                                    // marginTop: "0px",
                                  }}
                                >
                                  {/* Editor Section with Toolbar */}
                                  <div
                                    className="html-css-editor"
                                    style={{
                                      flex: 1,
                                      display: "flex",
                                      flexDirection: "column",
                                      minHeight: "400px",
                                    }}
                                  >
                                    <div className="exam-editor-toolbar">
                                      <div className="exam-toolbar-left">
                                        <div className="exam-lang-badge">
                                          <FaMagic size={12} />
                                          {technology.toUpperCase()}
                                        </div>
                                      </div>
                                      <div className="exam-toolbar-right">
                                        <button
                                          className="exam-action-btn"
                                          onClick={() =>
                                            setEditorTheme(
                                              editorTheme === "monokai"
                                                ? "github"
                                                : "monokai"
                                            )
                                          }
                                          title="Toggle Theme"
                                        >
                                          {editorTheme === "monokai" ? (
                                            <FaSun />
                                          ) : (
                                            <FaMoon />
                                          )}
                                        </button>
                                        <button
                                          className="exam-action-btn"
                                          onClick={() =>
                                            setFontSize((p) =>
                                              Math.max(12, p - 2)
                                            )
                                          }
                                          title="Decrease Font Size"
                                        >
                                          <FaMinus size={12} />
                                        </button>
                                        <span
                                          style={{
                                            fontSize: "0.85rem",
                                            fontWeight: "600",
                                            color: "#64748b",
                                          }}
                                        >
                                          {fontSize}px
                                        </span>
                                        <button
                                          className="exam-action-btn"
                                          onClick={() =>
                                            setFontSize((p) =>
                                              Math.min(24, p + 2)
                                            )
                                          }
                                          title="Increase Font Size"
                                        >
                                          <FaPlus size={12} />
                                        </button>
                                        <button
                                          className="exam-run-btn coding-run-btn-toolbar"
                                          onClick={() =>
                                            handleEvaluateCodePad(
                                              i,
                                              answers[`code-${i}`]
                                            )
                                          }
                                        >
                                          <FaPlay size={10} /> Run
                                        </button>
                                      </div>
                                    </div>

                                    <AceEditor
                                      mode={techConfig.aceMode || "html"}
                                      theme={editorTheme}
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
                                      fontSize={fontSize}
                                      width="100%"
                                      height="100%"
                                      style={{ flex: 1 }}
                                      showPrintMargin={false}
                                      setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        enableSnippets: true,
                                      }}
                                    />
                                  </div>

                                  {/* Preview Section */}
                                  <div
                                    id={`preview-container-${i}`}
                                    className="html-css-preview"
                                    style={{
                                      flex: 1,
                                      border: "1px solid #e2e8f0",
                                      borderRadius: "8px",
                                      overflow: "hidden",
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <div
                                      style={{
                                        padding: "8px 12px",
                                        background: "#f8fafc",
                                        borderBottom: "1px solid #e2e8f0",
                                        fontWeight: "bold",
                                        color: "#64748b",
                                        fontSize: "1rem",
                                        display: "flex",
                                        justifyContent: "flex-start", // Changed from space-between
                                        alignItems: "center",
                                        gap: "15px", // Added gap
                                      }}
                                    >
                                      <span>Browser Preview</span>
                                      {codeResults[i]?.evaluated && (
                                        <span
                                          style={{
                                            color:
                                              codeResults[i].marks > 0
                                                ? "#15803d" // Darker green text
                                                : "#b91c1c", // Darker red text
                                            backgroundColor:
                                              codeResults[i].marks > 0
                                                ? "#dcfce7" // Light green bg
                                                : "#fee2e2", // Light red bg
                                            border:
                                              codeResults[i].marks > 0
                                                ? "1px solid #86efac"
                                                : "1px solid #fca5a5",
                                            padding: "2px 8px",
                                            borderRadius: "12px",
                                            fontSize: "0.80rem",
                                            fontWeight: "bold",
                                            display: "inline-flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          Marks: {codeResults[i].marks} /{" "}
                                          {q.maxMarks || "0"}
                                        </span>
                                      )}
                                    </div>
                                    <div
                                      style={{
                                        flex: 1,
                                        position: "relative",
                                        minHeight: "300px",
                                        overflow: "auto", // Enable scrolling
                                      }}
                                    >
                                      <BrowserPreview
                                        htmlCode={createPreviewContent(
                                          answers[`code-${i}`] ||
                                            techConfig.boilerplate,
                                          techConfig.language
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <ExamResult
              totals={totals}
              maxTotalMarksDisplay={maxTotalMarksDisplay}
              selectedQuiz={selectedQuiz}
              selectedBlanks={selectedBlanks}
              selectedCoding={selectedCoding}
              selectedPseudo={selectedPseudo}
              quizResults={quizResults}
              blankResults={blankResults}
              codeResults={codeResults}
              pseudoResults={pseudoResults}
              answers={answers}
              malpracticeDetected={malpracticeDetected}
              technology={technology}
              examId={examId}
              techConfig={techConfig}
              onGoToDashboard={handleGoToDashboard}
              ExamConfig={ExamConfig}
              isCodingRoundAvailable={isCodingRoundAvailable}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Exam;
