import axios from "axios";

// URL específica para autenticación
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'https://pdauauthentication-microservice-production.up.railway.app';

// Crear instancia específica para autenticación
const authAxios = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptor para auth (similar al axios principal)
authAxios.interceptors.request.use(
  (config) => {
    const requestPath = config.url || '';
    const authPathsToSkip = ['/auth/login', '/auth/forgot-password', '/auth/reset-password'];
    const isAuthEndpoint = authPathsToSkip.some(p => requestPath.includes(p));

    if (!isAuthEndpoint) {
      const adminData = localStorage.getItem('admin');
      if (adminData) {
        try {
          const admin = JSON.parse(adminData);
          if (admin && admin.token) {
            config.headers.Authorization = `Bearer ${admin.token}`;
          }
        } catch (error) {
          console.error('❌ Error parseando admin data:', error);
        }
      }
    }  
    return config;
  },
  (error) => Promise.reject(error)
);

const AdminService = {
  // Iniciar sesión - usa el microservicio de autenticación
  login: async (correo, contrasenia) => {
    try {
      const response = await authAxios.post("/auth/login", { correo, contrasenia });
      
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

  // Obtener todos los administradores - usa el microservicio de autenticación
  getAllAdmins: async () => {
    try {
      const response = await authAxios.get("/admins/list");
      return response.data;
    } catch (error) {
      console.error("Error al obtener la lista de administradores:", error);
      throw error.response?.data || error;
    }
  },

  getAdminById: async (id) => {
    try {
      const { data } = await authAxios.get(`/api/admin/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || { message: "Error obteniendo administrador" };
    }
  },

  // Crear un nuevo administrador - usa el microservicio de autenticación
  createAdmin: async (admin) => {
    try {
      const response = await authAxios.post("/admins", admin);
      return response.data;
    } catch (error) {
      console.error("Error al crear un nuevo administrador:", error);
      throw error.response?.data || error;
    }
  },

  // Actualizar un administrador existente - usa el microservicio de autenticación
  updateAdmin: async (id, adminDetails) => {
    try {
      const response = await authAxios.put(`/api/admin/${id}`, adminDetails);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el administrador con ID ${id}:`, error);
      throw error.response?.data || error;
    }
  },

  // Eliminar un administrador - usa el microservicio de autenticación
  deleteAdmin: async (id) => {
    try {
      const response = await authAxios.delete(`/admins/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el administrador con ID ${id}:`, error);
      throw error.response?.data || error;
    }
  },
  
  // Solicitar restablecimiento de contraseña - usa el microservicio de autenticación
  requestPasswordReset: async (correo) => {
    try {
      const response = await authAxios.post('/auth/forgot-password', { correo });
      return { message: response.data };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Confirmar / resetear contraseña con token - usa el microservicio de autenticación
  resetPassword: async (token, nuevaContrasenia) => {
    try {
      const response = await authAxios.post('/auth/reset-password', { token, newPassword: nuevaContrasenia });
      return { message: response.data };
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Cambiar contraseña del usuario autenticado - usa el microservicio de autenticación
  changePassword: async (nuevaContrasenia) => {
    try {
      const current = AdminService.getCurrentAdmin();
      const idCandidate = current?.id || current?._id || current?.admin?.id || current?.user?.id;
      const id = Number(idCandidate);
      if (!Number.isFinite(id)) {
        throw new Error('ID del admin no encontrado en localStorage');
      }

      const res = await authAxios.put(`/api/admin/${id}`, { contrasenia: nuevaContrasenia });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default AdminService;