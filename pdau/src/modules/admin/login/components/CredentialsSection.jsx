import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import AdminService from "../../../../services/AdminService";
import Button from "../../../../components/Button";

const CredentialsSection = () => {
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Inicializar useNavigate

  const handleLogin = async () => {
    try {
      setError(""); // Limpiar errores previos
      const response = await AdminService.login(correo, contrasenia);

      if (response.success) {
        console.log("Inicio de sesión exitoso:", response);

        // Guardar los datos del administrador en localStorage
        localStorage.setItem("admin", JSON.stringify(response.admin));

        // Redirigir al usuario a la página principal
        navigate("/admin_main");
      } else {
        setError(response.message || "Error al iniciar sesión. Verifica tus credenciales.");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-6xl font-bold mb-6">Iniciar sesión</h1>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <div>
          <label htmlFor="correo" className="block text-sm font-medium mb-1">
            Usuario
          </label>
          <input
            id="correo"
            type="text"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-500"
            placeholder="Ingresa tu usuario"
          />
        </div>
        <div>
          <label htmlFor="contrasenia" className="block text-sm font-medium mb-1">
            Contraseña
          </label>
          <input
            id="contrasenia"
            type="password"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-red-500"
            placeholder="Ingresa tu contraseña"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          text="Ingresar"
          className="bg-red-600 text-white"
          onClick={handleLogin}
        />
      </div>
    </div>
  );
};

export default CredentialsSection;
