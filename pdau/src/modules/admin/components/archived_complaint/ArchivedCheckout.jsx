import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ComplaintService from "../../../../services/ComplaintService";
import FileComplaintService from "../../../../services/FileComplaintService";
import ComplaintLoader from "../standard_complaint/ComplaintLoader";
import ComplaintNotFound from "../standard_complaint/ComplaintNotFound";
import CommentSection from "../standard_complaint/CommentSection";
import SuccessAlert from "../standard_complaint/SuccessAlert";
import ArchivedInfo from "./ArchivedInfo";
import ArchivedSidebarActions from "./ArchivedSidebarActions";
import ResponseViewer from "../standard_complaint/ResponseViewer";
import ResponseService from "../../../../services/ResponseService";
import ArchivingHistory from "./ArchivingHistory";

// Modal para desarchivar
const UnarchiveModal = ({
  show,
  onClose,
  onSubmit,
  justification,
  setJustification,
  submitting,
}) => {
  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button
          style={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 style={styles.title}>Desarchivar denuncia</h2>
        <form onSubmit={onSubmit}>
          <label style={styles.modalLabel}>
            Justificación para desarchivar
          </label>
          <textarea
            style={styles.modalTextarea}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={4}
            required
            placeholder="Explica por qué se desarchiva la denuncia..."
            disabled={submitting}
          />
          <div style={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.btnCancel}
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={styles.btnConfirm}
              disabled={submitting || !justification.trim()}
            >
              {submitting ? "Desarchivando..." : "Desarchivar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ArchivedCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [archivingHistory, setArchivingHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Success alert state
  const [showUnarchiveSuccess, setShowUnarchiveSuccess] = useState(false);

  // Modal de desarchivar
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [unarchiveJustification, setUnarchiveJustification] = useState("");
  const [submittingUnarchive, setSubmittingUnarchive] = useState(false);

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

        // Obtener datos de la denuncia archivada
        const [complaintData, filesData, historyData] = await Promise.all([
          FileComplaintService.getArchivedComplaintById(complaintId),
          ComplaintService.getFilesByComplaintId(complaintId),
          FileComplaintService.getArchivingHistory(complaintId)
        ]);

        console.log("Datos de denuncia archivada recibidos:", complaintData);
        console.log("Archivos recibidos:", filesData);
        console.log("Historial de archivamiento:", historyData);

        const processedComplaint = complaintData.data || complaintData;
        const processedFiles = Array.isArray(filesData) ? filesData : filesData.data || [];
        const processedHistory = Array.isArray(historyData) ? historyData : [];

        setComplaint(processedComplaint);
        setFiles(processedFiles);
        setArchivingHistory(processedHistory);
        setError(null);

      } catch (error) {
        console.error("Error al obtener la denuncia archivada:", error);
        setError("Error al cargar la denuncia. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [complaintId, navigate]);

  useEffect(() => {
    const fetchResponse = async () => {
      if (!complaintId) return;
      
      setLoadingResponse(true);
      try {
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

  // Abre el modal de desarchivar
  const handleOpenUnarchiveModal = () => {
    setUnarchiveJustification("");
    setShowUnarchiveModal(true);
  };

  // Cierra el modal de desarchivar
  const handleCloseUnarchiveModal = () => {
    setShowUnarchiveModal(false);
    setUnarchiveJustification("");
  };

  // Desarchivar denuncia
  const handleUnarchive = async (e) => {
    e.preventDefault();
    if (!unarchiveJustification.trim()) return;
    
    setSubmittingUnarchive(true);
    try {
      console.log('🔓 Desarchivando denuncia:', complaintId);
      await FileComplaintService.unarchiveComplaint(
        complaintId, 
        unarchiveJustification,
        adminId
      );
      
      setShowUnarchiveModal(false);
      setShowUnarchiveSuccess(true);
      
      setTimeout(() => {
        setShowUnarchiveSuccess(false);
        navigate("/read_complaint");
      }, 1500);
    } catch (error) {
      console.error('❌ Error al desarchivar:', error);
      alert("Error al desarchivar la denuncia: " + (error.message || "Error desconocido"));
    } finally {
      setSubmittingUnarchive(false);
    }
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

          <ArchivedInfo 
          complaint={complaint} 
          archivingHistory={archivingHistory}
        />

          {!loadingResponse && (
            <ResponseViewer response={response} />
          )}

          <div style={styles.commentsSection}>
            <CommentSection 
              complaintId={complaintId} 
              adminId={adminId} 
              readOnly={true}
            />
          </div>
        </div>

        <div style={styles.rightColumn}>
          <ArchivedSidebarActions
            categorias={complaint.categorias || []}
            files={files}
            estado={complaint.estado}
            onUnarchive={handleOpenUnarchiveModal}
            onShowHistory={() => setShowHistory(true)}
            complaint={complaint}
            archivingHistory={archivingHistory}
          />
        </div>
      </div>

      <UnarchiveModal
        show={showUnarchiveModal}
        onClose={handleCloseUnarchiveModal}
        onSubmit={handleUnarchive}
        justification={unarchiveJustification}
        setJustification={setUnarchiveJustification}
        submitting={submittingUnarchive}
      />

      {/* Modal de Historial Completo */}
      <ArchivingHistory
        show={showHistory}
        onClose={() => setShowHistory(false)}
        history={archivingHistory}
        complaint={complaint}
        isCurrentlyArchived={complaint?.archivada === false} 
      />

      <SuccessAlert
        show={showUnarchiveSuccess}
        message="¡Denuncia desarchivada con éxito!"
      />
    </div>
  );
};

// Usa los mismos estilos que ComplaintData
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
  commentsSection: {
    marginTop: "-1.5rem",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1400,
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: "0.5rem",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    padding: "2rem",
    width: "100%",
    maxWidth: "500px",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    color: "#6b7280",
    fontSize: "1.5rem",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#dc2626",
  },
  modalLabel: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#374151",
  },
  modalTextarea: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    padding: "0.75rem",
    marginBottom: "1.5rem",
    fontSize: "1rem",
    fontFamily: "inherit",
    resize: "vertical",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
  },
  btnCancel: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontWeight: "600",
  },
  btnConfirm: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default ArchivedCheckout;