import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button"; // Importar el componente Button

const DataSection = () => {
  // Obtener los datos del administrador desde localStorage
  const adminData = JSON.parse(localStorage.getItem("admin")) || {
    nombre: "N/A",
    apellido: "N/A",
    correo: "N/A",
    telefono: "N/A",
    direccion: "N/A",
  };

  console.log("Datos recibidos en DataSection:", adminData);

  const navigate = useNavigate();

  const handleUpdateClick = () => {
    navigate("/data_update", { state: { adminData } }); // Redirigir con los datos actuales
  };

  return (
    <div className="h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">Datos personales</h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Nombres</label>
          <input
            type="text"
            value={adminData.nombre}
            readOnly
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Apellidos</label>
          <input
            type="text"
            value={adminData.apellido}
            readOnly
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Correo</label>
          <input
            type="email"
            value={adminData.correo}
            readOnly
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            type="text"
            value={adminData.telefono}
            readOnly
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input
            type="text"
            value={adminData.direccion}
            readOnly
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none bg-gray-100"
          />
        </div>
      </div>
      <div className="mt-6">
        <Button
          text="Actualizar datos"
          className="bg-red-600 text-white hover:bg-red-700"
          onClick={handleUpdateClick}
        />
      </div>
    </div>
  );
};

export default DataSection;