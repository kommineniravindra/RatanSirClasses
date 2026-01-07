import React, { useState, useEffect } from "react";
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
  // FaReact,
  FaHtml5,
  FaCss3Alt,
  FaDatabase,
  FaSpinner,
  FaUserCircle,
} from "react-icons/fa";
import Assistant from "./Assistant";
import MultiStepRegister from "./MultiStepRegister";

const AccountDetails = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    let interval;
    if (forgotPasswordStep === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [forgotPasswordStep, timer]);

  // Welcome Messages
  useEffect(() => {
    if (isForgotPassword) {
      // Optional: Silent or specific message
    } else if (isRegistering) {
      Assistant.speak(
        "Welcome to CodePulse-R. Please fill the details to get successful credentials."
      );
    } else {
      // Login View
      Assistant.speak(
        "Hey Buddy, welcome back to CodePuls-R.  will guide you to Reach your goals."
      );
    }
  }, [isRegistering, isForgotPassword]);

  const handleChange = (e, setter) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Immediate transition
    setForgotPasswordStep(2);
    setTimer(120);

    if (isLoading) return;
    setIsLoading(true);

    try {
      await axios.post("/api/auth/forgotpassword", {
        email: forgotPasswordData.email,
      });
      // OTP sent successfully
      // Timer is already set
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to send OTP",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/verifyotp", {
        email: forgotPasswordData.email,
        otp: forgotPasswordData.otp,
      });
      Swal.fire("Success", "OTP Verified Successfully", "success");
      setForgotPasswordStep(3);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Invalid OTP",
        "error"
      );
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (
      forgotPasswordData.newPassword !== forgotPasswordData.confirmNewPassword
    ) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }
    try {
      await axios.put("/api/auth/resetpassword", {
        email: forgotPasswordData.email,
        otp: forgotPasswordData.otp,
        password: forgotPasswordData.newPassword,
      });
      Swal.fire("Success", "Password Updated Successfully", "success");
      setIsForgotPassword(false);
      setForgotPasswordStep(1);
      setForgotPasswordData({
        email: "",
        otp: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to reset password",
        "error"
      );
    }
  };

  const handleRegisterSubmit = async (formData) => {
    const payload = {
      email: formData.email,
      password: formData.password,
      studentName: formData.studentName,
      mobile: formData.mobileNumber,
      qualification: formData.qualification,
      passingYear: Number(formData.yearOfPassing),
      cgpa: Number(formData.cgpa),
      gender: formData.gender,
    };

    try {
      await axios.post("/api/auth/register", payload);
      Swal.fire("Success!", "Registration successful!", "success");

      // Assistant Success Message
      Assistant.speak(
        `Thank you ${formData.studentName}. Your registration is successful. We wish you all the best for your learning journey in Codepulse-r.`
      );

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

      Assistant.speak(`Welcome back ${studentName}. Login successful.`);

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
    <>
      <form id="loginForm" onSubmit={handleLoginSubmit} className="login-form">
        <h1>
          {" "}
          <FaUserCircle />
          Welcome bacK!
        </h1>

        <div className="input-box">
          <input
            type="email"
            placeholder=" "
            name="username"
            value={loginData.username}
            onChange={(e) => handleChange(e, setLoginData)}
            onFocus={() => Assistant.speak("Please enter Email")}
            required
          />
          <label className="floating-label">Email</label>
          <i className="bx bxs-user"></i>
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder=" "
            name="password"
            value={loginData.password}
            onChange={(e) => handleChange(e, setLoginData)}
            onFocus={() => Assistant.speak("Please enter Password")}
            required
          />
          <label className="floating-label">Password</label>
          <i className="bx bxs-lock-alt"></i>
        </div>

        <div className="login-options">
          <div className="remember-me">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <button
            type="button"
            onClick={() => setIsForgotPassword(true)}
            className="forgot-link"
          >
            Forgot Password?
          </button>
        </div>
      </form>

      <div className="login-actions">
        <button
          type="submit"
          form="loginForm"
          className="glass-btn primary-btn"
        >
          Login
        </button>
      </div>

      <div className="signup-link-container">
        <p>
          Don't have an account?{" "}
          <span
            className="signup-text"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsRegistering(true);
            }}
          >
            Sign Up
          </span>
        </p>
      </div>

      <div className="divider-or">
        <span>OR</span>
      </div>

      <div className="social-login-container">
        <button type="button" className="google-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 533.5 544.3"
            width="20"
            height="20"
            className="google-icon-svg"
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
    </>
  );

  const renderForgotPasswordForm = () => (
    <div className="forgot-password-form">
      {forgotPasswordStep === 1 && (
        <form onSubmit={handleSendOtp}>
          <h1>
            <i className="bx bxs-envelope header-icon-large"></i> Forgot
            Password
          </h1>
          <p className="form-subtitle">Enter your email to receive an OTP.</p>
          <div className="input-box">
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              value={forgotPasswordData.email}
              onChange={handleForgotPasswordChange}
              required
            />
            <i className="bx bxs-envelope"></i>
          </div>
          <button type="submit" className="glass-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <FaSpinner className="spinner-icon" /> Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      )}

      {forgotPasswordStep === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <h1>
            <i className="bx bxs-key header-icon-large"></i> Verify OTP
          </h1>
          <p className="form-subtitle">
            Enter the OTP sent to {forgotPasswordData.email}
          </p>
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter OTP"
              name="otp"
              value={forgotPasswordData.otp}
              onChange={handleForgotPasswordChange}
              required
            />
            <i className="bx bxs-key"></i>
          </div>

          {timer > 0 ? (
            <p className="otp-timer">
              Resend OTP in {Math.floor(timer / 60)}:
              {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
            </p>
          ) : (
            <div className="otp-resend-container">
              <button
                type="button"
                className="resend-otp-btn"
                onClick={handleSendOtp}
              >
                Resend OTP
              </button>
            </div>
          )}

          <button type="submit" className="glass-btn">
            Verify OTP
          </button>
        </form>
      )}

      {forgotPasswordStep === 3 && (
        <form onSubmit={handleResetPassword}>
          <h1>
            <i className="bx bxs-lock-alt header-icon-large"></i> Reset Password
          </h1>
          <div className="input-box">
            <input
              type="password"
              placeholder="New Password"
              name="newPassword"
              value={forgotPasswordData.newPassword}
              onChange={handleForgotPasswordChange}
              required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm New Password"
              name="confirmNewPassword"
              value={forgotPasswordData.confirmNewPassword}
              onChange={handleForgotPasswordChange}
              required
            />
            <i className="bx bxs-lock"></i>
          </div>
          <button type="submit" className="glass-btn">
            Reset Password
          </button>
        </form>
      )}

      <h6 className="form-toggle-text">
        <button
          type="button"
          onClick={() => {
            setIsForgotPassword(false);
            setForgotPasswordStep(1);
          }}
        >
          Back to Login
        </button>
      </h6>
    </div>
  );

  return (
    <main className="component-wrapper">
      {/* LEFT SIDE FLOATING ICONS */}
      <div className="float-left-side">
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
        {isForgotPassword ? (
          renderForgotPasswordForm()
        ) : isRegistering ? (
          <MultiStepRegister
            onRegister={handleRegisterSubmit}
            onSwitchToLogin={() => setIsRegistering(false)}
          />
        ) : (
          renderLoginForm()
        )}
      </div>
    </main>
  );
};

export default AccountDetails;
