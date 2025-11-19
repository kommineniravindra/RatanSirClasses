import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy} from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "html", children }) => (
  <SyntaxHighlighter language={language} style={coy}>
    {children}
  </SyntaxHighlighter>
);

export const htmlDataChapter5 = {
 "Table Introduction": (
  <div>
    <p>
      Tables are used to display data in a structured <b>rows and columns</b> format.
    </p>

    <mark>Examples:</mark>
    <ul>
      <li>Display all the employee details in a table format.</li>
      <li>Display all the product details in a table format.</li>
    </ul>

    <b>Important Notes:</b>
    <ul>
      <li>One employee’s data is represented in <b>one table row</b>.</li>
      <li>10 employees’ data means <b>10 table rows</b>.</li>
      <li>If we need to display only salaries of employees → use <b>single Salary column</b>.</li>
      <li>If we need to display both employee name and salary → use <b>two columns</b> (Name and Salary).</li>
    </ul>

    <mark>Syntax:</mark>
   <CodeBlock>
  {`
<!-- Table starts -->
<table border="1">

  <!-- Caption for the table -->
  <caption>Employee Details</caption>

  <!-- First row (table header row) -->
  <tr>
    <th>Column 1</th>   <!-- First column heading -->
    <th>Column 2</th>   <!-- Second column heading -->
    <!-- Add more <th> for more to add the more column data -->
  </tr>

  <!-- Second row (table data row) -->
  <tr>
    <td>Row Data 1</td> <!-- First column data -->
    <td>Row Data 2</td> <!-- Second column data -->
    <!-- Add more <td> for more to add the more column data-->
  </tr>

  <!-- More rows can be added here -->
</table>    <!-- Table ends -->
  `}
</CodeBlock>

  </div>
),

"Table Tags": (
  <div>
    <p>
      In HTML, different tags are used to create and structure a table. Below are
      the most important tags:
    </p>

    <ul>
      <li>
        <b>&lt;table&gt;</b>: Used to create a table.
      </li>
      <li>
        <b>&lt;caption&gt;</b>: Provides a title or caption for the table.
      </li>
      <li>
        <b>&lt;tr&gt;</b>: Defines a row inside the table.
      </li>
      <li>
        <b>&lt;th&gt;</b>: Defines a <b>table header</b> cell (bold and centered
        by default).
      </li>
      <li>
        <b>&lt;td&gt;</b>: Defines a <b>table data</b> cell, used to display actual data.
      </li>
    </ul>

    <mark>Example:</mark>
    <CodeBlock>
  {`
<table border="1">
  <caption>Employee Details</caption>
  
  <!-- Table Header -->
  <tr>
    <th>Id</th>
    <th>Name</th>
    <th>Email</th>
    <th>Gender</th>
    <th>Resume</th>
    <th>Image</th>
  </tr>

  <!-- Row 1 -->
  <tr>
    <td>101</td>
    <td>Ratan</td>
    <td>ratan@example.com</td>
    <td>Male</td>
    <td><a href="ratan_resume.pdf" target="_blank">Resume</a></td>
    <td><img src="ratan.jpg" height="50" width="50" alt="Ratan Image"/></td>
  </tr>

  <!-- Row 2 -->
  <tr>
    <td>102</td>
    <td>Anu</td>
    <td>anu@example.com</td>
    <td>Female</td>
    <td><a href="anu_resume.pdf" target="_blank">Resume</a></td>
    <td><img src="anu.jpg" height="50" width="50" alt="Sneha Image"/></td>
  </tr>

  <!-- Row 3 -->
  <tr>
    <td>103</td>
    <td>Ravindra</td>
    <td>ravindra@example.com</td>
    <td>Male</td>
    <td><a href="Ravindra_resume.pdf" target="_blank">Resume</a></td>
    <td><img src="Ravindra.jpg" height="50" width="50" alt="Arjun Image"/></td>
  </tr>

  <!-- Row 4 -->
  <tr>
    <td>104</td>
    <td>Priya</td>
    <td>priya@example.com</td>
    <td>Female</td>
    <td><a href="priya_resume.pdf" target="_blank">Resume</a></td>
    <td><img src="priya.jpg" height="50" width="50" alt="Priya Image"/></td>
  </tr>

  <!-- Row 5 -->
  <tr>
    <td>105</td>
    <td>Adithya</td>
    <td>adithya@example.com</td>
    <td>Male</td>
    <td><a href="adithya_resume.pdf" target="_blank">Resume</a></td>
    <td><img src="adithya.jpg" height="50" width="50" alt="Rahul Image"/></td>
  </tr>

</table>
  `}
</CodeBlock>

  </div>
),

"Table Attributes": (
  <div>
    <p>
      Table attributes are used to control the <b>appearance and layout</b> of an
      HTML table.
    </p>

    <b>Common Attributes:</b>
    <ol>
      <li>
        <b>border:</b> Specifies the border around the table. <br />
        <CodeBlock>{`<table border="1">`}</CodeBlock>
      </li>
      <li>
        <b>width:</b> Specifies the width of the table. <br />
        <CodeBlock>{`<table width="80%">`}</CodeBlock>
      </li>
      <li>
        <b>height:</b> Specifies the height of the table. <br />
        <CodeBlock>{`<table height="100%">`}</CodeBlock>
      </li>
      <li>
        <b>cellpadding:</b> Distance between the cell content and cell borders. <br />
        <CodeBlock>{`<table cellpadding="5">`}</CodeBlock>
      </li>
      <li>
        <b>cellspacing:</b> The space between cell to cell. <br />
        <CodeBlock>{`<table cellspacing="10">`}</CodeBlock>
      </li>
      <li>
        <b>align:</b> Alignment of the table on the page. <br />
        <CodeBlock>{`<table align="center">`} <br /> {`<table align="left">`} <br /> {`<table align="right">`}</CodeBlock>
      </li>
      <li>
        <b>bgcolor:</b> Background color of the table. <br />
        <CodeBlock>{`<table bgcolor="pink">`}</CodeBlock>
      </li>
      <li>
        <b>background:</b> Background image of the table. <br />
        <CodeBlock>{`<table background="myimage.jpg">`}</CodeBlock>
      </li>
      <li>
        <b>bordercolor:</b> Border color of the table. <br />
        <CodeBlock>{`<table bordercolor="red">`}</CodeBlock>
      </li>
      <li>
        <b>rules:</b> Specifies whether to show lines between cells. <br />
        <CodeBlock>{`<table rules="all">`}</CodeBlock>
      </li>
    </ol>
  </div>
),

"Cells Merging": (
  <div>
    <p>
      In HTML tables, we can <b>merge multiple cells</b> either <b>horizontally</b> 
      (columns) or <b>vertically</b> (rows) using the attributes:
    </p>

    <ol>
      <li>
        <b>colspan</b>: Used to merge <b>two or more columns</b> into one.  
        <br />
        Example: <code>{`<td colspan="3">Total Salaries</td>`}</code>
      </li>
      <li>
        <b>rowspan</b>: Used to merge <b>two or more rows</b> into one.  
        <br />
        Example: <code>{`<td rowspan="2">Ratan Sir</td>`}</code>
      </li>
    </ol>

    <mark>Example: Check the Output</mark>
    <CodeBlock>
      {`
<table border="1">
  <tr>
    <th>Name</th>
    <th>Department</th>
    <th>Salary</th>
  </tr>
  <tr>
    <td rowspan="2">Ratan Sir</td>
    <td>Training</td>
    <td>50,000</td>
  </tr>
  <tr>
    <td>Development</td>
    <td>60,000</td>
  </tr>
  <tr>
    <td colspan="2">Total Salary</td>
    <td>1,10,000</td>
  </tr>
</table>
      `}
    </CodeBlock>

    <mark>Explanation:</mark>
    <ul>
      <li>
        <code>rowspan="2"</code> → The cell <b>“Ratan Sir”</b> covers 2 rows.
      </li>
      <li>
        <code>colspan="2"</code> → The cell <b>“Total Salary”</b> covers 2 columns.
      </li>
    </ul>

    <mark>Example Output:</mark>
    <p>
      The table will display "Ratan Sir" once but span across two rows.  
      The "Total Salary" will appear in a single cell across 2 columns.
    </p>
  </div>
),


 "Table Parts": (
  <div>
    <p>
      A table in HTML is divided into <b>3 main sections</b>:
    </p>

    <ol>
      <li>
        <b>&lt;thead&gt;</b> → Defines the <b>header section</b> of the table.
      </li>
      <li>
        <b>&lt;tbody&gt;</b> → Defines the <b>body section</b> containing the actual
        data.
      </li>
      <li>
        <b>&lt;tfoot&gt;</b> → Defines the <b>footer section</b>, often used for
        summary or totals.
      </li>
    </ol>

    <mark>Syntax:</mark>
    <CodeBlock>
      {`
<table>
  <caption> ...Here take the caption... </caption>

  <thead style="color:red">
    ...Here take the table headings...
  </thead>

  <tbody style="color:blue">
    ...Here take the table data...
  </tbody>

  <tfoot style="color:green">
    ...Here take the table footer result...
  </tfoot>
</table>
      `}
    </CodeBlock>

    <mark>Example:</mark>
    <CodeBlock>
      {`
<html>
<head>
  <title>Table Example</title>
</head>
<body>
  <table border="1">
    <caption>Multinational Companies Details</caption>

    <thead style="color:red">
      <tr>
        <th>No.</th>
        <th>Full Name</th>
        <th>Position</th>
        <th>Salary</th>
        <th>Website</th>
      </tr>
    </thead>

    <tbody style="color:green">
      <tr>
        <td>1</td>
        <td>Bill Gates</td>
        <td>Founder Microsoft</td>
        <td>$1000</td>
        <td><a href="https://www.microsoft.com/" target="_blank">Click Here</a></td>
      </tr>
      <tr>
        <td>2</td>
        <td>Steve Jobs</td>
        <td>Founder Apple</td>
        <td>$1200</td>
        <td><a href="https://www.apple.com/" target="_blank">Click Here</a></td>
      </tr>
      <tr>
        <td>3</td>
        <td>Larry Page</td>
        <td>Founder Google</td>
        <td>$1100</td>
        <td><a href="https://www.google.com/" target="_blank">Click Here</a></td>
      </tr>
      <tr>
        <td>4</td>
        <td>Mark Zuckerberg</td>
        <td>Founder Facebook</td>
        <td>$1300</td>
        <td><a href="https://www.facebook.com/" target="_blank">Click Here</a></td>
      </tr>
      <tr>
        <td>5</td>
        <td>Ratan</td>
        <td>Founder RatanGuides</td>
        <td>$1000</td>
        <td><a href="https://www.ratanguides.com/" target="_blank">Click Here</a></td>
      </tr>
    </tbody>

    <tfoot style="color:blue">
      <tr>
        <td colspan="3">Total Salaries</td>
        <td colspan="2">$5600</td>
      </tr>
    </tfoot>

  </table>
</body>
</html>
      `}
    </CodeBlock>
  </div>
),



};
