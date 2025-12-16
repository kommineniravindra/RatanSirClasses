import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import BrowserPreview from "../../components/BrowserPreview";

const CodeBlock = ({ language = "css", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const cssDataChapter5 = {
  // ----- CSS Positioning -----
  Static: (
    <div>
      <h4>Position: Static</h4>
      <p>
        HTML elements are positioned static by default. Static positioned
        elements are not affected by the top, bottom, left, and right
        properties. They always position according to the normal flow of the
        page.
      </p>
      <CodeBlock>{`div { position: static; }`}</CodeBlock>
    </div>
  ),

  Relative: (
    <div>
      <h4>Position: Relative</h4>
      <p>
        An element with <code>position: relative;</code> is positioned relative
        to its normal position. The space it would have occupied is preserved.
      </p>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  div.static {
    position: static;
    border: 3px solid #73AD21;
    width: 100px; height: 50px;
  }
  div.relative {
    position: relative;
    left: 30px;
    top: 10px;
    border: 3px solid #73AD21;
    background: pink;
    width: 100px; height: 50px;
  }
 </style>
</head>
<body>
  <div class="static">Static</div>
  <div class="relative">Relative</div>
  <div class="static">Static</div>
</body>
</html>`}
      />
    </div>
  ),

  Absolute: (
    <div>
      <h4>Position: Absolute</h4>
      <p>
        An element with <code>position: absolute;</code> is positioned relative
        to the nearest positioned ancestor (instead of positioned relative to
        the viewport, like fixed). If no positioned ancestor exists, it uses the
        document body.
        <strong>It is removed from the normal flow.</strong>
      </p>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  div.relative {
    position: relative;
    width: 200px;
    height: 100px;
    border: 3px solid #73AD21;
  } 
  div.absolute {
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 40px;
    border: 3px solid #73AD21;
    background: lightblue;
  }
 </style>
</head>
<body>
  <div class="relative">
    This is relative
    <div class="absolute">Absolute</div>
  </div>
</body>
</html>`}
      />
    </div>
  ),

  Fixed: (
    <div>
      <h4>Position: Fixed</h4>
      <p>
        An element with <code>position: fixed;</code> is positioned relative to
        the viewport, which means it always stays in the same place even if the
        page is scrolled.
      </p>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  .fixed {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 300px;
    border: 3px solid #73AD21;
    background: yellow;
  }
  body { height: 100px; } /* simulated scrolling in larger page */
 </style>
</head>
<body>
  <p>Scroll me (if I was tall enough)...</p>
  <div class="fixed">I am Fixed to bottom-right!</div>
</body>
</html>`}
      />
    </div>
  ),

  Sticky: (
    <div>
      <h4>Position: Sticky</h4>
      <p>
        An element with <code>position: sticky;</code> is positioned based on
        the user's scroll position. It toggles between relative and fixed,
        depending on the scroll position.
      </p>
      <CodeBlock>
        {`div.sticky {
  position: sticky;
  top: 0;
  background-color: green;
  border: 2px solid #4CAF50;
}`}
      </CodeBlock>
    </div>
  ),

  "Z-Index": (
    <div>
      <h4>Z-Index</h4>
      <p>
        The <code>z-index</code> property specifies the stack order of an
        element. An element with greater stack order is always in front of an
        element with a lower stack order. Note: z-index only works on positioned
        elements (relative, absolute, fixed, sticky).
      </p>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  img {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: -1;
  }
  h1 { color: red; }
 </style>
</head>
<body>
  <h1>This is a Heading</h1>
  <div style="position:relative; width: 100px; height: 100px; background:lightblue; z-index:1;">Top Layout (z=1)</div>
  <div style="position:absolute; top:40px; left:40px; width:100px; height:100px; background:pink; z-index:2;">On Top (z=2)</div>
</body>
</html>`}
      />
    </div>
  ),
};
