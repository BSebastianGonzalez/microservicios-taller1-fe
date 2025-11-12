import React from "react";
import Button from "../../../../components/Button";

const ChangeStateModal = ({
  show,
  onClose,
  onSubmit,
  nextStates,
  selectedState,
  setSelectedState,
  justification,
  setJustification,
  submitting,
}) => {
  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button
          style={styles.closeButton}
          onClick={onClose}
          disabled={submitting}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 style={styles.title}>Cambiar estado de la denuncia</h2>
        <form onSubmit={onSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Selecciona el nuevo estado</label>
            <select
              style={styles.select}
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              required
              disabled={submitting}
            >
              <option value="">Selecciona un estado...</option>
              {(() => {
                // Solo permitir estos tres estados (si existen en nextStates): Inicial, Resuelta, Cerrada
                const allowed = ["inicial", "resuelta", "cerrada"];
                const filtered = Array.isArray(nextStates)
                  ? nextStates.filter((s) => allowed.includes((s.nombre || "").toString().toLowerCase()))
                  : [];

                // Si no hay estados filtrados, mostrar los nextStates por compatibilidad
                const toRender = filtered.length > 0 ? filtered : (nextStates || []);

                return toRender.map((estado) => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </option>
                ));
              })()}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Justificación del cambio</label>
            <textarea
              style={styles.textarea}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              required
              rows={3}
              disabled={submitting}
              placeholder="Explica la razón del cambio de estado"
            />
          </div>
          <Button
            text={submitting ? "Enviando..." : "Confirmar cambio"}
            className="bg-red-500 hover:bg-red-800 text-white w-full py-3 text-lg rounded-lg mt-2"
            type="submit"
            disabled={submitting}
          />
        </form>
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
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    padding: "2rem",
    width: "100%",
    maxWidth: "28rem",
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
    color: "#000000",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  field: {
    marginBottom: "0.5rem",
  },
  label: {
    display: "block",
    fontWeight: 600,
    marginBottom: "0.25rem",
    color: "#374151",
  },
  select: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
  },
  textarea: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    resize: "vertical",
    minHeight: "80px",
    fontFamily: "inherit",
  },
};

export default ChangeStateModal;