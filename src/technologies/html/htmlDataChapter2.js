// src/technologies/html/htmlDataChapter2.jsx
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import BrowserPreview from "../../components/BrowserPreview";


const CodeBlock = ({ language = "html", children }) => (
  <SyntaxHighlighter language={language} style={prism}>
    {children}
  </SyntaxHighlighter>
);

const Example1 = `<html> 
  <head> 
	  <title> Text formatting tags </title> 
  </head> 
  <body> 
	<h1>HTML Introduction.....</h1> 
	<hr> 
	<p> 
	HTML stands from <b><i>Hyper Text markup Language</i></b> used to create web pages. HTML will structure content of the web page.Markup language means that consists of set of tags. <u>Hypertext</u> means hyper links navigating to other pages. <br>HTML code is executed by web browsers such as <small>Google Chrome, Mozilla Firefox, Safari, etc</small>.
	HTML documents are plain text files with a <q>.html</q> extension.	
	HTML was created by <del>Tim Berners-Lee</del> in <mark>1991</mark>.Trained by <strong>mr.Ratan Sir</strong>. HTML maintained by <abbr title='World Wide Web Consortium'>W3C</abbr>. 
	</p>
	<h2> HTML purpose ....</h2> 
	<pre>HTML used to develop the Front-end. 
Java Used to develop the Back-end. 
Using HTML we can create simple personal webpage.
Using HTML we can create complex e-commerce site.
	</pre> 
  </body> 
</html> `;
const Example2 = `<html> 
	<head> 
		<title> Text formatting tags </title> 
	</head> 

	<body> 
		<p>  My Birthday Date => 25<sup>th</sup> may 2001 </p>
		<p> Chemical Formula C<sub>6</sub>H<sub>2</sub>N<sub>8</sub>O<sub>2</sub> </p>
		<p>		
			<span style='color:red'>boAt Airdopes 181 Pro </span> 
			<span style='color:orange'>₹1,199 </span>
			<span style='color:blue'>₹ <del>4,990<del></span> 
			<span style='color:green'>76% off </span> 
		</p>
		
		<p> Enter Username <span style='color:red'>*</span> </p> 
		<p> Enter Password <span style='color:green'>*</span> </p> 
		
		<p> Welcome to <bdo dir='rtl'>Ratan Sir </bdo> </p> 
		
		<marquee direction='up' scrollamount='1'> Welcome to Hyderabad</marquee>
    <br>
		<marquee direction='down' scrollamount='3'> Ratan sir classes Nice</marquee>	
	</body>
</html> `;


export const htmlDataChapter2 = {
  "All tags Information": (
    <div>

    <p>Text formatting tags are used to style or structure the text content in a web page. Examples include headings, paragraphs, bold, italic, underlined text, etc.
</p>

      <h3 style={{textAlign:'center'}}> HTML Text Formatting Tags</h3>


      <table border="2" cellspacing="0" cellpadding="8">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Tag</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>&lt;h1&gt; to &lt;h6&gt;</td>
            <td>
              Heading tags used to define Main headings & subheadings. &lt;h1&gt;
              is the highest, &lt;h6&gt; is the lowest.
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>&lt;p&gt;</td>
            <td>Defines a paragraph of text.</td>
          </tr>
          <tr>
            <td>3</td>
            <td>&lt;pre&gt;</td>
            <td>
              Defines preformatted text. Displays exactly as written in the HTML
              code.
            </td>
          </tr>
          <tr>
            <td>4</td>
            <td>&lt;b&gt;</td>
            <td>Makes text bold.</td>
          </tr>
          <tr>
            <td>5</td>
            <td>&lt;i&gt;</td>
            <td>Makes text italic.</td>
          </tr>
          <tr>
            <td>6</td>
            <td>&lt;hr/&gt;</td>
            <td>Inserts a horizontal line.</td>
          </tr>
          <tr>
            <td>7</td>
            <td>&lt;br/&gt;</td>
            <td>Inserts a line break.</td>
          </tr>
          <tr>
            <td>8</td>
            <td>&lt;small&gt;</td>
            <td>Defines smaller text.</td>
          </tr>
          <tr>
            <td>9</td>
            <td>&lt;q&gt;</td>
            <td>Inserts quotation marks around text.</td>
          </tr>
          <tr>
            <td>10</td>
            <td>&lt;u&gt;</td>
            <td>Underlines text.</td>
          </tr>
          <tr>
            <td>11</td>
            <td>&lt;del&gt;</td>
            <td>Represents deleted text.</td>
          </tr>
          <tr>
            <td>12</td>
            <td>&lt;mark&gt;</td>
            <td>Highlights or marks text.</td>
          </tr>
          <tr>
            <td>13</td>
            <td>&lt;sub&gt;</td>
            <td>
              Displays subscript text H<sub>2</sub>O
            </td>
          </tr>
          <tr>
            <td>14</td>
            <td>&lt;sup&gt;</td>
            <td>
              Displays superscript text x<sup>2</sup>
            </td>
          </tr>
          <tr>
            <td>15</td>
            <td>&lt;span&gt;</td>
            <td>Used to apply styles to individual inline text.</td>
          </tr>
          <tr>
            <td>16</td>
            <td>&lt;marquee&gt;</td>
            <td>Creates scrolling text.</td>
          </tr>
          <tr>
            <td>17</td>
            <td>&lt;bdo&gt;</td>
            <td>Defines bi-directional text display.</td>
          </tr>
        </tbody>
      </table>

<br/>
<b> What is the difference between &lt;p&gt; and &lt;pre&gt;?</b><br/>
<p>
       
        Defines a paragraph. Browser ignores extra spaces and line breaks.
        Preformatted text. Browser preserves spaces, tabs, and line breaks exactly as written.
    </p>

      <h3>There are 6 levels of headings:</h3>
      <ul>
        <li>
          <strong>h1:</strong> Main title
        </li>
        <li>
          <strong>h2:</strong> Subheading of h1
        </li>
        <li>
          <strong>h3:</strong> Subheading of h2
        </li>
        <li>
          <strong>h4:</strong> Subheading of h3
        </li>
        <li>
          <strong>h5:</strong> Subheading of h4
        </li>
        <li>
          <strong>h6:</strong> Smallest and least important heading
        </li>
      </ul>

    

    </div>
  ),

  "Paired Unpaired Tags": (
    <div>
      <h3>Types of Tags</h3>
      <ol style={{ paddingLeft: "1em" }}>
        <li>
          <strong>Paired Tags:</strong>
          Must contain both opening and closing tags. <br />
          <mark>example:</mark> <br />
          <code>&lt;p&gt;Hi students how are you.&lt;/p&gt;</code>
          <br />
          <code>&lt;h1&gt;Hi Ratan Sir&lt;/h1&gt;</code>
        </li>
        <li>
          <strong>Unpaired Tags:</strong>
          Contain only the opening tag (self-closing). <br />
          <mark>Example:</mark> <br />
          <code>&lt;br&gt;,</code>
         
          <code>&lt;hr&gt;</code>
        </li>
      </ol>

    </div>
  ),

  "Formatting Examples": (
    <div>
     
      <mark> <b> <i>Example-1</i></b></mark>
      <CodeBlock>
        {`<html> 
  <head> 
	  <title> Text formatting tags </title> 
  </head> 
  <body> 
	<h1>HTML Introduction.....</h1> 
	<hr> 
	<p> 
	HTML stands from <b><i>Hyper Text markup Language</i></b> used to create web pages. HTML will structure content of the web page.Markup language means that consists of set of tags. <u>Hypertext</u> means hyper links navigating to other pages. <br>HTML code is executed by web browsers such as <small>Google Chrome, Mozilla Firefox, Safari, etc</small>.
	HTML documents are plain text files with a <q>.html</q> extension.	
	HTML was created by <del>Tim Berners-Lee</del> in <mark>1991</mark>.Trained by <strong>mr.Ratan Sir</strong>. HTML maintained by <abbr title='World Wide Web Consortium'>W3C</abbr>. 
	</p>
	<h2> HTML purpose ....</h2> 
	<pre>HTML used to develop the Front-end. 
Java Used to develop the Back-end. 
Using HTML we can create simple personal webpage.
Using HTML we can create complex e-commerce site.
	</pre> 
  </body> 
</html> `}
      </CodeBlock>
            <BrowserPreview htmlCode={Example1} />
      

            <mark> <b> <i>Example-2 {`<sub>, <sup>, <span>, <bdo>, <marquee>`}</i></b></mark>
      <CodeBlock>
        {`<html> 
	<head> 
		<title> Text formatting tags </title> 
	</head> 

	<body> 
		<p>  My Birthday Date => 25<sup>th</sup> may 2001 </p>
		<p> Chemical Formula C<sub>6</sub>H<sub>2</sub>N<sub>8</sub>O<sub>2</sub> </p>
		<p>		
			<span style='color:red'>boAt Airdopes 181 Pro </span> 
			<span style='color:orange'>₹1,199 </span>
			<span style='color:blue'>₹ <del>4,990<del></span> 
			<span style='color:green'>76% off </span> 
		</p>
		
		<p> Enter Username <span style='color:red'>*</span> </p> 
		<p> Enter Password <span style='color:green'>*</span> </p> 
		
		<p> Welcome to <bdo dir='rtl'>Ratan Sir </bdo> </p> 
		
		<marquee direction='up' scrollamount='1'> Welcome to Hyderabad</marquee>
		<marquee direction='down' scrollamount='3'> Ratan sir classes Nice</marquee>	
	</body>
</html>

 `}
      </CodeBlock>
                  <BrowserPreview htmlCode={Example2} />

    </div>
  ),

  "HTML elements parts": (
    <div>
<p>The HTML element consists of 5 parts:</p>
<ol style={{ paddingLeft: "2.7em" }}>
  <li><strong>Start / Opening Tag:</strong> <code>&lt; &gt;</code> ✅ Marks the beginning of an element.</li>
  <li><strong>End / Closing Tag:</strong> <code>&lt;/ &gt;</code> ✅ Marks the end of an element.</li>
  <li><strong>Content of the Element:</strong> The text or data contained within the element.</li>
  <li><strong>Attribute:</strong> Provides extra information to the element, defined inside the opening tag.</li>
  <li><strong>Value:</strong> The value assigned to the attribute.</li>
</ol>

<ol>
  <li>
    &lt;abbr title='World Wide Web Consortium'&gt; W3C &lt;/abbr&gt;
    <ul>
      <li>Opening Tag: <b>&lt;abbr title='World Wide Web Consortium'&gt;</b></li>
      <li>Closing Tag: <b>&lt;/abbr&gt;</b></li>
      <li>Content of the Element: <b>W3C</b></li>
      <li>Attribute: <b>title</b></li>
      <li>Value: <b>World Wide Web Consortium</b></li>
      <li>Element Name: <b>abbr</b></li>
    </ul>
  </li>
  <li>
    &lt;h1 style="color:red"&gt;Tim Berners-Lee&lt;/h1&gt;
    <ul>
      <li>Opening Tag: <b>&lt;h1 style="color:red"&gt;</b></li>
      <li>Closing Tag: <b>&lt;/h1&gt;</b></li>
      <li>Content of the Element: <b>Tim Berners-Lee</b></li>
      <li>Attribute: <b>style</b></li>
      <li>Value: <b>color:red</b></li>
      <li>Element Name: <b>h1</b></li>
    </ul>
  </li>
  <li>
    &lt;p class="nice"&gt;Welcome to Ratan Sir classes&lt;/p&gt;
    <ul>
  <li>Opening Tag: <b>&lt;p class="nice"&gt;</b></li>
  <li>Closing Tag: <b>&lt;/p&gt;</b></li>
  <li>Content of the Element: <b>Welcome to Ratan Sir classes</b></li>
  <li>Attribute: <b>class</b></li>
  <li>Value: <b>nice</b></li>
  <li>Element Name: <b>p</b></li>
</ul>
  </li>
</ol>
    </div>
  ),

};
