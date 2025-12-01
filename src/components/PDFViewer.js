import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fade, setFade] = useState(true);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const changePageSmooth = (newPage) => {
    setFade(false); // fade out
    setTimeout(() => {
      setPageNumber(newPage);
      setFade(true); // fade in
    }, 200); // fade duration
  };

  const goPrev = () => {
    if (pageNumber > 1) changePageSmooth(pageNumber - 1);
  };

  const goNext = () => {
    if (pageNumber < numPages) changePageSmooth(pageNumber + 1);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block", // tightly wraps the PDF
        textAlign: "center",
      }}
    >
      {/* PDF Document */}
      <div
        style={{
          transition: "opacity 0.3s ease-in-out",
          opacity: fade ? 1 : 0,
        }}
      >
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            scale={0.8} // adjust smaller or larger
          />
        </Document>
      </div>

      {/* Left Arrow */}
      <button
        onClick={goPrev}
        disabled={pageNumber === 1}
        style={{
          position: "absolute",
          top: "50%",
          left: "-30px",
          transform: "translateY(-50%)",
          fontSize: "22px",
          background: "#00000080",
          color: "white",
          border: "none",
          padding: "6px 10px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ◀
      </button>

      {/* Right Arrow */}
      <button
        onClick={goNext}
        disabled={pageNumber === numPages}
        style={{
          position: "absolute",
          top: "50%",
          right: "-30px",
          transform: "translateY(-50%)",
          fontSize: "22px",
          background: "#00000080",
          color: "white",
          border: "none",
          padding: "6px 10px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ▶
      </button>

      <p style={{ marginTop: "5px", fontSize: "14px" }}>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}
