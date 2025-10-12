import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiDownload, FiUpload, FiEye, FiArchive, FiUserCheck, FiArrowLeft, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

const PersonalDocuments = () => {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [uploadingKey, setUploadingKey] = useState(null);
  const urlsRef = useRef(new Set());

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingKey) return;
    // revoke previous object URL for this doc if existed
    const prevDoc = documents.find((d) => d.key === uploadingKey);
    if (prevDoc?.downloadUrl) {
      try {
        URL.revokeObjectURL(prevDoc.downloadUrl);
        urlsRef.current.delete(prevDoc.downloadUrl);
      } catch {
        // ignore
      }
    }

    const objectUrl = URL.createObjectURL(file);

    const updatedDocs = documents.map((doc) =>
      doc.key === uploadingKey
        ? {
            ...doc,
            uploaded: true,
            lastUpdated: new Date().toISOString().split("T")[0],
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            status: "pending",
            downloadUrl: objectUrl,
            fileName: file.name,
          }
        : doc
    );

    // keep track for cleanup on unmount
    urlsRef.current.add(objectUrl);

    setDocuments(updatedDocs);
    setUploadingKey(null);
    // limpiar input para permitir subir el mismo archivo nuevamente si es necesario
    e.target.value = "";
  };

  useEffect(() => {
    // copy ref to local variable now so cleanup can safely use it later
    const urlsSet = urlsRef.current;
    return () => {
      // cleanup any object URLs created
      const urls = Array.from(urlsSet);
      urls.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {
          // ignore
        }
      });
      urlsSet.clear();
    };
  }, []);

  const handleDownload = (docKey) => {
    const doc = documents.find((d) => d.key === docKey);
    if (!doc || !doc.uploaded || !doc.downloadUrl) {
      console.warn("No hay archivo para descargar para:", docKey);
      return;
    }

    // crear un enlace temporal para forzar la descarga
    const a = document.createElement("a");
    a.href = doc.downloadUrl;
    a.download = doc.fileName || `${doc.key}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // botón de regresar
  const handleBack = () => {
    navigate("/data");
  };

  // Estado para simular documentos subidos
  const [documents, setDocuments] = useState([
    { 
      key: "id",            
      label: "Documento de Identidad", 
      uploaded: true,
      lastUpdated: "2024-01-15",
      size: "2.4 MB",
      status: "verified"
    },
    { 
      key: "contrato",      
      label: "Contrato Laboral", 
      uploaded: true,
      lastUpdated: "2024-01-10",
      size: "1.8 MB",
      status: "pending"
    },
    { 
      key: "acuerdo",       
      label: "Acuerdo de Confidencialidad", 
      uploaded: false,
      lastUpdated: null,
      size: null,
      status: "missing"
    },
    { 
      key: "permisos",      
      label: "Permisos Especiales", 
      uploaded: false,
      lastUpdated: null,
      size: null,
      status: "missing"
    },
  ]);

  const handleView = (docKey) => {
    const doc = documents.find((d) => d.key === docKey);
    if (doc && doc.uploaded && doc.downloadUrl) {
      // abrir el PDF subido en una nueva pestaña
      try {
        window.open(doc.downloadUrl, '_blank', 'noopener,noreferrer');
        console.log('Abriendo PDF en nueva pestaña:', doc.downloadUrl);
        return;
      } catch (e) {
        console.warn('No se pudo abrir el PDF en nueva pestaña, navegando a vista de documento', e);
      }
    }

    // fallback: navegar a la vista de documento si no hay archivo en memoria
    navigate(`/personal_documents/view/${docKey}`);
    console.log("Navegando a vista de documento:", docKey);
  };

  const handleUpload = (docKey) => {
    setUploadingKey(docKey);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
    console.log("Iniciando upload para:", docKey);
  };

  const StatusBadge = ({ status }) => {
    const map = {
      verified: {
        bg: '#ECFDF5',
        color: '#059669',
        text: 'Verificado',
        Icon: FiCheckCircle
      },
      pending: {
        bg: '#FFFBEB',
        color: '#B45309',
        text: 'Pendiente',
        Icon: FiClock
      },
      missing: {
        bg: '#F8FAFC',
        color: '#6B7280',
        text: 'No subido',
        Icon: FiXCircle
      }
    };

    const s = map[status] || map.missing;
    const Icon = s.Icon;

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '0.25rem 0.6rem',
        borderRadius: 999,
        background: s.bg,
        color: s.color,
        fontWeight: 700,
        fontSize: '0.8rem',
        boxShadow: '0 4px 10px rgba(2,6,23,0.04)'
      }}>
        <Icon size={14} />
        <span>{s.text}</span>
      </span>
    );
  };

  const uploadedCount = documents.filter(doc => doc.uploaded).length;
  const totalCount = documents.length;

  return (
    <div style={styles.container}>
      {/* input de archivo oculto que abre el explorador */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />

      {/* Header con estadísticas y botón de regresar */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.navigationSection}>
            <div
              style={styles.backButton}
              onClick={handleBack}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              role="button"
              aria-label="Volver al perfil"
            >
              <FiArrowLeft size={18} />
              <span style={{ marginLeft: 8, fontWeight: 700 }}>Volver al perfil</span>
            </div>

            <div style={styles.titleSection}>
              <p style={styles.welcomeSubtitle}>
                Gestiona y mantén actualizada tu documentación oficial
              </p>
            </div>
          </div>

          <div style={styles.quickStats}>
            <div style={styles.statBadge}>
              <FiArchive size={20} />
              <span>{uploadedCount}/{totalCount} documentos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta principal de documentos */}
      <div style={styles.mainCard}>
        <div style={styles.cardHeader}>
          <FiFileText size={24} color="#2463eb" />
          <h2 style={styles.cardTitle}>Gestión de Documentos</h2>
          <div style={styles.statusBadge}>
            <span style={uploadedCount === totalCount ? styles.completeBadge : styles.incompleteBadge}>
              {uploadedCount === totalCount ? "Completo" : "Pendiente"}
            </span>
          </div>
        </div>

        <div style={styles.documentsGrid}>
          {documents.map((doc) => (
            <div key={doc.key} style={styles.documentCard}>
              <div style={styles.docHeader}>
                <div style={styles.docIcon}>
                  <FiFileText size={20} color="#2463eb" />
                </div>
                <div style={styles.docInfo}>
                  <h3 style={styles.docTitle}>{doc.label}</h3>
                  <StatusBadge status={doc.status} />
                </div>
              </div>

              {doc.uploaded && (
                <div style={styles.docDetails}>
                  <div style={styles.docMeta}>
                    <span style={styles.docMetaText}>Actualizado: {doc.lastUpdated}</span>
                    <span style={styles.docMetaText}>Tamaño: {doc.size}</span>
                  </div>
                </div>
              )}

              <div style={styles.docActions}>
                {doc.uploaded ? (
                  <>
                    <button
                      style={styles.actionBtn}
                      onClick={() => handleView(doc.key)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0e7ff"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    >
                      <FiEye size={16} />
                      <span>Ver</span>
                    </button>
                    <button
                      style={styles.actionBtn}
                      onClick={() => handleUpload(doc.key)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0e7ff"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    >
                      <FiUpload size={16} />
                      <span>Actualizar</span>
                    </button>
                    <button
                      style={styles.actionBtn}
                      onClick={() => handleDownload(doc.key)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0e7ff"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    >
                      <FiDownload size={16} />
                      <span>Descargar</span>
                    </button>
                  </>
                ) : (
                  <button
                    style={styles.uploadBtn}
                    onClick={() => handleUpload(doc.key)}
                    onMouseEnter={(e) => e.currentTarget.style.background = "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"}
                  >
                    <FiUpload size={16} />
                    <span>Subir Documento</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel de estadísticas */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiFileText size={24} color="#2463eb" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>{uploadedCount}/{totalCount}</div>
            <div style={styles.statLabel}>Documentos subidos</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiUserCheck size={24} color="#10b981" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>
              {documents.filter(d => d.status === 'verified').length}
            </div>
            <div style={styles.statLabel}>Documentos verificados</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FiArchive size={24} color="#f59e0b" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>
              {documents.filter(d => d.status === 'pending').length}
            </div>
            <div style={styles.statLabel}>Pendientes de revisión</div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div style={styles.infoCard}>
        <div style={styles.infoHeader}>
          <FiFileText size={20} color="#2463eb" />
          <h3 style={styles.infoTitle}>Información Importante</h3>
        </div>
        <div style={styles.infoContent}>
          <p style={styles.infoText}>
            • Todos los documentos deben estar en formato PDF y no superar los 5MB
          </p>
          <p style={styles.infoText}>
            • Los documentos serán verificados por el departamento de recursos humanos
          </p>
          <p style={styles.infoText}>
            • Mantén tu documentación actualizada para evitar inconvenientes
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "98%",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    padding: "1rem 1rem 1rem 1rem",
    margin: "0",
  },

  header: {
    width: "100%",
    marginBottom: "2rem",
  },

  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "1rem",
  },

  navigationSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.6rem 1rem",
    background: "white",
    borderRadius: "10px",
    border: "1px solid #e6edf7",
    cursor: "pointer",
    transition: "transform 150ms ease, box-shadow 180ms ease",
    fontWeight: "700",
    color: "#2463ebff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },

  titleSection: {
    display: "flex",
    flexDirection: "column",
  },

  welcomeTitle: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#000000ff",
    margin: "0",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  welcomeSubtitle: {
    fontSize: "1.25rem",
    color: "#000000ff",
    margin: "0 0 0 0",
    fontWeight: "600",
  },

  quickStats: {
    display: "flex",
    alignItems: "center",
  },

  statBadge: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    fontWeight: "600",
    color: "#4f46e5",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },

  mainCard: {
    width: "100%",          
    maxWidth: "100%",      
    background: "white",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 12px 30px rgba(2,6,23,0.06)",
    padding: "1rem 1rem 1rem 1rem",
    marginBottom: "2rem",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #f1f5f9",
  },

  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0",
    flex: "1",
  },

  incompleteBadge: {
    background: "#fef3c7",
    color: "#d97706",
    padding: "0.4rem 0.8rem",
    borderRadius: "16px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },

  completeBadge: {
    background: "#d1fae5",
    color: "#059669",
    padding: "0.4rem 0.8rem",
    borderRadius: "16px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },

  documentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", // mejor ajuste responsivo para todo el ancho
    gap: "1.25rem",
  },

  documentCard: {
    background: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "1rem",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  docHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    marginBottom: "0.75rem",
  },

  docIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  docInfo: {
    flex: 1,
  },

  docTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#000000ff",
    margin: "0 0 0.25rem 0",
  },

  statusBadge: {
    padding: "0.25rem 0.5rem",
    borderRadius: "10px",
    fontSize: "0.75rem",
    fontWeight: "600",
    display: "inline-block",
  },

  docDetails: {
    marginBottom: "0.75rem",
  },

  docMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },

  docMetaText: {
    fontSize: "0.85rem",
    color: "#000000ff",
    fontWeight: "500",
  },

  docActions: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginTop: "0.75rem",
  },

  actionBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.45rem 0.9rem",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    color: "#2463eb",
    fontWeight: "600",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "all 0.12s ease",
    outline: "none",
  },

  uploadBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.6rem 1rem",
    background: "#2463eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.12s ease",
    outline: "none",
    width: "100%",
    justifyContent: "center",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
    width: "100%",
    maxWidth: "100%",
    marginBottom: "2rem",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 6px 18px rgba(2,6,23,0.04)",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
  },

  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  statContent: {
    display: "flex",
    flexDirection: "column",
  },

  statNumber: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "0.25rem",
  },

  statLabel: {
    fontSize: "0.9rem",
    color: "#64748b",
    fontWeight: "500",
  },

  infoCard: {
    width: "100%",
    maxWidth: "100%",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "1rem",
    boxShadow: "0 6px 18px rgba(2,6,23,0.04)",
  },

  infoHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1rem",
  },

  infoTitle: {
    fontSize: "1.05rem",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0",
  },

  infoContent: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  infoText: {
    fontSize: "0.9rem",
    color: "#64748b",
    margin: "0",
    fontWeight: "500",
  },
};


export default PersonalDocuments;