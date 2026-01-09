import React, { useState, useEffect, useMemo, useRef } from "react";
// Analysis: Checking for backend save logic
import AceEditor from "react-ace";
import axios from "axios";
import alasql from "alasql"; // Added explicit import

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
import { htmlSnippets } from "../utils/htmlSnippets";
import {
  sqlSnippets,
  runSqlCode,
  compareSqlTables,
  populateDbFromHtml,
} from "../utils/sqllogic";
import { generateJavaCode } from "../utils/javaCodeGenerator";
import { analyzeInputPrompts } from "../utils/codeAnalysis";
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

    // 2. Normalization for Semantic Tags
    const EQUIVALENTS = {
      b: "strong",
      strong: "b",
      i: "em",
      em: "i",
    };

    // Find candidates including equivalents (search entire doc)
    const tagEquiv = EQUIVALENTS[tag];
    let candidates = [...Array.from(userDoc.body.getElementsByTagName(tag))];
    if (tagEquiv) {
      candidates = [
        ...candidates,
        ...Array.from(userDoc.body.getElementsByTagName(tagEquiv)),
      ];
    }

    const match = candidates.find((cand) => {
      const candText = normalize(cand.textContent);
      const isTagMatch =
        cand.tagName.toLowerCase() === tag ||
        cand.tagName.toLowerCase() === tagEquiv;

      if (!isTagMatch) return false;
      if (text && !candText.includes(text)) return false;

      // Attribute checks with case-insensitivity for values
      if (expEl.hasAttribute("type")) {
        const expAttr = (expEl.getAttribute("type") || "").toLowerCase();
        const candAttr = (cand.getAttribute("type") || "").toLowerCase();
        if (expAttr !== candAttr) return false;
      }

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

    // Fallback: Check pure text content similarity if structure check was strict
    // This catches cases where DOM parsing might be too rigid but content is correct.
    const textScore = calculatePartialMarks(expected, actual, 100); // Get percentage
    if (textScore >= 90) {
      return {
        score: maxMarks,
        reason: "Content matches perfectly! (Structure accepted)",
      };
    }

    if (similarity >= 50)
      return {
        score: Math.round(maxMarks * 0.5),
        reason: "Partial structural match.",
      };
    return {
      score: Math.floor((similarity / 100) * maxMarks),
      reason: `Structure mismatch (${similarity}% match). Check tags and attributes.`,
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
  html: import.meta.glob("../learning/html/CodingChapter*.json", {
    eager: true,
  }),
  css: import.meta.glob("../learning/css/CodingChapter*.json", {
    eager: true,
  }),
  javascript: import.meta.glob("../learning/javascript/CodingChapter*.json", {
    eager: true,
  }),
  java: import.meta.glob("../learning/java/CodingChapter*.json", {
    eager: true,
  }),
  python: import.meta.glob("../learning/python/CodingChapter*.json", {
    eager: true,
  }),
  sql: import.meta.glob("../learning/sql/CodingChapter*.json", {
    eager: true,
  }),
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
  // context is now the object returned by import.meta.glob { path: module, ... }
  const keys = Object.keys(context);
  const chapterKeys = keys
    .map((key) => {
      const match = key.match(/CodingChapter(\d+)\.json$/);
      return match ? Number(match[1]) : null;
    })
    .filter((n) => n !== null)
    .sort((a, b) => a - b);

  const currentTopicList = TOPIC_LIST_MAP[lang.toLowerCase()] || [];
  const chapters = chapterKeys.map((keyNum, index) => {
    try {
      // Reconstruct key to find module in context
      const keyPattern = new RegExp(`CodingChapter${keyNum}\\.json$`);
      const fullKey = keys.find((k) => keyPattern.test(k));

      if (!fullKey) throw new Error("Key not found");

      const module = context[fullKey];
      // ESM module default export check
      const data = Array.isArray(module) ? module : module.default || [];

      let chapterTitle = `Chapter ${keyNum}`;
      if (currentTopicList.length > 0 && index < currentTopicList.length) {
        chapterTitle = `Chapter ${keyNum}: ${"\u00A0"} ${
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
  /* New state for Generate Dropdown & Fixed Positioning */
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const generateDropdownRef = useRef(null);
  const editorRef = useRef(null);
  /* Iframe Refs for Resizing */
  const expectedOutputIframeRef = useRef(null);
  const actualOutputIframeRef = useRef(null);

  // --- Dynamic Fixed Positioning State ---
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [activeDropdown, setActiveDropdown] = useState(null); // 'theme', 'generate', or null

  // Helper to toggle dropdowns with fixed positioning
  const toggleDropdown = (e, dropdownName) => {
    e.stopPropagation();
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    // Align right edge: left = rect.right - width (~200px)
    // Safe default: left = rect.left - 100
    setDropdownPos({
      top: rect.bottom + 5,
      left: rect.left - 100, // Approximate right alignment shift
    });
    setActiveDropdown(dropdownName);
  };

  // Close dropdowns on scroll/click
  useEffect(() => {
    const closeAll = () => setActiveDropdown(null);
    window.addEventListener("click", closeAll);
    window.addEventListener("scroll", closeAll, true);
    return () => {
      window.removeEventListener("click", closeAll);
      window.removeEventListener("scroll", closeAll, true);
    };
  }, []);

  const sqlDbRef = useRef(null);

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
        // setShowThemeDropdown(false); // Handled by global click listener now
      }
    }
    // document.addEventListener("mousedown", handleClickOutside); // Removed old listener
    return () => {
      // document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [generateDropdownRef, themeDropdownRef]);

  const [questionData, setQuestionData] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Sequential Input State
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [detectedPrompts, setDetectedPrompts] = useState([]);
  const [promptValues, setPromptValues] = useState({});
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

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
        // Only for Java or SQL or HTML
        const mode = session.getMode().$id;
        let snippetsToUse = [];

        if (mode && (mode.endsWith("/java") || mode === "java")) {
          snippetsToUse = javaSnippets;
        } else if (mode && (mode.endsWith("/sql") || mode === "sql")) {
          snippetsToUse = sqlSnippets;
        } else if (mode && (mode.endsWith("/html") || mode === "html")) {
          snippetsToUse = htmlSnippets;
        } else {
          callback(null, []);
          return;
        }

        // --- Context Aware Logic for Dot (.) and Bang (!) ---
        const line = session.getLine(pos.row);
        const lineUpToCursor = line.slice(0, pos.column);
        const isDotTrigger = lineUpToCursor.trimEnd().endsWith(".");
        const isBangTrigger = lineUpToCursor.trim().endsWith("!");

        // If trigger is dot or bang, ignore prefix length check, OR if regular typing check prefix
        if (!isDotTrigger && !isBangTrigger && prefix.length === 0) {
          callback(null, []);
          return;
        }

        let filteredSnippets = snippetsToUse;

        // If triggered by dot, ONLY show snippets starting with "." (methods)
        if (isDotTrigger && mode.endsWith("/java")) {
          filteredSnippets = snippetsToUse.filter((s) =>
            s.snippet.startsWith(".")
          );
        } else if (isBangTrigger) {
          // If triggered by !, only show the ! snippet
          filteredSnippets = snippetsToUse.filter((s) => s.caption === "!");
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
              customImport: s.customImport,
              score: 1000000 + (isDotTrigger ? 1000 : 0), // Boost score if dot context
              completer: customCompleter, // Self reference
            };
          })
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

  // Dynamic Iframe Resizer Helper
  const performResize = (iframe) => {
    if (!iframe) return;
    try {
      const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (innerDoc && innerDoc.body) {
        // Reset height to allow shrinking
        iframe.style.height = "100px";
        const scrollHeight =
          innerDoc.documentElement.scrollHeight || innerDoc.body.scrollHeight;
        // Set new height based on content
        iframe.style.height = `${scrollHeight + 30}px`;
      }
    } catch (err) {
      console.error("Iframe resize error:", err);
    }
  };

  const resizeIframe = (e) => {
    if (e?.target) performResize(e.target);
  };

  // Effect to resize Expected Output when data changes
  useEffect(() => {
    if (expectedOutputIframeRef.current) {
      // Small delay to allow render
      setTimeout(() => performResize(expectedOutputIframeRef.current), 100);
    }
  }, [questionData, selectedExample]);

  // Effect to resize Actual Output when output changes
  useEffect(() => {
    if (actualOutputIframeRef.current && showOutput) {
      setTimeout(() => performResize(actualOutputIframeRef.current), 100);
    }
  }, [output, showOutput]);

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
        const keyPattern = new RegExp(
          `CodingChapter${expandedChapter}\\.json$`
        );
        const context = learningContexts[selectedCourse.toLowerCase()];
        const keys = Object.keys(context);
        const fullKey = keys.find((k) => keyPattern.test(k));

        if (fullKey) {
          const module = context[fullKey];
          const data = Array.isArray(module) ? module : module.default || [];
          setCurrentChapterData(data);
        } else {
          setCurrentChapterData([]);
        }
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

  // Reset SQL DB when switching examples/chapters
  useEffect(() => {
    sqlDbRef.current = null;
  }, [selectedCourse, expandedChapter, selectedExample]);

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
        const keyPattern = new RegExp(`CodingChapter${chapterNum}\\.json$`);
        const context = learningContexts[lang];
        const keys = Object.keys(context);
        const fullKey = keys.find((k) => keyPattern.test(k));

        if (fullKey) {
          const module = context[fullKey];
          const data = Array.isArray(module) ? module : module.default || [];
          counts[chapterNum] = data.length;
        } else {
          counts[chapterNum] = 0;
        }
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

  const handleEvaluateCode = async (inputsOverride = null) => {
    const actualInputsOverride =
      typeof inputsOverride === "string" ? inputsOverride : null;

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

    // 1. SMART PROMPT DETECTION (Java Only)
    if (!actualInputsOverride && langKey === "java") {
      const prompts = analyzeInputPrompts(code, "java");
      if (prompts.length > 0) {
        setDetectedPrompts(prompts);
        setPromptValues({});
        setCurrentPromptIndex(0);
        setIsWaitingForInput(true);
        setShowOutput(true); // Open output pane to show wizard
        setOutput(""); // Clear previous output
        return;
      }
    }

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

      // Special handling for SQL (AlaSQL - MySQL/Oracle simulation)
      // Special handling for SQL (Global Component Logic)
      if (langKey === "sql") {
        try {
          // 1. Setup User DB
          let userCodeToRun = code;
          let isSelection = false;
          if (editorRef.current) {
            const selectedText = editorRef.current.getSelectedText();
            if (selectedText && selectedText.trim().length > 0) {
              userCodeToRun = selectedText;
              isSelection = true;
            }
          }

          if (!isSelection || !sqlDbRef.current) {
            // const alasql = require("alasql"); // Removed
            try {
              alasql("DROP DATABASE IF EXISTS myDB");
            } catch (e) {}
            sqlDbRef.current = new alasql.Database();
            sqlDbRef.current.exec("CREATE DATABASE myDB; USE myDB");
          }
          const userDb = sqlDbRef.current;

          // 1b. Run Setup (Initial Code) if reset & not selection
          // CHECK: If user code manually CREATEs and INSERTs, skip initialCode
          const userHasDDL = /CREATE\s+TABLE/i.test(userCodeToRun);
          const userHasDML = /INSERT\s+INTO/i.test(userCodeToRun);
          const userHasSetup = userHasDDL && userHasDML;

          if (!isSelection && questionData.initialCode && !userHasSetup) {
            try {
              runSqlCode(userDb, questionData.initialCode);
            } catch (e) {}
          }

          // 1c. Auto-Populate from Sample Input if NO Table Creation detected
          // (If neither User nor Initial code creates a table, but we have Sample Input)
          const initialHasDDL = /CREATE\s+TABLE/i.test(
            questionData.initialCode || ""
          );

          if (!userHasDDL && !initialHasDDL && questionData.sampleInput) {
            populateDbFromHtml(userDb, questionData.sampleInput);
          }

          // 2. Run User Code
          const userRes = runSqlCode(userDb, userCodeToRun);
          const userMessages = userRes.messages;
          let userResultData = userRes.lastSelectResult;

          // Auto-verify DML (StartLearning specific feature)
          if (
            (!userResultData || userResultData.values.length === 0) &&
            userRes.modifiedTables.length > 0
          ) {
            try {
              const t =
                userRes.modifiedTables[userRes.modifiedTables.length - 1];
              const res = userDb.exec(`SELECT * FROM ${t}`);
              if (Array.isArray(res) && res.length > 0) {
                const columns = Object.keys(res[0]);
                const values = res.map((row) => columns.map((c) => row[c]));
                userResultData = { columns, values };
                userMessages.push({ type: "table", data: userResultData });
              }
            } catch (e) {}
          }

          setOutput(
            userMessages.length > 0 ? userMessages : "Executed successfully."
          );

          // 3. Expected Result Check (for grading)
          // const alasql = require("alasql"); // Removed
          const expectedDb = new alasql.Database(); // Fresh DB for expected
          let expectedResultData = null;
          let expectedTables = [];

          // Try to populate DB from Sample Input if the Answer Code is just a SELECT (no DDL/DML)
          const ansHasDDL = /CREATE\s+TABLE/i.test(questionData.answer || "");
          const ansHasDML = /INSERT\s+INTO/i.test(questionData.answer || "");

          if (!ansHasDDL && !ansHasDML && questionData.sampleInput) {
            populateDbFromHtml(expectedDb, questionData.sampleInput);
          }

          if (questionData.initialCode) {
            runSqlCode(expectedDb, questionData.initialCode);
          }
          if (questionData.answer) {
            const ansRes = runSqlCode(expectedDb, questionData.answer);
            expectedResultData = ansRes.lastSelectResult;
            expectedTables = ansRes.messages
              .filter((m) => m.type === "table")
              .map((m) => m.data);

            // DML Check for Expected
            if (
              (!expectedResultData || expectedResultData.values.length === 0) &&
              ansRes.modifiedTables.length > 0
            ) {
              try {
                const t =
                  ansRes.modifiedTables[ansRes.modifiedTables.length - 1];
                const res = expectedDb.exec(`SELECT * FROM ${t}`);
                if (Array.isArray(res) && res.length > 0) {
                  const columns = Object.keys(res[0]);
                  const values = res.map((row) => columns.map((c) => row[c]));
                  expectedResultData = { columns, values };
                }
              } catch (e) {}
            }
          }

          // 4. Comparison
          let score = 0;
          let reason = "";
          let isCorrect = false;

          // Gather all user tables
          const allUserTables = userMessages
            .filter((m) => m.type === "table" && m.data)
            .map((m) => m.data);

          const allExpectedTables =
            expectedTables.length > 0
              ? expectedTables
              : expectedResultData
              ? [expectedResultData]
              : [];

          if (allExpectedTables.length === 0) {
            // No expected output?
            score = maxMarks;
            reason = "No expected output tables defined. Passed.";
            isCorrect = true;
          } else if (allUserTables.length === 0) {
            score = 0;
            reason = "No output tables found. Did you use SELECT?";
            isCorrect = false;
          } else {
            // Compare one by one
            let allMatch = true;
            let matchCount = 0;

            // We expect the user to produce AT LEAST the expected tables, in roughly the same order.
            // But sometimes user might have extra selects.
            // Let's try to match them loosely or strictly?
            // STRICT ORDER MATCH seems best for multi-step problems.

            // If user has fewer tables than expected, fail immediately
            if (allUserTables.length < allExpectedTables.length) {
              allMatch = false;
              reason = `Expected ${allExpectedTables.length} tables, but got ${allUserTables.length}.`;
            } else {
              for (let i = 0; i < allExpectedTables.length; i++) {
                const exp = allExpectedTables[i];
                const usr = allUserTables[i]; // Strict index matching
                const res = compareSqlTables(exp, usr);
                if (!res.pass) {
                  allMatch = false;
                  reason = `Table ${i + 1} mismatch: ${res.reason}`;
                  break;
                }
                matchCount++;
              }
            }

            if (allMatch) {
              score = maxMarks;
              reason = `All ${matchCount} tables matched perfectly!`;
              isCorrect = true;
            } else {
              score = 0; // Fail if any mismatch in a multi-step
              // reason is already set
            }
          }

          let expectedTable = null;
          if (expectedResultData && expectedResultData.values.length > 0) {
            expectedTable = {
              type: "table",
              data: expectedResultData,
              title: "Expected Output Test",
            };
          }

          setEvaluationResult({
            score,
            message: reason,
            isCorrect,
            userOutput: "See Output Panel",
            expectedOutput: JSON.stringify(expectedResultData),
            expectedTable,
            expectedTables,
          });
        } catch (e) {
          console.error(e);
          setOutput([{ type: "error", text: e.message || String(e) }]);
          setEvaluationResult({
            score: 0,
            message: `Error: ${e.message}`,
            isCorrect: false,
            userOutput: "",
            expectedOutput: "",
          });
        }
        setIsRunning(false);
        return;
      }

      const apiLang = langMap[langKey] || langKey;
      let runOutput = "";
      let isError = false;

      // 1. Check for Extracted Logic (Java, Python, JS)
      if (["java", "python", "javascript"].includes(apiLang)) {
        let result = { output: "", isError: false };
        const inputToUse =
          actualInputsOverride || questionData?.sampleInput || "";

        if (apiLang === "java") {
          const { runJavaCode } = require("../utils/javalogic");
          result = await runJavaCode(code, inputToUse);
        } else if (apiLang === "python") {
          const { runPythonCode } = require("../utils/pythonlogic");
          result = await runPythonCode(code, inputToUse);
        } else if (apiLang === "javascript") {
          const { runJavascriptCode } = require("../utils/javascriptlogic");
          result = await runJavascriptCode(code, inputToUse);
        }
        runOutput = result.output;
        isError = result.isError;
      } else {
        // Fallback Piston Call
        try {
          let codeToSend = code;
          let fileName = "Main.java";
          const fileData = { content: codeToSend }; // Default

          const response = await axios.post(
            "https://emkc.org/api/v2/piston/execute",
            {
              language: apiLang,
              version: "*",
              files: [fileData],
              stdin: actualInputsOverride || questionData?.sampleInput || "",
            }
          );
          const pistonData = response.data;
          if (pistonData.run) {
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
      }

      const cleanedUserOutput = (runOutput || "").toString().trim();

      // Inject Inputs for Echo (Black/White Terminal Style)
      let finalOutput = runOutput || "";
      if (actualInputsOverride && detectedPrompts.length > 0) {
        detectedPrompts.forEach((prompt, idx) => {
          const val = promptValues[idx] || "";
          if (finalOutput.includes(prompt)) {
            finalOutput = finalOutput.replace(
              prompt,
              prompt + " " + val + "\n"
            );
          }
        });
      }
      setOutput(finalOutput);

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
      // Clean up wizard state
      setIsWaitingForInput(false);
      setDetectedPrompts([]);
      setCurrentPromptIndex(0);
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
        "Output Mismatch",
        `Reason: ${evaluationResult.message}`,
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
      showModal(
        "Saved! 🎉",
        "Submitted successfully. Ready for next challenge?",
        "success",
        () => {
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
        },
        false,
        "Next Problem ➡"
      );
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
          // <button
          //   className="learning-back-btn"
          //   onClick={() => {
          //     setQuestionData(null);
          //     setSelectedExample(null);
          //   }}
          // >
          //   <FaArrowAltCircleLeft size={18} className="back-btn-icon" />
          //   Back to Chapters
          // </button>
          <button
            class="learning-back-btn"
            type="button"
            onClick={() => {
              setQuestionData(null);
              setSelectedExample(null);
            }}
          >
            <div className="icon-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                height="25px"
                width="25px"
              >
                <path
                  d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                  fill="#000000"
                />
                <path
                  d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                  fill="#000000"
                />
              </svg>
            </div>
            <p className="btn-text1">Chapters</p>
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
                  dangerouslySetInnerHTML={{
                    __html: questionData.sampleInput.replace(/\n/g, "<br/>"),
                  }}
                />
              ) : (
                <pre>{questionData.sampleInput || "N/A"}</pre>
              )}
              <h4 className="sample-header">📤 Expected Output:</h4>
              {["html", "css"].includes(langType) ? (
                <div className="preview-box">
                  <iframe
                    ref={expectedOutputIframeRef}
                    title="Exp"
                    className="preview-iframe"
                    scrolling="no"
                    onLoad={resizeIframe}
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
                      onClick={(e) => toggleDropdown(e, "theme")}
                      title="Change Theme"
                    >
                      <FaPalette /> Theme <FaChevronDown size={10} />
                    </button>
                    {activeDropdown === "theme" && (
                      <div
                        className="dropdown-menu-fixed theme-dropdown"
                        style={{
                          top: dropdownPos.top,
                          left: dropdownPos.left,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {availableThemes.map((theme, index) => {
                          // Crude guess for icon based on position in our sorted list
                          // 0,1=L, 2,3=D, 4,5=L, 6,7=D, 8,9=L
                          const isDark = Math.floor(index / 2) % 2 === 1;

                          return (
                            <button
                              key={theme}
                              onClick={() => {
                                setEditorTheme(theme);
                                setActiveDropdown(null);
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
                        onClick={(e) => toggleDropdown(e, "generate")}
                        title="Generate Boilerplate Code"
                      >
                        <FaMagic /> Generate <FaChevronDown size={10} />
                      </button>
                      {activeDropdown === "generate" && (
                        <div
                          className="dropdown-menu-fixed generate-dropdown"
                          style={{
                            top: dropdownPos.top,
                            left: dropdownPos.left,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
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
                  minLines: isFullScreen ? 30 : 25,
                  maxLines: isFullScreen ? 30 : 25,
                }}
                style={{ borderRadius: "8px" }} // Ace editor style prop specific
                className="ace-editor-wrapper"
              />

              {showOutput && (
                <div className="output-box-container">
                  <h4>🧾Output/Preview:</h4>
                  {isWaitingForInput ? (
                    /* Sequential Terminal Input Wizard */
                    <div
                      className="console-input-overlay"
                      style={{
                        padding: "15px",
                        backgroundColor: "#fff",
                        color: "#000", // Black text
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        marginBottom: "15px",
                        fontFamily: "monospace",
                        minHeight: "150px",
                        fontWeight: "bold", // Bold
                        fontSize: "18px", // 18px
                      }}
                    >
                      <h4 style={{ color: "#000", marginBottom: "10px" }}>
                        Interactive Input:
                      </h4>

                      {/* History */}
                      {detectedPrompts.map((prompt, idx) => {
                        if (idx < currentPromptIndex) {
                          return (
                            <div
                              key={idx}
                              style={{ marginBottom: "5px", opacity: 0.7 }}
                            >
                              <span>{prompt} </span>
                              <strong>{promptValues[idx]}</strong>
                            </div>
                          );
                        }
                        return null;
                      })}

                      {/* Active Input */}
                      {currentPromptIndex < detectedPrompts.length && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span>{detectedPrompts[currentPromptIndex]} </span>
                          <input
                            autoFocus
                            type="text"
                            disabled={isRunning}
                            style={{
                              flex: 1,
                              marginLeft: "10px",
                              border: "none",
                              borderBottom: "1px solid #000",
                              outline: "none",
                              fontFamily: "monospace",
                              fontSize: "18px", // 18px
                              fontWeight: "bold", // Bold
                              color: "#000",
                            }}
                            value={promptValues[currentPromptIndex] || ""}
                            onChange={(e) =>
                              setPromptValues({
                                ...promptValues,
                                [currentPromptIndex]: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !isRunning) {
                                const nextIndex = currentPromptIndex + 1;
                                if (nextIndex < detectedPrompts.length) {
                                  setCurrentPromptIndex(nextIndex);
                                } else {
                                  // Execute
                                  const inputs = detectedPrompts.map(
                                    (_, k) => promptValues[k] || ""
                                  );
                                  // Capture last value explicitly
                                  inputs[currentPromptIndex] = e.target.value;

                                  // Pass inputs to handleEvaluateCode
                                  handleEvaluateCode(inputs.join("\n"));
                                }
                              }
                            }}
                          />
                        </div>
                      )}
                      {/* Loading Indicator */}
                      {isRunning && (
                        <div
                          style={{
                            marginTop: "15px",
                            color: "#0000FF", // Blue
                            fontWeight: "bold",
                            fontFamily: "monospace",
                          }}
                        >
                          Codepulse-R generating Output.......
                        </div>
                      )}
                    </div>
                  ) : /* Existing Output Logic */
                  isCodepad ? (
                    <iframe
                      ref={actualOutputIframeRef}
                      title="Preview"
                      srcDoc={output}
                      className="output-preview-iframe"
                      scrolling="no"
                      onLoad={resizeIframe}
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
      <div className="course-header-row">
        {/* <button className="learning-back-btn" onClick={handleBackToDashboard}>
          <FaArrowAltCircleLeft size={18} style={{ marginRight: "1px" }} />
          Back to Courses
        </button> */}
        <button
          class="learning-back-btn"
          type="button"
          onClick={handleBackToDashboard}
        >
          <div className="icon-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              height="25px"
              width="25px"
            >
              <path
                d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                fill="#000000"
              />
              <path
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                fill="#000000"
              />
            </svg>
          </div>
          <p className="btn-text1">Courses</p>
        </button>
        {/* <span className="course-title-text">{selectedCourse} Course</span> */}
      </div>

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
                  <h4>{chapter.title}</h4>
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
                            Exercise {exerciseNum}: &emsp;
                            <span className="exercise-description">
                              {exercise.description}
                            </span>
                          </h4>
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
        {/* {renderCourseProgress()} */}
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
