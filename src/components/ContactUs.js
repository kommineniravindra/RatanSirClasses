import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/ContactUs.css"; // adjust path if needed

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const validate = (f) => {
    const errs = {};
    if (!f.name.trim()) errs.name = "Name is required";
    if (!f.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(f.email)) errs.email = "Invalid email";
    if (f.phone && !/^[\d +()-]{7,20}$/.test(f.phone)) errs.phone = "Invalid phone";
    if (!f.message.trim() || f.message.trim().length < 10) errs.message = "Message must be at least 10 characters";
    return errs;
  };

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, message: true });

    if (!isValid) {
      Swal.fire({ icon: "error", title: "Fix form errors", text: "Please correct the fields marked in red." });
      return;
    }

    setLoading(true);
    try {
      // Replace endpoint with your real backend endpoint
      await axios.post("/api/contact", form, { headers: { "Content-Type": "application/json" } });

      Swal.fire({
        icon: "success",
        title: "Sent!",
        text: "Your message was delivered. We'll get back to you soon.",
        timer: 2200,
        showConfirmButton: false,
      });

      setForm({ name: "", email: "", phone: "", message: "" });
      setTouched({});
    } catch (err) {
      console.error("Contact submit error:", err);
      Swal.fire({
        icon: "error",
        title: "Send Failed",
        text: err?.response?.data?.message || "Network or server error. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cs-page-wrap">
      {/* decorative blobs */}
      <svg className="cs-blob cs-blob-left" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffd6e0" />
            <stop offset="100%" stopColor="#ffe9b5" />
          </linearGradient>
        </defs>
        <path fill="url(#g1)" d="M46.9,-60.9C61.2,-52.9,74.7,-41.4,77.8,-28.1C80.8,-14.8,73.4,-0.8,66.3,12.3C59.2,25.3,52.5,37.3,41.2,46.8C29.8,56.4,14.9,63.4,-0.2,63.7C-15.2,64,-30.4,57.5,-44.2,48.6C-58.1,39.8,-70.6,28.7,-74.9,15.6C-79.2,2.5,-75.3,-12.8,-67.3,-25.3C-59.4,-37.7,-47.4,-47.2,-34,-55.2C-20.5,-63.3,-10.3,-69.8,2.4,-73.4C15,-77,30,-76.9,46.9,-60.9Z" transform="translate(100 100)" />
      </svg>

      <svg className="cs-blob cs-blob-right" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="g2" x1="0" x2="1">
            <stop offset="0%" stopColor="#d0e8ff" />
            <stop offset="100%" stopColor="#e3fdfd" />
          </linearGradient>
        </defs>
        <path fill="url(#g2)" d="M35.5,-56.7C46.7,-47.7,56.6,-38.6,61.1,-27.4C65.6,-16.1,64.7,-2.1,60.3,10.7C55.9,23.5,47.9,35.9,36,45.3C24.1,54.7,8.2,61,-8,61.4C-24.1,61.9,-40.3,56.6,-53.5,46.4C-66.7,36.1,-76.1,21,-78.1,5.1C-80.1,-10.9,-74.6,-27.8,-63.3,-37.9C-52,-48,-35.1,-51.4,-20.2,-58.1C-5.4,-64.9,7.2,-74.9,20.3,-76.3C33.4,-77.7,46.7,-70.1,35.5,-56.7Z" transform="translate(100 100)" />
      </svg>

      <motion.section
        className="cs-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        aria-labelledby="contact-heading"
      >
        <div className="cs-card">
          <header className="cs-card-header">
            <motion.h1
              id="contact-heading"
              className="cs-title"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Get in Touch
            </motion.h1>
            <motion.p
              className="cs-subtitle"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.16 }}
            >
              Questions, partnerships or feedback? Drop a message — we reply quickly.
            </motion.p>
          </header>

          <div className="cs-grid">
            {/* Left info panel */}
            <motion.div
              className="cs-info"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.22 }}
            >
              <div className="cs-contact-line">
                <div className="cs-icon-wrap">
                  <FaEnvelope />
                </div>
                <div>
                  <h4>Email</h4>
                  <p>support@codepulse.com</p>
                </div>
              </div>

              <div className="cs-contact-line">
                <div className="cs-icon-wrap">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h4>Phone</h4>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className="cs-contact-line">
                <div className="cs-icon-wrap">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4>Office</h4>
                  <p>Bengaluru, India</p>
                </div>
              </div>

              <div className="cs-divider" />

              <motion.div
                className="cs-socials"
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.32 }}
              >
                <button className="cs-pill">Request Demo</button>
                <button className="cs-pill cs-pill-light">Call Sales</button>
              </motion.div>
            </motion.div>

            {/* Right form */}
            <motion.form
              className="cs-form"
              onSubmit={handleSubmit}
              initial={{ scale: 0.99, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.28 }}
              noValidate
            >
              <div className="cs-row">
                <div className={`cs-field ${form.name ? "cs-filled" : ""} ${touched.name && errors.name ? "cs-error" : ""}`}>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="cs-input"
                  />
                  <label className="cs-label">Your name</label>
                  {touched.name && errors.name && <span className="cs-errtxt">{errors.name}</span>}
                </div>

                <div className={`cs-field ${form.email ? "cs-filled" : ""} ${touched.email && errors.email ? "cs-error" : ""}`}>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="cs-input"
                  />
                  <label className="cs-label">Email address</label>
                  {touched.email && errors.email && <span className="cs-errtxt">{errors.email}</span>}
                </div>
              </div>

              <div className={`cs-field ${form.phone ? "cs-filled" : ""} ${touched.phone && errors.phone ? "cs-error" : ""}`}>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="cs-input"
                />
                <label className="cs-label">Phone (optional)</label>
                {touched.phone && errors.phone && <span className="cs-errtxt">{errors.phone}</span>}
              </div>

              <div className={`cs-field cs-field-area ${form.message ? "cs-filled" : ""} ${touched.message && errors.message ? "cs-error" : ""}`}>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="5"
                  className="cs-textarea"
                />
                <label className="cs-label">Your message</label>
                {touched.message && errors.message && <span className="cs-errtxt">{errors.message}</span>}
              </div>

              <div className="cs-actions">
                <motion.button
                  type="submit"
                  className="cs-submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? "Sending..." : (
                    <>
                      <FaPaperPlane className="cs-submit-icon" /> <span>Send Message</span>
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  className="cs-ghost"
                  onClick={() => {
                    setForm({ name: "", email: "", phone: "", message: "" });
                    setTouched({});
                  }}
                >
                  Clear
                </button>
              </div>
            </motion.form>
          </div>
        </div>

        <footer className="cs-footer">
          <small>© {new Date().getFullYear()} CodePulse-R· Crafted with care</small>
        </footer>
      </motion.section>
    </div>
  );
}
