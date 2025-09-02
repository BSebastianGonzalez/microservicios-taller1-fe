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
    <div style={styles.container}>
      {/* Contenido renderizado */}
      <div style={styles.content}>{children}</div>

      {/* Controles de paginación */}
      <div style={styles.paginationContainer}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            ...styles.paginationButton,
            ...(currentPage === 1 ? styles.paginationButtonDisabled : styles.paginationButtonEnabled)
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.target.style.background = "linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)";
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.target.style.background = "linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)";
            }
          }}
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            style={{
              ...styles.paginationButton,
              ...(currentPage === index + 1 ? styles.paginationButtonActive : styles.paginationButtonInactive)
            }}
            onMouseEnter={(e) => {
              if (currentPage !== index + 1) {
                e.target.style.backgroundColor = "#d1d5db";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== index + 1) {
                e.target.style.backgroundColor = "#e5e7eb";
              }
            }}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            ...styles.paginationButton,
            ...(currentPage === totalPages ? styles.paginationButtonDisabled : styles.paginationButtonEnabled)
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.background = "linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)";
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.background = "linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)";
            }
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
  },
  content: {
    width: "100%",
  },
  paginationContainer: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  paginationButton: {
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    minWidth: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paginationButtonEnabled: {
    background: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)",
    color: "white",
  },
  paginationButtonDisabled: {
    backgroundColor: "#d1d5db",
    color: "#6b7280",
    cursor: "not-allowed",
  },
  paginationButtonActive: {
    background: "linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)",
    color: "white",
  },
  paginationButtonInactive: {
    backgroundColor: "#e5e7eb",
    color: "#374151",
  },
};

export default ListContainer;
