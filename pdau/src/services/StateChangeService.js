import axios from "../api/axios";

const StateChangeService = {
  // Obtener un cambio de estado por ID
  getCambioEstadoById: async (id) => {
    try {
      const response = await axios.get(`/cambios-estado/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el cambio de estado con ID ${id}:`, error);
      throw error;
    }
  },

  // Registrar un nuevo cambio de estado
  registrarCambioEstado: async (cambioEstadoDTO) => {
    try {
      const response = await axios.post(`/cambios-estado`, cambioEstadoDTO);
      return response.data;
    } catch (error) {
      console.error("Error al registrar el cambio de estado:", error);
      throw error;
    }
  },

  // Obtener todos los cambios de estado de una denuncia por su ID
  getCambiosEstadoByDenunciaId: async (idDenuncia) => {
    try {
      const response = await axios.get(`/cambios-estado/denuncia/${idDenuncia}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener los cambios de estado de la denuncia con ID ${idDenuncia}:`, error);
      throw error;
    }
  },
};

export default StateChangeService;