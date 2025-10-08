import React from "react";
import { useNavigate } from "react-router-dom";

const PersonalDocuments = () => {
  const navigate = useNavigate();

  // Lista de documentos a mostrar (puedes ajustar nombres/keys)
  const docs = [
    { key: "id",            label: "Documento de identidad" },
    { key: "contrato",      label: "Contrato" },
    { key: "acuerdo",       label: "Acuerdo laboral" },
    { key: "permisos",      label: "Permisos especiales" },
  ];

  // Handlers (ajusta navegación/acciones reales según tus rutas/servicios)
  const handleView = (docKey) => {
    navigate(`/personal_documents/view/${docKey}`);
    console.log("Ver documento:", docKey);
  };

  const handleUpdate = (docKey) => {
    navigate(`/personal_documents/update/${docKey}`);
    console.log("Actualizar documento:", docKey);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Documentos personales</h1>

      <div style={styles.card}>
        {docs.map((d) => (
          <div key={d.key} style={styles.row} className="doc-row">
            <label style={styles.label}>{d.label}</label>

            {/* Botón Ver */}
            <button
              style={{ ...styles.btn, minWidth: 120 }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.btnHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { ...styles.btn, minWidth: 120 })}
              onClick={() => handleView(d.key)}
              type="button"
            >
              Ver
            </button>

            {/* Botón Actualizar */}
            <button
              style={{ ...styles.btn, minWidth: 220 }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.btnHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { ...styles.btn, minWidth: 220 })}
              onClick={() => handleUpdate(d.key)}
              type="button"
            >
              Actualizar documento
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ====== ESTILOS (alineados con DataSection) ====== */
const styles = {
  // Área de contenido igual a DataSection (deja espacio al sidebar fijo de 260px)
  page: {
    marginLeft: "260px",
    width: "calc(100% - 260px)",
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "2.5rem 2rem 3.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#fff",
  },

  title: {
    fontFamily: "'Inter','Segoe UI', Arial, sans-serif",
    fontSize: "3rem",
    fontWeight: 900,
    color: "#0f172a",
    //margin: "0 0 1.8rem 0",
    textAlign: "center",
    marginBottom: "3rem",
    lineHeight: 1.1,
  },

  // Card blanca centrada (misma base que DataSection)
  card: {
    width: "min(800px, 80%)",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
    padding: "1.75rem 1.75rem 2rem",
    margin: "0 auto",
  },

  // Fila: Etiqueta | Botón Ver | Botón Actualizar
  // Mantiene la columna de etiqueta similar a DataSection y añade dos columnas de botones
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 160px 240px",
    alignItems: "center",
    columnGap: "18px",
    rowGap: "12px",
    padding: "6px 0",
  },

  label: {
    fontFamily: "'Inter','Segoe UI', Arial, sans-serif",
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#0f172a",
    textAlign: "center", // visual como el mockup (etiquetas alineadas al lado de los botones)
    paddingRight: "10px",
    whiteSpace: "nowrap",
  },

  // Botones con estilo consistente (gradiente y sombra) y hover animado
  btn: {
    padding: "0.75rem 1.2rem",
    //marginLeft: "-4rem",
    margin: "0 auto",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    display: "inline-flex",
    gap: "0.5rem",
    fontFamily: "'Inter','Segoe UI', Arial, sans-serif",
    fontWeight: 700,
    fontSize: "0.98rem",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    cursor: "pointer",
    background: "linear-gradient(90deg, #2563eb 0%, #1e40af 100%)",
    color: "#fff",
    boxShadow:
      "0 4px 12px -1px rgba(30, 58, 138, 0.15), 0 2px 8px -1px rgba(30, 58, 138, 0.10)",
    transform: "translateY(0)",
    transition:
      "background 0.25s cubic-bezier(.4,2,.6,1), transform 0.15s cubic-bezier(.4,2,.6,1), box-shadow 0.25s",
  },
  btnHover: {
    transform: "translateY(-1px)",
    boxShadow:
      "0 8px 24px -2px rgba(30, 58, 138, 0.20), 0 4px 12px -2px rgba(30, 58, 138, 0.15)",
    background: "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
  },
};

export default PersonalDocuments;
