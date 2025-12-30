import React from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPaperPlane,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import "../css/Footer.css";

const Footer = ({ onNavigate }) => {
  return (
    <footer className="global-footer">
      <div className="footer-content">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div className="brand-logo">
            <h2>CodePulse-R</h2>
            <div className="brand-line"></div>
          </div>
          <p className="footer-desc">
            Empowering the next generation of developers with cutting-edge
            resources, real-world projects, and expert mentorship.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">
              <FaTwitter />
            </a>
            <a href="#" className="social-link">
              <FaFacebookF />
            </a>
            <a href="#" className="social-link">
              <FaInstagram />
            </a>
            <a href="#" className="social-link">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col links-col">
          <h3>Explore</h3>
          <ul className="footer-menu">
            <li>
              <a
                href="/?page=Home"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("Home");
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/?page=AboutUs"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("AboutUs");
                }}
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/?page=DSA"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("DSA");
                }}
              >
                DSA Practice
              </a>
            </li>
            <li>
              <a
                href="/?page=ContactUs"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("ContactUs");
                }}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Legal & Support */}
        <div className="footer-col links-col">
          <h3>Legal</h3>
          <ul className="footer-menu">
            <li>
              <a
                href="/?page=PrivacyPolicy"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("PrivacyPolicy");
                }}
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/?page=TermsOfService"
                onClick={(e) => {
                  e.preventDefault(); 
                  onNavigate("TermsOfService");
                }}
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#">Cookie Policy</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Newsletter & Info */}
        <div className="footer-col contact-col">
          <h3>Stay Updated</h3>
          <p>Get the latest updates and resources delivered to your inbox.</p>
          <div className="newsletter-box">
            <input type="email" placeholder="Enter your email" />
            <button>
              <FaPaperPlane />
            </button>
          </div>
          <div className="contact-info">
            <p>
              <FaMapMarkerAlt className="icon" /> Hyderabad, India
            </p>
            <p>
              <FaEnvelope className="icon" /> support@codepulse-r.com
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          © {new Date().getFullYear()} CodePulse-R. All Rights Reserved.
        </div>
        <div className="bottom-links">
          <a href="#">Security</a>
          <a
            href="/?page=Sitemap"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("Sitemap");
            }}
          >
            Sitemap
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
