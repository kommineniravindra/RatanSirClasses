import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Master from './components/Master';
import Quiz from './components/Quiz';
import Exam from './components/Exam';
import ExamDashboard from './components/ExamDashboard';
import AccountDetails from './components/AccountDetails';
import "./App.css";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
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
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Master />} />
        <Route 
          path="/account" 
          element={!isAuthenticated ? <AccountDetails onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} 
        />


        <Route element={isAuthenticated ? <Outlet /> : <Navigate to="/account" replace />}>
          <Route 
            path="/dashboard" 
            element={<ExamDashboard onLogout={handleLogout} />} 
          />
          
          <Route 
            path="/ratan-tutotrials/quiz" 
            element={<Quiz />} 
          />

          <Route 
            path="/ratan-tutotrials/quiz/:technology/:quizId" 
            element={<Quiz />} 
          />
          <Route 
            path="/ratan-tutotrials/exam/:technology/:examId" 
            element={<Exam />} 
          />
        </Route>


        <Route
          path="/ratan-tutotrials/exam"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
