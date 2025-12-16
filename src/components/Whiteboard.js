import React, { useState, useRef, useEffect } from "react";
import DrawingCanvas from "./DrawingCanvas";
import jsPDF from "jspdf";
import {
  FaFilePdf,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const Whiteboard = ({
  activeTool,
  color,
  brushSize,
  brushType,
  isDrawingMode,
  onClear,
  clearTrigger,
  undoTrigger,
  redoTrigger,
}) => {
  const canvasRef = useRef(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Save current canvas state to pages array
  const saveCurrentPage = () => {
    if (canvasRef.current) {
      const data = canvasRef.current.getCanvasData();
      setPages((prev) => {
        const newPages = [...prev];
        newPages[currentPage] = data;
        return newPages;
      });
    }
  };

  // Handle Page Change
  const goToPage = (pageIndex) => {
    saveCurrentPage(); // Save current before switching
    setCurrentPage(pageIndex);
  };

  const addNewPage = () => {
    saveCurrentPage();
    setPages((prev) => [...prev, null]); // Add null (blank) page
    setCurrentPage((prev) => prev + 1);
    // Canvas will be cleared by the effect below because pages[newPage] is null
  };

  // Load page content when currentPage changes
  useEffect(() => {
    if (canvasRef.current) {
      const pageData = pages[currentPage];
      canvasRef.current.loadCanvasData(pageData); // Load data or clear if null
    }
  }, [currentPage, pages.length]); // pages.length needed to trigger on add

  // PDF Download
  const downloadPDF = () => {
    // Ensure current state is captured
    const currentData = canvasRef.current
      ? canvasRef.current.getCanvasData()
      : null;
    const allPages = [...pages];
    if (currentData) allPages[currentPage] = currentData;

    // Filter out empty pages if desired, or keep them.
    // Let's keep them to match user expectation.
    if (allPages.length === 0 && currentData) allPages.push(currentData);

    if (allPages.length === 0) return;

    const pdf = new jsPDF("l", "px", [window.innerWidth, window.innerHeight]);

    allPages.forEach((pageData, index) => {
      if (index > 0) pdf.addPage();
      if (pageData) {
        pdf.addImage(
          pageData,
          "PNG",
          0,
          0,
          window.innerWidth,
          window.innerHeight
        );
      }
    });

    pdf.save("whiteboard-notes.pdf");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#ffffff",
        zIndex: 9000,
      }}
    >
      <DrawingCanvas
        ref={canvasRef}
        isDrawingMode={isDrawingMode}
        activeTool={activeTool}
        color={color}
        brushSize={brushSize}
        brushType={brushType}
        onClear={onClear}
        clearTrigger={clearTrigger}
        undoTrigger={undoTrigger}
        redoTrigger={redoTrigger}
      />

      {/* Persistence & PDF ToolBar */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "white",
          padding: "10px 20px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          display: "flex",
          gap: "15px",
          alignItems: "center",
          zIndex: 10002,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => goToPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            style={{
              border: "none",
              background: "transparent",
              cursor: currentPage === 0 ? "not-allowed" : "pointer",
              fontSize: "1.2rem",
              color: "#555",
            }}
          >
            <FaChevronLeft />
          </button>
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              color: "#333",
            }}
          >
            Page {currentPage + 1}
          </span>
          <button
            onClick={() => {
              if (currentPage < pages.length - 1) {
                goToPage(currentPage + 1);
              } else {
                addNewPage();
              }
            }}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "1.2rem",
              color: "#555",
            }}
          >
            {currentPage < pages.length - 1 ? <FaChevronRight /> : <FaPlus />}
          </button>
        </div>

        <div style={{ width: "1px", height: "20px", background: "#ccc" }}></div>

        <button
          onClick={downloadPDF}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#e74c3c",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          }}
        >
          <FaFilePdf /> Download PDF
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;
