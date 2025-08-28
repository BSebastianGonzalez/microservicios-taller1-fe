import React from "react";

const StateChangeHistory = ({ show, onClose, changes }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative animate-slide-up">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          Historial de cambios de estado
        </h2>
        <div className="flex flex-col gap-6">
          {changes.map((cambio, idx) => (
            <div
              key={cambio.id || idx}
              className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <span className="font-semibold text-red-800">
                  Administrador:{" "}
                  <span className="font-normal text-black">
                    {cambio.admin?.nombre || "Desconocido"}
                  </span>
                </span>
                <span className="text-gray-600 text-sm">
                  {cambio.fechaCambio
                    ? new Date(cambio.fechaCambio).toLocaleString()
                    : ""}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-red-800">
                  Estado anterior:
                </span>{" "}
                <span className="text-black">
                  {cambio.estadoAnterior?.nombre || "N/A"}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-red-800">
                  Estado nuevo:
                </span>{" "}
                <span className="text-black">
                  {cambio.estado?.nombre || "N/A"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-red-800">
                  Justificación:
                </span>
                <div className="bg-white border border-purple-100 rounded p-2 mt-1 text-black break-words">
                  {cambio.justificacion}
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default StateChangeHistory;