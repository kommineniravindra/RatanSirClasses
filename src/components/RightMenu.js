// import React, { useState, useEffect } from "react";
// import "../css/RightMenu.css";

// const images = ["/img19.jpg", "/img5.jpg", "/img7.png","/img10.jpg",];

// const RightMenu = () => {
//   const [currentRotation, setCurrentRotation] = useState(0);
//   const angle = 90;
//   const autoScrollInterval = 5000; // Time in milliseconds (3 seconds)

//   useEffect(() => {
//     const rotateNext = () => {
//       setCurrentRotation((prevRotation) => prevRotation - angle);
//     };

//     const intervalId = setInterval(rotateNext, autoScrollInterval);

//     return () => clearInterval(intervalId);
//   }, [angle, autoScrollInterval]);

//   const cubeStyle = {
//     transform: `rotateY(${currentRotation}deg)`,
//   };

//   return (
//     <div className="right-menu-container">
//       <div className="scene">
//         <div className="cube" style={cubeStyle}>
//           <div className="face front">
//             <img src={images[0]} alt="Image 1" />
//           </div>

//           <div className="face right">
//             <img src={images[1]} alt="Image 2" />
//           </div>

//           <div className="face back">
//             <img src={images[2]} alt="Image 3" />
//           </div>

//           <div className="face left">
//             <img src={images[3]} alt="Image 4" />
//           </div>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default RightMenu;

import React, { useState, useEffect } from "react";
import "../css/RightMenu.css";

// First 2 videos, then images
const RightMenu = () => {
  const [currentRotation, setCurrentRotation] = useState(0);
  const angle = 90;
  const autoScrollInterval = 10000; // Faster scroll for debugging

  // Fixed paths to use absolute root for public assets
  const media = [
    { type: "image", src: "/rightmenu/right1.jpg" },
    { type: "image", src: "/rightmenu/right2.jpg" },
    { type: "image", src: "/rightmenu/right3.jpg" },
    { type: "image", src: "/rightmenu/right4.jpg" },
  ];

  useEffect(() => {
    const rotateNext = () => {
      setCurrentRotation((prevRotation) => prevRotation - angle);
    };
    const id = setInterval(rotateNext, autoScrollInterval);
    return () => clearInterval(id);
  }, []);

  const cubeStyle = {
    transform: `rotateY(${currentRotation}deg)`,
  };

  return (
    <div className="right-menu-container">
      <div className="scene">
        <div className="cube" style={cubeStyle}>
          {/* FACE 1 */}
          <div className="face front">
            <img src={media[0].src} alt="Face 1" />
          </div>

          {/* FACE 2 */}
          <div className="face right">
            <img src={media[1].src} alt="Face 2" />
          </div>

          {/* FACE 3 */}
          <div className="face back">
            <img src={media[2].src} alt="Face 3" />
          </div>

          {/* FACE 4 */}
          <div className="face left">
            <img src={media[3].src} alt="Face 4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightMenu;
