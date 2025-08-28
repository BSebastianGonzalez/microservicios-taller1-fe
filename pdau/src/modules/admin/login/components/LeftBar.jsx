import React from "react";

const LeftBar = () => {
  return (
    <div className="bg-[#DB4747] text-[#1E1E1E] flex flex-col items-center justify-center h-screen">
      <h1 className="text-8xl font-bold">PDAU</h1>
      <h2 className="text-center text-6xl font-bold mt-6">Perfil administrativo</h2>
      <img src="img/ufps.png" alt="UFPS Logo" className="w-50 h-auto my-6" />
    </div>
  );
};

export default LeftBar;