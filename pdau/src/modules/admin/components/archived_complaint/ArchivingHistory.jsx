// ArchivingHistory.jsx - SOLUCIÓN CORRECTA
import React from "react";

const ArchivingHistory = ({ show, onClose, history, complaint }) => {
  if (!show) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "-";
    }
  };

  // ✅ Determinar si la denuncia está actualmente archivada
  const isCurrentlyArchived = complaint?.archivada === true;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Historial Completo de Archivamiento</h2>
          <button style={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div style={styles.modalContent}>
          {history.length === 0 ? (
            <div style={styles.emptyState}>
              No hay registros de archivamiento para esta denuncia.
            </div>
          ) : (
            <div style={styles.historyList}>
              {history.map((record, index) => {
                // ✅ El primer registro (más reciente) usa el estado actual de la denuncia
                const isLatestRecord = index === 0;
                const showArchived = isLatestRecord ? isCurrentlyArchived : record.activo;

                return (
                  <div key={record.id || index} style={styles.historyRecord}>
                    <div style={styles.recordHeader}>
                      <div style={styles.recordDateSection}>
                        <span style={styles.recordDateLabel}>Fecha de archivamiento:</span>
                        <span style={styles.recordDate}>
                          {formatDate(record.fechaArchivado)}
                        </span>
                      </div>
                    </div>
                    
                    {record.nombreAdmin && (
                      <div style={styles.recordAdminSection}>
                        <span style={styles.recordAdminLabel}>Archivado por:</span>
                        <span style={styles.recordAdmin}>
                          {record.nombreAdmin}
                        </span>
                      </div>
                    )}
                    
                    {record.justificacion && (
                      <div style={styles.recordJustificationSection}>
                        <span style={styles.recordJustificationLabel}>Justificación:</span>
                        <div style={styles.recordJustification}>
                          {record.justificacion}
                        </div>
                      </div>
                    )}
                    
                    {/* ✅ Badge basado en el estado actual */}
                    {showArchived ? (
                      <div style={styles.activeBadge}>
                        ARCHIVADO
                      </div>
                    ) : (
                      <div style={styles.inactiveBadge}>
                        DESARCHIVADO
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div style={styles.modalFooter}>
          <button style={styles.closeBtn} onClick={onClose}>
            Cerrar
          </button>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1400,
    padding: "1rem",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "700px",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    margin: 0,
    color: "#1f2937",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#6b7280",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    transition: "background 0.2s",
  },
  modalContent: {
    flex: 1,
    padding: "1.5rem",
    overflowY: "auto",
  },
  emptyState: {
    textAlign: "center",
    color: "#6b7280",
    fontStyle: "italic",
    padding: "2rem",
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  historyRecord: {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "1.25rem",
    backgroundColor: "#f9fafb",
    position: "relative",
  },
  recordHeader: {
    marginBottom: "1rem",
  },
  recordDateSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  recordDateLabel: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  recordDate: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#1f2937",
  },
  recordAdminSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    marginBottom: "1rem",
    padding: "0.75rem",
    background: "#ffffff",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
  },
  recordAdminLabel: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  recordAdmin: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#2563eb",
  },
  recordJustificationSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  recordJustificationLabel: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  recordJustification: {
    color: "#374151",
    lineHeight: "1.6",
    fontSize: "0.95rem",
    padding: "0.75rem",
    background: "#ffffff",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
  },
  activeBadge: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    padding: "0.375rem 0.75rem",
    backgroundColor: "#059669",
    color: "white",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  inactiveBadge: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    padding: "0.375rem 0.75rem",
    backgroundColor: "#dc2626",
    color: "white",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  modalFooter: {
    padding: "1rem 1.5rem",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "flex-end",
    background: "#f9fafb",
  },
  closeBtn: {
    padding: "0.625rem 1.5rem",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.95rem",
    transition: "background 0.2s",
  },
};

export default ArchivingHistory;