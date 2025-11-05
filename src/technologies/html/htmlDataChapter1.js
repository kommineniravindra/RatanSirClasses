// src/technologies/html/htmlData.js
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import BrowserPreview from "../../components/BrowserPreview";

const CodeBlock = ({ language = "html", children }) => (
  <SyntaxHighlighter language={language} style={prism}>
    {children}
  </SyntaxHighlighter>
);

const htmlCode = `
<html>
  <head>
    <title>Welcome</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>Welcome To Ratan sir classes.</p>
  </body>
</html>`;

export const htmlDataChapter1 = {
  "HTML Importance": (
    <div>
      <h4>Q. What is HTML?</h4>
      <p>
        HTML stands for "HyperText Markup Language". <br />
        Markup language means that consists of set of tags.{" "}
        <br />
        Hypertext means hyperlinks(Clickable) that allow users
        can navigate from one page to another.
      </p>
      <h4> Q. What is the purpose of HTML? </h4>
      <p>HTML used to create the web pages,</p>
      <ol>
        <li>
          The web page can contain forms such as <code>login.html</code> and{" "}
          <code>register.html</code>.
        </li>
        <li>The web page can include images and hyperlinks.</li>
        <li>The web page can display headings and paragraphs.</li>
        <li>The web page can embed audio and video files.</li>
      </ol>

      <h4> Read All important points HTML? </h4>
      <ul>
        <li>HTML is used to create web pages.</li>
        <li>
          HTML code is executed by browsers such as Google Chrome, Mozilla
          Firefox, Safari, etc.
        </li>
        <li>HTML was created by Tim Berners-Lee in 1991. </li>
        <li> HTML is maintained by the W3C (World Wide Web Consortium).</li>
        <li>
          HTML documents are plain text files with a <code>.html</code>{" "}
          extension.
        </li>
        <li>
          The present version of HTML is <strong>HTML5</strong>.
        </li>
        <li>
          HTML is used to develop the <strong>Front-end</strong>, whereas Java
          is used to develop the <strong>Back-end</strong>.
        </li>
        <li>
          Using HTML we can create a simple personal webpage or a complex
          e-commerce site.
        </li>
        <li>
          Always save HTML files with the <code>.html</code> extension.
        </li>
        <li>
          The collection of web pages is called a <mark>Website</mark>.
        </li>
      </ul>
    </div>
  ),

  "IDEs & Editors": (
    <div>
      <h4>Options to Write HTML Code</h4>
      <ol>
        <li>
          <strong>Editors</strong>
          <br />
          <em>Examples:</em> Notepad, Notepad++, Sublime Text, EditPlus .....
          etc.
        </li>
        <li>
          <strong>IDEs (Integrated Development Environments)</strong>
          <br />
          <em>Examples:</em> Visual Studio Code (VSC), Dreamweaver, WebStorm....
          etc.
        </li>
      </ol>

      <ul>
        <li>
          In an <strong>Editor</strong>, you have to write all the code
          manually.
        </li>
        <li>
          In an <strong>IDE</strong>, you get features like code suggestions,
          auto-completion, and code generation.
        </li>
      </ul>

      <h4>Download & Install EditPlus</h4>
      <p>
        Website:{" "}
        <a href="https://www.editplus.com/" target="_blank">
          https://www.editplus.com/
        </a>
      </p>
    </div>
  ),

  "Document Structure": (
    <div>
      <h4>Structure of an HTML Document</h4>
      <ol>
        <li>
          <strong>Document Type Declaration (DOCTYPE)</strong>
          <br />- The HTML document starts with{" "}
          <code>&lt;!DOCTYPE html&gt;</code> which represents the HTML version.
          <br />- If we remove this declaration, the browser will assume the
          document is in <strong>HTML5</strong>.
        </li>

        <li>
          <strong>HTML Root Element: &lt;html&gt;</strong>
          <br />
          - The root element of an HTML document.
          <br />- It contains two main sections:
          <ul>
            <li>
              <code>&lt;head&gt;</code>
            </li>
            <li>
              <code>&lt;body&gt;</code>
            </li>
          </ul>
        </li>

        <li>
          <strong>Head Section: &lt;head&gt;</strong>
          <br />
          Contains meta-information about the document such as:
          <ul>
            <li>Page title</li>
            <li>CSS file link</li>
            <li>JavaScript file link</li>
            <li>Bootstrap linking, etc.</li>
          </ul>
          <em>Note:</em> Content inside the <code>&lt;head&gt;</code> is{" "}
          <strong>not visible</strong> on the webpage.
        </li>

        <li>
          <strong>Body Section: &lt;body&gt;</strong>
          <br />
          Contains the main <strong>visible content</strong> of the webpage such
          as:
          <ul>
            <li>Text, headings, and paragraphs</li>
            <li>Images</li>
            <li>Hyperlinks</li>
            <li>Tables</li>
            <li>Lists</li>
            <li>Other multimedia content</li>
          </ul>
        </li>
      </ol>
    </div>
  ),

  Versions: (
    <div>
      <ol>
        <li>
          <strong>1991 – HTML 1.0</strong>
          <br />- Created by <strong>Tim Berners-Lee</strong> at CERN.
          <br />- Very basic version with limited tags.
        </li>
        <li>
          <strong>1995 – HTML 2.0</strong>
          <br />
          - First official standard specification.
          <br />- Introduced forms and basic structure.
        </li>
        <li>
          <strong>1997 – HTML 3.2</strong>
          <br />- Added support for tables, applets, and scripting.
        </li>
        <li>
          <strong>1999 – HTML 4.01</strong>
          <br />
          - Widely adopted version.
          <br />- Introduced support for CSS, scripting, and complex layouts.
        </li>
        <li>
          <strong>2014 – HTML5</strong>
          <br />- Current standard maintained by <strong>W3C</strong> and{" "}
          <strong>WHATWG</strong>.<br />
          - Introduced multimedia support (audio, video, canvas).
          <br />- Added semantic tags and APIs for modern web applications.
        </li>
      </ol>
    </div>
  ),

  "First Web Page": (
    <div>
      <h4>First Application Steps</h4>
      <ol>
        <li>Write the HTML code.</li>
        <li>
          Save the code with the <code>.html</code> extension.
        </li>
        <li>Open the saved file in a browser to see the output.</li>
      </ol>

      <CodeBlock>
        {`<!DOCTYPE>
<html>
  <head>
    <title>Welcome</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>Welcome To Ratan sir classes.</p>
  </body>
</html>`}
      </CodeBlock>
      <BrowserPreview htmlCode={htmlCode} />
    </div>
  ),
};
