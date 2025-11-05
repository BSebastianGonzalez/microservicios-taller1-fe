import axios from 'axios';

// Vite uses `import.meta.env` for environment variables. Use a VITE_ prefixed var in .env
// Example: VITE_API_URL=http://localhost:8080/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const ResponseService = {
  async registrarRespuesta(responseData) {
    try {
      const formData = new FormData();
      formData.append('detalleRespuesta', responseData.detalleRespuesta);
      formData.append('diasApelacion', responseData.diasApelacion);
      formData.append('idAdministrador', responseData.idAdministrador);
      formData.append('idDenuncia', responseData.idDenuncia);
      
      if (responseData.documentosSoporte && responseData.documentosSoporte.length > 0) {
        responseData.documentosSoporte.forEach((doc) => {
          formData.append('documentos', doc.file);
        });
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/respuestas`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error al registrar respuesta:', error);
      throw error;
    }
  },

  async obtenerRespuesta(complaintId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/respuestas/denuncia/${complaintId}`
      );
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error al obtener respuesta:', error);
      throw error;
    }
  },

  async actualizarRespuesta(responseId, responseData) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/respuestas/${responseId}`,
        responseData
      );
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar respuesta:', error);
      throw error;
    }
  },

  async eliminarDocumento(documentoId) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/respuestas/documentos/${documentoId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      throw error;
    }
  },
};

export default ResponseService;