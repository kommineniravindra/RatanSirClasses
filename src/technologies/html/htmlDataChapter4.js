import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy, prism } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "html", children }) => (
  <SyntaxHighlighter language={language} style={coy}>
    {children}
  </SyntaxHighlighter>
);

export const htmlDataChapter4 = {
  "HTML Entity": (
    <div>
      <p>
        HTML Entities are symbols used to display reserved characters, special
        symbols, or characters that are not available on the keyboard.
      </p>

      <b>Entities can be represented in two ways:</b>
      <ol>
        <li>
          <b>Entity Name:</b> Starts with <b>&</b> and ends with a semicolon (
          <code>;</code>). <br />
          <mark>Examples:</mark> <b>&amp;copy;</b>, <b>&amp;reg;</b>
        </li>
        <li>
          <b>Entity Number:</b> Starts with <b>&#</b> and ends with a semicolon
          (<code>;</code>). <br />
          <mark>Examples:</mark> <b>&amp;#60;</b>, <b>&amp;#62;</b>
        </li>
      </ol>

      <p>
        To explore all entities, check:{" "}
        <a
          href="https://entitycode.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://entitycode.com/
        </a>
      </p>

      <b>Common Entities:</b>
      <ul>
        <li>
          <b>Space Characters:</b> &amp;nbsp; (non-breaking), &amp;emsp; (em
          space means tab space)
        </li>
        <li>
          <b>Copyright &amp; Trademark:</b> &amp;copy; (©), &amp;reg; (®),
          &amp;trade; (™)
        </li>
        <li>
          <b>Currency Symbols:</b> &amp;euro; (€), &amp;pound; (£), &amp;dollar;
          ($), &amp;yen; (¥)
        </li>
        <li>
          <b>Arrows:</b> &amp;rarr; (→), &amp;larr; (←), &amp;uarr; (↑),
          &amp;darr; (↓), &amp;harr; (↔)
        </li>
        <li>
          <b>Degree &amp; Measurement:</b> &amp;deg; (°), &amp;permil; (‰),
          &amp;micro; (µ)
        </li>

        <li>
          <b>Miscellaneous:</b> &amp;hearts; (♥), &amp;star; (★), &amp;check;
          (✓), &amp;infin; (∞)
        </li>
        <li>
          <b>Greek Letters:</b> &amp;alpha; (α), &amp;beta; (β), &amp;gamma;
          (γ), &amp;pi; (π), &amp;Omega; (Ω)
        </li>
        <li>
          <b>Fractions:</b> &amp;frac12; (½), &amp;frac13; (⅓), &amp;frac34;
          (¾), &amp;frac14; (¼)
        </li>
      </ul>
      <CodeBlock>
        {`
<html>
<head> 
  <title>Entity Example</title> 
</head> 
<body>
  <p> SathyaTech CopyRight &copy; &#169; 2025-2030 </p>
  <p> SathyaTech Job Oriented &reg; &#174;</p> 
  <p> Trademark &trade;</p>
  <p> Ratam sir classes &hearts; are nice &hearts; good perfect </p>
  <p> Indian Rupees &#8377; </p>
  <p> Currency Symbols: &dollar; &#8377; &yen; </p>
  <p> Chess Symbols: &#9812; &#9813; &#9814; </p>
  <p> Ratan sir suffering from fever 102&deg;F </p>
  <p> Today task completed <span style="color:green">&check;</span> </p>
  <p> Today task failed <span style="color:red">&cross;</span> </p>
  <p> Playing cards: &spades; &clubs; &hearts; &diams; </p> 
  <p> Sugar weight: &#189; </p> 
  <p> Today class &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; completed </p>
  <p> Today class &emsp; completed </p>
</body> 
</html>
      `}
      </CodeBlock>
    </div>
  ),

  "Images Display": (
    <div>
      <p>
        The <b>&lt;img&gt;</b> tag is an <b>unpaired/self-closing tag</b> used
        to display images in HTML.
      </p>

      <b>Attributes of &lt;img&gt; tag:</b>
      <ol>
        <li>
          <b>src:</b> Specifies the <b>location/path</b> of the image file.
        </li>
        <li>
          <b>alt:</b> Alternative text displayed when the image is not
          available.
        </li>
        <li>
          <b>width:</b> Sets the width of the image (in pixels or percentage).
        </li>
        <li>
          <b>height:</b> Sets the height of the image (in pixels or percentage).
        </li>
        <li>
          <b>title:</b> Displays image information when the cursor hovers over
          the image.
        </li>
      </ol>

      <b>Syntax:</b>
      <CodeBlock>
        {`
<img src='author.jpg' 
    height='50' 
    width='100' 
    alt='Image not found' 
    title='This is Author image'>
      `}
      </CodeBlock>

      <CodeBlock>
        {`
<html>
<head>
  <title>Image Tag Example</title>
</head>
<body>
  <h2>Author / Teacher Image</h2>
  <img 
    src='ratan_sir.jpg' 
    height='100' 
    width='100' 
    alt='Ratan Sir Image not found' 
    title='This is Ratan Sir image'>
  
  <h2>Student Image</h2>
  <img 
    src='student.jpg' 
    height='100' 
    width='100' 
    alt='Student Image not found' 
    title='This is Student image'>
</body>
</html>

      `}
      </CodeBlock>
    </div>
  ),

  "Anchor Tag": (
    <div>
      <p>
        The <b>&lt;a&gt;</b> tag, also called the <b>Anchor Tag</b>, is used to
        create
        <b>clickable hyperlinks</b>. Using this tag, users can navigate to
        another webpage, file, or resource.
      </p>
      <b>1. href Attribute:</b>
      <p>
        The <code>href</code> attribute specifies the link destination. It can
        be used for:
      </p>
      <ul>
        <li>
          <b>Files:</b> Open PDF, Excel, or other files. <br />
          <CodeBlock>{`<a href='myresume.pdf'>Resume</a>`}</CodeBlock>
        </li>
        <li>
          <b>Websites:</b> Open external websites. <br />
          <CodeBlock>{`<a href='https://www.sathyatech.com'>SathyaTech</a>`}</CodeBlock>
        </li>
        <li>
          <b>HTML Pages:</b> Navigate to other HTML pages in the project. <br />
          <CodeBlock>{`<a href='veg.html'>Vegetables</a>`}</CodeBlock>
        </li>
        <li>
          <b>Images:</b> Open images on click. <br />
          <CodeBlock>{`<a href='ratan.jpg'>My Image</a>`}</CodeBlock>
        </li>
      </ul>
      <b>2. target Attribute:</b>
      <ul>
        <li>
          By default, hyperlinks open in the same tab. To open in a new tab, use
          the <code>target</code> attribute:
          <CodeBlock>
           
       {`<a href='https://www.tcs.com' target="_blank">TCS</a>
<a href='myresume.pdf' target="_blank">Resume</a>`}
          </CodeBlock>
        </li>
      </ul>
      <CodeBlock>
        {`
<html>
<head>
  <title>Anchor Tag Example</title>
</head>
<body>
  <h2>Website Links</h2>
  <a href='https://www.sathyatech.com' target="_blank">SathyaTech</a><br />
  <a href='myresume.pdf' target="_blank">Resume</a><br />
  <a href='veg.html'>Vegetables Page</a><br />
  <a href='ratan.jpg'>My Image</a>
</body>
</html>
      `}
      </CodeBlock>
      
    </div>
  ),

 "HTML Comments": (
  <div>
    <ol>
       <li>HTML comments are used to add descriptions of the HTML code. </li>
      <li>Comments are <b>not displayed in the browser</b> and are ignored by browser.</li>
      <li>Used to temporarily disable the specific lines of code. </li>
    </ol>

    <b>Syntax:</b>
   
    <CodeBlock>
      {`<!-- This is a single line comment -->`}
    </CodeBlock>

    <b>Example:</b>
    <CodeBlock>
      {`<html>
<head>
  <title>HTML Comments Example</title>
</head>
<body>
  <h2>Welcome to Ratan Sir Classes</h2>
  <!-- This paragraph explains the welcome message -->
  <p>Hello Students! Learn HTML, CSS, and JavaScript here.</p>
  
  <!-- 
    Multi-line comments:
    You can add multiple lines of notes
    to explain code or sections.
  -->
  <p>Practice coding daily to improve skills.</p>
</body>
</html>
      `}
    </CodeBlock>

  </div>
),

"Case Sensitivity": (
  <div>
    <p>
      HTML is <b>not case-sensitive</b>. This means that the tags, attributes, and attribute values can be written in either uppercase, lowercase, or a mix of both.
    </p>

    <CodeBlock>
      {`
<!-- Using lowercase -->
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Welcome</h1>
    <p>This is a paragraph.</p>
  </body>
</html>

<!-- Using uppercase -->
<HTML>
  <HEAD>
    <TITLE>My Page</TITLE>
  </HEAD>
  <BODY>
    <H1>Welcome</H1>
    <P>This is a paragraph.</P>
  </BODY>
</HTML>

<!-- Mixed case -->
<Html>
  <Head>
    <Title>My Page</Title>
  </Head>
  <Body>
    <H1>Welcome</H1>
    <P>This is a paragraph.</P>
  </Body>
</Html>
      `}
    </CodeBlock>
    <b>Points to Remember:</b>
    <ul>
      <li>Browsers interpret HTML tags and attributes in a case-insensitive way.</li>
      <li>It is recommended to use <b>lowercase</b> for consistency and better readability, especially in modern HTML5.</li>
    </ul>

   
  </div>
),


  "Definition List": (
    <div>
      <p>
        A <b>Definition List</b> is used to create a list of{" "}
        <b>terms and their descriptions</b>. These are similar to a{" "}
        <b>Question & Answer</b> format.
      </p>

      <b> Syntax: </b>
      <pre>
        A Definition List starts with {`<dl>`} tag. <br />
        It contains two sub-tags: <br />
        1. {`<dt>`} → Definition term (Question format). <br />
        2. {`<dd>`} → Definition description (Answer format).
      </pre>

      <CodeBlock>
        {`
<dl>
  <dt>Definition-term</dt>
  <dd>Definition-description</dd>
</dl>
      `}
      </CodeBlock>

      <mark>Example:</mark>
      <CodeBlock>
        {`
<html> 
<head> 
  <title>Definition List</title> 
</head> 
<body> 
  <h2>HTML Questions & Answers</h2> 
  <dl> 
    <dt>What is the purpose of HTML?</dt> 
    <dd>HTML stands for Hypertext Markup Language. 
        It is used to create web pages and structure the content of the page.</dd> 

    <dt>HTML code is executed by?</dt> 
    <dd>HTML code is executed by web browsers such as 
        Google Chrome, Mozilla Firefox, Safari, etc.</dd> 
  </dl>
</body> 
</html>
      `}
      </CodeBlock>
    </div>
  ),

  "Nested Elements": (
  <div>
    <p>
      <b>Nested HTML Elements</b> are elements placed <b>inside other HTML elements</b>. 
      Nesting is used to organize content and structure web pages properly.
    </p>

    <b>Syntax:</b>
    <CodeBlock>
      {`
<parent-element>
  <child-element>
    <!-- Nested content here -->
  </child-element>
</parent-element>
      `}
    </CodeBlock>

    <b>Example:</b>
 <CodeBlock>
      {`<html>
<head>
  <title>Nested Elements Example</title>
</head>
<body>
  <div>
    <h2>My Favorite Fruits</h2>
    <ul>
      <li>Apple</li>
      <li>
        Banana
        <ul>
          <li>Yellow Banana</li>
          <li>Green Banana</li>
        </ul>
      </li>
      <li>Orange</li>
    </ul>
  </div>
</body>
</html>
      `}
    </CodeBlock>

    <b>Points to Remember:</b>
    <ul>
      <li>Child elements are placed inside parent elements using proper opening and closing tags.</li>
      <li>Always maintain proper indentation for better readability.</li>
    </ul>
  </div>
),
};
