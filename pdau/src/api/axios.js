// src/api/axios.js
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
    console.log('🚀 Enviando request:', config.method?.toUpperCase(), config.url);
    console.log('📦 Data:', config.data);
    
    // Obtener token del localStorage
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        if (admin.token) {
          config.headers.Authorization = `Bearer ${admin.token}`;
          console.log('🔐 Token agregado a la request');
        }
      } catch (error) {
        console.error('❌ Error parseando admin data:', error);
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
    console.log('✅ Respuesta recibida:', response.status, response.config.url);
    console.log('📥 Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error en response:', error.response?.status, error.config?.url);
    console.error('📥 Error data:', error.response?.data);
    
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