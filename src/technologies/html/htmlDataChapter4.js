import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

export const htmlDataChapter4 = {
  "HTML Images": (
    <div>
      <p>Images are added using <code>&lt;img&gt;</code> with important attributes:</p>
      <ul>
        <li><code>src</code> – image path</li>
        <li><code>alt</code> – alternative text</li>
        <li><code>width</code> / <code>height</code> – size</li>
      </ul>
      <SyntaxHighlighter language="html" style={coy}>
        {`<img src="logo.png" alt="Logo" width="200" height="100">`}
      </SyntaxHighlighter>
    </div>
  ),
  "HTML Audio": (
    <div>
      <p>Add audio using the <code>&lt;audio&gt;</code> element:</p>
      <SyntaxHighlighter language="html" style={coy}>
        {`<audio controls>
  <source src="music.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>`}
      </SyntaxHighlighter>
    </div>
  ),

  "HTML Video": (
    <div>
      <p>Embed videos with <code>&lt;video&gt;</code>:</p>
      <SyntaxHighlighter language="html" style={coy}>
        {`<video width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>`}
      </SyntaxHighlighter>
    </div>
  ),

  "Picture Element": (
    <div>
      <p>Serve responsive images using <code>&lt;picture&gt;</code>:</p>
      <SyntaxHighlighter language="html" style={coy}>
        {`<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Responsive Image">
</picture>`}
      </SyntaxHighlighter>
    </div>
  ),

  "Media Attributes": (
    <div>
      <p>Audio/video attributes for better control:</p>
      <ul>
        <li><code>autoplay</code> – play automatically</li>
        <li><code>loop</code> – repeat</li>
        <li><code>muted</code> – start muted</li>
        <li><code>controls</code> – show controls</li>
      </ul>
      <SyntaxHighlighter language="html" style={coy}>
        {`<audio src="song.mp3" controls autoplay loop muted></audio>`}
      </SyntaxHighlighter>
    </div>
  ),

  "Embedding YouTube": (
    <div>
      <p>Embed YouTube videos using <code>&lt;iframe&gt;</code>:</p>
      <SyntaxHighlighter language="html" style={coy}>
        {`<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
title="YouTube video player" frameborder="0" allowfullscreen></iframe>`}
      </SyntaxHighlighter>
    </div>
  ),
}