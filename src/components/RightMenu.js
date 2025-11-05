import React, { useState, useEffect } from "react";
import "../css/RightMenu.css";

const images = ["/img3.jpg", "/img5.jpg", "/img7.jpg","/img10.jpg",];

const RightMenu = () => {
  const [currentRotation, setCurrentRotation] = useState(0);
  const angle = 90; // Rotation angle for 4 faces
  const autoScrollInterval = 5000; // Time in milliseconds (3 seconds)

  useEffect(() => {
    const rotateNext = () => {
      setCurrentRotation((prevRotation) => prevRotation - angle);
    };

    const intervalId = setInterval(rotateNext, autoScrollInterval);

    return () => clearInterval(intervalId);
  }, [angle, autoScrollInterval]); 

  const cubeStyle = {
    transform: `rotateY(${currentRotation}deg)`,
  };

  return (
    <div className="right-menu-container">
      <div className="scene">
        <div className="cube" style={cubeStyle}>
          <div className="face front">
            <img src={images[0]} alt="Image 1" />
          </div>

          <div className="face right">
            <img src={images[1]} alt="Image 2" />
          </div>

          <div className="face back">
            <img src={images[2]} alt="Image 3" />
          </div>

          <div className="face left">
            <img src={images[3]} alt="Image 4" />
          </div>
        </div>
      </div>
    </div>

    
  );
};

export default RightMenu;
