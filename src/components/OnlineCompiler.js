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
import sqlSnippets from "../utils/sqlSnippets";
import { generateJavaCode } from "../utils/javaCodeGenerator";
import { availableThemes } from "../utils/editorThemes";
import { languageBoilerplates } from "../utils/languageBoilerplates";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

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
  const [editorWidth, setEditorWidth] = useState(50);
  const [fontSize, setFontSize] = useState(16);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [detectedPrompts, setDetectedPrompts] = useState([]);
  const [promptValues, setPromptValues] = useState({});
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

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

  const pdfCodeRef = useRef(null);
  const pdfOutputRef = useRef(null);

  const handleDownloadPdf = async () => {
    toast.info("Generating PDF... Please wait.");
    await new Promise((r) => setTimeout(r, 100));

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pdfHeight = pdf.internal.pageSize.getHeight();

    // Helper to capture and add a page
    const captureAndAdd = async (element, isFirst) => {
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      if (!isFirst) {
        pdf.addPage();
      }
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    };

    try {
      // 1. Process Code Pages
      const codePages = document.querySelectorAll(".pdf-page-code");
      for (let i = 0; i < codePages.length; i++) {
        await captureAndAdd(codePages[i], i === 0);
      }

      // 2. Process Output Pages
      if (!isWebLanguage) {
        const outputPages = document.querySelectorAll(".pdf-page-output");

        for (let i = 0; i < outputPages.length; i++) {
          // If we already added code pages, we need to add a new page for output
          const needsPageBreak = codePages.length > 0 || i > 0;

          if (outputPages[i]) {
            if (needsPageBreak) pdf.addPage();

            const canvas = await html2canvas(outputPages[i], {
              scale: 1.5,
              backgroundColor: "#ffffff",
            });
            const imgData = canvas.toDataURL("image/png");
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
          }
        }
      }

      // Determine filename based on language name
      const langObj = languages.find((l) => l.apiLang === language);
      const fileName = langObj ? langObj.name : "CodePulse_Output";
      pdf.save(`${fileName}.pdf`);
      toast.success("PDF Downloaded Successfully!");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Failed to generate PDF.");
    }
  };

  const checkForInput = (code, lang) => {
    if (!code) return false;
    const c = code;
    // Simple heuristic regexes for common input patterns
    if (lang === "java")
      return c.includes("Scanner") || c.includes("System.in");
    if (lang === "python") return c.includes("input(");
    if (lang === "cpp" || lang === "c")
      return c.includes("cin") || c.includes("scanf");
    if (lang === "csharp") return c.includes("Console.ReadLine");
    if (lang === "javascript") return c.includes("prompt("); // Not really supported in Node but good to catch
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
      setOutput(code);
      setIsLoading(false);
      setIsWaitingForInput(false); // Reset here
      return;
    }

    // Special handling for SQL (AlaSQL - MySQL/Oracle simulation)
    if (language === "sql") {
      try {
        const alasql = require("alasql");

        // Polyfill NVL for Oracle compatibility
        if (!alasql.fn.NVL) {
          alasql.fn.NVL = function (val, defaultVal) {
            return val === null || val === undefined ? defaultVal : val;
          };
        }

        // Ensure Database exists (simulated session)
        if (!alasql.databases.myDB) {
          alasql("CREATE DATABASE myDB");
        }
        alasql("USE myDB");

        let codeToExecute = code;
        // Check for selection
        if (editorRef.current) {
          const selectedText = editorRef.current.getSelectedText();
          if (selectedText && selectedText.trim().length > 0) {
            codeToExecute = selectedText;
          }
        }

        // Remove comments (Block \/*...*\/ and Line --)
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

        let messages = [];

        for (let cmd of commands) {
          try {
            const trimmedCmd = cmd.trim();
            // alasql.exec returns array of results if multiple queries, or single result
            // Since we loop, we execute one by one
            let res = alasql(trimmedCmd);

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
            } else if (
              lowerCmd.startsWith("truncate table") ||
              lowerCmd.startsWith("truncate")
            ) {
              const match = trimmedCmd.match(
                /truncate(?:\s+table)?\s+["`]?([^\s("`]+)/i
              );
              const tableName = match ? match[1] : "Table";
              messages.push({
                type: "success",
                text: `Table '${tableName}' truncated successfully.`,
              });
            } else if (lowerCmd.startsWith("insert into")) {
              const match = trimmedCmd.match(
                /insert\s+into\s+["`]?([^\s("`]+)/i
              );
              const tableName = match ? match[1] : "table";
              // res is usually the number of rows affected for INSERT in some engines,
              // but alasql returns 1 for single insert
              messages.push({
                type: "success",
                text: `Values inserted into '${tableName}' successfully.`,
              });
            } else if (lowerCmd.startsWith("update")) {
              const match = trimmedCmd.match(/update\s+["`]?([^\s("`]+)/i);
              const tableName = match ? match[1] : "table";
              const rows = res; // alasql returns number of affected rows for update
              messages.push({
                type: "success",
                text: `Table '${tableName}' updated. Rows affected: ${rows}`,
              });
            } else if (lowerCmd.startsWith("delete from")) {
              const match = trimmedCmd.match(
                /delete\s+from\s+["`]?([^\s("`]+)/i
              );
              const tableName = match ? match[1] : "table";
              const rows = res; // alasql returns number of affected rows
              messages.push({
                type: "success",
                text: `Rows deleted from '${tableName}'. Rows affected: ${rows}`,
              });
            } else if (lowerCmd.startsWith("alter table")) {
              const match = trimmedCmd.match(
                /alter\s+table\s+["`]?([^\s("`]+)/i
              );
              const tableName = match ? match[1] : "Table";
              messages.push({
                type: "success",
                text: `Table '${tableName}' altered successfully.`,
              });
            } else if (
              lowerCmd.startsWith("describe") ||
              lowerCmd.startsWith("desc")
            ) {
              const match = trimmedCmd.match(
                /(?:describe|desc)\s+["`]?([^\s("`]+)/i
              );
              if (match) {
                const tableName = match[1];
                const db = alasql.databases.myDB;
                if (db && db.tables && db.tables[tableName]) {
                  const columnsData = db.tables[tableName].columns.map(
                    (col) => ({
                      Field: col.columnid,
                      Type: col.dbtypeid || "UNKNOWN",
                      Null: "YES", // AlaSQL metadata might vary, strict emulation
                      Key: col.pk ? "PRI" : "",
                      Default: "NULL",
                      Extra: "",
                    })
                  );
                  // Convert to array format for our UI
                  const columns = [
                    "Field",
                    "Type",
                    "Null",
                    "Key",
                    "Default",
                    "Extra",
                  ];
                  const values = columnsData.map((row) => [
                    row.Field,
                    row.Type,
                    row.Null,
                    row.Key,
                    row.Default,
                    row.Extra,
                  ]);

                  messages.push({ type: "table", data: { columns, values } });
                } else {
                  messages.push({
                    type: "error",
                    text: `Table '${tableName}' does not exist`,
                  });
                }
              }
            } else if (
              lowerCmd.startsWith("select") ||
              lowerCmd.startsWith("show")
            ) {
              if (Array.isArray(res) && res.length > 0) {
                // AlaSQL returns array of objects {col1: val1, ...} directly
                // We need to shape it for our Table component if expectation is {columns:[], values:[]}

                const columns = Object.keys(res[0]);
                const values = res.map((row) => columns.map((col) => row[col]));

                messages.push({ type: "table", data: { columns, values } });
              } else if (Array.isArray(res) && res.length === 0) {
                // Empty result set - Try to show Table Columns if possible (for "Empty Table" visualization)
                let showedEmptyTable = false;
                try {
                  // Try to extract table name from simple SELECT queries
                  const fromMatch = trimmedCmd.match(
                    /from\s+["`]?([^\s("`]+)/i
                  );
                  if (fromMatch) {
                    const tableName = fromMatch[1];
                    // Check metadata for columns
                    const db = alasql.databases.myDB;
                    if (
                      db &&
                      db.tables &&
                      db.tables[tableName] &&
                      db.tables[tableName].columns
                    ) {
                      const columns = db.tables[tableName].columns.map(
                        (c) => c.columnid
                      );
                      if (columns && columns.length > 0) {
                        messages.push({
                          type: "table",
                          data: { columns: columns, values: [] },
                        });
                        showedEmptyTable = true;
                      }
                    }
                  }
                } catch (err) {
                  console.log("Could not extract columns for empty table", err);
                }

                if (!showedEmptyTable) {
                  messages.push({
                    type: "info",
                    text: "Query returned no results.",
                  });
                }
              } else {
                // Single value result?
                messages.push({
                  type: "info",
                  text: JSON.stringify(res),
                });
              }
            } else {
              // Other commands (commit, etc)
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
        setIsWaitingForInput(false); // Reset here
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
      let codeToSend = code;
      if (apiLanguage === "java") {
        const {
          prepareJavaCodeForExecution,
        } = require("../utils/javaCodeGenerator"); // Import dynamically or ensure top-level
        codeToSend = prepareJavaCodeForExecution(code);
      }

      const fileData = { content: codeToSend };
      if (apiLanguage === "java") {
        fileData.name = "Main.java";
      }

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

      let finalOutput = run.output;

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
      setIsWaitingForInput(false); // Reset here
    }
  };

  const analyzeInputPrompts = (code) => {
    if (!code) return [];
    if (language !== "java") return []; // Only support Java for now as requested

    const lines = code.split("\n");
    const foundPrompts = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      // Look for System.out.print/println
      // Regex captures content inside quotes
      const printMatch = line.match(
        /System\.out\.print(?:ln)?\s*\(\s*"([^"]+)"/
      );

      if (printMatch) {
        // Found a print. Look ahead for Scanner input
        // Simple Heuristic: Check next few lines for nextInt, nextDouble, etc.
        let j = i + 1;
        let foundScanner = false;
        while (j < lines.length && j < i + 5) {
          // Check next 5 lines max
          if (
            lines[j].includes("sc.next") ||
            lines[j].includes("scanner.next")
          ) {
            foundScanner = true;
            break;
          }
          j++;
        }
        if (foundScanner) {
          foundPrompts.push(printMatch[1]);
          // Skip ahead to avoid duplicate checks if multiple scans close by
          i = j;
        }
      }
      i++;
    }
    return foundPrompts;
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
    <div className="compiler-container" ref={containerRef}>
      {!isFullScreen && (
        <header className="compiler-header">
          {/* Left: Branding */}
          {/* <div className="header-left">
            <span className="animated-title-3d main-title ">
              <span>CODEPULSE-R</span>
            </span>
            <span className="animated-title-3d slogan">Online Compiler's</span>
          </div> */}

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
          <div className="section-header">
            <h3 className="section-title">
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
            <div className="console-header-actions">
              <button
                className="btn-compiler"
                onClick={handleDownloadPdf}
                title="Download PDF"
              >
                <FaDownload /> PDF
              </button>
            </div>
          </div>
          <div
            className={`output-content ${isWebLanguage ? "preview-mode" : ""}`}
          >
            {isWebLanguage ? (
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
              <div className="output-section-wrapper">
                {/* Run Intercept: Input Overlay */}
                {isWaitingForInput ? (
                  <div className="console-input-overlay">
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

      {/* Hidden Print Layout for PDF Generation */}
      <div className="pdf-hidden-layout">
        {/* Render Code Pages */}
        {(() => {
          const lines = (code || "").split("\n");
          const LINES_PER_PAGE = 40;
          const totalPages = Math.ceil(lines.length / LINES_PER_PAGE) || 1;
          const pages = [];

          for (let i = 0; i < totalPages; i++) {
            const chunk = lines
              .slice(i * LINES_PER_PAGE, (i + 1) * LINES_PER_PAGE)
              .join("\n");
            pages.push(
              <div
                key={`code-page-${i}`}
                className="pdf-page-code pdf-page-code-container"
              >
                {/* HEADER */}
                <div className="pdf-header-wrapper">
                  <div>
                    <h1 className="pdf-title">CodePulse-R</h1>
                    <p className="pdf-subtitle">
                      Source Code - Page {i + 1} of {totalPages}
                    </p>
                  </div>
                  <div className="pdf-student-info">
                    <p className="pdf-student-name">
                      Student: {localStorage.getItem("userName") || "Guest"}
                    </p>
                    <p className="pdf-date">
                      Date: {new Date().toLocaleDateString()}
                      <br />
                      Time: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* CONTENT */}
                <h3 className="pdf-section-title">
                  {language} ({i + 1}/{totalPages})
                </h3>
                <div className="pdf-code-block">
                  <SyntaxHighlighter
                    language={language === "sqlite3" ? "sql" : language}
                    style={docco}
                    showLineNumbers={true}
                    startingLineNumber={i * LINES_PER_PAGE + 1}
                    wrapLongLines={true}
                  >
                    {chunk || ""}
                  </SyntaxHighlighter>
                </div>

                {/* FOOTER */}
                <div className="pdf-footer-wrapper">
                  <span>Generated by CodePulse-R</span>
                  <span>www.codepulse-r.com</span>
                </div>
              </div>
            );
          }
          return pages;
        })()}

        {/* Render Output Pages (Only if not Web Language) */}
        {!isWebLanguage && (
          <div className="pdf-page-output">
            <div ref={pdfOutputRef} className="pdf-page-output-container">
              {/* PDF HEADER (Page 2) */}
              <div className="pdf-header-wrapper">
                <div>
                  <h1 className="pdf-title">CodePulse-R</h1>
                  <p className="pdf-subtitle">Console Output</p>
                </div>
                <div className="pdf-student-info">
                  <p className="pdf-student-name">
                    Name: {localStorage.getItem("userName") || "Guest"}
                  </p>
                  <p className="pdf-date">
                    Date: {new Date().toLocaleDateString()}
                    <br />
                    Time: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <h3 className="pdf-section-title">Execution Result</h3>
              <div className="pdf-result-box">
                {Array.isArray(output) ? (
                  <div className="sql-result-container">
                    {output.map((msg, i) => (
                      <div key={i} className="sql-msg-item pdf-sql-item">
                        {msg.type === "success" && (
                          <div className="sql-success-msg pdf-sql-success">
                            ✔ {msg.text}
                          </div>
                        )}
                        {msg.type === "error" && (
                          <div className="error-msg-box pdf-sql-error">
                            {msg.text}
                          </div>
                        )}
                        {msg.type === "info" && (
                          <div className="info-msg-text">{msg.text}</div>
                        )}
                        {msg.type === "table" && msg.data && (
                          <div className="pdf-table-wrapper">
                            <table className="pdf-table">
                              <thead>
                                <tr className="pdf-table-row-header">
                                  {msg.data.columns.map((col, idx) => (
                                    <th key={idx} className="pdf-table-th">
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {msg.data.values.map((row, rIdx) => (
                                  <tr key={rIdx}>
                                    {row.map((val, cIdx) => (
                                      <td key={cIdx} className="pdf-table-td">
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
                  <pre className="pdf-pre-output">
                    {output || "No output generated."}
                  </pre>
                )}
              </div>

              {/* PDF FOOTER (Page 2) */}
              <div className="pdf-footer-wrapper">
                <span>Generated by CodePulse-R</span>
                <span>www.codepulse-r.com</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineCompiler;
