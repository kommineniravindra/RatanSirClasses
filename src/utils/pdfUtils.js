import React from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

/**
 * Language name mapping for PDF filenames
 */
const LANGUAGE_NAME_MAP = {
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
  html: "HTML",
  css: "CSS",
  sql: "SQL",
  sqlite3: "SQL",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  dotnet: "C#",
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

/**
 * Generates and downloads a PDF of the compiler code and output.
 *
 * @param {string} language - The current language ID.
 * @param {string} fileNameOverride - Optional filename override.
 */
export const downloadCompilerPdf = async (
  language,
  fileNameOverride = null
) => {
  const isWebLanguage = language === "html" || language === "css";
  const langDisplay = LANGUAGE_NAME_MAP[language] || "CodePulse";
  const fileName = fileNameOverride || `CodePulse_${langDisplay}`;

  toast.info("Generating PDF... Please wait.");
  await new Promise((r) => setTimeout(r, 100));

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();

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

    pdf.save(`${fileName}.pdf`);
    toast.success("PDF Downloaded Successfully!");
  } catch (error) {
    console.error("PDF Generation Error:", error);
    toast.error("Failed to generate PDF.");
  }
};

/**
 * Shared PDF Print Layout Component
 */
export const PdfPrintLayout = ({
  code,
  language,
  output,
  userName = "Guest",
}) => {
  const isWebLanguage = language === "html" || language === "css";
  const lines = (code || "").split("\n");
  const LINES_PER_PAGE = 40;
  const totalPages = Math.ceil(lines.length / LINES_PER_PAGE) || 1;

  return (
    <div
      className="pdf-hidden-layout"
      style={{
        position: "absolute",
        top: "-10000px",
        left: "-10000px",
        zIndex: -1,
      }}
    >
      {/* 1. Render Code Pages */}
      {(() => {
        const pages = [];
        for (let i = 0; i < totalPages; i++) {
          const start = i * LINES_PER_PAGE;
          const end = start + LINES_PER_PAGE;
          const chunk = lines.slice(start, end).join("\n");

          pages.push(
            <div
              key={`code-page-${i}`}
              className="pdf-page-code pdf-page-code-container"
              style={{
                width: "210mm",
                minHeight: "297mm",
                background: "white",
                padding: "40px",
                color: "black",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {/* PDF HEADER */}
              <div
                className="pdf-header-wrapper"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "30px",
                  borderBottom: "2px solid #eee",
                  paddingBottom: "10px",
                }}
              >
                <div>
                  <h1
                    className="pdf-title"
                    style={{ margin: 0, color: "#2563eb" }}
                  >
                    CodePulse-R
                  </h1>
                  <p
                    className="pdf-subtitle"
                    style={{ margin: 0, color: "#666" }}
                  >
                    Source Code - Page {i + 1} of {totalPages}
                  </p>
                </div>
                <div
                  className="pdf-student-info"
                  style={{ textAlign: "right" }}
                >
                  <p className="pdf-student-name" style={{ margin: 0 }}>
                    Student: {userName}
                  </p>
                  <p
                    className="pdf-date"
                    style={{ margin: 0, fontSize: "12px", color: "#888" }}
                  >
                    Date: {new Date().toLocaleDateString()}
                    <br />
                    Time: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* CONTENT */}
              <h3
                className="pdf-section-title"
                style={{
                  color: "#333",
                  borderLeft: "4px solid #2563eb",
                  paddingLeft: "10px",
                  marginBottom: "20px",
                }}
              >
                {LANGUAGE_NAME_MAP[language] || language} ({i + 1}/{totalPages})
              </h3>
              <div className="pdf-code-block">
                <SyntaxHighlighter
                  language={language === "sqlite3" ? "sql" : language}
                  style={docco}
                  showLineNumbers={true}
                  startingLineNumber={start + 1}
                  wrapLongLines={true}
                >
                  {chunk || ""}
                </SyntaxHighlighter>
              </div>

              {/* FOOTER */}
              <div
                className="pdf-footer-wrapper"
                style={{
                  marginTop: "auto",
                  paddingTop: "20px",
                  borderTop: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "#888",
                }}
              >
                <span>Generated by CodePulse-R</span>
                <span>www.codepulse-r.com</span>
              </div>
            </div>
          );
        }
        return pages;
      })()}

      {/* 2. Render Output Pages */}
      {!isWebLanguage && (
        <div
          className="pdf-page-output"
          style={{
            width: "210mm",
            minHeight: "297mm",
            background: "white",
            padding: "40px",
            color: "black",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div className="pdf-page-output-container">
            {/* PDF HEADER */}
            <div
              className="pdf-header-wrapper"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "30px",
                borderBottom: "2px solid #eee",
                paddingBottom: "10px",
              }}
            >
              <div>
                <h1
                  className="pdf-title"
                  style={{ margin: 0, color: "#2563eb" }}
                >
                  CodePulse-R
                </h1>
                <p
                  className="pdf-subtitle"
                  style={{ margin: 0, color: "#666" }}
                >
                  Console Output
                </p>
              </div>
              <div className="pdf-student-info" style={{ textAlign: "right" }}>
                <p className="pdf-student-name" style={{ margin: 0 }}>
                  Name: {userName}
                </p>
                <p
                  className="pdf-date"
                  style={{ margin: 0, fontSize: "12px", color: "#888" }}
                >
                  Date: {new Date().toLocaleDateString()}
                  <br />
                  Time: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>

            <h3
              className="pdf-section-title"
              style={{
                color: "#333",
                borderLeft: "4px solid #2563eb",
                paddingLeft: "10px",
                marginBottom: "20px",
              }}
            >
              Execution Result
            </h3>
            <div
              className="pdf-result-box"
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              {Array.isArray(output) ? (
                <div className="sql-result-container">
                  {output.map((msg, i) => (
                    <div
                      key={i}
                      className="sql-msg-item pdf-sql-item"
                      style={{ marginBottom: "15px" }}
                    >
                      {msg.type === "success" && (
                        <div
                          className="sql-success-msg pdf-sql-success"
                          style={{ color: "green" }}
                        >
                          ✔ {msg.text}
                        </div>
                      )}
                      {msg.type === "error" && (
                        <div
                          className="error-msg-box pdf-sql-error"
                          style={{ color: "red" }}
                        >
                          {msg.text}
                        </div>
                      )}
                      {msg.type === "info" && (
                        <div
                          className="info-msg-text"
                          style={{ color: "#444" }}
                        >
                          {msg.text}
                        </div>
                      )}
                      {msg.type === "table" && msg.data && (
                        <div
                          className="pdf-table-wrapper"
                          style={{ marginTop: "10px", overflowX: "auto" }}
                        >
                          <table
                            className="pdf-table"
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                            }}
                          >
                            <thead>
                              <tr
                                className="pdf-table-row-header"
                                style={{ background: "#e2e8f0" }}
                              >
                                {msg.data.columns.map((col, idx) => (
                                  <th
                                    key={idx}
                                    className="pdf-table-th"
                                    style={{
                                      padding: "8px",
                                      border: "1px solid #cbd5e1",
                                    }}
                                  >
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {msg.data.values.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  {row.map((val, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className="pdf-table-td"
                                      style={{
                                        padding: "8px",
                                        border: "1px solid #cbd5e1",
                                      }}
                                    >
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
                <pre
                  className="pdf-pre-output"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                    fontSFamily: "monospace",
                    color: "#1e293b",
                  }}
                >
                  {output || "No output generated."}
                </pre>
              )}
            </div>

            {/* PDF FOOTER */}
            <div
              className="pdf-footer-wrapper"
              style={{
                marginTop: "30px",
                paddingTop: "20px",
                borderTop: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#888",
              }}
            >
              <span>Generated by CodePulse-R</span>
              <span>www.codepulse-r.com</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
