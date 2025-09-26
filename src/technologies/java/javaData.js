
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import alllang from '../../assets/alllang.png';

export const javaData = {
  // ----------- Topic 1: Introduction to Java -----------
  "Importance of Java": (
    <div>
      <p>
        Java is a high-level, object-oriented, platform-independent language widely used in software development.
        It forms the backbone of many modern technologies and frameworks.
      </p>
      <img src={alllang} alt="alllang" className="alllang" />
      <p>Applications include:</p>
      <ul>
        <li>Big Data frameworks like Apache Spark & Hadoop</li>
        <li>Web & Enterprise applications</li>
        <li>Android apps</li>
        <li>Automation tools like Selenium</li>
        <li>Embedded systems & IoT devices</li>
      </ul>
    </div>
  ),

  "Applications of Java": (
    <div>
      <p>Java can build multiple types of applications:</p>
      <ul>
        <li>✔️ Desktop Applications (Calculator, Antivirus)</li>
        <li>✔️ Web Applications (Online Shopping, e-Banking)</li>
        <li>✔️ Enterprise Applications (ERP, Banking Systems)</li>
        <li>✔️ Mobile Applications (Android)</li>
        <li>✔️ Embedded Systems (Smart devices)</li>
        <li>✔️ Games & Animations</li>
      </ul>
    </div>
  ),

  "History of Java": (
    <div>
      <p>
        Java was developed by James Gosling at Sun Microsystems in 1995. Key milestones:
      </p>
      <ul>
        <li>1995 – Java 1.0 released</li>
        <li>1997 – Java 1.1 introduced</li>
        <li>1998 – J2SE 1.2 with Swing & Collections</li>
        <li>2004 – Java 5 with generics & annotations</li>
        <li>2014 – Java 8 with lambdas & streams</li>
      </ul>
    </div>
  ),

  "Java Versions": (
    <div>
      <ul>
        <li>JDK Beta - 1995</li>
        <li>JDK 1.0 - 1996</li>
        <li>JDK 1.1 - 1997</li>
        <li>J2SE 1.2 - 1998</li>
        <li>J2SE 1.3 - 2000</li>
        <li>J2SE 1.4 - 2002</li>
        <li>J2SE 5.0 - 2004</li>
        <li>Java SE 6 - 2006</li>
        <li>Java SE 7 - 2011</li>
        <li>Java SE 8 - 2014</li>
        <li>Java SE 11 - 2018 (LTS)</li>
        <li>Java SE 17 - 2021 (LTS)</li>
        <li>Java SE 21 - 2023 (LTS)</li>
      </ul>
    </div>
  ),

  "Java Editors": (
    <div>
      <p>Common editors & IDEs for Java:</p>
      <ul>
        <li>IntelliJ IDEA</li>
        <li>Eclipse IDE</li>
        <li>NetBeans</li>
        <li>VS Code with Java extensions</li>
        <li>BlueJ (for beginners)</li>
      </ul>
    </div>
  ),

  "First Java Application": (
    <div>
      <p>Example: Hello World Program</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----------- Topic 2: Basics -----------
  "Variables": (
    <div>
      <p>Variables store data in memory. Example:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`int age = 25;
double salary = 45000.50;
char grade = 'A';
boolean isJavaFun = true;`}
      </SyntaxHighlighter>
    </div>
  ),

  "Data Types": (
    <div>
      <p>Java supports primitive & non-primitive types:</p>
      <ul>
        <li>Primitive: byte, short, int, long, float, double, char, boolean</li>
        <li>Non-Primitive: String, Arrays, Classes, Interfaces</li>
      </ul>
    </div>
  ),

  "Operators": (
    <div>
      <p>Operators perform operations on variables:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`int a = 10, b = 5;
int sum = a + b; // Arithmetic
boolean isEqual = a == b; // Comparison
boolean logic = (a > b) && (b > 0); // Logical`}
      </SyntaxHighlighter>
    </div>
  ),

  "Keywords": (
    <div>
      <p>Java reserved words (cannot be used as identifiers):</p>
      <ul>
        <li>class, static, void, int, double, if, else, for, while, try, catch, finally</li>
      </ul>
    </div>
  ),

  "Input/Output": (
    <div>
      <p>Reading input and printing output:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`import java.util.Scanner;

public class InputOutputExample {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = sc.nextLine();
        System.out.println("Hello, " + name);
        sc.close();
    }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Comments": (
    <div>
      <p>Used to describe code:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`// Single line comment
/* Multi-line
   comment */`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----------- Topic 3: Control Flow -----------
  "If-Else": (
    <div>
      <p>Conditional execution:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`int num = 10;
if(num > 0){
    System.out.println("Positive");
} else {
    System.out.println("Non-positive");
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Switch": (
    <div>
      <p>Multiple choice conditional:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`int day = 3;
switch(day){
    case 1: System.out.println("Monday"); break;
    case 2: System.out.println("Tuesday"); break;
    case 3: System.out.println("Wednesday"); break;
    default: System.out.println("Other day");
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Loops": (
    <div>
      <p>Repeating statements:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`for(int i=0; i<5; i++){
    System.out.println(i);
}

int j=0;
while(j<5){
    System.out.println(j);
    j++;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Break & Continue": (
    <div>
      <p>Break exits, continue skips iteration:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`for(int i=0;i<5;i++){
    if(i==3) break;
    if(i==1) continue;
    System.out.println(i);
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Nested Loops": (
    <div>
      <p>Loop inside another loop:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`for(int i=1;i<=3;i++){
    for(int j=1;j<=2;j++){
        System.out.println(i + "," + j);
    }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Return Statement": (
    <div>
      <p>Return a value from a method:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`public int sum(int a, int b){
    return a + b;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----------- Topic 4: Arrays & Strings -----------
  "One Dimensional Arrays": (
    <div>
      <p>Arrays store multiple values:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`int[] numbers = {1,2,3,4,5};
System.out.println(numbers); // 1`}
      </SyntaxHighlighter>
    </div>
  ),

  "Two Dimensional Arrays": (
    <div>
      <p>Matrix-like structure:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`int[][] matrix = {{1,2},{3,4}};
System.out.println(matrix[11]); // 3`}
      </SyntaxHighlighter>
    </div>
  ),

  "Array Operations": (
    <div>
      <p>Example operations:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`int[] arr = {10,20,30};
arr = 100; // Update
System.out.println(arr.length); // 3`}
      </SyntaxHighlighter>
    </div>
  ),

  "Strings": (
    <div>
      <p>String object in Java:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`String name = "Ravindra";
System.out.println(name.length());
System.out.println(name.toUpperCase());`}
      </SyntaxHighlighter>
    </div>
  ),

  "String Methods": (
    <div>
      <p>Common String methods:</p>
      <ul>
        <li>length(), charAt(), substring(), contains(), equals(), indexOf()</li>
      </ul>
    </div>
  ),

  "StringBuilder & StringBuffer": (
    <div>
      <p>Mutable strings:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`StringBuilder sb = new StringBuilder("Hello");
sb.append(" World");
System.out.println(sb); // Hello World`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----------- Topic 5: Methods -----------
  "Method Definition": (
    <div>
      <p>Methods define reusable code blocks:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`public void greet(){
    System.out.println("Hello");
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Method Parameters": (
    <div>
      <p>Methods can accept parameters:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`public void greet(String name){
    System.out.println("Hello " + name);
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Method Overloading": (
    <div>
      <p>Same method name, different parameters:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`public int add(int a, int b){ return a+b; }
public double add(double a, double b){ return a+b; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Return Types": (
    <div>
      <p>Methods can return values:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`public int sum(int a, int b){
    return a+b;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Recursive Methods": (
    <div>
      <p>Methods calling themselves:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`public int factorial(int n){
    if(n==0) return 1;
    return n * factorial(n-1);
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Variable Scope": (
    <div>
      <p>Scope defines visibility:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`int x = 10; // global
public void method(){
    int y = 5; // local
}`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----------- Topic 6: Object-Oriented Programming -----------
  "Classes & Objects": (
    <div>
      <p>Class is a blueprint; object is an instance:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`class Car {
    String color;
    void drive(){ System.out.println("Driving"); }
}

Car c = new Car();
c.color = "Red";
c.drive();`}
      </SyntaxHighlighter>
    </div>
  ),

  "Constructors": (
    <div>
      <p>Special methods to initialize objects:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`class Car {
    String color;
    Car(String c){ color = c; }
}
Car c = new Car("Red");`}
      </SyntaxHighlighter>
    </div>
  ),

  "Inheritance": (
    <div>
      <p>Subclass inherits properties from superclass:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`class Vehicle { void run(){ System.out.println("Vehicle running"); } }
class Car extends Vehicle {}
Car c = new Car();
c.run(); // Vehicle running`}
      </SyntaxHighlighter>
    </div>
  ),

  "Polymorphism": (
    <div>
      <p>Same method name, different behavior:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`class Animal { void sound(){ System.out.println("Animal sound"); } }
class Dog extends Animal { void sound(){ System.out.println("Bark"); } }
Animal a = new Dog();
a.sound(); // Bark`}
      </SyntaxHighlighter>
    </div>
  ),

  "Abstraction": (
    <div>
      <p>Abstract class with abstract method:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`abstract class Shape {
    abstract void draw();
}
class Circle extends Shape {
    void draw(){ System.out.println("Drawing Circle"); }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Encapsulation": (
    <div>
      <p>Hiding data using private fields and getters/setters:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`class Person {
    private String name;
    public void setName(String n){ name = n; }
    public String getName(){ return name; }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----------- Topic 7: Interfaces & Packages -----------
  "Interfaces": (
    <div>
      <p>Interface defines methods without implementation:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`interface Vehicle {
    void start();
}
class Car implements Vehicle {
    public void start(){ System.out.println("Car started"); }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Abstract Classes": (
    <div>
      <p>Class with abstract and concrete methods:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`abstract class Vehicle {
    abstract void start();
    void stop(){ System.out.println("Vehicle stopped"); }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Packages": (
    <div>
      <p>Used to organize classes:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`package com.example;
public class Hello { }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Access Modifiers": (
    <div>
      <p>Control visibility:</p>
      <ul>
        <li>public, private, protected, default (no modifier)</li>
      </ul>
    </div>
  ),

  "Static Members": (
    <div>
      <p>Belongs to class rather than object:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`class Demo {
    static int count = 0;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Final Keyword": (
    <div>
      <p>Cannot be modified:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`final int DAYS = 7;
final class MyClass{} // cannot extend
final void method(){} // cannot override`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----------- Topic 8: Exception Handling -----------
  "Try-Catch": (
    <div>
      <p>Catch exceptions during runtime:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`try{
    int a = 10/0;
} catch(ArithmeticException e){
    System.out.println("Cannot divide by zero");
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Multiple Catch": (
    <div>
      <p>Handle multiple exceptions:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`try{
    // code
} catch(ArithmeticException e){
    // handle
} catch(ArrayIndexOutOfBoundsException e){
    // handle
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Finally Block": (
    <div>
      <p>Executes always:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`try{ } catch(Exception e){ } finally{
    System.out.println("Executed always");
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Throw & Throws": (
    <div>
      <p>Throw exception manually:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`void divide(int a,int b) throws ArithmeticException{
    if(b==0) throw new ArithmeticException("Divide by zero");
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Custom Exceptions": (
    <div>
      <p>Define your own exceptions:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`class MyException extends Exception {
    MyException(String msg){ super(msg); }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Exception Hierarchy": (
    <div>
      <p>Hierarchy example:</p>
      <ul>
        <li>Throwable → Error / Exception → Checked / Unchecked</li>
      </ul>
    </div>
  ),

  // ----------- Topic 9: Collections Framework -----------
  "List Interface": (
    <div>
      <p>List stores ordered elements:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`List<String> list = new ArrayList<>();
list.add("A");
list.add("B");`}
      </SyntaxHighlighter>
    </div>
  ),

  "ArrayList": (
    <div>
      <p>Resizable array implementation of List:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`ArrayList<Integer> numbers = new ArrayList<>();
numbers.add(10);
numbers.add(20);`}
      </SyntaxHighlighter>
    </div>
  ),

  "LinkedList": (
    <div>
      <p>Doubly-linked list implementation:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`LinkedList<String> ll = new LinkedList<>();
ll.add("A");
ll.addFirst("B");`}
      </SyntaxHighlighter>
    </div>
  ),

  "Set Interface": (
    <div>
      <p>Stores unique elements:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`Set<Integer> set = new HashSet<>();
set.add(1);
set.add(2);`}
      </SyntaxHighlighter>
    </div>
  ),

  "HashSet": (
    <div>
      <p>Hash-based Set:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`HashSet<String> hs = new HashSet<>();
hs.add("X");
hs.add("Y");`}
      </SyntaxHighlighter>
    </div>
  ),

  "Map Interface": (
    <div>
      <p>Key-Value pairs:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`Map<String,Integer> map = new HashMap<>();
map.put("A",1);
map.put("B",2);`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----------- Topic 10: Multithreading -----------
  "Thread Class": (
    <div>
      <p>Create threads by extending Thread class:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`class MyThread extends Thread{
    public void run(){
        System.out.println("Thread running");
    }
}
MyThread t = new MyThread();
t.start();`}
      </SyntaxHighlighter>
    </div>
  ),

  "Runnable Interface": (
    <div>
      <p>Create threads by implementing Runnable:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`class MyRunnable implements Runnable{
    public void run(){ System.out.println("Runnable running"); }
}
Thread t = new Thread(new MyRunnable());
t.start();`}
      </SyntaxHighlighter>
    </div>
  ),

  "Thread Life Cycle": (
    <div>
      <p>Thread states: New → Runnable → Running → Waiting → Terminated</p>
    </div>
  ),

  "Thread Priorities": (
    <div>
      <p>Set priority to influence scheduler:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`Thread t = new Thread();
t.setPriority(Thread.MAX_PRIORITY);`}
      </SyntaxHighlighter>
    </div>
  ),

  "Synchronization": (
    <div>
      <p>Control concurrent access:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`class Counter {
    int count = 0;
    synchronized void increment(){ count++; }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Inter-thread Communication": (
    <div>
      <p>Using wait(), notify(), notifyAll() for coordination</p>
    </div>
  ),

  // ----------- Topic 11: Java I/O -----------
  "File Handling": (
    <div>
      <p>
        Java allows reading/writing files using <b>FileReader</b>, <b>FileWriter</b>, <b>BufferedReader</b>, <b>BufferedWriter</b>.
      </p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`import java.io.*;

public class FileExample {
    public static void main(String[] args) throws IOException {
        BufferedWriter writer = new BufferedWriter(new FileWriter("example.txt"));
        writer.write("Hello Java File I/O!");
        writer.close();

        BufferedReader reader = new BufferedReader(new FileReader("example.txt"));
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
        reader.close();
    }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "BufferedReader & BufferedWriter": (
    <div>
      <p>Buffered streams are faster because they use an internal buffer.</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`BufferedWriter bw = new BufferedWriter(new FileWriter("output.txt"));
bw.write("Buffered write example");
bw.close();

BufferedReader br = new BufferedReader(new FileReader("output.txt"));
String line = br.readLine();
System.out.println(line);
br.close();`}
      </SyntaxHighlighter>
    </div>
  ),

  "PrintWriter": (
    <div>
      <p>PrintWriter simplifies writing formatted text.</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`import java.io.*;

PrintWriter pw = new PrintWriter("output.txt");
pw.println("Hello PrintWriter!");
pw.printf("Number: %d", 100);
pw.close();`}
      </SyntaxHighlighter>
    </div>
  ),

  "Object Streams": (
    <div>
      <p>
        Java allows saving objects to files using <b>ObjectOutputStream</b> and reading using <b>ObjectInputStream</b>.
      </p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`import java.io.*;

class Person implements Serializable {
    String name;
    int age;
    Person(String name, int age){ this.name=name; this.age=age;}
}

public class ObjectStreamExample {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("person.dat"));
        oos.writeObject(new Person("Ravindra", 30));
        oos.close();

        ObjectInputStream ois = new ObjectInputStream(new FileInputStream("person.dat"));
        Person p = (Person) ois.readObject();
        System.out.println(p.name + " - " + p.age);
        ois.close();
    }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Serialization": (
    <div>
      <p>Serialization converts objects to a byte stream to save to a file or transfer over network.</p>
    </div>
  ),

  "Deserialization": (
    <div>
      <p>Deserialization restores the object from byte stream.</p>
    </div>
  ),

  // ----------- Topic 12: Java Networking -----------
  "Socket Programming": (
    <div>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`import java.io.*;
import java.net.*;

public class ClientExample {
    public static void main(String[] args) throws IOException {
        Socket socket = new Socket("localhost", 5000);
        PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
        out.println("Hello Server!");
        socket.close();
    }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "ServerSocket": (
    <div>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`import java.io.*;
import java.net.*;

public class ServerExample {
    public static void main(String[] args) throws IOException {
        ServerSocket server = new ServerSocket(5000);
        Socket client = server.accept();
        BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
        System.out.println("Received: " + in.readLine());
        client.close();
        server.close();
    }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Client-Server Example": (
    <div>
      <p>Combining ServerSocket and Socket allows building simple chat programs.</p>
    </div>
  ),

  "Datagram Sockets": (
    <div>
      <p>UDP networking using <b>DatagramSocket</b> and <b>DatagramPacket</b>.</p>
    </div>
  ),

  "URL Class": (
    <div>
      <p>Java can read resources from web using <b>java.net.URL</b>.</p>
    </div>
  ),

  "URLConnection": (
    <div>
      <p>Advanced HTTP operations using URLConnection.</p>
    </div>
  ),

  // ----------- Topic 13: Java JDBC -----------
  "Introduction to JDBC": (
    <div>
      <p>JDBC allows Java to connect to databases.</p>
    </div>
  ),

  "JDBC Drivers": (
    <div>
      <p>Different types: Type-1, Type-2, Type-3, Type-4</p>
    </div>
  ),

  "Database Connection": (
    <div>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`import java.sql.*;
Connection con = DriverManager.getConnection(
    "jdbc:mysql://localhost:3306/mydb","root","password");`}
      </SyntaxHighlighter>
    </div>
  ),

  "Executing Queries": (
    <div>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`Statement stmt = con.createStatement();
ResultSet rs = stmt.executeQuery("SELECT * FROM students");
while(rs.next()){
    System.out.println(rs.getString("name"));
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "ResultSet": (
    <div>
      <p>Stores query results. Use rs.next() to iterate.</p>
    </div>
  ),

  "PreparedStatement": (
    <div>
      <p>Prevents SQL injection and allows dynamic queries.</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`PreparedStatement ps = con.prepareStatement("INSERT INTO students(name,age) VALUES(?,?)");
ps.setString(1, "Ravindra");
ps.setInt(2, 30);
ps.executeUpdate();`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----------- Topic 14: Java Generics -----------
  "Generic Classes": (
    <div>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`class Box<T> {
    private T t;
    public void set(T t){ this.t=t; }
    public T get(){ return t; }
}

Box<Integer> box = new Box<>();
box.set(123);
System.out.println(box.get());`}
      </SyntaxHighlighter>
    </div>
  ),

  "Generic Methods": (
    <div>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`public <T> void print(T data){
    System.out.println(data);
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Bounded Types": (
    <div>
      <p>Restrict generic type to certain class/interface: <code>&lt;T extends Number&gt;</code></p>
    </div>
  ),

  "Type Erasure": (
    <div>
      <p>Java removes generic type info at runtime.</p>
    </div>
  ),

  "Wildcard Types": (
    <div>
      <p>Use ? for unknown types: <code>List&lt;?&gt; list</code>.</p>
    </div>
  ),

  "Generic Collections": (
    <div>
      <p>Collections with generics: <code>List&lt;String&gt; names = new ArrayList&lt;&gt;();</code></p>
    </div>
  ),

  "Lambda Expressions": (
    <div>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`List<Integer> numbers = Arrays.asList(1,2,3,4,5);
numbers.forEach(n -> System.out.println(n));`}
      </SyntaxHighlighter>
    </div>
  ),

  "Functional Interfaces": (
    <div>
      <p>An interface with a single abstract method, e.g., Runnable.</p>
    </div>
  ),

  "Streams API": (
    <div>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`List<String> names = Arrays.asList("Ravi","Anil","Sunil");
names.stream().filter(n -> n.startsWith("R"))
     .forEach(System.out::println);`}
      </SyntaxHighlighter>
    </div>
  ),

  "Optional Class": (
    <div>
      <p>Handle null values safely: <code>Optional&lt;String&gt; name = Optional.ofNullable(null);</code></p>
    </div>
  ),

  "Method References": (
    <div>
      <p>Shorthand for lambda: <code>System.out::println</code>.</p>
    </div>
  ),

  "Default Methods": (
    <div>
      <p>Interfaces can have default implementations for methods.</p>
    </div>
  ),

  "Modules": (
    <div>
      <p>Java 9 introduced modules for better code encapsulation.</p>
    </div>
  ),

  "JShell": (
    <div>
      <p>Interactive Java shell for testing code snippets.</p>
    </div>
  ),

  "Collection Factory Methods": (
    <div>
      <p>Create immutable collections: <code>List&lt;String&gt; names = List.of("Ravi","Anil");</code></p>
    </div>
  ),

  "Private Interface Methods": (
    <div>
      <p>Interfaces can have private helper methods for reuse.</p>
    </div>
  ),

  "Process API": (
    <div>
      <p>Better API to manage OS processes.</p>
    </div>
  ),

  "HTTP Client": (
    <div>
      <p>New HTTP client in Java 11 supports async requests.</p>
    </div>
  ),

  // ----------- Topic 17: Java Design Patterns -----------
  "Singleton Pattern": (
    <div>
      <p>Ensure only one instance of a class exists:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`class Singleton {
    private static Singleton instance;
    private Singleton(){}
    public static Singleton getInstance(){
        if(instance == null){
            instance = new Singleton();
        }
        return instance;
    }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Factory Pattern": (
    <div>
      <p>Creates objects without exposing creation logic.</p>
    </div>
  ),

  "Observer Pattern": (
    <div>
      <p>Defines a dependency between objects; when one changes, observers are notified.</p>
    </div>
  ),

  "Decorator Pattern": (
    <div>
      <p>Add functionality dynamically.</p>
    </div>
  ),

  "Adapter Pattern": (
    <div>
      <p>Convert one interface to another expected interface.</p>
    </div>
  ),

  "Strategy Pattern": (
    <div>
      <p>Define a family of algorithms, encapsulate each one, make them interchangeable.</p>
    </div>
  ),

  // ----------- Topic 18: Java Best Practices -----------
  "Code Conventions": (
    <div>
      <p>Follow naming conventions, proper indentation, and modular code.</p>
    </div>
  ),

  "Exception Handling Best Practices": (
    <div>
      <p>Use specific exceptions, log errors, clean resources in finally blocks.</p>
    </div>
  ),

  "Effective Use of Collections": (
    <div>
      <p>Choose correct collection for performance and thread-safety.</p>
    </div>
  ),

  "Threading Best Practices": (
    <div>
      <p>Avoid deadlocks, synchronize shared resources carefully.</p>
    </div>
  ),

  "Memory Management Tips": (
    <div>
      <p>Use efficient data structures, remove unused references for GC.</p>
    </div>
  ),

  "Performance Optimization": (
    <div>
      <p>Minimize object creation, use streams/lambdas wisely, cache results.</p>
    </div>
  ),

  // ----------- Topic 19: Projects & Interview -----------
  "Mini Projects": (
    <div>
      <p>Examples: Calculator, To-Do List, Student Management System</p>
    </div>
  ),

  "Portfolio Projects": (
    <div>
      <p>Examples: Banking System, E-commerce App, Chat Application</p>
    </div>
  ),

  "Java Interview Questions": (
    <div>
      <p>Basic questions: OOP concepts, loops, arrays, string manipulation.</p>
    </div>
  ),

  "Advanced Interview Questions": (
    <div>
      <p>Advanced: Multithreading, Streams API, JDBC, Generics, Design Patterns</p>
    </div>
  ),

  "Coding Challenges": (
    <div>
      <p>Practice problems: Sorting algorithms, recursion, data structures.</p>
    </div>
  ),

  "Mock Interviews": (
    <div>
      <p>Simulate interviews with questions on fundamentals, coding, and projects.</p>
    </div>
  ),

  "Complete Example": (
    <div>
      <p>This example combines multiple topics: OOP, Collections, Streams, I/O:</p>
      <SyntaxHighlighter language="java" style={coy} showLineNumbers>
        {`import java.util.*;
import java.io.*;

class Student implements Serializable {
    String name;
    int marks;
    Student(String n, int m){ name=n; marks=m; }
}

public class CompleteExample {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        List<Student> students = new ArrayList<>();
        students.add(new Student("Ravi", 85));
        students.add(new Student("Anil", 90));

        // Save to file
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("students.dat"));
        oos.writeObject(students);
        oos.close();

        // Read from file
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream("students.dat"));
        List<Student> readStudents = (List<Student>) ois.readObject();
        ois.close();

        // Stream processing
        readStudents.stream()
            .filter(s -> s.marks >= 85)
            .forEach(s -> System.out.println(s.name + ": " + s.marks));
    }
}`}
      </SyntaxHighlighter>
    </div>
  )
};
