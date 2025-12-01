import React, { useEffect, useState, useRef, useCallback } from "react";
import '../css/TechClass.css'; 
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; 

// --- SECRET CODE MODAL COMPONENT ---
// This component must be defined outside or inside the main component scope
const SecretCodeModal = ({ onUnlock }) => {
    const [inputCode, setInputCode] = useState("");
    const [error, setError] = useState(false);
    const SECRET_CODE = "codepulse"; // The required secret code

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(false);
        if (inputCode.toLowerCase() === SECRET_CODE) {
            onUnlock(true);
        } else {
            setError(true);
            setInputCode("");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>🔒 Access Required</h2>
                <p>Please enter the secret code to view the class materials.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="Enter Code"
                        className={error ? "input-error" : ""}
                    />
                    <button type="submit">Unlock Content</button>
                </form>
                {error && <p className="error-message">Incorrect code. Try again.</p>}
            </div>
        </div>
    );
};
// --- END MODAL COMPONENT ---


function TechClass() {
  const [technology, setTechnology] = useState("");
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [questions, setQuestions] = useState([]);
  
  const [showCount, setShowCount] = useState(0); 
  const [isUnlocked, setIsUnlocked] = useState(false); // <--- REINTRODUCED STATE
  
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  
  const questionContainerRef = useRef(null); 

  const technologies = [
    "html", "css", "javascript", "java", "python", "sql", "react", "restapi", "rest", "microservices"
  ];

  // 1. Load Chapters
  useEffect(() => {
    if (!technology) return;
    const loadChapters = async () => {
      let chapterList = [];
      let chapterNumber = 1;
      while (true) {
        try {
          await import(`../classnotes/${technology}/Chapter${chapterNumber}.json`);
          chapterList.push(`Chapter${chapterNumber}`);
          chapterNumber++;
        } catch {
          break;
        }
      }
      setChapters(chapterList);
      setSelectedChapter("");
      setQuestions([]);
      setShowCount(0); 
    };
    loadChapters();
  }, [technology]);

  // 2. Load Questions
  useEffect(() => {
    if (!technology || !selectedChapter) return;
    const loadQuestions = async () => {
      const chapterData = await import(
        `../classnotes/${technology}/${selectedChapter}.json`
      );
      const loadedQuestions = chapterData.default;
      setQuestions(loadedQuestions);
      
      setShowCount(2); 
    };
    loadQuestions();
  }, [selectedChapter, technology]);
  
  // 3. Scroll Logic Effect (Attached to the specific container)
  useEffect(() => {
    const container = questionContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container; 

      setShowScrollUp(scrollTop > 10); 
      
      setShowScrollDown(scrollHeight > clientHeight && Math.floor(scrollTop + clientHeight) < scrollHeight); 
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); 
    
    const timeout = setTimeout(handleScroll, 200);

    return () => {
        container.removeEventListener("scroll", handleScroll);
        clearTimeout(timeout);
    };
  }, [questions]); 
  
  const questionsToShow = questions.slice(0, showCount);

  // Handle Next: Increments showCount and forces a scroll check on the container
  const handleNext = () => {
    if (showCount < questions.length) {
      setShowCount((prev) => {
        const newCount = Math.min(prev + 2, questions.length);
        setTimeout(() => {
            if (questionContainerRef.current) {
                questionContainerRef.current.dispatchEvent(new Event('scroll'));
            }
        }, 10); 
        return newCount;
      });
    }
  };
  
  // Scroll handlers (Scroll the container, not the window)
  const scrollToTop = () => {
    if (questionContainerRef.current) {
        questionContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const scrollToBottom = () => {
    if (questionContainerRef.current) {
        questionContainerRef.current.scrollTo({ top: questionContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  };
  
  const fixedHeaderHeight = 65; 

  // --- CONDITIONAL RENDER CHECK ---
  if (!isUnlocked) {
      return <SecretCodeModal onUnlock={setIsUnlocked} />;
  }
  // --- END CONDITIONAL RENDER CHECK ---

  return (
    <div className="tech-class-container">
      
      {/* Scroll Up Button - Position is fixed to the viewport */}
      {showScrollUp && (
        <button className="scroll-button scroll-up" onClick={scrollToTop} title="Scroll to Top">
            <FaArrowUp />
        </button>
      )}

      {/* FIXED CONTROL GROUP */}
      <div className="controls-group"> 
        <h2>OUR CLASSES</h2>
        <label>Choose Technology:</label>
        <select
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
        >
          <option value="">-- Select Technology --</option>
          {technologies.map((tech) => (
            <option key={tech} value={tech}>{tech.toUpperCase()}</option>
          ))}
        </select>
      

        {/* Chapters dropdown is now always rendered but disabled when empty */}
        <div style={{ marginLeft: '20px' }}> 
          <label>Choose Chapter:</label>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            disabled={chapters.length === 0}
          >
            <option value="">-- Select Chapter --</option>
            {chapters.map((ch) => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>
        </div>

      </div> 
      {/* END FIXED CONTROL GROUP */}

      {/* Main Content Area - This wrapper SCROLLS */}
      <div 
          className="questions-scroll-wrapper" 
          ref={questionContainerRef} 
          style={{ marginTop: `${fixedHeaderHeight}px` }} 
      >
        <div className="questions-display-container">
          {questionsToShow.map((q) => (
                <div key={`${q.id}-${selectedChapter}`} className="question-item">
                  <h3>Q{q.id}. {q.question}</h3>
                  
                  {q.answer && (
                      <p>
                          <strong>Ans:</strong> {q.answer}
                      </p>
                  )}

                  {q.explanation && (
                    <p>
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  )}

                  {q.image && (
                    <>
                      <img src={q.image.url} alt={q.image.caption || `Image for Q${q.id}`} width="250" />
                      {q.image.caption && <p style={{ fontSize: "12px" }}>{q.image.caption}</p>}
                    </>
                  )}
                  <hr className="question-separator" />
                </div>
              ))}
        </div>

        {/* Show More Button */}
        {questions.length > 0 && showCount < questions.length && (
          <div className="navigation-controls">
            <button 
              onClick={handleNext}
            >
              Show More Questions ({questions.length - showCount} Remaining)
            </button>
          </div>
        )}
      </div>

      {/* Scroll Down Button */}
      {showScrollDown && (
        <button className="scroll-button scroll-down" onClick={scrollToBottom} title="Scroll to Bottom">
            <FaArrowDown />
        </button>
      )}
      
    </div>
  );
}

export default TechClass;