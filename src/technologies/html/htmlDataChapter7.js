import { color } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy, prism } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ language = "html", children }) => (
  <SyntaxHighlighter language={language} style={coy}>
    {children}
  </SyntaxHighlighter>
);

export const htmlDataChapter7 = {

  "Youtube Video": (
    <div>
     <b>Embedding Media in HTML</b>

  <p>To embed Google Maps &amp; YouTube videos use the &lt;iframe&gt; tag.</p>
  <p><mark>example:</mark>  Copy the embed code and paste inside &lt;iframe&gt;.</p>

  <b>To embed YouTube videos:</b>
  <ul>
    <li>Right-click on a YouTube video</li>
    <li>Click <b>Copy embed code</b></li>
    <li>Paste in your HTML iframe tag</li>
  </ul>
    
      <CodeBlock>{`<iframe src="youtube_embed_url">......</iframe>`}</CodeBlock>

      <b>Ratan sir Youtube videos</b>
      
      <CodeBlock>
        {
          `<iframe
        width="500"
        height="300"
        src="https://www.youtube.com/embed/FFhYBalnqAE"
        title="Java Number Programs || PALINDROME NUMBER || Ratan Sir"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen>
</iframe>
          `
        }
      </CodeBlock>

      <iframe
        width="750"
        height="300"
        src="https://www.youtube.com/embed/FFhYBalnqAE"
        title="Java Number Programs || PALINDROME NUMBER || Ratan Sir"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  ),

  "Google Maps": (
    <div>
       <h4>To embed Google Maps:</h4>
  <ul>
    <li>Click <b>Share location</b></li>
    <li>Choose <b>Embed a map</b></li>
    <li>Copy the embed code URL</li>
     <li>Paste in your HTML iframe tag</li>
  </ul>

      <CodeBlock>{`<iframe src="google_map_embed_url"></iframe>`}</CodeBlock>
      <b>Ratan sir Home Address</b>

      <CodeBlock>
        {`<iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15225.712917880797!2d78.4343206380527!3d17.439206206844496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90c55bb43183%3A0x1abc135b23ee2703!2sAmeerpet%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1724128220958!5m2!1sen!2sin"
        width="400"
        height="200"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade">
</iframe>
          `
        }

      </CodeBlock>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15225.712917880797!2d78.4343206380527!3d17.439206206844496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90c55bb43183%3A0x1abc135b23ee2703!2sAmeerpet%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1724128220958!5m2!1sen!2sin"
        width="500"
        height="200"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  ),

  "Audio File": (
    <div>
      <p>  <b>&lt;audio&gt; tag</b>  → Used to embed and play audio files in a web page like songs, recordings, sound effects.</p>
      <CodeBlock>{`<audio controls>
  <source src="location" type="audio/mpeg" />
</audio>`}</CodeBlock>

 <b>&lt;audio&gt; Tag Attributes</b>
      <ul>
        <li><b>controls</b> – Displays play, pause, volume, and seek options to the user.</li>
        <li><b>autoplay</b> – Automatically starts playing the audio when the page loads.</li>
        <li><b>loop</b> – Replays the audio file continuously after it ends.</li>
        <li><b>muted</b> – Starts the audio in a muted state by default.</li>
        <li><b>src</b> – Specifies the path or URL of the audio file.</li>
        <li><b>type</b> – Defines the media type (e.g., "audio/mpeg", "audio/ogg").</li>
      </ul>

<b>Ratan Sir Favorite Song</b>
      <CodeBlock>
        {
          `<audio controls autoPlay loop muted>
        <source src="D:/HTML classes/Aakasam Yenatido.mp3" 
                type="audio/mpeg" />
</audio>
          `
        }
      </CodeBlock>
      
        
      
    </div>
  ),

  "Video File": (
    <div>
      <p> <b>&lt;Video&gt; tag</b> is used to embed and play video files in a web page.</p>

      <CodeBlock>{`<video controls height="500" width="300">
  <source src="location" type="video/mp4" />
</video>`}</CodeBlock>

  <h2>&lt;video&gt; Tag Attributes</h2>
      <ul>
        <li><b>controls</b> – Displays play, pause, volume, and seek options to the user.</li>
        <li><b>autoplay</b> – Automatically starts playing the video when the page loads.</li>
        <li><b>loop</b> – Replays the video continuously after it ends.</li>
        <li><b>muted</b> – Starts the video in a muted state by default.</li>
        <li><b>width</b> – Sets the width of the video player (in pixels or %).</li>
        <li><b>height</b> – Sets the height of the video player (in pixels or %).</li>
        <li><b>src</b> – Specifies the path or URL of the video file.</li>
        <li><b>type</b> – Defines the media type (e.g., "video/mp4", "video/webm").</li>
        <li><b>poster</b> – Sets an image to display before the video plays (thumbnail).</li>
      </ul>
      <b>Ratan Sir Favorite Video</b>

      <CodeBlock>
        {
          ` <video width="640" height="360" controls autoPlay loop muted>
        <source src="D:/HTML classes/videoinfo.mp4" 
                type="video/mp4" />
</video>`
        }
      </CodeBlock>
     
    </div>
  ),

"Multiple Websites": (
  <div>
    <p>
      The <b>&lt;iframe&gt;</b> tag can be used to load and display multiple websites inside 
      a single web page. By using the <b>target</b> attribute in hyperlinks, we can open 
      different websites inside the same frame without leaving the current page.
    </p>

    <CodeBlock>
      {
        `<iframe height="400" width="600" name="myframe"></iframe>
<br/>
<a href="https://vijetha.in/" target="myframe">Vijetha Super Market</a> 
<a href="https://www.zomato.com/" target="myframe">Zomato</a> 
<a href="https://www.dmart.in/" target="myframe">DMART</a>
    `
      }
    </CodeBlock>
      <b style={{color:'yellowgreen'}}> Frame Displays Multiple websites......</b>
    <iframe height="400" width="700" name="myframe"></iframe>
    <br/>
    <a href="https://vijetha.in/" target="myframe">Vijetha Super Market</a> |{" "}
    <a href="https://www.zomato.com/" target="myframe">zomato</a> |{" "}
    <a href="https://www.dmart.in/" target="myframe">DMART</a>
  </div>
)


};
