// src/technologies/css/cssData.js
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

export const cssData = {
  // ----- CSS Introduction -----
  "What is CSS?": (
    <div>
      <p>
        CSS (Cascading Style Sheets) is a language used to style HTML elements.
        It controls layout, colors, fonts, spacing, and responsiveness of
        web pages.
      </p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Why Use CSS?": (
    <div>
      <p>
        CSS separates content from presentation, making websites easier to
        maintain and more visually appealing. It allows consistent styling and
        responsive design.
      </p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`h1 {
  color: navy;
  text-align: center;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "History of CSS": (
    <div>
      <p>
        CSS was first proposed in 1994 by Håkon Wium Lie. It became a W3C
        standard in 1996. CSS has evolved through multiple levels (CSS1, CSS2,
        CSS3) to support modern web styling.
      </p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`/* CSS1 supported basic styles like fonts, colors, margins */
p {
  color: red;
  font-size: 16px;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "How CSS Works": (
    <div>
      <p>
        CSS works by applying rules (selectors + properties + values) to HTML
        elements. Styles cascade based on specificity and inheritance.
      </p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`/* Selector targets all <p> elements */
p {
  color: green;
  margin: 10px;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Inline vs Internal vs External": (
    <div>
      <p>There are three ways to apply CSS:</p>
      <ul>
        <li><strong>Inline:</strong> Inside HTML element (style attribute)</li>
        <li><strong>Internal:</strong> Inside {"<style>"} tag in HTML head</li>
        <li><strong>External:</strong> In a separate .css file linked via {"<link>"}</li>
      </ul>
      <SyntaxHighlighter language="html" style={coy} showLineNumbers>
        {`<!-- Inline -->
<p style="color:red;">Hello World</p>

<!-- Internal -->
<style>
  p { color: blue; }
</style>

<!-- External -->
<link rel="stylesheet" href="styles.css">`}
      </SyntaxHighlighter>
    </div>
  ),

  "CSS Syntax": (
    <div>
      <p>
        A CSS rule has three parts: selector, property, and value. Example:
      </p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`selector {
  property: value;
}

p {
  color: purple;
  font-size: 18px;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  // ---------------- CSS Basics ----------------
  "Selectors": (
    <div>
      <p>
        CSS selectors target HTML elements to apply styles. They include element,
        class, ID, group, attribute, pseudo-class, and pseudo-element selectors.
      </p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`/* Element selector */
p {
  color: teal;
}

/* Class selector */
.highlight {
  background-color: yellow;
}

/* ID selector */
#header {
  background-color: navy;
  color: white;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Colors": (
    <div>
      <p>
        CSS supports colors via names, HEX, RGB, RGBA, HSL, and HSLA formats.
      </p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`p {
  color: red;                /* Named color */
  background-color: #f0f0f0; /* HEX */
}

div {
  color: rgb(0, 128, 0);         /* RGB */
  background-color: rgba(0, 0, 255, 0.2); /* RGBA */
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Backgrounds": (
    <div>
      <p>
        Backgrounds can be colors, images, gradients, or patterns.
      </p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`body {
  background-color: #f0f0f0;
  background-image: url('bg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Borders": (
    <div>
      <p>
        Borders define the edge of elements. You can style width, color, and type.
      </p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`p {
  border: 2px solid blue;
  border-radius: 5px; /* Rounded corners */
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Margins": (
    <div>
      <p>
        Margins define space outside elements. Can use top, right, bottom, left or shorthand.
      </p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`div {
  margin: 10px;       /* all sides */
  margin-top: 20px;   /* specific side */
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Padding": (
    <div>
      <p>
        Padding defines space inside elements between content and border.
      </p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`div {
  padding: 10px;        /* all sides */
  padding-left: 20px;   /* specific side */
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Height & Width": (
    <div>
      <p>
        You can set the size of elements using height and width. Units include px, %, em, rem, etc.
      </p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`div {
  width: 300px;
  height: 150px;
  max-width: 100%;
}`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----- Text & Fonts -----
  "Text Color": (
    <div>
      <p>Change text color with color property.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`p.lead { color: #4b5563; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Text Alignment": (
    <div>
      <p>Align text left, right, center, or justify.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`h2 { text-align: center; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Text Decoration": (
    <div>
      <p>Control underlines, overlines, line-through and decoration style.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`a { text-decoration: none;
         border-bottom: 2px solid transparent; 
         }
a:hover { border-bottom-color: currentColor; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Text Transformation": (
    <div>
      <p>Use text-transform to uppercase/lowercase/capitalize text.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.caps { text-transform: uppercase; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Fonts": (
    <div>
      <p>Set font-family, font-size, font-weight and font-style for typography.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`body { font-family: "Inter", system-ui, sans-serif; 
      font-size: 16px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Google Fonts": (
    <div>
      <p>Load fonts from Google Fonts via &lt;link&gt; or @import, then use them in CSS.</p>
      <SyntaxHighlighter language="html" style={coy} showLineNumbers>
        {`<!-- in head -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">`}
      </SyntaxHighlighter>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`body { font-family: "Inter", sans-serif; }`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----- Box Model (fine-grained) -----
  "Content Area": (
    <div>
      <p>The content box holds text and inline content — its size is affected by box-sizing.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.content { width: 300px; height: 120px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Padding (box)": (
    <div>
      <p>Padding creates spacing inside the element around the content.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.card { padding: 24px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Border (box)": (
    <div>
      <p>Border sits between padding and margin — can be styled in many ways.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.box { border: 2px dashed #94a3b8; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Margin (box)": (
    <div>
      <p>Margin is the outer spacing between elements; vertical margins can collapse.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.section { margin: 40px 0; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Outline": (
    <div>
      <p>Outline draws outside the border and does not affect layout (useful for focus states).</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`button:focus { outline: 3px solid rgba(59,130,246,0.4); outline-offset: 2px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Box-Sizing": (
    <div>
      <p>box-sizing: border-box includes padding and border in width/height calculations (recommended).</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`* { box-sizing: border-box; }`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----- Positioning -----
  "Static": (
    <div>
      <p>Default position: elements flow in normal document order.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`/* default — no positioning needed */ .item { position: static; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Relative": (
    <div>
      <p>Relative allows offsetting an element from its normal position without affecting document flow.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.badge { position: relative; top: -6px; left: 8px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Absolute": (
    <div>
      <p>Absolute positions relative to the nearest positioned ancestor (or viewport).</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.tooltip { position: absolute; top: 100%; left: 0; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Fixed": (
    <div>
      <p>Fixed positions an element relative to the viewport — good for sticky headers.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.topbar { position: fixed; top: 0; left: 0; right: 0; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Sticky": (
    <div>
      <p>Sticky behaves like relative until crossing a threshold, then becomes fixed (useful for anchors).</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.toc { position: sticky; top: 16px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Z-Index": (
    <div>
      <p>z-index controls stacking order for positioned elements (higher = front).</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.modal { position: fixed; z-index: 1000; } .backdrop { z-index: 900; }`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----- Layout (Flexbox & Grid) -----
  "Display Property": (
    <div>
      <p>display sets layout behavior: block, inline, flex, grid, inline-block, none, etc.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.row { display: flex; } .hidden { display: none; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Flexbox Basics": (
    <div>
      <p>Flexbox makes 1D layout easy — use container with display:flex.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.container { display: flex; gap: 12px; } .item { flex: 1; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Flexbox Alignment": (
    <div>
      <p>Use justify-content and align-items to align children along main and cross axes.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.container { display:flex; justify-content:center; align-items:center; height:200px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Grid Basics": (
    <div>
      <p>CSS Grid is a two-dimensional layout system for rows and columns.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.grid { display: grid; grid-template-columns: 1fr 2fr; gap: 16px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Grid Areas": (
    <div>
      <p>Define named grid areas then place items using grid-area for semantic layout.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.layout { grid-template-areas: "nav header" "nav main"; } .header { grid-area: header; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Responsive Grid": (
    <div>
      <p>Use auto-fit / minmax with grid to create responsive grids.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.cards { display:grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap:16px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----- Advanced Styling -----
  "Pseudo-classes": (
    <div>
      <p>Pseudo-classes target element states like :hover, :focus, :nth-child().</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`a:hover { text-decoration: underline; } li:nth-child(odd) { background:#f7fafc; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Pseudo-elements": (
    <div>
      <p>Pseudo-elements style parts of elements like ::before and ::after.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.btn::after { content:"»"; margin-left:8px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Opacity": (
    <div>
      <p>Use opacity to set transparency; use rgba for background transparency while keeping children opaque if needed.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.overlay { background: rgba(0,0,0,0.5); } .faded { opacity: 0.6; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Transitions": (
    <div>
      <p>Transitions animate property changes smoothly when values change.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.btn { transition: background-color 0.2s ease; } .btn:hover { background-color:#0ea5e9; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Animations": (
    <div>
      <p>@keyframes let you build complex animations; use animation shorthand to apply.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`@keyframes float { to { transform: translateY(-8px);} }
.icon { animation: float 1.5s ease-in-out infinite; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Transforms": (
    <div>
      <p>Transforms let you translate, rotate, scale and skew elements in 2D/3D space.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.card:hover { transform: translateY(-6px) scale(1.02); }`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----- Responsive Design -----
  "Media Queries": (
    <div>
      <p>Use media queries to apply styles at certain viewport widths.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`@media (max-width: 600px) {
  .nav { display: none; }
}`}
      </SyntaxHighlighter>
    </div>
  ),

  "Mobile First Design": (
    <div>
      <p>Design for small screens first, then add breakpoints for larger screens.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`/* mobile default */
.card { padding: 12px; }
/* larger screens */
@media (min-width: 768px) { .card { padding: 24px; } }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Responsive Images": (
    <div>
      <p>Use srcset/sizes or picture to serve appropriate image resolutions.</p>
      <SyntaxHighlighter language="html" style={coy} showLineNumbers>
        {`<img src="hero-800.jpg" srcset="hero-400.jpg 400w, hero-800.jpg 800w" sizes="(max-width:600px)100vw,800px" alt="Hero">`}
      </SyntaxHighlighter>
    </div>
  ),

  "Viewport Meta Tag": (
    <div>
      <p>Include the viewport meta tag to make responsive layouts work on mobile devices.</p>
      <SyntaxHighlighter language="html" style={coy} showLineNumbers>
        {`<meta name="viewport" content="width=device-width, initial-scale=1">`}
      </SyntaxHighlighter>
    </div>
  ),

  "CSS Units (px, em, rem, %)": (
    <div>
      <p>px is absolute-ish, em is relative to parent font-size, rem to root, % relative to container.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`h1 { font-size: 2rem; } /* 2x root font-size */ .text { width: 80%; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "CSS Variables": (
    <div>
      <p>Custom properties (--var) let you store values and reuse them with var().</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`:root { --accent: #06b6d4; } .btn { background: var(--accent); }`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----- Advanced Topics -----
  "CSS Filters": (
    <div>
      <p>Filters apply image-like effects: blur, grayscale, brightness, contrast.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.thumb:hover img { filter: saturate(1.2) contrast(1.05); }`}
      </SyntaxHighlighter>
    </div>
  ),

  "CSS Clip Path": (
    <div>
      <p>clip-path clips element to a shape (circle, polygon) for creative layouts.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.avatar { clip-path: circle(50% at 50% 50%); }`}
      </SyntaxHighlighter>
    </div>
  ),

  "CSS Shapes": (
    <div>
      <p>CSS Shapes allow wrapping text around custom shapes using shape-outside.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.float-img { float:left; shape-outside: circle(50%); width:200px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "CSS Masking": (
    <div>
      <p>Masking uses an image or gradient to control element visibility; similar to clipping.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.hero { -webkit-mask-image: linear-gradient(#000, transparent); }`}
      </SyntaxHighlighter>
    </div>
  ),

  "CSS Variables (Custom Props)": (
    <div>
      <p>Custom properties can be updated at runtime (useful for themes).</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`body.light { --bg: #fff; } body.dark { --bg: #111; } .app { background: var(--bg); }`}
      </SyntaxHighlighter>
    </div>
  ),

  "CSS Functions": (
    <div>
      <p>Functions like calc(), clamp(), min(), max() help compute dynamic values.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.col { width: calc(50% - 12px); } .text { font-size: clamp(14px, 2.5vw, 18px); }`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----- Projects (small examples) -----
  "Portfolio Website": (
    <div>
      <p>Small layout scaffold for a portfolio (HTML + CSS).</p>
      <SyntaxHighlighter language="html" style={coy} showLineNumbers>
        {`<header class="site-header">
  <h1>Jane Doe</h1>
  <nav><!-- links --></nav>
</header>`}
      </SyntaxHighlighter>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.site-header { display:flex; justify-content:space-between; align-items:center; padding:16px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Responsive Navigation Bar": (
    <div>
      <p>Simple responsive nav that becomes a column on small screens.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.nav { display:flex; gap:12px; }
@media (max-width:600px) { .nav { flex-direction:column; } }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Image Gallery": (
    <div>
      <p>Responsive image gallery using CSS grid.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.gallery { display:grid; grid-template-columns: repeat(auto-fit, minmax(150px,1fr)); gap:8px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Landing Page": (
    <div>
      <p>Hero + CTA layout — centered content with a call-to-action button.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.hero { display:flex; align-items:center; justify-content:center; height:70vh; } .cta{ padding:12px 24px; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Animations Demo": (
    <div>
      <p>A tiny animation example using keyframes.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`@keyframes pop { from { transform:scale(.95); } to { transform:scale(1); } }
.card { animation: pop .25s ease; }`}
      </SyntaxHighlighter>
    </div>
  ),

  "CSS Grid Layout": (
    <div>
      <p>Grid layout with three columns and responsive fallback.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.layout { display:grid; grid-template-columns: 1fr 2fr 1fr; gap:16px; }
@media (max-width:800px){ .layout{ grid-template-columns:1fr; } }`}
      </SyntaxHighlighter>
    </div>
  ),

  // ----- Interview Prep -----
  "Basic CSS Questions": (
    <div>
      <p>Common basics: box-model, specificity, selectors, and the cascade.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`/* specificity demo */
#id { color:red; } /* higher specificity than .class {} */`}
      </SyntaxHighlighter>
    </div>
  ),

  "Intermediate CSS Questions": (
    <div>
      <p>Topics: flex vs grid, responsive techniques, and accessibility concerns.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.container { display:flex; } /* vs display:grid */`}
      </SyntaxHighlighter>
    </div>
  ),

  "Advanced CSS Questions": (
    <div>
      <p>Advanced: custom properties, calc/clamp, performance, and critical CSS.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.title { font-size: clamp(1rem, 4vw, 2rem); }`}
      </SyntaxHighlighter>
    </div>
  ),

  "CSS Tricks & Tips": (
    <div>
      <p>Shortcuts: use logical properties, shorthand, and prefer rems for accessibility.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`margin: 8px 12px; /* top/bottom right/left */`}
      </SyntaxHighlighter>
    </div>
  ),

  "Real-World CSS Scenarios": (
    <div>
      <p>Handling complex responsive components, legacy support and cross-browser bugs.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`.legacy .grid { display:-ms-grid; /* fallback for old IE */ }`}
      </SyntaxHighlighter>
    </div>
  ),

  "Performance & Best Practices": (
    <div>
      <p>Minimize CSS, avoid deep selectors, use critical CSS and defer non-critical styles.</p>
      <SyntaxHighlighter language="css" style={coy} showLineNumbers>
        {`/* keep selectors shallow and avoid expensive selectors */ .card{}` }
      </SyntaxHighlighter>
    </div>
  ),
};
