import React from "react";
import Button from "../../../../components/Button";

const ChangeStateModal = ({
  show,
  onClose,
  onSubmit,
  nextStates,
  selectedState,
  setSelectedState,
  justification,
  setJustification,
  submitting,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative animate-slide-up"
        style={{
          animation: "slideUp 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
          disabled={submitting}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Cambiar estado de la denuncia
        </h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Selecciona el nuevo estado
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              required
              disabled={submitting}
            >
              <option value="">Selecciona un estado...</option>
              {nextStates.map((estado) => (
                <option key={estado.id} value={estado.id}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Justificación del cambio
            </label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              required
              rows={3}
              disabled={submitting}
              placeholder="Explica la razón del cambio de estado"
            />
          </div>
          <Button
            text={submitting ? "Enviando..." : "Confirmar cambio"}
            className="bg-red-500 hover:bg-red-800 text-white w-full py-3 text-lg rounded-lg mt-2"
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

export default ChangeStateModal;