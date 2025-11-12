// FileComplaintService.js - CORREGIDO con mejor debug
import axios from "../api/axios";

const MANAGEMENT_URL = import.meta.env.VITE_RESPUESTAS_API_URL || '';

const FileComplaintService = {
  archiveComplaint: async (id, justification, adminId) => {
    try {
      console.log('📥 Archivando denuncia:', { id, justification, adminId });
      
      const params = new URLSearchParams();
      params.append('denunciaId', id);
      params.append('adminId', adminId);
      params.append('justificacion', justification);
      
      const url = `${MANAGEMENT_URL}/api/archivar?${params.toString()}`;
      console.log('📤 URL completa de archivado:', url);
      
      const response = await axios.post(url);
      console.log('✅ Respuesta de archivado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al archivar:', error);
      console.error('Detalles:', error.response?.data);
      throw error;
    }
  },

  getArchivingHistory: async (complaintId) => {
    try {
      const response = await axios.get(`${MANAGEMENT_URL}/api/archivar/denuncia/${complaintId}`);
      return response.data ? [response.data] : [];
    } catch (error) {
      if (error.response?.status === 404) return [];
      console.error(`Error al obtener historial de archivamiento ${complaintId}:`, error);
      return [];
    }
  },

  getArchivedComplaintById: async (complaintId) => {
    try {
      const response = await axios.get(`/api/denuncias/${complaintId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener denuncia archivada ${complaintId}:`, error);
      throw error;
    }
  },

  getAllArchivingRecords: async () => {
    try {
      const response = await axios.get(`${MANAGEMENT_URL}/api/archivar`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener registros de archivamiento:', error);
      return [];
    }
  },

  unarchiveComplaint: async (complaintId, justification, adminId) => {
    try {
      console.log('🔓 Iniciando desarchivado:', { 
        complaintId, 
        justification, 
        adminId,
        managementUrl: MANAGEMENT_URL 
      });
      
      const params = new URLSearchParams();
      params.append('adminId', adminId);
      params.append('motivo', justification);
      
      const url = `${MANAGEMENT_URL}/api/archivar/${complaintId}/desarchivar?${params.toString()}`;
      console.log('📤 URL completa de desarchivado:', url);
      console.log('📋 Parámetros:', { adminId, motivo: justification });
      
      const response = await axios.put(url);
      
      console.log('✅ Respuesta de desarchivado:', response.data);
      console.log('✅ Status:', response.status);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error completo al desarchivar:', error);
      console.error('❌ Response error:', error.response);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Data:', error.response?.data);
      console.error('❌ Headers:', error.response?.headers);
      
      // Mensaje de error más descriptivo
      let errorMessage = 'Error desconocido al desarchivar';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'No se encontró el registro de archivamiento';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || error.response.data || 'Datos inválidos';
        } else if (error.response.status === 500) {
          errorMessage = 'Error del servidor al desarchivar';
        } else {
          errorMessage = error.response.data?.message || error.response.data || `Error ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'No se recibió respuesta del servidor';
      } else {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }
};

export default FileComplaintService;