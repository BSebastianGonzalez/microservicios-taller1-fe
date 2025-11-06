import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusTag from "../../../../components/StatusTag";
import Button from "../../../../components/Button";
import ComplaintService from "../../../../services/ComplaintService";
import ResponseService from "../../../../services/ResponseService";
import Footer from "../../../../components/Footer";
import { FiFileText, FiClock, FiAlertTriangle, FiXCircle, FiEdit, FiDownload, FiExternalLink } from 'react-icons/fi';
import { FaBalanceScale } from 'react-icons/fa';

// Función para determinar el color del estado actual
function getEstadoActualStyle(estadoNombre) {
  const raw = (estadoNombre || "").toLowerCase();
  const nombre = raw.normalize ? raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : raw;

  if (nombre.includes('revision')) {
    return {
      ...styles.estadoActual,
      background: '#fef9c3',
      color: '#374151'
    };
  }

  if (nombre.includes('resuelt') || nombre.includes('respondid') || nombre.includes('validad')) {
    return {
      ...styles.estadoActual,
      background: '#bbf7d0',
      color: '#166534'
    };
  }

  if (nombre.includes('rechaz')) {
    return {
      ...styles.estadoActual,
      background: '#fecaca',
      color: '#991b1b'
    };
  }

  if (nombre.includes('archiv')) {
    return {
      ...styles.estadoActual,
      background: '#bfdbfe',
      color: '#1e3a8a'
    };
  }

  return styles.estadoActual;
}

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
    case 'zip':
    case 'rar':
      return <FiFileText style={{ ...styles.documentIcon, color: '#f59e0b' }} />;
    default:
      return <FiFileText style={styles.documentIcon} />;
  }
};

const ComplaintResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingResponse, setLoadingResponse] = useState(true);
  const [error, setError] = useState(null);
  const [temporaryUrls, setTemporaryUrls] = useState(new Set()); // Para limpiar URLs temporales

  useEffect(() => {
    window.scrollTo(0, 0);
    const forceScrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    forceScrollToTop();
    setTimeout(forceScrollToTop, 0);
    setTimeout(forceScrollToTop, 100);

    const handleLoad = () => {
      forceScrollToTop();
    };

    window.addEventListener('load', handleLoad);
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // Limpiar URLs temporales cuando el componente se desmonte
  useEffect(() => {
    return () => {
      temporaryUrls.forEach(url => {
        window.URL.revokeObjectURL(url);
      });
    };
  }, [temporaryUrls]);

  useEffect(() => {
    const fetchComplaintData = async () => {
      try {
        setLoading(true);
        setError(null);

        let complaintData = null;

        if (location.state && location.state.complaint) {
          complaintData = location.state.complaint;
        } else if (location.state && location.state.token) {
          complaintData = await ComplaintService.getComplaintByToken(location.state.token);
        } else {
          const urlParams = new URLSearchParams(window.location.search);
          const token = urlParams.get('token');
          
          if (token) {
            complaintData = await ComplaintService.getComplaintByToken(token);
          } else {
            throw new Error("No se proporcionó información para cargar la denuncia");
          }
        }

        if (!complaintData) {
          throw new Error("No se pudo cargar la información de la denuncia");
        }

        setComplaint(complaintData);
        setLoading(false);
        
        if (complaintData.id) {
          await fetchResponse(complaintData.id);
        } else {
          setLoadingResponse(false);
        }

      } catch (error) {
        console.error("Error al cargar la denuncia:", error);
        setError(error.message || "Error al cargar la denuncia");
        setLoading(false);
        setLoadingResponse(false);
      }
    };

    const fetchResponse = async (complaintId) => {
      try {
        setLoadingResponse(true);
        
        const responseData = await ResponseService.obtenerRespuesta(complaintId);
        
        if (responseData) {
          console.log("Respuesta obtenida del backend:", responseData);
          
          // Procesar documentos - CONVERSIÓN DE BINARIOS A URLs
          const documentosProcesados = await procesarDocumentos(responseData);
          
          const processedResponse = {
            id: responseData.id,
            fechaRespuesta: responseData.fechaRespuesta,
            administrador: responseData.administrador?.nombre || 
                         responseData.administradorResponsable || 
                         "Administrador del sistema",
            detalleRespuesta: responseData.detalle || 
                            responseData.descripcion || 
                            responseData.contenido || 
                            "No se proporcionó un detalle específico.",
            documentosSoporte: documentosProcesados,
            diasApelacion: responseData.diasApelacion || 5,
            fechaLimiteApelacion: responseData.fechaLimiteApelacion || 
                                calcularFechaLimite(responseData.fechaRespuesta, responseData.diasApelacion || 5)
          };
          
          setResponse(processedResponse);
        } else {
          setResponse(null);
        }
        
        setLoadingResponse(false);
      } catch (error) {
        console.error("Error al cargar la respuesta:", error);
        
        if (error.response?.status === 404) {
          setResponse(null);
        } else {
          setError("Error al cargar la respuesta: " + (error.message || "Error desconocido"));
        }
        
        setLoadingResponse(false);
      }
    };

    // FUNCIÓN PARA PROCESAR DOCUMENTOS Y CONVERTIR BINARIOS A URLs
    const procesarDocumentos = async (responseData) => {
      try {
        let docsRaw = responseData.documentosSoporte || 
                     responseData.archivosAdjuntos || 
                     responseData.documentos || 
                     responseData.files || 
                     responseData.archivos || 
                     responseData.documentosRespuesta || 
                     null;

        // Si no hay documentos, retornar array vacío
        if (!docsRaw) return [];

        // Si viene como string JSON, parsear
        if (typeof docsRaw === 'string') {
          try {
            docsRaw = JSON.parse(docsRaw);
          } catch {
            console.warn('No se pudo parsear documentos como JSON');
            return [];
          }
        }

        // Si es un objeto pero no array, buscar arrays dentro
        if (docsRaw && !Array.isArray(docsRaw) && typeof docsRaw === 'object') {
          if (Array.isArray(docsRaw.content)) docsRaw = docsRaw.content;
          else if (Array.isArray(docsRaw.data)) docsRaw = docsRaw.data;
          else if (Array.isArray(docsRaw.archivos)) docsRaw = docsRaw.archivos;
          else {
            // Buscar cualquier propiedad que sea array de objetos
            const candidate = Object.values(docsRaw).find(v => 
              Array.isArray(v) && v.length > 0 && typeof v[0] === 'object'
            );
            if (candidate) docsRaw = candidate;
          }
        }

        if (!Array.isArray(docsRaw)) return [];

        const BASE_RESPUESTAS_URL = import.meta.env.VITE_RESPUESTAS_API_URL || '';
        const documentosProcesados = [];

        for (const doc of docsRaw) {
          try {
            // Verificar si el documento tiene datos binarios
            const tieneDatosBinarios = doc.datos && 
              (Array.isArray(doc.datos) || 
               (typeof doc.datos === 'string' && doc.datos.length > 100));

            if (tieneDatosBinarios) {
              console.log(`Procesando archivo binario: ${doc.nombre}`, {
                tipoDatos: typeof doc.datos,
                esArray: Array.isArray(doc.datos),
                longitud: doc.datos.length
              });

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
                  // Formato hexadecimal (como "0×255044462...")
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
                    continue; // Saltar este archivo
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
                
                console.log(`Archivo convertido exitosamente: ${doc.nombre} - URL temporal creada`);
              }
            } else {
              // Si no tiene datos binarios, usar URL normal
              const rawUrl = doc.url || doc.ruta || doc.urlArchivo || doc.fileUrl || doc.path || doc.downloadUrl || doc.filePath || doc.publicUrl || '';

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
                nombre: doc.nombre || doc.nombreArchivo || doc.fileName || doc.nombreDocumento || `Documento ${documentosProcesados.length + 1}`,
                url: normalizedUrl,
                tipoContenido: doc.tipoContenido,
                tamaño: doc.tamano || doc.tamaño || doc.size || doc.fileSize || undefined
              });
            }
          } catch (error) {
            console.error(`Error procesando documento ${doc.nombre}:`, error);
            // Incluir el documento aunque haya error, pero marcado como no disponible
            documentosProcesados.push({
              id: doc.id || `doc-${documentosProcesados.length}`,
              nombre: doc.nombre || `Documento ${documentosProcesados.length + 1}`,
              url: null,
              error: true
            });
          }
        }

        console.log('Documentos procesados:', documentosProcesados);
        return documentosProcesados;

      } catch (error) {
        console.error('Error general procesando documentos:', error);
        return [];
      }
    };

    const calcularFechaLimite = (fechaRespuesta, diasApelacion) => {
      if (!fechaRespuesta) return null;
      
      try {
        const fecha = new Date(fechaRespuesta);
        const fechaLimite = new Date(fecha);
        fechaLimite.setDate(fechaLimite.getDate() + diasApelacion);
        return fechaLimite.toISOString();
      } catch (error) {
        console.error("Error calculando fecha límite:", error);
        return null;
      }
    };

    fetchComplaintData();
  }, [location, navigate]);

  const calcularDiasRestantes = (fechaLimite) => {
    if (!fechaLimite) return 0;
    
    try {
      const ahora = new Date();
      const limite = new Date(fechaLimite);
      
      if (isNaN(limite.getTime())) return 0;
      
      const diferencia = limite.getTime() - ahora.getTime();
      const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
      
      return Math.max(0, diasRestantes);
    } catch (error) {
      console.error("Error calculando días restantes:", error);
      return 0;
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    
    try {
      const date = new Date(fecha);
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

  // Función para manejar el clic en un documento
  const handleDocumentClick = (doc) => {
    if (!doc.url || doc.error) {
      console.warn('Documento no disponible:', doc);
      return;
    }

    // Para URLs temporales (de binarios convertidos)
    if (doc.esTemporal) {
      window.open(doc.url, '_blank', 'noopener,noreferrer');
    } else {
      // Para URLs normales
      window.open(doc.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingText}>Cargando información de la denuncia...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.errorContainer}>
          <div style={styles.errorText}>{error}</div>
          <Button
            text="Volver al Inicio"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => navigate("/")}
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.errorContainer}>
          <div style={styles.errorText}>No se pudo cargar la información de la denuncia</div>
          <Button
            text="Volver al Inicio"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => navigate("/")}
          />
        </div>
        <Footer />
      </div>
    );
  }

  const estadoActualNombre = complaint.estado?.nombre || complaint.estadoNombre || "Desconocido";
  const diasRestantes = response ? calcularDiasRestantes(response.fechaLimiteApelacion) : 0;
  const puedeApelar = response && diasRestantes > 0;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContent}>
        <h1 style={styles.title}>
          Consultar estado de denuncia anónima
        </h1>
        
        <div style={styles.card}>
          <h2 style={styles.subtitle}>Denuncia anónima</h2>
          <p style={styles.description}>{complaint.titulo}</p>
          
          <div style={styles.estadoActualBox}>
            <h2 style={styles.estadoActualTitle}>Estado actual</h2>
            <div style={getEstadoActualStyle(estadoActualNombre)}>
              {estadoActualNombre}
            </div>
          </div>

          {/* Sección de Respuesta del Administrador */}
          {!loadingResponse && response && (
            <div style={styles.responseSection}>
              <h3 style={styles.responseTitle}>Respuesta Oficial</h3>
              
              <div style={styles.responseInfo}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Fecha de respuesta:</span>
                  <span style={styles.infoValue}>{formatearFecha(response.fechaRespuesta)}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Administrador responsable:</span>
                  <span style={styles.infoValue}>{response.administrador}</span>
                </div>
              </div>

              <div style={styles.detailSection}>
                <h4 style={styles.detailTitle}>Detalle de la Respuesta</h4>
                <div style={styles.responseDetail}>
                  {response.detalleRespuesta}
                </div>
              </div>

              {response.documentosSoporte && response.documentosSoporte.length > 0 ? (
                <div style={styles.documentsSection}>
                  <h4 style={styles.documentsTitle}>
                    Documentos de Soporte ({response.documentosSoporte.length})
                  </h4>
                  <div style={styles.documentsList}>
                      {response.documentosSoporte.map((doc, index) => {
                        const isAvailable = doc.url && !doc.error;
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
                            onKeyPress={(e) => isAvailable && (e.key === 'Enter' || e.key === ' ') && handleDocumentClick(doc)}
                            tabIndex={isAvailable ? 0 : -1}
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
                                <>
                                  {doc.esTemporal ? (
                                    <FiExternalLink style={styles.actionIcon} title="Abrir PDF convertido" />
                                  ) : (
                                    <FiExternalLink style={styles.actionIcon} title="Abrir en nueva pestaña" />
                                  )}
                                </>
                              ) : (
                                <span style={styles.unavailableText}>
                                  {doc.error ? 'Error al cargar' : 'No disponible'}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div style={styles.noDocuments}>
                  <span style={{ color: '#6b7280' }}>No hay archivos adjuntos para esta respuesta.</span>
                </div>
              )}

              {/* Información de Apelación */}
              <div style={styles.appealSection}>
                <div style={styles.appealHeader}>
                  <FaBalanceScale style={styles.appealIcon} />
                  <h4 style={styles.appealTitle}>Información de Apelación</h4>
                </div>
                
                <div style={styles.appealInfo}>
                  <div style={styles.appealItem}>
                    <span style={styles.appealLabel}>Días para apelar:</span>
                    <span style={styles.appealValue}>{response.diasApelacion} días</span>
                  </div>
                  <div style={styles.appealItem}>
                    <span style={styles.appealLabel}>Fecha límite:</span>
                    <span style={styles.appealValue}>
                      {formatearFecha(response.fechaLimiteApelacion)}
                    </span>
                  </div>
                  <div style={styles.appealItem}>
                    <span style={styles.appealLabel}>Días restantes:</span>
                    <span style={{
                      ...styles.appealValue,
                      color: diasRestantes <= 3 ? "#dc2626" : 
                             diasRestantes <= 7 ? "#d97706" : "#059669",
                      fontWeight: "bold"
                    }}>
                      {diasRestantes} días
                    </span>
                  </div>
                </div>

                {puedeApelar ? (
                  <div style={styles.appealAlert}>
                    <FiAlertTriangle style={styles.alertIcon} />
                    <span style={styles.alertText}>
                      Tienes {diasRestantes} día{diasRestantes !== 1 ? 's' : ''} restantes para presentar una apelación o solicitud de reposición.
                    </span>
                  </div>
                ) : response && (
                  <div style={styles.appealExpired}>
                    <FiXCircle style={styles.expiredIcon} />
                    <span style={styles.expiredText}>
                      El plazo para apelar ha expirado.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!loadingResponse && !response && estadoActualNombre === "Respondida" && (
            <div style={styles.noResponse}>
              <FiEdit style={styles.noResponseIcon} />
              <p style={styles.noResponseText}>
                Esta denuncia ha sido marcada como respondida, pero la respuesta detallada aún no está disponible.
              </p>
            </div>
          )}

          {!loadingResponse && !response && estadoActualNombre !== "Respondida" && (
            <div style={styles.noResponse}>
              <FiClock style={styles.noResponseIcon} />
              <p style={styles.noResponseText}>
                Esta denuncia está en proceso. La respuesta oficial se publicará una vez completada la investigación.
              </p>
            </div>
          )}

          <Button
            text="Volver al inicio"
            className="bg-red-600 hover:bg-red-700 text-white w-full py-3 text-lg rounded-lg mt-2"
            onClick={() => navigate("/")}
            style={styles.button}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Los estilos se mantienen igual...
const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    position: "relative",
    cursor: 'default',
    backgroundColor: "#f8fafc"
  },
  mainContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    flex: 1,
    boxSizing: "border-box",
    padding: "clamp(2rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem)",
    paddingBottom: "5rem",
    cursor: 'default',
  },
  title: {
    fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
    fontWeight: "900",
    textAlign: "center",
    marginTop: "-1rem",
    marginBottom: "3.5rem",
    color: "#2563eb",
    width: "100%",
    letterSpacing: "0.3px",
    textShadow: "0 2px 12px rgba(37,99,235,0.10), 0 1px 2px rgba(30,41,59,0.10)",
    background: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    cursor: 'default',
    lineHeight: 1.1,
    wordBreak: "break-word",
  },
  card: {
    width: "100%",
    maxWidth: "min(90vw, 800px)",
    background: "#fff",
    borderRadius: "1.2rem",
    boxShadow: "0 4px 24px 0 rgba(37,99,235,0.10)",
    padding: "clamp(2rem, 4vw, 2.5rem) clamp(1.5rem, 3vw, 2rem)",
    textAlign: "center",
    marginBottom: "2rem",
    marginTop: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box"
  },
  subtitle: {
    fontSize: "clamp(1.5rem, 4vw, 2rem)",
    fontWeight: "bold",
    marginBottom: "0rem",
    marginTop: "-1rem",
    color: "#000000"
  },
  description: {
    fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
    marginBottom: "3.5rem",
    color: "#000000",
    lineHeight: "1.5"
  },
  estadoActualBox: {
    borderRadius: "1rem",
    padding: "clamp(1.2rem, 3vw, 1.5rem) clamp(1rem, 2.5vw, 1rem)",
    marginBottom: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "-2rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb"
  },
  estadoActualTitle: {
    fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
    fontWeight: "bold",
    marginBottom: "1rem",
    marginTop: "-0.5rem",
    color: "#000000"
  },
  estadoActual: {
    background: "#fef9c3",
    color: "#000000",
    padding: "clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)",
    borderRadius: "0.75rem",
    fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
    fontWeight: "600",
    border: "none",
    cursor: "default",
    display: "inline-block",
    textAlign: "center",
    minWidth: "fit-content",
    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)",
    userSelect: "none",
    pointerEvents: "none"
  },
  responseSection: {
    width: "100%",
    textAlign: "left",
    marginBottom: "2rem",
    padding: "1.5rem",
    backgroundColor: "#f8fafc",
    borderRadius: "0.75rem",
    border: "1px solid #e5e7eb"
  },
  responseTitle: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#000000",
    marginBottom: "1.5rem",
    marginTop: "-0rem",
    textAlign: "center"
  },
  responseInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1.5rem",
    padding: "1rem",
    backgroundColor: "#ffffff",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb"
  },
  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0"
  },
  infoLabel: {
    fontWeight: "700",
    color: "#000000",
    fontSize: "0.9rem"
  },
  infoValue: {
    color: "#000000",
    fontWeight: "400"
  },
  detailSection: {
    marginBottom: "1.5rem"
  },
  detailTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#000000",
    marginBottom: "0.75rem"
  },
  responseDetail: {
    padding: "1rem",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    color: "#000000",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    fontSize: "1rem"
  },
  documentsSection: {
    marginBottom: "1.5rem"
  },
  documentsTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#000000",
    marginBottom: "0.75rem"
  },
  documentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  documentCard: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    textDecoration: "none",
    transition: "all 0.2s ease",
    borderLeft: "4px solid #3b82f6"
  },
  documentCardHover: {
    backgroundColor: "#f8fafc",
    borderColor: "#3b82f6",
    transform: "translateY(-1px)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
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
    fontSize: "0.9rem"
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
  appealSection: {
    padding: "1.5rem",
    backgroundColor: "#f0f9ff",
    border: "1px solid #bae6fd",
    borderRadius: "0.75rem"
  },
  appealHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem"
  },
  appealIcon: {
    fontSize: "1.5rem"
  },
  appealTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#0369a1",
    margin: 0
  },
  appealInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "1rem"
  },
  appealItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0"
  },
  appealLabel: {
    fontWeight: "600",
    color: "#0c4a6e",
    fontSize: "0.9rem"
  },
  appealValue: {
    color: "#0369a1",
    fontWeight: "500"
  },
  appealAlert: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    backgroundColor: "#fffbeb",
    border: "1px solid #fbbf24",
    borderRadius: "0.5rem"
  },
  alertIcon: {
    fontSize: "1.25rem"
  },
  alertText: {
    color: "#78350f",
    fontSize: "0.9rem",
    fontWeight: "500"
  },
  appealExpired: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "0.5rem"
  },
  expiredIcon: {
    fontSize: "1.25rem"
  },
  expiredText: {
    color: "#991b1b",
    fontSize: "0.9rem",
    fontWeight: "500"
  },
  noResponse: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "2rem",
    backgroundColor: "#f8fafc",
    border: "2px dashed #d1d5db",
    borderRadius: "0.75rem",
    marginBottom: "1.5rem"
  },
  noResponseIcon: {
    fontSize: "3rem"
  },
  noResponseText: {
    color: "#000000",
    textAlign: "center",
    lineHeight: "1.5",
    fontSize: "1rem"
  },
  noDocuments: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem'
  },
  button: {
    minWidth: "clamp(120px, 15vw, 140px)",
    padding: "clamp(0.7rem, 2vw, 0.8rem) clamp(1.2rem, 3vw, 1.5rem)",
    fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
    fontWeight: 700,
    borderRadius: "0.75rem",
    boxShadow: "0 2px 8px 0 rgba(220,38,38,0.08)",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s, box-shadow 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "1rem",
    width: "100%",
    maxWidth: "min(90vw, 300px)"
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "400px",
    flex: 1
  },
  loadingText: {
    fontSize: "1.25rem",
    color: "#6b7280"
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    padding: "2rem",
    flex: 1,
    justifyContent: "center"
  },
  errorText: {
    fontSize: "1.125rem",
    color: "#dc2626",
    textAlign: "center"
  }
};

// Agregar estilos de hover
styles.documentCard = {
  ...styles.documentCard,
  ':hover': styles.documentCardHover
};

export default ComplaintResponse;