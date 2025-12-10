import axios from 'axios';

const AUDIT_API_URL = import.meta.env.VITE_AUDIT_API_URL || import.meta.env.VITE_AUTH_API_URL;

const authAxios = axios.create({
  baseURL: AUDIT_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Agregar interceptor para inyectar token si existe en localStorage
authAxios.interceptors.request.use(
  (config) => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        if (admin && (admin.token || admin.accessToken)) {
          config.headers.Authorization = `Bearer ${admin.token || admin.accessToken}`;
        }
      } catch  {
        // noop
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AuditoriaService = {
  getTotales: async () => {
    try {
      const { data } = await authAxios.get('/totales');
      return data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  getTotalesRango: async (startIso, endIso) => {
    try {
      const { data } = await authAxios.get('/totales/rango', {
        params: { start: startIso, end: endIso }
      });
      return data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  getTotalesPorAdmin: async (adminId) => {
    try {
      const { data } = await authAxios.get(`/admin/${adminId}/totales`);
      return data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  getTotalesPorAdminYRango: async (adminId, startIso, endIso) => {
    try {
      const { data } = await authAxios.get(`/admin/${adminId}/totales/rango`, {
        params: { start: startIso, end: endIso }
      });
      return data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  // Acciones por admin (listas)
  getRespuestasByAdminId: async (adminId) => {
    try {
      const { data } = await authAxios.get(`/admin/${adminId}/respuestas`);
      return data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  getArchivamientosByAdminId: async (adminId) => {
    try {
      const { data } = await authAxios.get(`/admin/${adminId}/archivamientos`);
      return data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  getComentariosByAdminId: async (adminId) => {
    try {
      const { data } = await authAxios.get(`/admin/${adminId}/comentarios`);
      return data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  getRespuestasApelacionByAdminId: async (adminId) => {
    try {
      const { data } = await authAxios.get(`/admin/${adminId}/respuestas-apelacion`);
      return data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  getApelaciones: async () => {
    try {
      const { data } = await authAxios.get('/apelaciones');
      return data;
    } catch (err) {
      throw err.response?.data || err;
    }
  }
};

export default AuditoriaService;
