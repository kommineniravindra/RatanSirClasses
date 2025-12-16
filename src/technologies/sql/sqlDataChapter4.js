import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "sql", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const sqlDataChapter4 = {
  "SQL Joins": (
    <div>
      <h4>SQL Joins</h4>
      <p>
        A <code>JOIN</code> clause is used to combine rows from two or more
        tables, based on a related column between them.
      </p>

      <h4>Types of SQL Joins:</h4>
      <ul>
        <li>
          <strong>(INNER) JOIN:</strong> Returns records that have matching
          values in both tables
        </li>
        <li>
          <strong>LEFT (OUTER) JOIN:</strong> Returns all records from the left
          table, and the matched records from the right table
        </li>
        <li>
          <strong>RIGHT (OUTER) JOIN:</strong> Returns all records from the
          right table, and the matched records from the left table
        </li>
        <li>
          <strong>FULL (OUTER) JOIN:</strong> Returns all records when there is
          a match in either left or right table
        </li>
      </ul>

      <p>
        <strong>Example Tables:</strong> Orders and Customers.
      </p>
    </div>
  ),

  "INNER JOIN": (
    <div>
      <h4>SQL INNER JOIN Keyword</h4>
      <p>
        The <code>INNER JOIN</code> keyword selects records that have matching
        values in both tables.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table1
INNER JOIN table2
ON table1.column_name = table2.column_name;`}
      </CodeBlock>

      <h4>Example</h4>
      <CodeBlock>
        {`SELECT Orders.OrderID, Customers.CustomerName
FROM Orders
INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;`}
      </CodeBlock>
    </div>
  ),

  "LEFT JOIN": (
    <div>
      <h4>SQL LEFT JOIN Keyword</h4>
      <p>
        The <code>LEFT JOIN</code> keyword returns all records from the left
        table (table1), and the matched records from the right table (table2).
        The result is 0 records from the right side, if there is no match.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table1
LEFT JOIN table2
ON table1.column_name = table2.column_name;`}
      </CodeBlock>
    </div>
  ),

  "RIGHT JOIN": (
    <div>
      <h4>SQL RIGHT JOIN Keyword</h4>
      <p>
        The <code>RIGHT JOIN</code> keyword returns all records from the right
        table (table2), and the matched records from the left table (table1).
        The result is 0 records from the left side, if there is no match.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table1
RIGHT JOIN table2
ON table1.column_name = table2.column_name;`}
      </CodeBlock>
    </div>
  ),

  "FULL JOIN": (
    <div>
      <h4>SQL FULL OUTER JOIN Keyword</h4>
      <p>
        The <code>FULL OUTER JOIN</code> keyword returns all records when there
        is a match in left (table1) or right (table2) table records. Note: FULL
        OUTER JOIN and FULL JOIN are the same.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table1
FULL OUTER JOIN table2
ON table1.column_name = table2.column_name
WHERE condition;`}
      </CodeBlock>

      <p>
        <em>
          Note: FULL OUTER JOIN can potentially return very large result-sets!
        </em>
      </p>
    </div>
  ),

  "SELF JOIN": (
    <div>
      <h4>SQL Self Join</h4>
      <p>A self join is a regular join, but the table is joined with itself.</p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table1 T1, table1 T2
WHERE condition;`}
      </CodeBlock>

      <h4>Example</h4>
      <CodeBlock>
        {`SELECT A.CustomerName AS CustomerName1, B.CustomerName AS CustomerName2, A.City
FROM Customers A, Customers B
WHERE A.CustomerID <> B.CustomerID
AND A.City = B.City
ORDER BY A.City;`}
      </CodeBlock>
    </div>
  ),

  "UNION Operator": (
    <div>
      <h4>The SQL UNION Operator</h4>
      <p>
        The <code>UNION</code> operator is used to combine the result-set of two
        or more SELECT statements.
      </p>
      <ul>
        <li>
          Every SELECT statement within UNION must have the same number of
          columns
        </li>
        <li>The columns must also have similar data types</li>
        <li>
          The columns in every SELECT statement must also be in the same order
        </li>
      </ul>

      <h4>Union Syntax (Distinct Values)</h4>
      <CodeBlock>
        {`SELECT column_name(s) FROM table1
UNION
SELECT column_name(s) FROM table2;`}
      </CodeBlock>

      <h4>Union All Syntax (Allow Duplicates)</h4>
      <CodeBlock>
        {`SELECT column_name(s) FROM table1
UNION ALL
SELECT column_name(s) FROM table2;`}
      </CodeBlock>
    </div>
  ),
};
