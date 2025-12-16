import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import BrowserPreview from "../../components/BrowserPreview";

const CodeBlock = ({ language = "css", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const cssDataChapter2 = {
  // ---------------- CSS Basics ----------------
  Selectors: (
    <div>
      <h4>CSS Selectors</h4>
      <p>
        Selectors are patterns used to select the element(s) you want to style.
      </p>

      <h5>1. Element Selector</h5>
      <p>Selects elements based on the tag name.</p>
      <CodeBlock>{`p { text-align: center; color: red; }`}</CodeBlock>

      <h5>2. ID Selector (#)</h5>
      <p>
        Selects a unique element with a specific <code>id</code> attribute. High
        specificity.
      </p>
      <CodeBlock>{`#para1 { text-align: center; color: red; }`}</CodeBlock>

      <h5>3. Class Selector (.)</h5>
      <p>
        Selects elements with a specific <code>class</code> attribute. Can be
        reused.
      </p>
      <CodeBlock>{`.center { text-align: center; color: red; }`}</CodeBlock>

      <h5>4. Grouping Selector</h5>
      <p>Selects all the HTML elements with the same style definitions.</p>
      <CodeBlock>{`h1, h2, p { text-align: center; color: red; }`}</CodeBlock>

      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  h3 { color: blue; } /* Element */
  #unique { color: green; font-weight: bold; } /* ID */
  .highlight { background-color: yellow; } /* Class */
 </style>
</head>
<body>
  <h3>Element Selector (h3)</h3>
  <p id="unique">ID Selector (#unique)</p>
  <p class="highlight">Class Selector (.highlight) - 1</p>
  <p class="highlight">Class Selector (.highlight) - 2</p>
</body>
</html>`}
      />
    </div>
  ),

  Colors: (
    <div>
      <h4>CSS Colors</h4>
      <p>Colors in CSS can be specified in different formats:</p>
      <ul style={{ paddingLeft: "1.5em" }}>
        <li>
          <strong>Names:</strong> <code>red</code>, <code>blue</code>,{" "}
          <code>orange</code>.
        </li>
        <li>
          <strong>HEX:</strong> <code>#ff0000</code>, <code>#00ff00</code>.
        </li>
        <li>
          <strong>RGB:</strong> <code>rgb(255, 99, 71)</code>.
        </li>
        <li>
          <strong>RGBA:</strong> <code>rgba(255, 99, 71, 0.5)</code> (adds Alpha
          for transparency).
        </li>
        <li>
          <strong>HSL:</strong> <code>hsl(9, 100%, 64%)</code>.
        </li>
      </ul>

      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  div { padding: 10px; margin: 5px; color: white; font-weight: bold; }
  .name { background-color: tomato; }
  .hex { background-color: #3cb371; }
  .rgb { background-color: rgb(60, 60, 255); }
  .rgba { background-color: rgba(60, 60, 255, 0.5); color: black; }
 </style>
</head>
<body>
  <div class="name">Tomato (Name)</div>
  <div class="hex">#3cb371 (HEX)</div>
  <div class="rgb">rgb(60, 60, 255) (RGB)</div>
  <div class="rgba">rgba(60, 60, 255, 0.5) (RGBA)</div>
</body>
</html>`}
      />
    </div>
  ),

  Backgrounds: (
    <div>
      <h4>CSS Backgrounds</h4>
      <p>
        The background properties are used to define the background effects for
        elements.
      </p>
      <CodeBlock>
        {`body {
  background-color: #f0f0f0;
  background-image: url('bg.jpg');
  background-repeat: no-repeat;
  background-position: right top;
  background-size: cover;
}`}
      </CodeBlock>

      <p>
        <strong>Example:</strong>
      </p>
      <BrowserPreview
        htmlCode={`<html>
<head>
<style>
  .box {
    width: 100%;
    height: 150px;
    background-color: #8ec5fc;
    background-image: linear-gradient(62deg, #8ec5fc 0%, #e0c3fc 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    color: white; 
    font-size: 20px;
    font-family: sans-serif;
  }
</style>
</head>
<body>
  <div class="box">Gradient Background</div>
</body>
</html>`}
      />
    </div>
  ),

  Borders: (
    <div>
      <h4>CSS Borders</h4>
      <p>
        The border properties allow you to specify the style, width, and color
        of an element's border.
      </p>

      <CodeBlock>
        {`p {
  border-style: solid; /* solid, dotted, dashed, double */
  border-width: 5px;
  border-color: red;
  border-radius: 10px; /* Rounded corners */
}`}
      </CodeBlock>

      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  div { padding: 8px; margin: 8px; background: #eee; }
  .solid { border: 2px solid blue; }
  .dashed { border: 2px dashed red; }
  .rounded { border: 2px solid green; border-radius: 12px; }
  .mixed { border-top: 4px solid orange; border-bottom: 4px double black; }
 </style>
</head>
<body>
  <div class="solid">Solid Blue Border</div>
  <div class="dashed">Dashed Red Border</div>
  <div class="rounded">Rounded Green Border</div>
  <div class="mixed">Mixed Borders</div>
</body>
</html>`}
      />
    </div>
  ),

  Margins: (
    <div>
      <h4>CSS Margins</h4>
      <p>
        Margins are used to create space around elements,{" "}
        <strong>outside</strong> of any defined borders. They are invisible.
      </p>

      <CodeBlock>
        {`div {
  margin-top: 10px;
  margin-right: 20px;
  margin-bottom: 30px;
  margin-left: 40px;
  
  /* Shorthand: top right bottom left */
  margin: 10px 20px 30px 40px;
  
  /* Shorthand: vertical horizontal */
  margin: 10px 20px;
  
  /* Center horizontally (requires width) */
  margin: 0 auto;
}`}
      </CodeBlock>
    </div>
  ),

  Padding: (
    <div>
      <h4>CSS Padding</h4>
      <p>
        Padding is used to create space around an element's content,{" "}
        <strong>inside</strong> of any defined borders.
      </p>

      <CodeBlock>
        {`div {
  padding-top: 10px;
  padding: 20px; /* All sides */
}`}
      </CodeBlock>

      <div style={{ marginTop: "1rem" }}>
        <strong>Visualizing Margin vs. Padding:</strong>
        <BrowserPreview
          htmlCode={`<html>
<head>
<style>
 .outer { border: 1px dashed black; background: #f0f0f0; margin-bottom: 10px; }
 .inner { 
    background: #ffcccb; 
    border: 2px solid red; 
 }
 .with-margin { margin: 20px; }
 .with-padding { padding: 20px; }
</style>
</head>
<body>
 <div class="outer">
   <div class="inner with-margin">I have 20px MAIGIN (Space outside border)</div>
 </div>
 <div class="outer">
   <div class="inner with-padding">I have 20px PADDING (Space inside border)</div>
 </div>
</body>
</html>`}
        />
      </div>
    </div>
  ),

  "Height & Width": (
    <div>
      <h4>Height and Width</h4>
      <p>
        The <code>height</code> and <code>width</code> properties are used to
        set the height and width of an element.
      </p>
      <CodeBlock>
        {`div {
  height: 200px;
  width: 50%; /* Relative to parent */
  max-width: 600px; /* Won't grow larger than 600px */
}`}
      </CodeBlock>
    </div>
  ),
};
