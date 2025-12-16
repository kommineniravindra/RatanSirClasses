import React, { useState, useEffect, useRef } from "react";
import AceEditor from "react-ace";
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
  FaCog, // Added
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
} from "react-icons/si";
import { FaBold, FaItalic } from "react-icons/fa";
import "../css/Compiler.css";
import BrowserPreview from "./BrowserPreview";
import javaSnippets from "../utils/javaSnippets";
import sqlSnippets from "../utils/sqlSnippets";
import { generateJavaCode } from "../utils/javaCodeGenerator";
import { availableThemes } from "../utils/editorThemes";
import { languageBoilerplates } from "../utils/languageBoilerplates";
import Swal from "sweetalert2";

// Import new modes for C/C++
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/mode-c_cpp"; // C/C++ mode
import "ace-builds/src-noconflict/mode-csharp"; // C# mode
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-scala";
import "ace-builds/src-noconflict/theme-monokai"; // Default theme
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

// WASM URL for sql.js
const SQL_WASM_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm";

const OnlineCompiler = () => {
  const [code, setCode] = useState(() => {
    return (
      localStorage.getItem("onlineCompiler_code") || languageBoilerplates.Java
    );
  });
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("onlineCompiler_language") || "java";
  });
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("onlineCompiler_mode") || "java";
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50); // Percentage
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isError, setIsError] = useState(false);

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

  // Theme & Generation State
  const [editorTheme, setEditorTheme] = useState("monokai");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const themeDropdownRef = useRef(null);
  const generateDropdownRef = useRef(null);
  const editorRef = useRef(null);

  const containerRef = useRef(null);

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
      apiLang: "sqlite3",
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
  ];

  const handleLanguageChange = (langObj) => {
    const lang = langObj.apiLang;
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
        sqlite3: "SQL", // apiLang for sql is sqlite3 in some contexts, or sql in others. The languages array uses 'sql' for name but what about apiLang?
        sql: "SQL", // let's support both
        c: "c",
        cpp: "cpp",
        csharp: "csharp",
        csharp: "csharp",
        dotnet: "csharp",
        typescript: "TypeScript",
        kotlin: "Kotlin",
        go: "Go",
        rust: "Rust",
        scala: "Scala",
      };

      // Check if sqlite3 matches keyMap
      const mappedKey = keyMap[lang];
      newCode = languageBoilerplates[mappedKey] || "";
    }
    setCode(newCode);
    setOutput("");
  };

  const sqlDbRef = useRef(null);

  // Initialize SQL.js on load via CDN to avoid Webpack 5 Polyfill errors
  useEffect(() => {
    const loadSql = async () => {
      // Check if already loaded
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

  const handleRun = async () => {
    localStorage.setItem("onlineCompiler_code", code);
    setIsLoading(true);
    setOutput("");
    setIsError(false);

    // Special handling for HTML/CSS
    if (language === "html" || language === "css") {
      setOutput(code);
      setIsLoading(false);
      return;
    }

    // Special handling for SQL (Local Execution)
    if (language === "sql" || language === "sqlite3") {
      if (!sqlDbRef.current) {
        setOutput("Initializing SQL Database... try again in a moment.");
        setIsLoading(false);
        return;
      }

      try {
        const db = sqlDbRef.current;

        let codeToExecute = code;
        // Check for selection
        if (editorRef.current) {
          const selectedText = editorRef.current.getSelectedText();
          if (selectedText && selectedText.trim().length > 0) {
            codeToExecute = selectedText;
          }
        }

        // Remove comments (Block /*...*/ and Line --)
        const sanitizedCode = codeToExecute
          .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
          .split("\n")
          .map((line) => {
            const idx = line.indexOf("--");
            return idx >= 0 ? line.substring(0, idx) : line;
          })
          .join("\n");

        // Split commands by semicolon to handle multiple statements
        const commands = sanitizedCode
          .split(";")
          .filter((c) => c.trim().length > 0);

        let lastResult = null;
        let messages = [];

        for (let cmd of commands) {
          try {
            const res = db.exec(cmd);
            // res is an array of results [{columns, values}]

            const trimmedCmd = cmd.trim();
            const lowerCmd = trimmedCmd.toLowerCase();

            if (lowerCmd.startsWith("create table")) {
              const match = trimmedCmd.match(
                /create\s+table\s+(?:if\s+not\s+exists\s+)?["`]?([^\s("`]+)/i
              );
              const tableName = match ? match[1] : "Table";
              messages.push({
                type: "success",
                text: `Table '${tableName}' created successfully.`,
              });
            } else if (lowerCmd.startsWith("drop table")) {
              const match = trimmedCmd.match(
                /drop\s+table\s+(?:if\s+exists\s+)?["`]?([^\s("`]+)/i
              );
              const tableName = match ? match[1] : "Table";
              messages.push({
                type: "success",
                text: `Table '${tableName}' dropped successfully.`,
              });
            } else if (lowerCmd.startsWith("insert into")) {
              const match = trimmedCmd.match(
                /insert\s+into\s+["`]?([^\s("`]+)/i
              );
              const tableName = match ? match[1] : "table";
              messages.push({
                type: "success",
                text: `Values inserted into '${tableName}' successfully.`,
              });
            } else if (lowerCmd.startsWith("update")) {
              const match = trimmedCmd.match(/update\s+["`]?([^\s("`]+)/i);
              const tableName = match ? match[1] : "table";
              messages.push({
                type: "success",
                text: `Table '${tableName}' updated successfully.`,
              });
            } else if (lowerCmd.startsWith("delete from")) {
              const match = trimmedCmd.match(
                /delete\s+from\s+["`]?([^\s("`]+)/i
              );
              const tableName = match ? match[1] : "table";
              messages.push({
                type: "success",
                text: `Rows deleted from '${tableName}' successfully.`,
              });
            } else if (lowerCmd.startsWith("select")) {
              if (res.length > 0) {
                messages.push({ type: "table", data: res[0] });
              } else {
                messages.push({
                  type: "info",
                  text: "Query returned no results.",
                });
              }
            } else {
              // Other commands
              if (res.length > 0)
                messages.push({ type: "table", data: res[0] });
              else
                messages.push({
                  type: "success",
                  text: "Command executed successfully.",
                });
            }
          } catch (e) {
            messages.push({ type: "error", text: `Error: ${e.message}` });
            setIsError(true);
          }
        }

        // If we have collected structured messages, set Output to that array
        // Otherwise fallback to text
        if (messages.length > 0) {
          setOutput(messages);
        } else {
          setOutput("Executed successfully.");
        }
      } catch (err) {
        console.error(err);
        setOutput(`SQL Error: ${err.message}`);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Determine Piston API language and version
    let apiLanguage = language;
    let version = "*"; // Use the latest stable version

    // Piston API uses 'c' for C and 'cpp' for C++
    if (apiLanguage === "c") apiLanguage = "c";
    else if (apiLanguage === "cpp") apiLanguage = "cpp";

    try {
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language: apiLanguage,
          version: version,
          files: [{ content: code }],
        }
      );
      const { run } = response.data;
      setOutput(run.output);
      if (run.code !== 0) {
        setIsError(true);
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

        // 3. Insert Snippet
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
    setShowGenerateDropdown(false);
    const result = generateJavaCode(code, type);
    if (result.success) {
      setCode(result.newCode);
    } else {
      Swal.fire("Info", result.message || "Could not generate code.", "info");
    }
  };

  const isWebLanguage = language === "html" || language === "css";

  return (
    <div className="compiler-container" ref={containerRef}>
      <header className="compiler-header">
        {/* Left: Branding */}
        <div className="header-left">
          <span className="animated-title-3d main-title">CodePulse-R</span>
          <span className="animated-title-3d slogan">Online Compiler's</span>
        </div>

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

      <div className="compiler-main">
        {/* Editor Section */}
        <div
          className="compiler-section"
          style={{ flex: `0 0 ${editorWidth}%` }}
        >
          <div className="section-header">
            <h3 className="section-title">
              {(() => {
                const currentLang = languages.find(
                  (l) => l.apiLang === language
                );
                return (
                  <>
                    {currentLang ? (
                      <span
                        className="lang-icon"
                        style={{
                          marginRight: "3px",
                          display: "inline-flex",
                          alignItems: "center",
                          fontSize: "1.5rem",
                        }}
                      >
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
              <div className="dropdown-container" ref={settingsDropdownRef}>
                <button
                  className="btn-compiler btn-font-toggle"
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  title="Editor Settings"
                >
                  <FaCog />
                  <span className="btn-text">Fonts</span>
                  <FaChevronDown size={10} />
                </button>
                {showSettingsDropdown && (
                  <div className="dropdown-menu settings-menu">
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
                          <FaBold size={12} />
                        </button>
                        <button
                          className={`btn-compiler btn-icon-square ${
                            isItalic ? "active" : ""
                          }`}
                          onClick={() => setIsItalic(!isItalic)}
                          title="Toggle Italic"
                        >
                          <FaItalic size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Dropdown */}
              <div className="dropdown-container" ref={themeDropdownRef}>
                <button
                  className="btn-compiler btn-theme-toggle"
                  onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                  title="Change Theme"
                >
                  <FaPalette />
                  <span className="btn-text">Themes</span>
                  <FaChevronDown size={10} />
                </button>
                {showThemeDropdown && (
                  <div className="dropdown-menu">
                    {availableThemes.map((theme, index) => {
                      const isDark = Math.floor(index / 2) % 2 === 1;
                      return (
                        <button
                          key={theme}
                          onClick={() => {
                            setEditorTheme(theme);
                            setShowThemeDropdown(false);
                          }}
                          className={`dropdown-item ${
                            editorTheme === theme ? "active-theme" : ""
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

              {/* Generate Dropdown (Java Only) */}
              {language === "java" && (
                <div className="dropdown-container" ref={generateDropdownRef}>
                  <button
                    className="btn-compiler btn-code-gen"
                    onClick={() =>
                      setShowGenerateDropdown(!showGenerateDropdown)
                    }
                    title="Generate Boilerplate Code"
                  >
                    <FaMagic />
                    <span className="btn-text">Code Gen</span>
                    <FaChevronDown size={10} />
                  </button>
                  {showGenerateDropdown && (
                    <div
                      className="dropdown-menu"
                      style={{ minWidth: "200px" }}
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
                  <FaPlay style={{ marginRight: "1px" }} />
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
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 4,
                showLineNumbers: true,
                tabSize: 4,
                fontSize: fontSize,
                showPrintMargin: false,
                fontFamily: "'Fira Code', monospace",
              }}
              style={{
                width: "100%",
                height: "100%",
                fontWeight: isBold ? "bold" : "normal",
                fontStyle: isItalic ? "italic" : "normal",
              }}
              className="ace-editor-container"
            />
          </div>
        </div>

        {/* Resizer */}
        <div
          className="resizer"
          onMouseDown={handleMouseDown}
          title="Drag to resize"
        ></div>

        {/* Output Section */}
        <div className="compiler-section">
          <div className="section-header">
            <h3 className="section-title">
              <FaTerminal /> Console
            </h3>
          </div>
          <div
            className={`output-content ${isWebLanguage ? "preview-mode" : ""}`}
          >
            {isWebLanguage ? (
              <div className="preview-container">
                <BrowserPreview htmlCode={output} />
              </div>
            ) : Array.isArray(output) ? (
              <div className="sql-result-container" style={{ padding: "20px" }}>
                {output.map((msg, i) => (
                  <div key={i} style={{ marginBottom: "16px" }}>
                    {msg.type === "success" && (
                      <div
                        style={{
                          color: "#047857",
                          padding: "10px",
                          background: "#ecfdf5",
                          border: "1px solid #6ee7b7",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontWeight: "600",
                        }}
                      >
                        👍 {msg.text}
                      </div>
                    )}
                    {msg.type === "error" && (
                      <div
                        style={{
                          color: "#ef4444",
                          padding: "10px",
                          background: "#fef2f2",
                          border: "1px solid #fca5a5",
                          borderRadius: "8px",
                        }}
                      >
                        {msg.text}
                      </div>
                    )}
                    {msg.type === "info" && (
                      <div style={{ color: "#64748b", fontStyle: "italic" }}>
                        {msg.text}
                      </div>
                    )}
                    {msg.type === "table" && (
                      <div style={{ overflowX: "auto" }}>
                        <table className="sql-table">
                          <thead>
                            <tr>
                              {msg.data.columns.map((col, idx) => (
                                <th key={idx}>{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {msg.data.values.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((val, cIdx) => (
                                  <td key={cIdx}>{val}</td>
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
              <pre className={`output-pre ${isError ? "error-text" : ""}`}>
                {isLoading ? (
                  <span className="loading-dots">
                    Codepulse-R generating Output
                  </span>
                ) : (
                  output || "Codepulse-R generating output will appear here..."
                )}
              </pre>
            )}
          </div>
        </div>
        {/* Footer Branding */}
      </div>
    </div>
  );
};

export default OnlineCompiler;
