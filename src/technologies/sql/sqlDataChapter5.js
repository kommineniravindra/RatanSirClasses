import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "sql", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const sqlDataChapter5 = {
  "GROUP BY Statement": (
    <div>
      <h4>The SQL GROUP BY Statement</h4>
      <p>
        The <code>GROUP BY</code> statement groups rows that have the same
        values into summary rows, like "find the number of customers in each
        country".
      </p>
      <p>
        The <code>GROUP BY</code> statement is often used with aggregate
        functions (COUNT(), MAX(), MIN(), SUM(), AVG()) to group the result-set
        by one or more columns.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table_name
WHERE condition
GROUP BY column_name(s)
ORDER BY column_name(s);`}
      </CodeBlock>

      <h4>Example</h4>
      <CodeBlock>
        {`SELECT COUNT(CustomerID), Country
FROM Customers
GROUP BY Country
ORDER BY COUNT(CustomerID) DESC;`}
      </CodeBlock>
    </div>
  ),

  "HAVING Clause": (
    <div>
      <h4>The SQL HAVING Clause</h4>
      <p>
        The <code>HAVING</code> clause was added to SQL because the{" "}
        <code>WHERE</code> keyword could not be used with aggregate functions.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table_name
WHERE condition
GROUP BY column_name(s)
HAVING condition
ORDER BY column_name(s);`}
      </CodeBlock>

      <h4>Example</h4>
      <CodeBlock>
        {`SELECT COUNT(CustomerID), Country
FROM Customers
GROUP BY Country
HAVING COUNT(CustomerID) > 5;`}
      </CodeBlock>
    </div>
  ),

  "EXISTS Operator": (
    <div>
      <h4>The SQL EXISTS Operator</h4>
      <p>
        The <code>EXISTS</code> operator is used to test for the existence of
        any record in a subquery. The <code>EXISTS</code> operator returns TRUE
        if the subquery returns one or more records.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table_name
WHERE EXISTS
(SELECT column_name FROM table_name WHERE condition);`}
      </CodeBlock>
    </div>
  ),

  "ANY and ALL Operators": (
    <div>
      <h4>The SQL ANY and ALL Operators</h4>
      <p>
        The <code>ANY</code> and <code>ALL</code> operators allow you to perform
        a comparison between a single column value and a range of other values.
      </p>

      <h4>ANY Syntax</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table_name
WHERE column_name operator ANY
  (SELECT column_name FROM table_name WHERE condition);`}
      </CodeBlock>
      <p>
        ANY returns true if the comparison returns true for ANY of the values in
        the subquery.
      </p>

      <h4>ALL Syntax</h4>
      <CodeBlock>
        {`SELECT column_name(s)
FROM table_name
WHERE column_name operator ALL
  (SELECT column_name FROM table_name WHERE condition);`}
      </CodeBlock>
      <p>
        ALL returns true if the comparison returns true for ALL of the values in
        the subquery.
      </p>
    </div>
  ),

  "SELECT INTO": (
    <div>
      <h4>The SQL SELECT INTO Statement</h4>
      <p>
        The <code>SELECT INTO</code> statement copies data from one table into a
        new table.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`SELECT *
INTO newtable [IN externaldb]
FROM oldtable
WHERE condition;`}
      </CodeBlock>

      <h4>Example</h4>
      <CodeBlock>
        {`SELECT * INTO CustomersBackup2017
FROM Customers;`}
      </CodeBlock>
    </div>
  ),

  "INSERT INTO SELECT": (
    <div>
      <h4>The SQL INSERT INTO SELECT Statement</h4>
      <p>
        The <code>INSERT INTO SELECT</code> statement copies data from one table
        and inserts it into another table. The <code>INSERT INTO SELECT</code>{" "}
        statement requires that the data types in source and target tables
        match.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`INSERT INTO table2 (column1, column2, column3, ...)
SELECT column1, column2, column3, ...
FROM table1
WHERE condition;`}
      </CodeBlock>
    </div>
  ),
};
