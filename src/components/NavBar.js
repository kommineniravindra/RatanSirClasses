import React, { useEffect, useState, useRef } from "react";
// import "../css/Navbar1.css";
// import "../css/Navbar1.css";
import "../cssdark/Navbar1.css";
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

  const timeoutRef = useRef(null);

  const handleMouseEnter = (name) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 300); // 300ms delay to prevent flickering
  };

  return (
    <nav
      className={`nb-navbar ${scrolled ? "scrolled" : ""} ${
        selectedPage !== "Home" ? "nb-navbar-alternate" : ""
      }`}
    >
      <div className="nb-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </div>

      <ul className={`nb-navbar-links ${menuOpen ? "open" : ""}`}>
        {navbarItems.map((item, index) => (
          <li
            key={index}
            className={
              item.type === "dropdown" ? "nb-navbar-item-dropdown" : ""
            }
            onMouseEnter={() => {
              if (item.type === "dropdown") {
                handleMouseEnter(item.name);
              }
            }}
            onMouseLeave={() => {
              if (item.type === "dropdown") {
                handleMouseLeave();
              }
            }}
          >
            <div
              className={`nb-navbar-item ${
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
              <div className="nb-navbar-content">
                {item.type === "dropdown"
                  ? item.subItems.find((sub) => sub.name === selectedTechnology)
                      ?.icon || item.icon
                  : item.icon}
                <span>
                  {item.type === "dropdown"
                    ? item.subItems.find(
                        (sub) => sub.name === selectedTechnology
                      )?.name || item.name
                    : item.name}
                </span>
                {item.type === "dropdown" && (
                  <FaAngleDown
                    className={`nb-dropdown-arrow ${
                      openDropdown === item.name ? "open" : ""
                    }`}
                  />
                )}
              </div>
            </div>

            {item.type === "dropdown" && openDropdown === item.name && (
              <ul className="nb-dropdown-menu">
                {item.subItems.map((subItem, subIndex) => (
                  <li
                    key={subIndex}
                    className={`nb-dropdown-item1 ${
                      selectedTechnology === subItem.name ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent bubbling causing issues
                      handleSelection(subItem.name);
                    }}
                  >
                    {subItem.icon}
                    <span>{subItem.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}

        <li onClick={handleClass} className="nb-navbar-item">
          <div className="nb-navbar-content">
            <FaClipboardCheck />
            <span>Class</span>
          </div>
        </li>

        <li onClick={handleExam} className="nb-navbar-item">
          <div className="nb-navbar-content">
            <FaClipboardCheck />
            <span>Quiz</span>
          </div>
        </li>

        {/* <li onClick={handleStartLearning} className="nb-navbar-item">
          <div className="nb-navbar-content">
            <FaClipboardCheck />
            <span>Learning</span>
          </div>
        </li> */}

        <li onClick={handleCompiler} className="nb-navbar-item">
          <div className="nb-navbar-content">
            <FaFileCode />
            <span>Compiler's</span>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
