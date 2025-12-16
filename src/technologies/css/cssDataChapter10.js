export const cssDataChapter10 = {
  // ----- CSS Interview Prep -----
  "Basic CSS Questions": (
    <div>
      <h4>Basic Level Questions</h4>
      <ul style={{ paddingLeft: "1.5em", lineHeight: "1.8" }}>
        <li>
          <strong>Q1: What does CSS stand for?</strong>
          <br />
          Ans: Cascading Style Sheets.
        </li>
        <li>
          <strong>
            Q2: What is the difference between class selectors and ID selectors?
          </strong>
          <br />
          Ans: An ID is unique to a page and can only be used once, while a
          class can be used multiple times. IDs have higher specificity.
        </li>
        <li>
          <strong>Q3: How do you include comments in CSS?</strong>
          <br />
          Ans: Using <code>/* comment */</code>.
        </li>
        <li>
          <strong>Q4: What is the Box Model?</strong>
          <br />
          Ans: It consists of margins, borders, padding, and the actual content.
        </li>
        <li>
          <strong>Q5: What are the three ways to insert CSS?</strong>
          <br />
          Ans: External style sheet, Internal style sheet, and Inline style.
        </li>
      </ul>
    </div>
  ),

  "Intermediate CSS Questions": (
    <div>
      <h4>Intermediate Level Questions</h4>
      <ul style={{ paddingLeft: "1.5em", lineHeight: "1.8" }}>
        <li>
          <strong>
            Q1: What is the difference between 'display: none' and 'visibility:
            hidden'?
          </strong>
          <br />
          Ans: <code>display: none</code> removes the element from the document
          flow (no space occupied). <code>visibility: hidden</code> hides the
          element but it still takes up space.
        </li>
        <li>
          <strong>Q2: What is a pseudo-class?</strong>
          <br />
          Ans: A pseudo-class defines a special state of an element (e.g.,{" "}
          <code>:hover</code>, <code>:focus</code>).
        </li>
        <li>
          <strong>Q3: Explain the 'z-index' property.</strong>
          <br />
          Ans: It specifies the stack order of an element. An element with
          greater stack order is always in front of an element with a lower
          stack order. Works only on positioned elements.
        </li>
        <li>
          <strong>Q4: What are CSS Sprites?</strong>
          <br />
          Ans: Combing multiple small images into one larger image to reduce
          HTTP requests.
        </li>
      </ul>
    </div>
  ),

  "Advanced CSS Questions": (
    <div>
      <h4>Advanced Level Questions</h4>
      <ul style={{ paddingLeft: "1.5em", lineHeight: "1.8" }}>
        <li>
          <strong>Q1: How does Flexbox differ from Grid?</strong>
          <br />
          Ans: Flexbox is one-dimensional (row OR column), good for aligning
          components. Grid is two-dimensional (rows AND columns), good for
          overall page layout.
        </li>
        <li>
          <strong>Q2: What is the 'content' property used for?</strong>
          <br />
          Ans: It is used with the <code>::before</code> and{" "}
          <code>::after</code> pseudo-elements to insert generated content.
        </li>
        <li>
          <strong>Q3: What is Specificity in CSS?</strong>
          <br />
          Ans: Specificity determines which style rule is applied by the
          browser. Hierarchy: Inline styles &gt; IDs &gt; Classes/Attributes
          &gt; Elements.
        </li>
        <li>
          <strong>Q4: What is the difference between px, em, and rem?</strong>
          <br />
          Ans: <code>px</code> is absolute. <code>em</code> is relative to the
          parent's font size. <code>rem</code> is relative to the root html font
          size.
        </li>
      </ul>
    </div>
  ),

  "CSS Tricks & Tips": (
    <div>
      <h4>Pro Tips</h4>
      <ul>
        <li>
          Use <code>box-sizing: border-box;</code> universally to make layout
          calculations easier.
        </li>
        <li>
          Use <code>rem</code> for font sizes and <code>em</code> for
          padding/margins to build accessible, scalable components.
        </li>
        <li>
          Use Flexbox for center alignment:{" "}
          <code>
            display: flex; justify-content: center; align-items: center;
          </code>
          .
        </li>
        <li>
          Limit the use of <code>!important</code>.
        </li>
      </ul>
    </div>
  ),

  "Real-World CSS Scenarios": (
    <div>
      <h4>Scenario Based Questions</h4>
      <p>
        <strong>Scenario:</strong> You have a div that needs to be perfectly
        centered on the screen, regardless of its size.
      </p>
      <p>
        <strong>Solution:</strong>
      </p>
      <pre
        style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}
      >{`body {
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}`}</pre>
    </div>
  ),
};
