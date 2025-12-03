import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/AccountDetails.css";
import "boxicons/css/boxicons.min.css";
import {
  FaGlobe,
  FaBolt,
  FaBook,
  FaJava,
  FaPython,
  FaJs,
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaDatabase,
} from "react-icons/fa";

const AccountDetails = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [registerData, setRegisterData] = useState({
    studentName: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    // collegeName: "",
    qualification: "",
    yearOfPassing: "",
    cgpa: "",
    // dob: "",
    gender: "",
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleChange = (e, setter) => {
    const { name, value } = e.target;

    setter((prev) => {
      const newData = { ...prev, [name]: value };

      if (setter === setRegisterData) {
        if (name === "email" || name === "confirmEmail") {
          const emailMatch = newData.email === newData.confirmEmail;
          setEmailError(!emailMatch && newData.confirmEmail.length > 0);
        }
        if (name === "password" || name === "confirmPassword") {
          const passwordMatch = newData.password === newData.confirmPassword;
          setPasswordError(
            !passwordMatch && newData.confirmPassword.length > 0
          );
        }
      }

      return newData;
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerData.email !== registerData.confirmEmail)
      return Swal.fire("Registration Error", "Emails do not match!", "error");

    if (registerData.password !== registerData.confirmPassword)
      return Swal.fire(
        "Registration Error",
        "Passwords do not match!",
        "error"
      );

    if (emailError || passwordError)
      return Swal.fire(
        "Registration Error",
        "Please fix the highlighted errors.",
        "error"
      );

    const payload = {
      email: registerData.email,
      password: registerData.password,
      studentName: registerData.studentName,
      mobile: registerData.mobileNumber,
      // college: registerData.collegeName,
      qualification: registerData.qualification,
      passingYear: Number(registerData.yearOfPassing),
      cgpa: Number(registerData.cgpa),
      // dob: registerData.dob,
      gender: registerData.gender,
    };

    try {
      await axios.post("/api/auth/register", payload);
      Swal.fire("Success!", "Registration successful!", "success");
      setEmailError(false);
      setPasswordError(false);
      setIsRegistering(false);
    } catch (error) {
      Swal.fire(
        "Registration Failed",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        email: loginData.username,
        password: loginData.password,
      };

      const response = await axios.post("/api/auth/login", payload);
      const { token, studentName } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", loginData.username);
      localStorage.setItem("userName", studentName);

      onLogin();
      const fromPath = location.state?.from?.pathname || "/dashboard";
      navigate(fromPath, { replace: true });
    } catch (error) {
      Swal.fire(
        "Login Failed",
        error.response?.data?.message || "Invalid credentials.",
        "error"
      );
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit} className="login-form">
      <h1>
        <i className="bx bxs-lock-open-alt" style={{ fontSize: "45px" }}></i>{" "}
        Welcome back!
        
      </h1>
     

      <div className="input-box">
        <input
          type="email"
          placeholder="Email"
          name="username"
          value={loginData.username}
          onChange={(e) => handleChange(e, setLoginData)}
          required
        />
        <i className="bx bxs-user"></i>
      </div>

      <div className="input-box">
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={loginData.password}
          onChange={(e) => handleChange(e, setLoginData)}
          required
        />
        <i className="bx bxs-lock-alt"></i>
      </div>

      <button type="submit" className="glass-btn">
        Login
      </button>

      <h6 className="form-toggle-text">
        Don't have an account?{" "}
        <a href="#" onClick={() => setIsRegistering(true)}>
          Register
        </a>
      </h6>
      <hr />

      <div className="social-login-container">
        <button type="button" className="google-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 533.5 544.3"
            width="20"
            height="20"
            style={{ marginRight: "8px" }}
          >
            <path
              d="M533.5 278.4c0-17.3-1.5-34-4.4-50.2H272v95.1h146.9c-6.3 34-25.2 62.9-53.8 82.3v68.3h87C496.4 420.2 533.5 354 533.5 278.4z"
              fill="#4285F4"
            />
            <path
              d="M272 544.3c72.9 0 134.1-24.2 178.8-65.6l-87-68.3c-24 16-54.5 25.5-91.8 25.5-70.5 0-130.3-47.5-151.6-111.4h-89.5v69.8C94.8 478.3 176.5 544.3 272 544.3z"
              fill="#34A853"
            />
            <path
              d="M120.6 325.3c-10.4-31.2-10.4-64.4 0-95.6v-69.8h-89.5c-38.2 75.9-38.2 166.7 0 242.6l89.5-77.2z"
              fill="#FBBC05"
            />
            <path
              d="M272 107.7c37.8-.6 73.3 13 100.7 37.6l75.4-75.4C406 24.5 344.8 0 272 0 176.5 0 94.8 66 59.6 160.5l89.5 69.8C141.7 155.2 201.5 107.7 272 107.7z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <button type="button" className="github-btn">
          <i className="bx bxl-github"></i>Continue With GitHub
        </button>
      </div>
    </form>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleRegisterSubmit} className="register-form">
      <h1>
        <i className="bx bxs-user-plus" style={{ fontSize: "50px" }}></i>{" "}
        Register
      </h1>

      <div className="form-columns">
        {/* Left Column */}
        <div className="form-column">
          <div className="input-box">
            <input
              type="text"
              placeholder="Student Name"
              name="studentName"
              value={registerData.studentName}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-user"></i>
          </div>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              name="email"
              className={emailError ? "input-error" : ""}
              value={registerData.email}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-envelope"></i>
          </div>

          <div className="input-box">
            <input
              type="email"
              placeholder="Confirm Email"
              name="confirmEmail"
              className={emailError ? "input-error" : ""}
              value={registerData.confirmEmail}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-envelope"></i>
          </div>
          {emailError && (
            <p className="error-message">
              <i className="bx bxs-x-circle"></i> Emails do not match!
            </p>
          )}

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              name="password"
              className={passwordError ? "input-error" : ""}
              value={registerData.password}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              className={passwordError ? "input-error" : ""}
              value={registerData.confirmPassword}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-lock"></i>
          </div>
          {passwordError && (
            <p className="error-message">
              <i className="bx bxs-x-circle"></i> Passwords do not match!
            </p>
          )}

          {/* <div className="input-box">
            <input
              type="date"
              name="dob"
              value={registerData.dob}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-calendar"></i>
          </div> */}
        </div>

        {/* Right Column */}
        <div className="form-column">
          <div className="input-box">
            <select
              name="gender"
              value={registerData.gender}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <i className="bx bxs-group"></i>
          </div>

          <div className="input-box">
            <input
              type="tel"
              placeholder="Mobile Number"
              name="mobileNumber"
              value={registerData.mobileNumber}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-phone"></i>
          </div>

          {/* <div className="input-box">
            <input
              type="text"
              placeholder="College / University"
              name="collegeName"
              value={registerData.collegeName}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-institution"></i>
          </div> */}

          <div className="input-box">
            <input
              type="text"
              placeholder="Qualification"
              name="qualification"
              value={registerData.qualification}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-graduation"></i>
          </div>

          <div className="input-box">
            <input
              type="number"
              placeholder="Year of Passing"
              name="yearOfPassing"
              value={registerData.yearOfPassing}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-calendar-check"></i>
          </div>

          <div className="input-box">
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="CGPA"
              name="cgpa"
              value={registerData.cgpa}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-badge-check"></i>
          </div>
        </div>
      </div>

      <button type="submit" className="glass-btn">
        Register
      </button>

      <h6 className="form-toggle-text">
        Already have an account?{" "}
        <a href="#" onClick={() => setIsRegistering(false)}>
          Login
        </a>
      </h6>
    </form>
  );

  return (
    <div className="component-wrapper">
      {/* LEFT SIDE FLOATING ICONS */}
      <div className="float-left-side">
        <FaReact className="ac-float-icon ac-f1" />
        <FaHtml5 className="ac-float-icon ac-f3" />
        <FaJs className="ac-float-icon ac-f7" />
        <FaBook className="ac-float-icon ac-f8" />
        <FaGlobe className="ac-float-icon ac-f9" />
      </div>

      {/* RIGHT SIDE FLOATING ICONS */}
      <div className="float-right-side">
        <FaCss3Alt className="ac-float-icon ac-f2" />
        <FaBolt className="ac-float-icon ac-f4" />
        <FaJava className="ac-float-icon ac-f5" />
        <FaPython className="ac-float-icon ac-f6" />
        <FaDatabase className="ac-float-icon ac-f10" />
      </div>

      <div
        className={`glass-container ${
          isRegistering ? "register-glass-container" : ""
        }`}
      >
        {isRegistering ? renderRegisterForm() : renderLoginForm()}
      </div>
    </div>
  );
};

export default AccountDetails;
