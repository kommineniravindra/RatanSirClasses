import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import BrowserPreview from "../../components/BrowserPreview";

const CodeBlock = ({ language = "css", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const cssDataChapter7 = {
  // ----- CSS Advanced Styling -----
  "Pseudo-classes": (
    <div>
      <h4>Pseudo-classes</h4>
      <p>A pseudo-class is used to define a special state of an element.</p>
      <CodeBlock>
        {`/* Syntax: selector:pseudo-class { ... } */
a:hover { color: orange; }
input:focus { background-color: lightyellow; }
li:first-child { font-weight: bold; }`}
      </CodeBlock>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; transition: 0.3s; }
  button:hover { background: #0056b3; transform: scale(1.1); }
  input { padding: 8px; margin-top: 10px; border: 1px solid #ccc; outline: none; }
  input:focus { border-color: #007bff; box-shadow: 0 0 5px rgba(0,123,255,0.5); }
 </style>
</head>
<body>
  <button>Hover Me!</button>
  <br>
  <input type="text" placeholder="Focus me...">
</body>
</html>`}
      />
    </div>
  ),

  "Pseudo-elements": (
    <div>
      <h4>Pseudo-elements</h4>
      <p>A pseudo-element is used to style specified parts of an element.</p>
      <ul style={{ paddingLeft: "1.5em" }}>
        <li>
          <code>::before</code>: Inserts content before the element content.
        </li>
        <li>
          <code>::after</code>: Inserts content after the element content.
        </li>
        <li>
          <code>::first-letter</code>: Styles the first letter.
        </li>
      </ul>
      <CodeBlock>
        {`p::first-line {
  color: #ff0000;
  font-variant: small-caps;
}`}
      </CodeBlock>
    </div>
  ),

  Opacity: (
    <div>
      <h4>Opacity</h4>
      <p>
        The <code>opacity</code> property specifies the transparency of an
        element. Value ranges from 0.0 (transparent) to 1.0 (opaque).
      </p>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  img { width: 100px; height: 100px; object-fit: cover; margin: 10px; }
  .o100 { opacity: 1; }
  .o50 { opacity: 0.5; }
  .o20 { opacity: 0.2; }
 </style>
</head>
<body>
  <div style="background: black; padding: 10px;">
    <img src="https://via.placeholder.com/100/FF5733/FFFFFF?text=1.0" class="o100">
    <img src="https://via.placeholder.com/100/33FF57/FFFFFF?text=0.5" class="o50">
    <img src="https://via.placeholder.com/100/3357FF/FFFFFF?text=0.2" class="o20">
  </div>
</body>
</html>`}
      />
    </div>
  ),

  Transitions: (
    <div>
      <h4>Transitions</h4>
      <p>
        CSS transitions allow you to change property values smoothly, over a
        given duration.
      </p>
      <CodeBlock>
        {`div {
  width: 100px;
  height: 100px;
  background: red;
  transition: width 2s, width 2s, background 2s;
}
div:hover {
  width: 300px;
  background: blue;
}`}
      </CodeBlock>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  .box {
    width: 100px;
    height: 100px;
    background: orangered;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
  }
  .box:hover {
    width: 200px;
    border-radius: 50%;
    background: purple;
    transform: rotate(180deg);
  }
 </style>
</head>
<body>
  <div class="box">Hover Me</div>
</body>
</html>`}
      />
    </div>
  ),

  Animations: (
    <div>
      <h4>Animations (@keyframes)</h4>
      <p>CSS allows animation of HTML elements without using JavaScript.</p>
      <CodeBlock>
        {`@keyframes example {
  0%   { background-color: red; left: 0px; top: 0px; }
  25%  { background-color: yellow; left: 200px; top: 0px; }
  50%  { background-color: blue; left: 200px; top: 200px; }
  75%  { background-color: green; left: 0px; top: 200px; }
  100% { background-color: red; left: 0px; top: 0px; }
}

div {
  animation-name: example;
  animation-duration: 4s;
  animation-iteration-count: infinite;
}`}
      </CodeBlock>
    </div>
  ),

  Transforms: (
    <div>
      <h4>Transforms (2D & 3D)</h4>
      <p>
        The <code>transform</code> property applies a 2D or 3D transformation to
        an element. This property allows you to rotate, scale, move, skew, etc.,
        elements.
      </p>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  div { width: 80px; height: 80px; background: teal; color: white; display:flex; align-items:center; justify-content:center; margin: 20px; float: left; transition: 0.5s; }
  .translate:hover { transform: translate(10px, 20px); }
  .rotate:hover { transform: rotate(45deg); }
  .scale:hover { transform: scale(1.2); }
  .skew:hover { transform: skewX(20deg); }
 </style>
</head>
<body>
  <div class="translate">Move</div>
  <div class="rotate">Rotate</div>
  <div class="scale">Scale</div>
  <div class="skew">Skew</div>
</body>
</html>`}
      />
    </div>
  ),

  Shadows: (
    <div>
      <h4>Box & Text Shadows</h4>
      <p>Add depth to your elements using shadows.</p>
      <CodeBlock>{`box-shadow: 5px 10px 15px rgba(0,0,0,0.3);`}</CodeBlock>
      <CodeBlock>{`text-shadow: 2px 2px 4px #000000;`}</CodeBlock>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  .card {
     width: 150px; padding: 20px; background: white;
     box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
     text-align: center; font-family: sans-serif;
  }
  h2 { text-shadow: 2px 2px 5px red; }
 </style>
</head>
<body style="background:#f4f4f4; padding:20px;">
  <div class="card">
    <h2>Shadows</h2>
    <p>Card depth effect</p>
  </div>
</body>
</html>`}
      />
    </div>
  ),

  Gradients: (
    <div>
      <h4>Gradients</h4>
      <p>
        CSS gradients let you display smooth transitions between two or more
        specified colors.
      </p>
      <ul style={{ paddingLeft: "1.5em" }}>
        <li>
          <strong>Linear Gradient:</strong> Down/Up/Left/Right/Diagonal.
        </li>
        <li>
          <strong>Radial Gradient:</strong> Defined by their center.
        </li>
      </ul>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
  div { height: 80px; margin-bottom: 10px; color: white; font-weight: bold; padding: 10px; }
  .linear { background: linear-gradient(to right, tomato, orange); }
  .radial { background: radial-gradient(circle, #ff9966, #ff5e62); }
  .conic { background: conic-gradient(red, yellow, green, blue); border-radius: 50%; width: 80px; height: 80px; }
 </style>
</head>
<body>
  <div class="linear">Linear Gradient</div>
  <div class="radial">Radial Gradient</div>
  <div class="conic"></div>
</body>
</html>`}
      />
    </div>
  ),
};
