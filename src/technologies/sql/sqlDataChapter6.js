import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "sql", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const sqlDataChapter6 = {
  "CASE Statement": (
    <div>
      <h4>The SQL CASE Statement</h4>
      <p>
        The <code>CASE</code> statement goes through conditions and returns a
        value when the first condition is met (like an if-then-else statement).
        So, once a condition is true, it will stop reading and return the
        result. If no conditions are true, it returns the value in the ELSE
        clause.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`CASE
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    WHEN conditionN THEN resultN
    ELSE result
END;`}
      </CodeBlock>

      <h4>Example</h4>
      <CodeBlock>
        {`SELECT OrderID, Quantity,
CASE
    WHEN Quantity > 30 THEN 'The quantity is greater than 30'
    WHEN Quantity = 30 THEN 'The quantity is 30'
    ELSE 'The quantity is under 30'
END AS QuantityText
FROM OrderDetails;`}
      </CodeBlock>
    </div>
  ),

  "Null Functions": (
    <div>
      <h4>SQL IFNULL(), ISNULL(), COALESCE(), and NVL() Functions</h4>
      <p>These functions are used to handle NULL values.</p>

      <h4>MySQL</h4>
      <CodeBlock>
        {`SELECT ProductName, UnitPrice * (UnitsInStock + IFNULL(UnitsOnOrder, 0))
FROM Products;`}
      </CodeBlock>
      <p>
        Or use <code>COALESCE()</code>
      </p>

      <h4>SQL Server</h4>
      <CodeBlock>
        {`SELECT ProductName, UnitPrice * (UnitsInStock + ISNULL(UnitsOnOrder, 0))
FROM Products;`}
      </CodeBlock>

      <h4>Oracle</h4>
      <CodeBlock>
        {`SELECT ProductName, UnitPrice * (UnitsInStock + NVL(UnitsOnOrder, 0))
FROM Products;`}
      </CodeBlock>
    </div>
  ),

  "Stored Procedures": (
    <div>
      <h4>SQL Stored Procedures</h4>
      <p>
        A <strong>Stored Procedure</strong> is a prepared SQL code that you can
        save, so the code can be reused over and over again.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`CREATE PROCEDURE procedure_name
AS
sql_statement
GO;`}
      </CodeBlock>

      <h4>Execute a Stored Procedure</h4>
      <CodeBlock>{`EXEC procedure_name;`}</CodeBlock>
    </div>
  ),

  "SQL Comments": (
    <div>
      <h4>SQL Comments</h4>
      <p>
        Comments are used to explain sections of SQL statements, or to prevent
        execution of SQL statements.
      </p>

      <h4>Single Line Comments</h4>
      <CodeBlock>
        {`-- Select all:
SELECT * FROM Customers;`}
      </CodeBlock>

      <h4>Multi-line Comments</h4>
      <CodeBlock>
        {`/* Select all the columns
of all the records
in the Customers table: */
SELECT * FROM Customers;`}
      </CodeBlock>
    </div>
  ),

  "SQL Operators": (
    <div>
      <h4>SQL Operators</h4>
      <p>Reserved characters or words used in SQL statements.</p>

      <h4>Arithmetic Operators</h4>
      <ul>
        <li>
          <code>+</code> Add
        </li>
        <li>
          <code>-</code> Subtract
        </li>
        <li>
          <code>*</code> Multiply
        </li>
        <li>
          <code>/</code> Divide
        </li>
        <li>
          <code>%</code> Modulo
        </li>
      </ul>

      <h4>Comparison Operators</h4>
      <ul>
        <li>
          <code>=</code> Equal to
        </li>
        <li>
          <code>&gt;</code> Greater than
        </li>
        <li>
          <code>&lt;</code> Less than
        </li>
        <li>
          <code>&gt;=</code> Greater than or equal to
        </li>
        <li>
          <code>&lt;=</code> Less than or equal to
        </li>
        <li>
          <code>&lt;&gt;</code> Not equal to
        </li>
      </ul>

      <h4>Logical Operators</h4>
      <ul>
        <li>
          <code>ALL, AND, ANY, BETWEEN, EXISTS, IN, LIKE, NOT, OR, SOME</code>
        </li>
      </ul>
    </div>
  ),

  Triggers: (
    <div>
      <h4>SQL Triggers</h4>
      <p>
        A <strong>Trigger</strong> is a stored procedure in a database which
        automatically invokes whenever a special event in the database occurs.
      </p>
      <p>Triggers are commonly used for:</p>
      <ul>
        <li>Enforcing complex integrity constraints.</li>
        <li>Auditing changes (keep a log).</li>
        <li>Automatically updating derived values.</li>
      </ul>

      <h4>Data Manipulation Language (DML) Triggers (SQL Server Syntax)</h4>
      <CodeBlock>
        {`CREATE TRIGGER trigger_name
ON table_name
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    -- Logic to be executed
    PRINT 'Something happened to the table!'
END;`}
      </CodeBlock>
    </div>
  ),

  Cursors: (
    <div>
      <h4>SQL Cursors</h4>
      <p>
        A <strong>Cursor</strong> is a database object used to retrieve,
        manipulate, and traverse through a result set row by row.
      </p>
      <p>
        While standard SQL works on sets of data, cursors allow row-by-row
        processing.
      </p>

      <h4>Steps to use a Cursor:</h4>
      <ol>
        <li>
          <strong>DECLARE:</strong> Define the cursor and the query.
        </li>
        <li>
          <strong>OPEN:</strong> Execute the query and populate the cursor.
        </li>
        <li>
          <strong>FETCH:</strong> Retrieve a row from the cursor.
        </li>
        <li>
          <strong>CLOSE:</strong> Release the current result set.
        </li>
        <li>
          <strong>DEALLOCATE:</strong> Remove cursor definition.
        </li>
      </ol>

      <h4>Example (SQL Server Syntax)</h4>
      <CodeBlock>
        {`DECLARE @ProductName VARCHAR(50);

DECLARE product_cursor CURSOR FOR
SELECT ProductName FROM Products;

OPEN product_cursor;

FETCH NEXT FROM product_cursor INTO @ProductName;

WHILE @@FETCH_STATUS = 0
BEGIN
    PRINT @ProductName;
    FETCH NEXT FROM product_cursor INTO @ProductName;
END;

CLOSE product_cursor;
DEALLOCATE product_cursor;`}
      </CodeBlock>
    </div>
  ),
};
