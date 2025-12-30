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

  // --- Stream API & Lambdas ---
  {
    caption: "stream",
    snippet: ".stream()",
    type: "snippet",
    customImport: "import java.util.stream.*;",
  },
  {
    caption: "filter",
    snippet: ".filter(${1:item} -> ${2:condition})",
    type: "snippet",
    customImport: "import java.util.stream.*;",
  },
  {
    caption: "map",
    snippet: ".map(${1:item} -> ${2:transformation})",
    type: "snippet",
    customImport: "import java.util.stream.*;",
  },
  {
    caption: "forEach",
    snippet: ".forEach(${1:item} -> System.out.println(${1:item}));",
    type: "snippet",
  },
  {
    caption: "collectList",
    snippet: ".collect(Collectors.toList())",
    type: "snippet",
    customImport: "import java.util.stream.Collectors;",
  },
  {
    caption: "collectSet",
    snippet: ".collect(Collectors.toSet())",
    type: "snippet",
    customImport: "import java.util.stream.Collectors;",
  },
  {
    caption: "sorted",
    snippet: ".sorted()",
    type: "snippet",
  },
  {
    caption: "sortedComparator",
    snippet: ".sorted((a, b) -> a.compareTo(b))",
    type: "snippet",
  },
  {
    caption: "findFirst",
    snippet: ".findFirst()",
    type: "snippet",
  },
  {
    caption: "findAny",
    snippet: ".findAny()",
    type: "snippet",
  },
  {
    caption: "orElse",
    snippet: ".orElse(${1:default})",
    type: "snippet",
  },
  {
    caption: "count",
    snippet: ".count()",
    type: "snippet",
  },

  // --- Functional Interfaces ---
  {
    caption: "Predicate",
    snippet: "Predicate<${1:Type}> ${2:name} = ${3:x} -> ${4:condition};",
    type: "snippet",
    customImport: "import java.util.function.Predicate;",
  },
  {
    caption: "Consumer",
    snippet: "Consumer<${1:Type}> ${2:name} = ${3:x} -> ${4:action};",
    type: "snippet",
    customImport: "import java.util.function.Consumer;",
  },
  {
    caption: "Function",
    snippet: "Function<${1:T}, ${2:R}> ${3:name} = ${4:x} -> ${5:result};",
    type: "snippet",
    customImport: "import java.util.function.Function;",
  },
  {
    caption: "Supplier",
    snippet: "Supplier<${1:Type}> ${2:name} = () -> ${3:value};",
    type: "snippet",
    customImport: "import java.util.function.Supplier;",
  },

  // --- Modern Java Collections ---
  {
    caption: "listOf",
    snippet: "List.of(${1:items})",
    type: "snippet",
    customImport: "import java.util.List;",
  },
  {
    caption: "setOf",
    snippet: "Set.of(${1:items})",
    type: "snippet",
    customImport: "import java.util.Set;",
  },
  {
    caption: "mapOf",
    snippet: "Map.of(${1:k1}, ${2:v1})",
    type: "snippet",
    customImport: "import java.util.Map;",
  },

  // --- String Methods ---
  {
    caption: "length",
    snippet: ".length()",
    type: "snippet",
  },
  {
    caption: "charAt",
    snippet: ".charAt(${1:index})",
    type: "snippet",
  },
  {
    caption: "substring",
    snippet: ".substring(${1:begin}, ${2:end})",
    type: "snippet",
  },
  {
    caption: "contains",
    snippet: '.contains("${1:chars}")',
    type: "snippet",
  },
  {
    caption: "equals",
    snippet: ".equals(${1:other})",
    type: "snippet",
  },
  {
    caption: "equalsIgnoreCase",
    snippet: ".equalsIgnoreCase(${1:other})",
    type: "snippet",
  },
  {
    caption: "startsWith",
    snippet: '.startsWith("${1:prefix}")',
    type: "snippet",
  },
  {
    caption: "endsWith",
    snippet: '.endsWith("${1:suffix}")',
    type: "snippet",
  },
  {
    caption: "toLowerCase",
    snippet: ".toLowerCase()",
    type: "snippet",
  },
  {
    caption: "toUpperCase",
    snippet: ".toUpperCase()",
    type: "snippet",
  },
  {
    caption: "trim",
    snippet: ".trim()",
    type: "snippet",
  },
  {
    caption: "split",
    snippet: '.split("${1:regex}")',
    type: "snippet",
  },
  {
    caption: "replace",
    snippet: '.replace("${1:old}", "${2:new}")',
    type: "snippet",
  },
  {
    caption: "replaceAll",
    snippet: '.replaceAll("${1:regex}", "${2:replacement}")',
    type: "snippet",
  },

  // --- Math Methods ---
  {
    caption: "abs",
    snippet: "Math.abs(${1:num})",
    type: "snippet",
  },
  {
    caption: "pow",
    snippet: "Math.pow(${1:base}, ${2:exp})",
    type: "snippet",
  },
  {
    caption: "sqrt",
    snippet: "Math.sqrt(${1:num})",
    type: "snippet",
  },
  {
    caption: "min",
    snippet: "Math.min(${1:a}, ${2:b})",
    type: "snippet",
  },
  {
    caption: "max",
    snippet: "Math.max(${1:a}, ${2:b})",
    type: "snippet",
  },
  {
    caption: "randomMath",
    snippet: "Math.random()",
    type: "snippet",
  },

  // --- Exceptions ---
  {
    caption: "throw",
    snippet: 'throw new ${1:RuntimeException}("${2:message}");',
    type: "snippet",
  },
  {
    caption: "throws",
    snippet: "throws ${1:Exception}",
    type: "snippet",
  },

  // --- Concurrency / Threads ---
  {
    caption: "synchronized",
    snippet: "synchronized (${1:lock}) {\n    ${2}\n}",
    type: "snippet",
  },
  {
    caption: "wait",
    snippet: "wait();",
    type: "snippet",
  },
  {
    caption: "notify",
    snippet: "notify();",
    type: "snippet",
  },
  {
    caption: "notifyAll",
    snippet: "notifyAll();",
    type: "snippet",
  },

  // --- Files (NIO) ---
  {
    caption: "readString",
    snippet: 'Files.readString(Path.of("${1:file.txt}"))',
    type: "snippet",
    customImport: "import java.nio.file.Files;\nimport java.nio.file.Path;",
  },
  {
    caption: "writeString",
    snippet: 'Files.writeString(Path.of("${1:file.txt}"), "${2:content}")',
    type: "snippet",
    customImport: "import java.nio.file.Files;\nimport java.nio.file.Path;",
  },

  // --- Optional ---
  {
    caption: "Optional.of",
    snippet: "Optional.of(${1:value})",
    type: "snippet",
    customImport: "import java.util.Optional;",
  },
  {
    caption: "Optional.empty",
    snippet: "Optional.empty()",
    type: "snippet",
    customImport: "import java.util.Optional;",
  },
  {
    caption: "Optional.ofNullable",
    snippet: "Optional.ofNullable(${1:value})",
    type: "snippet",
    customImport: "import java.util.Optional;",
  },
  {
    caption: "isPresent",
    snippet: ".isPresent()",
    type: "snippet",
  },
  {
    caption: "ifPresent",
    snippet: ".ifPresent(${1:val} -> ${2:action})",
    type: "snippet",
  },
];

// --- Additional Snippets (Set 2) ---
const extraSnippets = [
  // --- Modern Date/Time (Java 8+) ---
  {
    caption: "LocalDateTime",
    snippet: "LocalDateTime ${1:now} = LocalDateTime.now();",
    type: "snippet",
    customImport: "import java.time.LocalDateTime;",
  },
  {
    caption: "DateTimeFormatter",
    snippet:
      'DateTimeFormatter ${1:fmt} = DateTimeFormatter.ofPattern("${2:yyyy-MM-dd HH:mm:ss}");',
    type: "snippet",
    customImport: "import java.time.format.DateTimeFormatter;",
  },
  {
    caption: "DurationBetween",
    snippet: "Duration.between(${1:start}, ${2:end})",
    type: "snippet",
    customImport: "import java.time.Duration;",
  },
  {
    caption: "PeriodBetween",
    snippet: "Period.between(${1:startDate}, ${2:endDate})",
    type: "snippet",
    customImport: "import java.time.Period;",
  },

  // --- JDBC (Database) ---
  {
    caption: "Connection",
    snippet:
      'Connection ${1:conn} = DriverManager.getConnection("${2:url}", "${3:user}", "${4:pass}");',
    type: "snippet",
    customImport: "import java.sql.Connection;\nimport java.sql.DriverManager;",
  },
  {
    caption: "PreparedStatement",
    snippet:
      'PreparedStatement ${1:pstmt} = ${2:conn}.prepareStatement("${3:sql}");',
    type: "snippet",
    customImport: "import java.sql.PreparedStatement;",
  },
  {
    caption: "ResultSet",
    snippet: "ResultSet ${1:rs} = ${2:stmt}.executeQuery();",
    type: "snippet",
    customImport: "import java.sql.ResultSet;",
  },
  {
    caption: "whileResultSet",
    snippet: "while (${1:rs}.next()) {\n    ${2}\n}",
    type: "snippet",
  },

  // --- Modern Java Features (14+) ---
  {
    caption: "record",
    snippet: "record ${1:Name}(${2:Type} ${3:field}) {}",
    type: "snippet",
  },
  {
    caption: "switchExpression",
    snippet:
      "var ${1:result} = switch (${2:input}) {\n    case ${3:label} -> ${4:value};\n    default -> ${5:defaultVal};\n};",
    type: "snippet",
  },
  {
    caption: "var",
    snippet: "var ${1:variable} = ${2:value};",
    type: "snippet",
  },
  {
    caption: "instanceofPattern",
    snippet: "if (${1:obj} instanceof ${2:Type} ${3:t}) {\n    ${4}\n}",
    type: "snippet",
  },

  // --- Advanced Stream Collectors ---
  {
    caption: "groupingBy",
    snippet: ".collect(Collectors.groupingBy(${1:func}))",
    type: "snippet",
    customImport: "import java.util.stream.Collectors;",
  },
  {
    caption: "joining",
    snippet: '.collect(Collectors.joining("${1:, }"))',
    type: "snippet",
    customImport: "import java.util.stream.Collectors;",
  },
  {
    caption: "partitioningBy",
    snippet: ".collect(Collectors.partitioningBy(${1:predicate}))",
    type: "snippet",
    customImport: "import java.util.stream.Collectors;",
  },

  // --- System / Utils ---
  {
    caption: "System.exit",
    snippet: "System.exit(${1:0});",
    type: "snippet",
  },
  {
    caption: "System.getProperty",
    snippet: 'System.getProperty("${1:user.dir}");',
    type: "snippet",
  },
  {
    caption: "ThreadLocal",
    snippet:
      "ThreadLocal<${1:Type}> ${2:tl} = ThreadLocal.withInitial(() -> ${3:initialValue});",
    type: "snippet",
  },
];

javaSnippets.push(...extraSnippets);

// --- Advanced / Expert Snippets (Set 3) ---
const expertSnippets = [
  // --- Asynchronous Programming (CompletableFuture) ---
  {
    caption: "CompletableFuture.supplyAsync",
    snippet:
      "CompletableFuture.supplyAsync(() -> {\n    ${1:// return result}\n});",
    type: "snippet",
    customImport: "import java.util.concurrent.CompletableFuture;",
  },
  {
    caption: "thenApply",
    snippet: ".thenApply(${1:result} -> ${2:transform})",
    type: "snippet",
  },
  {
    caption: "thenAccept",
    snippet: ".thenAccept(${1:result} -> ${2:consume})",
    type: "snippet",
  },
  {
    caption: "allOf",
    snippet: "CompletableFuture.allOf(${1:futures}).join();",
    type: "snippet",
    customImport: "import java.util.concurrent.CompletableFuture;",
  },

  // --- Reflection API ---
  {
    caption: "Class.forName",
    snippet: 'Class<?> ${1:clazz} = Class.forName("${2:com.example.MyClass}");',
    type: "snippet",
  },
  {
    caption: "getDeclaredMethods",
    snippet: "Method[] ${1:methods} = ${2:clazz}.getDeclaredMethods();",
    type: "snippet",
    customImport: "import java.lang.reflect.Method;",
  },
  {
    caption: "newInstance",
    snippet: "${1:clazz}.getDeclaredConstructor().newInstance();",
    type: "snippet",
  },

  // --- Networking ---
  {
    caption: "URL",
    snippet: 'URL ${1:url} = new URL("${2:https://api.example.com}");',
    type: "snippet",
    customImport: "import java.net.URL;",
  },
  {
    caption: "HttpURLConnection",
    snippet:
      'HttpURLConnection ${1:con} = (HttpURLConnection) ${2:url}.openConnection();\n${1:con}.setRequestMethod("GET");',
    type: "snippet",
    customImport: "import java.net.HttpURLConnection;",
  },

  // --- Regular Expressions ---
  {
    caption: "Pattern.compile",
    snippet: 'Pattern ${1:pattern} = Pattern.compile("${2:regex}");',
    type: "snippet",
    customImport: "import java.util.regex.Pattern;",
  },
  {
    caption: "Matcher",
    snippet: "Matcher ${1:matcher} = ${2:pattern}.matcher(${3:input});",
    type: "snippet",
    customImport: "import java.util.regex.Matcher;",
  },
  {
    caption: "matcher.find",
    snippet:
      "while (${1:matcher}.find()) {\n    System.out.println(${1:matcher}.group());\n}",
    type: "snippet",
  },

  // --- Design Patterns (Quick Starters) ---
  {
    caption: "Singleton",
    snippet:
      "class ${1:Singleton} {\n    private static ${1:Singleton} instance;\n    private ${1:Singleton}() {}\n    public static ${1:Singleton} getInstance() {\n        if (instance == null) instance = new ${1:Singleton}();\n        return instance;\n    }\n}",
    type: "snippet",
  },
  {
    caption: "BuilderPattern",
    snippet:
      "public static class Builder {\n    private ${1:Type} ${2:field};\n    public Builder ${2:field}(${1:Type} ${2:field}) {\n        this.${2:field} = ${2:field};\n        return this;\n    }\n    public ${3:TargetClass} build() {\n        return new ${3:TargetClass}(this);\n    }\n}",
    type: "snippet",
  },

  // --- Functional Interfaces (Complex) ---
  {
    caption: "BiFunction",
    snippet:
      "BiFunction<${1:T}, ${2:U}, ${3:R}> ${4:func} = (${5:t}, ${6:u}) -> ${7:result};",
    type: "snippet",
    customImport: "import java.util.function.BiFunction;",
  },
  {
    caption: "UnaryOperator",
    snippet: "UnaryOperator<${1:T}> ${2:op} = ${3:x} -> ${4:result};",
    type: "snippet",
    customImport: "import java.util.function.UnaryOperator;",
  },
];

javaSnippets.push(...expertSnippets);

export default javaSnippets;
