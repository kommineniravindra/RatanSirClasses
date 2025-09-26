import React, { useState, useEffect } from "react";
import "../css/RightMenu.css";

// Define the images. Update these paths to match your public/img directory.
const images = ["/img21.jpg", "/img21.jpg", "/img21.jpg","/img21.jpg",];

const RightMenu = () => {
  const [currentRotation, setCurrentRotation] = useState(0);
  const angle = 90; // Rotation angle for 4 faces
  const autoScrollInterval = 3000; // Time in milliseconds (3 seconds)

  // useEffect hook to handle auto-scrolling
  useEffect(() => {
    // Function to rotate the cube by one step (90 degrees counter-clockwise)
    const rotateNext = () => {
      setCurrentRotation((prevRotation) => prevRotation - angle);
    };

    // Set up the interval for automatic rotation
    const intervalId = setInterval(rotateNext, autoScrollInterval);

    // Cleanup function: clears the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [angle, autoScrollInterval]); // Dependecies ensure angle and interval are used correctly

  // The style object applies the dynamic rotation angle (rotateY)
  const cubeStyle = {
    transform: `rotateY(${currentRotation}deg)`,
  };

  return (
    // Main container uses a single CSS class for all layout and centering
    <div className="right-menu-container">
      {/* 1. The Scene sets the 3D perspective */}
      <div className="scene">
        {/* 2. The Cube is the element that rotates */}
        <div className="cube" style={cubeStyle}>
          {/* Faces */}
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
