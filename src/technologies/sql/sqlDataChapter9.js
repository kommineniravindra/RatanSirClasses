import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "sql", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const sqlDataChapter9 = {
  "SQL Injection": (
    <div>
      <h4>SQL Injection</h4>
      <p>
        SQL injection is a code injection technique that might destroy your
        database. SQL injection is one of the most common web hacking
        techniques. SQL injection is the placement of malicious code in SQL
        statements, via web page input.
      </p>

      <h4>Example Vulnerability</h4>
      <CodeBlock>
        {`txtUserId = getRequestString("UserId");
txtSQL = "SELECT * FROM Users WHERE UserId = " + txtUserId;`}
      </CodeBlock>
      <p>
        If the user input is <code>105 OR 1=1</code>, the query becomes:
      </p>
      <CodeBlock>{`SELECT * FROM Users WHERE UserId = 105 OR 1=1;`}</CodeBlock>
      <p>
        This is always true, and might return all rows from the Users table.
      </p>

      <h4>Prevention</h4>
      <p>Use SQL Parameters (Prepared Statements) for protection.</p>
    </div>
  ),

  "SQL Hosting": (
    <div>
      <h4>SQL Hosting</h4>
      <p>
        If you want your website to be able to store and retrieve data from a
        database, your web server should have access to a database-system that
        uses the SQL language.
      </p>
      <p>Common SQL Database Systems:</p>
      <ul>
        <li>MS SQL Server (Microsoft)</li>
        <li>Oracle</li>
        <li>MySQL (Open Source)</li>
        <li>PostgreSQL (Open Source)</li>
        <li>Access (Microsoft - Desktop)</li>
      </ul>
    </div>
  ),

  "Data Types Ref": (
    <div>
      <h4>SQL Data Types Reference (MySQL)</h4>
      <table
        border="1"
        style={{
          borderCollapse: "collapse",
          width: "100%",
          textAlign: "left",
          fontSize: "0.9em",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th>Data Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CHAR(size)</td>
            <td>
              Fixed-length string (can contain letters, numbers, and special
              characters). The size parameter specifies the column length in
              characters - can be from 0 to 255. Default is 1.
            </td>
          </tr>
          <tr>
            <td>VARCHAR(size)</td>
            <td>
              Variable-length string. The size parameter specifies the maximum
              column length in characters - can be from 0 to 65535.
            </td>
          </tr>
          <tr>
            <td>BINARY(size)</td>
            <td>Fixed-length binary strings (similar to CHAR).</td>
          </tr>
          <tr>
            <td>VARBINARY(size)</td>
            <td>Variable-length binary strings (similar to VARCHAR).</td>
          </tr>
          <tr>
            <td>TINYBLOB</td>
            <td>For BLOBs (Binary Large OBjects). Max length: 255 bytes.</td>
          </tr>
          <tr>
            <td>TEXT(size)</td>
            <td>Holds a string with a maximum length of 65,535 characters.</td>
          </tr>
          <tr>
            <td>MEDIUMTEXT</td>
            <td>
              Holds a string with a maximum length of 16,777,215 characters.
            </td>
          </tr>
          <tr>
            <td>LONGTEXT</td>
            <td>
              Holds a string with a maximum length of 4,294,967,295 characters.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
