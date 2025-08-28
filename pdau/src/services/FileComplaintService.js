import axios from "../api/axios";

const FileComplaintService = {
  // Obtener un registro de archivar denuncia por ID
  getArchivarDenunciaById: async (id) => {
    try {
      const response = await axios.get(`/archivar-denuncias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el registro de archivar denuncia con ID ${id}:`, error);
      throw error;
    }
  },

  // Registrar un nuevo archivo/desarchivo de denuncia
  registrarArchivarDenuncia: async (archivarDenunciaDTO) => {
    try {
      const response = await axios.post(`/archivar-denuncias`, archivarDenunciaDTO);
      return response.data;
    } catch (error) {
      console.error("Error al registrar el archivo/desarchivo de denuncia:", error);
      throw error;
    }
  },
};

export default FileComplaintService;