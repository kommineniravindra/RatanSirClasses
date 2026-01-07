import React from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
  FaPaperPlane,
  FaMapMarkerAlt,
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
            <button className="social-link" aria-label="Twitter">
              <FaTwitter />
            </button>
            <button className="social-link" aria-label="Facebook">
              <FaFacebookF />
            </button>
            <button className="social-link" aria-label="Instagram">
              <FaInstagram />
            </button>
            <button className="social-link" aria-label="LinkedIn">
              <FaLinkedinIn />
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col links-col">
          <h3>Explore</h3>
          <ul className="footer-menu">
            <li>
              <a
                href="/Home"
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
                href="/AboutUs"
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
                href="/DSA"
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
                href="/ContactUs"
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
                href="/PrivacyPolicy"
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
                href="/TermsOfService"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("TermsOfService");
                }}
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="/CookiePolicy"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("CookiePolicy");
                }}
              >
                Cookie Policy
              </a>
            </li>
            <li>
              <a
                href="/FAQ"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("FAQ");
                }}
              >
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter & Info */}
        <div className="footer-col contact-col">
          <h3>Stay Updated</h3>
          <p>Get the latest updates and resources delivered to your inbox.</p>
          <div className="newsletter-box">
            <input type="email" placeholder="Enter your email" />
            <button aria-label="Subscribe">
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
          <a
            href="/Security"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("Security");
            }}
          >
            Security
          </a>
          <a
            href="/Sitemap"
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
