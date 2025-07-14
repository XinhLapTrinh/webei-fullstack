// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// roleRequired: 'user' hoặc 'admin'
const PrivateRoute = ({ children, roleRequired }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // hoặc loading spinner

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
