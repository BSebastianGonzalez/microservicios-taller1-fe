import React from 'react';

const HomeButton = ({ text = "Registrar Denuncia Anónima", imageSrc = "img/default-icon.png", onClick }) => {
  // Los colores utilizados en este botón, expresados en JavaScript, serían los siguientes:
  const colores = {
    fondo: "#e5e7eb", // bg-gray-200
    fondoHover: "#d1d5db", // hover:bg-gray-300
    borde: "#000000", // border-black
    texto: "#000000", // por defecto, el texto es negro
  };

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
        backgroundColor: colores.fondo,
        border: `1px solid ${colores.borde}`,
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
        width: "25rem",
        height: "7.5rem",
        transition: "all 0.3s",
        cursor: "pointer",
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = colores.fondoHover}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = colores.fondo}
    >
      <span style={{ fontSize: "1rem", marginBottom: "0.5rem", color: colores.texto }}>{text}</span>
      <img
        src={imageSrc}
        alt="Button Icon"
        style={{
          maxWidth: "3.75rem",
          maxHeight: "3.75rem",
          objectFit: "contain"
        }}
      />
    </button>
  );
};

export default HomeButton;