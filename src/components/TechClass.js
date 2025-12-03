import React, { useEffect, useState, useRef, useCallback } from "react";
import '../css/TechClass.css'; 
import { FaArrowUp, FaArrowDown, FaExpandAlt, FaCompressAlt, FaEraser, FaPlus, FaMinus } from 'react-icons/fa'; 

// New Component for the Fullscreen Toggle Button
const FullScreenToggle = ({ isFullScreen, onToggle }) => (
    <button 
        // CLASSNAME CHANGE
        className={`techclass-btn techclass-toggle techclass-fullscreen-toggle ${isFullScreen ? 'is-full' : ''}`} 
        onClick={onToggle}
        title={isFullScreen ? "Exit Fullscreen" : "View Fullscreen"}
    >
        {isFullScreen ? <FaCompressAlt /> : <FaExpandAlt />}
    </button>
);

// NEW: Erase Toggle Button (Floating)
const EraseToggle = ({ onErase, disabled }) => (
    <button 
        // CLASSNAME CHANGE
        className={`techclass-btn techclass-toggle techclass-erase-toggle ${disabled ? 'disabled' : ''}`} 
        onClick={onErase}
        disabled={disabled}
        title="Erase All Added Questions"
    >
        <FaEraser />
    </button>
);

// NEW: Font Size Control Buttons (Floating)
const FontControls = ({ onIncrease, onDecrease }) => (
    <div className="font-controls-group">
        <button 
            // CLASSNAME CHANGE
            className="techclass-btn techclass-toggle techclass-font-control-btn" 
            onClick={onIncrease}
            title="Increase Font Size"
        >
            <FaPlus />
        </button>
        <button 
            // CLASSNAME CHANGE
            className="techclass-btn techclass-toggle techclass-font-control-btn" 
            onClick={onDecrease}
            title="Decrease Font Size"
        >
            <FaMinus />
        </button>
    </div>
);

const SecretCodeModal = ({ onUnlock }) => {
    // ... (SecretCodeModal component remains unchanged)
    const [inputCode, setInputCode] = useState("");
    const [error, setError] = useState(false);
    const SECRET_CODE = "codepulse";

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
                    {/* CLASSNAME CHANGE */}
                    <button type="submit" className="techclass-btn techclass-modal-btn">Unlock Content</button>
                </form>
                {error && <p className="error-message">Incorrect code. Try again.</p>}
            </div>
        </div>
    );
};
// --- END MODAL COMPONENT ---


// --- TYPING EFFECT COMPONENT ---
const TypingEffect = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text.charAt(index));
                setIndex((prev) => prev + 1);
            }, 50); // Typing speed
            return () => clearTimeout(timeout);
        } else {
            // Wait a bit after typing finishes before completing
            const timeout = setTimeout(() => {
                onComplete();
            }, 1500);
            return () => clearTimeout(timeout);
        }
    }, [index, text, onComplete]);

    return <div className="typing-text">{displayedText}</div>;
};

// NEW: Website Info Component
const WebsiteInfo = () => (
    <div className="website-info-container">
        <h1>Welcome to CodePulse-R</h1>
        <p className="subtitle">Master Technology with Premium Class Notes</p>
        
        <div className="features-grid">
            <div className="feature-card">
                <h3>🚀 Expert Content</h3>
                <p>Curated by industry professionals for rapid learning.</p>
            </div>
            <div className="feature-card">
                <h3>✨ Premium Experience</h3>
                <p>Enjoy a distraction-free, beautiful learning environment.</p>
            </div>
            <div className="feature-card">
                <h3>📱 Fully Responsive</h3>
                <p>Learn on any device, anytime, anywhere.</p>
            </div>
        </div>

        <div className="instruction-box">
            <p><strong>How to Start:</strong> Select a Technology and Chapter from the top menu, then click <strong>"Start Class"</strong>.</p>
        </div>
    </div>
);

function TechClass() {
    const [technology, setTechnology] = useState("");
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState("");
    const [questions, setQuestions] = useState([]);
    
    const [showCount, setShowCount] = useState(0); 
    const [isUnlocked, setIsUnlocked] = useState(false); 
    
    const [showScrollUp, setShowScrollUp] = useState(false);
    const [showScrollDown, setShowScrollDown] = useState(false);
    
    // NEW STATE: Fullscreen control
    const [isFullScreen, setIsFullScreen] = useState(false); 
    
    // NEW STATE: Welcome Message
    const [showWelcome, setShowWelcome] = useState(false);
    
    // NEW STATE: Erase Animation
    const [isErasing, setIsErasing] = useState(false);
    
    // NEW STATE: Font Size
    const [fontSize, setFontSize] = useState(16); // Default 16px

    // NEW STATE: Class Started
    const [hasStarted, setHasStarted] = useState(false);
    
    const questionContainerRef = useRef(null); 

    const technologies = [
        "git","html", "css", "javascript", "java", "python", "sql", "react", "restapi", "rest", "microservices"
    ];

    // 1. Load Chapters (No change)
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
            setShowWelcome(false); 
            setIsErasing(false);
            setHasStarted(false); // Reset start state
        };
        loadChapters();
    }, [technology]);

    // 2. Load Questions (Modified to NOT auto-start)
    useEffect(() => {
        if (!technology || !selectedChapter) return;
        
        const loadQuestions = async () => {
            const chapterData = await import(
                `../classnotes/${technology}/${selectedChapter}.json`
            );
            const loadedQuestions = chapterData.default;
            setQuestions(loadedQuestions);
            
            // Do NOT set showCount here anymore. Waiting for "Start Class".
            setShowCount(0);
            setIsErasing(false);
            setHasStarted(false); // Reset start state when chapter changes
        };
        loadQuestions();
    }, [selectedChapter, technology]);
    
    // NEW: Handle Start Class
    const handleStartClass = () => {
        if (questions.length > 0) {
            setHasStarted(true);
            
            if (selectedChapter === "Chapter1") {
                setShowWelcome(true);
                // Questions will be shown after welcome message
            } else {
                setShowWelcome(false);
                setShowCount(2); // Show first 2 questions immediately
            }
        }
    };

    // Callback when typing finishes
    const handleWelcomeComplete = () => {
        setShowWelcome(false);
        setShowCount(2); // Start showing questions
    };

    // 3. Scroll Logic Effect (Modified dependency)
    useEffect(() => {
        const container = questionContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            // Need to wait until the DOM layout is stable after full screen toggle
            setTimeout(() => {
                const { scrollTop, scrollHeight, clientHeight } = container; 
                
                setShowScrollUp(scrollTop > 10); 
                
                // Adjusted logic for setShowScrollDown to be slightly more tolerant to pixel differences
                setShowScrollDown(scrollHeight > clientHeight && Math.ceil(scrollTop + clientHeight) < scrollHeight); 
            }, 50); // Small delay to account for reflow
        };

        container.addEventListener("scroll", handleScroll);
        handleScroll(); 
        
        const timeout = setTimeout(handleScroll, 200);

        return () => {
            container.removeEventListener("scroll", handleScroll);
            clearTimeout(timeout);
        };
    }, [questions, isFullScreen, showWelcome, showCount, hasStarted]); // Added hasStarted

    
    // 4. Fullscreen Change Listener (NEW: Handles native browser exit/entry)
    useEffect(() => {
        const handleFullScreenChange = () => {
            // Check if the document is currently in fullscreen mode
            const nativeFullScreen = !!document.fullscreenElement;
            
            setIsFullScreen(nativeFullScreen);
            
            if (questionContainerRef.current) {
                setTimeout(() => {
                    questionContainerRef.current.dispatchEvent(new Event('scroll'));
                }, 100); 
            }
        };

        // Attach listener for fullscreen change
        document.addEventListener('fullscreenchange', handleFullScreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []); 

    
    const questionsToShow = questions.slice(0, showCount);

    // Focus on the next section after showing more questions
    const handleNext = () => {
        if (showCount < questions.length) {
            setShowCount((prev) => {
                const newCount = Math.min(prev + 2, questions.length);
                
                // Scroll to the bottom of the newly loaded content
                setTimeout(() => {
                    if (questionContainerRef.current) {
                        // Scroll to the bottom of the scroll container
                        questionContainerRef.current.scrollTo({ top: questionContainerRef.current.scrollHeight, behavior: 'smooth' });
                        
                        // Trigger scroll logic update
                        questionContainerRef.current.dispatchEvent(new Event('scroll'));
                    }
                }, 10); 
                return newCount;
            });
        }
    };

    // NEW: Erase Logic with Smoke Animation (ERASE ALL)
    const handleErase = () => {
        if (showCount > 0 && !isErasing) {
            setIsErasing(true); // Trigger animation
            
            // Wait for animation to finish (800ms) before actually removing
            setTimeout(() => {
                setShowCount(0); // Reset to 0 (Erase Completely)
                setIsErasing(false); // Reset state
                
                // Update scroll logic
                 if (questionContainerRef.current) {
                     questionContainerRef.current.dispatchEvent(new Event('scroll'));
                }
            }, 800);
        }
    };
    
    // NEW: Font Size Handlers
    const handleIncreaseFont = () => setFontSize(prev => Math.min(prev + 2, 24));
    const handleDecreaseFont = () => setFontSize(prev => Math.max(prev - 2, 12));
    
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
    
    // UPDATED FUNCTION: Toggle Fullscreen
    const handleFullScreenToggle = () => {
        const element = document.documentElement; // Target the entire <html> element

        if (document.fullscreenElement) {
            // If currently in fullscreen mode, exit it
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        } else {
            // Request fullscreen mode
            if (element.requestFullscreen) {
                element.requestFullscreen();
            }
        }
    };

    const fixedHeaderHeight = 65; 

    if (!isUnlocked) {
        return <SecretCodeModal onUnlock={setIsUnlocked} />;
    }
    
    const isNextButtonVisible = hasStarted && !showWelcome && questions.length > 0 && showCount < questions.length;
    const isEraseButtonVisible = hasStarted && !showWelcome && questions.length > 0; // Always visible if questions exist
    const isClassCompleted = hasStarted && !showWelcome && questions.length > 0 && showCount === questions.length;

    return (
        <div className={`tech-class-container ${isFullScreen ? 'fullscreen-mode' : ''}`}>
            
            {/* NEW: Fullscreen Toggle Button */}
            <FullScreenToggle 
                isFullScreen={isFullScreen} 
                onToggle={handleFullScreenToggle} 
            />
            
            {/* NEW: Erase Toggle Button (Floating below Fullscreen) */}
            {isEraseButtonVisible && (
                <EraseToggle 
                    onErase={handleErase} 
                    disabled={isErasing} 
                />
            )}
            
            {/* NEW: Font Size Controls (Floating below Erase) */}
            <FontControls 
                onIncrease={handleIncreaseFont} 
                onDecrease={handleDecreaseFont} 
            />

            {showScrollUp && (
                <button 
                    // CLASSNAME CHANGE
                    className="techclass-btn techclass-scroll-btn techclass-scroll-up" 
                    onClick={scrollToTop} 
                    title="Scroll to Top"
                >
                    <FaArrowUp />
                </button>
            )}

            {/* Scroll Down button only needed when scrolling is possible AND the next button isn't covering the bottom content */}
            {showScrollDown && (
                <button 
                    // CLASSNAME CHANGE
                    className="techclass-btn techclass-scroll-btn techclass-scroll-down" 
                    onClick={scrollToBottom} 
                    title="Scroll to Bottom"
                >
                    <FaArrowDown />
                </button>
            )}
            
            {/* FIXED Next button moved outside of scroll container */}
            {isNextButtonVisible && (
                <div className="navigation-controls">
                    <button 
                        className="techclass-btn techclass-btn-next" 
                        onClick={handleNext}
                        title="Show Next Questions"
                    >
                        Next
                    </button>
                </div>
                
            )}
            {/* END FIXED BUTTON */}

            {/* CONDITIONAL RENDERING: Hide controls in fullscreen mode */}
            {!isFullScreen && (
                <div className="controls-group"> 
                    <h2>OUR CLASSES</h2>
                     <div style={{ marginLeft: '10px' }}>
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
                     </div>
                
                     <div style={{ marginLeft: '10px' }}> 
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

                    {/* NEW: Start Class Button */}
                    <button 
                        // CLASSNAME CHANGE
                        className="techclass-btn techclass-btn-start"
                        onClick={handleStartClass}
                        disabled={!technology || !selectedChapter || hasStarted}
                        style={{ marginLeft: '20px' }}
                    >
                        {hasStarted ? "Started" : "Class"}
                    </button>

                </div> 
            )}
            {/* END FIXED CONTROL GROUP */}

            {/* Main Content Area */}
            <div 
                className="questions-scroll-wrapper" 
                ref={questionContainerRef} 
                // Adjusted style to use variable only when NOT in fullscreen mode
                style={!isFullScreen ? { marginTop: `${fixedHeaderHeight}px` } : {}}
            >
                <div 
                    className="questions-display-container"
                    style={{ fontSize: `${fontSize}px` }} // Apply dynamic font size
                >
                    
                    {/* SHOW INFO IF NOT STARTED */}
                    {!hasStarted && <WebsiteInfo />}

                    {/* SHOW CONTENT IF STARTED */}
                    {hasStarted && (
                        <>
                            {/* WELCOME MESSAGE */}
                            {showWelcome ? (
                                <div className="welcome-container">
                                    <TypingEffect 
                                        text={`Let's master ${technology ? technology.toUpperCase() : 'Coding'}! Starting Chapter 1...`} 
                                        onComplete={handleWelcomeComplete} 
                                    />
                                </div>
                            ) : (
                                <>
                                    {questionsToShow.map((q, index) => {
                                             const isDying = isErasing && index >= showCount - 2;
                                            
                                            return (
                                                <div 
                                                    key={`${q.id}-${selectedChapter}`} 
                                                    className={`question-item ${isDying ? 'smoke-out' : 'animate-in'}`}
                                                >
                                                    <h2 className="question-text">Q{q.id}. {q.question}</h2>
                                                    
                                                    {q.answer && (
                                                        <p className="answer-text">
                                                            <strong>Ans:</strong> {q.answer}
                                                        </p>
                                                    )}

                                                    {q.explanation && (
                                                        <p className="explanation-text">
                                                            <strong>Explanation:</strong> {q.explanation}
                                                        </p>
                                                    )}

                                                    {q.image && (
                                                        <div className="image-container">
                                                            <img src={q.image.url} alt={q.image.caption || `Image for Q${q.id}`} width="250" />
                                                            {q.image.caption && <p style={{ fontSize: "12px" }}>{q.image.caption}</p>}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                            
                                        {isClassCompleted && (
                                            <div className="class-completed-message">
                                                ✨ Today's class is completed! ✨
                                            </div>
                                        )}
                                    </>
                                )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TechClass;