import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "sql", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const sqlDataChapter3 = {
  "TOP / LIMIT Clause": (
    <div>
      <h4>SQL TOP, LIMIT, ROWNUM Clause</h4>
      <p>
        The <code>SELECT TOP</code> clause is used to specify the number of
        records to return. The <code>SELECT TOP</code> clause is useful on large
        tables with thousands of records. returning a large number of records
        can impact performance.
      </p>

      <h4>SQL Server / MS Access Syntax:</h4>
      <CodeBlock>
        {`SELECT TOP number|percent column_name(s)
FROM table_name
WHERE condition;`}
      </CodeBlock>

      <h4>MySQL Syntax:</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table_name
WHERE condition
LIMIT number;`}
      </CodeBlock>

      <h4>Oracle Syntax:</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table_name
WHERE ROWNUM <= number;`}
      </CodeBlock>
    </div>
  ),

  "MIN() and MAX() Functions": (
    <div>
      <h4>The MIN() and MAX() Functions</h4>
      <p>
        The <code>MIN()</code> function returns the smallest value of the
        selected column. The <code>MAX()</code> function returns the largest
        value of the selected column.
      </p>

      <h4>MIN Syntax</h4>
      <CodeBlock>
        {`SELECT MIN(column_name)
FROM table_name
WHERE condition;`}
      </CodeBlock>

      <h4>MAX Syntax</h4>
      <CodeBlock>
        {`SELECT MAX(column_name)
FROM table_name
WHERE condition;`}
      </CodeBlock>
    </div>
  ),

  "COUNT(), AVG(), SUM() Functions": (
    <div>
      <h4>The COUNT(), AVG() and SUM() Functions</h4>
      <p>
        The <code>COUNT()</code> function returns the number of rows that
        matches a specified criterion. The <code>AVG()</code> function returns
        the average value of a numeric column. The <code>SUM()</code> function
        returns the total sum of a numeric column.
      </p>

      <h4>COUNT Syntax</h4>
      <CodeBlock>
        {`SELECT COUNT(column_name)
FROM table_name
WHERE condition;`}
      </CodeBlock>

      <h4>AVG Syntax</h4>
      <CodeBlock>
        {`SELECT AVG(column_name)
FROM table_name
WHERE condition;`}
      </CodeBlock>

      <h4>SUM Syntax</h4>
      <CodeBlock>
        {`SELECT SUM(column_name)
FROM table_name
WHERE condition;`}
      </CodeBlock>
    </div>
  ),

  "LIKE Operator": (
    <div>
      <h4>The LIKE Operator</h4>
      <p>
        The <code>LIKE</code> operator is used in a <code>WHERE</code> clause to
        search for a specified pattern in a column.
      </p>
      <p>
        There are two wildcards often used in conjunction with the LIKE
        operator:
      </p>
      <ul>
        <li>
          <code>%</code> - The percent sign represents zero, one, or multiple
          characters
        </li>
        <li>
          <code>_</code> - The underscore represents a single character
        </li>
      </ul>

      <h4>Syntax</h4>
      <CodeBlock>
        {`SELECT column1, column2, ...
FROM table_name
WHERE columnN LIKE pattern;`}
      </CodeBlock>

      <h4>Example</h4>
      <CodeBlock>
        {`SELECT * FROM Customers
WHERE CustomerName LIKE 'a%'; -- Starts with 'a'`}
      </CodeBlock>
    </div>
  ),

  Wildcards: (
    <div>
      <h4>SQL Wildcards</h4>
      <p>
        Wildcard characters are used with the <code>LIKE</code> operator.
      </p>

      <table
        border="1"
        style={{
          borderCollapse: "collapse",
          width: "100%",
          textAlign: "left",
          marginTop: "10px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>Symbol</th>
            <th>Description</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>%</td>
            <td>Represents zero or more characters</td>
            <td>bl% finds bl, black, blue, and blob</td>
          </tr>
          <tr>
            <td>_</td>
            <td>Represents a single character</td>
            <td>h_t finds hot, hat, and hit</td>
          </tr>
          <tr>
            <td>[]</td>
            <td>Represents any single character within the brackets</td>
            <td>h[oa]t finds hot and hat, but not hit</td>
          </tr>
          <tr>
            <td>^ or !</td>
            <td>Represents any character not in the brackets</td>
            <td>h[^oa]t finds hit, but not hot and hat</td>
          </tr>
          <tr>
            <td>-</td>
            <td>Represents any single character within the specified range</td>
            <td>c[a-b]t finds cat and cbt</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),

  "IN Operator": (
    <div>
      <h4>The IN Operator</h4>
      <p>
        The <code>IN</code> operator allows you to specify multiple values in a{" "}
        <code>WHERE</code> clause. The <code>IN</code> operator is a shorthand
        for multiple <code>OR</code> conditions.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table_name
WHERE column_name IN (value1, value2, ...);`}
      </CodeBlock>

      <h4>Example</h4>
      <CodeBlock>
        {`SELECT * FROM Customers
WHERE Country IN ('Germany', 'France', 'UK');`}
      </CodeBlock>
    </div>
  ),

  "BETWEEN Operator": (
    <div>
      <h4>The BETWEEN Operator</h4>
      <p>
        The <code>BETWEEN</code> operator selects values within a given range.
        The values can be numbers, text, or dates. The <code>BETWEEN</code>{" "}
        operator is inclusive: begin and end values are included.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table_name
WHERE column_name BETWEEN value1 AND value2;`}
      </CodeBlock>

      <h4>Example</h4>
      <CodeBlock>
        {`SELECT * FROM Products
WHERE Price BETWEEN 10 AND 20;`}
      </CodeBlock>
    </div>
  ),

  Aliases: (
    <div>
      <h4>SQL Aliases</h4>
      <p>
        SQL aliases are used to give a table, or a column in a table, a
        temporary name. Aliases are often used to make column names more
        readable. An alias only exists for the duration of that query.
      </p>

      <h4>Alias Column Syntax</h4>
      <CodeBlock>
        {`SELECT column_name AS alias_name
FROM table_name;`}
      </CodeBlock>

      <h4>Alias Table Syntax</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table_name AS alias_name;`}
      </CodeBlock>
    </div>
  ),
};
