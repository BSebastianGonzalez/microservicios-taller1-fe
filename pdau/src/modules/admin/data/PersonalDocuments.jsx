import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiDownload, FiUpload, FiEye, FiArchive, FiArrowLeft, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle, FiTrash2 } from "react-icons/fi";
import AdminService from "../../../services/AdminService";

const PersonalDocuments = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const urlsRef = useRef(new Map());

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const [documents, setDocuments] = useState([
    { 
      key: "IDENTIDAD",
      label: "Documento de Identidad", 
      uploaded: false,
      lastUpdated: null,
      size: null,
      status: "missing",
      description: "Cédula, pasaporte o documento de identidad oficial",
      documentoId: null,
      fileUrl: null
    },
    { 
      key: "CONTRATO",
      label: "Contrato Laboral", 
      uploaded: false,
      lastUpdated: null,
      size: null,
      status: "missing",
      description: "Contrato laboral vigente",
      documentoId: null,
      fileUrl: null
    },
    { 
      key: "CONFIDENCIALIDAD",
      label: "Acuerdo de Confidencialidad", 
      uploaded: false,
      lastUpdated: null,
      size: null,
      status: "missing",
      description: "Acuerdo de confidencialidad firmado",
      documentoId: null,
      fileUrl: null
    },
    { 
      key: "PERMISOS",
      label: "Permisos Especiales", 
      uploaded: false,
      lastUpdated: null,
      size: null,
      status: "missing",
      description: "Permisos especiales o licencias",
      documentoId: null,
      fileUrl: null
    },
  ]);

  useEffect(() => {
    cargarDocumentosExistentes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarDocumentosExistentes = async () => {
    try {
      setLoading(true);
      console.log("Cargando documentos existentes...");
      
      const documentosBackend = await AdminService.getMisDocumentos();
      
      if (Array.isArray(documentosBackend)) {
        const updated = documents.map((doc) => {
          const found = documentosBackend.find((d) => 
            String(d.tipo || d.tipoDocumento).toUpperCase() === String(doc.key).toUpperCase()
          );
          
          if (found) {
            // Determinar estado
            const status = (found.estado && String(found.estado).toLowerCase().includes('verif')) 
              ? 'verified' 
              : 'uploaded'; // ✅ Cambio: ahora es "uploaded" en lugar de "pending"

            const fileUrl = found.url || null;

            return {
              ...doc,
              uploaded: true,
              lastUpdated: found.fechaActualizacion || found.updatedAt || found.fechaSubida || new Date().toISOString().split('T')[0],
              size: found.tamaño || found.size || (found.fileSize ? `${(found.fileSize / (1024*1024)).toFixed(1)} MB` : doc.size),
              status,
              fileUrl,
              fileName: found.nombreArchivo || found.fileName || found.nombre || doc.label,
              documentoId: found.id || found.documentoId || null
            };
          }
          return doc;
        });

        setDocuments(updated);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error al cargar documentos:", error);
      setUploadError("Error al cargar los documentos existentes");
      setLoading(false);
    }
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingKey) return;

    // Validaciones
    if (file.type !== 'application/pdf') {
      setUploadError("Solo se permiten archivos PDF");
      resetUploadState();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setUploadError(`El archivo es demasiado grande: ${sizeInMB} MB. El tamaño máximo permitido es 2 MB.`);
      resetUploadState();
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const doc = documents.find(d => d.key === uploadingKey);
      const isUpdate = doc && doc.uploaded;

      console.log(isUpdate ? "Actualizando documento:" : "Subiendo documento:", uploadingKey, file.name);
      
      let response;
      if (isUpdate) {
        // Actualizar documento existente
        response = await AdminService.actualizarDocumento(file, uploadingKey);
      } else {
        // Subir nuevo documento
        response = await AdminService.subirDocumento(file, uploadingKey);
      }
      
      console.log("Operación exitosa:", response);

      const objectUrl = URL.createObjectURL(file);
      urlsRef.current.set(uploadingKey, objectUrl);

      const updatedDocs = documents.map((d) =>
        d.key === uploadingKey
          ? {
              ...d,
              uploaded: true,
              lastUpdated: new Date().toISOString().split("T")[0],
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              status: "uploaded", // ✅ Estado "uploaded" en lugar de "pending"
              fileUrl: objectUrl,
              fileName: file.name,
              documentoId: response.id || d.documentoId
            }
          : d
      );

      setDocuments(updatedDocs);
      setUploadError(null);
      
      console.log(isUpdate ? "✅ Documento actualizado exitosamente" : "✅ Documento subido exitosamente");

    } catch (error) {
      console.error("❌ Error:", error);
      setUploadError(error.message || "Error al procesar el documento. Intente nuevamente.");
    } finally {
      resetUploadState();
      e.target.value = "";
    }
  };

  const handleDownload = async (docKey) => {
    const doc = documents.find((d) => d.key === docKey);
    
    if (!doc || !doc.uploaded) {
      setUploadError("No hay archivo para descargar");
      return;
    }

    try {
      // Si tenemos URL local, usarla
      if (doc.fileUrl) {
        const a = document.createElement("a");
        a.href = doc.fileUrl;
        a.download = doc.fileName || `${doc.label}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // Si no, descargar del backend
      const { url, filename } = await AdminService.descargarDocumento(docKey);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(url), 1000);

    } catch (error) {
      console.error("Error al descargar documento:", error);
      setUploadError("Error al descargar el documento");
    }
  };

  const handleView = async (docKey) => {
    const doc = documents.find((d) => d.key === docKey);
    
    if (!doc || !doc.uploaded) {
      setUploadError("No hay archivo para visualizar");
      return;
    }

    try {
      let urlToOpen = doc.fileUrl;

      if (!urlToOpen) {
        const { url } = await AdminService.descargarDocumento(docKey);
        urlToOpen = url;
        urlsRef.current.set(docKey, url);
      }

      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error("Error al visualizar documento:", error);
      setUploadError("Error al visualizar el documento");
    }
  };

  const handleUpload = (docKey) => {
    setUploadingKey(docKey);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleDelete = async (docKey) => {
    const doc = documents.find((d) => d.key === docKey);
    if (!doc || !doc.uploaded) return;

    if (!window.confirm(`¿Está seguro de que desea eliminar el ${doc.label}?`)) {
      return;
    }

    try {
      // Usar el tipo de documento (docKey) en lugar del ID
      await AdminService.eliminarDocumento(docKey);
      
      // Limpiar URL si existe
      if (doc.fileUrl) {
        try {
          if (typeof doc.fileUrl === 'string' && doc.fileUrl.startsWith('blob:')) {
            URL.revokeObjectURL(doc.fileUrl);
          }
        } catch (err) {
          console.warn('No se pudo revocar la URL del documento:', err);
        }
        urlsRef.current.delete(docKey);
      }

      // Actualizar estado local
      const updatedDocs = documents.map((d) =>
        d.key === docKey
          ? {
              ...d,
              uploaded: false,
              lastUpdated: null,
              size: null,
              status: "missing",
              fileUrl: null,
              fileName: null,
              documentoId: null
            }
          : d
      );

      setDocuments(updatedDocs);
      console.log("✅ Documento eliminado exitosamente");

    } catch (error) {
      console.error("Error al eliminar documento:", error);
      setUploadError(error.message || "Error al eliminar el documento");
    }
  };

  const resetUploadState = () => {
    setUploading(false);
    setUploadingKey(null);
  };

  // ---------- Animaciones para botones (hover / press / focus) ----------
  const handleHoverEnter = (e) => {
    try {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(2,6,23,0.12)';
    } catch {
      // ignore
    }
  };

  const handleHoverLeave = (e) => {
    try {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    } catch {
      // ignore
    }
  };

  const handlePress = (e) => {
    try {
      e.currentTarget.style.transform = 'translateY(0) scale(0.995)';
    } catch {
      // ignore
    }
  };

  const handleRelease = (e) => {
    try {
      // volver al estado hover ligero
      e.currentTarget.style.transform = 'translateY(-3px)';
    } catch (err) {}
  };

  // Cleanup effect para URLs
  useEffect(() => {
    const urlsMap = urlsRef.current;
    return () => {
      urlsMap.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      });
      urlsMap.clear();
    };
  }, []);

  const StatusBadge = ({ status }) => {
    const map = {
      verified: {
        bg: '#ECFDF5',
        color: '#059669',
        text: 'Verificado',
        Icon: FiCheckCircle
      },
      uploaded: {  // ✅ NUEVO ESTADO
        bg: '#DBEAFE',
        color: '#2563eb',
        text: 'Subido',
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

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Cargando documentos...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.navigationSection}>
            <div
              style={styles.backButton}
              onClick={() => navigate("/data")}
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

      {/* Alerta de error */}
      {uploadError && (
        <div style={styles.errorAlert}>
          <FiAlertCircle size={20} />
          <span>{uploadError}</span>
          <button 
            onClick={() => setUploadError(null)}
            style={styles.closeErrorBtn}
          >
            ×
          </button>
        </div>
      )}

      {/* Tarjeta principal de documentos */}
      <div style={styles.mainCard}>
        <div style={styles.cardHeader}>
          <FiFileText size={24} color="#2463eb" />
          <h2 style={styles.cardTitle}>Gestión de Documentos</h2>
          <div style={styles.fileLimitBadge}>
            <span>Límite: 2MB por archivo</span>
          </div>
        </div>

        <div style={styles.uploadInfo}>
          <p style={styles.uploadInfoText}>
            <strong>Requisitos:</strong> Solo archivos PDF, tamaño máximo 2MB por documento
          </p>
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
                  <p style={styles.docDescription}>{doc.description}</p>
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
                      disabled={uploading}
                      title="Ver documento"
                      onMouseEnter={handleHoverEnter}
                      onMouseLeave={handleHoverLeave}
                      onMouseDown={handlePress}
                      onMouseUp={handleRelease}
                      onFocus={handleHoverEnter}
                      onBlur={handleHoverLeave}
                    >
                      <FiEye size={16} />
                      <span>Ver</span>
                    </button>
                    <button
                      style={styles.actionBtn}
                      onClick={() => handleUpload(doc.key)}
                      disabled={uploading}
                      title="Actualizar documento"
                      onMouseEnter={handleHoverEnter}
                      onMouseLeave={handleHoverLeave}
                      onMouseDown={handlePress}
                      onMouseUp={handleRelease}
                      onFocus={handleHoverEnter}
                      onBlur={handleHoverLeave}
                    >
                      <FiUpload size={16} />
                      <span>Actualizar</span>
                    </button>
                    <button
                      style={styles.actionBtn}
                      onClick={() => handleDownload(doc.key)}
                      disabled={uploading}
                      title="Descargar documento"
                      onMouseEnter={handleHoverEnter}
                      onMouseLeave={handleHoverLeave}
                      onMouseDown={handlePress}
                      onMouseUp={handleRelease}
                      onFocus={handleHoverEnter}
                      onBlur={handleHoverLeave}
                    >
                      <FiDownload size={16} />
                      <span>Descargar</span>
                    </button>
                    <button
                      style={{...styles.actionBtn, ...styles.deleteBtn}}
                      onClick={() => handleDelete(doc.key)}
                      disabled={uploading}
                      title="Eliminar documento"
                      onMouseEnter={handleHoverEnter}
                      onMouseLeave={handleHoverLeave}
                      onMouseDown={handlePress}
                      onMouseUp={handleRelease}
                      onFocus={handleHoverEnter}
                      onBlur={handleHoverLeave}
                    >
                      <FiTrash2 size={16} />
                      <span>Eliminar</span>
                    </button>
                  </>
                ) : (
                  <button
                    style={{
                      ...styles.uploadBtn,
                      ...(uploading && uploadingKey === doc.key ? styles.uploadingBtn : {})
                    }}
                    onClick={() => handleUpload(doc.key)}
                    disabled={uploading}
                    onMouseEnter={handleHoverEnter}
                    onMouseLeave={handleHoverLeave}
                    onMouseDown={handlePress}
                    onMouseUp={handleRelease}
                    onFocus={handleHoverEnter}
                    onBlur={handleHoverLeave}
                  >
                    <FiUpload size={16} />
                    <span>{uploading && uploadingKey === doc.key ? "Subiendo..." : "Subir Documento"}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estadísticas */}
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
            <FiCheckCircle size={24} color="#10b981" />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statNumber}>
              {documents.filter(d => d.status === 'verified').length}
            </div>
            <div style={styles.statLabel}>Documentos verificados</div>
          </div>
        </div>
      </div>

      <div style={styles.infoCard}>
        <div style={styles.infoHeader}>
          <FiFileText size={20} color="#2463eb" />
          <h3 style={styles.infoTitle}>Información Importante</h3>
        </div>
        <div style={styles.infoContent}>
          <p style={styles.infoText}>
            • <strong>Solo se permiten archivos PDF</strong> - No se aceptan otros formatos
          </p>
          <p style={styles.infoText}>
            • <strong>Tamaño máximo: 2MB por archivo</strong> - Comprima sus documentos si es necesario
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
    width: "100%",
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
    color: "#2463eb",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },

  titleSection: {
    display: "flex",
    flexDirection: "column",
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
    color: "#2463eb",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },

  errorAlert: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    marginBottom: "1rem",
    background: "#FEF2F2",
    border: "1px solid #FCA5A5",
    borderRadius: "12px",
    color: "#DC2626",
    fontWeight: "500",
  },

  closeErrorBtn: {
    marginLeft: "auto",
    background: "transparent",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#DC2626",
    padding: "0",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  mainCard: {
    width: "100%",          
    maxWidth: "100%",      
    background: "white",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 12px 30px rgba(2,6,23,0.06)",
    padding: "1rem 1rem 1rem 1rem",
    marginBottom: "1rem",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #f1f5f9",
  },

  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#000000",
    margin: "0",
    flex: "1",
  },

  fileLimitBadge: {
    background: "#e8f4ffff",
    color: "#000000",
    padding: "0.4rem 0.8rem",
    borderRadius: "16px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },

  uploadInfo: {
    marginBottom: "1.5rem",
    padding: "0.75rem",
    background: "#e8f4ffff",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },

  uploadInfoText: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#000000",
  },

  documentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
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

  docDescription: {
    fontSize: "0.85rem",
    color: "#000000",
    margin: "0 0 0.5rem 0",
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
    fontWeight: "400",
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

  deleteBtn: {
    color: '#dc2626',
    borderColor: '#fecaca'
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

  uploadingBtn: {
    opacity: 0.7,
    cursor: "not-allowed",
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
    marginBottom: "-1rem",
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
    color: "#000000",
    marginBottom: "0.25rem",
  },

  statLabel: {
    fontSize: "0.9rem",
    color: "#000000",
    fontWeight: "400",
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
    color: "#000000",
    margin: "0",
  },

  infoContent: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  infoText: {
    fontSize: "0.9rem",
    color: "#000000",
    margin: "0",
    fontWeight: "400",
  },

  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    fontSize: '1.1rem',
    color: '#6b7280'
  },

  loadingText: {
    fontSize: '1.1rem',
    color: '#6b7280'
  }
};

export default PersonalDocuments;