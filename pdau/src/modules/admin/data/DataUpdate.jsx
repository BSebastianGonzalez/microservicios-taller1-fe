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
    <div className="h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Actualizar datos personales</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Nombres</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Apellidos</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-500"
          />
        </div>
        <div className="flex gap-4">
          <Button
            text="Guardar cambios"
            className="bg-red-600 text-white hover:bg-red-700"
            type="submit"
          />
        </div>
      </form>
      {/* Botón Volver fuera del form */}
      <div className="flex gap-4 mt-4">
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

export default DataUpdate;
