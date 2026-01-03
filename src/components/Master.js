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
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import Sitemap from "./Sitemap";
import Footer from "../Home/Footer";
import NavBar from "./NavBar";
import SEO from "./SEO";
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
import { downloadsMenuData } from "../technologies/downloads/menuOptions";

import { useLocation, useParams, useNavigate } from "react-router-dom"; // Add import
import OnlineCompiler from "./OnlineCompiler";

const Master = () => {
  const location = useLocation(); // Hook to access URL params
  const { technology } = useParams();
  const navigate = useNavigate();

  // 1. RETRIEVE STATE FROM STORAGE OR URL (To remember where the user was or handle deep links)
  const [selectedPage, setSelectedPage] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageParam = queryParams.get("page");
    if (
      pageParam &&
      [
        "Home",
        "Q&A",
        "DSA",
        "ContactUs",
        "AboutUs",
        "PrivacyPolicy",
        "TermsOfService",
        "Sitemap",
        "Compiler",
      ].includes(pageParam)
    ) {
      return pageParam;
    }
    return sessionStorage.getItem("selectedPage") || "Home";
  });

  const [compilerLanguage, setCompilerLanguage] = useState("");

  const [selectedTechnology, setSelectedTechnology] = useState("");

  useEffect(() => {
    if (technology) {
      const techMap = {
        java: "Java",
        python: "Python",
        javascript: "JavaScript",
        html: "HTML",
        css: "CSS",
        sql: "SQL",
        microservices: "Microservices",
        restapi: "RESTAPI",
        react: "React",
        git: "GIT",
        downloads: "Downloads",
      };

      const formattedTech = techMap[technology.toLowerCase()];

      if (formattedTech) {
        setSelectedTechnology(formattedTech);
        setSelectedPage("Technology");
      } else {
        // Check if it matches a valid page
        const pageMap = {
          home: "Home",
          "q&a": "Q&A",
          dsa: "DSA",
          contactus: "ContactUs",
          aboutus: "AboutUs",
          privacypolicy: "PrivacyPolicy",
          termsofservice: "TermsOfService",
          sitemap: "Sitemap",
          compiler: "Compiler",
        };
        const formattedPage = pageMap[technology.toLowerCase()];

        if (formattedPage) {
          setSelectedPage(formattedPage);
          setSelectedTechnology("");
        } else {
          setSelectedTechnology("");
          setSelectedPage("Home"); // Default to Home if invalid tech/page
        }
      }
    } else {
      // Root path "/"
      const queryParams = new URLSearchParams(location.search);
      const pageParam = queryParams.get("page");
      if (
        pageParam &&
        [
          "Home",
          "Q&A",
          "DSA",
          "ContactUs",
          "AboutUs",
          "PrivacyPolicy",
          "TermsOfService",
          "Sitemap",
          "Compiler",
        ].includes(pageParam)
      ) {
        setSelectedPage(pageParam);
      } else {
        setSelectedPage(sessionStorage.getItem("selectedPage") || "Home");
      }
      setSelectedTechnology("");
    }
  }, [technology, location.search]);

  const [selectedItem, setSelectedItem] = useState(() => {
    return sessionStorage.getItem("selectedItem") || "";
  });

  // 2. VIDEO LOGIC
  // Only set showIntro to true if the saved page is "Home" (or if it's the very first visit)
  // AND if we are not deep linking to another page
  const [showIntro, setShowIntro] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageParam = queryParams.get("page");
    if (pageParam && pageParam !== "Home") return false; // Skip intro for deep links

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

  // UseEffect to hide intro after 3 seconds
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

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
      GIT: gitMenuData,
      Downloads: downloadsMenuData,
    }),
    []
  );

  const menuData = useMemo(
    () => technologyMenuMap[selectedTechnology] || [],
    [selectedTechnology, technologyMenuMap]
  );

  const handleTechnologySelect = (name) => {
    if (
      [
        "Home",
        "Q&A",
        "DSA",
        "ContactUs",
        "AboutUs",
        "PrivacyPolicy",
        "TermsOfService",
        "Sitemap",
        "Compiler",
      ].includes(name)
    ) {
      setSelectedPage(name);
      setSelectedTechnology("");
      setSelectedItem("");
      navigate(`/${name.toLowerCase()}`); // Go to root with page param
      return;
    }

    // For technologies, navigate to the URL
    // We need to map the name back to the URL friendly version?
    // The names are "Java", "HTML" etc. specific case.
    // Let's just use the lower case version for URL.
    navigate(`/${name.toLowerCase()}`);

    const newMenuData = technologyMenuMap[name] || [];
    if (newMenuData.length > 0 && newMenuData[0].subItems?.length > 0) {
      setSelectedItem(newMenuData[0].subItems[0].name);
      isClickTriggeredRef.current = true;
    } else {
      setSelectedItem("");
    }
  };

  const handleCompilerEntry = (techKey) => {
    // Map techKey (e.g. HTML, CSS, JavaScript) to OnlineCompiler apiLang
    const langMap = {
      HTML: "html",
      CSS: "css",
      JavaScript: "javascript",
      Java: "java",
      Python: "python",
      SQL: "sql",
      RESTAPI: "java",
      Microservices: "java",
      React: "javascript",
    };
    const targetLang = langMap[techKey] || "java";

    setCompilerLanguage(targetLang);
    setSelectedPage("Compiler");
    setSelectedTechnology("");
    setSelectedItem("");
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
          <source src="/v5.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <button className="skip-btn" onClick={handleVideoComplete}>
          Skip Intro
        </button>
      </div>
    );
  }

  // Determine SEO title, description, and keywords
  let pageTitle = "Home";
  let pageDescription = "";
  let pageKeywords = "";

  if (selectedPage === "Technology") {
    pageTitle = selectedTechnology;
    pageDescription = `Learn ${selectedTechnology} from scratch. Comprehensive tutorials, interview questions, and examples for ${selectedTechnology}.`;
    pageKeywords = `${selectedTechnology}, learn ${selectedTechnology}, ${selectedTechnology} tutorial, ${selectedTechnology} interview questions`;

    if (selectedItem) {
      pageTitle = `${selectedTechnology} - ${selectedItem}`;
      pageDescription = `Learn about ${selectedItem} in ${selectedTechnology}. Detailed explanation and examples.`;
      pageKeywords += `, ${selectedItem}`;
    }
  } else {
    pageTitle = selectedPage;
  }

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
      />

      <NavBar
        onTechnologySelect={handleTechnologySelect}
        selectedTechnology={selectedTechnology}
        selectedPage={selectedPage}
      />

      {selectedPage === "Home" && (
        <Home
          onTechnologySelect={handleTechnologySelect}
          onCompilerSelect={handleCompilerEntry}
        />
      )}
      {selectedPage === "Compiler" && (
        <OnlineCompiler initialLanguage={compilerLanguage} />
      )}
      {selectedPage === "Q&A" && <QnAComponent />}
      {selectedPage === "DSA" && <DSA />}
      {selectedPage === "ContactUs" && <ContactUs />}
      {selectedPage === "AboutUs" && <AboutUs />}
      {selectedPage === "PrivacyPolicy" && <PrivacyPolicy />}
      {selectedPage === "TermsOfService" && <TermsOfService />}
      {selectedPage === "Sitemap" && <Sitemap />}

      {[
        "Home",
        "AboutUs",
        "ContactUs",
        "PrivacyPolicy",
        "TermsOfService",
        "Sitemap",
      ].includes(selectedPage) && (
        <Footer onNavigate={handleTechnologySelect} />
      )}

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
