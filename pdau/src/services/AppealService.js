import api from "../api/axios";

// Preferir el microservicio de respuestas; si no está definido, usar VITE_API_URL como fallback
const respuestasBase = (import.meta.env.VITE_RESPUESTAS_API_URL || import.meta.env.VITE_API_URL || '').replace(/\/+$|\s+/g, '');

const crearApelacion = async (formData) => {
  const url = `${respuestasBase}/api/apelaciones`;
  const resp = await api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return resp.data;
};

const obtenerPorDenuncia = async (denunciaId) => {
  const url = `${respuestasBase}/api/apelaciones/denuncia/${denunciaId}`;
  const resp = await api.get(url);
  return resp.data;
};

export default {
  crearApelacion,
  obtenerPorDenuncia,
};
