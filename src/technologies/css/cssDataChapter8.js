import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import BrowserPreview from "../../components/BrowserPreview";

const CodeBlock = ({ language = "css", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const cssDataChapter8 = {
  // ----- CSS Responsive Design -----
  "Media Queries": (
    <div>
      <h4>Media Queries</h4>
      <p>
        Media queries allow you to apply specific CSS styles depending on the
        device's characteristics (like screen width).
      </p>
      <CodeBlock>
        {`@media screen and (max-width: 600px) {
  body {
    background-color: lightblue;
  }
}`}
      </CodeBlock>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  .box { background: olive; padding: 20px; color: white; text-align: center; }
  
  @media screen and (max-width: 400px) {
    .box { background: red; }
    .msg::after { content: " (Small Screen)"; }
  }
  @media screen and (min-width: 401px) {
    .box { background: green; }
    .msg::after { content: " (Large Screen)"; }
  }
 </style>
</head>
<body>
  <div class="box">
    <span class="msg">Resize me!</span>
  </div>
  <p style="font-size:12px">Note: In this preview iframe, resize logic depends on iframe width.</p>
</body>
</html>`}
      />
    </div>
  ),

  "Mobile First Design": (
    <div>
      <h4>Mobile First Design</h4>
      <p>
        Design for the smallest screen (mobile) first, then use{" "}
        <code>min-width</code> media queries to add styles for larger screens
        (tablets, desktops).
      </p>
      <CodeBlock>
        {`/* Base styles (Mobile) */
.col { width: 100%; }

/* Tablet */
@media (min-width: 768px) {
  .col { width: 50%; }
}

/* Desktop */
@media (min-width: 1024px) {
  .col { width: 33.33%; }
}`}
      </CodeBlock>
    </div>
  ),

  "Responsive Images": (
    <div>
      <h4>Responsive Images</h4>
      <p>Images should scale nicely to fit any browser size.</p>
      <CodeBlock>
        {`img {
  max-width: 100%;
  height: auto;
}`}
      </CodeBlock>
    </div>
  ),

  "Viewport Meta Tag": (
    <div>
      <h4>The Viewport Meta Tag</h4>
      <p>
        The HTML5 viewport meta tag is critical for responsive design on mobile
        devices. It tells the browser to set the width of the page to follow the
        screen-width of the device.
      </p>
      <CodeBlock language="html">
        {`<meta name="viewport" content="width=device-width, initial-scale=1.0">`}
      </CodeBlock>
    </div>
  ),

  "CSS Units": (
    <div>
      <h4>CSS Units (Absolute vs Relative)</h4>
      <ul style={{ paddingLeft: "1.5em" }}>
        <li>
          <strong>px:</strong> Absolute unit (pixels). Fixed size.
        </li>
        <li>
          <strong>em:</strong> Relative to the font-size of the element (2em
          means 2 times the current font size).
        </li>
        <li>
          <strong>rem:</strong> Relative to the font-size of the root (
          <code>html</code>) element. Best for accessibility.
        </li>
        <li>
          <strong>vw / vh:</strong> Relative to 1% of the viewport width/height.
        </li>
        <li>
          <strong>%:</strong> Relative to the parent element.
        </li>
      </ul>
    </div>
  ),

  "CSS Variables": (
    <div>
      <h4>CSS Variables (Custom Properties)</h4>
      <p>
        Entities defined by CSS authors that contain specific values to be
        reused throughout a document.
      </p>
      <CodeBlock>
        {`:root {
  --main-bg-color: coral;
  --main-txt-color: white; 
  --padding: 15px;
}

#div1 {
  background-color: var(--main-bg-color);
  color: var(--main-txt-color);
  padding: var(--padding);
}`}
      </CodeBlock>
    </div>
  ),
};
