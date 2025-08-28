import React from "react";
import LeftBar from "../components/LeftBar";

const LoginLayout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Barra izquierda */}
      <div className="w-1/3">
        <LeftBar />
      </div>
      {/* Contenido principal */}
      <div className="w-2/3 flex items-center justify-center bg-gray-100">
        {children}
      </div>
    </div>
  );
};

export default LoginLayout;