import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy} from "react-syntax-highlighter/dist/esm/styles/prism";
import BrowserPreview from "../../components/BrowserPreview";

const CodeBlock = ({ language = "html", children }) => (
  <SyntaxHighlighter language={language} style={coy}>
    {children}
  </SyntaxHighlighter>
);

const htmlCodeOrderedList = `<html>
<head>
  <title> Ordered List</title>
</head>
<body>
  <h2>Steps to Order Food Online</h2>
  <ol>
        <li>Open the food delivery app (e.g., Zomato or Swiggy). </li>
        <li>Log in to your account. </li>
        <li>Choose your preferred restaurant. </li>
        <li>Select the items you want to order. </li>
        <li>Add items to the cart. </li>
        <li>Proceed to checkout and make the payment. </li>
        <li>Wait for your food to be delivered. </li>
  </ol>	
</body>
</html>`;

const htmlCodeUnOrderedList = `
<html>
<head>
  <title>Unordered List</title>
</head>
<body>
  <h2>Job Oriented Training Program Benefits</h2>
  <ul type="square">
    <li>Hands-on practical projects</li>
    <li>Industry expert guidance</li>
    <li>Interview preparation</li>
    <li>Placement support</li>  
  </ul>
</body>
</html>
`;


const htmlCodeDefinitionList = `<html>
<head>
  <title>Definition List</title>
</head>
<body>
  <h2>HTML Questions & Answers</h2>
  <dl style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <dt style="font-weight: bold; margin-top: 10px;">What is the purpose of HTML?</dt>
    <dd style="margin-left: 20px;">HTML stands for Hypertext Markup Language. It is used to create web pages and structure the content of the page.</dd>

    <dt style="font-weight: bold; margin-top: 10px;">HTML code is executed by?</dt>
    <dd style="margin-left: 20px;">HTML code is executed by web browsers such as Google Chrome, Mozilla Firefox, Safari, etc.</dd>
  </dl>
</body>
</html>`;


const htmlCodeNestedList = `<html>
<head>    
<title>Complete List Information</title>	
</head>
<body>
	<h1>Top Companies Names List</h1> 
	<ol>  
		<li>Google
			<ol type="i">
				<li>hyderabad</li>
				<li>Bangalore</li>
			</ol>
		</li>  
		<li>TCS</li>  
		<li>Oracle
			<ul type='square'>
				<li>Hyderabad</li>
				<li>Bangalore</li>
				<li>Chennai</li>
			</ul>
		</li>
		<li>IBM</li>
		<li>Wipro</li>  
	</ol>  
</body>
</html>`;

export const htmlDataChapter3 = {
  "List Purpose": (
    <div>
      <p>
        HTML List used to display related data in a structured and and
        well-organized format.
      </p>
    </div>
  ),
  "List Types": (
    <div>
      <p>There are three types of lists in HTML:</p>
      <ol style={{ paddingLeft: "2.5em" }}>
        <li>
          Ordered List (<code>&lt;ol&gt;</code>)
        </li>
        <li>
          Unordered List (<code>&lt;ul&gt;</code>)
        </li>
        <li>
          Definition List (<code>&lt;dl&gt;</code>)
        </li>
      </ol>
    </div>
  ),

  "Ordered List": (
    <div>
      <p>
        Ordered lists are used when the sequence/order of items is important.
      </p>
      <mark>Examples: </mark>
      <ul>
        <li>Top 10 movies list.</li>
        <li>A cooking website showing curry preparation steps.</li>
        <li>Employee onboarding process.</li>
      </ul>
      <b>Syntax:</b>
      <pre>
        Take Ordered list using {`<ol>`} tag. <br />
        Take Each list item using {`li`} tag.
      </pre>
      <CodeBlock>
        {`
 
<ol>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ol>
          `}
      </CodeBlock>
      <b>Attributes Information:</b>
      <ol>
        <li>
          By default takes the sequence number 1,2,3..etc. <br />
          It is possible to take the custom sequence using type attribute,
          <CodeBlock>
            {`
<ol>				1 2 3 4 5	    .... etc 
<ol type='i'>		i ii iii iv v   .... etc  
<ol type='I'>		I II  III IV V  .... etc 
<ol type='A'>		A B C D E       .... etc 
<ol type='a'>		a b c d e       .... etc 
        `}
          </CodeBlock>
        </li>

        <li>
          By default the sequence printed low-high, But to print the seqeunce
          high-low us reversed attribute.
          <CodeBlock>{"<ol reversed>"}</CodeBlock>
        </li>

        <li>
          By default the sequence starting form 1, But to start the sequence
          specific number onwards use start attribute.
          <CodeBlock>
            {`
<ol start="5"> `}
          </CodeBlock>
        </li>
      </ol>
      <mark>Example:</mark>
      <CodeBlock>
        {`
<html>
<head>
  <title> Ordered List</title>
</head>
<body>
  <h2>Steps to Order Food Online</h2>
  <ol>
        <li>Open the food delivery app (e.g., Zomato or Swiggy). </li>
        <li>Log in to your account. </li>
        <li>Choose your preferred restaurant. </li>
        <li>Select the items you want to order. </li>
        <li>Add items to the cart. </li>
        <li>Proceed to checkout and make the payment. </li>
        <li>Wait for your food to be delivered. </li>
  </ol>	
</body>
</html>`}
      </CodeBlock>

      <BrowserPreview htmlCode={htmlCodeOrderedList} />
    </div>
  ),

"Un-Ordered List": (
  <div>
    <p>
      Unordered lists are used where the <b>sequence/order of items is not important</b>.
    </p>
    <mark>Examples:</mark>
    <ul>
      <li>To display the Job Oriented Training program benefits.</li>
      <li>Items to buy at the supermarket.</li>
      <li>An e-commerce website displaying product details.</li>
    </ul>

    <b>Syntax:</b>
    <pre>
      Take Un-Ordered list using {`<ul>`} tag. <br />
      Take Each list item using {`<li>`} tag.
    </pre>
    <CodeBlock>
      {`
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
      `}
    </CodeBlock>

    <b>Attributes Information:</b>
    <ol>
      <li>
        By default, Un-Ordered List displays items with a <b>bullet (•)</b>.
      </li>
      <li>
        It is possible to change the bullet style using the <code>type</code> attribute:
        <CodeBlock>
          {`
<ul>                <!-- Default: Filled circle -->
<ul type="circle">  <!-- Empty circle -->
<ul type="square">  <!-- Filled square -->
          `}
        </CodeBlock>
      </li>
    </ol>

    <mark>Example:</mark>
    <CodeBlock>
      {`
<html>
<head>
  <title>Unordered List</title>
</head>
<body>
  <h2>Job Oriented Training Program Benefits</h2>
  <ul type="square">
    <li>Hands-on practical projects</li>
    <li>Industry expert guidance</li>
    <li>Interview preparation</li>
    <li>Placement support</li>
  </ul>
</body>
</html>
      `}
    </CodeBlock>

<BrowserPreview htmlCode={htmlCodeUnOrderedList} />

    {/* <b>Output Screen:</b> <br />
    <img src="unordered.png" alt="Unordered List Example" height={"300"} width={"500"} /> */}
  </div>
),

"Definition List": (
  <div>
    <p>
      A <b>Definition List</b> is used to create a list of <b>terms and their descriptions</b>. 
      These are similar to a <b>Question & Answer</b> format.
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
      <BrowserPreview htmlCode={htmlCodeDefinitionList} />


     </div>
),


  "Nested List": (
    <div>
      <p>
       Declaring the list inside another list. This can be used to represent multi-level data, such as categories and subcategories.
      </p>


      <CodeBlock>
        {
          `<html>
<head>    
<title>Complete List Information</title>	
</head>
<body>
	<h1>Top Companies Names List</h1> 
	<ol>  
		<li>Google
			<ol type="i">
				<li>hyderabad</li>
				<li>Bangalore</li>
			</ol>
		</li>  
		<li>TCS</li>  
		<li>Oracle
			<ul type='square'>
				<li>Hyderabad</li>
				<li>Bangalore</li>
				<li>Chennai</li>
			</ul>
		</li>
		<li>IBM</li>
		<li>Wipro</li>  
	</ol>  
</body>
</html> `
        }
      </CodeBlock>
      <BrowserPreview htmlCode={htmlCodeNestedList} />
    </div>
  ),
};
