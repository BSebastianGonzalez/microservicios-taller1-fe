import React from "react";

const WelcomeSection = () => {
  // Obtener los datos del administrador desde localStorage
  const adminData = JSON.parse(localStorage.getItem("admin"));
  
  // Si no hay datos del administrador, usamos un nombre por defecto
  const adminName = adminData?.nombre || "Administrador";

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-center">
        Bienvenido al perfil administrativo {adminName}
      </h1>
    </div>
  );
};

export default WelcomeSection;
