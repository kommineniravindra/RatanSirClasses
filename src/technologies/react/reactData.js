import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

export const reactData = {
  "What is React?": (
    <div>
      <p>
        React is a popular JavaScript library developed by Facebook for building
        fast and interactive user interfaces.
      </p>
      <ul>
        <li>Component-based</li>
        <li>Virtual DOM for performance</li>
        <li>One-way data flow</li>
        <li>Large ecosystem</li>
      </ul>
    </div>
  ),

  "Importance of React": (
    <div>
      <p>Why React is important:</p>
      <ul>
        <li>Faster development with reusable components</li>
        <li>Cross-platform apps (React Native)</li>
        <li>Large community and ecosystem</li>
      </ul>
    </div>
  ),

  "History of React": (
    <div>
      <p>
        React was created by Jordan Walke at Facebook in 2011 and open-sourced
        in 2013.
      </p>
    </div>
  ),

  "React Versions": (
    <div>
      <p>Some key React versions:</p>
      <ul>
        <li>v16 – Introduced Fiber architecture</li>
        <li>v16.8 – Hooks were added</li>
        <li>v17 – Gradual upgrade improvements</li>
        <li>v18 – Automatic batching, concurrent rendering</li>
      </ul>
    </div>
  ),

  "Setting up Environment": (
    <div>
      <p>Ways to set up React:</p>
      <ul>
        <li>Using Create React App (CRA)</li>
        <li>Using Vite (faster dev environment)</li>
        <li>Manual setup with Webpack + Babel</li>
      </ul>
    </div>
  ),

  "Create React App (CRA)": (
    <div>
      <p>Create React App setup:</p>
      <SyntaxHighlighter language="bash" style={coy}>
        {`npx create-react-app my-app
cd my-app
npm start`}
      </SyntaxHighlighter>
    </div>
  ),

  "Vite with React": (
    <div>
      <p>Vite setup for React:</p>
      <SyntaxHighlighter language="bash" style={coy}>
        {`npm create vite@latest my-app
cd my-app
npm install
npm run dev`}
      </SyntaxHighlighter>
    </div>
  ),

  "JSX Introduction": (
    <div>
      <p>JSX lets you write HTML-like syntax inside JavaScript:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`const element = <h1>Hello, JSX!</h1>;

// Without JSX
const element = React.createElement("h1", null, "Hello, JSX!");`}
      </SyntaxHighlighter>
    </div>
  ),

  "Components": (
    <div>
      <p>Components are building blocks of React:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`function Welcome() {
  return <h1>Hello, React!</h1>;
}

export default Welcome;`}
      </SyntaxHighlighter>
    </div>
  ),

  "Props": (
    <div>
      <p>Props let you pass data into components:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

export default function App() {
  return <Greeting name="Alice" />;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "State": (
    <div>
      <p>State holds dynamic data inside components:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

export default Counter;`}
      </SyntaxHighlighter>
    </div>
  ),

  "Events Handling": (
    <div>
      <p>Handling events in React:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`function Button() {
  const handleClick = () => {
    alert("Button clicked!");
  };

  return <button onClick={handleClick}>Click Me</button>;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Conditional Rendering": (
    <div>
      <p>Render different UI based on conditions:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`function UserStatus({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in</h1>}
    </div>
  );
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Lists & Keys": (
    <div>
      <p>Rendering lists with keys:</p>
      <SyntaxHighlighter language="javascript" style={coy}>
        {`function FruitList() {
  const fruits = ["Apple", "Banana", "Mango"];
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}`}
      </SyntaxHighlighter>
    </div>
  ),
};
