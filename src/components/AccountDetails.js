import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/AccountDetails.css";
import "boxicons/css/boxicons.min.css";
// import loginImage from "./login.png";

const AccountDetails = ({ onLogin }) => {
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    studentName: "",
    email: "",
    confirmEmail: "",
    password: "",
    mobileNumber: "",
    dob: "",
    gender: "",
    collegeName: "",
    qualification: "",
    yearOfPassing: "",
    cgpa: "",
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e, setter) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.email !== registerData.confirmEmail) {
      Swal.fire("Registration Error", "Emails do not match!", "error");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      Swal.fire("Registration Error", "Passwords do not match!", "error");
      return;
    }

    const apiPayload = {
      email: registerData.email,
      password: registerData.password,
      studentName: registerData.studentName,
      dob: registerData.dob,
      gender: registerData.gender,
      mobile: registerData.mobileNumber,
      college: registerData.collegeName,
      qualification: registerData.qualification,
      passingYear: parseInt(registerData.yearOfPassing, 10),
      cgpa: parseFloat(registerData.cgpa),
    };

    try {
      // await axios.post("http://localhost:5000/api/auth/register", apiPayload);
      // await axios.post("http://160.153.178.78/api/auth/register", apiPayload);

      // For register
      await axios.post("https://codepulse-r.com/api/auth/register", apiPayload);

      Swal.fire(
        "Success!",
        "Registration successful! Please log in.",
        "success"
      );
      setActive(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      Swal.fire("Registration Failed", errorMessage, "error");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginPayload = {
        email: loginData.username,
        password: loginData.password,
      };

      const response = await axios.post(
        "https://codepulse-r.com/api/auth/login",
        loginPayload
      );
      // "http://localhost:5000/api/auth/login",
      // "http://160.153.178.78/api/auth/login",

      const { token, studentName } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", loginData.username);
      localStorage.setItem("userName", studentName);

      onLogin();
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials.";
      Swal.fire("Login Failed", errorMessage, "error");
    }
  };

  return (
    <div className={`container ${active ? "active" : ""}`}>
      {/* Login Form */}
      <div className="form-box login">
        <form onSubmit={handleLoginSubmit}>
          <h1>Login</h1>
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
          <button type="submit" className="btn1">
            Login
          </button>
          <p className="social-text">or continue with</p>
          <div className="social-icons">
            <a
              href="https://www.google.com/"
              className="google"
              title="Google"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bx bxl-google"></i>
            </a>

            <a
              href="https://www.facebook.com/"
              className="facebook"
              title="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bx bxl-facebook"></i>
            </a>

            <a
              href="https://github.com/"
              className="github"
              title="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bx bxl-github"></i>
            </a>

            <a
              href="https://www.linkedin.com/"
              className="linkedin"
              title="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bx bxl-linkedin"></i>
            </a>
          </div>
        </form>
      </div>

      {/* Registration Form */}
      <div className="form-box register">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Registration</h1>
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
              value={registerData.confirmEmail}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-envelope"></i>
          </div>
          {/* <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={registerData.password}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-lock-alt"></i>
          </div> */}
          {/* *** NEW INPUT BOX FOR PASSWORD *** */}
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={registerData.password}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          {/* *** NEW INPUT BOX FOR CONFIRM PASSWORD *** */}
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-lock"></i> {/* Changed icon to distinguish */}
          </div>
          {/* ************************************** */}
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
              type="date"
              placeholder="Date of Birth"
              name="dob"
              value={registerData.dob}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-calendar"></i>
          </div> */}
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
            <i className="bx bxs-user-voice"></i>
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="College/University Name"
              name="collegeName"
              value={registerData.collegeName}
              onChange={(e) => handleChange(e, setRegisterData)}
              required
            />
            <i className="bx bxs-institution"></i>
          </div>
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
              min="1980"
              max="2030"
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
          <button type="submit" className="btn1">
            Register
          </button>
        </form>
      </div>

      {/* Toggle Panels */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <img src="/login.png" alt="Welcome" className="welcome-image" />
          <h1>Hello, Welcome!</h1>
          <p>Don't have an account?</p>
          <button
            type="button"
            className="btn1"
            onClick={() => setActive(true)}
          >
            Register
          </button>
        </div>
        <div className="toggle-panel toggle-right">
          <img src="/login.png" alt="Welcome" className="welcome-image" />
          <h1>Welcome Back!</h1>
          <p>Already have an account?</p>
          <button
            type="button"
            className="btn1"
            onClick={() => setActive(false)}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
