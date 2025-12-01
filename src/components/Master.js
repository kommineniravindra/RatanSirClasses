import React, { useState, useMemo, useRef, useEffect } from "react";
import "../App.css";
import "../css/Master.css";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import Main from "./Main";
import Home from "./Home";
import QnAComponent from "./QnAComponent";
import DSA from "./DSA";
import ContactUs from "./ContactUs";
import AboutUs from "./AboutUs";
import NavBar from "./NavBar";
import { javaMenuData } from "../technologies/java/menuOptions";
import { pythonMenuData } from "../technologies/python/menuOptions";
import { htmlMenuData } from "../technologies/html/menuOptions";
import { javascriptMenuData } from "../technologies/javascript/menuOptions";
import { sqlMenuData } from "../technologies/sql/menuOptions";
import { microservicesMenuData } from "../technologies/microservices/menuOptions";
import { cssMenuData } from "../technologies/css/menuOptions";
import { restApiMenuData } from "../technologies/restapi/menuOptions";
import { reactMenuData } from "../technologies/react/menuOptions";
import { gitMenuData } from "../technologies/git/menuOptions";

const Master = () => {
  // 1. RETRIEVE STATE FROM STORAGE (To remember where the user was)
  const [selectedPage, setSelectedPage] = useState(() => {
    return sessionStorage.getItem("selectedPage") || "Home";
  });

  const [selectedTechnology, setSelectedTechnology] = useState(() => {
    return sessionStorage.getItem("selectedTechnology") || "";
  });

  const [selectedItem, setSelectedItem] = useState(() => {
    return sessionStorage.getItem("selectedItem") || "";
  });

  // 2. VIDEO LOGIC
  // Only set showIntro to true if the saved page is "Home" (or if it's the very first visit)
  const [showIntro, setShowIntro] = useState(() => {
    const savedPage = sessionStorage.getItem("selectedPage");
    return !savedPage || savedPage === "Home";
  });

  const isClickTriggeredRef = useRef(false);

  // 3. SAVE STATE ON CHANGE
  // Whenever the user navigates, save the location immediately.
  useEffect(() => {
    sessionStorage.setItem("selectedPage", selectedPage);
    sessionStorage.setItem("selectedTechnology", selectedTechnology);
    sessionStorage.setItem("selectedItem", selectedItem);
  }, [selectedPage, selectedTechnology, selectedItem]);

  const handleVideoComplete = () => {
    setShowIntro(false);
  };

  const technologyMenuMap = useMemo(
    () => ({
      Java: javaMenuData,
      Python: pythonMenuData,
      JavaScript: javascriptMenuData,
      HTML: htmlMenuData,
      CSS: cssMenuData,
      SQL: sqlMenuData,
      Microservices: microservicesMenuData,
      RESTAPI: restApiMenuData,
      React: reactMenuData,
      GIT:gitMenuData,
    }),
    []
  );

  const menuData = useMemo(
    () => technologyMenuMap[selectedTechnology] || [],
    [selectedTechnology, technologyMenuMap]
  );

  const handleTechnologySelect = (name) => {
    if (["Home", "Q&A", "DSA", "ContactUs", "AboutUs"].includes(name)) {
      setSelectedPage(name);
      setSelectedTechnology("");
      setSelectedItem("");
      return;
    }
    setSelectedPage("Technology");
    setSelectedTechnology(name);

    const newMenuData = technologyMenuMap[name] || [];
    if (newMenuData.length > 0 && newMenuData[0].subItems?.length > 0) {
      setSelectedItem(newMenuData[0].subItems[0].name);
      isClickTriggeredRef.current = true;
    } else {
      setSelectedItem("");
    }
  };

  const handleItemClick = (itemName) => {
    isClickTriggeredRef.current = true;
    setSelectedItem(itemName);
  };

  // 4. RENDER VIDEO OVERLAY
  if (showIntro) {
    return (
      <div className="intro-overlay">
        <video
          autoPlay
          muted
          className="intro-video"
          onEnded={handleVideoComplete}
        >
          {/* UPDATED: Directly referencing the file in public folder */}
          <source src="/v3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <button className="skip-btn" onClick={handleVideoComplete}>
          Skip Intro
        </button>
      </div>
    );
  }

  return (
    <>
      <NavBar
        onTechnologySelect={handleTechnologySelect}
        selectedTechnology={selectedTechnology}
        selectedPage={selectedPage}
      />

      {selectedPage === "Home" && <Home onTechnologySelect={handleTechnologySelect} />}
      {selectedPage === "Q&A" && <QnAComponent />}
      {selectedPage === "DSA" && <DSA />}
      {selectedPage === "ContactUs" && <ContactUs />}
      {selectedPage === "AboutUs" && <AboutUs />}

      {selectedPage === "Technology" && (
        <div className="master-grid">
          <div className="grid-left-menu">
            <LeftMenu
              selectedItem={selectedItem}
              menuData={menuData}
              onItemClick={handleItemClick}
            />
          </div>
          <div className="grid-main">
            <Main
              selectedItem={selectedItem}
              selectedTechnology={selectedTechnology}
              setSelectedItem={setSelectedItem}
              menuData={menuData}
              isClickTriggeredRef={isClickTriggeredRef}
            />
          </div>
          <div className="grid-right-menu">
            <RightMenu />
          </div>
        </div>
      )}
    </>
  );
};

export default Master;