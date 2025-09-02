import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ adminData }) => {
  const [selectedSection, setSelectedSection] = useState("Inicio");
  const [openDropdown, setOpenDropdown] = useState(null); // null, "datos", "denuncias"
  const navigate = useNavigate();

  // Referencias para cerrar el dropdown al hacer click fuera
  const datosRef = useRef(null);
  const denunciasRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        datosRef.current &&
        !datosRef.current.contains(event.target) &&
        denunciasRef.current &&
        !denunciasRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setOpenDropdown(null);
    if (section === "Inicio") {
      navigate("/admin_main", { state: { adminData } });
    }
  };

  const handleLogout = () => {
    setOpenDropdown(null);
    navigate("/admin_login");
  };

  const handleDropdownToggle = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const handleNavigateToData = () => {
    setSelectedSection("Ver mis datos");
    setOpenDropdown(null);
    navigate("/data", { state: { adminData } });
  };

  const handleNavigateToComplaint = () => {
    setSelectedSection("Ver denuncias anónimas");
    setOpenDropdown(null);
    navigate("/read_complaint", { state: { adminData } });
  };

  const handleNavigateToArchived = () => {
    setSelectedSection("Denuncias archivadas");
    setOpenDropdown(null);
    navigate("/archived_complaints", { state: { adminData } });
  };

  return (
    <div style={styles.sidebar}>
      {/* Parte superior */}
      <div style={styles.topSection}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <img src="/img/logo.png" alt="Logo UFPS" style={styles.logo} />
        </div>

        {/* Sección de Inicio */}
        <div
          style={{
            ...styles.menuItem,
            ...(selectedSection === "Inicio" ? styles.menuItemActive : {}),
          }}
          onClick={() => handleSectionClick("Inicio")}
        >
          <img src="img/home-alt.svg" alt="Inicio" style={styles.icon} />
          <span style={styles.menuText}>Inicio</span>
        </div>

        {/* Sección Mis datos */}
        <div style={styles.menuGroup} ref={datosRef}>
          <div
            style={{
              ...styles.menuItem,
              ...(openDropdown === "datos" ? styles.menuItemActive : {}),
            }}
            onClick={() => handleDropdownToggle("datos")}
          >
            <img
              src="img/personal_data.svg"
              alt="Mis datos"
              style={styles.icon}
            />
            <span style={styles.menuText}>Mis datos</span>
            <span
              style={{
                ...styles.dropdownArrow,
                transform: openDropdown === "datos" ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▼
            </span>
          </div>
          <div
            style={{
              ...styles.dropdownContent,
              maxHeight: openDropdown === "datos" ? "160px" : "0",
            }}
          >
            <div
              style={{
                ...styles.dropdownItem,
                ...(selectedSection === "Ver mis datos" ? styles.dropdownItemActive : {}),
              }}
              onClick={handleNavigateToData}
            >
              <span style={styles.dropdownText}>Ver mis datos</span>
            </div>
          </div>
        </div>

        {/* Sección Denuncias anónimas */}
        <div style={styles.menuGroup} ref={denunciasRef}>
          <div
            style={{
              ...styles.menuItem,
              ...(openDropdown === "denuncias" ? styles.menuItemActive : {}),
            }}
            onClick={() => handleDropdownToggle("denuncias")}
          >
            <img
              src="img/complaint.svg"
              alt="Denuncias anónimas"
              style={styles.icon}
            />
            <span style={styles.menuText}>Denuncias anónimas</span>
            <span
              style={{
                ...styles.dropdownArrow,
                transform: openDropdown === "denuncias" ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▼
            </span>
          </div>
          <div
            style={{
              ...styles.dropdownContent,
              maxHeight: openDropdown === "denuncias" ? "160px" : "0",
            }}
          >
            <div
              style={{
                ...styles.dropdownItem,
                ...(selectedSection === "Ver denuncias anónimas" ? styles.dropdownItemActive : {}),
              }}
              onClick={handleNavigateToComplaint}
            >
              <span style={styles.dropdownText}>Ver denuncias anónimas</span>
            </div>
            <div
              style={{
                ...styles.dropdownItem,
                ...(selectedSection === "Denuncias archivadas" ? styles.dropdownItemActive : {}),
              }}
              onClick={handleNavigateToArchived}
            >
              <span style={styles.dropdownText}>Denuncias archivadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Parte inferior */}
      <div
        style={styles.logoutItem}
        onClick={handleLogout}
      >
        <img
          src="img/cerrar-sesion.png"
          alt="Cerrar sesión"
          style={styles.icon}
        />
        <span style={styles.menuText}>Cerrar sesión</span>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    height: "100%",
    width: "260px",
    background: "linear-gradient(120deg, rgb(34, 49, 82) 0%, rgb(37, 99, 235) 100%)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: "0",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.15)",
    position: "relative",
    zIndex: 100,
    overflow: "hidden",
  },
  topSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    marginTop: "1rem",
    flex: 1,
    gap: "0rem",
    paddingTop: "1rem",
  },
  logoContainer: {
    marginBottom: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "80px",
    background: "transparent",
    padding: 0,
  },
  logo: {
    width: "5rem",
    height: "5rem",
    marginTop: "1.5rem",
    objectFit: "contain",
    display: "block",
    filter: "none",
    border: "none",
    boxShadow: "none",
    borderRadius: "0",
  },
  menuGroup: {
    width: "100%",
    marginBottom: "0.5rem",
  },
  menuItem: {
    width: "100%",
    padding: "0.9rem 1.2rem 0.9rem 1.2rem",
    display: "flex",
    alignItems: "center",
    gap: "1.1rem",
    cursor: "pointer",
    transition: "none",
    position: "relative",
    borderRadius: "0.7rem",
    margin: "0",
    background: "transparent",
    minHeight: "48px",
    fontSize: "1.13rem",
    fontWeight: 600,
  },
  menuItemActive: {
    // El estilo activo solo se aplica al hacer hover, no de forma permanente
    // Por defecto, no se aplica ningún estilo especial
  },
  menuItemHover: {
    color: "#fff",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #223053 0%, #3b486b 100%)",
    transition: "background 0.25s cubic-bezier(.4,0,.2,1), color 0.25s cubic-bezier(.4,0,.2,1)",
    boxShadow: "0 2px 8px 0 rgba(30,58,138,0.08)",
  },
  icon: {
    width: "28px",
    height: "28px",
    filter: "brightness(0) invert(1)",
    flexShrink: 0,
    marginRight: "0.7rem",
    marginLeft: "0.1rem",
    transition: "filter 0.2s, transform 0.2s",
    display: "inline-block",
  },
  menuText: {
    fontSize: "1.13rem",
    fontWeight: "bold",
    flex: 1,
    whiteSpace: "normal",
    letterSpacing: "0.01em",
    textAlign: "left",
    lineHeight: "1.2",
    display: "block",
  },
  dropdownArrow: {
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "0.5rem",
    marginTop: "0rem",
    transition: "transform 0.3s",
    flexShrink: 0,
    // El color del icono debe ser blanco para que combine con el fondo
    color: "#fff",
    fontWeight: "bold",
    // Para SVG embebido, quitar fontSize
  },
  dropdownArrowIcon: {
    width: "22px",
    height: "22px",
    display: "block",
    fill: "#fff",
    transition: "transform 0.3s",
  },
  dropdownContent: {
    paddingLeft: "3.2rem",
    overflow: "hidden",
    transition: "max-height 0.3s",
    backgroundColor: "transparent",
    margin: "0",
    borderRadius: "0.5rem",
    width: "100%",
    marginLeft: "0",
    marginRight: "0",
    display: "flex",
    flexDirection: "column",
    gap: "0.1rem",
  },
  dropdownItem: {
    width: "100%",
    padding: "0.35rem 0.5rem 0.35rem 0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
    borderRadius: "0.375rem",
    margin: "0.05rem 0",
    background: "transparent",
    fontWeight: 400,
  },
  dropdownItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.13)",
    color: "#fff",
    fontWeight: "bold",
  },
  dropdownText: {
    fontSize: "1.01rem",
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.92)",
    letterSpacing: "0.01em",
    marginLeft: "0.1rem",
    lineHeight: "1.2",
  },
  logoutItem: {
    width: "100%",
    padding: "1.1rem 2.2rem",
    display: "flex",
    alignItems: "center",
    gap: "1.1rem",
    cursor: "pointer",
    borderRadius: "1rem",
    border: "none",
    minHeight: "56px",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "0rem",
    zIndex: 2,
    margin: 0,
    marginBottom: 0,
    transition: "background 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s cubic-bezier(.4,0,.2,1), transform 0.18s cubic-bezier(.4,0,.2,1)",
    fontWeight: 700,
    color: "#fff",
    fontSize: "1.18rem",
    letterSpacing: "0.01em",
    boxSizing: "border-box",
    overflow: "hidden",
    outline: "none",
    userSelect: "none",
    background: "transparent",
  },
  logoutItemHover: {
    background: "linear-gradient(90deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)",
    boxShadow: "0 8px 24px 0 rgba(30,58,138,0.13), 0 2px 8px 0 rgba(37,99,235,0.10)",
    transform: "translateY(-2px) scale(1.015)",
  },
};

export default Sidebar;
