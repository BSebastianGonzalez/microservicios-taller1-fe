import axios from "axios";

// URL específica para autenticación
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;

// Crear instancia específica para autenticación
const authAxios = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptor para auth
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
  // Iniciar sesión
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

  logout: () => {
    localStorage.removeItem("admin");
  },

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

  createAdmin: async (admin) => {
    try {
      const response = await authAxios.post("/admins", admin);
      return response.data;
    } catch (error) {
      console.error("Error al crear un nuevo administrador:", error);
      throw error.response?.data || error;
    }
  },

  updateAdmin: async (id, adminDetails) => {
    try {
      const response = await authAxios.put(`/api/admin/${id}`, adminDetails);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el administrador con ID ${id}:`, error);
      throw error.response?.data || error;
    }
  },

  deleteAdmin: async (id) => {
    try {
      const response = await authAxios.delete(`/admins/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el administrador con ID ${id}:`, error);
      throw error.response?.data || error;
    }
  },
  
  requestPasswordReset: async (correo) => {
    try {
      const response = await authAxios.post('/auth/forgot-password', { correo });
      return { message: response.data };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  resetPassword: async (token, nuevaContrasenia) => {
    try {
      const response = await authAxios.post('/auth/reset-password', { token, newPassword: nuevaContrasenia });
      return { message: response.data };
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
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

  // ========== MÉTODOS DE DOCUMENTOS ==========

  // ✅ MODIFICADO: Obtener documentos del administrador actual
  getMisDocumentos: async () => {
  try {
    const admin = AdminService.getCurrentAdmin();
    if (!admin || !admin.id) {
      console.log('⚠️ No hay admin logueado');
      return [];
    }

    // Primero intenta cargar desde localStorage
    const key = `documentos_admin_${admin.id}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const documentos = JSON.parse(stored);
      const documentosArray = Object.values(documentos);
      console.log(`📦 ${documentosArray.length} documentos cargados desde localStorage`);
      return documentosArray;
    }

    console.log('ℹ️ No hay documentos en localStorage, intentando cargar del servidor...');
    
    // Si no hay en localStorage, intenta del servidor pero maneja CORS
    try {
      const tiposDocumento = ['IDENTIDAD', 'CONTRATO', 'CONFIDENCIALIDAD', 'PERMISOS'];
      const documentosPromises = tiposDocumento.map(async (tipo) => {
        try {
          // Usa HEAD para verificar existencia sin descargar el archivo completo
          await authAxios.head(`/api/admin/${admin.id}/documento`, {
            params: { tipo }
          });
          return { tipo, existe: true };
        } catch (error) {
          if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
            console.warn(`⚠️ CORS error para ${tipo}, omitiendo servidor`);
            return { tipo, existe: false };
          }
          return { tipo, existe: false };
        }
      });

      const resultados = await Promise.all(documentosPromises);
      const documentosExistentes = resultados.filter(r => r.existe);
      
      console.log(`✅ ${documentosExistentes.length} documentos encontrados en servidor`);
      return documentosExistentes.map(doc => ({ tipo: doc.tipo }));

    } catch (e) {
      console.warn('❌ Error al conectar con servidor, usando solo localStorage');
      return [];
    }

  } catch (error) {
    console.error("Error al obtener documentos:", error);
    return [];
  }
},

  // Subir documento
  subirDocumento: async (file, tipoDocumento) => {
    try {
      const admin = AdminService.getCurrentAdmin();
      if (!admin || !admin.id) {
        throw new Error('No se pudo obtener la información del administrador');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipo', tipoDocumento);

      console.log('📤 Enviando documento:', {
        adminId: admin.id,
        tipoDocumento: tipoDocumento,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const response = await authAxios.post(
        `/api/admin/${admin.id}/documento`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        }
      );

      console.log('✅ Documento subido exitosamente:', response.data);
      return response.data;

    } catch (error) {
      console.error("❌ Error al subir documento:", error);
      
      let errorMessage = "Error al subir el documento";
      
      if (error.response) {
        console.error('📨 Respuesta del servidor:', error.response.data);
        console.error('🔧 Status:', error.response.status);
        
        if (error.response.data && typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = "Solicitud incorrecta. Verifique los datos del documento.";
        } else if (error.response.status === 413) {
          errorMessage = "El archivo es demasiado grande. Tamaño máximo: 2MB";
        }
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor";
      } else {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Actualizar documento existente
  actualizarDocumento: async (file, tipoDocumento) => {
    try {
      const admin = AdminService.getCurrentAdmin();
      if (!admin || !admin.id) {
        throw new Error('No se pudo obtener la información del administrador');
      }

      const formData = new FormData();
      formData.append('file', file);

      console.log('🔄 Actualizando documento:', {
        adminId: admin.id,
        tipoDocumento: tipoDocumento,
        fileName: file.name,
        fileSize: file.size
      });

      const response = await authAxios.put(
        `/api/admin/${admin.id}/documento`,
        formData,
        {
          params: { tipo: tipoDocumento },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000,
        }
      );

      console.log('✅ Documento actualizado exitosamente:', response.data);
      return response.data;

    } catch (error) {
      console.error("❌ Error al actualizar documento:", error);
      
      let errorMessage = "Error al actualizar el documento";
      
      if (error.response) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor";
      } else {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Descargar documento
  descargarDocumento: async (tipoDocumento) => {
    try {
      const admin = AdminService.getCurrentAdmin();
      if (!admin || !admin.id) {
        throw new Error('No se pudo obtener la información del administrador');
      }

      const response = await authAxios.get(
        `/api/admin/${admin.id}/documento`,
        {
          params: { tipo: tipoDocumento },
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      
      return {
        url,
        filename: response.headers['content-disposition'] 
          ? response.headers['content-disposition'].split('filename=')[1]?.replace(/"/g, '')
          : `documento_${tipoDocumento}.pdf`
      };
    } catch (error) {
      console.error("Error al descargar documento:", error);
      throw error.response?.data || error;
    }
  },

  // Eliminar documento
  eliminarDocumento: async (tipoDocumento) => {
    try {
      const admin = AdminService.getCurrentAdmin();
      if (!admin || !admin.id) {
        throw new Error('No se pudo obtener la información del administrador');
      }

      console.log('🗑️ Eliminando documento:', {
        adminId: admin.id,
        tipoDocumento: tipoDocumento
      });

      const response = await authAxios.delete(
        `/api/admin/${admin.id}/documento`,
        {
          params: { tipo: tipoDocumento }
        }
      );

      console.log('✅ Documento eliminado exitosamente');
      return response.data;

    } catch (error) {
      console.error("❌ Error al eliminar documento:", error);
      
      let errorMessage = "Error al eliminar el documento";
      
      if (error.response) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor";
      } else {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }
};

export default AdminService;