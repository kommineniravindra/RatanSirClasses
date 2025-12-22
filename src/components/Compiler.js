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
  FaCog,
  FaBold,
  FaItalic,
  FaDownload,
  FaFileCode,
  FaEquals,
} from "react-icons/fa";
import "../css/Compiler.css";
import BrowserPreview from "./BrowserPreview";
import javaSnippets from "../utils/javaSnippets";
import sqlSnippets from "../utils/sqlSnippets";
import { generateJavaCode } from "../utils/javaCodeGenerator";
import { availableThemes } from "../utils/editorThemes";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

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
  /* =========================================
     1. STATE MANAGEMENT
     ========================================= */

  // -- Editor & Compiler State --
  const [code, setCode] = useState(
    () => localStorage.getItem("compiler_code") || ""
  );
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(
    () => localStorage.getItem("compiler_language") || "java"
  );
  const [mode, setMode] = useState(
    () => localStorage.getItem("compiler_mode") || "java"
  );

  // -- UI State --
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50);
  const [fontSize, setFontSize] = useState(16);
  const [editorTheme, setEditorTheme] = useState("monokai");
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isError, setIsError] = useState(false);

  // -- Refs --
  const themeDropdownRef = useRef(null);
  const generateDropdownRef = useRef(null);
  const editorRef = useRef(null);
  const settingsDropdownRef = useRef(null);
  const containerRef = useRef(null);
  const sqlDbRef = useRef(null);
  const pdfCodeRef = useRef(null);
  const pdfOutputRef = useRef(null);

  // -- Dropdown State --
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [activeDropdown, setActiveDropdown] = useState(null);

  /* =========================================
     2. INPUT HANDLING STATE (Scanner Logic)
     ========================================= */
  const [userInput, setUserInput] = useState("");
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [detectedPrompts, setDetectedPrompts] = useState([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [promptValues, setPromptValues] = useState({});

  /* =========================================
     3. EVENT HANDLERS & HELPERS
     ========================================= */

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

  // Check for Input Requirements (Scanner/input/prompt)
  const checkForInput = (code, lang) => {
    if (lang === "java") {
      return (
        code.includes("Scanner") &&
        code.includes("System.in") &&
        (code.includes("next") || code.includes("nextLine"))
      );
    }
    if (lang === "python") return code.includes("input(");
    if (lang === "javascript") return code.includes("prompt(");
    return false;
  };

  // Detect System.out.print prompts
  const analyzeInputPrompts = (codeString) => {
    const prompts = [];
    // Basic regex to find string literals in System.out.print/println
    const printRegex = /System\.out\.print(?:ln)?\s*\(\s*"([^"]+)"\s*\)/g;
    let match;
    while ((match = printRegex.exec(codeString)) !== null) {
      prompts.push(match[1]);
    }
    if (!codeString.includes("Scanner")) return [];
    return prompts;
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleInputSubmit = (e) => {
    if (e.key === "Enter") {
      if (detectedPrompts.length > 0) {
        // Smart Prompt Mode
        const newValues = { ...promptValues, [currentPromptIndex]: userInput };
        setPromptValues(newValues);
        setUserInput("");

        if (currentPromptIndex < detectedPrompts.length - 1) {
          setCurrentPromptIndex((prev) => prev + 1);
        } else {
          // All prompts answered, execute with joined inputs
          const finalInputs = [];
          for (let i = 0; i < detectedPrompts.length; i++) {
            finalInputs.push(newValues[i]);
          }
          const finalStr = finalInputs.join("\n");
          setIsWaitingForInput(false);
          executeCode(finalStr);
        }
      } else {
        // Generic Input Mode
        setIsWaitingForInput(false);
        executeCode(userInput);
      }
    }
  };

  const toggleDropdown = (e, dropdownName) => {
    e.preventDefault();
    e.stopPropagation();

    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 5,
      left: rect.left - 100,
    });
    setActiveDropdown(dropdownName);
  };

  // Close dropdowns on scroll/click global
  useEffect(() => {
    const closeAll = () => setActiveDropdown(null);
    window.addEventListener("click", closeAll);
    window.addEventListener("scroll", closeAll, true);
    return () => {
      window.removeEventListener("click", closeAll);
      window.removeEventListener("scroll", closeAll, true);
    };
  }, []);

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
      document.body.appendChild(script);
    };

    loadSql();
  }, []);

  const handleDownloadPdf = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const addToPdf = async (ref, isFirstSection) => {
      if (!ref.current) return;

      const canvas = await html2canvas(ref.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      if (!isFirstSection) {
        pdf.addPage();
      }

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page of this section
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
    };

    try {
      // 1. Process Code Section
      await addToPdf(pdfCodeRef, true);

      // 2. Process Output Section (if applicable)
      if (
        !(language === "html" || language === "css") &&
        pdfOutputRef.current
      ) {
        await addToPdf(pdfOutputRef, false);
      }

      pdf.save("CodePulse_Output.pdf");
      Swal.fire("Success", "PDF Downloaded Successfully!", "success");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      Swal.fire("Error", "Failed to generate PDF.", "error");
    }
  };

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
        SQL: { mode: "sql", apiLang: "sql" },
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

  /* =========================================
     4. CODE EXECUTION (Local & Piston API)
     ========================================= */

  const executeCode = async (paramsInput = "") => {
    setIsLoading(true);
    setOutput("");

    // --- 1. WEB LANGUAGES (HTML, CSS) ---
    if (language === "html" || language === "css") {
      const content = language === "css" ? `<style>${code}</style>` : code;
      setOutput(content);
      setIsLoading(false);
      return;
    }

    // --- 2. SQL LOCAL EXECUTION ---
    if (language === "sql") {
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

        const sanitizedCode = codeToExecute
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

    // --- 3. PISTON EXECUTION (Java, Python, JS, etc.) ---
    try {
      let codeToSend = code;
      // Java Boilerplate Injection
      if (language === "java") {
        const {
          prepareJavaCodeForExecution,
        } = require("../utils/javaCodeGenerator");
        codeToSend = prepareJavaCodeForExecution(code);
      }

      const fileData = { content: codeToSend };
      if (language === "java") {
        fileData.name = "Main.java";
      }

      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language: language,
          version: "*",
          files: [fileData],
          stdin: paramsInput,
        }
      );
      const { run } = response.data;
      setOutput(run.output);
      if (run.stderr) {
        setIsError(true);
      } else {
        setIsError(false);
      }
    } catch (error) {
      console.error("Execution error:", error);
      setOutput("Error executing code.\n" + error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRun = async () => {
    // 1. Analyze Code for Input Prompts (Java mostly)
    const prompts = analyzeInputPrompts(code);
    if (prompts.length > 0) {
      // Smart Prompts Found
      setDetectedPrompts(prompts);
      setCurrentPromptIndex(0);
      setPromptValues({});
      setUserInput("");
      setIsWaitingForInput(true);
      return;
    }

    // 2. Fallback Check: Is Scanner/input used without detailed prompts?
    const needsInput = checkForInput(code, language);
    if (needsInput) {
      // Generic Input Mode
      setDetectedPrompts([]);
      setUserInput("");
      setIsWaitingForInput(true);
      return;
    }

    // 3. No Input Needed -> Run Immediately
    executeCode("");
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

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const handleEditorLoad = (editor) => {
    editorRef.current = editor;

    // Ensure options
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
    });

    // Define Custom Completer with Import Logic
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

    // Register Completer
    const langTools = ace.require("ace/ext/language_tools");
    if (langTools) {
      langTools.addCompleter(customCompleter);
    }
  };

  const generateCode = (type) => {
    setShowGenerateDropdown(false);

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
    <div className="compiler-container" ref={containerRef}>
      {/* =========================================
          5. MAIN RENDER
          ========================================= */}
      <div className="compiler-main">
        {/* Editor Section */}
        <div
          className="compiler-section"
          style={{ flex: `0 0 ${editorWidth}%` }}
        >
          <div className="section-header">
            <h3 className="section-title">
              <FaCode className="text-primary" />({language})
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
                  <span className="d-none d-md-inline">Fonts</span>
                  <FaChevronDown size={10} />
                </button>
                {activeDropdown === "settings" && (
                  <div
                    className="oc-dropdown-menu-fixed settings-menu"
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
                  <span className="d-none d-md-inline">Themes</span>
                  <FaChevronDown size={10} />
                </button>
                {activeDropdown === "theme" && (
                  <div
                    className="oc-dropdown-menu-fixed"
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
                    <span className="d-none d-md-inline">Code Gen</span>{" "}
                    <FaChevronDown size={10} />
                  </button>
                  {activeDropdown === "generate" && (
                    <div
                      className="oc-dropdown-menu-fixed dropdown-menu-gen"
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
                <span>{isLoading ? "Running" : "RUN"}</span>
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
                width: "100%",
                height: "100%",
                fontSize: fontSize,
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
            <button
              className="btn-compiler"
              onClick={handleDownloadPdf}
              title="Download PDF"
              style={{ marginLeft: "auto", marginRight: "10px" }}
            >
              <FaDownload /> PDF
            </button>
          </div>
          <div
            className={`output-content ${isWebLanguage ? "preview-mode" : ""}`}
          >
            {/* Input Overlay */}
            {isWaitingForInput ? (
              <div className="console-input-overlay">
                <div className="prompt-line">
                  {detectedPrompts.length > 0 ? (
                    <span>{detectedPrompts[currentPromptIndex]}</span>
                  ) : (
                    <span>Input required:</span>
                  )}
                  <input
                    type="text"
                    className="console-input"
                    autoFocus
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyDown={handleInputSubmit}
                  />
                </div>
                {detectedPrompts.length === 0 && (
                  <div className="loading-indicator">Waiting for input...</div>
                )}
                {detectedPrompts.length > 0 && (
                  <p className="input-fallback-text">
                    (Press Enter to submit value)
                  </p>
                )}
              </div>
            ) : isWebLanguage ? (
              <div className="preview-container">
                <BrowserPreview htmlCode={output} />
              </div>
            ) : Array.isArray(output) ? (
              <div className="sql-result-container sql-result-padding">
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
                      <div className="table-overflow">
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
                    CodePulse-R generating Output
                  </span>
                ) : (
                  output || "CodePulse-R generating output will appear here..."
                )}
              </pre>
            )}
          </div>
        </div>
      </div>
      {/* Hidden PDF Print Layout */}
      <div
        style={{
          position: "absolute",
          top: "-10000px",
          left: "-10000px",
          zIndex: -1,
        }}
      >
        <div
          ref={pdfCodeRef}
          style={{
            width: "210mm",
            minHeight: "297mm",
            background: "white",
            color: "black",
            padding: "40px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* Reuse logic or simplify for print */}
          <h3>Source Code ({language})</h3>
          <SyntaxHighlighter
            language={language}
            style={docco}
            showLineNumbers={true}
            wrapLongLines={true}
          >
            {code || ""}
          </SyntaxHighlighter>
        </div>
        {!isWebLanguage && (
          <div
            ref={pdfOutputRef}
            style={{
              width: "210mm",
              minHeight: "297mm",
              background: "white",
              padding: "40px",
            }}
          >
            <h3>Output</h3>
            <pre>
              {typeof output === "string" ? output : JSON.stringify(output)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compiler;
