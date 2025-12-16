import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import BrowserPreview from "../../components/BrowserPreview";

const CodeBlock = ({ language = "css", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const cssDataChapter9 = {
  // ----- CSS Modern Features -----
  "CSS Filters": (
    <div>
      <h4>CSS Filters</h4>
      <p>
        The <code>filter</code> property defines visual effects (like blur and
        saturation) to an element (often <code>&lt;img&gt;</code>).
      </p>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  img { width: 100px; height: 100px; margin: 5px; }
  .blur { filter: blur(4px); }
  .brightness { filter: brightness(150%); }
  .contrast { filter: contrast(180%); }
  .grayscale { filter: grayscale(100%); }
  .sepia { filter: sepia(100%); }
 </style>
</head>
<body>
  <div>Original: <img src="https://via.placeholder.com/100/0000FF/808080?text=IMG"></div>
  <img class="blur" src="https://via.placeholder.com/100/0000FF/808080?text=Blur">
  <img class="grayscale" src="https://via.placeholder.com/100/0000FF/808080?text=Gray">
  <img class="sepia" src="https://via.placeholder.com/100/0000FF/808080?text=Sepia">
</body>
</html>`}
      />
    </div>
  ),

  "CSS Clip Path": (
    <div>
      <h4>Clip-path</h4>
      <p>
        The <code>clip-path</code> property allows you to specify a specific
        region of an element to display, while hiding the rest.
      </p>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  .box {
    width: 150px; height: 150px;
    background: linear-gradient(45deg, violet, blue);
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: bold;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); /* Diamond shape */
  }
 </style>
</head>
<body>
  <div class="box">Clipped</div>
</body>
</html>`}
      />
    </div>
  ),

  "CSS Shapes": (
    <div>
      <h4>CSS Shapes</h4>
      <p>
        The <code>shape-outside</code> property lets you wrap text around a
        complex shape (like a circle) rather than a box.
      </p>
      <CodeBlock>
        {`.circle {
  float: left;
  width: 150px;
  height: 150px;
  shape-outside: circle(50%);
  border-radius: 50%;
}`}
      </CodeBlock>
    </div>
  ),

  "CSS Masking": (
    <div>
      <h4>CSS Masking</h4>
      <p>
        CSS masking allows you to block out parts of an element using a mask
        image.
      </p>
      <CodeBlock>
        {`img {
  -webkit-mask-image: linear-gradient(black, transparent);
  mask-image: linear-gradient(black, transparent);
}`}
      </CodeBlock>
    </div>
  ),

  "CSS Logic (calc, min, max)": (
    <div>
      <h4>CSS Math Functions</h4>
      <p>Perform calculations directly in CSS.</p>
      <ul style={{ paddingLeft: "1.5em" }}>
        <li>
          <code>calc()</code>: Calculates a value. e.g.{" "}
          <code>width: calc(100% - 50px);</code>
        </li>
        <li>
          <code>min()</code>: Uses the smallest value. e.g.{" "}
          <code>width: min(50%, 300px);</code>
        </li>
        <li>
          <code>max()</code>: Uses the largest value.
        </li>
        <li>
          <code>clamp()</code>: Clamps a value between an upper and lower bound.
          e.g. <code>font-size: clamp(1rem, 2.5vw, 2rem);</code>
        </li>
      </ul>
    </div>
  ),

  "CSS Counters": (
    <div>
      <h4>CSS Counters</h4>
      <p>
        CSS counters let you adjust the appearance of content based on its
        location in a document (automatic numbering).
      </p>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  body { counter-reset: section; }
  h3::before {
    counter-increment: section;
    content: "Section " counter(section) ": ";
    color: red;
  }
 </style>
</head>
<body>
  <h3>Introduction</h3>
  <h3>Methodology</h3>
  <h3>Conclusion</h3>
</body>
</html>`}
      />
    </div>
  ),
};
