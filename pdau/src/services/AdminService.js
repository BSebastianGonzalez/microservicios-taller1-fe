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

  getCurrentAdmin: async () => {
    try {
      const storedData = localStorage.getItem('admin');
      if (!storedData) {
        console.log('❌ No hay datos de admin en localStorage');
        return null;
      }
      
      const adminData = JSON.parse(storedData);
      console.log('📋 Datos almacenados en localStorage:', adminData);
      
      // Verificar si ya tenemos el ID del admin
      let adminId = null;
      
      // Buscar el ID en diferentes posibles ubicaciones
      if (adminData.admin && adminData.admin.id) {
        adminId = adminData.admin.id;
      } else if (adminData.id) {
        adminId = adminData.id;
      } else if (adminData.user && adminData.user.id) {
        adminId = adminData.user.id;
      }
      
      console.log('🆔 ID del admin encontrado:', adminId);
      
      // Si tenemos ID, obtener datos completos usando el endpoint /admin/{id}
      if (adminId) {
        try {
          console.log('🔄 Obteniendo datos completos del admin ID:', adminId);
          const completeAdmin = await AdminService.getAdminById(adminId);
          
          // Actualizar localStorage con los datos completos
          const updatedData = {
            ...adminData,
            admin: completeAdmin
          };
          localStorage.setItem('admin', JSON.stringify(updatedData));
          console.log('✅ Datos completos guardados en localStorage');
          
          return updatedData;
        } catch (error) {
          console.error('❌ Error obteniendo datos completos:', error);
          // Si falla, retornar los datos que ya tenemos
          return adminData;
        }
      }
      
      // Si no tenemos ID, retornar lo que tenemos
      console.log('⚠️ No se pudo obtener ID del admin, retornando datos básicos');
      return adminData;
      
    } catch (error) {
      console.error('❌ Error obteniendo admin actual:', error);
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
      console.log(`📡 Obteniendo admin con ID: ${id}`);
      const response = await axiosInstance.get(`/api/admin/${id}`);
      console.log('✅ Datos completos del admin:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al obtener admin ${id}:`, error);
      throw error.response?.data || { message: 'Error obteniendo administrador' };
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
      const response = await axios.put(`/admins/${id}`, adminDetails);
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
};

export default AdminService;
