import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ComplaintService from "../../../services/ComplaintService";
import StateChangeService from "../../../services/StateChangeService";
import FileComplaintService from "../../../services/FileComplaintService";
import ArchivingHistory from "../components/archived_complaint/ArchivingHistory";
import ResponseService from "../../../services/ResponseService";
import ChangeStateModal from "../components/standard_complaint/ChangeStateModal";
import StateChangeHistory from "../components/standard_complaint/StateChangeHistory";
import FileComplaintModal from "../components/standard_complaint/FileComplaint";
import ComplaintMainInfo from "../components/standard_complaint/ComplaintMainInfo";
import ComplaintSidebarActions from "../components/standard_complaint/ComplaintSidebarActions";
import SuccessAlert from "../components/standard_complaint/SuccessAlert";
import ComplaintLoader from "../components/standard_complaint/ComplaintLoader";
import ComplaintNotFound from "../components/standard_complaint/ComplaintNotFound";
import CommentSection from "../components/standard_complaint/CommentSection";
import ResponseViewer from "../components/standard_complaint/ResponseViewer";
import Button from "../../../components/Button";

const ComplaintData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [nextStates, setNextStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [justification, setJustification] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Success alert state
  const [showSuccess, setShowSuccess] = useState(false);
  const [showResponseSuccess, setShowResponseSuccess] = useState(false);

  // Cambios de estado
  const [stateChanges, setStateChanges] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [archivingHistory, setArchivingHistory] = useState([]);
  const [showArchiveHistory, setShowArchiveHistory] = useState(false);

  // Modal de archivo
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showArchiveSuccess, setShowArchiveSuccess] = useState(false);

  const complaintId =
    location.state?.complaintId ||
    new URLSearchParams(window.location.search).get("complaintId");

  const adminId = (() => {
    try {
      const admin = JSON.parse(localStorage.getItem("admin"));
      return admin?.id || null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!complaintId) {
          throw new Error("No se proporcionó un ID de denuncia");
        }

        // Obtener datos reales del backend
        const [complaintData, filesData, estadosData] = await Promise.all([
          ComplaintService.getComplaintById(complaintId),
          ComplaintService.getFilesByComplaintId(complaintId),
          ComplaintService.getEstados ? ComplaintService.getEstados() : []
        ]);

        console.log("Datos de denuncia recibidos:", complaintData);
        console.log("Archivos recibidos:", filesData);
        console.log("Estados recibidos:", estadosData);

        // Procesar datos para asegurar estructura consistente
        const processedComplaint = complaintData.data || complaintData;
        const processedFiles = Array.isArray(filesData) ? filesData : filesData.data || [];
        const processedEstados = Array.isArray(estadosData) ? estadosData : estadosData.data || [];

        setComplaint(processedComplaint);
        setFiles(processedFiles);

        // Obtener cambios de estado si el servicio está disponible
        if (StateChangeService && StateChangeService.getStateChanges) {
          try {
            const changesData = await StateChangeService.getStateChanges(complaintId);
            const processedChanges = Array.isArray(changesData) ? changesData : changesData.data || [];
            setStateChanges(processedChanges);
          } catch (err) {
            console.warn("No se pudieron cargar los cambios de estado:", err);
          }
        }

        // Determinar estados siguientes basados en el estado actual
        if (processedComplaint.estado && processedEstados.length > 0) {
          const currentStateId = processedComplaint.estado.id;
          // Aquí deberías implementar la lógica para determinar qué estados son siguientes
          // Por ahora, mostramos todos los estados excepto el actual
          const availableNextStates = processedEstados.filter(estado => estado.id !== currentStateId);
          setNextStates(availableNextStates);
        }

      } catch (error) {
        console.error("Error al obtener la denuncia:", error);
        setError("Error al cargar la denuncia. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
      // Cargar historial de archivamiento (si existe el servicio)
      try {
        if (FileComplaintService && FileComplaintService.getArchivingHistory) {
          const historyData = await FileComplaintService.getArchivingHistory(complaintId);
          // getArchivingHistory puede devolver array o objeto; normalizar
          const processedHistory = Array.isArray(historyData) ? historyData : historyData?.data || [];
          setArchivingHistory(processedHistory);
        }
      } catch (err) {
        console.warn("No se pudo cargar historial de archivamiento:", err);
        setArchivingHistory([]);
      }
    };
    fetchData();
  }, [complaintId, navigate]);

  useEffect(() => {
    const fetchResponse = async () => {
      if (!complaintId) return;
      
      setLoadingResponse(true);
      try {
        // Obtener respuesta real del backend
        const responseData = await ResponseService.obtenerRespuesta(complaintId);
        
        if (responseData) {
          console.log("Respuesta recibida:", responseData);
          setResponse(responseData.data || responseData);
        } else {
          setResponse(null);
        }
      } catch (error) {
        console.warn("No se pudo cargar la respuesta:", error);
        setResponse(null);
      } finally {
        setLoadingResponse(false);
      }
    };
    fetchResponse();
  }, [complaintId]);

  useEffect(() => {
    if (location.state?.responseRegistered) {
      setShowResponseSuccess(true);
      setTimeout(() => setShowResponseSuccess(false), 3000);
      
      // Recargar la respuesta después de registrar una nueva
      const fetchUpdatedResponse = async () => {
        try {
          const responseData = await ResponseService.obtenerRespuesta(complaintId);
          if (responseData) {
            setResponse(responseData.data || responseData);
          }
        } catch (error) {
          console.warn("Error al cargar la respuesta actualizada:", error);
        }
      };
      fetchUpdatedResponse();
      
      // Limpiar el estado de navegación
      const newState = { ...location.state };
      delete newState.responseRegistered;
      navigate(location.pathname, { replace: true, state: newState });
    }
  }, [location, navigate, complaintId]);

  const handleOpenModal = () => {
    setSelectedState("");
    setJustification("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedState("");
    setJustification("");
  };

  const handleSubmitStateChange = async (e) => {
    e.preventDefault();
    if (!selectedState || !justification.trim()) return;
    
    setSubmitting(true);
    try {
      // Llamada real al backend para cambiar estado
      await ComplaintService.updateComplaintStatus(complaintId, parseInt(selectedState));
      
      // Actualizar el estado local
      const nuevoEstado = nextStates.find(estado => estado.id === Number(selectedState));
      setComplaint(prev => ({
        ...prev,
        estado: nuevoEstado
      }));
      
      // Agregar el cambio al historial local
      const nuevoCambio = {
        id: Date.now(),
        fechaCambio: new Date().toISOString(),
        estadoAnterior: complaint.estado,
        estadoNuevo: nuevoEstado,
        administrador: { nombre: "Admin Actual" }, // Esto debería venir del backend
        justificacion: justification
      };
      
      setStateChanges(prev => [nuevoCambio, ...prev]);
      
      setShowModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      alert("Error al cambiar el estado. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterResponse = () => {
    navigate("/response_registration", {
      state: { complaintId: complaintId }
    });
  };

  if (loading) return <ComplaintLoader />;

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorText}>{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          style={styles.retryButton}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!complaint) return <ComplaintNotFound />;

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.leftColumn}>
          <ComplaintMainInfo
            complaint={complaint}
          />

          {!loadingResponse && (
            <>
              <ResponseViewer response={response} />
              
              {!response && complaint.estado?.nombre !== "Archivada" && (
                <div style={styles.registerResponseSection}>
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>Registro de Respuesta Formal</h3>
                    <p style={styles.sectionDescription}>
                      Documente la respuesta oficial a esta denuncia. Una vez registrada, 
                      el estado cambiará automáticamente a "Respondida" y se establecerá 
                      un plazo para apelación o reposición.
                    </p>
                  </div>
                  <div style={styles.buttonContainer}>
                    <Button
                      text="📝 Registrar Respuesta Formal"
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200"
                      onClick={handleRegisterResponse}
                    />
                  </div>
                  <div style={styles.responseFeatures}>
                    <div style={styles.featureItem}>
                      <span style={styles.featureIcon}>✅</span>
                      <span>Actualización automática del estado a "Respondida"</span>
                    </div>
                    <div style={styles.featureItem}>
                      <span style={styles.featureIcon}>📅</span>
                      <span>Registro de fecha para indicadores de gestión</span>
                    </div>
                    <div style={styles.featureItem}>
                      <span style={styles.featureIcon}>⚖️</span>
                      <span>Establecimiento de plazo para apelación/reposición</span>
                    </div>
                  </div>
                </div>
              )}

              {response && (
                <div style={styles.responseRegisteredInfo}>
                  <div style={styles.infoHeader}>
                    <h3 style={styles.infoTitle}>Respuesta Registrada</h3>
                    <span style={styles.successBadge}>Completado</span>
                  </div>
                  <p style={styles.infoText}>
                    Esta denuncia ya cuenta con una respuesta formal registrada. 
                    El estado ha sido actualizado automáticamente y se ha establecido 
                    el plazo para apelación.
                  </p>
                </div>
              )}
            </>
          )}

          <div style={styles.commentsSection}>
            <CommentSection complaintId={complaintId} adminId={adminId} />
          </div>
        </div>

        <div style={styles.rightColumn}>
          <ComplaintSidebarActions
            categorias={complaint.categorias || []}
            files={files}
            estado={complaint.estado}
            onChangeState={handleOpenModal}
            onShowHistory={() => setShowHistory(true)}
            onArchive={() => setShowArchiveModal(true)}
            stateChanges={stateChanges}
          />
          {archivingHistory.length > 0 && (
            <div style={{ marginTop: "0.5rem" }}>
              <Button
                text={`Historial de archivamiento (${archivingHistory.length})`}
                className="bg-gray-200 hover:bg-gray-300 text-black"
                onClick={() => setShowArchiveHistory(true)}
              />
            </div>
          )}
        </div>
      </div>

      <ChangeStateModal
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitStateChange}
        nextStates={nextStates}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        justification={justification}
        setJustification={setJustification}
        submitting={submitting}
      />
      <StateChangeHistory
        show={showHistory}
        onClose={() => setShowHistory(false)}
        changes={stateChanges}
      />
      <FileComplaintModal
        show={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        complaintId={complaintId}
        adminId={adminId}
        onSuccess={() => {
          setShowArchiveModal(false);
          setShowArchiveSuccess(true);
          setTimeout(() => {
            setShowArchiveSuccess(false);
            navigate("/read_complaint");
          }, 2000);
        }}
      />

      <SuccessAlert
        show={showSuccess}
        message="¡Estado de la denuncia cambiado correctamente!"
      />
      <SuccessAlert
        show={showArchiveSuccess}
        message="Denuncia archivada con éxito"
      />
      <ArchivingHistory
        show={showArchiveHistory}
        onClose={() => setShowArchiveHistory(false)}
        history={archivingHistory}
        complaint={complaint}
      />
      <SuccessAlert
        show={showResponseSuccess}
        message="¡Respuesta registrada exitosamente!"
      />
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    padding: "0",
    margin: "0",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },
  mainContent: {
    display: "flex",
    minHeight: "100vh",
    gap: "1.5rem",
    padding: "1.25rem",
    boxSizing: "border-box",
  },
  leftColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    overflowY: "auto",
    minWidth: 0,
  },
  rightColumn: {
    width: "320px",
    minWidth: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    gap: "1rem",
    padding: "2rem",
  },
  errorText: {
    fontSize: "1.1rem",
    color: "#dc2626",
    textAlign: "center",
  },
  retryButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  // ... (mantén el resto de los estilos igual)
  registerResponseSection: {
    backgroundColor: "#f0f9ff",
    border: "2px solid #bae6fd",
    borderRadius: "12px",
    padding: "1.5rem",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },
  sectionHeader: {
    marginBottom: "1rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#0369a1",
    margin: "0 0 0.5rem 0",
  },
  sectionDescription: {
    fontSize: "0.9rem",
    color: "#0c4a6e",
    margin: "0",
    lineHeight: "1.5",
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  buttonContainer: {
    margin: "1rem 0",
  },
  responseFeatures: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginTop: "1rem",
    padding: "0.75rem",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: "6px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.85rem",
    color: "#0c4a6e",
  },
  featureIcon: {
    fontSize: "1rem",
  },
  responseRegisteredInfo: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "1rem",
  },
  infoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  infoTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#166534",
    margin: 0,
  },
  successBadge: {
    padding: "2px 8px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  infoText: {
    fontSize: "0.85rem",
    color: "#166534",
    margin: 0,
    lineHeight: "1.4",
  },
  commentsSection: {
    marginTop: "1rem",
  },
};

export default ComplaintData;