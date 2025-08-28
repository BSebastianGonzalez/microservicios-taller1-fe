import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ComplaintService from "../../../services/ComplaintService";
import StateChangeService from "../../../services/StateChangeService";
import ChangeStateModal from "../components/standard_complaint/ChangeStateModal";
import StateChangeHistory from "../components/standard_complaint/StateChangeHistory"; // Importa el nuevo componente
import FileComplaintModal from "../components/standard_complaint/FileComplaint";
import ComplaintMainInfo from "../components/standard_complaint/ComplaintMainInfo";
import ComplaintSidebarActions from "../components/standard_complaint/ComplaintSidebarActions";
import SuccessAlert from "../components/standard_complaint/SuccessAlert";
import ComplaintLoader from "../components/standard_complaint/ComplaintLoader";
import ComplaintNotFound from "../components/standard_complaint/ComplaintNotFound";
import CommentSection from "../components/standard_complaint/CommentSection";

const ComplaintData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [nextStates, setNextStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [justification, setJustification] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Success alert state
  const [showSuccess, setShowSuccess] = useState(false);

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

  // Obtén el ID de la denuncia desde el estado de navegación o query param
  const complaintId =
    location.state?.complaintId ||
    new URLSearchParams(window.location.search).get("complaintId");

  // Obtén el idAdministrador desde el objeto guardado en localStorage al iniciar sesión
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
        if (!complaintId) {
          navigate("/admin"); // Redirige si no hay ID
          return;
        }
        const data = await ComplaintService.getComplaintById(complaintId);
        setComplaint(data);

        const archivos = await ComplaintService.getFilesByComplaintId(
          complaintId
        );
        setFiles(archivos);

        // Obtener los estados siguientes del estado actual
        if (data.estado?.siguientes?.length > 0) {
          const promises = data.estado.siguientes.map((id) =>
            ComplaintService.getEstadoById(id)
          );
          const estados = await Promise.all(promises);
          setNextStates(estados);
        } else {
          setNextStates([]);
        }

        // Obtener historial de cambios de estado
        const cambios = await StateChangeService.getCambiosEstadoByDenunciaId(
          complaintId
        );
        setStateChanges(Array.isArray(cambios) ? cambios : []);
      } catch (error) {
        console.error("Error al obtener la denuncia:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [complaintId, navigate]);

  // Efecto para obtener departamentos
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const data = await ComplaintService.getAllDepartamentos();
        setDepartamentos(data);
      } catch (error) {
        console.error("Error al obtener departamentos:", error);
      }
    };
    fetchDepartamentos();
  }, []);

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
      await StateChangeService.registrarCambioEstado({
        idDenuncia: complaintId,
        idAdministrador: adminId,
        idEstado: Number(selectedState),
        justificacion: justification,
      });
      // Recargar datos
      setShowModal(false);
      setSubmitting(false);
      setLoading(false);
      // Recarga la denuncia para mostrar el nuevo estado
      const data = await ComplaintService.getComplaintById(complaintId);
      setComplaint(data);
      // Actualiza los estados siguientes
      if (data.estado?.siguientes?.length > 0) {
        const promises = data.estado.siguientes.map((id) =>
          ComplaintService.getEstadoById(id)
        );
        const estados = await Promise.all(promises);
        setNextStates(estados);
      } else {
        setNextStates([]);
      }
      // Recarga historial de cambios de estado
      const cambios = await StateChangeService.getCambiosEstadoByDenunciaId(
        complaintId
      );
      setStateChanges(Array.isArray(cambios) ? cambios : []);
      // Mostrar cartel de éxito animado
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      alert("Error al cambiar el estado. Intenta nuevamente.");
      setSubmitting(false);
    }
  };

  // Función para asignar departamento
  const handleAssignDepartamento = async (e) => {
    e.preventDefault();
    if (!selectedDepartamento) return;
    setAssigningDept(true);
    try {
      await ComplaintService.assignComplaintToDepartment(
        complaintId,
        selectedDepartamento
      );
      // Recargar la denuncia para actualizar el departamento actual
      const data = await ComplaintService.getComplaintById(complaintId);
      setComplaint(data);
      setAssignDeptSuccess(true);
      setTimeout(() => setAssignDeptSuccess(false), 2000);
    } catch (error) {
      alert("Error al asignar el departamento.");
    } finally {
      setAssigningDept(false);
    }
  };

  if (loading) return <ComplaintLoader />;

  if (!complaint) return <ComplaintNotFound />;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-5 bg-gray-100 min-h-screen">
      {/* Contenedor scrollable solo para la sección principal */}
      <div
        className="flex-1 flex flex-col"
        style={{
          maxHeight: "calc(100vh - 64px)", // Ajusta 64px si tienes header, si no puedes poner 100vh
          overflowY: "auto",
        }}
      >

        <ComplaintMainInfo
          complaint={complaint}
          departamentos={departamentos}
          selectedDepartamento={selectedDepartamento}
          assigningDept={assigningDept}
          onDepartamentoChange={setSelectedDepartamento}
          onRemitir={handleAssignDepartamento}
        />
        
        {/* Sección de comentarios como footer */}
        <div className="mt-8 px-2 pb-4">
          <CommentSection complaintId={complaintId} adminId={adminId} />
        </div>
      </div>
      <ComplaintSidebarActions
        categorias={complaint.categorias}
        files={files}
        estado={complaint.estado}
        onChangeState={handleOpenModal}
        onShowHistory={() => setShowHistory(true)}
        onArchive={() => setShowArchiveModal(true)}
        stateChanges={stateChanges}
      />
      {/* Modals */}
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
      {/* Alerts */}
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
    </div>
  );
};

export default ComplaintData;
