import React from "react";
import { Navigate } from "react-router-dom";
import AdminService from "./AdminService";

const ProtectedRoute = ({ isAuthenticated, requireSpecial = false, children }) => {
  if (!isAuthenticated) {
    // Si no está autenticado, redirige a la página de login
    return React.createElement(Navigate, { to: "/admin_login", replace: true });
  }

  if (requireSpecial && !AdminService.isSpecialAdmin()) {
    // Si no tiene permisos elevados, enviarlo al inicio de admin
    return React.createElement(Navigate, { to: "/admin_main", replace: true, state: { denied: true } });
  }

  // Si pasa las validaciones, renderiza el contenido
  return children;
};

export default ProtectedRoute;