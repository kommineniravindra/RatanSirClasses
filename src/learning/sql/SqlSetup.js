export const CHAPTER_SETUP = {
  1: `
    CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, age INTEGER);
    INSERT INTO students (name, age) VALUES ('Ravi', 20);
    INSERT INTO students (name, age) VALUES ('Priya', 22);
    INSERT INTO students (name, age) VALUES ('Amit', 18);
    INSERT INTO students (name, age) VALUES ('Sita', 25);
    INSERT INTO students (name, age) VALUES ('Alice', 20);
    INSERT INTO students (name, age) VALUES ('Bob', 22);
  `,
  2: `
    CREATE TABLE Marks (id INTEGER PRIMARY KEY, name TEXT, subject TEXT, score INTEGER);
    INSERT INTO Marks (name, subject, score) VALUES ('Ravi', 'Math', 80);
    INSERT INTO Marks (name, subject, score) VALUES ('Sita', 'Science', 70);
    INSERT INTO Marks (name, subject, score) VALUES ('John', 'Math', 90);
    INSERT INTO Marks (name, subject, score) VALUES ('Priya', 'Science', 85);
    INSERT INTO Marks (name, subject, score) VALUES ('Amit', 'Math', 60);
  `,
  // Add other chapters if needed
};
