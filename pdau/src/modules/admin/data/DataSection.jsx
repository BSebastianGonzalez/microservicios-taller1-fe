import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";

const DataSection = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const adminData = JSON.parse(localStorage.getItem("admin")) || {
    nombre: "N/A",
    apellido: "N/A",
    correo: "N/A",
    telefono: "N/A",
    direccion: "N/A",
  };

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (location.state?.updated) {
      setSuccessOpen(true);
      // limpiar el state para que no se repita al refrescar
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const hasEmptyFields = () => {
    const vals = [
      adminData.nombre,
      adminData.apellido,
      adminData.correo,
      adminData.telefono,
      adminData.direccion,
    ];
    return vals.some((v) => !v || v === "N/A");
  };

  const handleUpdateClick = () => {
    if (hasEmptyFields()) {
      setErrMsg(
        "Faltan datos por completar. Te recomendamos actualizarlos antes de continuar."
      );
      setErrorOpen(true);
      return;
    }
    navigate("/data_update", { state: { adminData } });
  };


  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Datos personales</h1>

      <div style={styles.card}>
        {/* Nombres */}
        <div style={styles.row}>
          <label style={styles.label}>Nombres</label>
          <input style={styles.input} readOnly value={adminData.nombre} />
        </div>

        {/* Apellidos */}
        <div style={styles.row}>
          <label style={styles.label}>Apellidos</label>
          <input style={styles.input} readOnly value={adminData.apellido} />
        </div>

        {/* Correo */}
        <div style={styles.row}>
          <label style={styles.label}>Correo</label>
          <input
            style={styles.input}
            type="email"
            readOnly
            value={adminData.correo}
          />
        </div>

        {/* Teléfono */}
        <div style={styles.row}>
          <label style={styles.label}>Telefono</label>
          <input style={styles.input} readOnly value={adminData.telefono} />
        </div>

        {/* Dirección */}
        <div style={styles.row}>
          <label style={styles.label}>Direccion</label>
          <input style={styles.input} readOnly value={adminData.direccion} />
        </div>

        {/* Botón */}
        <div style={styles.buttonContainer}>
          <Button text="Actualizar información" onClick={handleUpdateClick} />
        </div>

        {/* Modales */}
        <Modal
        open={successOpen}
        type="success"
        title="¡Datos actualizados!"
        message="La información personal se guardó correctamente."
        confirmText="Entendido"
        onClose={() => setSuccessOpen(false)}
      />
      <Modal
        open={successOpen}
        type="success"
        title="¡Datos actualizados!"
        message="La información personal se guardó correctamente."
        confirmText="Entendido"
        onClose={() => setSuccessOpen(false)}
      />
      <Modal
        open={errorOpen}
        type="error"
        title="Faltan datos por completar"
        message={errMsg}
        confirmText="Ir a actualizar"
        onConfirm={() =>
          navigate("/data_update", { state: { adminData } })
        }
        onClose={() => setErrorOpen(false)}
        onCancel={() => setErrorOpen(false)}
        cancelText="Luego"
      />
      </div>
    </div>
  );
};

const styles = {
  container: {
    // Deja espacio para el sidebar fijo (~260px)
    marginLeft: "260px",
    width: "calc(100% - 260px)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
    padding: "2.5rem 2rem",
    background: "transparent",
  },

  title: {
    fontFamily: "'Inter','Segoe UI', Arial, sans-serif",
    fontSize: "3rem",
    fontWeight: 900,
    color: "#111827",
    textAlign: "center",
    //marginLeft: "-13rem",
    marginBottom: "3rem",
    lineHeight: 1.1,
  },

  card: {
    width: "min(800px, 80%)",
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    //marginLeft: "-13rem",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    padding: "2rem 0rem 2rem 2rem",
  },

  // Cada fila: etiqueta a la izquierda, input a la derecha
  row: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    alignItems: "center",
    columnGap: "18px",
    rowGap: "14px",
    marginBottom: "14px",
  },

  label: {
    fontFamily: "'Inter','Segoe UI', Arial, sans-serif",
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#111827",
    textAlign: "left",
  },

  input: {
    width: "100%",
    padding: "0.8rem 1rem",
    marginLeft: "-9rem",
    fontSize: "1rem",
    fontWeight: 500,
    color: "#111827",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    outline: "none",
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  },

  buttonContainer: {
    marginTop: "1.8rem",
    display: "flex",
    justifyContent: "center",
  },
};

export default DataSection;
