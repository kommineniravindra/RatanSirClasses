import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaJava,
  FaPython,
  FaHtml5,
  FaDatabase,
  FaChalkboardTeacher,
  FaBookOpen,
  FaUserCheck,
  FaUsers,
  FaInfinity,
  FaRocket,
  FaGithub,
  FaLinkedin,
  FaFileAlt,
  FaLightbulb,
  FaReact,
  FaCloud,
  FaProjectDiagram,
  FaCss3Alt,
  FaJs,
  FaCertificate,
  FaHandsHelping,
  FaLaptopCode,
  FaGlobe,
} from "react-icons/fa";
import { SiSpringboot } from "react-icons/si";

// import "../css/Home.css";
import "../css/Home1.css";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import Globe from "../components/Globe";
import CircularSlider from "../components/CircularSlider";
import HomeUI1 from "./HomeUI1";

Modal.setAppElement("#root");

// --- Data Arrays (Moved outside component to prevent re-creation on render) ---
const courses = [
  {
    icon: <FaHtml5 />,
    title: "HTML5",
    description: "Learn to structure the web with HTML5.",
    content:
      "Covers semantic tags, forms, multimedia, canvas, and accessibility best practices.",
  },
  {
    icon: <FaCss3Alt />,
    title: "CSS3",
    description: "Style modern and responsive web pages.",
    content:
      "Covers Flexbox, Grid, Animations, Media Queries, and advanced CSS techniques.",
  },
  {
    icon: <FaJs />,
    title: "JavaScript",
    description: "Become proficient in modern JavaScript.",
    content:
      "Covers ES6+, DOM manipulation, Async programming, Fetch API, and advanced concepts like closures and promises.",
  },
  {
    icon: <FaJava />,
    title: "Java Programming",
    description: "Learn the fundamentals of Java from scratch.",
    content:
      "Covers OOP concepts, Collections, Multithreading, Exception Handling, and Java best practices.",
  },
  {
    icon: <SiSpringboot />,
    title: "Spring REST API",
    description: "Build scalable backend services with Spring Boot.",
    content:
      "Learn Spring Boot, REST API design, JPA, Hibernate, Spring Security, and API documentation with Swagger.",
  },
  {
    icon: <FaProjectDiagram />,
    title: "Microservices",
    description: "Design and build distributed systems like Netflix & Amazon.",
    content:
      "Learn Microservices patterns, Spring Cloud, API Gateway, Service Discovery, Circuit Breaker, and Event-driven architecture.",
  },
  {
    icon: <FaPython />,
    title: "Python",
    description: "Unlock Python for backend and web development.",
    content:
      "Covers Django, Flask, REST APIs, Databases, and deployment strategies.",
  },
  {
    icon: <FaDatabase />,
    title: "SQL & Databases",
    description: "Master SQL for backend and analytics.",
    content:
      "Learn MySQL, PostgreSQL, Queries, Joins, Transactions, Indexing, Normalization, and stored procedures.",
  },
  {
    icon: <FaReact />,
    title: "React.js Frontend",
    description: "Build modern, interactive, and fast UIs with React.",
    content:
      "Covers components, hooks, state management, React Router, Context API, and integration with backend APIs.",
  },
  {
    icon: <FaCloud />,
    title: "Cloud & DevOps",
    description: "Deploy, scale, and manage applications in the cloud.",
    content:
      "Learn AWS basics, Docker containerization, Kubernetes orchestration, CI/CD pipelines, and cloud deployment strategies.",
  },
];

const features = [
  {
    icon: <FaChalkboardTeacher size={40} />,
    title: "Expert Instructors",
    text: "Learn from industry professionals with years of real-world experience.",
  },
  {
    icon: <FaBookOpen size={40} />,
    title: "Practical Curriculum",
    text: "Our courses are project-based, ensuring you build a solid portfolio.",
  },
  {
    icon: <FaUserCheck size={40} />,
    title: "Career Support",
    text: "Get help with your resume, portfolio, and interview preparation.",
  },
  {
    icon: <FaUsers size={40} />,
    title: "Vibrant Community",
    text: "Connect with fellow learners, share ideas, and get help in our active community forums.",
  },
  {
    icon: <FaInfinity size={40} />,
    title: "Lifetime Access",
    text: "Enroll once and get lifetime access to course materials, including all future updates.",
  },
  {
    icon: <FaRocket size={40} />,
    title: "Cutting-Edge Content",
    text: "Our curriculum is constantly updated to keep you ahead with the latest technologies.",
  },
  {
    icon: <FaCertificate size={40} />,
    title: "Certification",
    text: "Earn industry-recognized certificates to showcase your expertise to employers.",
  },
  {
    icon: <FaHandsHelping size={40} />,
    title: "1-on-1 Mentorship",
    text: "Get personalized guidance and mentorship to accelerate your learning journey.",
  },
  {
    icon: <FaLaptopCode size={40} />,
    title: "Hands-On Projects",
    text: "Work on real-world projects to apply your knowledge and build confidence.",
  },
  {
    icon: <FaGlobe size={40} />,
    title: "Global Networking",
    text: "Join an international network of learners and professionals across industries.",
  },
];

const careerSupportSteps = [
  {
    icon: <FaGithub />,
    title: "GitHub Profile",
    description:
      "Guidance on creating and maintaining a professional GitHub profile to showcase technical projects and coding process.",
  },
  {
    icon: <FaLinkedin />,
    title: "LinkedIn Profile",
    description:
      "Assistance in crafting a compelling LinkedIn profile for networking and visibility among recruiters.",
  },
  {
    icon: <FaFileAlt />,
    title: "Resume Preparation",
    description:
      "Expert advice on resume writing to effectively highlight skills, experience, and achievements.",
  },
  {
    icon: <FaLightbulb />,
    title: "Help in Applying",
    description:
      "Support in identifying suitable job opportunities and navigating the application process.",
  },
  {
    icon: <FaProjectDiagram />,
    title: "Real-Time Project",
    description:
      "Hands-on experience with real-time projects to apply theoretical knowledge and build industry-relevant skills.",
  },
];

const testimonials = [
  {
    name: "Alex Johnson",
    course: "Full Stack Java",
    quote:
      "This course was a game-changer! The hands-on projects helped me land my dream job.",
  },
  {
    name: "Priya Sharma",
    course: "JavaScript & React",
    quote:
      "The instructor explained complex topics so clearly. I finally understand React Hooks!",
  },
  {
    name: "Michael Lee",
    course: "Python & Django",
    quote:
      "I loved the hands-on projects. They really helped me understand how to build real web apps.",
  },
  {
    name: "Sara Williams",
    course: "React.js Frontend Development",
    quote:
      "The React course made everything so easy to grasp. The projects were fun and practical.",
  },
  {
    name: "David Kim",
    course: "Cloud & DevOps",
    quote:
      "Thanks to the cloud & DevOps course, I confidently deployed my first project to AWS.",
  },
];

//  Accept the 'onTechnologySelect' prop from the parent component (Master.js)
const Home = ({ onTechnologySelect }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const coursesSectionRef = useRef(null);

  const openModal = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setTimeout(() => setModalContent(null), 300);
  };

  const handleExploreClick = () => {
    coursesSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
  };

  return (
    <>
      <div className="home-container">
        <HomeUI1 />

        {/* --- Hero Section --- */}
        {/* <motion.section className="hero-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <video autoPlay loop muted playsInline className="hero-video">
          <source src="/v1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <motion.h1 initial={{ y: -30 }} animate={{ y: 0 }} transition={{ delay: 0.3, type: "spring" }}>
            𝑼𝒏𝒍𝒐𝒄𝒌 𝒀𝒐𝒖𝒓 𝑪𝒐𝒅𝒊𝒏𝒈 𝑷𝒐𝒕𝒆𝒏𝒕𝒊𝒂𝒍
          </motion.h1>
          <motion.p initial={{ y: 30 }} animate={{ y: 0 }} transition={{ delay: 0.4, type: "spring" }}>
            Join thousands of learners and accelerate your career in tech with our courses.
          </motion.p>
          <motion.button className="hero-cta-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleExploreClick}>
            Explore Courses
          </motion.button>
        </div>
      </motion.section> */}

        {/* --- Career Acceleration Section --- */}
        <section className="career-support-section">
          <motion.div
            className="career-support-container"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="career-support-content">
              <h2 className="section-heading">Career Acceleration Path</h2>
              <motion.div
                className="timeline-container"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
              >
                {careerSupportSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="timeline-item"
                    variants={itemVariants}
                  >
                    <div className="timeline-icon-container">
                      <div className="timeline-icon">{step.icon}</div>
                    </div>
                    <div className="timeline-text">
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.button
                className="contact-advisor-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Course Advisor
              </motion.button>
            </div>
            <motion.div
              className="career-support-image"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <img src="/img12.jpg" alt="Global Opportunities" />
            </motion.div>
          </motion.div>
        </section>

        {/* --- Premium Courses Cards Section --- */}
        <section ref={coursesSectionRef} className="cards-container-section">
          <h2 className="section-heading">Explore Our Premium Courses</h2>
          <motion.div
            className="cards-container"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            {courses.map((course, index) => (
              <motion.div
                key={index}
                className="course-card"
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                  boxShadow: "0px 15px 30px rgba(0,0,0,0.2)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => openModal(course.content)}
              >
                <div className="course-card-icon">{course.icon}</div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* <Globe /> */}

        {/* --- "Why Choose Us" Section --- */}
        <section className="features-section">
          <h2 className="section-heading">Why Learn With Us?</h2>

          {/* Row 1: Left to Right scroll */}
          <div className="scroll-wrapper left-scroll">
            <div className="scroll-track">
              {/* Original Items + Duplicates for seamless loop */}
              {[...features.slice(0, 5), ...features.slice(0, 5)].map(
                (feature, index) => (
                  <div key={`row1-${index}`} className="feature-card-scroll">
                    <div className="feature-icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Row 2: Right to Left scroll */}
          <div className="scroll-wrapper right-scroll">
            <div className="scroll-track reverse-track">
              {/* Original Items + Duplicates for seamless loop */}
              {[...features.slice(5, 10), ...features.slice(5, 10)].map(
                (feature, index) => (
                  <div key={`row2-${index}`} className="feature-card-scroll">
                    <div className="feature-icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* --- Testimonials Section --- */}
        <section className="testimonials-section">
          <h2 className="section-heading">What Our Students Say</h2>
          <div className="testimonials-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                className="testimonial-card"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <p className="quote">
                  "{testimonials[currentTestimonial].quote}"
                </p>
                <p className="author">
                  - {testimonials[currentTestimonial].name},{" "}
                  <span>{testimonials[currentTestimonial].course}</span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* --- Modal --- */}
        <AnimatePresence>
          {modalIsOpen && (
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Course Detail Modal"
              className="modal-content"
              overlayClassName="modal-overlay"
              closeTimeoutMS={300}
            >
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <button onClick={closeModal} className="modal-close-btn">
                  ✖
                </button>
                <div className="modal-body">
                  <h2>Course Details</h2>
                  <p>{modalContent}</p>
                </div>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>

        {/* <div>
        <CircularSlider onStartLearning={onTechnologySelect} />
      </div> */}
        {/* <HomeUI1 /> */}
      </div>
    </>
  );
};

export default Home;
