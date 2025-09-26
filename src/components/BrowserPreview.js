import React, { useRef, useEffect, useState } from "react";

export default function BrowserPreview({ htmlCode }) {
  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState("0px");

  // Extract <title> from HTML string
  const titleMatch = htmlCode.match(/<title>(.*?)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1] : "Web Browser Output";

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    doc.open();
    doc.write(htmlCode);
    doc.close();

    const resizeIframe = () => {
      if (doc.body) {
        const height = doc.body.scrollHeight;
        setIframeHeight(height + "px");
      }
    };

    // Initial resize
    resizeIframe();

    // Also resize after images or other media load
    const images = doc.images;
    if (images.length > 0) {
      let loadedCount = 0;
      for (let img of images) {
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            resizeIframe();
          }
        };
      }
    }

    // Optional: poll for dynamic content changes (like fonts or JS-generated content)
    const interval = setInterval(resizeIframe, 300);
    return () => clearInterval(interval);
  }, [htmlCode]);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        marginTop: "40px",
        marginBottom: "40px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Fake Browser Title Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          backgroundColor: "#e4e4e4",
          borderBottom: "1px solid #ccc",
          fontSize: "14px",
          fontWeight: "500",
          color: "#222",
        }}
      >
        <span>{pageTitle}</span>

        <b><span><i>Ratan Sir Classes</i></span> </b>

        <div style={{ display: "flex", gap: "8px" }}>
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#ff5f56",
            }}
          />
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#ffbd2e",
            }}
          />
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#27c93f",
            }}
          />
        </div>
      </div>

      {/* Fake Address Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "4px 10px",
          backgroundColor: "#f8f8f8",
          borderBottom: "1px solid #ddd",
        }}
      >
        <input
          type="text"
          value={`http://localhost:3000/${pageTitle
            .replace(/\s+/g, "")
            .toLowerCase()}.html`}
          readOnly
          style={{
            flex: 1,
            padding: "4px 8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "13px",
            color: "#555",
            backgroundColor: "#fff",
          }}
        />
      </div>

      {/* Iframe Content */}
      <iframe
        ref={iframeRef}
        style={{
          width: "100%",
          height: iframeHeight,
          border: "1px solid #ccc",
          overflow: "hidden",
        }}
        title="Browser Preview"
      />
    </div>
  );
}
