import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import BrowserPreview from "../../components/BrowserPreview";

const CodeBlock = ({ language = "css", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const cssDataChapter3 = {
  // ----- CSS Text & Fonts -----
  "Text Color": (
    <div>
      <h4>Text Color</h4>
      <p>
        The <code>color</code> property is used to set the color of the text.
      </p>
      <CodeBlock>{`body { color: blue; }`}</CodeBlock>
      <CodeBlock>{`h1 { color: #ff0000; }`}</CodeBlock>
    </div>
  ),

  "Text Alignment": (
    <div>
      <h4>Text Alignment</h4>
      <p>
        The <code>text-align</code> property is used to set the horizontal
        alignment of a text.
      </p>
      <CodeBlock>
        {`h1 { text-align: center; }
h2 { text-align: left; }
h3 { text-align: right; }
p { text-align: justify; }`}
      </CodeBlock>
      <BrowserPreview
        htmlCode={`<html>
<head>
 <style>
   div { border: 1px solid #ccc; margin: 5px; padding: 5px; }
 </style>
</head>
<body>
  <div style="text-align: left;">Left Aligned (Default)</div>
  <div style="text-align: center;">Center Aligned</div>
  <div style="text-align: right;">Right Aligned</div>
</body>
</html>`}
      />
    </div>
  ),

  "Text Decoration": (
    <div>
      <h4>Text Decoration</h4>
      <p>
        The <code>text-decoration</code> property is used to set or remove
        decorations from text. Commonly used to remove underlines from links.
      </p>
      <CodeBlock>
        {`a { text-decoration: none; }
h1 { text-decoration: underline; }
h2 { text-decoration: line-through; }`}
      </CodeBlock>
    </div>
  ),

  "Text Transformation": (
    <div>
      <h4>Text Transformation</h4>
      <p>
        The <code>text-transform</code> property is used to specify uppercase
        and lowercase letters in a text.
      </p>
      <CodeBlock>
        {`p.uppercase { text-transform: uppercase; }
p.lowercase { text-transform: lowercase; }
p.capitalize { text-transform: capitalize; }`}
      </CodeBlock>
    </div>
  ),

  Fonts: (
    <div>
      <h4>CSS Fonts</h4>
      <p>
        CSS Font properties define the font family, boldness, size, and style of
        a text.
      </p>

      <h5>1. Font Family</h5>
      <p>Specifies the typeface. Always include a fallback font.</p>
      <CodeBlock>{`body { font-family: "Times New Roman", Times, serif; }`}</CodeBlock>

      <h5>2. Font Style</h5>
      <CodeBlock>{`p { font-style: italic; }`}</CodeBlock>

      <h5>3. Font Weight</h5>
      <p>Specifies the weight of a font (e.g., normal, bold, 400, 700).</p>
      <CodeBlock>{`p { font-weight: bold; }`}</CodeBlock>

      <h5>4. Font Size</h5>
      <CodeBlock>{`h1 { font-size: 40px; }`}</CodeBlock>

      <h5>5. Google Fonts</h5>
      <p>
        To use Google Fonts, add the <code>&lt;link&gt;</code> in your head,
        then use it in CSS.
      </p>
      <CodeBlock language="html">
        {`<!-- In Head -->
<link href="https://fonts.googleapis.com/css?family=Sofia" rel="stylesheet">`}
      </CodeBlock>
      <CodeBlock>{`body { font-family: "Sofia", sans-serif; }`}</CodeBlock>
    </div>
  ),

  "Google Fonts": (
    <div>
      <h4>Using Google Fonts</h4>
      <p>Google Fonts is a free library of over 1000 licensed font families.</p>

      <h5>Steps to use:</h5>
      <ol>
        <li>
          Go to{" "}
          <a href="https://fonts.google.com" target="_blank" rel="noreferrer">
            fonts.google.com
          </a>
        </li>
        <li>Select a font.</li>
        <li>
          Copy the <code>&lt;link&gt;</code> code and paste it into the{" "}
          <code>&lt;head&gt;</code> of your HTML.
        </li>
        <li>
          Use the <code>font-family</code> rule in your CSS.
        </li>
      </ol>

      <BrowserPreview
        htmlCode={`<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Roboto:wght@300;700&display=swap" rel="stylesheet">
  <style>
    h1 { font-family: 'Pacifico', cursive; color: #E91E63; }
    p { font-family: 'Roboto', sans-serif; }
    .bold { font-weight: 700; }
  </style>
</head>
<body>
  <h1>Pacifico Font</h1>
  <p>This paragraph uses the 'Roboto' font from Google Fonts. <span class="bold">This is bold Roboto.</span></p>
</body>
</html>`}
      />
    </div>
  ),
};
