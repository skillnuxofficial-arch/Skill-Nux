import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import RegisterStudent from './pages/RegisterStudent';
import RegisterBusiness from './pages/RegisterBusiness';
import StudentDashboard from './pages/StudentDashboard';
import BusinessDashboard from './pages/BusinessDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/register/business" element={<RegisterBusiness />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/business" element={<BusinessDashboard />} />
      </Routes>
    </Router>
  );
}
