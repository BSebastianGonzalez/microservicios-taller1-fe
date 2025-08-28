import React from "react";
import { useNavigate } from "react-router-dom";

const ArchivedInfo = ({ complaint }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1">
      <h1 className="text-5xl font-bold mb-8 text-center">
        Revision de denuncia anonima archivada
      </h1>
      <div className="flex flex-col gap-6">
        {/* Título */}
        <div className="flex items-center gap-4">
          <span className="bg-black text-white px-6 py-3 rounded font-bold text-lg w-[200px] min-w-[200px] text-center">
            Título
          </span>
          <input
            type="text"
            value={complaint.titulo}
            readOnly
            className="flex-1 border px-3 py-2 rounded"
          />
        </div>
        {/* Descripción */}
        <div className="flex items-center gap-4">
          <span className="bg-black text-white px-5 py-3 rounded font-bold text-lg w-[200px] min-w-[200px] text-center">
            Descripción
          </span>
          <textarea
            value={complaint.descripcion}
            readOnly
            className="flex-1 border px-3 py-2 rounded h-32 resize-none"
          />
        </div>
        {/* Departamento actual */}
        {complaint.departamento && (
          <div className="flex items-center gap-4">
            <span className="bg-black text-white px-5 py-3 rounded font-bold text-lg w-[200px] min-w-[200px] text-center">
              Departamento actual
            </span>
            <input
              type="text"
              value={complaint.departamento.nombre}
              readOnly
              className="flex-1 border px-3 py-2 rounded bg-gray-100"
            />
          </div>
        )}
        {/* Botón para volver */}
        <div className="w-full mb-4">
          <button
            onClick={() => navigate("/archived_complaints")}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-black rounded-lg shadow hover:bg-gray-300 font-semibold transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a la lista de archivadas
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchivedInfo;