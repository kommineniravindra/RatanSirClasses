import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AceEditor from "react-ace";
import SEO from "./SEO";
import ace from "ace-builds";
import axios from "axios";
import {
  FaPlay,
  FaExpand,
  FaCompress,
  FaCode,
  FaTerminal,
  FaMagic,
  FaChevronDown,
  FaPalette,
  FaCheck,
  FaMoon,
  FaSun,
  FaHtml5,
  FaCss3Alt,
  FaJava,
  FaPython,
  FaJs,
  FaDatabase,
  FaCog,
  FaDownload,
  FaFileCode,
  FaEquals,
  FaKeyboard,
} from "react-icons/fa";
import {
  SiC,
  SiCplusplus,
  SiDotnet,
  SiTypescript,
  SiKotlin,
  SiGo,
  SiRust,
  SiScala,
  SiSwift,
  SiRuby,
  SiPhp,
  SiGnubash,
  SiDart,
  SiR,
} from "react-icons/si";
import "../css/Compiler.css";
import BrowserPreview from "./BrowserPreview";
import javaSnippets from "../utils/javaSnippets";
import { htmlSnippets } from "../utils/htmlSnippets";
import { executeSqlCommands, sqlSnippets } from "../utils/sqllogic";
import { generateJavaCode } from "../utils/javaCodeGenerator";
import { availableThemes } from "../utils/editorThemes";
import { languageBoilerplates } from "../utils/languageBoilerplates";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { downloadCompilerPdf, PdfPrintLayout } from "../utils/pdfUtils";

// Language Logic Imports
import {
  checkForJavaInput,
  runJavaCode,
  analyzeJavaPrompts,
} from "../utils/javalogic";
import { checkForPythonInput, runPythonCode } from "../utils/pythonlogic";
import {
  checkForJavascriptInput,
  runJavascriptCode,
} from "../utils/javascriptlogic";
import { runHtmlCode } from "../utils/htmllogic";
import { runCssCode } from "../utils/csslogic";

import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-scala";
import "ace-builds/src-noconflict/mode-swift";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/mode-dart";
import "ace-builds/src-noconflict/mode-r";
import "ace-builds/src-noconflict/theme-monokai";
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

const OnlineCompiler = ({ initialLanguage }) => {
  const { lang: paramLang } = useParams();
  const navigate = useNavigate();

  // Legacy support for ?lang= query param (redirect or use)
  const getUrlParam = (name) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
  };
  const queryLang = getUrlParam("lang");

  // Effective language comes from URL param (preferred), query param, prop, or storage
  const effectiveLang = paramLang || queryLang;

  const [code, setCode] = useState(() => {
    return (
      localStorage.getItem("onlineCompiler_code") || languageBoilerplates.Java
    );
  });
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(() => {
    // Priority: Prop > URL Query > LocalStorage > Default
    return (
      initialLanguage ||
      effectiveLang ||
      localStorage.getItem("onlineCompiler_language") ||
      "java"
    );
  });

  useEffect(() => {
    // Handle Prop Changes (Internal Navigation)
    if (initialLanguage) {
      setLanguage(initialLanguage);
      const langObj = languages.find((l) => l.apiLang === initialLanguage);
      if (langObj) setMode(langObj.mode);
    }
    // Handle URL Params (Direct Access / New Tab)
    else if (effectiveLang) {
      setLanguage(effectiveLang);
      const langObj = languages.find((l) => l.apiLang === effectiveLang);
      if (langObj) setMode(langObj.mode);
    }
  }, [initialLanguage, effectiveLang]);
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("onlineCompiler_mode") || "java";
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50);
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [detectedPrompts, setDetectedPrompts] = useState([]);
  const [promptValues, setPromptValues] = useState({});
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [consoleFontSize, setConsoleFontSize] = useState(14);

  // Settings dropdown state
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const settingsDropdownRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const newWidth = (e.clientX / containerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setEditorWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Local Storage Effects
  useEffect(() => {
    localStorage.setItem("onlineCompiler_code", code);
  }, [code]);

  useEffect(() => {
    localStorage.setItem("onlineCompiler_language", language);
    localStorage.setItem("onlineCompiler_mode", mode);
  }, [language, mode]);

  // Force Font Size Update
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setFontSize(fontSize);
    }
  }, [fontSize]);

  // Theme & Generation State
  const [editorTheme, setEditorTheme] = useState("monokai");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const themeDropdownRef = useRef(null);
  const generateDropdownRef = useRef(null);
  const editorRef = useRef(null);

  const containerRef = useRef(null);

  // --- Dynamic Fixed Positioning State ---
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Helper to toggle dropdowns with fixed positioning
  const toggleDropdown = (e, dropdownName) => {
    e.stopPropagation();
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    setDropdownPos({
      top: rect.bottom + 8,
      left: rect.left - 150, // Shift left to keep it on screen
    });
    setActiveDropdown(dropdownName);
  };

  // Close ALL dropdowns on window click or scroll
  useEffect(() => {
    const closeAll = () => setActiveDropdown(null);
    window.addEventListener("click", closeAll);
    window.addEventListener("scroll", closeAll, true); // Capture phase to catch any scroll
    return () => {
      window.removeEventListener("click", closeAll);
      window.removeEventListener("scroll", closeAll, true);
    };
  }, []);

  const languages = [
    {
      name: "HTML",
      mode: "html",
      apiLang: "html",
      icon: <FaHtml5 />,
      color: "#E34F26",
    },
    {
      name: "CSS",
      mode: "html",
      apiLang: "css",
      icon: <FaCss3Alt />,
      color: "#1572B6",
    },
    {
      name: "Java",
      mode: "java",
      apiLang: "java",
      icon: <FaJava />,
      color: "#007396",
    },

    {
      name: "C",
      mode: "c_cpp",
      apiLang: "c",
      icon: <SiC />,
      color: "#0075faff",
    },
    {
      name: "C#",
      mode: "csharp",
      apiLang: "csharp",
      icon: <SiDotnet />,
      color: "#512BD4",
    },

    {
      name: "Kotlin",
      mode: "kotlin",
      apiLang: "kotlin",
      icon: <SiKotlin />,
      color: "#7F52FF",
    },

    {
      name: "Go",
      mode: "golang",
      apiLang: "go",
      icon: <SiGo />,
      color: "#00ADD8",
    },
    {
      name: "PHP",
      mode: "php",
      apiLang: "php",
      icon: <SiPhp />,
      color: "#777BB4",
    },
    {
      name: "Bash",
      mode: "sh",
      apiLang: "bash",
      icon: <SiGnubash />,
      color: "#4EAA25",
    },
    {
      name: "R",
      mode: "r",
      apiLang: "r",
      icon: <SiR />,
      color: "#276DC3",
    },
    {
      name: "JavaScript",
      mode: "javascript",
      apiLang: "javascript",
      icon: <FaJs />,
      color: "#F7DF1E",
    },

    {
      name: "Python",
      mode: "python",
      apiLang: "python",
      icon: <FaPython />,
      color: "#3776AB",
    },
    {
      name: "SQL",
      mode: "sql",
      apiLang: "sql",
      icon: <FaDatabase />,
      color: "#003B57",
    },

    {
      name: "C++",
      mode: "c_cpp",
      apiLang: "cpp",
      icon: <SiCplusplus />,
      color: "#00599C",
    },

    {
      name: "TypeScript",
      mode: "typescript",
      apiLang: "typescript",
      icon: <SiTypescript />,
      color: "#3178C6",
    },

    {
      name: "Rust",
      mode: "rust",
      apiLang: "rust",
      icon: <SiRust />,
      color: "#DEA584",
    },
    {
      name: "Scala",
      mode: "scala",
      apiLang: "scala",
      icon: <SiScala />,
      color: "#DC322F",
    },
    {
      name: "Swift",
      mode: "swift",
      apiLang: "swift",
      icon: <SiSwift />,
      color: "#F05138",
    },
    {
      name: "Ruby",
      mode: "ruby",
      apiLang: "ruby",
      icon: <SiRuby />,
      color: "#CC342D",
    },
    {
      name: "Dart",
      mode: "dart",
      apiLang: "dart",
      icon: <SiDart />,
      color: "#0175C2",
    },
  ];

  const handleLanguageChange = (langObj) => {
    const lang = langObj.apiLang;

    // Navigate to the SEO-friendly URL
    navigate(`/online-compiler/${lang}`);

    setLanguage(lang);
    setMode(langObj.mode);

    let newCode = "";
    if (lang === "css") {
      newCode = languageBoilerplates.CSS_Wrapper;
    } else {
      // Keys in utils: HTML, CSS, JavaScript, Java, Python, SQL, c, cpp, CSS_Wrapper
      const keyMap = {
        html: "HTML",
        css: "CSS",
        javascript: "JavaScript",
        java: "Java",
        python: "Python",
        sql: "SQL",
        c: "c",
        cpp: "cpp",
        csharp: "csharp",
        dotnet: "csharp",
        typescript: "TypeScript",
        kotlin: "Kotlin",
        go: "Go",
        rust: "Rust",
        scala: "Scala",
        swift: "Swift",
        ruby: "Ruby",
        php: "PHP",
        bash: "Bash",
      };

      // Check if sqlite3 matches keyMap
      const mappedKey = keyMap[lang];
      newCode = languageBoilerplates[mappedKey] || "";
    }
    setCode(newCode);
    setOutput("");
  };

  const sqlDbRef = useRef(null);

  // SQL initialization removed - Switched to AlaSQL (Dynamic import in implementation)

  const handleDownloadPdf = () => {
    downloadCompilerPdf(language);
  };

  const checkForInput = (code, lang) => {
    if (!code) return false;
    if (lang === "java") {
      return checkForJavaInput(code);
    }
    if (lang === "python") {
      return checkForPythonInput(code);
    }
    if (lang === "javascript") {
      return checkForJavascriptInput(code);
    }
    // Legacy/Fallback Checks
    const c = code;
    if (lang === "cpp" || lang === "c")
      return c.includes("cin") || c.includes("scanf");
    if (lang === "csharp") return c.includes("Console.ReadLine");
    return false;
  };

  const executeCode = async (stdinValue = "") => {
    localStorage.setItem("onlineCompiler_code", code);
    setIsLoading(true);
    setOutput("");
    setIsError(false);
    // REMOVED: setIsWaitingForInput(false); -- Keep waiting/input state visible during load

    // Special handling for HTML/CSS
    if (language === "html" || language === "css") {
      let content = code;
      if (language === "html") {
        content = runHtmlCode(code).output;
      } else {
        content = runCssCode(code).output;
      }
      setOutput(content);
      setIsLoading(false);
      setIsWaitingForInput(false); // Reset here
      return;
    }

    // Special handling for SQL (AlaSQL - MySQL/Oracle simulation)
    if (language === "sql") {
      executeSqlCommands(
        code,
        editorRef,
        setOutput,
        setIsError,
        setIsLoading,
        setIsWaitingForInput
      );
      return;
    }

    // Determine Piston API language and version
    let apiLanguage = language;
    let version = "*"; // Use the latest stable version

    // Piston API uses 'c' for C and 'cpp' for C++
    if (apiLanguage === "c") apiLanguage = "c";
    else if (apiLanguage === "cpp") apiLanguage = "cpp";

    try {
      // 1. Check for Extracted Logic (Java, Python, JS)
      if (["java", "python", "javascript"].includes(apiLanguage)) {
        let result = { output: "", isError: false };

        if (apiLanguage === "java") {
          result = await runJavaCode(code, stdinValue);
        } else if (apiLanguage === "python") {
          result = await runPythonCode(code, stdinValue);
        } else if (apiLanguage === "javascript") {
          result = await runJavascriptCode(code, stdinValue);
        }

        let finalOutput = result.output;

        // Smart Output Formatting: Inject user inputs back for "Terminal Echo" look
        if (detectedPrompts.length > 0) {
          detectedPrompts.forEach((prompt, index) => {
            const userVal = promptValues[index] || "";
            if (finalOutput.includes(prompt)) {
              finalOutput = finalOutput.replace(
                prompt,
                prompt + " " + userVal + "\n"
              );
            }
          });
        }

        setOutput(finalOutput);
        setIsError(result.isError);
      } else {
        // 2. Fallback for C, C++, C#, etc. (Original Logic)
        let codeToSend = code;
        const fileData = { content: codeToSend };
        const response = await axios.post(
          "https://emkc.org/api/v2/piston/execute",
          {
            language: apiLanguage,
            version: version,
            files: [fileData],
            stdin: stdinValue,
          }
        );
        const { run } = response.data;
        setOutput(run.output);
        if (run.code !== 0 && run.stderr) {
          setIsError(true);
        }
      }
    } catch (error) {
      console.error("Execution error:", error);
      setIsError(true);
      setOutput(
        "Error executing code.\n" +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
      setIsWaitingForInput(false); // Reset here
    }
  };

  const analyzeInputPrompts = (code) => {
    if (!code) return [];
    if (language === "java") {
      return analyzeJavaPrompts(code);
    }
    return [];
  };

  const handleRun = () => {
    // 1. Check for specific prompts (Smart Simulation)
    const prompts = analyzeInputPrompts(code);
    if (prompts.length > 0) {
      setDetectedPrompts(prompts);
      setPromptValues({});
      setCurrentPromptIndex(0); // Start at first prompt
      setIsWaitingForInput(true);
      setOutput("");
      return;
    }

    // 2. Fallback: Generic Input Check
    if (checkForInput(code, language)) {
      setDetectedPrompts([]); // No specific prompts found
      setIsWaitingForInput(true);
      setUserInput("");
      setOutput("Program requires input. Please enter values below...");
    } else {
      executeCode("");
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullScreen(true);
        })
        .catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
        });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  // Close dropdowns when clicking outside
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
      if (
        settingsDropdownRef.current &&
        !settingsDropdownRef.current.contains(event.target)
      ) {
        setShowSettingsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

        // Handle Import Injection
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

        // Insert Snippet
        ace
          .require("ace/snippets")
          .snippetManager.insertSnippet(editor, data.snippet);
      },
    };

    // 3. Register Completer
    const langTools = ace.require("ace/ext/language_tools");
    if (langTools) {
      langTools.addCompleter(customCompleter);
    }
  };

  const generateCode = (type) => {
    setActiveDropdown(null);

    let cursorIndex = -1;
    if (editorRef.current) {
      const pos = editorRef.current.getCursorPosition();
      cursorIndex = editorRef.current.session.doc.positionToIndex(pos);
    }

    const result = generateJavaCode(code, type, cursorIndex);
    if (result.success) {
      setCode(result.newCode);
    } else {
      Swal.fire("Info", result.message || "Could not generate code.", "info");
    }
  };

  const isWebLanguage = language === "html" || language === "css";

  return (
    <main className="compiler-container" ref={containerRef}>
      <SEO
        title={`Online ${
          language
            ? language.charAt(0).toUpperCase() + language.slice(1)
            : "Code"
        } Compiler – Run ${
          language
            ? language.charAt(0).toUpperCase() + language.slice(1)
            : "Code"
        } Code Online`}
        description={`Run ${
          language
            ? language.charAt(0).toUpperCase() + language.slice(1)
            : "Code"
        } programs online with our free ${language} compiler. Write, edit, and execute code instantly.`}
        keywords={`online ${language} compiler, run ${language} code online, free ${language} ide, learn ${language} programming`}
      />
      {!isFullScreen && (
        <header className="compiler-header">
          <div className="compiler-nav">
            {languages.map((lang) => {
              const isActive = language === lang.apiLang;
              return (
                <button
                  key={lang.name}
                  onClick={() => handleLanguageChange(lang)}
                  className={`compiler-lang-btn ${isActive ? "active" : ""}`}
                >
                  <span className="lang-icon">
                    {React.cloneElement(lang.icon, {
                      style: { color: isActive ? "#fff" : lang.color },
                    })}
                  </span>
                  {lang.name}
                </button>
              );
            })}
          </div>
        </header>
      )}

      <div className="compiler-main">
        {/* Editor Section */}
        <div
          className="compiler-section"
          style={{ flex: `0 0 ${editorWidth}%` }}
        >
          <div className="section-header1">
            <h3 className="section-title12">
              {(() => {
                const currentLang = languages.find(
                  (l) => l.apiLang === language
                );
                return (
                  <>
                    {currentLang ? (
                      <span className="lang-icon lang-icon-header">
                        {React.cloneElement(currentLang.icon, {
                          style: { color: currentLang.color },
                        })}
                      </span>
                    ) : (
                      <FaCode />
                    )}
                    ({currentLang ? currentLang.name : language})
                  </>
                );
              })()}
            </h3>

            <div className="compiler-controls">
              {/* Settings Dropdown */}
              <div className="oc-dropdown-container" ref={settingsDropdownRef}>
                <button
                  className="btn-compiler btn-font-toggle"
                  onClick={(e) => toggleDropdown(e, "settings")}
                  title="Editor Settings"
                >
                  <FaCog />
                  <span className="btn-text">Fonts</span>
                  <FaChevronDown size={10} />
                </button>
                {activeDropdown === "settings" && (
                  <div
                    className="oc-dropdown-menu-fixed settings-menu dropdown-fixed-position"
                    style={{
                      top: dropdownPos.top,
                      left: dropdownPos.left,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Font Size Row */}
                    <div className="settings-row">
                      <span className="settings-label">Font Size</span>
                      <div className="settings-controls">
                        <button
                          className="btn-compiler btn-font-size"
                          onClick={() =>
                            setFontSize((prev) => Math.max(10, prev - 1))
                          }
                        >
                          -
                        </button>
                        <span className="font-size-value">{fontSize}</span>
                        <button
                          className="btn-compiler btn-font-size"
                          onClick={() =>
                            setFontSize((prev) => Math.min(35, prev + 1))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* Style Row */}
                    <div className="settings-row">
                      <span className="settings-label">Style</span>
                      <div className="settings-controls">
                        <button
                          className={`btn-compiler btn-icon-square ${
                            isBold ? "active" : ""
                          }`}
                          onClick={() => setIsBold(!isBold)}
                          title="Toggle Bold"
                        >
                          B
                        </button>

                        <button
                          className={`btn-compiler btn-icon-square ${
                            isItalic ? "active" : ""
                          }`}
                          onClick={() => setIsItalic(!isItalic)}
                          title="Toggle Italic"
                        >
                          I
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Dropdown */}
              <div className="oc-dropdown-container" ref={themeDropdownRef}>
                <button
                  className="btn-compiler btn-theme-toggle"
                  onClick={(e) => toggleDropdown(e, "theme")}
                  title="Change Theme"
                >
                  <FaPalette />
                  <span className="btn-text">Themes</span>
                  <FaChevronDown size={10} />
                </button>
                {activeDropdown === "theme" && (
                  <div
                    className="oc-dropdown-menu-fixed dropdown-fixed-position"
                    style={{
                      top: dropdownPos.top,
                      left: dropdownPos.left,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {availableThemes.map((theme, index) => {
                      const isDark = Math.floor(index / 2) % 2 === 1;
                      return (
                        <button
                          key={theme}
                          onClick={() => {
                            setEditorTheme(theme);
                            setActiveDropdown(null);
                          }}
                          className={`oc-dropdown-item ${
                            editorTheme === theme ? "active-theme" : ""
                          }`}
                        >
                          {isDark ? (
                            <FaMoon color="#fbbf24" />
                          ) : (
                            <FaSun color="#f59e0b" />
                          )}
                          <span className="theme-capitalize">
                            {theme.replace("_", " ")}
                          </span>
                          {editorTheme === theme && (
                            <FaCheck className="active-check-icon" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Generate Dropdown (Java Only) */}
              {language === "java" && (
                <div
                  className="oc-dropdown-container"
                  ref={generateDropdownRef}
                >
                  <button
                    className="btn-compiler btn-code-gen"
                    onClick={(e) => toggleDropdown(e, "generate")}
                    title="Generate Boilerplate Code"
                  >
                    <FaMagic />
                    <span className="btn-text">Code Gen</span>
                    <FaChevronDown size={10} />
                  </button>
                  {activeDropdown === "generate" && (
                    <div
                      className="oc-dropdown-menu-fixed dropdown-menu-gen dropdown-fixed-position"
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
                          icon: <FaFileCode />,
                        },
                        {
                          id: "hashcode-equals",
                          label: "equals() & hashCode()",
                          icon: <FaEquals />,
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => generateCode(item.id)}
                          className="oc-dropdown-item"
                        >
                          {item.icon} {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                className="btn-compiler btn-fullscreen"
                onClick={toggleFullScreen}
                title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullScreen ? <FaCompress /> : <FaExpand />}
              </button>
              <button
                className="btn-compiler btn-run"
                onClick={handleRun}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <FaPlay className="btn-run-icon" />
                )}
                <span className={isLoading ? "" : ""}>
                  {isLoading ? "Running" : "RUN"}
                </span>
              </button>
            </div>
          </div>
          <div className="editor-content">
            <AceEditor
              key={`online-editor-${mode}-${editorTheme}`} // Add key for theme reactivity
              mode={mode}
              theme={editorTheme}
              name="online-compiler-editor"
              onLoad={handleEditorLoad} // Load Snippets
              value={code}
              onChange={setCode}
              editorProps={{ $blockScrolling: true }}
              fontSize={fontSize}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 4,
                fontSize: fontSize,
                showPrintMargin: false,
                fontFamily: "'Fira Code', monospace",
              }}
              style={{
                fontSize: fontSize,
                fontWeight: isBold ? "bold" : "normal",
                fontStyle: isItalic ? "italic" : "normal",
              }}
              className="ace-editor-container ace-editor-custom-style"
            />
          </div>
        </div>

        {/* Resizer */}
        <div
          className="oc-resizer"
          onMouseDown={handleMouseDown}
          title="Drag to resize"
        ></div>

        {/* Output Section */}
        <div className="compiler-section">
          <div className="section-header1">
            <h3 className="section-title12">
              <FaTerminal /> Console
            </h3>
            <div className="console-header-actions">
              <div
                className="console-font-controls"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginRight: "15px",
                }}
              >
                <button
                  className="oc-btn-compiler"
                  onClick={() =>
                    setConsoleFontSize((prev) => Math.max(10, prev - 1))
                  }
                  title="Decrease Font Size"
                >
                  -
                </button>
                <span>{consoleFontSize}px</span>
                <button
                  className="oc-btn-compiler"
                  onClick={() =>
                    setConsoleFontSize((prev) => Math.min(35, prev + 1))
                  }
                  title="Increase Font Size"
                >
                  +
                </button>
              </div>
              <button
                className="oc-btn-compiler"
                onClick={handleDownloadPdf}
                title="Download PDF"
              >
                <FaDownload /> PDF
              </button>
            </div>
          </div>
          <div
            className={`output-content ${isWebLanguage ? "preview-mode" : ""}`}
            style={{ fontSize: `${consoleFontSize}px` }}
          >
            {isWebLanguage ? (
              <div className="preview-container">
                <BrowserPreview htmlCode={output} />
              </div>
            ) : Array.isArray(output) ? (
              <div
                className="sql-result-container sql-result-padding"
                style={{ fontSize: `${consoleFontSize}px` }}
              >
                {output.map((msg, i) => (
                  <div key={i} className="sql-msg-item">
                    {msg.type === "success" && (
                      <div className="sql-success-msg-box">👍 {msg.text}</div>
                    )}
                    {msg.type === "error" && (
                      <div className="error-msg-box">{msg.text}</div>
                    )}
                    {msg.type === "info" && (
                      <div className="info-msg-text">{msg.text}</div>
                    )}
                    {msg.type === "table" && (
                      <div
                        className="table-overflow"
                        style={{ fontSize: "inherit" }}
                      >
                        <table
                          className="sql-table"
                          style={{ fontSize: "inherit" }}
                        >
                          <thead style={{ fontSize: "inherit" }}>
                            <tr style={{ fontSize: "inherit" }}>
                              {msg.data.columns.map((col, idx) => (
                                <th key={idx} style={{ fontSize: "inherit" }}>
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody style={{ fontSize: "inherit" }}>
                            {msg.data.values.map((row, rIdx) => (
                              <tr key={rIdx} style={{ fontSize: "inherit" }}>
                                {row.map((val, cIdx) => {
                                  // Explicitly check for null/undefined to use placeholder
                                  const isNull =
                                    val === null ||
                                    val === undefined ||
                                    (typeof val === "number" && isNaN(val));
                                  return (
                                    <td
                                      key={cIdx}
                                      style={{ fontSize: "inherit" }}
                                    >
                                      {isNull ? (
                                        <span className="null-value">NULL</span>
                                      ) : (
                                        String(val)
                                      )}
                                    </td>
                                  );
                                })}
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
              <div className="output-section-wrapper">
                {/* Run Intercept: Input Overlay */}
                {isWaitingForInput ? (
                  <div
                    className="console-input-overlay"
                    style={{ fontSize: `${consoleFontSize}px` }}
                  >
                    {detectedPrompts.length > 0 ? (
                      <>
                        {/* History: Show previous prompts and values */}
                        {detectedPrompts.map((prompt, index) => {
                          if (index < currentPromptIndex) {
                            return (
                              <div key={index}>
                                <span>{prompt} </span>
                                <span>{promptValues[index]}</span>
                              </div>
                            );
                          }
                          return null;
                        })}

                        {/* Active Input Line */}
                        {currentPromptIndex < detectedPrompts.length && (
                          <div className="prompt-line">
                            <span>{detectedPrompts[currentPromptIndex]} </span>
                            <input
                              autoFocus
                              type="text"
                              disabled={isLoading}
                              className="console-input"
                              value={promptValues[currentPromptIndex] || ""}
                              onChange={(e) =>
                                setPromptValues({
                                  ...promptValues,
                                  [currentPromptIndex]: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !isLoading) {
                                  const nextIndex = currentPromptIndex + 1;
                                  if (nextIndex < detectedPrompts.length) {
                                    setCurrentPromptIndex(nextIndex);
                                  } else {
                                    // All inputs collected, execute
                                    const inputs = detectedPrompts.map(
                                      (_, i) => promptValues[i] || ""
                                    );
                                    // Use event value for safety on last input
                                    inputs[currentPromptIndex] = e.target.value;

                                    executeCode(inputs.join("\n"));
                                  }
                                }
                              }}
                            />
                          </div>
                        )}
                        {/* Loading Indicator inside Terminal */}
                        {isLoading && (
                          <div className="loading-indicator">
                            Codepulse-R generating Output.......
                          </div>
                        )}
                      </>
                    ) : (
                      /* Generic Fallback */
                      <>
                        <p className="input-fallback-text">
                          Program requires input. Enter values below:
                        </p>
                        <textarea className="console-input-area console-input-textarea" />
                        <button
                          className="btn-compiler btn-execute"
                          onClick={() => executeCode(userInput)}
                        >
                          <FaPlay className="btn-execute-icon" /> Execute Code
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  /* Standard Output */
                  <pre
                    className={`output-pre ${
                      isError ? "error-text" : ""
                    } output-pre-styled`}
                    style={{ fontSize: `${consoleFontSize}px` }}
                  >
                    {isLoading ? (
                      <span className="loading-dots">
                        Codepulse-R generating Output
                      </span>
                    ) : (
                      output ||
                      "Codepulse-R generating output will appear here..."
                    )}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Footer Branding */}
      </div>

      <ToastContainer position="top-right" theme="light" />

      {/* Unified PDF Print Layout */}
      <PdfPrintLayout
        code={code}
        language={language}
        output={output}
        userName={localStorage.getItem("userName") || "Guest"}
      />
    </main>
  );
};

export default OnlineCompiler;
