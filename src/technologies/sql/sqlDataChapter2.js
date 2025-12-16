import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "sql", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const sqlDataChapter2 = {
  "What is SQL?": (
    <div>
      <p>
        SQL stands for <b>Structured Query Language</b>.
      </p>
      <p>It is a language that provides queries to interact with a database.</p>
      <p>Using SQL, we can perform operations such as:</p>
      <ul>
        <li>Insert data</li>
        <li>Delete data</li>
        <li>Update data</li>
        <li>Merge data</li>
        <li>Control data permissions..etc</li>
      </ul>

      <h4>Real world Analogy:</h4>
      <div style={{ marginLeft: "20px" }}>
        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          <li style={{ marginBottom: "10px" }}>
            <b>Oracle Database</b> → Think of it as the TV itself where all the
            channels/data are stored.
          </li>
          <li>
            <b>SQL</b> → Like the remote control you use to interact with the
            TV.
            <ul style={{ marginTop: "10px", marginLeft: "20px" }}>
              <li>Change channels → Retrieve different data</li>
              <li>Adjust volume → Modify data</li>
              <li>Power on/off → Insert or delete data</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  ),

  "What are the Different Types of SQL Statements?": (
    <div>
      <p>SQL statements can be classified into five main types:</p>

      <div style={{ marginBottom: "15px" }}>
        <h4>1. DDL (Data Definition Language)</h4>
        <p style={{ marginLeft: "20px" }}>
          Work with database objects like tables.
          <br />
          <i>ex: CREATE, ALTER, DROP</i>
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h4>2. DML (Data Manipulation Language)</h4>
        <p style={{ marginLeft: "20px" }}>
          Works with data stored in tables.
          <br />
          <i>ex: INSERT, UPDATE, DELETE, MERGE</i>
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h4>3. DRL/DQL (Data Retrieval/Query Language)</h4>
        <p style={{ marginLeft: "20px" }}>
          Used to retrieve data from the database.
          <br />
          <i>ex: SELECT</i>
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h4>4. TCL (Transaction Control Language)</h4>
        <p style={{ marginLeft: "20px" }}>
          Manages transactions in the database.
          <br />
          <i>ex: COMMIT, ROLLBACK, SAVEPOINT</i>
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h4>5. DCL (Data Control Language)</h4>
        <p style={{ marginLeft: "20px" }}>
          Manages user access and privileges in the database.
          <br />
          <i>ex: GRANT, REVOKE</i>
        </p>
      </div>
    </div>
  ),

  "What is the meaning of CRUD?": (
    <div>
      <p>Using SQL we can perform the CRUD operations:</p>
      <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
        <li>
          <b>C → Create</b> → Add new data to the database.
        </li>
        <li>
          <b>R → Read</b> → Retrieve data from the database.
        </li>
        <li>
          <b>U → Update</b> → Modify data in the database.
        </li>
        <li>
          <b>D → Delete</b> → Remove data from the database.
        </li>
      </ul>
    </div>
  ),

  "Where can we write SQL queries?": (
    <div>
      <h4>1. Using Programming Languages</h4>
      <p>
        SQL queries can be written in many programming languages to interact
        with a database.
      </p>
      <ul>
        <li>
          <b>Java</b> → JDBC, Spring Data JPA
        </li>
        <li>
          <b>Python</b> → sqlite3
        </li>
        <li>
          <b>PHP</b> → mysqli
        </li>
        <li>
          <b>C#</b> → ADO.NET
        </li>
      </ul>

      <h4>2. Using Database Tools or Console</h4>
      <p>
        SQL queries can be executed directly on the database using console or
        via GUI tools.
      </p>
      <ul>
        <li>
          <b>Oracle</b> → SQL*Plus, SQL Developer
        </li>
        <li>
          <b>MySQL</b> → Workbench
        </li>
      </ul>
    </div>
  ),

  "Characteristics of SQL": (
    <div>
      <div style={{ marginBottom: "15px" }}>
        <h4>1. Portable Language</h4>
        <p style={{ marginLeft: "20px" }}>
          SQL code can work across multiple database systems like Oracle, MySQL,
          PostgreSQL.. with minor adjustments.
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h4>2. Declarative Language</h4>
        <p style={{ marginLeft: "20px" }}>
          You specify what you want, not how to do it.
          <br />
          <i>ex: SELECT * FROM Students.</i>
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h4>3. High-level Language</h4>
        <p style={{ marginLeft: "20px" }}>
          SQL is considered high-level because you can write commands in almost
          plain English, like SELECT, INSERT, UPDATE, and DELETE.
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h4>4. Interactive Language</h4>
        <p style={{ marginLeft: "20px" }}>
          SQL lets you talk directly to the database and get results
          immediately.
          <br />
          SQL is like asking a question to a smart assistant (like Alexa) and
          getting an answer immediately.
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h4>5. Secure</h4>
        <p style={{ marginLeft: "20px" }}>
          SQL provides features to control user access and privileges via DCL
          commands.
        </p>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h4>6. Efficient for Large Data</h4>
        <p style={{ marginLeft: "20px" }}>
          SQL is optimized to handle large volumes of structured data
          efficiently.
        </p>
      </div>
    </div>
  ),

  "What is table?": (
    <div>
      <p>
        A table is a database object that stores data in a{" "}
        <b>structured format</b> using rows and columns.
      </p>
      <p>
        Each row represents a single entry.
        <br />
        Each column represents a specific type of data.
      </p>

      <h4>Terminology:</h4>
      <ul>
        <li>Column = attribute / field</li>
        <li>Row = record / tuple</li>
        <li>Table = Relation / Entity</li>
      </ul>

      <h4>Example:</h4>
      <ul>
        <li>A single employee = 1 row of data</li>
        <li>10 employees = 10 rows of data</li>
        <li>Displaying names = column data</li>
      </ul>
      <p>The intersection of a row and column is called a cell.</p>

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
            <th>Employee_ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>101</td>
            <td>Alice</td>
            <td>25</td>
            <td>HR</td>
          </tr>
          <tr>
            <td>102</td>
            <td>Bob</td>
            <td>30</td>
            <td>IT</td>
          </tr>
          <tr>
            <td>103</td>
            <td>Carol</td>
            <td>28</td>
            <td>Finance</td>
          </tr>
          <tr>
            <td>104</td>
            <td>David</td>
            <td>35</td>
            <td>Marketing</td>
          </tr>
          <tr>
            <td>105</td>
            <td>Eva</td>
            <td>32</td>
            <td>IT</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
