import React, { useState } from "react";
import dsaArrays from "../technologies/dsa/dsaArraysQuestion.json";
import dsaStrings from "../technologies/dsa/dsaStringsQuestions.json";
import dsaNumberSystem from "../technologies/dsa/dsaNumberSystemQuestions.json";
import dsaStack from "../technologies/dsa/dsaStackQusetions.json";
import dsaQueue from "../technologies/dsa/dsaQueueQuestions.json";
import dsaLinkedList from "../technologies/dsa/dsaLinkedListQuestions.json";

import "../css/Dsa.css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const DSA = () => {
  // const navigate = useNavigate(); // Not needed for new tab
  const [openIndex, setOpenIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("arrays");

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleTryThis = (code) => {
    localStorage.setItem("tryThisCode", code);
    localStorage.setItem("tryThisLang", "Java"); // Assuming all DSA code is Java based on SyntaxHighlighter prop
    window.open("/compiler", "_blank");
  };

  // Decide which dataset to render
  let data = [];
  if (selectedCategory === "arrays") {
    data = dsaArrays;
  } else if (selectedCategory === "strings") {
    data = dsaStrings;
  } else if (selectedCategory === "numberSystem") {
    data = dsaNumberSystem;
  } else if (selectedCategory === "stack") {
    data = dsaStack;
  } else if (selectedCategory === "queue") {
    data = dsaQueue;
  } else if (selectedCategory === "linkedlist") {
    data = dsaLinkedList;
  }

  return (
    <>
      {/* <aside>
      <h1> heading </h1>
      </aside> */}
      <div className="dsa-container">
        <main>
          <h2 className="dsa-title">DSA Questions & Code</h2>

          {/* Category Buttons */}
          <div className="dsa-category-buttons">
            <button
              className={`dsa-category-btn ${
                selectedCategory === "arrays" ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory("arrays");
                setOpenIndex(0);
              }}
            >
              Arrays
            </button>
            <button
              className={`dsa-category-btn ${
                selectedCategory === "strings" ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory("strings");
                setOpenIndex(0);
              }}
            >
              Strings
            </button>
            <button
              className={`dsa-category-btn ${
                selectedCategory === "numberSystem" ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory("numberSystem");
                setOpenIndex(0);
              }}
            >
              Number System
            </button>
            <button
              className={`dsa-category-btn ${
                selectedCategory === "stack" ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory("stack");
                setOpenIndex(0);
              }}
            >
              Stack
            </button>
            <button
              className={`dsa-category-btn ${
                selectedCategory === "queue" ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory("queue");
                setOpenIndex(0);
              }}
            >
              Queue
            </button>
            <button
              className={`dsa-category-btn ${
                selectedCategory === "linkedlist" ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory("linkedlist");
                setOpenIndex(0);
              }}
            >
              Linked List
            </button>
          </div>

          <div className="dsa-accordion">
            {data.map((item, idx) => (
              <div className="dsa-accordion-item" key={idx}>
                {/* Accordion Header */}
                <button
                  className={`dsa-accordion-button ${
                    openIndex === idx ? "active" : ""
                  }`}
                  onClick={() => toggleAccordion(idx)}
                  aria-expanded={openIndex === idx ? "true" : "false"}
                >
                  <div className="dsa-question-number">
                    <strong>{idx + 1}.</strong>
                    {item.youtubeLink && (
                      <button
                        className="dsa-youtube-btn"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent accordion toggle
                          window.open(item.youtubeLink, "_blank"); // open YouTube in new tab
                        }}
                      >
                        ▶ Watch Video on YouTube
                      </button>
                    )}
                  </div>

                  <div className="dsa-question-field">
                    <strong>Question:</strong> {item.question}
                  </div>
                  <div className="dsa-question-field">
                    <strong>Input:</strong> {item.input}
                  </div>
                  <div className="dsa-question-field">
                    <strong>Output:</strong> {item.output}
                  </div>
                  <div className="dsa-question-field">
                    <strong>Explanation:</strong> {item.explanation}
                  </div>
                </button>

                {/* Accordion Body */}
                <div
                  className={`dsa-accordion-collapse ${
                    openIndex === idx ? "show" : ""
                  }`}
                >
                  <div className="dsa-accordion-body">
                    <button
                      className="dsa-try-this-btn"
                      onClick={() => handleTryThis(item.answer)}
                    >
                      Try This!
                    </button>

                    <SyntaxHighlighter
                      language="java"
                      style={coy}
                      showLineNumbers
                    >
                      {item.answer}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default DSA;
