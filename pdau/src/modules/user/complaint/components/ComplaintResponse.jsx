import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusTag from "../../../../components/StatusTag";
import Button from "../../../../components/Button";
import ComplaintService from "../../../../services/ComplaintService";

const ComplaintResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [nextStates, setNextStates] = useState([]);

  useEffect(() => {
    if (location.state && location.state.complaint) {
      setComplaint(location.state.complaint);
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchNextStates = async () => {
      if (complaint?.estado?.siguientes && complaint.estado.siguientes.length > 0) {
        try {
          const promises = complaint.estado.siguientes.map((id) =>
            ComplaintService.getEstadoById(id)
          );
          const results = await Promise.all(promises);
          setNextStates(results);
        } catch (error) {
          setNextStates([]);
        }
      } else {
        setNextStates([]);
      }
    };
    fetchNextStates();
  }, [complaint]);

  if (!complaint) {
    return null;
  }

  return (
    <section className="flex flex-col items-center justify-center mt-10">
      <h1 className="text-5xl font-bold text-center mb-12">
        Consultar estado de denuncia anónima
      </h1>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-2 text-black">Denuncia anónima</h2>
        <p className="text-lg mb-6 text-gray-700">{complaint.titulo}</p>
        <div className="bg-purple-100 rounded-lg py-6 px-4 mb-8 shadow-inner">
          <h2 className="text-xl font-bold mb-4 text-black-220">Estado actual</h2>
          <StatusTag
            text={complaint.estado?.nombre || complaint.estadoNombre}
            className="text-lg font-bold px-8 py-3 rounded-lg shadow bg-white text-purple-900 border border-purple-300"
          />
        </div>
        {nextStates.length > 0 && (
          <div className="bg-purple-50 rounded-lg py-6 px-4 mb-8 shadow-inner">
            <h3 className="text-lg font-bold mb-4 text-black">Próximos posibles estados</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {nextStates.map((estado) => (
                <StatusTag
                  key={estado.id}
                  text={estado.nombre}
                  className="text-lg font-bold px-8 py-3 rounded-lg shadow bg-white text-purple-900 border border-purple-300 transition hover:bg-purple-100"
                />
              ))}
            </div>
          </div>
        )}
        <Button
          text="Volver al inicio"
          className="bg-red-600 hover:bg-red-700 text-white w-full py-3 text-lg rounded-lg mt-2"
          onClick={() => navigate("/")}
        />
      </div>
    </section>
  );
};

export default ComplaintResponse;