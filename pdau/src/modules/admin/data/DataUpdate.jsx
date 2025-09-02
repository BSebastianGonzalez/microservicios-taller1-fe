import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import AdminService from "../../../services/AdminService";

const DataUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminData = location.state?.adminData ||
    JSON.parse(localStorage.getItem("admin")) || {
      id: 1,
      nombre: "Juan Diego",
      apellido: "Castañeda Bohórquez",
      correo: "juandiegocb@ufps.edu.co",
      telefono: "3214208500",
      direccion: "Av 1a Calle 28",
    };

  const [formData, setFormData] = useState({
    cedula: adminData.cedula || "",
    nombre: adminData.nombre,
    apellido: adminData.apellido,
    correo: adminData.correo,
    contrasenia: adminData.contrasenia || adminData.contrasenia,
    telefono: adminData.telefono,
    direccion: adminData.direccion,
    role: adminData.role || "admin",
  });

  // Guardar el estado inicial para comparar cambios
  const [initialFormData] = useState(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.telefono ||
      !formData.direccion
    ) {
      alert("Por favor, completa todos los campos antes de actualizar.");
      return;
    }

    try {
      const updatedData = await AdminService.updateAdmin(
        adminData.id,
        formData
      );
      localStorage.setItem("admin", JSON.stringify(updatedData));
      alert("Datos actualizados exitosamente.");
      navigate("/data");
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      alert(
        "Hubo un error al actualizar los datos. Por favor, inténtalo de nuevo."
      );
    }
  };

  // Función para comparar si hay cambios en el formulario
  const isFormModified = () => {
    return (
      formData.nombre !== initialFormData.nombre ||
      formData.apellido !== initialFormData.apellido ||
      formData.telefono !== initialFormData.telefono ||
      formData.direccion !== initialFormData.direccion
    );
  };

  // Botón para volver a /data con verificación de cambios
  const handleBack = () => {
    if (isFormModified()) {
      if (
        window.confirm(
          "Tienes cambios sin guardar. ¿Seguro que deseas cancelar la actualización de información?"
        )
      ) {
        navigate("/data");
      }
    } else {
      navigate("/data");
    }
  };

  useEffect(() => {
    // Verificar si el estado del formulario está bien inicializado
    // console.log(formData);
  }, [formData]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Actualizar datos personales</h1>
      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >
        <div style={styles.field}>
          <label style={styles.label}>Nombres</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Apellidos</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
        <div style={styles.buttonRow}>
          <Button
            text="Guardar cambios"
            className="bg-red-600 text-white hover:bg-red-700"
            type="submit"
          />
        </div>
      </form>
      {/* Botón Volver fuera del form */}
      <div style={styles.backRow}>
        <Button
          text="Volver"
          className="bg-red-600 text-white hover:bg-gray-400"
          type="button"
          onClick={handleBack}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    maxHeight: "100vh",
    overflowY: "auto",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#f3f6fa",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 900,
    marginTop: "2.5rem",
    marginBottom: "2.5rem",
    color: "#223053",
    letterSpacing: "0.02em",
    textShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
    textAlign: "center",
    width: "100%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.1rem",
    width: "100%",
    maxWidth: "370px",
    background: "#fff",
    borderRadius: "1.1rem",
    boxShadow: "0 8px 32px 0 rgba(30,58,138,0.10), 0 2px 8px 0 rgba(37,99,235,0.08)",
    padding: "2rem 1.5rem 1.5rem 1.5rem",
    border: "1.2px solid #e0e7ef",
    margin: "0 auto",
    boxSizing: "border-box",
    alignItems: "stretch",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
    marginBottom: "0.1rem",
  },
  label: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#223053",
    marginBottom: "0.08rem",
    letterSpacing: "0.01em",
    paddingLeft: "0.1rem",
  },
  input: {
    width: "100%",
    padding: "0.7rem 1rem",
    border: "1.2px solid #cbd5e1",
    borderRadius: "0.7rem",
    background: "#f6f8fb",
    fontSize: "1rem",
    color: "#223053",
    fontWeight: 500,
    outline: "none",
    boxShadow: "0 1.5px 6px 0 rgba(30,58,138,0.03)",
    transition: "border 0.2s, box-shadow 0.2s",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  },
  buttonRow: {
    display: "flex",
    gap: "1rem",
    marginTop: "1.2rem",
    justifyContent: "center",
    width: "100%",
  },
  backRow: {
    display: "flex",
    gap: "1rem",
    marginTop: "1.2rem",
    justifyContent: "center",
    width: "100%",
  },
};

export default DataUpdate;
