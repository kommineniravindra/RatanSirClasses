import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEO from "./SEO";
import "../css/TechClass.css";
import {
  FaArrowUp,
  FaArrowDown,
  FaExpandAlt,
  FaCompressAlt,
  FaEraser,
  FaPlus,
  FaMinus,
  FaChalkboard,
  FaPen,
  FaRegCircle,
  FaRegSquare,
  FaTrash,
  FaGripVertical,
  FaHighlighter,
  FaMagic,
  FaUndo,
  FaRedo,
  FaCompress, // Using compress for minimize/hide
  FaExpandArrowsAlt,
  FaCode,
  FaBookOpen,
  FaRocket,
  FaLongArrowAltRight, // For Arrow Tool
  FaGem, // For Diamond Tool
  FaStar,
  FaCube,
  FaCheck,
  FaArrowLeft,
} from "react-icons/fa";
import { BsTriangle, BsSlashLg, BsHexagon, BsPentagon } from "react-icons/bs";
import DrawingCanvas from "./DrawingCanvas";
import Whiteboard from "./Whiteboard";

const FullScreenToggle = ({ isFullScreen, onToggle }) => (
  <button
    className={`techclass-fullscreen-btn ${isFullScreen ? "is-full" : ""}`}
    onClick={onToggle}
    title={isFullScreen ? "Exit Fullscreen" : "View Fullscreen"}
  >
    {isFullScreen ? <FaCompressAlt /> : <FaExpandAlt />}
  </button>
);

const EraseToggle = ({ onErase, disabled }) => (
  <button
    className={`techclass-erase-btn ${disabled ? "disabled" : ""}`}
    onClick={onErase}
    disabled={disabled}
    title="Erase All Added Questions"
  >
    <FaEraser />
  </button>
);

const FontControls = ({ onIncrease, onDecrease }) => (
  <div className="font-controls-group">
    <button
      className="techclass-font-btn"
      onClick={onIncrease}
      title="Increase Font Size"
    >
      <FaPlus />
    </button>
    <button
      className="techclass-font-btn"
      onClick={onDecrease}
      title="Decrease Font Size"
    >
      <FaMinus />
    </button>
  </div>
);

const WhiteboardControls = ({
  isOpen,
  onToggle,
  activeTool,
  onSelectTool,
  onClear,
  color,
  onColorChange,
  brushSize,
  onSizeChange,
  brushType,
  onBrushTypeChange,
  onUndo,
  onRedo,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const toolbarRef = useRef(null);

  const handleDragStart = (e) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleDrag = useCallback(
    (e) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.current.x;
        const newY = e.clientY - dragStart.current.y;
        setPosition({ x: newX, y: newY });
      }
    },
    [isDragging]
  );

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
    } else {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging, handleDrag]);

  if (!isOpen) {
    return (
      <button
        className={`techclass-whiteboard-toggle ${isOpen ? "active" : ""}`}
        onClick={onToggle}
        title="Open Whiteboard"
      >
        <FaChalkboard />
      </button>
    );
  }

  // MINIMIZED STATE
  if (isMinimized) {
    return (
      <div
        className="whiteboard-toolbar draggable minimized"
        ref={toolbarRef}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        <div
          className="drag-handle"
          onMouseDown={handleDragStart}
          title="Drag to move"
        >
          <FaGripVertical />
        </div>
        <button
          className="wb-icon-btn"
          onClick={() => setIsMinimized(false)}
          title="Expand Toolbar"
        >
          <FaExpandArrowsAlt />
        </button>
        <button
          className="techclass-whiteboard-toggle active small"
          onClick={onToggle}
          title="Close Whiteboard"
        >
          <FaChalkboard />
        </button>
      </div>
    );
  }

  // MAXIMIZED STATE - 2 COLUMN GRID LAYOUT
  return (
    <div
      className="whiteboard-toolbar draggable single-grid"
      ref={toolbarRef}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <div className="drag-handle" onMouseDown={handleDragStart}>
        <FaGripVertical />
      </div>

      <div className="wb-all-tools-grid">
        {/* Row 1: minimize & close */}
        <button
          className="wb-icon-btn"
          onClick={() => setIsMinimized(true)}
          title="Minimize"
        >
          <FaCompress />
        </button>
        <button
          className="techclass-whiteboard-toggle active small"
          onClick={onToggle}
          title="Close"
        >
          <FaChalkboard />
        </button>

        {/* Row 2: Pen & Highlighter */}
        <button
          className={`wb-tool-btn ${brushType === "normal" ? "active" : ""}`}
          onClick={() => onBrushTypeChange("normal")}
          title="Normal Pen"
        >
          <FaPen />
        </button>
        <button
          className={`wb-tool-btn ${
            brushType === "highlighter" ? "active" : ""
          }`}
          onClick={() => onBrushTypeChange("highlighter")}
          title="Highlighter"
        >
          <FaHighlighter />
        </button>

        {/* Row 3: Neon & Clear */}
        <button
          className={`wb-tool-btn ${brushType === "neon" ? "active" : ""}`}
          onClick={() => onBrushTypeChange("neon")}
          title="Neon"
        >
          <FaMagic />
        </button>
        <button className="wb-tool-btn delete" onClick={onClear} title="Clear">
          <FaTrash />
        </button>

        {/* Row 4: Undo & Redo */}
        <button className="wb-tool-btn" onClick={onUndo} title="Undo">
          <FaUndo />
        </button>
        <button className="wb-tool-btn" onClick={onRedo} title="Redo">
          <FaRedo />
        </button>

        {/* Row 5: Size Slider (span 2) */}
        <div className="wb-size-control span-two">
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="wb-slider"
          />
          <span className="wb-size-display">{brushSize}px</span>
        </div>

        {/* Row 6: Color Picker (span 2) */}
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="wb-color-picker span-two"
        />

        {/* TOOLS */}
        <button
          className={`wb-tool-btn ${activeTool === "pen" ? "active" : ""}`}
          onClick={() => onSelectTool("pen")}
          title="Pen"
        >
          <FaPen />
        </button>
        <button
          className={`wb-tool-btn ${activeTool === "eraser" ? "active" : ""}`}
          onClick={() => onSelectTool("eraser")}
          title="Eraser"
        >
          <FaEraser />
        </button>

        <button
          className={`wb-tool-btn ${activeTool === "line" ? "active" : ""}`}
          onClick={() => onSelectTool("line")}
          title="Line"
        >
          <BsSlashLg />
        </button>
        <button
          className={`wb-tool-btn ${activeTool === "arrow" ? "active" : ""}`}
          onClick={() => onSelectTool("arrow")}
          title="Arrow"
        >
          <FaLongArrowAltRight />
        </button>

        <button
          className={`wb-tool-btn ${
            activeTool === "rectangle" ? "active" : ""
          }`}
          onClick={() => onSelectTool("rectangle")}
          title="Rectangle"
        >
          <FaRegSquare />
        </button>
        <button
          className={`wb-tool-btn ${activeTool === "circle" ? "active" : ""}`}
          onClick={() => onSelectTool("circle")}
          title="Circle"
        >
          <FaRegCircle />
        </button>

        <button
          className={`wb-tool-btn ${activeTool === "triangle" ? "active" : ""}`}
          onClick={() => onSelectTool("triangle")}
          title="Triangle"
        >
          <BsTriangle />
        </button>
        <button
          className={`wb-tool-btn ${activeTool === "diamond" ? "active" : ""}`}
          onClick={() => onSelectTool("diamond")}
          title="Diamond"
        >
          <FaGem />
        </button>

        <button
          className={`wb-tool-btn ${activeTool === "pentagon" ? "active" : ""}`}
          onClick={() => onSelectTool("pentagon")}
          title="Pentagon"
        >
          <BsPentagon />
        </button>
        <button
          className={`wb-tool-btn ${activeTool === "hexagon" ? "active" : ""}`}
          onClick={() => onSelectTool("hexagon")}
          title="Hexagon"
        >
          <BsHexagon />
        </button>

        <button
          className={`wb-tool-btn ${activeTool === "star" ? "active" : ""}`}
          onClick={() => onSelectTool("star")}
          title="Star"
        >
          <FaStar />
        </button>
        <button
          className={`wb-tool-btn ${activeTool === "cube" ? "active" : ""}`}
          onClick={() => onSelectTool("cube")}
          title="Cube"
        >
          <FaCube />
        </button>

        <button
          className={`wb-tool-btn ${activeTool === "check" ? "active" : ""}`}
          onClick={() => onSelectTool("check")}
          title="Check Mark"
        >
          <FaCheck />
        </button>
      </div>
    </div>
  );
};

const SecretCodeModal = ({ onUnlock }) => {
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
    <main className="modal-overlay">
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
          <button type="submit" className="techclass-unlock-btn">
            Unlock Content
          </button>
        </form>
        {error && <p className="error-message">Incorrect code. Try again.</p>}
      </div>
    </main>
  );
};

const TypingEffect = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [index, text, onComplete]);

  return <div className="typing-text">{displayedText}</div>;
};

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
      <p>
        <strong>How to Start:</strong> Select a Technology and Chapter from the
        top menu, then click <strong>"Start Class"</strong>.
      </p>
    </div>
  </div>
);

const PaperDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  icon: Icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const displayValue = value ? value.toUpperCase() : placeholder;

  return (
    <div
      className={`paper-dropdown-container`}
      ref={dropdownRef}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <div
        className={`paper-trigger ${isOpen ? "is-open" : ""} ${
          disabled ? "disabled" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        title={placeholder}
      >
        <div className="paper-trigger-content">
          {Icon && <Icon className="paper-icon" />}
          <span>{displayValue}</span>
        </div>
      </div>
      <div className={`paper-options ${isOpen ? "is-open" : ""}`}>
        <div className="paper-options-scroll">
          {options.map((option, index) => (
            <div
              key={option}
              className={`paper-option-item ${
                value === option ? "selected" : ""
              }`}
              onClick={() => handleSelect(option)}
              style={{ transitionDelay: `${index * 0.05}s` }}
            >
              {option.toUpperCase ? option.toUpperCase() : option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function TechClass() {
  const { technology: paramTechnology } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(paramTechnology || "");
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showCount, setShowCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [hasStarted, setHasStarted] = useState(false);

  // Whiteboard State
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [wbTool, setWbTool] = useState("pen");
  const [wbColor, setWbColor] = useState("#000000");
  const [wbSize, setWbSize] = useState(5);
  const [wbBrushType, setWbBrushType] = useState("normal");
  const [clearTrigger, setClearTrigger] = useState(0);
  const [undoTrigger, setUndoTrigger] = useState(0);
  const [redoTrigger, setRedoTrigger] = useState(0);

  // View Mode: 'class' or 'whiteboard'
  const [viewMode, setViewMode] = useState("class");

  const questionContainerRef = useRef(null);
  const welcomeRef = useRef(null);

  const technologies = [
    "git",
    "html",
    "css",
    "javascript",
    "java",
    "python",
    "sql",
    "react",
    "restapi",
    "rest",
    "microservices",
  ];

  // Sync state with URL param
  useEffect(() => {
    if (paramTechnology) {
      setTechnology(paramTechnology);
    }
  }, [paramTechnology]);

  useEffect(() => {
    if (!technology) return;
    const loadChapters = async () => {
      let chapterList = [];
      let chapterNumber = 1;
      while (true) {
        try {
          await import(
            `../classnotes/${technology}/Chapter${chapterNumber}.json`
          );
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
      setHasStarted(false);
    };
    loadChapters();
  }, [technology]);

  useEffect(() => {
    if (!technology || !selectedChapter) return;

    const loadQuestions = async () => {
      const chapterData = await import(
        `../classnotes/${technology}/${selectedChapter}.json`
      );
      const loadedQuestions = chapterData.default;
      setQuestions(loadedQuestions);
      setShowCount(0);
      setIsErasing(false);
      setHasStarted(false);
    };
    loadQuestions();
  }, [selectedChapter, technology]);

  const handleStartClass = () => {
    if (questions.length > 0) {
      setHasStarted(true);

      setShowWelcome(true);
    }
  };

  const handleWelcomeComplete = () => {
    // Welcome message remains visible
  };

  useEffect(() => {
    const container = questionContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = container;

        setShowScrollUp(scrollTop > 10);

        setShowScrollDown(
          scrollHeight > clientHeight &&
            Math.ceil(scrollTop + clientHeight) < scrollHeight
        );
      }, 50);
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    const timeout = setTimeout(handleScroll, 200);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [questions, isFullScreen, showWelcome, showCount, hasStarted]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const nativeFullScreen = !!document.fullscreenElement;

      setIsFullScreen(nativeFullScreen);

      if (questionContainerRef.current) {
        setTimeout(() => {
          questionContainerRef.current.dispatchEvent(new Event("scroll"));
        }, 100);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const questionsToShow = questions.slice(0, showCount);

  const handleNext = () => {
    if (showCount < questions.length) {
      setShowCount((prev) => {
        const nextIndex = prev;
        const newCount = Math.min(prev + 2, questions.length);

        setTimeout(() => {
          if (questionContainerRef.current) {
            const nextQuestionElement = document.getElementById(
              `question-${nextIndex}`
            );

            let scrollTarget = 0;
            if (nextQuestionElement) {
              scrollTarget =
                nextQuestionElement.offsetTop -
                questionContainerRef.current.offsetTop -
                20;
            } else if (showWelcome && welcomeRef.current) {
              scrollTarget = welcomeRef.current.offsetHeight + 20;
            }

            questionContainerRef.current.scrollTo({
              top: scrollTarget,
              behavior: "smooth",
            });

            questionContainerRef.current.dispatchEvent(new Event("scroll"));
          }
        }, 100);
        return newCount;
      });
    }
  };

  const handleErase = () => {
    if (showCount > 0 && !isErasing) {
      setIsErasing(true);

      setTimeout(() => {
        setShowCount(0);
        setIsErasing(false);

        if (questionContainerRef.current) {
          questionContainerRef.current.dispatchEvent(new Event("scroll"));
        }
      }, 800);
    }
  };

  const handleIncreaseFont = () =>
    setFontSize((prev) => Math.min(prev + 2, 24));
  const handleDecreaseFont = () =>
    setFontSize((prev) => Math.max(prev - 2, 12));

  const scrollToTop = () => {
    if (questionContainerRef.current) {
      questionContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToBottom = () => {
    if (questionContainerRef.current) {
      questionContainerRef.current.scrollTo({
        top: questionContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleFullScreenToggle = () => {
    const element = document.documentElement;

    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    }
  };

  const fixedHeaderHeight = 65;

  if (!isUnlocked) {
    return <SecretCodeModal onUnlock={setIsUnlocked} />;
  }

  const isNextButtonVisible =
    hasStarted && questions.length > 0 && showCount < questions.length;
  const isEraseButtonVisible = hasStarted && questions.length > 0;
  const isClassCompleted =
    hasStarted && questions.length > 0 && showCount === questions.length;

  return (
    <main
      className={`tech-class-container ${
        isFullScreen ? "fullscreen-mode" : ""
      }`}
    >
      <SEO
        title={`${
          technology
            ? technology.charAt(0).toUpperCase() + technology.slice(1)
            : "Tech"
        } Class`}
        description={`Learn ${
          technology || "technology"
        } with our premium class notes and interactive whiteboard. Access free ${
          technology || "coding"
        } tutorials.`}
        keywords={`${technology} class, learn ${technology}, ${technology} tutorial, programming notes, tech tutorials, ratan sir classes`}
      />
      <FullScreenToggle
        isFullScreen={isFullScreen}
        onToggle={handleFullScreenToggle}
      />

      {isEraseButtonVisible && (
        <EraseToggle onErase={handleErase} disabled={isErasing} />
      )}

      <FontControls
        onIncrease={handleIncreaseFont}
        onDecrease={handleDecreaseFont}
      />

      <div className="whiteboard-wrapper">
        <WhiteboardControls
          isOpen={showWhiteboard}
          onToggle={() => setShowWhiteboard(!showWhiteboard)}
          activeTool={wbTool}
          onSelectTool={setWbTool}
          onClear={() => setClearTrigger((prev) => prev + 1)}
          color={wbColor}
          onColorChange={setWbColor}
          brushSize={wbSize}
          onSizeChange={setWbSize}
          brushType={wbBrushType}
          onBrushTypeChange={setWbBrushType}
          onUndo={() => setUndoTrigger((prev) => prev + 1)}
          onRedo={() => setRedoTrigger((prev) => prev + 1)}
        />
      </div>

      <button
        className="techclass-tab-toggle"
        onClick={() =>
          setViewMode((prev) => (prev === "class" ? "whiteboard" : "class"))
        }
        title={viewMode === "class" ? "Use Whiteboard" : "Back to Class"}
      >
        {viewMode === "class" ? (
          <>
            <FaPlus /> <span className="tab-text">New Tab</span>
          </>
        ) : (
          <>
            <FaArrowLeft /> <span className="tab-text">Prev Tab</span>
          </>
        )}
      </button>

      {/* Persistent Whiteboard Tab */}
      <div style={{ display: viewMode === "whiteboard" ? "block" : "none" }}>
        <Whiteboard
          isDrawingMode={showWhiteboard}
          activeTool={wbTool}
          color={wbColor}
          brushSize={wbSize}
          brushType={wbBrushType}
          onClear={() => setClearTrigger((prev) => prev + 1)}
          clearTrigger={clearTrigger}
          undoTrigger={undoTrigger}
          redoTrigger={redoTrigger}
        />
      </div>

      {/* Persistent Class Overlay Canvas */}
      <div style={{ display: viewMode === "class" ? "block" : "none" }}>
        <DrawingCanvas
          isDrawingMode={showWhiteboard}
          activeTool={wbTool}
          color={wbColor}
          brushSize={wbSize}
          brushType={wbBrushType}
          onClear={() => setClearTrigger((prev) => prev + 1)}
          clearTrigger={clearTrigger}
          undoTrigger={undoTrigger}
          redoTrigger={redoTrigger}
        />
      </div>

      {showScrollUp && (
        <button
          className="techclass-scroll-up-btn"
          onClick={scrollToTop}
          title="Scroll to Top"
        >
          <FaArrowUp />
        </button>
      )}

      {showScrollDown && (
        <button
          className="techclass-scroll-down-btn"
          onClick={scrollToBottom}
          title="Scroll to Bottom"
        >
          <FaArrowDown />
        </button>
      )}

      {isNextButtonVisible && (
        <div className="navigation-controls">
          <button
            className="techclass-next-btn"
            onClick={handleNext}
            title="Show Next Questions"
          >
            Next
          </button>
        </div>
      )}

      {!isFullScreen && (
        <div className="controls-group">
          <h2>OUR CLASSES</h2>
          <div className="dropdown-wrapper">
            <PaperDropdown
              options={technologies}
              value={technology}
              onChange={(val) => setTechnology(val)}
              placeholder="Select Technology"
              disabled={false}
              icon={FaCode}
            />
          </div>

          <div className="dropdown-wrapper">
            <PaperDropdown
              options={chapters}
              value={selectedChapter}
              onChange={(val) => setSelectedChapter(val)}
              placeholder="Select Chapter"
              disabled={chapters.length === 0}
              icon={FaBookOpen}
            />
          </div>

          <button
            className="techclass-start-btn"
            onClick={handleStartClass}
            disabled={!technology || !selectedChapter || hasStarted}
          >
            {hasStarted ? (
              "Started"
            ) : (
              <>
                <FaRocket style={{ marginRight: "8px" }} /> Start Class
              </>
            )}
          </button>
        </div>
      )}

      <div
        className="questions-scroll-wrapper"
        ref={questionContainerRef}
        style={!isFullScreen ? { marginTop: `${fixedHeaderHeight}px` } : {}}
      >
        <div
          className="questions-display-container"
          style={{ fontSize: `${fontSize}px` }}
        >
          {!hasStarted && <WebsiteInfo />}

          {hasStarted && (
            <>
              {showWelcome && (
                <div className="welcome-container" ref={welcomeRef}>
                  <TypingEffect
                    text={`${
                      technology ? technology.toUpperCase() : "Coding"
                    }! Starting ${selectedChapter}...`}
                    onComplete={handleWelcomeComplete}
                  />
                </div>
              )}

              {questionsToShow.map((q, index) => {
                const isDying = isErasing && index >= showCount - 2;

                return (
                  <div
                    key={`${q.id}-${selectedChapter}`}
                    id={`question-${index}`}
                    className={`tech-question-item ${
                      isDying ? "smoke-out" : "animate-in"
                    }`}
                  >
                    <h2 className="tech-question-text2">
                      Q{q.id}. {q.question}
                    </h2>

                    <div className="answer-text">
                      <b>Ans:&emsp;</b>
                      {q.answer && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: Array.isArray(q.answer)
                              ? q.answer.join("")
                              : q.answer,
                          }}
                        />
                      )}
                    </div>

                    {q.explanation && (
                      <div className="explanation-text">
                        <strong>Explanation:</strong>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: Array.isArray(q.explanation)
                              ? q.explanation.join("")
                              : q.explanation,
                          }}
                        />
                      </div>
                    )}

                    {q.image && (
                      <div className="image-container">
                        <img
                          src={q.image.url}
                          alt={q.image.caption || `Image for Q${q.id}`}
                        />
                        {q.image.caption && (
                          <p className="tech-question-caption">
                            {q.image.caption}
                          </p>
                        )}
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
        </div>
      </div>
    </main>
  );
}

export default TechClass;
