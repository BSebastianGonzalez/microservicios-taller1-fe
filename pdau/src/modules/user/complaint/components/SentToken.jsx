import React, { useState } from "react";
import Button from "../../../../components/Button";
import TextField from "../../../../components/TextField";
import ComplaintService from "../../../../services/ComplaintService";
import { useNavigate } from "react-router-dom";

const SentToken = () => {
  const [token, setToken] = useState(""); // Estado para almacenar el token ingresado
  const [error, setError] = useState(""); // Estado para manejar errores
  const navigate = useNavigate();

  const handleConsult = async () => {
    if (!token.trim()) {
      setError("Por favor, ingrese un token válido.");
      return;
    }

    try {
      console.log("Consultando denuncia con token:", token);
      const response = await ComplaintService.getComplaintByToken(token);
      console.log("Denuncia obtenida:", response); // Verificar que `estado` está presente

      // Redirigir a ComplaintResponse con los datos de la denuncia
      navigate("/consult_response", { state: { complaint: response } });
    } catch (error) {
      console.error("Error al consultar la denuncia:", error);
      setError("No se encontró una denuncia con el token ingresado.");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-5xl font-bold text-center">
        Consultar estado de denuncia anónima
      </h1>
      <div className="mt-10 w-full max-w-md">
        <TextField
          placeholder="Ingrese el token de seguimiento"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            setError(""); // Limpiar el error al escribir
          }}
          required
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      <div className="flex gap-4 mt-6">
        <Button
          text="Consultar"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={handleConsult}
        />
        <Button
          text="Volver al inicio"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => navigate("/")}
        />
      </div>
    </section>
  );
};

export default SentToken;
