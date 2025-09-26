import React, { useEffect, useState } from 'react';
import '../css/Navbar.css';
import navbarItems from '../variables/NavbarItems';
import { useNavigate } from 'react-router-dom';
import { FaAngleDown, FaBars, FaTimes, FaClipboardCheck } from 'react-icons/fa';

const NavBar = ({ onTechnologySelect, selectedTechnology }) => {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [menuOpen]);

  const handleSelection = (technologyName) => {
    onTechnologySelect(technologyName);
    setOpenDropdown(null);
    setMenuOpen(false);
  };

  const handleDropdownToggle = (itemName) => {
    setOpenDropdown(openDropdown === itemName ? null : itemName);
  };

  const navigate = useNavigate();

  const handleQuiz = () => {
    navigate("/ratan-tutotrials/quiz");
    setMenuOpen(false);
  };

  // const handleExam = () => {
  //   navigate("/ratan-tutotrials/exam");
  //   setMenuOpen(false);
  // };

  // this is opening in new tab
  const handleExam = () => {
  window.open("/ratan-tutotrials/exam", "_blank");
  setMenuOpen(false);
};

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-left">
        <span id="nav-header-content">Ratan sir classes</span>
      </div>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </div>

      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {navbarItems.map((item, index) => {
          if (item.type === 'dropdown') {
            const isParentActive = item.subItems.some(
              (subItem) => subItem.name === selectedTechnology
            );
            const selectedSubItem = item.subItems.find(
              (subItem) => subItem.name === selectedTechnology
            );
            const displayName = selectedSubItem ? selectedSubItem.name : item.name;

            return (
              <li key={index} className="navbar-item-dropdown">
                <div
                  className={`navbar-item ${isParentActive ? "active" : ""}`}
                  onClick={() => handleDropdownToggle(item.name)}
                >
                  <div className="navbar-content">
                    {item.icon}
                    <span>{displayName}</span>
                    <FaAngleDown
                      className={`dropdown-arrow ${openDropdown === item.name ? "open" : ""}`}
                    />
                  </div>
                </div>
                {openDropdown === item.name && (
                  <ul className="dropdown-menu">
                    {item.subItems.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className={`dropdown-item ${selectedTechnology === subItem.name ? "active" : ""}`}
                        onClick={() => handleSelection(subItem.name)}
                      >
                        {subItem.icon}
                        <span>{subItem.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          }

          return (
            <li key={index}>
              <div
                className={`navbar-item ${item.name === selectedTechnology || (item.name === "Home" && selectedTechnology === "") ? "active" : ""}`}
                onClick={() => handleSelection(item.name)}
              >
                <div className="navbar-content">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </div>
            </li>
          );
        })}

        {/* <li onClick={handleQuiz} className="navbar-item">
          <div className="navbar-content">
            <FaGift />
            <span>Quiz</span>
          </div>
        </li> */}
        <li onClick={handleExam} className="navbar-item">
          <div className="navbar-content">
            <FaClipboardCheck />
            <span>Quiz</span>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
