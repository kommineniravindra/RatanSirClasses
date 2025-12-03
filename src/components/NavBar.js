import React, { useEffect, useState } from "react";
import "../css/Navbar.css";
import navbarItems from "../variables/NavbarItems";
import { FaAngleDown, FaBars, FaTimes, FaClipboardCheck } from "react-icons/fa";

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

        <li onClick={handleClass} className="navbar-item">
          <div className="navbar-content">
            <FaClipboardCheck />
            <span>Class</span>
          </div>
        </li>

        <li onClick={handleExam} className="navbar-item">
          <div className="navbar-content">
            <FaClipboardCheck />
            <span>Quiz</span>
          </div>
        </li>

        {/* <li onClick={handleStartLearning} className="navbar-item">
          <div className="navbar-content">
            <FaClipboardCheck />
            <span>Learning</span>
          </div>
        </li> */}
      </ul>
    </nav>
  );
};

export default NavBar;