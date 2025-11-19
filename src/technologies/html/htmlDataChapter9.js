// import { color } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy} from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "html", children }) => (
  <SyntaxHighlighter language={language} style={coy}>
    {children}
  </SyntaxHighlighter>
);

export const htmlDataChapter9 = {
  Introduction: (
    <div>
      <h3>Q. What is the purpose of Semantic Elements?</h3>
      <p>
        <b>Ans:</b> Semantic elements clearly describe the meaning of the
        content on a webpage.
        <br />
        <b>Browsers:</b> To display content correctly. <br />
        <b>Search Engines:</b> To understand the page structure for better
        ranking (SEO). <br />
        <b>Developers:</b> To write cleaner, more readable code.
      </p>

      <h3>Q. Explain the Semantic elements given in HTML5?</h3>
      <p>
        <b>Ans:</b> The web page contains 5 main parts:
        <ul>
          <li>
            Header – <code>&lt;header&gt;</code>
          </li>
          <li>
            Footer – <code>&lt;footer&gt;</code>
          </li>
          <li>
            Left side links – <code>&lt;aside&gt;</code>
          </li>
          <li>
            Right side links – <code>&lt;aside&gt;</code>
          </li>
          <li>
            Main content – <code>&lt;main&gt;</code>,{" "}
            <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>
          </li>
        </ul>
      </p>

      <h3>Q. Explain before & after semantic element?</h3>

      <b>Without Semantic Elements (BAD ❌)</b>
      <CodeBlock>
        {`<div>Header information</div>
<div>Main information</div>
<div>Footer information</div>
<div>Right side information</div>
<div>Left side information</div>`}
      </CodeBlock>

      <b>With Semantic Elements (GOOD ✅)</b>
      <CodeBlock>
        {`<header>Header information</header>
<footer>Footer information</footer>
<main>Main information</main>
<aside>Right/Left side information</aside>`}
      </CodeBlock>
    </div>
  ),

  "Header Section": (
    <div>
      <p>
        Represents the header of the webpage. It may contain:
        <ul>
          <li>
            Heading of the page – <code>&lt;h1&gt;</code>
          </li>
          <li>
            Company logo – <code>&lt;img&gt;</code>
          </li>
          <li>
            Navigation bar – <code>&lt;nav&gt;</code> with{" "}
            <code>&lt;a&gt;</code> links
          </li>
          <li>
            Search bar – <code>&lt;input&gt;</code>
          </li>
        </ul>
      </p>
      <CodeBlock>
        {`<header>
  <img src="logo.png" alt="Logo not available" />
  <h1>My Website:: Sathyatech</h1>
  <nav>
    <a href='home.html'>Home</a>
    <a href='veg.html'>Veg</a>
    <a href='nonveg.html'>Non-Veg</a>
    <a href='contactus.html'>ContactUs</a>
    <a href='aboutus.html'>AboutUs</a>
  </nav>
  <input type='text' placeholder='Search the item...' />
</header>`}
      </CodeBlock>
    </div>
  ),

  "Footer Section": (
    <div>
      <p>
        Represents the footer of the webpage. It contains:
        <ul>
          <li>Copyright information</li>
          <li>Social media icons</li>
          <li>Security & policy links</li>
        </ul>
      </p>
      <CodeBlock>
        {`<footer>
  <p>&copy; 2024 My Website. All rights reserved.</p>
  <h1>Follow Us on Social Media</h1>
  <i class="fa-brands fa-whatsapp"></i>
  <i class="fa-brands fa-twitter"></i>
  <i class="fa-brands fa-facebook"></i>
</footer>`}
      </CodeBlock>
    </div>
  ),

  "Aside Section": (
    <div>
      <p>
        Represents sidebar links, which can appear on the left or right side of
        the page.
      </p>
      <CodeBlock>
        {`<aside>
  <h3>HTML Tutorial</h3>
  <ul>
    <li><a href="intro.html">HTML Introduction</a></li>
    <li><a href="text.html">Text Formatting Tags</a></li>
    <li><a href="list.html">HTML List</a></li>
    <li><a href="tables.html">HTML Tables</a></li>
  </ul>
</aside>`}
      </CodeBlock>
    </div>
  ),

  "Main Section": (
    <div>
      <ul>
        <li>
          The <code>&lt;main&gt;</code> tag represents the{" "}
          <b>main content area</b> of a webpage.
        </li>
        <li>
          It contains the content that is unique to that page (not repeated
          across pages like headers, footers, or sidebars).
        </li>
        <li>
          A page should have only one <code>&lt;main&gt;</code> element.
        </li>
      </ul>

      <h3>Q. What can we include inside &lt;main&gt;?</h3>
      <p>
        Inside the <code>&lt;main&gt;</code> tag, we can include:
      </p>
      <ul>
        <li>
          <code>&lt;article&gt;</code> — Represents independent and
          self-contained content.
        </li>
        <li>
          <code>&lt;section&gt;</code> — Groups related content or articles.
        </li>
        <li>
          <code>&lt;details&gt;</code> and <code>&lt;summary&gt;</code> — For
          collapsible or hidden information.
        </li>
      </ul>

      <h3>Q. What is the purpose of &lt;article&gt; tag?</h3>
      <p>
        <b>Ans:</b> The <code>&lt;article&gt;</code> tag is used for content
        that can stand alone, such as blog posts, news articles, or product
        descriptions.
      </p>

      <div>
        <article>
          <p>
            Below is an example of using <code>&lt;article&gt;</code> inside{" "}
            <code>&lt;main&gt;</code>:
          </p>
          <CodeBlock>
            {`<main>
  <article>
    <h2>Exploring Microservices</h2>
    <p>Microservices break large applications into smaller, manageable services.</p>
  </article>
</main>`}
          </CodeBlock>
        </article>
      </div>

      <h3>Q. What is the purpose of &lt;section&gt; tag?</h3>
      <p>
        <b>Ans:</b> The <code>&lt;section&gt;</code> tag groups related articles
        content together. It’s often used to organize the page into the
        sections.
      </p>

      <CodeBlock>
        {`<section>
  <article>
    <h2>Article 1: The Importance of Semantic HTML</h2>
    <p>Semantic HTML improves accessibility, SEO, and makes your code more readable and maintainable.</p>
  </article>

  <article>
    <h2>Article 2: Advantages of Microservices</h2>
    <p>Microservices architecture helps build scalable and maintainable applications by dividing them into smaller services.</p>
  </article>
</section>`}
      </CodeBlock>

      <h3>Q. What is the purpose of &lt;details&gt; and &lt;summary&gt;?</h3>
      <p>
        <b>Ans:</b> The <code>&lt;details&gt;</code> tag is used to create
        expandable or collapsible content, and <code>&lt;summary&gt;</code>{" "}
        provides the clickable title for it.
      </p>

      <CodeBlock>
        {`<details>
  <summary>TCS Information</summary>
  <p>Tata Consultancy Services (TCS) is a global leader in IT services, consulting, and business solutions. Headquartered in Mumbai, India, TCS is a subsidiary of the Tata Group, one of India's largest and oldest conglomerates.</p>
</details>

<details>
  <summary>Wipro Information</summary>
  <p>Wipro Limited is a leading global information technology, consulting, and business process services company. Headquartered in Bengaluru, India, Wipro leverages cognitive computing, hyper-automation, robotics, cloud, analytics, and emerging technologies to help clients adapt to the digital world.</p>
</details>
`}
      </CodeBlock>

      <details>
        <summary>Click to view company info</summary>
        <p>
          TCS, Infosys, and Wipro are global leaders in IT services, helping
          clients across the world with digital transformation.
        </p>
      </details>
    </div>
  ),

  "Other Elements": (
    <div>
    <ol>
      <li>
        <code>&lt;figure&gt;</code> &amp; <code>&lt;figcaption&gt;</code> – For images with captions.
      </li>
      <li>
        <code>&lt;code&gt;</code> – For displaying formatted code blocks.
      </li>
      <li>
        <code>&lt;kbd&gt;</code> – For keyboard shortcuts.
      </li>
      <li>
        <code>&lt;meter&gt;</code> – For known range measurements (like skill or rating).
      </li>
      <li>
        <code>&lt;progress&gt;</code> – For tracking completion of a process.
      </li>
    </ol>

      <p> <code>&lt;figure&gt;</code> & <code>&lt;figcaption&gt;</code> → Used to group images or diagrams with captions..</p>
      <p></p>
      <CodeBlock>
        {`<figure>
  <img src="author.jpg" alt="Author" width="300" />
  <figcaption>He is a great person.</figcaption>
</figure>`}
      </CodeBlock>
    
    
    <p> <code>&lt;code&gt;</code> → For displaying formatted code blocks.</p>
      <CodeBlock>
{`public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`}
          </CodeBlock>

    <p><code>&lt;kbd&gt;</code> – For keyboard shortcuts.</p>
    
    <CodeBlock>
      {`To save your progress, press <kbd>Ctrl</kbd> + <kbd>S</kbd>.`}
    </CodeBlock>

    <p><code>&lt;progress&gt;</code> – For tracking completion of a process.
Represents the progress of a task, such as uploading, downloading, or loading.
        </p>

      <CodeBlock>
        {`<progress value="60" max="100">60%</progress>`}
      </CodeBlock>

<p><code>&lt;meter&gt;</code> – For Battery level, Skill level, or Ratings.</p>

<CodeBlock>{`<meter
  value="50"
  min="0"
  max="100"
  low="40"
  high="80"
  optimum="90"
  >
</meter>
`}</CodeBlock>


<CodeBlock>
  {`Skill Level: <meter value="9" min="0" max="100" low="40" high="80" optimum="90"></meter>
Skill Level: <meter value="0.7" min="0" max="1" >70%</meter>
Uploading: <progress value="40" max="100">40%</progress>`}
</CodeBlock>

    </div>
),


};
