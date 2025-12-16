const sqlSnippets = [
  // --- DDL (Data Definition Language) ---
  {
    caption: "createTable",
    snippet:
      "CREATE TABLE ${1:TableName} (\n    ${2:id} INT PRIMARY KEY,\n    ${3:column_name} ${4:VARCHAR(255)}\n);",
    type: "snippet",
  },
  {
    caption: "dropTable",
    snippet: "DROP TABLE IF EXISTS ${1:TableName};",
    type: "snippet",
  },
  {
    caption: "truncateTable",
    snippet: "TRUNCATE TABLE ${1:TableName};",
    type: "snippet",
  },
  {
    caption: "alterTableAdd",
    snippet: "ALTER TABLE ${1:TableName}\nADD ${2:column_name} ${3:datatype};",
    type: "snippet",
  },
  {
    caption: "alterTableDrop",
    snippet: "ALTER TABLE ${1:TableName}\nDROP COLUMN ${2:column_name};",
    type: "snippet",
  },
  {
    caption: "alterTableModify",
    snippet:
      "ALTER TABLE ${1:TableName}\nMODIFY COLUMN ${2:column_name} ${3:new_datatype};",
    type: "snippet",
  },
  {
    caption: "renameTable",
    snippet: "ALTER TABLE ${1:OldName} RENAME TO ${2:NewName};",
    type: "snippet",
  },
  {
    caption: "createIndex",
    snippet:
      "CREATE INDEX ${1:idx_name}\nON ${2:TableName} (${3:column_name});",
    type: "snippet",
  },
  {
    caption: "createUniqueIndex",
    snippet:
      "CREATE UNIQUE INDEX ${1:idx_name}\nON ${2:TableName} (${3:column_name});",
    type: "snippet",
  },
  {
    caption: "dropIndex",
    snippet: "DROP INDEX ${1:idx_name} ON ${2:TableName};",
    type: "snippet",
  },
  {
    caption: "createView",
    snippet:
      "CREATE VIEW ${1:view_name} AS\nSELECT ${2:column1}, ${3:column2}\nFROM ${4:TableName}\nWHERE ${5:condition};",
    type: "snippet",
  },
  {
    caption: "dropView",
    snippet: "DROP VIEW IF EXISTS ${1:view_name};",
    type: "snippet",
  },

  // --- DML (Data Manipulation Language) ---
  {
    caption: "insert",
    snippet: "INSERT INTO ${1:TableName}\nVALUES (${2:value1}, ${3:value2});",
    type: "snippet",
  },
  {
    caption: "insertMultiple",
    snippet:
      "INSERT INTO ${1:TableName}\nVALUES \n(${2:v1_1}, ${3:v1_2}),\n(${4:v2_1}, ${5:v2_2});",
    type: "snippet",
  },
  {
    caption: "update",
    snippet:
      "UPDATE ${1:TableName}\nSET ${2:column1} = ${3:value1}\nWHERE ${4:condition};",
    type: "snippet",
  },
  {
    caption: "delete",
    snippet: "DELETE FROM ${1:TableName}\nWHERE ${2:condition};",
    type: "snippet",
  },

  // --- DQL (Data Query Language) ---
  {
    caption: "select",
    snippet: "SELECT * FROM ${1:TableName};",
    type: "snippet",
  },
  {
    caption: "selectWhere",
    snippet: "SELECT ${1:*} FROM ${2:TableName}\nWHERE ${3:condition};",
    type: "snippet",
  },
  {
    caption: "selectDistinct",
    snippet: "SELECT DISTINCT ${1:column} FROM ${2:TableName};",
    type: "snippet",
  },
  {
    caption: "selectLimit",
    snippet: "SELECT * FROM ${1:TableName}\nLIMIT ${2:10};",
    type: "snippet",
  },
  {
    caption: "selectLike",
    snippet:
      "SELECT * FROM ${1:TableName}\nWHERE ${2:column} LIKE '${3:%pattern%}';",
    type: "snippet",
  },
  {
    caption: "selectIn",
    snippet:
      "SELECT * FROM ${1:TableName}\nWHERE ${2:column} IN (${3:value1}, ${4:value2});",
    type: "snippet",
  },
  {
    caption: "selectBetween",
    snippet:
      "SELECT * FROM ${1:TableName}\nWHERE ${2:column} BETWEEN ${3:val1} AND ${4:val2};",
    type: "snippet",
  },
  {
    caption: "selectOrderBy",
    snippet:
      "SELECT * FROM ${1:TableName}\nORDER BY ${2:column} ${3:ASC|DESC};",
    type: "snippet",
  },
  {
    caption: "selectGroupBy",
    snippet:
      "SELECT ${1:column}, COUNT(*)\nFROM ${2:TableName}\nGROUP BY ${1:column};",
    type: "snippet",
  },
  {
    caption: "selectHaving",
    snippet:
      "SELECT ${1:column}, COUNT(*)\nFROM ${2:TableName}\nGROUP BY ${1:column}\nHAVING COUNT(*) > ${3:1};",
    type: "snippet",
  },

  // --- Joins ---
  {
    caption: "joinInner",
    snippet:
      "SELECT ${1:t1.col}, ${2:t2.col}\nFROM ${3:Table1} AS t1\nINNER JOIN ${4:Table2} AS t2 ON t1.${5:id} = t2.${5:id};",
    type: "snippet",
  },
  {
    caption: "joinLeft",
    snippet:
      "SELECT ${1:t1.col}, ${2:t2.col}\nFROM ${3:Table1} AS t1\nLEFT JOIN ${4:Table2} AS t2 ON t1.${5:id} = t2.${5:id};",
    type: "snippet",
  },
  {
    caption: "joinRight",
    snippet:
      "SELECT ${1:t1.col}, ${2:t2.col}\nFROM ${3:Table1} AS t1\nRIGHT JOIN ${4:Table2} AS t2 ON t1.${5:id} = t2.${5:id};",
    type: "snippet",
  },
  {
    caption: "joinFull",
    snippet:
      "SELECT ${1:t1.col}, ${2:t2.col}\nFROM ${3:Table1} AS t1\nFULL OUTER JOIN ${4:Table2} AS t2 ON t1.${5:id} = t2.${5:id};",
    type: "snippet",
  },
  {
    caption: "union",
    snippet:
      "SELECT ${1:column} FROM ${2:Table1}\nUNION\nSELECT ${1:column} FROM ${3:Table2};",
    type: "snippet",
  },
  {
    caption: "unionAll",
    snippet:
      "SELECT ${1:column} FROM ${2:Table1}\nUNION ALL\nSELECT ${1:column} FROM ${3:Table2};",
    type: "snippet",
  },

  // --- Constraints ---
  {
    caption: "primaryKey",
    snippet: "PRIMARY KEY (${1:column_name})",
    type: "snippet",
  },
  {
    caption: "foreignKey",
    snippet:
      "FOREIGN KEY (${1:column_name}) REFERENCES ${2:OtherTable}(${3:id})",
    type: "snippet",
  },
  {
    caption: "notNull",
    snippet: "NOT NULL",
    type: "snippet",
  },
  {
    caption: "unique",
    snippet: "UNIQUE",
    type: "snippet",
  },
  {
    caption: "check",
    snippet: "CHECK (${1:column} > ${2:0})",
    type: "snippet",
  },
  {
    caption: "default",
    snippet: "DEFAULT ${1:value}",
    type: "snippet",
  },

  // --- Transactions ---
  {
    caption: "transaction",
    snippet: "BEGIN TRANSACTION;\n${1}\nCOMMIT;",
    type: "snippet",
  },
  {
    caption: "rollback",
    snippet: "ROLLBACK;",
    type: "snippet",
  },

  // --- Functions & Logic ---
  {
    caption: "count",
    snippet: "COUNT(*)",
    type: "snippet",
  },
  {
    caption: "sum",
    snippet: "SUM(${1:column})",
    type: "snippet",
  },
  {
    caption: "avg",
    snippet: "AVG(${1:column})",
    type: "snippet",
  },
  {
    caption: "min",
    snippet: "MIN(${1:column})",
    type: "snippet",
  },
  {
    caption: "max",
    snippet: "MAX(${1:column})",
    type: "snippet",
  },
  {
    caption: "caseWhen",
    snippet:
      "CASE\n    WHEN ${1:condition} THEN ${2:result1}\n    ELSE ${3:result2}\nEND",
    type: "snippet",
  },
  {
    caption: "coalesce",
    snippet: "COALESCE(${1:column}, ${2:default_value})",
    type: "snippet",
  },
  {
    caption: "cast",
    snippet: "CAST(${1:column} AS ${2:datatype})",
    type: "snippet",
  },
  {
    caption: "concat",
    snippet: "CONCAT(${1:str1}, ${2:str2})",
    type: "snippet",
  },
  // --- Example Schemas ---

  // 1. Employees
  {
    caption: "createTableEmployees",
    snippet:
      "CREATE TABLE Employees (\n    employee_id INT PRIMARY KEY,\n    first_name VARCHAR(50),\n    last_name VARCHAR(50),\n    email VARCHAR(100),\n    department_id INT,\n    hire_date DATE,\n    salary DECIMAL(10, 2)\n);",
    type: "snippet",
  },
  {
    caption: "insertEmployees",
    snippet:
      "INSERT INTO Employees (employee_id, first_name, last_name, email, department_id, hire_date, salary) VALUES\n(1, 'John', 'Doe', 'john.doe@example.com', 1, '2023-01-15', 60000.00),\n(2, 'Jane', 'Smith', 'jane.smith@example.com', 2, '2023-02-20', 75000.00),\n(3, 'Alice', 'Johnson', 'alice.johnson@example.com', 1, '2023-03-10', 55000.00),\n(4, 'Bob', 'Brown', 'bob.brown@example.com', 3, '2023-04-05', 80000.00),\n(5, 'Charlie', 'Davis', 'charlie.davis@example.com', 2, '2023-05-12', 72000.00),\n(6, 'Eva', 'Wilson', 'eva.wilson@example.com', 4, '2023-06-18', 65000.00),\n(7, 'Frank', 'Miller', 'frank.miller@example.com', 3, '2023-07-22', 82000.00),\n(8, 'Grace', 'Lee', 'grace.lee@example.com', 1, '2023-08-30', 58000.00),\n(9, 'Henry', 'Taylor', 'henry.taylor@example.com', 4, '2023-09-14', 67000.00),\n(10, 'Ivy', 'Anderson', 'ivy.anderson@example.com', 2, '2023-10-01', 76000.00);",
    type: "snippet",
  },

  // 2. Departments
  {
    caption: "createTableDepartments",
    snippet:
      "CREATE TABLE Departments (\n    department_id INT PRIMARY KEY,\n    department_name VARCHAR(100),\n    location VARCHAR(100)\n);",
    type: "snippet",
  },
  {
    caption: "insertDepartments",
    snippet:
      "INSERT INTO Departments (department_id, department_name, location) VALUES\n(1, 'HR', 'New York'),\n(2, 'Engineering', 'San Francisco'),\n(3, 'Finance', 'Chicago'),\n(4, 'Marketing', 'Los Angeles'),\n(5, 'Sales', 'Miami'),\n(6, 'Support', 'Seattle'),\n(7, 'Legal', 'Boston'),\n(8, 'R&D', 'Austin'),\n(9, 'Operations', 'Denver'),\n(10, 'Logistics', 'Houston');",
    type: "snippet",
  },

  // 3. Projects
  {
    caption: "createTableProjects",
    snippet:
      "CREATE TABLE Projects (\n    project_id INT PRIMARY KEY,\n    name VARCHAR(100),\n    start_date DATE,\n    end_date DATE,\n    budget DECIMAL(15, 2)\n);",
    type: "snippet",
  },
  {
    caption: "insertProjects",
    snippet:
      "INSERT INTO Projects (project_id, name, start_date, end_date, budget) VALUES\n(1, 'Project Alpha', '2023-01-01', '2023-06-30', 50000.00),\n(2, 'Project Beta', '2023-02-15', '2023-08-15', 75000.00),\n(3, 'Project Gamma', '2023-03-01', '2023-12-31', 120000.00),\n(4, 'Project Delta', '2023-04-10', '2023-10-10', 60000.00),\n(5, 'Project Epsilon', '2023-05-01', '2023-11-30', 90000.00),\n(6, 'Project Zeta', '2023-06-01', '2023-12-15', 45000.00),\n(7, 'Project Eta', '2023-07-01', '2024-01-31', 80000.00),\n(8, 'Project Theta', '2023-08-01', '2024-02-28', 55000.00),\n(9, 'Project Iota', '2023-09-01', '2024-03-15', 70000.00),\n(10, 'Project Kappa', '2023-10-01', '2024-04-30', 65000.00);",
    type: "snippet",
  },

  // 4. Customers
  {
    caption: "createTableCustomers",
    snippet:
      "CREATE TABLE Customers (\n    customer_id INT PRIMARY KEY,\n    name VARCHAR(100),\n    email VARCHAR(100),\n    phone VARCHAR(20),\n    city VARCHAR(50)\n);",
    type: "snippet",
  },
  {
    caption: "insertCustomers",
    snippet:
      "INSERT INTO Customers (customer_id, name, email, phone, city) VALUES\n(1, 'John Smith', 'john@example.com', '555-0101', 'New York'),\n(2, 'Jane Doe', 'jane@example.com', '555-0102', 'Los Angeles'),\n(3, 'Michael Johnson', 'michael@example.com', '555-0103', 'Chicago'),\n(4, 'Emily Davis', 'emily@example.com', '555-0104', 'Houston'),\n(5, 'David Wilson', 'david@example.com', '555-0105', 'Phoenix'),\n(6, 'Sarah Brown', 'sarah@example.com', '555-0106', 'Philadelphia'),\n(7, 'James Miller', 'james@example.com', '555-0107', 'San Antonio'),\n(8, 'Jessica Taylor', 'jessica@example.com', '555-0108', 'San Diego'),\n(9, 'Robert Anderson', 'robert@example.com', '555-0109', 'Dallas'),\n(10, 'Laura Thomas', 'laura@example.com', '555-0110', 'San Jose');",
    type: "snippet",
  },

  // 5. Orders
  {
    caption: "createTableOrders",
    snippet:
      "CREATE TABLE Orders (\n    order_id INT PRIMARY KEY,\n    customer_id INT,\n    order_date DATE,\n    total_amount DECIMAL(10, 2),\n    status VARCHAR(20)\n);",
    type: "snippet",
  },
  {
    caption: "insertOrders",
    snippet:
      "INSERT INTO Orders (order_id, customer_id, order_date, total_amount, status) VALUES\n(1, 1, '2023-11-01', 150.00, 'Shipped'),\n(2, 2, '2023-11-02', 200.50, 'Pending'),\n(3, 3, '2023-11-03', 99.99, 'Delivered'),\n(4, 4, '2023-11-04', 350.00, 'Shipped'),\n(5, 5, '2023-11-05', 45.00, 'Cancelled'),\n(6, 6, '2023-11-06', 120.00, 'Processing'),\n(7, 7, '2023-11-07', 500.00, 'Delivered'),\n(8, 8, '2023-11-08', 75.25, 'Shipped'),\n(9, 9, '2023-11-09', 60.00, 'Pending'),\n(10, 10, '2023-11-10', 210.00, 'Delivered');",
    type: "snippet",
  },

  // 6. Products
  {
    caption: "createTableProducts",
    snippet:
      "CREATE TABLE Products (\n    product_id INT PRIMARY KEY,\n    name VARCHAR(100),\n    category VARCHAR(50),\n    price DECIMAL(10, 2),\n    stock INT\n);",
    type: "snippet",
  },
  {
    caption: "insertProducts",
    snippet:
      "INSERT INTO Products (product_id, name, category, price, stock) VALUES\n(1, 'Laptop', 'Electronics', 1200.00, 50),\n(2, 'Smartphone', 'Electronics', 800.00, 100),\n(3, 'Desk Chair', 'Furniture', 150.00, 200),\n(4, 'Table', 'Furniture', 300.00, 75),\n(5, 'Headphones', 'Electronics', 100.00, 150),\n(6, 'Monitor', 'Electronics', 250.00, 80),\n(7, 'Keyboard', 'Electronics', 50.00, 300),\n(8, 'Mouse', 'Electronics', 25.00, 400),\n(9, 'Bookshelf', 'Furniture', 120.00, 60),\n(10, 'Lamp', 'Furniture', 45.00, 120);",
    type: "snippet",
  },

  // 7. Students
  {
    caption: "createTableStudents",
    snippet:
      "CREATE TABLE Students (\n    student_id INT PRIMARY KEY,\n    name VARCHAR(100),\n    dob DATE,\n    major VARCHAR(50),\n    gpa DECIMAL(3, 2)\n);",
    type: "snippet",
  },
  {
    caption: "insertStudents",
    snippet:
      "INSERT INTO Students (student_id, name, dob, major, gpa) VALUES\n(1, 'Alice Williams', '2001-05-15', 'Computer Science', 3.8),\n(2, 'Bob Johnson', '2002-03-22', 'Mathematics', 3.5),\n(3, 'Charlie Brown', '2001-11-10', 'Physics', 3.9),\n(4, 'Diana Davis', '2003-01-05', 'Biology', 3.2),\n(5, 'Ethan Miller', '2002-07-18', 'Chemistry', 3.6),\n(6, 'Fiona Wilson', '2001-09-30', 'History', 3.4),\n(7, 'George Taylor', '2002-12-12', 'Engineering', 3.7),\n(8, 'Hannah Anderson', '2003-04-25', 'Psychology', 3.9),\n(9, 'Ian Thomas', '2001-06-14', 'Economics', 3.3),\n(10, 'Julia Martinez', '2002-08-08', 'Art', 3.8);",
    type: "snippet",
  },

  // 8. Courses
  {
    caption: "createTableCourses",
    snippet:
      "CREATE TABLE Courses (\n    course_id INT PRIMARY KEY,\n    title VARCHAR(100),\n    credits INT,\n    department VARCHAR(50)\n);",
    type: "snippet",
  },
  {
    caption: "insertCourses",
    snippet:
      "INSERT INTO Courses (course_id, title, credits, department) VALUES\n(1, 'Intro to CS', 4, 'Computer Science'),\n(2, 'Calculus I', 4, 'Mathematics'),\n(3, 'Mechanics', 3, 'Physics'),\n(4, 'Organic Chemistry', 4, 'Chemistry'),\n(5, 'World History', 3, 'History'),\n(6, 'Microeconomics', 3, 'Economics'),\n(7, 'Psychology 101', 3, 'Psychology'),\n(8, 'Art History', 3, 'Art'),\n(9, 'Data Structures', 4, 'Computer Science'),\n(10, 'Linear Algebra', 3, 'Mathematics');",
    type: "snippet",
  },

  // 9. Inventory
  {
    caption: "createTableInventory",
    snippet:
      "CREATE TABLE Inventory (\n    item_id INT PRIMARY KEY,\n    item_name VARCHAR(100),\n    warehouse VARCHAR(50),\n    quantity INT\n);",
    type: "snippet",
  },
  {
    caption: "insertInventory",
    snippet:
      "INSERT INTO Inventory (item_id, item_name, warehouse, quantity) VALUES\n(1, 'Widget A', 'North', 150),\n(2, 'Widget B', 'South', 200),\n(3, 'Gadget X', 'East', 100),\n(4, 'Gadget Y', 'West', 300),\n(5, 'Tool Z', 'North', 50),\n(6, 'Part 1', 'South', 500),\n(7, 'Part 2', 'East', 450),\n(8, 'Material M', 'West', 120),\n(9, 'Material N', 'North', 80),\n(10, 'Component C', 'South', 60);",
    type: "snippet",
  },

  // 10. Salaries
  {
    caption: "createTableSalaries",
    snippet:
      "CREATE TABLE Salaries (\n    payment_id INT PRIMARY KEY,\n    employee_id INT,\n    amount DECIMAL(10, 2),\n    payment_date DATE\n);",
    type: "snippet",
  },
  {
    caption: "insertSalaries",
    snippet:
      "INSERT INTO Salaries (payment_id, employee_id, amount, payment_date) VALUES\n(1, 1, 5000.00, '2023-11-30'),\n(2, 2, 6250.00, '2023-11-30'),\n(3, 3, 4583.33, '2023-11-30'),\n(4, 4, 6666.67, '2023-11-30'),\n(5, 5, 6000.00, '2023-11-30'),\n(6, 6, 5416.67, '2023-11-30'),\n(7, 7, 6833.33, '2023-11-30'),\n(8, 8, 4833.33, '2023-11-30'),\n(9, 9, 5583.33, '2023-11-30'),\n(10, 10, 6333.33, '2023-11-30');",
    type: "snippet",
  },
];

export default sqlSnippets;
