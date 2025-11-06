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
      console.log("Respuesta de la API:", response.data);
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

  // Actualizar una denuncia existente - CORREGIDO: Tu backend no tiene este endpoint
  updateComplaint: async (id, complaintData) => {
    try {
      // Nota: Tu backend Spring Boot no tiene endpoint PUT para denuncias
      console.warn("Endpoint PUT para denuncias no implementado en el backend");
      throw new Error("Actualización de denuncia no implementada");
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

  // Obtener denuncias por categoría - CORREGIDO: Tu backend no tiene este endpoint
  getComplaintsByCategory: async (categoryId) => {
    try {
      // Nota: Tu backend no tiene este endpoint específico
      console.warn("Endpoint para denuncias por categoría no implementado");
      const allComplaints = await ComplaintService.getAllComplaints();
      return allComplaints.filter(complaint => 
        complaint.categorias?.some(cat => cat.id === categoryId)
      );
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

  // Obtener denuncias archivadas - CORREGIDO: Tu backend no tiene estos endpoints
  getArchivedComplaints: async () => {
    try {
      // Nota: Tu backend no tiene endpoints específicos para archivados
      console.warn("Endpoint para denuncias archivadas no implementado");
      const allComplaints = await ComplaintService.getAllComplaints();
      // Filtrar por estado "Archivada" si existe en tu modelo
      return allComplaints.filter(complaint => 
        complaint.estado?.nombre?.toLowerCase().includes('archivada')
      );
    } catch (error) {
      console.error("Error al obtener las denuncias archivadas:", error);
      throw error;
    }
  },

  // Obtener denuncias no archivadas - CORREGIDO
  getUnarchivedComplaints: async () => {
    try {
      // Nota: Tu backend no tiene endpoints específicos para no archivados
      console.warn("Endpoint para denuncias no archivadas no implementado");
      const allComplaints = await ComplaintService.getAllComplaints();
      // Filtrar excluyendo estado "Archivada"
      return allComplaints.filter(complaint => 
        !complaint.estado?.nombre?.toLowerCase().includes('archivada')
      );
    } catch (error) {
      console.error("Error al obtener las denuncias no archivadas:", error);
      throw error;
    }
  },

  // Alternar el estado de archivado - CORREGIDO: No implementado
  toggleArchivedStatus: async (id) => {
    try {
      console.warn("Toggle de estado archivado no implementado en el backend");
      throw new Error("Toggle de estado archivado no implementado");
    } catch (error) {
      console.error(`Error al alternar el estado de archivado de la denuncia con ID ${id}:`, error);
      throw error;
    }
  },

  // Subir archivo
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

  // Remitir una denuncia a un departamento - CORREGIDO: No implementado
  assignComplaintToDepartment: async (idDenuncia, idDepartamento) => {
    try {
      console.warn("Asignación a departamento no implementada en el backend");
      throw new Error("Asignación a departamento no implementada");
    } catch (error) {
      console.error(`Error al asignar la denuncia ${idDenuncia} al departamento ${idDepartamento}:`, error);
      throw error;
    }
  },

  // Obtener denuncias por departamento - CORREGIDO: No implementado
  getComplaintsByDepartment: async (idDepartamento) => {
    try {
      console.warn("Endpoint para denuncias por departamento no implementado");
      const allComplaints = await ComplaintService.getAllComplaints();
      return allComplaints.filter(complaint => 
        complaint.departamento?.id === idDepartamento
      );
    } catch (error) {
      console.error(`Error al obtener denuncias del departamento ${idDepartamento}:`, error);
      throw error;
    }
  },

  // Obtener todos los departamentos - CORREGIDO: No implementado en tu backend
  getAllDepartamentos: async () => {
    try {
      console.warn("Endpoint para departamentos no implementado en el backend");
      // Retornar array vacío ya que tu backend no tiene departamentos
      return [];
    } catch (error) {
      console.error("Error al obtener los departamentos:", error);
      throw error;
    }
  },

  // Actualizar el estado de una denuncia - CORREGIDO: No implementado
  updateComplaintStatus: async (idDenuncia, idEstado) => {
    try {
      console.warn("Actualización de estado no implementada en el backend");
      throw new Error("Actualización de estado no implementada");
    } catch (error) {
      console.error(`Error al actualizar el estado de la denuncia con ID ${idDenuncia}:`, error);
      throw error;
    }
  },

  // Obtener todos los estados
  getEstados: async () => {
    try {
      const response = await axios.get("/api/estados/list");
      return response.data;
    } catch (error) {
      console.error("Error al obtener los estados:", error);
      throw error;
    }
  },

  // Obtener un estado por ID
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