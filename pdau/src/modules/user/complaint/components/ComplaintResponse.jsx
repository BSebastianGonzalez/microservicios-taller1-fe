import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusTag from "../../../../components/StatusTag";
import Button from "../../../../components/Button";
import ComplaintService from "../../../../services/ComplaintService";
import ResponseService from "../../../../services/ResponseService";
import Footer from "../../../../components/Footer";
import { FiFileText, FiClock, FiAlertTriangle, FiXCircle, FiEdit } from 'react-icons/fi';
import { FaBalanceScale } from 'react-icons/fa';

// Función para determinar el color del estado actual
function getEstadoActualStyle(estadoNombre) {
  const nombre = (estadoNombre || "").toLowerCase();
  if (nombre === "revisión" || nombre === "revision" || nombre === "en revisión") {
    return {
      ...styles.estadoActual,
      background: "#fef9c3",
      color: "#374151"
    };
  } else if (nombre === "validada" || nombre === "validado" || nombre === "respondida") {
    return {
      ...styles.estadoActual,
      background: "#bbf7d0",
      color: "#166534"
    };
  } else if (nombre === "cerrada" || nombre === "cerrado" || nombre === "archivada") {
    return {
      ...styles.estadoActual,
      background: "#fecaca",
      color: "#991b1b"
    };
  }
  return styles.estadoActual;
}

const ComplaintResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingResponse, setLoadingResponse] = useState(true);

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

  useEffect(() => {
    const fetchComplaintData = async () => {
      try {
        if (location.state && location.state.complaint) {
          setComplaint(location.state.complaint);
          setLoading(false);
          
          // Buscar respuesta si existe
          if (location.state.complaint.id) {
            await fetchResponse(location.state.complaint.id);
          }
        } else if (location.state && location.state.token) {
          // Si viene con token, buscar la denuncia
          const complaintData = await ComplaintService.getComplaintByToken(location.state.token);
          setComplaint(complaintData);
          setLoading(false);
          
          // Buscar respuesta
          if (complaintData.id) {
            await fetchResponse(complaintData.id);
          }
        } else {
          // Durante desarrollo/local: si no viene state ni token, cargar datos estáticos
          // para permitir acceder directamente por URL y ver la UI.
          const datosEstaticos = {
            id: 1,
            titulo: "Acoso y hostigamiento dentro del campus",
            descripcion: "Se han presentado situaciones de acoso verbal y físico por parte de un profesor hacia varios estudiantes dentro de la facultad.",
            fechaCreacion: "2025-03-25T10:30:00",
            estado: { id: 2, nombre: "En revisión" },
            departamento: { id: 1, nombre: "Decanatura de Ciencias" }
          };

          setComplaint(datosEstaticos);
          setLoading(false);

          // Buscar respuesta asociada al id estático
          if (datosEstaticos.id) {
            await fetchResponse(datosEstaticos.id);
          }
        }
      } catch (error) {
        console.error("Error al cargar la denuncia:", error);
        navigate("/");
      }
    };

  const fetchResponse = async () => {
      try {
        setLoadingResponse(true);
        // DATOS ESTÁTICOS PARA VISUALIZACIÓN
        const responseEstatica = {
          id: 1,
          fechaRespuesta: "2025-03-30T14:30:00",
          administrador: "Dra. María González - Decana",
          detalleRespuesta: "Después de realizar una investigación exhaustiva, se han tomado las siguientes medidas:\n\n1. Se ha iniciado un proceso disciplinario contra el docente implicado.\n2. Se han implementado nuevos protocolos de prevención de acoso.\n3. Los estudiantes afectados han sido contactados y se les ha ofrecido apoyo psicológico.\n4. Se realizará un seguimiento continuo del caso.\n\nLa universidad reitera su compromiso con un ambiente educativo seguro y libre de hostigamiento.",
          documentosSoporte: [
            { id: 1, nombre: "Acta_investigacion.pdf", url: "#", tamaño: "245 KB" },
            { id: 2, nombre: "Medidas_correctivas.docx", url: "#", tamaño: "128 KB" }
          ],
          diasApelacion: 15,
          fechaLimiteApelacion: "2025-04-14T23:59:59"
        };

        setTimeout(() => {
          setResponse(responseEstatica);
          setLoadingResponse(false);
        }, 800);

        // CÓDIGO REAL COMENTADO - Descomentar cuando tengas el backend
        /*
        const responseData = await ResponseService.obtenerRespuesta(complaintId);
        setResponse(responseData);
        setLoadingResponse(false);
        */
      } catch (error) {
        console.error("Error al cargar la respuesta:", error);
        setResponse(null);
        setLoadingResponse(false);
      }
    };

    fetchComplaintData();
  }, [location, navigate]);

  const calcularDiasRestantes = (fechaLimite) => {
    if (!fechaLimite) return 0;
    
    const ahora = new Date();
    const limite = new Date(fechaLimite);
    const diferencia = limite.getTime() - ahora.getTime();
    const diasRestantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diasRestantes);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
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

  const estadoActualNombre = complaint.estado?.nombre || complaint.estadoNombre;
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

              {response.documentosSoporte && response.documentosSoporte.length > 0 && (
                <div style={styles.documentsSection}>
                  <h4 style={styles.documentsTitle}>
                    Documentos de Soporte ({response.documentosSoporte.length})
                  </h4>
                  <div style={styles.documentsList}>
                      {response.documentosSoporte.map((doc) => (
                        <a
                          key={doc.id}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.documentLink}
                        >
                          <FiFileText style={styles.documentIcon} />
                          <div style={styles.documentInfo}>
                            <span style={styles.documentName}>{doc.nombre}</span>
                            <span style={styles.documentSize}>{doc.tamaño}</span>
                          </div>
                        </a>
                      ))}
                  </div>
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
                ) : (
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
  documentLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    textDecoration: "none",
    transition: "background-color 0.2s"
  },
  documentIcon: {
    fontSize: "1.25rem"
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
    color: "#000000",
    fontSize: "0.8rem"
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

export default ComplaintResponse;