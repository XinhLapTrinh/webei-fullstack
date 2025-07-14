// components/routes/RoleRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth()
  return allowedRoles.includes(user?.role)
    ? children
    : <Navigate to="/" replace />;
};

export default RoleRoute;
