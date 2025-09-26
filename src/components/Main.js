import React, { useRef, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { javaData } from "../technologies/java/javaData.js";
import { pythonData } from "../technologies/python/pythonData.js";
import { htmlDataChapter1 } from "../technologies/html/htmlDataChapter1.js";
import { htmlDataChapter2 } from "../technologies/html/htmlDataChapter2.js";
import { htmlDataChapter3 } from "../technologies/html/htmlDataChapter3.js";
import { htmlDataChapter4 } from "../technologies/html/htmlDataChapter4.js";
import { reactData } from "../technologies/react/reactData.js";
import { javascriptData } from "../technologies/javascript/javascriptData.js";
import { sqlData } from "../technologies/sql/sqlData.js";
import { microservicesData } from "../technologies/microservices/microservicesData.js";
import { cssData } from "../technologies/css/cssData.js";
import { restApiData } from "../technologies/restapi/restapiData.js";
import { FiCopy, FiCheck } from "react-icons/fi";
import { renderToStaticMarkup } from "react-dom/server";
import "../css/Main.css";

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
  // State for the modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalLink, setModalLink] = useState("");

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
        };
      case "CSS":
        return cssData;
      case "SQL":
        return sqlData;
      case "Microservices":
        return microservicesData;
      case "REST API":
        return restApiData;
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
      setTimeout(() => {
        isClickTriggeredRef.current = false;
      }, 100);
    }
  }, [selectedItem, isClickTriggeredRef]);

  useEffect(() => {
    const mainBody = mainBodyRef.current;
    if (!mainBody || !activeGroup) return;
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickTriggeredRef.current) return;
        const intersectingEntry = entries.find((entry) => entry.isIntersecting);
        if (intersectingEntry) {
          const visibleSection = intersectingEntry.target.getAttribute(
            "data-key"
          );
          setSelectedItem(visibleSection);
        }
      },
      { root: mainBody, rootMargin: "-45% 0px -45% 0px" }
    );

    activeGroup.subItems.forEach((subItem) => {
      const section = sectionRefs.current[subItem.name];
      if (section) observer.observe(section);
    });

    observerRef.current = observer;
    return () => observer.disconnect();
  }, [activeGroup, setSelectedItem, isClickTriggeredRef]);

  const handleCopy = (code, key) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyIcon = renderToStaticMarkup(<FiCopy />);
  const copiedIcon = renderToStaticMarkup(<FiCheck />);

  useEffect(() => {
    const pres = mainBodyRef.current?.querySelectorAll("pre");
    pres?.forEach((block, idx) => {
      const uniqueKey = `${selectedItem}-${idx}`;
      if (!block.parentNode.classList.contains("code-block-wrapper")) {
        const wrapper = document.createElement("div");
        wrapper.className = "code-block-wrapper";

        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.innerHTML = copyIcon + " Copy";

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

        wrapper.appendChild(btn);
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
    if (!currentGroup) return null;
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
    if (isEndOfGroup) {
      const quizNum = quizNumberMap[activeGroup.name];
      const examNum = examNumberMap[activeGroup.name];
      if (quizNum || examNum) {
        setModalType(quizNum ? "quiz" : "exam");
        const link = quizNum
          ? `/ratan-tutotrials/quiz/${selectedTechnology}/${quizNum}`
          : `/ratan-tutotrials/exam/${selectedTechnology.toLowerCase()}/exam${examNum}`;
        setModalLink(link);
        setShowModal(true);
      } else {
        if (currentItemIndex < flatSubItems.length - 1) {
          const next = flatSubItems[currentItemIndex + 1];
          setSelectedItem(next);
          isClickTriggeredRef.current = true;
        }
      }
    } else if (currentItemIndex < flatSubItems.length - 1) {
      const nextItem = flatSubItems[currentItemIndex + 1];
      setSelectedItem(nextItem);
      isClickTriggeredRef.current = true;
    }
  };

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      const prevItem = flatSubItems[currentItemIndex - 1];
      setSelectedItem(prevItem);
      isClickTriggeredRef.current = true;
    }
  };

  // New function to handle the action button click
  const handleChapterAction = () => {
    if (!activeGroup) return;
    const quizNum = quizNumberMap[activeGroup.name];
    const examNum = examNumberMap[activeGroup.name];

    if (quizNum) {
      navigate(`/ratan-tutotrials/quiz/${selectedTechnology}/${quizNum}`);
    } else if (examNum) {
      navigate(`/ratan-tutotrials/exam/${selectedTechnology.toLowerCase()}/exam${examNum}`);
    }
  };

  // Modal actions
  const handleModalProceed = () => {
    navigate(modalLink);
    setShowModal(false);
  };

  const handleModalSkip = () => {
    setShowModal(false);
    // Proceed to the next item after closing the modal
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
                className="content-section"
              >
                <h2>{subItem.name}</h2>
                <div>{mainData[subItem.name]}</div>
                {subItemIndex === activeGroup.subItems.length - 1 && (
                  <div className="nav-buttons">
                    <button
                      onClick={handlePrevious}
                      className="nav-btn"
                      disabled={currentItemIndex === 0}
                    >
                      ← Previous
                    </button>
                    {/* The middle button */}
                    <button
                      onClick={handleChapterAction}
                      className="action-btn"
                    >
                      {getChapterButtonLabel(activeGroup)}
                    </button>
                    <button
                      onClick={handleNext}
                      className="nav-btn"
                      disabled={currentItemIndex === flatSubItems.length - 1}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="content-group-container">
            <h1 className="content-group-title">Welcome</h1>
            <p>Please select a topic from the menu to get started.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Ready to {modalType === 'quiz' ? 'Take the Quiz?' : 'Start the Exam?'}</h3>
            <p>
              You've completed this chapter. It's a great time to test your knowledge.
            </p>
            <div className="modal-buttons">
              <button onClick={handleModalProceed} className="modal-proceed-btn">
                {modalType === 'quiz' ? 'Take Quiz' : 'Take Exam'}
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