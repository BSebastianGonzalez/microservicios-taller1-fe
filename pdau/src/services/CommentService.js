import axios from "../api/axios";

const CommentService = {
  // Obtener comentarios por ID de denuncia
  getComentariosByDenunciaId: async (idDenuncia) => {
    try {
      const response = await axios.get(`/comentarios/denuncia/${idDenuncia}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
      throw error;
    }
  },

  // Guardar un nuevo comentario de denuncia
  saveComentarioDenuncia: async (comentarioDenunciaDTO) => {
    try {
      const response = await axios.post("/comentarios", comentarioDenunciaDTO);
      return response.data;
    } catch (error) {
      console.error("Error al guardar comentario:", error);
      throw error;
    }
  },
};

export default CommentService;