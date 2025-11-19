import React from "react";
import "./../css/HomeUI1.css";

function HomeUI1() {
  return (
    <div className="landing-v4">
      {/* Floating Blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      {/* Hero Main Section */}
      <div className="hero-v4">
        {/* Left Content */}
        <div className="hero-left">
          <h1 className="hero-title">
            Unlock a Smarter &emsp;&emsp;&emsp;Way
            <span>to Learn Coding</span>
          </h1>

          <p className="hero-desc">
            Build skills, take quizzes, explore challenges & track progress —
            all inside a beautifully designed learning platform.
          </p>
        </div>

        {/* Right Illustration */}
        <div className="hero-right">
          <div className="new-illustration">
            <div className="glow-circle"></div>
            <div className="glow-circle small"></div>
            <div className="floating-cube">CP-R</div>
            <div className="gradient-ring"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeUI1;
