import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "sql", children }) => (
  <SyntaxHighlighter language={language} style={coy} showLineNumbers>
    {children}
  </SyntaxHighlighter>
);

export const sqlDataChapter1 = {
  "What is the purpose of Database?": (
    <div>
      <p>
        A database is used to <b>store, manage, and organize data</b>.
      </p>
      <p>
        In today’s world, data is everywhere, and people generate data every
        second. Data has become one of the most valuable resources, just like
        money, oil, or electricity. Businesses and governments depend on data to
        make decisions.
      </p>

      <h4>Scenarios: How People Generate Data Every Second</h4>

      <div style={{ marginBottom: "15px" }}>
        <h4>1. Walking on the street</h4>
        <div style={{ marginLeft: "20px" }}>
          <p>CCTV cameras record your movement video footage.</p>
          <p>Sensors and traffic systems capture your location and timing.</p>
        </div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h4>2. Using your mobile</h4>
        <div style={{ marginLeft: "20px" }}>
          <p>Calls, messages, GPS, apps—everything creates data.</p>
          <p>
            Smartphones also collect step count, heart rate, and other
            health-related data.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h4>3. Buying tea or snacks</h4>
        <div style={{ marginLeft: "20px" }}>
          <p>Shopkeeper maintains a sales record.</p>
          <p>Date & time of purchase.</p>
          <p>Amount spent.</p>
        </div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h4>4. Making a payment</h4>
        <div style={{ marginLeft: "20px" }}>
          <p> When you pay using UPI, card, or QR.</p>
          <p> Transaction ID</p>
          <p> Date & time</p>
          <p> Amount</p>
          <p> Merchant details</p>
        </div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h4>5. Shopping at stores or online (Amazon, Flipkart, etc.)</h4>
        <div style={{ marginLeft: "20px" }}>
          <p> Items you search or view.</p>
          <p> Items you purchase</p>
          <p> Total bill amount.</p>
        </div>
      </div>

      <details>
        <summary
          style={{
            color: "blue",
            cursor: "pointer",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Read more scenarios...
        </summary>

        <div style={{ marginBottom: "15px" }}>
          <h4>6. Social media (Facebook, Twitter, Instagram, etc.)</h4>
          <div style={{ marginLeft: "20px" }}>
            <p> Likes, comments, and shares.</p>
            <p> Photos and videos uploaded.</p>
            <p> Browsing and search activity.</p>
            <p> All of these are stored as data.</p>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4>7. Health Information</h4>
          <div style={{ marginLeft: "20px" }}>
            <p> Hospital and medical records.</p>
            <p> Medical history, diagnoses, test results</p>
            <p> Treatments, and prescriptions.</p>
            <p> All stored digitally.</p>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4>8. Using online food delivery apps (Swiggy, Zomato)</h4>
          <div style={{ marginLeft: "20px" }}>
            <p> What you search.</p>
            <p> What you order.</p>
            <p> Delivery location & order history.</p>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4>
            9. Transportation and travel (Redbus, Abhibus, MakeMyTrip, OLA,
            Uber)
          </h4>
          <div style={{ marginLeft: "20px" }}>
            <p> Bus/train ticket bookings.</p>
            <p> Flight check-ins and boarding information.</p>
            <p> Metro card swipes and travel history.</p>
            <p> Ride apps (Uber/Ola) store pickup, drop, and route data.</p>
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h4>10. Working or studying</h4>
          <div style={{ marginLeft: "20px" }}>
            <p> Attendance records.</p>
            <p> Emails sent and received.</p>
            <p> Assignments submitted.</p>
            <p> Documents created and shared.</p>
            <p> Login/logout times.</p>
          </div>
        </div>
      </details>
    </div>
  ),

  "What is Data?": (
    <div>
      <p>
        Data is a collection of <b>raw facts</b>. (That are recorded but not yet
        processed.)
      </p>
      <h5>Examples:</h5>
      <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
        <li>Your personal details (name, age, address)</li>
        <li>Your weight details.</li>
        <li>CCTV capturing your movement.</li>
        <li>Shopkeeper recording a sale...etc</li>
      </ul>
    </div>
  ),

  "What is Information?": (
    <div>
      <p>
        Information is <b>processed data</b> that has meaning and is useful.
      </p>
      <h5>Examples:</h5>
      <ol>
        <li>
          Based on your personal details (data) &rarr; Identifying your major or
          minor status.
        </li>
        <li>
          Based on your age and weight (data) &rarr; Calculating your BMI.
        </li>
        <li>
          Based on CCTV footage (data) &rarr; Checking when you crossed the
          road.
        </li>
        <li>
          Based on total sales reports from shopkeepers (data) &rarr;
          Identifying which product sold the highest.
        </li>
      </ol>
    </div>
  ),

  "What is decision making?": (
    <div>
      <p>
        Decision making is the process of <b>choosing the best action</b> based
        on information.
      </p>
      <ol>
        <li>
          Based on your personal details (data) &rarr; Identifying your major or
          minor status.
          <br />
          <i>Action: Allow or restrict access to age-restricted services.</i>
        </li>
        <li>
          Based on your age and weight (data) &rarr; Calculating your BMI.
          <br />
          <i>
            Action: If overweight, consult a doctor or follow a health plan.
          </i>
        </li>
        <li>
          Based on CCTV footage (data) &rarr; Checking when you crossed the
          road.
          <br />
          <i>
            Action: Identify the offender and take legal action (for example,
            seize evidence).
          </i>
        </li>
        <li>
          Based on total sales reports from shopkeepers (data) &rarr;
          Identifying which product sold the highest.
          <br />
          <i>Action: Increase the quantity or stock of that product.</i>
        </li>
      </ol>
      <p>
        <i>
          Note: A database stores data, which can be processed to generate
          information and support decision-making.
        </i>
      </p>
    </div>
  ),

  "What are the different ways to store data?": (
    <div>
      <p>There are different sources to store or maintain data.</p>
      <ol>
        <li>
          <b>Paper Records</b>
          <br />
          The information stored in Books.
          <br />
          Old-fashioned method.
          <br />
          <i>
            ex: Attendance registers, shopkeeper’s sales book, patient files in
            hospitals..etc
          </i>
          <br />
          <i>Limitations: Hard to search, can be lost or damaged.</i>
        </li>
        <li>
          <b>File System</b>
          <br />
          Digital files stored on computers.
          <br />
          <i>
            ex: Text files (.txt), Excel sheets, CSV files, PDFs, images, videos
          </i>
          <br />
          <i>
            Limitations: Not good for big data, multiple users, or security.
          </i>
        </li>
        <li>
          <b>Databases</b>
          <br />
          Structured digital storage for large amounts of data.
          <br />
          Provides easy access, security, and fast retrieval.
          <br />
          <i>ex: Oracle Database, MySQL, MongoDB...etc</i>
        </li>
      </ol>
    </div>
  ),

  "What is Structure Data & Unstructured Data?": (
    <div>
      <p>Data is categorized into Structured and Unstructured types.</p>
      <h4>1. Structured Data</h4>
      <p>
        Data that is organized in a <b>fixed format</b>, usually in rows and
        columns.
      </p>
      <ul>
        <li>Student records (Name, Roll Number, Marks)</li>
        <li>Bank transactions (Date, Amount, Account Number)</li>
        <li>Inventory lists (Product ID, Quantity, Price)</li>
      </ul>
      <h4>2. Unstructured Data</h4>
      <p>Data that does not have a predefined structure or format.</p>
      <ul>
        <li>
          <b>Images:</b> Photos, diagrams, scanned documents
        </li>
        <li>
          <b>Audio:</b> Songs, podcasts, voice recordings
        </li>
        <li>
          <b>Video:</b> Movies, surveillance footage, video clips
        </li>
        <li>
          <b>Graphs:</b> Social networks, relationships between entities
        </li>
        <li>
          <b>Text documents:</b> Emails, social media posts, PDFs
        </li>
      </ul>
    </div>
  ),

  "What is the Difference between relational DB vs. No-sql DB?": (
    <div>
      <p>
        <b>Relational Database (RDBMS):</b>
      </p>
      <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
        <li>
          A relational database stores data in <b>tables</b> (rows and columns).
        </li>
        <li>
          Used to store the <b>structured data</b>.
        </li>
        <li>
          {" "}
          <i>
            ex: Student records, inventory management, Banking systems...etc
          </i>
        </li>
        <li>Popular RDBMS: Oracle, MySQL, PostgreSQL.</li>
      </ul>
      <p>
        <b>NoSQL Database:</b>
      </p>
      <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
        <li>
          NoSQL databases store data in <b>key-value pairs</b> format using
          Collections & documents.
        </li>
        <li>
          Used to store the <b>unstructured data</b>.
        </li>
        <li>
          <i>ex: social media images, videos, graphs ...etc</i>
        </li>
        <li>Popular NoSQL databases: MongoDB, Cassandra, HBase.</li>
      </ul>
    </div>
  ),
};
