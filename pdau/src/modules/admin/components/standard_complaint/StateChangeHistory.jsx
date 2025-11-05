import React from "react";

const StateChangeHistory = ({ show, onClose, changes }) => {
  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button
          style={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 style={styles.title}>Historial de cambios de estado</h2>
        <div style={styles.changesContainer}>
          {changes.map((cambio, idx) => (
            <div
              key={cambio.id || idx}
              style={styles.changeItem}
            >
              <div style={styles.changeHeader}>
                <span style={styles.adminLabel}>
                  Administrador:{" "}
                  <span style={styles.adminValue}>
                    {cambio.admin?.nombre || "Desconocido"}
                  </span>
                </span>
                <span style={styles.date}>
                  {cambio.fechaCambio
                    ? new Date(cambio.fechaCambio).toLocaleString()
                    : ""}
                </span>
              </div>
              <div style={styles.changeDetail}>
                <span style={styles.detailLabel}>Estado anterior:</span>{" "}
                <span style={styles.detailValue}>
                  {cambio.estadoAnterior?.nombre || "N/A"}
                </span>
              </div>
              <div style={styles.changeDetail}>
                <span style={styles.detailLabel}>Estado nuevo:</span>{" "}
                <span style={styles.detailValue}>
                  {cambio.estado?.nombre || "N/A"}
                </span>
              </div>
              <div>
                <span style={styles.detailLabel}>Justificación:</span>
                <div style={styles.justification}>
                  {cambio.justificacion}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    backdropFilter: "blur(4px)",
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: "0.5rem",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    padding: "2rem",
    width: "100%",
    maxWidth: "42rem",
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative",
    animation: "slideUp 0.4s cubic-bezier(0.4,0,0.2,1)",
  },
  closeButton: {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    color: "#6b7280",
    fontSize: "1.5rem",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#dc2626",
  },
  changesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  changeItem: {
    backgroundColor: "#faf5ff",
    border: "1px solid #ddd6fe",
    borderRadius: "0.5rem",
    padding: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  changeHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },
  adminLabel: {
    fontWeight: 600,
    color: "#991b1b",
  },
  adminValue: {
    fontWeight: "normal",
    color: "#000000",
  },
  date: {
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  changeDetail: {
    marginBottom: "0.5rem",
  },
  detailLabel: {
    fontWeight: 600,
    color: "#991b1b",
  },
  detailValue: {
    color: "#000000",
  },
  justification: {
    backgroundColor: "#ffffff",
    border: "1px solid #e9d5ff",
    borderRadius: "0.375rem",
    padding: "0.5rem",
    marginTop: "0.25rem",
    color: "#000000",
    wordBreak: "break-word",
  },
};

export default StateChangeHistory;