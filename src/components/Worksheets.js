import React, { useState, useEffect } from "react";
import { chapterInfoByLang, quizContexts } from "./StartLearning1";
import {
  FaChevronDown,
  FaChevronRight,
  FaCode,
  FaCopy,
  FaCheckCircle,
  FaDownload,
} from "react-icons/fa";
import axios from "axios";
import { jsPDF } from "jspdf";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  coy,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import "../css/Worksheets.css";

const Worksheets = ({ userId }) => {
  const [selectedTech, setSelectedTech] = useState("java");
  const [expandedChapters, setExpandedChapters] = useState({});
  const [userCodes, setUserCodes] = useState({});
  const [loadingCodes, setLoadingCodes] = useState(false);

  const toggleChapter = (chapterNum) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterNum]: !prev[chapterNum],
    }));
  };

  const techData = chapterInfoByLang[selectedTech];

  // Map internal lowercase keys to backend-expected course names
  const COURSE_NAME_MAP = {
    html: "HTML",
    css: "CSS",
    javascript: "JavaScript",
    java: "Java",
    python: "Python",
    sql: "SQL",
  };

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!userId) return;

      setLoadingCodes(true);
      try {
        // Use the mapped name for the API call
        const apiCourseName = COURSE_NAME_MAP[selectedTech] || selectedTech;
        const res = await axios.get(
          `/api/contests/${userId}/course?course=${apiCourseName}`
        );
        const { contests } = res.data;
        const codesMap = {};
        (contests || []).forEach((c) => {
          codesMap[`ch${c.chapter}-ex${c.example}`] = c;
        });
        setUserCodes(codesMap);
      } catch (error) {
        console.error("Error fetching user codes:", error);
      } finally {
        setLoadingCodes(false);
      }
    };

    fetchUserProgress();
  }, [selectedTech, userId]);

  const getExercises = (chapterNum) => {
    try {
      const context = quizContexts[selectedTech];
      const key = `./CodingChapter${chapterNum}.json`;
      const data = context(key);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("Error loading exercises", e);
      return [];
    }
  };

  // Helper to strip HTML tags but preserve line breaks
  const stripHtml = (html) => {
    if (!html) return "";
    // Use a unique placeholder that won't appear in normal text
    const PLACEHOLDER = "||NEWLINE||";

    // Replace <br> and user-provided \n with placeholder
    let processed = html.replace(/<br\s*\/?>/gi, PLACEHOLDER);
    processed = processed.replace(/\n/g, PLACEHOLDER);

    const tmp = document.createElement("DIV");
    tmp.innerHTML = processed;
    const text = tmp.textContent || tmp.innerText || "";

    // Restore newlines
    return text.split(PLACEHOLDER).join("\n");
  };

  const handleDownloadPDF = (e, chapter) => {
    e.stopPropagation();
    const doc = new jsPDF();
    const exercises = getExercises(chapter.num);

    // --- Document Setup ---
    const pageWidth = doc.internal.pageSize.width; // ~210mm
    const pageHeight = doc.internal.pageSize.height; // ~297mm
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let yPos = 20;

    // --- Title ---
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(`Worksheet: ${selectedTech.toUpperCase()}`, margin, yPos);
    yPos += 8;
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`${chapter.title}`, margin, yPos);
    yPos += 15;

    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos - 5, pageWidth - margin, yPos - 5);

    exercises.forEach((ex, idx) => {
      const exampleNum = idx + 1;
      const savedData = userCodes[`ch${chapter.num}-ex${exampleNum}`];

      // Check for page break (estimation)
      if (yPos > pageHeight - 50) {
        doc.addPage();
        yPos = 20;
      }

      // Ex Header
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 51, 102); // Dark Blue

      // Use stripped HTML for PDF
      const cleanTitle = stripHtml(ex.question || ex.title || "Untitled");
      const fullTitle = `Example ${exampleNum}: ${cleanTitle}`;

      // Split title to fit width and handle newlines
      const titleLines = doc.splitTextToSize(fullTitle, contentWidth);
      doc.text(titleLines, margin, yPos);

      // Increase yPos based on title height
      yPos += titleLines.length * 6 + 4;

      // Description
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);

      // Use stripped HTML for PDF description
      const cleanDesc = stripHtml(ex.description || "No description.");
      const descLines = doc.splitTextToSize(cleanDesc, contentWidth);
      doc.text(descLines, margin, yPos);
      yPos += descLines.length * 5 + 5;

      // Check space for code block
      const codeContent = savedData
        ? savedData.code
        : ex.initialCode || "// No code available";
      const codeLines = doc.splitTextToSize(codeContent, contentWidth - 4); // -4 for padding
      const codeBlockHeight = codeLines.length * 4 + 10;

      if (yPos + codeBlockHeight > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }

      // Code Label
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      if (savedData) {
        doc.setTextColor(0, 128, 0); // Green
        doc.text(
          `[YOUR SOLUTION ${savedData.marks >= 10 ? "✅" : ""}]`,
          margin,
          yPos
        );
      } else {
        doc.setTextColor(100, 100, 100); // Gray
        doc.text("[INITIAL CODE]", margin, yPos);
      }
      yPos += 5;

      // Code Background Area
      doc.setFillColor(245, 247, 250); // Light Gray/Blue
      doc.rect(margin, yPos - 3, contentWidth, codeBlockHeight, "F");

      // Code Text
      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);
      doc.text(codeLines, margin + 2, yPos + 3);

      yPos += codeBlockHeight + 10;
    });

    doc.save(
      `${selectedTech}_${chapter.title.replace(/\s+/g, "_")}_Worksheet.pdf`
    );
  };

  return (
    <div className="worksheets-container">
      <h2 className="worksheet-title">Worksheets & Practice Codes</h2>

      <div className="tech-selector">
        {Object.keys(chapterInfoByLang).map((tech) => (
          <button
            key={tech}
            className={`tech-btn ${selectedTech === tech ? "active" : ""}`}
            onClick={() => setSelectedTech(tech)}
          >
            {tech.toUpperCase()}
          </button>
        ))}
      </div>

      {loadingCodes && userId && (
        <div className="loading-text">Loading your solutions...</div>
      )}

      <div className="chapters-list">
        {techData &&
          techData.chapters.map((chapter) => (
            <div key={chapter.num} className="chapter-card">
              <div
                className="chapter-header"
                onClick={() => toggleChapter(chapter.num)}
              >
                <div className="chapter-info">
                  {expandedChapters[chapter.num] ? (
                    <FaChevronDown size={12} />
                  ) : (
                    <FaChevronRight size={12} />
                  )}
                  <h3>{chapter.title}</h3>
                </div>
                <button
                  className="download-btn"
                  onClick={(e) => handleDownloadPDF(e, chapter)}
                  title="Download as PDF"
                >
                  <FaDownload size={14} /> PDF
                </button>
              </div>

              <div
                className={`exercises-list ${
                  expandedChapters[chapter.num] ? "open" : ""
                }`}
              >
                {getExercises(chapter.num).map((exercise, idx) => {
                  const exampleNum = idx + 1;
                  const savedData =
                    userCodes[`ch${chapter.num}-ex${exampleNum}`];
                  const isCompleted = savedData && savedData.marks >= 10;

                  return (
                    <div key={idx} className="exercise-item container-fluid">
                      <div className="row no-gutters">
                        <div className="col-12 exercise-meta">
                          <div className="exercise-header-compact">
                            <span className="ex-title">
                              <strong>Ex {exampleNum}:</strong>{" "}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: (
                                    exercise.question || "Untitled"
                                  ).replace(/\n/g, "<br />"),
                                }}
                              />
                            </span>
                            {isCompleted && (
                              <FaCheckCircle
                                color="#10b981"
                                size={14}
                                title="Completed"
                              />
                            )}
                          </div>
                          <p
                            className="exercise-desc-compact"
                            dangerouslySetInnerHTML={{
                              __html: exercise.description,
                            }}
                          />
                        </div>
                        <div className="col-12">
                          {/* Initial Code */}
                          {exercise.initialCode && !savedData && (
                            <div className="code-preview compact-preview">
                              <div className="code-header-compact">
                                <span>Initial Code</span>
                                <button
                                  className="copy-btn-compact"
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      exercise.initialCode
                                    )
                                  }
                                  title="Copy Code"
                                >
                                  <FaCopy size={12} />
                                </button>
                              </div>
                              <div className="syntax-highlighter-wrapper">
                                <SyntaxHighlighter
                                  language={
                                    selectedTech === "html"
                                      ? "html"
                                      : selectedTech === "java"
                                      ? "java"
                                      : selectedTech === "python"
                                      ? "python"
                                      : selectedTech === "css"
                                      ? "css"
                                      : selectedTech === "sql"
                                      ? "sql"
                                      : "javascript"
                                  }
                                  style={coy}
                                  customStyle={{
                                    margin: 0,
                                    padding: "12px",
                                    borderRadius: "0 0 8px 8px",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  {exercise.initialCode}
                                </SyntaxHighlighter>
                              </div>
                            </div>
                          )}

                          {/* User Saved Answer */}
                          {savedData && (
                            <div className="code-preview compact-preview solution-preview">
                              <div className="code-header-compact success-header">
                                <span>
                                  Your Solution {isCompleted ? "✅" : ""}
                                </span>
                                <button
                                  className="copy-btn-compact"
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      savedData.code
                                    )
                                  }
                                  title="Copy Code"
                                >
                                  <FaCopy size={12} />
                                </button>
                              </div>
                              <div className="syntax-highlighter-wrapper">
                                <SyntaxHighlighter
                                  language={
                                    selectedTech === "html"
                                      ? "html"
                                      : selectedTech === "java"
                                      ? "java"
                                      : selectedTech === "python"
                                      ? "python"
                                      : selectedTech === "css"
                                      ? "css"
                                      : selectedTech === "sql"
                                      ? "sql"
                                      : "text"
                                  }
                                  style={coy}
                                  customStyle={{
                                    margin: 0,
                                    padding: "12px",
                                    borderRadius: "0 0 8px 8px",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  {savedData.code}
                                </SyntaxHighlighter>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Worksheets;
