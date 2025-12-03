import React, { useState } from "react";
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
import { FaExpand, FaCompress } from "react-icons/fa";

// Configure Ace
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.35.0/src-noconflict/");
ace.config.set("workerPath", "https://cdn.jsdelivr.net/npm/ace-builds@1.35.0/src-noconflict/");

const CODEPAD_LANGS = ["html", "css"];

const getAceMode = (course) => {
  const lang = (course || "").toLowerCase();
  switch (lang) {
    case "html": return "html";
    case "css": return "css";
    case "javascript": return "javascript";
    case "java": return "java";
    case "python": return "python";
    case "sql": return "sql";
    default: return "text";
  }
};

const CodingExercise = ({
  selectedCourse,
  expandedChapter,
  selectedExample,
  questionData,
  code,
  setCode,
  isRunning,
  handleEvaluateCode,
  handleFinalSubmit,
  evaluationResult,
  showOutput,
  output,
  handleBack,
  codingMarks = 10
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const langType = selectedCourse.toLowerCase();
  const isCodepad = CODEPAD_LANGS.includes(langType);
  const aceMode = getAceMode(selectedCourse);

  const evaluateButtonText = isRunning
    ? isCodepad
      ? "Running Live Preview..."
      : "Evaluating with Judge0..."
    : "Run";

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Listen for fullscreen change events (e.g., user presses Esc)
  React.useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  return (
    <div className={`learning-question-view ${isFullScreen ? "full-screen-active" : ""}`}>
      {!isFullScreen && (
        <button className="learning-back-btn" onClick={handleBack}>
          ← Back to Chapters
        </button>
      )}
      
      {!isFullScreen && (
        <h2 className="learning-content-header">
          {selectedCourse} Chapter {expandedChapter} : Exercise {selectedExample}
        </h2>
      )}

      <div className="question-compiler-columns">
        <div className="question-area-left-column">
          <div className="learning-question-card">
            <h3>Question</h3>
            <p>{questionData.question}</p>

            <h4 className="sample-header">📥 Sample Input:</h4>
            <pre>{questionData.sampleInput || "N/A"}</pre>

            <h4 className="sample-header">📤 Expected Output:</h4>
            {["html", "css"].includes(langType) ? (
              <div
                className="preview-box"
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  background: "#fff",
                  minHeight: "100px",
                  marginTop: "5px",
                }}
              >
                <iframe
                  title="Expected Output Static"
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "100px",
                    border: "none",
                  }}
                  srcDoc={
                    langType === "css"
                      ? `<!DOCTYPE html><html><head><style>${questionData.sampleOutput}</style></head><body><h1>CSS Preview</h1><p>This text is styled by the expected CSS.</p></body></html>`
                      : questionData.sampleOutput
                  }
                />
              </div>
            ) : (
              <pre>{questionData.sampleOutput || "N/A"}</pre>
            )}
          </div>
        </div>

        <div className="compiler-area-right">
          <div className="compiler-area">
            <div className="compiler-buttons dual-button-group">
              <h4>💻 Code Editor ({selectedCourse})</h4>
              
              <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
                 <button 
                    className="fullscreen-btn" 
                    onClick={toggleFullScreen}
                    title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                 >
                    {isFullScreen ? <FaCompress /> : <FaExpand />}
                 </button>

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
              mode={aceMode}
              theme="monokai"
              name="code-editor"
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
                fontFamily: "'Fira Code', 'Consolas', monospace",
              }}
              style={{
                width: "100%",
                height: isFullScreen ? "calc(100vh - 150px)" : "350px", 
                borderRadius: "8px",
                border: "none",
                boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.3)",
              }}
            />
          </div>

          {evaluationResult && (
            <div
              className={`evaluation-result-box ${
                evaluationResult.isCorrect ? "correct" : "incorrect"
              }`}
            >
              <h3>📊 Evaluation Summary</h3>
              <p>
                <strong>Status:</strong> {evaluationResult.message}
              </p>

              {!isCodepad && (
                <div className="evaluation-details-section">
                  <h4>Your Code's Output:</h4>
                  <pre
                    className="evaluation-details"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {evaluationResult.userOutput || "No output generated"}
                  </pre>
                  {evaluationResult.score <
                    (questionData.maxMarks || codingMarks) && (
                    <>
                      <h4>Expected Answer Output:</h4>
                      {["html", "css"].includes(langType) ? (
                        <div
                          className="preview-box"
                          style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            background: "#fff",
                            minHeight: "150px",
                          }}
                        >
                          <iframe
                            title="Expected Output"
                            style={{
                              width: "100%",
                              height: "100%",
                              minHeight: "150px",
                              border: "none",
                            }}
                            srcDoc={
                              langType === "css"
                                ? `<!DOCTYPE html><html><head><style>${questionData.sampleOutput}</style></head><body><h1>CSS Preview</h1><p>This text is styled by the expected CSS.</p></body></html>`
                                : questionData.sampleOutput
                            }
                          />
                        </div>
                      ) : (
                        <pre
                          className="evaluation-details"
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          {questionData.sampleOutput || "N/A"}
                        </pre>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {showOutput && (
            <div className="output-box-container">
              <h4>🧾Output/Preview:</h4>
              {isCodepad ? (
                <iframe
                  title="Preview"
                  srcDoc={output}
                  style={{
                    width: "100%",
                    height: "80%",
                    border: "1px solid #000000ff",
                    borderRadius: "8px",
                    background: "#fff",
                  }}
                />
              ) : (
                <pre className="compiler-output">{output}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingExercise;
