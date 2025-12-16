import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "sql", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const sqlDataChapter7 = {
  "CREATE Database": (
    <div>
      <h4>The SQL CREATE DATABASE Statement</h4>
      <p>
        The <code>CREATE DATABASE</code> statement is used to create a new SQL
        database.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>{`CREATE DATABASE databasename;`}</CodeBlock>

      <h4>Example</h4>
      <CodeBlock>{`CREATE DATABASE testDB;`}</CodeBlock>
    </div>
  ),

  "DROP Database": (
    <div>
      <h4>The SQL DROP DATABASE Statement</h4>
      <p>
        The <code>DROP DATABASE</code> statement is used to drop an existing SQL
        database.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>{`DROP DATABASE databasename;`}</CodeBlock>

      <p style={{ color: "red" }}>
        <strong>Warning:</strong> All data in the database will be lost!
      </p>
    </div>
  ),

  "CREATE Table": (
    <div>
      <h4>The SQL CREATE TABLE Statement</h4>
      <p>
        The <code>CREATE TABLE</code> statement is used to create a new table in
        a database. When creating a table, you must specify the column names and
        the data types each column will hold.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>
        {`CREATE TABLE table_name (
    column1 datatype,
    column2 datatype,
    column3 datatype,
    ....
);`}
      </CodeBlock>

      <h4>Table Creation Workflow</h4>
      <p>Follow these steps to design and create a table effectively:</p>
      <div className="mermaid">
        {`graph TD
          A[Start: Identify Entity] --> B[List Attributes/Columns]
          B --> C[Choose Data Types]
          C --> D[Define Constraints]
          D --> E[Write CREATE TABLE Statement]
          E --> F[Execute Query]
          F --> G{Success?}
          G -- Yes --> H[Table Created]
          G -- No --> I[Fix Errors & Retry]
          I --> E
          
          style A fill:#f9f,stroke:#333,stroke-width:2px
          style H fill:#9f9,stroke:#333,stroke-width:2px
          style F fill:#ff9,stroke:#333,stroke-width:2px`}
      </div>

      <h4>Example 1: Basic Employee Table</h4>
      <p>Creating a simple table for Employees with basic columns.</p>
      <CodeBlock>
        {`CREATE TABLE Employees (
    EmpID int,
    FirstName varchar(50),
    LastName varchar(50),
    BirthDate date,
    Department varchar(50)
);`}
      </CodeBlock>

      <h4>Example 2: Table with Primary Key</h4>
      <p>
        Most tables should have a <strong>Primary Key</strong> to uniquely
        identify each row. Here we create a 'Students' table where 'StudentID'
        is the unique identifier.
      </p>
      <CodeBlock>
        {`CREATE TABLE Students (
    StudentID int PRIMARY KEY,
    FullName varchar(100) NOT NULL,
    Email varchar(255) UNIQUE,
    Age int,
    EnrollmentDate datetime
);`}
      </CodeBlock>

      <h4>Example 3: Table with Foreign Key (Relational)</h4>
      <p>
        Here we creates an 'Orders' table that links to the 'Students' table
        using a <strong>Foreign Key</strong>. This ensures valid data
        relationships.
      </p>
      <CodeBlock>
        {`CREATE TABLE Orders (
    OrderID int PRIMARY KEY,
    OrderDate date,
    Amount decimal(10, 2),
    StudentID int,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);`}
      </CodeBlock>

      <h4>Example 4: Create Table From Another Table</h4>
      <p>
        You can also create a new table by copying the structure and data from
        an existing table using <code>CREATE TABLE AS SELECT</code> (CTAS).
      </p>
      <CodeBlock>
        {`-- Create a backup of the 'Students' table
CREATE TABLE Students_Backup AS
SELECT * FROM Students;

-- Create a table with only specific columns and data
CREATE TABLE ActiveStudents AS
SELECT StudentID, FullName
FROM Students
WHERE Age > 18;`}
      </CodeBlock>
    </div>
  ),

  "DROP Table": (
    <div>
      <h4>The SQL DROP TABLE Statement</h4>
      <p>
        The <code>DROP TABLE</code> statement is used to drop an existing table
        in a database.
      </p>

      <h4>Syntax</h4>
      <CodeBlock>{`DROP TABLE table_name;`}</CodeBlock>

      <h4>TRUNCATE TABLE</h4>
      <p>
        The <code>TRUNCATE TABLE</code> statement is used to delete the data
        inside a table, but not the table itself.
      </p>
      <CodeBlock>{`TRUNCATE TABLE table_name;`}</CodeBlock>
    </div>
  ),

  "ALTER Table": (
    <div>
      <h4>The SQL ALTER TABLE Statement</h4>
      <p>
        The <code>ALTER TABLE</code> statement is used to add, delete, or modify
        columns in an existing table.
      </p>

      <h4>Add Column</h4>
      <CodeBlock>
        {`ALTER TABLE table_name
ADD column_name datatype;`}
      </CodeBlock>

      <h4>Drop Column</h4>
      <CodeBlock>
        {`ALTER TABLE table_name
DROP COLUMN column_name;`}
      </CodeBlock>

      <h4>Modify Column (SQL Server)</h4>
      <CodeBlock>
        {`ALTER TABLE table_name
ALTER COLUMN column_name datatype;`}
      </CodeBlock>
    </div>
  ),

  "SQL Constraints": (
    <div>
      <h4>SQL Constraints</h4>
      <p>SQL constraints are used to specify rules for the data in a table.</p>
      <p>
        Constraints regarding a column are enforced when inserting data into a
        table or when updating data in the column.
      </p>

      <h4>Common Constraints:</h4>
      <ul>
        <li>
          <strong>NOT NULL</strong> - Ensures that a column cannot have a NULL
          value
        </li>
        <li>
          <strong>UNIQUE</strong> - Ensures that all values in a column are
          different
        </li>
        <li>
          <strong>PRIMARY KEY</strong> - A combination of a NOT NULL and UNIQUE.
          Uniquely identifies each row in a table
        </li>
        <li>
          <strong>FOREIGN KEY</strong> - Prevents actions that would destroy
          links between tables
        </li>
        <li>
          <strong>CHECK</strong> - Ensures that the values in a column satisfies
          a specific condition
        </li>
        <li>
          <strong>DEFAULT</strong> - Sets a default value for a column if no
          value is specified
        </li>
        <li>
          <strong>CREATE INDEX</strong> - Used to create and retrieve data from
          the database very quickly
        </li>
      </ul>
    </div>
  ),

  "NOT NULL Constraint": (
    <div>
      <h4>SQL NOT NULL Constraint</h4>
      <p>
        By default, a column can hold NULL values. The NOT NULL constraint
        enforces a column to NOT accept NULL values.
      </p>
      <CodeBlock>
        {`CREATE TABLE Persons (
    ID int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255) NOT NULL,
    Age int
);`}
      </CodeBlock>
    </div>
  ),

  "UNIQUE Constraint": (
    <div>
      <h4>SQL UNIQUE Constraint</h4>
      <p>
        The UNIQUE constraint ensures that all values in a column are different.
      </p>
      <CodeBlock>
        {`CREATE TABLE Persons (
    ID int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int,
    UNIQUE (ID)
);`}
      </CodeBlock>
    </div>
  ),

  "PRIMARY KEY Constraint": (
    <div>
      <h4>SQL PRIMARY KEY Constraint</h4>
      <p>
        The PRIMARY KEY constraint uniquely identifies each record in a table.
        Primary keys must contain UNIQUE values, and cannot contain NULL values.
      </p>
      <CodeBlock>
        {`CREATE TABLE Persons (
    ID int NOT NULL,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Age int,
    PRIMARY KEY (ID)
);`}
      </CodeBlock>
    </div>
  ),

  "FOREIGN KEY Constraint": (
    <div>
      <h4>SQL FOREIGN KEY Constraint</h4>
      <p>
        The FOREIGN KEY constraint is used to prevent actions that would destroy
        links between tables.
      </p>
      <CodeBlock>
        {`CREATE TABLE Orders (
    OrderID int NOT NULL,
    OrderNumber int NOT NULL,
    PersonID int,
    PRIMARY KEY (OrderID),
    FOREIGN KEY (PersonID) REFERENCES Persons(PersonID)
);`}
      </CodeBlock>
    </div>
  ),
};
