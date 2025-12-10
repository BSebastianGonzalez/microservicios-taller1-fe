import axios from 'axios';

// URL específica para el microservicio de respuestas
const RESPUESTAS_API_URL = import.meta.env.VITE_RESPUESTAS_API_URL;

const AppealResponseService = {
  async registrarRespuestaApelacion(dto, archivos = []) {
    try {
      const formData = new FormData();

      // El backend espera 'data' como JSON en multipart y 'files' como lista
      formData.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
      if (archivos && archivos.length > 0) {
        archivos.forEach((file) => {
          if (file.size > MAX_FILE_SIZE) throw new Error(`El archivo ${file.name} supera 2MB`);
          // Asegurar que se envíe el nombre original también
          formData.append('files', file, file.name);
        });
      }

      const resp = await axios.post(
        `${RESPUESTAS_API_URL}/api/respuestas-apelacion`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000,
        }
      );

      return resp.data;
    } catch (error) {
      console.error('Error al registrar respuesta de apelación:', error);
      if (error.response) {
        if (error.response.status === 413) throw new Error('Los archivos son demasiado grandes. Máx 2MB por archivo.');
        throw new Error(error.response.data?.message || JSON.stringify(error.response.data) || 'Error del servidor');
      }
      throw error;
    }
  },

  async obtenerPorDenuncia(denunciaId) {
    try {
      const resp = await axios.get(`${RESPUESTAS_API_URL}/api/respuestas-apelacion/denuncia/${denunciaId}`);
      return resp.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      console.error('Error al obtener respuesta de apelación:', error);
      throw error;
    }
  }
};

export default AppealResponseService;
