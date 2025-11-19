import React from "react";
import { motion } from "framer-motion";
import {
  FaCode,
  FaUsers,
  FaCrown,
  FaRocket,
  FaCertificate,
  FaGraduationCap,
  FaGlobe,
  FaClock,
  FaHandshake,
  FaLaptopCode,
  FaEnvelope,
  FaBolt,
  FaStar,
  FaWaveSquare,
  FaUserPlus,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";
import "../css/AboutUs.css";

const viewport = { once: true, amount: 0.28 };

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.7, delay } },
  viewport,
});

const slideIn = (x = 0, delay = 0) => ({
  initial: { opacity: 0, x },
  whileInView: { opacity: 1, x: 0, transition: { duration: 0.75, delay } },
  viewport,
});

const AboutUs = () => {
  return (
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

      <motion.header {...fadeInUp(0)} className="abx-header">
        <h1 className="abx-title">
          Achieve <span>CodePulse - R</span>
        </h1>
        <p className="abx-subtext">
          CodePulse-R is the comprehensive ecosystem designed to transform
          beginners into job-ready professionals with a robust curriculum and
          dedicated career support.
        </p>
      </motion.header>

      <hr className="abx-divider" />

      <motion.section
        {...slideIn(-60, 0.05)}
        className="abx-gradient-section abx-gradient-top"
      >
        <motion.h2 {...fadeInUp(0.08)} className="abx-section-heading">
          🚀 Key Features
        </motion.h2>

        <div className="abx-card-wrapper abx-core-features-grid">
          <motion.div {...fadeInUp(0.12)} className="abx-card abx-feature-card">
            <FaGraduationCap className="abx-icon" />
            <h3>Expert Instructors</h3>
            <p>
              Learn from industry professionals with years of real-world
              experience.
            </p>
          </motion.div>

          <motion.div {...fadeInUp(0.16)} className="abx-card abx-feature-card">
            <FaClock className="abx-icon" />
            <h3>Lifetime Access</h3>
            <p>
              Enroll once and get lifetime access to course materials, including
              future updates.
            </p>
          </motion.div>

          <motion.div {...fadeInUp(0.2)} className="abx-card abx-feature-card">
            <FaCode className="abx-icon" />
            <h3>Practical Curriculum</h3>
            <p>
              Project-based courses that help you build a verifiable portfolio.
            </p>
          </motion.div>

          <motion.div {...fadeInUp(0.24)} className="abx-card abx-feature-card">
            <FaRocket className="abx-icon" />
            <h3>Cutting-Edge Content</h3>
            <p>
              Curriculum updated constantly to keep you ahead with latest
              technologies.
            </p>
          </motion.div>

          <motion.div {...fadeInUp(0.28)} className="abx-card abx-feature-card">
            <FaCrown className="abx-icon" />
            <h3>1-on-1 Mentorship</h3>
            <p>Personalized guidance to accelerate your learning journey.</p>
          </motion.div>

          <motion.div {...fadeInUp(0.32)} className="abx-card abx-feature-card">
            <FaGlobe className="abx-icon" />
            <h3>Global Networking</h3>
            <p>Join an international network of learners and professionals.</p>
          </motion.div>
          <motion.div {...fadeInUp(0.36)} className="abx-card abx-feature-card">
            <FaShieldAlt className="abx-icon" />
            <h3>Secure Learning Environment</h3>
            <p>
              All your progress, data, and achievements are protected with
              industry-grade security.
            </p>
          </motion.div>

          <motion.div {...fadeInUp(0.4)} className="abx-card abx-feature-card">
            <FaChartLine className="abx-icon" />
            <h3>Career Growth Insights</h3>
            <p>
              Smart analytics to track your progress and guide your career path
              effectively.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <hr className="abx-divider soft" />

      <motion.section {...slideIn(60, 0.05)} className="abx-section">
        <motion.h2 {...fadeInUp(0.1)} className="abx-section-heading">
          💼 Dedicated Career Support
        </motion.h2>

        <div className="abx-card-wrapper abx-career-support-grid">
          <motion.div {...fadeInUp(0.14)} className="abx-card abx-support-card">
            <FaLaptopCode className="abx-icon" />
            <h3>Real-Time Projects</h3>
            <p>
              Hands-on experience applying knowledge to industry-relevant work.
            </p>
          </motion.div>

          <motion.div {...fadeInUp(0.18)} className="abx-card abx-support-card">
            <FaUsers className="abx-icon" />
            <h3>LinkedIn & GitHub Guidance</h3>
            <p>
              Profile crafting and project showcase strategies that attract
              recruiters.
            </p>
          </motion.div>

          <motion.div {...fadeInUp(0.22)} className="abx-card abx-support-card">
            <FaHandshake className="abx-icon" />
            <h3>Resume & Interview Coaching</h3>
            <p>
              Resume help and mock interviews with feedback from industry
              mentors.
            </p>
          </motion.div>

          <motion.div {...fadeInUp(0.26)} className="abx-card abx-support-card">
            <FaEnvelope className="abx-icon" />
            <h3>Job Application Support</h3>
            <p>
              Help in identifying roles and navigating the application process.
            </p>
          </motion.div>

          <motion.div {...fadeInUp(0.3)} className="abx-card abx-support-card">
            <FaCertificate className="abx-icon" />
            <h3>Certification</h3>
            <p>Earn certificates to showcase your expertise to employers.</p>
          </motion.div>

          {/* <motion.div {...fadeInUp(0.34)} className="abx-card abx-support-card">
            <FaHandshake className="abx-icon" />
            <h3>Placement Assistance</h3>
            <p>Connect with hiring partners and receive placement guidance.</p>
          </motion.div> */}
        </div>
      </motion.section>

      <hr className="abx-divider" />

      <footer className="abx-footer">
        <div className="abx-footer-inner">
          <div>
            <strong>CodePulse-R</strong> · Crafted with the learning-first
            approach
          </div>
          <div>© {new Date().getFullYear()}</div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
