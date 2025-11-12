import React, { useState } from "react";
import FileComplaintService from "../../../../services/FileComplaintService";

const FileComplaintModal = ({
  show,
  onClose,
  complaintId,
  adminId,
  onSuccess,
}) => {
  const [justification, setJustification] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!justification.trim()) {
      setError("La justificación es obligatoria.");
      return;
    }
    setSubmitting(true);
    try {
      await FileComplaintService.archiveComplaint(complaintId, justification, adminId);
      setJustification("");
      setSubmitting(false);
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
        console.error(error);
        setError("Ocurrió un error al archivar la denuncia.");
        setSubmitting(false);
      }
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <button
          style={styles.closeBtn}
          onClick={onClose}
          disabled={submitting}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 style={styles.title}>Archivar denuncia</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label style={styles.label}>Justificación para archivar</label>
            <textarea
              style={styles.textarea}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              required
              rows={3}
              disabled={submitting}
              placeholder="Explica la razón para archivar la denuncia"
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <button
            type="submit"
            disabled={submitting}
            style={styles.submitBtn}
            aria-label="Archivar denuncia"
          >
            {submitting ? "Archivando..." : "Archivar denuncia"}
          </button>
        </form>
      </div>
      <style>{cssStyles}</style>
    </div>
  );
};


const cssStyles = `
  @keyframes slideUp {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .animate-slide-up {
    animation: slideUp 0.4s cubic-bezier(0.4,0,0.2,1);
  }
`;

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(4px)",
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: "0.5rem",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    padding: "2rem",
    width: "100%",
    maxWidth: "28rem",
    position: "relative",
    animation: "slideUp 0.4s cubic-bezier(0.4,0,0.2,1)",
  },
  closeBtn: {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    color: "#6b7280",
    fontSize: "1.5rem",
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#000",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    display: "block",
    fontWeight: 600,
    marginBottom: "0.25rem",
    color: "#374151",
  },
  textarea: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    resize: "vertical",
  },
  error: {
    color: "#dc2626",
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  submitBtn: {
    display: "block",
    width: "100%",
    padding: "0.75rem",
    fontSize: "1.0625rem",
    borderRadius: "0.5rem",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
};

export default FileComplaintModal;