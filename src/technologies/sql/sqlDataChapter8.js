import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "sql", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const sqlDataChapter8 = {
  "CHECK Constraint": (
    <div>
      <h4>SQL CHECK Constraint</h4>
      <p>
        The <code>CHECK</code> constraint is used to limit the value range that
        can be placed in a column.
      </p>

      <h4>Example</h4>
      <CodeBlock>
        {`CREATE TABLE Persons (
    ID int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int,
    CHECK (Age>=18)
);`}
      </CodeBlock>
    </div>
  ),

  "DEFAULT Constraint": (
    <div>
      <h4>SQL DEFAULT Constraint</h4>
      <p>
        The <code>DEFAULT</code> constraint is used to set a default value for a
        column. The default value will be added to all new records, if no other
        value is specified.
      </p>

      <h4>Example</h4>
      <CodeBlock>
        {`CREATE TABLE Persons (
    ID int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int,
    City varchar(255) DEFAULT 'Sandnes'
);`}
      </CodeBlock>
    </div>
  ),

  "CREATE INDEX": (
    <div>
      <h4>The SQL CREATE INDEX Statement</h4>
      <p>
        The <code>CREATE INDEX</code> statement is used to create indexes in
        tables. Indexes are used to retrieve data from the database more quickly
        than otherwise. The users cannot see the indexes, they are just used to
        speed up searches/queries.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`CREATE INDEX index_name
ON table_name (column1, column2, ...);`}
      </CodeBlock>
    </div>
  ),

  "Auto Increment": (
    <div>
      <h4>SQL Auto Increment Field</h4>
      <p>
        Auto-increment allows a unique number to be generated automatically when
        a new record is inserted into a table. Often this is the primary key
        field that we would like to be created automatically every time a new
        record is inserted.
      </p>

      <h4>MySQL Syntax</h4>
      <CodeBlock>
        {`CREATE TABLE Persons (
    PersonID int NOT NULL AUTO_INCREMENT,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int,
    PRIMARY KEY (PersonID)
);`}
      </CodeBlock>

      <h4>SQL Server Syntax</h4>
      <CodeBlock>
        {`CREATE TABLE Persons (
    PersonID int IDENTITY(1,1) PRIMARY KEY,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int
);`}
      </CodeBlock>
    </div>
  ),

  "SQL Dates": (
    <div>
      <h4>SQL Dates</h4>
      <p>
        The most difficult part when working with dates is to be sure that the
        format of the date you are trying to insert, matches the format of the
        date column in the database.
      </p>

      <h4>SQL Server Date Data Types:</h4>
      <ul>
        <li>
          <code>DATE</code> - format YYYY-MM-DD
        </li>
        <li>
          <code>DATETIME</code> - format: YYYY-MM-DD HH:MI:SS
        </li>
        <li>
          <code>SMALLDATETIME</code> - format: YYYY-MM-DD HH:MI:SS
        </li>
        <li>
          <code>TIMESTAMP</code> - format: a unique number
        </li>
      </ul>
    </div>
  ),

  "SQL Views": (
    <div>
      <h4>SQL CREATE VIEW Statement</h4>
      <p>
        In SQL, a view is a virtual table based on the result-set of an SQL
        statement. A view contains rows and columns, just like a real table.
      </p>

      <h4>Create View Syntax</h4>
      <CodeBlock>
        {`CREATE VIEW view_name AS
SELECT column1, column2, ...
FROM table_name
WHERE condition;`}
      </CodeBlock>

      <h4>Querying a View</h4>
      <CodeBlock>{`SELECT * FROM view_name;`}</CodeBlock>

      <h4>Drop View</h4>
      <CodeBlock>{`DROP VIEW view_name;`}</CodeBlock>
    </div>
  ),
};
