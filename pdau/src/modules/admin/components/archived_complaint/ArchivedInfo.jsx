// ArchivedInfo.jsx - CORREGIDO
import React from "react";
import { useNavigate } from "react-router-dom";

const ArchivedInfo = ({ complaint, archivingHistory }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const d = new Date(dateString);
      if (Number.isNaN(d.getTime())) return "-";
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "-";
    }
  };

  const getArchivedDate = () => {
    // Primero intentar del historial de archivamiento
    if (archivingHistory && archivingHistory.length > 0) {
      const latestArchiving = archivingHistory[0];
      // ✅ CAMPO CORRECTO: fechaArchivado
      if (latestArchiving.fechaArchivado) {
        return latestArchiving.fechaArchivado;
      }
    }

    // Fallback: buscar en la denuncia misma
    if (complaint) {
      const possibleFields = [
        'fechaArchivado',  // ✅ Primero este
        'fechaArchivamiento',
        'fechaActualizacion',
        'updatedAt'
      ];
      
      for (let field of possibleFields) {
        if (complaint[field]) {
          return complaint[field];
        }
      }
    }

    return null;
  };

  if (!complaint) {
    return (
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <div style={styles.backButtonContainer}>
            <button
              onClick={() => navigate("/archived_complaints")}
              style={styles.backButton}
            >
              <svg
                style={styles.backIcon}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver a la lista de denuncias archivadas
            </button>
          </div>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ color: "#ef4444", fontSize: "1.1rem" }}>
              No se pudieron cargar los datos de la denuncia.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const archivedDate = getArchivedDate();

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.backButtonContainer}>
          <button
            onClick={() => navigate("/archived_complaints")}
            style={styles.backButton}
          >
            <svg
              style={styles.backIcon}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a la lista de denuncias archivadas
          </button>
        </div>

        <div style={styles.fieldRow}>
          <span style={styles.label}>Título</span>
          <input
            type="text"
            value={complaint.titulo ?? ""}
            readOnly
            style={styles.input}
          />
        </div>

        <div style={styles.fieldRow}>
          <span style={styles.label}>Descripción</span>
          <textarea
            value={complaint.descripcion ?? ""}
            readOnly
            style={styles.textarea}
          />
        </div>

        <div style={styles.fieldRow}>
          <span style={styles.labelArchive}>Fecha de archivación</span>
          <input
            type="text"
            value={formatDate(archivedDate)}
            readOnly
            style={styles.inputReadOnly}
          />
        </div>

        {archivingHistory && archivingHistory.length > 0 && archivingHistory[0].nombreAdmin && (
          <div style={styles.fieldRow}>
            <span style={styles.label}>Archivado por</span>
            <input
              type="text"
              value={archivingHistory[0].nombreAdmin}
              readOnly
              style={styles.inputReadOnly}
            />
          </div>
        )}

        {complaint.departamento && (
          <div style={styles.fieldRow}>
            <span style={styles.label}>Departamento actual</span>
            <input
              type="text"
              value={complaint.departamento.nombre}
              readOnly
              style={styles.inputReadOnly}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  fieldRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
  },
  label: {
    backgroundColor: "#c7c7c7ff",
    color: "black",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    fontWeight: "bold",
    fontSize: "1.125rem",
    width: "200px",
    minWidth: "200px",
    textAlign: "center",
  },
  labelArchive: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "1rem",
    width: "200px",
    minWidth: "200px",
    textAlign: "center",
  },
  input: {
    flex: 1,
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    backgroundColor: "#f9fafb",
    color: "#374151",
    outline: "none",
  },
  textarea: {
    flex: 1,
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    height: "120px",
    resize: "none",
    fontFamily: "inherit",
    backgroundColor: "#f9fafb",
    color: "#000000ff",
    outline: "none",
    lineHeight: "1.5",
  },
  inputReadOnly: {
    flex: 1,
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    backgroundColor: "#f3f4f6",
    color: "#000000ff",
    outline: "none",
  },
  backButtonContainer: {
    width: "100%",
    marginTop: "1rem",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "600",
    color: "#2463eb",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    marginTop: "-1rem",
  },
  backIcon: {
    width: "1.25rem",
    height: "1.25rem",
  },
};

export default ArchivedInfo;