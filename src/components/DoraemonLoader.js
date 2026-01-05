import React from "react";
import "../css/DoraemonLoader.css";

const DoraemonLoader = () => {
  return (
    <div className="rd-wrapper">
      <div className="rd-container">
        <div className="rd-head">
          <div className="rd-face">
            <div className="rd-eyes-container">
              <div className="rd-eye">
                <div className="rd-pupil"></div>
              </div>
              <div className="rd-eye">
                <div className="rd-pupil"></div>
              </div>
            </div>
            <div className="rd-nose"></div>
            <div className="rd-whiskers">
              <div className="rd-whisker rd-w1"></div>
              <div className="rd-whisker rd-w2"></div>
              <div className="rd-whisker rd-w3"></div>
              <div className="rd-whisker rd-w4"></div>
              <div className="rd-whisker rd-w5"></div>
              <div className="rd-whisker rd-w6"></div>
            </div>
            <div className="rd-mouth-line"></div>
          </div>
        </div>

        <div className="rd-collar"></div>
        <div className="rd-bell"></div>

        <div className="rd-arm left">
          <div className="rd-hand"></div>
        </div>
        <div className="rd-arm right">
          <div className="rd-hand"></div>
        </div>

        <div className="rd-body-section">
          <div className="rd-white-belly">
            <div className="rd-pocket"></div>
          </div>
        </div>

        <div className="rd-legs">
          <div className="rd-foot"></div>
          <div className="rd-foot"></div>
        </div>
      </div>
      <div className="rd-floor-shadow"></div>
    </div>
  );
};

export default DoraemonLoader;
