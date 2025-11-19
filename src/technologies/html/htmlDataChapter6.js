import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "html", children }) => (
  <SyntaxHighlighter language={language} style={coy}>
    {children}
  </SyntaxHighlighter>
);

export const htmlDataChapter6 = {
  "Forms Purpose": (
    <div>
      <p>
        HTML forms are used to collect user input. <br />
        Example:
      </p>
      <ul>
        <li>Login form → collects login details.</li>
        <li>Register form → collects registration details.</li>
        <li>Product form → collects product details.</li>
      </ul>

      <b>Q. Who can read the form data?</b>
      <p> The form data can be read in two places:</p>
      <ol>
        <li>
          <strong>JavaScript:</strong> Reads the data for validations to check
          whether the format is correct or not.
        </li>
        <li>
          <strong>Server:</strong> Reads the data to perform the main business
          logic.
        </li>
      </ol>

      <h3>Examples:</h3>
      <ol>
        <li>
          When we enter the <b>email id</b> in the form:
          <ul>
            <li>
              JavaScript checks if it contains <code>@</code> and ends with{" "}
              <code>.com</code>.
            </li>
            <li>
              The Server reads the email and sends a mail to the customer.
            </li>
          </ul>
        </li>
        <li>
          When we enter the <b>deposit amount</b>:
          <ul>
            <li>JavaScript checks if the amount is &gt; 0 (not negative).</li>
            <li>The Server reads the amount and deposits it in the account.</li>
          </ul>
        </li>
      </ol>
    </div>
  ),

  "Form Tags": (
    <div>
      <ol>
        <li>
          <b>&lt;form&gt;</b> → Used to create a form.
          <CodeBlock>
            {`<form>
  Write the form elements here...
</form>
          `}
          </CodeBlock>
        </li>

        <li>
          <b>&lt;label&gt;</b> → Used to create constant text.
          <CodeBlock>
            {`<label>Username: </label>
<label>Password: </label>
          `}
          </CodeBlock>
        </li>

        <li>
          <b>&lt;input&gt;</b> → Used to take user input.
          <ul>
            <li>
              <code>&lt;input type="text"&gt;</code> → Visible text like
              username.
            </li>
            <li>
              <code>&lt;input type="password"&gt;</code> → Invisible password
              text.
            </li>
            <li>
              <code>&lt;input id="username"&gt;</code> → JavaScript reads value
              using <b>id</b>.
            </li>
            <li>
              <code>&lt;input name="username"&gt;</code> → Server reads value
              using <b>name</b>.
            </li>
            <li>
              <code>&lt;input placeholder="Enter username"&gt;</code> → Displays
              hint text.
            </li>
            <li>
              <code>&lt;input required&gt;</code> → Makes field mandatory.
            </li>
            <li>
              <code>&lt;input minlength="3"&gt;</code> → Minimum length.
            </li>
            <li>
              <code>&lt;input maxlength="9"&gt;</code> → Maximum length.
            </li>
          </ul>
          <mark>Example:</mark>
          <CodeBlock>
            {`
<input 
  type="text"
  id="username"
  name="username"
  placeholder="Enter your username"
  minlength="3"
  maxlength="8"
  required
/>
          `}
          </CodeBlock>
        </li>

        <li>
          <b>&lt;button&gt;</b> → Used to create a button.
          <CodeBlock>{`<button>Login</button>`}</CodeBlock>
        </li>
      </ol>

      <h3>Example: Login Form</h3>
      <CodeBlock>
        {`<html>
<head>
  <title>Login Form</title>
</head>
<body>
  <h2>Login Form....</h2>
  <form>
    <label>Enter Username: </label>
    <input 
      type="text"
      id="username"
      name="username"
      placeholder="Enter your username"
      minlength="3"
      maxlength="8"
      required
    />
    <br><br>

    <label>Enter Password: </label>
    <input 
      type="password"
      id="password"
      name="password"
      placeholder="Enter your password"
      minlength="3"
      maxlength="8"
      required
    />
    <br><br>

    <button type="submit">Sign In</button>
  </form>
</body>
</html>

      `}
      </CodeBlock>
    </div>
  ),

  "Register Form": (
    <div>
      <h3>Input Attributes</h3>
      <ul>
        <li>
          <code>type="number"</code> → The textbox allows only numbers.
        </li>
        <li>
          <code>value="1001"</code> → To set the default value.
        </li>
        <li>
          <code>readonly</code> → The value cannot be edited.
        </li>
        <li>
          <code>disabled</code> → To disable the text field (cannot change
          value).
        </li>
        <li>
          <code>step="50"</code> → Used to take custom stepping value. (By
          default, it steps by +1).
        </li>
        <li>
          <code>min="2"</code> → Setting the minimum quantity.
        </li>
        <li>
          <code>max="10"</code> → Setting the maximum quantity.
        </li>
      </ul>

      <h3>Input Types</h3>
      <ul>
        <li>
          <code>&lt;input type="email"&gt;</code> → To take the email address
          (must contain <b>@</b> symbol).
        </li>
        <li>
          <code>&lt;input type="number"&gt;</code> → To take numbers.
        </li>
        <li>
          <code>&lt;input type="radio"&gt;</code> → To take radio buttons.
        </li>
        <li>
          <code>&lt;input type="checkbox"&gt;</code> → To take checkboxes.
        </li>
        <li>
          <code>&lt;input type="file"&gt;</code> → To browse data (e.g., resume,
          photo).
        </li>
        <li>
          <code>&lt;input type="time"&gt;</code> → To get the time clock.
        </li>
        <li>
          <code>&lt;input type="date"&gt;</code> → To get the calendar.
        </li>
       
        <li>
          <code>&lt;input type="color"&gt;</code> → To choose a color.
        </li>
        <li>
          <code>&lt;input type="datetime-local"&gt;</code> → To get date & time.
        </li>
        <li>
          <code>&lt;input type="month"&gt;</code> → To get month selection.
        </li>
        <li>
          <code>&lt;input type="week"&gt;</code> → To get week selection.
        </li>
         <li>
          <code>{`<input type="date" | "time" | "datetime-local" | "month" | "week">`}</code>
        </li>

      </ul>

      <h3>Other Form Elements</h3>
      <ul>
         <li>
          <code>&lt;fieldset&gt;</code> → To make division in a form.
        </li>
        <li>
          <code>&lt;legend&gt;</code> → To give the division name.
        </li>
        <li>
          <code>&lt;select&gt;</code> → Used to select a single option from
          dropdown.
        </li>
        <li>
          <code>&lt;select multiple&gt;</code> → Used to select multiple
          options.
        </li>
        <li>
          <code>&lt;option&gt;</code> → Used to define options under{" "}
          <code>&lt;select&gt;</code>.
        </li>
       
        <li>
          <code>&lt;textarea cols="50" rows="5"&gt;</code> → To take multiple
          lines of text.
        </li>
      </ul>

      <p>
        <b>Q. What are the attributes that do not contain a value?</b>
        <br />
        Ans: <code>readonly</code>, <code>disabled</code>, <code>required</code>
      </p>

      <CodeBlock>
        {`<form method="get" action="StudentServlet">
      {/* Personal Information Section */}
      <fieldset>
        <legend style={{ color: "red" }}>Personal Information</legend>

        <label>Student Name*: </label>
        <input
          type="text"
          id="stuname"
          name="stuname"
          maxLength="50"
          required
        />
        <br /><br />

        <label>Password*: </label>
        <input
          type="password"
          id="password"
          name="password"
          minLength="5"
          maxLength="50"
          required
        />
        <br /><br />

        <label>Gender: </label>
        <input type="radio" name="gender" /> Male
        <input type="radio" name="gender" /> Female
        <br /><br />

        <label>Email*: </label>
        <input
          type="email"
          id="email"
          name="email"
          maxLength="50"
          required
        />
        <br /><br />

        <label>Phone*: </label>
        <input type="number" id="phone" name="phone" required />
        <br /><br />

        <label>Date of Birth: </label>
        <input type="date" id="dob" name="dob" />
        <br /><br />
      </fieldset>

      {/* Personal Interests Section */}
      <fieldset>
        <legend style={{ color: "red" }}>Personal Interests...</legend>

        <label>Interests/Hobbies: </label>
        <input type="checkbox" name="hobbies" /> Sleeping
        <input type="checkbox" name="hobbies" /> Eating
        <input type="checkbox" name="hobbies" /> Chatting
        <input type="checkbox" name="hobbies" /> Roaming
        <input type="checkbox" name="hobbies" /> Reading
        <br /><br />

        <label>Country*: </label>
        <select id="country" name="country">
          <option>Select</option>
          <option>India</option>
          <option>Africa</option>
          <option>Ameerpet</option>
          <option>USA</option>
          <option>Japan</option>
        </select>
        <br /><br />

        <label>Courses*: </label>
        <select id="courses" name="courses" multiple size="3">
          <option>HTML</option>
          <option>CSS</option>
          <option>JavaScript</option>
          <option>ReactJS</option>
          <option>BootStrap</option>
        </select>
        <br /><br />

        <label>Your Website URL: </label>
        <input type="url" id="url" name="url" required />
        <br /><br />
      </fieldset>

      {/* Personal Astrology Section */}
      <fieldset>
        <legend style={{ color: "red" }}>Personal Astrology...</legend>

        <label>Your Lucky Time: </label>
        <input type="time" name="luckyTime" />
        <br /><br />

        <label>Your Lucky Week: </label>
        <input type="week" name="luckyWeek" />
        <br /><br />

        <label>Your Lucky Month: </label>
        <input type="month" name="luckyMonth" />
        <br /><br />

        <label>Your Lucky DateTime: </label>
        <input type="datetime-local" name="luckyDateTime" />
        <br /><br />

        <label>Your Lucky Color: </label>
        <input type="color" name="luckyColor" />
        <br /><br />
      </fieldset>

      {/* Upload Section */}
      <fieldset>
        <legend style={{ color: "red" }}>Upload Documents...</legend>

        <label>Upload your Resume: </label>
        <input type="file" name="resume" />
        <br /><br />

        <label>Upload your Photo: </label>
        <input type="file" name="photo" />
        <br /><br />
      </fieldset>

      {/* Reviews Section */}
      <fieldset>
        <legend style={{ color: "red" }}>Your Reviews...</legend>
        <label>Comments About Mr. Ratan Sir (max 200 chars):</label>
        <br />
        <textarea
          id="comments"
          name="comments"
          rows="4"
          cols="50"
          maxLength="200"
        />
        <br /><br />
      </fieldset>

      <input type="submit" value="Register" />
      <input type="reset" value="Reset" />
    </form>
        `}
      </CodeBlock>

      <form method="get" action="StudentServlet">
        {/* Personal Information Section */}
        <fieldset>
          <legend style={{ color: "red" }}>Personal Information</legend>
          <label>Student Name*: </label>
          <input
            type="text"
            id="stuname"
            name="stuname"
            maxLength="50"
            required
          />
          <br />
          <br />
          <label>Password*: </label>
          <input
            type="password"
            id="password"
            name="password"
            minLength="5"
            maxLength="50"
            required
          />
          <br />
          <br />
          <label>Gender: </label>
          <input type="radio" name="gender" /> Male
          <input type="radio" name="gender" /> Female
          <br />
          <br />
          <label>Email*: </label>
          <input type="email" id="email" name="email" maxLength="50" required />
          <br />
          <br />
          <label>Phone*: </label>
          <input type="number" id="phone" name="phone" required />
          <br />
          <br />
          <label>Date of Birth: </label>
          <input type="date" id="dob" name="dob" />
          <br />
          <br />
        </fieldset>

        {/* Personal Interests Section */}
        <fieldset>
          <legend style={{ color: "red" }}>Personal Interests...</legend>
          <label>Interests/Hobbies: </label>
          <input type="checkbox" name="hobbies" /> Sleeping
          <input type="checkbox" name="hobbies" /> Eating
          <input type="checkbox" name="hobbies" /> Chatting
          <input type="checkbox" name="hobbies" /> Roaming
          <input type="checkbox" name="hobbies" /> Reading
          <br />
          <br />
          <label>Country*: </label>
          <select id="country" name="country">
            <option>Select</option>
            <option>India</option>
            <option>Africa</option>
            <option>Ameerpet</option>
            <option>USA</option>
            <option>Japan</option>
          </select>
          <br />
          <br />
          <label>Courses*: </label>
          <select id="courses" name="courses" multiple size="3">
            <option>HTML</option>
            <option>CSS</option>
            <option>JavaScript</option>
            <option>ReactJS</option>
            <option>BootStrap</option>
          </select>
          <br />
          <br />
          <label>Your Website URL: </label>
          <input type="url" id="url" name="url" required />
          <br />
          <br />
        </fieldset>

        {/* Personal Astrology Section */}
        <fieldset>
          <legend style={{ color: "red" }}>Personal Astrology...</legend>

          <label>Your Lucky Time: </label>
          <input type="time" name="luckyTime" />
          <br />
          <br />

          <label>Your Lucky Week: </label>
          <input type="week" name="luckyWeek" />
          <br />
          <br />

          <label>Your Lucky Month: </label>
          <input type="month" name="luckyMonth" />
          <br />
          <br />

          <label>Your Lucky DateTime: </label>
          <input type="datetime-local" name="luckyDateTime" />
          <br />
          <br />

          <label>Your Lucky Color: </label>
          <input type="color" name="luckyColor" />
          <br />
          <br />
        </fieldset>

        {/* Upload Section */}
        <fieldset>
          <legend style={{ color: "red" }}>Upload Documents...</legend>

          <label>Upload your Resume: </label>
          <input type="file" name="resume" />
          <br />
          <br />

          <label>Upload your Photo: </label>
          <input type="file" name="photo" />
          <br />
          <br />
        </fieldset>

        {/* Reviews Section */}
        <fieldset>
          <legend style={{ color: "red" }}>Your Reviews...</legend>
          <label>Comments About Mr. Ratan Sir (max 200 chars):</label>
          <br />
          <textarea
            id="comments"
            name="comments"
            rows="4"
            cols="50"
            maxLength="200"
          />
          <br />
          <br />
        </fieldset>

        <input type="submit" value="Register" />
        <input type="reset" value="Reset" />
      </form>
    </div>
  ),


 "Advanced Concepts": (
    <div>

      <b>Q. What is the purpose of datalist? How to link the datalist to input box?</b>
      <p>
        <b>Ans:</b> Take the datalist & attach it to a textbox. To attach, the datalist
        <code>id</code> attribute and the input tag <code>list</code> attribute must be the same.  
        The datalist shows suggestions, but we can also type new values.
      </p>
      <CodeBlock>
{`<input list="companies" id="company" name="company">
<datalist id="companies">
  <option value="TCS">
  <option value="Infosys">
</datalist>`}
      </CodeBlock>

      <b>Q. What is the purpose of type='url'?</b>
      <p> It ensures the URL starts with <code>http://</code> or <code>https://</code>.</p>

      <b>Q. What is the purpose of hidden fields in HTML?</b>
      <p>
        Without showing the value in the browser view. (They don’t appear in the browser UI.)  <br/>Used to send hidden data
        to the server when a form is submitted.(But their value is included when the form is submitted to the server).
      </p>
      <CodeBlock>
{`<input type="hidden" id="key" name="key" value="525">`}
      </CodeBlock>

      <b>Q. What is the purpose of value attribute in &lt;option&gt; tag?</b>
      <CodeBlock>
{`<select>
  <option>Hyderabad</option>
  <option>Bangalore</option>
</select>`}
      </CodeBlock>
      <p>
        Here when we select Hyderabad, <code>"Hyderabad"</code>value is sent to the server.
      </p>

      <CodeBlock>
{`<select>
  <option value="hyd">Hyderabad</option>
  <option value="bang">Bangalore</option>
</select>`}
      </CodeBlock>
      <p>
       Here when we select Hyderabad, <code>"hyd"</code>value is sent to the server.
      </p>

      <b>Q. What is the purpose of &lt;optgroup&gt; tag?</b>
      <p> It is used to group related options inside a dropdown. <br/>
        <mark>example</mark>: first optgroup contains 5 options, second has 3, third has 6.
      </p>

      <b>Q. What are the ways we can create the button?</b>
      <ol>
        <li>
          Using <code>&lt;input&gt;</code> tag (unpaired, just a button)
          <CodeBlock>{`<input type="submit" value="saveData">`}</CodeBlock>
        </li>
        <li>
          Using <code>&lt;button&gt;</code> tag (paired, can add images/icons)
          <CodeBlock>
{`<button type="submit">
  <img src="bottle.jpg" height="10" width="10"> SaveData
</button>`}
          </CodeBlock>
        </li>
      </ol>

      <h3>Q. What is the purpose of &lt;form&gt; tag & its attributes?</h3>
      <p>The <code>&lt;form&gt;</code> tag collects user input. Its attributes:</p>
      <ul>
        <li>
          <b>action:</b> URL where form data is sent.    <br/>
          <mark>example</mark>: <code>&lt;form action="/LoginLogics"&gt;</code>
        </li>
        <li>
          <b>method:</b> Defines request type (<code>get</code> or <code>post</code>).   <br/>
          <mark>example</mark>: <code>&lt;form method="post"&gt;</code>
        </li>
        <li>
          <b>enctype:</b> To send binary data (like image, video, audio).   <br/>
          <mark>example</mark>: <code>&lt;form method="post" enctype="multipart/form-data"&gt;</code>
        </li>
      </ul>

      <h3>Example: Company Form</h3>
      <CodeBlock>
{`<html>
<head>
  <title>Company form</title>
</head>
<body>
<form>
  <!-- Datalist linked to input -->
  <label>Company Name:</label>
  <input list="companies" id="company" name="company">
  <datalist id="companies">
    <option value="TCS">
    <option value="techMahi">
    <option value="Sathyatech">
    <option value="Wipro">
    <option value="Infosys">
  </datalist>
  <br><br>

  <label>Website URL:</label>
  <input type="url" id="url" name="url">
  <br><br>

  <label>Security Question:</label>
  <select id="securityQuestion" name="securityQuestion">
    <option selected disabled>Select a security question</option>
    <option value="mother">What is your mother's maiden name?</option>
    <option value="pet">What was the name of your first pet?</option>
    <option value="school">What was the name of your first school?</option>
  </select>
  <br><br>

  <label>Your Answer:</label>
  <input type="text" id="securityAnswer" name="securityAnswer" required>
  <br><br>

  <input type="checkbox" id="t" name="t" required>
  Accept the <a href="conditions.html">Terms & conditions</a>
  <br><br>

  <label>Choose a car:</label>
  <select name="cars" id="cars">
    <optgroup label="Swedish Cars xxxx">
      <option value="volvo">Volvo</option>
      <option value="saab">Saab</option>
    </optgroup>
    <optgroup label="German Cars">
      <option value="mercedes">Mercedes</option>
      <option value="audi">Audi</option>
    </optgroup>
  </select>
  <br><br>

  <input type="hidden" id="key" name="key" value="525">

  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
</form>
</body>
</html>`}
      </CodeBlock>
    </div>
  )
};
