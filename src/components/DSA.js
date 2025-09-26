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
  const [openIndex, setOpenIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("arrays");

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
          className={`category-btn ${
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
          className={`category-btn ${
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
          className={`category-btn ${
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
          className={`category-btn ${
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
          className={`category-btn ${
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
          className={`category-btn ${
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
          <div className="accordion-item" key={idx}>
            {/* Accordion Header */}
            <button
              className={`accordion-button ${
                openIndex === idx ? "active" : ""
              }`}
              onClick={() => toggleAccordion(idx)}
              aria-expanded={openIndex === idx ? "true" : "false"}
            >
              <div className="question-number">
                <strong>{idx + 1}.</strong>
              </div>
              <div className="question-field">
                <strong>Question:</strong> {item.question}
              </div>
              <div className="question-field">
                <strong>Input:</strong> {item.input}
              </div>
              <div className="question-field">
                <strong>Output:</strong> {item.output}
              </div>
              <div className="question-field">
                <strong>Explanation:</strong> {item.explanation}
              </div>
            </button>

            {/* Accordion Body */}
            <div
              className={`accordion-collapse ${
                openIndex === idx ? "show" : ""
              }`}
            >
              <div className="accordion-body">
                <SyntaxHighlighter language="java" style={coy} showLineNumbers>
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
