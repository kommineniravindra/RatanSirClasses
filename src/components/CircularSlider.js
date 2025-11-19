import React, { useState, useEffect } from "react";
import "../css/CircularSlider.css";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import {
  FaHtml5,
  FaCss3Alt,
  FaReact,
  FaJava,
  FaPython,
  FaDatabase,
  FaCogs,
  FaCode,
  FaClipboardCheck,
  FaQuestionCircle,
  FaTags,
  FaWpforms,
  FaUniversalAccess,
  FaPhotoVideo,
  FaBoxOpen,
  FaTh,
  FaFilm,
  FaStarHalfAlt,
  FaLink,
  FaProjectDiagram,
  FaRoute,
  FaArchive,
  FaObjectGroup,
  FaSitemap,
  FaUsersCog,
  FaBox,
  FaServer,
  FaCloud,
  FaShieldAlt,
  FaCodeBranch,
  FaBook,
  FaSearchLocation,
  FaDocker,
  FaUserShield,
  FaTerminal,
  FaBookOpen,
  FaFileCode,
  FaFolder,
  FaBolt,
  FaSearch,
  FaExchangeAlt,
  FaWindowMaximize,
  FaListOl,
  FaShareAlt,
  FaSortAlphaDown,
  FaHashtag,
  FaBrain,
  FaClock,
  FaChartBar,
  FaTag,
  FaPoll,
  FaCheckCircle,
  FaGamepad,
  FaChartLine,
  FaTrophy,
  FaHistory,
  FaStar,
  FaWaveSquare,
  FaRocket,
  FaUserPlus,
  FaGlobe,
} from "react-icons/fa";
import { SiSpringboot } from "react-icons/si";

const CircularSlider = ({ onStartLearning }) => {
  const courses = [
    {
      title: "HTML Fundamentals",
      techKey: "HTML",
      category: "Frontend",
      color: "#e44c269e",
      description: "Learn the structure of web pages with semantic HTML5.",
      icon: <FaHtml5 />,
      features: [
        { title: "Semantic Tags", desc: "Meaningful HTML.", icon: <FaTags /> },
        {
          title: "Forms & Input",
          desc: "Interactive forms.",
          icon: <FaWpforms />,
        },
        {
          title: "Accessibility",
          desc: "Pages for everyone.",
          icon: <FaUniversalAccess />,
        },
        {
          title: "Media Elements",
          desc: "Embed audio/video.",
          icon: <FaPhotoVideo />,
        },
        {
          title: "Web Storage",
          desc: "Use localStorage.",
          icon: <FaDatabase />,
        },
      ],
    },
    {
      title: "CSS Styling",
      techKey: "CSS",
      category: "Frontend",
      color: "#2965f19f",
      description: "Style your web pages with CSS3 and master layouts.",
      icon: <FaCss3Alt />,
      features: [
        { title: "Flexbox", desc: "Master 1D layouts.", icon: <FaBoxOpen /> },
        { title: "Grid", desc: "Master 2D layouts.", icon: <FaTh /> },
        { title: "Animations", desc: "Add dynamic effects.", icon: <FaFilm /> },
        { title: "Variables", desc: "Reusable styles.", icon: <FaCogs /> },
        {
          title: "Pseudo-classes",
          desc: "Style dynamically.",
          icon: <FaStarHalfAlt />,
        },
      ],
    },
    {
      title: "ReactJS Development",
      techKey: "React",
      category: "Frontend",
      color: "#52d3f6ff",
      description: "Build scalable UIs with ReactJS and reusable components.",
      icon: <FaReact />,
      features: [
        { title: "Components", desc: "Modular UI blocks.", icon: <FaReact /> },
        { title: "Hooks API", desc: "Manage state simply.", icon: <FaLink /> },
        {
          title: "Virtual DOM",
          desc: "Efficient UI updates.",
          icon: <FaProjectDiagram />,
        },
        { title: "React Router", desc: "Page navigation.", icon: <FaRoute /> },
        { title: "State Mgmt", desc: "Context or Redux.", icon: <FaArchive /> },
      ],
    },
    {
      title: "Java Programming",
      techKey: "Java",
      category: "Backend",
      color: "#f89720c8",
      description: "Learn Java OOP, collections, and backend coding.",
      icon: <FaJava />,
      features: [
        {
          title: "OOP Concepts",
          desc: "Classes & objects.",
          icon: <FaObjectGroup />,
        },
        {
          title: "Data Structures",
          desc: "Arrays, lists, maps.",
          icon: <FaSitemap />,
        },
        { title: "Concurrency", desc: "Multithreading.", icon: <FaUsersCog /> },
        { title: "Lambda", desc: "Functional code.", icon: <FaCode /> },
        { title: "Build Tools", desc: "Maven & Gradle.", icon: <FaBox /> },
      ],
    },
    {
      title: "REST API Development",
      techKey: "RESTAPI",
      category: "Backend",
      color: "#2c3e50a6",
      description: "Design and build REST APIs with best practices.",
      icon: <FaCogs />,
      features: [
        { title: "HTTP Methods", desc: "GET, POST, PUT.", icon: <FaServer /> },
        { title: "Statelessness", desc: "Core design.", icon: <FaCloud /> },
        { title: "Security", desc: "Authentication.", icon: <FaShieldAlt /> },
        {
          title: "Versioning",
          desc: "Manage API changes.",
          icon: <FaCodeBranch />,
        },
        {
          title: "Documentation",
          desc: "Tools like Swagger.",
          icon: <FaBook />,
        },
      ],
    },
    {
      title: "Microservices",
      techKey: "Microservices",
      category: "Backend",
      color: "#16a084cd",
      description: "Learn microservice architecture with Spring Boot.",
      icon: <SiSpringboot />,
      features: [
        {
          title: "Service Discovery",
          desc: "Locate services.",
          icon: <FaSearchLocation />,
        },
        { title: "Gateway API", desc: "Route requests.", icon: <FaRoute /> },
        {
          title: "Containerization",
          desc: "Deploy with Docker.",
          icon: <FaDocker />,
        },
        {
          title: "Spring Data JPA",
          desc: "Database access.",
          icon: <FaDatabase />,
        },
        {
          title: "Spring Security",
          desc: "Protect services.",
          icon: <FaUserShield />,
        },
      ],
    },
    {
      title: "Python Programming",
      techKey: "Python",
      category: "Backend / Data",
      color: "#3777abc5",
      description: "Python for web, automation, and data science.",
      icon: <FaPython />,
      features: [
        {
          title: "Syntax & Basics",
          desc: "Fundamentals.",
          icon: <FaTerminal />,
        },
        { title: "Libraries", desc: "Pandas, NumPy.", icon: <FaBookOpen /> },
        { title: "Scripting", desc: "Task automation.", icon: <FaFileCode /> },
        { title: "Virtual Env", desc: "Isolate projects.", icon: <FaFolder /> },
        { title: "Asyncio", desc: "Concurrent code.", icon: <FaBolt /> },
      ],
    },
    {
      title: "SQL & Databases",
      techKey: "SQL",
      category: "Database",
      color: "#00618a95",
      description: "Master SQL queries and database design.",
      icon: <FaDatabase />,
      features: [
        { title: "Querying Data", desc: "SELECT, JOIN.", icon: <FaSearch /> },
        {
          title: "DB Design",
          desc: "Normalization.",
          icon: <FaProjectDiagram />,
        },
        {
          title: "Transactions",
          desc: "ACID properties.",
          icon: <FaExchangeAlt />,
        },
        { title: "Stored Procs", desc: "Reusable SQL.", icon: <FaCogs /> },
        {
          title: "Window Funcs",
          desc: "Advanced analytics.",
          icon: <FaWindowMaximize />,
        },
      ],
    },
    {
      title: "DSA Mastery",
      category: "Computer Science",
      color: "#c03a2b94",
      description: "Learn data structures and algorithms with hands-on coding.",
      icon: <FaCode />,
      features: [
        { title: "Arrays & Lists", desc: "Fundamentals.", icon: <FaListOl /> },
        {
          title: "Trees & Graphs",
          desc: "Complex data.",
          icon: <FaShareAlt />,
        },
        {
          title: "Sorting & Search",
          desc: "Algorithms.",
          icon: <FaSortAlphaDown />,
        },
        {
          title: "Hash Tables",
          desc: "Key-value lookups.",
          icon: <FaHashtag />,
        },
        { title: "Dynamic Prog", desc: "Solve problems.", icon: <FaBrain /> },
      ],
    },
    {
      title: "Exam Facility",
      category: "Practice",
      color: "#8d44ad8b",
      description: "Mock exams to test your knowledge like real assessments.",
      icon: <FaClipboardCheck />,
      features: [
        { title: "Timed Tests", desc: "Simulate pressure.", icon: <FaClock /> },
        {
          title: "Detailed Reports",
          desc: "Find weaknesses.",
          icon: <FaChartBar />,
        },
        { title: "Topic-wise", desc: "Focus on areas.", icon: <FaTag /> },
        { title: "Analytics", desc: "Track performance.", icon: <FaPoll /> },
        {
          title: "Question Bank",
          desc: "Variety of questions.",
          icon: <FaQuestionCircle />,
        },
      ],
    },
    {
      title: "Quiz Facility",
      category: "Practice",
      color: "#27ae5fc7",
      description:
        "Interactive quizzes to reinforce learning and track progress.",
      icon: <FaQuestionCircle />,
      features: [
        {
          title: "Instant Feedback",
          desc: "Learn as you go.",
          icon: <FaCheckCircle />,
        },
        {
          title: "Gamified Learning",
          desc: "Engaging and fun.",
          icon: <FaGamepad />,
        },
        {
          title: "Progress Track",
          desc: "Monitor growth.",
          icon: <FaChartLine />,
        },
        {
          title: "Leaderboards",
          desc: "Compete with peers.",
          icon: <FaTrophy />,
        },
        {
          title: "Spaced Repetition",
          desc: "Improve retention.",
          icon: <FaHistory />,
        },
      ],
    },
  ];

  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % courses.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + courses.length) % courses.length);

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 4500);
    return () => clearInterval(slideInterval);
  }, []);

  const currentCourse = courses[index];

  const handleStartLearning = (e) => {
    e.preventDefault();
    if (onStartLearning && currentCourse.techKey) {
      onStartLearning(currentCourse.techKey);
    }
  };

  return (
    <div className="carousel" style={{ background: currentCourse.color }}>
          <div className="abx-wrap">
            {/* floating decorative icons */}
            <div className="abx-floating-icons">
              <FaBolt className="abx-float abx-f1" />
              <FaStar className="abx-float abx-f3" />
              <FaWaveSquare className="abx-float abx-f2" />
              <FaCode className="abx-float abx-f4" />
              <FaRocket className="abx-float abx-f5" />
              <FaUserPlus className="abx-float abx-f6" />
              <FaGlobe className="abx-float abx-f7" />
            </div>
            </div>
      <div className="carousel-inner">
        <div className="image-box">
          <div className="main-icon-container">
            {courses.map((course, i) => {
              let position = "next";
              if (i === index) position = "active";
              else if (i === (index - 1 + courses.length) % courses.length)
                position = "prev";

              return (
                <div key={i} className={`course-icon ${position}`}>
                  {course.icon}
                </div>
              );
            })}
          </div>
          <div className="feature-boxes-container" key={`features-${index}`}>
            {currentCourse.features.map((feature, idx) => (
              <div key={idx} className="feature-box">
                <span className="feature-icon1">{feature.icon}</span>
                <h4>{feature.title}</h4>
              </div>
            ))}
          </div>
        </div>

        <div className="info-box" key={index}>
          <h2>{currentCourse.title}</h2>
          <h3>{currentCourse.category}</h3>

          <div className="colors">
            {courses.map((c, idx) => (
              <span
                key={idx}
                style={{ background: c.color }}
                className={idx === index ? "active" : ""}
                onClick={() => setIndex(idx)}
              ></span>
            ))}
          </div>

          <p>{currentCourse.description}</p>

          {currentCourse.techKey && (
            <a href="#!" className="btn" onClick={handleStartLearning}>
              Start Learning
            </a>
          )}
        </div>
      </div>
      <div className="navigation">
        <span className="prev-btn" onClick={prevSlide}>
          <BsChevronLeft />
        </span>
        <span className="next-btn" onClick={nextSlide}>
          <BsChevronRight />
        </span>
      </div>
    </div>
  );
};

export default CircularSlider;
