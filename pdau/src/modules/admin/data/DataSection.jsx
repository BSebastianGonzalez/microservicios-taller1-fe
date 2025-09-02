import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

const DataSection = () => {
  // Obtener los datos del administrador desde localStorage
  const adminData = JSON.parse(localStorage.getItem("admin")) || {
    nombre: "N/A",
    apellido: "N/A",
    correo: "N/A",
    telefono: "N/A",
    direccion: "N/A",
  };

  const navigate = useNavigate();

  const handleUpdateClick = () => {
    navigate("/data_update", { state: { adminData } });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Datos personales</h1>
      <div style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Nombres</label>
          <input
            type="text"
            value={adminData.nombre}
            readOnly
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Apellidos</label>
          <input
            type="text"
            value={adminData.apellido}
            readOnly
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Correo</label>
          <input
            type="email"
            value={adminData.correo}
            readOnly
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Teléfono</label>
          <input
            type="text"
            value={adminData.telefono}
            readOnly
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Dirección</label>
          <input
            type="text"
            value={adminData.direccion}
            readOnly
            style={styles.input}
          />
        </div>
        <div style={styles.buttonContainer}>
          <Button
            text="Actualizar datos"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleUpdateClick}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    // Ajusta el ancho restando el sidebar (260px) y centra el contenido
    width: "100%",
    minWidth: "100vh",
    maxWidth: "100vh",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // Centra verticalmente si el padre lo permite
    padding: "3rem 3rem",
    marginLeft: "260px", // Deja espacio para el sidebar fijo
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    minHeight: "100vh", // Para que el contenido esté centrado verticalmente
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 900,
    marginBottom: "2.5rem",
    marginTop: "-15rem",
    color: "#223053",
    letterSpacing: "0.02em",
    textShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    lineHeight: "1.1",
    textAlign: "center",
    width: "100%",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem 5rem",
    width: "100%",
    maxWidth: "900px",
    background: "rgba(255, 255, 255, 0.99)",
    borderRadius: "1.5rem",
    boxShadow: "0 8px 32px 0 rgba(30,58,138,0.13), 0 2px 8px 0 rgba(37,99,235,0.10)",
    padding: "2rem 3rem",
    border: "1.5px solid #e0e7ef",
    transition: "box-shadow 0.25s cubic-bezier(.4,0,.2,1)",
    alignItems: "start",
    boxSizing: "border-box",
    margin: "0 auto", // Centra el form horizontalmente
    justifySelf: "center", // Centra el form si el contenedor es grid
    alignSelf: "center",   // Centra el form si el contenedor es grid/flex
    placeSelf: "center",   // Centra el form completamente dentro del grid/flex parent
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "0.2rem",
    gridColumn: "span 1",
  },
  label: {
    fontSize: "1.08rem",
    fontWeight: 700,
    color: "#223053",
    marginBottom: "0.15rem",
    letterSpacing: "0.015em",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },
  input: {
    width: "100%",
    padding: "0.85rem 1.5rem",
    border: "1.5px solid #cbd5e1",
    borderRadius: "0.9rem",
    background: "#f6f8fb",
    fontSize: "1.08rem",
    color: "#223053",
    fontWeight: 500,
    outline: "none",
    boxShadow: "0 2px 8px 0 rgba(30,58,138,0.04)",
    transition: "border 0.2s, box-shadow 0.2s",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },
  buttonContainer: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    gridColumn: "1 / -1",
  },
};

export default DataSection;