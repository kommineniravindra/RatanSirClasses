import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

export const htmlDataChapter3 = {
    
  "Inline Text Tags": (
    <div>
      <p>Inline text elements modify small parts of text:</p>
      <ul>
        <li><code>&lt;span&gt;</code> – generic inline container</li>
        <li><code>&lt;strong&gt;</code> – strong importance</li>
        <li><code>&lt;em&gt;</code> – emphasized text</li>
        <li><code>&lt;abbr&gt;</code> – abbreviation</li>
      </ul>
      <SyntaxHighlighter language="html" style={coy}>
        {`<p>This is a <strong>strong</strong> word.</p>
<p>This is an <em>emphasized</em> word.</p>
<p>The abbreviation <abbr title="HyperText Markup Language">HTML</abbr> is common.</p>`}
      </SyntaxHighlighter>
    </div>
  ),

  "Quotes & Citations": (
    <div>
      <p>Use proper tags for quotations:</p>
      <ul>
        <li><code>&lt;blockquote&gt;</code> – long quotation</li>
        <li><code>&lt;q&gt;</code> – short inline quote</li>
        <li><code>&lt;cite&gt;</code> – reference source</li>
      </ul>
      <SyntaxHighlighter language="html" style={coy}>
        {`<blockquote>
  "HTML is the backbone of the web."
  <cite>— MDN Web Docs</cite>
</blockquote>

<p>As <q>they say</q>, practice makes perfect.</p>`}
      </SyntaxHighlighter>
    </div>
  ),

  "Hyperlinks": (
    <div>
      <p>Hyperlinks connect pages and sites:</p>
      <SyntaxHighlighter language="html" style={coy}>
        {`<a href="https://google.com">Google</a>
<a href="page2.html">Go to Page 2</a>`}
      </SyntaxHighlighter>
    </div>
  ),

  "Email Links": (
    <div>
      <p>Email links open the user’s email client:</p>
      <SyntaxHighlighter language="html" style={coy}>
        {`<a href="mailto:someone@example.com">Send Email</a>`}
      </SyntaxHighlighter>
    </div>
  ),"Bookmark Links": (
    <div>
      <p>Bookmarks allow users to jump to a section of the same page:</p>
      <SyntaxHighlighter language="html" style={coy}>
        {`<h2 id="contact">Contact Us</h2>
<a href="#contact">Go to Contact Section</a>`}
      </SyntaxHighlighter>
    </div>
  ),

  "Download Links": (
    <div>
      <p>Provide downloadable resources using the <code>download</code> attribute:</p>
      <SyntaxHighlighter language="html" style={coy}>
        {`<a href="report.pdf" download>Download Report</a>`}
      </SyntaxHighlighter>
    </div>
  ),

}