import React, { useState, useEffect } from "react";
import { FiFileText, FiExternalLink } from 'react-icons/fi';

const ResponseViewer = ({ response }) => {
  const [documentosConUrl, setDocumentosConUrl] = useState([]);
  const [temporaryUrls, setTemporaryUrls] = useState(new Set());

  // Limpiar URLs temporales cuando el componente se desmonte
  useEffect(() => {
    return () => {
      temporaryUrls.forEach(url => {
        window.URL.revokeObjectURL(url);
      });
    };
  }, [temporaryUrls]);

  // Procesar documentos cuando cambia la respuesta
  useEffect(() => {
    const procesarDocumentos = async () => {
      if (!response) return;

      const docs = response.documentosSoporte || response.archivosAdjuntos || [];
      if (docs.length === 0) {
        setDocumentosConUrl([]);
        return;
      }

      const BASE_RESPUESTAS_URL = import.meta.env.VITE_RESPUESTAS_API_URL || '';
      const documentosProcesados = [];

      for (const doc of docs) {
        try {
          // Verificar si el documento tiene datos binarios
          const tieneDatosBinarios = doc.datos && 
            (Array.isArray(doc.datos) || 
             (typeof doc.datos === 'string' && doc.datos.length > 100));

          if (tieneDatosBinarios) {
            console.log(`Procesando archivo binario: ${doc.nombre}`);

            // CONVERTIR BINARIOS A BLOB Y LUEGO A URL
            let blob;
            
            if (Array.isArray(doc.datos)) {
              // Si es array de números (bytes)
              const byteArray = new Uint8Array(doc.datos);
              blob = new Blob([byteArray], { 
                type: doc.tipoContenido || 'application/pdf' 
              });
            } else if (typeof doc.datos === 'string') {
              // Si es string (posiblemente base64 o hexadecimal)
              if (doc.datos.startsWith('0×')) {
                // Formato hexadecimal
                const hexString = doc.datos.substring(2);
                const bytes = new Uint8Array(hexString.length / 2);
                for (let i = 0; i < bytes.length; i++) {
                  bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
                }
                blob = new Blob([bytes], { 
                  type: doc.tipoContenido || 'application/pdf' 
                });
              } else {
                // Intentar como base64
                try {
                  const binaryString = atob(doc.datos);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  blob = new Blob([bytes], { 
                    type: doc.tipoContenido || 'application/pdf' 
                  });
                } catch (e) {
                  console.error('Error procesando como base64:', e);
                  continue;
                }
              }
            }

            if (blob) {
              const url = window.URL.createObjectURL(blob);
              
              // Guardar la URL temporal para limpiar después
              setTemporaryUrls(prev => new Set([...prev, url]));
              
              documentosProcesados.push({
                id: doc.id || `doc-${documentosProcesados.length}`,
                nombre: doc.nombre || doc.nombreArchivo || `Documento ${documentosProcesados.length + 1}`,
                url: url,
                tipoContenido: doc.tipoContenido || 'application/pdf',
                tamaño: `(${Math.round(blob.size / 1024)} KB)`,
                esTemporal: true
              });
              
              console.log(`Archivo convertido exitosamente: ${doc.nombre}`);
            }
          } else {
            // Si no tiene datos binarios, usar URL normal
            const rawUrl = doc.url || doc.ruta || doc.urlArchivo || doc.fileUrl || doc.path || '';

            let normalizedUrl = rawUrl || '';
            if (normalizedUrl) {
              const trimmed = String(normalizedUrl).trim();
              if (/^https?:\/\//i.test(trimmed)) {
                normalizedUrl = trimmed;
              } else if (trimmed.startsWith('/')) {
                normalizedUrl = BASE_RESPUESTAS_URL ? 
                  `${BASE_RESPUESTAS_URL.replace(/\/+$/, '')}${trimmed}` : trimmed;
              } else {
                normalizedUrl = BASE_RESPUESTAS_URL ? 
                  `${BASE_RESPUESTAS_URL.replace(/\/+$/, '')}/${trimmed}` : trimmed;
              }
            }

            documentosProcesados.push({
              id: doc.id || `doc-${documentosProcesados.length}`,
              nombre: doc.nombre || doc.nombreArchivo || `Documento ${documentosProcesados.length + 1}`,
              url: normalizedUrl,
              tipoContenido: doc.tipoContenido,
              tamaño: doc.tamano || doc.tamaño || doc.size || undefined
            });
          }
        } catch (error) {
          console.error(`Error procesando documento ${doc.nombre}:`, error);
        }
      }

      console.log('Documentos procesados:', documentosProcesados);
      setDocumentosConUrl(documentosProcesados);
    };

    procesarDocumentos();
  }, [response]);

  if (!response) {
    return (
      <div style={styles.noResponse}>
        <svg style={styles.noResponseIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p style={styles.noResponseText}>Esta denuncia aún no tiene respuesta registrada</p>
      </div>
    );
  }

  // Función para formatear fechas de forma segura
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";
      
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      console.error("Error formateando fecha:", error);
      return "Fecha inválida";
    }
  };

  // Función para calcular fecha límite de apelación
  const calculateAppealDeadline = () => {
    if (!response.fechaRespuesta) return "Fecha no disponible";
    
    try {
      const startDate = new Date(response.fechaRespuesta);
      if (isNaN(startDate.getTime())) return "Fecha inválida";

      const daysToAdd = response.diasApelacion || 5;
      const deadline = new Date(startDate);
      deadline.setDate(deadline.getDate() + daysToAdd);
      
      return deadline.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (error) {
      console.error("Error calculando fecha de apelación:", error);
      return "Error en cálculo";
    }
  };

  // Buscar el detalle de la respuesta
  const getResponseDetail = () => {
    return response.detalleRespuesta || 
           response.detalle || 
           response.descripcion || 
           response.contenido || 
           "No se proporcionó un detalle específico para esta respuesta.";
  };

  // Buscar el administrador responsable
  const getAdministrador = () => {
    if (response.administrador) {
      return typeof response.administrador === 'object' 
        ? response.administrador.nombre || "No especificado"
        : response.administrador;
    }
    return response.administradorResponsable || "No especificado";
  };

  // Función para manejar el clic en un documento
  const handleDocumentClick = (doc) => {
    if (!doc.url) {
      console.warn('Documento sin URL:', doc);
      return;
    }

    console.log('Abriendo documento:', doc);
    window.open(doc.url, '_blank', 'noopener,noreferrer');
  };

  // Función para obtener el icono según el tipo de archivo
  const getFileIcon = (nombre) => {
    const extension = nombre?.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'pdf':
        return <FiFileText style={{ ...styles.documentIcon, color: '#dc2626' }} />;
      case 'doc':
      case 'docx':
        return <FiFileText style={{ ...styles.documentIcon, color: '#2563eb' }} />;
      case 'xls':
      case 'xlsx':
        return <FiFileText style={{ ...styles.documentIcon, color: '#059669' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FiFileText style={{ ...styles.documentIcon, color: '#7c3aed' }} />;
      default:
        return <FiFileText style={styles.documentIcon} />;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <svg style={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 style={styles.title}>Respuesta Registrada</h3>
        </div>
        <span style={styles.statusBadge}>Respondida</span>
      </div>

      <div style={styles.infoGrid}>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Fecha de respuesta:</span>
          <span style={styles.infoValue}>
            {formatDate(response.fechaRespuesta)}
          </span>
        </div>
        <div style={styles.infoItem}>
          <span style={styles.infoLabel}>Administrador responsable:</span>
          <span style={styles.infoValue}>{getAdministrador()}</span>
        </div>
      </div>

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Detalle de la Respuesta</h4>
        <div style={styles.responseDetail}>
          {getResponseDetail()}
        </div>
      </div>

      {/* Mostrar documentos de soporte con el nuevo diseño */}
      {documentosConUrl && documentosConUrl.length > 0 ? (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            Documentos de Soporte ({documentosConUrl.length})
          </h4>
          <div style={styles.documentsList}>
            {documentosConUrl.map((doc, index) => {
              const isAvailable = doc.url;
              const esPdf = doc.nombre?.toLowerCase().endsWith('.pdf') || 
                           doc.tipoContenido === 'application/pdf';
              
              return (
                <div
                  key={doc.id || index}
                  style={{
                    ...styles.documentCard,
                    cursor: isAvailable ? 'pointer' : 'default',
                    opacity: isAvailable ? 1 : 0.7,
                    borderLeft: `4px solid ${esPdf ? '#dc2626' : '#3b82f6'}`
                  }}
                  onClick={() => isAvailable && handleDocumentClick(doc)}
                  onMouseEnter={(e) => {
                    if (isAvailable) {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                      e.currentTarget.style.borderColor = "#3b82f6";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  {getFileIcon(doc.nombre)}
                  <div style={styles.documentInfo}>
                    <span style={styles.documentName}>
                      {doc.nombre || `Documento ${index + 1}`}
                      {doc.esTemporal && (
                        <span style={{ 
                          fontSize: '0.7rem', 
                          color: '#f59e0b', 
                          marginLeft: '0.5rem',
                          fontWeight: 'normal'
                        }}>
                          (convertido)
                        </span>
                      )}
                    </span>
                    {doc.tamaño && (
                      <span style={styles.documentSize}>{doc.tamaño}</span>
                    )}
                  </div>
                  <div style={styles.documentActions}>
                    {isAvailable ? (
                      <FiExternalLink style={styles.actionIcon} title="Abrir en nueva pestaña" />
                    ) : (
                      <span style={styles.unavailableText}>No disponible</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div style={styles.appealBox}>
        <svg style={styles.clockIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div style={styles.appealText}>
          <strong>Plazo de apelación:</strong> El denunciante tiene{" "}
          <strong>{response.diasApelacion || 5} días</strong> desde la fecha de respuesta 
          para presentar una apelación o solicitud de reposición.
        </div>
      </div>

      <div style={styles.deadlineInfo}>
        <span style={styles.deadlineLabel}>Fecha límite para apelar:</span>
        <span style={styles.deadlineValue}>
          {calculateAppealDeadline()}
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "1.5rem",
    marginTop: "1.5rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },

  noResponse: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1.5rem",
    background: "#f9fafb",
    border: "2px dashed #d1d5db",
    borderRadius: 12,
    marginTop: "1.5rem",
  },

  noResponseIcon: {
    width: 64,
    height: 64,
    color: "#9ca3af",
    marginBottom: "1rem",
  },

  noResponseText: {
    marginTop: "1rem",
    color: "#6b7280",
    fontSize: "1rem",
    textAlign: "center",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "2px solid #e5e7eb",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },

  checkIcon: {
    width: 32,
    height: 32,
    color: "#059669",
  },

  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },

  statusBadge: {
    padding: "6px 14px",
    background: "#d1fae5",
    color: "#065f46",
    borderRadius: 20,
    fontSize: "0.875rem",
    fontWeight: 600,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
    marginBottom: "1.5rem",
    padding: "1rem",
    background: "#f9fafb",
    borderRadius: 8,
  },

  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },

  infoLabel: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#6b7280",
  },

  infoValue: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#0f172a",
  },

  section: {
    marginBottom: "1.5rem",
  },

  sectionTitle: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "0.75rem",
  },

  responseDetail: {
    padding: "1.25rem",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    color: "#334155",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    minHeight: "80px",
  },

  documentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  documentCard: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    borderLeft: "4px solid #3b82f6",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },

  documentIcon: {
    fontSize: "1.25rem",
    color: "#6b7280",
    flexShrink: 0
  },

  documentInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    flex: 1
  },

  documentName: {
    fontWeight: "600",
    color: "#000000",
    fontSize: "0.9rem",
    wordBreak: "break-word",
  },

  documentSize: {
    color: "#6b7280",
    fontSize: "0.8rem"
  },

  documentActions: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },

  actionIcon: {
    fontSize: "1rem",
    color: "#6b7280"
  },

  unavailableText: {
    color: "#9ca3af",
    fontSize: "0.8rem",
    fontStyle: "italic"
  },

  appealBox: {
    display: "flex",
    gap: "0.75rem",
    padding: "1rem",
    background: "#fffbeb",
    border: "1px solid #fbbf24",
    borderRadius: 8,
    marginBottom: "1rem",
  },

  clockIcon: {
    width: 24,
    height: 24,
    color: "#f59e0b",
    flexShrink: 0,
  },

  appealText: {
    fontSize: "0.9rem",
    color: "#78350f",
    lineHeight: 1.5,
  },

  deadlineInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    background: "#f0f9ff",
    border: "1px solid #0ea5e9",
    borderRadius: 8,
  },

  deadlineLabel: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#0c4a6e",
  },

  deadlineValue: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#0369a1",
  },
};

export default ResponseViewer;