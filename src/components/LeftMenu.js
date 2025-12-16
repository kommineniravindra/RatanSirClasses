import React, { useState, useEffect } from "react";
import {
  FaChevronCircleRight,
  FaLongArrowAltRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import "../css/LeftMenu.css";

const LeftMenu = ({ selectedItem, menuData, onItemClick }) => {
  // find parent group for a selected subitem
  const findParentGroup = (itemName) => {
    if (!itemName) return null;
    return menuData.find((group) =>
      group.subItems?.some((sub) => sub.name === itemName)
    );
  };

  const [expandedItem, setExpandedItem] = useState(() => {
    const parent = findParentGroup(selectedItem);
    return parent ? parent.name : menuData.length > 0 ? menuData[0].name : null;
  });

  const [mountedGroup, setMountedGroup] = useState(expandedItem);
  const [animateGroup, setAnimateGroup] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile toggle

  useEffect(() => {
    const parent = findParentGroup(selectedItem);
    if (parent && parent.name !== expandedItem) {
      setExpandedItem(parent.name);
    }
  }, [selectedItem, menuData]);

  useEffect(() => {
    let mountTimer;
    let unmountTimer;

    if (expandedItem) {
      setMountedGroup(expandedItem);
      mountTimer = setTimeout(() => setAnimateGroup(expandedItem), 25);
    } else {
      setAnimateGroup(null);
      unmountTimer = setTimeout(() => setMountedGroup(null), 220);
    }

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(unmountTimer);
    };
  }, [expandedItem]);

  // scroll to active item when selection changes (keeps your original behavior)
  useEffect(() => {
    const activeEl = document.querySelector(".menu-sublist-item.active");
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedItem]);

  // clicking main header
  const handleExpand = (itemName) => {
    if (expandedItem === itemName) {
      setExpandedItem(null);
    } else {
      setExpandedItem(itemName);

      const targetGroup = menuData.find((it) => it.name === itemName);
      if (targetGroup?.subItems?.length > 0) {
        const firstSubItemName = targetGroup.subItems[0].name;
        onItemClick(firstSubItemName);
      }
    }
  };

  return (
    <div
      className={`left-menu-container ${isMobileMenuOpen ? "mobile-open" : ""}`}
    >
      {/* Mobile Toggle Button */}
      <div
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span className="toggle-text">
          {isMobileMenuOpen ? "Close Menu" : "Select Topic"}
        </span>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul
        className={`left-menu list-group ${
          isMobileMenuOpen ? "show-on-mobile" : ""
        }`}
      >
        {menuData.map((item, index) => (
          <li key={index} className="list-group-item">
            <h4
              onClick={() => handleExpand(item.name)}
              className="menu-list-item"
            >
              {item.name}
              <FaChevronCircleRight
                className={`menu-toggle-icon ${
                  expandedItem === item.name ? "open" : ""
                }`}
              />
            </h4>

            {mountedGroup === item.name && item.subItems && (
              <ul
                className={`menu-sublist-menu list-group ${
                  animateGroup === item.name ? "submenu-open" : ""
                }`}
              >
                {item.subItems.map((subitem, subindex) => (
                  <li key={subindex} className="list-group-item">
                    <div
                      onClick={() => {
                        onItemClick(subitem.name);
                        setIsMobileMenuOpen(false); // Close menu on mobile
                      }}
                      className={`menu-sublist-item ${
                        selectedItem === subitem.name ? "active" : ""
                      }`}
                      // apply per-item transitionDelay only while the group is animating open
                      style={{
                        transitionDelay:
                          animateGroup === item.name
                            ? `${subindex * 0.12}s`
                            : "0s",
                      }}
                    >
                      {/* <FaAngleRight className="submenu-item-icon" />
                      <FaArrowRight className="submenu-item-icon" /> */}
                      <FaLongArrowAltRight className="submenu-item-icon" />
                      {/* <MdKeyboardArrowRight className="submenu-item-icon" /> */}
                      {/* <HiChevronRight className="submenu-item-icon" /> */}
                      {subitem.name}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeftMenu;
