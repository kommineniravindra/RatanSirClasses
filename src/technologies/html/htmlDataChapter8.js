// import { color } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy} from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "html", children }) => (
  <SyntaxHighlighter language={language} style={coy}>
    {children}
  </SyntaxHighlighter>
);

export const htmlDataChapter8 = {

"DOM Object": (
  <div>
    <ul>
      <li>
        DOM stands for "Document Object Model".
      </li>
      <li>
        The HTML tags/elements will be converted into a tree of objects, which
        is called the <b>DOM</b>.
      </li>
      <li>
        The root object of the DOM is <code>document</code>.
      </li>
      <li>DOM is created by the browser when a web page is loaded.</li>
      <li>
        To see the DOM online:{" "}
       
        
         <a href="https://0xedward.github.io/dom-visualizer/" target="_blank">
          https://0xedward.github.io/dom-visualizer/
        </a>
      </li>
    </ul>
  </div>
),

"Div Tag": (
    <div>
      <ul>
        <li>
        The <code>&lt;div&gt;</code> tag is used to create divisions of a web
        page. 
      </li>
      <li>A webpage can contain multiple divisions.</li>
        <li>We can apply styles to an entire division.</li>
        <li>Each division can contain multiple tags.</li>
        <li>Main divisions can also have sub-divisions.</li>
        <li>
          It is a block-level element, meaning it starts on a new line.
        </li>
      </ul>

      <b>Case-1:  Divisions contains mutliple elements</b>
    <CodeBlock>
      {`<div>
   <h1>Heading...</h1>
   <p>Paragraph...</p>
</div>`
      }
    </CodeBlock>
   
    <b>Case-2: Main division can have sub-divisions</b>
    
    <CodeBlock>
        { `<div>
      <div>Sub Division 1</div>
      <div>Sub Division 2</div>
</div>`}
    </CodeBlock>
    
  <mark>example:</mark>
   <CodeBlock>
        {`<div style=color: "red">
    <h1>About Ratan Sir</h1>
    <p>Ratan sir nice</p>
</div>

<div style=color: "green">
    <h2>About Student</h2>
    <p>Students are good</p>
</div>
` }
   </CodeBlock>
    </div>
),

"Social Media Icons": (
  <div>
    <p>
      To use icons, we need to include the <b>Font Awesome CDN</b> link in the{" "}
      <code>&lt;head&gt;</code> section:
    </p>

    <CodeBlock>
      {`<link rel="stylesheet" 
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />`}
    </CodeBlock>

    <h3>Example 1: Display Social Media Icons</h3>
    <p>We can directly show icons using Font Awesome classes:</p>

    <CodeBlock>
      {`<div>
  <i class="fab fa-facebook"></i>
  <i class="fab fa-twitter"></i>
  <i class="fab fa-instagram"></i>
  <i class="fab fa-linkedin"></i>
</div>`}
    </CodeBlock>

    <div style={{ fontSize: "30px", color: "blue" }}>
      <i className="fab fa-facebook"></i> &nbsp;
      <i className="fab fa-twitter"></i> &nbsp;
      <i className="fab fa-instagram"></i> &nbsp;
      <i className="fab fa-linkedin"></i>
    </div>

    <h3>Example 2: Make Icons Clickable (Hyperlinks)</h3>
    <p>Wrap each icon inside an <code>&lt;a&gt;</code> tag:</p>

    <CodeBlock>
      {`<div>
  <a href="https://facebook.com" target="_blank" style="margin-right:15px; color:blue">
    <i class="fab fa-facebook"></i>
  </a>
  <a href="https://twitter.com" target="_blank" style="margin-right:15px; color:skyblue">
    <i class="fab fa-twitter"></i>
  </a>
  <a href="https://instagram.com" target="_blank" style="margin-right:15px; color:purple">
    <i class="fab fa-instagram"></i>
  </a>
  <a href="https://linkedin.com" target="_blank" style="color:darkblue">
    <i class="fab fa-linkedin"></i>
  </a>
</div>`}
    </CodeBlock>

   <CodeBlock>{`
    <div>
      <a href="https://facebook.com" target="_blank" style={{ marginRight: "15px", color: "blue" }}>
        <i className="fab fa-facebook"></i>
      </a>
      <a href="https://twitter.com" target="_blank" style={{ marginRight: "15px", color: "skyblue" }}>
        <i className="fab fa-twitter"></i>
      </a>
      <a href="https://instagram.com" target="_blank" style={{ marginRight: "15px", color: "purple" }}>
        <i className="fab fa-instagram"></i>
      </a>
      <a href="https://linkedin.com" target="_blank" style={{ color: "darkblue" }}>
        <i className="fab fa-linkedin"></i>
      </a>
    </div>
    
  </div>
  `}
  </CodeBlock>
  </div>
)
};
