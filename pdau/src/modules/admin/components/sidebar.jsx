import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ adminData }) => {
  const [selectedSection, setSelectedSection] = useState("Inicio");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isComplaintDropdownOpen, setIsComplaintDropdownOpen] = useState(false); // Estado para la nueva lista desplegable
  const navigate = useNavigate();

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    if (section === "Inicio") {
      navigate("/admin_main", { state: { adminData } });
    }
  };

  const handleLogout = () => {
    navigate("/admin_login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleComplaintDropdown = () => {
    setIsComplaintDropdownOpen(!isComplaintDropdownOpen);
  };

  const handleNavigateToData = () => {
    setSelectedSection("Ver mis datos");
    navigate("/data", { state: { adminData } });
  };

  const handleNavigateToComplaint = () => {
    setSelectedSection("Ver denuncias anónimas");
    navigate("/read_complaint", { state: { adminData } });
  };

  return (
    <div className="h-full w-full bg-[#DB4747] text-white flex flex-col justify-between py-6">
      {/* Parte superior */}
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <img src="img/ufps.png" alt="UFPS Logo" className="w-16 h-auto" />
        </div>

        {/* Sección de Inicio */}
        <div
          className={`w-full px-4 py-3 flex items-center gap-4 cursor-pointer ${
            selectedSection === "Inicio" ? "bg-white/40 rounded-lg" : ""
          }`}
          onClick={() => handleSectionClick("Inicio")}
        >
          <img src="img/home-alt.svg" alt="Inicio" className="w-6 h-6" />
          <span className="text-lg font-medium">Inicio</span>
        </div>

        {/* Sección Mis datos */}
        <div className="w-full">
          <div
            className="w-full px-4 py-3 flex items-center gap-4 cursor-pointer hover:bg-white/20"
            onClick={toggleDropdown}
          >
            <img
              src="img/personal_data.svg"
              alt="Mis datos"
              className="w-6 h-6"
            />
            <span className="text-lg font-medium">Mis datos</span>
            <span
              className={`ml-auto transform transition-transform ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
              style={{ color: "black" }}
            >
              ▼
            </span>
          </div>
          <div
            className={`pl-8 overflow-hidden transition-all duration-300 ease-in-out ${
              isDropdownOpen ? "max-h-40" : "max-h-0"
            }`}
          >
            <div
              className={`w-full px-4 py-2 flex items-center gap-4 cursor-pointer hover:bg-white/20 ${
                selectedSection === "Ver mis datos"
                  ? "bg-white/40 rounded-lg"
                  : ""
              }`}
              onClick={handleNavigateToData}
            >
              <span className="text-base">Ver mis datos</span>
            </div>
          </div>
        </div>

        {/* Sección Denuncias anónimas */}
        <div className="w-full">
          <div
            className="w-full px-4 py-3 flex items-center gap-4 cursor-pointer hover:bg-white/20"
            onClick={toggleComplaintDropdown}
          >
            <img
              src="img/complaint.svg"
              alt="Denuncias anónimas"
              className="w-6 h-6"
            />
            <span className="text-lg font-medium">Denuncias anónimas</span>
            <span
              className={`ml-auto transform transition-transform ${
                isComplaintDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
              style={{ color: "black" }}
            >
              ▼
            </span>
          </div>
          <div
            className={`pl-8 overflow-hidden transition-all duration-300 ease-in-out ${
              isComplaintDropdownOpen ? "max-h-40" : "max-h-0"
            }`}
          >
            <div
              className={`w-full px-4 py-2 flex items-center gap-4 cursor-pointer hover:bg-white/20 ${
                selectedSection === "Ver denuncias anónimas"
                  ? "bg-white/40 rounded-lg"
                  : ""
              }`}
              onClick={handleNavigateToComplaint}
            >
              <span className="text-base">Ver denuncias anónimas</span>
            </div>
            <div
              className={`w-full px-4 py-2 flex items-center gap-4 cursor-pointer hover:bg-white/20 ${
                selectedSection === "Denuncias archivadas"
                  ? "bg-white/40 rounded-lg"
                  : ""
              }`}
              onClick={() => {
                setSelectedSection("Denuncias archivadas");
                navigate("/archived_complaints", { state: { adminData } });
              }}
            >
              <span className="text-base">Denuncias archivadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Parte inferior */}
      <div
        className="w-full px-4 py-3 flex items-center gap-4 cursor-pointer hover:bg-white/20"
        onClick={handleLogout}
      >
        <img
          src="img/cerrar-sesion.png"
          alt="Cerrar sesión"
          className="w-6 h-6"
        />
        <span className="text-lg font-medium">Cerrar sesión</span>
      </div>
    </div>
  );
};

export default Sidebar;
