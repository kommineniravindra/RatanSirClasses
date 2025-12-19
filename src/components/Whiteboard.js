import React, { useState, useRef, useEffect } from "react";
import DrawingCanvas from "./DrawingCanvas";
import "../css/Whiteboard.css"; // Import the separated CSS
import jsPDF from "jspdf";
import {
  FaFilePdf,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
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
    <div className="whiteboard-container">
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
      <div className="pdf-toolbar">
        <div className="pdf-toolbar-group">
          <button
            className="pdf-nav-btn"
            onClick={() => goToPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            title="Previous Page"
          >
            <FaChevronLeft />
          </button>
          <span className="pdf-page-count">Page {currentPage + 1}</span>
          <button
            className="pdf-nav-btn"
            onClick={() => {
              if (currentPage < pages.length - 1) {
                goToPage(currentPage + 1);
              } else {
                addNewPage();
              }
            }}
            title={
              currentPage < pages.length - 1 ? "Next Page" : "Add New Page"
            }
          >
            {currentPage < pages.length - 1 ? <FaChevronRight /> : <FaPlus />}
          </button>
        </div>

        <div className="pdf-divider"></div>

        <button className="pdf-download-btn" onClick={downloadPDF}>
          <FaFilePdf /> <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;
