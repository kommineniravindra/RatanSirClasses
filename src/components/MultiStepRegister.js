import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCalendarCheck,
  FaCertificate,
  FaLock,
  FaVenusMars,
  FaCheckCircle,
  FaUserGraduate,
  FaUserTie,
  FaEnvelopeOpenText,
  FaPhoneAlt,
  FaArrowRight,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";
import Assistant from "./Assistant";

const MultiStepRegister = ({ onRegister, verbose = true, onSwitchToLogin }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // 1 = forward, -1 = backward

  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    confirmEmail: "",
    gender: "",
    mobileNumber: "",
    qualification: "",
    yearOfPassing: "",
    cgpa: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let newError = "";

    switch (name) {
      case "studentName":
        if (!value.trim()) newError = "Required";
        break;
      case "email":
        if (!value.trim()) newError = "Required";
        else if (!/\S+@\S+\.\S+/.test(value)) newError = "Invalid";
        break;
      case "confirmEmail":
        if (!value.trim()) newError = "Required";
        else if (value !== formData.email) newError = "Mismatch";
        break;
      case "mobileNumber":
        if (!value.trim()) newError = "Required";
        else if (!/^\d{10}$/.test(value.replace(/\D/g, "")))
          newError = "Invalid";
        break;
      case "gender":
        if (!value) newError = "Required";
        break;
      case "qualification":
        if (!value.trim()) newError = "Required";
        break;
      case "yearOfPassing":
        if (!value) newError = "Required";
        else if (value < 1950 || value > 2050) newError = "Invalid";
        break;
      case "cgpa":
        if (!value) newError = "Required";
        else if (value < 0 || value > 10) newError = "Invalid";
        break;
      case "password":
        if (!value) newError = "Required";
        else if (value.length < 6) newError = "Short";
        break;
      case "confirmPassword":
        if (!value) newError = "Required";
        else if (value !== formData.password) newError = "Mismatch";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: newError }));
  };

  const speak = (text) => {
    if (verbose) Assistant.speak(text);
  };

  const validateStep = (currentStep) => {
    let newErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.studentName.trim())
        newErrors.studentName = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Invalid email";

      if (!formData.confirmEmail.trim())
        newErrors.confirmEmail = "Confirm Email is required";
      else if (formData.email !== formData.confirmEmail)
        newErrors.confirmEmail = "Emails do not match";

      if (!formData.gender) newErrors.gender = "Gender is required";

      if (!formData.mobileNumber.trim())
        newErrors.mobileNumber = "Mobile is required";
      else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, "")))
        newErrors.mobileNumber = "Invalid mobile number (10 digits)";
    }

    if (currentStep === 2) {
      if (!formData.qualification.trim())
        newErrors.qualification = "Qualification is required";

      if (!formData.yearOfPassing)
        newErrors.yearOfPassing = "Year of Passing is required";
      else if (formData.yearOfPassing < 1950 || formData.yearOfPassing > 2050)
        newErrors.yearOfPassing = "Invalid Year";

      if (!formData.cgpa) newErrors.cgpa = "CGPA is required";
      else if (formData.cgpa < 0 || formData.cgpa > 10)
        newErrors.cgpa = "CGPA must be 0-10";
    }

    if (currentStep === 3) {
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 chars";

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Confirm Password is required";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setDirection(1);
      setStep((prev) => prev + 1);
    } else {
      speak("Please fix the errors before proceeding.");
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      onRegister(formData);
    } else {
      speak("Please fix the errors to register.");
    }
  };

  // Animation variants
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="multi-step-register">
      <div className="register-header">
        <h2>
          <FaUserGraduate /> Let’s Get Started
        </h2>
      </div>

      {/* Step Indicator */}
      <div className="step-indicator-container">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`step-item ${step >= s ? "active" : ""}`}>
            <div className="step-circle">
              {step > s ? <FaCheckCircle /> : s}
            </div>
            <span className="step-label">
              {s === 1 ? "Personal" : s === 2 ? "Academic" : "Security"}
            </span>
            {s < 3 && (
              <div className={`step-line ${step > s ? "active" : ""}`}></div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="step-form">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="step-content"
          >
            {/* STEP 1: Personal Details */}
            {step === 1 && (
              <div className="form-step">
                <div className="input-box">
                  <input
                    type="text"
                    placeholder=" "
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    onFocus={() => speak("Please enter Student Name")}
                    onBlur={handleBlur}
                    className={errors.studentName ? "error" : ""}
                  />
                  <label className="floating-label">Student Name</label>
                  <i className="icon">
                    <FaUserTie />
                  </i>
                </div>

                <div className="input-box">
                  <input
                    type="email"
                    placeholder=" "
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => speak("Please enter Email")}
                    onBlur={handleBlur}
                    className={errors.email ? "error" : ""}
                  />
                  <label className="floating-label">Email</label>
                  <i className="icon">
                    <FaEnvelopeOpenText />
                  </i>
                </div>

                <div className="input-box">
                  <input
                    type="email"
                    placeholder=" "
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    onFocus={() => speak("Please Confirm Email")}
                    onBlur={handleBlur}
                    className={errors.confirmEmail ? "error" : ""}
                  />
                  <label className="floating-label">Confirm Email</label>
                  <i className="icon">
                    <FaEnvelopeOpenText />
                  </i>
                </div>

                <div className="input-group-row">
                  <div className="input-box">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      onFocus={() => speak("Please select Gender")}
                      onBlur={handleBlur}
                      className={errors.gender ? "error" : ""}
                      required
                    >
                      <option value="" disabled hidden>
                        
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <label className="floating-label">Gender</label>
                    <i className="icon">
                      <FaVenusMars />
                    </i>
                  </div>
                  <div className="input-box">
                    <input
                      type="tel"
                      placeholder=" "
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      onFocus={() => speak("Please enter Mobile Number")}
                      onBlur={handleBlur}
                      className={errors.mobileNumber ? "error" : ""}
                    />
                    <label className="floating-label">Mobile Number</label>
                    <i className="icon">
                      <FaPhoneAlt />
                    </i>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Academic Details */}
            {step === 2 && (
              <div className="form-step">
                <div className="input-box">
                  <input
                    type="text"
                    placeholder=" "
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    onFocus={() => speak("Please enter Qualification")}
                    onBlur={handleBlur}
                    className={errors.qualification ? "error" : ""}
                  />
                  <label className="floating-label">Qualification</label>
                  <i className="icon">
                    <FaGraduationCap />
                  </i>
                </div>
                <div className="input-box">
                  <input
                    type="number"
                    placeholder=" "
                    name="yearOfPassing"
                    value={formData.yearOfPassing}
                    onChange={handleChange}
                    onFocus={() => speak("Enter Year of Passing")}
                    onBlur={handleBlur}
                    className={errors.yearOfPassing ? "error" : ""}
                  />
                  <label className="floating-label">Year of Passing</label>
                  <i className="icon">
                    <FaCalendarCheck />
                  </i>
                </div>
                <div className="input-box">
                  <input
                    type="number"
                    step="0.01"
                    placeholder=" "
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    onFocus={() => speak("Enter CGPA")}
                    onBlur={handleBlur}
                    className={errors.cgpa ? "error" : ""}
                  />
                  <label className="floating-label">CGPA</label>
                  <i className="icon">
                    <FaCertificate />
                  </i>
                </div>
              </div>
            )}

            {/* STEP 3: Security */}
            {step === 3 && (
              <div className="form-step">
                <div className="input-box">
                  <input
                    type="password"
                    placeholder=" "
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => speak("Set a Password")}
                    onBlur={handleBlur}
                    className={errors.password ? "error" : ""}
                  />
                  <label className="floating-label">Password</label>
                  <i className="icon">
                    <FaLock />
                  </i>
                </div>
                <div className="input-box">
                  <input
                    type="password"
                    placeholder=" "
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => speak("Confirm your Password")}
                    onBlur={handleBlur}
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  <label className="floating-label">Confirm Password</label>
                  <i className="icon">
                    <FaLock />
                  </i>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="form-buttons">
          {step > 1 && (
            <button
              type="button"
              className="glass-btn secondary-btn"
              onClick={handleBack}
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button type="button" className="glass-btn" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button type="button" className="glass-btn" onClick={handleSubmit}>
              Register
            </button>
          )}
        </div>

        <div className="register-footer">
          <span>Already have an account?</span>
          <button
            type="button"
            className="login-link-btn"
            onClick={onSwitchToLogin}
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiStepRegister;
