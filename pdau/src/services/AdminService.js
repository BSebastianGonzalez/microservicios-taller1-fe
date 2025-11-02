// src/services/AdminService.js
import axios from "../api/axios";

const AdminService = {
  // Iniciar sesión
  login: async (correo, contrasenia) => {
    try {
      const response = await axios.post("/auth/login", { correo, contrasenia });
      
      if (response.data.token) {
        localStorage.setItem("admin", JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error.response?.data || error;
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem("admin");
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const admin = localStorage.getItem("admin");
    return !!admin;
  },

  getCurrentAdmin: () => {
    try {
      const stored = localStorage.getItem('admin');
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },
  // Obtener todos los administradores
  getAllAdmins: async () => {
    try {
      const response = await axios.get("/admins/list");
      return response.data;
    } catch (error) {
      console.error("Error al obtener la lista de administradores:", error);
      throw error.response?.data || error;
    }
  },

  getAdminById: async (id) => {
    try {
      const { data } = await axios.get(`/api/admin/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || { message: "Error obteniendo administrador" };
    }
  },

  // Crear un nuevo administrador
  createAdmin: async (admin) => {
    try {
      const response = await axios.post("/admins", admin);
      return response.data;
    } catch (error) {
      console.error("Error al crear un nuevo administrador:", error);
      throw error.response?.data || error;
    }
  },

  // Actualizar un administrador existente
  updateAdmin: async (id, adminDetails) => {
    try {
      const response = await axios.put(`/api/admin/${id}`, adminDetails);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el administrador con ID ${id}:`, error);
      throw error.response?.data || error;
    }
  },


  

  // Eliminar un administrador
  deleteAdmin: async (id) => {
    try {
      const response = await axios.delete(`/admins/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el administrador con ID ${id}:`, error);
      throw error.response?.data || error;
    }
  },
  
  // Solicitar restablecimiento de contraseña (envía correo con token)
  requestPasswordReset: async (correo) => {
    try {
      const response = await axios.post('/auth/forgot-password', { correo });
      return { message: response.data };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Confirmar / resetear contraseña con token
  resetPassword: async (token, nuevaContrasenia) => {
    try {
      const response = await axios.post('/auth/reset-password', { token, newPassword: nuevaContrasenia });
      return { message: response.data };
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Cambiar contraseña del usuario autenticado
  changePassword: async (nuevaContrasenia) => {
    // El backend expone PUT /api/admin/{id} para actualizar los datos,
    // incluyendo la contraseña (campo 'contrasenia').
    try {
      const current = AdminService.getCurrentAdmin();
      const idCandidate = current?.id || current?._id || current?.admin?.id || current?.user?.id;
      const id = Number(idCandidate);
      if (!Number.isFinite(id)) {
        throw new Error('ID del admin no encontrado en localStorage');
      }

      const res = await axios.put(`/api/admin/${id}`, { contrasenia: nuevaContrasenia });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default AdminService;
