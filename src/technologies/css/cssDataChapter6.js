import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import BrowserPreview from "../../components/BrowserPreview";

const CodeBlock = ({ language = "css", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const cssDataChapter6 = {
  // ----- Layout (Flexbox & Grid) -----
  "Display Property": (
    <div>
      <h4>Display Property</h4>
      <p>
        The <code>display</code> property specifies the display behavior (the
        type of rendering box) of an element.
      </p>
      <ul style={{ paddingLeft: "1.5em" }}>
        <li>
          <code>block</code>: Takes up the full width (starts on a new line).
        </li>
        <li>
          <code>inline</code>: Takes up only as much width as necessary (does
          not start on a new line).
        </li>
        <li>
          <code>none</code>: The element is removed from the document.
        </li>
        <li>
          <code>flex</code> / <code>grid</code>: Enables Flexbox or Grid
          layouts.
        </li>
      </ul>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  span.a { display: inline; /* default for span */ width: 100px; height: 100px; padding: 5px; border: 1px solid blue; background-color: yellow; }
  span.b { display: inline-block; width: 100px; height: 100px; padding: 5px; border: 1px solid blue; background-color: yellow; }
  span.c { display: block; width: 100px; height: 100px; padding: 5px; border: 1px solid blue; background-color: yellow; }
 </style>
</head>
<body>
  <span class="a">Inline</span>
  <span class="a">Inline</span> <br><br>
  
  <span class="b">Inline-Block</span>
  <span class="b">Inline-Block</span> <br><br>

  <span class="c">Block</span>
  <span class="c">Block</span>
</body>
</html>`}
      />
    </div>
  ),

  "Flexbox Basics": (
    <div>
      <h4>Flexbox (Flexible Box Layout)</h4>
      <p>
        Flexbox is designed to provide a more efficient way to lay out, align
        and distribute space among items in a container. Key Concept:{" "}
        <strong>Parent (Container)</strong> and{" "}
        <strong>Children (Items)</strong>.
      </p>
      <CodeBlock>
        {`.container {
  display: flex;
  flex-direction: row; /* row | row-reverse | column | column-reverse */
}`}
      </CodeBlock>
    </div>
  ),

  "Flexbox Alignment": (
    <div>
      <h4>Flexbox Alignment</h4>
      <p>
        Use <code>justify-content</code> for main-axis (horizontal) and{" "}
        <code>align-items</code> for cross-axis (vertical) alignment.
      </p>
      <CodeBlock>
        {`.container {
  display: flex;
  justify-content: center; /* flex-start | flex-end | center | space-between */
  align-items: center; /* flex-start | flex-end | center | stretch */
  height: 200px;
}`}
      </CodeBlock>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  .flex-container {
    display: flex;
    justify-content: space-around;
    align-items: center; /* Vertical alignment */
    height: 150px;
    background-color: #f1f1f1;
  }
  .flex-container > div {
    background-color: DodgerBlue;
    color: white;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    margin: 10px;
    font-size: 20px;
  }
 </style>
</head>
<body>
  <div class="flex-container">
    <div>1</div>
    <div>2</div>
    <div>3</div>
  </div>
</body>
</html>`}
      />
    </div>
  ),

  "Grid Basics": (
    <div>
      <h4>CSS Grid Layout</h4>
      <p>
        CSS Grid Layout offers a grid-based layout system, with rows and
        columns, making it easier to design web pages without having to use
        floats and positioning.
      </p>
      <CodeBlock>
        {`.grid-container {
  display: grid;
  grid-template-columns: auto auto auto; /* 3 columns */
  grid-gap: 10px;
}`}
      </CodeBlock>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  .grid-container {
    display: grid;
    grid-template-columns: auto auto auto;
    background-color: #2196F3;
    padding: 10px;
    gap: 10px;
  }
  .grid-item {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.8);
    padding: 20px;
    font-size: 20px;
    text-align: center;
  }
 </style>
</head>
<body>
  <div class="grid-container">
    <div class="grid-item">1</div>
    <div class="grid-item">2</div>
    <div class="grid-item">3</div>  
    <div class="grid-item">4</div>
    <div class="grid-item">5</div>
    <div class="grid-item">6</div>  
  </div>
</body>
</html>`}
      />
    </div>
  ),

  "Grid Areas": (
    <div>
      <h4>Grid Areas</h4>
      <p>You can name grid items and reference them in the container.</p>
      <CodeBlock>
        {`.item1 { grid-area: header; }
.item2 { grid-area: menu; }
.item3 { grid-area: main; }
.item4 { grid-area: footer; }

.grid-container {
  display: grid;
  grid-template-areas:
    'header header header header'
    'menu main main main'
    'menu footer footer footer';
}`}
      </CodeBlock>
    </div>
  ),

  "Responsive Grid": (
    <div>
      <h4>Responsive Grid</h4>
      <p>
        Using <code>auto-fill</code> or <code>auto-fit</code> with{" "}
        <code>minmax()</code> creates responsive grids without media queries.
      </p>
      <CodeBlock>
        {`.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}`}
      </CodeBlock>
    </div>
  ),
};
