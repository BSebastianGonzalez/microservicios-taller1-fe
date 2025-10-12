import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiShield, FiFileText } from "react-icons/fi";

const DataSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminData = JSON.parse(localStorage.getItem("admin")) || {
    nombre: "N/A",
    apellido: "N/A",
    correo: "N/A",
    telefono: "N/A",
    direccion: "N/A",
  };

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (location.state?.updated) {
      setSuccessOpen(true);
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const hasEmptyFields = () => {
    const vals = [
      adminData.nombre,
      adminData.apellido,
      adminData.correo,
      adminData.telefono,
      adminData.direccion,
    ];
    return vals.some((v) => !v || v === "N/A");
  };

  const handleUpdateClick = () => {
    if (hasEmptyFields()) {
      setErrMsg(
        "Faltan datos por completar. Te recomendamos actualizarlos antes de continuar."
      );
      setErrorOpen(true);
      return;
    }
    navigate("/data_update", { state: { adminData } });
  };

  const handleSecurityClick = () => {
    navigate("/change_password");
  };

  const handleDocumentsClick = () => {
    navigate("/personal_documents");
  };

  return (
    <div style={styles.container}>
      {/* Header con bienvenida */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              <FiUser size={32} color="#4f46e5" />
            </div>
            <div style={styles.welcomeText}>
              <p style={styles.welcomeSubtitle}>
                Gestiona tu información personal y configuración de cuenta
              </p>
            </div>
          </div>
          <div style={styles.quickActions}>
            <div 
              style={styles.quickActionCard}
              onClick={handleSecurityClick}
              role="button"
              aria-label="Documentos personales"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
              e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <FiShield size={20} color="#2463eb" />
              <span>Seguridad</span>
            </div>
            <div 
              style={styles.quickActionCard}
              onClick={handleDocumentsClick}
              role="button"
              aria-label="Documentos personales"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
              e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <FiFileText size={20} color="#2463eb" />
              <span>Documentos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta principal de información */}
      <div style={styles.mainCard}>
        <div style={styles.cardHeader}>
          <FiUser size={24} color="#4f46e5" />
          <h2 style={styles.cardTitle}>Información Personal</h2>
          <div style={styles.statusBadge}>
            {hasEmptyFields() ? (
              <span style={styles.incompleteBadge}>Datos Incompletos</span>
            ) : (
              <span style={styles.completeBadge}>Perfil Completo</span>
            )}
          </div>
        </div>

        <div style={styles.formGrid}>
          {/* Nombres */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <FiUser size={16} style={styles.fieldIcon} />
              Nombres
            </label>
            <div style={styles.fieldValue}>
              {adminData.nombre === "N/A" ? (
                <span style={styles.placeholderText}>No especificado</span>
              ) : (
                adminData.nombre
              )}
            </div>
          </div>

          {/* Apellidos */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <FiUser size={16} style={styles.fieldIcon} />
              Apellidos
            </label>
            <div style={styles.fieldValue}>
              {adminData.apellido === "N/A" ? (
                <span style={styles.placeholderText}>No especificado</span>
              ) : (
                adminData.apellido
              )}
            </div>
          </div>

          {/* Correo */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <FiMail size={16} style={styles.fieldIcon} />
              Correo Electrónico
            </label>
            <div style={styles.fieldValue}>
              {adminData.correo === "N/A" ? (
                <span style={styles.placeholderText}>No especificado</span>
              ) : (
                <span style={styles.emailText}>{adminData.correo}</span>
              )}
            </div>
          </div>

          {/* Teléfono */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <FiPhone size={16} style={styles.fieldIcon} />
              Teléfono
            </label>
            <div style={styles.fieldValue}>
              {adminData.telefono === "N/A" ? (
                <span style={styles.placeholderText}>No especificado</span>
              ) : (
                adminData.telefono
              )}
            </div>
          </div>

          {/* Dirección */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <FiMapPin size={16} style={styles.fieldIcon} />
              Dirección
            </label>
            <div style={styles.fieldValue}>
              {adminData.direccion === "N/A" ? (
                <span style={styles.placeholderText}>No especificada</span>
              ) : (
                adminData.direccion
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div style={styles.actionsSection}>
          <Button 
            text="Actualizar Información" 
            onClick={handleUpdateClick}
            icon={<FiEdit3 size={18} />}
            style={styles.updateButton}
          />
          {hasEmptyFields() && (
            <div style={styles.warningMessage}>
              ⚠️ Completa tu información para un perfil completo
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiUser size={24} color="#2563ebff" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>
              {hasEmptyFields() ? "2" : "5"}/5
            </div>
            <div style={styles.statLabel}>Campos completados</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiShield size={24} color="#10b981" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>Activa</div>
            <div style={styles.statLabel}>Cuenta verificada</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiFileText size={24} color="#f59e0b" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>0</div>
            <div style={styles.statLabel}>Documentos subidos</div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <Modal
        open={successOpen}
        type="success"
        title="¡Datos actualizados!"
        message="La información personal se guardó correctamente."
        confirmText="Entendido"
        onClose={() => setSuccessOpen(false)}
      />
      <Modal
        open={errorOpen}
        type="error"
        title="Faltan datos por completar"
        message={errMsg}
        confirmText="Ir a actualizar"
        onConfirm={() => navigate("/data_update", { state: { adminData } })}
        onClose={() => setErrorOpen(false)}
        onCancel={() => setErrorOpen(false)}
        cancelText="Luego"
      />
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    alignItems: "center",
    padding: "1rem 2rem 2rem 2rem",
  },

  header: {
    width: "100%",
    maxWidth: "1200px",
    marginBottom: "2rem",
  },

  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "2rem",
  },

  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "3px solid #2463eb",
    boxShadow: "0 8px 25px rgba(36, 99, 235, 0.15)",
  },

  welcomeText: {
    display: "flex",
    flexDirection: "column",
  },

  welcomeTitle: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#1e293b",
    margin: "0",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  welcomeSubtitle: {
    fontSize: "1.25rem",
    color: "#000000",
    margin: "0.5rem 0 0 0",
    fontWeight: "500",
  },

  quickActions: {
    display: "flex",
    gap: "1rem",
  },

  quickActionCard: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem 1.5rem",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    transition: "transform 150ms ease, box-shadow 180ms ease, background 120ms",
    fontWeight: "600",
    color: "#2563ebff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },

  mainCard: {
    width: "100%",
    maxWidth: "1200px",
    background: "white",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
    padding: "2.5rem",
    marginBottom: "2rem",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
    paddingBottom: "1.5rem",
    borderBottom: "2px solid #f1f5f9",
  },

  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0",
    flex: "1",
  },

  statusBadage: {
    display: "flex",
    alignItems: "center",
  },

  incompleteBadge: {
    background: "#fef3c7",
    color: "#d97706",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.875rem",
    fontWeight: "600",
  },

  completeBadge: {
    background: "#d1fae5",
    color: "#059669",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.875rem",
    fontWeight: "600",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
  },

  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  fieldLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: "650",
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  fieldIcon: {
    color: "#2563ebff",
    fontWeight: "650",
  },

  fieldValue: {
    padding: "1rem 1rem",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "#000000",
    minHeight: "5px",
    display: "flex",
    alignItems: "center",
  },

  placeholderText: {
    color: "#9ca3af",
    fontStyle: "italic",
  },

  emailText: {
    color: "#4f46e5",
    fontWeight: "600",
  },

  actionsSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    marginTop: "2.5rem",
    paddingTop: "1rem",
    borderTop: "2px solid #f1f5f9",
  },

  updateButton: {
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    border: "none",
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    fontWeight: "600",
  },

  warningMessage: {
    color: "#d97706",
    fontSize: "0.95rem",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: "-1rem",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "1200px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.5rem",
    background: "white",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },

  statIcon: {
    width: "60px",
    height: "60px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statContent: {
    display: "flex",
    flexDirection: "column",
  },

  statNumber: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "0.25rem",
  },

  statLabel: {
    fontSize: "0.9rem",
    color: "#64748b",
    fontWeight: "500",
  },
};


export default DataSection;