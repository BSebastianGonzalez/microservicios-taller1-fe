import React from "react";

const ListContainer = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  
  children,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      {/* Contenido renderizado */}
      <div>{children}</div>

      {/* Controles de paginación */}
      <div className="mt-4 flex justify-center items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === index + 1 ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListContainer;
