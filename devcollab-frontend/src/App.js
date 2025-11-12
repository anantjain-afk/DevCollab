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
      <div>
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
