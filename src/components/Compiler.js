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
  FaCog, // Added
  FaBold, // Added
  FaItalic, // Added
} from "react-icons/fa"; // Import icons
import "../css/Compiler.css"; // Import new CSS
import BrowserPreview from "./BrowserPreview";
import javaSnippets from "../utils/javaSnippets";
import sqlSnippets from "../utils/sqlSnippets";
import { generateJavaCode } from "../utils/javaCodeGenerator";
import { availableThemes } from "../utils/editorThemes";
import Swal from "sweetalert2";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sql";
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

// WASM URL for sql.js reference
const SQL_WASM_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm";

const Compiler = () => {
  const [code, setCode] = useState(() => {
    return localStorage.getItem("compiler_code") || "";
  });
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("compiler_language") || "java";
  });
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("compiler_mode") || "java";
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50); // Percentage
  const [fontSize, setFontSize] = useState(16);

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
    localStorage.setItem("compiler_code", code);
  }, [code]);

  useEffect(() => {
    localStorage.setItem("compiler_language", language);
    localStorage.setItem("compiler_mode", mode);
  }, [language, mode]);
  const [editorTheme, setEditorTheme] = useState("monokai");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const themeDropdownRef = useRef(null);
  const generateDropdownRef = useRef(null);
  const editorRef = useRef(null);
  const settingsDropdownRef = useRef(null); // Added
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false); // Added
  const [isBold, setIsBold] = useState(false); // Added
  const [isItalic, setIsItalic] = useState(false); // Added

  const containerRef = useRef(null);
  const sqlDbRef = useRef(null);

  // Initialize SQL.js on load via CDN
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

  useEffect(() => {
    const savedCode = localStorage.getItem("tryThisCode");
    const savedLang = localStorage.getItem("tryThisLang");

    if (savedCode) {
      setCode(savedCode);
      localStorage.removeItem("tryThisCode"); // Clear after loading
    }

    if (savedLang) {
      const langMap = {
        Java: { mode: "java", apiLang: "java" },
        Python: { mode: "python", apiLang: "python" },
        JavaScript: { mode: "javascript", apiLang: "javascript" },
        HTML: { mode: "html", apiLang: "html" },
        CSS: { mode: "css", apiLang: "css" },
        SQL: { mode: "sql", apiLang: "sqlite3" },
        React: { mode: "javascript", apiLang: "javascript" },
      };

      // Auto-detect HTML content if it starts with <!DOCTYPE or <html, even if some garbage is in front
      const trimmedCode = savedCode ? savedCode.trim().toLowerCase() : "";
      if (
        trimmedCode.includes("<!doctype") ||
        trimmedCode.startsWith("<html")
      ) {
        setMode("html");
        setLanguage("html");
      } else {
        const config = langMap[savedLang] || {
          mode: "javascript",
          apiLang: "javascript",
        };
        setMode(config.mode);
        setLanguage(config.apiLang);
      }
      localStorage.removeItem("tryThisLang"); // Clear after loading
    }
  }, []);

  const handleRun = async () => {
    setIsLoading(true);
    setOutput("");

    if (language === "html" || language === "css") {
      const content = language === "css" ? `<style>${code}</style>` : code;
      setOutput(content);
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
        if (editorRef.current) {
          const selectedText = editorRef.current.getSelectedText();
          if (selectedText && selectedText.trim().length > 0) {
            codeToExecute = selectedText;
          }
        }

        // Strip comments
        const sanitizedCode = codeToExecute
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .split("\n")
          .map((line) => {
            const idx = line.indexOf("--");
            return idx >= 0 ? line.substring(0, idx) : line;
          })
          .join("\n");

        // Split commands by semicolon
        const commands = sanitizedCode
          .split(";")
          .filter((c) => c.trim().length > 0);
        let messages = [];

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
          }
        }

        if (messages.length > 0) {
          setOutput(messages);
        } else {
          setOutput("Executed successfully.");
        }
      } catch (err) {
        console.error(err);
        setOutput(`SQL Error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language: language,
          version: "*",
          files: [{ content: code }],
        }
      );
      const { run } = response.data;
      setOutput(run.output);
    } catch (error) {
      console.error("Execution error:", error);
      setOutput("Error executing code.\n" + error.message);
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

  // Listen for fullscreen change events (e.g. user presses Esc)
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
            customImport: s.customImport, // Very high score to appear first
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
        <div className="header-left">
          <div className="main-title">CodePulse-R</div>
          <div className="slogan">Standard Compailer</div>
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
              <FaCode />({language})
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
                  <FaPalette /> Themes
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
                    Code Gen <FaChevronDown size={10} />
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
              key={`compiler-editor-${mode}-${editorTheme}`}
              mode={mode}
              theme={editorTheme}
              name="compiler-editor"
              onLoad={handleEditorLoad}
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
            className={`output-content ${
              language === "html" || language === "css" ? "preview-mode" : ""
            }`}
          >
            {language === "html" || language === "css" ? (
              <div className="preview-container">
                <BrowserPreview htmlCode={output} />
              </div>
            ) : Array.isArray(output) ? (
              <div className="sql-result-container" style={{ padding: "20px" }}>
                {output.map((msg, i) => (
                  <div key={i} style={{ marginBottom: "16px" }}>
                    {msg.type === "success" && (
                      <div className="sql-success-msg">
                        <FaCheck /> {msg.text}
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
              <pre className="output-pre">
                {isLoading ? (
                  <span className="loading-dots">
                    Codepulse-R generating Output
                  </span>
                ) : (
                  output ||
                  "// Codepulse-R generating output will appear here..."
                )}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
