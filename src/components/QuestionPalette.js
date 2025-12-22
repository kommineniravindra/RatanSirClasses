import React, { useEffect } from "react";
import "../css/Exam.css";

const QuestionPalette = ({
  quiz,
  blanks,
  coding,
  pseudo,
  handleQuestionJump,
  isCodingRoundAvailable,
  calculateAnswerStatus,
  currentQuestionInView,
  currentPage,
}) => {
  // Define all sections' data in the desired order
  const getSectionDetails = (section) => {
    if (section === 1) return { questions: quiz, startIndex: 0 };
    if (section === 2) return { questions: blanks, startIndex: quiz.length };
    if (section === 3)
      return {
        questions: pseudo,
        startIndex: quiz.length + blanks.length,
      };
    if (section === 4)
      return {
        questions: coding,
        startIndex: quiz.length + blanks.length + pseudo.length,
      };
    return { questions: [], startIndex: 0 };
  };

  // Determine current section data
  const { questions, startIndex } = getSectionDetails(currentPage);

  // Generate buttons for ONLY the current section
  const allButtons = questions.map((_, i) => {
    const globalIndex = startIndex + i;
    // currentPage corresponds to the section number (1, 2, 3, 4)
    const status = calculateAnswerStatus(currentPage, i);

    return (
      <button
        key={`pal-${globalIndex}`}
        className={`palette-button ${status}`}
        onClick={() => handleQuestionJump(globalIndex, currentPage)}
      >
        {globalIndex + 1}
      </button>
    );
  });

  // Auto-scroll palette to keep current question in view
  useEffect(() => {
    const activeBtn = document.querySelector(".palette-button.current-in-view");
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentQuestionInView]);

  return (
    <div className="question-palette-fixed-header">
      {/* Using .palette-inner for the scrolling container */}
      <div className="palette-inner">{allButtons}</div>
    </div>
  );
};

export default QuestionPalette;
