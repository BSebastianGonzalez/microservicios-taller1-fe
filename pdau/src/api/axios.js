import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos de timeout
});

// Interceptor para agregar el token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {

    // No adjuntar Authorization en endpoints de autenticación (login/reset)
    const requestPath = config.url || '';
    const authPathsToSkip = ['/auth/login'];
    const isAuthEndpoint = authPathsToSkip.some(p => requestPath.includes(p));

    if (!isAuthEndpoint) {
      // Obtener token del localStorage y adjuntarlo solo si existe
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
  (error) => {
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    
    // Manejar errores específicos
    if (error.response?.status === 401) {
      console.log('🔐 Token inválido o expirado, redirigiendo a login...');
      localStorage.removeItem('admin');
      // Opcional: redirigir al login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;