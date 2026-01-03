import React, { useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaCheckCircle, FaSpinner } from "react-icons/fa";
import "../css/Feedback.css";



const MAX_CHARS = 300; // Character limit for the textarea

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Character Count & Progress
  const charCount = feedbackText.length;
  const progressPercent = Math.min(100, (charCount / MAX_CHARS) * 100);

  // Mock Submission Handler
  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a star rating!");
      return;
    }
    if (charCount < 10) {
      alert("Please write a bit more feedback (min 10 characters).");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // setTimeout(() => {
      //   setIsSubmitted(false);
      //   setRating(0);
      //   setFeedbackText("");
      // }, 5000);
    }, 2000);
  };

  if (isSubmitted) {
    return <SuccessCard />;
  }

  return (
    <div className="feedback-wrapper">
      {/* 5. Particle System Background Element */}
      <div className="particle-container">
        {[...Array(50)].map((_, i) => (
          <motion.span
            key={i}
            className="particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0.5,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 10 + 10,
              ease: "linear",
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Floating ambient lights (Existing) */}
      <div className="glow-top"></div>
      <div className="glow-bottom"></div>

      <motion.div
        className="feedback-card"
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        // 4. Enhanced Micro-Animation on hover
        whileHover={{
          scale: 1.015,
          boxShadow:
            "0 0 50px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.15)",
        }}
      >
        {/* 1. Glass Border Animation: Moving Aurora Border */}
        <div className="aurora-border"></div>

        <motion.h2
          className="feedback-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Give Your Feedback
        </motion.h2>

        <motion.p
          className="feedback-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your experience matters. Help us improve!
        </motion.p>

        {/* ⭐ Rating */}
        <motion.div
          className="stars-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {[1, 2, 3, 4, 5].map((val) => (
            <motion.div
              key={val}
              whileHover={{ scale: 1.3, rotate: 8 }}
              whileTap={{ scale: 0.9 }}
              // 4. Micro-Animation: Star press-down is subtle
            >
              <FaStar
                size={36}
                className={`star ${val <= (hover || rating) ? "active" : ""}`}
                onMouseEnter={() => setHover(val)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(val)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Textarea */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <textarea
            className={`feedback-textarea ${
              charCount === 0 ? "shimmer-placeholder" : ""
            }`}
            placeholder="Write your feedback..."
            value={feedbackText}
            onChange={(e) => {
              const text = e.target.value;
              if (text.length <= MAX_CHARS) {
                setFeedbackText(text);
              }
            }}
          />
        </motion.div>

        {/* 6. Character Count + Progress Bar */}
        <motion.div
          className="char-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="progress-bar-container">
            <motion.div
              className={`progress-bar-fill ${
                progressPercent > 90 ? "warning" : ""
              }`}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className={`char-count ${progressPercent > 90 ? "warning" : ""}`}>
            {charCount}/{MAX_CHARS}
          </p>
        </motion.div>

        {/* Button */}
        <motion.button
          className="feedback-btn premium-btn"
          onClick={handleSubmit}
          disabled={isSubmitting}
          whileHover={{
            scale: isSubmitting ? 1 : 1.07,
            boxShadow: isSubmitting ? "none" : "0 0 30px var(--btn-glow)",
          }}
          whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="spin" /> Submitting...
            </>
          ) : (
            "Submit Feedback"
          )}
          <span className="btn-ripple"></span>
        </motion.button>
      </motion.div>
    </div>
  );
};

// 8. Success Card Component with Confetti
const SuccessCard = () => (
  <AnimatePresence>
    <motion.div
      className="success-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 2. Confetti/Fireworks (CSS only simulation) */}
      <div className="confetti-container">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="confetti"
            initial={{
              x: (Math.random() - 0.5) * 500,
              y: -50,
              opacity: 1,
              scale: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              y: window.innerHeight * 0.8,
              x: (Math.random() - 0.5) * 500,
              opacity: 0,
              rotate: Math.random() * 720,
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              delay: Math.random() * 0.5,
              ease: "easeIn",
            }}
          />
        ))}
      </div>

      <motion.div
        className="success-card"
        initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.1 }}
      >
        <FaCheckCircle className="success-icon" />
        <h2 className="success-title">Thank You!</h2>
        <p className="success-message">
          Your valuable feedback has been submitted. We appreciate your input!
        </p>
        <motion.button
          className="success-btn premium-btn"
          onClick={() => window.location.reload()} // Simple reload to restart
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

export default Feedback;
