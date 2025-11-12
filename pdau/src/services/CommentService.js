import axios from "../api/axios";

// URL del servicio de gestión (gateway). Si está definida, se prefixea con /api
const MANAGEMENT_URL = import.meta.env.VITE_RESPUESTAS_API_URL || "";
const BASE = MANAGEMENT_URL ? `${MANAGEMENT_URL}/api` : "";

const CommentService = {
  // Obtener comentarios por ID de denuncia
  getComentariosByDenunciaId: async (idDenuncia) => {
    try {
      const response = await axios.get(`${BASE}/comentarios/denuncia/${idDenuncia}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
      throw new Error("No se pudieron cargar los comentarios");
    }
  },

  // Guardar un nuevo comentario de denuncia
  saveComentarioDenuncia: async (comentarioDenunciaDTO) => {
    try {
      const response = await axios.post(`${BASE}/comentarios`, comentarioDenunciaDTO);
      return response.data;
    } catch (error) {
      console.error("Error al guardar comentario:", error);
      throw new Error("No se pudo guardar el comentario");
    }
  },

  // NUEVO: Eliminar comentario
  deleteComentario: async (idComentario) => {
    try {
      await axios.delete(`${BASE}/comentarios/${idComentario}`);
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      throw new Error("No se pudo eliminar el comentario");
    }
  }
};

export default CommentService;