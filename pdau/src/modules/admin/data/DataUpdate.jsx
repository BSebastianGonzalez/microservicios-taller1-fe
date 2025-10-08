import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import AdminService from "../../../services/AdminService";
import Modal from "../../../components/Modal";

const DataUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminData =
    location.state?.adminData ||
    JSON.parse(localStorage.getItem("admin")) || {
      id: 1,
      nombre: "N/A",
      apellido: "N/A",
      correo: "N/A",
      telefono: "N/A",
      direccion: "N/A",
    };

  const [formData, setFormData] = useState({
    nombre: adminData.nombre || "",
    apellido: adminData.apellido || "",
    correo: adminData.correo || "",
    telefono: adminData.telefono || "",
    direccion: adminData.direccion || "",
  });

  const [initialFormData] = useState(formData);

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.nombre?.trim()) return "El nombre es obligatorio.";
    if (!formData.apellido?.trim()) return "El apellido es obligatorio.";
    if (!formData.telefono?.trim()) return "El teléfono es obligatorio.";
    if (!formData.direccion?.trim()) return "La dirección es obligatoria.";
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const v = validate();
    if (v) {
      setErrMsg(v);
      setErrorOpen(true);
      return;
    }

    try {
      const updatedData = await AdminService.updateAdmin(adminData.id, formData);
      localStorage.setItem("admin", JSON.stringify(updatedData));
      setSuccessOpen(true);
    } catch (error) {
      console.error("Error al actualizar:", error);
      setErrMsg(
        error?.message ||
          "Hubo un error al actualizar los datos. Intenta nuevamente."
      );
      setErrorOpen(true);
    }
  };

  const isFormModified = () =>
    formData.nombre !== initialFormData.nombre ||
    formData.apellido !== initialFormData.apellido ||
    formData.telefono !== initialFormData.telefono ||
    formData.direccion !== initialFormData.direccion;

  const handleBack = () => {
    if (isFormModified()) {
      if (window.confirm("Tienes cambios sin guardar. ¿Deseas salir sin guardar?")) {
        navigate("/data");
      }
    } else {
      navigate("/data");
    }
  };

  const goBackToData = () => {
    setSuccessOpen(false);
    navigate("/data", { state: { updated: true } });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Actualizar datos personales</h1>

      <form onSubmit={handleSubmit} style={styles.card}>
        {/* Nombres */}
        <div style={styles.row}>
          <label style={styles.label}>Nombres</label>
          <input
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Apellidos */}
        <div style={styles.row}>
          <label style={styles.label}>Apellidos</label>
          <input
            name="apellido"
            type="text"
            value={formData.apellido}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Correo (solo visualización para mantener el mismo espacio) */}
        <div style={styles.row}>
          <label style={styles.label}>Correo</label>
          <input
            name="correo"
            type="email"
            value={formData.correo}
            disabled
            style={{ ...styles.input, background: "#f3f4f6", cursor: "not-allowed" }}
          />
        </div>

        {/* Teléfono */}
        <div style={styles.row}>
          <label style={styles.label}>Telefono</label>
          <input
            name="telefono"
            type="text"
            value={formData.telefono}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Dirección */}
        <div style={styles.row}>
          <label style={styles.label}>Direccion</label>
          <input
            name="direccion"
            type="text"
            value={formData.direccion}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Botones */}
        <div style={styles.buttons}>
          <Button text="Guardar cambios" onClick={() => handleSubmit()} />
          <Button text="Volver" onClick={handleBack} />
        </div>
      </form>

      {/* Modal Éxito */}
      <Modal
        open={successOpen}
        type="success"
        title="¡Actualización exitosa!"
        message="Los datos han sido guardados correctamente."
        confirmText="Volver a mis datos"
        onConfirm={goBackToData}
        onClose={goBackToData}
      />

      {/* Modal Error */}
      <Modal
        open={errorOpen}
        type="error"
        title="No se pudo guardar"
        message={errMsg}
        confirmText="Entendido"
        onClose={() => setErrorOpen(false)}
      />

    </div>
  );
};

const styles = {
  // MISMO CONTENEDOR BASE QUE DataSection
  container: {
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

  // Título igual que DataSection (incluye el mismo offset que usas allí)
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

  // CARD con el mismo ancho/padding/posición que DataSection
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

  // MISMA GRID: etiqueta 220px | campo 1fr
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

  // Input con el mismo margen izquierdo y estilo que DataSection
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

  buttons: {
    marginTop: "1.6rem",
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    paddingRight: "2rem",
  },
};

export default DataUpdate;
