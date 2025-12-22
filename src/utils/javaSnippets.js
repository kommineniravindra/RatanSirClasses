const javaSnippets = [
  // --- Basic Structure ---
  {
    caption: "main",
    snippet: "public static void main(String[] args) {\n    ${1:// code}\n}",
    type: "snippet",
  },
  {
    caption: "class",
    snippet: "class ${1:ClassName} {\n    ${2}\n}",
    type: "snippet",
  },
  {
    caption: "interface",
    snippet: "interface ${1:InterfaceName} {\n    ${2}\n}",
    type: "snippet",
  },
  {
    caption: "abstract class",
    snippet: "abstract class ${1:ClassName} {\n    ${2}\n}",
    type: "snippet",
  },
  {
    caption: "enum",
    snippet: "enum ${1:EnumName} {\n    ${2:VALUE1, VALUE2};\n}",
    type: "snippet",
  },

  // --- Common Objects (IO & Utils) ---
  {
    caption: "scanner",
    snippet: "Scanner scanner = new Scanner(System.in);\n${1}",
    type: "snippet",
    customImport: "import java.util.Scanner;",
  },
  {
    caption: "file",
    snippet: 'File ${1:file} = new File("${2:filename.txt}");',
    type: "snippet",
    customImport: "import java.io.File;",
  },
  {
    caption: "fileReader",
    snippet: 'FileReader ${1:fr} = new FileReader("${2:filename.txt}");',
    type: "snippet",
    customImport: "import java.io.FileReader;",
  },
  {
    caption: "fileWriter",
    snippet: 'FileWriter ${1:fw} = new FileWriter("${2:filename.txt}");',
    type: "snippet",
    customImport: "import java.io.FileWriter;",
  },
  {
    caption: "bufferedReader",
    snippet:
      'BufferedReader ${1:br} = new BufferedReader(new FileReader("${2:filename.txt}"));',
    type: "snippet",
    customImport: "import java.io.BufferedReader;\nimport java.io.FileReader;",
  },
  {
    caption: "bufferedWriter",
    snippet:
      'BufferedWriter ${1:bw} = new BufferedWriter(new FileWriter("${2:filename.txt}"));',
    type: "snippet",
    customImport: "import java.io.BufferedWriter;\nimport java.io.FileWriter;",
  },
  {
    caption: "printWriter",
    snippet:
      'PrintWriter ${1:pw} = new PrintWriter(new FileWriter("${2:filename.txt}"));',
    type: "snippet",
    customImport: "import java.io.PrintWriter;\nimport java.io.FileWriter;",
  },
  {
    caption: "sysout",
    snippet: "System.out.println(${1});",
    type: "snippet",
  },
  {
    caption: "syserr",
    snippet: "System.err.println(${1});",
    type: "snippet",
  },
  {
    caption: "random",
    snippet: "Random ${1:rand} = new Random();",
    type: "snippet",
    customImport: "import java.util.Random;",
  },
  {
    caption: "uuid",
    snippet: "UUID ${1:uuid} = UUID.randomUUID();",
    type: "snippet",
    customImport: "import java.util.UUID;",
  },
  {
    caption: "date",
    snippet: "Date ${1:date} = new Date();",
    type: "snippet",
    customImport: "import java.util.Date;",
  },
  {
    caption: "localDate",
    snippet: "LocalDate ${1:date} = LocalDate.now();",
    type: "snippet",
    customImport: "import java.time.LocalDate;",
  },
  {
    caption: "stringBuilder",
    snippet: "StringBuilder ${1:sb} = new StringBuilder();",
    type: "snippet",
  },

  // --- Collections ---
  {
    caption: "ArrayList",
    snippet: "ArrayList<${1:String}> ${2:list} = new ArrayList<>();",
    type: "snippet",
    customImport: "import java.util.ArrayList;",
  },
  {
    caption: "List",
    snippet: "List<${1:String}> ${2:list} = new ArrayList<>();",
    type: "snippet",
    customImport: "import java.util.*;",
  },
  {
    caption: "Set",
    snippet: "Set<${1:String}> ${2:set} = new HashSet<>();",
    type: "snippet",
    customImport: "import java.util.*;",
  },

  {
    caption: "Map",
    snippet: "Map<${1:KeyType}, ${2:ValueType}> ${3:map} = new HashMap<>();",
    type: "snippet",
    customImport: "import java.util.*;",
  },
  {
    caption: "hashMap",
    snippet: "HashMap<${1:String}, ${2:Integer}> ${3:map} = new HashMap<>();",
    type: "snippet",
    customImport: "import java.util.HashMap;",
  },
  {
    caption: "hashSet",
    snippet: "HashSet<${1:String}> ${2:set} = new HashSet<>();",
    type: "snippet",
    customImport: "import java.util.*;",
  },
  {
    caption: "linkedList",
    snippet: "LinkedList<${1:String}> ${2:list} = new LinkedList<>();",
    type: "snippet",
    customImport: "import java.util.LinkedList;",
  },
  {
    caption: "stack",
    snippet: "Stack<${1:String}> ${2:stack} = new Stack<>();",
    type: "snippet",
    customImport: "import java.util.Stack;",
  },
  {
    caption: "priorityQueue",
    snippet: "PriorityQueue<${1:Integer}> ${2:pq} = new PriorityQueue<>();",
    type: "snippet",
    customImport: "import java.util.PriorityQueue;",
  },
  {
    caption: "arraysAsList",
    snippet: "Arrays.asList(${1});",
    type: "snippet",
    customImport: "import java.util.Arrays;",
  },

  // --- Class Only Auto-Imports (User preferences) ---
  {
    caption: "ArrayList",
    snippet: "ArrayList",
    type: "snippet",
    customImport: "import java.util.ArrayList;",
  },
  {
    caption: "HashMap",
    snippet: "HashMap",
    type: "snippet",
    customImport: "import java.util.HashMap;",
  },
  {
    caption: "HashSet",
    snippet: "HashSet",
    type: "snippet",
    customImport: "import java.util.HashSet;",
  },
  {
    caption: "LinkedList",
    snippet: "LinkedList",
    type: "snippet",
    customImport: "import java.util.LinkedList;",
  },
  {
    caption: "File",
    snippet: "File",
    type: "snippet",
    customImport: "import java.io.File;",
  },
  {
    caption: "FileReader",
    snippet: "FileReader",
    type: "snippet",
    customImport: "import java.io.FileReader;",
  },
  {
    caption: "FileWriter",
    snippet: "FileWriter",
    type: "snippet",
    customImport: "import java.io.FileWriter;",
  },
  {
    caption: "BufferedReader",
    snippet: "BufferedReader",
    type: "snippet",
    customImport: "import java.io.BufferedReader;",
  },
  {
    caption: "BufferedWriter",
    snippet: "BufferedWriter",
    type: "snippet",
    customImport: "import java.io.BufferedWriter;",
  },
  {
    caption: "PrintWriter",
    snippet: "PrintWriter",
    type: "snippet",
    customImport: "import java.io.PrintWriter;",
  },
  {
    caption: "Date",
    snippet: "Date",
    type: "snippet",
    customImport: "import java.util.Date;",
  },
  {
    caption: "Random",
    snippet: "Random",
    type: "snippet",
    customImport: "import java.util.Random;",
  },
  {
    caption: "UUID",
    snippet: "UUID",
    type: "snippet",
    customImport: "import java.util.UUID;",
  },
  {
    caption: "Collections",
    snippet: "Collections",
    type: "snippet",
    customImport: "import java.util.Collections;",
  },
  {
    caption: "Arrays",
    snippet: "Arrays",
    type: "snippet",
    customImport: "import java.util.Arrays;",
  },

  // --- Control Flow ---
  {
    caption: "if",
    snippet: "if (${1:condition}) {\n    ${2}\n}",
    type: "snippet",
  },
  {
    caption: "ifelse",
    snippet: "if (${1:condition}) {\n    ${2}\n} else {\n    ${3}\n}",
    type: "snippet",
  },
  {
    caption: "for",
    snippet:
      "for (int ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++) {\n    ${3}\n}",
    type: "snippet",
  },
  {
    caption: "foreach",
    snippet: "for (${1:Type} ${2:item} : ${3:collection}) {\n    ${4}\n}",
    type: "snippet",
  },
  {
    caption: "while",
    snippet: "while (${1:condition}) {\n    ${2}\n}",
    type: "snippet",
  },
  {
    caption: "dowhile",
    snippet: "do {\n    ${2}\n} while (${1:condition});",
    type: "snippet",
  },
  {
    caption: "switch",
    snippet:
      "switch (${1:key}) {\n    case ${2:value}:\n        ${3}\n        break;\n    default:\n        break;\n}",
    type: "snippet",
  },
  {
    caption: "trycatch",
    snippet:
      "try {\n    ${1}\n} catch (${2:Exception} e) {\n    e.printStackTrace();\n}",
    type: "snippet",
  },
  {
    caption: "tryresources",
    snippet:
      "try (${1:Resource} res = new ${1:Resource}()) {\n    ${2}\n} catch (Exception e) {\n    e.printStackTrace();\n}",
    type: "snippet",
  },

  // --- Methods & Properties ---
  {
    caption: "getter",
    snippet:
      "public ${1:Type} get${2:FieldName}() {\n    return ${3:fieldName};\n}",
    type: "snippet",
  },
  {
    caption: "setter",
    snippet:
      "public void set${1:FieldName}(${2:Type} ${3:fieldName}) {\n    this.${3:fieldName} = ${3:fieldName};\n}",
    type: "snippet",
  },
  {
    caption: "constructor",
    snippet:
      "public ${1:ClassName}(${2:params}) {\n    ${3:// initialization}\n}",
    type: "snippet",
  },
  {
    caption: "toString",
    snippet:
      '@Override\npublic String toString() {\n    return "${1:ClassName} [${2:fields}]";\n}',
    type: "snippet",
  },
  {
    caption: "equals",
    snippet:
      "@Override\npublic boolean equals(Object o) {\n    if (this == o) return true;\n    if (o == null || getClass() != o.getClass()) return false;\n    ${1:ClassName} that = (${1:ClassName}) o;\n    return ${2:Objects.equals(field, that.field)};\n}",
    type: "snippet",
  },

  // --- Threading ---
  {
    caption: "thread",
    snippet:
      "Thread ${1:t} = new Thread(() -> {\n    ${2}\n});\n${1:t}.start();",
    type: "snippet",
  },
  {
    caption: "runnable",
    snippet: "Runnable ${1:r} = () -> {\n    ${2}\n};",
    type: "snippet",
  },
  {
    caption: "sleep",
    snippet:
      "try { Thread.sleep(${1:1000}); } catch (InterruptedException e) { e.printStackTrace(); }",
    type: "snippet",
  },

  // --- Manual Imports (Fallbacks) ---
  {
    caption: "importIO",
    snippet: "import java.io.*;",
    type: "snippet",
  },
  {
    caption: "importUtil",
    snippet: "import java.util.*;",
    type: "snippet",
  },

  // --- Math & String Utils ---
  {
    caption: "mathMax",
    snippet: "Math.max(${1:a}, ${2:b})",
    type: "snippet",
  },
  {
    caption: "mathMin",
    snippet: "Math.min(${1:a}, ${2:b})",
    type: "snippet",
  },
  {
    caption: "parseInt",
    snippet: "Integer.parseInt(${1:string})",
    type: "snippet",
  },
  {
    caption: "parseDouble",
    snippet: "Double.parseDouble(${1:string})",
    type: "snippet",
  },
  {
    caption: "substring",
    snippet: "${1:str}.substring(${2:begin}, ${3:end})",
    type: "snippet",
  },
  {
    caption: "replace",
    snippet: '${1:str}.replace("${2:old}", "${3:new}")',
    type: "snippet",
  },
  // --- Common Domain Classes ---
  {
    caption: "Main",
    snippet:
      'class Main {\n    public static void main(String[] args) {\n        // Write your Java code here\n        System.out.println("Welcome to codepulse-r!");\n    }\n}',
    type: "snippet",
  },
  {
    caption: "Product",
    snippet:
      "class Product {\n    int id;\n    String name;\n    double price;\n}",
    type: "snippet",
  },
  {
    caption: "Employee",
    snippet:
      "class Employee {\n    int id;\n    String name;\n    double salary;\n}",
    type: "snippet",
  },
  {
    caption: "Student",
    snippet:
      "class Student {\n    int id;\n    String name;\n    double marks;\n}",
    type: "snippet",
  },
  {
    caption: "Customer",
    snippet:
      "class Customer {\n    int id;\n    String name;\n    String email;\n}",
    type: "snippet",
  },
  {
    caption: "Book",
    snippet:
      "class Book {\n    int id;\n    String title;\n    String author;\n    double price;\n}",
    type: "snippet",
  },
  {
    caption: "Order",
    snippet:
      "class Order {\n    int id;\n    String orderDate;\n    double amount;\n    String status;\n}",
    type: "snippet",
  },
  {
    caption: "User",
    snippet:
      "class User {\n    int id;\n    String username;\n    String password;\n    String email;\n    String role;\n}",
    type: "snippet",
  },
  {
    caption: "Account",
    snippet:
      "class Account {\n    long accNo;\n    String holderName;\n    double balance;\n    String type;\n}",
    type: "snippet",
  },
  {
    caption: "Vehicle",
    snippet:
      "class Vehicle {\n    int id;\n    String name;\n    String brand;\n    double price;\n}",
    type: "snippet",
  },
  {
    caption: "Course",
    snippet:
      "class Course {\n    int id;\n    String name;\n    String duration;\n    double fee;\n}",
    type: "snippet",
  },
  {
    caption: "Movie",
    snippet:
      "class Movie {\n    int id;\n    String title;\n    String director;\n    double rating;\n}",
    type: "snippet",
  },
  {
    caption: "Laptop",
    snippet:
      "class Laptop {\n    int id;\n    String brand;\n    String model;\n    double price;\n}",
    type: "snippet",
  },
  {
    caption: "Post",
    snippet:
      "class Post {\n    int id;\n    String title;\n    String body;\n    String author;\n}",
    type: "snippet",
  },
  {
    caption: "Comment",
    snippet:
      "class Comment {\n    int id;\n    String text;\n    String author;\n    int postId;\n}",
    type: "snippet",
  },

  // --- Object Creation (Common Domain Classes) ---
  {
    caption: "ProductObject",
    snippet: "Product product = new Product();",
    type: "snippet",
  },
  {
    caption: "EmployeeObject",
    snippet: "Employee employee = new Employee();",
    type: "snippet",
  },
  {
    caption: "StudentObject",
    snippet: "Student student = new Student();",
    type: "snippet",
  },
  {
    caption: "CustomerObject",
    snippet: "Customer customer = new Customer();",
    type: "snippet",
  },
  {
    caption: "BookObject",
    snippet: "Book book = new Book();",
    type: "snippet",
  },
  {
    caption: "OrderObject",
    snippet: "Order order = new Order();",
    type: "snippet",
  },
  {
    caption: "UserObject",
    snippet: "User user = new User();",
    type: "snippet",
  },
  {
    caption: "AccountObject",
    snippet: "Account account = new Account();",
    type: "snippet",
  },
  {
    caption: "VehicleObject",
    snippet: "Vehicle vehicle = new Vehicle();",
    type: "snippet",
  },
  {
    caption: "CourseObject",
    snippet: "Course course = new Course();",
    type: "snippet",
  },
  {
    caption: "MovieObject",
    snippet: "Movie movie = new Movie();",
    type: "snippet",
  },
  {
    caption: "LaptopObject",
    snippet: "Laptop laptop = new Laptop();",
    type: "snippet",
  },
  {
    caption: "PostObject",
    snippet: "Post post = new Post();",
    type: "snippet",
  },
  {
    caption: "CommentObject",
    snippet: "Comment comment = new Comment();",
    type: "snippet",
  },
];

export default javaSnippets;
