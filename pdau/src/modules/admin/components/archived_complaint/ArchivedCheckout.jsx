import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ComplaintService from "../../../../services/ComplaintService";
import ComplaintLoader from "../standard_complaint/ComplaintLoader";
import ComplaintNotFound from "../standard_complaint/ComplaintNotFound";
import CommentSection from "../standard_complaint/CommentSection";
import SuccessAlert from "../standard_complaint/SuccessAlert";
import ArchivedInfo from "./ArchivedInfo";
import AditionalInfo from "./AditionalInfo";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md transition-all duration-300
          translate-y-12 opacity-0
          animate-modal-slide-up"
        style={{ animationFillMode: "forwards" }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Desarchivar denuncia
        </h2>
        <form onSubmit={onSubmit}>
          <label className="block mb-2 font-semibold">
            Justificación para desarchivar
          </label>
          <textarea
            className="w-full border rounded px-3 py-2 mb-4"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={4}
            required
            placeholder="Explica por qué se desarchiva la denuncia..."
            disabled={submitting}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={submitting || !justification.trim()}
            >
              {submitting ? "Desarchivando..." : "Desarchivar"}
            </button>
          </div>
        </form>
        {/* Animación CSS */}
        <style>
          {`
            @keyframes modal-slide-up {
              0% {
                transform: translateY(80px);
                opacity: 0;
              }
              100% {
                transform: translateY(0);
                opacity: 1;
              }
            }
            .animate-modal-slide-up {
              animation: modal-slide-up 0.3s cubic-bezier(.4,0,.2,1);
            }
          `}
        </style>
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
  const [showUnarchiveSuccess, setShowUnarchiveSuccess] = useState(false);

  // Modal de desarchivar
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [unarchiveJustification, setUnarchiveJustification] = useState("");
  const [submittingUnarchive, setSubmittingUnarchive] = useState(false);

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
          navigate("/admin");
          return;
        }
        const data = await ComplaintService.getComplaintById(complaintId);
        setComplaint(data);

        const archivos = await ComplaintService.getFilesByComplaintId(
          complaintId
        );
        setFiles(archivos);
      } catch (error) {
        console.error("Error al obtener la denuncia:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [complaintId, navigate]);

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

  // Solo permite desarchivar (con justificación)
  const handleUnarchive = async (e) => {
    e.preventDefault();
    if (!unarchiveJustification.trim()) return;
    setSubmittingUnarchive(true);
    try {
      await ComplaintService.toggleArchivedStatus(complaintId, {
        idAdmin: adminId,
        justification: unarchiveJustification,
      });
      setShowUnarchiveModal(false);
      setShowUnarchiveSuccess(true);
      setTimeout(() => {
        setShowUnarchiveSuccess(false);
        navigate("/archived_complaints");
      }, 1500);
    } catch (error) {
      alert("Error al desarchivar la denuncia.");
    } finally {
      setSubmittingUnarchive(false);
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
          maxHeight: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
      >
        <ArchivedInfo complaint={complaint} />

        {/* Sección de comentarios solo lectura */}
        <div className="mt-8 px-2 pb-4">
          <CommentSection
            complaintId={complaintId}
            adminId={adminId}
            readOnly={true}
          />
        </div>
      </div>
      {/* Sidebar con info adicional y botón desarchivar */}
      <AditionalInfo
        categorias={complaint.categorias}
        files={files}
        estado={complaint.estado}
        onArchive={handleOpenUnarchiveModal}
      />
      {/* Modal para desarchivar */}
      <UnarchiveModal
        show={showUnarchiveModal}
        onClose={handleCloseUnarchiveModal}
        onSubmit={handleUnarchive}
        justification={unarchiveJustification}
        setJustification={setUnarchiveJustification}
        submitting={submittingUnarchive}
      />
      {/* Alertas */}
      <SuccessAlert
        show={showUnarchiveSuccess}
        message="¡Denuncia desarchivada con éxito!"
      />
    </div>
  );
};

export default ArchivedCheckout;