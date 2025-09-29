import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Ensure this path points to your CSS file.
import "../css/QnAComponent.css";

const QnAComponent = () => {
  // State Management
  const [qnaList, setQnaList] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  // Form states for new questions
  const [questionInput, setQuestionInput] = useState("");
  const [questionName, setQuestionName] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [expectedOutputInput, setExpectedOutputInput] = useState("");

  // Form states for new answers (keyed by question ID)
  const [answerInputs, setAnswerInputs] = useState({});
  const [answerNames, setAnswerNames] = useState({});

  // Themes for styling each question item
  const themes = ["theme-blue", "theme-purple", "theme-green", "theme-amber"];

  // --- API Functions ---

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/questions");
      setQnaList(response.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      toast.error("Failed to load questions from the server.");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handlePostQuestion = async () => {
    if (!questionInput.trim() || !questionName.trim()) {
      toast.error("Please enter your name and a question!");
      return;
    }
    const newQuestion = {
      question: questionInput,
      questionBy: questionName,
      input: codeInput,
      expectedOutput: expectedOutputInput,
    };
    try {
      await axios.post("http://localhost:5000/api/questions", newQuestion);
      setQuestionInput("");
      setQuestionName("");
      setCodeInput("");
      setExpectedOutputInput("");
      toast.success("Question posted!");
      fetchQuestions();
    } catch (error) {
      toast.error("An error occurred while posting the question.");
    }
  };

  const handlePostAnswer = async (questionId) => {
    const answerText = answerInputs[questionId] || "";
    const answerAuthor = answerNames[questionId] || "";
    if (!answerText.trim() || !answerAuthor.trim()) {
      toast.error("Please enter your name and an answer!");
      return;
    }
    const newAnswer = {
      answer: answerText,
      answerBy: answerAuthor,
    };
    try {
      await axios.post(
        `http://localhost:5000/api/questions/${questionId}/answers`,
        newAnswer
      );
      setAnswerInputs({ ...answerInputs, [questionId]: "" });
      setAnswerNames({ ...answerNames, [questionId]: "" });
      toast.success("Answer posted!");
      fetchQuestions();
    } catch (error) {
      toast.error("An error occurred while posting the answer.");
    }
  };

  // Toggle accordion visibility using CSS classes
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div class="qna-container scale-150">
      <h1 className="qna-title">Coding Q&A Platform</h1>

      {/* Post Question Form */}
      <div className="qna-form">
        <input
          type="text"
          placeholder="Enter your name"
          value={questionName}
          onChange={(e) => setQuestionName(e.target.value)}
          className="qna-input"
        />
        <textarea
          placeholder="Enter your question..."
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          className="qna-textarea"
        />
        <textarea
          placeholder="Input (Optional)"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          className="qna-textarea code-input"
        />
        <textarea
          placeholder="Expected Output (Optional)"
          value={expectedOutputInput}
          onChange={(e) => setExpectedOutputInput(e.target.value)}
          className="qna-textarea code-input"
        />
        <button onClick={handlePostQuestion} className="qna-btn">
          Post Question
        </button>
      </div>

      {/* Questions List */}
      <div className="qna-list">
        {qnaList.map((qna, qIndex) => {
          const themeClass = themes[qIndex % themes.length];
          const isAccordionOpen = openIndex === qIndex;
          const questionNumber = qnaList.length - qIndex;

          return (
            <div key={qna._id} className={`qna-item ${themeClass}`}>
              <div
                className="qna-question-header"
                onClick={() => toggleAccordion(qIndex)}
              >
                <div className="qna-question-content">
                  <div className="qna-meta-header">
                    <span className="qna-number">
                      Question: {questionNumber}
                    </span>
                    <span className="qna-posted-by">
                      Posted by: <strong>{qna.questionBy}</strong>
                    </span>
                  </div>
                  <div className="qna-line-item">
                    <span className="qna-line-label">Question:</span>
                    <p className="qna-line-text">{qna.question}</p>
                  </div>
                  {qna.input && (
                    <div className="qna-line-item">
                      <span className="qna-line-label">Input:</span>
                      <pre className="qna-line-code">{qna.input}</pre>
                    </div>
                  )}
                  {qna.expectedOutput && (
                    <div className="qna-line-item">
                      <span className="qna-line-label">Output:</span>
                      <pre className="qna-line-code">{qna.expectedOutput}</pre>
                    </div>
                  )}
                </div>
                <span
                  className={`accordion-toggle ${
                    isAccordionOpen ? "open" : ""
                  }`}
                ></span>
              </div>

              <div
                className={`qna-details-wrapper ${
                  isAccordionOpen ? "show" : ""
                }`}
              >
                <div className="qna-details-content">
                  <div className="qna-answers-list">
                    <h3 className="qna-answers-title">Answers</h3>
                    {qna.answers.length > 0 ? (
                      qna.answers.map((ans) => (
                        // --- MODIFIED ANSWER BLOCK ---
                        <div key={ans._id} className="qna-answer">
                          <div className="qna-answer-header">
                            <div className="qna-answer-avatar">
                              {ans.answerBy
                                ? ans.answerBy.charAt(0).toUpperCase()
                                : "A"}
                            </div>
                            <div className="qna-answer-meta">
                              <span className="qna-answer-author-name">
                                {ans.answerBy}
                              </span>
                              <span className="qna-answer-author-label">
                                Answered
                              </span>
                            </div>
                          </div>
                          <p className="qna-answer-text">{ans.answer}</p>
                        </div>
                        // --- END OF MODIFIED BLOCK ---
                      ))
                    ) : (
                      <p className="qna-no-answers">
                        No answers yet. Be the first to reply!
                      </p>
                    )}
                  </div>

                  {/* Add Answer Form */}
                  <div className="qna-answer-form">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={answerNames[qna._id] || ""}
                      onChange={(e) =>
                        setAnswerNames({
                          ...answerNames,
                          [qna._id]: e.target.value,
                        })
                      }
                      className="qna-input-themed"
                    />
                    <textarea
                      placeholder="Your Answer..."
                      value={answerInputs[qna._id] || ""}
                      onChange={(e) =>
                        setAnswerInputs({
                          ...answerInputs,
                          [qna._id]: e.target.value,
                        })
                      }
                      className="qna-textarea-themed"
                    />
                    <button
                      onClick={() => handlePostAnswer(qna._id)}
                      className="qna-btn-secondary"
                    >
                      Post Answer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default QnAComponent;
