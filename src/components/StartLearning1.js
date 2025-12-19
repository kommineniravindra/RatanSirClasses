import React, { useState, useEffect, useMemo, useRef } from "react";
// Analysis: Checking for backend save logic
import AceEditor from "react-ace";
import axios from "axios";

import {
  FaCheck,
  FaExpand,
  FaCompress,
  FaPalette,
  FaMagic,
  FaChevronDown,
  FaSun,
  FaMoon,
  FaCode,
  FaArrowAltCircleLeft,
} from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

// Ace Imports (refactored to utils/editorThemes.js)
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CHAPTER_SETUP } from "../learning/sql/SqlSetup";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/ext-language_tools";

import ace from "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-language_tools";

// Autocomplete & snippets
import "ace-builds/src-noconflict/snippets/java";

// Import CSS
import "../css/StartLearning.css";
// Try to import learning files dynamically
import htmlTopics from "../learning/html/htmlTopics";
import cssTopics from "../learning/css/cssTopics";
import javascriptTopics from "../learning/javascript/javascriptTopics";
import javaTopics from "../learning/java/javaTopics";
import pythonTopics from "../learning/python/pythonTopics";
import sqlTopics from "../learning/sql/sqlTopics";
import javaSnippets from "../utils/javaSnippets";
import sqlSnippets from "../utils/sqlSnippets";
import { generateJavaCode } from "../utils/javaCodeGenerator";
import { availableThemes } from "../utils/editorThemes";
import { languageBoilerplates } from "../utils/languageBoilerplates";

// Configure Ace
ace.config.set(
  "basePath",
  "https://cdn.jsdelivr.net/npm/ace-builds@35.0/src-noconflict/"
);
ace.config.set(
  "workerPath",
  "https://cdn.jsdelivr.net/npm/ace-builds@1.35.0/src-noconflict/"
);

const snippetManager = ace.require("ace/snippets").snippetManager;

// ----------------- Config & Helpers -----------------
export const ExamConfig = { codingMarks: 10 };

export const calculatePartialMarks = (expectedOutput, userOutput, maxMarks) => {
  const normalize = (text) => text.toLowerCase().match(/\b\w+\b/g) || [];
  const expectedTokens = normalize(expectedOutput);
  const userTokens = normalize(userOutput);

  if (expectedTokens.length === 0) return 0;

  let matchedTokens = 0;
  const usedIndices = new Set();

  for (const expToken of expectedTokens) {
    for (let j = 0; j < userTokens.length; j++) {
      if (!usedIndices.has(j) && expToken === userTokens[j]) {
        matchedTokens++;
        usedIndices.add(j);
        break;
      }
    }
  }

  const matchPercentage = matchedTokens / expectedTokens.length;
  return Math.floor(maxMarks * matchPercentage);
};

const normalizeWhitespace = (s) => (s || "").replace(/\s+/g, " ").trim();

export const validateHtmlStructure = (expectedHtml, userHtml) => {
  const parser = new DOMParser();
  const expectedDoc = parser.parseFromString(expectedHtml, "text/html");
  const userDoc = parser.parseFromString(userHtml, "text/html");

  const normalize = (str) =>
    (str || "").replace(/\s+/g, " ").trim().toLowerCase();
  const getElements = (doc) => Array.from(doc.body.querySelectorAll("*"));

  const expectedElements = getElements(expectedDoc);
  // If expected has no tags, just compare text content of body
  if (expectedElements.length === 0) {
    const expText = normalize(expectedDoc.body.textContent);
    const userText = normalize(userDoc.body.textContent);
    return expText === userText ? 100 : 0;
  }

  let matchCount = 0;
  let totalChecks = 0;

  expectedElements.forEach((expEl) => {
    totalChecks++;
    const tag = expEl.tagName.toLowerCase();
    const text = normalize(expEl.textContent);

    // Find candidates
    const candidates = Array.from(userDoc.body.getElementsByTagName(tag));

    const match = candidates.find((cand) => {
      const candText = normalize(cand.textContent);
      if (text && !candText.includes(text)) return false;
      if (
        expEl.hasAttribute("type") &&
        expEl.getAttribute("type") !== cand.getAttribute("type")
      )
        return false;
      if (
        expEl.hasAttribute("src") &&
        !cand.getAttribute("src")?.includes(expEl.getAttribute("src"))
      )
        return false;
      if (
        expEl.hasAttribute("href") &&
        !cand.getAttribute("href")?.includes(expEl.getAttribute("href"))
      )
        return false;
      return true;
    });

    if (match) matchCount++;
  });

  if (totalChecks === 0) return 100;
  return Math.floor((matchCount / totalChecks) * 100);
};

export const evaluateOutputs = (
  expectedRaw,
  actualRaw,
  maxMarks,
  language = "text"
) => {
  const expected =
    expectedRaw === undefined || expectedRaw === null
      ? ""
      : String(expectedRaw);
  const actual =
    actualRaw === undefined || actualRaw === null ? "" : String(actualRaw);

  if (!actual.trim()) {
    return { score: 0, reason: "No output produced (empty or error)." };
  }

  // Special handling for HTML
  if (language === "html") {
    const similarity = validateHtmlStructure(expected, actual);
    if (similarity === 100)
      return { score: maxMarks, reason: "Perfect structural match!" };
    if (similarity >= 80)
      return {
        score: maxMarks,
        reason: "Good match! (Minor differences ignored)",
      };
    if (similarity >= 50)
      return {
        score: Math.round(maxMarks * 0.5),
        reason: "Partial structural match.",
      };
  }

  const normalizeRelaxed = (str) =>
    (str || "").toString().toLowerCase().replace(/\s+/g, " ").trim();

  const expectedNorm = normalizeRelaxed(expected);
  const actualNorm = normalizeRelaxed(actual);

  if (actual === expected) return { score: maxMarks, reason: "Exact match." };

  // 1. Case-insensitive + whitespace collapsed match
  if (expectedNorm === actualNorm) {
    return { score: maxMarks, reason: "Match (case/space ignored)." };
  }

  // 2. Super loose: Ignore ALL whitespace (e.g. "a b" == "ab")
  const stripAll = (s) => s.replace(/ /g, "");
  if (stripAll(expectedNorm) === stripAll(actualNorm)) {
    return { score: maxMarks, reason: "Match (formatting ignored)." };
  }

  // Fallback to legacy checks if strict
  if (normalizeWhitespace(actual) === normalizeWhitespace(expected))
    return { score: Math.round(maxMarks * 0.9), reason: "Whitespace match." };

  const maybeNum = (s) => {
    const n = Number(String(s).trim());
    return Number.isFinite(n) ? n : null;
  };
  const expectedNum = maybeNum(expected);
  const actualNum = maybeNum(actual);
  if (expectedNum !== null && actualNum !== null) {
    const diff = Math.abs(expectedNum - actualNum);
    const rel = expectedNum === 0 ? diff : Math.abs(diff / expectedNum);
    const tolerance = 1e-6;
    if (rel <= tolerance)
      return { score: maxMarks, reason: "Numeric match within tolerance." };
    if (rel <= 0.01)
      return {
        score: Math.round(maxMarks * 0.8),
        reason: `Numeric close (rel ${rel}).`,
      };
    if (rel <= 0.1)
      return {
        score: Math.round(maxMarks * 0.6),
        reason: `Numeric partial (rel ${rel}).`,
      };
  }

  const partial = calculatePartialMarks(expected, actual, maxMarks);
  if (partial > 0)
    return {
      score: partial,
      reason: `Partial token match (${partial}/${maxMarks}).`,
    };

  return { score: 0, reason: "No meaningful match." };
};

export const createPreviewContent = (code, language) => {
  if (language === "html") return code;
  if (language === "css") {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${code}</style></head><body><h1>CSS Preview</h1><p>This text is styled by your CSS.</p></body></html>`;
  }
  return "";
};

// ----------------- learning contexts (bundled JSON files) -----------------
export const learningContexts = {
  html: require.context("../learning/html", false, /CodingChapter\d+\.json$/),
  css: require.context("../learning/css", false, /CodingChapter\d+\.json$/),
  javascript: require.context(
    "../learning/javascript",
    false,
    /CodingChapter\d+\.json$/
  ),
  java: require.context("../learning/java", false, /CodingChapter\d+\.json$/),
  python: require.context(
    "../learning/python",
    false,
    /CodingChapter\d+\.json$/
  ),
  sql: require.context("../learning/sql", false, /CodingChapter\d+\.json$/),
};

const TOPIC_LIST_MAP = {
  html: htmlTopics,
  css: cssTopics,
  javascript: javascriptTopics,
  java: javaTopics,
  python: pythonTopics,
  sql: sqlTopics,
};

export const getChapterInfo = (context, lang) => {
  const keys = context
    .keys()
    .filter((key) => key.match(/CodingChapter\d+\.json$/));
  const chapterKeys = keys
    .map((key) => Number(key.match(/CodingChapter(\d+)\.json$/)[1]))
    .sort((a, b) => a - b);
  const currentTopicList = TOPIC_LIST_MAP[lang.toLowerCase()] || [];
  const chapters = chapterKeys.map((keyNum, index) => {
    try {
      const data = context(`./CodingChapter${keyNum}.json`);
      let chapterTitle = `Chapter ${keyNum}`;
      if (currentTopicList.length > 0 && index < currentTopicList.length) {
        chapterTitle = `Chapter ${keyNum}${"\u00A0".repeat(30)} ${
          currentTopicList[index]
        }`;
      } else {
        chapterTitle = data[0]?.chapterTitle || `Chapter ${keyNum}`;
      }
      return { num: keyNum, title: chapterTitle };
    } catch {
      return { num: keyNum, title: `Chapter ${keyNum}` };
    }
  });
  return { count: keys.length, keys, chapterKeys, chapters };
};

export const chapterInfoByLang = {};
Object.entries(learningContexts).forEach(([lang, ctx]) => {
  chapterInfoByLang[lang] = getChapterInfo(ctx, lang);
});

// Judge0 config
const JUDGE0_API = "https://ce.judge0.com";
const JUDGE0_LANG_IDS = { javascript: 63, java: 62, python: 71, sql: 82 };
const CODEPAD_LANGS = ["html", "css"];

const getAceMode = (course) => {
  const lang = (course || "").toLowerCase();
  switch (lang) {
    case "html":
      return "html";
    case "css":
      return "css";
    case "javascript":
      return "javascript";
    case "java":
      return "java";
    case "python":
      return "python";
    case "sql":
      return "sql";
    default:
      return "text";
  }
};

// Snippets moved to src/utils/javaSnippets.js

const StartLearning1 = ({
  selectedCourse,
  userProfile,
  handleBackToDashboard,
}) => {
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null); // Tracks the loaded chapter for DB setup
  const [selectedExample, setSelectedExample] = useState(null);
  /* New state for Generate Dropdown */
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const generateDropdownRef = useRef(null);
  const editorRef = useRef(null);

  const sqlDbRef = useRef(null);
  const sqlFactoryRef = useRef(null);

  // WASM URL for sql.js reference
  const SQL_WASM_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm";

  // Initialize SQL.js on load via CDN
  useEffect(() => {
    const loadSql = async () => {
      // Check if already loaded
      if (window.initSqlJs) {
        try {
          const SQL = await window.initSqlJs({
            locateFile: () => SQL_WASM_URL,
          });
          sqlFactoryRef.current = SQL;
          sqlDbRef.current = new SQL.Database();
          return;
        } catch (e) {
          console.error("Error initializing existing SQL", e);
        }
      }

      // Load Script Dynamically
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js";
      script.async = true;
      script.onload = async () => {
        try {
          const SQL = await window.initSqlJs({
            locateFile: () => SQL_WASM_URL,
          });
          sqlFactoryRef.current = SQL;
          sqlDbRef.current = new SQL.Database();
        } catch (err) {
          console.error("Failed to initialize SQL.js", err);
        }
      };
      script.onerror = () =>
        console.error("Failed to load SQL.js script from CDN");
      document.body.appendChild(script);
    };

    loadSql();
  }, []);

  /* Custom Modal State */
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info", // info, warning, success
    onConfirm: null,
    confirmText: "OK",
    showCancel: false,
  });

  const showModal = (
    title,
    message,
    type = "info",
    onConfirm = null,
    showCancel = false,
    confirmText = "OK"
  ) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      showCancel,
      confirmText,
    });
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  // Theme State
  const [editorTheme, setEditorTheme] = useState("monokai");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const themeDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        generateDropdownRef.current &&
        !generateDropdownRef.current.contains(event.target)
      ) {
        setShowGenerateDropdown(false);
      }
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target)
      ) {
        setShowThemeDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [generateDropdownRef, themeDropdownRef]);

  const [questionData, setQuestionData] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const [courseContests, setCourseContests] = useState({});
  const [chapterExampleCounts, setChapterExampleCounts] = useState({});

  const [currentChapterData, setCurrentChapterData] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isExerciseLoading, setIsExerciseLoading] = useState(false);

  // Resizing State
  const [leftWidth, setLeftWidth] = useState(40); // Percentage
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (containerRef.current) {
    }
  };

  // Re-implementing correctly with a new ref
  const splitContainerRef = useRef(null);

  const handleSplitMouseMove = (e) => {
    if (splitContainerRef.current) {
      const containerWidth = splitContainerRef.current.offsetWidth;
      // Get offset relative to the container
      const rect = splitContainerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;

      const newWidth = (offsetX / containerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setLeftWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleSplitMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const startResizing = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleSplitMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleEditorLoad = (editor) => {
    editorRef.current = editor;
    // 1. Ensure options
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
    });

    // 2. Define Custom Completer with Import Logic
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

        // Return our snippets with high score
        callback(
          null,
          snippetsToUse.map((s) => ({
            caption: s.caption,
            snippet: s.snippet,
            type: "snippet",
            meta: s.customImport ? "Auto-Import" : "Snippet",
            customImport: s.customImport,
            score: 1000000, // Very high score to appear first
            completer: customCompleter, // Self reference
          }))
        );
      },
      insertMatch: function (editor, data) {
        // 1. Remove the typed text (prefix) that triggered this
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

        // 2. Handle Import Injection
        if (data.customImport) {
          const doc = editor.getSession().getDocument();
          const content = doc.getValue();
          const importsToAdd = data.customImport.split("\n");

          importsToAdd.forEach((impStr) => {
            const trimmed = impStr.trim();
            if (trimmed && !content.includes(trimmed)) {
              // Insert at very top
              doc.insert({ row: 0, column: 0 }, trimmed + "\n");
            }
          });
        }

        // 3. Insert Snippet or Text
        if (data.snippet) {
          ace
            .require("ace/snippets")
            .snippetManager.insertSnippet(editor, data.snippet);
        } else {
          editor.execCommand("insertstring", data.value || data.caption);
        }
      },
    };

    // 3. Register Completer (Prepend to list to ensure priority over default snippet manager)
    if (!editor.completers) {
      editor.completers = [];
    }
    // Remove existing instances of our completer to prevent duplicates (if strict equality works)
    // or just prepend. Ace iterates and aggregates.
    editor.completers = [customCompleter, ...editor.completers];
  };

  // Load counts and scores
  useEffect(() => {
    if (selectedCourse) {
      if (userProfile?._id) {
        fetchCourseTotal(userProfile._id, selectedCourse, true);
      }
      fetchChapterExampleCounts(selectedCourse);
    }
  }, [selectedCourse, userProfile?._id]);

  // Load descriptions when the selected chapter changes
  useEffect(() => {
    if (selectedCourse && expandedChapter) {
      try {
        const key = `./CodingChapter${expandedChapter}.json`;
        const context = learningContexts[selectedCourse.toLowerCase()];
        const data = context(key);
        setCurrentChapterData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading chapter data:", err);
        setCurrentChapterData([]);
      }
    } else {
      setCurrentChapterData([]);
    }
  }, [selectedCourse, expandedChapter]);

  // Ensure activeChapter stays in sync with expandedChapter when sidebar opens/navigates
  useEffect(() => {
    if (expandedChapter) {
      setActiveChapter(expandedChapter);
    }
  }, [expandedChapter]);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const fetchCourseTotal = async (userId, course, silent = false) => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `/api/contests/${userId}/course?course=${course}`
      );
      const { contests } = res.data;
      const contestsMap = {};
      (contests || []).forEach((c) => {
        contestsMap[`ch${c.chapter}-ex${c.example}`] = c;
      });
      setCourseContests(contestsMap);
    } catch (error) {
      console.error("Error fetching course total:", error);
    }
  };

  const fetchChapterExampleCounts = (course) => {
    const lang = (course || "").toLowerCase();
    const info = chapterInfoByLang[lang];
    const counts = {};
    if (!info) return setChapterExampleCounts({});
    info.chapterKeys.forEach((chapterNum) => {
      try {
        const key = `./CodingChapter${chapterNum}.json`;
        const context = learningContexts[lang];
        const data = context(key);
        counts[chapterNum] = Array.isArray(data) ? data.length : 0;
      } catch (err) {
        counts[chapterNum] = 0;
      }
    });
    setChapterExampleCounts(counts);
  };

  const loadQuestionData = (course, chapter, example) => {
    try {
      const key = `./CodingChapter${chapter}.json`;
      const context = learningContexts[course.toLowerCase()];
      if (!context) throw new Error(`No learning data found for ${course}`);
      const data = context(key);
      const question = data[example - 1] || null;
      setQuestionData(question);

      const contestKey = `ch${chapter}-ex${example}`;
      const savedContest = courseContests[contestKey];

      const initialCode =
        savedContest?.code ||
        question?.initialCode ||
        languageBoilerplates[course] ||
        "";

      setCode(initialCode);
      setOutput("");
      setShowOutput(false);
      setEvaluationResult(null);
    } catch (err) {
      console.error("Error loading question:", err);
      setQuestionData(null);
      setCode("");
      setOutput("");
      setEvaluationResult(null);
    }
  };

  const handleEvaluateCode = async () => {
    if (!questionData) return;
    if (!code || !code.trim()) {
      showModal("Empty Code", "Please write some code first!", "warning");
      setEvaluationResult({
        score: 0,
        message: "Empty code. 0 marks.",
        isCorrect: false,
        userOutput: "",
        expectedOutput: questionData.sampleOutput || "N/A",
      });
      setShowOutput(true);
      setOutput("");
      return;
    }

    const langKey = selectedCourse?.toLowerCase();
    const isCodepad = CODEPAD_LANGS.includes(langKey);
    const maxMarks = questionData.maxMarks || ExamConfig.codingMarks;
    const expectedOutput = (questionData.sampleOutput || "").toString();

    setIsRunning(true);
    setShowOutput(true);
    setEvaluationResult(null);
    setOutput(
      isCodepad
        ? "Generating Live Preview..."
        : "Evaluating with Codepluse-R..."
    );

    try {
      if (isCodepad) {
        if (expectedOutput && expectedOutput.trim().length > 0) {
          const actualFromCode = code;
          const { score, reason } = evaluateOutputs(
            expectedOutput,
            actualFromCode,
            maxMarks,
            langKey
          );
          setOutput(createPreviewContent(code, langKey));
          setEvaluationResult({
            score,
            message:
              score === maxMarks
                ? `Test executed successfully! ✅`
                : `Output generated with issues. ⚠️`,
            isCorrect: score >= Math.ceil(maxMarks * 0.5),
            userOutput: actualFromCode,
            expectedOutput,
          });
        } else {
          setOutput(createPreviewContent(code, langKey));
          setEvaluationResult({
            score: 0,
            message: "No expected output.",
            isCorrect: false,
            userOutput: code,
            expectedOutput: "N/A",
          });
        }
        setIsRunning(false);
        return;
      }

      const langMap = {
        java: "java",
        python: "python",
        javascript: "javascript",
        sql: "sql",
        // HTML/CSS are handled by Codepad block above
      };

      // Special handling for SQL (Local Execution with Dynamic Verification)
      if (langKey === "sql") {
        if (!sqlFactoryRef.current) {
          setOutput("Initializing SQL Database... try again in a moment.");
          setIsRunning(false);
          return;
        }

        try {
          const SQL = sqlFactoryRef.current;

          // 1. Run User Code on a Fresh DB
          const userDb = new SQL.Database();
          // Apply Common Setup for Chapter
          // Uses activeChapter first (reliable), fallback to expandedChapter (legacy/backup)
          const setupChapter = activeChapter || expandedChapter;
          if (CHAPTER_SETUP[setupChapter]) {
            try {
              userDb.exec(CHAPTER_SETUP[setupChapter]);
            } catch (e) {
              console.error("Common Setup Failed for User DB:", e);
            }
          }

          const userMessages = [];
          let userResultData = null;

          // Helper to execute and capture
          const runQuery = (db, codeToRun, captureMessages = true) => {
            // Strip comments and split
            const sanitized = codeToRun
              .replace(/\/\*[\s\S]*?\*\//g, "")
              .split("\n")
              .map((line) => {
                const idx = line.indexOf("--");
                return idx >= 0 ? line.substring(0, idx) : line;
              })
              .join("\n");

            const cmds = sanitized
              .split(";")
              .filter((c) => c.trim().length > 0);
            const msgs = [];
            let lastSelectResult = null;

            for (let cmd of cmds) {
              try {
                const res = db.exec(cmd);
                const trimmedCmd = cmd.trim();
                const lowerCmd = trimmedCmd.toLowerCase();

                // Basic success messages logic (simplified for brevity, can be expanded if needed)
                if (res.length > 0) {
                  lastSelectResult = res[0]; // {columns:[], values:[]}
                  msgs.push({ type: "table", data: res[0] });
                } else if (lowerCmd.startsWith("create table")) {
                  const match = trimmedCmd.match(
                    /create\s+table\s+(?:if\s+not\s+exists\s+)?["`]?([^\s("`]+)/i
                  );
                  const tableName = match ? match[1] : "Table";
                  if (captureMessages)
                    msgs.push({
                      type: "success",
                      text: `Table '${tableName}' created successfully.`,
                    });
                } else if (lowerCmd.startsWith("drop table")) {
                  const match = trimmedCmd.match(
                    /drop\s+table\s+(?:if\s+exists\s+)?["`]?([^\s("`]+)/i
                  );
                  const tableName = match ? match[1] : "Table";
                  if (captureMessages)
                    msgs.push({
                      type: "success",
                      text: `Table '${tableName}' dropped successfully.`,
                    });
                } else if (lowerCmd.startsWith("insert into")) {
                  const match = trimmedCmd.match(
                    /insert\s+into\s+["`]?([^\s("`]+)/i
                  );
                  const tableName = match ? match[1] : "table";
                  if (captureMessages)
                    msgs.push({
                      type: "success",
                      text: `Values inserted into '${tableName}' successfully.`,
                    });
                } else if (lowerCmd.startsWith("update")) {
                  const match = trimmedCmd.match(/update\s+["`]?([^\s("`]+)/i);
                  const tableName = match ? match[1] : "table";
                  if (captureMessages)
                    msgs.push({
                      type: "success",
                      text: `Table '${tableName}' updated successfully.`,
                    });
                } else if (lowerCmd.startsWith("delete from")) {
                  const match = trimmedCmd.match(
                    /delete\s+from\s+["`]?([^\s("`]+)/i
                  );
                  const tableName = match ? match[1] : "table";
                  if (captureMessages)
                    msgs.push({
                      type: "success",
                      text: `Rows deleted from '${tableName}' successfully.`,
                    });
                } else {
                  // Fallback
                  if (captureMessages)
                    msgs.push({ type: "success", text: "Command executed." });
                }
              } catch (e) {
                msgs.push({ type: "error", text: e.message });
                throw e; // Stop execution on error
              }
            }
            return { msgs, lastSelectResult };
          };

          let userCodeToRun = code;
          if (editorRef.current) {
            const selectedText = editorRef.current.getSelectedText();
            if (selectedText && selectedText.trim().length > 0) {
              userCodeToRun = selectedText;
            }
          }

          try {
            // If initialCode is NOT in the user code (user deleted it), we might want to prepend it?
            // But usually user code represents the whole script.
            // If the question depends on setup, and user deleted setup, it will fail. That's expected.
            // BUT, if we want to be nice, we can check. For now, assume user code is self-sufficient OR user kept the initialCode.
            const userRun = runQuery(userDb, userCodeToRun);
            userMessages.push(...userRun.msgs);
            userResultData = userRun.lastSelectResult;
          } catch (e) {
            userMessages.push({ type: "error", text: `Error: ${e.message}` });
          }

          // Output for user
          setOutput(
            userMessages.length > 0 ? userMessages : "Executed successfully."
          );

          // 2. Run Expected Answer on a FRESH DB (Dynamic Verification)
          const expectedDb = new SQL.Database();
          // Apply Common Setup for Chapter
          // Uses activeChapter first (reliable), fallback to expandedChapter
          const setupExpectedChapter = activeChapter || expandedChapter;
          if (CHAPTER_SETUP[setupExpectedChapter]) {
            try {
              expectedDb.exec(CHAPTER_SETUP[setupExpectedChapter]);
            } catch (e) {
              console.error("Common Setup Failed for Expected DB:", e);
            }
          }

          let expectedResultData = null;

          try {
            // Run initialCode first (Setup)
            if (questionData.initialCode) {
              runQuery(expectedDb, questionData.initialCode, false);
            }
            // Run answer
            const ansRun = runQuery(
              expectedDb,
              questionData.answer || "",
              false
            );
            expectedResultData = ansRun.lastSelectResult;
          } catch (e) {
            console.error("Error generating expected result:", e);
            // If expected code fails, we can't grade properly.
          }

          // 3. Compare Results
          let score = 0;
          let reason = "";
          let isCorrect = false;

          // Helper for loose comparison of result tables
          const compareTables = (t1, t2) => {
            console.log("Comparing Tables:", { t1, t2 });
            if (!t1 && !t2) return true;
            if (!t1 || !t2) return false;
            // Compare rows count
            if (t1.values.length !== t2.values.length) {
              console.log(
                "Row count mismatch:",
                t1.values.length,
                t2.values.length
              );
              return false;
            }

            // Robust comparison: Sort rows to ignore order (SQL sets are unordered)
            const v1 = [...t1.values].sort((a, b) =>
              JSON.stringify(a).localeCompare(JSON.stringify(b))
            );
            const v2 = [...t2.values].sort((a, b) =>
              JSON.stringify(a).localeCompare(JSON.stringify(b))
            );

            const s1 = JSON.stringify(v1);
            const s2 = JSON.stringify(v2);
            console.log("Stringified values:", { s1, s2 });
            return s1 === s2;
          };

          if (userMessages.some((m) => m.type === "error")) {
            score = 0;
            reason = "Execution Error";
          } else if (compareTables(expectedResultData, userResultData)) {
            score = maxMarks;
            reason = "Result matches expected output!";
            isCorrect = true;
          } else {
            score = 0;
            reason = "Result does not match expected output.";
          }

          console.log("Evaluation:", { score, isCorrect, reason });

          setEvaluationResult({
            score,
            message: reason,
            isCorrect,
            userOutput: "See Output Panel",
            expectedOutput: questionData.sampleOutput || "Expected Result",
          });
        } catch (err) {
          console.error(err);
          setOutput(`SQL Error: ${err.message}`);
          setEvaluationResult({
            score: 0,
            message: "SQL Execution Error",
            isCorrect: false,
            userOutput: err.message,
            expectedOutput: "Valid SQL",
          });
        } finally {
          setIsRunning(false);
        }
        return;
      }

      const apiLang = langMap[langKey] || langKey;
      let runOutput = "";
      let isError = false;

      // Call Piston API
      try {
        const response = await axios.post(
          "https://emkc.org/api/v2/piston/execute",
          {
            language: apiLang,
            version: "*",
            files: [{ content: code }],
            stdin: questionData?.sampleInput || "",
          }
        );

        const pistonData = response.data;
        if (pistonData.run) {
          // Standard output or stderr
          runOutput = pistonData.run.output;
          if (pistonData.run.code !== 0) {
            isError = true;
          }
        }
      } catch (err) {
        console.error("Piston API Error:", err);
        runOutput = err.message || "Execution Failed";
        isError = true;
      }

      const cleanedUserOutput = (runOutput || "").toString().trim();
      setOutput(runOutput || "");

      let finalScore = 0;
      let resultMessage = "";
      if (!isError) {
        const { score, reason } = evaluateOutputs(
          expectedOutput,
          cleanedUserOutput,
          maxMarks,
          langKey
        );
        finalScore = score;
        resultMessage =
          score === maxMarks
            ? `✅ Correct! ${reason}`
            : `⚠️ Partial / Incorrect — ${reason}`;
      } else {
        finalScore = 0;
        resultMessage = `⚠️ Execution Failed / Error`;
      }

      setEvaluationResult({
        score: finalScore,
        message: resultMessage,
        isCorrect: finalScore > 0,
        userOutput: cleanedUserOutput || "No output",
        expectedOutput: questionData.sampleOutput || "N/A",
      });
    } catch (err) {
      console.error("API Error:", err);
      setOutput("⚠️ Error during evaluation.");
      setEvaluationResult({
        score: 0,
        message: "⚠️ Network or API error.",
        isCorrect: false,
        userOutput: "N/A",
        expectedOutput: "N/A",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!evaluationResult) {
      showModal("Cannot Save Yet", "Please Run your code first.", "info");
      return;
    }
    const maxMarks = questionData?.maxMarks || ExamConfig.codingMarks;
    if (evaluationResult.score < maxMarks) {
      showModal(
        "Score Too Low",
        `You must achieve ${maxMarks}/${maxMarks}.`,
        "warning"
      );
      return;
    }
    const userId = userProfile?._id;
    if (!userId) {
      showModal("Submission Error", "User profile not loaded.", "error");
      return;
    }

    const contestData = {
      course: selectedCourse,
      chapter: Number(expandedChapter),
      example: Number(selectedExample),
      marks: evaluationResult.score,
      code: code,
    };

    try {
      await axios.post(`/api/contests/${userId}`, contestData);
      showModal("Saved! 🎉", "Submitted.", "success", () => {
        fetchCourseTotal(userId, selectedCourse, true);
        const totalExamples = chapterExampleCounts[expandedChapter] || 0;
        const nextExample = Number(selectedExample) + 1;
        if (nextExample <= totalExamples) {
          handleExampleClick(expandedChapter, nextExample);
        } else {
          setQuestionData(null);
          setSelectedExample(null);
        }
        setEvaluationResult(null);
      });
    } catch (error) {
      showModal("Submission Failed!", "Error saving score.", "error");
    }
  };

  const isExampleCompleted = (chapter, example) => {
    const key = `ch${chapter}-ex${example}`;
    const contest = courseContests[key];
    return (contest?.marks || 0) >= ExamConfig.codingMarks;
  };

  const isChapterCompleted = (chapterNum, totalExamplesInChapter) => {
    if (totalExamplesInChapter === 0) return false;
    const numToTest =
      totalExamplesInChapter || chapterExampleCounts[chapterNum] || 0;
    if (numToTest === 0) return false;
    for (let i = 1; i <= numToTest; i++) {
      if (!isExampleCompleted(chapterNum, i)) return false;
    }
    return true;
  };

  const isChapterUnlocked = (chapterNum, info) => {
    if (
      !info ||
      !Array.isArray(info.chapterKeys) ||
      info.chapterKeys.length === 0
    )
      return false;
    if (chapterNum === info.chapterKeys[0]) return true;
    const currentIndex = info.chapterKeys.indexOf(chapterNum);
    if (currentIndex <= 0) return false;
    const previousChapterNum = info.chapterKeys[currentIndex - 1];
    const totalExamplesInPreviousChapter =
      chapterExampleCounts[previousChapterNum] || 0;
    return isChapterCompleted(
      previousChapterNum,
      totalExamplesInPreviousChapter
    );
  };

  const isExampleUnlocked = (chapterNum, exampleNum) => {
    if (exampleNum === 1) return true;
    const previousExampleNum = exampleNum - 1;
    return isExampleCompleted(chapterNum, previousExampleNum);
  };

  const handleChapterToggle = (chapter) => {
    if (expandedChapter === chapter) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(chapter);
    }
  };

  const handleExampleClick = (chapter, example) => {
    setIsExerciseLoading(true);
    setTimeout(() => {
      setSelectedExample(example);
      setActiveChapter(chapter); // Ensure DB knows which chapter to set up
      loadQuestionData(selectedCourse, chapter, example);
      setIsExerciseLoading(false);
    }, 1200);
  };

  /* New: Refactored generateCode using utility */
  const generateCode = (type) => {
    // Close dropdown
    setShowGenerateDropdown(false);

    const result = generateJavaCode(code, type);
    if (result.success) {
      setCode(result.newCode);
    } else {
      showModal("Info", result.message || "Could not generate code.", "info");
    }
  };

  // Optional: Toast

  const renderCourseProgress = () => {
    const totalExamplesInCourse = Object.values(chapterExampleCounts).reduce(
      (a, b) => a + b,
      0
    );
    const totalCompletedInCourse = Object.values(courseContests).filter(
      (c) => c.marks >= ExamConfig.codingMarks
    ).length;
    let percentage = 0;
    if (totalExamplesInCourse > 0) {
      percentage = (totalCompletedInCourse / totalExamplesInCourse) * 100;
    }
    return (
      <div className="course-progress-sidebar">
        <h3>
          <i className="fa-solid fa-chart-simple"></i> Course Progress
        </h3>
        <div className="progress-stats">
          <span className="progress-percentage">{Math.round(percentage)}%</span>
          <span className="progress-fraction">
            {totalCompletedInCourse} / {totalExamplesInCourse}
          </span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="progress-status-message">
          {percentage === 100
            ? "🎉 Excellent!"
            : percentage >= 70
            ? "🔥 Great job!"
            : percentage >= 40
            ? "💡 Good progress!"
            : "🚀 Start learning!"}
        </div>
      </div>
    );
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const aceMode = getAceMode(selectedCourse);
  const langType = selectedCourse.toLowerCase();
  const isCodepad = CODEPAD_LANGS.includes(langType);
  const evaluateButtonText = isRunning
    ? isCodepad
      ? "Running"
      : "Running"
    : "Run";

  // VIEW 1: Exercise Editor (if questionData and selectedExample set)
  if (selectedExample && questionData) {
    return (
      <div
        className={`learning-question-view ${
          isFullScreen ? "full-screen-active" : ""
        }`}
      >
        {isExerciseLoading && (
          <div className="exercise-loading-overlay">
            <div className="exercise-loader">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <h2 className="exercise-loading-text">Loading Exercise...</h2>
          </div>
        )}
        {!isFullScreen && (
          <button
            className="learning-back-btn"
            onClick={() => {
              setQuestionData(null);
              setSelectedExample(null);
            }}
          >
            <FaArrowAltCircleLeft size={18} className="back-btn-icon" />
            Back to Chapters
          </button>
        )}

        {/* --- Question & Compiler Columns --- */}
        <div
          className="question-compiler-columns question-compiler-split-container"
          ref={splitContainerRef}
          // height handling moved to CSS, but keep ref
        >
          {/* Left Column: Question */}
          <div
            className="question-area-left-column question-area-resizable"
            style={{
              flex: `0 0 ${leftWidth}%`,
              maxWidth: `${leftWidth}%`,
            }}
          >
            <div className="learning-question-card">
              <h2 className="learning-content-header">
                {selectedCourse} Chapter {expandedChapter} : Exercise{" "}
                {selectedExample}
              </h2>{" "}
              <p
                style={{ whiteSpace: "pre-wrap" }}
                dangerouslySetInnerHTML={{ __html: questionData.question }}
              />
              <h4 className="sample-header">📥 Sample Input:</h4>
              {questionData.sampleInput &&
              questionData.sampleInput.trim().includes("<") ? (
                <div
                  className="sample-code-box"
                  dangerouslySetInnerHTML={{ __html: questionData.sampleInput }}
                />
              ) : (
                <pre>{questionData.sampleInput || "N/A"}</pre>
              )}
              <h4 className="sample-header">📤 Expected Output:</h4>
              {["html", "css"].includes(langType) ? (
                <div className="preview-box">
                  <iframe
                    title="Exp"
                    className="preview-iframe"
                    srcDoc={
                      langType === "css"
                        ? `<!DOCTYPE html><html><head><style>${questionData.sampleOutput}</style></head><body><h1>CSS Preview</h1><p>Expected CSS.</p></body></html>`
                        : questionData.sampleOutput
                    }
                  />
                </div>
              ) : questionData.sampleOutput &&
                questionData.sampleOutput.trim().startsWith("<") ? (
                <div
                  className="sample-code-box"
                  dangerouslySetInnerHTML={{
                    __html: questionData.sampleOutput,
                  }}
                />
              ) : (
                <pre>{questionData.sampleOutput || "N/A"}</pre>
              )}
            </div>
          </div>

          {/* Resizer */}
          <div
            className="resizer"
            onMouseDown={startResizing}
            title="Drag to resize"
          ></div>

          {/* Right Column: Compiler */}
          <div className="compiler-area-right compiler-area-flexible">
            <div className="compiler-area">
              <div className="compiler-buttons dual-button-group">
                <h4>💻 Code Editor ({selectedCourse})</h4>
                <div className="compiler-controls">
                  <button
                    className="fullscreen-btn"
                    onClick={toggleFullScreen}
                    title="Full Screen"
                  >
                    {isFullScreen ? <FaCompress /> : <FaExpand />}
                  </button>

                  <div style={{ position: "relative" }} ref={themeDropdownRef}>
                    <button
                      className="evaluate-code-btn theme-btn"
                      onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                      title="Change Theme"
                    >
                      <FaPalette /> Theme <FaChevronDown size={10} />
                    </button>
                    {showThemeDropdown && (
                      <div className="dropdown-menu theme-dropdown">
                        {availableThemes.map((theme, index) => {
                          // Crude guess for icon based on position in our sorted list
                          // 0,1=L, 2,3=D, 4,5=L, 6,7=D, 8,9=L
                          const isDark = Math.floor(index / 2) % 2 === 1;

                          return (
                            <button
                              key={theme}
                              onClick={() => {
                                setEditorTheme(theme);
                                setShowThemeDropdown(false);
                              }}
                              /* Replaced inline styles with class */
                              onMouseOver={(e) => {}} // Hover handled by CSS
                              onMouseOut={(e) => {}}
                              className={`dropdown-item ${
                                editorTheme === theme ? "active" : ""
                              }`}
                            >
                              {isDark ? (
                                <FaMoon color="#fbbf24" />
                              ) : (
                                <FaSun color="#f59e0b" />
                              )}
                              <span style={{ textTransform: "capitalize" }}>
                                {theme.replace("_", " ")}
                              </span>
                              {editorTheme === theme && (
                                <FaCheck style={{ marginLeft: "auto" }} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {selectedCourse === "Java" && (
                    <div
                      style={{ position: "relative" }}
                      ref={generateDropdownRef}
                    >
                      <button
                        className="evaluate-code-btn generate-btn-custom"
                        onClick={() =>
                          setShowGenerateDropdown(!showGenerateDropdown)
                        }
                        title="Generate Boilerplate Code"
                      >
                        <FaMagic /> Generate <FaChevronDown size={10} />
                      </button>
                      {showGenerateDropdown && (
                        <div className="dropdown-menu generate-dropdown">
                          {[
                            {
                              id: "all",
                              label: "Generate All ✨",
                              icon: <FaMagic />,
                            },
                            {
                              id: "constructor",
                              label: "Constructor",
                              icon: <FaCode />,
                            },
                            {
                              id: "getters",
                              label: "Getters",
                              icon: <FaCode />,
                            },
                            {
                              id: "setters",
                              label: "Setters",
                              icon: <FaCode />,
                            },
                            {
                              id: "tostring",
                              label: "toString()",
                              icon: <FaCode />,
                            },
                            {
                              id: "hashcode-equals",
                              label: "hashCode() & equals()",
                              icon: <FaCode />,
                            },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => generateCode(item.id)}
                              onMouseOver={(e) => {}}
                              onMouseOut={(e) => {}}
                              className="dropdown-item"
                            >
                              {item.icon} {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    className="evaluate-code-btn"
                    onClick={handleEvaluateCode}
                    disabled={isRunning}
                  >
                    {evaluateButtonText}
                  </button>
                  <button
                    className="complete-chapter-btn"
                    onClick={handleFinalSubmit}
                    disabled={isRunning || !evaluationResult}
                  >
                    🎉Save
                  </button>
                </div>
              </div>

              <AceEditor
                key={`editor-${aceMode}-${editorTheme}`}
                mode={aceMode}
                theme={editorTheme}
                name={`code-editor-${aceMode}`}
                onLoad={handleEditorLoad}
                value={code}
                onChange={setCode}
                width="100%"
                height="auto"
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true, // crucial!
                  showLineNumbers: true,
                  showPrintMargin: false,
                  tabSize: 4,
                  fontSize: 16,
                  minLines: isFullScreen ? 25 : 15,
                  maxLines: isFullScreen ? 25 : 15,
                }}
                style={{ borderRadius: "8px" }} // Ace editor style prop specific
                className="ace-editor-wrapper"
              />

              {showOutput && (
                <div className="output-box-container">
                  <h4>🧾Output/Preview:</h4>
                  {isCodepad ? (
                    <iframe
                      title="Preview"
                      srcDoc={output}
                      className="output-preview-iframe"
                    />
                  ) : Array.isArray(output) ? (
                    <div className="sql-result-container">
                      {output.map((msg, i) => (
                        <div key={i} style={{ marginBottom: "16px" }}>
                          {msg.type === "success" && (
                            <div className="sql-success-msg">
                              <FaCheck /> {msg.text}
                            </div>
                          )}
                          {msg.type === "error" && (
                            <div className="sql-error-box">{msg.text}</div>
                          )}
                          {msg.type === "info" && (
                            <div className="sql-info-box">{msg.text}</div>
                          )}
                          {msg.type === "table" && (
                            <div className="sql-table-wrapper">
                              <table className="sql-table">
                                <thead>
                                  <tr>
                                    {msg.data.columns.map((col, idx) => (
                                      <th key={idx} className="sql-th">
                                        {col}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {msg.data.values.map((row, rIdx) => (
                                    <tr key={rIdx}>
                                      {row.map((val, cIdx) => (
                                        <td key={cIdx} className="sql-td">
                                          {val}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <pre className="compiler-output">{output}</pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {modalState.isOpen && (
          <div className="custom-modal-overlay">
            <div className="custom-modal-box">
              <h2 className="custom-modal-title">{modalState.title}</h2>
              <p className="custom-modal-message">{modalState.message}</p>
              <div className="custom-modal-actions">
                <button
                  className="custom-modal-btn confirm"
                  onClick={() => {
                    if (modalState.onConfirm) modalState.onConfirm();
                    closeModal();
                  }}
                >
                  {modalState.confirmText}
                </button>
                {modalState.showCancel && (
                  <button
                    className="custom-modal-btn cancel"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // VIEW 2: Chapter List (Default)
  const lang = selectedCourse.toLowerCase();
  const info = chapterInfoByLang[lang] || {
    count: 0,
    chapterKeys: [],
    chapters: [],
  };

  return (
    <div className="learning-chapters-container">
      <button className="learning-back-btn" onClick={handleBackToDashboard}>
        <FaArrowAltCircleLeft size={18} style={{ marginRight: "1px" }} />
        Back to Courses
      </button>
      <h2 className="learning-content-header">
        <span>{selectedCourse} Course </span>
      </h2>

      <div className="course-content-layout">
        <div className="chapter-accordion-container">
          {info.chapters.map((chapter) => {
            const chapterNum = chapter.num;
            const totalExamplesInChapter =
              chapterExampleCounts[chapterNum] || 0;
            const chapterIsCompleted = isChapterCompleted(
              chapterNum,
              totalExamplesInChapter
            );
            const chapterIsUnlocked = isChapterUnlocked(chapterNum, info);
            const isActive = expandedChapter === chapterNum;

            let statusClass = isActive ? "open" : "";
            if (chapterIsCompleted) statusClass += " completed-chapter";
            if (!chapterIsUnlocked) statusClass += " locked-chapter";

            return (
              <div
                key={chapterNum}
                className={`chapter-accordion-item ${statusClass}`}
              >
                <div className="chapter-number">
                  {chapterIsCompleted ? <FaCheck /> : chapterNum}
                </div>
                <div
                  className="chapter-accordion-header"
                  onClick={() =>
                    chapterIsUnlocked
                      ? handleChapterToggle(chapterNum)
                      : showModal(
                          "Locked!",
                          "Complete previous chapter first.",
                          "info"
                        )
                  }
                >
                  <h3>{chapter.title}</h3>
                  <span className="chapter-toggle-icon">
                    {isActive ? "−" : "+"}
                  </span>
                </div>

                <div
                  className={`chapter-accordion-content ${
                    isActive ? "open" : ""
                  }`}
                >
                  {isActive &&
                    currentChapterData.map((exercise, index) => {
                      const exerciseNum = index + 1;
                      const exCompleted = isExampleCompleted(
                        expandedChapter,
                        exerciseNum
                      );
                      const exUnlocked = isExampleUnlocked(
                        expandedChapter,
                        exerciseNum
                      );

                      return (
                        <div
                          key={index}
                          className={`exercise-item ${
                            !exUnlocked
                              ? "locked"
                              : exCompleted
                              ? "completed"
                              : ""
                          }`}
                        >
                          <h4 className="exercise-title">
                            Exercise {exerciseNum}: {exercise.title}
                          </h4>
                          <p className="exercise-description">
                            {exercise.description}
                          </p>
                          <button
                            className="exercise-start-btn"
                            disabled={!exUnlocked}
                            onClick={() => {
                              if (exUnlocked)
                                handleExampleClick(
                                  expandedChapter,
                                  exerciseNum
                                );
                              else
                                showModal(
                                  "Locked!",
                                  "Complete previous exercise first.",
                                  "info"
                                );
                            }}
                          >
                            {exUnlocked
                              ? exCompleted
                                ? "Review"
                                : "Start"
                              : "Locked"}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
        {renderCourseProgress()}
      </div>
      {modalState.isOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-box">
            <h2 className="custom-modal-title">{modalState.title}</h2>
            <p className="custom-modal-message">{modalState.message}</p>
            <div className="custom-modal-actions">
              <button
                className="custom-modal-btn confirm"
                onClick={() => {
                  if (modalState.onConfirm) modalState.onConfirm();
                  closeModal();
                }}
              >
                {modalState.confirmText}
              </button>
              {modalState.showCancel && (
                <button
                  className="custom-modal-btn cancel"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartLearning1;
