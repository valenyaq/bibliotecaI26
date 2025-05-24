import axios from 'axios';

// Usar URL relativa en producción o la URL de desarrollo local
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

// Crear instancia de axios con URL base
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Para depuración - imprimir información sobre la solicitud
    console.log(`Solicitud a ${config.url} - Token: ${token ? 'Presente' : 'Ausente'}`);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Asegurarse de no sobrescribir el Content-Type para FormData
      if (config.headers['Content-Type'] === 'multipart/form-data') {
        console.log('Solicitud con FormData - manteniendo Content-Type como multipart/form-data');
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Error en interceptor de solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Error de respuesta:', error.response.status, error.response.data);
      
      // Si recibimos un 401 (no autorizado), podría ser que el token expiró
      if (error.response.status === 401) {
        console.log('Error de autenticación - token inválido o expirado');
      }
    } else if (error.request) {
      console.error('Error de solicitud (sin respuesta):', error.request);
    } else {
      console.error('Error al configurar la solicitud:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 