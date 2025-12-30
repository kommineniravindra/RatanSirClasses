import React from "react";
import "../css/LearningPaths.css";

const pathsData = [
  {
    title: "HTML5",
    description: "The structural foundation of the web.",
    icon: "/icons/html.png",
    bg: "/bg/html.avif",
    techKey: "HTML",
  },
  {
    title: "CSS3",
    description: "Styling and layout for modern web pages.",
    icon: "/icons/css.png",
    bg: "/bg/css.avif",
    techKey: "CSS",
  },
  {
    title: "JavaScript",
    description: "Dynamic programming for the web.",
    icon: "/icons/js.png",
    bg: "/bg/js.avif",
    techKey: "JavaScript",
  },
  {
    title: "React.js",
    description: "Building interactive UIs with components.",
    icon: "/icons/react.png",
    bg: "/bg/react.avif",
    techKey: "React",
  },
  {
    title: "Java",
    description: "Robust, object-oriented backend programming.",
    icon: "/icons/java.png",
    bg: "/bg/java.avif",
    techKey: "Java",
  },
  {
    title: "REST APIs",
    description: "Designing standards-based web services.",
    icon: "/icons/api.png",
    bg: "/bg/api.avif",
    techKey: "RESTAPI",
  },
  {
    title: "Microservices",
    description: "Architecting scalable, distributed systems.",
    icon: "/icons/microservices.png",
    bg: "/bg/microservices.avif",
    techKey: "Microservices",
  },
  {
    title: "Python",
    description: "Versatile language for backend and data.",
    icon: "/icons/python.png",
    bg: "/bg/python.avif",
    techKey: "Python",
  },
  {
    title: "SQL",
    description: "Managing and querying relational databases.",
    icon: "/icons/sql.png",
    bg: "/bg/sql.avif",
    techKey: "SQL",
  },
  {
    title: "Oracle",
    description: "Enterprise-grade database administration.",
    icon: "/icons/oracle.png",
    bg: "/bg/oracle.avif",
    techKey: "SQL", // Mapped to SQL as Oracle is a database
  },
  {
    title: "Node.js",
    description: "JavaScript runtime for server-side apps.",
    icon: "/icons/nodejs.png",
    bg: "/bg/node.jpg",
    techKey: "JavaScript", // Mapped to JavaScript
  },
  {
    title: "Express.js",
    description: "Minimalist web framework for Node.js.",
    icon: "/icons/express.png",
    bg: "/bg/express.avif",
    techKey: "JavaScript", // Mapped to JavaScript
  },
];

const LearningPaths = () => {
  const handleCardClick = (techKey) => {
    // Map techKey to OnlineCompiler apiLang
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
    // Open in new tab without Navbar (since /online-compiler is a direct route in App.js)
    window.open(`/online-compiler?lang=${targetLang}`, "_blank");
  };

  return (
    <section className="paths-root">
      <div className="paths-container">
        <h2 className="section-heading1">Explore Our Premium Courses</h2>
        <div className="paths-grid">
          {pathsData.map((path, index) => (
            <div
              key={index}
              className="path-card"
              onClick={() => handleCardClick(path.techKey)}
            >
              <div
                className="path-bg"
                style={{ backgroundImage: `url(${path.bg})` }}
              ></div>
              <div className="path-overlay"></div>

              <div className="path-content">
                <div className="path-icon-container">
                  <img
                    src={path.icon}
                    alt={path.title}
                    className="path-icon-img"
                  />
                </div>

                <div className="path-info">
                  <h3>
                    {path.title} <span>&gt;</span>
                  </h3>
                  <p>{path.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningPaths;
