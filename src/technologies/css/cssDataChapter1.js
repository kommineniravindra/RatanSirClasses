import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import BrowserPreview from "../../components/BrowserPreview";

const CodeBlock = ({ language = "css", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const cssDataChapter1 = {
  // ----- CSS Introduction -----
  "What is CSS?": (
    <div>
      <h4>Q. What is CSS?</h4>
      <p>
        CSS stands for <strong>Cascading Style Sheets</strong>. It is a design
        language used to style HTML elements. While HTML creates the structure
        (skeleton) of a webpage, CSS adds the style (skin, clothes, makeup).
      </p>
      <ul style={{ paddingLeft: "1.5em" }}>
        <li>
          Controls <strong>colors</strong>, <strong>fonts</strong>,{" "}
          <strong>layouts</strong>, and <strong>spacing</strong>.
        </li>
        <li>Makes websites look beautiful and professional.</li>
        <li>
          Enables <strong>Responsive Design</strong> (websites that work on
          mobile, tablet, and desktop).
        </li>
      </ul>

      <p>
        <strong>Example:</strong> A simple CSS rule to style the body and
        headings.
      </p>
      <CodeBlock>
        {`body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}
h1 {
  color: navy;
  text-align: center;
}`}
      </CodeBlock>

      <BrowserPreview
        htmlCode={`<html>
  <head>
    <title>CSS Intro</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px; }
      h1 { color: navy; text-align: center; border-bottom: 2px solid navy; padding-bottom: 10px; }
      p { color: #333; font-size: 16px; line-height: 1.6; }
    </style>
  </head>
  <body>
    <h1>Welcome to CSS</h1>
    <p>This page is styled using CSS! We added background color, changed fonts, and centered the title.</p>
  </body>
</html>`}
      />
    </div>
  ),

  "Why Use CSS?": (
    <div>
      <h4>Why do we need CSS?</h4>
      <p>
        Without CSS, every website would look like a plain text document (black
        text on white background). CSS offers several key benefits:
      </p>
      <ol style={{ paddingLeft: "1.5em" }}>
        <li>
          <strong>Separation of Concerns:</strong> HTML handles content, CSS
          handles presentation.
        </li>
        <li>
          <strong>Consistency:</strong> You can style hundreds of pages with a
          single CSS file.
        </li>
        <li>
          <strong>Bandwidth Savings:</strong> External stylesheets are cached by
          browsers, speeding up page loads.
        </li>
        <li>
          <strong>Device Compatibility:</strong> Media queries allow different
          layouts for phones vs. desktops.
        </li>
      </ol>

      <p>
        <strong>Comparison:</strong>
      </p>
      <BrowserPreview
        htmlCode={`<html>
  <head><title>No CSS vs CSS</title></head>
  <body style="display:flex; gap:20px;">
    <div style="flex:1; border:1px solid #ccc; padding:10px;">
        <h3>Without CSS</h3>
        <button>Click Me</button>
    </div>
    <div style="flex:1; border:1px solid #ccc; padding:10px;">
        <h3 style="color:blue;">With CSS</h3>
        <button style="padding:8px 16px; background:blue; color:white; border:none; border-radius:4px; cursor:pointer;">Click Me</button>
    </div>
  </body>
</html>`}
      />
    </div>
  ),

  "History of CSS": (
    <div>
      <h4>History of CSS</h4>
      <p>
        CSS was first proposed by <strong>Håkon Wium Lie</strong> in 1994. It
        became a W3C (World Wide Web Consortium) standard.
      </p>
      <ul style={{ paddingLeft: "1.5em" }}>
        <li>
          <strong>CSS1 (1996):</strong> Basic font, color, and margin styling.
        </li>
        <li>
          <strong>CSS2 (1998):</strong> Added positioning, z-index, and media
          types.
        </li>
        <li>
          <strong>CSS3 (1999+):</strong> Modularized specification. Introduced
          proper responsive design, animations, shadows, flexbox, and grid.
        </li>
      </ul>
      <p>
        Today, we mostly use CSS3 features like Flexbox and Grid for layout.
      </p>
    </div>
  ),

  "How CSS Works": (
    <div>
      <h4>How CSS Works</h4>
      <p>
        The browser loads the HTML, then maps the CSS rules to the corresponding
        elements. A CSS rule consists of a <strong>selector</strong> and a{" "}
        <strong>declaration block</strong>.
      </p>

      <div
        style={{
          background: "#eee",
          padding: "10px",
          borderRadius: "4px",
          margin: "10px 0",
        }}
      >
        <code>Selector &#123; Property: Value; &#125;</code>
      </div>

      <ul style={{ paddingLeft: "1.5em" }}>
        <li>
          <strong>Selector:</strong> HTML element key-name (e.g.,{" "}
          <code>h1</code>, <code>p</code>).
        </li>
        <li>
          <strong>Property:</strong> The style to change (e.g.,{" "}
          <code>color</code>, <code>font-size</code>).
        </li>
        <li>
          <strong>Value:</strong> The specific setting (e.g., <code>blue</code>,{" "}
          <code>18px</code>).
        </li>
      </ul>

      <CodeBlock>
        {`p {
  color: green;
  margin: 10px;
}`}
      </CodeBlock>
      <p>
        In this example, all <code>&lt;p&gt;</code> elements will have green
        text and 10px margin.
      </p>
    </div>
  ),

  "Inline vs Internal vs External": (
    <div>
      <h4>Three Ways to Add CSS</h4>

      <h5>1. Inline CSS</h5>
      <p>
        Apply styles directly to a specific tag using the <code>style</code>{" "}
        attribute. <em>(Not recommended for large projects)</em>.
      </p>
      <CodeBlock language="html">{`<h1 style="color: blue;">Hello</h1>`}</CodeBlock>

      <h5>2. Internal CSS</h5>
      <p>
        Defined inside the <code>&lt;head&gt;</code> section using{" "}
        <code>&lt;style&gt;</code> tags. Good for single-page documents.
      </p>
      <CodeBlock language="html">
        {`<head>
  <style>
    body { background-color: linen; }
  </style>
</head>`}
      </CodeBlock>

      <h5>3. External CSS</h5>
      <p>
        Styles are defined in a separate <code>.css</code> file and linked. This
        is the <strong>best practice</strong>.
      </p>
      <CodeBlock language="html">{`<link rel="stylesheet" href="styles.css">`}</CodeBlock>
    </div>
  ),

  "CSS Syntax": (
    <div>
      <h4>CSS Syntax</h4>
      <p>
        A CSS rule-set consists of a <strong>selector</strong> and a{" "}
        <strong>declaration block</strong>.
      </p>
      <CodeBlock>
        {`h1 {
  color: blue;
  font-size: 12px;
}`}
      </CodeBlock>
      <ul style={{ paddingLeft: "1.5em" }}>
        <li>The selector points to the HTML element you want to style.</li>
        <li>
          The declaration block contains one or more declarations separated by
          semicolons.
        </li>
        <li>
          Each declaration includes a CSS property name and a value, separated
          by a colon.
        </li>
      </ul>

      <p>
        <strong>Example with Preview:</strong>
      </p>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
   .card {
     border: 1px solid #ccc;
     padding: 20px;
     border-radius: 8px;
     box-shadow: 0 4px 6px rgba(0,0,0,0.1);
     font-family: sans-serif;
     max-width: 300px;
   }
   .title { color: #d946ef; margin-top: 0; }
   .desc { color: #666; }
 </style>
</head>
<body>
  <div class="card">
    <h2 class="title">Card Title</h2>
    <p class="desc">This is a card element styled with CSS syntax rules (padding, border, and shadow).</p>
  </div>
</body>
</html>`}
      />
    </div>
  ),
};
