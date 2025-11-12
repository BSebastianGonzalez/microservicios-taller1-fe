import axios from "../api/axios";

const ComplaintService = {
  
  getAllComplaints: async () => {
    try {
      const response = await axios.get("/api/denuncias/list");
      return response.data;
    } catch (error) {
      console.error("Error al obtener las denuncias:", error);
      throw error;
    }
  },

  getComplaintById: async (id) => {
    try {
      const response = await axios.get(`/api/denuncias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la denuncia con ID ${id}:`, error);
      throw error;
    }
  },

  getComplaintByToken: async (token) => {
    try {
      const response = await axios.get(`/api/denuncias/token/${token}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la denuncia con el token ${token}:`, error);
      throw error;
    }
  },

  createComplaint: async (complaintData) => {
    try {
      const response = await axios.post("/api/denuncias", complaintData);
      return response.data;
    } catch (error) {
      console.error("Error al crear la denuncia:", error);
      throw error;
    }
  },

  updateComplaint: async (id, complaintData) => {
    try {
      console.warn("Endpoint PUT para denuncias no implementado en el backend");
      throw new Error("Actualización de denuncia no implementada");
    } catch (error) {
      console.error(`Error al actualizar la denuncia con ID ${id}:`, error);
      throw error;
    }
  },

  deleteComplaint: async (id) => {
    try {
      await axios.delete(`/api/denuncias/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la denuncia con ID ${id}:`, error);
      throw error;
    }
  },

  getComplaintsByCategory: async (categoryId) => {
    try {
      const allComplaints = await ComplaintService.getAllComplaints();
      return allComplaints.filter(complaint => 
        complaint.categorias?.some(cat => cat.id === categoryId)
      );
    } catch (error) {
      console.error(`Error al obtener denuncias de la categoría con ID ${categoryId}:`, error);
      throw error;
    }
  },

  getAllCategories: async () => {
    try {
      const response = await axios.get("/api/categorias/list");
      return response.data;
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      throw error;
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`/api/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la categoría con ID ${id}:`, error);
      throw error;
    }
  },

  getArchivedComplaints: async () => {
    try {
      const response = await axios.get("/api/denuncias/archivadas");
      const data = response.data;
      
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.data)) return data.data;
      
      return [];
    } catch (error) {
      if (error.response?.status === 204) return [];
      console.error("Error al obtener denuncias archivadas:", error);
      throw error;
    }
  },

  getArchivingHistory: async (complaintId) => {
    try {
      const response = await axios.get(`/api/archivar/denuncia/${complaintId}`);
      return response.data ? [response.data] : [];
    } catch (error) {
      if (error.response?.status === 404) return [];
      console.error(`Error al obtener historial de archivamiento ${complaintId}:`, error);
      return [];
    }
  },

  getUnarchivedComplaints: async () => {
    try {
      const response = await axios.get("/api/denuncias/no-archivadas");
      const data = response.data;

      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.data)) return data.data;

      return [];
    } catch (error) {
      if (error.response?.status === 204) return [];
      console.error("Error al obtener las denuncias no archivadas:", error);
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

  getFilesByComplaintId: async (denunciaId) => {
    try {
      const response = await axios.get(`/api/evidencia/${denunciaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener archivos de la denuncia con ID ${denunciaId}:`, error);
      throw error;
    }
  },

  updateComplaintStatus: async (idDenuncia) => {
    try {
      console.warn("Actualización de estado no implementada en el backend");
      throw new Error("Actualización de estado no implementada");
    } catch (error) {
      console.error(`Error al actualizar el estado de la denuncia con ID ${idDenuncia}:`, error);
      throw error;
    }
  },

  getEstados: async () => {
    try {
      const response = await axios.get("/api/estados/list");
      return response.data;
    } catch (error) {
      console.error("Error al obtener los estados:", error);
      throw error;
    }
  },

  getEstadoById: async (id) => {
    try {
      const response = await axios.get(`/api/estados/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el estado con ID ${id}:`, error);
      throw error;
    }
  },
};

export default ComplaintService;