import React from "react";
import Button from "../../../../components/Button";
import { useNavigate } from "react-router-dom";

const ComplaintMainInfo = ({
  complaint,
  departamentos,
  selectedDepartamento,
  assigningDept,
  onDepartamentoChange,
  onRemitir,
}) => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        {/* Botón para volver */}
        <div style={styles.backButtonContainer}>
          <button
            onClick={() => navigate("/read_complaint")}
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
            Volver a la lista de denuncias
          </button>
        </div>
        {/* Título */}
        <div style={styles.fieldRow}>
          <span style={styles.label}>Título</span>
          <input
            type="text"
            value={complaint.titulo}
            readOnly
            style={styles.input}
          />
        </div>
        {/* Descripción */}
        <div style={styles.fieldRow}>
          <span style={styles.label}>Descripción</span>
          <textarea
            value={complaint.descripcion}
            readOnly
            style={styles.textarea}
          />
        </div>
        {/* Departamento actual */}
        {complaint.departamento && (
          <div style={styles.fieldRow}>
            <span style={styles.label}>Departamento actual</span>
            <input
              type="text"
              value={complaint.departamento.nombre}
              readOnly
              style={styles.disabledInput}
            />
          </div>
        )}
        {/* Remitir a departamento */}
        <form onSubmit={onRemitir} style={styles.fieldRow}>
          <span style={styles.label}>Remitir a departamento</span>
          <select
            style={styles.select}
            value={selectedDepartamento}
            onChange={(e) => onDepartamentoChange(e.target.value)}
            required
            disabled={assigningDept}
          >
            <option value="">Selecciona un departamento...</option>
            {departamentos.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.nombre}
              </option>
            ))}
          </select>
          <Button
            type="submit"
            text={assigningDept ? "Remitiendo..." : "Remitir"}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={assigningDept}
          />
        </form>
        
      </div>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    textAlign: "center",
    color: "#000000",
    textTransform: "uppercase",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  fieldRow: {
    display: "flex",
    alignItems: "center",
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
  input: {
    flex: 1,
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    backgroundColor: "#f9fafb",
  },
  textarea: {
    flex: 1,
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    height: "8rem",
    resize: "none",
    fontFamily: "inherit",
    backgroundColor: "#f9fafb",
  },
  disabledInput: {
    flex: 1,
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    backgroundColor: "#e5e7eb",
    color: "#6b7280",
  },
  select: {
    flex: 1,
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
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

export default ComplaintMainInfo;