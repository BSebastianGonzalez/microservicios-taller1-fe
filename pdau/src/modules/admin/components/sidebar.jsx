import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiFileText,
  FiInbox,
  FiArchive,
  FiBarChart2,
  FiPieChart,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

const Sidebar = ({ adminData }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Estado UI
  const [selectedSection, setSelectedSection] = useState("Inicio");
  const [openDropdown, setOpenDropdown] = useState(null); // "datos" | "denuncias" | "reportes" | null
  const [hoverId, setHoverId] = useState(null);

  // Refs para cerrar al click fuera
  const datosRef = useRef(null);
  const denunciasRef = useRef(null);
  const reportesRef = useRef(null);

  // Sincroniza el seleccionado según la ruta actual
  useEffect(() => {
    const p = location.pathname;
    if (p.startsWith("/admin_main")) setSelectedSection("Inicio");
    else if (p.startsWith("/data")) setSelectedSection("Ver mis datos");
    else if (p.startsWith("/personal_documents"))
      setSelectedSection("Documentos personales");
    else if (p.startsWith("/read_complaint"))
      setSelectedSection("Ver denuncias anónimas");
    else if (p.startsWith("/complaint_checkout"))
      setSelectedSection("Ver denuncias anónimas");
    else if (p.startsWith("/response_registration"))
      setSelectedSection("Ver denuncias anónimas");
    else if (p.startsWith("/archived_complaints"))
      setSelectedSection("Denuncias archivadas");
    else if (p.startsWith("/stats")) 
      setSelectedSection("Generar indicadores de gestión");
    else if (p.startsWith("/statistics")) setSelectedSection("Generar estadísticas");
    else if (p.startsWith("/reports/new"))
      setSelectedSection("Generar reportes");
    else if (p.startsWith("/reports")) setSelectedSection("Consultar reportes");
  }, [location.pathname]);

  // Cerrar dropdowns al click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      const outside =
        (!datosRef.current || !datosRef.current.contains(e.target)) &&
        (!denunciasRef.current || !denunciasRef.current.contains(e.target)) &&
        (!reportesRef.current || !reportesRef.current.contains(e.target));
      if (outside) setOpenDropdown(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helpers
  const isHover = (id) => hoverId === id;

  const getMenuItemStyle = (id, active) => ({
    ...styles.menuItem,
    ...(active ? styles.menuItemActive : {}),
    ...(isHover(id) ? styles.menuItemHover : {}),
  });

  const getDropdownItemStyle = (id, active, disabled) => ({
    ...styles.dropdownItem,
    ...(active ? styles.dropdownItemActive : {}),
    ...(disabled ? styles.dropdownItemDisabled : {}),
    ...(isHover(id) ? styles.dropdownItemHover : {}),
  });

  // Navegación
  const go = (path, label) => {
    setSelectedSection(label);
    setOpenDropdown(null);
    navigate(path, { state: { adminData } });
  };

  return (
    <aside style={styles.sidebar}>
      {/* Top */}
      <div style={styles.topSection}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <img src="/img/logo.png" alt="PDAU" style={styles.logo} />
        </div>

        {/* Inicio */}
        <div
          style={getMenuItemStyle("inicio", selectedSection === "Inicio")}
          onMouseEnter={() => setHoverId("inicio")}
          onMouseLeave={() => setHoverId(null)}
          onClick={() => go("/admin_main", "Inicio")}
        >
          <FiHome style={styles.icon} />
          <span style={styles.menuText}>Inicio</span>
        </div>

        {/* Mis datos */}
        {/*
        <div style={styles.menuGroup} ref={datosRef}>
          <div
            style={getMenuItemStyle(
              "datos",
              openDropdown === "datos" ||
                selectedSection === "Ver mis datos" ||
                selectedSection === "Documentos personales"
            )}
            onMouseEnter={() => setHoverId("datos")}
            onMouseLeave={() => setHoverId(null)}
            onClick={() =>
              setOpenDropdown(openDropdown === "datos" ? null : "datos")
            }
          >
            <FiUser style={styles.icon} />
            <span style={styles.menuText}>Mis datos</span>
            <FiChevronDown
              style={{
                ...styles.dropdownArrow,
                transform:
                  openDropdown === "datos" ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
          */}

          {/* Panel dropdown */}
          {/*}
          <div
            style={{
              ...styles.dropdownPanel,
              ...(openDropdown === "datos" ? styles.dropdownPanelOpen : {}),
            }}
          >
            <div
              style={getDropdownItemStyle(
                "ver-datos",
                selectedSection === "Ver mis datos",
                false
              )}
              onMouseEnter={() => setHoverId("ver-datos")}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => go("/data", "Ver mis datos")}
            >
              <FiChevronRight style={styles.chevIcon} />
              <span style={styles.dropdownText}>Ver mis datos</span>
            </div>

            <div
              style={getDropdownItemStyle(
                "docs",
                selectedSection === "Documentos personales",
                false
              )}
              onMouseEnter={() => setHoverId("docs")}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => go("/personal_documents", "Documentos personales")}
            >
              <FiChevronRight style={styles.chevIcon} />
              <span style={styles.dropdownText}>Documentos personales</span>
            </div>
          </div>
        </div>

        {/* Denuncias anónimas */}
        <div style={styles.menuGroup} ref={denunciasRef}>
          <div
            style={getMenuItemStyle(
              "denuncias",
              openDropdown === "denuncias" ||
                selectedSection === "Ver denuncias anónimas" ||
                selectedSection === "Denuncias archivadas"
            )}
            onMouseEnter={() => setHoverId("denuncias")}
            onMouseLeave={() => setHoverId(null)}
            onClick={() =>
              setOpenDropdown(openDropdown === "denuncias" ? null : "denuncias")
            }
          >
            <FiInbox style={styles.icon} />
            <span style={styles.menuText}>Denuncias anónimas</span>
            <FiChevronDown
              style={{
                ...styles.dropdownArrow,
                transform:
                  openDropdown === "denuncias"
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
              }}
            />
          </div>

          <div
            style={{
              ...styles.dropdownPanel,
              ...(openDropdown === "denuncias" ? styles.dropdownPanelOpen : {}),
            }}
          >
            <div
              style={getDropdownItemStyle(
                "ver-denuncias",
                selectedSection === "Ver denuncias anónimas",
                false
              )}
              onMouseEnter={() => setHoverId("ver-denuncias")}
              onMouseLeave={() => setHoverId(null)}
              onClick={() =>
                go("/read_complaint", "Ver denuncias anónimas")
              }
            >
              <FiChevronRight style={styles.chevIcon} />
              <span style={styles.dropdownText}>Ver denuncias anónimas</span>
            </div>

            <div
              style={getDropdownItemStyle(
                "archivadas",
                selectedSection === "Denuncias archivadas",
                false
              )}
              onMouseEnter={() => setHoverId("archivadas")}
              onMouseLeave={() => setHoverId(null)}
              onClick={() =>
                go("/archived_complaints", "Denuncias archivadas")
              }
            >
              <FiChevronRight style={styles.chevIcon} />
              <span style={styles.dropdownText}>Denuncias archivadas</span>
            </div>
          </div>
        </div>

        {/* NUEVO: Estadísticas con submenú */}
        <div style={styles.menuGroup} ref={reportesRef}>
          <div
            style={getMenuItemStyle(
              "estadisticas",
              openDropdown === "estadisticas" ||
                selectedSection === "Generar indicadores de gestión" ||
                selectedSection === "Generar estadísticas"
            )}
            onMouseEnter={() => setHoverId("estadisticas")}
            onMouseLeave={() => setHoverId(null)}
            onClick={() =>
              setOpenDropdown(openDropdown === "estadisticas" ? null : "estadisticas")
            }
          >
            <FiBarChart2 style={styles.icon} />
            <span style={styles.menuText}>Estadísticas</span>
            <FiChevronDown
              style={{
                ...styles.dropdownArrow,
                transform:
                  openDropdown === "estadisticas"
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
              }}
            />
          </div>

          <div
            style={{
              ...styles.dropdownPanel,
              ...(openDropdown === "estadisticas" ? styles.dropdownPanelOpen : {}),
            }}
          >
            <div
              style={getDropdownItemStyle(
                "indicadores",
                selectedSection === "Generar indicadores de gestión",
                false
              )}
              onMouseEnter={() => setHoverId("indicadores")}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => go("/stats", "Generar indicadores de gestión")}
            >
              <FiChevronRight style={styles.chevIcon} />
              <span style={styles.dropdownText}>Generar indicadores de gestión</span>
            </div>

            <div
              style={getDropdownItemStyle(
                "estadisticas-gen",
                selectedSection === "Generar estadísticas",
                false
              )}
              onMouseEnter={() => setHoverId("estadisticas-gen")}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => go("/statistics", "Generar estadísticas")}
            >
              <FiChevronRight style={styles.chevIcon} />
              <span style={styles.dropdownText}>Generar estadísticas</span>
            </div>
          </div>
        </div>

        {/* Reportes */}
        <div style={styles.menuGroup} ref={reportesRef}>
          <div
            style={getMenuItemStyle(
              "reportes",
              openDropdown === "reportes" ||
                selectedSection === "Generar reportes" ||
                selectedSection === "Consultar reportes"
            )}
            onMouseEnter={() => setHoverId("reportes")}
            onMouseLeave={() => setHoverId(null)}
            onClick={() =>
              setOpenDropdown(openDropdown === "reportes" ? null : "reportes")
            }
          >
            <FiPieChart style={styles.icon} />
            <span style={styles.menuText}>Reportes</span>
            <FiChevronDown
              style={{
                ...styles.dropdownArrow,
                transform:
                  openDropdown === "reportes"
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
              }}
            />
          </div>

          <div
            style={{
              ...styles.dropdownPanel,
              ...(openDropdown === "reportes" ? styles.dropdownPanelOpen : {}),
            }}
          >
            {/* Deshabilitado (como en tu mockup) */}
            <div
              style={getDropdownItemStyle(
                "gen-report",
                selectedSection === "Generar reportes",
                true
              )}
              onMouseEnter={() => setHoverId("gen-report")}
              onMouseLeave={() => setHoverId(null)}
              onClick={(e) => e.stopPropagation()}
              aria-disabled="true"
              title="Disponible próximamente"
            >
              <FiChevronRight style={styles.chevIconMuted} />
              <span style={styles.dropdownTextMuted}>Generar reportes</span>
            </div>

            <div
              style={getDropdownItemStyle(
                "ver-report",
                selectedSection === "Consultar reportes",
                false
              )}
              onMouseEnter={() => setHoverId("ver-report")}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => go("/reports", "Consultar reportes")}
            >
              <FiChevronRight style={styles.chevIcon} />
              <span style={styles.dropdownText}>Consultar reportes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Cerrar sesión */}
      <div
        style={getMenuItemStyle("logout", false)}
        onMouseEnter={() => setHoverId("logout")}
        onMouseLeave={() => setHoverId(null)}
        onClick={() => navigate("/admin_login")}
      >
        <FiLogOut style={styles.icon} />
        <span style={styles.menuText}>Cerrar sesión</span>
      </div>
    </aside>

  );
};

/* ==== ESTILOS ==== */
const styles = {
  sidebar: {
    width: 260,
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    background:
      "linear-gradient(180deg, rgba(20,64,170,1) 0%, #2463ebff 45%, #204ecdff 100%)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 10px rgba(0,0,0,.12)",
    zIndex: 100,
  },

  topSection: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    paddingTop: 8,
    paddingBottom: 72, // espacio para el footer
    flex: 1,
  },

  logoContainer: {
    padding: "18px 0 10px",
    width: "100%",
    display: "grid",
    marginBottom: 20,
    placeItems: "center",
  },
  logo: {
    width: 76,
    height: 76,
    objectFit: "contain",
  },

  /* Item principal */
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 18px",
    cursor: "pointer",
    userSelect: "none",
    transition: "background .22s ease, transform .18s ease, box-shadow .22s ease",
    borderRadius: 12,
    marginInline: 10,
  },
  menuItemActive: {
    background: "rgba(255,255,255,.06)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)",
  },
  menuItemHover: {
    background:
      "linear-gradient(90deg, rgba(255,255,255,.12), rgba(255,255,255,.06))",
    transform: "translateY(-1px)",
  },

  icon: {
    fontSize: 22,
    flexShrink: 0,
    color: "rgba(255,255,255,.98)",
  },
  menuText: {
    fontWeight: 700,
    fontSize: 15.5,
    letterSpacing: ".5px",
    lineHeight: 1,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 16,
    opacity: 0.95,
    transition: "transform .25s ease",
  },

  /* Grupo y panel del dropdown */
  menuGroup: {
    width: "100%",
  },
  dropdownPanel: {
    maxHeight: 0,
    overflow: "hidden",
    marginInline: 16,
    marginTop: 6,
    borderRadius: 10,
    padding: "0 8px",
    background: "rgba(255,255,255,.18)",
    backdropFilter: "blur(2px)",
    transition:
      "max-height .28s ease, padding .28s ease, background .28s ease",
  },
  dropdownPanelOpen: {
    maxHeight: 400,
    padding: "8px 8px",
  },

  /* Sub-items */
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 8,
    cursor: "pointer",
    userSelect: "none",
    transition: "background .2s ease, transform .15s ease",
  },
  dropdownItemHover: {
    background: "rgba(255,255,255,.22)",
    transform: "translateY(-1px)",
  },
  dropdownItemActive: {
    background: "rgba(255,255,255,.30)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,.35)",
  },
  dropdownItemDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  dropdownText: {
    color: "rgba(255,255,255,.95)",
    fontSize: 14.5,
    fontWeight: 600,
  },
  dropdownTextMuted: {
    color: "rgba(255,255,255,.75)",
    fontSize: 14.5,
    fontWeight: 600,
  },
  chevIcon: {
    fontSize: 14,
    marginTop: -1,
    color: "rgba(255,255,255,.98)",
  },
  chevIconMuted: {
    fontSize: 14,
    marginTop: -1,
    color: "rgba(255,255,255,.7)",
  },
};

export default Sidebar;
