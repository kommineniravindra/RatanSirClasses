import React, { useState, useMemo, useRef } from "react";
// import "../App.css";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import Main from "./Main";
import Home from "./Home";
import QnAComponent from "./QnAComponent";
import DSA from "./DSA";
import NavBar from "./NavBar";

// Import menu data
import { javaMenuData } from "../technologies/java/menuOptions";
import { pythonMenuData } from "../technologies/python/menuOptions";
import { htmlMenuData } from "../technologies/html/menuOptions";
import { javascriptMenuData } from "../technologies/javascript/menuOptions";
import { sqlMenuData } from "../technologies/sql/menuOptions";
import { microservicesMenuData } from "../technologies/microservices/menuOptions";
import { cssMenuData } from "../technologies/css/menuOptions";
import { restApiMenuData } from "../technologies/restapi/menuOptions";
import { reactMenuData } from "../technologies/react/menuOptions";

const Master = () => {
  const [selectedPage, setSelectedPage] = useState("Home");
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const isClickTriggeredRef = useRef(false);

  // Technology mapping
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
    }),
    []
  );

  // Get menu data for the selected tech
  const menuData = useMemo(() => {
    return technologyMenuMap[selectedTechnology] || [];
  }, [selectedTechnology, technologyMenuMap]);

  // Handle navbar technology clicks
  const handleTechnologySelect = (name) => {
    if (name === "Home" || name === "Q&A" || name === "DSA") {
      setSelectedPage(name);
      setSelectedTechnology("");
      setSelectedItem("");
      return;
    }

    // If technology is selected
    setSelectedPage("Technology");
    setSelectedTechnology(name);

    const newMenuData = technologyMenuMap[name] || [];
    if (newMenuData.length > 0 && newMenuData[0].subItems?.length > 0) {
      const firstItemName = newMenuData[0].subItems[0].name;
      setSelectedItem(firstItemName);
      isClickTriggeredRef.current = true;
    } else {
      setSelectedItem("");
    }
  };

  const handleItemClick = (itemName) => {
    isClickTriggeredRef.current = true;
    setSelectedItem(itemName);
  };

  return (
    <>
      {/* Navbar */}
      <NavBar
        onTechnologySelect={handleTechnologySelect}
        selectedTechnology={selectedTechnology}
      />

      {/* Dynamic Pages */}
      {selectedPage === "Home" && (
        <Home onTechnologySelect={handleTechnologySelect} />
      )}

      {selectedPage === "Q&A" && <QnAComponent />}

      {selectedPage === "DSA" && <DSA />}

      {selectedPage === "Technology" && (
        <div
          style={{
            display: "flex",
            height: "calc(100vh - 60px)",
            overflow: "hidden",
          }}
        >
          {/* Left Menu */}
          <LeftMenu
            selectedItem={selectedItem}
            menuData={menuData}
            onItemClick={handleItemClick}
          />

          {/* Main Content */}
          <Main
            selectedItem={selectedItem}
            selectedTechnology={selectedTechnology}
            setSelectedItem={setSelectedItem}
            menuData={menuData}
            isClickTriggeredRef={isClickTriggeredRef}
          />
          <RightMenu />
        </div>
      )}
    </>
  );
};

export default Master;
