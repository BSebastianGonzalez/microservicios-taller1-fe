import React from "react";

const ResponseViewer = ({ response }) => {
  if (!response) {
    return (
      <div style={styles.noResponse}>
        <svg style={styles.noResponseIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p style={styles.noResponseText}>Esta denuncia aún no tiene respuesta registrada</p>
      </div>
    );
  }

  // Función para formatear fechas de forma segura
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";
      
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Fecha inválida";
    }
  };

  // Función para calcular fecha límite de apelación
  const calculateAppealDeadline = () => {
    if (!response.fechaRespuesta) return "Fecha no disponible";
    
    try {
      const startDate = new Date(response.fechaRespuesta);
      if (isNaN(startDate.getTime())) return "Fecha inválida";

      const daysToAdd = response.diasApelacion || 5; // Default a 5 días si no está definido
      const deadline = new Date(startDate);
      deadline.setDate(deadline.getDate() + daysToAdd);
      
      return deadline.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (error) {
      console.error("Error calculando fecha de apelación:", error);
      return "Error en cálculo";
    }
  };

  // Buscar el detalle de la respuesta en diferentes propiedades posibles
  const getResponseDetail = () => {
    return response.detalleRespuesta || 
           response.detalle || 
           response.descripcion || 
           response.contenido || 
           "No se proporcionó un detalle específico para esta respuesta.";
  };

  // Buscar el administrador responsable
  const getAdministrador = () => {
    if (response.administrador) {
      return typeof response.administrador === 'object' 
        ? response.administrador.nombre || "No especificado"
        : response.administrador;
    }
    return response.administradorResponsable || "No especificado";
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <svg style={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 style={styles.title}>Respuesta Registrada</h3>
        </div>
        <span style={styles.statusBadge}>Respondida</span>
      </div>

      <div style={styles.infoGrid}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Fecha de respuesta:</span>
          <span style={styles.infoValue}>
            {formatDate(response.fechaRespuesta)}
          </span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Administrador responsable:</span>
          <span style={styles.infoValue}>{getAdministrador()}</span>
        </div>
      </div>

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Detalle de la Respuesta</h4>
        <div style={styles.responseDetail}>
          {getResponseDetail()}
        </div>
      </div>

      {/* Mostrar documentos de soporte si existen */}
      {(response.documentosSoporte && response.documentosSoporte.length > 0) ||
       (response.archivosAdjuntos && response.archivosAdjuntos.length > 0) ? (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            Documentos de Soporte ({response.documentosSoporte?.length || response.archivosAdjuntos?.length})
          </h4>
          <div style={styles.documentsGrid}>
            {(response.documentosSoporte || response.archivosAdjuntos || []).map((doc, index) => (
              <a
                key={doc.id || index}
                href={doc.url || doc.ruta}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.documentCard}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}
              >
                <svg style={styles.docIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div style={styles.documentInfo}>
                  <span style={styles.documentName}>{doc.nombre || doc.nombreArchivo || "Documento sin nombre"}</span>
                  {doc.tamaño && (
                    <span style={styles.documentSize}>{doc.tamaño}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <div style={styles.appealBox}>
        <svg style={styles.clockIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div style={styles.appealText}>
          <strong>Plazo de apelación:</strong> El denunciante tiene{" "}
          <strong>{response.diasApelacion || 5} días</strong> desde la fecha de respuesta 
          para presentar una apelación o solicitud de reposición.
        </div>
      </div>

      <div style={styles.deadlineInfo}>
        <span style={styles.deadlineLabel}>Fecha límite para apelar:</span>
        <span style={styles.deadlineValue}>
          {calculateAppealDeadline()}
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "1.5rem",
    marginTop: "1.5rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },

  noResponse: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1.5rem",
    background: "#f9fafb",
    border: "2px dashed #d1d5db",
    borderRadius: 12,
    marginTop: "1.5rem",
  },

  noResponseIcon: {
    width: 64,
    height: 64,
    color: "#9ca3af",
    marginBottom: "1rem",
  },

  noResponseText: {
    marginTop: "1rem",
    color: "#6b7280",
    fontSize: "1rem",
    textAlign: "center",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #e5e7eb",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },

  checkIcon: {
    width: 32,
    height: 32,
    color: "#059669",
  },

  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },

  statusBadge: {
    padding: "6px 14px",
    background: "#d1fae5",
    color: "#065f46",
    borderRadius: 20,
    fontSize: "0.875rem",
    fontWeight: 600,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
    marginBottom: "1.5rem",
    padding: "1rem",
    background: "#f9fafb",
    borderRadius: 8,
  },

  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },

  infoLabel: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#6b7280",
  },

  infoValue: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#0f172a",
  },

  section: {
    marginBottom: "1.5rem",
  },

  sectionTitle: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "0.75rem",
  },

  responseDetail: {
    padding: "1.25rem",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    color: "#334155",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    minHeight: "80px",
  },

  documentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "0.75rem",
  },

  documentCard: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    textDecoration: "none",
    transition: "background 0.2s, box-shadow 0.2s",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },

  docIcon: {
    width: 32,
    height: 32,
    color: "#3b82f6",
    flexShrink: 0,
  },

  documentInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    flex: 1,
  },

  documentName: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#1e293b",
    wordBreak: "break-word",
  },

  documentSize: {
    fontSize: "0.8rem",
    color: "#64748b",
  },

  appealBox: {
    display: "flex",
    gap: "0.75rem",
    padding: "1rem",
    background: "#fffbeb",
    border: "1px solid #fbbf24",
    borderRadius: 8,
    marginBottom: "1rem",
  },

  clockIcon: {
    width: 24,
    height: 24,
    color: "#f59e0b",
    flexShrink: 0,
  },

  appealText: {
    fontSize: "0.9rem",
    color: "#78350f",
    lineHeight: 1.5,
  },

  deadlineInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    background: "#f0f9ff",
    border: "1px solid #0ea5e9",
    borderRadius: 8,
  },

  deadlineLabel: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#0c4a6e",
  },

  deadlineValue: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#0369a1",
  },
};

export default ResponseViewer;