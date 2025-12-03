import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import ace from "ace-builds";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/ext-language_tools";

// Configure Ace
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.35.0/src-noconflict/");
ace.config.set("workerPath", "https://cdn.jsdelivr.net/npm/ace-builds@1.35.0/src-noconflict/");

const Compiler = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const [mode, setMode] = useState("javascript");

  useEffect(() => {
    const savedCode = localStorage.getItem("tryThisCode");
    const savedLang = localStorage.getItem("tryThisLang");

    if (savedCode) {
      setCode(savedCode);
    }

    if (savedLang) {
      const langMap = {
        "Java": "java",
        "Python": "python",
        "JavaScript": "javascript",
        "HTML": "html",
        "CSS": "css",
        "SQL": "sql",
        "React": "javascript" // React uses JS mode
      };
      setMode(langMap[savedLang] || "javascript");
    }
  }, []);

  const handleRun = () => {
      // Basic mock run for now, can be expanded later
      setOutput("Execution started...\n\n(Note: This is a basic preview. Full execution requires backend integration.)\n\n" + code);
  };

  return (
    <div style={{ padding: "20px", height: "100vh", display: "flex", flexDirection: "column", gap: "20px" }}>
      <h2>Code Compiler</h2>
      <div style={{ display: "flex", gap: "20px", flex: 1 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Editor</h3>
                <button 
                    onClick={handleRun}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Run Code
                </button>
            </div>
            <AceEditor
                mode={mode}
                theme="monokai"
                name="compiler-editor"
                value={code}
                onChange={setCode}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 4,
                fontSize: 14,
                }}
                style={{ width: "100%", height: "100%", borderRadius: "8px" }}
            />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <h3>Output</h3>
            <div style={{ 
                flex: 1, 
                backgroundColor: "#f4f4f4", 
                padding: "10px", 
                borderRadius: "8px", 
                border: "1px solid #ddd",
                whiteSpace: "pre-wrap",
                fontFamily: "monospace"
            }}>
                {output || "Run the code to see output..."}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
