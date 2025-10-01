import axios from "../api/axios";

const ComplaintService = {
  // Obtener todas las denuncias
  getAllComplaints: async () => {
    try {
      const response = await axios.get("/api/denuncias/list");
      return response.data;
    } catch (error) {
      console.error("Error al obtener las denuncias:", error);
      throw error;
    }
  },

  // Obtener una denuncia por ID
  getComplaintById: async (id) => {
    try {
      const response = await axios.get(`/api/denuncias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la denuncia con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener una denuncia por token
  getComplaintByToken: async (token) => {
    try {
      const response = await axios.get(`/api/denuncias/token/${token}`);
      console.log("Respuesta de la API:", response.data); // Depuración 
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la denuncia con el token ${token}:`, error);
      throw error;
    }
  },

  // Crear una nueva denuncia
  createComplaint: async (complaintData) => {
    try {
      const response = await axios.post("/api/denuncias", complaintData);
      return response.data;
    } catch (error) {
      console.error("Error al crear la denuncia:", error);
      throw error;
    }
  },

  // Actualizar una denuncia existente
  updateComplaint: async (id, complaintData) => {
    try {
      const response = await axios.put(`/api/denuncias/${id}`, complaintData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar la denuncia con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una denuncia por ID
  deleteComplaint: async (id) => {
    try {
      await axios.delete(`/api/denuncias/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la denuncia con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener denuncias por categoría
  getComplaintsByCategory: async (categoryId) => {
    try {
      const response = await axios.get(`/api/denuncias/categorias/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener denuncias de la categoría con ID ${categoryId}:`, error);
      throw error;
    }
  },

  // Obtener todas las categorías
  getAllCategories: async () => {
    try {
      const response = await axios.get("/api/categorias/list");
      return response.data;
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      throw error;
    }
  },

  // Obtener una categoría por ID
  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`/api/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la categoría con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener denuncias archivadas
  getArchivedComplaints: async () => {
    try {
      const response = await axios.get("/denuncias/archivadas");
      return response.data;
    } catch (error) {
      console.error("Error al obtener las denuncias archivadas:", error);
      throw error;
    }
  },

  // Obtener denuncias no archivadas
  getUnarchivedComplaints: async () => {
    try {
      const response = await axios.get("/denuncias/no-archivadas");
      return response.data;
    } catch (error) {
      console.error("Error al obtener las denuncias no archivadas:", error);
      throw error;
    }
  },

  // Alternar el estado de archivado de una denuncia
  toggleArchivedStatus: async (id) => {
    try {
      const response = await axios.put(`/denuncias/${id}/toggle-archivado`);
      return response.data;
    } catch (error) {
      console.error(`Error al alternar el estado de archivado de la denuncia con ID ${id}:`, error);
      throw error;
    }
  },


  uploadFile: async (file, denunciaId) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("denunciaId", denunciaId);

      const response = await axios.post("/api/evidencia", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al subir archivo:", error);
      throw error;
    }
  },

  // Obtener archivos por denunciaId
  getFilesByComplaintId: async (denunciaId) => {
    try {
      const response = await axios.get(`/api/evidencia/${denunciaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener archivos de la denuncia con ID ${denunciaId}:`, error);
      throw error;
    }
  },

  // Remitir una denuncia a un departamento
  assignComplaintToDepartment: async (idDenuncia, idDepartamento) => {
    try {
      const response = await axios.put(`/denuncias/${idDenuncia}/departamento/${idDepartamento}`);
      return response.data;
    } catch (error) {
      console.error(`Error al asignar la denuncia ${idDenuncia} al departamento ${idDepartamento}:`, error);
      throw error;
    }
  },

  // Obtener denuncias por departamento
  getComplaintsByDepartment: async (idDepartamento) => {
    try {
      const response = await axios.get(`/denuncias/departamento/${idDepartamento}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener denuncias del departamento ${idDepartamento}:`, error);
      throw error;
    }
  },

  // Obtener todos los departamentos
  getAllDepartamentos: async () => {
    try {
      const response = await axios.get("/departamentos");
      return response.data;
    } catch (error) {
      console.error("Error al obtener los departamentos:", error);
      throw error;
    }
  },

  // Actualizar el estado de una denuncia
  updateComplaintStatus: async (idDenuncia, idEstado) => {
    try {
      const response = await axios.put(`/denuncias/${idDenuncia}/estado/${idEstado}`);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el estado de la denuncia con ID ${idDenuncia}:`, error);
      throw error;
    }
  },

  getEstados: async () => {
  try {
    const response = await axios.get("/estados/list");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los estados:", error);
    throw error;
  }
},

  // Obtener un estado por ID
  getEstadoById: async (id) => {
    try {
      const response = await axios.get(`/estados/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el estado con ID ${id}:`, error);
      throw error;
    }
  },
};

export default ComplaintService;