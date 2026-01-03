import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import "../css/HomeUI1.css";
import {
  FaGraduationCap,
  FaAngleRight,
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaPython,
  FaJava,
  FaDocker,
  FaAws,
  FaNodeJs,
  FaDatabase,
  FaServer,
  FaLaptopCode,
  FaArrowRight,
} from "react-icons/fa";
import { SiMysql, SiSpringboot } from "react-icons/si";

function HomeUI1({ onTechnologySelect }) {
  // Accept prop
  // const navigate = useNavigate();
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);

  const tickerItems = [
    { name: "HTML5", icon: FaHtml5, color: "#E34F26" },
    { name: "CSS3", icon: FaCss3Alt, color: "#1572B6" },
    { name: "JavaScript", icon: FaJs, color: "#F7DF1E" },
    { name: "React", icon: FaReact, color: "#61DAFB" },
    { name: "Node.js", icon: FaNodeJs, color: "#339933" },
    { name: "Python", icon: FaPython, color: "#3776AB" },
    { name: "Java", icon: FaJava, color: "#007396" },
    { name: "SQL", icon: SiMysql, color: "#4479A1" },
    { name: "AWS", icon: FaAws, color: "#FF9900" },
    { name: "Docker", icon: FaDocker, color: "#2496ED" },
    { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
  ];

  const icons = [
    { component: FaReact, color: "#61DAFB", key: "React" },
    { component: FaHtml5, color: "#E34F26", key: "HTML" },
    { component: FaCss3Alt, color: "#1572B6", key: "CSS" },
    { component: FaJs, color: "#F7DF1E", key: "JavaScript" },
    { component: FaPython, color: "#3776AB", key: "Python" },
    { component: FaJava, color: "#007396", key: "Java" },
    { component: FaDocker, color: "#2496ED", key: "" },
    { component: FaAws, color: "#FF9900", key: "" },
    { component: SiMysql, color: "#4479A1", key: "SQL" },
    { component: SiSpringboot, color: "#6DB33F", key: "Microservices" }, // Mapped to Microservices
  ];

  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [icons.length]);

  const CurrentIcon = icons[currentIconIndex].component;

const handleEnrollClick = () => {
  window.open("/account", "_blank", "noopener,noreferrer");
};


  const handleViewSyllabusClick = () => {
    setShowSyllabusModal(true);
  };

  const handleSphereClick = () => {
    const currentTech = icons[currentIconIndex].key;
    if (currentTech && onTechnologySelect) {
      onTechnologySelect(currentTech);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top to see changed content
    }
  };

  const handleCloseModal = () => {
    setShowSyllabusModal(false);
  };

  return (
    <div className="landing-wrapper">
      <header className="hero-section-glassy">
        <div className="hero-content-glassy">
          <h1 className="hero-title-glassy">
            Future of Tech
            <span className="text-light-blue-accent">Begins Here</span>
          </h1>

          <p className="hero-subtitle-glassy">
            Unlock structured learning paths, hands-on projects, and
            personalized support that take your skills to the next level.
          </p>
          <div className="hero-buttons-glassy">
            <button className="primary-btn-domed" onClick={handleEnrollClick}>
              <FaGraduationCap /> Enroll Now
            </button>
            <button
              className="secondary-btn-soft"
              onClick={handleViewSyllabusClick}
            >
              View Syllabus <FaAngleRight />
            </button>
          </div>
        </div>

        <div
          className="hero-graphic-sphere"
          onClick={handleSphereClick}
          style={{
            cursor: icons[currentIconIndex].key ? "pointer" : "default",
          }}
          title={icons[currentIconIndex].key ? "Click to learn more" : ""}
        >
          <CurrentIcon
            className="sphere-icon fade-transition"
            style={{ color: icons[currentIconIndex].color }}
          />
        </div>
      </header>

      {/* SYLLABUS MODAL */}
      {showSyllabusModal && (
        <div className="syllabus-modal-overlay">
          <div className="syllabus-modal-content">
            <button className="modal-close-btn" onClick={handleCloseModal}>
              X
            </button>
            <h2 className="modal-title">Full Stack Development Flow</h2>
            <div className="flow-diagram">
              {/* FRONTEND */}
              <div className="flow-step">
                <div className="step-icon-wrapper frontend-bg">
                  <FaLaptopCode className="step-icon" />
                </div>
                <h3 className="step-title">Frontend</h3>
                <p className="step-desc">React, HTML5, CSS3</p>
              </div>

              {/* ARROW */}
              <div className="flow-arrow">
                <FaArrowRight />
              </div>

              {/* BACKEND */}
              <div className="flow-step">
                <div className="step-icon-wrapper backend-bg">
                  <FaServer className="step-icon" />
                </div>
                <h3 className="step-title">Backend</h3>
                <p className="step-desc">Node.js, Java, Python</p>
              </div>

              {/* ARROW */}
              <div className="flow-arrow">
                <FaArrowRight />
              </div>

              {/* DATABASE */}
              <div className="flow-step">
                <div className="step-icon-wrapper db-bg">
                  <FaDatabase className="step-icon" />
                </div>
                <h3 className="step-title">Database</h3>
                <p className="step-desc">MySQL, MongoDB</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div className="ticker-item" key={index}>
              <item.icon style={{ color: item.color, fontSize: "1.5rem" }} />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeUI1;
