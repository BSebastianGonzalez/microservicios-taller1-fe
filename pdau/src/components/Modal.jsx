import React, { useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";

const Modal = ({
  open,
  type = "success", // 'success' | 'error'
  title = "",
  message = "",
  onClose,
  onConfirm,
  confirmText = "Aceptar",
  onCancel,
  cancelText,
  icon: customIcon,
  autoFocusConfirm = false,
}) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // ref for confirm button to autofocus for accessibility
  const confirmRef = React.useRef(null);
  React.useEffect(() => {
    if (open && autoFocusConfirm && confirmRef.current) {
      // small timeout to ensure element is in DOM
      setTimeout(() => confirmRef.current && confirmRef.current.focus(), 50);
    }
  }, [open, autoFocusConfirm]);

  if (!open) return null;

  const isSuccess = type === "success";
  const defaultIcon = isSuccess ? (
    <FiCheckCircle size={28} style={{ color: "#16a34a" }} />
  ) : (
    <FiXCircle size={28} style={{ color: "#dc2626" }} />
  );
  const headerIcon = customIcon || defaultIcon;

  return (
    <div
      style={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
    >
      <div style={styles.modal}>
        {/* Close (X) */}
        <button onClick={onClose} style={styles.closeBtn} aria-label="Cerrar">
          <FiX size={20} />
        </button>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>{headerIcon}</div>
          <h3 style={styles.title}>{title}</h3>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <p style={styles.message}>{message}</p>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          {onCancel && cancelText && (
            <button style={styles.secondaryBtn} onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button
            ref={confirmRef}
            style={styles.primaryBtn}
            onClick={onConfirm || onClose}
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "1rem",
  },
  modal: {
    width: "min(480px, 100%)",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    boxShadow: "0 24px 64px rgba(2, 6, 23, 0.18)",
    position: "relative",
    animation: "modalIn .2s ease-out",
  },
  closeBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: 6,
    borderRadius: 8,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1.25rem 1.25rem 0.5rem",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 999,
    background: "#f1f5f9",
    display: "grid",
    placeItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#0f172a",
  },
  body: {
    padding: "0.25rem 1.25rem 1rem",
  },
  message: {
    margin: 0,
    color: "#334155",
    lineHeight: 1.6,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    padding: "0 1.25rem 1.25rem",
  },
  primaryBtn: {
    background: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "0.7rem 1rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "#ff2d2dff",
    color: "#ffffffff",
    border: "1px solid #ffffffff",
    borderRadius: 12,
    padding: "0.7rem 1rem",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default Modal;
