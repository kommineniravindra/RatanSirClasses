// import { color } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "html", children }) => (
  <SyntaxHighlighter language={language} style={coy}>
    {children}
  </SyntaxHighlighter>
);

export const htmlDataChapter10 = {

  "Navigation":(

  <div>
    <h3>What is Anchor Link Navigation?</h3>
    <p>
      Anchor link navigation allows users to jump to specific sections of a webpage
      by clicking a link that references an element's <code>id</code> attribute.
      It improves to makes long pages easier to navigate.
    </p>

    <h3>How it Works?</h3>
    <p>
      When a user clicks an anchor link, the browser automatically scrolls to the
      Section element whose <code>id</code> matches the link's <code>href</code>value.
      This works without reloading the page.
    </p>

    <h3>Example Code – Real code snippet showing &lt;nav&gt; + sections</h3>
    <CodeBlock>
{`<nav>
  <a href="#home">Home</a> 
  <a href="#services">Services</a> 
  <a href="#about">About Us</a>
  <a href="#technologies">Technologies</a> |
  <a href="#ranks">Ranks</a>
</nav>

<section id="home">
  <h2>Home</h2>
  <p>Welcome to our homepage.</p>
</section>

<section id="services">
  <h2>Services</h2>
  <p>Details about the services we offer.</p>
</section>

<section id="about">
  <h2>About Us</h2>
  <p>Information about our company.</p>
</section>

<section id="technologies">
  <h2>Technologies</h2>
  <p>Welcome to our Technologies Page.</p>
</section>

<section id="ranks">
  <h2>Ranks</h2>
  <p>Welcome to our Ranks page.</p>
</section>`}
    </CodeBlock>

    <h3>Best Practices – Practical tips for real projects</h3>
    <ul>
      <li>Ensure each section has a unique <code>id</code>.</li>
      <li>Keep anchor link text descriptive, e.g., “About Us” instead of “Click Here”.</li>
      <li>Make the more page content to see the output properly.</li>
    </ul>

</div>
  ),

"Title Image":(
  <div>
     <p>Placing the Icon beside the title. </p>

<CodeBlock>{`<head>
	<title>My Page Title</title>
	<link rel="icon" href="/images/logo.jpg">
</head>`}
</CodeBlock>

  </div>
),
"Tooltip Text": (
    <div>
      <h3>Q. What is Tooltip Text?</h3>
      <p>
        <b>Ans:</b> Tooltip text is the information displayed when you place the cursor
        over a link, button, or image. It gives extra context or details about the element.
      </p>
      <p>
        Hover over this link to see the tooltip:{" "}
        <a href="https://www.ratansir.com" title="Ratan sir Nice Person">
          Ratan Sir Information
        </a>
      </p>
    </div>
),

"Google Fonts": (
    <div>
      <h3>Q. What is Google Fonts?</h3>
      <p>
        <b>Ans:</b> Google Fonts is a library of free and open-source fonts that you
        can use on your website to improve typography and design.
      </p>

      <h4>Steps to Use Google Fonts:</h4>
      <ul>
        <li>
          Go to <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer">https://fonts.google.com</a>.
        </li>
        <li>Search and select the font you want to use.</li>
        <li>Click on GetFont button.</li>
        <li>Click on Get Embed code button.</li>
        <li>
          Copy the <code>&lt;link&gt;</code> tag provided by Google Fonts into your HTML <code>&lt;head&gt;</code>.
          <CodeBlock>
{`<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">`}
          </CodeBlock>
        </li>
        <li>
          Apply the font to your CSS using <code>font-family</code>:
          <CodeBlock>
{`body {
  font-family: 'Roboto', sans-serif;
}`}
          </CodeBlock>
        </li>
      </ul>

      <h4>Example:</h4>
      <p style={{ fontFamily: "'Roboto', sans-serif" }}>
        This text is displayed using the Google Font <b>Roboto</b>.
      </p>
    </div>
  )
};
