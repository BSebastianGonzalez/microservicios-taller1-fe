import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Si no está autenticado, redirige a la página de login
    return <Navigate to="/admin_login" />;
  }
  // Si está autenticado, renderiza el contenido
  return children;
};

export default ProtectedRoute;