import axios from 'axios';

// URL específica para el microservicio de respuestas
const RESPUESTAS_API_URL = import.meta.env.VITE_RESPUESTAS_API_URL;

const ResponseService = {
  async registrarRespuesta(responseData) {
    try {
      const formData = new FormData();
      
      // Los nombres de parámetros deben coincidir con el backend Spring Boot
      formData.append('denunciaId', responseData.idDenuncia);
      formData.append('adminId', responseData.idAdministrador);
      formData.append('detalle', responseData.detalleRespuesta);
      
      // Validar tamaño de archivos antes de enviar - 2MB
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
      
      // El backend espera 'files' no 'documentos'
      if (responseData.documentosSoporte && responseData.documentosSoporte.length > 0) {
        responseData.documentosSoporte.forEach((doc) => {
          if (doc.file.size > MAX_FILE_SIZE) {
            throw new Error(`El archivo ${doc.nombre} es demasiado grande. Tamaño máximo: 2MB`);
          }
          formData.append('files', doc.file);
        });
      }
      
      console.log('Microservicio de respuestas:', RESPUESTAS_API_URL);
      console.log('Enviando datos al backend:', {
        denunciaId: responseData.idDenuncia,
        adminId: responseData.idAdministrador,
        detalle: responseData.detalleRespuesta,
        archivos: responseData.documentosSoporte?.length || 0
      });
      
      const response = await axios.post(
        `${RESPUESTAS_API_URL}/api/respuestas`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 segundos
          maxContentLength: 4 * 1024 * 1024, // 4MB máximo para respuesta
          maxBodyLength: 4 * 1024 * 1024, // 4MB máximo para request
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error al registrar respuesta:', error);
      
      if (error.response) {
        // El servidor respondió con un código de error
        const errorMessage = error.response.data || 'Error del servidor';
        
        // Manejar específicamente el error 413
        if (error.response.status === 413) {
          throw new Error('Los archivos son demasiado grandes. Tamaño máximo permitido: 2MB por archivo.');
        }
        
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        if (error.code === 'ECONNABORTED') {
          throw new Error('La conexión con el servidor tardó demasiado tiempo. Intente con archivos más pequeños.');
        }
        throw new Error('No se pudo conectar con el servidor de respuestas. Verifique su conexión a internet.');
      } else {
        // Algo pasó al configurar la petición
        throw new Error('Error de configuración: ' + error.message);
      }
    }
  },

  // ResponseService.js - versión para datos hexadecimales
async obtenerRespuesta(complaintId) {
  try {
    const response = await axios.get(
      `${RESPUESTAS_API_URL}/api/respuestas/${complaintId}`,
      {
        timeout: 30000,
      }
    );
    
    const responseData = response.data;
    if (responseData && responseData.archivos) {
      responseData.documentosSoporte = responseData.archivos.map(archivo => {
        // Si el archivo tiene datos en formato hexadecimal (como "0×255044462...")
        if (archivo.datos && typeof archivo.datos === 'string' && archivo.datos.startsWith('0×')) {
          try {
            // Remover el prefijo "0×" y convertir hexadecimal a bytes
            const hexString = archivo.datos.substring(2); // Quitar "0×"
            const byteArray = new Uint8Array(hexString.length / 2);
            
            for (let i = 0; i < byteArray.length; i++) {
              const byte = parseInt(hexString.substr(i * 2, 2), 16);
              byteArray[i] = byte;
            }
            
            const blob = new Blob([byteArray], { 
              type: archivo.tipoContenido || 'application/pdf' 
            });
            const url = window.URL.createObjectURL(blob);
            
            return {
              id: archivo.id,
              nombre: archivo.nombre,
              url: url,
              tipoContenido: archivo.tipoContenido,
              tamaño: `(${Math.round(byteArray.length / 1024)} KB)`,
              esTemporal: true
            };
          } catch (error) {
            console.error('Error convirtiendo hexadecimal:', error);
            return archivo;
          }
        }
        
        return archivo;
      });
    }
    
    return responseData;
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
        `${RESPUESTAS_API_URL}/api/respuestas/${responseId}`,
        responseData
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar respuesta:', error);
      throw error;
    }
  },

  async eliminarDocumento(documentoId) {
    try {
      const response = await axios.delete(
        `${RESPUESTAS_API_URL}/api/respuestas/documentos/${documentoId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      throw error;
    }
  },
};

export default ResponseService;