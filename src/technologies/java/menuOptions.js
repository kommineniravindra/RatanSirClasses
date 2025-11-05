// // src/technologies/java/javaMenuData.js

// export const javaMenuData = [
//   {
//     name: 'Introduction to Java',
//     subItems: [
//       { name: 'Importance of Java', url: 'java-importance', icon: 'images/java.png' },
//       { name: 'Applications of Java', url: 'java-applications', icon: 'images/java.png' },
//       { name: 'History of Java', url: 'java-history', icon: 'images/java.png' },
//       { name: 'Java Versions', url: 'java-versions', icon: 'images/java.png' },
//       { name: 'Java Editors', url: 'java-editors', icon: 'images/java.png' },
//       { name: 'First Java Application', url: 'java-first-app', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Basics',
//     subItems: [
//       { name: 'Variables', url: 'java-variables', icon: 'images/java.png' },
//       { name: 'Data Types', url: 'java-data-types', icon: 'images/java.png' },
//       { name: 'Operators', url: 'java-operators', icon: 'images/java.png' },
//       { name: 'Keywords', url: 'java-keywords', icon: 'images/java.png' },
//       { name: 'Input/Output', url: 'java-io', icon: 'images/java.png' },
//       { name: 'Comments', url: 'java-comments', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Control Flow',
//     subItems: [
//       { name: 'If-Else', url: 'java-if-else', icon: 'images/java.png' },
//       { name: 'Switch', url: 'java-switch', icon: 'images/java.png' },
//       { name: 'Loops', url: 'java-loops', icon: 'images/java.png' },
//       { name: 'Break & Continue', url: 'java-break-continue', icon: 'images/java.png' },
//       { name: 'Nested Loops', url: 'java-nested-loops', icon: 'images/java.png' },
//       { name: 'Return Statement', url: 'java-return', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Arrays & Strings',
//     subItems: [
//       { name: 'One Dimensional Arrays', url: 'java-1d-arrays', icon: 'images/java.png' },
//       { name: 'Two Dimensional Arrays', url: 'java-2d-arrays', icon: 'images/java.png' },
//       { name: 'Array Operations', url: 'java-array-operations', icon: 'images/java.png' },
//       { name: 'Strings', url: 'java-strings', icon: 'images/java.png' },
//       { name: 'String Methods', url: 'java-string-methods', icon: 'images/java.png' },
//       { name: 'StringBuilder & StringBuffer', url: 'java-stringbuilder', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Methods',
//     subItems: [
//       { name: 'Method Definition', url: 'java-methods', icon: 'images/java.png' },
//       { name: 'Method Parameters', url: 'java-method-params', icon: 'images/java.png' },
//       { name: 'Method Overloading', url: 'java-method-overloading', icon: 'images/java.png' },
//       { name: 'Return Types', url: 'java-method-return', icon: 'images/java.png' },
//       { name: 'Recursive Methods', url: 'java-recursion', icon: 'images/java.png' },
//       { name: 'Variable Scope', url: 'java-variable-scope', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Object-Oriented Programming',
//     subItems: [
//       { name: 'Classes & Objects', url: 'java-classes-objects', icon: 'images/java.png' },
//       { name: 'Constructors', url: 'java-constructors', icon: 'images/java.png' },
//       { name: 'Inheritance', url: 'java-inheritance', icon: 'images/java.png' },
//       { name: 'Polymorphism', url: 'java-polymorphism', icon: 'images/java.png' },
//       { name: 'Abstraction', url: 'java-abstraction', icon: 'images/java.png' },
//       { name: 'Encapsulation', url: 'java-encapsulation', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Interfaces & Packages',
//     subItems: [
//       { name: 'Interfaces', url: 'java-interfaces', icon: 'images/java.png' },
//       { name: 'Abstract Classes', url: 'java-abstract-classes', icon: 'images/java.png' },
//       { name: 'Packages', url: 'java-packages', icon: 'images/java.png' },
//       { name: 'Access Modifiers', url: 'java-access-modifiers', icon: 'images/java.png' },
//       { name: 'Static Members', url: 'java-static', icon: 'images/java.png' },
//       { name: 'Final Keyword', url: 'java-final', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Exception Handling',
//     subItems: [
//       { name: 'Try-Catch', url: 'java-try-catch', icon: 'images/java.png' },
//       { name: 'Multiple Catch', url: 'java-multiple-catch', icon: 'images/java.png' },
//       { name: 'Finally Block', url: 'java-finally', icon: 'images/java.png' },
//       { name: 'Throw & Throws', url: 'java-throw-throws', icon: 'images/java.png' },
//       { name: 'Custom Exceptions', url: 'java-custom-exceptions', icon: 'images/java.png' },
//       { name: 'Exception Hierarchy', url: 'java-exception-hierarchy', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Collections Framework',
//     subItems: [
//       { name: 'List Interface', url: 'java-list', icon: 'images/java.png' },
//       { name: 'ArrayList', url: 'java-arraylist', icon: 'images/java.png' },
//       { name: 'LinkedList', url: 'java-linkedlist', icon: 'images/java.png' },
//       { name: 'Set Interface', url: 'java-set', icon: 'images/java.png' },
//       { name: 'HashSet', url: 'java-hashset', icon: 'images/java.png' },
//       { name: 'Map Interface', url: 'java-map', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Multithreading',
//     subItems: [
//       { name: 'Thread Class', url: 'java-thread', icon: 'images/java.png' },
//       { name: 'Runnable Interface', url: 'java-runnable', icon: 'images/java.png' },
//       { name: 'Thread Life Cycle', url: 'java-thread-lifecycle', icon: 'images/java.png' },
//       { name: 'Thread Priorities', url: 'java-thread-priority', icon: 'images/java.png' },
//       { name: 'Synchronization', url: 'java-synchronization', icon: 'images/java.png' },
//       { name: 'Inter-thread Communication', url: 'java-interthread', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Java I/O',
//     subItems: [
//       { name: 'File Handling', url: 'java-file-handling', icon: 'images/java.png' },
//       { name: 'BufferedReader & BufferedWriter', url: 'java-buffered', icon: 'images/java.png' },
//       { name: 'PrintWriter', url: 'java-printwriter', icon: 'images/java.png' },
//       { name: 'Object Streams', url: 'java-object-streams', icon: 'images/java.png' },
//       { name: 'Serialization', url: 'java-serialization', icon: 'images/java.png' },
//       { name: 'Deserialization', url: 'java-deserialization', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Java Networking',
//     subItems: [
//       { name: 'Socket Programming', url: 'java-socket', icon: 'images/java.png' },
//       { name: 'ServerSocket', url: 'java-serversocket', icon: 'images/java.png' },
//       { name: 'Client-Server Example', url: 'java-client-server', icon: 'images/java.png' },
//       { name: 'Datagram Sockets', url: 'java-datagram', icon: 'images/java.png' },
//       { name: 'URL Class', url: 'java-url', icon: 'images/java.png' },
//       { name: 'URLConnection', url: 'java-urlconnection', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Java JDBC',
//     subItems: [
//       { name: 'Introduction to JDBC', url: 'java-jdbc', icon: 'images/java.png' },
//       { name: 'JDBC Drivers', url: 'java-jdbc-drivers', icon: 'images/java.png' },
//       { name: 'Database Connection', url: 'java-db-connection', icon: 'images/java.png' },
//       { name: 'Executing Queries', url: 'java-execute-queries', icon: 'images/java.png' },
//       { name: 'ResultSet', url: 'java-resultset', icon: 'images/java.png' },
//       { name: 'PreparedStatement', url: 'java-preparedstatement', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Java Generics',
//     subItems: [
//       { name: 'Generic Classes', url: 'java-generic-classes', icon: 'images/java.png' },
//       { name: 'Generic Methods', url: 'java-generic-methods', icon: 'images/java.png' },
//       { name: 'Bounded Types', url: 'java-bounded-types', icon: 'images/java.png' },
//       { name: 'Type Erasure', url: 'java-type-erasure', icon: 'images/java.png' },
//       { name: 'Wildcard Types', url: 'java-wildcards', icon: 'images/java.png' },
//       { name: 'Generic Collections', url: 'java-generic-collections', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Java 8 Features',
//     subItems: [
//       { name: 'Lambda Expressions', url: 'java-lambda', icon: 'images/java.png' },
//       { name: 'Functional Interfaces', url: 'java-functional-interface', icon: 'images/java.png' },
//       { name: 'Streams API', url: 'java-streams', icon: 'images/java.png' },
//       { name: 'Optional Class', url: 'java-optional', icon: 'images/java.png' },
//       { name: 'Method References', url: 'java-method-references', icon: 'images/java.png' },
//       { name: 'Default Methods', url: 'java-default-methods', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Java 9+ Features',
//     subItems: [
//       { name: 'Modules', url: 'java-modules', icon: 'images/java.png' },
//       { name: 'JShell', url: 'java-jshell', icon: 'images/java.png' },
//       { name: 'Collection Factory Methods', url: 'java-collection-factory', icon: 'images/java.png' },
//       { name: 'Private Interface Methods', url: 'java-private-interface-methods', icon: 'images/java.png' },
//       { name: 'Process API', url: 'java-process-api', icon: 'images/java.png' },
//       { name: 'HTTP Client', url: 'java-http-client', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Java Design Patterns',
//     subItems: [
//       { name: 'Singleton Pattern', url: 'java-singleton', icon: 'images/java.png' },
//       { name: 'Factory Pattern', url: 'java-factory', icon: 'images/java.png' },
//       { name: 'Observer Pattern', url: 'java-observer', icon: 'images/java.png' },
//       { name: 'Decorator Pattern', url: 'java-decorator', icon: 'images/java.png' },
//       { name: 'Adapter Pattern', url: 'java-adapter', icon: 'images/java.png' },
//       { name: 'Strategy Pattern', url: 'java-strategy', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Java Best Practices',
//     subItems: [
//       { name: 'Code Conventions', url: 'java-code-conventions', icon: 'images/java.png' },
//       { name: 'Exception Handling Best Practices', url: 'java-exception-best', icon: 'images/java.png' },
//       { name: 'Effective Use of Collections', url: 'java-collections-best', icon: 'images/java.png' },
//       { name: 'Threading Best Practices', url: 'java-threading-best', icon: 'images/java.png' },
//       { name: 'Memory Management Tips', url: 'java-memory', icon: 'images/java.png' },
//       { name: 'Performance Optimization', url: 'java-performance', icon: 'images/java.png' },
//     ],
//   },
//   {
//     name: 'Projects & Interview',
//     subItems: [
//       { name: 'Mini Projects', url: 'java-mini-projects', icon: 'images/project.png' },
//       { name: 'Portfolio Projects', url: 'java-portfolio-projects', icon: 'images/project.png' },
//       { name: 'Java Interview Questions', url: 'java-interview-basic', icon: 'images/interview.png' },
//       { name: 'Advanced Interview Questions', url: 'java-interview-advanced', icon: 'images/interview.png' },
//       { name: 'Coding Challenges', url: 'java-coding-challenges', icon: 'images/interview.png' },
//       { name: 'Mock Interviews', url: 'java-mock-interviews', icon: 'images/interview.png' },
//     ],
//   },
// ];
