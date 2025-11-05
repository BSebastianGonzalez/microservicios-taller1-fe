import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ComplaintService from "../../../services/ComplaintService";
import StateChangeService from "../../../services/StateChangeService";
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

  // Modal de archivo
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showArchiveSuccess, setShowArchiveSuccess] = useState(false);

  // Departamentos para asignar
  const [departamentos, setDepartamentos] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [assigningDept, setAssigningDept] = useState(false);
  const [assignDeptSuccess, setAssignDeptSuccess] = useState(false);

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
        // DATOS ESTÁTICOS PARA VISUALIZACIÓN
        const datosEstaticosComplaint = {
          id: complaintId || 1,
          titulo: "Acoso y hostigamiento dentro del campus",
          descripcion: "Se han presentado situaciones de acoso verbal y físico por parte de un profesor hacia varios estudiantes dentro de la facultad. A pesar de haber reportado el comportamiento de manera informal, no se han tomado medidas. Se requiere una investigación para garantizar un ambiente seguro y libre de hostigamiento.",
          fechaCreacion: "2025-03-25T10:30:00",
          estado: { 
            id: 2, 
            nombre: "En revisión",
            siguientes: [3, 4, 5]
          },
          departamento: { id: 1, nombre: "Decanatura de Ciencias" },
          categorias: [
            { id: 1, nombre: "Acoso verbal" },
            { id: 2, nombre: "Acoso físico" }
          ],
          anonima: true,
          codigoSeguimiento: "ABC123XYZ"
        };

        const archivosEstaticos = [
          { 
            id: 1, 
            nombreArchivo: "evidencia_1.pdf", 
            urlArchivo: "#", 
            tipo: "application/pdf", 
            tamaño: "245 KB" 
          },
          { 
            id: 2, 
            nombreArchivo: "testimonio_estudiante.docx", 
            urlArchivo: "#", 
            tipo: "application/docx", 
            tamaño: "128 KB" 
          }
        ];

        const cambiosEstadoEstaticos = [
          {
            id: 1,
            fechaCambio: "2025-03-25T10:30:00",
            estadoAnterior: { id: 1, nombre: "Recibida" },
            estadoNuevo: { id: 2, nombre: "En revisión" },
            administrador: { nombre: "Admin Sistema" },
            justificacion: "Denuncia recibida y asignada para revisión inicial"
          }
        ];

        const departamentosEstaticos = [
          { id: 1, nombre: "Decanatura de Ciencias" },
          { id: 2, nombre: "Decanatura de Ingeniería" },
          { id: 3, nombre: "Decanatura de Humanidades" },
          { id: 4, nombre: "Oficina de Derechos Humanos" }
        ];

        const estadosSiguientesEstaticos = [
          { id: 3, nombre: "En investigación" },
          { id: 4, nombre: "Requiere más información" },
          { id: 5, nombre: "Archivada" }
        ];

        // Simular delay de carga
        setTimeout(() => {
          setComplaint(datosEstaticosComplaint);
          setFiles(archivosEstaticos);
          setStateChanges(cambiosEstadoEstaticos);
          setNextStates(estadosSiguientesEstaticos);
          setDepartamentos(departamentosEstaticos);
          setLoading(false);
        }, 800);

      } catch (error) {
        console.error("Error al obtener la denuncia:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [complaintId, navigate]);

  useEffect(() => {
    const fetchResponse = async () => {
      if (!complaintId) return;
      setLoadingResponse(true);
      
      const mostrarConRespuesta = false;
      
      let responseEstatica = null;
      
      if (mostrarConRespuesta) {
        responseEstatica = {
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
      }

      setTimeout(() => {
        setResponse(responseEstatica);
        setLoadingResponse(false);
      }, 600);
    };
    fetchResponse();
  }, [complaintId]);

  useEffect(() => {
    if (location.state?.responseRegistered) {
      setShowResponseSuccess(true);
      setTimeout(() => setShowResponseSuccess(false), 3000);
      
      const responseEstatica = {
        id: 1,
        fechaRespuesta: new Date().toISOString(),
        administrador: "Administrador Actual",
        detalleRespuesta: "Respuesta registrada exitosamente - " + new Date().toLocaleString(),
        documentosSoporte: [],
        diasApelacion: 15,
        fechaLimiteApelacion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      setResponse(responseEstatica);
      
      const newState = { ...location.state };
      delete newState.responseRegistered;
      navigate(location.pathname, { replace: true, state: newState });
    }
  }, [location, navigate]);

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
      const nuevoEstado = nextStates.find(estado => estado.id === Number(selectedState));
      
      setTimeout(() => {
        setComplaint(prev => ({
          ...prev,
          estado: nuevoEstado
        }));
        
        const nuevoCambio = {
          id: Date.now(),
          fechaCambio: new Date().toISOString(),
          estadoAnterior: complaint.estado,
          estadoNuevo: nuevoEstado,
          administrador: { nombre: "Admin Actual" },
          justificacion: justification
        };
        
        setStateChanges(prev => [nuevoCambio, ...prev]);
        
        setShowModal(false);
        setSubmitting(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }, 1000);
      
    } catch (error) {
      alert("Error al cambiar el estado. Intenta nuevamente.");
      setSubmitting(false);
    }
  };

  const handleAssignDepartamento = async (e) => {
    e.preventDefault();
    if (!selectedDepartamento) return;
    setAssigningDept(true);
    
    try {
      const deptoSeleccionado = departamentos.find(dept => dept.id === Number(selectedDepartamento));
      
      setTimeout(() => {
        setComplaint(prev => ({
          ...prev,
          departamento: deptoSeleccionado
        }));
        
        setAssignDeptSuccess(true);
        setTimeout(() => setAssignDeptSuccess(false), 2000);
      }, 800);
      
    } catch (error) {
      alert("Error al asignar el departamento.");
    } finally {
      setAssigningDept(false);
    }
  };

  const handleRegisterResponse = () => {
    navigate("/response_registration", {
      state: { complaintId: complaintId || 1 }
    });
  };

  if (loading) return <ComplaintLoader />;

  if (!complaint) return <ComplaintNotFound />;

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div style={styles.leftColumn}>
          <ComplaintMainInfo
            complaint={complaint}
            departamentos={departamentos}
            selectedDepartamento={selectedDepartamento}
            assigningDept={assigningDept}
            onDepartamentoChange={setSelectedDepartamento}
            onRemitir={handleAssignDepartamento}
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
            categorias={complaint.categorias}
            files={files}
            estado={complaint.estado}
            onChangeState={handleOpenModal}
            onShowHistory={() => setShowHistory(true)}
            onArchive={() => setShowArchiveModal(true)}
            stateChanges={stateChanges}
          />
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
      <SuccessAlert
        show={assignDeptSuccess}
        message="¡Departamento asignado correctamente!"
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