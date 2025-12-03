import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const goPrev = () => {
    if (pageNumber > 1) changePage(-1);
  };

  const goNext = () => {
    if (pageNumber < numPages) changePage(1);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        textAlign: "center",
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      {/* PDF Document */}
      <div style={{ position: "relative", overflow: "hidden", minHeight: "600px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pageNumber}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                pageNumber={pageNumber}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                scale={0.8}
              />
            </Document>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Left Arrow */}
      <motion.button
        onClick={goPrev}
        disabled={pageNumber === 1}
        whileHover={{ scale: 1.1, backgroundColor: "#000000cc" }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          fontSize: "24px",
          background: "#00000080",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 10,
          opacity: pageNumber === 1 ? 0 : 1,
          transition: "opacity 0.3s",
        }}
      >
        ◀
      </motion.button>

      {/* Right Arrow */}
      <motion.button
        onClick={goNext}
        disabled={pageNumber === numPages}
        whileHover={{ scale: 1.1, backgroundColor: "#000000cc" }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          fontSize: "24px",
          background: "#00000080",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 10,
          opacity: pageNumber === numPages ? 0 : 1,
          transition: "opacity 0.3s",
        }}
      >
        ▶
      </motion.button>

      <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
        Page {pageNumber} of {numPages || "--"}
      </p>
    </div>
  );
}
