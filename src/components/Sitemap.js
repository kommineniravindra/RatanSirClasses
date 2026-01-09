import React from "react";
import SEO from "./SEO";
import "../css/Sitemap.css"; // Using dedicated vibrant CSS

const Sitemap = () => {
  return (
    <div className="sitemap-container">
      <SEO
        title="Sitemap"
        description="Navigate through all pages on CodePulse-R."
        keywords="sitemap, navigation, codepulse-r pages"
      />

      <div className="sitemap-header">
        <h1>Sitemap</h1>
        <p>Explore all the resources available on CodePulse-R.</p>
      </div>

      <div className="sitemap-grid">
        <div className="sitemap-section">
          <h2>General</h2>
          <ul>
            <li>
              <a href="/Home">Home</a>
            </li>
            <li>
              <a href="/AboutUs">About Us</a>
            </li>
            <li>
              <a href="/ContactUs">Contact Us</a>
            </li>
            <li>
              <a href="/account">My Account</a>
            </li>
            <li>
              <a href="/PrivacyPolicy">Privacy Policy</a>
            </li>
            <li>
              <a href="/TermsOfService">Terms of Service</a>
            </li>
          </ul>
        </div>

        <div className="sitemap-section">
          <h2>Student Zone</h2>
          <ul>
            <li>
              <a href="/dashboard">Exam Dashboard</a>
            </li>
            <li>
              <a href="/learning">My Learning</a>
            </li>
            <li>
              <a href="/quiz">Quizzes</a>
            </li>
            <li>
              <a href="/learning">Feedback</a>
            </li>
          </ul>
        </div>

        <div className="sitemap-section">
          <h2>Technologies</h2>
          <ul>
            <li>
              <a href="/Java">Java</a>
            </li>
            <li>
              <a href="/Python">Python</a>
            </li>
            <li>
              <a href="/JavaScript">JavaScript</a>
            </li>
            <li>
              <a href="/React">React</a>
            </li>
            <li>
              <a href="/SQL">SQL</a>
            </li>
            <li>
              <a href="/HTML">HTML</a>
            </li>
            <li>
              <a href="/CSS">CSS</a>
            </li>
            <li>
              <a href="/GIT">Git</a>
            </li>
            <li>
              <a href="/Microservices">Microservices</a>
            </li>
            <li>
              <a href="/RESTAPI">REST API</a>
            </li>
          </ul>
        </div>

        <div className="sitemap-section">
          <h2>Resources</h2>
          <ul>
            <li>
              <a href="/DSA">DSA Practice</a>
            </li>
            <li>
              <a href="/teachingclasses">Live Classes</a>
            </li>
            <li>
              <a href="/Q&A">Q&A</a>
            </li>
            <li>
              <a href="/Downloads">Downloads</a>
            </li>
          </ul>
        </div>

        <div className="sitemap-section">
          <h2>Online Compilers</h2>
          <ul className="compiler-links-grid">
            <li><a href="/online-compiler/java">Java Compiler</a></li>
            <li><a href="/online-compiler/python">Python Compiler</a></li>
            <li><a href="/online-compiler/javascript">JavaScript Compiler</a></li>
            <li><a href="/online-compiler/html">HTML Compiler</a></li>
            <li><a href="/online-compiler/css">CSS Compiler</a></li>
            <li><a href="/online-compiler/sql">SQL Compiler</a></li>
            <li><a href="/online-compiler/cpp">C++ Compiler</a></li>
            <li><a href="/online-compiler/c">C Compiler</a></li>
            <li><a href="/online-compiler/csharp">C# Compiler</a></li>
            <li><a href="/online-compiler/go">Go Compiler</a></li>
            <li><a href="/online-compiler/php">PHP Compiler</a></li>
            <li><a href="/online-compiler/ruby">Ruby Compiler</a></li>
            <li><a href="/online-compiler/swift">Swift Compiler</a></li>
            <li><a href="/online-compiler/kotlin">Kotlin Compiler</a></li>
            <li><a href="/online-compiler/rust">Rust Compiler</a></li>
            <li><a href="/online-compiler/typescript">TypeScript Compiler</a></li>
            <li><a href="/online-compiler/scala">Scala Compiler</a></li>
            <li><a href="/online-compiler/dart">Dart Compiler</a></li>
            <li><a href="/online-compiler/bash">Bash Compiler</a></li>
            <li><a href="/online-compiler/r">R Compiler</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
