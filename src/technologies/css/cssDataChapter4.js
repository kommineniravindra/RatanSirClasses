import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import BrowserPreview from "../../components/BrowserPreview";

const CodeBlock = ({ language = "css", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const cssDataChapter4 = {
  // ----- Box Model (fine-grained) -----
  "Content Area": (
    <div>
      <h4>The Content Area</h4>
      <p>
        The content of the box, where text and images appear. Its size is
        controlled by <code>width</code> and <code>height</code> properties.
      </p>
      <CodeBlock>
        {`.box {
  width: 300px;
  height: 200px;
  background-color: lightblue;
}`}
      </CodeBlock>
    </div>
  ),

  "Padding (box)": (
    <div>
      <h4>Padding</h4>
      <p>
        Clears an area around the content. The padding is transparent. It is the
        space between the content and the border.
      </p>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  div { background: lightblue; border: 2px solid blue; }
  .p10 { padding: 10px; margin-bottom: 10px; }
  .p30 { padding: 30px; }
 </style>
</head>
<body>
  <div class="p10">I have 10px Padding</div>
  <div class="p30">I have 30px Padding</div>
</body>
</html>`}
      />
    </div>
  ),

  "Border (box)": (
    <div>
      <h4>Border</h4>
      <p>A border that goes around the padding and content.</p>
      <CodeBlock>{`border: 5px solid black;`}</CodeBlock>
    </div>
  ),

  "Margin (box)": (
    <div>
      <h4>Margin</h4>
      <p>
        Clears an area outside the border. The margin is transparent. It creates
        space between this element and other elements.
      </p>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  div { border: 1px solid black; background: #eee; }
  p { background: lightgreen; border: 1px solid green; }
  .m0 { margin: 0; }
  .m20 { margin: 20px; }
 </style>
</head>
<body>
  <div>
    <p class="m0">Paragraph with Margin 0</p>
  </div>
  <div>
    <p class="m20">Paragraph with Margin 20px</p>
  </div>
  <p>Notice the space outside the green box above?</p>
</body>
</html>`}
      />
    </div>
  ),

  Outline: (
    <div>
      <h4>Outline</h4>
      <p>
        An outline is a line drawn outside the element's border, to make the
        element "stand out". Unlike borders, outlines do <strong>not</strong>{" "}
        take up space (they overlap over other content).
      </p>
      <CodeBlock>
        {`p {
  border: 1px solid red;
  outline: 5px dotted green;
}`}
      </CodeBlock>
    </div>
  ),

  "Box-Sizing": (
    <div>
      <h4>Box Sizing</h4>
      <p>
        The <code>box-sizing</code> property allows you to include the padding
        and border in an element's total width and height.
      </p>
      <ul style={{ paddingLeft: "1.5em" }}>
        <li>
          <strong>content-box (default):</strong> Width = content width
          (excluding padding/border).
        </li>
        <li>
          <strong>border-box (recommended):</strong> Width = content + padding +
          border.
        </li>
      </ul>

      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  .box {
    width: 300px;
    height: 100px;
    padding: 30px;
    border: 10px solid blue;
    background: lightblue;
    margin-bottom: 20px;
    color: white;
    font-weight: bold;
  }
  .content-box { box-sizing: content-box; } /* Total width = 300 + 60 + 20 = 380px */
  .border-box { box-sizing: border-box; }   /* Total width = 300px */
 </style>
</head>
<body>
  <div class="box content-box">content-box (Total: 380px)</div>
  <div class="box border-box">border-box (Total: 300px)</div>
</body>
</html>`}
      />
    </div>
  ),
};
