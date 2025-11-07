// src/components/ProtectedRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Get the user info from the Redux state
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  // If a user is logged in (userInfo exists), render the child page
  // The <Outlet /> is a placeholder for whatever page we're protecting
  // (e.g., <DashboardPage />)
  if (userInfo) {
    return <Outlet />;
  }

  // If no user is logged in, redirect them to the /login page
  // The 'replace' prop is important for good navigation history
  return <Navigate to="/login" replace />;
  // return <></>;
};

export default ProtectedRoute;
