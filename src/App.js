import React, { useState, useEffect } from "react";
// 🔑 Import useLocation for the ProtectedRoute
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Master from "./components/Master";
import Quiz from "./components/Quiz";
import Exam from "./components/Exam";
import Learning from "./components/StartLearning";
import ExamDashboard from "./components/ExamDashboard";
import AccountDetails from "./components/AccountDetails";
import "./App.css";
import TechClass from "./components/TechClass";
import Compiler from "./components/Compiler";
import OnlineCompiler from "./components/OnlineCompiler";

const ProtectedRoute = ({ isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/account" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Master />} />
          <Route path="/teachingclasses" element={<TechClass />} />
          <Route path="/compiler" element={<Compiler />} />
          <Route path="/online-compiler" element={<OnlineCompiler />} />

          <Route
            path="/account"
            element={
              !isAuthenticated ? (
                <AccountDetails onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/*  Protected Routes: Use the custom component */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/learning" element={<Learning />} />
            <Route
              path="/dashboard"
              element={<ExamDashboard onLogout={handleLogout} />}
            />

            <Route path="/quiz" element={<Quiz />} />

            <Route path="/quiz/:technology/:quizId" element={<Quiz />} />

            <Route path="/exam/:technology/:examId" element={<Exam />} />
          </Route>

          <Route path="/exam" element={<Navigate to="/dashboard" replace />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
