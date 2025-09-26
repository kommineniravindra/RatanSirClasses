
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

export const javascriptData = {
  'Importance Of JavaScript': (
    <div>
      <p>
        JavaScript is a versatile scripting language used for front-end and back-end development. 
        It's essential for modern web development.
      </p>
      <p>Applications include:</p>
      <ul>
        <li>Client-side web development (DOM manipulation, event handling)</li>
        <li>Server-side development (Node.js)</li>
        <li>Mobile apps (React Native)</li>
        <li>Desktop apps (Electron)</li>
        <li>Game development (Phaser, Three.js)</li>
        <li>IoT applications</li>
      </ul>
    </div>
  ),

  'Applications using JavaScript': (
    <div>
      <p>JavaScript is widely used in:</p>
      <ul>
        <li>Front-end web development (React, Angular, Vue)</li>
        <li>Back-end web development (Node.js, Express.js)</li>
        <li>Mobile apps (React Native)</li>
        <li>Desktop apps (Electron)</li>
        <li>Game development (Phaser.js)</li>
        <li>Browser extensions</li>
        <li>IoT devices</li>
      </ul>
    </div>
  ),

  'History of JavaScript': (
    <div>
      <p>
        JavaScript was created by Brendan Eich in 1995 at Netscape Communications.
        Originally called Mocha, it was renamed to LiveScript and finally JavaScript.
      </p>
      <ul>
        <li>1995: Mocha → LiveScript → JavaScript</li>
        <li>1996: JavaScript included in Netscape Navigator 2.0</li>
        <li>1997: ECMAScript standard released</li>
        <li>2009: ES5 introduced</li>
        <li>2015: ES6 / ES2015 with classes, arrow functions, modules</li>
      </ul>
    </div>
  ),

  'JavaScript Versions': (
    <div>
      <ul>
        <li>ES1: 1997</li>
        <li>ES2: 1998</li>
        <li>ES3: 1999</li>
        <li>ES5: 2009</li>
        <li>ES6 (ES2015): 2015</li>
        <li>ES7 (ES2016) and onward: yearly updates</li>
      </ul>
    </div>
  ),

  'Parts of JavaScript': (
    <div>
      <p>JavaScript consists of:</p>
      <ul>
        <li>Core language: variables, types, operators, expressions, functions</li>
        <li>Client-side APIs: DOM, BOM, Fetch, Web Storage</li>
        <li>Server-side APIs: Node.js APIs, file system, HTTP</li>
      </ul>
    </div>
  ),

  'JavaScript Editors': (
    <div>
      <p>Popular editors for JavaScript development include:</p>
      <ul>
        <li>Visual Studio Code</li>
        <li>Sublime Text</li>
        <li>Atom</li>
        <li>WebStorm</li>
        <li>Brackets</li>
      </ul>
    </div>
  ),

  'First Script': (
    <div>
      <p>Your first JavaScript program:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`console.log('Hello, World!');`}
      </SyntaxHighlighter>
    </div>
  ),

  'How to include JavaScript?': (
    <div>
      <p>Include JS in HTML:</p>
      <SyntaxHighlighter language="html" style={coy}>
        {`<!-- Inline JavaScript -->
<script>
  console.log('Hello!');
</script>

<!-- External JavaScript -->
<script src="script.js"></script>`}
      </SyntaxHighlighter>
    </div>
  ),

  'Variables': (
    <div>
      <p>Declaring variables:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`// ES5
var name = 'John';

// ES6
let age = 30;
const country = 'USA';`}
      </SyntaxHighlighter>
      <p><b>Note:</b> Use <code>let</code> for mutable and <code>const</code> for immutable values.</p>
    </div>
  ),

  'Data Types': (
    <div>
      <p>JavaScript has primitive and reference types:</p>
      <ul>
        <li>Primitive: string, number, boolean, null, undefined, symbol, bigint</li>
        <li>Reference: objects, arrays, functions, dates</li>
      </ul>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`let name = 'Alice'; // string
let age = 25;       // number
let isStudent = true; // boolean
let person = { name: 'Alice', age: 25 }; // object`}
      </SyntaxHighlighter>
    </div>
  ),
  
  // 11. Operators
  'Operators': (
    <div>
      <p>JavaScript supports various operators:</p>
      <ul>
        <li>Arithmetic: +, -, *, /, %, ++, --</li>
        <li>Assignment: =, +=, -=, *=, /=</li>
        <li>Comparison: ==, ===, !=, !==, &lt;, &gt;, &lt;=, &gt;=</li>
        <li>Logical: &&, ||, !</li>
        <li>Bitwise: &, |, ^, ~, &lt;&lt;, &gt;&gt;</li>
      </ul>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`let a = 10;
let b = 5;

console.log(a + b); // 15
console.log(a > b && b > 0); // true
console.log(a | b); // 15 (bitwise OR)`}
      </SyntaxHighlighter>
    </div>
  ),

  // 12. Functions
  'Functions': (
    <div>
      <p>Functions are reusable blocks of code:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`// Function Declaration
function add(x, y) {
  return x + y;
}

// Function Expression
const multiply = function(x, y) {
  return x * y;
}

// Arrow Function (ES6)
const divide = (x, y) => x / y;

console.log(add(5, 10));      // 15
console.log(multiply(5, 10)); // 50
console.log(divide(10, 2));   // 5`}
      </SyntaxHighlighter>
    </div>
  ),

  // 13. Objects
  'Objects': (
    <div>
      <p>Objects store key-value pairs:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`const person = {
  name: 'Alice',
  age: 25,
  greet: function() {
    console.log('Hello, ' + this.name);
  }
};

console.log(person.name); // Alice
person.greet();           // Hello, Alice`}
      </SyntaxHighlighter>
    </div>
  ),

  // 14. Arrays
  'Arrays': (
    <div>
      <p>Arrays store multiple values:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`let fruits = ['Apple', 'Banana', 'Mango'];
fruits.push('Orange');        // Add at end
fruits.unshift('Strawberry'); // Add at beginning
console.log(fruits);

fruits.forEach(fruit => console.log(fruit));`}
      </SyntaxHighlighter>
    </div>
  ),

  // 15. Conditions
  'Conditions': (
    <div>
      <p>Conditional statements control code flow:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`let age = 18;

if (age >= 18) {
  console.log('Adult');
} else {
  console.log('Minor');
}

// Ternary Operator
let status = age >= 18 ? 'Adult' : 'Minor';
console.log(status);`}
      </SyntaxHighlighter>
    </div>
  ),

  // 16. Loops
  'Loops': (
    <div>
      <p>Loops repeat a block of code:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`// For Loop
for(let i = 0; i < 5; i++){
  console.log(i);
}

// While Loop
let j = 0;
while(j < 5){
  console.log(j);
  j++;
}

// For-of (arrays)
const fruits = ['Apple', 'Banana', 'Mango'];
for (const fruit of fruits){
  console.log(fruit);
}`}
      </SyntaxHighlighter>
    </div>
  ),

  // 17. DOM Manipulation
  'DOM Manipulation': (
    <div>
      <p>JavaScript interacts with the web page using DOM:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`// Select element
const title = document.getElementById('title');

// Change content
title.innerText = 'Hello, JavaScript!';

// Add event listener
document.getElementById('btn').addEventListener('click', () => {
  alert('Button clicked!');
});`}
      </SyntaxHighlighter>
    </div>
  ),

  // 18. ES6+ Features
  'ES6+ Features': (
    <div>
      <p>Modern JavaScript features:</p>
      <ul>
        <li>let & const</li>
        <li>Arrow functions</li>
        <li>Template literals</li>
        <li>Destructuring</li>
        <li>Modules (import/export)</li>
        <li>Promises & Async/Await</li>
      </ul>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`const person = { name: 'Alice', age: 25 };
const { name, age } = person;
console.log(\`Name: \${name}, Age: \${age}\`);

// Promise example
const fetchData = () => new Promise(resolve => resolve('Data loaded'));
fetchData().then(data => console.log(data));`}
      </SyntaxHighlighter>
    </div>
  ),

  // 19. Browser Storage
  'Browser Storage': (
    <div>
      <p>JavaScript can store data in the browser:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`// Local Storage
localStorage.setItem('name', 'Alice');
console.log(localStorage.getItem('name'));

// Session Storage
sessionStorage.setItem('age', '25');
console.log(sessionStorage.getItem('age'));

// Cookies
document.cookie = 'user=Alice; expires=Fri, 31 Dec 2025 23:59:59 GMT';`}
      </SyntaxHighlighter>
    </div>
  ),

  // 20. Error Handling & Modules
  'Error Handling & Modules': (
    <div>
      <p>Handling errors and organizing code with modules:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`// Try-catch
try {
  let result = riskyFunction();
} catch (error) {
  console.error('Error occurred:', error);
} finally {
  console.log('Always runs');
}

// Exporting module (module.js)
export const add = (a, b) => a + b;

// Importing module
import { add } from './module.js';
console.log(add(5, 3)); // 8`}
      </SyntaxHighlighter>
    </div>
  ),
};
