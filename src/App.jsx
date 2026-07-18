import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import RegisterStudent from './pages/RegisterStudent';
import RegisterBusiness from './pages/RegisterBusiness';
import StudentDashboard from './pages/StudentDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import PaymentPage from './pages/PaymentPage';
import SupportChatBox from './components/SupportChatBox';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Core Protocols...');

  useEffect(() => {
    // Ensure the light-theme class is permanently removed so the site stays in Dark mode
    document.body.classList.remove('light-theme');
    
    const loaded = sessionStorage.getItem('skillnux_loaded');
    if (loaded) {
      setShowLoader(false);
      return;
    }

    // 1. Progress Bar Filling
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    // 2. Status Text Cycling
    const statuses = [
      'Initializing Core Protocols...',
      'Syncing with Supabase Nodes...',
      'Retrieving Talent Database...',
      'Securing Escrow Ledgers...',
      'Booting Cyber Interface...',
      'Connection Secured. Ready!'
    ];
    let statusIndex = 0;
    const statusInterval = setInterval(() => {
      if (statusIndex < statuses.length - 1) {
        statusIndex++;
        setStatusText(statuses[statusIndex]);
      }
    }, 400);

    // 3. Timing out and fading
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
      sessionStorage.setItem('skillnux_loaded', 'true');
    }, 2200);

    const removeTimer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {showLoader && (
        <div className={`loader-screen ${fadeOut ? 'fade-out' : ''}`}>
          <div className="loader-container">
            <div className="loader-logo-wrap">
              <div className="loader-logo-circle">SN</div>
              <div className="loader-logo-text">Skill<em>Nux</em></div>
            </div>
            <div className="loader-ring"></div>
            <div className="loader-bar-wrap">
              <div className="loader-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="loader-status">{statusText}</div>
          </div>
        </div>
      )}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/student" element={<RegisterStudent />} />
          <Route path="/register/business" element={<RegisterBusiness />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/business" element={<BusinessDashboard />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </Router>
      <SupportChatBox />
    </>
  );
}

