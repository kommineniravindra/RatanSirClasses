import React, { useRef, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { javaData } from "../technologies/java/javaData.js";
import { pythonData } from "../technologies/python/pythonData.js";
import { reactData } from "../technologies/react/reactData.js";
import { javascriptData } from "../technologies/javascript/javascriptData.js";
import { sqlDataChapter1 } from "../technologies/sql/sqlDataChapter1.js";
import { sqlDataChapter2 } from "../technologies/sql/sqlDataChapter2.js";
import { sqlDataChapter3 } from "../technologies/sql/sqlDataChapter3.js";
import { sqlDataChapter4 } from "../technologies/sql/sqlDataChapter4.js";
import { sqlDataChapter5 } from "../technologies/sql/sqlDataChapter5.js";
import { sqlDataChapter6 } from "../technologies/sql/sqlDataChapter6.js";
import { sqlDataChapter7 } from "../technologies/sql/sqlDataChapter7.js";
import { sqlDataChapter8 } from "../technologies/sql/sqlDataChapter8.js";
import { sqlDataChapter9 } from "../technologies/sql/sqlDataChapter9.js";
import { microservicesData } from "../technologies/microservices/microservicesData.js";
import { restApiData } from "../technologies/restapi/restapiData.js";
import { FiCopy, FiCheck, FiPlay } from "react-icons/fi";
import { renderToStaticMarkup } from "react-dom/server";
import "../css/Main.css";
import { gitDataChapter1 } from "../technologies/git/gitDataChapter1.js";
import { htmlDataChapter1 } from "../technologies/html/htmlDataChapter1.js";
import { htmlDataChapter2 } from "../technologies/html/htmlDataChapter2.js";
import { htmlDataChapter3 } from "../technologies/html/htmlDataChapter3.js";
import { htmlDataChapter4 } from "../technologies/html/htmlDataChapter4.js";
import { htmlDataChapter5 } from "../technologies/html/htmlDataChapter5.js";
import { htmlDataChapter6 } from "../technologies/html/htmlDataChapter6.js";
import { htmlDataChapter7 } from "../technologies/html/htmlDataChapter7.js";
import { htmlDataChapter8 } from "../technologies/html/htmlDataChapter8.js";
import { htmlDataChapter9 } from "../technologies/html/htmlDataChapter9.js";
import { htmlDataChapter10 } from "../technologies/html/htmlDataChapter10.js";
import { cssDataChapter1 } from "../technologies/css/cssDataChapter1.js";
import { cssDataChapter2 } from "../technologies/css/cssDataChapter2.js";
import { cssDataChapter3 } from "../technologies/css/cssDataChapter3.js";
import { cssDataChapter4 } from "../technologies/css/cssDataChapter4.js";
import { cssDataChapter5 } from "../technologies/css/cssDataChapter5.js";
import { cssDataChapter6 } from "../technologies/css/cssDataChapter6.js";
import { cssDataChapter7 } from "../technologies/css/cssDataChapter7.js";
import { cssDataChapter8 } from "../technologies/css/cssDataChapter8.js";
import { cssDataChapter9 } from "../technologies/css/cssDataChapter9.js";
import { cssDataChapter10 } from "../technologies/css/cssDataChapter10.js";
import { downloadsDataChapter1 } from "../technologies/downloads/downloadsDataChapter1.js";

const Main = ({
  selectedItem,
  selectedTechnology,
  setSelectedItem,
  menuData,
  isClickTriggeredRef,
}) => {
  const navigate = useNavigate();
  const sectionRefs = useRef({});
  const mainBodyRef = useRef(null);
  const observerRef = useRef(null);

  const [copiedKey, setCopiedKey] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalLink, setModalLink] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mainData = useMemo(() => {
    switch (selectedTechnology) {
      case "Java":
        return javaData;
      case "Python":
        return pythonData;
      case "JavaScript":
        return javascriptData;
      case "React":
        return reactData;
      case "HTML":
        return {
          ...htmlDataChapter1,
          ...htmlDataChapter2,
          ...htmlDataChapter3,
          ...htmlDataChapter4,
          ...htmlDataChapter5,
          ...htmlDataChapter6,
          ...htmlDataChapter7,
          ...htmlDataChapter8,
          ...htmlDataChapter9,
          ...htmlDataChapter10,
        };
      case "CSS":
        return {
          ...cssDataChapter1,
          ...cssDataChapter2,
          ...cssDataChapter3,
          ...cssDataChapter4,
          ...cssDataChapter5,
          ...cssDataChapter6,
          ...cssDataChapter7,
          ...cssDataChapter8,
          ...cssDataChapter9,
          ...cssDataChapter10,
        };
      case "SQL":
        return {
          ...sqlDataChapter1,
          ...sqlDataChapter2,
          ...sqlDataChapter3,
          ...sqlDataChapter4,
          ...sqlDataChapter5,
          ...sqlDataChapter6,
          ...sqlDataChapter7,
          ...sqlDataChapter8,
          ...sqlDataChapter9,
        };
      case "Microservices":
        return microservicesData;
      case "REST API":
        return restApiData;
      case "GIT":
        return gitDataChapter1;
      case "Downloads":
        return downloadsDataChapter1;
      default:
        return {};
    }
  }, [selectedTechnology]);

  const activeGroup = useMemo(() => {
    if (!selectedItem || !menuData || menuData.length === 0) return null;
    return menuData.find((group) =>
      group.subItems?.some((sub) => sub.name === selectedItem)
    );
  }, [selectedItem, menuData]);

  const flatSubItems = useMemo(
    () => menuData.flatMap((group) => group.subItems.map((sub) => sub.name)),
    [menuData]
  );
  const currentItemIndex = flatSubItems.indexOf(selectedItem);

  useEffect(() => {
    if (isClickTriggeredRef.current && selectedItem) {
      const sectionElement = sectionRefs.current[selectedItem];

      if (isMobile) {
        // Mobile: Scroll window
        setTimeout(() => {
          if (sectionElement) {
            const yOffset = -80; // Offset for sticky header
            const y =
              sectionElement.getBoundingClientRect().top +
              window.pageYOffset +
              yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }, 300);
      } else {
        // Desktop: Scroll container
        if (mainBodyRef.current)
          mainBodyRef.current.scrollTo({ top: 0, behavior: "auto" });
        if (sectionElement && mainBodyRef.current) {
          setTimeout(() => {
            mainBodyRef.current.scrollTo({
              top: sectionElement.offsetTop,
              behavior: "auto",
            });
          }, 0);
        }
      }

      setTimeout(() => {
        isClickTriggeredRef.current = false;
      }, 1000); // Increased timeout to allow scroll to finish
    }
  }, [selectedItem, isClickTriggeredRef, isMobile]);

  useEffect(() => {
    const mainBody = mainBodyRef.current;
    if ((!isMobile && !mainBody) || !activeGroup) return;
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickTriggeredRef.current) return;
        const intersectingEntry = entries.find((entry) => entry.isIntersecting);
        if (intersectingEntry) {
          const visibleSection =
            intersectingEntry.target.getAttribute("data-key");
          setSelectedItem(visibleSection);
        }
      },
      {
        root: isMobile ? null : mainBody,
        rootMargin: isMobile ? "-100px 0px -60% 0px" : "-45% 0px -45% 0px",
      }
    );

    activeGroup.subItems.forEach((subItem) => {
      const section = sectionRefs.current[subItem.name];
      if (section) observer.observe(section);
    });

    observerRef.current = observer;
    return () => observer.disconnect();
  }, [activeGroup, setSelectedItem, isClickTriggeredRef, isMobile]);

  const handleCopy = (code, key) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyIcon = renderToStaticMarkup(<FiCopy />);
  const copiedIcon = renderToStaticMarkup(<FiCheck />);
  const playIcon = renderToStaticMarkup(<FiPlay />);

  useEffect(() => {
    const pres = mainBodyRef.current?.querySelectorAll("pre");
    pres?.forEach((block, idx) => {
      const uniqueKey = `${selectedItem}-${idx}`;
      if (!block.parentNode.classList.contains("code-block-wrapper")) {
        const wrapper = document.createElement("div");
        wrapper.className = "code-block-wrapper";

        // Create Toolbar Container
        const toolbar = document.createElement("div");
        toolbar.className = "code-buttons-toolbar";

        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.innerHTML = copyIcon + " Copy";

        const tryBtn = document.createElement("button");
        tryBtn.className = "try-btn";
        tryBtn.innerHTML = playIcon + " Try This";
        tryBtn.onclick = () => {
          // Get text and strip leading line numbers.
          const rawCode = block.innerText;
          const cleanCode = rawCode
            .split(/\r?\n/)
            .map((line) => {
              return line.replace(/^\s*\d+[\.\s]*/, "");
            })
            .join("\n");

          localStorage.setItem("tryThisCode", cleanCode);
          localStorage.setItem("tryThisLang", selectedTechnology);
          window.open("/compiler", "_blank");
        };

        let timeoutId;
        const codeText = block.innerText;

        btn.onclick = () => {
          handleCopy(codeText, uniqueKey);

          if (timeoutId) clearTimeout(timeoutId);
          btn.innerHTML = copiedIcon + " Copied!";
          timeoutId = setTimeout(() => {
            btn.innerHTML = copyIcon + " Copy";
          }, 500);
        };

        // Append buttons to toolbar
        toolbar.appendChild(tryBtn);
        toolbar.appendChild(btn);

        // Append toolbar and block to wrapper
        wrapper.appendChild(toolbar);
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);
      }
    });
  }, [mainData, selectedItem, copyIcon, copiedIcon]);

  const quizNumberMap = useMemo(() => {
    let quizCount = 0;
    const map = {};
    menuData.forEach((group, i) => {
      const isExam = (i + 1) % 4 === 0;
      if (!isExam) quizCount++;
      map[group.name] = isExam ? null : quizCount;
    });
    return map;
  }, [menuData]);

  const examNumberMap = useMemo(() => {
    let examCount = 0;
    const map = {};
    menuData.forEach((group, i) => {
      const isExam = (i + 1) % 4 === 0;
      if (isExam) examCount++;
      map[group.name] = isExam ? examCount : null;
    });
    return map;
  }, [menuData]);

  const getChapterButtonLabel = (currentGroup) => {
    if (
      !currentGroup ||
      selectedTechnology === "GIT" ||
      selectedTechnology === "Downloads"
    )
      return null;
    const quizNum = quizNumberMap[currentGroup.name];
    const examNum = examNumberMap[currentGroup.name];

    if (quizNum) return `Take Quiz ${quizNum}`;
    if (examNum) return `Take Exam ${examNum}`;
    return null;
  };

  const isEndOfGroup = useMemo(() => {
    if (!activeGroup) return false;
    const lastSubItem = activeGroup.subItems[activeGroup.subItems.length - 1];
    return selectedItem === lastSubItem.name;
  }, [selectedItem, activeGroup]);

  const handleNext = () => {
    if (selectedTechnology === "GIT" || selectedTechnology === "Downloads") {
      if (currentItemIndex < flatSubItems.length - 1) {
        const nextItem = flatSubItems[currentItemIndex + 1];
        setSelectedItem(nextItem);
        isClickTriggeredRef.current = true;
      }
    } else {
      if (isEndOfGroup) {
        const quizNum = quizNumberMap[activeGroup.name];
        const examNum = examNumberMap[activeGroup.name];
        if (quizNum || examNum) {
          setModalType(quizNum ? "quiz" : "exam");
          const link = quizNum
            ? `/quiz/${selectedTechnology}/${quizNum}`
            : `/exam/${selectedTechnology.toLowerCase()}/exam${examNum}`;
          setModalLink(link);
          setShowModal(true);
        } else if (currentItemIndex < flatSubItems.length - 1) {
          const next = flatSubItems[currentItemIndex + 1];
          setSelectedItem(next);
          isClickTriggeredRef.current = true;
        }
      } else if (currentItemIndex < flatSubItems.length - 1) {
        const nextItem = flatSubItems[currentItemIndex + 1];
        setSelectedItem(nextItem);
        isClickTriggeredRef.current = true;
      }
    }
  };

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      const prevItem = flatSubItems[currentItemIndex - 1];
      setSelectedItem(prevItem);
      isClickTriggeredRef.current = true;
    }
  };

  const handleChapterAction = () => {
    if (selectedTechnology === "GIT" || selectedTechnology === "Downloads")
      return;
    if (!activeGroup) return;

    const quizNum = quizNumberMap[activeGroup.name];
    const examNum = examNumberMap[activeGroup.name];

    if (quizNum) {
      window.open(`/quiz/${selectedTechnology}/${quizNum}`, "_blank");
    } else if (examNum) {
      window.open(
        `/exam/${selectedTechnology.toLowerCase()}/exam${examNum}`,
        "_blank"
      );
    }
  };

  const handleModalProceed = () => {
    window.open(modalLink, "_blank");
    setShowModal(false);
  };

  const handleModalSkip = () => {
    setShowModal(false);
    if (currentItemIndex < flatSubItems.length - 1) {
      const next = flatSubItems[currentItemIndex + 1];
      setSelectedItem(next);
      isClickTriggeredRef.current = true;
    }
  };

  return (
    <div className="main-body" ref={mainBodyRef}>
      <div className="main-content">
        {activeGroup ? (
          <div className="content-group-container">
            {activeGroup.subItems.map((subItem, subItemIndex) => (
              <div
                key={subItem.name}
                ref={(el) => (sectionRefs.current[subItem.name] = el)}
                data-key={subItem.name}
                className={`content-section ${
                  selectedTechnology === "Downloads"
                    ? "downloads-section-wrapper"
                    : ""
                }`}
              >
                {selectedTechnology !== "Downloads" && <h2>{subItem.name}</h2>}
                <div>{mainData[subItem.name]}</div>
                {subItemIndex === activeGroup.subItems.length - 1 && (
                  <div className="nav-buttons">
                    <button
                      onClick={handlePrevious}
                      className="nav-btn1"
                      disabled={currentItemIndex === 0}
                    >
                      ⮜ Previous
                    </button>
                    {/* The middle button */}
                    {selectedTechnology !== "GIT" &&
                      selectedTechnology !== "Downloads" && (
                        <button
                          onClick={handleChapterAction}
                          className="main-action-btn"
                        >
                          {getChapterButtonLabel(activeGroup)}
                        </button>
                      )}
                    <button
                      onClick={handleNext}
                      className="nav-btn1"
                      disabled={currentItemIndex === flatSubItems.length - 1}
                    >
                      Next ➤
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="content-group-container">
            <h1 className="content-group-title" style={{ textAlign: "center" }}>
              🚧 Course Coming Soon! 🚧
            </h1>
            <p style={{ textAlign: "center" }}>
              We’re working hard to bring you an amazing learning experience.
              Stay tuned!
            </p>
            <img
              src="/img17.jpg"
              alt="Coming soon"
              style={{ display: "block", margin: "0 auto" }}
            />
          </div>
        )}
      </div>

      {showModal &&
        selectedTechnology !== "GIT" &&
        selectedTechnology !== "Downloads" && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>
                Ready to{" "}
                {modalType === "quiz" ? "Take the Quiz?" : "Start the Exam?"}
              </h3>
              <p>
                You've completed this chapter. It's a great time to test your
                knowledge.
              </p>
              <div className="modal-buttons">
                <button
                  onClick={handleModalProceed}
                  className="modal-proceed-btn"
                >
                  {modalType === "quiz" ? "Take Quiz" : "Take Exam"}
                </button>
                <button onClick={handleModalSkip} className="modal-skip-btn">
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Main;
