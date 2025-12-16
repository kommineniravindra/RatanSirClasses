import React, { useEffect, useState } from "react";
// import "../css/Navbar1.css";
import "../css/Navbar1.css";
import navbarItems from "../variables/NavbarItems";
import {
  FaAngleDown,
  FaBars,
  FaTimes,
  FaClipboardCheck,
  FaFileCode,
} from "react-icons/fa";

// UPDATED: Added selectedPage to props
const NavBar = ({ onTechnologySelect, selectedTechnology, selectedPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Theme Rotation Logic
  // useEffect(() => {
  //   const themes = [
  //     {
  //       bg: "rgba(225, 245, 254, 0.35)", // Sky Blue Glass (Default)
  //       text: "#1e293b",
  //     },
  //     {
  //       bg: "rgba(240, 253, 244, 0.45)", // Mint Green Glass
  //       text: "#064e3b",
  //     },
  //     {
  //       bg: "rgba(255, 247, 237, 0.45)", // Warm Orange Glass
  //       text: "#7c2d12",
  //     },
  //     {
  //       bg: "rgba(238, 242, 255, 0.45)", // Indigo Glass
  //       text: "#312e81",
  //     },
  //     {
  //       bg: "rgba(250, 245, 255, 0.45)", // Purple Glass
  //       text: "#581c87",
  //     },
  //   ];

  //   let currentThemeIndex = 0;

  //   const applyTheme = (index) => {
  //     const theme = themes[index];
  //     const navbar = document.querySelector(".navbar");
  //     if (navbar) {
  //       navbar.style.setProperty("--nav-bg", theme.bg);
  //       navbar.style.setProperty("--nav-text", theme.text);
  //     }
  //   };

  //   // Initial Apply
  //   applyTheme(0);

  //   const intervalId = setInterval(() => {
  //     currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  //     applyTheme(currentThemeIndex);
  //   }, 2 * 60 * 1000); // 5 Minutes

  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const handleSelection = (name) => {
    onTechnologySelect(name);
    setOpenDropdown(null);
    setMenuOpen(false);
  };

  const handleDropdownToggle = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleClass = () => window.open("/teachingclasses", "_blank");
  const handleExam = () => window.open("/exam", "_blank");
  const handleStartLearning = () => window.open("/learning", "_blank");
  const handleCompiler = () => window.open("/online-compiler", "_blank");

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </div>

      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {navbarItems.map((item, index) => (
          <li
            key={index}
            className={item.type === "dropdown" ? "navbar-item-dropdown" : ""}
          >
            <div
              className={`navbar-item ${
                item.type === "dropdown"
                  ? item.subItems.some((sub) => sub.name === selectedTechnology)
                    ? "active"
                    : ""
                  : // UPDATED LOGIC: Check selectedTechnology OR selectedPage
                  item.name === selectedTechnology || item.name === selectedPage
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                item.type === "dropdown"
                  ? handleDropdownToggle(item.name)
                  : handleSelection(item.name)
              }
            >
              <div className="navbar-content">
                {item.icon}
                <span>
                  {item.type === "dropdown"
                    ? item.subItems.find(
                        (sub) => sub.name === selectedTechnology
                      )?.name || item.name
                    : item.name}
                </span>
                {item.type === "dropdown" && (
                  <FaAngleDown
                    className={`dropdown-arrow ${
                      openDropdown === item.name ? "open" : ""
                    }`}
                  />
                )}
              </div>
            </div>

            {item.type === "dropdown" && openDropdown === item.name && (
              <ul className="dropdown-menu">
                {item.subItems.map((subItem, subIndex) => (
                  <li
                    key={subIndex}
                    className={`dropdown-item ${
                      selectedTechnology === subItem.name ? "active" : ""
                    }`}
                    onClick={() => handleSelection(subItem.name)}
                  >
                    {subItem.icon}
                    <span>{subItem.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}

        {/* <li onClick={handleClass} className="navbar-item">
          <div className="navbar-content">
            <FaClipboardCheck />
            <span>Class</span>
          </div>
        </li> */}

        <li onClick={handleExam} className="navbar-item">
          <div className="navbar-content">
            <FaClipboardCheck />
            <span>Quiz</span>
          </div>
        </li>

        <li onClick={handleStartLearning} className="navbar-item">
          <div className="navbar-content">
            <FaClipboardCheck />
            <span>Learning</span>
          </div>
        </li>

        <li onClick={handleCompiler} className="navbar-item">
          <div className="navbar-content">
            <FaFileCode />
            <span>Compiler's</span>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
