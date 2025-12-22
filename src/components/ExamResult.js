import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const ExamResult = ({
  totals,
  maxTotalMarksDisplay,
  selectedQuiz,
  selectedBlanks,
  selectedCoding,
  selectedPseudo,
  quizResults,
  blankResults,
  codeResults,
  pseudoResults,
  answers,
  malpracticeDetected,
  technology,
  examId,
  techConfig,
  onGoToDashboard,
  ExamConfig,
  isCodingRoundAvailable,
}) => {
  const examNumber = examId ? examId.replace("exam", "") : "";

  return (
    <div className="exam-container">
      {/* <div className="exam-header">
        <h1>
          {technology.charAt(0).toUpperCase() + technology.slice(1)} Exam #
          {examNumber}
        </h1>
      </div> */}
      <div className="result-page">
        <h2>Exam Results</h2>
        {malpracticeDetected && (
          <div className="malpractice-warning">
            <FaExclamationTriangle />
            <h3>Malpractice Detected</h3>
            <p>Your test was auto-submitted due to leaving the page.</p>
          </div>
        )}
        <div className="total-summary">
          <h3>Overall Score</h3>
          <div className="score-details">
            <p>
              MCQ:{" "}
              <span>
                {totals.mcq} / {selectedQuiz.length * ExamConfig.mcqMarks}
              </span>
            </p>
            <p>
              Blanks:{" "}
              <span>
                {totals.blanks} /{" "}
                {selectedBlanks.length * ExamConfig.blankMarks}
              </span>
            </p>
            <p>
              Pseudo:{" "}
              <span>
                {totals.pseudo} /{" "}
                {selectedPseudo.length * ExamConfig.pseudoMarks}
              </span>
            </p>
            {isCodingRoundAvailable && (
              <p>
                Coding:{" "}
                <span>
                  {totals.coding} /{" "}
                  {selectedCoding.reduce(
                    (sum, q) => sum + (q.maxMarks || ExamConfig.codingMarks),
                    0
                  )}
                </span>
              </p>
            )}
          </div>
          <p className="grand-total">
            Grand Total:{" "}
            <span>
              {totals.mcq + totals.blanks + totals.coding + totals.pseudo} /{" "}
              {maxTotalMarksDisplay}
            </span>
          </p>
          <button className="go-to-dashboard-button" onClick={onGoToDashboard}>
            Go to Dashboard
          </button>
        </div>

        <div className="feedback-section">
          <h3>Detailed Feedback</h3>

          <h4>MCQ Questions</h4>
          {selectedQuiz.map((q, i) => (
            <div key={`quiz-fb-${i}`} className="feedback-item">
              <p>
                <strong>Q{i + 1}:</strong> {q.question}
              </p>
              <p
                className={`feedback-answer ${
                  quizResults[i]?.correct ? "correct" : "incorrect"
                }`}
              >
                <strong>Your Answer:</strong>{" "}
                {quizResults[i]?.chosen || "Not answered"}
              </p>
              {!quizResults[i]?.correct && (
                <p className="feedback-answer correct">
                  <strong>Correct Answer:</strong> {q.answer}
                </p>
              )}
            </div>
          ))}

          <h4>Fill in the Blanks</h4>
          {selectedBlanks.map((q, i) => (
            <div key={`blank-fb-${i}`} className="feedback-item">
              <p>
                <strong>Q{i + 1}:</strong> {q.question}
              </p>
              <p
                className={`feedback-answer ${
                  blankResults[i]?.correct ? "correct" : "incorrect"
                }`}
              >
                <strong>Your Answer:</strong>{" "}
                {blankResults[i]?.entered || "Not answered"}
              </p>
              {!blankResults[i]?.correct && (
                <p className="feedback-answer correct">
                  <strong>Correct Answer:</strong> {q.answer}
                </p>
              )}
            </div>
          ))}

          {selectedPseudo.length > 0 && (
            <>
              <h4>Pseudo Code Questions</h4>
              {selectedPseudo.map((q, i) => (
                <div key={`pseudo-fb-${i}`} className="feedback-item">
                  <div className="main-code-block-wrapper">
                    <pre
                      style={{
                        background: "#f8f9fa",
                        padding: "15px",
                        borderRadius: "8px",
                        overflowX: "auto",
                        border: "1px solid #e9ecef",
                        color: "#000",
                        fontWeight: "bold",
                        fontSize: "1rem",
                      }}
                    >
                      <strong>
                        Q{i + 1}. What will be the output of the following code?
                      </strong>
                      <div style={{ height: "10px" }}></div>
                      <code>{q.question}</code>
                    </pre>
                  </div>
                  <p
                    className={`feedback-answer ${
                      pseudoResults[i]?.correct ? "correct" : "incorrect"
                    }`}
                  >
                    <strong>Your Answer:</strong>{" "}
                    {pseudoResults[i]?.chosen || "Not answered"}
                  </p>
                  {!pseudoResults[i]?.correct && (
                    <p className="feedback-answer correct">
                      <strong>Correct Answer:</strong> {q.answer}
                    </p>
                  )}
                </div>
              ))}
            </>
          )}

          {isCodingRoundAvailable && (
            <>
              <h4>Coding Questions</h4>
              {selectedCoding.map((q, i) => (
                <div key={`code-fb-${i}`} className="feedback-item">
                  <p>
                    <strong>Q{i + 1}:</strong>{" "}
                    <span dangerouslySetInnerHTML={{ __html: q.question }} />
                  </p>
                  <p className="marks-display">
                    <strong>Marks Scored:</strong> {codeResults[i]?.marks || 0}{" "}
                    / {q.maxMarks || ExamConfig.codingMarks}
                  </p>
                  <details>
                    <summary>Show Solution & Your Code</summary>
                    <div className="code-feedback-details">
                      <h5>Your Submitted Code:</h5>
                      <SyntaxHighlighter
                        language={techConfig.language}
                        style={coy}
                        customStyle={{ borderRadius: "8px" }}
                      >
                        {answers[`code-${i}`] ||
                          "// You did not submit any code for this question."}
                      </SyntaxHighlighter>
                      <h5>Correct Solution:</h5>
                      <SyntaxHighlighter
                        language={techConfig.language}
                        style={coy}
                        customStyle={{ borderRadius: "8px" }}
                      >
                        {q.answer}
                      </SyntaxHighlighter>
                    </div>
                  </details>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamResult;
