import React, { useState } from "react";
import FileComplaintService from "../../../../services/FileComplaintService";
import Button from "../../../../components/Button";

const FileComplaintModal = ({
  show,
  onClose,
  complaintId,
  adminId,
  onSuccess,
}) => {
  const [justification, setJustification] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!justification.trim()) {
      setError("La justificación es obligatoria.");
      return;
    }
    setSubmitting(true);
    try {
      await FileComplaintService.registrarArchivarDenuncia({
        idDenuncia: complaintId,
        idAdministrador: adminId,
        archivar: true,
        justificacion: justification,
      });
      setJustification("");
      setSubmitting(false);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError("Ocurrió un error al archivar la denuncia.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative animate-slide-up">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
          disabled={submitting}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Archivar denuncia
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Justificación para archivar
            </label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              required
              rows={3}
              disabled={submitting}
              placeholder="Explica la razón para archivar la denuncia"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm font-semibold">{error}</div>
          )}
          <Button
            text={submitting ? "Archivando..." : "Archivar denuncia"}
            className="bg-red-600 hover:bg-red-700 text-white w-full py-3 text-lg rounded-lg mt-2"
            type="submit"
            disabled={submitting}
          />
        </form>
      </div>
      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(100px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-slide-up {
            animation: slideUp 0.4s cubic-bezier(0.4,0,0.2,1);
          }
        `}
      </style>
    </div>
  );
};

export default FileComplaintModal;