// src/components/PrivateRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ajusta la ruta si es necesario

export const PrivateRoute = () => {
  const { authCokie } = useAuth();
  return authCokie ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;