import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import AdminService from "../../../services/AdminService";
import Modal from "../../../components/Modal";
import { FiUser, FiMail, FiPhone, FiMapPin, FiArrowLeft, FiSave } from "react-icons/fi";

const DataUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminData =
    location.state?.adminData ||
    JSON.parse(localStorage.getItem("admin")) || {
      id: 1,
      nombre: "N/A",
      apellido: "N/A",
      correo: "N/A",
      telefono: "N/A",
      direccion: "N/A",
    };

  const [formData, setFormData] = useState({
    nombre: adminData.nombre || "",
    apellido: adminData.apellido || "",
    correo: adminData.correo || "",
    telefono: adminData.telefono || "",
    direccion: adminData.direccion || "",
  });

  const [initialFormData] = useState(formData);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.nombre?.trim()) return "El nombre es obligatorio.";
    if (!formData.apellido?.trim()) return "El apellido es obligatorio.";
    if (!formData.telefono?.trim()) return "El teléfono es obligatorio.";
    if (!formData.direccion?.trim()) return "La dirección es obligatoria.";
    
    // Validación de teléfono (solo números y algunos caracteres especiales)
    const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
    if (!phoneRegex.test(formData.telefono)) {
      return "El teléfono debe contener entre 8 y 15 dígitos válidos.";
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    const v = validate();
    if (v) {
      // Mostrar mensaje genérico en vez del detalle específico
      setErrMsg("Hay campos incompletos");
      setErrorOpen(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedData = await AdminService.updateAdmin(adminData.id, formData);
      localStorage.setItem("admin", JSON.stringify(updatedData));
      setSuccessOpen(true);
    } catch (error) {
      console.error("Error al actualizar:", error);
      setErrMsg(
        error?.message ||
          "Hubo un error al actualizar los datos. Intenta nuevamente."
      );
      setErrorOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormModified = () =>
    formData.nombre !== initialFormData.nombre ||
    formData.apellido !== initialFormData.apellido ||
    formData.telefono !== initialFormData.telefono ||
    formData.direccion !== initialFormData.direccion;

  const handleBack = () => {
    if (isFormModified()) {
      if (window.confirm("Tienes cambios sin guardar. ¿Deseas salir sin guardar?")) {
        navigate("/data");
      }
    } else {
      navigate("/data");
    }
  };

  const goBackToData = () => {
    setSuccessOpen(false);
    navigate("/data", { state: { updated: true } });
  };

  const hasEmptyFields = () => {
    return Object.values(formData).some(value => !value || value === "N/A");
  };

  return (
    <div style={styles.container}>
      {/* Header con navegación */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.navigationSection}>
            <div 
              style={styles.backButton}
              onClick={handleBack}
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
              role="button"
              aria-label="Volver al perfil"
            >
              <FiArrowLeft size={20} />
              <span>Volver al perfil</span>
            </div>
            <div style={styles.headerText}>
              <p style={styles.welcomeSubtitle}>
                Actualiza tu información personal y de contacto
              </p>
            </div>
          </div>
          
          <div style={styles.saveIndicator}>
            {isFormModified() && (
              <div style={styles.unsavedChanges}>
                <div style={styles.changeDot}></div>
                <span>Cambios sin guardar</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tarjeta principal de edición */}
      <form onSubmit={handleSubmit} style={styles.mainCard}>
        <div style={styles.cardHeader}>
          <FiUser size={24} color="#4f46e5" />
          <h2 style={styles.cardTitle}>Información Personal</h2>
          <div style={styles.statusBadge}>
            {hasEmptyFields() ? (
              <span style={styles.incompleteBadge}>Campos Incompletos</span>
            ) : (
              <span style={styles.completeBadge}>Formulario Completo</span>
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
            <input
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingresa tus nombres"
              style={styles.input}
              required
            />
            {!formData.nombre && (
              <span style={styles.errorText}>Este campo es obligatorio</span>
            )}
          </div>

          {/* Apellidos */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <FiUser size={16} style={styles.fieldIcon} />
              Apellidos
            </label>
            <input
              name="apellido"
              type="text"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Ingresa tus apellidos"
              style={styles.input}
              required
            />
            {!formData.apellido && (
              <span style={styles.errorText}>Este campo es obligatorio</span>
            )}
          </div>

          {/* Correo (solo visualización) */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <FiMail size={16} style={styles.fieldIcon} />
              Correo Electrónico
            </label>
            <div style={styles.readOnlyField}>
              <span style={styles.emailText}>{formData.correo}</span>
              <span style={styles.readOnlyBadge}>Solo lectura</span>
            </div>
          </div>

          {/* Teléfono */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <FiPhone size={16} style={styles.fieldIcon} />
              Teléfono
            </label>
            <input
              name="telefono"
              type="text"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: +51 987 654 321"
              style={styles.input}
              required
            />
            {!formData.telefono && (
              <span style={styles.errorText}>Este campo es obligatorio</span>
            )}
          </div>

          {/* Dirección */}
          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              <FiMapPin size={16} style={styles.fieldIcon} />
              Dirección
            </label>
            <input
              name="direccion"
              type="text"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Ingresa tu dirección completa"
              style={styles.input}
              required
            />
            {!formData.direccion && (
              <span style={styles.errorText}>Este campo es obligatorio</span>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div style={styles.actionsSection}>
          <Button 
            text={isSubmitting ? "Guardando..." : "Guardar Cambios"} 
            onClick={handleSubmit}
            icon={<FiSave size={18} />}
            disabled={isSubmitting || !isFormModified()}
            style={styles.saveButton}
          />

        </div>
      </form>

      {/* Estadísticas rápidas */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiUser size={24} color="#4f46e5" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>
              {Object.values(formData).filter(val => val && val !== "N/A").length}/5
            </div>
            <div style={styles.statLabel}>Campos completados</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiSave size={24} color="#10b981" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>
              {isFormModified() ? "Sí" : "No"}
            </div>
            <div style={styles.statLabel}>Cambios pendientes</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiMapPin size={24} color="#f59e0b" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>
              {formData === initialFormData ? "0" : "1"}
            </div>
            <div style={styles.statLabel}>Versión de edición</div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <Modal
        open={successOpen}
        type="success"
        title="¡Actualización exitosa!"
        message="Los datos han sido guardados correctamente."
        confirmText="Volver a mis datos"
        onConfirm={goBackToData}
        onClose={goBackToData}
      />

      <Modal
        open={errorOpen}
        type="error"
        title="No se pudo guardar"
        message={errMsg}
        confirmText="Entendido"
        onClose={() => setErrorOpen(false)}
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
    alignItems: "center",
    boxSizing: "border-box",
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
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "2rem",
  },

  navigationSection: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },

  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    marginRight: "-1rem",
    marginLeft: "-2.5rem",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "600",
    color: "#2463ebff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },

  headerText: {
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
    fontSize: "1.1rem",
    color: "#64748b",
    margin: "0.5rem 0 0 0",
    fontWeight: "500",
  },

  saveIndicator: {
    display: "flex",
    alignItems: "center",
  },

  unsavedChanges: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    background: "#fef3c7",
    color: "#d97706",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },

  changeDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#d97706",
    animation: "pulse 2s infinite",
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

  statusBadge: {
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
    fontWeight: "600",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  fieldIcon: {
    color: "#6b7280",
  },

  input: {
    padding: "1rem 1.25rem",
    background: "#ffffff",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "#1e293b",
    outline: "none",
    transition: "all 0.3s ease",
  },

  inputFocus: {
    borderColor: "#4f46e5",
    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
  },

  readOnlyField: {
    padding: "1rem 1.25rem",
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  emailText: {
    color: "#4f46e5",
    fontWeight: "600",
    fontSize: "1.1rem",
  },

  readOnlyBadge: {
    background: "#e5e7eb",
    color: "#6b7280",
    padding: "0.25rem 0.75rem",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },

  errorText: {
    color: "#dc2626",
    fontSize: "0.875rem",
    fontWeight: "500",
    marginTop: "0.25rem",
  },

  actionsSection: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "2.5rem",
    paddingTop: "1rem",
    marginBottom: "-1rem",
    borderTop: "2px solid #f1f5f9",
  },

  saveButton: {
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    border: "none",
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    fontWeight: "600",
    minWidth: "200px",
  },

  cancelButton: {
    background: "transparent",
    border: "2px solid #e5e7eb",
    color: "#6b7280",
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    fontWeight: "600",
    minWidth: "120px",
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

export default DataUpdate;