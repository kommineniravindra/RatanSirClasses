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
              <a href="/?page=Home">Home</a>
            </li>
            <li>
              <a href="/?page=AboutUs">About Us</a>
            </li>
            <li>
              <a href="/?page=ContactUs">Contact Us</a>
            </li>
            <li>
              <a href="/account">My Account</a>
            </li>
            <li>
              <a href="/?page=PrivacyPolicy">Privacy Policy</a>
            </li>
            <li>
              <a href="/?page=TermsOfService">Terms of Service</a>
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
              <a href="/?page=Technology&name=Java">Java</a>
            </li>
            <li>
              <a href="/?page=Technology&name=Python">Python</a>
            </li>
            <li>
              <a href="/?page=Technology&name=JavaScript">JavaScript</a>
            </li>
            <li>
              <a href="/?page=Technology&name=React">React</a>
            </li>
            <li>
              <a href="/?page=Technology&name=SQL">SQL</a>
            </li>
            <li>
              <a href="/?page=Technology&name=HTML">HTML</a>
            </li>
            <li>
              <a href="/?page=Technology&name=CSS">CSS</a>
            </li>
            <li>
              <a href="/?page=Technology&name=GIT">Git</a>
            </li>
            <li>
              <a href="/?page=Technology&name=Microservices">Microservices</a>
            </li>
            <li>
              <a href="/?page=Technology&name=RESTAPI">REST API</a>
            </li>
          </ul>
        </div>

        <div className="sitemap-section">
          <h2>Resources</h2>
          <ul>
            <li>
              <a href="/?page=DSA">DSA Practice</a>
            </li>
            <li>
              <a href="/teachingclasses">Live Classes</a>
            </li>
            <li>
              <a href="/?page=Q&A">Q&A</a>
            </li>
            <li>
              <a href="/?page=Technology&name=Downloads">Downloads</a>
            </li>
          </ul>
        </div>

        <div className="sitemap-section">
          <h2>Online Compilers</h2>
          <ul className="compiler-links-grid">
            <li><a href="/online-compiler?lang=java">Java Compiler</a></li>
            <li><a href="/online-compiler?lang=python">Python Compiler</a></li>
            <li><a href="/online-compiler?lang=javascript">JavaScript Compiler</a></li>
            <li><a href="/online-compiler?lang=html">HTML Compiler</a></li>
            <li><a href="/online-compiler?lang=css">CSS Compiler</a></li>
            <li><a href="/online-compiler?lang=sql">SQL Compiler</a></li>
            <li><a href="/online-compiler?lang=cpp">C++ Compiler</a></li>
            <li><a href="/online-compiler?lang=c">C Compiler</a></li>
            <li><a href="/online-compiler?lang=csharp">C# Compiler</a></li>
            <li><a href="/online-compiler?lang=go">Go Compiler</a></li>
            <li><a href="/online-compiler?lang=php">PHP Compiler</a></li>
            <li><a href="/online-compiler?lang=ruby">Ruby Compiler</a></li>
            <li><a href="/online-compiler?lang=swift">Swift Compiler</a></li>
            <li><a href="/online-compiler?lang=kotlin">Kotlin Compiler</a></li>
            <li><a href="/online-compiler?lang=rust">Rust Compiler</a></li>
            <li><a href="/online-compiler?lang=typescript">TypeScript Compiler</a></li>
            <li><a href="/online-compiler?lang=scala">Scala Compiler</a></li>
            <li><a href="/online-compiler?lang=dart">Dart Compiler</a></li>
            <li><a href="/online-compiler?lang=bash">Bash Compiler</a></li>
            <li><a href="/online-compiler?lang=r">R Compiler</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
