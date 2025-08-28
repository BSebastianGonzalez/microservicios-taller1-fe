import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import Button from "../../../../components/Button";

const FinishedRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token;

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (!token) return null;

  const handleDownloadToken = () => {
    const element = document.createElement("a");
    const file = new Blob([`Token de seguimiento: ${token}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "token.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-6xl text-center font-bold">
        Registro de denuncia anónima
      </h1>
      <p className="text-lg text-center mt-15">Su token de seguimiento es:</p>
      <h2 className="text-5xl font-bold text-red-600 mt-15">{token}</h2>
      <p className="text-center text-black-600 mt-15 px-0 max-w-6xl">
        Mediante el token, usted puede consultar en qué estado se encuentra su
        denuncia, y en qué estados podrá encontrarse después. Recuerde que el
        token generado es único y exclusivo para su denuncia; sin posibilidad de
        recuperación. Puede descargarlo a continuación si así lo desea.
      </p>
      <div className="flex gap-4 mt-6">
        <Button
          text="Descargar token (TXT)"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={handleDownloadToken}
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

export default FinishedRegister;
