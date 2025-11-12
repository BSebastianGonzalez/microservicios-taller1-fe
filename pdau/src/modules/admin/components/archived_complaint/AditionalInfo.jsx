import React from "react";

const AditionalInfo = ({ complaint, categorias, files, estado, onArchive }) => {
  
  const getArchivedDate = (complaintObj) => {
    if (!complaintObj) return null;
    
    const possibleFields = [
      'fechaArchivamiento',
      'fechaArchivado', 
      'fechaActualizacion',
      'updatedAt',
      'createdAt'
    ];
    
    for (let field of possibleFields) {
      if (complaintObj[field]) {
        return complaintObj[field];
      }
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "-";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.sidebarTitle}>Información Adicional</h2>
      
      {/* Categorías */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Categorías</h3>
        {categorias && categorias.length > 0 ? (
          <ul style={styles.list}>
            {categorias.map((cat) => (
              <li key={cat.id} style={styles.listItem}>
                {cat.nombre}
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noData}>No hay categorías</p>
        )}
      </div>

      {/* Archivos de evidencia */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Archivos de evidencia</h3>
        {files && files.length > 0 ? (
          <ul style={styles.list}>
            {files.map((file) => (
              <li key={file.id} style={styles.listItem}>
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.fileLink}
                >
                  {file.nombre || `Archivo ${file.id}`}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noData}>No hay archivos</p>
        )}
      </div>

      {/* Estado actual */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Estado actual</h3>
        {estado ? (
          <div style={styles.status}>
            <span style={styles.statusText}>{estado.nombre}</span>
          </div>
        ) : (
          <p style={styles.noData}>No hay estado definido</p>
        )}
      </div>

      {/* Fecha de archivamiento */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Fecha de archivamiento</h3>
        <div style={styles.archiveDate}>
          {formatDate(getArchivedDate(complaint))}
        </div>
      </div>

      {/* Botón para desarchivar */}
      <div style={styles.section}>
        <button
          onClick={onArchive}
          style={styles.unarchiveButton}
        >
          Desarchivar Denuncia
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "320px",
    background: "#ffffff",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    height: "fit-content",
  },
  sidebarTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    color: "#1f2937",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "0.75rem",
  },
  section: {
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    fontSize: "1.125rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    color: "#374151",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: "0.5rem 0",
    borderBottom: "1px solid #f3f4f6",
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  fileLink: {
    color: "#3b82f6",
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
  status: {
    display: "inline-block",
    background: "#dcfce7",
    color: "#166534",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  statusText: {
    fontSize: "0.9rem",
  },
  archiveDate: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#dc2626",
    padding: "0.75rem",
    background: "#fef2f2",
    borderRadius: "8px",
    textAlign: "center",
    border: "1px solid #fecaca",
  },
  noData: {
    color: "#9ca3af",
    fontStyle: "italic",
    fontSize: "0.9rem",
  },
  unarchiveButton: {
    width: "100%",
    padding: "0.75rem 1rem",
    background: "#ef4444",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "background 0.2s ease",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
};

// Efectos hover
const addHoverEffects = () => {
  const style = document.createElement('style');
  style.textContent = `
    [style*="background: #ef4444"]:hover {
      background: #dc2626 !important;
    }
    [style*="color: #3b82f6"]:hover {
      color: #1d4ed8 !important;
    }
  `;
  document.head.appendChild(style);
};

if (typeof document !== 'undefined') {
  addHoverEffects();
}

export default AditionalInfo;