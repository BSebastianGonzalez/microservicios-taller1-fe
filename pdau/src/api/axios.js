import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://microservicios-taller1-be-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos de timeout
});

// Interceptor para logging de requests
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('🚀 Enviando request:', config.method?.toUpperCase(), config.url);
    console.log('📦 Data:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para logging de responses
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta recibida:', response.status, response.config.url);
    console.log('📥 Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error en response:', error.response?.status, error.config?.url);
    console.error('📥 Error data:', error.response?.data);
    console.error('🔍 Error completo:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;