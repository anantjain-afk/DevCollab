// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashBoardPage";
import "./App.css";
import ProjectPage from "./pages/projectPage";
function App() {
  return (
    <Router>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "#ffffffff",
          backgroundImage: `
            radial-gradient(circle at center, transparent 0%, rgba(255, 255, 255, 0.8) 90%, #ffffffff 100%),
            linear-gradient(#bfbabaff 1px, transparent 1px),
            linear-gradient(90deg, #bfbabaff 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 0 }}>
        {/* The Routes component is where we define all our possible pages */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/project/:projectId" element={<ProjectPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
